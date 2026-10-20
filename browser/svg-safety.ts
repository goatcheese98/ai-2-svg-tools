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

export const SVG_LIMITS = {
  sourceCharacters: 262144, elements: 2000, depth: 32, attributes: 12000,
  geometryTokens: 20000, textCharacters: 32768, expandedElements: 10000,
  expandedGeometryTokens: 40000, referenceDepth: 16, coordinateMagnitude: 1_000_000,
} as const;

function reject(message: string): never {
  throw new Error(`SVG rejected: ${message} Simplify the artwork and try again.`);
}

// A finite static subset: count before sanitizing, then budget reference expansion
// on the sanitized graph before the browser is allowed to render any of it.
const numericGeometry = new Set(['d', 'points', 'transform', 'gradientTransform', 'viewBox', 'width', 'height', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'cx', 'cy', 'r', 'rx', 'ry', 'dx', 'dy', 'font-size', 'stroke-width', 'stroke-dasharray', 'stroke-dashoffset']);
function checkTree(root: Element): void {
  let elements = 0, attributes = 0, geometry = 0, text = 0;
  const stack: Array<[Element, number]> = [[root, 1]];
  while (stack.length) {
    const [node, depth] = stack.pop()!;
    if (++elements > SVG_LIMITS.elements) reject(`maximum ${SVG_LIMITS.elements} elements exceeded.`);
    if (depth > SVG_LIMITS.depth) reject(`maximum nesting depth ${SVG_LIMITS.depth} exceeded.`);
    attributes += node.attributes.length;
    if (attributes > SVG_LIMITS.attributes) reject(`maximum ${SVG_LIMITS.attributes} attributes exceeded.`);
    // Pattern tiling can amplify a tiny DOM without a useful finite bound.
    if (node.localName === 'pattern') reject('Pattern tiling is unsupported; replace it with explicit geometry.');
    for (const attribute of node.attributes) {
      if (numericGeometry.has(attribute.localName)) {
        const numbers = attribute.value.match(/[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/gi) || [];
        geometry += numbers.length;
        if (numbers.some(value => !Number.isFinite(Number(value)) || Math.abs(Number(value)) > SVG_LIMITS.coordinateMagnitude)) {
          reject(`geometry coordinates must be finite and at most ${SVG_LIMITS.coordinateMagnitude} in magnitude.`);
        }
      }
    }
    if (geometry > SVG_LIMITS.geometryTokens) reject(`maximum ${SVG_LIMITS.geometryTokens} geometry numbers exceeded.`);
    for (const child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) text += child.textContent?.length || 0;
    }
    if (text > SVG_LIMITS.textCharacters) reject(`maximum ${SVG_LIMITS.textCharacters} text characters exceeded.`);
    for (const child of node.children) stack.push([child, depth + 1]);
  }
}

function checkReferences(root: Element): void {
  const nodes = [root, ...root.querySelectorAll('*')];
  const ids = new Map<string, Element>();
  for (const node of nodes) {
    if (!node.id) continue;
    if (ids.has(node.id)) reject('Duplicate SVG IDs are ambiguous; give each definition a unique ID.');
    ids.set(node.id, node);
  }
  const visiting = new Set<Element>();
  const memo = new Map<Element, {elements: number; geometry: number; references: number}>();
  function cost(node: Element): {elements: number; geometry: number; references: number} {
    if (visiting.has(node)) reject('Cyclic SVG references are unsupported; flatten the cycle.');
    const cached = memo.get(node);
    if (cached) return cached;
    visiting.add(node);
    const total = {elements: 1, geometry: 0, references: 0};
    for (const attribute of node.attributes) {
      if (numericGeometry.has(attribute.localName)) {
        total.geometry += (attribute.value.match(/[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/gi) || []).length;
      }
    }
    const edges: Array<[Element, boolean]> = Array.from(node.children, child => [child, false]);
    for (const attribute of node.attributes) {
      const match = attribute.localName === 'href' ? attribute.value.match(/^#(.+)$/) :
        attribute.value.match(/^url\(\s*['"]?#([\w.-]+)['"]?\s*\)$/);
      if (!match) continue;
      const target = ids.get(match[1]);
      if (!target) reject(`Reference #${match[1]} has no definition in this SVG.`);
      edges.push([target, true]);
    }
    for (const [target, reference] of edges) {
      const next = cost(target);
      total.elements += next.elements;
      total.geometry += next.geometry;
      total.references = Math.max(total.references, next.references + Number(reference));
      if (total.elements > SVG_LIMITS.expandedElements) reject(`reference expansion exceeds ${SVG_LIMITS.expandedElements} elements; flatten repeated use/clip/mask definitions.`);
      if (total.geometry > SVG_LIMITS.expandedGeometryTokens) reject(`reference expansion exceeds ${SVG_LIMITS.expandedGeometryTokens} geometry numbers.`);
      if (total.references > SVG_LIMITS.referenceDepth) reject(`reference chain exceeds ${SVG_LIMITS.referenceDepth} links.`);
    }
    visiting.delete(node);
    memo.set(node, total);
    return total;
  }
  cost(root);
}

export function sanitizeSvg(source: string): SVGSVGElement | null {
  if (source.length > SVG_LIMITS.sourceCharacters) reject(`maximum source length ${SVG_LIMITS.sourceCharacters} characters exceeded.`);
  if (/<!DOCTYPE|<!ENTITY/i.test(source)) reject('DTD/entity declarations are unsupported; use literal SVG text.');
  if (!source.trim()) return null;
  // XML validation is for useful failure behavior, not the security boundary.
  const parsed = new DOMParser().parseFromString(source, 'image/svg+xml');
  if (parsed.querySelector('parsererror') || parsed.doctype ||
      parsed.documentElement.localName !== 'svg') return null;
  checkTree(parsed.documentElement);
  const clean = DOMPurify.sanitize(source, {
    ALLOWED_TAGS: tags, ALLOWED_ATTR: attrs, ALLOW_DATA_ATTR: false,
    ALLOW_ARIA_ATTR: false, RETURN_DOM_FRAGMENT: true,
    PARSER_MEDIA_TYPE: 'application/xhtml+xml',
  });
  const svg = clean.firstElementChild;
  if (!(svg instanceof SVGSVGElement)) return null;
  checkReferences(svg);
  return svg;
}

export function serializeSvg(source: string): string | null {
  const svg = sanitizeSvg(source);
  return svg ? new XMLSerializer().serializeToString(svg) : null;
}
