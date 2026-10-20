import dataclasses
from concurrent.futures import ThreadPoolExecutor
import json
import os
from pathlib import Path
import subprocess
import sys
import time
from types import SimpleNamespace
import unittest
from unittest.mock import patch
import jwt
import psycopg
import app
import paid_access
from access_fixture import PaidFixture, test_connection

class PaidSecurity(unittest.TestCase):
    def setUp(self):
        self.access=PaidFixture();self.access.__enter__();self.addCleanup(self.access.__exit__)
        self.key=patch.object(app,'api_key','offline-provider-key');self.key.start();self.addCleanup(self.key.stop)
        provider=patch.object(app,'generate_content',return_value=SimpleNamespace(text='<svg xmlns="http://www.w3.org/2000/svg"><rect/></svg>'))
        self.provider=provider.start();self.addCleanup(provider.stop)
    def request(self,token=None,headers=None,path='/generate'):
        return app.app.test_client().post(path,json={'prompt':'fixture'},headers=headers if headers is not None else {'Authorization':'Bearer '+(token or self.access.token())})
    def worker(self):
        return subprocess.Popen([sys.executable,'tests/admission_worker.py'],stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True,cwd=Path(__file__).resolve().parents[1])
    def feed(self,worker,access=None):
        access=access or self.access
        output,error=worker.communicate(json.dumps({'env':access.env,'token':access.token()}),timeout=15)
        self.assertEqual(worker.returncode,0,error)
        return json.loads(output)['status']
    def test_public_editor_and_fail_closed_with_provider_key(self):
        with patch.object(app,'api_key',None):
            self.assertEqual(app.app.test_client().get('/').status_code,200)
            with app.app.test_client().get('/static/script.js') as response:self.assertEqual(response.status_code,200)
        with patch.dict(os.environ,{'PAID_AI_ENABLED':'0'}):
            for path in paid_access.PAID_ROUTES:
                self.assertEqual(self.request(path=path).status_code,503)
        with patch.dict(os.environ,{'PAID_AI_DATABASE_URL':'not a DSN'}):
            self.assertEqual(self.request().status_code,503)
        with patch.dict(os.environ,{'PAID_AI_JWKS':'{}'}):
            self.assertEqual(self.request().status_code,503)
        with patch.dict(os.environ,{'PAID_AI_POLICY':json.dumps(dict(self.access.policy,valid_until=1))}):
            self.assertEqual(self.request().status_code,503)
        self.provider.assert_not_called()
    def test_unauthorized_and_spoofed_headers_all_paid_routes(self):
        for path in paid_access.PAID_ROUTES:
            for headers in [{},{'Origin':'https://trusted.example','X-User':'alice','X-Forwarded-User':'alice'},
                            {'Authorization':'Bearer forged','Cf-Access-Authenticated-User-Email':'alice'}]:
                self.assertEqual(self.request(headers=headers,path=path).status_code,401)
        self.provider.assert_not_called()
    def test_signature_issuer_audience_expiry_allowlist_and_algorithm(self):
        for changes in [{'iss':'https://attacker.invalid'},{'aud':'other'},{'exp':int(time.time())-1},{'iat':int(time.time())+20}]:
            self.assertEqual(self.request(self.access.token(**changes)).status_code,401)
        self.assertEqual(self.request(self.access.token(subject='unapproved')).status_code,403)
        forged=jwt.encode({'sub':'alice'},'offline-attacker-fixture-only-32bytes-long',algorithm='HS256',headers={'kid':'offline-fixture'})
        self.assertEqual(self.request(forged).status_code,401)
        self.provider.assert_not_called()
        cf=dataclasses.replace(self.access.config,header='cf-access-jwt-assertion')
        self.assertTrue(paid_access.identity(cf,{'cf-access-jwt-assertion':self.access.token()})[0])
    def test_model_request_token_and_cost_limits_are_atomic(self):
        for overrides in [{'global_requests_day':1},{'principal_requests_day':1},
                          {'global_tokens_day':1},{'principal_tokens_day':1},
                          {'global_cost_micro_day':1},{'principal_cost_micro_day':1},
                          {'global_requests_minute':1},{'principal_requests_minute':1}]:
            with self.subTest(overrides=overrides), PaidFixture(overrides) as access:
                first=access.client().post('/generate',json={'prompt':'fixture'})
                second=access.client().post('/generate',json={'prompt':'fixture'})
                self.assertIn(first.status_code,(200,429));self.assertEqual(second.status_code,429)
                with test_connection() as conn:
                    used=conn.execute("SELECT requests FROM paid_ai_budget WHERE scope='global'").fetchone()
                    self.assertLessEqual(used[0] if used else 0,1)
        with PaidFixture({'models':{'gemini-3.8-flash':dict(output_tokens=1024,requests_day=1,input_micro_per_token=1,output_micro_per_token=16)}}) as access:
            self.assertEqual(access.client().post('/generate',json={'prompt':'fixture'}).status_code,200)
            self.assertEqual(access.client().post('/generate',json={'prompt':'fixture'}).status_code,429)
            self.assertEqual(access.client().post('/generate',json={'prompt':'fixture','model':'gemini-3.5-flash-lite'}).status_code,403)
    def test_concurrent_threads_admit_only_global_cap(self):
        with PaidFixture({'global_requests_day':2}) as access:
            with ThreadPoolExecutor(max_workers=8) as pool:
                results=list(pool.map(lambda _:access.client().post('/generate',json={'prompt':'fixture'}).status_code,range(8)))
            self.assertEqual(results.count(200),2);self.assertEqual(results.count(429),6)
    def test_concurrent_processes_and_restart_do_not_reset_budget(self):
        with PaidFixture({'global_requests_day':1}) as access:
            old=self.access;self.access=access
            try:
                workers=[self.worker() for _ in range(3)]
                # Send all inputs before collecting, so distinct processes contend.
                payload=json.dumps({'env':access.env,'token':access.token()})
                for worker in workers:
                    worker.stdin.write(payload);worker.stdin.close();worker.stdin=None
                statuses=[]
                for worker in workers:
                    output,error=worker.communicate(timeout=15);self.assertEqual(worker.returncode,0,error);statuses.append(json.loads(output)['status'])
                self.assertEqual(statuses.count(200),1);self.assertEqual(statuses.count(429),2)
                self.assertEqual(self.feed(self.worker()),429,'fresh process after restart shares the spent budget')
            finally:self.access=old
    def test_unavailable_or_mismatched_store_never_calls_provider(self):
        with patch.object(paid_access,'connect_db',side_effect=psycopg.OperationalError()):
            self.assertEqual(self.request().status_code,503)
        with test_connection() as conn:
            conn.execute("UPDATE paid_ai_guard SET policy_hash='not-the-reviewed-policy'")
        self.assertEqual(self.request().status_code,503);self.provider.assert_not_called()
    def test_failed_provider_pins_concurrency_even_after_deadline(self):
        with PaidFixture({'global_inflight':1}) as access:
            self.provider.side_effect=RuntimeError('offline provider failure')
            self.assertEqual(access.client().post('/generate',json={'prompt':'fixture'}).status_code,500)
            with test_connection() as conn:
                conn.execute("UPDATE paid_ai_admission SET deadline=clock_timestamp()-interval '1 hour'")
                self.assertEqual(conn.execute("SELECT status,finished_at FROM paid_ai_admission").fetchone(),('uncertain',None))
            self.provider.side_effect=None
            self.assertEqual(access.client().post('/generate',json={'prompt':'fixture'}).status_code,429)
            self.assertEqual(self.feed(self.worker(),access),429,'uncertain slot survives a fresh process')
            with test_connection() as conn:
                self.assertEqual(conn.execute("SELECT requests FROM paid_ai_budget WHERE scope='global'").fetchone()[0],1)
    def test_deadline_before_dispatch_and_late_result(self):
        principal,expires=paid_access.identity(self.access.config,{'authorization':'Bearer '+self.access.token()})
        invoke=lambda timeout,output: self.provider(timeout,output)
        with self.assertRaises(paid_access.Denied) as context:
            paid_access.execute(self.access.config,principal,expires,0,'gemini-3.8-flash',invoke)
        self.assertEqual(context.exception.status,504);self.provider.assert_not_called()
        original=paid_access.Store.start
        def expired_start(store,admission):
            with test_connection() as conn:conn.execute("UPDATE paid_ai_admission SET deadline=clock_timestamp()-interval '1 second' WHERE id=%s",(admission,))
            return original(store,admission)
        with patch.object(paid_access.Store,'start',expired_start), self.assertRaises(paid_access.Denied):
            paid_access.execute(self.access.config,principal,expires,time.monotonic()+20,'gemini-3.8-flash',invoke)
        self.provider.assert_not_called()
        with patch('paid_access.monotonic',side_effect=[0,0,0,21]),self.assertRaises(paid_access.Denied) as context:
            paid_access.execute(self.access.config,principal,expires,20,'gemini-3.8-flash',invoke)
        self.assertEqual(context.exception.status,504);self.provider.assert_called_once()
        self.assertLessEqual(self.provider.call_args.args[0],20000)

if __name__=='__main__': unittest.main()
