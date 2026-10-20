# Pre-render SVG complexity budget

The sanitizer now rejects a complete SVG if its rendering budget is exceeded. It never truncates nodes/path data to fit. The existing DOMPurify static subset and raster dimension limit remain in force.

Before sanitizing or live DOM insertion: maximum 262,144 source characters, 2,000 elements, nesting depth 32, 12,000 attributes, 20,000 numeric geometry values, 32,768 text characters, and finite numeric geometry values no greater than 1,000,000 in magnitude. Source length is checked before XML parsing. Invalid XML still gives the existing invalid-document result.

After sanitizing and before rendering: references must resolve within the SVG, IDs must be unique, and reference cycles are rejected. A memoized expansion budget counts child/reference edges (including use, gradient, clip and mask references), at most 10,000 expanded elements, 40,000 expanded geometry values and 16 reference links. Pattern tiling is rejected explicitly because tiny pattern cells can amplify rendering independently of DOM size; flatten patterns to ordinary shapes. This changes the previously accepted subset intentionally and gives a visible actionable explanation instead of silently stripping the pattern. Unresolved/duplicate references are likewise explicit rejections.

Preview, history loading, copy, SVG download, PNG conversion and refinement rasterization all consume the same checked boundary. Errors clear the preview and disable export controls, showing the specific limit and advice to simplify or flatten the artwork. Raw editor/history text is retained so users can fix it. Export cannot recover the unsanitized original, even inside the debounce interval.

Browser regressions cover over-budget source, node/attribute count, nesting, geometry, nonfinite coordinates, text, cycles, missing references, expanded use and pattern tiling. Near-boundary source/node/depth/reference/geometry/text fixtures preserve geometry, gradients and text; near-limit geometry exports as SVG and PNG. Serialization whitespace normalization is accepted, path numbers are checked intact.

These are conservative work budgets, not a universal CPU/GPU time proof. They prevent the documented simple size/DOM/reference amplification classes while bounding accepted documents. Renderer implementation bugs, platform-specific glyph/path tessellation behavior and the original editor text remaining editable are still limits. No hard wall-clock rendering guarantee is claimed.

The browser harness now awaits a preview revision signal and generation success instead of 400/200 ms fixed sleeps. Provider requests remain mocked.
