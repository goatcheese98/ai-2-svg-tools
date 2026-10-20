# Locked Python and dependency audits

Runtime input: requirements.in. Deployment/install input: requirements.txt (full transitive versions and distribution hashes). Python 3.12 is the supported lock target. Tooling is isolated in requirements-tooling.in/txt, including pip 26.2.1, uv 0.12.23 and pip-audit 2.10.1 and all transitive packages.

Reproduce in a fresh cloud environment:

```
python3.12 -m venv .venv
.venv/bin/python -m pip install --require-hashes -r requirements-tooling.txt
.venv/bin/python -m pip install --require-hashes -r requirements.txt
.venv/bin/python -m pip check
.venv/bin/pip-audit
npm ci
npm audit
```

Refresh intentionally, review, reinstall and audit (not on every CI run):

```
.venv/bin/uv pip compile requirements.in --generate-hashes --python-version 3.12 --output-file requirements.txt
.venv/bin/uv pip compile requirements-tooling.in --generate-hashes --python-version 3.12 --output-file requirements-tooling.txt
```

Initial audit of the frozen app dependencies found no advisories. A separate full installed inventory audit included restored pip 25.0.1 and found 12 advisory records (some duplicate IDs) on that installer. See audits/python-restored.json for the full inventory and IDs. This is build/install exposure, not an observed exploit via app endpoints. Tooling now locks pip 26.2.1; a fresh hash-verified runtime plus tooling install and full installed audit finds no known vulnerabilities. Six Flask boundary tests pass against that environment. npm audit includes runtime and tooling, not just production dependencies, and reports zero. Evidence is in audits/python-locked.json and audits/npm.json. These are advisory snapshots, not guarantees of vulnerability absence.

The original pip-tools hash-fetch attempts repeatedly timed out on PyPI JSON metadata; uv completed reproducibly through the configured proxy. No policy bypass, alternate credential or provider call was used. The old shared environment is retained for restoration evidence; use the new locked environment for validation. CI must install the tooling lock before the runtime lock to upgrade its bootstrap pip too. Hosting platform build tools are outside this runtime lock and must be assessed by the platform owner before a production release; no deployment is authorized here.


The provider migration refreshes the runtime lock to google-genai 2.31.0 and removes google-generativeai and its unused dependencies. A separate fresh install (`/workspace/.venvs/svg-current` in cloud) was fully audited with the locked tooling; the current python-locked.json snapshot covers both runtime and tooling and is clean. No advisory suppressions or skip flags are used in CI.


Paid-route follow-up: docs/paid-access.md now documents required verified existing identity and PostgreSQL admission. Hosted paid mode is explicitly disabled; a provider key alone is insufficient. The quality workflow adds a pinned disposable PostgreSQL service and 18 Python tests plus authorized/unauthorized browser journeys; no production resource was configured. Provider HTTP/output caps are now further constrained by the reviewed remaining admission deadline/policy.
