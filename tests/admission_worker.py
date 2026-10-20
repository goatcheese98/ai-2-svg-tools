"""Fresh-process request worker for local durable quota tests; no real provider."""
import json
import os
from pathlib import Path
import sys
from types import SimpleNamespace
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import app
import paid_access
from access_fixture import test_connection
fixture=json.loads(sys.stdin.read())
with patch.dict(os.environ,fixture['env']), patch.object(paid_access,'connect_db',side_effect=test_connection), patch.object(app,'api_key','offline-fixture'), patch.object(app,'generate_content',return_value=SimpleNamespace(text='<svg xmlns="http://www.w3.org/2000/svg"><rect/></svg>')):
    response=app.app.test_client().post('/generate',json={'prompt':'process fixture'},headers={'Authorization':'Bearer '+fixture['token']})
    print(json.dumps({'status':response.status_code}))
