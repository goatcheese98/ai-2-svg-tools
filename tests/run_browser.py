"""Bounded loopback Flask/browser test runner; never starts a real provider."""
import os
from pathlib import Path
import signal
import subprocess
import sys
import time
from urllib.error import URLError
from urllib.request import urlopen

root = Path(__file__).resolve().parents[1]
work = root / 'work'
work.mkdir(exist_ok=True)
origin = 'http://127.0.0.1:5001'
server = None
browser = None
with (work / 'mock-server.log').open('w') as log:
    try:
        server = subprocess.Popen([sys.executable, 'tests/mock_server.py'], cwd=root,
                                  stdout=log, stderr=subprocess.STDOUT, start_new_session=True)
        deadline = time.monotonic() + 15
        while True:
            if server.poll() is not None:
                raise RuntimeError('Mock server exited; inspect work/mock-server.log')
            try:
                with urlopen(origin, timeout=1) as response:
                    if response.status == 200:
                        break
            except (URLError, TimeoutError):
                if time.monotonic() >= deadline:
                    raise TimeoutError('Mock server did not become ready in 15 seconds')
                # Condition-based readiness polling, never a generation/preview race delay.
                time.sleep(0.05)
        env = dict(os.environ, APP_URL=origin, SCREENSHOT_DIR=str(work / 'screenshots'))
        browser = subprocess.Popen(['npm', 'test'], cwd=root, env=env, start_new_session=True)
        code = browser.wait(timeout=120)
        if code:
            raise subprocess.CalledProcessError(code, ['npm', 'test'])
    finally:
        for process in (browser, server):
            if process is not None:
                try:
                    os.killpg(process.pid, signal.SIGTERM)
                except ProcessLookupError:
                    pass
                try:
                    process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    os.killpg(process.pid, signal.SIGKILL)
                    process.wait(timeout=5)
