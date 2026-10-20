import base64
import io
import sys
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch
from PIL import Image
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import app
from access_fixture import PaidFixture

class RequestLimits(unittest.TestCase):
    def setUp(self):
        self.access=PaidFixture();self.access.__enter__();self.addCleanup(self.access.__exit__)
        self.client = self.access.client()
        self.key = patch.object(app, 'api_key', 'offline-fixture')
        self.model = patch.object(app, 'generate_content')
        self.key.start(); self.provider = self.model.start()
        self.addCleanup(patch.stopall)
        self.provider.return_value = SimpleNamespace(text='<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script><rect width="10" height="10"/></svg>')

    def test_request_cap(self):
        self.assertEqual(self.client.post('/generate', data=b'x'*(8*1024*1024+1), content_type='application/json').status_code, 413)
        self.provider.assert_not_called()

    def test_invalid_shapes(self):
        for route, body in [('/generate', []),('/generate', {'prompt': {'bad': 1}}),('/convert_to_svg', {'image_data': 5, 'analysis_data': []})]:
            with self.subTest(route=route, body=body):
                self.assertEqual(self.client.post(route,json=body).status_code,400)
        self.provider.assert_not_called()

    def test_invalid_images(self):
        for image in ['data:image/png;base64,!!!!','data:image/png;base64,'+base64.b64encode(b'not an image').decode()]:
            for route in ['/analyze_image','convert_to_svg','/refine_svg']:
                body={'image_data':image,'analysis_data':dict.fromkeys(['metadata','semantic','layout','content_styling','ocr'],'fixture'),'svg_code':'<svg></svg>','png_data':image}
                self.assertEqual(self.client.post('/'+route.lstrip('/'),json=body).status_code,400)
        self.provider.assert_not_called()

    def test_decoded_image_and_pixel_caps(self):
        with patch.object(app, 'MAX_IMAGE_BYTES', 10):
            image='data:image/png;base64,'+base64.b64encode(b'x'*11).decode()
            self.assertEqual(self.client.post('/analyze_image',json={'image_data':image}).status_code,413)
        buf=io.BytesIO();Image.new('RGB',(20,20)).save(buf,format='PNG')
        image='data:image/png;base64,'+base64.b64encode(buf.getvalue()).decode()
        with patch.object(app,'MAX_IMAGE_PIXELS',100):
            self.assertEqual(self.client.post('/analyze_image',json={'image_data':image}).status_code,413)
        self.provider.assert_not_called()

    def test_field_and_model_output_limits(self):
        for body in [{'prompt': 'x'*32001}, {'svg_code': 'x'*(app.MAX_SVG_CHARS+1)}]:
            self.assertEqual(self.client.post('/generate',json=body).status_code,413)
        self.assertIsNone(app._clean_svg_response('x'*(app.MAX_SVG_CHARS+1)))
        self.provider.assert_not_called()

    def test_recreation_and_refinement_mocked_contract(self):
        buf=io.BytesIO();Image.new('RGB',(2,2)).save(buf,format='PNG')
        image='data:image/png;base64,'+base64.b64encode(buf.getvalue()).decode()
        body={'image_data':image,'analysis_data':dict.fromkeys(['metadata','semantic','layout','content_styling','ocr'],'fixture')}
        self.assertEqual(self.client.post('/convert_to_svg',json=body).status_code,200)
        response=self.client.post('/refine_svg',json={'svg_code':'<svg></svg>','png_data':image})
        self.assertEqual(response.status_code,200)
        # Server extraction is explicitly not sanitization: malicious output must reach browser boundary.
        self.assertIn('<script>',response.json['svg_code'])

if __name__ == '__main__': unittest.main()
