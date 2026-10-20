# Recreation, strict browser TypeScript and request limits

This follow-up stays on draft PR #1 and `codex/sanitize-generated-svg`, sole owner for ai-2-svg-tools. Inspected clean local/remote draft `5dcbe26c823a81a1840386e731c7595a364e8f91` and default main `a718c1ecc5530b0960912dc69b036b1528af0b3f` before edits; reread repository .cursor rules. No sibling checkout edited. All execution and screenshots were in cloud. No paid/live provider call, transferred credential, package publication, merge or deployment.

## Behavior and tests

The new recreation browser regression failed with a 2-second timeout before the fix. The handler referenced nonexistent variables/helper. It now uses the existing recreate button/status and reads the five editable analysis sections. Refinement also sent `original_svg` while Flask required `svg_code`; the request is corrected, and a real Flask route test checks that contract.

All browser feature source is now strict TypeScript in browser/app.ts, importing the existing DOMPurify boundary. static/script.js is generated and includes the sanitizer; the redundant standalone generated safety bundle is deleted. Handwritten production browser JS files: 1 → 0. There is no any annotation, ts-ignore, ts-nocheck or weakened strictness flag. Runtime validation covers JSON response strings and saved history, including corrupt session JSON and legacy missing model names; unknown historical models no longer blank the active selector. Test harnesses remain Node CJS and Python, outside production browser source. The large app module still merits incremental extraction into smaller workflow modules.

Flask regressions failed before the request fix: nonobject JSON caused 500, malformed images returned 500, requests had no configured cap, and independent image-limit constants were absent. Added limits:

- JSON transport: 8 MiB, with JSON 413 errors.
- Decoded raster bytes: 4 MiB; only base64 PNG/JPEG/WebP/GIF accepted. Pillow verifies decode and loads only after checking a 16-million-pixel cap. Invalid data returns JSON 400 before constructing a provider.
- Prompt/context/refinement: 32,000 characters; model: 200; analysis sections: 100,000 each; SVG request/model output: 2 MiB characters. Types and complexity/color ranges checked before provider work.
- Browser raster: max 8192 per side and 16 million pixels, including refinement PNG. Exceeding dimensions gives a bounded failure instead of allocating a huge canvas.

SVG uploads can be isolated previews in img, but are not supported raster input for Pillow/provider analysis; upload guidance now states actual formats/limits. The server's SVG extraction remains explicitly **not sanitization**. Malicious mocked output reaches the browser and is sanitized at each preview/copy/export consumption. Valid geometry, gradient and text and both PNG export modes are still checked.

## Commands and evidence

```
npm ci
npm run typecheck
npm run build
npm test
/workspace/.venvs/ai-2-svg-tools/bin/python -m unittest discover -s tests -p 'test_*.py'
/workspace/.venvs/ai-2-svg-tools/bin/python tests/mock_server.py
APP_URL=http://127.0.0.1:5001 SCREENSHOT_DIR=work/after npm test
/workspace/.venvs/ai-2-svg-tools/bin/python /workspace/.onboarding/svg-smoke.py
/workspace/.venvs/ai-2-svg-tools/bin/python -m pip check
npm audit
git diff --check
```

Results: locked install/build and strict typecheck PASS; both browser modes PASS; six Python unittest cases PASS; restored mocked Flask smoke PASS; pip consistency PASS; npm audit reports zero vulnerabilities, including dev dependencies. Tests/mock_server.py binds loopback and replaces provider construction with an in-process fixture. The browser test intercepts all external traffic. Tests validate recreation, generation, refinement, image analysis, saved/corrupt history, sanitized clipboard/SVG download within preview debounce, default/custom PNG signatures/dimensions/gradient pixels, URL variants, malicious model content, malformed SVG, raster cap and no browser runtime errors. Screenshots use synthetic fixture content only.

## Foundation within the existing layout

Read only the requested lum-brain files via GitHub: design-tokens.ts (blob e7e0c2362848c209914a5d9da2bcaa5657b663b8), fonts.ts (d32cace0ed25de3f8e164b9b2d906ca6e782c0e9), css-standards.md (a0a54906dba295f4a3c0d76b0031e366579dec4a). No LUM business data or workflows copied.

Existing panel, form, tab and output layout retained. Light/dark semantic palette follows the supplied tokens with system theme selection, radius aliases use the 6/8/10/12/16 scale, decorative chrome gradients removed. Semantic status colors remain independent. Geist and Geist Mono are actually bundled from pinned @fontsource-variable packages with SIL OFL license files under static/fonts. These Latin subsets fall back to system fonts for uncovered glyphs and italic faces; no external font request is needed. Native select arrows retained. Visible keyboard focus, reduced motion, 16px mobile form text and no horizontal overflow at 390px are checked. Dark/light screenshots were visually inspected; font load and tokens also asserted in Chromium. No new layout, Paper artboard, human design approval or broad accessibility certification is claimed. Paper cloud remains unestablished and local Paper was not opened.

Screenshots: [desktop dark](screenshots/desktop-dark.png), [mobile light](screenshots/mobile-light.png), [recreation under mock](screenshots/recreation.png). The baseline screenshot is retained in the cloud work directory; it predates foundation styling.

## Dependency dispositions and remaining work

DOMPurify remains pinned at 3.4.17, esbuild 0.28.2, TypeScript 7.0.2 and Playwright 1.64.1; new font versions are exact in package-lock.json. No runtime CDN integration added. npm audit is clean. Python requirements remain unconstrained from baseline; pip check verifies consistency, not a vulnerability audit. google.generativeai is end-of-support and historical model IDs are unverified: next provider slice should migrate to google.genai with locked Python dependencies and equivalent mocked contracts, then separately authorize any live compatibility check. No provider credentials were configured here.

Remaining SVG compatibility limits: CSS, external/embedded images, filters, animation and external references are deliberately stripped. Complex path counts, huge browser editor inputs and preview rendering time are not capped; geometric-complexity limits and CSP remain follow-ups. TypeScript source can be split by workflow after this complete feature-path migration. Further UI layout work requires the project-specific versioned Paper design record; none exists yet.

Authoritative model ID/reasoning-effort metadata is unavailable in this session.
