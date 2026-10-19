# SVG trust boundary and verification

## Baseline and restoration (2026-10-19)

Fresh task restored all three published checkouts, `/workspace/.venvs/ai-2-svg-tools`, both sibling node_modules directories, and `.onboarding` install, constraints, logs and mocked smoke helpers. Only ai-2-svg-tools was edited. Its clean initial checkout and resolved upstream default `main` were both `a718c1ecc5530b0960912dc69b036b1528af0b3f`. No AGENTS.md found; read both `.cursor/rules/*.mdc` instructions (simple scoped vanilla frontend, Python 3.12 isolated environment). No LUM-DESIGN-CONTRACT.md was present; no visual redesign performed. Future UI work must follow the user-specified contract: Geist, neutral surfaces, semantic tokens, accessible controls and project-specific versioned Paper artboards; no copied LUM business data/flows.

Python `pip check` and `.onboarding/svg-smoke.py` passed. Node, Playwright and `/usr/bin/chromium` restored. Initial sandbox blocked proxy access and Chromium sockets; the same commands succeeded with approved execution outside that sandbox. GitHub connector first independently verified upstream; subsequent `git fetch origin main` and `git ls-remote --symref origin HEAD` confirmed it. No missing restoration artifact found for this task. Sibling builds/smokes were not rerun and are not newly certified.

## Defect and policy

Before implementation, `node tests/svg-security.cjs` failed with `preview must remove active content and resource loads` (actual true). DOMParser accepted scripts, foreignObject, handler attributes and external image resources; SVG download exported the original editor text. Parsing is not sanitization.

`browser/svg-safety.ts` now owns the boundary. DOMPurify is pinned in package-lock.json and bundled locally by esbuild; no runtime CDN dependency. Its explicit SVG tag/attribute allowlists exclude script, foreignObject/HTML, event attributes, style elements/attributes, animation, links, filters and embedded images. href permits fragment references only; paint/reference attributes permit a single local url(#id), rejecting external URLs and CSS escapes/functions. XML parsing additionally rejects malformed documents, non-SVG roots and doctypes. Keep DOMPurify updated as security releases become available.

Path audit:

- Generate, refine, recreate and history load all call updatePreview, which only appends the sanitized element. Editor updates use that same boundary.
- Legacy session history and model output remain untrusted raw text in storage/editor. History metadata uses textContent. Loading always sanitizes.
- SVG download and clipboard sanitize the current editor value at consumption, including during the 300 ms preview debounce.
- Default/custom PNG export and refinement PNG generation independently sanitize current editor text before serialization and image/canvas conversion. Neither uses a raw original or trusts preview DOM.
- Image upload/drop uses FileReader into an img data URL, not inline SVG. Browser image context isolates SVG script and external resources. Image analysis results populate textarea values, not HTML. Offline upload/analysis is checked.

## Reproduction and results

Requires Node with npm, Python 3.12 app environment, and Chromium (`CHROMIUM_PATH` may override `/usr/bin/chromium`).

```
npm ci
npm run build
npm run typecheck
npm test
npm audit --omit=dev
/workspace/.venvs/ai-2-svg-tools/bin/python -m pip check
/workspace/.venvs/ai-2-svg-tools/bin/python /workspace/.onboarding/svg-smoke.py
git diff --check
```

All passed after the fix. Audit reported zero production dependency vulnerabilities. Browser tests intercept every HTTP request: local template/assets and mocked generation/refinement/analysis responses only; external requests are aborted. The template's existing Google Fonts request is blocked separately. Fixtures cover script, foreignObject, handlers, javascript/entity-encoded URLs, external/protocol-relative/data/xlink resources, CSS loads and animation; legacy history; mocked generation/refinement; uploaded SVG isolation and mocked analysis; malformed SVG; valid geometry/gradient/text; immediate SVG download; default/custom PNG signatures, dimensions and gradient pixels. No live provider calls, credentials, production endpoints, public preview or deployment.

The generated static/svg-safety.js is committed so existing Flask/Vercel serving needs no new runtime build service. Rebuild after source/dependency changes and review the generated diff. DOMPurify's license is retained in the bundle.

## Limits and next slices

- This is a static SVG subset. CSS, animation, embedded images, external fonts/resources and SVG filters are intentionally removed; some formerly accepted artwork will lose those features. No visual redesign.
- Sanitization does not bound geometric complexity, editor size or raster export allocation. Add explicit size/complexity/dimension limits in a follow-up if needed.
- Next explicit modernization slice: migrate remaining first-party static/script.js into small TypeScript modules (workflow UI, history, uploads, PNG conversion), preserving current behavior with mocked browser coverage. No framework rewrite in this change.
- Existing recreation handler references undefined recreateButton/recreateStatusDisplay/getAnalysisDataFromTextareas. It already fails before reaching its request; restore that handler with a mocked end-to-end regression as a separate follow-up. Its successful-response preview path is protected, but recreation is not claimed functional here.
- Deprecated google.generativeai SDK/model compatibility is outside this slice; no live provider compatibility verified. Existing refinement payload naming is unchanged.
- Defense in depth such as CSP and server-side sanitization for any future server rendering/sharing remains separate work. The current application renders/exports through the browser boundary.
