import DOMPurify from 'dompurify';

// One boundary for model output, editor input, legacy history, copy and exports.
// Deliberately exclude CSS, animation, HTML, links and embedded images.
const tags = ['svg', 'g', 'defs', 'title', 'desc', 'path', 'rect', 'circle',
  'ellipse', 'line', 'polyline', 'polygon', 'text', 'tspan', 'textPath',
  'linearGradient', 'radialGradient', 'stop', 'clipPath', 'mask', 'pattern', 'use'];
const attrs = ['xmlns', 'viewBox', 'width', 'height', 'x', 'y', 'x1', 'y1',
  'x2', 'y2', 'cx', 'cy', 'r', 'rx', 'ry', 'd', 'points', 'transform', 'id',
  'fill', 'fill-opacity', 'fill-rule', 'stroke', 'stroke-width', 'stroke-opacity',
  'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray', 'stroke-dashoffset',
  'opacity', 'clip-path', 'clip-rule', 'mask', 'gradientUnits', 'gradientTransform',
  'spreadMethod', 'offset', 'stop-color', 'stop-opacity', 'fx', 'fy', 'fr',
  'patternUnits', 'patternContentUnits', 'patternTransform', 'preserveAspectRatio',
  'font-family', 'font-size', 'font-weight', 'font-style', 'text-anchor',
  'dominant-baseline', 'dx', 'dy', 'rotate', 'textLength', 'lengthAdjust', 'href',
  'startOffset', 'maskUnits', 'maskContentUnits', 'clipPathUnits'];
const fragment = /^#[a-zA-Z_][\w.-]*$/;
const localPaint = /^url\(\s*['"]?#[a-zA-Z_][\w.-]*['"]?\s*\)$/;
const paintAttributes = new Set(['fill', 'stroke', 'clip-path', 'mask']);
DOMPurify.addHook('uponSanitizeAttribute', (_node, data) => {
  const name = data.attrName.toLowerCase();
  const value = data.attrValue.trim();
  if (name === 'href') data.keepAttr = fragment.test(value);
  // No CSS escapes or functions except a single local paint reference.
  if (paintAttributes.has(name) && /[()\\]/.test(value)) {
    data.keepAttr = localPaint.test(value);
  }
});

export function sanitizeSvg(source: string): SVGSVGElement | null {
  if (!source.trim()) return null;
  // XML validation is for useful failure behavior, not the security boundary.
  const parsed = new DOMParser().parseFromString(source, 'image/svg+xml');
  if (parsed.querySelector('parsererror') || parsed.doctype ||
      parsed.documentElement.localName !== 'svg') return null;
  const clean = DOMPurify.sanitize(source, {
    ALLOWED_TAGS: tags, ALLOWED_ATTR: attrs, ALLOW_DATA_ATTR: false,
    ALLOW_ARIA_ATTR: false, RETURN_DOM_FRAGMENT: true,
    PARSER_MEDIA_TYPE: 'application/xhtml+xml',
  });
  const svg = clean.firstElementChild;
  if (!(svg instanceof SVGSVGElement)) return null;
  return svg;
}

export function serializeSvg(source: string): string | null {
  const svg = sanitizeSvg(source);
  return svg ? new XMLSerializer().serializeToString(svg) : null;
}
