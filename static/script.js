(() => {
  // node_modules/dompurify/dist/purify.es.mjs
  function _OverloadYield(e, d) {
    this.v = e, this.k = d;
  }
  function _arrayLikeToArray(r, a) {
    (null == a || a > r.length) && (a = r.length);
    for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
    return n;
  }
  function _arrayWithHoles(r) {
    if (Array.isArray(r)) return r;
  }
  function _iterableToArrayLimit(r, l) {
    var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (null != t) {
      var e, n, i, u, a = [], f = true, o = false;
      try {
        if (i = (t = t.call(r)).next, 0 === l) {
          if (Object(t) !== t) return;
          f = false;
        } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = true) ;
      } catch (r2) {
        o = true, n = r2;
      } finally {
        try {
          if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
        } finally {
          if (o) throw n;
        }
      }
      return a;
    }
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _slicedToArray(r, e) {
    return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
  }
  function _unsupportedIterableToArray(r, a) {
    if (r) {
      if ("string" == typeof r) return _arrayLikeToArray(r, a);
      var t = {}.toString.call(r).slice(8, -1);
      return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
    }
  }
  function AsyncGenerator(e) {
    var t, n;
    function resume(t2, n2) {
      try {
        var r = e[t2](n2), o = r.value, u = o instanceof _OverloadYield;
        Promise.resolve(u ? o.v : o).then(function(n3) {
          if (u) {
            var i = "return" === t2 && o.k ? t2 : "next";
            if (!o.k || n3.done) return resume(i, n3);
            n3 = e[i](n3).value;
          }
          settle(!!r.done, n3);
        }, function(e2) {
          resume("throw", e2);
        });
      } catch (e2) {
        settle(2, e2);
      }
    }
    function settle(e2, r) {
      2 === e2 ? t.reject(r) : t.resolve({
        value: r,
        done: e2
      }), (t = t.next) ? resume(t.key, t.arg) : n = null;
    }
    this._invoke = function(e2, r) {
      return new Promise(function(o, u) {
        var i = {
          key: e2,
          arg: r,
          resolve: o,
          reject: u,
          next: null
        };
        n ? n = n.next = i : (t = n = i, resume(e2, r));
      });
    }, "function" != typeof e.return && (this.return = void 0);
  }
  AsyncGenerator.prototype["function" == typeof Symbol && Symbol.asyncIterator || "@@asyncIterator"] = function() {
    return this;
  }, AsyncGenerator.prototype.next = function(e) {
    return this._invoke("next", e);
  }, AsyncGenerator.prototype.throw = function(e) {
    return this._invoke("throw", e);
  }, AsyncGenerator.prototype.return = function(e) {
    return this._invoke("return", e);
  };
  var entries = Object.entries;
  var setPrototypeOf = Object.setPrototypeOf;
  var isFrozen = Object.isFrozen;
  var getPrototypeOf = Object.getPrototypeOf;
  var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  var freeze = Object.freeze;
  var seal = Object.seal;
  var create = Object.create;
  var _ref = typeof Reflect !== "undefined" && Reflect;
  var apply = _ref.apply;
  var construct = _ref.construct;
  if (!freeze) freeze = function freeze2(x) {
    return x;
  };
  if (!seal) seal = function seal2(x) {
    return x;
  };
  if (!apply) apply = function apply2(func, thisArg) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) args[_key - 2] = arguments[_key];
    return func.apply(thisArg, args);
  };
  if (!construct) construct = function construct2(Func) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) args[_key2 - 1] = arguments[_key2];
    return new Func(...args);
  };
  var arrayForEach = unapply(Array.prototype.forEach);
  Array.prototype.indexOf;
  var arrayLastIndexOf = unapply(Array.prototype.lastIndexOf);
  var arrayPop = unapply(Array.prototype.pop);
  var arrayPush = unapply(Array.prototype.push);
  var arraySlice = unapply(Array.prototype.slice);
  var arraySplice = unapply(Array.prototype.splice);
  var arrayIsArray = Array.isArray;
  var setCreate = unconstruct(Set);
  var setAdd = unapply(Set.prototype.add);
  var setHas = unapply(Set.prototype.has);
  var stringToLowerCase = unapply(String.prototype.toLowerCase);
  var stringToString = unapply(String.prototype.toString);
  var stringMatch = unapply(String.prototype.match);
  var stringReplace = unapply(String.prototype.replace);
  var stringIndexOf = unapply(String.prototype.indexOf);
  var stringTrim = unapply(String.prototype.trim);
  var numberToString = unapply(Number.prototype.toString);
  var booleanToString = unapply(Boolean.prototype.toString);
  var bigintToString = typeof BigInt === "undefined" ? null : unapply(BigInt.prototype.toString);
  var symbolToString = typeof Symbol === "undefined" ? null : unapply(Symbol.prototype.toString);
  var objectHasOwnProperty = unapply(Object.prototype.hasOwnProperty);
  var objectToString = unapply(Object.prototype.toString);
  var regExpTest = unapply(RegExp.prototype.test);
  var typeErrorCreate = unconstruct(TypeError);
  function unapply(func) {
    return function(thisArg) {
      if (thisArg instanceof RegExp) thisArg.lastIndex = 0;
      for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) args[_key3 - 1] = arguments[_key3];
      return apply(func, thisArg, args);
    };
  }
  function unconstruct(Func) {
    return function() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) args[_key4] = arguments[_key4];
      return construct(Func, args);
    };
  }
  function addToSet(set, array) {
    let transformCaseFunc = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : stringToLowerCase;
    if (setPrototypeOf) setPrototypeOf(set, null);
    if (!arrayIsArray(array)) return set;
    let l = array.length;
    while (l--) {
      let element2 = array[l];
      if (typeof element2 === "string") {
        const lcElement = transformCaseFunc(element2);
        if (lcElement !== element2) {
          if (!isFrozen(array)) array[l] = lcElement;
          element2 = lcElement;
        }
      }
      set[element2] = true;
    }
    return set;
  }
  function cleanArray(array) {
    for (let index = 0; index < array.length; index++) if (!objectHasOwnProperty(array, index)) array[index] = null;
    return array;
  }
  function clone(object) {
    const newObject = create(null);
    for (const _ref2 of entries(object)) {
      var _ref3 = _slicedToArray(_ref2, 2);
      const property = _ref3[0];
      const value = _ref3[1];
      if (objectHasOwnProperty(object, property)) {
        if (arrayIsArray(value)) newObject[property] = cleanArray(value);
        else if (value && typeof value === "object" && value.constructor === Object) newObject[property] = clone(value);
        else newObject[property] = value;
      }
    }
    return newObject;
  }
  function stringifyValue(value) {
    switch (typeof value) {
      case "string":
        return value;
      case "number":
        return numberToString(value);
      case "boolean":
        return booleanToString(value);
      case "bigint":
        return bigintToString ? bigintToString(value) : "0";
      case "symbol":
        return symbolToString ? symbolToString(value) : "Symbol()";
      case "undefined":
        return objectToString(value);
      case "function":
      case "object": {
        if (value === null) return objectToString(value);
        const valueAsRecord = value;
        const valueToString = lookupGetter(valueAsRecord, "toString");
        if (typeof valueToString === "function") {
          const stringified = valueToString(valueAsRecord);
          return typeof stringified === "string" ? stringified : objectToString(stringified);
        }
        return objectToString(value);
      }
      default:
        return objectToString(value);
    }
  }
  function lookupGetter(object, prop) {
    while (object !== null) {
      const desc = getOwnPropertyDescriptor(object, prop);
      if (desc) {
        if (desc.get) return unapply(desc.get);
        if (typeof desc.value === "function") return unapply(desc.value);
      }
      object = getPrototypeOf(object);
    }
    function fallbackValue() {
      return null;
    }
    return fallbackValue;
  }
  function lookupAccessor(object, prop) {
    while (object !== null) {
      const desc = getOwnPropertyDescriptor(object, prop);
      if (desc) return desc.get ? unapply(desc.get) : null;
      object = getPrototypeOf(object);
    }
    return null;
  }
  function isRegex(value) {
    try {
      regExpTest(value, "");
      return true;
    } catch (_unused) {
      return false;
    }
  }
  var html$1 = freeze([
    "a",
    "abbr",
    "acronym",
    "address",
    "area",
    "article",
    "aside",
    "audio",
    "b",
    "bdi",
    "bdo",
    "big",
    "blink",
    "blockquote",
    "body",
    "br",
    "button",
    "canvas",
    "caption",
    "center",
    "cite",
    "code",
    "col",
    "colgroup",
    "content",
    "data",
    "datalist",
    "dd",
    "decorator",
    "del",
    "details",
    "dfn",
    "dialog",
    "dir",
    "div",
    "dl",
    "dt",
    "element",
    "em",
    "fieldset",
    "figcaption",
    "figure",
    "font",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hgroup",
    "hr",
    "html",
    "i",
    "img",
    "input",
    "ins",
    "kbd",
    "label",
    "legend",
    "li",
    "main",
    "map",
    "mark",
    "marquee",
    "menu",
    "menuitem",
    "meter",
    "nav",
    "nobr",
    "ol",
    "optgroup",
    "option",
    "output",
    "p",
    "picture",
    "pre",
    "progress",
    "q",
    "rp",
    "rt",
    "ruby",
    "s",
    "samp",
    "search",
    "section",
    "select",
    "shadow",
    "slot",
    "small",
    "source",
    "spacer",
    "span",
    "strike",
    "strong",
    "style",
    "sub",
    "summary",
    "sup",
    "table",
    "tbody",
    "td",
    "template",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "tr",
    "track",
    "tt",
    "u",
    "ul",
    "var",
    "video",
    "wbr"
  ]);
  var svg$1 = freeze([
    "svg",
    "a",
    "altglyph",
    "altglyphdef",
    "altglyphitem",
    "animatecolor",
    "animatemotion",
    "animatetransform",
    "circle",
    "clippath",
    "defs",
    "desc",
    "ellipse",
    "enterkeyhint",
    "exportparts",
    "filter",
    "font",
    "g",
    "glyph",
    "glyphref",
    "hkern",
    "image",
    "inputmode",
    "line",
    "lineargradient",
    "marker",
    "mask",
    "metadata",
    "mpath",
    "part",
    "path",
    "pattern",
    "polygon",
    "polyline",
    "radialgradient",
    "rect",
    "stop",
    "style",
    "switch",
    "symbol",
    "text",
    "textpath",
    "title",
    "tref",
    "tspan",
    "view",
    "vkern"
  ]);
  var svgFilters = freeze([
    "feBlend",
    "feColorMatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feDistantLight",
    "feDropShadow",
    "feFlood",
    "feFuncA",
    "feFuncB",
    "feFuncG",
    "feFuncR",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMergeNode",
    "feMorphology",
    "feOffset",
    "fePointLight",
    "feSpecularLighting",
    "feSpotLight",
    "feTile",
    "feTurbulence"
  ]);
  var svgDisallowed = freeze([
    "animate",
    "color-profile",
    "cursor",
    "discard",
    "font-face",
    "font-face-format",
    "font-face-name",
    "font-face-src",
    "font-face-uri",
    "foreignobject",
    "hatch",
    "hatchpath",
    "mesh",
    "meshgradient",
    "meshpatch",
    "meshrow",
    "missing-glyph",
    "script",
    "set",
    "solidcolor",
    "unknown",
    "use"
  ]);
  var mathMl$1 = freeze([
    "math",
    "menclose",
    "merror",
    "mfenced",
    "mfrac",
    "mglyph",
    "mi",
    "mlabeledtr",
    "mmultiscripts",
    "mn",
    "mo",
    "mover",
    "mpadded",
    "mphantom",
    "mroot",
    "mrow",
    "ms",
    "mspace",
    "msqrt",
    "mstyle",
    "msub",
    "msup",
    "msubsup",
    "mtable",
    "mtd",
    "mtext",
    "mtr",
    "munder",
    "munderover",
    "mprescripts"
  ]);
  var mathMlDisallowed = freeze([
    "maction",
    "maligngroup",
    "malignmark",
    "mlongdiv",
    "mscarries",
    "mscarry",
    "msgroup",
    "mstack",
    "msline",
    "msrow",
    "semantics",
    "annotation",
    "annotation-xml",
    "mprescripts",
    "none"
  ]);
  var text = freeze(["#text"]);
  var html = freeze([
    "accept",
    "action",
    "align",
    "alt",
    "autocapitalize",
    "autocomplete",
    "autopictureinpicture",
    "autoplay",
    "background",
    "bgcolor",
    "border",
    "capture",
    "cellpadding",
    "cellspacing",
    "checked",
    "cite",
    "class",
    "clear",
    "color",
    "cols",
    "colspan",
    "command",
    "commandfor",
    "controls",
    "controlslist",
    "coords",
    "crossorigin",
    "datetime",
    "decoding",
    "default",
    "dir",
    "disabled",
    "disablepictureinpicture",
    "disableremoteplayback",
    "download",
    "draggable",
    "enctype",
    "enterkeyhint",
    "exportparts",
    "face",
    "for",
    "headers",
    "height",
    "hidden",
    "high",
    "href",
    "hreflang",
    "id",
    "inert",
    "inputmode",
    "integrity",
    "ismap",
    "kind",
    "label",
    "lang",
    "list",
    "loading",
    "loop",
    "low",
    "max",
    "maxlength",
    "media",
    "method",
    "min",
    "minlength",
    "multiple",
    "muted",
    "name",
    "nonce",
    "noshade",
    "novalidate",
    "nowrap",
    "open",
    "optimum",
    "part",
    "pattern",
    "placeholder",
    "playsinline",
    "popover",
    "popovertarget",
    "popovertargetaction",
    "poster",
    "preload",
    "pubdate",
    "radiogroup",
    "readonly",
    "rel",
    "required",
    "rev",
    "reversed",
    "role",
    "rows",
    "rowspan",
    "spellcheck",
    "scope",
    "selected",
    "shape",
    "size",
    "sizes",
    "slot",
    "span",
    "srclang",
    "start",
    "src",
    "srcset",
    "step",
    "style",
    "summary",
    "tabindex",
    "title",
    "translate",
    "type",
    "usemap",
    "valign",
    "value",
    "width",
    "wrap",
    "xmlns"
  ]);
  var svg = freeze([
    "accent-height",
    "accumulate",
    "additive",
    "alignment-baseline",
    "amplitude",
    "ascent",
    "attributename",
    "attributetype",
    "azimuth",
    "basefrequency",
    "baseline-shift",
    "begin",
    "bias",
    "by",
    "class",
    "clip",
    "clippathunits",
    "clip-path",
    "clip-rule",
    "color",
    "color-interpolation",
    "color-interpolation-filters",
    "color-profile",
    "color-rendering",
    "cx",
    "cy",
    "d",
    "dx",
    "dy",
    "diffuseconstant",
    "direction",
    "display",
    "divisor",
    "dominant-baseline",
    "dur",
    "edgemode",
    "elevation",
    "end",
    "exponent",
    "fill",
    "fill-opacity",
    "fill-rule",
    "filter",
    "filterunits",
    "flood-color",
    "flood-opacity",
    "font-family",
    "font-size",
    "font-size-adjust",
    "font-stretch",
    "font-style",
    "font-variant",
    "font-weight",
    "fx",
    "fy",
    "g1",
    "g2",
    "glyph-name",
    "glyphref",
    "gradientunits",
    "gradienttransform",
    "height",
    "href",
    "id",
    "image-rendering",
    "in",
    "in2",
    "intercept",
    "k",
    "k1",
    "k2",
    "k3",
    "k4",
    "kerning",
    "keypoints",
    "keysplines",
    "keytimes",
    "lang",
    "lengthadjust",
    "letter-spacing",
    "kernelmatrix",
    "kernelunitlength",
    "lighting-color",
    "local",
    "marker-end",
    "marker-mid",
    "marker-start",
    "markerheight",
    "markerunits",
    "markerwidth",
    "maskcontentunits",
    "maskunits",
    "max",
    "mask",
    "mask-type",
    "media",
    "method",
    "mode",
    "min",
    "name",
    "numoctaves",
    "offset",
    "operator",
    "opacity",
    "order",
    "orient",
    "orientation",
    "origin",
    "overflow",
    "paint-order",
    "path",
    "pathlength",
    "patterncontentunits",
    "patterntransform",
    "patternunits",
    "pointer-events",
    "points",
    "preservealpha",
    "preserveaspectratio",
    "primitiveunits",
    "r",
    "rx",
    "ry",
    "radius",
    "refx",
    "refy",
    "repeatcount",
    "repeatdur",
    "restart",
    "result",
    "rotate",
    "scale",
    "seed",
    "shape-rendering",
    "slope",
    "specularconstant",
    "specularexponent",
    "spreadmethod",
    "startoffset",
    "stddeviation",
    "stitchtiles",
    "stop-color",
    "stop-opacity",
    "stroke-dasharray",
    "stroke-dashoffset",
    "stroke-linecap",
    "stroke-linejoin",
    "stroke-miterlimit",
    "stroke-opacity",
    "stroke",
    "stroke-width",
    "style",
    "surfacescale",
    "systemlanguage",
    "tabindex",
    "tablevalues",
    "targetx",
    "targety",
    "transform",
    "transform-origin",
    "text-anchor",
    "text-decoration",
    "text-orientation",
    "text-rendering",
    "textlength",
    "type",
    "u1",
    "u2",
    "unicode",
    "values",
    "vector-effect",
    "viewbox",
    "visibility",
    "version",
    "vert-adv-y",
    "vert-origin-x",
    "vert-origin-y",
    "width",
    "word-spacing",
    "wrap",
    "writing-mode",
    "xchannelselector",
    "ychannelselector",
    "x",
    "x1",
    "x2",
    "xmlns",
    "y",
    "y1",
    "y2",
    "z",
    "zoomandpan"
  ]);
  var mathMl = freeze([
    "accent",
    "accentunder",
    "align",
    "bevelled",
    "close",
    "columnalign",
    "columnlines",
    "columnspacing",
    "columnspan",
    "denomalign",
    "depth",
    "dir",
    "display",
    "displaystyle",
    "encoding",
    "fence",
    "frame",
    "height",
    "href",
    "id",
    "largeop",
    "length",
    "linethickness",
    "lquote",
    "lspace",
    "mathbackground",
    "mathcolor",
    "mathsize",
    "mathvariant",
    "maxsize",
    "minsize",
    "movablelimits",
    "notation",
    "numalign",
    "open",
    "rowalign",
    "rowlines",
    "rowspacing",
    "rowspan",
    "rspace",
    "rquote",
    "scriptlevel",
    "scriptminsize",
    "scriptsizemultiplier",
    "selection",
    "separator",
    "separators",
    "stretchy",
    "subscriptshift",
    "supscriptshift",
    "symmetric",
    "voffset",
    "width",
    "xmlns"
  ]);
  var xml = freeze([
    "xlink:href",
    "xml:id",
    "xlink:title",
    "xml:space",
    "xmlns:xlink"
  ]);
  var MUSTACHE_EXPR = seal(/{{[\w\W]*|^[\w\W]*}}/g);
  var ERB_EXPR = seal(/<%[\w\W]*|^[\w\W]*%>/g);
  var TMPLIT_EXPR = seal(/\${[\w\W]*/g);
  var DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]+$/);
  var ARIA_ATTR = seal(/^aria-[\-\w]+$/);
  var IS_ALLOWED_URI = seal(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i);
  var IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
  var ATTR_WHITESPACE = seal(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g);
  var DOCTYPE_NAME = seal(/^html$/i);
  var CUSTOM_ELEMENT = seal(/^[a-z][.\w]*(-[.\w]+)+$/i);
  var ELEMENT_MARKUP_PROBE = seal(/<[/\w!]/g);
  var COMMENT_MARKUP_PROBE = seal(/<[/\w]/g);
  var FALLBACK_TAG_CLOSE = seal(/<\/no(script|embed|frames)/i);
  var SELF_CLOSING_TAG = seal(/\/>/i);
  var NODE_TYPE = {
    element: 1,
    attribute: 2,
    text: 3,
    cdataSection: 4,
    entityReference: 5,
    entityNode: 6,
    processingInstruction: 7,
    comment: 8,
    document: 9,
    documentType: 10,
    documentFragment: 11,
    notation: 12
  };
  var LITERAL_TEXT_ELEMENTS = freeze(addToSet({}, [
    "style",
    "script",
    "xmp",
    "iframe",
    "noembed",
    "noframes",
    "plaintext",
    "noscript"
  ]));
  var getGlobal = function getGlobal2() {
    return typeof window === "undefined" ? null : window;
  };
  var _createTrustedTypesPolicy = function _createTrustedTypesPolicy2(trustedTypes, purifyHostElement) {
    if (typeof trustedTypes !== "object" || typeof trustedTypes.createPolicy !== "function") return null;
    let suffix = null;
    const ATTR_NAME = "data-tt-policy-suffix";
    if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) suffix = purifyHostElement.getAttribute(ATTR_NAME);
    const policyName = "dompurify" + (suffix ? "#" + suffix : "");
    try {
      return trustedTypes.createPolicy(policyName, {
        createHTML(html2) {
          return html2;
        },
        createScriptURL(scriptUrl) {
          return scriptUrl;
        }
      });
    } catch (_) {
      console.warn("TrustedTypes policy " + policyName + " could not be created.");
      return null;
    }
  };
  var _createHooksMap = function _createHooksMap2() {
    return {
      afterSanitizeAttributes: [],
      afterSanitizeElements: [],
      afterSanitizeShadowDOM: [],
      beforeSanitizeAttributes: [],
      beforeSanitizeElements: [],
      beforeSanitizeShadowDOM: [],
      uponSanitizeAttribute: [],
      uponSanitizeElement: [],
      uponSanitizeShadowNode: []
    };
  };
  var _resolveSetOption = function _resolveSetOption2(cfg, key, fallback, options) {
    return objectHasOwnProperty(cfg, key) && arrayIsArray(cfg[key]) ? addToSet(options.base ? clone(options.base) : {}, cfg[key], options.transform) : fallback;
  };
  var _resolveObjectOption = function _resolveObjectOption2(cfg, key, makeFallback) {
    const value = objectHasOwnProperty(cfg, key) ? cfg[key] : void 0;
    return value && typeof value === "object" ? clone(value) : makeFallback();
  };
  function createDOMPurify() {
    let window2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getGlobal();
    const DOMPurify = (root) => createDOMPurify(root);
    DOMPurify.version = "3.4.17";
    DOMPurify.removed = [];
    if (!window2 || !window2.document || window2.document.nodeType !== NODE_TYPE.document || !window2.Element) {
      DOMPurify.isSupported = false;
      return DOMPurify;
    }
    let document2 = window2.document;
    const originalDocument = document2;
    const currentScript = originalDocument.currentScript;
    window2.DocumentFragment;
    const HTMLTemplateElement = window2.HTMLTemplateElement, Node2 = window2.Node, Element = window2.Element, NodeFilter = window2.NodeFilter;
    window2.NamedNodeMap === void 0 && (window2.NamedNodeMap || window2.MozNamedAttrMap);
    window2.HTMLFormElement;
    const DOMParser2 = window2.DOMParser, trustedTypes = window2.trustedTypes;
    const ElementPrototype = Element.prototype;
    const cloneNode = lookupGetter(ElementPrototype, "cloneNode");
    const remove = lookupGetter(ElementPrototype, "remove");
    const removeAttributeNode = lookupGetter(ElementPrototype, "removeAttributeNode");
    const getNextSibling = lookupGetter(ElementPrototype, "nextSibling");
    const getChildNodes = lookupGetter(ElementPrototype, "childNodes");
    const getParentNode = lookupGetter(ElementPrototype, "parentNode");
    const getShadowRoot = lookupGetter(ElementPrototype, "shadowRoot");
    const getAttributes = lookupGetter(ElementPrototype, "attributes");
    const getNodeType = Node2 && Node2.prototype ? lookupGetter(Node2.prototype, "nodeType") : null;
    const getNodeName = Node2 && Node2.prototype ? lookupGetter(Node2.prototype, "nodeName") : null;
    const getOwnerDocument = Node2 && Node2.prototype ? lookupGetter(Node2.prototype, "ownerDocument") : null;
    const _readNodeType = function _readNodeType2(node) {
      return getNodeType ? getNodeType(node) : node.nodeType;
    };
    const _readNodeName = function _readNodeName2(node) {
      return getNodeName ? getNodeName(node) : node.nodeName;
    };
    const getNamespaceURI = lookupAccessor(ElementPrototype, "namespaceURI");
    const _readNamespaceURI = function _readNamespaceURI2(element2) {
      return getNamespaceURI ? getNamespaceURI(element2) : element2.namespaceURI;
    };
    if (typeof HTMLTemplateElement === "function") {
      const template = document2.createElement("template");
      if (template.content && template.content.ownerDocument) document2 = template.content.ownerDocument;
    }
    let trustedTypesPolicy;
    let emptyHTML = "";
    let defaultTrustedTypesPolicy;
    let defaultTrustedTypesPolicyResolved = false;
    let IN_TRUSTED_TYPES_POLICY = 0;
    const _assertNotInTrustedTypesPolicy = function _assertNotInTrustedTypesPolicy2() {
      if (IN_TRUSTED_TYPES_POLICY > 0) throw typeErrorCreate('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');
    };
    const _createTrustedHTML = function _createTrustedHTML2(html2) {
      _assertNotInTrustedTypesPolicy();
      IN_TRUSTED_TYPES_POLICY++;
      try {
        return trustedTypesPolicy.createHTML(html2);
      } finally {
        IN_TRUSTED_TYPES_POLICY--;
      }
    };
    const _createTrustedScriptURL = function _createTrustedScriptURL2(scriptUrl) {
      _assertNotInTrustedTypesPolicy();
      IN_TRUSTED_TYPES_POLICY++;
      try {
        return trustedTypesPolicy.createScriptURL(scriptUrl);
      } finally {
        IN_TRUSTED_TYPES_POLICY--;
      }
    };
    const _getDefaultTrustedTypesPolicy = function _getDefaultTrustedTypesPolicy2() {
      if (!defaultTrustedTypesPolicyResolved) {
        defaultTrustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
        defaultTrustedTypesPolicyResolved = true;
      }
      return defaultTrustedTypesPolicy;
    };
    const _document = document2, implementation = _document.implementation, createNodeIterator = _document.createNodeIterator, createDocumentFragment = _document.createDocumentFragment, getElementsByTagName = _document.getElementsByTagName;
    const importNode = originalDocument.importNode;
    let hooks = _createHooksMap();
    DOMPurify.isSupported = typeof entries === "function" && typeof getParentNode === "function" && implementation && implementation.createHTMLDocument !== void 0;
    const MUSTACHE_EXPR$1 = MUSTACHE_EXPR, ERB_EXPR$1 = ERB_EXPR, TMPLIT_EXPR$1 = TMPLIT_EXPR, DATA_ATTR$1 = DATA_ATTR, ARIA_ATTR$1 = ARIA_ATTR, IS_SCRIPT_OR_DATA$1 = IS_SCRIPT_OR_DATA, ATTR_WHITESPACE$1 = ATTR_WHITESPACE, CUSTOM_ELEMENT$1 = CUSTOM_ELEMENT;
    let IS_ALLOWED_URI$1 = IS_ALLOWED_URI;
    let ALLOWED_TAGS = null;
    const DEFAULT_ALLOWED_TAGS = addToSet({}, [
      ...html$1,
      ...svg$1,
      ...svgFilters,
      ...mathMl$1,
      ...text
    ]);
    let ALLOWED_ATTR = null;
    const DEFAULT_ALLOWED_ATTR = addToSet({}, [
      ...html,
      ...svg,
      ...mathMl,
      ...xml
    ]);
    let CUSTOM_ELEMENT_HANDLING = Object.seal(create(null, {
      tagNameCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      },
      attributeNameCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      },
      allowCustomizedBuiltInElements: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: false
      }
    }));
    let FORBID_TAGS = null;
    let FORBID_ATTR = null;
    const EXTRA_ELEMENT_HANDLING = Object.seal(create(null, {
      tagCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      },
      attributeCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      }
    }));
    let ALLOW_ARIA_ATTR = true;
    let ALLOW_DATA_ATTR = true;
    let ALLOW_UNKNOWN_PROTOCOLS = false;
    let ALLOW_SELF_CLOSE_IN_ATTR = true;
    let SAFE_FOR_TEMPLATES = false;
    let SAFE_FOR_XML = true;
    let WHOLE_DOCUMENT = false;
    let SET_CONFIG = false;
    let SET_CONFIG_ALLOWED_TAGS = null;
    let SET_CONFIG_ALLOWED_ATTR = null;
    let FORCE_BODY = false;
    let RETURN_DOM = false;
    let RETURN_DOM_FRAGMENT = false;
    let RETURN_TRUSTED_TYPE = false;
    let SANITIZE_DOM = true;
    let SANITIZE_NAMED_PROPS = false;
    const SANITIZE_NAMED_PROPS_PREFIX = "user-content-";
    let KEEP_CONTENT = true;
    let IN_PLACE = false;
    let IN_PLACE_VISITED = null;
    let USE_PROFILES = {};
    let FORBID_CONTENTS = null;
    const DEFAULT_FORBID_CONTENTS = addToSet({}, [
      "annotation-xml",
      "audio",
      "colgroup",
      "desc",
      "foreignobject",
      "head",
      "iframe",
      "math",
      "mi",
      "mn",
      "mo",
      "ms",
      "mtext",
      "noembed",
      "noframes",
      "noscript",
      "plaintext",
      "script",
      "selectedcontent",
      "style",
      "svg",
      "template",
      "thead",
      "title",
      "video",
      "xmp"
    ]);
    let DATA_URI_TAGS = null;
    const DEFAULT_DATA_URI_TAGS = addToSet({}, [
      "audio",
      "video",
      "img",
      "source",
      "image",
      "track"
    ]);
    let URI_SAFE_ATTRIBUTES = null;
    const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, [
      "alt",
      "class",
      "for",
      "id",
      "label",
      "name",
      "pattern",
      "placeholder",
      "role",
      "summary",
      "title",
      "value",
      "style",
      "xmlns"
    ]);
    const MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
    const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
    const HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
    let NAMESPACE = HTML_NAMESPACE;
    let IS_EMPTY_INPUT = false;
    let ALLOWED_NAMESPACES = null;
    const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [
      MATHML_NAMESPACE,
      SVG_NAMESPACE,
      HTML_NAMESPACE
    ], stringToString);
    const DEFAULT_MATHML_TEXT_INTEGRATION_POINTS = freeze([
      "mi",
      "mo",
      "mn",
      "ms",
      "mtext"
    ]);
    let MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, DEFAULT_MATHML_TEXT_INTEGRATION_POINTS);
    const DEFAULT_HTML_INTEGRATION_POINTS = freeze(["annotation-xml"]);
    let HTML_INTEGRATION_POINTS = addToSet({}, DEFAULT_HTML_INTEGRATION_POINTS);
    const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, [
      "title",
      "style",
      "font",
      "a",
      "script"
    ]);
    let PARSER_MEDIA_TYPE = null;
    const SUPPORTED_PARSER_MEDIA_TYPES = ["application/xhtml+xml", "text/html"];
    const DEFAULT_PARSER_MEDIA_TYPE = "text/html";
    let transformCaseFunc = null;
    let CONFIG = null;
    const formElement = document2.createElement("form");
    const isRegexOrFunction = function isRegexOrFunction2(testValue) {
      return testValue instanceof RegExp || testValue instanceof Function;
    };
    const _parseConfig = function _parseConfig2() {
      let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      if (CONFIG && CONFIG === cfg) return;
      if (!cfg || typeof cfg !== "object") cfg = {};
      cfg = clone(cfg);
      PARSER_MEDIA_TYPE = SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? DEFAULT_PARSER_MEDIA_TYPE : cfg.PARSER_MEDIA_TYPE;
      transformCaseFunc = PARSER_MEDIA_TYPE === "application/xhtml+xml" ? stringToString : stringToLowerCase;
      ALLOWED_TAGS = _resolveSetOption(cfg, "ALLOWED_TAGS", DEFAULT_ALLOWED_TAGS, { transform: transformCaseFunc });
      ALLOWED_ATTR = _resolveSetOption(cfg, "ALLOWED_ATTR", DEFAULT_ALLOWED_ATTR, { transform: transformCaseFunc });
      ALLOWED_NAMESPACES = _resolveSetOption(cfg, "ALLOWED_NAMESPACES", DEFAULT_ALLOWED_NAMESPACES, { transform: stringToString });
      URI_SAFE_ATTRIBUTES = _resolveSetOption(cfg, "ADD_URI_SAFE_ATTR", DEFAULT_URI_SAFE_ATTRIBUTES, {
        transform: transformCaseFunc,
        base: DEFAULT_URI_SAFE_ATTRIBUTES
      });
      DATA_URI_TAGS = _resolveSetOption(cfg, "ADD_DATA_URI_TAGS", DEFAULT_DATA_URI_TAGS, {
        transform: transformCaseFunc,
        base: DEFAULT_DATA_URI_TAGS
      });
      FORBID_CONTENTS = _resolveSetOption(cfg, "FORBID_CONTENTS", DEFAULT_FORBID_CONTENTS, { transform: transformCaseFunc });
      FORBID_TAGS = _resolveSetOption(cfg, "FORBID_TAGS", clone({}), { transform: transformCaseFunc });
      FORBID_ATTR = _resolveSetOption(cfg, "FORBID_ATTR", clone({}), { transform: transformCaseFunc });
      USE_PROFILES = objectHasOwnProperty(cfg, "USE_PROFILES") ? cfg.USE_PROFILES && typeof cfg.USE_PROFILES === "object" ? clone(cfg.USE_PROFILES) : cfg.USE_PROFILES : false;
      ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false;
      ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false;
      ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false;
      ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false;
      SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false;
      SAFE_FOR_XML = cfg.SAFE_FOR_XML !== false;
      WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false;
      RETURN_DOM = cfg.RETURN_DOM || false;
      RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false;
      RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false;
      FORCE_BODY = cfg.FORCE_BODY || false;
      SANITIZE_DOM = cfg.SANITIZE_DOM !== false;
      SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false;
      KEEP_CONTENT = cfg.KEEP_CONTENT !== false;
      IN_PLACE = cfg.IN_PLACE || false;
      IS_ALLOWED_URI$1 = isRegex(cfg.ALLOWED_URI_REGEXP) ? cfg.ALLOWED_URI_REGEXP : IS_ALLOWED_URI;
      NAMESPACE = typeof cfg.NAMESPACE === "string" ? cfg.NAMESPACE : HTML_NAMESPACE;
      MATHML_TEXT_INTEGRATION_POINTS = _resolveObjectOption(cfg, "MATHML_TEXT_INTEGRATION_POINTS", () => addToSet({}, DEFAULT_MATHML_TEXT_INTEGRATION_POINTS));
      HTML_INTEGRATION_POINTS = _resolveObjectOption(cfg, "HTML_INTEGRATION_POINTS", () => addToSet({}, DEFAULT_HTML_INTEGRATION_POINTS));
      const customElementHandling = _resolveObjectOption(cfg, "CUSTOM_ELEMENT_HANDLING", () => create(null));
      CUSTOM_ELEMENT_HANDLING = create(null);
      if (objectHasOwnProperty(customElementHandling, "tagNameCheck") && isRegexOrFunction(customElementHandling.tagNameCheck)) CUSTOM_ELEMENT_HANDLING.tagNameCheck = customElementHandling.tagNameCheck;
      if (objectHasOwnProperty(customElementHandling, "attributeNameCheck") && isRegexOrFunction(customElementHandling.attributeNameCheck)) CUSTOM_ELEMENT_HANDLING.attributeNameCheck = customElementHandling.attributeNameCheck;
      if (objectHasOwnProperty(customElementHandling, "allowCustomizedBuiltInElements") && typeof customElementHandling.allowCustomizedBuiltInElements === "boolean") CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = customElementHandling.allowCustomizedBuiltInElements;
      seal(CUSTOM_ELEMENT_HANDLING);
      if (SAFE_FOR_TEMPLATES) ALLOW_DATA_ATTR = false;
      if (RETURN_DOM_FRAGMENT) RETURN_DOM = true;
      if (USE_PROFILES) {
        ALLOWED_TAGS = addToSet({}, text);
        ALLOWED_ATTR = create(null);
        if (USE_PROFILES.html === true) {
          addToSet(ALLOWED_TAGS, html$1);
          addToSet(ALLOWED_ATTR, html);
        }
        if (USE_PROFILES.svg === true) {
          addToSet(ALLOWED_TAGS, svg$1);
          addToSet(ALLOWED_ATTR, svg);
          addToSet(ALLOWED_ATTR, xml);
        }
        if (USE_PROFILES.svgFilters === true) {
          addToSet(ALLOWED_TAGS, svgFilters);
          addToSet(ALLOWED_ATTR, svg);
          addToSet(ALLOWED_ATTR, xml);
        }
        if (USE_PROFILES.mathMl === true) {
          addToSet(ALLOWED_TAGS, mathMl$1);
          addToSet(ALLOWED_ATTR, mathMl);
          addToSet(ALLOWED_ATTR, xml);
        }
      }
      EXTRA_ELEMENT_HANDLING.tagCheck = null;
      EXTRA_ELEMENT_HANDLING.attributeCheck = null;
      if (objectHasOwnProperty(cfg, "ADD_TAGS")) {
        if (typeof cfg.ADD_TAGS === "function") EXTRA_ELEMENT_HANDLING.tagCheck = cfg.ADD_TAGS;
        else if (arrayIsArray(cfg.ADD_TAGS)) {
          if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) ALLOWED_TAGS = clone(ALLOWED_TAGS);
          addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
        }
      }
      if (objectHasOwnProperty(cfg, "ADD_ATTR")) {
        if (typeof cfg.ADD_ATTR === "function") EXTRA_ELEMENT_HANDLING.attributeCheck = cfg.ADD_ATTR;
        else if (arrayIsArray(cfg.ADD_ATTR)) {
          if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) ALLOWED_ATTR = clone(ALLOWED_ATTR);
          addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
        }
      }
      if (objectHasOwnProperty(cfg, "ADD_FORBID_CONTENTS") && arrayIsArray(cfg.ADD_FORBID_CONTENTS)) {
        if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) FORBID_CONTENTS = clone(FORBID_CONTENTS);
        addToSet(FORBID_CONTENTS, cfg.ADD_FORBID_CONTENTS, transformCaseFunc);
      }
      if (KEEP_CONTENT) ALLOWED_TAGS["#text"] = true;
      if (WHOLE_DOCUMENT) addToSet(ALLOWED_TAGS, [
        "html",
        "head",
        "body"
      ]);
      if (ALLOWED_TAGS.table) {
        addToSet(ALLOWED_TAGS, ["tbody"]);
        delete FORBID_TAGS.tbody;
      }
      if (cfg.TRUSTED_TYPES_POLICY) {
        if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== "function") throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== "function") throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        const previousTrustedTypesPolicy = trustedTypesPolicy;
        trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY;
        try {
          emptyHTML = _createTrustedHTML("");
        } catch (error) {
          trustedTypesPolicy = previousTrustedTypesPolicy;
          throw error;
        }
      } else if (cfg.TRUSTED_TYPES_POLICY === null) {
        trustedTypesPolicy = void 0;
        emptyHTML = "";
      } else {
        if (trustedTypesPolicy === void 0) trustedTypesPolicy = _getDefaultTrustedTypesPolicy();
        if (trustedTypesPolicy && typeof emptyHTML === "string") emptyHTML = _createTrustedHTML("");
      }
      if (freeze) freeze(cfg);
      CONFIG = cfg;
    };
    const ALL_SVG_TAGS = addToSet({}, [
      ...svg$1,
      ...svgFilters,
      ...svgDisallowed
    ]);
    const ALL_MATHML_TAGS = addToSet({}, [...mathMl$1, ...mathMlDisallowed]);
    const _checkSvgNamespace = function _checkSvgNamespace2(tagName, parent, parentTagName) {
      if (parent.namespaceURI === HTML_NAMESPACE) return tagName === "svg";
      if (parent.namespaceURI === MATHML_NAMESPACE) return tagName === "svg" && (parentTagName === "annotation-xml" || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
      return Boolean(ALL_SVG_TAGS[tagName]);
    };
    const _checkMathMlNamespace = function _checkMathMlNamespace2(tagName, parent, parentTagName) {
      if (parent.namespaceURI === HTML_NAMESPACE) return tagName === "math";
      if (parent.namespaceURI === SVG_NAMESPACE) return tagName === "math" && HTML_INTEGRATION_POINTS[parentTagName];
      return Boolean(ALL_MATHML_TAGS[tagName]);
    };
    const _checkHtmlNamespace = function _checkHtmlNamespace2(tagName, parent, parentTagName) {
      if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) return false;
      if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) return false;
      return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
    };
    const _checkValidNamespace = function _checkValidNamespace2(element2) {
      const elementNamespace = _readNamespaceURI(element2);
      const tagName = stringToLowerCase(_readNodeName(element2));
      const parentNode = getParentNode(element2);
      let parent;
      let parentTagName;
      if (parentNode && _readNodeType(parentNode) === NODE_TYPE.element) {
        parent = { namespaceURI: _readNamespaceURI(parentNode) };
        parentTagName = stringToLowerCase(_readNodeName(parentNode));
      } else {
        parent = { namespaceURI: NAMESPACE };
        parentTagName = "template";
      }
      if (!ALLOWED_NAMESPACES[elementNamespace]) return false;
      if (elementNamespace === SVG_NAMESPACE) return _checkSvgNamespace(tagName, parent, parentTagName);
      if (elementNamespace === MATHML_NAMESPACE) return _checkMathMlNamespace(tagName, parent, parentTagName);
      if (elementNamespace === HTML_NAMESPACE) return _checkHtmlNamespace(tagName, parent, parentTagName);
      if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && ALLOWED_NAMESPACES[elementNamespace]) return true;
      return false;
    };
    const _forceRemove = function _forceRemove2(node) {
      arrayPush(DOMPurify.removed, { element: node });
      try {
        getParentNode(node).removeChild(node);
      } catch (_) {
        remove(node);
        if (!getParentNode(node)) throw typeErrorCreate("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
      }
    };
    const _stripAttributeNode = function _stripAttributeNode2(element2, attribute, name) {
      try {
        removeAttributeNode(element2, attribute);
      } catch (_) {
        try {
          element2.removeAttribute(name);
        } catch (_2) {
        }
      }
    };
    const _neutralizeRoot = function _neutralizeRoot2(root) {
      _neutralizeSubtree(root);
      const childNodes = getChildNodes(root);
      if (childNodes) arrayForEach(arraySlice(childNodes), (child) => {
        try {
          remove(child);
        } catch (_) {
        }
      });
      const attributes = _readNodeType(root) === NODE_TYPE.element ? getAttributes(root) : null;
      if (attributes) for (let i = attributes.length - 1; i >= 0; --i) {
        const attribute = attributes[i];
        const name = attribute && attribute.name;
        if (typeof name === "string") _stripAttributeNode(root, attribute, name);
      }
    };
    const _removeAttribute = function _removeAttribute2(name, element2, attr) {
      if (!attr) try {
        attr = element2.getAttributeNode(name);
      } catch (_) {
        attr = null;
      }
      arrayPush(DOMPurify.removed, {
        attribute: attr || null,
        from: element2
      });
      try {
        if (attr) removeAttributeNode(element2, attr);
        else element2.removeAttribute(name);
      } catch (_) {
        try {
          element2.removeAttribute(name);
        } catch (_2) {
        }
      }
      if (name === "is") {
        if (RETURN_DOM || RETURN_DOM_FRAGMENT) try {
          _forceRemove(element2);
        } catch (_) {
        }
        else try {
          element2.setAttribute(name, "");
        } catch (_) {
        }
      }
    };
    const _stripDisallowedAttributes = function _stripDisallowedAttributes2(element2) {
      const attributes = getAttributes(element2);
      if (!attributes) return;
      for (let i = attributes.length - 1; i >= 0; --i) {
        const attribute = attributes[i];
        const name = attribute && attribute.name;
        if (typeof name !== "string" || ALLOWED_ATTR[transformCaseFunc(name)]) continue;
        _stripAttributeNode(element2, attribute, name);
      }
    };
    const _walkTree = function _walkTree2(root, visit) {
      let intoShadow = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
      const stack = [root];
      while (stack.length > 0) {
        const node = stack.pop();
        if (visit(node) === false) continue;
        if (intoShadow && _readNodeType(node) === NODE_TYPE.element) {
          const shadowRoot = getShadowRoot(node);
          if (_isDocumentFragment(shadowRoot)) stack.push(shadowRoot);
        }
        const childNodes = getChildNodes(node);
        if (childNodes) for (let i = childNodes.length - 1; i >= 0; --i) stack.push(childNodes[i]);
      }
    };
    const _neutralizeSubtree = function _neutralizeSubtree2(root) {
      _walkTree(root, (node) => {
        if (_readNodeType(node) === NODE_TYPE.element) _stripDisallowedAttributes(node);
      });
    };
    const _collectLiveNodes = function _collectLiveNodes2(root) {
      const nodes = [];
      _walkTree(root, (node) => {
        nodes.push(node);
      }, true);
      return nodes;
    };
    const _neutralizeEscapedElements = function _neutralizeEscapedElements2(root, before) {
      const reachable = setCreate();
      arrayForEach(_collectLiveNodes(root), (node) => {
        if (_readNodeType(node) === NODE_TYPE.element) setAdd(reachable, node);
      });
      arrayForEach(before, (node) => {
        if (_readNodeType(node) === NODE_TYPE.element && !setHas(reachable, node)) _stripDisallowedAttributes(node);
      });
    };
    const _neutralizeDiscarded = function _neutralizeDiscarded2(root, before) {
      let rootRemoved = false;
      arrayForEach(DOMPurify.removed, (entry) => {
        if (entry.element) {
          rootRemoved = rootRemoved || entry.element === root;
          _neutralizeSubtree(entry.element);
        }
      });
      _neutralizeEscapedElements(root, before);
      return rootRemoved;
    };
    const MAX_UNVISITED_ROUNDS = 8;
    const _sanitizeUnvisitedNodes = function _sanitizeUnvisitedNodes2(root, before) {
      const visited = IN_PLACE_VISITED;
      let original = null;
      const getOriginal = () => {
        if (!original) {
          original = setCreate();
          arrayForEach(before, (beforeNode) => {
            setAdd(original, beforeNode);
          });
        }
        return original;
      };
      for (let round = 0; ; round++) {
        const live = _collectLiveNodes(root);
        const containers = [root];
        let pending = false;
        arrayForEach(live, (node) => {
          if (_readNodeType(node) === NODE_TYPE.documentFragment) arrayPush(containers, node);
          else if (!pending && !setHas(visited, node)) pending = setHas(getOriginal(), node);
        });
        if (!pending) return;
        if (round >= MAX_UNVISITED_ROUNDS) throw typeErrorCreate("the tree kept changing during in-place sanitization; refusing to return it");
        arrayForEach(containers, (container, index) => {
          _sanitizeUnvisitedIn(container, index > 0, root, getOriginal());
        });
      }
    };
    const _sanitizeUnvisitedIn = function _sanitizeUnvisitedIn2(container, inShadow, root, original) {
      const iterator = _createNodeIterator(container);
      let node;
      while (node = iterator.nextNode()) {
        if (!setHas(original, node) || setHas(IN_PLACE_VISITED, node)) continue;
        if (inShadow) _executeHooks(hooks.uponSanitizeShadowNode, node, null);
        _sanitizeElements(node, root);
        _sanitizeAttributes(node, root);
        if (_isDocumentFragment(node.content)) _sanitizeShadowDOM2(node.content);
      }
    };
    const _markVisited = function _markVisited2(node) {
      if (IN_PLACE_VISITED) setAdd(IN_PLACE_VISITED, node);
    };
    const _isPatchLinkageAttribute = function _isPatchLinkageAttribute2(lcName, lcTag) {
      if (!SAFE_FOR_XML) return false;
      if (lcName === "patchsrc") return true;
      return lcName === "for" && lcTag !== "label" && lcTag !== "output";
    };
    const _neutralizePatchLinkage = function _neutralizePatchLinkage2(root) {
      if (!SAFE_FOR_XML) return;
      _walkTree(root, (node) => {
        const nodeType = _readNodeType(node);
        if (nodeType === NODE_TYPE.processingInstruction || nodeType === NODE_TYPE.comment && regExpTest(COMMENT_MARKUP_PROBE, node.data)) {
          try {
            remove(node);
          } catch (_) {
          }
          return false;
        }
        if (nodeType === NODE_TYPE.element) {
          const element2 = node;
          const lcTag = transformCaseFunc(_readNodeName(node));
          try {
            if (element2.hasAttribute && element2.hasAttribute("patchsrc")) element2.removeAttribute("patchsrc");
            if (element2.hasAttribute && element2.hasAttribute("for") && _isPatchLinkageAttribute("for", lcTag)) element2.removeAttribute("for");
          } catch (_) {
          }
        }
        return true;
      });
    };
    const _initDocument = function _initDocument2(dirty) {
      let doc = null;
      let leadingWhitespace = null;
      if (FORCE_BODY) dirty = "<remove></remove>" + dirty;
      else {
        const matches = stringMatch(dirty, /^[\r\n\t ]+/);
        leadingWhitespace = matches && matches[0];
      }
      if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && NAMESPACE === HTML_NAMESPACE) dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + "</body></html>";
      const dirtyPayload = trustedTypesPolicy ? _createTrustedHTML(dirty) : dirty;
      if (NAMESPACE === HTML_NAMESPACE) try {
        doc = new DOMParser2().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
      } catch (_) {
      }
      if (!doc || !doc.documentElement) {
        doc = implementation.createDocument(NAMESPACE, "template", null);
        try {
          doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
        } catch (_) {
        }
      }
      const body = doc.body || doc.documentElement;
      if (dirty && leadingWhitespace) body.insertBefore(document2.createTextNode(leadingWhitespace), body.childNodes[0] || null);
      if (NAMESPACE === HTML_NAMESPACE) return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? "html" : "body")[0];
      return WHOLE_DOCUMENT ? doc.documentElement : body;
    };
    const _createNodeIterator = function _createNodeIterator2(root) {
      const doc = getOwnerDocument ? getOwnerDocument(root) : root.ownerDocument;
      return createNodeIterator.call(doc || root, root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT | NodeFilter.SHOW_PROCESSING_INSTRUCTION | NodeFilter.SHOW_CDATA_SECTION, null);
    };
    const _stripTemplateExpressions = function _stripTemplateExpressions2(value) {
      value = stringReplace(value, MUSTACHE_EXPR$1, " ");
      value = stringReplace(value, ERB_EXPR$1, " ");
      value = stringReplace(value, TMPLIT_EXPR$1, " ");
      return value;
    };
    const _scrubTemplateExpressions2 = function _scrubTemplateExpressions(node) {
      var _node$querySelectorAl;
      _scrubOwnCharacterData(node);
      const templates = (_node$querySelectorAl = node.querySelectorAll) === null || _node$querySelectorAl === void 0 ? void 0 : _node$querySelectorAl.call(node, "template");
      if (templates) arrayForEach(templates, (tmpl) => {
        if (_isDocumentFragment(tmpl.content)) _scrubTemplateExpressions2(tmpl.content);
      });
    };
    const _scrubOwnCharacterData = function _scrubOwnCharacterData2(node) {
      node.normalize();
      const doc = getOwnerDocument ? getOwnerDocument(node) : node.ownerDocument;
      const walker = createNodeIterator.call(doc || node, node, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_CDATA_SECTION | NodeFilter.SHOW_PROCESSING_INSTRUCTION, null);
      let currentNode = walker.nextNode();
      while (currentNode) {
        currentNode.data = _stripTemplateExpressions(currentNode.data);
        currentNode = walker.nextNode();
      }
    };
    const _isClobbered = function _isClobbered2(element2) {
      const realTagName = getNodeName ? getNodeName(element2) : null;
      if (typeof realTagName !== "string") return false;
      if (transformCaseFunc(realTagName) !== "form") return false;
      return typeof element2.nodeName !== "string" || typeof element2.textContent !== "string" || typeof element2.removeChild !== "function" || element2.attributes !== getAttributes(element2) || typeof element2.removeAttribute !== "function" || typeof element2.removeAttributeNode !== "function" || typeof element2.getAttributeNode !== "function" || typeof element2.setAttribute !== "function" || typeof element2.namespaceURI !== "string" || typeof element2.insertBefore !== "function" || typeof element2.hasChildNodes !== "function" || element2.nodeType !== getNodeType(element2) || element2.childNodes !== getChildNodes(element2);
    };
    const _isDocumentFragment = function _isDocumentFragment2(value) {
      if (!getNodeType || typeof value !== "object" || value === null) return false;
      try {
        return getNodeType(value) === NODE_TYPE.documentFragment;
      } catch (_) {
        return false;
      }
    };
    const _isNode = function _isNode2(value) {
      if (!getNodeType || typeof value !== "object" || value === null) return false;
      try {
        return typeof getNodeType(value) === "number";
      } catch (_) {
        return false;
      }
    };
    function _executeHooks(hooks2, currentNode, data) {
      if (hooks2.length === 0) return;
      arrayForEach(hooks2, (hook) => {
        hook.call(DOMPurify, currentNode, data, CONFIG);
      });
    }
    const _isUnsafeNode = function _isUnsafeNode2(currentNode, tagName) {
      if (SAFE_FOR_XML && currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && regExpTest(ELEMENT_MARKUP_PROBE, currentNode.textContent) && regExpTest(ELEMENT_MARKUP_PROBE, currentNode.innerHTML)) return true;
      if (SAFE_FOR_XML && LITERAL_TEXT_ELEMENTS[tagName] && _readNodeType(currentNode) === NODE_TYPE.element && _readNamespaceURI(currentNode) === HTML_NAMESPACE && (_isNode(currentNode.firstElementChild) || typeof currentNode.textContent === "string" && regExpTest(ELEMENT_MARKUP_PROBE, currentNode.textContent))) return true;
      if (currentNode.nodeType === NODE_TYPE.processingInstruction) return true;
      if (SAFE_FOR_XML && currentNode.nodeType === NODE_TYPE.comment && regExpTest(COMMENT_MARKUP_PROBE, currentNode.data)) return true;
      return false;
    };
    const _matchesNameCheck = function _matchesNameCheck2(check, name) {
      if (check instanceof RegExp) return regExpTest(check, name);
      if (check instanceof Function) {
        for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) args[_key - 2] = arguments[_key];
        return Boolean(check(name, ...args));
      }
      return false;
    };
    const _sanitizeDisallowedNode = function _sanitizeDisallowedNode2(currentNode, tagName, root) {
      if (!FORBID_TAGS[tagName] && _isBasicCustomElement(tagName) && _matchesNameCheck(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) return false;
      if (KEEP_CONTENT && !FORBID_CONTENTS[tagName] && !FORBID_CONTENTS[stringToLowerCase(tagName)]) {
        const parentNode = getParentNode(currentNode);
        const childNodes = getChildNodes(currentNode);
        if (childNodes && parentNode) {
          const childCount = childNodes.length;
          for (let i = childCount - 1; i >= 0; --i) {
            const hoisted = currentNode === root ? cloneNode(childNodes[i], true) : childNodes[i];
            parentNode.insertBefore(hoisted, getNextSibling(currentNode));
          }
        }
      }
      _forceRemove(currentNode);
      return true;
    };
    const _forkSharedAllowlist = function _forkSharedAllowlist2(hookList, set, defaultSet, setConfigSet) {
      if (hookList.length === 0) return set;
      return set === defaultSet || set === setConfigSet ? clone(set) : set;
    };
    const _handleHookDetachedNode = function _handleHookDetachedNode2(currentNode, root) {
      if (currentNode === root || getParentNode(currentNode) !== null) return false;
      if (IN_PLACE) _neutralizeSubtree(currentNode);
      return true;
    };
    const _sanitizeElements = function _sanitizeElements2(currentNode, root) {
      _markVisited(currentNode);
      _executeHooks(hooks.beforeSanitizeElements, currentNode, null);
      if (_handleHookDetachedNode(currentNode, root)) return true;
      if (_isClobbered(currentNode)) {
        _forceRemove(currentNode);
        return true;
      }
      const tagName = transformCaseFunc(_readNodeName(currentNode));
      ALLOWED_TAGS = _forkSharedAllowlist(hooks.uponSanitizeElement, ALLOWED_TAGS, DEFAULT_ALLOWED_TAGS, SET_CONFIG_ALLOWED_TAGS);
      _executeHooks(hooks.uponSanitizeElement, currentNode, {
        tagName,
        allowedTags: ALLOWED_TAGS
      });
      if (_handleHookDetachedNode(currentNode, root)) return true;
      if (_isUnsafeNode(currentNode, tagName)) {
        _forceRemove(currentNode);
        return true;
      }
      if (FORBID_TAGS[tagName] || !(EXTRA_ELEMENT_HANDLING.tagCheck instanceof Function && EXTRA_ELEMENT_HANDLING.tagCheck(tagName)) && !ALLOWED_TAGS[tagName]) {
        const removed = _sanitizeDisallowedNode(currentNode, tagName, root);
        if (removed === false) {
          _executeHooks(hooks.afterSanitizeElements, currentNode, null);
          if (_handleHookDetachedNode(currentNode, root)) return true;
        }
        return removed;
      }
      if (_readNodeType(currentNode) === NODE_TYPE.element && !_checkValidNamespace(currentNode)) {
        _forceRemove(currentNode);
        return true;
      }
      if ((tagName === "noscript" || tagName === "noembed" || tagName === "noframes") && regExpTest(FALLBACK_TAG_CLOSE, currentNode.innerHTML)) {
        _forceRemove(currentNode);
        return true;
      }
      if (SAFE_FOR_TEMPLATES && currentNode.nodeType === NODE_TYPE.text) {
        const content = _stripTemplateExpressions(currentNode.textContent);
        if (currentNode.textContent !== content) {
          arrayPush(DOMPurify.removed, { element: currentNode.cloneNode() });
          currentNode.textContent = content;
        }
      }
      _executeHooks(hooks.afterSanitizeElements, currentNode, null);
      return _handleHookDetachedNode(currentNode, root);
    };
    const _isValidAttribute = function _isValidAttribute2(lcTag, lcName, value) {
      if (FORBID_ATTR[lcName]) return false;
      if (_isPatchLinkageAttribute(lcName, lcTag)) return false;
      if (SANITIZE_DOM && (lcName === "id" || lcName === "name") && (value in document2 || value in formElement)) return false;
      const nameIsPermitted = ALLOWED_ATTR[lcName] || EXTRA_ELEMENT_HANDLING.attributeCheck instanceof Function && EXTRA_ELEMENT_HANDLING.attributeCheck(lcName, lcTag);
      if (ALLOW_DATA_ATTR && regExpTest(DATA_ATTR$1, lcName)) return true;
      if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR$1, lcName)) return true;
      if (!nameIsPermitted) return _isBasicCustomElement(lcTag) && _matchesNameCheck(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) && _matchesNameCheck(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName, lcTag) || lcName === "is" && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && _matchesNameCheck(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value);
      if (URI_SAFE_ATTRIBUTES[lcName]) return true;
      if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE$1, ""))) return true;
      if ((lcName === "src" || lcName === "xlink:href" || lcName === "href") && lcTag !== "script" && stringIndexOf(value, "data:") === 0 && DATA_URI_TAGS[lcTag]) return true;
      if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA$1, stringReplace(value, ATTR_WHITESPACE$1, ""))) return true;
      return !value;
    };
    const RESERVED_CUSTOM_ELEMENT_NAMES = addToSet({}, [
      "annotation-xml",
      "color-profile",
      "font-face",
      "font-face-format",
      "font-face-name",
      "font-face-src",
      "font-face-uri",
      "missing-glyph"
    ]);
    const _isBasicCustomElement = function _isBasicCustomElement2(tagName) {
      return !RESERVED_CUSTOM_ELEMENT_NAMES[stringToLowerCase(tagName)] && regExpTest(CUSTOM_ELEMENT$1, tagName);
    };
    const _applyTrustedTypesToAttribute = function _applyTrustedTypesToAttribute2(lcTag, lcName, namespaceURI, value) {
      if (trustedTypesPolicy && typeof trustedTypes === "object" && typeof trustedTypes.getAttributeType === "function" && !namespaceURI) switch (trustedTypes.getAttributeType(lcTag, lcName)) {
        case "TrustedHTML":
          return _createTrustedHTML(value);
        case "TrustedScriptURL":
          return _createTrustedScriptURL(value);
      }
      return value;
    };
    const _setAttributeValue = function _setAttributeValue2(currentNode, name, namespaceURI, value) {
      try {
        if (namespaceURI) currentNode.setAttributeNS(namespaceURI, name, value);
        else currentNode.setAttribute(name, value);
        if (_isClobbered(currentNode)) {
          _forceRemove(currentNode);
          return false;
        }
        return true;
      } catch (_) {
        _removeAttribute(name, currentNode);
        return false;
      }
    };
    const _isUnsafeAttributeValue = function _isUnsafeAttributeValue2(name, value) {
      if (SAFE_FOR_XML && regExpTest(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, value)) return true;
      return stringToLowerCase(name) === "attributename" && stringMatch(value, "href") !== null;
    };
    const _sanitizeAttributes = function _sanitizeAttributes2(currentNode, root) {
      _executeHooks(hooks.beforeSanitizeAttributes, currentNode, null);
      if (_handleHookDetachedNode(currentNode, root)) return;
      const attributes = currentNode.attributes;
      if (!attributes || _isClobbered(currentNode)) return;
      ALLOWED_ATTR = _forkSharedAllowlist(hooks.uponSanitizeAttribute, ALLOWED_ATTR, DEFAULT_ALLOWED_ATTR, SET_CONFIG_ALLOWED_ATTR);
      const hookEvent = {
        attrName: "",
        attrValue: "",
        keepAttr: true,
        allowedAttributes: ALLOWED_ATTR,
        forceKeepAttr: void 0
      };
      let l = attributes.length;
      const lcTag = transformCaseFunc(currentNode.nodeName);
      while (l--) {
        const attr = attributes[l];
        const name = attr.name, namespaceURI = attr.namespaceURI, attrValue = attr.value;
        const lcName = transformCaseFunc(name);
        const initValue = attrValue;
        let value = name === "value" ? initValue : stringTrim(initValue);
        let recreatedNamedProp = false;
        hookEvent.attrName = lcName;
        hookEvent.attrValue = value;
        hookEvent.keepAttr = true;
        hookEvent.forceKeepAttr = void 0;
        _executeHooks(hooks.uponSanitizeAttribute, currentNode, hookEvent);
        value = hookEvent.attrValue;
        if (SANITIZE_NAMED_PROPS && (lcName === "id" || lcName === "name") && stringIndexOf(value, SANITIZE_NAMED_PROPS_PREFIX) !== 0) {
          _removeAttribute(name, currentNode, attr);
          value = SANITIZE_NAMED_PROPS_PREFIX + value;
          recreatedNamedProp = true;
        }
        if (_isUnsafeAttributeValue(name, value)) {
          _removeAttribute(name, currentNode, attr);
          continue;
        }
        if (hookEvent.forceKeepAttr) continue;
        if (!hookEvent.keepAttr) {
          _removeAttribute(name, currentNode, attr);
          continue;
        }
        if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(SELF_CLOSING_TAG, value)) {
          _removeAttribute(name, currentNode, attr);
          continue;
        }
        if (SAFE_FOR_TEMPLATES) value = _stripTemplateExpressions(value);
        if (!_isValidAttribute(lcTag, lcName, value)) {
          _removeAttribute(name, currentNode, attr);
          continue;
        }
        value = _applyTrustedTypesToAttribute(lcTag, lcName, namespaceURI, value);
        if (value !== initValue) {
          if (_setAttributeValue(currentNode, name, namespaceURI, value) && recreatedNamedProp) arrayPop(DOMPurify.removed);
        }
      }
      _executeHooks(hooks.afterSanitizeAttributes, currentNode, null);
      _handleHookDetachedNode(currentNode, root);
    };
    const _sanitizeShadowDOM2 = function _sanitizeShadowDOM(fragment2) {
      let shadowNode = null;
      const shadowIterator = _createNodeIterator(fragment2);
      _executeHooks(hooks.beforeSanitizeShadowDOM, fragment2, null);
      while (shadowNode = shadowIterator.nextNode()) {
        _executeHooks(hooks.uponSanitizeShadowNode, shadowNode, null);
        _sanitizeElements(shadowNode, fragment2);
        _sanitizeAttributes(shadowNode, fragment2);
        if (_isDocumentFragment(shadowNode.content)) _sanitizeShadowDOM2(shadowNode.content);
        if (_readNodeType(shadowNode) === NODE_TYPE.element) {
          const innerSr = getShadowRoot(shadowNode);
          if (_isDocumentFragment(innerSr)) {
            _sanitizeAttachedShadowRoots(innerSr);
            _sanitizeShadowDOM2(innerSr);
          }
        }
      }
      if (SAFE_FOR_TEMPLATES) _scrubOwnCharacterData(fragment2);
      _executeHooks(hooks.afterSanitizeShadowDOM, fragment2, null);
    };
    const _sanitizeAttachedShadowRoots = function _sanitizeAttachedShadowRoots2(root) {
      const stack = [{
        node: root,
        shadow: null
      }];
      while (stack.length > 0) {
        const item = stack.pop();
        if (item.shadow) {
          _sanitizeShadowDOM2(item.shadow);
          continue;
        }
        const node = item.node;
        const isElement = _readNodeType(node) === NODE_TYPE.element;
        const childNodes = getChildNodes(node);
        if (childNodes) for (let i = childNodes.length - 1; i >= 0; --i) stack.push({
          node: childNodes[i],
          shadow: null
        });
        if (isElement) {
          const rootName = getNodeName ? getNodeName(node) : null;
          if (typeof rootName === "string" && transformCaseFunc(rootName) === "template") {
            const content = node.content;
            if (_isDocumentFragment(content)) stack.push({
              node: content,
              shadow: null
            });
          }
        }
        if (isElement) {
          const sr = getShadowRoot(node);
          if (_isDocumentFragment(sr)) stack.push({
            node: null,
            shadow: sr
          }, {
            node: sr,
            shadow: null
          });
        }
      }
    };
    DOMPurify.sanitize = function(dirty) {
      let cfg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      let body = null;
      let importedNode = null;
      let currentNode = null;
      let returnNode = null;
      IS_EMPTY_INPUT = !dirty;
      if (IS_EMPTY_INPUT) dirty = "<!-->";
      if (typeof dirty !== "string" && !_isNode(dirty)) {
        dirty = stringifyValue(dirty);
        if (typeof dirty !== "string") throw typeErrorCreate("dirty is not a string, aborting");
      }
      if (!DOMPurify.isSupported) return dirty;
      if (SET_CONFIG) {
        ALLOWED_TAGS = SET_CONFIG_ALLOWED_TAGS;
        ALLOWED_ATTR = SET_CONFIG_ALLOWED_ATTR;
      } else _parseConfig(cfg);
      if (hooks.uponSanitizeElement.length > 0 || hooks.uponSanitizeAttribute.length > 0) ALLOWED_TAGS = clone(ALLOWED_TAGS);
      if (hooks.uponSanitizeAttribute.length > 0) ALLOWED_ATTR = clone(ALLOWED_ATTR);
      DOMPurify.removed = [];
      const inPlace = IN_PLACE && typeof dirty !== "string" && _isNode(dirty);
      let inPlaceNodes = [];
      const outerVisited = IN_PLACE_VISITED;
      if (inPlace) {
        _neutralizePatchLinkage(dirty);
        const nn = _readNodeName(dirty);
        if (typeof nn === "string") {
          const tagName = transformCaseFunc(nn);
          if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
            _neutralizeRoot(dirty);
            throw typeErrorCreate("root node is forbidden and cannot be sanitized in-place");
          }
        }
        if (_isClobbered(dirty)) {
          _neutralizeRoot(dirty);
          throw typeErrorCreate("root node is clobbered and cannot be sanitized in-place");
        }
        inPlaceNodes = _collectLiveNodes(dirty);
        IN_PLACE_VISITED = setCreate();
      } else if (_isNode(dirty)) {
        body = _initDocument("<!---->");
        importedNode = body.ownerDocument.importNode(dirty, true);
        if (importedNode.nodeType === NODE_TYPE.element && importedNode.nodeName === "BODY") body = importedNode;
        else if (importedNode.nodeName === "HTML") body = importedNode;
        else body.appendChild(importedNode);
        _sanitizeAttachedShadowRoots(body);
      } else {
        if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && dirty.indexOf("<") === -1) return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? _createTrustedHTML(dirty) : dirty;
        body = _initDocument(dirty);
        if (!body) return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : "";
      }
      if (body && FORCE_BODY) _forceRemove(body.firstChild);
      const walkRoot = inPlace ? dirty : body;
      try {
        if (inPlace) _sanitizeAttachedShadowRoots(dirty);
        const nodeIterator = _createNodeIterator(walkRoot);
        while (currentNode = nodeIterator.nextNode()) {
          _sanitizeElements(currentNode, walkRoot);
          _sanitizeAttributes(currentNode, walkRoot);
          if (_isDocumentFragment(currentNode.content)) _sanitizeShadowDOM2(currentNode.content);
        }
        if (inPlace) _sanitizeUnvisitedNodes(dirty, inPlaceNodes);
      } catch (error) {
        if (inPlace) {
          _neutralizeRoot(dirty);
          _neutralizeDiscarded(dirty, inPlaceNodes);
        }
        throw error;
      } finally {
        IN_PLACE_VISITED = outerVisited;
      }
      if (inPlace) {
        if (_neutralizeDiscarded(dirty, inPlaceNodes)) throw typeErrorCreate("a node selected for removal could not be safely returned; refusing to sanitize in place");
        if (SAFE_FOR_TEMPLATES) _scrubTemplateExpressions2(dirty);
        return dirty;
      }
      if (RETURN_DOM) {
        if (SAFE_FOR_TEMPLATES) _scrubTemplateExpressions2(body);
        if (RETURN_DOM_FRAGMENT) {
          returnNode = createDocumentFragment.call(body.ownerDocument);
          while (body.firstChild) returnNode.appendChild(body.firstChild);
        } else returnNode = body;
        if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) returnNode = importNode.call(originalDocument, returnNode, true);
        return returnNode;
      }
      let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
      if (WHOLE_DOCUMENT && ALLOWED_TAGS["!doctype"] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) serializedHTML = "<!DOCTYPE " + body.ownerDocument.doctype.name + ">\n" + serializedHTML;
      if (SAFE_FOR_TEMPLATES) serializedHTML = _stripTemplateExpressions(serializedHTML);
      return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? _createTrustedHTML(serializedHTML) : serializedHTML;
    };
    DOMPurify.setConfig = function() {
      let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      _parseConfig(cfg);
      SET_CONFIG = true;
      SET_CONFIG_ALLOWED_TAGS = ALLOWED_TAGS;
      SET_CONFIG_ALLOWED_ATTR = ALLOWED_ATTR;
    };
    DOMPurify.clearConfig = function() {
      CONFIG = null;
      SET_CONFIG = false;
      SET_CONFIG_ALLOWED_TAGS = null;
      SET_CONFIG_ALLOWED_ATTR = null;
      trustedTypesPolicy = defaultTrustedTypesPolicy;
      emptyHTML = "";
    };
    DOMPurify.isValidAttribute = function(tag, attr, value) {
      if (!CONFIG) _parseConfig({});
      const lcTag = transformCaseFunc(tag);
      const lcName = transformCaseFunc(attr);
      if (typeof value === "string" && (_isUnsafeAttributeValue(attr, value) || !ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(SELF_CLOSING_TAG, value))) return false;
      return _isValidAttribute(lcTag, lcName, value);
    };
    DOMPurify.addHook = function(entryPoint, hookFunction) {
      if (typeof hookFunction !== "function") return;
      if (!objectHasOwnProperty(hooks, entryPoint)) return;
      arrayPush(hooks[entryPoint], hookFunction);
    };
    DOMPurify.removeHook = function(entryPoint, hookFunction) {
      if (!objectHasOwnProperty(hooks, entryPoint)) return;
      if (hookFunction !== void 0) {
        const index = arrayLastIndexOf(hooks[entryPoint], hookFunction);
        return index === -1 ? void 0 : arraySplice(hooks[entryPoint], index, 1)[0];
      }
      return arrayPop(hooks[entryPoint]);
    };
    DOMPurify.removeHooks = function(entryPoint) {
      if (!objectHasOwnProperty(hooks, entryPoint)) return;
      hooks[entryPoint] = [];
    };
    DOMPurify.removeAllHooks = function() {
      hooks = _createHooksMap();
    };
    return DOMPurify;
  }
  var purify_default = createDOMPurify();

  // browser/svg-safety.ts
  var tags = [
    "svg",
    "g",
    "defs",
    "title",
    "desc",
    "path",
    "rect",
    "circle",
    "ellipse",
    "line",
    "polyline",
    "polygon",
    "text",
    "tspan",
    "textPath",
    "linearGradient",
    "radialGradient",
    "stop",
    "clipPath",
    "mask",
    "pattern",
    "use"
  ];
  var attrs = [
    "xmlns",
    "viewBox",
    "width",
    "height",
    "x",
    "y",
    "x1",
    "y1",
    "x2",
    "y2",
    "cx",
    "cy",
    "r",
    "rx",
    "ry",
    "d",
    "points",
    "transform",
    "id",
    "fill",
    "fill-opacity",
    "fill-rule",
    "stroke",
    "stroke-width",
    "stroke-opacity",
    "stroke-linecap",
    "stroke-linejoin",
    "stroke-dasharray",
    "stroke-dashoffset",
    "opacity",
    "clip-path",
    "clip-rule",
    "mask",
    "gradientUnits",
    "gradientTransform",
    "spreadMethod",
    "offset",
    "stop-color",
    "stop-opacity",
    "fx",
    "fy",
    "fr",
    "patternUnits",
    "patternContentUnits",
    "patternTransform",
    "preserveAspectRatio",
    "font-family",
    "font-size",
    "font-weight",
    "font-style",
    "text-anchor",
    "dominant-baseline",
    "dx",
    "dy",
    "rotate",
    "textLength",
    "lengthAdjust",
    "href",
    "startOffset",
    "maskUnits",
    "maskContentUnits",
    "clipPathUnits"
  ];
  var fragment = /^#[a-zA-Z_][\w.-]*$/;
  var localPaint = /^url\(\s*['"]?#[a-zA-Z_][\w.-]*['"]?\s*\)$/;
  var paintAttributes = /* @__PURE__ */ new Set(["fill", "stroke", "clip-path", "mask"]);
  purify_default.addHook("uponSanitizeAttribute", (_node, data) => {
    const name = data.attrName.toLowerCase();
    const value = data.attrValue.trim();
    if (name === "href") data.keepAttr = fragment.test(value);
    if (paintAttributes.has(name) && /[()\\]/.test(value)) {
      data.keepAttr = localPaint.test(value);
    }
  });
  var SVG_LIMITS = {
    sourceCharacters: 262144,
    elements: 2e3,
    depth: 32,
    attributes: 12e3,
    geometryTokens: 2e4,
    textCharacters: 32768,
    expandedElements: 1e4,
    expandedGeometryTokens: 4e4,
    referenceDepth: 16,
    coordinateMagnitude: 1e6
  };
  function reject(message) {
    throw new Error(`SVG rejected: ${message} Simplify the artwork and try again.`);
  }
  var numericGeometry = /* @__PURE__ */ new Set(["d", "points", "transform", "gradientTransform", "viewBox", "width", "height", "x", "y", "x1", "y1", "x2", "y2", "cx", "cy", "r", "rx", "ry", "dx", "dy", "font-size", "stroke-width", "stroke-dasharray", "stroke-dashoffset"]);
  function checkTree(root) {
    let elements = 0, attributes = 0, geometry = 0, text2 = 0;
    const stack = [[root, 1]];
    while (stack.length) {
      const [node, depth] = stack.pop();
      if (++elements > SVG_LIMITS.elements) reject(`maximum ${SVG_LIMITS.elements} elements exceeded.`);
      if (depth > SVG_LIMITS.depth) reject(`maximum nesting depth ${SVG_LIMITS.depth} exceeded.`);
      attributes += node.attributes.length;
      if (attributes > SVG_LIMITS.attributes) reject(`maximum ${SVG_LIMITS.attributes} attributes exceeded.`);
      if (node.localName === "pattern") reject("Pattern tiling is unsupported; replace it with explicit geometry.");
      for (const attribute of node.attributes) {
        if (numericGeometry.has(attribute.localName)) {
          const numbers = attribute.value.match(/[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/gi) || [];
          geometry += numbers.length;
          if (numbers.some((value) => !Number.isFinite(Number(value)) || Math.abs(Number(value)) > SVG_LIMITS.coordinateMagnitude)) {
            reject(`geometry coordinates must be finite and at most ${SVG_LIMITS.coordinateMagnitude} in magnitude.`);
          }
        }
      }
      if (geometry > SVG_LIMITS.geometryTokens) reject(`maximum ${SVG_LIMITS.geometryTokens} geometry numbers exceeded.`);
      for (const child of node.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) text2 += child.textContent?.length || 0;
      }
      if (text2 > SVG_LIMITS.textCharacters) reject(`maximum ${SVG_LIMITS.textCharacters} text characters exceeded.`);
      for (const child of node.children) stack.push([child, depth + 1]);
    }
  }
  function checkReferences(root) {
    const nodes = [root, ...root.querySelectorAll("*")];
    const ids = /* @__PURE__ */ new Map();
    for (const node of nodes) {
      if (!node.id) continue;
      if (ids.has(node.id)) reject("Duplicate SVG IDs are ambiguous; give each definition a unique ID.");
      ids.set(node.id, node);
    }
    const visiting = /* @__PURE__ */ new Set();
    const memo = /* @__PURE__ */ new Map();
    function cost(node) {
      if (visiting.has(node)) reject("Cyclic SVG references are unsupported; flatten the cycle.");
      const cached = memo.get(node);
      if (cached) return cached;
      visiting.add(node);
      const total = { elements: 1, geometry: 0, references: 0 };
      for (const attribute of node.attributes) {
        if (numericGeometry.has(attribute.localName)) {
          total.geometry += (attribute.value.match(/[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/gi) || []).length;
        }
      }
      const edges = Array.from(node.children, (child) => [child, false]);
      for (const attribute of node.attributes) {
        const match = attribute.localName === "href" ? attribute.value.match(/^#(.+)$/) : attribute.value.match(/^url\(\s*['"]?#([\w.-]+)['"]?\s*\)$/);
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
  function sanitizeSvg(source) {
    if (source.length > SVG_LIMITS.sourceCharacters) reject(`maximum source length ${SVG_LIMITS.sourceCharacters} characters exceeded.`);
    if (/<!DOCTYPE|<!ENTITY/i.test(source)) reject("DTD/entity declarations are unsupported; use literal SVG text.");
    if (!source.trim()) return null;
    const parsed = new DOMParser().parseFromString(source, "image/svg+xml");
    if (parsed.querySelector("parsererror") || parsed.doctype || parsed.documentElement.localName !== "svg") return null;
    checkTree(parsed.documentElement);
    const clean = purify_default.sanitize(source, {
      ALLOWED_TAGS: tags,
      ALLOWED_ATTR: attrs,
      ALLOW_DATA_ATTR: false,
      ALLOW_ARIA_ATTR: false,
      RETURN_DOM_FRAGMENT: true,
      PARSER_MEDIA_TYPE: "application/xhtml+xml"
    });
    const svg2 = clean.firstElementChild;
    if (!(svg2 instanceof SVGSVGElement)) return null;
    checkReferences(svg2);
    return svg2;
  }

  // browser/app.ts
  function element(id) {
    const node = document.getElementById(id);
    if (!node) throw new Error(`Missing required element: ${id}`);
    return node;
  }
  function historyItems() {
    try {
      const value = JSON.parse(sessionStorage.getItem("svgGeneratorHistory") || "[]");
      if (!Array.isArray(value)) return [];
      return value.filter((item) => typeof item === "object" && item !== null && typeof item.prompt === "string" && typeof item.svgCode === "string" && typeof item.complexity === "number" && typeof item.colorUsage === "number" && (item.model === void 0 || typeof item.model === "string") && typeof item.timestamp === "string" && (item.version === void 0 || typeof item.version === "number"));
    } catch {
      return [];
    }
  }
  async function responseStrings(response) {
    const data = await response.json();
    if (typeof data !== "object" || data === null || Array.isArray(data)) throw new Error("Invalid response object");
    const result = {};
    for (const [key, value] of Object.entries(data)) {
      if (typeof value !== "string") throw new Error("Invalid response value");
      result[key] = value;
    }
    return result;
  }
  function errorMessage(error) {
    return error instanceof Error ? error.message : String(error);
  }
  function rasterAllowed(width, height) {
    return Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0 && width <= 8192 && height <= 8192 && width * height <= 16e6;
  }
  document.addEventListener("DOMContentLoaded", () => {
    const tabButtons = document.querySelectorAll(".tab-button");
    const tabContents = document.querySelectorAll(".tab-content");
    const promptInput = element("prompt");
    const generateBtn = element("generate-btn");
    const svgCodeEditor = element("svg-code-editor");
    const svgPreview = element("svg-preview");
    const saveBtn = element("save-btn");
    const copyBtn = element("copy-btn");
    const statusMessage = element("status-message");
    const historyList = element("history-list");
    const clearHistoryBtn = element("clear-history-btn");
    const savePngBtn = element("save-png-btn");
    const pngWidthInput = element("png-width-input");
    const pngHeightInput = element("png-height-input");
    const saveCustomPngBtn = element("save-custom-png-btn");
    const generateSpinner = element("generate-spinner");
    const backgroundControlButtons = document.querySelectorAll(".bg-control-btn");
    const customBgButton = element("bg-custom-btn");
    const customBgColorPicker = element("bg-custom-color-picker");
    const customBgHexDisplay = element("bg-custom-hex");
    const complexityButtons = document.querySelectorAll("#complexity-buttons .control-button");
    const colorUsageButtons = document.querySelectorAll("#color-usage-buttons .control-button");
    const modelSelect = element("model-select");
    const imageUploadInput = element("image-upload");
    const fileNameDisplay = element("file-name");
    const imagePreviewContainer = element("image-preview-container");
    const imagePreview = element("image-preview");
    const analysisPromptInput = element("analysis-prompt");
    const analysisPromptContainer = analysisPromptInput.closest(".control-group");
    const extractorModelSelect = element("extractor-model-select");
    const extractorActionsContainer = document.querySelector(".extractor-actions");
    const analyzeBtn = element("analyze-btn");
    const analysisStatus = element("analysis-status");
    const analyzeSpinner = element("analyze-spinner");
    const dropZone = element("drop-zone");
    const analysisResultsSection = element("analysis-results-section");
    const recreateSvgBtn = element("recreate-svg-btn");
    const recreateSvgStatus = element("recreate-svg-status");
    const recreateSpinner = element("recreate-spinner");
    const copyMarkdownBtn = element("copy-markdown-btn");
    const analysisButtonsContainer = document.querySelector("#analysis-results-section .analysis-actions");
    const refinementPromptInput = element("refinement-prompt");
    const refineModelSelect = element("refine-model-select");
    const refineBtn = element("refine-btn");
    const refineStatus = element("refine-status");
    const refineSpinner = element("refine-spinner");
    const outputContainer = document.querySelector(".output-container");
    const historyContainer = document.querySelector(".history-container");
    let currentImageDataUrl = null;
    let debounceTimer;
    const MAX_HISTORY_ITEMS = 15;
    function readSvg(source) {
      delete svgPreview.dataset.rejection;
      try {
        return sanitizeSvg(source);
      } catch (error) {
        svgPreview.dataset.rejection = errorMessage(error);
        svgPreview.textContent = errorMessage(error);
        [saveBtn, copyBtn, savePngBtn, saveCustomPngBtn].forEach((button) => button.disabled = true);
        return null;
      }
    }
    function serializedSvg(source) {
      const svg2 = readSvg(source);
      return svg2 ? new XMLSerializer().serializeToString(svg2) : null;
    }
    function autoResizeTextarea(textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
    function switchTab(targetTabId) {
      if (!targetTabId) return;
      tabContents.forEach((content) => {
        content.style.display = "none";
        content.classList.remove("active");
      });
      tabButtons.forEach((button) => {
        button.classList.remove("active");
      });
      const targetContent = element(targetTabId);
      const targetButton = document.querySelector(`.tab-button[data-tab="${targetTabId}"]`);
      if (targetContent) {
        targetContent.style.display = "block";
        targetContent.classList.add("active");
      }
      if (targetButton) {
        targetButton.classList.add("active");
      }
      if (targetTabId === "how-to-use-tab-content") {
        if (outputContainer) outputContainer.style.display = "none";
        if (historyContainer) historyContainer.style.display = "none";
      } else {
        if (outputContainer) outputContainer.style.display = "block";
        if (historyContainer) historyContainer.style.display = "block";
      }
    }
    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const targetTabId = button.getAttribute("data-tab");
        switchTab(targetTabId);
      });
    });
    function _update_generation_ui(is_loading, message = null, is_error = false) {
      generateBtn.disabled = is_loading;
      if (is_loading) {
        generateSpinner.classList.add("visible");
      } else {
        generateSpinner.classList.remove("visible");
      }
      if (message) {
        statusMessage.textContent = message;
        statusMessage.className = "status";
        if (is_error) {
          statusMessage.style.color = "var(--error-color)";
        } else if (is_loading) {
          statusMessage.className = "status info";
          statusMessage.style.color = "";
        } else {
          statusMessage.style.color = "var(--success-color)";
        }
      } else {
        statusMessage.textContent = "";
        statusMessage.className = "status";
        statusMessage.style.color = "";
      }
      if (!is_loading) {
        setTimeout(() => {
          if (statusMessage.textContent === message) {
            statusMessage.textContent = "";
            statusMessage.className = "status";
            statusMessage.style.color = "";
          }
        }, 5e3);
      }
    }
    function updatePreview(svgCode) {
      svgPreview.dataset.revision = String(Number(svgPreview.dataset.revision || 0) + 1);
      svgPreview.innerHTML = "";
      const svgPresent = svgCode && svgCode.trim().length > 0;
      copyBtn.disabled = !svgPresent;
      saveBtn.disabled = !svgPresent;
      savePngBtn.disabled = !svgPresent;
      [copyBtn, saveBtn, savePngBtn].forEach((btn) => {
        if (!svgPresent) {
          btn.classList.remove("primary-btn");
          btn.classList.add("secondary-btn");
        } else {
          if (btn !== copyBtn) {
            btn.classList.add("primary-btn");
            btn.classList.remove("secondary-btn");
          }
        }
      });
      resetCustomPngButtonState();
      if (!svgPresent) {
        svgPreview.innerHTML = '<p style="color: #999;">Preview will appear here.</p>';
        return;
      }
      const svgElement = readSvg(svgCode);
      if (svgElement) {
        svgPreview.appendChild(svgElement);
      } else {
        svgPreview.textContent = svgPreview.dataset.rejection || "Invalid or incomplete SVG code.";
        [copyBtn, saveBtn, savePngBtn, saveCustomPngBtn].forEach((btn) => btn.disabled = true);
      }
    }
    function getSelectedButtonValue(buttons) {
      for (const button of buttons) {
        if (button.classList.contains("active")) {
          return parseInt(button.dataset.value || "3", 10);
        }
      }
      return 3;
    }
    async function handleGenerate() {
      const currentPrompt = promptInput.value.trim();
      if (!currentPrompt) {
        _update_generation_ui(false, "Please enter a prompt.", true);
        return;
      }
      const complexity = getSelectedButtonValue(complexityButtons);
      const colorUsage = getSelectedButtonValue(colorUsageButtons);
      const selectedModel = modelSelect.value;
      _update_generation_ui(true, "Generating SVG...");
      try {
        const response = await fetch("/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            prompt: currentPrompt,
            complexity,
            colorUsage,
            model: selectedModel
          })
        });
        if (!response.ok) {
          let errorMsg = `Generation failed (status ${response.status})`;
          try {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              const errorData = await responseStrings(response);
              errorMsg = `Generation failed: ${errorData.error || JSON.stringify(errorData)}`;
            } else {
              const errorText = await response.text();
              console.error("Non-JSON error response from /generate:", errorText);
              errorMsg = `Generation failed: Server returned an unexpected response (status ${response.status}). Check console for details.`;
            }
          } catch (parseError) {
            console.error("Error processing the error response from /generate:", parseError);
            errorMsg = `Generation failed: Could not process error response (status ${response.status}).`;
          }
          throw new Error(errorMsg);
        }
        const data = await responseStrings(response);
        if (data.svg_code) {
          svgCodeEditor.value = data.svg_code;
          updatePreview(data.svg_code);
          _update_generation_ui(false, "SVG generated successfully!");
          saveHistoryItem(currentPrompt, complexity, colorUsage, selectedModel, data.svg_code);
        } else {
          _update_generation_ui(false, "Generation completed, but no SVG code received.", true);
        }
      } catch (error) {
        console.error("Generation failed:", error);
        _update_generation_ui(false, errorMessage(error) || "An unexpected error occurred during generation.", true);
        updatePreview("");
      }
    }
    function handleSave() {
      const svgCode = serializedSvg(svgCodeEditor.value);
      if (!svgCode) {
        alert("Nothing to save. Generate or enter SVG code first.");
        return;
      }
      const blob = new Blob([svgCode], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const promptText = promptInput.value.trim().substring(0, 30).replace(/[^a-z0-9]/gi, "_") || "generated";
      a.download = `${promptText}_${Date.now()}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    function handleCopy() {
      const svgCode = serializedSvg(svgCodeEditor.value);
      if (!svgCode) {
        return;
      }
      navigator.clipboard.writeText(svgCode).then(() => {
        copyBtn.textContent = "Copied!";
        copyBtn.classList.add("copied");
        setTimeout(() => {
          copyBtn.textContent = "Copy Code";
          copyBtn.classList.remove("copied");
        }, 2e3);
      }).catch((err) => {
        console.error("Failed to copy code: ", err);
        alert("Failed to copy code to clipboard.");
      });
    }
    function saveHistoryItem(prompt, complexity, colorUsage, model, svgCode) {
      let currentHistory = historyItems();
      const isIdenticalConfig = (item, newItemConfig2) => {
        return item.prompt === newItemConfig2.prompt && item.complexity === newItemConfig2.complexity && item.colorUsage === newItemConfig2.colorUsage && item.model === newItemConfig2.model;
      };
      const newItemConfig = { prompt, complexity, colorUsage, model };
      let version = 1;
      currentHistory.forEach((item) => {
        if (isIdenticalConfig(item, newItemConfig)) {
          version = Math.max(version, (item.version || 0) + 1);
        }
      });
      const newItem = {
        prompt,
        complexity,
        colorUsage,
        model,
        version,
        // Store the calculated version
        timestamp: (/* @__PURE__ */ new Date()).toLocaleString(),
        svgCode
      };
      currentHistory.unshift(newItem);
      if (currentHistory.length > MAX_HISTORY_ITEMS) {
        currentHistory = currentHistory.slice(0, MAX_HISTORY_ITEMS);
      }
      sessionStorage.setItem("svgGeneratorHistory", JSON.stringify(currentHistory));
    }
    function updateHistoryList() {
      const historyList2 = element("history-list");
      const currentHistory = historyItems();
      historyList2.innerHTML = "";
      currentHistory.forEach((item, index) => {
        const li = document.createElement("li");
        const historyButton = document.createElement("button");
        historyButton.type = "button";
        historyButton.className = "history-entry";
        const versionString = item.version ? ` (v${item.version})` : "";
        const parametersString = `(Cmplx:${item.complexity}, Clr:${item.colorUsage}, M:${item.model || "Default"})`;
        const timestampString = new Date(item.timestamp).toLocaleString();
        const promptSpan = document.createElement("span");
        promptSpan.className = "prompt-snippet";
        promptSpan.textContent = `${item.prompt}${versionString} ${parametersString}`;
        historyButton.appendChild(promptSpan);
        const timestampSpan = document.createElement("span");
        timestampSpan.className = "timestamp";
        timestampSpan.textContent = timestampString;
        historyButton.appendChild(timestampSpan);
        li.dataset.index = String(index);
        historyButton.addEventListener("click", () => {
          loadHistoryItem(index);
        });
        li.appendChild(historyButton);
        historyList2.appendChild(li);
      });
    }
    function loadHistoryItem(index) {
      const currentHistory = historyItems();
      if (index >= 0 && index < currentHistory.length) {
        const item = currentHistory[index];
        promptInput.value = item.prompt;
        setActiveButton(complexityButtons, item.complexity);
        setActiveButton(colorUsageButtons, item.colorUsage);
        if (item.model && Array.from(modelSelect.options).some((option) => option.value === item.model)) modelSelect.value = item.model;
        else if (item.model) _update_generation_ui(false, "The saved model is no longer offered. Review the current model selection before generating.", true);
        svgCodeEditor.value = item.svgCode;
        updatePreview(item.svgCode);
        switchTab("generator-tab-content");
      }
    }
    function clearHistory() {
      if (confirm("Are you sure you want to clear the generation history for this session?")) {
        sessionStorage.removeItem("svgGeneratorHistory");
        updateHistoryList();
      }
    }
    function handleButtonClick(event, buttons) {
      buttons.forEach((btn) => btn.classList.remove("active"));
      event.currentTarget.classList.add("active");
    }
    complexityButtons.forEach((button) => {
      button.addEventListener("click", (e) => handleButtonClick(e, complexityButtons));
    });
    colorUsageButtons.forEach((button) => {
      button.addEventListener("click", (e) => handleButtonClick(e, colorUsageButtons));
    });
    function setActiveButton(buttons, value) {
      let targetValue;
      if (value <= 2) {
        targetValue = 1;
      } else if (value <= 4) {
        targetValue = 3;
      } else {
        targetValue = 5;
      }
      buttons.forEach((btn) => {
        if (parseInt(btn.dataset.value || "3", 10) === targetValue) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    }
    backgroundControlButtons.forEach((button) => {
      button.addEventListener("click", () => {
        backgroundControlButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        const bgType = button.getAttribute("data-bg");
        customBgColorPicker.style.display = "none";
        customBgHexDisplay.style.display = "none";
        if (bgType === "transparent") {
          svgPreview.classList.remove("bg-white", "bg-black");
          svgPreview.classList.add("bg-transparent");
          svgPreview.style.backgroundColor = "";
        } else if (bgType === "white") {
          svgPreview.classList.remove("bg-transparent", "bg-black");
          svgPreview.classList.add("bg-white");
          svgPreview.style.backgroundColor = "";
        } else if (bgType === "black") {
          svgPreview.classList.remove("bg-transparent", "bg-white");
          svgPreview.classList.add("bg-black");
          svgPreview.style.backgroundColor = "";
        } else if (bgType === "custom") {
          customBgColorPicker.style.display = "inline-block";
          customBgHexDisplay.style.display = "inline-block";
          const currentColor = customBgColorPicker.value;
          svgPreview.classList.remove("bg-transparent", "bg-white", "bg-black");
          svgPreview.style.backgroundColor = currentColor;
          customBgHexDisplay.textContent = customBgColorPicker.value;
        }
      });
    });
    customBgColorPicker.addEventListener("input", () => {
      const newColor = customBgColorPicker.value;
      customBgHexDisplay.textContent = newColor;
      if (customBgButton.classList.contains("active")) {
        svgPreview.style.backgroundColor = newColor;
        svgPreview.classList.remove("bg-transparent", "bg-white", "bg-black");
      }
    });
    function applyPersistedBackground() {
      const persistedBg = localStorage.getItem("previewBackground") || "transparent";
      svgPreview.classList.remove("bg-transparent", "bg-white", "bg-black");
      svgPreview.classList.add(`bg-${persistedBg}`);
      backgroundControlButtons.forEach((btn) => {
        if (btn.dataset.bg === persistedBg) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    }
    applyPersistedBackground();
    generateBtn.addEventListener("click", handleGenerate);
    svgCodeEditor.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        updatePreview(svgCodeEditor.value);
        updateCustomPngButtonState();
      }, 300);
    });
    if (pngWidthInput) pngWidthInput.addEventListener("input", updateCustomPngButtonState);
    if (pngHeightInput) pngHeightInput.addEventListener("input", updateCustomPngButtonState);
    saveBtn.addEventListener("click", handleSave);
    copyBtn.addEventListener("click", handleCopy);
    clearHistoryBtn.addEventListener("click", clearHistory);
    if (saveCustomPngBtn) {
      saveCustomPngBtn.addEventListener("click", (e) => handleSavePng(e, true));
    }
    if (savePngBtn) {
      savePngBtn.addEventListener("click", (e) => handleSavePng(e, false));
    }
    function handleFileSelect(file) {
      if (file && file.type.startsWith("image/")) {
        fileNameDisplay.textContent = file.name;
        const reader = new FileReader();
        reader.onload = function(e) {
          if (typeof reader.result !== "string") return;
          imagePreview.src = reader.result;
          imagePreviewContainer.style.display = "block";
          currentImageDataUrl = reader.result;
          if (analysisResultsSection) analysisResultsSection.style.display = "none";
          analysisStatus.textContent = "";
        };
        reader.onerror = function(err) {
          console.error("FileReader error:", err);
          alert("Error reading file.");
          currentImageDataUrl = null;
        };
        reader.readAsDataURL(file);
      } else {
        fileNameDisplay.textContent = "Invalid file type chosen";
        imagePreview.src = "#";
        imagePreviewContainer.style.display = "none";
        currentImageDataUrl = null;
        alert("Please select an image file (e.g., JPG, PNG, GIF).");
      }
    }
    if (imageUploadInput) {
      imageUploadInput.addEventListener("change", (event) => {
        const file = imageUploadInput.files?.[0];
        if (file) {
          handleFileSelect(file);
        }
      });
    }
    if (dropZone) {
      dropZone.addEventListener("dragover", (event) => {
        event.stopPropagation();
        event.preventDefault();
        dropZone.classList.add("dragover");
        if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
      });
      dropZone.addEventListener("dragleave", (event) => {
        event.stopPropagation();
        event.preventDefault();
        dropZone.classList.remove("dragover");
      });
      dropZone.addEventListener("drop", (event) => {
        event.stopPropagation();
        event.preventDefault();
        dropZone.classList.remove("dragover");
        const files = event.dataTransfer?.files;
        if (!files) return;
        if (files.length > 0) {
          handleFileSelect(files[0]);
          try {
            imageUploadInput.files = files;
          } catch (err) {
            console.warn("Could not directly set files on input element:", err);
          }
        }
      });
    }
    if (analyzeBtn) {
      analyzeBtn.addEventListener("click", async () => {
        if (!currentImageDataUrl) {
          analysisStatus.textContent = "Please upload an image first.";
          analysisStatus.className = "status";
          analysisStatus.style.color = "var(--error-color)";
          return;
        }
        const contextPrompt = analysisPromptInput.value.trim();
        const selectedModel = extractorModelSelect.value;
        analyzeBtn.disabled = true;
        analysisStatus.textContent = "Analyzing image...";
        analysisStatus.className = "status info";
        analysisStatus.style.color = "";
        analyzeSpinner.classList.add("visible");
        if (analysisResultsSection) {
          analysisResultsSection.innerHTML = "";
          if (analysisButtonsContainer) analysisButtonsContainer.style.display = "none";
          recreateSvgStatus.textContent = "";
          const analysisHeader = document.createElement("h3");
          analysisHeader.textContent = "2. Review & Edit Analysis";
          analysisResultsSection.appendChild(analysisHeader);
          const analysisTypes = ["metadata", "semantic", "layout", "content_styling", "ocr"];
          analysisTypes.forEach((key) => {
            let labelText = key.replace(/_/g, " ");
            labelText = labelText.charAt(0).toUpperCase() + labelText.slice(1);
            labelText += " Analysis:";
            const blockDiv = document.createElement("div");
            blockDiv.classList.add("analysis-block");
            const label = document.createElement("label");
            label.textContent = labelText;
            label.htmlFor = `analysis-${key}`;
            const textarea = document.createElement("textarea");
            textarea.id = `analysis-${key}`;
            textarea.placeholder = "Analyzing...";
            textarea.value = "";
            textarea.disabled = true;
            textarea.dataset.analysisType = key;
            textarea.addEventListener("input", () => autoResizeTextarea(textarea));
            blockDiv.appendChild(label);
            blockDiv.appendChild(textarea);
            analysisResultsSection.appendChild(blockDiv);
          });
          if (analysisButtonsContainer) analysisResultsSection.appendChild(analysisButtonsContainer);
          analysisResultsSection.appendChild(recreateSvgStatus);
          if (analysisButtonsContainer) analysisButtonsContainer.style.display = "flex";
          recreateSvgBtn.style.display = "inline-block";
          copyMarkdownBtn.style.display = "inline-block";
          recreateSvgBtn.disabled = true;
          copyMarkdownBtn.disabled = true;
          analysisResultsSection.style.display = "block";
        }
        try {
          const response = await fetch("/analyze_image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              image_data: currentImageDataUrl,
              context_prompt: contextPrompt,
              model: selectedModel
              // Send extractor's selected model
            })
          });
          if (!response.ok) {
            let errorMsg = `Analysis failed (status ${response.status})`;
            try {
              const contentType = response.headers.get("content-type");
              if (contentType && contentType.includes("application/json")) {
                const errorData = await responseStrings(response);
                errorMsg = `Analysis failed: ${errorData.error || JSON.stringify(errorData)}`;
              } else {
                const errorText = await response.text();
                console.error("Non-JSON error response from /analyze_image:", errorText);
                errorMsg = `Analysis failed: Server returned an unexpected response (status ${response.status}). Check console for details.`;
              }
            } catch (parseError) {
              console.error("Error processing the error response from /analyze_image:", parseError);
              errorMsg = `Analysis failed: Could not process error response (status ${response.status}).`;
            }
            throw new Error(errorMsg);
          }
          const data = await responseStrings(response);
          if (response.ok) {
            analysisStatus.textContent = "Analysis complete!";
            analysisStatus.className = "status";
            analysisStatus.style.color = "var(--success-color)";
            if (analysisResultsSection) {
              for (const [key, value] of Object.entries(data)) {
                const textarea = document.getElementById(`analysis-${key}`);
                if (textarea instanceof HTMLTextAreaElement) {
                  textarea.value = value.trim();
                  textarea.disabled = false;
                  textarea.placeholder = "";
                  autoResizeTextarea(textarea);
                }
              }
              recreateSvgBtn.disabled = false;
              copyMarkdownBtn.disabled = false;
            }
          } else {
            throw new Error(data.error || "Unknown analysis error");
          }
        } catch (error) {
          console.error("Analysis Error:", error);
          analysisStatus.textContent = `Error: ${errorMessage(error)}`;
          analysisStatus.className = "status";
          analysisStatus.style.color = "var(--error-color)";
          if (analysisResultsSection) {
            const textareas = analysisResultsSection.querySelectorAll("textarea");
            textareas.forEach((ta) => {
              ta.value = `Error: ${errorMessage(error)}`;
              ta.disabled = true;
              ta.placeholder = "";
              ta.style.color = "var(--error-color)";
            });
            recreateSvgBtn.disabled = true;
            copyMarkdownBtn.disabled = true;
          }
        } finally {
          analyzeBtn.disabled = false;
          analyzeSpinner.classList.remove("visible");
          setTimeout(() => {
            if (!analysisStatus.textContent.startsWith("Error:")) {
              analysisStatus.textContent = "";
            }
          }, 5e3);
        }
      });
    }
    function getAnalysisDataFromTextareas() {
      const keys = ["metadata", "semantic", "layout", "content_styling", "ocr"];
      const data = {};
      for (const key of keys) {
        const input = element(`analysis-${key}`);
        if (!input || !input.value.trim()) return null;
        data[key] = input.value.trim();
      }
      return data;
    }
    async function handleRecreateSvg() {
      if (!currentImageDataUrl) {
        if (recreateSvgStatus) recreateSvgStatus.textContent = "No image selected for recreation.";
        return;
      }
      const analysisData = getAnalysisDataFromTextareas();
      if (!analysisData) {
        if (recreateSvgStatus) recreateSvgStatus.textContent = "Analysis data is missing or incomplete.";
        return;
      }
      const selectedModel = extractorModelSelect.value;
      if (recreateSvgBtn) recreateSvgBtn.disabled = true;
      if (recreateSvgStatus) {
        recreateSvgStatus.textContent = "Recreating SVG...";
        recreateSvgStatus.className = "status info";
        recreateSvgStatus.style.color = "";
        recreateSpinner.classList.add("visible");
      }
      try {
        const response = await fetch("/convert_to_svg", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            image_data: currentImageDataUrl,
            analysis_data: analysisData,
            model: selectedModel
          })
        });
        if (!response.ok) {
          let errorMsg = `SVG recreation failed (status ${response.status})`;
          try {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              const errorData = await responseStrings(response);
              errorMsg = `SVG recreation failed: ${errorData.error || JSON.stringify(errorData)}`;
            } else {
              const errorText = await response.text();
              console.error("Non-JSON error response from /convert_to_svg:", errorText);
              errorMsg = `SVG recreation failed: Server returned an unexpected response (status ${response.status}). Check console for details.`;
            }
          } catch (parseError) {
            console.error("Error processing the error response from /convert_to_svg:", parseError);
            errorMsg = `SVG recreation failed: Could not process error response (status ${response.status}).`;
          }
          throw new Error(errorMsg);
        }
        const data = await responseStrings(response);
        if (response.ok) {
          const generatedSvgCode = data.svg_code;
          if (!generatedSvgCode) throw new Error("No SVG returned.");
          svgCodeEditor.value = generatedSvgCode;
          updatePreview(generatedSvgCode);
          if (recreateSvgStatus) {
            recreateSvgStatus.textContent = "Recreation successful!";
            recreateSvgStatus.className = "status";
            recreateSvgStatus.style.color = "var(--success-color)";
          }
        } else {
          throw new Error(data.error || "Unknown recreation error");
        }
      } catch (error) {
        console.error("Recreation Error:", error);
        if (recreateSvgStatus) {
          recreateSvgStatus.textContent = `Error: ${errorMessage(error)}`;
          recreateSvgStatus.className = "status";
          recreateSvgStatus.style.color = "var(--error-color)";
        }
      } finally {
        if (recreateSvgBtn) recreateSvgBtn.disabled = false;
        recreateSpinner.classList.remove("visible");
        if (recreateSvgStatus) {
          setTimeout(() => {
            if (!recreateSvgStatus.textContent.startsWith("Error:")) {
              recreateSvgStatus.textContent = "";
            }
          }, 5e3);
        }
      }
    }
    function generatePngFromSvgPreview(minDimension = 1e3) {
      return new Promise((resolve, reject2) => {
        const svgPreviewDiv = element("svg-preview");
        const svgElement = readSvg(svgCodeEditor.value);
        if (!svgElement) {
          return reject2(new Error("No SVG in preview to generate PNG."));
        }
        const svgString = new XMLSerializer().serializeToString(svgElement);
        let svgWidth = svgElement.getAttribute("width") || svgElement.viewBox?.baseVal?.width || 300;
        let svgHeight = svgElement.getAttribute("height") || svgElement.viewBox?.baseVal?.height || 150;
        svgWidth = parseFloat(String(svgWidth)) || 300;
        svgHeight = parseFloat(String(svgHeight)) || 150;
        const aspectRatio = svgWidth / svgHeight;
        const qualityScale = 2;
        let targetWidth = svgWidth * qualityScale;
        let targetHeight = svgHeight * qualityScale;
        if (targetWidth < minDimension && targetHeight < minDimension) {
          let scaleFactor = svgWidth >= svgHeight ? minDimension / targetWidth : minDimension / targetHeight;
          targetWidth *= scaleFactor;
          targetHeight *= scaleFactor;
        }
        const canvasWidth = Math.round(targetWidth);
        const canvasHeight = Math.round(targetHeight);
        if (!rasterAllowed(canvasWidth, canvasHeight)) throw new Error("PNG dimensions exceed 8192px or 16 million pixels.");
        const canvas = document.createElement("canvas");
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas is unavailable");
        const img = new Image();
        let svgData = svgString;
        if (!svgData.includes("xmlns=")) {
          svgData = svgData.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
          try {
            const pngUrl = canvas.toDataURL("image/png");
            URL.revokeObjectURL(url);
            resolve(pngUrl);
          } catch (e) {
            URL.revokeObjectURL(url);
            reject2(new Error("Error converting canvas to PNG: " + errorMessage(e)));
          }
        };
        img.onerror = (e) => {
          URL.revokeObjectURL(url);
          reject2(new Error("Error loading SVG into image element for PNG generation."));
        };
        img.src = url;
      });
    }
    async function handleRefineSvg() {
      const refinementPrompt = refinementPromptInput.value.trim();
      const currentSvg = svgCodeEditor.value.trim();
      const selectedModel = refineModelSelect.value;
      if (!refinementPrompt) {
        refineStatus.textContent = "Please enter refinement instructions.";
        refineStatus.className = "status error";
        refineStatus.style.color = "var(--error-color)";
        return;
      }
      if (!currentSvg) {
        refineStatus.textContent = "No SVG code to refine.";
        refineStatus.className = "status error";
        refineStatus.style.color = "var(--error-color)";
        return;
      }
      refineBtn.disabled = true;
      refineStatus.textContent = "Refining SVG...";
      refineStatus.className = "status info";
      refineStatus.style.color = "";
      refineSpinner.classList.add("visible");
      let pngDataUrl = null;
      try {
        pngDataUrl = await generatePngFromSvgPreview(1e3);
        refineStatus.textContent = "Refining SVG with analysis...";
        const response = await fetch("/refine_svg", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            svg_code: currentSvg,
            refinement_prompt: refinementPrompt,
            model: selectedModel,
            png_data: pngDataUrl
            // Include the generated PNG data URL
          })
        });
        if (!response.ok) {
          let errorMsg = `Refinement failed (status ${response.status})`;
          try {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              const errorData = await responseStrings(response);
              errorMsg = `Refinement failed: ${errorData.error || JSON.stringify(errorData)}`;
            } else {
              const errorText = await response.text();
              console.error("Non-JSON error response from /refine_svg:", errorText);
              errorMsg = `Refinement failed: Server returned an unexpected response (status ${response.status}). Check console for details.`;
            }
          } catch (parseError) {
            console.error("Error processing the error response from /refine_svg:", parseError);
            errorMsg = `Refinement failed: Could not process error response (status ${response.status}).`;
          }
          throw new Error(errorMsg);
        }
        const data = await responseStrings(response);
        if (response.ok) {
          const refinedSvgCode = data.svg_code;
          if (!refinedSvgCode) throw new Error("No SVG returned.");
          svgCodeEditor.value = refinedSvgCode;
          updatePreview(refinedSvgCode);
          refinementPromptInput.value = "";
          refineStatus.textContent = "Refinement successful!";
          refineStatus.className = "status";
          refineStatus.style.color = "var(--success-color)";
          const currentPrompt = promptInput.value.trim();
          const activeComplexityButton = Array.from(complexityButtons).find((btn) => btn.classList.contains("active"));
          const complexity = activeComplexityButton ? parseInt(activeComplexityButton.dataset.value || "3", 10) : 3;
          const activeColorUsageButton = Array.from(colorUsageButtons).find((btn) => btn.classList.contains("active"));
          const colorUsage = activeColorUsageButton ? parseInt(activeColorUsageButton.dataset.value || "3", 10) : 3;
          saveHistoryItem(currentPrompt + ` (Refined${refinementPrompt ? ": " + refinementPrompt.substring(0, 20) + "..." : " - Auto"})`, complexity, colorUsage, selectedModel, refinedSvgCode);
          updateHistoryList();
        } else {
          throw new Error(data.error || "Unknown refinement error");
        }
      } catch (error) {
        console.error("Refinement/PNG Error:", error);
        refineStatus.textContent = `Error: ${errorMessage(error)}`;
        refineStatus.className = "status";
        refineStatus.style.color = "var(--error-color)";
      } finally {
        refineBtn.disabled = false;
        refineSpinner.classList.remove("visible");
        setTimeout(() => {
          if (!refineStatus.textContent.startsWith("Error:")) {
            refineStatus.textContent = "";
          }
        }, 5e3);
      }
    }
    function handleCopyMarkdown() {
      const analysisTypes = ["metadata", "semantic", "layout", "content_styling", "ocr"];
      let markdownString = "";
      let firstSection = true;
      analysisTypes.forEach((key) => {
        const textarea = element(`analysis-${key}`);
        if (textarea && textarea.value.trim() !== "") {
          let labelText = key.replace(/_/g, " ");
          labelText = labelText.charAt(0).toUpperCase() + labelText.slice(1);
          labelText += " Analysis:";
          if (!firstSection) {
            markdownString += "\n\n---\n\n";
          }
          markdownString += `## ${labelText}

`;
          markdownString += textarea.value.trim();
          firstSection = false;
        }
      });
      if (markdownString && navigator.clipboard) {
        navigator.clipboard.writeText(markdownString).then(() => {
          const originalText = copyMarkdownBtn.textContent;
          copyMarkdownBtn.textContent = "Copied!";
          copyMarkdownBtn.disabled = true;
          setTimeout(() => {
            copyMarkdownBtn.textContent = originalText;
            copyMarkdownBtn.disabled = false;
          }, 1500);
        }).catch((err) => {
          console.error("Failed to copy markdown: ", err);
          alert("Failed to copy markdown to clipboard.");
        });
      } else if (!markdownString) {
        alert("No analysis content available to copy.");
      } else {
        alert("Clipboard API not available in this browser.");
      }
    }
    if (recreateSvgBtn) {
      recreateSvgBtn.addEventListener("click", handleRecreateSvg);
    }
    if (refineBtn) {
      refineBtn.addEventListener("click", handleRefineSvg);
    }
    if (copyMarkdownBtn) {
      copyMarkdownBtn.addEventListener("click", handleCopyMarkdown);
    }
    let currentSvgAspectRatio = 1;
    function updatePngDimensions(changedInput) {
      const svgElement = readSvg(svgCodeEditor.value);
      if (!svgElement) {
        console.warn("updatePngDimensions: No SVG found in preview.");
        return;
      }
      let svgWidth = svgElement.getAttribute("width") || svgElement.viewBox?.baseVal?.width || 300;
      let svgHeight = svgElement.getAttribute("height") || svgElement.viewBox?.baseVal?.height || 150;
      svgWidth = parseFloat(String(svgWidth)) || 300;
      svgHeight = parseFloat(String(svgHeight)) || 1;
      if (svgHeight <= 0) svgHeight = 1;
      currentSvgAspectRatio = svgWidth / svgHeight;
      const widthInput = pngWidthInput;
      const heightInput = pngHeightInput;
      const widthVal = parseInt(widthInput.value, 10) || 0;
      const heightVal = parseInt(heightInput.value, 10) || 0;
      if (changedInput === widthInput && widthVal > 0) {
        const calculatedHeight = Math.round(widthVal / currentSvgAspectRatio);
        heightInput.value = String(calculatedHeight);
        heightInput.placeholder = String(calculatedHeight);
        heightInput.classList.add("auto-populated");
        widthInput.classList.remove("auto-populated");
      } else if (changedInput === heightInput && heightVal > 0) {
        const calculatedWidth = Math.round(heightVal * currentSvgAspectRatio);
        widthInput.value = String(calculatedWidth);
        widthInput.placeholder = String(calculatedWidth);
        widthInput.classList.add("auto-populated");
        heightInput.classList.remove("auto-populated");
      } else {
        if (changedInput === widthInput) {
          heightInput.value = "";
          heightInput.placeholder = "(auto-scales)";
          heightInput.classList.remove("auto-populated");
        } else if (changedInput === heightInput) {
          widthInput.value = "";
          widthInput.placeholder = "(auto-scales)";
          widthInput.classList.remove("auto-populated");
        }
      }
    }
    if (pngWidthInput && pngHeightInput) {
      pngWidthInput.addEventListener("input", () => updatePngDimensions(pngWidthInput));
      pngHeightInput.addEventListener("input", () => updatePngDimensions(pngHeightInput));
    }
    async function handleSavePng(event, useCustomDimensions = false) {
      const svgPreviewDiv = element("svg-preview");
      const svgElement = readSvg(svgCodeEditor.value);
      if (!svgElement) {
        alert("No SVG in preview to save as PNG.");
        return;
      }
      const svgString = new XMLSerializer().serializeToString(svgElement);
      let svgWidth = svgElement.getAttribute("width") || svgElement.viewBox?.baseVal?.width || 300;
      let svgHeight = svgElement.getAttribute("height") || svgElement.viewBox?.baseVal?.height || 150;
      svgWidth = parseFloat(String(svgWidth)) || 300;
      svgHeight = parseFloat(String(svgHeight)) || 150;
      if (svgHeight <= 0) svgHeight = 150;
      const aspectRatio = svgWidth / svgHeight;
      let canvasWidth, canvasHeight;
      if (useCustomDimensions) {
        const userWidth = parseInt(pngWidthInput.value, 10);
        const userHeight = parseInt(pngHeightInput.value, 10);
        if (userWidth > 0) {
          canvasWidth = userWidth;
          canvasHeight = Math.round(userWidth / aspectRatio);
        } else if (userHeight > 0) {
          canvasHeight = userHeight;
          canvasWidth = Math.round(userHeight * aspectRatio);
        } else {
          alert("Please enter a width or height for custom PNG save.");
          return;
        }
      } else {
        canvasWidth = svgWidth;
        canvasHeight = svgHeight;
      }
      canvasWidth = Math.max(1, canvasWidth || 300);
      canvasHeight = Math.max(1, canvasHeight || 150);
      if (!rasterAllowed(canvasWidth, canvasHeight)) {
        alert("PNG dimensions exceed 8192px or 16 million pixels.");
        return;
      }
      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas is unavailable");
      const img = new Image();
      let svgData = svgString;
      if (!svgData.includes("xmlns=")) {
        svgData = svgData.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
        try {
          const pngUrl = canvas.toDataURL("image/png");
          const downloadLink = document.createElement("a");
          downloadLink.href = pngUrl;
          const baseFilename = promptInput.value.trim().substring(0, 30).replace(/[^a-z0-9]/gi, "_") || "generated";
          downloadLink.download = useCustomDimensions ? `${baseFilename}_custom.png` : `${baseFilename}.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        } catch (e) {
          console.error("Error converting canvas to PNG:", e);
          alert("Failed to save SVG as PNG. The SVG might be too complex or contain unsupported features.");
        } finally {
          URL.revokeObjectURL(url);
        }
      };
      img.onerror = (e) => {
        console.error("Error loading SVG into image element:", e);
        alert("Failed to load SVG for PNG conversion. Please check SVG code for errors.");
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
    function updateCustomPngButtonState() {
      const widthVal = parseInt(pngWidthInput.value, 10) || 0;
      const heightVal = parseInt(pngHeightInput.value, 10) || 0;
      const svgPresent = !!readSvg(svgCodeEditor.value);
      if (svgPresent && (widthVal > 0 || heightVal > 0)) {
        saveCustomPngBtn.disabled = false;
        saveCustomPngBtn.classList.add("primary-btn");
        saveCustomPngBtn.classList.remove("secondary-btn");
      } else {
        saveCustomPngBtn.disabled = true;
        saveCustomPngBtn.classList.remove("primary-btn");
        saveCustomPngBtn.classList.add("secondary-btn");
      }
    }
    function resetCustomPngButtonState() {
      saveCustomPngBtn.disabled = true;
      saveCustomPngBtn.classList.remove("primary-btn");
      saveCustomPngBtn.classList.add("secondary-btn");
    }
    updatePreview("");
    updateHistoryList();
    switchTab("generator-tab-content");
  });
})();
/*! Bundled license information:

dompurify/dist/purify.es.mjs:
  (*! @license DOMPurify 3.4.17 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.17/LICENSE *)
  (*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE *)
*/
