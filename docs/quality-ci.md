# Hosted application quality

.github/workflows/quality.yml runs on pull requests and main/draft-branch pushes with read-only repository permissions, immutable action commits, no persisted checkout credential and no provider secrets. One 15-minute job cancels stale runs for the same ref. It installs the hash-locked Python runtime/tooling and npm lock, checks strict TypeScript and generated build consistency, audits full Python/npm inventories, runs the six Flask boundary tests, and uses locked Playwright Chromium for browser-to-Flask mocked generation/analysis/recreation/refinement/security/exports.

`tests/run_browser.py` starts the mock-only server on 127.0.0.1:5001, waits for HTTP readiness (15-second deadline), runs the browser tests (120-second deadline), and cleans up process groups even on failure. Browser preview tests await the explicit preview revision, and generation tests await actual success; no fixed generation/preview sleeps remain. Provider construction is replaced by a local fixture; model output is intentionally malicious to exercise the browser boundary. External browser requests are aborted. Synthetic screenshots and mock-server logs are retained as a 7-day workflow artifact. Vercel status is not used as a quality gate or proof.

Local cloud reproduction:

```
npm ci
npm run typecheck
npm run build
.venv/bin/python -m unittest discover -s tests -p 'test_*.py'
.venv/bin/python tests/run_browser.py
```

The cloud initially uses /usr/bin/chromium. Hosted CI explicitly installs the Playwright-pinned browser and passes CHROMIUM_PATH='' to select it. The same pinned browser can be used in cloud with `npx --no-install playwright install chromium` followed by `CHROMIUM_PATH='' .venv/bin/python tests/run_browser.py`. No paid API call or production server is involved. A workflow definition alone is not a passing hosted run; the PR report must link the actual run and state its result after publication.

The provider follow-up adds three installed-SDK offline HTTP serialization/lifecycle/error contracts alongside the six Flask boundary tests (nine unittest cases total); the workflow includes both.
