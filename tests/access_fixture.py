"""Disposable offline identity/PostgreSQL fixtures; never use a hosted database."""
import json
import os
from pathlib import Path
import time
from unittest.mock import patch
from cryptography.hazmat.primitives.asymmetric import rsa
import jwt
import psycopg
from psycopg.conninfo import conninfo_to_dict
import paid_access

TEST_DSN=os.getenv('TEST_DATABASE_URL','postgresql://fixture:fixture@127.0.0.1:55432/fixture')

def test_connection(_dsn=None):
    details=conninfo_to_dict(TEST_DSN)
    if details.get('dbname') != 'fixture' or details.get('host') not in {'127.0.0.1','localhost','postgres'}:
        raise RuntimeError('Tests require the disposable local/CI fixture database, never production')
    return psycopg.connect(TEST_DSN,connect_timeout=3,options='-c statement_timeout=2000 -c lock_timeout=1000')

class PaidFixture:
    def __init__(self, overrides=None):
        self.key=rsa.generate_private_key(public_exponent=65537,key_size=2048)
        jwk=json.loads(jwt.algorithms.RSAAlgorithm.to_jwk(self.key.public_key()))
        jwk.update(kid='offline-fixture',alg='RS256',use='sig')
        self.policy=dict(valid_until=int(time.time())+3600,global_requests_day=100,principal_requests_day=100,
            global_tokens_day=100_000_000,principal_tokens_day=20_000_000,
            global_cost_micro_day=100_000_000,principal_cost_micro_day=20_000_000,
            global_requests_minute=60,principal_requests_minute=20,
            global_inflight=4,principal_inflight=2,deadline_seconds=20,
            models={'gemini-3.8-flash':dict(output_tokens=2048,requests_day=100,input_micro_per_token=1,output_micro_per_token=16)})
        self.policy.update(overrides or {})
        self.env=dict(PAID_AI_ENABLED='1',PAID_AI_ISSUER='https://identity.offline.invalid',
            PAID_AI_AUDIENCE='offline-svg',PAID_AI_SUBJECTS=json.dumps(['alice','bob']),
            PAID_AI_JWKS=json.dumps({'keys':[jwk]}),PAID_AI_IDENTITY_HEADER='authorization',
            PAID_AI_DATABASE_URL='postgresql://unused@offline.invalid/fixture?sslmode=verify-full',
            PAID_AI_POLICY=json.dumps(self.policy))
    def __enter__(self):
        self.environ=patch.dict(os.environ,self.env);self.environ.start()
        self.connection=patch.object(paid_access,'connect_db',side_effect=test_connection);self.connection.start()
        self.config=paid_access.settings()
        with test_connection() as conn:
            if not conn.execute("SELECT to_regclass('paid_ai_guard')").fetchone()[0]:
                conn.execute((Path(__file__).resolve().parents[1]/'sql/paid_admission.sql').read_text())
            conn.execute('TRUNCATE paid_ai_guard,paid_ai_budget,paid_ai_admission')
            conn.execute('INSERT INTO paid_ai_guard VALUES (1,%s)',(self.config.fingerprint,))
        return self
    def __exit__(self,*_args):
        self.connection.stop();self.environ.stop()
    def token(self,subject='alice',**changes):
        claims=dict(iss=self.config.issuer,aud=self.config.audience,sub=subject,iat=int(time.time()),exp=int(time.time())+300)
        claims.update(changes)
        return jwt.encode(claims,self.key,algorithm='RS256',headers={'kid':'offline-fixture'})
    def client(self):
        import app
        client=app.app.test_client();client.environ_base['HTTP_AUTHORIZATION']='Bearer '+self.token()
        return client
