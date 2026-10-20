"""Verified existing OIDC identity and fail-closed PostgreSQL paid admission.

No login, identity enrollment, schema creation or production resource provisioning.
"""
from dataclasses import dataclass
import hashlib
import json
import os
from time import monotonic, time as wall_time
from urllib.parse import urlparse
import uuid

import jwt
import psycopg
from psycopg.conninfo import conninfo_to_dict

PAID_ROUTES = {'/generate', '/analyze_image', '/convert_to_svg', '/refine_svg'}
# Reserve a full documented input context per call, not an unverified estimate of
# image/text tokens. No refund based on provider-reported or missing usage.
INPUT_RESERVE = {'gemini-3.8-flash': 1_048_576, 'gemini-3.5-flash-lite': 1_048_576}
OUTPUT_RESERVE = 65_536  # Full published output/thinking envelope, even with a lower SDK cap.

class Denied(Exception):
    def __init__(self, status, message):
        super().__init__(message)
        self.status = status

@dataclass(frozen=True)
class Settings:
    issuer: str
    audience: str
    subjects: tuple
    keys: dict
    header: str
    dsn: str
    policy: dict
    fingerprint: str


def settings():
    try:
        if os.getenv('PAID_AI_ENABLED') != '1':
            raise ValueError()
        issuer = os.environ['PAID_AI_ISSUER']
        audience = os.environ['PAID_AI_AUDIENCE']
        subjects = json.loads(os.environ['PAID_AI_SUBJECTS'])
        keys = json.loads(os.environ['PAID_AI_JWKS'])
        header = os.environ['PAID_AI_IDENTITY_HEADER'].lower()
        dsn = os.environ['PAID_AI_DATABASE_URL']
        policy = json.loads(os.environ['PAID_AI_POLICY'])
        if urlparse(issuer).scheme != 'https' or not urlparse(issuer).netloc or not audience:
            raise ValueError()
        if header not in {'authorization', 'cf-access-jwt-assertion'}:
            raise ValueError()
        if not isinstance(subjects,list) or not subjects or any(not isinstance(s,str) or not s for s in subjects):
            raise ValueError()
        if not isinstance(keys,dict) or not keys.get('keys'):
            raise ValueError()
        kids = set()
        for key in keys['keys']:
            if key.get('kty') != 'RSA' or key.get('alg','RS256') != 'RS256' or key.get('use','sig') != 'sig' or not key.get('kid') or key['kid'] in kids or 'd' in key:
                raise ValueError()
            if jwt.PyJWK.from_dict(key, algorithm='RS256').key.key_size < 2048:
                raise ValueError()
            kids.add(key['kid'])
        if conninfo_to_dict(dsn).get('sslmode') != 'verify-full':
            raise ValueError()
        if type(policy.get('valid_until')) is not int or not wall_time() < policy['valid_until'] <= wall_time()+86400:
            raise ValueError()
        bounds = {'global_requests_day':1000, 'principal_requests_day':100,
                  'global_tokens_day':100_000_000,'principal_tokens_day':20_000_000,
                  'global_cost_micro_day':100_000_000,'principal_cost_micro_day':20_000_000,
                  'global_requests_minute':60,'principal_requests_minute':20,
                  'global_inflight':4,'principal_inflight':2,'deadline_seconds':20}
        for name, maximum in bounds.items():
            if type(policy.get(name)) is not int or not 1 <= policy[name] <= maximum:
                raise ValueError()
        if not isinstance(policy.get('models'),dict) or not policy['models'] or not set(policy['models']).issubset(INPUT_RESERVE):
            raise ValueError()
        for model in policy['models'].values():
            for name, maximum in {'output_tokens':8192,'requests_day':1000,'input_micro_per_token':1000,'output_micro_per_token':1000}.items():
                if type(model.get(name)) is not int or not 1 <= model[name] <= maximum:
                    raise ValueError()
        public = dict(issuer=issuer,audience=audience,subjects=subjects,keys=keys,header=header,policy=policy)
        fingerprint=hashlib.sha256(json.dumps(public,sort_keys=True,separators=(',',':')).encode()).hexdigest()
        return Settings(issuer,audience,tuple(subjects),keys,header,dsn,policy,fingerprint)
    except (KeyError, ValueError, TypeError, jwt.PyJWTError, AttributeError, psycopg.Error):
        raise Denied(503,'Paid AI is disabled or incompletely configured. The public editor and local exports remain available.') from None


def identity(config, headers):
    token = headers.get(config.header,'')
    if config.header == 'authorization':
        if not token.startswith('Bearer '):
            raise Denied(401,'Sign in through the configured existing identity gateway to use paid AI.')
        token = token[7:]
    if not token or len(token) > 16384:
        raise Denied(401,'A valid signed identity assertion is required.')
    try:
        header = jwt.get_unverified_header(token)
        if header.get('alg') != 'RS256' or not isinstance(header.get('kid'),str):
            raise ValueError()
        key = next(key for key in config.keys['keys'] if key['kid'] == header['kid'])
        claims = jwt.decode(token,jwt.PyJWK.from_dict(key,algorithm='RS256').key,
                            algorithms=['RS256'],audience=config.audience,issuer=config.issuer,
                            options={'require':['exp','iat','sub','iss','aud']},leeway=0)
        if type(claims['exp']) not in (int,float) or type(claims['iat']) not in (int,float) or not 0 < claims['exp']-claims['iat'] <= 3600:
            raise ValueError()
        if not isinstance(claims['sub'],str) or claims['sub'] not in config.subjects:
            raise Denied(403,'This verified identity is not authorized for paid AI.')
        principal=hashlib.sha256((config.issuer+'\0'+claims['sub']).encode()).hexdigest()
        return principal, claims['exp']
    except Denied:
        raise
    except (jwt.PyJWTError, ValueError, KeyError, StopIteration, TypeError, OverflowError, RecursionError):
        raise Denied(401,'The identity assertion is invalid or expired. Sign in again through the configured gateway.') from None


def connect_db(dsn):
    return psycopg.connect(dsn,connect_timeout=3,options='-c statement_timeout=2000 -c lock_timeout=1000')

class Store:
    def __init__(self, config):
        self.config=config

    def reserve(self, principal, model, expires, remaining):
        policy=self.config.policy
        if model not in policy['models']:
            raise Denied(403,'This model is not enabled by the reviewed paid policy. Choose an allowed model.')
        if remaining <= 0:
            raise Denied(504,'The request deadline expired before provider admission. Try again.')
        limits=policy['models'][model]
        tokens=INPUT_RESERVE[model]+OUTPUT_RESERVE
        cost=INPUT_RESERVE[model]*limits['input_micro_per_token']+OUTPUT_RESERVE*limits['output_micro_per_token']
        try:
            with connect_db(self.config.dsn) as conn:
                row=conn.execute('SELECT policy_hash FROM paid_ai_guard WHERE id=1 FOR UPDATE').fetchone()
                if not row or row[0] != self.config.fingerprint:
                    raise Denied(503,'Paid policy and shared admission store are not synchronized. Contact the operator.')
                now=conn.execute('SELECT clock_timestamp()').fetchone()[0]
                deadline=min(now.timestamp()+remaining,expires)
                if deadline-now.timestamp() < 0.1:
                    raise Denied(504,'The identity or request deadline expired before admission.')
                day=int(now.timestamp())//86400
                minute=int(now.timestamp())//60
                inflight=conn.execute('SELECT count(*), count(*) FILTER (WHERE principal=%s) FROM paid_ai_admission WHERE finished_at IS NULL',(principal,)).fetchone()
                if inflight[0] >= policy['global_inflight'] or inflight[1] >= policy['principal_inflight']:
                    raise Denied(429,'Paid AI concurrency is full or an earlier outcome needs operator reconciliation. Try later.')
                buckets=[('global',day,policy['global_requests_day'],policy['global_tokens_day'],policy['global_cost_micro_day'],tokens,cost),
                         ('principal:'+principal,day,policy['principal_requests_day'],policy['principal_tokens_day'],policy['principal_cost_micro_day'],tokens,cost),
                         ('model:'+model,day,limits['requests_day'],policy['global_tokens_day'],policy['global_cost_micro_day'],tokens,cost),
                         ('minute:global',minute,policy['global_requests_minute'],0,0,0,0),
                         ('minute:'+principal,minute,policy['principal_requests_minute'],0,0,0,0)]
                for scope,period,requests,max_tokens,max_cost,charge_tokens,charge_cost in buckets:
                    conn.execute('INSERT INTO paid_ai_budget VALUES (%s,%s,0,0,0) ON CONFLICT DO NOTHING',(scope,period))
                    used=conn.execute('SELECT requests,tokens,cost_micro FROM paid_ai_budget WHERE scope=%s AND period=%s',(scope,period)).fetchone()
                    if used[0]+1>requests or used[1]+charge_tokens>max_tokens or used[2]+charge_cost>max_cost:
                        raise Denied(429,'The shared request, model, token or cost admission budget is exhausted. Try after the quota window resets.')
                    conn.execute('UPDATE paid_ai_budget SET requests=requests+1,tokens=tokens+%s,cost_micro=cost_micro+%s WHERE scope=%s AND period=%s',(charge_tokens,charge_cost,scope,period))
                admission=uuid.uuid4()
                conn.execute("INSERT INTO paid_ai_admission(id,principal,model,deadline) VALUES (%s,%s,%s,to_timestamp(%s))",(admission,principal,model,deadline))
                return admission
        except Denied:
            raise
        except psycopg.Error:
            raise Denied(503,'Shared paid admission storage is unavailable; no provider call was made.') from None

    def start(self, admission):
        try:
            with connect_db(self.config.dsn) as conn:
                guard=conn.execute('SELECT policy_hash FROM paid_ai_guard WHERE id=1 FOR UPDATE').fetchone()
                if not guard or guard[0] != self.config.fingerprint:
                    raise Denied(503,'Paid policy changed before dispatch; no provider call was made.')
                row=conn.execute("UPDATE paid_ai_admission SET started_at=clock_timestamp(),status='started' WHERE id=%s AND started_at IS NULL AND finished_at IS NULL AND deadline>clock_timestamp() RETURNING extract(epoch FROM deadline-clock_timestamp())",(admission,)).fetchone()
                if not row:
                    raise Denied(504,'The reserved request deadline expired or the admission was already used.')
                return float(row[0])
        except Denied:
            raise
        except psycopg.Error:
            raise Denied(503,'Admission could not be verified; no provider call was made.') from None

    def finish(self, admission, status, certain):
        # Uncertain provider failures/crashes never regain concurrency by time or
        # restart. An operator must reconcile them against provider records.
        try:
            with connect_db(self.config.dsn) as conn:
                conn.execute('UPDATE paid_ai_admission SET status=%s,finished_at=CASE WHEN %s THEN clock_timestamp() ELSE NULL END WHERE id=%s',(status,certain,admission))
        except psycopg.Error:
            pass  # Keep durable slot/reservation occupied on cleanup failure.


def execute(config, principal, expires, deadline, model, invoke):
    store=Store(config)
    admission=store.reserve(principal,model,expires,deadline-monotonic())
    try:
        before_start=monotonic()
        store_remaining=store.start(admission)
        now=monotonic()
        # Subtract the database round trip so response latency cannot extend it.
        remaining=min(store_remaining-(now-before_start),deadline-now)
        effective_deadline=now+remaining
        if remaining <= 0:
            store.finish(admission,'expired_before_dispatch',True)
            raise Denied(504,'The request deadline expired before provider dispatch.')
    except Denied:
        store.finish(admission,'not_dispatched',True)
        raise
    try:
        result=invoke(max(1,int(remaining*1000)),config.policy['models'][model]['output_tokens'])
    except Exception:
        store.finish(admission,'uncertain',False)
        raise
    store.finish(admission,'completed',True)
    if monotonic() >= effective_deadline:
        raise Denied(504,'Provider result arrived after the request deadline and was discarded.')
    return result

if __name__ == '__main__':
    import sys
    if sys.argv[1:] != ['fingerprint']:
        raise SystemExit('Usage: python -m paid_access fingerprint')
    print(settings().fingerprint)
