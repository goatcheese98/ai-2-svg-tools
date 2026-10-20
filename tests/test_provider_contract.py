"""Exercise the installed SDK's HTTP serialization with an offline transport."""
import io
import json
import sys
from pathlib import Path
import unittest
from unittest.mock import patch, Mock
import httpx
from PIL import Image
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import app
import provider

class ProviderContract(unittest.TestCase):
    def setUp(self):
        self.requests = []
        self.clients = []
        self.status = 200
        self.body = {'candidates': [{'content': {'role': 'model', 'parts': [{'text': '<svg xmlns="http://www.w3.org/2000/svg"><rect/></svg>'}]}}]}
        original = provider.genai.Client
        def handle(request):
            self.requests.append(request)
            return httpx.Response(self.status, json=self.body)
        def factory(**kwargs):
            kwargs['http_options'].httpx_client = httpx.Client(transport=httpx.MockTransport(handle))
            client = original(**kwargs)
            client.close = Mock(wraps=client.close)
            self.addCleanup(kwargs['http_options'].httpx_client.close)
            self.clients.append((client, kwargs['http_options'].httpx_client))
            return client
        self.factory = patch.object(provider.genai, 'Client', side_effect=factory)
        self.mock_factory = self.factory.start()
        self.addCleanup(patch.stopall)

    def test_text_config_timeout_and_client_lifecycle(self):
        response = provider.generate_content('offline-test-key', provider.DEFAULT_MODEL, 'a circle')
        self.assertIn('<svg', response.text)
        request = self.requests[0]
        self.assertTrue(request.url.path.startswith('/v1/'))
        self.assertTrue(request.url.path.endswith('/models/'+provider.DEFAULT_MODEL+':generateContent'))
        self.assertEqual(request.headers['x-goog-api-key'], 'offline-test-key')
        body = json.loads(request.content)
        self.assertEqual(body['generationConfig']['temperature'], 1.0)
        self.assertEqual(body['generationConfig']['maxOutputTokens'], 32768)
        self.assertEqual(body['contents'][0]['parts'][0]['text'], 'a circle')
        self.assertLessEqual(request.extensions['timeout']['read'], 60)
        self.clients[0][0].close.assert_called_once()

    def test_pil_image_serialization_and_malicious_output_contract(self):
        self.body['candidates'][0]['content']['parts'][0]['text'] = '<svg><script>alert(1)</script></svg>'
        result = provider.generate_content('offline-test-key', provider.DEFAULT_MODEL, ['image fixture', Image.new('RGB',(2,2))])
        parts = json.loads(self.requests[0].content)['contents'][0]['parts']
        image = parts[1]['inlineData']
        self.assertIn(image.get('mimeType',image.get('mime_type')), ['image/png','image/jpeg'])
        self.assertTrue(image['data'])
        # SDK extraction is not sanitization; the browser boundary remains mandatory.
        self.assertIn('<script>',result.text)

    def test_flask_empty_error_and_unknown_model_are_safe(self):
        with patch.object(app,'api_key','offline-test-key'):
            client=app.app.test_client()
            self.body = {'candidates': []}
            response=client.post('/generate',json={'prompt':'fixture'})
            self.assertEqual(response.status_code,500)
            self.status=429;self.body={'error':{'code':429,'message':'offline-test-key must never be reflected','status':'RESOURCE_EXHAUSTED'}}
            response=client.post('/generate',json={'prompt':'fixture'})
            self.assertEqual(response.status_code,500)
            self.assertNotIn('offline-test-key',response.get_data(as_text=True))
            self.assertEqual(len(self.requests),2,'one attempt per request; no hidden retry')
            calls=self.mock_factory.call_count
            response=client.post('/generate',json={'prompt':'fixture','model':'gemini-2.5-pro-exp-03-25'})
            self.assertEqual(response.status_code,400)
            self.assertEqual(self.mock_factory.call_count,calls)
        html=app.app.test_client().get('/').get_data(as_text=True)
        self.assertNotIn('offline-test-key',html)
        self.assertIn(provider.DEFAULT_MODEL,html)

if __name__ == '__main__': unittest.main()
