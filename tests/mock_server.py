"""Loopback-only Flask app with a deterministic provider; never uses credentials/network."""
import json
import sys
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import app
fixture = json.loads(Path(__file__).with_name('fixtures.json').read_text())
class Provider:
    def generate_content(self, _key, _model, parts):
        if isinstance(parts, list) and parts[0].startswith('Analyze the following image'):
            return SimpleNamespace(text='**Metadata Analysis:**Offline fixture\n**Semantic Analysis:**A rectangle\n**Layout Analysis:**Centered\n**Content & Styling Analysis:**Gradient\n**OCR Analysis:**Hello')
        return SimpleNamespace(text=fixture['bad'])
with patch.object(app, 'api_key', 'offline-fixture'), patch.object(app, 'generate_content', side_effect=Provider().generate_content):
    app.app.run(host='127.0.0.1',port=5001,debug=False,use_reloader=False)
