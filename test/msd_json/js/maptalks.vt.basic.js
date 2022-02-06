/*!
 * @maptalks/vt.basic v0.60.1
 * LICENSE : UNLICENSED
 * (c) 2016-2022 maptalks.org
 */
!function(t, e) {
    "object" == typeof exports && "undefined" != typeof module ? e(exports, require("@maptalks/vt"), require("@maptalks/gl"), require("maptalks")) : "function" == typeof define && define.amd ? define([ "exports", "@maptalks/vt", "@maptalks/gl", "maptalks" ], e) : e(((t = "undefined" != typeof globalThis ? globalThis : t || self).maptalks = t.maptalks || {}, 
    t.maptalks.vt = t.maptalks.vt || {}, t.maptalks.vt.basic = {}), t.maptalks, t.maptalksgl, t.maptalks);
}(this, (function(t, e, n, i) {
    "use strict";
    function r(t) {
        if (t && t.t) return t;
        var e = Object.create(null);
        return t && Object.keys(t).forEach((function(n) {
            if ("default" !== n) {
                var i = Object.getOwnPropertyDescriptor(t, n);
                Object.defineProperty(e, n, i.get ? i : {
                    enumerable: !0,
                    get: function() {
                        return t[n];
                    }
                });
            }
        })), e.default = t, Object.freeze(e);
    }
    var o = r(i);
    const a = {};
    function s() {}
    const l = s.prototype;
    l.getType = function() {
        return Object.getPrototypeOf(this).constructor.type;
    }, l.isVisible = function() {
        throw new Error("to be implemented.");
    }, l.prepareRender = function() {
        throw new Error("to be implemented.");
    }, l.updateCollision = function() {
        throw new Error("to be implemented.");
    }, l.supportRenderMode = function() {
        throw new Error("to be implemented.");
    }, l.startFrame = function() {
        throw new Error("to be implemented.");
    }, l.endFrame = function() {
        throw new Error("to be implemented.");
    }, l.paintTile = function() {
        throw new Error("to be implemented.");
    }, l.getShadowMeshes = function() {
        throw new Error("to be implemented.");
    }, l.updateSceneConfig = function() {
        throw new Error("to be implemented.");
    }, l.updateDataConfig = function() {
        throw new Error("to be implemented.");
    }, l.updateSymbol = function() {
        throw new Error("to be implemented.");
    }, l.pick = function() {
        throw new Error("to be implemented.");
    }, l.resize = function() {
        throw new Error("to be implemented.");
    }, l.deleteTile = function() {
        throw new Error("to be implemented.");
    }, l.remove = function() {
        throw new Error("to be implemented.");
    }, l.needToRedraw = function() {
        throw new Error("to be implemented.");
    }, l.needToRetireFrames = function() {
        throw new Error("to be implemented.");
    }, l.outline = function() {
        throw new Error("to be implemented.");
    }, l.outlineAll = function() {
        throw new Error("to be implemented.");
    }, l.needPolygonOffset = function() {
        throw new Error("to be implemented.");
    }, l.constructor = s;
    const f = Object.prototype.hasOwnProperty;
    function c(t) {
        t.registerPlugin(this);
    }
    /*!
    * Contains code from jquery.easing
    * BSD License
    * https://github.com/gdsmith/jquery.easing/
    */    s.extend = function(t, e) {
        const n = function() {
            this.init && this.init();
        }, i = Object.create(l);
        i.constructor = n, n.prototype = i, n.type = t;
        for (const t in e) f.call(e, t) && (n.prototype[t] = e[t]);
        return n.registerAt = c.bind(n), a[t] = n, n;
    };
    var h = Math.pow, u = Math.sqrt, d = Math.sin, m = Math.cos, v = Math.PI, p = 1.70158, y = 1.525 * p, g = 2 * v / 3, b = 2 * v / 4.5;
    function _(t) {
        var e = 7.5625, n = 2.75;
        return t < 1 / n ? e * t * t : t < 2 / n ? e * (t -= 1.5 / n) * t + .75 : t < 2.5 / n ? e * (t -= 2.25 / n) * t + .9375 : e * (t -= 2.625 / n) * t + .984375;
    }
    function A(t, e) {
        switch (t = t.toLowerCase()) {
          case "swing":
            return function(t) {
                return x(t);
            }(e);

          case "easeinquad":
            return x(e);

          case "easeoutquad":
            return function(t) {
                return 1 - (1 - t) * (1 - t);
            }(e);

          case "easeinoutquad":
            return function(t) {
                return t < .5 ? 2 * t * t : 1 - h(-2 * t + 2, 2) / 2;
            }(e);

          case "easeincubic":
            return function(t) {
                return t * t * t;
            }(e);

          case "easeoutcubic":
            return function(t) {
                return 1 - h(1 - t, 3);
            }(e);

          case "easeinoutcubic":
            return function(t) {
                return t < .5 ? 4 * t * t * t : 1 - h(-2 * t + 2, 3) / 2;
            }(e);

          case "easeinquart":
            return function(t) {
                return t * t * t * t;
            }(e);

          case "easeoutquart":
            return function(t) {
                return 1 - h(1 - t, 4);
            }(e);

          case "easeinoutquart":
            return function(t) {
                return t < .5 ? 8 * t * t * t * t : 1 - h(-2 * t + 2, 4) / 2;
            }(e);

          case "easeinquint":
            return function(t) {
                return t * t * t * t * t;
            }(e);

          case "easeoutquint":
            return function(t) {
                return 1 - h(1 - t, 5);
            }(e);

          case "easeinoutquint":
            return function(t) {
                return t < .5 ? 16 * t * t * t * t * t : 1 - h(-2 * t + 2, 5) / 2;
            }(e);

          case "easeinsine":
            return function(t) {
                return 1 - m(t * v / 2);
            }(e);

          case "easeoutsine":
            return function(t) {
                return d(t * v / 2);
            }(e);

          case "easeinoutsine":
            return function(t) {
                return -(m(v * t) - 1) / 2;
            }(e);

          case "easeinexpo":
            return function(t) {
                return 0 === t ? 0 : h(2, 10 * t - 10);
            }(e);

          case "easeoutexpo":
            return function(t) {
                return 1 === t ? 1 : 1 - h(2, -10 * t);
            }(e);

          case "easeinoutexpo":
            return function(t) {
                return 0 === t ? 0 : 1 === t ? 1 : t < .5 ? h(2, 20 * t - 10) / 2 : (2 - h(2, -20 * t + 10)) / 2;
            }(e);

          case "easeincirc":
            return function(t) {
                return 1 - u(1 - h(t, 2));
            }(e);

          case "easeoutcirc":
            return function(t) {
                return u(1 - h(t - 1, 2));
            }(e);

          case "easeinoutcirc":
            return function(t) {
                return t < .5 ? (1 - u(1 - h(2 * t, 2))) / 2 : (u(1 - h(-2 * t + 2, 2)) + 1) / 2;
            }(e);

          case "easeinelastic":
            return function(t) {
                return 0 === t ? 0 : 1 === t ? 1 : -h(2, 10 * t - 10) * d((10 * t - 10.75) * g);
            }(e);

          case "easeoutelastic":
            return function(t) {
                return 0 === t ? 0 : 1 === t ? 1 : h(2, -10 * t) * d((10 * t - .75) * g) + 1;
            }(e);

          case "easeinoutelastic":
            return function(t) {
                return 0 === t ? 0 : 1 === t ? 1 : t < .5 ? -h(2, 20 * t - 10) * d((20 * t - 11.125) * b) / 2 : h(2, -20 * t + 10) * d((20 * t - 11.125) * b) / 2 + 1;
            }(e);

          case "easeinback":
            return function(t) {
                return 2.70158 * t * t * t - p * t * t;
            }(e);

          case "easeoutback":
            return function(t) {
                return 1 + 2.70158 * h(t - 1, 3) + p * h(t - 1, 2);
            }(e);

          case "easeinoutback":
            return function(t) {
                return t < .5 ? h(2 * t, 2) * (7.189819 * t - y) / 2 : (h(2 * t - 2, 2) * ((y + 1) * (2 * t - 2) + y) + 2) / 2;
            }(e);

          case "easeinbounce":
            return function(t) {
                return 1 - _(1 - t);
            }(e);

          case "easeoutbounce":
            return function(t) {
                return _(t);
            }(e);

          case "easeinoutbounce":
            return function(t) {
                return t < .5 ? (1 - _(1 - 2 * t)) / 2 : (1 + _(2 * t - 1)) / 2;
            }
            /*!
        Feature Filter by

        (c) mapbox 2016 and maptalks 2018
        www.mapbox.com | www.maptalks.org
        License: MIT, header required.
    */ (e);
        }
        throw new Error("Unsupported easing function:" + t);
    }
    function x(t) {
        return t * t;
    }
    const S = [ "Unknown", "Point", "LineString", "Polygon", "MultiPoint", "MultiLineString", "MultiPolygon", "GeometryCollection" ];
    function w(t) {
        if (!t) return "true";
        const e = t[0];
        if (t.length <= 1) return "any" === e ? "false" : "true";
        return `(${"==" === e ? T(t[1], t[2], "===", !1) : "!=" === e ? T(t[1], t[2], "!==", !1) : "<" === e || ">" === e || "<=" === e || ">=" === e ? T(t[1], t[2], e, !0) : "any" === e ? O(t.slice(1), "||") : "all" === e ? O(t.slice(1), "&&") : "none" === e ? P(O(t.slice(1), "||")) : "in" === e ? I(t[1], t.slice(2)) : "!in" === e ? P(I(t[1], t.slice(2))) : "has" === e ? H(t[1]) : "!has" === e ? P(H(t[1])) : "true"})`;
    }
    function M(t) {
        return "$" === t[0] ? "f." + t.substring(1) : "p[" + JSON.stringify(t) + "]";
    }
    function T(t, e, n, i) {
        const r = M(t), o = "$type" === t ? S.indexOf(e) : JSON.stringify(e);
        return (i ? `typeof ${r}=== typeof ${o}&&` : "") + r + n + o;
    }
    function O(t, e) {
        return t.map(w).join(e);
    }
    function I(t, e) {
        "$type" === t && (e = e.map(t => S.indexOf(t)));
        const n = JSON.stringify(e.sort(C)), i = M(t);
        return e.length <= 200 ? `${n}.indexOf(${i}) !== -1` : `function(v, a, i, j) {\n        while (i <= j) { var m = (i + j) >> 1;\n            if (a[m] === v) return true; if (a[m] > v) j = m - 1; else i = m + 1;\n        }\n    return false; }(${i}, ${n},0,${e.length - 1})`;
    }
    function H(t) {
        return "$id" === t ? '"id" in f' : JSON.stringify(t) + " in p";
    }
    function P(t) {
        return `!(${t})`;
    }
    function C(t, e) {
        return t < e ? -1 : t > e ? 1 : 0;
    }
    var E = {
        exports: {}
    }, R = {
        aliceblue: [ 240, 248, 255 ],
        antiquewhite: [ 250, 235, 215 ],
        aqua: [ 0, 255, 255 ],
        aquamarine: [ 127, 255, 212 ],
        azure: [ 240, 255, 255 ],
        beige: [ 245, 245, 220 ],
        bisque: [ 255, 228, 196 ],
        black: [ 0, 0, 0 ],
        blanchedalmond: [ 255, 235, 205 ],
        blue: [ 0, 0, 255 ],
        blueviolet: [ 138, 43, 226 ],
        brown: [ 165, 42, 42 ],
        burlywood: [ 222, 184, 135 ],
        cadetblue: [ 95, 158, 160 ],
        chartreuse: [ 127, 255, 0 ],
        chocolate: [ 210, 105, 30 ],
        coral: [ 255, 127, 80 ],
        cornflowerblue: [ 100, 149, 237 ],
        cornsilk: [ 255, 248, 220 ],
        crimson: [ 220, 20, 60 ],
        cyan: [ 0, 255, 255 ],
        darkblue: [ 0, 0, 139 ],
        darkcyan: [ 0, 139, 139 ],
        darkgoldenrod: [ 184, 134, 11 ],
        darkgray: [ 169, 169, 169 ],
        darkgreen: [ 0, 100, 0 ],
        darkgrey: [ 169, 169, 169 ],
        darkkhaki: [ 189, 183, 107 ],
        darkmagenta: [ 139, 0, 139 ],
        darkolivegreen: [ 85, 107, 47 ],
        darkorange: [ 255, 140, 0 ],
        darkorchid: [ 153, 50, 204 ],
        darkred: [ 139, 0, 0 ],
        darksalmon: [ 233, 150, 122 ],
        darkseagreen: [ 143, 188, 143 ],
        darkslateblue: [ 72, 61, 139 ],
        darkslategray: [ 47, 79, 79 ],
        darkslategrey: [ 47, 79, 79 ],
        darkturquoise: [ 0, 206, 209 ],
        darkviolet: [ 148, 0, 211 ],
        deeppink: [ 255, 20, 147 ],
        deepskyblue: [ 0, 191, 255 ],
        dimgray: [ 105, 105, 105 ],
        dimgrey: [ 105, 105, 105 ],
        dodgerblue: [ 30, 144, 255 ],
        firebrick: [ 178, 34, 34 ],
        floralwhite: [ 255, 250, 240 ],
        forestgreen: [ 34, 139, 34 ],
        fuchsia: [ 255, 0, 255 ],
        gainsboro: [ 220, 220, 220 ],
        ghostwhite: [ 248, 248, 255 ],
        gold: [ 255, 215, 0 ],
        goldenrod: [ 218, 165, 32 ],
        gray: [ 128, 128, 128 ],
        green: [ 0, 128, 0 ],
        greenyellow: [ 173, 255, 47 ],
        grey: [ 128, 128, 128 ],
        honeydew: [ 240, 255, 240 ],
        hotpink: [ 255, 105, 180 ],
        indianred: [ 205, 92, 92 ],
        indigo: [ 75, 0, 130 ],
        ivory: [ 255, 255, 240 ],
        khaki: [ 240, 230, 140 ],
        lavender: [ 230, 230, 250 ],
        lavenderblush: [ 255, 240, 245 ],
        lawngreen: [ 124, 252, 0 ],
        lemonchiffon: [ 255, 250, 205 ],
        lightblue: [ 173, 216, 230 ],
        lightcoral: [ 240, 128, 128 ],
        lightcyan: [ 224, 255, 255 ],
        lightgoldenrodyellow: [ 250, 250, 210 ],
        lightgray: [ 211, 211, 211 ],
        lightgreen: [ 144, 238, 144 ],
        lightgrey: [ 211, 211, 211 ],
        lightpink: [ 255, 182, 193 ],
        lightsalmon: [ 255, 160, 122 ],
        lightseagreen: [ 32, 178, 170 ],
        lightskyblue: [ 135, 206, 250 ],
        lightslategray: [ 119, 136, 153 ],
        lightslategrey: [ 119, 136, 153 ],
        lightsteelblue: [ 176, 196, 222 ],
        lightyellow: [ 255, 255, 224 ],
        lime: [ 0, 255, 0 ],
        limegreen: [ 50, 205, 50 ],
        linen: [ 250, 240, 230 ],
        magenta: [ 255, 0, 255 ],
        maroon: [ 128, 0, 0 ],
        mediumaquamarine: [ 102, 205, 170 ],
        mediumblue: [ 0, 0, 205 ],
        mediumorchid: [ 186, 85, 211 ],
        mediumpurple: [ 147, 112, 219 ],
        mediumseagreen: [ 60, 179, 113 ],
        mediumslateblue: [ 123, 104, 238 ],
        mediumspringgreen: [ 0, 250, 154 ],
        mediumturquoise: [ 72, 209, 204 ],
        mediumvioletred: [ 199, 21, 133 ],
        midnightblue: [ 25, 25, 112 ],
        mintcream: [ 245, 255, 250 ],
        mistyrose: [ 255, 228, 225 ],
        moccasin: [ 255, 228, 181 ],
        navajowhite: [ 255, 222, 173 ],
        navy: [ 0, 0, 128 ],
        oldlace: [ 253, 245, 230 ],
        olive: [ 128, 128, 0 ],
        olivedrab: [ 107, 142, 35 ],
        orange: [ 255, 165, 0 ],
        orangered: [ 255, 69, 0 ],
        orchid: [ 218, 112, 214 ],
        palegoldenrod: [ 238, 232, 170 ],
        palegreen: [ 152, 251, 152 ],
        paleturquoise: [ 175, 238, 238 ],
        palevioletred: [ 219, 112, 147 ],
        papayawhip: [ 255, 239, 213 ],
        peachpuff: [ 255, 218, 185 ],
        peru: [ 205, 133, 63 ],
        pink: [ 255, 192, 203 ],
        plum: [ 221, 160, 221 ],
        powderblue: [ 176, 224, 230 ],
        purple: [ 128, 0, 128 ],
        rebeccapurple: [ 102, 51, 153 ],
        red: [ 255, 0, 0 ],
        rosybrown: [ 188, 143, 143 ],
        royalblue: [ 65, 105, 225 ],
        saddlebrown: [ 139, 69, 19 ],
        salmon: [ 250, 128, 114 ],
        sandybrown: [ 244, 164, 96 ],
        seagreen: [ 46, 139, 87 ],
        seashell: [ 255, 245, 238 ],
        sienna: [ 160, 82, 45 ],
        silver: [ 192, 192, 192 ],
        skyblue: [ 135, 206, 235 ],
        slateblue: [ 106, 90, 205 ],
        slategray: [ 112, 128, 144 ],
        slategrey: [ 112, 128, 144 ],
        snow: [ 255, 250, 250 ],
        springgreen: [ 0, 255, 127 ],
        steelblue: [ 70, 130, 180 ],
        tan: [ 210, 180, 140 ],
        teal: [ 0, 128, 128 ],
        thistle: [ 216, 191, 216 ],
        tomato: [ 255, 99, 71 ],
        turquoise: [ 64, 224, 208 ],
        violet: [ 238, 130, 238 ],
        wheat: [ 245, 222, 179 ],
        white: [ 255, 255, 255 ],
        whitesmoke: [ 245, 245, 245 ],
        yellow: [ 255, 255, 0 ],
        yellowgreen: [ 154, 205, 50 ]
    }, D = {
        exports: {}
    }, N = function(t) {
        return !(!t || "string" == typeof t) && (t instanceof Array || Array.isArray(t) || t.length >= 0 && (t.splice instanceof Function || Object.getOwnPropertyDescriptor(t, t.length - 1) && "String" !== t.constructor.name));
    }, k = Array.prototype.concat, L = Array.prototype.slice, z = D.exports = function(t) {
        for (var e = [], n = 0, i = t.length; n < i; n++) {
            var r = t[n];
            N(r) ? e = k.call(e, L.call(r)) : e.push(r);
        }
        return e;
    };
    z.wrap = function(t) {
        return function() {
            return t(z(arguments));
        };
    };
    var F = R, V = D.exports, j = {};
    for (var G in F) F.hasOwnProperty(G) && (j[F[G]] = G);
    var U = E.exports = {
        to: {},
        get: {}
    };
    function W(t, e, n) {
        return Math.min(Math.max(e, t), n);
    }
    function B(t) {
        var e = t.toString(16).toUpperCase();
        return e.length < 2 ? "0" + e : e;
    }
    U.get = function(t) {
        var e, n;
        switch (t.substring(0, 3).toLowerCase()) {
          case "hsl":
            e = U.get.hsl(t), n = "hsl";
            break;

          case "hwb":
            e = U.get.hwb(t), n = "hwb";
            break;

          default:
            e = U.get.rgb(t), n = "rgb";
        }
        return e ? {
            model: n,
            value: e
        } : null;
    }, U.get.rgb = function(t) {
        if (!t) return null;
        var e, n, i, r = [ 0, 0, 0, 1 ];
        if (e = t.match(/^#([a-f0-9]{6})([a-f0-9]{2})?$/i)) {
            for (i = e[2], e = e[1], n = 0; n < 3; n++) {
                var o = 2 * n;
                r[n] = parseInt(e.slice(o, o + 2), 16);
            }
            i && (r[3] = Math.round(parseInt(i, 16) / 255 * 100) / 100);
        } else if (e = t.match(/^#([a-f0-9]{3,4})$/i)) {
            for (i = (e = e[1])[3], n = 0; n < 3; n++) r[n] = parseInt(e[n] + e[n], 16);
            i && (r[3] = Math.round(parseInt(i + i, 16) / 255 * 100) / 100);
        } else if (e = t.match(/^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/)) {
            for (n = 0; n < 3; n++) r[n] = parseInt(e[n + 1], 0);
            e[4] && (r[3] = parseFloat(e[4]));
        } else {
            if (!(e = t.match(/^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/))) return (e = t.match(/(\D+)/)) ? "transparent" === e[1] ? [ 0, 0, 0, 0 ] : (r = F[e[1]]) ? (r[3] = 1, 
            r) : null : null;
            for (n = 0; n < 3; n++) r[n] = Math.round(2.55 * parseFloat(e[n + 1]));
            e[4] && (r[3] = parseFloat(e[4]));
        }
        for (n = 0; n < 3; n++) r[n] = W(r[n], 0, 255);
        return r[3] = W(r[3], 0, 1), r;
    }, U.get.hsl = function(t) {
        if (!t) return null;
        var e = t.match(/^hsla?\(\s*([+-]?(?:\d*\.)?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/);
        if (e) {
            var n = parseFloat(e[4]);
            return [ (parseFloat(e[1]) + 360) % 360, W(parseFloat(e[2]), 0, 100), W(parseFloat(e[3]), 0, 100), W(isNaN(n) ? 1 : n, 0, 1) ];
        }
        return null;
    }, U.get.hwb = function(t) {
        if (!t) return null;
        var e = t.match(/^hwb\(\s*([+-]?\d*[\.]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/);
        if (e) {
            var n = parseFloat(e[4]);
            return [ (parseFloat(e[1]) % 360 + 360) % 360, W(parseFloat(e[2]), 0, 100), W(parseFloat(e[3]), 0, 100), W(isNaN(n) ? 1 : n, 0, 1) ];
        }
        return null;
    }, U.to.hex = function() {
        var t = V(arguments);
        return "#" + B(t[0]) + B(t[1]) + B(t[2]) + (t[3] < 1 ? B(Math.round(255 * t[3])) : "");
    }, U.to.rgb = function() {
        var t = V(arguments);
        return t.length < 4 || 1 === t[3] ? "rgb(" + Math.round(t[0]) + ", " + Math.round(t[1]) + ", " + Math.round(t[2]) + ")" : "rgba(" + Math.round(t[0]) + ", " + Math.round(t[1]) + ", " + Math.round(t[2]) + ", " + t[3] + ")";
    }, U.to.rgb.percent = function() {
        var t = V(arguments), e = Math.round(t[0] / 255 * 100), n = Math.round(t[1] / 255 * 100), i = Math.round(t[2] / 255 * 100);
        return t.length < 4 || 1 === t[3] ? "rgb(" + e + "%, " + n + "%, " + i + "%)" : "rgba(" + e + "%, " + n + "%, " + i + "%, " + t[3] + ")";
    }, U.to.hsl = function() {
        var t = V(arguments);
        return t.length < 4 || 1 === t[3] ? "hsl(" + t[0] + ", " + t[1] + "%, " + t[2] + "%)" : "hsla(" + t[0] + ", " + t[1] + "%, " + t[2] + "%, " + t[3] + ")";
    }, U.to.hwb = function() {
        var t = V(arguments), e = "";
        return t.length >= 4 && 1 !== t[3] && (e = ", " + t[3]), "hwb(" + t[0] + ", " + t[1] + "%, " + t[2] + "%" + e + ")";
    }, U.to.keyword = function(t) {
        return j[t.slice(0, 3)];
    };
    var X = {
        exports: {}
    }, Y = R, K = {};
    for (var q in Y) Y.hasOwnProperty(q) && (K[Y[q]] = q);
    var J = X.exports = {
        rgb: {
            channels: 3,
            labels: "rgb"
        },
        hsl: {
            channels: 3,
            labels: "hsl"
        },
        hsv: {
            channels: 3,
            labels: "hsv"
        },
        hwb: {
            channels: 3,
            labels: "hwb"
        },
        cmyk: {
            channels: 4,
            labels: "cmyk"
        },
        xyz: {
            channels: 3,
            labels: "xyz"
        },
        lab: {
            channels: 3,
            labels: "lab"
        },
        lch: {
            channels: 3,
            labels: "lch"
        },
        hex: {
            channels: 1,
            labels: [ "hex" ]
        },
        keyword: {
            channels: 1,
            labels: [ "keyword" ]
        },
        ansi16: {
            channels: 1,
            labels: [ "ansi16" ]
        },
        ansi256: {
            channels: 1,
            labels: [ "ansi256" ]
        },
        hcg: {
            channels: 3,
            labels: [ "h", "c", "g" ]
        },
        apple: {
            channels: 3,
            labels: [ "r16", "g16", "b16" ]
        },
        gray: {
            channels: 1,
            labels: [ "gray" ]
        }
    };
    for (var Z in J) if (J.hasOwnProperty(Z)) {
        if (!("channels" in J[Z])) throw new Error("missing channels property: " + Z);
        if (!("labels" in J[Z])) throw new Error("missing channel labels property: " + Z);
        if (J[Z].labels.length !== J[Z].channels) throw new Error("channel and label counts mismatch: " + Z);
        var $ = J[Z].channels, Q = J[Z].labels;
        delete J[Z].channels, delete J[Z].labels, Object.defineProperty(J[Z], "channels", {
            value: $
        }), Object.defineProperty(J[Z], "labels", {
            value: Q
        });
    }
    J.rgb.hsl = function(t) {
        var e, n, i = t[0] / 255, r = t[1] / 255, o = t[2] / 255, a = Math.min(i, r, o), s = Math.max(i, r, o), l = s - a;
        return s === a ? e = 0 : i === s ? e = (r - o) / l : r === s ? e = 2 + (o - i) / l : o === s && (e = 4 + (i - r) / l), 
        (e = Math.min(60 * e, 360)) < 0 && (e += 360), n = (a + s) / 2, [ e, 100 * (s === a ? 0 : n <= .5 ? l / (s + a) : l / (2 - s - a)), 100 * n ];
    }, J.rgb.hsv = function(t) {
        var e, n, i = t[0], r = t[1], o = t[2], a = Math.min(i, r, o), s = Math.max(i, r, o), l = s - a;
        return n = 0 === s ? 0 : l / s * 1e3 / 10, s === a ? e = 0 : i === s ? e = (r - o) / l : r === s ? e = 2 + (o - i) / l : o === s && (e = 4 + (i - r) / l), 
        (e = Math.min(60 * e, 360)) < 0 && (e += 360), [ e, n, s / 255 * 1e3 / 10 ];
    }, J.rgb.hwb = function(t) {
        var e = t[0], n = t[1], i = t[2];
        return [ J.rgb.hsl(t)[0], 100 * (1 / 255 * Math.min(e, Math.min(n, i))), 100 * (i = 1 - 1 / 255 * Math.max(e, Math.max(n, i))) ];
    }, J.rgb.cmyk = function(t) {
        var e, n = t[0] / 255, i = t[1] / 255, r = t[2] / 255;
        return [ 100 * ((1 - n - (e = Math.min(1 - n, 1 - i, 1 - r))) / (1 - e) || 0), 100 * ((1 - i - e) / (1 - e) || 0), 100 * ((1 - r - e) / (1 - e) || 0), 100 * e ];
    }, J.rgb.keyword = function(t) {
        var e = K[t];
        if (e) return e;
        var n, i, r, o = 1 / 0;
        for (var a in Y) if (Y.hasOwnProperty(a)) {
            var s = Y[a], l = (i = t, r = s, Math.pow(i[0] - r[0], 2) + Math.pow(i[1] - r[1], 2) + Math.pow(i[2] - r[2], 2));
            l < o && (o = l, n = a);
        }
        return n;
    }, J.keyword.rgb = function(t) {
        return Y[t];
    }, J.rgb.xyz = function(t) {
        var e = t[0] / 255, n = t[1] / 255, i = t[2] / 255;
        return [ 100 * (.4124 * (e = e > .04045 ? Math.pow((e + .055) / 1.055, 2.4) : e / 12.92) + .3576 * (n = n > .04045 ? Math.pow((n + .055) / 1.055, 2.4) : n / 12.92) + .1805 * (i = i > .04045 ? Math.pow((i + .055) / 1.055, 2.4) : i / 12.92)), 100 * (.2126 * e + .7152 * n + .0722 * i), 100 * (.0193 * e + .1192 * n + .9505 * i) ];
    }, J.rgb.lab = function(t) {
        var e = J.rgb.xyz(t), n = e[0], i = e[1], r = e[2];
        return i /= 100, r /= 108.883, n = (n /= 95.047) > .008856 ? Math.pow(n, 1 / 3) : 7.787 * n + 16 / 116, 
        [ 116 * (i = i > .008856 ? Math.pow(i, 1 / 3) : 7.787 * i + 16 / 116) - 16, 500 * (n - i), 200 * (i - (r = r > .008856 ? Math.pow(r, 1 / 3) : 7.787 * r + 16 / 116)) ];
    }, J.hsl.rgb = function(t) {
        var e, n, i, r, o, a = t[0] / 360, s = t[1] / 100, l = t[2] / 100;
        if (0 === s) return [ o = 255 * l, o, o ];
        e = 2 * l - (n = l < .5 ? l * (1 + s) : l + s - l * s), r = [ 0, 0, 0 ];
        for (var f = 0; f < 3; f++) (i = a + 1 / 3 * -(f - 1)) < 0 && i++, i > 1 && i--, 
        o = 6 * i < 1 ? e + 6 * (n - e) * i : 2 * i < 1 ? n : 3 * i < 2 ? e + (n - e) * (2 / 3 - i) * 6 : e, 
        r[f] = 255 * o;
        return r;
    }, J.hsl.hsv = function(t) {
        var e = t[0], n = t[1] / 100, i = t[2] / 100, r = n, o = Math.max(i, .01);
        return n *= (i *= 2) <= 1 ? i : 2 - i, r *= o <= 1 ? o : 2 - o, [ e, 100 * (0 === i ? 2 * r / (o + r) : 2 * n / (i + n)), 100 * ((i + n) / 2) ];
    }, J.hsv.rgb = function(t) {
        var e = t[0] / 60, n = t[1] / 100, i = t[2] / 100, r = Math.floor(e) % 6, o = e - Math.floor(e), a = 255 * i * (1 - n), s = 255 * i * (1 - n * o), l = 255 * i * (1 - n * (1 - o));
        switch (i *= 255, r) {
          case 0:
            return [ i, l, a ];

          case 1:
            return [ s, i, a ];

          case 2:
            return [ a, i, l ];

          case 3:
            return [ a, s, i ];

          case 4:
            return [ l, a, i ];

          case 5:
            return [ i, a, s ];
        }
    }, J.hsv.hsl = function(t) {
        var e, n, i, r = t[0], o = t[1] / 100, a = t[2] / 100, s = Math.max(a, .01);
        return i = (2 - o) * a, n = o * s, [ r, 100 * (n = (n /= (e = (2 - o) * s) <= 1 ? e : 2 - e) || 0), 100 * (i /= 2) ];
    }, J.hwb.rgb = function(t) {
        var e, n, i, r, o, a, s, l = t[0] / 360, f = t[1] / 100, c = t[2] / 100, h = f + c;
        switch (h > 1 && (f /= h, c /= h), i = 6 * l - (e = Math.floor(6 * l)), 0 != (1 & e) && (i = 1 - i), 
        r = f + i * ((n = 1 - c) - f), e) {
          default:
          case 6:
          case 0:
            o = n, a = r, s = f;
            break;

          case 1:
            o = r, a = n, s = f;
            break;

          case 2:
            o = f, a = n, s = r;
            break;

          case 3:
            o = f, a = r, s = n;
            break;

          case 4:
            o = r, a = f, s = n;
            break;

          case 5:
            o = n, a = f, s = r;
        }
        return [ 255 * o, 255 * a, 255 * s ];
    }, J.cmyk.rgb = function(t) {
        var e = t[0] / 100, n = t[1] / 100, i = t[2] / 100, r = t[3] / 100;
        return [ 255 * (1 - Math.min(1, e * (1 - r) + r)), 255 * (1 - Math.min(1, n * (1 - r) + r)), 255 * (1 - Math.min(1, i * (1 - r) + r)) ];
    }, J.xyz.rgb = function(t) {
        var e, n, i, r = t[0] / 100, o = t[1] / 100, a = t[2] / 100;
        return n = -.9689 * r + 1.8758 * o + .0415 * a, i = .0557 * r + -.204 * o + 1.057 * a, 
        e = (e = 3.2406 * r + -1.5372 * o + -.4986 * a) > .0031308 ? 1.055 * Math.pow(e, 1 / 2.4) - .055 : 12.92 * e, 
        n = n > .0031308 ? 1.055 * Math.pow(n, 1 / 2.4) - .055 : 12.92 * n, i = i > .0031308 ? 1.055 * Math.pow(i, 1 / 2.4) - .055 : 12.92 * i, 
        [ 255 * (e = Math.min(Math.max(0, e), 1)), 255 * (n = Math.min(Math.max(0, n), 1)), 255 * (i = Math.min(Math.max(0, i), 1)) ];
    }, J.xyz.lab = function(t) {
        var e = t[0], n = t[1], i = t[2];
        return n /= 100, i /= 108.883, e = (e /= 95.047) > .008856 ? Math.pow(e, 1 / 3) : 7.787 * e + 16 / 116, 
        [ 116 * (n = n > .008856 ? Math.pow(n, 1 / 3) : 7.787 * n + 16 / 116) - 16, 500 * (e - n), 200 * (n - (i = i > .008856 ? Math.pow(i, 1 / 3) : 7.787 * i + 16 / 116)) ];
    }, J.lab.xyz = function(t) {
        var e, n, i, r = t[0];
        e = t[1] / 500 + (n = (r + 16) / 116), i = n - t[2] / 200;
        var o = Math.pow(n, 3), a = Math.pow(e, 3), s = Math.pow(i, 3);
        return n = o > .008856 ? o : (n - 16 / 116) / 7.787, e = a > .008856 ? a : (e - 16 / 116) / 7.787, 
        i = s > .008856 ? s : (i - 16 / 116) / 7.787, [ e *= 95.047, n *= 100, i *= 108.883 ];
    }, J.lab.lch = function(t) {
        var e, n = t[0], i = t[1], r = t[2];
        return (e = 360 * Math.atan2(r, i) / 2 / Math.PI) < 0 && (e += 360), [ n, Math.sqrt(i * i + r * r), e ];
    }, J.lch.lab = function(t) {
        var e, n = t[0], i = t[1];
        return e = t[2] / 360 * 2 * Math.PI, [ n, i * Math.cos(e), i * Math.sin(e) ];
    }, J.rgb.ansi16 = function(t) {
        var e = t[0], n = t[1], i = t[2], r = 1 in arguments ? arguments[1] : J.rgb.hsv(t)[2];
        if (0 === (r = Math.round(r / 50))) return 30;
        var o = 30 + (Math.round(i / 255) << 2 | Math.round(n / 255) << 1 | Math.round(e / 255));
        return 2 === r && (o += 60), o;
    }, J.hsv.ansi16 = function(t) {
        return J.rgb.ansi16(J.hsv.rgb(t), t[2]);
    }, J.rgb.ansi256 = function(t) {
        var e = t[0], n = t[1], i = t[2];
        return e === n && n === i ? e < 8 ? 16 : e > 248 ? 231 : Math.round((e - 8) / 247 * 24) + 232 : 16 + 36 * Math.round(e / 255 * 5) + 6 * Math.round(n / 255 * 5) + Math.round(i / 255 * 5);
    }, J.ansi16.rgb = function(t) {
        var e = t % 10;
        if (0 === e || 7 === e) return t > 50 && (e += 3.5), [ e = e / 10.5 * 255, e, e ];
        var n = .5 * (1 + ~~(t > 50));
        return [ (1 & e) * n * 255, (e >> 1 & 1) * n * 255, (e >> 2 & 1) * n * 255 ];
    }, J.ansi256.rgb = function(t) {
        if (t >= 232) {
            var e = 10 * (t - 232) + 8;
            return [ e, e, e ];
        }
        var n;
        return t -= 16, [ Math.floor(t / 36) / 5 * 255, Math.floor((n = t % 36) / 6) / 5 * 255, n % 6 / 5 * 255 ];
    }, J.rgb.hex = function(t) {
        var e = (((255 & Math.round(t[0])) << 16) + ((255 & Math.round(t[1])) << 8) + (255 & Math.round(t[2]))).toString(16).toUpperCase();
        return "000000".substring(e.length) + e;
    }, J.hex.rgb = function(t) {
        var e = t.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
        if (!e) return [ 0, 0, 0 ];
        var n = e[0];
        3 === e[0].length && (n = n.split("").map((function(t) {
            return t + t;
        })).join(""));
        var i = parseInt(n, 16);
        return [ i >> 16 & 255, i >> 8 & 255, 255 & i ];
    }, J.rgb.hcg = function(t) {
        var e, n = t[0] / 255, i = t[1] / 255, r = t[2] / 255, o = Math.max(Math.max(n, i), r), a = Math.min(Math.min(n, i), r), s = o - a;
        return e = s <= 0 ? 0 : o === n ? (i - r) / s % 6 : o === i ? 2 + (r - n) / s : 4 + (n - i) / s + 4, 
        e /= 6, [ 360 * (e %= 1), 100 * s, 100 * (s < 1 ? a / (1 - s) : 0) ];
    }, J.hsl.hcg = function(t) {
        var e = t[1] / 100, n = t[2] / 100, i = 1, r = 0;
        return (i = n < .5 ? 2 * e * n : 2 * e * (1 - n)) < 1 && (r = (n - .5 * i) / (1 - i)), 
        [ t[0], 100 * i, 100 * r ];
    }, J.hsv.hcg = function(t) {
        var e = t[1] / 100, n = t[2] / 100, i = e * n, r = 0;
        return i < 1 && (r = (n - i) / (1 - i)), [ t[0], 100 * i, 100 * r ];
    }, J.hcg.rgb = function(t) {
        var e = t[0] / 360, n = t[1] / 100, i = t[2] / 100;
        if (0 === n) return [ 255 * i, 255 * i, 255 * i ];
        var r, o = [ 0, 0, 0 ], a = e % 1 * 6, s = a % 1, l = 1 - s;
        switch (Math.floor(a)) {
          case 0:
            o[0] = 1, o[1] = s, o[2] = 0;
            break;

          case 1:
            o[0] = l, o[1] = 1, o[2] = 0;
            break;

          case 2:
            o[0] = 0, o[1] = 1, o[2] = s;
            break;

          case 3:
            o[0] = 0, o[1] = l, o[2] = 1;
            break;

          case 4:
            o[0] = s, o[1] = 0, o[2] = 1;
            break;

          default:
            o[0] = 1, o[1] = 0, o[2] = l;
        }
        return r = (1 - n) * i, [ 255 * (n * o[0] + r), 255 * (n * o[1] + r), 255 * (n * o[2] + r) ];
    }, J.hcg.hsv = function(t) {
        var e = t[1] / 100, n = e + t[2] / 100 * (1 - e), i = 0;
        return n > 0 && (i = e / n), [ t[0], 100 * i, 100 * n ];
    }, J.hcg.hsl = function(t) {
        var e = t[1] / 100, n = t[2] / 100 * (1 - e) + .5 * e, i = 0;
        return n > 0 && n < .5 ? i = e / (2 * n) : n >= .5 && n < 1 && (i = e / (2 * (1 - n))), 
        [ t[0], 100 * i, 100 * n ];
    }, J.hcg.hwb = function(t) {
        var e = t[1] / 100, n = e + t[2] / 100 * (1 - e);
        return [ t[0], 100 * (n - e), 100 * (1 - n) ];
    }, J.hwb.hcg = function(t) {
        var e = t[1] / 100, n = 1 - t[2] / 100, i = n - e, r = 0;
        return i < 1 && (r = (n - i) / (1 - i)), [ t[0], 100 * i, 100 * r ];
    }, J.apple.rgb = function(t) {
        return [ t[0] / 65535 * 255, t[1] / 65535 * 255, t[2] / 65535 * 255 ];
    }, J.rgb.apple = function(t) {
        return [ t[0] / 255 * 65535, t[1] / 255 * 65535, t[2] / 255 * 65535 ];
    }, J.gray.rgb = function(t) {
        return [ t[0] / 100 * 255, t[0] / 100 * 255, t[0] / 100 * 255 ];
    }, J.gray.hsl = J.gray.hsv = function(t) {
        return [ 0, 0, t[0] ];
    }, J.gray.hwb = function(t) {
        return [ 0, 100, t[0] ];
    }, J.gray.cmyk = function(t) {
        return [ 0, 0, 0, t[0] ];
    }, J.gray.lab = function(t) {
        return [ t[0], 0, 0 ];
    }, J.gray.hex = function(t) {
        var e = 255 & Math.round(t[0] / 100 * 255), n = ((e << 16) + (e << 8) + e).toString(16).toUpperCase();
        return "000000".substring(n.length) + n;
    }, J.rgb.gray = function(t) {
        return [ (t[0] + t[1] + t[2]) / 3 / 255 * 100 ];
    };
    var tt = X.exports;
    function et(t) {
        var e = function() {
            for (var t = {}, e = Object.keys(tt), n = e.length, i = 0; i < n; i++) t[e[i]] = {
                distance: -1,
                parent: null
            };
            return t;
        }(), n = [ t ];
        for (e[t].distance = 0; n.length; ) for (var i = n.pop(), r = Object.keys(tt[i]), o = r.length, a = 0; a < o; a++) {
            var s = r[a], l = e[s];
            -1 === l.distance && (l.distance = e[i].distance + 1, l.parent = i, n.unshift(s));
        }
        return e;
    }
    function nt(t, e) {
        return function(n) {
            return e(t(n));
        };
    }
    function it(t, e) {
        for (var n = [ e[t].parent, t ], i = tt[e[t].parent][t], r = e[t].parent; e[r].parent; ) n.unshift(e[r].parent), 
        i = nt(tt[e[r].parent][r], i), r = e[r].parent;
        return i.conversion = n, i;
    }
    var rt = X.exports, ot = function(t) {
        for (var e = et(t), n = {}, i = Object.keys(e), r = i.length, o = 0; o < r; o++) {
            var a = i[o];
            null !== e[a].parent && (n[a] = it(a, e));
        }
        return n;
    }, at = {};
    Object.keys(rt).forEach((function(t) {
        at[t] = {}, Object.defineProperty(at[t], "channels", {
            value: rt[t].channels
        }), Object.defineProperty(at[t], "labels", {
            value: rt[t].labels
        });
        var e = ot(t);
        Object.keys(e).forEach((function(n) {
            var i = e[n];
            at[t][n] = function(t) {
                var e = function(e) {
                    if (null == e) return e;
                    arguments.length > 1 && (e = Array.prototype.slice.call(arguments));
                    var n = t(e);
                    if ("object" == typeof n) for (var i = n.length, r = 0; r < i; r++) n[r] = Math.round(n[r]);
                    return n;
                };
                return "conversion" in t && (e.conversion = t.conversion), e;
            }(i), at[t][n].raw = function(t) {
                var e = function(e) {
                    return null == e ? e : (arguments.length > 1 && (e = Array.prototype.slice.call(arguments)), 
                    t(e));
                };
                return "conversion" in t && (e.conversion = t.conversion), e;
            }(i);
        }));
    }));
    var st = at, lt = E.exports, ft = st, ct = [].slice, ht = [ "keyword", "gray", "hex" ], ut = {};
    Object.keys(ft).forEach((function(t) {
        ut[ct.call(ft[t].labels).sort().join("")] = t;
    }));
    var dt = {};
    function mt(t, e) {
        if (!(this instanceof mt)) return new mt(t, e);
        if (e && e in ht && (e = null), e && !(e in ft)) throw new Error("Unknown model: " + e);
        var n, i;
        if (null == t) this.model = "rgb", this.color = [ 0, 0, 0 ], this.valpha = 1; else if (t instanceof mt) this.model = t.model, 
        this.color = t.color.slice(), this.valpha = t.valpha; else if ("string" == typeof t) {
            var r = lt.get(t);
            if (null === r) throw new Error("Unable to parse color from string: " + t);
            this.model = r.model, i = ft[this.model].channels, this.color = r.value.slice(0, i), 
            this.valpha = "number" == typeof r.value[i] ? r.value[i] : 1;
        } else if (t.length) {
            this.model = e || "rgb", i = ft[this.model].channels;
            var o = ct.call(t, 0, i);
            this.color = gt(o, i), this.valpha = "number" == typeof t[i] ? t[i] : 1;
        } else if ("number" == typeof t) t &= 16777215, this.model = "rgb", this.color = [ t >> 16 & 255, t >> 8 & 255, 255 & t ], 
        this.valpha = 1; else {
            this.valpha = 1;
            var a = Object.keys(t);
            "alpha" in t && (a.splice(a.indexOf("alpha"), 1), this.valpha = "number" == typeof t.alpha ? t.alpha : 0);
            var s = a.sort().join("");
            if (!(s in ut)) throw new Error("Unable to parse color from object: " + JSON.stringify(t));
            this.model = ut[s];
            var l = ft[this.model].labels, f = [];
            for (n = 0; n < l.length; n++) f.push(t[l[n]]);
            this.color = gt(f);
        }
        if (dt[this.model]) for (i = ft[this.model].channels, n = 0; n < i; n++) {
            var c = dt[this.model][n];
            c && (this.color[n] = c(this.color[n]));
        }
        this.valpha = Math.max(0, Math.min(1, this.valpha)), Object.freeze && Object.freeze(this);
    }
    function vt(t, e, n) {
        return (t = Array.isArray(t) ? t : [ t ]).forEach((function(t) {
            (dt[t] || (dt[t] = []))[e] = n;
        })), t = t[0], function(i) {
            var r;
            return arguments.length ? (n && (i = n(i)), (r = this[t]()).color[e] = i, r) : (r = this[t]().color[e], 
            n && (r = n(r)), r);
        };
    }
    function pt(t) {
        return function(e) {
            return Math.max(0, Math.min(t, e));
        };
    }
    function yt(t) {
        return Array.isArray(t) ? t : [ t ];
    }
    function gt(t, e) {
        for (var n = 0; n < e; n++) "number" != typeof t[n] && (t[n] = 0);
        return t;
    }
    mt.prototype = {
        toString: function() {
            return this.string();
        },
        toJSON: function() {
            return this[this.model]();
        },
        string: function(t) {
            var e = this.model in lt.to ? this : this.rgb(), n = 1 === (e = e.round("number" == typeof t ? t : 1)).valpha ? e.color : e.color.concat(this.valpha);
            return lt.to[e.model](n);
        },
        percentString: function(t) {
            var e = this.rgb().round("number" == typeof t ? t : 1), n = 1 === e.valpha ? e.color : e.color.concat(this.valpha);
            return lt.to.rgb.percent(n);
        },
        array: function() {
            return 1 === this.valpha ? this.color.slice() : this.color.concat(this.valpha);
        },
        object: function() {
            for (var t = {}, e = ft[this.model].channels, n = ft[this.model].labels, i = 0; i < e; i++) t[n[i]] = this.color[i];
            return 1 !== this.valpha && (t.alpha = this.valpha), t;
        },
        unitArray: function() {
            var t = this.rgb().color;
            return t[0] /= 255, t[1] /= 255, t[2] /= 255, 1 !== this.valpha && t.push(this.valpha), 
            t;
        },
        unitObject: function() {
            var t = this.rgb().object();
            return t.r /= 255, t.g /= 255, t.b /= 255, 1 !== this.valpha && (t.alpha = this.valpha), 
            t;
        },
        round: function(t) {
            return t = Math.max(t || 0, 0), new mt(this.color.map(function(t) {
                return function(e) {
                    return function(t, e) {
                        return Number(t.toFixed(e));
                    }(e, t);
                };
            }(t)).concat(this.valpha), this.model);
        },
        alpha: function(t) {
            return arguments.length ? new mt(this.color.concat(Math.max(0, Math.min(1, t))), this.model) : this.valpha;
        },
        red: vt("rgb", 0, pt(255)),
        green: vt("rgb", 1, pt(255)),
        blue: vt("rgb", 2, pt(255)),
        hue: vt([ "hsl", "hsv", "hsl", "hwb", "hcg" ], 0, (function(t) {
            return (t % 360 + 360) % 360;
        })),
        saturationl: vt("hsl", 1, pt(100)),
        lightness: vt("hsl", 2, pt(100)),
        saturationv: vt("hsv", 1, pt(100)),
        value: vt("hsv", 2, pt(100)),
        chroma: vt("hcg", 1, pt(100)),
        gray: vt("hcg", 2, pt(100)),
        white: vt("hwb", 1, pt(100)),
        wblack: vt("hwb", 2, pt(100)),
        cyan: vt("cmyk", 0, pt(100)),
        magenta: vt("cmyk", 1, pt(100)),
        yellow: vt("cmyk", 2, pt(100)),
        black: vt("cmyk", 3, pt(100)),
        x: vt("xyz", 0, pt(100)),
        y: vt("xyz", 1, pt(100)),
        z: vt("xyz", 2, pt(100)),
        l: vt("lab", 0, pt(100)),
        a: vt("lab", 1),
        b: vt("lab", 2),
        keyword: function(t) {
            return arguments.length ? new mt(t) : ft[this.model].keyword(this.color);
        },
        hex: function(t) {
            return arguments.length ? new mt(t) : lt.to.hex(this.rgb().round().color);
        },
        rgbNumber: function() {
            var t = this.rgb().color;
            return (255 & t[0]) << 16 | (255 & t[1]) << 8 | 255 & t[2];
        },
        luminosity: function() {
            for (var t = this.rgb().color, e = [], n = 0; n < t.length; n++) {
                var i = t[n] / 255;
                e[n] = i <= .03928 ? i / 12.92 : Math.pow((i + .055) / 1.055, 2.4);
            }
            return .2126 * e[0] + .7152 * e[1] + .0722 * e[2];
        },
        contrast: function(t) {
            var e = this.luminosity(), n = t.luminosity();
            return e > n ? (e + .05) / (n + .05) : (n + .05) / (e + .05);
        },
        level: function(t) {
            var e = this.contrast(t);
            return e >= 7.1 ? "AAA" : e >= 4.5 ? "AA" : "";
        },
        isDark: function() {
            var t = this.rgb().color;
            return (299 * t[0] + 587 * t[1] + 114 * t[2]) / 1e3 < 128;
        },
        isLight: function() {
            return !this.isDark();
        },
        negate: function() {
            for (var t = this.rgb(), e = 0; e < 3; e++) t.color[e] = 255 - t.color[e];
            return t;
        },
        lighten: function(t) {
            var e = this.hsl();
            return e.color[2] += e.color[2] * t, e;
        },
        darken: function(t) {
            var e = this.hsl();
            return e.color[2] -= e.color[2] * t, e;
        },
        saturate: function(t) {
            var e = this.hsl();
            return e.color[1] += e.color[1] * t, e;
        },
        desaturate: function(t) {
            var e = this.hsl();
            return e.color[1] -= e.color[1] * t, e;
        },
        whiten: function(t) {
            var e = this.hwb();
            return e.color[1] += e.color[1] * t, e;
        },
        blacken: function(t) {
            var e = this.hwb();
            return e.color[2] += e.color[2] * t, e;
        },
        grayscale: function() {
            var t = this.rgb().color, e = .3 * t[0] + .59 * t[1] + .11 * t[2];
            return mt.rgb(e, e, e);
        },
        fade: function(t) {
            return this.alpha(this.valpha - this.valpha * t);
        },
        opaquer: function(t) {
            return this.alpha(this.valpha + this.valpha * t);
        },
        rotate: function(t) {
            var e = this.hsl(), n = e.color[0];
            return n = (n = (n + t) % 360) < 0 ? 360 + n : n, e.color[0] = n, e;
        },
        mix: function(t, e) {
            if (!t || !t.rgb) throw new Error('Argument to "mix" was not a Color instance, but rather an instance of ' + typeof t);
            var n = t.rgb(), i = this.rgb(), r = void 0 === e ? .5 : e, o = 2 * r - 1, a = n.alpha() - i.alpha(), s = ((o * a == -1 ? o : (o + a) / (1 + o * a)) + 1) / 2, l = 1 - s;
            return mt.rgb(s * n.red() + l * i.red(), s * n.green() + l * i.green(), s * n.blue() + l * i.blue(), n.alpha() * r + i.alpha() * (1 - r));
        }
    }, Object.keys(ft).forEach((function(t) {
        if (-1 === ht.indexOf(t)) {
            var e = ft[t].channels;
            mt.prototype[t] = function() {
                if (this.model === t) return new mt(this);
                if (arguments.length) return new mt(arguments, t);
                var n = "number" == typeof arguments[e] ? e : this.valpha;
                return new mt(yt(ft[this.model][t].raw(this.color)).concat(n), t);
            }, mt[t] = function(n) {
                return "number" == typeof n && (n = gt(ct.call(arguments), e)), new mt(n, t);
            };
        }
    }));
    var bt = mt;
    const _t = {
        redraw: !1,
        retire: !1
    }, At = [];
    let xt = 1;
    function St(t, e) {
        return s.extend(t, {
            init: function() {
                this.i = {};
            },
            isVisible() {
                return this.painter && this.painter.isVisible();
            },
            supportRenderMode: function(t) {
                return this.painter.supportRenderMode(t);
            },
            startFrame: function(t) {
                const n = "__vt_plugin_mesh_throttle".trim(), i = t.layer, r = t.regl, o = t.sceneConfig, a = t.dataConfig, s = t.symbol;
                let l = this.painter;
                if (!l) {
                    const n = t.pluginIndex;
                    l = this.painter = new e(r, i, s, o, n, a);
                }
                this.i || (this.i = {});
                const f = o.excludes;
                this.o ? f !== this.o && (this.s = f ? new Function("f", "var p = (f && f.properties || {}); return " + w(f)) : null, 
                this.o = f) : f && (this.o = f), i.options.meshCreationLimitOnInteracting && i.getMap()[n] && (i.getMap()[n].length = 0), 
                l.startFrame(t), this.h = {};
            },
            updateCollision: function(t) {
                const e = this.painter;
                return e && e.isVisible() ? e.updateCollision(t) : null;
            },
            prepareRender: function(t) {
                const e = this.painter;
                return e && e.isVisible() ? e.prepareRender(t) : null;
            },
            endFrame: function(t) {
                const e = this.painter;
                return e && e.isVisible() ? e.render(t) : null;
            },
            getShadowMeshes() {
                const t = this.painter;
                return t && t.getShadowMeshes && t.getShadowMeshes() || At;
            },
            paintTile: function(t) {
                const {layer: e, tileCache: n, tileData: i, tileInfo: r, tileExtent: o, tileTransform: a, tileTranslationMatrix: s, tileZoom: l, sceneConfig: f, bloom: c} = t, h = this.painter;
                if (!h) return _t;
                let u = !1;
                const d = this.u(t);
                let m = n.geometry;
                if (!m) {
                    if (this.m(e, d)) return _t;
                    const r = i.features, o = i.data;
                    if (!o || !o.length) return _t;
                    const a = o;
                    if (this.painter.colorSymbol) for (let t = 0; t < o.length; t++) {
                        const e = this.v(r, o[t].data.aPickingId, o[t].indices, o[t].data.aPosition, o[t].positionSize);
                        o[t].data.aColor = e;
                    }
                    m = n.geometry = h.createGeometries(a, r);
                    for (let e = 0; e < m.length; e++) m[e] && m[e].geometry && (u = !0, m[e].geometry.properties.features = r, 
                    this.p(m[e].geometry, t));
                }
                if (!m) return _t;
                let v = this._(d);
                if (!v) {
                    if (this.m(e, d)) return _t;
                    const n = [ r.extent2d.xmin, r.extent2d.ymax ];
                    if (v = h.createMeshes(m, a, {
                        tileExtent: o,
                        tilePoint: n,
                        tileZoom: l,
                        tileTranslationMatrix: s
                    }), v.length) {
                        const n = e.getRenderer().isEnableTileStencil();
                        for (let e = 0; e < v.length; e++) v[e] && (u = !0, this.A(v[e], a, t.timestamp, xt++, n));
                        f.animation && (v.S = t.timestamp), this.i[d] = v;
                    }
                }
                if (!v.length) return _t;
                const p = h.getTileLevelValue(r, l);
                v.forEach(t => {
                    t.properties.tile = r, t.properties.level = p, t.setUniform("level", p);
                });
                let y = !1;
                if (!this.h[d]) {
                    let e = null, n = f.animation;
                    if (n) {
                        const i = t.sceneConfig.animationDuration || 800, r = (t.timestamp - v.S) / i, o = v[0].properties.createTime;
                        v.S - o < i && r < 1 && (!0 !== n && 1 !== n || (n = "linear"), e = "linear" === n ? r : A(n, r), 
                        y = !0);
                    }
                    v.forEach(t => {
                        const e = +(!!c && h.isBloom(t));
                        t.bloom = e;
                    }), h.addMesh(v, e, t), this.h[d] = 1;
                }
                return {
                    redraw: y,
                    retire: u
                };
            },
            A: function(t, e, n, i, r) {
                if (t.properties.tileTransform = e, t.properties.createTime = n, t.properties.meshKey = i, 
                r) {
                    const e = t.defines || {};
                    e.ENABLE_TILE_STENCIL = 1, t.setDefines(e), Object.defineProperty(t.uniforms, "stencilRef", {
                        enumerable: !0,
                        get: function() {
                            return t.properties.tile ? t.properties.tile.stencilRef : 255;
                        }
                    });
                }
            },
            p: function(t, e) {
                const {layer: n, tileInfo: i} = e, r = n.getMap(), o = (n.getSpatialReference ? n.getSpatialReference() : r.getSpatialReference()).getResolution(i.z), a = e.tileExtent / n.getTileSize().width;
                t.properties.tileResolution = o, t.properties.tileRatio = a, t.properties.z = i.z, 
                t.properties.tileExtent = e.tileExtent;
            },
            updateSceneConfig: function(t) {
                const e = this.painter;
                e && e.updateSceneConfig(t.sceneConfig);
            },
            updateDataConfig: function(t, e) {
                const n = this.painter;
                return !n || n.updateDataConfig(t, e);
            },
            updateSymbol: function(t, e) {
                const n = this.painter;
                if (!n) return !1;
                if (n.shouldDeleteMeshOnUpdateSymbol(t)) {
                    if (this.i) for (const t in this.i) n.deleteMesh(this.i[t], !0);
                    delete this.i, delete this.h;
                }
                return n.updateSymbol(t, e);
            },
            pick: function(t, e, n) {
                return this.painter && this.painter.pick ? this.painter.pick(t, e, n) : null;
            },
            deleteTile: function(t) {
                if (!this.i) return;
                const e = this.u(t), n = this.i[e];
                n && this.painter && this.painter.deleteMesh(n), delete this.i[e], this.h && delete this.h[e];
            },
            remove: function() {
                const t = this.painter;
                if (t && this.i) {
                    for (const e in this.i) t.deleteMesh(this.i[e]);
                    t.delete(), delete this.painter;
                }
                delete this.i, delete this.h;
            },
            resize: function(t, e) {
                const n = this.painter;
                n && n.resize(t, e);
            },
            needToRedraw: function() {
                return !!this.painter && this.painter.needToRedraw();
            },
            needToRetireFrames: function() {
                return !!this.painter && this.painter.needToRetireFrames();
            },
            v: function(t, e, n, i, r = 3) {
                if (!i || !t || !e.length) return null;
                const o = new Uint8Array(i.length / r * 4);
                let a, s;
                const l = this.painter.colorSymbol, f = {};
                let c;
                for (let n = 0, i = e.length; n < i; n++) {
                    const i = e[n];
                    if (a = t[i].symbol, s = f[i], !s) if (l) {
                        let e;
                        e = "function" == typeof l ? l(t[i].feature && t[i].feature.properties) : l, e = bt(e), 
                        s = f[i] = e.array();
                    } else s = f[i] = [ 255, 255, 255 ];
                    c = 4 * n, o[c] = s[0], o[c + 1] = s[1], o[c + 2] = s[2], o[c + 3] = 255 * (a[this.painter.opacitySymbol] || 1);
                }
                return o;
            },
            u: function(t) {
                const e = t.tileInfo;
                return e.meshKey || (e.meshKey = xt++), e.meshKey;
            },
            _: function(t) {
                return this.i[t];
            },
            M(t, e) {
                if (Array.isArray(t)) t.forEach((t, n) => {
                    const {features: i} = t.properties;
                    this.T(t, e[n], i);
                }); else {
                    const {features: n} = t.properties;
                    this.T(t, Array.isArray(e) ? e[0] : e, n);
                }
            },
            T(t, e, n) {
                const i = e.featureIndexes || e.data.featureIndexes;
                if (i) if (this.s) {
                    const r = e.indices;
                    let o = null, a = !1;
                    const s = [];
                    for (let t = 0; t < r.length; t++) {
                        const e = n[i[r[t]]];
                        null !== o && o === r[t] || (a = this.s(e.feature), o = r[t]), a || s.push(r[t]);
                    }
                    t.setElements(new e.indices.constructor(s));
                } else t.setElements(e.indices);
            },
            m(t, e) {
                const n = "__vt_plugin_mesh_throttle".trim(), i = t.options.tileMeshCreationLimitPerFrame || 0;
                if (!i) return !1;
                const r = t.getMap();
                if (!r.isInteracting()) return !1;
                let o = r[n];
                return o || (o = r[n] = []), !(o.indexOf(e) >= 0) && (o.push(e), o.length > i);
            },
            outline(t, e) {
                const n = this.painter;
                n && n.outline(t, e);
            },
            outlineAll(t) {
                const e = this.painter;
                e && e.outlineAll(t);
            },
            needPolygonOffset() {
                const t = this.painter;
                return t && t.needPolygonOffset();
            }
        });
    }
    class wt {
        constructor() {
            this.O = 1;
        }
        write(t, e) {
            const n = t.gl, i = this.O++;
            return t.stencilFunc(n.ALWAYS, i, 255), t.draw(e), i;
        }
        start(t) {
            const e = t.gl;
            e.clearStencil(255), e.clear(e.STENCIL_BUFFER_BIT), this.O = 1, t.start();
        }
        end(t) {
            t.end();
        }
    }
    function Mt(t, e) {
        for (let n = 0; n < t.stops.length; n++) if (e === t.stops[n][0]) return t.stops[n][1];
        return t.default;
    }
    function Tt(t, e) {
        for (var n = 0; n < t.stops.length && !(e < t.stops[n][0]); n++) ;
        return t.stops[Math.max(n - 1, 0)][1];
    }
    function Ot(t, e) {
        for (var n = void 0 !== t.base ? t.base : 1, i = 0; !(i >= t.stops.length || e <= t.stops[i][0]); ) i++;
        return 0 === i ? t.stops[i][1] : i === t.stops.length ? t.stops[i - 1][1] : function t(e, n, i, r, o, a) {
            return "function" == typeof o ? function() {
                var s = o.apply(void 0, arguments), l = a.apply(void 0, arguments);
                return t(e, n, i, r, s, l);
            } : o.length ? function(t, e, n, i, r, o) {
                var a = [];
                for (let s = 0; s < r.length; s++) a[s] = Ht(t, e, n, i, r[s], o[s]);
                return a;
            }(e, n, i, r, o, a) : Ht(e, n, i, r, o, a);
        }(e, n, t.stops[i - 1][0], t.stops[i][0], t.stops[i - 1][1], t.stops[i][1]);
    }
    function It(t, e) {
        return n = e, i = t.default, void 0 !== n ? n : void 0 !== i ? i : void 0 !== r ? r : null;
        var n, i, r;
    }
    function Ht(t, e, n, i, r, o) {
        var a, s = i - n, l = t - n;
        return r * (1 - (a = 1 === e ? l / s : (Math.pow(e, l) - 1) / (Math.pow(e, s) - 1))) + o * a;
    }
    function Pt(t) {
        return t && "object" == typeof t && (t.stops || t.property && "identity" === t.type);
    }
    function Ct(t) {
        return Dt(t, "exponential");
    }
    function Et(t) {
        return Dt(t, "interval");
    }
    function Rt(t, e) {
        if (!t) return null;
        var n = !1;
        if (Array.isArray(t)) {
            var i, r = [];
            for (let o = 0; o < t.length; o++) (i = Rt(t[o], e)) ? (r.push(i), n = !0) : r.push(t[o]);
            return n ? r : t;
        }
        var o, a = {
            __fn_types_loaded: !0
        }, s = [];
        for (o in t) t.hasOwnProperty(o) && s.push(o);
        const l = function(t) {
            Object.defineProperty(a, t, {
                get: function() {
                    return this["__fn_" + t] || (this["__fn_" + t] = Ct(this["_" + t])), this["__fn_" + t].apply(this, e());
                },
                set: function(e) {
                    this["_" + t] = e;
                },
                configurable: !0,
                enumerable: !0
            });
        };
        for (let e = 0, i = s.length; e < i; e++) Pt(t[o = s[e]]) ? (n = !0, a["_" + o] = t[o], 
        l(o)) : a[o] = t[o];
        return n ? a : t;
    }
    function Dt(t, e) {
        if (!Pt(t)) return function() {
            return t;
        };
        let n = !0, i = !0;
        const r = (t = JSON.parse(JSON.stringify(t))).stops;
        if (r) for (let t = 0; t < r.length; t++) if (Pt(r[t][1])) {
            const o = Dt(r[t][1], e);
            n = n && o.isZoomConstant, i = i && o.isFeatureConstant, r[t] = [ r[t][0], o ];
        }
        const o = function t(e, n) {
            var i, r, o;
            if (Pt(e)) {
                var a, s = e.stops && "object" == typeof e.stops[0][0], l = s || void 0 !== e.property, f = s || !l, c = e.type || n || "exponential";
                if ("exponential" === c) a = Ot; else if ("interval" === c) a = Tt; else if ("categorical" === c) a = Mt; else {
                    if ("identity" !== c) throw new Error('Unknown function type "' + c + '"');
                    a = It;
                }
                if (s) {
                    var h = {}, u = [];
                    for (let t = 0; t < e.stops.length; t++) {
                        var d = e.stops[t];
                        void 0 === h[d[0].zoom] && (h[d[0].zoom] = {
                            zoom: d[0].zoom,
                            type: e.type,
                            property: e.property,
                            default: e.default,
                            stops: []
                        }), h[d[0].zoom].stops.push([ d[0].value, d[1] ]);
                    }
                    for (let e in h) u.push([ h[e].zoom, t(h[e]) ]);
                    i = function(t, n) {
                        const i = Ot({
                            stops: u,
                            base: e.base
                        }, t)(t, n);
                        return "function" == typeof i ? i(t, n) : i;
                    }, r = !1, o = !1;
                } else f ? (i = function(t) {
                    const n = a(e, t);
                    return "function" == typeof n ? n(t) : n;
                }, r = !0, o = !1) : (i = function(t, n) {
                    const i = a(e, n ? n[e.property] : null);
                    return "function" == typeof i ? i(t, n) : i;
                }, r = !1, o = !0);
            } else i = function() {
                return e;
            }, r = !0, o = !0;
            return i.isZoomConstant = o, i.isFeatureConstant = r, i;
        }(t, e);
        return o.isZoomConstant = n && o.isZoomConstant, o.isFeatureConstant = i && o.isFeatureConstant, 
        o;
    }
    function Nt(t) {
        for (let e = 1; e < arguments.length; e++) {
            const n = arguments[e];
            for (const e in n) t[e] = n[e];
        }
        return t;
    }
    function kt(t, e, n) {
        return Math.min(n, Math.max(e, t));
    }
    function Lt(t, e, n) {
        if (t === n || t === e) return t;
        const i = n - e;
        return ((t - e) % i + i) % i + e;
    }
    function zt(t) {
        return null == t;
    }
    function Ft(t) {
        return JSON.parse(JSON.stringify(t));
    }
    function Vt(t, e, n, i, r, o) {
        Object.defineProperty(t, e, {
            enumerable: !0,
            get: function() {
                const t = zt(n[i]) || Pt(n[i]) ? r : n[i];
                return o ? o(t) : t;
            }
        });
    }
    const jt = [];
    function Gt(t) {
        for (let e = 0; e < t.length; e++) jt[e] = t[e], jt[e] *= 255;
        return 3 === t.length && (jt[3] = 255), jt;
    }
    function Ut(t, e = 4) {
        return Wt.bind(this, t, e);
    }
    function Wt(t, e, n) {
        if (Array.isArray(n)) return 3 === n.length && 4 === e && n.push(1), n;
        if (t && t[n]) return t[n];
        const i = bt(n).unitArray();
        return 3 === i.length && 4 === e && i.push(1), t && (t[n] = i), i;
    }
    function Bt(t, e, n, i) {
        if (t.fill) t.fill(e, n, i); else for (let r = n; r < i; r++) t[r] = e;
    }
    function Xt(t) {
        return "number" == typeof t && !isNaN(t);
    }
    function Yt(t) {
        return t && (t.markerFile || t.markerType) && void 0 !== t.textName;
    }
    function Kt(t, e) {
        return Object.prototype.hasOwnProperty.call(t, e);
    }
    function qt(t) {
        const e = [ t[0] ];
        let n = t[0];
        for (let i = 1; i < t.length; i++) t[i] !== n && (e.push(t[i]), n = t[i]);
        return e;
    }
    const Jt = "_fn_type_", Zt = {
        textFill: 1,
        textSize: 1,
        textOpacity: 1,
        markerWidth: 1,
        markerHeight: 1,
        markerOpacity: 1,
        lineWidth: 1,
        lineColor: 1,
        lineOpacity: 1,
        polygonFill: 1,
        polygonOpacity: 1
    };
    function $t(t, e, n) {
        for (let i = 0; i < n.length; i++) {
            const {symbolName: r} = n[i];
            (t.I = t.I || {})[r] = e[r], Qt(t, e, n[i]);
        }
    }
    function Qt(t, e, n) {
        const i = t.properties;
        let r = i.aPickingId;
        r || (r = i.aPickingId = new t.data.aPickingId.constructor(t.data.aPickingId));
        const {attrName: o, symbolName: a, evaluate: s} = n;
        let l = t.data[o];
        if (!l) {
            if (le(e[a])) {
                l = t.data[o] = new n.type(n.width * r.length), te(t, e, n);
                return ae(o, t, t.properties[Jt + o + "Index"], s), l;
            }
            return null;
        }
        return le(e[a]) ? (te(t, e, n), l) : (l && l.buffer && l.buffer.destroy && l.buffer.destroy(), 
        delete t.data[o], ee(t, o), null);
    }
    function te(t, e, n) {
        const {attrName: i, symbolName: r} = n, o = function(t) {
            if (!t) return oe;
            const e = [];
            for (let n = 0; n < t.length; n++) Pt(t[n][1]) && !Ct(t[n][1]).isZoomConstant && e.push(t[n][0]);
            return e;
        }(e[r].stops), a = "identity" === e[r].type && function(t, e, n) {
            let {features: i} = n.properties;
            Array.isArray(i) || (i = Object.values(i));
            if (!i || !i.length) return !1;
            const {symbolName: r} = t;
            if (!Zt[r]) return !1;
            const o = e.property;
            for (let t = 0; t < i.length; t++) {
                const e = i[t] && i[t].feature;
                if (!e) continue;
                const n = e.properties && e.properties[o];
                if (n && (Pt(n) && !Ct(n).isZoomConstant)) return !0;
            }
            return !1;
        }(n, e[r], t);
        if (!a && !o.length) return void ee(t, i);
        const s = t.properties, {features: l, aPickingId: f} = s, c = function(t, e, n, i, r) {
            const o = [];
            let a = 0, s = e[0];
            for (let l = 1, f = e.length; l < f; l++) e[l] === s && l !== f - 1 || ((r || re(t[s].feature, n, i)) && o.push(a, l === f - 1 ? f : l), 
            s = e[l], a = l);
            return o;
        }(l, f, e[r].property, o, a);
        if (!c.length) return void ee(t, i);
        const h = t.data[i];
        s[Jt + i + "Index"] = c, s[Jt + i] = h.BYTES_PER_ELEMENT ? new h.constructor(h) : new n.type(h.length);
    }
    function ee(t, e) {
        const n = t.properties;
        delete n[Jt + e + "Index"], delete n[Jt + e];
    }
    function ne(t, e, n, i, r) {
        if (!i) return;
        const o = i.geometry;
        if (o) {
            for (let a = 0; a < n.length; a++) {
                const s = n[a], {attrName: l, evaluate: f, define: c} = s, h = o.properties[Jt + l + "Index"];
                if (!ie(o, e, s)) {
                    const {aPickingId: t} = o.properties;
                    if (!t || !h) continue;
                    if (o.H === r) continue;
                    ae(l, o, h, f);
                    continue;
                }
                if (o.data[l]) {
                    const t = o.data[l];
                    t && t.buffer && t.buffer.destroy && t.buffer.destroy(), delete o.data[l];
                }
                if (Qt(o, e, s)) {
                    if (ae(l, o, h, f), c) {
                        const t = i.defines;
                        t[c] = 1, i.setDefines(t);
                    }
                    o.generateBuffers(t);
                } else if (c) {
                    const t = i.defines;
                    t[c] && (delete t[c], i.setDefines(t));
                }
            }
            o.H = r;
        }
    }
    function ie(t, e, n) {
        const i = e[n.symbolName], r = t.I;
        return i !== r[n.symbolName] && (r[n.symbolName] = i, !0);
    }
    function re(t, e, n) {
        for (let i = 0; i < n.length; i++) if ("$" === e[0] && t[e.substring(1)] === n[i] || t.properties[e] === n[i]) return !0;
        return !1;
    }
    const oe = [];
    function ae(t, e, n, i) {
        const {aPickingId: r, features: o} = e.properties;
        let a;
        if (n) {
            a = e.properties[Jt + t];
            const s = a.length / r.length, l = n.length;
            for (let t = 0; t < l; t += 2) {
                const l = n[t], f = n[t + 1];
                let c = o[r[l]];
                c && c.feature && se(a, c, i, l, f, s, e);
            }
        } else {
            a = e.data[t], a.dirty = !0;
            const n = a.length / r.length, s = r.length;
            let l = 0;
            for (let t = 0; t < s; t++) {
                if (r[t] === r[l] && t < s - 1) continue;
                let f = o[r[l]];
                f && f.feature && (se(a, f, i, l, t === s - 1 ? s : t, n, e), l = t);
            }
        }
        a.dirty && (e.updateData(t, a), a.dirty = !1);
    }
    function se(t, e, n, i, r, o, a) {
        const s = (e = e.feature).properties || {};
        void 0 === s.$layer && (e.properties || (e.properties = s), s.$layer = e.layer, 
        s.$type = e.type);
        const l = n(s, t[i * o], a);
        if (Array.isArray(l)) {
            let e = !1;
            for (let n = 0; n < o; n++) if (t[i * o + n] !== l[n]) {
                e = !0;
                break;
            }
            if (e) {
                for (let e = i * o; e < r * o; e += o) t.set(l, e);
                t.dirty = !0;
            }
        } else t[i] !== l && (Bt(t, l, i, r), t.dirty = !0);
    }
    function le(t) {
        return t && Pt(t) && t.property;
    }
    var fe = Array.isArray, ce = Object.keys, he = Object.prototype.hasOwnProperty, ue = function t(e, n) {
        if (e === n) return !0;
        if (e && n && "object" == typeof e && "object" == typeof n) {
            var i, r, o, a = fe(e), s = fe(n);
            if (a && s) {
                if ((r = e.length) != n.length) return !1;
                for (i = r; 0 != i--; ) if (!t(e[i], n[i])) return !1;
                return !0;
            }
            if (a != s) return !1;
            var l = e instanceof Date, f = n instanceof Date;
            if (l != f) return !1;
            if (l && f) return e.getTime() == n.getTime();
            var c = e instanceof RegExp, h = n instanceof RegExp;
            if (c != h) return !1;
            if (c && h) return e.toString() == n.toString();
            var u = ce(e);
            if ((r = u.length) !== ce(n).length) return !1;
            for (i = r; 0 != i--; ) if (!he.call(n, u[i])) return !1;
            for (i = r; 0 != i--; ) if (!t(e[o = u[i]], n[o])) return !1;
            return !0;
        }
        return e != e && n != n;
    };
    const {loginIBLResOnCanvas: de, logoutIBLResOnCanvas: me, getIBLResOnCanvas: ve} = n.reshader.pbr.PBRUtils, pe = [], ye = [], ge = t => 0 === t.getUniform("level"), be = t => t.getUniform("level") > 0;
    class _e {
        constructor(t, e, i, r, o, a) {
            this.regl = t, this.layer = e, this.canvas = e.getRenderer().canvas, this.sceneConfig = r || {}, 
            this.dataConfig = a || {}, this.pluginIndex = o, this.scene = new n.reshader.Scene, 
            this.pickingFBO = e.getRenderer().pickingFBO, this.P = new wt, this.level0Filter = ge, 
            this.levelNFilter = be, this.loginTextureCache(), this.symbolDef = Array.isArray(i) ? i.map(t => Ft(t)) : [ Ft(i) ], 
            this.C(), this.pickingViewport = {
                x: 0,
                y: 0,
                width: () => this.canvas ? this.canvas.width : 1,
                height: () => this.canvas ? this.canvas.height : 1
            }, this.sortByCommandKey = Ae.bind(this), this.colorCache = {};
        }
        getMap() {
            return this.layer ? this.layer.getMap() : null;
        }
        getTileLevelValue(t, e) {
            const n = this.layer.getRenderer();
            return n.getTileLevelValue && n.getTileLevelValue(t, e) || 0;
        }
        isVisible() {
            const t = this.R;
            if (t.length) for (let e = 0; e < t.length; e++) if (t[e] && !t[e].isFeatureConstant) return !0;
            const e = this.getSymbols();
            for (let t = 0; t < e.length; t++) {
                const n = e[t].visible;
                if (!1 !== n && 0 !== n) return !0;
            }
            return !1;
        }
        isMeshVisible(t) {
            const e = t && t.properties && t.properties.symbolIndex;
            if (!e) return !1;
            const n = this.R, i = e.index;
            let r;
            if (n[i]) {
                if (!n[i].isFeatureConstant) return !0;
                r = n[i](this.getMap().getZoom());
            } else r = this.getSymbol(e).visible;
            return !1 !== r && 0 !== r;
        }
        needToRedraw() {
            return this.D;
        }
        needToRetireFrames() {
            return this.N;
        }
        fillIncludes(t, e, n) {
            const i = n && n.includes;
            if (i) for (const r in i) i[r] && (n[r].uniformDeclares && e.push(...n[r].uniformDeclares), 
            n[r].defines && Nt(t, n[r].defines));
        }
        setIncludeUniformValues(t, e) {
            const n = e && e.includes;
            if (n) for (const i in n) n[i] && e[i].renderUniforms && Nt(t, e[i].renderUniforms);
        }
        createGeometries(t, e) {
            if (!t.length) return ye;
            const n = [];
            for (let i = 0; i < t.length; i++) if (t[i]) if (void 0 !== t[i].ref) n[t[i].ref] ? n.push({
                geometry: n[t[i].ref].geometry,
                symbolIndex: t[i].symbolIndex,
                ref: t[i].ref
            }) : n.push(null); else {
                const r = this.createGeometry(t[i], e, i);
                if (r && r.geometry) {
                    const {pickingIdMap: n, idPickingMap: o, hasFeaIds: a} = this.k(t[i]), s = r.geometry.properties;
                    s.symbolIndex = r.symbolIndex, s.features = e, a && (s.feaIdPickingMap = n, s.feaPickingIdMap = o);
                }
                this.postCreateGeometry(r, n), n.push(r);
            }
            return n;
        }
        postCreateGeometry() {}
        k(t) {
            if (!t) return {};
            if (Array.isArray(t) && !(t = t[0])) return {};
            const e = t.featureIds, n = {}, i = {}, r = e && e.length;
            if (r) for (let r = 0; r < e.length; r++) n[t.data.aPickingId[r]] = e[r], i[e[r]] || (i[e[r]] = []), 
            i[e[r]].push(t.data.aPickingId[r]);
            return {
                hasFeaIds: r,
                idPickingMap: n,
                pickingIdMap: i
            };
        }
        createGeometry() {
            throw new Error("not implemented");
        }
        createMeshes(t, e, n) {
            const i = {}, r = [];
            for (let o = 0; o < t.length; o++) {
                if (!t[o]) continue;
                const a = this.createMesh(t[o], e, n, i);
                Array.isArray(a) ? r.push(...a) : r.push(a);
            }
            return r;
        }
        createMesh() {
            throw new Error("not implemented");
        }
        isBloom(t) {
            return !!this.getSymbol(t.properties.symbolIndex).bloom;
        }
        addMesh(t, e, n) {
            t = t.filter(t => this.isMeshVisible(t));
            const i = !!n.bloom;
            t.forEach(t => {
                const e = this.isBloom(t) && i, n = t.defines || {};
                !!n.HAS_BLOOM !== e && (e ? n.HAS_BLOOM = 1 : delete n.HAS_BLOOM, t.setDefines(n));
            }), this.scene.addMesh(t);
        }
        updateCollision() {}
        render(t) {
            return this.pluginIndex = t.pluginIndex, this.polygonOffsetIndex = t.polygonOffsetIndex, 
            this.paint(t);
        }
        prepareRender(t) {
            if (this.L === t.timestamp) return;
            if (this.L = t.timestamp, !this.createFnTypeConfig) return;
            const e = this.scene.getMeshes();
            if (!e || !e.length) return;
            const n = this.getMap().getZoom();
            for (let t = 0; t < e.length; t++) {
                if (!e[t] || !e[t].geometry) continue;
                const {symbolIndex: i} = e[t].properties, r = this.getSymbolDef(i);
                if (!r) continue;
                const o = this.getFnTypeConfig(i);
                ne(this.regl, r, o, e[t], n);
            }
        }
        paint(t) {
            const e = this.layer.getMap();
            if (!e) return {
                redraw: !1
            };
            this.F = t;
            const n = this.getUniformValues(e, t);
            return this.callShader(n, t), {
                redraw: this.D
            };
        }
        setToRedraw(t) {
            t && (this.N = t), this.D = !0;
        }
        callShader(t, e) {
            this.callCurrentTileShader(t, e), this.callBackgroundTileShader(t, e);
        }
        callCurrentTileShader(t, e) {
            this.shader && (this.shader.filter = e.sceneFilter ? [ this.level0Filter, e.sceneFilter ] : this.level0Filter), 
            this.callRenderer(t, e);
        }
        callBackgroundTileShader(t, e) {
            this.shader && (this.shader.filter = e.sceneFilter ? [ this.levelNFilter, e.sceneFilter ] : this.levelNFilter), 
            this.scene.getMeshes().sort(xe), this.callRenderer(t, e);
        }
        callRenderer(t, e) {
            this.renderer.render(this.shader, t, this.scene, this.getRenderFBO(e));
        }
        getRenderFBO(t) {
            return t && t.renderTarget && t.renderTarget.fbo;
        }
        needPolygonOffset() {
            return !1;
        }
        getPolygonOffset() {
            const t = this.layer;
            return {
                factor: (e, n) => {
                    if (n.meshConfig.ssr) return 1;
                    return -(t.getPolygonOffset() + (this.polygonOffsetIndex || 0));
                },
                units: (e, n) => n.meshConfig.ssr ? 1 : -(t.getPolygonOffset() + (this.polygonOffsetIndex || 0))
            };
        }
        getBlendFunc() {
            return {
                src: () => this.sceneConfig.blendSrc || "src alpha",
                dst: () => this.sceneConfig.blendDst || "one minus src alpha"
            };
        }
        pick(t, e, n = 3) {
            if (!this.layer.options.picking || !1 === this.sceneConfig.picking) return null;
            if (!this.pickingFBO || !this.picking) return null;
            const i = this.getMap(), r = this.getUniformValues(i);
            for (let o = 0; o < this.picking.length; o++) {
                const a = this.picking[o];
                a.render(this.scene.getMeshes(), r, !0);
                let s = {};
                a.getRenderedMeshes().length && (s = a.pick(t, e, n, r, {
                    viewMatrix: i.viewMatrix,
                    projMatrix: i.projMatrix,
                    returnPoint: this.layer.options.pickingPoint && !1 !== this.sceneConfig.pickingPoint
                }));
                const {meshId: l, pickingId: f, point: c} = s, h = (0 === l || l) && a.getMeshAt(l);
                if (!h || !h.geometry) continue;
                let u = h.geometry.properties;
                u.features || (u = h.properties), c && c.length && (c[0] = Math.round(1e5 * c[0]) / 1e5, 
                c[1] = Math.round(1e5 * c[1]) / 1e5, c[2] = Math.round(1e5 * c[2]) / 1e5);
                const d = {
                    data: u && u.features && u.features[f],
                    point: c,
                    plugin: this.pluginIndex
                }, m = h.geometry.properties.feaPickingIdMap;
                return m && (d.featureId = m[f]), d;
            }
            return null;
        }
        updateSceneConfig() {}
        updateDataConfig() {
            return !0;
        }
        deleteMesh(t, e) {
            if (t) if (this.scene.removeMesh(t), Array.isArray(t)) for (let n = 0; n < t.length; n++) {
                if (!t[n].isValid()) continue;
                const i = t[n].geometry;
                !e && i && i.dispose(), t[n].material && t[n].material.dispose(), t[n].dispose();
            } else {
                if (!t.isValid()) return;
                !e && t.geometry && t.geometry.dispose(), t.material && t.material.dispose(), t.dispose();
            }
        }
        startFrame(t) {
            this.V || (this.init(t), this.V = !0), this.L !== t.timestamp && (this.D = !1, this.N = !1), 
            this.scene.clear();
        }
        resize() {}
        delete() {
            if (this.scene.clear(), this.shader && this.shader.dispose(), this.picking) {
                for (let t = 0; t < this.picking.length; t++) this.picking[t].dispose();
                delete this.picking;
            }
            if (this.j) {
                for (let t = 0; t < this.j.length; t++) this.j[t].dispose();
                delete this.j;
            }
            this.logoutTextureCache();
        }
        updateSymbol(t, e) {
            const n = this.supportRenderMode("taa");
            Array.isArray(t) || (t = [ t ], e = [ e ]);
            let i = !1;
            for (let n = 0; n < t.length; n++) if (t[n]) {
                const r = this.G(n, t[n], e[n]);
                r && (i = r);
            }
            return delete this.U, this.setToRedraw(n), i;
        }
        W(t, n) {
            for (const i in n) if (Kt(n, i) && e.SYMBOLS_NEED_REBUILD_IN_VT[i] && !ue(n[i], t[i])) return !0;
            return !1;
        }
        G(t, e, n) {
            if (!this.B) return !1;
            const i = this.W(this.symbolDef[t] || {}, n);
            this.symbolDef[t] = Ft(n);
            const r = this.B[t];
            for (const t in r) delete r[t];
            const o = this.getMap(), a = Rt(this.symbolDef[t], () => [ o.getZoom() ]);
            for (const t in a) {
                const e = Object.getOwnPropertyDescriptor(a, t);
                e.get ? Object.defineProperty(r, t, {
                    get: e.get,
                    set: e.set,
                    configurable: !0,
                    enumerable: !0
                }) : r[t] = a[t];
            }
            return Pt(n.visible) && (this.R[t] = Ct(n.visible)), i;
        }
        getSymbolDef(t) {
            return this.symbolDef[t.index];
        }
        getSymbols() {
            return this.B;
        }
        getSymbol(t) {
            const e = t.index;
            return this.B[e];
        }
        C() {
            const t = this.getMap(), e = () => [ t.getZoom() ];
            this.B = [], this.R = [];
            for (let t = 0; t < this.symbolDef.length; t++) this.B[t] = Rt(Nt({}, this.symbolDef[t]), e), 
            this.symbolDef[t] && Pt(this.symbolDef[t].visible) && (this.R[t] = Ct(this.symbolDef[t].visible));
        }
        getFnTypeConfig(t) {
            this.U || (this.U = []);
            const e = t.index;
            if (!this.U[e]) {
                const n = this.getSymbolDef(t), i = this.getMap();
                this.U[e] = this.createFnTypeConfig(i, n);
            }
            return this.U[e];
        }
        X() {
            delete this.U;
        }
        loginTextureCache() {
            const t = "__gl_textures".trim(), e = this.getMap();
            e[t] || (e[t] = {
                count: 0
            }), e[t].count++;
        }
        logoutTextureCache() {
            const t = "__gl_textures".trim(), e = this.getMap(), n = this.Y;
            if (n) for (const i in n) Kt(n, i) && e[t][i] && (e[t][i].count--, e[t][i].count <= 0 && delete e[t][i]);
            e[t].count--, e[t].count <= 0 && (e[t] = {});
        }
        getCachedTexture(t) {
            const e = "__gl_textures".trim(), n = this.getMap()[e][t];
            return n ? n.data : null;
        }
        addCachedTexture(t, e) {
            const n = "__gl_textures".trim(), i = this.getMap();
            let r = i[n][t];
            r ? r.data = e : r = i[n][t] = {
                data: e,
                count: 0
            }, this.Y || (this.Y = {}), r.data.then || this.Y[t] || (r.count++, this.Y[t] = 1);
        }
        disposeCachedTexture(t) {
            let e;
            if (e = "string" == typeof t ? t : t.url, !this.Y || !this.Y[e]) return;
            const n = "__gl_textures".trim();
            delete this.Y[e];
            const i = this.getMap();
            i[n][e] && (i[n][e].count--, i[n][e].count <= 0 && delete i[n][e]);
        }
        shouldDeleteMeshOnUpdateSymbol() {
            return !1;
        }
        needClearStencil() {
            return !1;
        }
        supportRenderMode(t) {
            return "taa" === t || "fxaa" === t;
        }
        K(t) {
            const e = this.scene.getMeshes();
            if (!e.length) return;
            const i = e.map(t => ({
                transform: t.localTransform,
                level: t.getUniform("level"),
                mesh: t
            })).sort(this.q), r = this.getMap().projViewMatrix;
            this.P.start(t);
            const o = {};
            for (let e = 0; e < i.length; e++) {
                const a = i[e].mesh;
                let s = o[a.properties.tile.id];
                void 0 === s && (n.mat4.multiply(pe, r, i[e].transform), s = this.P.write(t, pe), 
                o[a.properties.tile.id] = s), a.setUniform("ref", s);
            }
            this.P.end(t), this.regl.J();
        }
        q(t, e) {
            return e.level - t.level;
        }
        outline(t, e) {
            const n = {};
            for (let i = 0; i < e.length; i++) zt(e[i]) || n[e[i]] || (this.Z(t, e[i]), n[e[i]] = 1);
        }
        Z(t, e) {
            if (!this.picking) return;
            if (this.$ || (this.$ = new n.reshader.Scene), !this.j && (this.tt(), !this.j)) return void console.warn(`Plugin at ${this.pluginIndex} doesn't support outline.`);
            const i = this.getUniformValues(this.getMap(), this.F), r = this.et(e);
            if (r.length) for (let n = 0; n < r.length; n++) {
                const o = r[n].geometry.properties.feaIdPickingMap;
                if (o) {
                    const a = o[e];
                    if (a) {
                        const e = {};
                        this.$.setMeshes(r[n]);
                        for (let n = 0; n < a.length; n++) {
                            const r = a[n];
                            if (!e[r]) {
                                e[r] = 1, i.highlightPickingId = r;
                                for (let e = 0; e < this.j.length; e++) this.renderer.render(this.j[e], i, this.$, t);
                            }
                        }
                    }
                }
            }
        }
        et(t) {
            const e = [], n = this.scene.getMeshes();
            for (let i = 0; i < n.length; i++) {
                const r = n[i], o = r.geometry.properties.feaIdPickingMap;
                o && void 0 !== o[t] && e.push(r);
            }
            return e;
        }
        outlineAll(t) {
            if (!this.picking) return;
            if (!this.j && (this.tt(), !this.j)) return void console.warn(`Plugin at ${this.pluginIndex} doesn't support outline.`);
            const e = this.getUniformValues(this.getMap(), this.F);
            e.highlightPickingId = -1;
            for (let n = 0; n < this.j.length; n++) this.renderer.render(this.j[n], e, this.scene, t);
        }
        tt() {
            if (!this.picking) return;
            const t = this.layer.getRenderer().canvas;
            this.j = [];
            for (let e = 0; e < this.picking.length; e++) {
                const i = this.picking[e].getPickingVert(), r = {
                    ENABLE_PICKING: 1,
                    HAS_PICKING_ID: 1
                }, o = this.picking[e].getUniformDeclares().slice(0);
                void 0 !== o.uPickingId && (r.HAS_PICKING_ID = 2), this.j[e] = new n.reshader.MeshShader({
                    vert: i,
                    frag: "precision highp float;\nuniform float highlightPickingId;\nvarying float vPickingId;\nvoid main() {\n  if(highlightPickingId < .0 || floor(highlightPickingId + .5) == floor(vPickingId + .5)) {\n    gl_FragColor = vec4(1.);\n  } else {\n    discard;\n  }\n}",
                    uniforms: o,
                    defines: r,
                    extraCommandProps: {
                        viewport: {
                            x: 0,
                            y: 0,
                            width: () => t.width,
                            height: () => t.height
                        },
                        depth: {
                            enable: !0,
                            mask: !1,
                            func: "always"
                        },
                        blend: {
                            enable: !0,
                            func: {
                                src: "src alpha",
                                dst: "one minus src alpha"
                            },
                            equation: "add"
                        }
                    }
                }), this.j[e].filter = this.picking[e].filter;
            }
        }
        hasIBL() {
            const t = this.getMap().getLightManager();
            return !!(t && t.getAmbientResource());
        }
        updateIBLDefines(t) {
            const e = t.shaderDefines;
            let n = !1;
            this.hasIBL() ? e[[ "HAS_IBL_LIGHTING" ]] || (e.HAS_IBL_LIGHTING = 1, n = !0) : e[[ "HAS_IBL_LIGHTING" ]] && (delete e.HAS_IBL_LIGHTING, 
            n = !0), n && (t.shaderDefines = e);
        }
        getIBLRes() {
            const t = this.layer.getRenderer().canvas;
            return ve(t);
        }
        createIBLTextures() {
            const t = this.layer.getRenderer().canvas;
            de(t, this.regl, this.getMap()), this.setToRedraw(!0), this.layer.fire("iblupdated");
        }
        disposeIBLTextures() {
            const t = this.layer.getRenderer().canvas;
            me(t, this.getMap());
        }
        evaluateInFnTypeConfig(t, e, n, i, r) {
            let o = this.nt;
            o || (o = this.nt = {});
            const a = function(t) {
                let e = 0;
                const n = t && t.length || 0;
                if (!n) return e;
                let i;
                for (let r = 0; r < n; r++) i = t.charCodeAt(r), e = (e << 5) - e + i, e &= e;
                return e;
            }(JSON.stringify(t));
            let s = o[a];
            return s || (s = o[a] = r ? Et(t) : Ct(t)), s(n.getZoom(), i);
        }
    }
    function Ae(t, e) {
        const n = t && t.getCommandKey(this.regl) || "", i = e && e.getCommandKey(this.regl) || "";
        return n.localeCompare(i);
    }
    function xe(t, e) {
        return t.properties.level - e.properties.level;
    }
    class Se extends _e {
        constructor(t, e, n, i, r, o) {
            super(t, e, n, i, r, o);
        }
        createGeometry(t, e) {
            if (!t.data) return {
                geometry: null,
                symbolIndex: t.symbolIndex
            };
            t.iconAtlas && t.iconAtlas.image && (t.iconAtlas.image.dataType = t.type, t.iconAtlas.image.type = "icon"), 
            t.glyphAtlas && t.glyphAtlas.image && (t.glyphAtlas.image.type = "glyph");
            const i = Nt({}, t.data), r = new n.reshader.Geometry(i, t.indices, 0, {
                primitive: this.getPrimitive(),
                positionSize: t.positionSize
            });
            return r.properties = {
                features: e,
                elements: t.indices
            }, t.iconAtlas && (r.properties.iconAtlas = t.iconAtlas.image), t.glyphAtlas && (r.properties.glyphAtlas = t.glyphAtlas.image), 
            r.properties.aFeaIds = t.featureIds, r.properties.collideIds = t.featureIds && t.featureIds.length ? t.featureIds : t.data.aPickingId, 
            r.properties.uniqueCollideIds = qt(r.properties.collideIds), Nt(r.properties, t.properties), 
            {
                geometry: r,
                symbolIndex: t.symbolIndex
            };
        }
        getPrimitive() {
            return "triangles";
        }
        getRenderFBO(t) {
            return t && t.renderTarget && t.renderTarget.fbo;
        }
        supportRenderMode(t) {
            return "noAa" === t;
        }
        createAtlasTexture(t, e) {
            const n = this.regl, i = t, r = {
                width: i.width,
                height: i.height,
                data: i.data,
                format: i.format,
                mag: "linear",
                min: "linear",
                flipY: e
            };
            if ("icon" === t.type) {
                const e = "point" !== t.dataType ? "repeat" : "clamp";
                r.wrapS = e, r.wrapT = e;
            }
            return n.texture(r);
        }
        drawDebugAtlas(t) {
            if (document.getElementById("MAPTALKS_ICON_DEBUG")) {
                const e = document.getElementById("MAPTALKS_ICON_DEBUG");
                let n;
                if (e.width = t.width, e.height = t.height, e.style.width = t.width + "px", e.style.height = t.height + "px", 
                "alpha" === t.format) {
                    n = new Uint8ClampedArray(4 * t.data.length);
                    for (let e = 0; e < t.data.length; e++) n[4 * e + 3] = t.data[e];
                } else n = new Uint8ClampedArray(t.data);
                e.getContext("2d").putImageData(new ImageData(n, t.width, t.height), 0, 0);
            }
        }
    }
    var we = "attribute vec3 aPosition;\nuniform mat4 projViewModelMatrix;\n#include <fbo_picking_vert>\nvoid main() {\n  gl_Position = projViewModelMatrix * vec4(aPosition, 1.);\n  fbo_picking_setData(gl_Position.w, true);\n}";
    function Me(t, e, n) {
        const i = e, r = {
            width: i.width,
            height: i.height,
            data: i.data,
            format: i.format,
            mag: "linear",
            min: "linear",
            flipY: n
        };
        if ("icon" === e.type) {
            const t = "point" !== e.dataType ? "repeat" : "clamp";
            r.wrapS = t, r.wrapT = t;
        }
        return t.texture(r);
    }
    const Te = {
        polygonFill: [ 1, 1, 1, 1 ],
        polygonOpacity: 1,
        uvScale: [ 1, 1 ],
        uvOffset: [ 0, 0 ]
    };
    class Oe extends Se {
        prepareSymbol(t) {
            const e = t.polygonFill;
            Array.isArray(e) && (3 === e.length && e.push(1), t.polygonFill = e.map(t => 255 * t));
        }
        supportRenderMode(t) {
            return this.sceneConfig.antialias || void 0 === this.sceneConfig.antialias ? "fxaa" === t || "fxaaBeforeTaa" === t : super.supportRenderMode(t);
        }
        isBloom(t) {
            return !!this.getSymbol(t.properties.symbolIndex).polygonBloom;
        }
        needPolygonOffset() {
            return !0;
        }
        createMesh(t, e, i) {
            const {tilePoint: r} = i, {geometry: o, symbolIndex: a, ref: s} = t, l = o.data.aPosition instanceof Int16Array, f = {
                tileExtent: o.properties.tileExtent,
                tileRatio: o.properties.tileRatio
            }, c = this.getSymbol(a);
            if (Vt(f, "polygonFill", c, "polygonFill", Te.polygonFill, Ut(this.colorCache)), 
            Vt(f, "polygonOpacity", c, "polygonOpacity", Te.polygonOpacity), Vt(f, "uvScale", c, "uvScale", Te.uvScale), 
            Vt(f, "uvOffset", c, "uvOffset", Te.uvOffset), void 0 === s) {
                const t = this.getSymbolDef(a), e = this.getFnTypeConfig(a);
                $t(o, t, e), o.generateBuffers(this.regl);
            }
            const h = o.properties.iconAtlas;
            if (h && o.data.aTexInfo) {
                const t = this.getMap();
                f.tilePoint = r, Object.defineProperty(f, "tileScale", {
                    enumerable: !0,
                    get: function() {
                        return o.properties.tileResolution / t.getResolution();
                    }
                }), f.polygonPatternFile = Me(this.regl, h, !1), f.atlasSize = [ h.width, h.height ], 
                this.drawDebugAtlas(h);
            }
            const u = new n.reshader.Material(f, Te), d = new n.reshader.Mesh(o, u, {
                disableVAO: !0,
                castShadow: !1,
                picking: !0
            }), m = {};
            return h && o.data.aTexInfo && (m.HAS_PATTERN = 1), o.data.aColor && (m.HAS_COLOR = 1), 
            o.data.aOpacity && (m.HAS_OPACITY = 1), o.data.aUVScale && (m.HAS_UV_SCALE = 1), 
            o.data.aUVOffset && (m.HAS_UV_OFFSET = 1), l && (m.IS_VT = 1), d.setDefines(m), 
            d.setLocalTransform(e), d.properties.symbolIndex = a, d;
        }
        createFnTypeConfig(t, e) {
            const n = Et(e.polygonFill), i = Ct(e.polygonOpacity), r = Ct(e.uvScale), o = Ct(e.uvOffset), a = new Uint8Array(1), s = new Uint16Array(1);
            return [ {
                attrName: "aColor",
                symbolName: "polygonFill",
                type: Uint8Array,
                width: 4,
                define: "HAS_COLOR",
                evaluate: (e, i, r) => {
                    let o = n(t.getZoom(), e);
                    return Pt(o) && (o = this.evaluateInFnTypeConfig(o, r, t, e, !0)), Array.isArray(o) || (o = this.colorCache[o] = this.colorCache[o] || bt(o).unitArray()), 
                    o = Gt(o), o;
                }
            }, {
                attrName: "aOpacity",
                symbolName: "polygonOpacity",
                type: Uint8Array,
                width: 1,
                define: "HAS_OPACITY",
                evaluate: (e, n, r) => {
                    let o = i(t.getZoom(), e);
                    return Pt(o) && (o = this.evaluateInFnTypeConfig(o, r, t, e)), a[0] = 255 * o, a[0];
                }
            }, {
                attrName: "aUVScale",
                symbolName: "uvScale",
                type: Uint16Array,
                width: 2,
                define: "HAS_UV_SCALE",
                evaluate: e => {
                    let n = r(t.getZoom(), e);
                    return s[0] = 10 * n, s[0];
                }
            }, {
                attrName: "aUVOffset",
                symbolName: "uvOffset",
                type: Uint8Array,
                width: 2,
                define: "HAS_UV_OFFSET",
                evaluate: e => {
                    let n = o(t.getZoom(), e);
                    return a[0] = 255 * n, a[0];
                }
            } ];
        }
        paint(t) {
            t.states && t.states.includesChanged.shadow && (this.shader.dispose(), this.it(t)), 
            super.paint(t);
        }
        init(t) {
            const e = this.regl;
            this.renderer = new n.reshader.Renderer(e), this.it(t), this.pickingFBO && (this.picking = [ new n.reshader.FBORayPicking(this.renderer, {
                vert: we,
                uniforms: [ {
                    name: "projViewModelMatrix",
                    type: "function",
                    fn: function(t, e) {
                        const i = [];
                        return n.mat4.multiply(i, e.projViewMatrix, e.modelMatrix), i;
                    }
                } ],
                extraCommandProps: {
                    viewport: this.pickingViewport
                }
            }, this.pickingFBO) ]);
        }
        it(t) {
            const e = this.canvas, i = [ {
                name: "projViewModelMatrix",
                type: "function",
                fn: function(t, e) {
                    const i = [];
                    return n.mat4.multiply(i, e.projViewMatrix, e.modelMatrix), i;
                }
            } ], r = {};
            this.fillIncludes(r, i, t);
            const o = {
                x: 0,
                y: 0,
                width: () => e ? e.width : 1,
                height: () => e ? e.height : 1
            }, a = this.layer.getRenderer(), s = a.isEnableTileStencil && a.isEnableTileStencil(), l = this.sceneConfig.depthRange;
            this.shader = new n.reshader.MeshShader({
                vert: "#define SHADER_NAME FILL\nattribute vec3 aPosition;\n#ifdef HAS_COLOR\nattribute vec4 aColor;\nvarying vec4 vColor;\n#endif\n#ifdef HAS_OPACITY\nattribute float aOpacity;\nvarying float vOpacity;\n#endif\nuniform mat4 projViewModelMatrix;\n#ifndef IS_VT\nuniform mat4 modelMatrix;\n#endif\n#ifdef HAS_PATTERN\nattribute vec4 aTexInfo;\nuniform vec2 tilePoint;\n#ifdef IS_VT\nuniform float tileRatio;\nuniform float tileScale;\n#else\nuniform float glScale;\n#endif\n#ifdef HAS_UV_SCALE\nattribute vec2 aUVScale;\nvarying vec2 vUVScale;\n#endif\n#ifdef HAS_UV_OFFSET\nattribute vec2 aUVOffset;\nvarying vec2 vUVOffset;\n#endif\nvarying vec2 vTexCoord;\nvarying vec4 vTexInfo;\nvec2 c(vec2 d, vec2 e) {\n  vTexInfo = vec4(aTexInfo.xy, e);\n#ifdef IS_VT\nfloat f = d.x / e.x;\n  float h = d.y / e.y;\n  return vec2(f, h);\n#else\nfloat f = (d.x - tilePoint.x) * glScale / e.x;\n  float h = (d.y - tilePoint.y) * glScale / e.y;\n  return vec2(f, -h);\n#endif\n}\n#endif\n#if defined(HAS_SHADOWING) && !defined(HAS_BLOOM)\n#include <vsm_shadow_vert>\n#endif\nvoid main() {\n  vec4 i = vec4(aPosition, 1.);\n  gl_Position = projViewModelMatrix * i;\n#ifdef HAS_PATTERN\nvec2 j = aTexInfo.zw + 1.;\n#ifdef IS_VT\nvec2 k = mod((tilePoint) * tileScale * vec2(1., -1.) / j, 1.);\n  vTexCoord = k + c(aPosition.xy * tileScale / tileRatio, j);\n#else\nvec4 l = modelMatrix * vec4(aPosition, 1.);\n  vTexCoord = c(l.xy, j);\n#endif\n#ifdef HAS_UV_SCALE\nvUVScale = aUVScale / 255.;\n#endif\n#ifdef HAS_UV_OFFSET\nvUVOffset = aUVOffset / 255.;\n#endif\n#endif\n#ifdef HAS_COLOR\nvColor = aColor / 255.;\n#endif\n#ifdef HAS_OPACITY\nvOpacity = aOpacity / 255.;\n#endif\n#if defined(HAS_SHADOWING) && !defined(HAS_BLOOM)\nshadow_computeShadowPars(i);\n#endif\n}",
                frag: "#define SHADER_NAME FILL\nprecision mediump float;\n#if defined(HAS_SHADOWING) && !defined(HAS_BLOOM)\n#include <vsm_shadow_frag>\n#endif\n#ifdef HAS_PATTERN\n#ifdef HAS_UV_SCALE\nvarying vec2 vUVScale;\n#else\nuniform vec2 uvScale;\n#endif\n#ifdef HAS_UV_OFFSET\nvarying vec2 vUVOffset;\n#else\nuniform vec2 uvOffset;\n#endif\n#endif\n#ifdef HAS_PATTERN\nuniform sampler2D polygonPatternFile;\nuniform vec2 atlasSize;\nvarying vec2 vTexCoord;\nvarying vec4 vTexInfo;\nvec2 c() {\n  \n#ifdef HAS_UV_SCALE\nvec2 d = vUVScale;\n#else\nvec2 d = uvScale;\n#endif\n#ifdef HAS_UV_OFFSET\nvec2 e = vUVOffset;\n#else\nvec2 e = uvOffset;\n#endif\nvec2 f = mod(vTexCoord * d + e, 1.);\n  vec2 h = vTexInfo.xy;\n  vec2 i = vTexInfo.zw;\n  return (h + f * i) / atlasSize;\n}\n#endif\n#ifdef HAS_COLOR\nvarying vec4 vColor;\n#else\nuniform vec4 polygonFill;\n#endif\n#ifdef HAS_OPACITY\nvarying float vOpacity;\n#else\nuniform lowp float polygonOpacity;\n#endif\nuniform float tileExtent;\nuniform lowp float blendSrcIsOne;\nvoid main() {\n  \n#ifdef HAS_COLOR\nvec4 j = vColor;\n#else\nvec4 j = polygonFill;\n#endif\n#ifdef HAS_PATTERN\nif(vTexInfo.z * vTexInfo.w > 1.) {\n    vec2 f = c();\n    j = texture2D(polygonPatternFile, f);\n  }\n#endif\n#ifdef HAS_OPACITY\ngl_FragColor = j * vOpacity;\n#else\ngl_FragColor = j * polygonOpacity;\n#endif\n#if defined(HAS_SHADOWING) && !defined(HAS_BLOOM)\nfloat k = shadow_computeShadow();\n  gl_FragColor.rgb = shadow_blend(gl_FragColor.rgb, k);\n#endif\nif(blendSrcIsOne == 1.) {\n    gl_FragColor *= gl_FragColor.a;\n  }\n}",
                uniforms: i,
                defines: r,
                extraCommandProps: {
                    viewport: o,
                    stencil: {
                        enable: !0,
                        mask: 255,
                        func: {
                            cmp: () => s ? "=" : "<=",
                            ref: (t, e) => s ? e.stencilRef : e.level,
                            mask: 255
                        },
                        op: {
                            fail: "keep",
                            zfail: "keep",
                            zpass: "replace"
                        }
                    },
                    depth: {
                        enable: !0,
                        range: l || [ 0, 1 ],
                        mask: (t, e) => {
                            if (!zt(this.sceneConfig.depthMask)) return !!this.sceneConfig.depthMask;
                            if (e.meshConfig.transparent) return !1;
                            const n = e.polygonOpacity;
                            return !(Xt(n) && n < 1);
                        },
                        func: this.sceneConfig.depthFunc || "<="
                    },
                    blend: {
                        enable: !0,
                        func: this.getBlendFunc(),
                        equation: "add"
                    },
                    polygonOffset: {
                        enable: !0,
                        offset: this.getPolygonOffset()
                    }
                }
            });
        }
        getUniformValues(t, e) {
            const n = {
                projViewMatrix: t.projViewMatrix,
                glScale: 1 / t.getGLScale(),
                blendSrcIsOne: +!("one" !== this.sceneConfig.blendSrc)
            };
            return this.setIncludeUniformValues(n, e), n;
        }
    }
    var Ie = "#define SHADER_NAME LINE\n#define AA_CLIP_LIMIT 2.0\n#define AA_LINE_WIDTH 16.0\n#define DEVICE_PIXEL_RATIO 1.0\n#define ANTIALIASING 1.0 / DEVICE_PIXEL_RATIO / 2.0\n#define EXTRUDE_SCALE 63.0;\n#define MAX_LINE_DISTANCE 65535.0\nattribute vec3 aPosition;\n#if defined(HAS_UP) || defined(HAS_PATTERN)\nattribute vec3 aExtrude;\n#else\nattribute vec2 aExtrude;\n#endif\n#if defined(HAS_PATTERN) || defined(HAS_DASHARRAY) || defined(HAS_GRADIENT) || defined(HAS_TRAIL)\nattribute float aLinesofar;\nvarying highp float vLinesofar;\n#endif\nuniform float cameraToCenterDistance;\n#if defined(HAS_STROKE_WIDTH)\nattribute float aLineStrokeWidth;\n#else\nuniform float lineStrokeWidth;\n#endif\nuniform mat4 projViewModelMatrix;\nuniform mat4 modelMatrix;\nuniform float tileResolution;\nuniform float resolution;\nuniform float tileRatio;\n#ifdef HAS_LINE_DX\nattribute float aLineDx;\n#else\nuniform float lineDx;\n#endif\n#ifdef HAS_LINE_DY\nattribute float aLineDy;\n#else\nuniform float lineDy;\n#endif\nuniform vec2 canvasSize;\nuniform float layerScale;\nvarying vec2 vNormal;\nvarying vec2 vWidth;\nvarying float vGammaScale;\n#ifndef ENABLE_TILE_STENCIL\nvarying vec2 vPosition;\n#endif\n#ifdef USE_LINE_OFFSET\nattribute vec2 aExtrudeOffset;\n#endif\n#ifdef HAS_LINE_WIDTH\nattribute float aLineWidth;\n#else\nuniform float lineWidth;\n#endif\n#ifndef PICKING_MODE\n#ifndef HAS_GRADIENT\n#ifdef HAS_COLOR\nattribute vec4 aColor;\nvarying vec4 vColor;\n#endif\n#ifdef HAS_PATTERN\n#ifdef HAS_PATTERN_ANIM\nattribute float aLinePatternAnimSpeed;\nvarying float vLinePatternAnimSpeed;\n#endif\n#ifdef HAS_PATTERN_GAP\nattribute float aLinePatternGap;\nvarying float vLinePatternGap;\n#endif\nattribute vec4 aTexInfo;\nvarying vec4 vTexInfo;\nvarying float vJoin;\n#endif\n#ifdef HAS_DASHARRAY\n#ifdef HAS_DASHARRAY_ATTR\nattribute vec4 aDasharray;\nvarying vec4 vDasharray;\n#endif\n#ifdef HAS_DASHARRAY_COLOR\nattribute vec4 aDashColor;\nvarying vec4 vDashColor;\n#endif\n#endif\n#endif\n#ifdef HAS_STROKE_COLOR\nattribute vec4 aStrokeColor;\nvarying vec4 vStrokeColor;\n#endif\n#ifdef HAS_OPACITY\nattribute float aOpacity;\nvarying float vOpacity;\n#endif\n#ifdef HAS_GRADIENT\nattribute float aGradIndex;\nvarying float vGradIndex;\n#endif\n#if defined(HAS_SHADOWING) && !defined(HAS_BLOOM)\n#include <vsm_shadow_vert>\n#endif\n#else\n#include <fbo_picking_vert>\n#endif\nvarying vec3 vVertex;\nvoid main() {\n  vec3 c = aPosition;\n#ifdef HAS_UP\nfloat d = mod(aExtrude.z, 4.);\n  float e = floor(d * .5);\n  float f = d - e * 2.;\n  vNormal = vec2(e, f * 2. - 1.);\n#else\nc.xy = floor(c.xy * .5);\n  vNormal = aPosition.xy - 2. * c.xy;\n  vNormal.y = vNormal.y * 2. - 1.;\n#endif\nvec4 h = vec4(c, 1.);\n  vec4 i = projViewModelMatrix * h;\n  vVertex = (modelMatrix * h).xyz;\n#ifdef HAS_STROKE_WIDTH\nfloat j = aLineStrokeWidth / 2. * layerScale;\n#else\nfloat j = lineStrokeWidth;\n#endif\n#ifdef HAS_LINE_WIDTH\nfloat k = aLineWidth / 2. * layerScale;\n#else\nfloat k = lineWidth * layerScale;\n#endif\nfloat l = k / 2. + j;\n  float m = sign(j) * k / 2.;\n  float n = m + sign(m) * ANTIALIASING;\n  float o = l + sign(l) * ANTIALIASING;\n#ifdef USE_LINE_OFFSET\nvec2 u = lineOffset * (vNormal.y * (aExtrude.xy - aExtrudeOffset) + aExtrudeOffset);\n  vec2 v = (o * aExtrude.xy + u) / EXTRUDE_SCALE;\n#else\nvec2 A = aExtrude.xy / EXTRUDE_SCALE;\n  vec2 v = o * A;\n#endif\nfloat B = tileResolution / resolution;\n  vec4 C = vec4(c + vec3(v, .0) * tileRatio / B, 1.);\n  gl_Position = projViewModelMatrix * C;\n  float D = min(AA_CLIP_LIMIT / canvasSize.x, AA_CLIP_LIMIT / canvasSize.y);\n  float E = distance(gl_Position.xy / gl_Position.w, i.xy / i.w) - D;\n  if(E * k < .0) {\n    float F = -E / D;\n    float G = F * F * F * F * AA_LINE_WIDTH;\n    v += G * A;\n    o += G / 6.;\n    C = vec4(c + vec3(v, .0) * tileRatio / B, 1.);\n    gl_Position = projViewModelMatrix * C;\n  }\n#ifdef HAS_LINE_DX\nfloat H = aLineDx;\n#else\nfloat H = lineDx;\n#endif\n#ifdef HAS_LINE_DY\nfloat I = aLineDy;\n#else\nfloat I = lineDy;\n#endif\nfloat J = gl_Position.w;\n  gl_Position.xy += vec2(H, I) * 2. / canvasSize * J;\n#ifndef PICKING_MODE\nvWidth = vec2(o, n);\n  vGammaScale = J / cameraToCenterDistance;\n#ifndef ENABLE_TILE_STENCIL\nvPosition = c.xy;\n#ifdef USE_LINE_OFFSET\nvPosition += tileRatio * u / EXTRUDE_SCALE;\n#endif\n#endif\n#if defined(HAS_PATTERN) || defined(HAS_DASHARRAY) || defined(HAS_GRADIENT)\n#ifdef HAS_GRADIENT\nvLinesofar = aLinesofar / MAX_LINE_DISTANCE;\n  vGradIndex = aGradIndex;\n#else\nvLinesofar = aLinesofar / tileRatio * B;\n#endif\n#endif\n#ifndef HAS_GRADIENT\n#ifdef HAS_COLOR\nvColor = aColor;\n#endif\n#ifdef HAS_DASHARRAY\n#ifdef HAS_DASHARRAY_ATTR\nvDasharray = aDasharray;\n#endif\n#ifdef HAS_DASHARRAY_COLOR\nvDashColor = aDashColor / 255.;\n#endif\n#endif\n#ifdef HAS_PATTERN\nvTexInfo = vec4(aTexInfo.xy, aTexInfo.zw + 1.);\n  vJoin = floor(aExtrude.z / 4.);\n#ifdef HAS_PATTERN_ANIM\nvLinePatternAnimSpeed = aLinePatternAnimSpeed / 127.;\n#endif\n#ifdef HAS_PATTERN_GAP\nvLinePatternGap = aLinePatternGap / 10.0;\n#endif\n#endif\n#endif\n#ifdef HAS_STROKE_COLOR\nvStrokeColor = aStrokeColor;\n#endif\n#ifdef HAS_OPACITY\nvOpacity = aOpacity / 255.;\n#endif\n#if defined(HAS_SHADOWING) && !defined(HAS_BLOOM)\nshadow_computeShadowPars(C);\n#endif\n#else\nfbo_picking_setData(J, true);\n#endif\n}";
    class He extends Se {
        prepareSymbol(t) {
            const e = t.lineColor;
            Array.isArray(e) && (3 === e.length && e.push(1), t.lineColor = e.map(t => 255 * t));
            const n = t.lineStrokeColor;
            Array.isArray(n) && (3 === n.length && n.push(1), t.lineStrokeColor = n.map(t => 255 * t));
            const i = t.lineDashColor;
            Array.isArray(i) && (3 === i.length && i.push(1), t.lineDashColor = i.map(t => 255 * t));
        }
        needToRedraw() {
            if (this.rt) return !0;
            const t = this.getSymbols(), e = this.sceneConfig.trailAnimation;
            if (e && e.enable || super.needToRedraw()) return !0;
            for (let e = 0; e < t.length; e++) if (t[e].linePatternAnimSpeed) return !0;
            return !1;
        }
        isBloom(t) {
            return !!this.getSymbol(t.properties.symbolIndex).lineBloom;
        }
        needPolygonOffset() {
            return !0;
        }
        createMesh(t, e) {
            if (!t.geometry) return null;
            const {geometry: i, symbolIndex: r, ref: o} = t;
            if (void 0 === o) {
                $t(i, this.getSymbolDef(r), this.getFnTypeConfig(r));
            }
            const a = this.getSymbol(r), s = {
                tileResolution: i.properties.tileResolution,
                tileRatio: i.properties.tileRatio,
                tileExtent: i.properties.tileExtent
            };
            this.setLineUniforms(a, s), Vt(s, "lineColor", a, "lineColor", "#000", Ut(this.colorCache)), 
            Vt(s, "lineStrokeColor", a, "lineStrokeColor", [ 0, 0, 0, 0 ], Ut(this.colorCache)), 
            Vt(s, "lineDasharray", a, "lineDasharray", [ 0, 0, 0, 0 ], t => {
                let e;
                if (t && t.length) {
                    const n = t;
                    1 === t.length ? e = [ n[0], n[0], n[0], n[0] ] : 2 === t.length ? e = [ n[0], n[1], n[0], n[1] ] : 3 === t.length ? e = [ n[0], n[1], n[2], n[2] ] : 4 === t.length && (e = t);
                }
                return e || [ 0, 0, 0, 0 ];
            }), Vt(s, "lineDashColor", a, "lineDashColor", [ 0, 0, 0, 0 ], Ut(this.colorCache));
            const l = i.properties.iconAtlas, f = i.data.aPosition instanceof Int16Array;
            l && (s.linePatternFile = Me(this.regl, l, !1), s.atlasSize = l ? [ l.width, l.height ] : [ 0, 0 ], 
            s.flipY = f ? -1 : 1, this.drawDebugAtlas(l)), void 0 === o && (i.properties.hasUp = !f, 
            i.generateBuffers(this.regl));
            const c = new n.reshader.Material(s), h = new n.reshader.Mesh(i, c, {
                castShadow: !1,
                picking: !0
            });
            h.setLocalTransform(e);
            const u = {};
            return l && (u.HAS_PATTERN = 1), h.properties.symbolIndex = r, this.ot(h, u), i.data.aColor && (u.HAS_COLOR = 1), 
            i.data.aStrokeColor && (u.HAS_STROKE_COLOR = 1), this.setMeshDefines(u, i), i.properties.hasUp && (u.HAS_UP = 1), 
            h.setDefines(u), h;
        }
        addMesh(...t) {
            delete this.rt;
            const e = t[0];
            Array.isArray(e) && e.forEach(t => {
                this.at(t);
            }), super.addMesh(...t);
        }
        at(t) {
            if (!t.geometry.aLineWidth && t.material.get("lineWidth") <= 0 || !t.geometry.aOpacity && t.material.get("lineOpacity") <= 0) return;
            const e = t.defines;
            this.ot(t, e), t.setDefines(e), t.geometry.properties.hasPatternAnim && (this.rt = 1);
        }
        ot(t, e) {
            const n = t.geometry, i = this.getSymbol(t.properties.symbolIndex);
            n.data.aDasharray || Array.isArray(i.lineDasharray) && i.lineDasharray.reduce((t, e) => t + e, 0) > 0 ? (e.HAS_DASHARRAY = 1, 
            n.data.aDasharray && (e.HAS_DASHARRAY_ATTR = 1), n.data.aDashColor && (e.HAS_DASHARRAY_COLOR = 1)) : e.HAS_DASHARRAY && delete e.HAS_DASHARRAY;
        }
        setLineUniforms(t, e) {
            Vt(e, "lineWidth", t, "lineWidth", 2), Vt(e, "lineOpacity", t, "lineOpacity", 1), 
            Vt(e, "lineStrokeWidth", t, "lineStrokeWidth", 0), Vt(e, "lineBlur", t, "lineBlur", .7), 
            Vt(e, "lineOffset", t, "lineOffset", 0), Vt(e, "lineDx", t, "lineDx", 0), Vt(e, "lineDy", t, "lineDy", 0), 
            Vt(e, "linePatternAnimSpeed", t, "linePatternAnimSpeed", 0), Vt(e, "linePatternGap", t, "linePatternGap", 0);
        }
        setMeshDefines(t, e) {
            e.data.aOpacity && (t.HAS_OPACITY = 1), e.data.aLineWidth && (t.HAS_LINE_WIDTH = 1), 
            e.data.aLineStrokeWidth && (t.HAS_STROKE_WIDTH = 1), e.data.aLineDx && (t.HAS_LINE_DX = 1), 
            e.data.aLineDy && (t.HAS_LINE_DY = 1), e.data.aLinePatternAnimSpeed && (t.HAS_PATTERN_ANIM = 1), 
            e.data.aLinePatternGap && (t.HAS_PATTERN_GAP = 1);
        }
        paint(t) {
            t.states && t.states.includesChanged.shadow && (this.shader.dispose(), this.createShader(t)), 
            super.paint(t);
        }
        createFnTypeConfig(t, e) {
            const n = Et(e.lineColor), i = Et(e.aLinePatternAnimSpeed), r = Et(e.aLinePatternGap), o = this.createShapeFnTypeConfigs(t, e), a = new Int8Array(1);
            return [ {
                attrName: "aColor",
                symbolName: "lineColor",
                type: Uint8Array,
                width: 4,
                define: "HAS_COLOR",
                evaluate: (e, i, r) => {
                    let o = n(t.getZoom(), e);
                    return Pt(o) && (o = this.evaluateInFnTypeConfig(o, r, t, e, !0)), Array.isArray(o) || (o = this.colorCache[o] = this.colorCache[o] || bt(o).unitArray()), 
                    o = Gt(o), o;
                }
            }, {
                attrName: "aLinePatternAnimSpeed",
                symbolName: "linePatternAnimSpeed",
                type: Int8Array,
                width: 1,
                define: "HAS_PATTERN_ANIM",
                evaluate: (e, n, r) => {
                    let o = i(t.getZoom(), e);
                    return zt(o) && (o = 0), 0 !== o && (r.properties.hasPatternAnim = 1), a[0] = o / 127, 
                    a[0];
                }
            }, {
                attrName: "aLinePatternGap",
                symbolName: "linePatternGap",
                type: Uint8Array,
                width: 1,
                define: "HAS_PATTERN_GAP",
                evaluate: e => {
                    let n = r(t.getZoom(), e);
                    return zt(n) && (n = 0), a[0] = 10 * n, a[0];
                }
            } ].concat(o);
        }
        createShapeFnTypeConfigs(t, e) {
            const n = Ct(e.lineWidth), i = Ct(e.lineOpacity), r = Ct(e.lineStrokeWidth), o = Ct(e.lineDx), a = Ct(e.lineDy), s = new Uint16Array(1), l = new Int8Array(1);
            return [ {
                attrName: "aLineWidth",
                symbolName: "lineWidth",
                type: Uint8Array,
                width: 1,
                define: "HAS_LINE_WIDTH",
                evaluate: (e, i, r) => {
                    let o = n(t.getZoom(), e);
                    return Pt(o) && (o = this.evaluateInFnTypeConfig(o, r, t, e)), s[0] = Math.round(2 * o), 
                    s[0];
                }
            }, {
                attrName: "aLineStrokeWidth",
                symbolName: "lineStrokeWidth",
                type: Uint8Array,
                width: 1,
                define: "HAS_STROKE_WIDTH",
                evaluate: e => {
                    const n = r(t.getZoom(), e);
                    return s[0] = Math.round(2 * n), s[0];
                }
            }, {
                attrName: "aLineDx",
                symbolName: "lineDx",
                type: Int8Array,
                width: 1,
                define: "HAS_LINE_DX",
                evaluate: e => {
                    const n = o(t.getZoom(), e);
                    return l[0] = n, l[0];
                }
            }, {
                attrName: "aLineDy",
                symbolName: "lineDy",
                type: Int8Array,
                width: 1,
                define: "HAS_LINE_DY",
                evaluate: e => {
                    const n = a(t.getZoom(), e);
                    return l[0] = n, l[0];
                }
            }, {
                attrName: "aOpacity",
                symbolName: "lineOpacity",
                type: Uint8Array,
                width: 1,
                define: "HAS_OPACITY",
                evaluate: (e, n, r) => {
                    let o = i(t.getZoom(), e);
                    return Pt(o) && (o = this.evaluateInFnTypeConfig(o, r, t, e)), s[0] = 255 * o, s[0];
                }
            } ];
        }
        W(t, e) {
            return super.W(t, e) || t.lineJoinPatternMode !== e.lineJoinPatternMode;
        }
        updateSceneConfig(t) {
            t.trailAnimation && this.createShader(this.st);
        }
        init(t) {
            const e = this.regl;
            this.renderer = new n.reshader.Renderer(e), this.createShader(t), this.pickingFBO && (this.picking = [ new n.reshader.FBORayPicking(this.renderer, {
                vert: "#define PICKING_MODE 1\n" + Ie,
                uniforms: [ {
                    name: "projViewModelMatrix",
                    type: "function",
                    fn: function(t, e) {
                        const i = [];
                        return n.mat4.multiply(i, e.projViewMatrix, e.modelMatrix), i;
                    }
                } ],
                extraCommandProps: {
                    viewport: this.pickingViewport
                }
            }, this.pickingFBO) ]);
        }
        createShader(t) {
            this.st = t;
            const e = [], i = {};
            this.fillIncludes(i, e, t), this.sceneConfig.trailAnimation && this.sceneConfig.trailAnimation.enable && (i.HAS_TRAIL = 1), 
            e.push({
                name: "projViewModelMatrix",
                type: "function",
                fn: function(t, e) {
                    const i = [];
                    return n.mat4.multiply(i, e.projViewMatrix, e.modelMatrix), i;
                }
            }), this.shader = new n.reshader.MeshShader({
                vert: Ie,
                frag: "#define SHADER_NAME LINE\n#define DEVICE_PIXEL_RATIO 1.0\nprecision highp float;\n#if defined(HAS_SHADOWING) && !defined(HAS_BLOOM)\n#include <vsm_shadow_frag>\n#endif\nuniform lowp float blendSrcIsOne;\nuniform lowp float lineBlur;\n#ifdef HAS_COLOR\nvarying vec4 vColor;\n#else\nuniform lowp vec4 lineColor;\n#endif\n#ifdef HAS_STROKE_COLOR\nvarying vec4 vStrokeColor;\n#else\nuniform lowp vec4 lineStrokeColor;\n#endif\n#ifdef HAS_OPACITY\nvarying float vOpacity;\n#else\nuniform lowp float lineOpacity;\n#endif\n#ifdef HAS_PATTERN\nuniform sampler2D linePatternFile;\nuniform vec2 atlasSize;\nuniform float flipY;\n#ifdef HAS_PATTERN_ANIM\nvarying float vLinePatternAnimSpeed;\n#else\nuniform float linePatternAnimSpeed;\n#endif\n#ifdef HAS_PATTERN_GAP\nvarying float vLinePatternGap;\n#else\nuniform float linePatternGap;\n#endif\nvarying vec4 vTexInfo;\nvarying float vJoin;\nvec2 c(vec2 d) {\n  vec2 e = mod(d, 1.);\n  vec2 f = vTexInfo.xy;\n  vec2 h = vTexInfo.zw;\n  return (f + e * h) / atlasSize;\n}\n#endif\nvarying vec2 vNormal;\nvarying vec2 vWidth;\nvarying float vGammaScale;\n#ifndef ENABLE_TILE_STENCIL\nvarying vec2 vPosition;\n#endif\nuniform float tileExtent;\n#ifdef HAS_DASHARRAY\n#ifdef HAS_DASHARRAY_ATTR\nvarying vec4 vDasharray;\n#else\nuniform vec4 lineDasharray;\n#endif\n#ifdef HAS_DASHARRAY_COLOR\nvarying vec4 vDashColor;\n#else\nuniform vec4 lineDashColor;\n#endif\n#endif\n#if defined(HAS_PATTERN) || defined(HAS_DASHARRAY) || defined(HAS_GRADIENT) || defined(HAS_TRAIL)\nvarying highp float vLinesofar;\n#endif\n#ifdef HAS_TRAIL\nuniform float trailSpeed;\nuniform float trailLength;\nuniform float trailCircle;\n#endif\n#if defined(HAS_TRAIL) || defined(HAS_PATTERN)\nuniform float currentTime;\n#endif\nfloat i(float j, float k) {\n  float l = k / 2.;\n  float m = abs(j - l);\n  float n = (.1 + 1. / DEVICE_PIXEL_RATIO) * vGammaScale;\n  return clamp(min(m + n, l - m) / n, .0, 1.);\n}\nvarying vec3 vVertex;\nuniform vec3 cameraPosition;\nuniform float cameraToCenterDistance;\nvoid main() {\n  \n#ifndef ENABLE_TILE_STENCIL\nfloat o = sign(tileExtent - min(tileExtent, abs(vPosition.x))) * sign(1. + sign(vPosition.x)) * sign(tileExtent - min(tileExtent, abs(vPosition.y))) * sign(1. + sign(vPosition.y));\n  if(o == .0) {\n    discard;\n  }\n#endif\n#if defined(HAS_PATTERN) || defined(HAS_DASHARRAY) || defined(HAS_GRADIENT) || defined(HAS_TRAIL)\nfloat u = vLinesofar;\n#endif\nfloat v = length(vNormal) * vWidth.s;\n#ifdef HAS_PATTERN\nvec2 h = vTexInfo.zw;\n  float A = sign(h.x * h.y);\n  float B = mix(lineBlur, .0, A);\n#else\nfloat B = lineBlur;\n#endif\nfloat n = (B + 1. / DEVICE_PIXEL_RATIO) * vGammaScale;\n  float C = clamp(min(v - (vWidth.t - n), vWidth.s - v) / n, .0, 1.);\n#ifdef HAS_COLOR\nvec4 D = vColor / 255.;\n#else\nvec4 D = lineColor;\n#endif\n#ifdef HAS_PATTERN\nif(A == 1.) {\n    \n#ifdef HAS_PATTERN_GAP\nfloat E = vLinePatternGap;\n#else\nfloat E = linePatternGap;\n#endif\n#ifdef HAS_PATTERN_ANIM\nfloat F = vLinePatternAnimSpeed;\n#else\nfloat F = linePatternAnimSpeed;\n#endif\nfloat G = ceil(h.x * vWidth.s * 2. / h.y);\n    float H = G * (1. + E);\n    u += mod(currentTime * -F * .2, H);\n    float I = mod(u / H, 1.);\n    float J = mod((flipY * vNormal.y + 1.) / 2., 1.);\n    vec2 f = vTexInfo.xy;\n    D = mix(texture2D(linePatternFile, c(vec2(I * (1. + E), J))), vec4(.0), sign(vJoin));\n    float K = clamp(sign(1. / (1. + E) - I) + .000001, .0, 1.);\n    D *= K;\n  }\n#endif\n#ifdef HAS_STROKE_COLOR\nvec4 L = vStrokeColor / 255.;\n#else\nvec4 L = lineStrokeColor;\n#endif\nL = mix(D, L, sign(vWidth.t));\n  D = L * C + max(sign(vWidth.t - v), .0) * D * (1. - C);\n#ifdef HAS_DASHARRAY\n#ifdef HAS_DASHARRAY_ATTR\nvec4 M = vDasharray;\n#else\nvec4 M = lineDasharray;\n#endif\n#ifdef HAS_DASHARRAY_COLOR\nvec4 N = vDashColor;\n#else\nvec4 N = lineDashColor;\n#endif\nfloat k = M[0] + M[1] + M[2] + M[3];\n  float j = mod(u, k);\n  float O = max(sign(M[0] - j), .0);\n  float P = j - M[0] - M[1];\n  float Q = max(sign(P), .0) * max(sign(M[2] - P), .0);\n  float R = O + Q;\n  float S = i(j, M[0]);\n  float T = i(P, M[2]);\n  float U = S * O + T * Q;\n  D = D * (1. - U) + C * N * U;\n#endif\n#ifdef HAS_TRAIL\nfloat V = mod(u - currentTime * trailSpeed * .1, trailCircle);\n  float W = V < trailLength ? mix(.0, 1., V / trailLength) : .0;\n  D *= W;\n#endif\n#ifdef HAS_OPACITY\nfloat X = vOpacity;\n#else\nfloat X = lineOpacity;\n#endif\ngl_FragColor = D * X;\n#if defined(HAS_SHADOWING) && !defined(HAS_BLOOM)\nfloat Y = shadow_computeShadow();\n  gl_FragColor.rgb = shadow_blend(gl_FragColor.rgb, Y);\n#endif\nfloat Z = clamp(cameraToCenterDistance * 1.5 / distance(vVertex, cameraPosition), .0, 1.);\n  if(blendSrcIsOne == 1.) {\n    gl_FragColor *= gl_FragColor.a;\n  }\n  gl_FragColor *= Z;\n}",
                uniforms: e,
                defines: i,
                extraCommandProps: this.getExtraCommandProps()
            });
        }
        getExtraCommandProps() {
            const t = this.layer.getRenderer().isEnableTileStencil && this.layer.getRenderer().isEnableTileStencil(), e = this.canvas;
            return {
                viewport: {
                    x: 0,
                    y: 0,
                    width: () => e ? e.width : 1,
                    height: () => e ? e.height : 1
                },
                stencil: {
                    enable: !1,
                    func: {
                        cmp: () => t ? "=" : "<=",
                        ref: (e, n) => t ? n.stencilRef : n.level
                    },
                    op: {
                        fail: "keep",
                        zfail: "keep",
                        zpass: "replace"
                    }
                },
                depth: {
                    enable: !0,
                    range: this.sceneConfig.depthRange || [ 0, 1 ],
                    mask: !1,
                    func: this.sceneConfig.depthFunc || "<="
                },
                blend: {
                    enable: !0,
                    func: this.getBlendFunc(),
                    equation: "add"
                },
                polygonOffset: {
                    enable: !0,
                    offset: this.getPolygonOffset()
                }
            };
        }
        getUniformValues(t, e) {
            const n = t.projViewMatrix, i = t.viewMatrix, r = t.cameraToCenterDistance, o = t.getResolution(), a = [ t.width, t.height ], s = this.sceneConfig.trailAnimation || {}, l = {
                layerScale: this.layer.options.styleScale || 1,
                projViewMatrix: n,
                viewMatrix: i,
                cameraToCenterDistance: r,
                resolution: o,
                canvasSize: a,
                trailSpeed: s.speed || 1,
                trailLength: s.trailLength || 500,
                trailCircle: s.trailCircle || 1e3,
                currentTime: this.layer.getRenderer().getFrameTimestamp() || 0,
                blendSrcIsOne: +!("one" !== this.sceneConfig.blendSrc),
                cameraPosition: t.cameraPosition
            };
            return this.setIncludeUniformValues(l, e), l;
        }
    }
    class Pe extends He {
        postCreateGeometry(t) {
            const {symbolIndex: e, geometry: n} = t, {features: i} = n.properties, r = this.getSymbol(e).lineGradientProperty, o = n.data.aPickingId, a = new Uint8Array(o.length), s = [];
            let l = o[0];
            s.push(i[l].feature.properties[r]);
            for (let t = 1; t < o.length; t++) o[t] !== l && (l = o[t], s.push(i[l].feature.properties[r])), 
            a[t] = s.length - 1;
            n.data.aGradIndex = a, n.properties.gradients = s;
        }
        createMesh(t, e) {
            const {geometry: i, symbolIndex: r, ref: o} = t;
            if (void 0 === o) {
                $t(i, this.getSymbolDef(r), this.getFnTypeConfig(r));
            }
            const a = {
                tileResolution: i.properties.tileResolution,
                tileRatio: i.properties.tileRatio,
                tileExtent: i.properties.tileExtent
            }, s = this.getSymbol(r);
            this.setLineUniforms(s, a);
            const l = i.properties.gradients;
            let f = 2 * l.length;
            Ee(f) || (f = Re(f));
            const c = this.regl.texture({
                width: 256,
                height: f,
                data: Ce(l),
                format: "rgba",
                mag: "linear",
                min: "linear",
                flipY: !1
            });
            a.lineGradientTexture = c, a.lineGradientTextureHeight = c.height, void 0 === o && i.generateBuffers(this.regl);
            const h = new n.reshader.Material(a), u = new n.reshader.Mesh(i, h, {
                castShadow: !1,
                picking: !0
            });
            u.setLocalTransform(e);
            const d = {
                HAS_GRADIENT: 1
            };
            return this.setMeshDefines(d, i), u.setDefines(d), u.properties.symbolIndex = r, 
            u;
        }
        createFnTypeConfig(t, e) {
            return this.createShapeFnTypeConfigs(t, e);
        }
        createShader(t) {
            this.st = t;
            const e = [], i = {};
            this.fillIncludes(i, e, t), this.sceneConfig.trailAnimation && this.sceneConfig.trailAnimation.enable && (i.HAS_TRAIL = 1), 
            e.push({
                name: "projViewModelMatrix",
                type: "function",
                fn: function(t, e) {
                    const i = [];
                    return n.mat4.multiply(i, e.projViewMatrix, e.modelMatrix), i;
                }
            }), this.shader = new n.reshader.MeshShader({
                vert: Ie,
                frag: "#define SHADER_NAME LINE_GRADIENT\n#define DEVICE_PIXEL_RATIO 1.0\n#define MAX_LINE_COUNT 128.0\nprecision mediump float;\n#if defined(HAS_SHADOWING) && !defined(HAS_BLOOM)\n#include <vsm_shadow_frag>\n#endif\n#ifdef HAS_OPACITY\nvarying float vOpacity;\n#else\nuniform lowp float lineOpacity;\n#endif\nuniform lowp float lineBlur;\nuniform float lineGradientTextureHeight;\nuniform float tileExtent;\nuniform sampler2D lineGradientTexture;\nvarying vec2 vNormal;\nvarying vec2 vWidth;\nvarying float vGammaScale;\nvarying highp float vLinesofar;\nvarying float vGradIndex;\n#ifndef ENABLE_TILE_STENCIL\nvarying vec2 vPosition;\n#endif\n#ifdef HAS_TRAIL\nuniform float trailSpeed;\nuniform float trailLength;\nuniform float trailCircle;\nuniform float currentTime;\n#endif\nvoid main() {\n  \n#ifndef ENABLE_TILE_STENCIL\nfloat c = sign(tileExtent - min(tileExtent, abs(vPosition.x))) * sign(1. + sign(vPosition.x)) * sign(tileExtent - min(tileExtent, abs(vPosition.y))) * sign(1. + sign(vPosition.y));\n  if(c == .0) {\n    discard;\n  }\n#endif\nfloat d = length(vNormal) * vWidth.s;\n  float e = (lineBlur + 1. / DEVICE_PIXEL_RATIO) * vGammaScale;\n  float f = clamp(min(d - (vWidth.t - e), vWidth.s - d) / e, .0, 1.);\n  float h = vLinesofar;\n  vec4 i = texture2D(lineGradientTexture, vec2(h, (vGradIndex * 2. + .5) / lineGradientTextureHeight)) * f;\n  i *= max(sign(MAX_LINE_COUNT - vGradIndex), .0);\n#ifdef HAS_TRAIL\nfloat j = mod(h - currentTime * trailSpeed * .1, trailCircle);\n  float k = j < trailLength ? mix(.0, 1., j / trailLength) : .0;\n  i *= k;\n#endif\n#ifdef HAS_OPACITY\nfloat l = vOpacity;\n#else\nfloat l = lineOpacity;\n#endif\ngl_FragColor = i * l;\n#if defined(HAS_SHADOWING) && !defined(HAS_BLOOM)\nfloat m = shadow_computeShadow();\n  gl_FragColor.rgb = shadow_blend(gl_FragColor.rgb, m);\n#endif\n}",
                uniforms: e,
                defines: i,
                extraCommandProps: this.getExtraCommandProps()
            });
        }
    }
    function Ce(t) {
        t.length > 128 && (console.warn("Line count in a tile exceeds maximum limit (128) for line-gradient render plugin."), 
        t = t.slice(0, 128));
        const e = document.createElement("canvas"), n = e.getContext("2d");
        e.width = 256, e.height = 2 * t.length, Ee(e.height) || (e.height = Re(2 * t.length));
        for (let e = 0; e < t.length; e++) {
            const i = t[e], r = n.createLinearGradient(0, 0, 256, 0);
            for (let t = 0; t < i.length; t += 2) r.addColorStop(+i[t], i[t + 1]);
            n.fillStyle = r;
            const o = e % 256;
            n.fillRect(0, 2 * o, 256, 2 * o + 2);
        }
        return n.canvas;
    }
    function Ee(t) {
        return 0 == (t & t - 1) && 0 !== t;
    }
    function Re(t) {
        return Math.pow(2, Math.ceil(Math.log(t) / Math.LN2));
    }
    class De {
        constructor(t) {
            this.lt = t || [], this.properties = {};
        }
        set meshes(t) {
            this.lt = t;
        }
        get meshes() {
            return this.lt;
        }
    }
    const Ne = 224, ke = 600, Le = 100, ze = new Uint8Array(1), Fe = [], Ve = {
        collides: 0,
        boxes: []
    };
    class je extends Se {
        supportRenderMode(t) {
            return "point" === t;
        }
        startMeshCollision(t) {
            const {meshKey: e} = t.properties, {renderer: n} = this.ft, i = n.isForeground(t instanceof De ? t.meshes[0] : t);
            if (t.properties.isForeground = i, t instanceof De && t.meshes.length) for (let e = 0; e < t.meshes.length; e++) t.meshes[e].properties.isForeground = i;
            this.ct = performance.now(), this.ht = this.ut(), this.dt = this.pt(e);
        }
        endMeshCollision(t) {
            const e = this.yt.tags[t];
            if (this.ht && e && this.dt) {
                const t = this.getMap();
                e.anchor0 = t.containerPointToCoord(this.gt), e.anchor1 = t.containerPointToCoord(this.bt), 
                e.anchor0.z = t.getZoom(), e.anchor0.width = t.width, e.anchor0.height = t.height;
            }
            this.getMap().collisionFrameTime += performance.now() - this.ct;
        }
        pt(t) {
            const e = this.getMap(), n = e.getZoom(), [i, r] = this._t(t);
            return !i || !r || i.z !== n || i.width !== e.width || i.height !== e.height || i.distanceTo(this.gt) > 2 || r.distanceTo(this.bt) > 2;
        }
        At() {
            const t = this.getMap();
            this.xt = {}, this.gt = new o.Point(t.width / 2, t.height / 3), this.bt = new o.Point(t.width / 2, 2 * t.height / 3), 
            delete this.ht, this.yt || (this.yt = {
                tags: {}
            }), this.ft = {
                layer: this.layer,
                renderer: this.layer.getRenderer(),
                frameTimestamp: this.layer.getRenderer().getFrameTimestamp(),
                map: this.getMap(),
                zoom: t.getZoom(),
                collisionTags: this.yt.tags,
                isEnableUniquePlacement: this.isEnableUniquePlacement()
            };
        }
        St() {
            this.wt = !1 !== this.sceneConfig.collision;
        }
        Mt(t, e) {
            const n = this.yt;
            return n.tags[t] && n.tags[t][e];
        }
        Tt(t, e, n) {
            const i = this.yt;
            i.tags[t] = i.tags[t] || [], i.tags[t][e] = n;
        }
        ut() {
            const t = this.getMap();
            if (!t.isInteracting()) return !0;
            const e = this.layer.options.collisionFrameLimit;
            return t.collisionFrameTime <= e;
        }
        _t(t) {
            const e = "__meshAnchorKey".trim(), n = this.yt.tags[t];
            if (n && n.anchor0) {
                const {anchor0: t, anchor1: i} = n, r = t[e] = t[e] || t.x + "," + t.y, o = i[e] = i[e] || i.x + "," + i.y;
                let a = this.xt[r], s = this.xt[o];
                if (!a || !s) {
                    const e = this.getMap();
                    a = this.xt[r] = e.coordToContainerPoint(t), s = this.xt[o] = e.coordToContainerPoint(i);
                }
                return a.z = t.z, Fe[0] = a, Fe[1] = s, a.width = t.width, a.height = t.height, 
                Fe;
            }
            return Fe[0] = Fe[1] = null, Fe;
        }
        updateBoxCollisionFading(t, e, n, i, r) {
            const {layer: o, renderer: a, zoom: s, collisionTags: l, isEnableUniquePlacement: f} = this.ft, {meshKey: c, isForeground: h} = e.properties;
            if (f && this.Ot(c, r)) return !1;
            const u = n.length;
            let d = l[c] && l[c][r];
            const m = d, v = this.It && d;
            if (!(v && 0 !== d.collides) && t) {
                const t = v && 0 === d.collides;
                if (this.ht || t) if ((this.dt || d && d.z !== s) && (d = null), d) {
                    if (d.boxes && d.boxes.length) {
                        const {boxes: t, isAllowOverlap: e} = d;
                        let n = 0;
                        if (!e) {
                            let e = 0;
                            for (let i = 0; i < t.length; i++) if (!n) {
                                const r = this.isCollides(t[i]);
                                if (-1 === r) e++; else if (1 === r) {
                                    n = 1;
                                    break;
                                }
                            }
                            e === t.length && (n = -1);
                        }
                        d.collides = n;
                    }
                } else {
                    d = m || {
                        collides: 0,
                        boxes: []
                    }, d.boxes.length = 0, d.z = s;
                    let t = 0;
                    for (let e = 0; e < u; e++) {
                        const {mesh: o, allElements: a, boxCount: s, start: l, end: f} = n[e], c = this.Ht(o, a, s, l, f, i, r);
                        c.isAllowOverlap && (d.isAllowOverlap = 1), 0 === t && (t = c.collides), c.boxes && d.boxes.push(...c.boxes);
                    }
                    d.collides = t, this.Tt(c, r, d);
                }
            }
            let p = t && d && 0 === d.collides, y = 1, g = !1;
            if (this.sceneConfig.fading) {
                const t = this.Pt(e);
                if (this.Ct) t[r] = p ? 1 : -1; else if (h && delete e.Et, y = this.Rt(h, p, t, r), 
                h ? (y > 0 && (p = !0), g = this.isBoxFading(e, r), g && this.setToRedraw()) : p || (this.Dt(t, r), 
                y = 0), p) {
                    const n = e.Et;
                    if (n && 1 === y && t[r] > 0) {
                        let {fadeOutDelay: t, fadingDuration: e} = this.sceneConfig;
                        zt(e) && (e = Ne), zt(t) && (t = Le);
                        const i = kt(1 - (a.getFrameTimestamp() - n - t) / e, 0, 1);
                        y *= i, i > 0 && this.setToRedraw();
                    }
                }
            }
            if (d && o.options.debugCollision && this.addCollisionDebugBox(d.boxes, d.collides ? 0 : 1), 
            p || g) {
                const {mesh: t, start: e} = n[0], i = this.getSymbol(t.properties.symbolIndex);
                !this.Nt(i, t, e) && d && d.boxes && this.kt(d.boxes, t);
            }
            if (p) {
                const t = ze[0] = 255 * y;
                for (let e = 0; e < u; e++) {
                    const {mesh: i, allElements: r, start: o, end: a, boxIndex: s} = n[e];
                    this.setCollisionOpacity(i, r, t, o, a, s);
                }
            }
            return p && y > 0;
        }
        isMeshIterable() {
            return !0;
        }
        setCollisionOpacity(t, e, n, i, r) {
            const o = e[i], a = e[r - 1];
            this.Lt(t, n, o, a);
        }
        Lt(t, e, n, i) {
            const {aOpacity: r} = t.geometry.properties;
            if (!r) return;
            const o = n;
            if (r[o] !== e) {
                const t = i;
                for (let n = o; n <= t; n++) r[n] = e;
                r.dirty = !0;
            }
        }
        isBoxFading(t, e) {
            const {frameTimestamp: n} = this.ft;
            let i = this.sceneConfig.fadingDuration;
            zt(i) && (i = Ne);
            return n - Math.abs(this.Pt(t)[e]) < i;
        }
        Ht(t, e, n, i, r, o, a) {
            const s = this.getSymbol(t.properties.symbolIndex), l = this.Nt(s, t, e[i]), f = this.zt(s, t, e[i]);
            if (!1 === this.sceneConfig.collision || l && f) return Ve;
            const c = this.isBoxCollides(t, e, n, i, r, o, a);
            return f && (c.collides = 0, c.isAllowOverlap = 1), c;
        }
        Nt(t, e, n) {
            if (!1 === this.sceneConfig.collision) return !0;
            const i = e.geometry.properties.aOverlap;
            if (!i) return 1 == +t[this.propIgnorePlacement];
            const r = i[n], o = r % 8;
            return r < 2 ? 1 == +t[this.propIgnorePlacement] : o % 2;
        }
        zt(t, e, n) {
            if (!1 === this.sceneConfig.collision) return !0;
            const i = e.geometry.properties.aOverlap;
            if (!i) return 1 == +t[this.propAllowOverlap];
            const r = i[n], o = r >> 2;
            return r < 2 ? 1 == +t[this.propAllowOverlap] : o % 2;
        }
        kt(t) {
            if (Array.isArray(t[0])) for (let e = 0; e < t.length; e++) this.insertCollisionBox(t[e]); else this.insertCollisionBox(t);
        }
        Rt(t, e, n, i) {
            let {fadingDuration: r, fadeInDelay: o, fadeOutDelay: a} = this.sceneConfig;
            zt(r) && (r = Ne), zt(o) && (o = ke), zt(a) && (a = Le);
            const {frameTimestamp: s} = this.ft;
            let l = n[i], f = e ? 1 : 0;
            if (!l) return e && t && (n[i] = s + o), 0;
            if (s < Math.abs(l) && (!e && l > 0 || e && l < 0)) {
                const t = s - r;
                n[i] = l = e ? t : -t;
            }
            return s - Math.abs(l) < r ? f = l > 0 ? (s - l) / r : 1 - (s + l) / r : e ? (l < 0 && (n[i] = l = s + o), 
            f = (s - l) / r) : (l > 0 && (n[i] = l = -(s + a)), f = 1 - (s + l) / r), (f < 0 || f > 1) && (f = kt(f, 0, 1)), 
            f;
        }
        Pt(t) {
            this.Ft || (this.Ft = {});
            const {meshKey: e} = t.properties;
            if (!this.Ft[e]) {
                const {frameTimestamp: t} = this.ft;
                this.Ft[e] = {
                    timestamp: t
                };
            }
            return this.Ft[e];
        }
        Vt(t) {
            if (!this.jt) return void (this.jt = t);
            const e = this.scene.getMeshes();
            if (e && e.length) {
                for (let n = 0; n < e.length; n++) {
                    const i = this.Pt(e[n]);
                    i.timestamp < this.jt ? delete e[n]._fading_timestamps : i.timestamp = t;
                }
                this.jt = t;
            }
        }
        Dt(t, e) {
            if (!t) return;
            const {frameTimestamp: n} = this.ft;
            let {fadingDuration: i} = this.sceneConfig;
            zt(i) && (i = Ne), t[e] = -(n - i - 1);
        }
        deleteMesh(t, e) {
            if (t) {
                if (Array.isArray(t)) for (let e = 0; e < t.length; e++) {
                    const n = t[e].properties.meshKey;
                    this.yt && delete this.yt.tags[n], this.Ft && delete this.Ft[n];
                } else {
                    const e = t.properties.meshKey;
                    this.yt && delete this.yt.tags[e], this.Ft && delete this.Ft[e];
                }
                super.deleteMesh(t, e);
            }
        }
        delete(t) {
            this.Gt && (this.Gt.geometry.dispose(), this.Ut.dispose(), this.Gt.dispose(), delete this.Gt, 
            delete this.Ut, delete this.Wt), delete this.yt, super.delete(t);
        }
        isCollides(t) {
            const e = this.layer;
            if (e.getMap().isOffscreen(t)) return -1;
            return +e.getCollisionIndex().collides(t);
        }
        insertCollisionBox(t) {
            this.layer.getCollisionIndex().insertBox(t);
        }
        addCollisionDebugBox(t, e) {
            if (t && t.length) if (Array.isArray(t[0])) for (let n = 0; n < t.length; n++) {
                const i = t[n];
                this.Bt(i, e);
            } else this.Bt(t, e);
        }
        Bt(t, e) {
            if (!t) return;
            const n = this.Xt = this.Xt || {
                aPosition: [],
                aVisible: [],
                indices: []
            };
            if (this.getMap().isOffscreen(t)) return;
            const i = n.aPosition.length / 2;
            n.aPosition.push(t[0], t[1], t[2], t[1], t[2], t[3], t[0], t[3]), n.aVisible.push(e, e, e, e), 
            n.indices.push(i, i + 1, i + 1, i + 2, i + 2, i + 3, i + 3, i);
        }
        Yt() {
            return !1 !== this.sceneConfig.collision || this.wt;
        }
        updateCollision(t) {
            super.updateCollision(t), this.At(), this.Kt(), this.qt && this.qt.length && (this.Jt(), 
            this.qt && (this.setToRedraw(), this.scene.addMesh(this.qt)));
            (this.getMap().isZooming() || this.qt && this.qt.length) && (this.Zt(), this.$t(this.scene.getMeshes()));
        }
        paint(t) {
            const e = super.paint(t);
            return this.Qt(t), !1 === this.ht && this.setToRedraw(), e;
        }
        callShader(t, e) {
            this.callCurrentTileShader(t, e), this.shouldIgnoreBackground() || this.callBackgroundTileShader(t, e);
        }
        shouldIgnoreBackground() {
            return !this.getMap().isZooming() && !this.qt;
        }
        Kt() {
            const t = this.getMap(), e = t.isZooming();
            if (!e && this.It) {
                const t = this.layer.getRenderer();
                this.qt = this.scene.getMeshes().filter(e => !t.isForeground(e) && !e.properties.isLinePlacement);
            } else e && !this.It && (this.te = t.getResolution());
            if (e) this.ee && (clearTimeout(this.ee), delete this.Ct, delete this.ee), this.Ct = this.te && t.getResolution() > this.te; else if (this.It && !this.ee) {
                let {fadeOutDelay: t, fadingDuration: e} = this.sceneConfig;
                zt(t) && (t = Le), zt(e) && (e = Ne), this.ee = setTimeout(() => {
                    delete this.Ct, delete this.ee;
                }, t + e + 1);
            }
            this.It = e;
        }
        Qt(t) {
            if (!this.Xt || !this.layer.options.debugCollision) return;
            this.Wt || this.ne();
            const {aPosition: e, aVisible: i, indices: r} = this.Xt;
            if (!this.Gt) {
                const t = new n.reshader.Geometry({
                    aPosition: [],
                    aVisible: []
                }, [], 0, {
                    positionSize: 2,
                    primitive: "lines"
                });
                this.Gt = new n.reshader.Mesh(t), this.ie = new n.reshader.Scene, this.ie.addMesh(this.Gt);
            }
            const o = this.Gt.geometry;
            o.updateData("aPosition", new Float32Array(e)), o.updateData("aVisible", new Uint8Array(i)), 
            o.setElements(r), this.Wt.render(this.Ut, {
                size: [ this.canvas.width, this.canvas.height ]
            }, this.ie, this.getRenderFBO(t)), delete this.Xt;
        }
        ne() {
            const t = this.regl;
            this.Wt = new n.reshader.Renderer(t);
            const e = this.canvas, i = {
                x: 0,
                y: 0,
                width: () => e ? e.width : 1,
                height: () => e ? e.height : 1
            };
            this.Ut = new n.reshader.MeshShader({
                vert: "attribute vec2 aPosition;\nattribute float aVisible;\nuniform vec2 size;\nvarying vec4 vColor;\nvoid main() {\n  vec2 c = (aPosition / size - .5) * 2. * vec2(1., -1.);\n  gl_Position = vec4(c, .0, 1.);\n  vColor = mix(vec4(1., .0, .0, 1.5) * .5, vec4(.0, 1., .0, 1.) * .4, aVisible);\n}",
                frag: "precision mediump float;\nvarying vec4 vColor;\nvoid main() {\n  gl_FragColor = vec4(vColor.rgb, .5);\n}",
                uniforms: [ "size" ],
                extraCommandProps: {
                    viewport: i,
                    depth: {
                        enable: !1
                    },
                    blend: {
                        enable: !0,
                        func: {
                            src: "src alpha",
                            dst: "one minus src alpha"
                        },
                        equation: "add"
                    }
                }
            });
        }
        Jt() {
            let {fadeOutDelay: t, fadingDuration: e} = this.sceneConfig;
            zt(t) && (t = Le), zt(e) && (e = Ne);
            const n = this.layer.getRenderer(), i = n.getCurrentTileZoom(), r = n.getFrameTimestamp(), o = [];
            for (let a = 0; a < this.qt.length; a++) {
                const s = this.qt[a], l = s.properties.tile;
                !s.Et && n.isBackTile(l.id) && (s.Et = r);
                const f = l.z - i > 0 ? 2 * (l.z - i) - 1 : 2 * (i - l.z);
                s.properties.level = f, s.setUniform("level", f), n.isForeground(s) || s.Et && r - s.Et > t + e ? delete s.Et : o.push(s);
            }
            delete this.qt, o.length && (this.qt = o);
        }
        isEnableCollision() {
            return this.layer.options.collision && !1 !== this.sceneConfig.collision;
        }
        isEnableUniquePlacement() {
            return this.isEnableCollision() && this.sceneConfig.uniquePlacement;
        }
        isMeshUniquePlaced(t) {
            return this.isMeshIterable(t);
        }
        Zt() {
            if (!this.isEnableUniquePlacement()) return;
            const t = this.scene.getMeshes(), e = (t, e, n, i) => {
                const {start: r, end: o} = e[0], a = t.geometry.properties, s = a.elements;
                let l = a.uniquePlacements;
                if (l || (l = a.uniquePlacements = []), void 0 === l[i]) {
                    const e = this.getUniqueEntryKey(t, s[r], i);
                    l[i] = e ? {
                        key: e,
                        index: i,
                        start: s[r],
                        end: s[o - 1]
                    } : null;
                }
            };
            for (let n = 0; n < t.length; n++) {
                const i = t[n];
                this.isMeshUniquePlaced(i) && this.forEachBox(i, e);
            }
        }
        $t(t) {
            if (!this.isEnableUniquePlacement()) return;
            const e = this.getMap().getZoom();
            let n = !this.re || this.oe !== e;
            if (!n) for (let e = 0; e < t.length; e++) if (!this.re[t[e].properties.meshKey]) {
                n = !0;
                break;
            }
            if (!n) return;
            this.oe = e, this.ae = {}, this.re = {}, t = t.sort(Ue);
            const i = this.getMap().getGLScale(), r = {};
            for (let e = 0; e < t.length; e++) {
                const n = t[e];
                if (!n.geometry) continue;
                const {meshKey: o} = n.properties;
                this.re[o] = 1;
                const {uniquePlacements: a} = n.geometry.properties;
                if (a) for (let t = 0; t < a.length; t++) {
                    if (!a[t]) continue;
                    const {key: e, index: o} = a[t], s = this.Pt(n), l = Ge(e, i), f = r[l];
                    if (f) {
                        const t = f.length, e = f[t - 3].properties.meshKey, i = f[t - 2], r = f[t - 1];
                        this.ae[e] = this.ae[e] || {}, this.ae[e][r] = 1, this.se(s, o, i, r), f.push(n, s, o);
                    } else r[l] = [ n, s, o ];
                }
            }
            for (const t in r) {
                const e = r[t];
                if (e.length <= 6) continue;
                const n = e.length, i = e[n - 2][e[n - 1]];
                if (e[1][e[2]] !== i) for (let t = 0; t < n - 6; t += 3) {
                    e[t + 1][e[t + 2]] = i;
                }
            }
        }
        se(t, e, n, i) {
            if (void 0 !== n[i]) if (void 0 === t[e]) t[e] = n[i]; else {
                let r = t[e];
                Math.abs(n[i]) > Math.abs(r) ? t[e] = n[i] : n[i] = t[e];
            } else void 0 !== t[e] && (n[i] = t[e]);
        }
        Ot(t, e) {
            return this.ae && this.ae[t] && this.ae[t][e];
        }
        le(t, e) {
            const {symbolIndex: n} = t.properties, i = n.type || 0;
            let r = t.properties._collidesBoxes;
            r || (r = t.properties._collidesBoxes = []);
            let o = r[n.index];
            o || (o = t.properties._collidesBoxes = []), o[i] || (o[i] = []), o = o[i];
            const a = e / 6;
            if (!o[a]) {
                const t = [];
                o[a] = {
                    boxes: t,
                    collision: {
                        boxes: t
                    }
                };
            }
            return o[a];
        }
        fe(t) {
            let e = this.ce;
            if (e || (e = this.ce = []), !e[t]) {
                e[t] = [];
                for (let n = 0; n < t; n++) e[t][n] = {};
            }
            return e[t];
        }
        he(t) {
            if (!t || !t.geometry) return !0;
            if (!t.geometry.properties.glyphAtlas || !t.material.get("isHalo") || t.geometry.data.aTextHaloRadius && t.geometry.properties.hasHalo) return !1;
            if (t.geometry.data.aTextHaloRadius && !t.geometry.properties.hasHalo) return !0;
            return !this.getSymbol(t.geometry.properties.symbolIndex).textHaloRadius;
        }
    }
    function Ge(t, e) {
        return Math.round(t[0] / e / 10) * Math.round(t[1] / e / 10) * (t[2] ? Math.round(t[2] / 10) : 1) + "-" + t[3];
    }
    function Ue(t, e) {
        const n = e.uniforms.level - t.uniforms.level;
        return 0 === n ? t.properties.meshKey - e.properties.meshKey : n;
    }
    var We = "#define SHADER_NAME MARKER\n#define RAD 0.0174532925\nattribute vec3 aPosition;\nattribute vec2 aShape;\nattribute vec2 aTexCoord;\n#ifdef ENABLE_COLLISION\nattribute float aOpacity;\n#endif\n#ifdef HAS_OPACITY\nattribute float aColorOpacity;\n#endif\n#ifdef HAS_MARKER_WIDTH\nattribute float aMarkerWidth;\n#else\nuniform float markerWidth;\n#endif\n#ifdef HAS_MARKER_HEIGHT\nattribute float aMarkerHeight;\n#else\nuniform float markerHeight;\n#endif\n#ifdef HAS_MARKER_DX\nattribute float aMarkerDx;\n#else\nuniform float markerDx;\n#endif\n#ifdef HAS_MARKER_DY\nattribute float aMarkerDy;\n#else\nuniform float markerDy;\n#endif\n#if defined(HAS_PITCH_ALIGN)\nattribute float aPitchAlign;\n#else\nuniform float pitchWithMap;\n#endif\n#if defined(HAS_ROTATION_ALIGN)\nattribute float aRotationAlign;\n#else\nuniform float rotateWithMap;\n#endif\nuniform float flipY;\n#ifdef HAS_ROTATION\nattribute float aRotation;\n#else\nuniform float markerRotation;\n#endif\n#ifdef HAS_PAD_OFFSET\nattribute float aPadOffsetX;\nattribute float aPadOffsetY;\n#endif\nuniform float cameraToCenterDistance;\nuniform mat4 projViewModelMatrix;\nuniform float markerPerspectiveRatio;\nuniform vec2 iconSize;\nuniform vec2 texSize;\nuniform vec2 canvasSize;\nuniform float mapPitch;\nuniform float mapRotation;\nuniform float zoomScale;\nuniform float tileRatio;\nuniform float layerScale;\n#ifndef PICKING_MODE\nvarying vec2 vTexCoord;\nvarying float vOpacity;\n#else\n#include <fbo_picking_vert>\n#endif\nvoid main() {\n  vec3 c = aPosition;\n#ifdef HAS_MARKER_WIDTH\nfloat d = aMarkerWidth;\n#else\nfloat d = markerWidth;\n#endif\n#ifdef HAS_MARKER_HEIGHT\nfloat e = aMarkerHeight;\n#else\nfloat e = markerHeight;\n#endif\n#ifdef HAS_MARKER_DX\nfloat f = aMarkerDx;\n#else\nfloat f = markerDx;\n#endif\n#ifdef HAS_MARKER_DY\nfloat h = aMarkerDy;\n#else\nfloat h = markerDy;\n#endif\n#if defined(HAS_PITCH_ALIGN)\nfloat i = aPitchAlign;\n#else\nfloat i = pitchWithMap;\n#endif\n#if defined(HAS_ROTATION_ALIGN)\nfloat j = aRotationAlign;\n#else\nfloat j = rotateWithMap;\n#endif\ngl_Position = projViewModelMatrix * vec4(c, 1.);\n  float k = gl_Position.w;\n  float l = (1. - cameraToCenterDistance / k) * markerPerspectiveRatio;\n  float m = clamp(.5 + .5 * (1. - l), .0, 4.);\n#ifdef HAS_ROTATION\nfloat n = aRotation / 9362. - mapRotation * j;\n#else\nfloat n = markerRotation - mapRotation * j;\n#endif\nif(i == 1.) {\n    n += mapRotation;\n  }\n  float o = sin(n);\n  float u = cos(n);\n  mat2 v = mat2(u, -1. * o, o, u);\n  vec2 A = (aShape / 10.0);\n  if(i == 1. && flipY == .0) {\n    A *= vec2(1., -1.);\n  }\n#ifdef HAS_PAD_OFFSET\nA = (A / iconSize * vec2(d, e) + vec2(aPadOffsetX - 1., aPadOffsetY)) * layerScale;\n#else\nA = A / iconSize * vec2(d, e) * layerScale;\n#endif\nA = v * A;\n  if(i == .0) {\n    vec2 B = A * 2. / canvasSize;\n    gl_Position.xy += B * m * k;\n  } else {\n    float C = k / cameraToCenterDistance;\n    vec2 B = A;\n    gl_Position = projViewModelMatrix * vec4(c + vec3(B, .0) * tileRatio / zoomScale * C * m, 1.);\n  }\n  gl_Position.xy += vec2(f, -h) * 2. / canvasSize * k;\n#ifndef PICKING_MODE\nvTexCoord = aTexCoord / texSize;\n#ifdef ENABLE_COLLISION\nvOpacity = aOpacity / 255.;\n#else\nvOpacity = 1.;\n#endif\n#ifdef HAS_OPACITY\nvOpacity *= aColorOpacity / 255.;\n#endif\n#else\n#ifdef ENABLE_COLLISION\nbool D = aOpacity == 255.;\n#else\nbool D = true;\n#endif\nfbo_picking_setData(gl_Position.w, D);\n#endif\n}";
    const Be = [];
    function Xe(t, e, i, r, o) {
        return n.vec4.set(Be, e[0], e[1], e[2], 1), n.vec4.transformMat4(Be, Be, i), t[2] = Be[3], 
        n.vec4.scale(Be, Be, 1 / Be[3]), t[0] = (Be[0] + 1) * r / 2, t[1] = (1 - Be[1]) * o / 2, 
        t;
    }
    const Ye = [], Ke = [], qe = [], Je = [], Ze = [], $e = [];
    function Qe(t, e, i, r, o, a, s, l, f, c, h, u) {
        const {tileRatio: d, tileResolution: m} = f, v = d / (m / c.getResolution()) * (h / c.cameraToCenterDistance) * u;
        n.vec2.scale(i, i, v), n.vec2.scale(r, r, v), n.vec2.scale(o, o, v), n.vec2.scale(a, a, v), 
        n.vec3.set(Ye, i[0], i[1], 0), n.vec3.set(Ke, r[0], r[1], 0), n.vec3.set(qe, o[0], o[1], 0), 
        n.vec3.set(Je, a[0], a[1], 0), n.vec3.add(Ye, Ye, e), n.vec3.add(Ke, Ke, e), n.vec3.add(qe, qe, e), 
        n.vec3.add(Je, Je, e), Xe(i, Ye, s, c.width, c.height), Xe(r, Ke, s, c.width, c.height), 
        Xe(o, qe, s, c.width, c.height), Xe(a, Je, s, c.width, c.height), n.vec2.set(Ze, Math.min(i[0], r[0], o[0], a[0]), Math.min(i[1], r[1], o[1], a[1])), 
        n.vec2.set($e, Math.max(i[0], r[0], o[0], a[0]), Math.max(i[1], r[1], o[1], a[1])), 
        n.vec4.set(t, Ze[0] + l[0], Ze[1] + l[1], $e[0] + l[0], $e[1] + l[1]);
    }
    function tn(t, e, i, r, o, a, s, l) {
        1 !== l && (n.vec2.scale(i, i, l), n.vec2.scale(r, r, l), n.vec2.scale(o, o, l), 
        n.vec2.scale(a, a, l)), n.vec2.set(Ze, Math.min(i[0], r[0], o[0], a[0]), Math.min(i[1], r[1], o[1], a[1])), 
        n.vec2.set($e, Math.max(i[0], r[0], o[0], a[0]), Math.max(i[1], r[1], o[1], a[1])), 
        n.vec4.set(t, e[0] + Ze[0] + s[0], e[1] + Ze[1] - s[1], e[0] + $e[0] + s[0], e[1] + $e[1] - s[1]);
    }
    function en(t, e, i, r, o) {
        e -= i * r, 1 === o && (e += i);
        const a = Math.sin(e), s = Math.cos(e);
        return n.mat2.set(t, s, -a, a, s);
    }
    const nn = [], rn = [], on = [], an = [], sn = [], ln = [], fn = [], cn = [], hn = [ 1, -1 ], un = [ 1, 1 ];
    function dn(t, e, i, r, o) {
        const a = e.material.uniforms, s = o.cameraToCenterDistance, l = e.geometry.properties, f = this.getSymbol(l.symbolIndex), c = e.geometry.desc.positionSize, h = l.aAnchor, u = n.vec3.set(nn, h[i * c], h[i * c + 1], 2 === c ? 0 : h[i * c + 2]);
        let d = Xe(rn, u, r, o.width, o.height);
        const m = d[2];
        let v = 1;
        if (a.markerPerspectiveRatio) {
            v = kt(.5 + .5 * (1 - (1 - s / m) * a.markerPerspectiveRatio), 0, 4);
        }
        const {aShape: p, aMarkerDx: y, aMarkerDy: g, aMarkerWidth: b, aMarkerHeight: _, aPitchAlign: A, aRotationAlign: x, aRotation: S} = l, w = y ? y[i] : f.markerDx, M = g ? g[i] : f.markerDy, T = A ? A[i] : a.pitchWithMap, O = x ? x[i] : a.rotateWithMap, I = n.vec2.set(cn, w || 0, -(M || 0));
        let H = n.vec2.set(an, p[2 * i] / 10, p[2 * i + 1] / 10), P = n.vec2.set(sn, p[2 * i + 2] / 10, p[2 * i + 3] / 10), C = n.vec2.set(ln, p[2 * i + 4] / 10, p[2 * i + 5] / 10), E = n.vec2.set(fn, p[2 * i + 6] / 10, p[2 * i + 7] / 10);
        0 === a.flipY && 1 === T && (n.vec2.multiply(H, H, hn), n.vec2.multiply(P, P, hn), 
        n.vec2.multiply(C, C, hn), n.vec2.multiply(E, E, hn));
        let R = b ? b[i] : f.markerWidth;
        zt(R) && (R = 15);
        let D = _ ? _[i] : f.markerHeight;
        zt(D) && (D = 15);
        const N = n.vec2.set(un, R / 24, D / 24);
        n.vec2.mul(H, H, N), n.vec2.mul(P, P, N), n.vec2.mul(C, C, N), n.vec2.mul(E, E, N);
        let k = S ? S[i] / 9362 : -(f.markerRotation || 0) * Math.PI / 180;
        const L = o.getBearing() * Math.PI / 180;
        if (L * O || k) {
            const t = en(on, k, L, O, T);
            H = n.vec2.transformMat2(H, H, t), P = n.vec2.transformMat2(P, P, t), C = n.vec2.transformMat2(C, C, t), 
            E = n.vec2.transformMat2(E, E, t);
        }
        return 1 === T ? Qe(t, u, H, P, C, E, r, I, a, o, m, v) : (n.vec2.multiply(H, H, hn), 
        n.vec2.multiply(P, P, hn), n.vec2.multiply(C, C, hn), n.vec2.multiply(E, E, hn), 
        tn(t, d, H, P, C, E, I, v)), t;
    }
    const mn = [], vn = [], pn = [], yn = [], gn = [], bn = [], _n = [ 1, -1 ];
    function An(t, e, i, r, o, a, s, l, f) {
        const c = r.material.uniforms, h = f.cameraToCenterDistance, u = r.geometry.properties, d = this.getSymbol(u.symbolIndex), m = "line" === d.textPlacement && !Yt(d), v = i[2];
        let p = 1;
        if (c.textPerspectiveRatio) {
            p = kt(.5 + .5 * (1 - (1 - h / v) * c.textPerspectiveRatio), 0, 4);
        }
        const {aTextDx: y, aTextDy: g, aPitchAlign: b, aRotationAlign: _, aRotation: A} = r.geometry.properties, x = y ? y[s] : d.textDx, S = g ? g[s] : d.textDy, w = b ? b[s] : c.pitchWithMap, M = _ ? _[s] : c.rotateWithMap, T = n.vec2.set(bn, x || 0, -(S || 0));
        if (m) {
            const {aOffset: r} = u;
            let o = n.vec2.set(vn, r[2 * s] / 10, r[2 * s + 1] / 10), a = n.vec2.set(pn, r[2 * s + 2] / 10, r[2 * s + 3] / 10), h = n.vec2.set(yn, r[2 * s + 4] / 10, r[2 * s + 5] / 10), d = n.vec2.set(gn, r[2 * s + 6] / 10, r[2 * s + 7] / 10);
            1 === w ? Qe(t, e, o, a, h, d, l, T, c, f, v, p) : (n.vec2.multiply(o, o, _n), n.vec2.multiply(a, a, _n), 
            n.vec2.multiply(h, h, _n), n.vec2.multiply(d, d, _n), tn(t, i, o, a, h, d, T, p));
        } else {
            const {aShape: r} = u;
            let a = n.vec2.set(vn, r[2 * s] / 10, r[2 * s + 1] / 10), h = n.vec2.set(pn, r[2 * s + 2] / 10, r[2 * s + 3] / 10), y = n.vec2.set(yn, r[2 * s + 4] / 10, r[2 * s + 5] / 10), g = n.vec2.set(gn, r[2 * s + 6] / 10, r[2 * s + 7] / 10);
            0 === c.flipY && 1 === w && (n.vec2.multiply(a, a, _n), n.vec2.multiply(h, h, _n), 
            n.vec2.multiply(y, y, _n), n.vec2.multiply(g, g, _n));
            let b = A ? -A[s] / 9362 : -(d.textRotation || 0) * Math.PI / 180;
            const _ = m ? 0 : f.getBearing() * Math.PI / 180;
            if (b || _) {
                const t = en(mn, b, _, M, w);
                a = n.vec2.transformMat2(a, a, t), h = n.vec2.transformMat2(h, h, t), y = n.vec2.transformMat2(y, y, t), 
                g = n.vec2.transformMat2(g, g, t);
            }
            const x = o / 24;
            n.vec2.scale(a, a, x), n.vec2.scale(h, h, x), n.vec2.scale(y, y, x), n.vec2.scale(g, g, x), 
            1 === w ? Qe(t, e, a, h, y, g, l, T, c, f, v, p) : tn(t, i, a, h, y, g, T, p);
        }
        return a = a || 0, t[0] -= a + 1, t[1] -= a + 1, t[2] += a + 1, t[3] += a + 1, t;
    }
    function xn(t, e, i) {
        const r = e.geometry.desc.positionSize, o = e.geometry.properties.aAnchor;
        return n.vec3.set(t, o[i * r], o[i * r + 1], 2 === r ? 0 : o[i * r + 2]);
    }
    const Sn = {
        textFill: [ 0, 0, 0, 1 ],
        textOpacity: 1,
        textPitchAlignment: 0,
        textRotationAlignment: 0,
        textHaloRadius: 0,
        textHaloFill: [ 1, 1, 1, 1 ],
        textHaloBlur: 0,
        textHaloOpacity: 1,
        textPerspectiveRatio: 0,
        textSize: 14,
        textDx: 0,
        textDy: 0,
        textRotation: 0
    };
    function wn(t, e, i, r, o, a, s, l, f) {
        const c = [];
        if (e.isDisposed() || 0 === e.data.aPosition.length) return c;
        const h = e.properties.glyphAtlas;
        if (!h) return c;
        if (0 === r.textSize || 0 === r.textOpacity) return c;
        if ($t(e, r, a), !e.properties.aAnchor) {
            Mn.call(this, e, s || f, l);
            const {aTextSize: t, aTextDx: n, aTextDy: i, aPitchAlign: r, aRotationAlign: o, aRotation: a, aOverlap: c} = e.data;
            t && (e.properties.aTextSize = e.properties[Jt + "aTextSize"] || new t.constructor(t)), 
            n && (e.properties.aTextDx = e.properties[Jt + "aTextDx"] || new n.constructor(n)), 
            i && (e.properties.aTextDy = e.properties[Jt + "aTextDy"] || new i.constructor(i)), 
            r && (e.properties.aPitchAlign = e.properties[Jt + "aPitchAlign"] || new r.constructor(r)), 
            o && (e.properties.aRotationAlign = e.properties[Jt + "aRotationAlign"] || new o.constructor(o)), 
            a && (e.properties.aRotation = e.properties[Jt + "aRotation"] || new a.constructor(a)), 
            c && (e.properties.aOverlap = e.properties[Jt + "aOverlap"] || new c.constructor(c));
        }
        const u = Me(t, h, !1), d = {
            flipY: 0,
            tileResolution: e.properties.tileResolution,
            tileRatio: e.properties.tileRatio,
            texture: u,
            texSize: [ h.width, h.height ]
        };
        Tn(e, d, o);
        let m = !1;
        o.textOpacity < 1 && (m = !0), e.properties.memorySize = e.getMemorySize(), e.generateBuffers(t, {
            excludeElementsInVAO: !0
        });
        const v = new n.reshader.Material(d, Sn), p = new n.reshader.Mesh(e, v, {
            disableVAO: !0,
            transparent: m,
            castShadow: !1,
            picking: !0
        });
        if (p.setLocalTransform(i), d.isHalo && (p.properties.isHalo = !0), s && p.setDefines({
            ENABLE_COLLISION: 1
        }), c.push(p), d.isHalo) {
            const t = {
                flipY: 0,
                tileResolution: e.properties.tileResolution,
                tileRatio: e.properties.tileRatio,
                texture: u,
                texSize: [ h.width, h.height ],
                isHalo: 0
            };
            Tn(e, t, o);
            const r = new n.reshader.Material(t, Sn), a = new n.reshader.Mesh(e, r, {
                disableVAO: !0,
                transparent: m,
                castShadow: !1,
                picking: !0
            });
            Object.defineProperty(a.properties, "textSize", {
                enumerable: !0,
                get: function() {
                    return t.textSize;
                }
            }), s && a.setDefines({
                ENABLE_COLLISION: 1
            }), a.setLocalTransform(i), c.push(a);
        }
        return c.forEach(t => {
            const n = t.defines || {};
            e.data.aTextFill && (n.HAS_TEXT_FILL = 1), e.data.aTextSize && (n.HAS_TEXT_SIZE = 1), 
            e.data.aColorOpacity && (n.HAS_OPACITY = 1), e.data.aTextHaloFill && t.material.uniforms.isHalo && (n.HAS_TEXT_HALO_FILL = 1), 
            e.data.aTextHaloRadius && t.material.uniforms.isHalo && (n.HAS_TEXT_HALO_RADIUS = 1), 
            e.data.aTextHaloOpacity && t.material.uniforms.isHalo && (n.HAS_TEXT_HALO_OPACITY = 1), 
            e.data.aTextDx && (n.HAS_TEXT_DX = 1), e.data.aTextDy && (n.HAS_TEXT_DY = 1), e.data.aPitchAlign && (n.HAS_PITCH_ALIGN = 1), 
            e.data.aRotationAlign && (n.HAS_ROTATION_ALIGN = 1), e.data.aRotation && (n.HAS_ROTATION = 1), 
            t.setDefines(n), t.properties.symbolIndex = e.properties.symbolIndex;
        }), c;
    }
    function Mn(t, e, n) {
        const i = this.getSymbol(t.properties.symbolIndex), r = "line" === i.textPlacement && !Yt(i), {aPosition: o, aShape: a} = t.data, s = o.length / t.desc.positionSize;
        if (t.properties.aPickingId = t.data.aPickingId, t.properties.aCount = t.data.aCount, 
        delete t.data.aCount, (e || r) && (t.properties.aAnchor = o, t.properties.aShape = a), 
        t.properties.visElemts || (t.properties.elements = t.elements, t.properties.visElemts = new t.elements.constructor(t.elements.length)), 
        r) {
            const {aVertical: e, aSegment: n, aGlyphOffset: i} = t.data;
            t.properties.aGlyphOffset = i, t.properties.aSegment = n, t.properties.aVertical = e, 
            delete t.data.aSegment, delete t.data.aVertical, delete t.data.aGlyphOffset, t.data.aOffset = {
                usage: "dynamic",
                data: new Int16Array(a.length)
            }, t.properties.aOffset = new Int16Array(a.length);
        }
        if (e) {
            t.data.aOpacity = {
                usage: "dynamic",
                data: new Uint8Array(s)
            }, t.properties.aOpacity = new Uint8Array(s), n && (t.properties.aOpacity.fill(255, 0), 
            t.data.aOpacity.data.fill(255, 0));
            const {aTextHaloRadius: e} = t.data;
            e && !t.properties.aTextHaloRadius && (t.properties.aTextHaloRadius = t.properties[Jt + "aTextHaloRadius"] || new e.constructor(e));
        }
    }
    function Tn(t, e, n) {
        void 0 === e.isHalo && (e.isHalo = 1), Vt(e, "textOpacity", n, "textOpacity", Sn.textOpacity), 
        Vt(e, "textFill", n, "textFill", Sn.textFill, Ut()), Vt(e, "textHaloFill", n, "textHaloFill", Sn.textHaloFill, Ut()), 
        Vt(e, "textHaloBlur", n, "textHaloBlur", Sn.textHaloBlur), Vt(e, "textHaloRadius", n, "textHaloRadius", Sn.textHaloRadius), 
        Vt(e, "textHaloOpacity", n, "textHaloOpacity", Sn.textHaloOpacity), Vt(e, "textPerspectiveRatio", n, "textPerspectiveRatio", Sn.textPerspectiveRatio, t => "line" === n.textPlacement ? 1 : t), 
        Vt(e, "rotateWithMap", n, "textRotationAlignment", Sn.textRotationAlignment, t => +("map" === t)), 
        Vt(e, "pitchWithMap", n, "textPitchAlignment", Sn.textPitchAlignment, t => +("map" === t)), 
        Vt(e, "textSize", n, "textSize", Sn.textSize), Vt(e, "textDx", n, "textDx", Sn.textDx), 
        Vt(e, "textDy", n, "textDy", Sn.textDy), Vt(e, "textRotation", n, "textRotation", Sn.textRotation, t => t * Math.PI / 180);
    }
    function On(t, e) {
        const i = t.getRenderer().canvas;
        return {
            uniforms: [ "flipY", "textSize", "textDx", "textDy", "textRotation", "cameraToCenterDistance", {
                name: "projViewModelMatrix",
                type: "function",
                fn: function(t, e) {
                    return n.mat4.multiply([], e.projViewMatrix, e.modelMatrix);
                }
            }, "textPerspectiveRatio", "texSize", "canvasSize", "glyphSize", "pitchWithMap", "mapPitch", "texture", "gammaScale", "textFill", "textOpacity", "textHaloRadius", "textHaloFill", "textHaloBlur", "textHaloOpacity", "isHalo", {
                name: "zoomScale",
                type: "function",
                fn: function(t, e) {
                    return e.tileResolution / e.resolution;
                }
            }, "rotateWithMap", "mapRotation", "tileRatio" ],
            extraCommandProps: {
                viewport: {
                    x: 0,
                    y: 0,
                    width: () => i ? i.width : 1,
                    height: () => i ? i.height : 1
                },
                stencil: {
                    enable: !1,
                    mask: 255,
                    func: {
                        cmp: "<",
                        ref: (t, e) => 2 * e.level + (e.isHalo || 0) + 1,
                        mask: 255
                    },
                    op: {
                        fail: "keep",
                        zfail: "keep",
                        zpass: "replace"
                    }
                },
                blend: {
                    enable: !0,
                    func: {
                        src: "one",
                        dst: "one minus src alpha"
                    },
                    equation: "add"
                },
                depth: {
                    enable: !0,
                    range: e.depthRange || [ 0, 1 ],
                    func: e.depthFunc || "always",
                    mask: !1
                },
                polygonOffset: {
                    enable: !0,
                    offset: this.getPolygonOffset()
                }
            }
        };
    }
    function In(t, e) {
        const n = Ct(e.textFill), i = Ct(e.textSize), r = Ct(e.textHaloFill), o = Ct(e.textHaloRadius), a = Ct(e.textHaloOpacity), s = Ct(e.textDx), l = Ct(e.textDy), f = Ct(e.textOpacity), c = Et(e.textPitchAlignment), h = Et(e.textRotationAlignment), u = Ct(e.textRotation), d = Et(e.textAllowOverlapFn), m = Et(e.textIgnorePlacement), v = {}, p = new Int16Array(1), y = new Uint16Array(1);
        return [ {
            attrName: "aTextFill",
            symbolName: "textFill",
            define: "HAS_TEXT_FILL",
            type: Uint8Array,
            width: 4,
            evaluate: (e, i, r) => {
                let o = n(t.getZoom(), e);
                return Pt(o) && (o = this.evaluateInFnTypeConfig(o, r, t, e, !0)), Array.isArray(o) || (o = v[o] = v[o] || bt(o).unitArray()), 
                o = Gt(o), o;
            }
        }, {
            attrName: "aTextSize",
            symbolName: "textSize",
            define: "HAS_TEXT_SIZE",
            type: Uint8Array,
            width: 1,
            evaluate: (e, n, r) => {
                let o = i(t.getZoom(), e) || Sn.textSize;
                return Pt(o) && (o = this.evaluateInFnTypeConfig(o, r, t, e)), p[0] = o, p[0];
            }
        }, {
            attrName: "aTextHaloFill",
            symbolName: "textHaloFill",
            define: "HAS_TEXT_HALO_FILL",
            type: Uint8Array,
            width: 4,
            evaluate: e => {
                let n = r(t.getZoom(), e);
                return Array.isArray(n) || (n = v[n] = v[n] || bt(n).array()), n = Gt(n), n;
            }
        }, {
            attrName: "aTextHaloRadius",
            symbolName: "textHaloRadius",
            define: "HAS_TEXT_HALO_RADIUS",
            type: Uint8Array,
            width: 1,
            evaluate: e => {
                const n = o(t.getZoom(), e);
                return p[0] = n, p[0];
            }
        }, {
            attrName: "aTextHaloOpacity",
            symbolName: "textHaloOpacity",
            define: "HAS_TEXT_HALO_OPACITY",
            type: Uint8Array,
            width: 1,
            evaluate: e => {
                const n = a(t.getZoom(), e);
                return p[0] = n, p[0];
            }
        }, {
            attrName: "aTextDx",
            symbolName: "textDx",
            define: "HAS_TEXT_DX",
            type: Uint8Array,
            width: 1,
            evaluate: e => {
                const n = s(t.getZoom(), e);
                return p[0] = n, p[0];
            }
        }, {
            attrName: "aTextDy",
            symbolName: "textDy",
            define: "HAS_TEXT_DY",
            type: Uint8Array,
            width: 1,
            evaluate: e => {
                const n = l(t.getZoom(), e);
                return p[0] = n, p[0];
            }
        }, {
            attrName: "aColorOpacity",
            symbolName: "textOpacity",
            define: "HAS_OPACITY",
            type: Uint8Array,
            width: 1,
            evaluate: (e, n, i) => {
                let r = f(t.getZoom(), e);
                return Pt(r) && (r = this.evaluateInFnTypeConfig(r, i, t, e)), p[0] = 255 * r, p[0];
            }
        }, {
            attrName: "aPitchAlign",
            symbolName: "textPitchAlignment",
            type: Uint8Array,
            width: 1,
            define: "HAS_PITCH_ALIGN",
            evaluate: e => +("map" === c(t.getZoom(), e))
        }, {
            attrName: "aRotationAlign",
            symbolName: "textRotationAlignment",
            type: Uint8Array,
            width: 1,
            define: "HAS_ROTATION_ALIGN",
            evaluate: e => +("map" === h(t.getZoom(), e))
        }, {
            attrName: "aRotation",
            symbolName: "textRotation",
            type: Uint16Array,
            width: 1,
            define: "HAS_ROTATION",
            evaluate: e => {
                const n = Lt(u(t.getZoom(), e), 0, 360) * Math.PI / 180;
                return y[0] = 9362 * n, y[0];
            }
        }, {
            attrName: "aOverlap",
            symbolName: "textAllowOverlap",
            type: Uint8Array,
            width: 1,
            evaluate: n => {
                let i = d(t.getZoom(), n) || 0, r = (m ? m(t.getZoom(), n) : e.textIgnorePlacement) || 0;
                return i = 1 << 3 + 4 * i, r = (m ? 2 : 0) + r, i + r;
            }
        }, {
            attrName: "aOverlap",
            symbolName: "textIgnorePlacement",
            type: Uint8Array,
            width: 1,
            evaluate: n => {
                let i = (d ? d(t.getZoom(), n) : e.textAllowOverlap) || 0, r = m(t.getZoom(), n) || 0;
                return i = (d ? 8 : 0) + 4 * i, r = 1 << 1 + r, i + r;
            }
        } ];
    }
    const Hn = [], Pn = [], Cn = [], En = [];
    function Rn(t, e, n, i, r, o, a) {
        t = 1 === t ? 1 : 0;
        const s = this.getMap(), l = e.geometry.properties, f = this.getSymbol(l.symbolIndex), c = "line" === f.textPlacement && !Yt(f), {aTextSize: h, aTextHaloRadius: u, aShape: d} = l;
        let m = h ? h[n[r]] : e.properties.textSize;
        null == m && (m = Sn.textSize);
        const v = u ? u[n[r]] : e.properties.textHaloRadius, p = xn(Cn, e, n[r]), y = Xe(En, p, a, s.width, s.height), g = i, {boxes: b, collision: _} = this.le(e, r);
        let A = 0;
        if (c || 1 === e.material.uniforms.rotateWithMap || f.textRotation) {
            let i = 0;
            for (let o = r; o < r + 6 * g; o += 6) {
                const r = b[A] = b[A] || [];
                A++;
                const l = An.call(this, r, p, y, e, m, v, n[o], a, s);
                if (!t) {
                    const e = this.isCollides(l);
                    1 === e ? t = 1 : -1 === e && i++;
                }
            }
            i === g && (t = -1);
        } else {
            let i = n[r], l = d[2 * i + 1];
            for (let f = r; f < o; f += 6) {
                const r = d[2 * n[f] + 1];
                if (l !== r || f === o - 6) {
                    const c = n[f === o - 6 ? f : f - 6], h = An.call(this, Hn, p, y, e, m, v, i, a, s), u = An.call(this, Pn, p, y, e, m, v, c, a, s), d = b[A] = b[A] || [];
                    A++, d[0] = Math.min(h[0], u[0]), d[1] = Math.min(h[1], u[1]), d[2] = Math.max(h[2], u[2]), 
                    d[3] = Math.max(h[3], u[3]), i = n[f], l = r, !t && this.isCollides(d) && (t = 1);
                }
            }
        }
        return _.collides = t, _;
    }
    function Dn(t, e) {
        const i = function(t, e) {
            const {aPickingId: n, features: i} = t.geometry.properties, r = n[e];
            return (i && i[r] && i[r].feature).label;
        }(t, e);
        return i ? function(t, e, i) {
            if (!i) return null;
            const r = t.localTransform, o = xn(Nn, t, e);
            n.vec4.set(kn, o[0], o[1], o[2], 1);
            const a = n.vec4.transformMat4(kn, kn, r);
            let s = 0;
            for (let t = 0; t < i.length; t++) s += i.charCodeAt(t);
            return [ Math.floor(a[0]), Math.floor(a[1]), Math.floor(a[2]), s ];
        }(t, e, i) : null;
    }
    const Nn = [], kn = [];
    var Ln = "#define SHADER_NAME TEXT\n#define RAD 0.0174532925\nattribute vec3 aPosition;\nattribute vec2 aShape;\nattribute vec2 aTexCoord;\n#ifdef ENABLE_COLLISION\nattribute float aOpacity;\n#endif\n#ifdef HAS_OPACITY\nattribute float aColorOpacity;\n#endif\n#ifdef HAS_TEXT_SIZE\nattribute float aTextSize;\n#else\nuniform float textSize;\n#endif\n#ifdef HAS_TEXT_DX\nattribute float aTextDx;\n#else\nuniform float textDx;\n#endif\n#ifdef HAS_TEXT_DY\nattribute float aTextDy;\n#else\nuniform float textDy;\n#endif\n#if defined(HAS_PITCH_ALIGN)\nattribute float aPitchAlign;\n#else\nuniform float pitchWithMap;\n#endif\n#if defined(HAS_ROTATION_ALIGN)\nattribute float aRotationAlign;\n#else\nuniform float rotateWithMap;\n#endif\nuniform float flipY;\n#if defined(HAS_ROTATION)\nattribute float aRotation;\n#else\nuniform float textRotation;\n#endif\nuniform float cameraToCenterDistance;\nuniform mat4 projViewModelMatrix;\nuniform float textPerspectiveRatio;\nuniform vec2 texSize;\nuniform vec2 canvasSize;\nuniform float glyphSize;\nuniform float mapPitch;\nuniform float mapRotation;\nuniform float zoomScale;\nuniform float tileRatio;\nuniform float layerScale;\n#ifndef PICKING_MODE\nvarying vec2 vTexCoord;\nvarying float vGammaScale;\nvarying float vSize;\nvarying float vOpacity;\n#ifdef HAS_TEXT_FILL\nattribute vec4 aTextFill;\nvarying vec4 vTextFill;\n#endif\n#ifdef HAS_TEXT_HALO_FILL\nattribute vec4 aTextHaloFill;\nvarying vec4 vTextHaloFill;\n#endif\n#ifdef HAS_TEXT_HALO_RADIUS\nattribute float aTextHaloRadius;\nvarying float vTextHaloRadius;\n#endif\n#ifdef HAS_TEXT_HALO_OPACITY\nattribute float aTextHaloOpacity;\nvarying float vTextHaloOpacity;\n#endif\n#else\n#include <fbo_picking_vert>\n#endif\nvoid main() {\n  vec3 c = aPosition;\n#ifdef HAS_TEXT_SIZE\nfloat d = aTextSize * layerScale;\n#else\nfloat d = textSize * layerScale;\n#endif\n#ifdef HAS_TEXT_DX\nfloat e = aTextDx;\n#else\nfloat e = textDx;\n#endif\n#ifdef HAS_TEXT_DY\nfloat f = aTextDy;\n#else\nfloat f = textDy;\n#endif\n#if defined(HAS_PITCH_ALIGN)\nfloat h = aPitchAlign;\n#else\nfloat h = pitchWithMap;\n#endif\n#if defined(HAS_ROTATION_ALIGN)\nfloat i = aRotationAlign;\n#else\nfloat i = rotateWithMap;\n#endif\nvec2 j = aShape / 10.0;\n  if(h == 1. && flipY == .0) {\n    j = j * vec2(1., -1.);\n  }\n  vec2 k = aTexCoord;\n  gl_Position = projViewModelMatrix * vec4(c, 1.);\n  float l = gl_Position.w;\n  float m = (1. - cameraToCenterDistance / l) * textPerspectiveRatio;\n  float n = clamp(.5 + .5 * (1. - m), .0, 4.);\n#ifdef HAS_ROTATION\nfloat o = aRotation / 9362. - mapRotation * i;\n#else\nfloat o = textRotation - mapRotation * i;\n#endif\nif(h == 1.) {\n    o += mapRotation;\n  }\n  float u = sin(o);\n  float v = cos(o);\n  mat2 A = mat2(v, -1. * u, u, v);\n  j = A * (j / glyphSize * d);\n  float B = l / cameraToCenterDistance;\n  if(h == .0) {\n    vec2 C = j * 2. / canvasSize;\n    gl_Position.xy += C * n * l;\n  } else {\n    vec2 C = j;\n    gl_Position = projViewModelMatrix * vec4(c + vec3(C, .0) * tileRatio / zoomScale * B * n, 1.);\n  }\n  gl_Position.xy += vec2(e, -f) * 2. / canvasSize * l;\n#ifndef PICKING_MODE\nif(h == .0) {\n    vGammaScale = mix(1., B, textPerspectiveRatio);\n  } else {\n    vGammaScale = B + mapPitch / 4.;\n  }\n  vTexCoord = k / texSize;\n  vGammaScale = clamp(vGammaScale, .0, 1.);\n  vSize = d;\n#ifdef ENABLE_COLLISION\nvOpacity = aOpacity / 255.;\n#else\nvOpacity = 1.;\n#endif\n#ifdef HAS_OPACITY\nvOpacity *= aColorOpacity / 255.;\n#endif\n#ifdef HAS_TEXT_FILL\nvTextFill = aTextFill / 255.;\n#endif\n#ifdef HAS_TEXT_HALO_FILL\nvTextHaloFill = aTextHaloFill / 255.;\n#endif\n#ifdef HAS_TEXT_HALO_RADIUS\nvTextHaloRadius = aTextHaloRadius;\n#endif\n#ifdef HAS_TEXT_HALO_OPACITY\nvTextHaloOpacity = aTextHaloOpacity;\n#endif\n#else\n#ifdef ENABLE_COLLISION\nbool D = aOpacity == 255.;\n#else\nbool D = true;\n#endif\nfbo_picking_setData(gl_Position.w, D);\n#endif\n}", zn = "#define SHADER_NAME TEXT\n#define SDF_PX 8.0\n#define DEVICE_PIXEL_RATIO 1.0\n#define EDGE_GAMMA 0.105 / DEVICE_PIXEL_RATIO\nprecision mediump float;\nuniform sampler2D texture;\nuniform float textOpacity;\nuniform highp float gammaScale;\nuniform int isHalo;\nuniform highp float textHaloBlur;\n#ifdef HAS_TEXT_HALO_OPACITY\nvarying float vTextHaloOpacity;\n#else\nuniform float textHaloOpacity;\n#endif\nvarying vec2 vTexCoord;\nvarying float vSize;\nvarying float vGammaScale;\nvarying float vOpacity;\n#ifdef HAS_TEXT_FILL\nvarying vec4 vTextFill;\n#else\nuniform vec4 textFill;\n#endif\n#ifdef HAS_TEXT_HALO_FILL\nvarying vec4 vTextHaloFill;\n#else\nuniform vec4 textHaloFill;\n#endif\n#ifdef HAS_TEXT_HALO_RADIUS\nvarying float vTextHaloRadius;\n#else\nuniform highp float textHaloRadius;\n#endif\nvoid main() {\n  \n#ifdef HAS_TEXT_FILL\nvec4 c = vTextFill;\n#else\nvec4 c = textFill;\n#endif\nfloat d = vSize / 24.;\n  lowp vec4 e = c;\n  highp float f = EDGE_GAMMA / (d * gammaScale);\n  lowp float h = 185. / 256.;\n  if(isHalo == 1) {\n    \n#ifdef HAS_TEXT_HALO_FILL\nvec4 i = vTextHaloFill;\n#else\nvec4 i = textHaloFill;\n#endif\n#ifdef HAS_TEXT_HALO_RADIUS\nfloat j = vTextHaloRadius;\n#else\nfloat j = textHaloRadius;\n#endif\ne = i;\n    f = (textHaloBlur * 1.19 / SDF_PX + EDGE_GAMMA) / (d * gammaScale);\n    h = (6. - j / d) / SDF_PX;\n#ifdef HAS_TEXT_HALO_OPACITY\nfloat k = vTextHaloOpacity / 255.;\n#else\nfloat k = textHaloOpacity;\n#endif\ne *= k * 1.25;\n  }\n  float l = texture2D(texture, vTexCoord).a;\n  highp float m = f * vGammaScale * .7;\n  float n = clamp(smoothstep(h - m, h + m, l), .0, 1.);\n  gl_FragColor = e * (n * textOpacity * vOpacity);\n}";
    const Fn = new Uint16Array(1), Vn = new Int8Array(1);
    function jn(t, e, n) {
        $t(t, e, n), function(t) {
            const {aMarkerWidth: e, aMarkerHeight: n, aMarkerDx: i, aMarkerDy: r, aPitchAlign: o, aRotationAlign: a, aRotation: s, aOverlap: l} = t.data;
            e && (t.properties.aMarkerWidth = t.properties[Jt + "aMarkerWidth"] || new e.constructor(e));
            n && (t.properties.aMarkerHeight = t.properties[Jt + "aMarkerHeight"] || new n.constructor(n));
            i && (t.properties.aMarkerDx = t.properties[Jt + "aMarkerDx"] || new i.constructor(i));
            r && (t.properties.aMarkerDy = t.properties[Jt + "aMarkerDy"] || new r.constructor(r));
            o && (t.properties.aPitchAlign = t.properties[Jt + "aPitchAlign"] || new o.constructor(o));
            a && (t.properties.aRotationAlign = t.properties[Jt + "aRotationAlign"] || new a.constructor(a));
            s && (t.properties.aRotation = t.properties[Jt + "aRotation"] || new s.constructor(s));
            l && (t.properties.aOverlap = t.properties[Jt + "aOverlap"] || new l.constructor(l));
        }(t);
    }
    function Gn(t, e) {
        const n = Ct(e.markerWidth), i = Ct(e.markerHeight), r = Ct(e.markerDx), o = Ct(e.markerDy), a = Ct(e.markerOpacity), s = Ct(e.markerTextFit), l = Et(e.markerPitchAlignment), f = Et(e.markerRotationAlignment), c = Ct(e.markerRotation), h = Et(e.markerAllowOverlapFn), u = Et(e.markerIgnorePlacement), d = new Int16Array(1), m = new Uint16Array(1);
        return [ {
            attrName: "aMarkerWidth",
            symbolName: "markerWidth",
            type: Uint8Array,
            width: 1,
            define: "HAS_MARKER_WIDTH",
            evaluate: (i, r, o) => {
                const a = e.markerTextFit, l = s ? s(t.getZoom(), i) : a;
                if ("both" === l || "width" === l) return r;
                let f = n(t.getZoom(), i);
                return Pt(f) && (f = this.evaluateInFnTypeConfig(f, o, t, i)), d[0] = f, d[0];
            }
        }, {
            attrName: "aMarkerHeight",
            symbolName: "markerHeight",
            type: Uint8Array,
            width: 1,
            define: "HAS_MARKER_HEIGHT",
            evaluate: (n, r, o) => {
                const a = e.markerTextFit, l = s ? s(t.getZoom(), n) : a;
                if ("both" === l || "height" === l) return r;
                let f = i(t.getZoom(), n);
                return Pt(f) && (f = this.evaluateInFnTypeConfig(f, o, t, n)), d[0] = f, d[0];
            }
        }, {
            attrName: "aMarkerDx",
            symbolName: "markerDx",
            type: Uint8Array,
            width: 1,
            define: "HAS_MARKER_DX",
            evaluate: e => {
                const n = r(t.getZoom(), e);
                return d[0] = n, d[0];
            }
        }, {
            attrName: "aMarkerDy",
            symbolName: "markerDy",
            type: Uint8Array,
            width: 1,
            define: "HAS_MARKER_DY",
            evaluate: e => {
                const n = o(t.getZoom(), e);
                return d[0] = n, d[0];
            }
        }, {
            attrName: "aColorOpacity",
            symbolName: "markerOpacity",
            type: Uint8Array,
            width: 1,
            define: "HAS_OPACITY",
            evaluate: (e, n, i) => {
                let r = a(t.getZoom(), e);
                return Pt(r) && (r = this.evaluateInFnTypeConfig(r, i, t, e)), d[0] = 255 * r, d[0];
            }
        }, {
            attrName: "aPitchAlign",
            symbolName: "markerPitchAlignment",
            type: Uint8Array,
            width: 1,
            define: "HAS_PITCH_ALIGN",
            evaluate: e => +("map" === l(t.getZoom(), e))
        }, {
            attrName: "aRotationAlign",
            symbolName: "markerRotationAlignment",
            type: Uint8Array,
            width: 1,
            define: "HAS_ROTATION_ALIGN",
            evaluate: e => +("map" === f(t.getZoom(), e))
        }, {
            attrName: "aRotation",
            symbolName: "markerRotation",
            type: Uint16Array,
            width: 1,
            define: "HAS_ROTATION",
            evaluate: e => {
                const n = Lt(c(t.getZoom(), e), 0, 360) * Math.PI / 180;
                return m[0] = 9362 * n, m[0];
            }
        }, {
            attrName: "aOverlap",
            symbolName: "markerAllowOverlap",
            type: Uint8Array,
            width: 1,
            evaluate: n => {
                let i = h(t.getZoom(), n) || 0, r = (u ? u(t.getZoom(), n) : e.markerIgnorePlacement) || 0;
                return i = 1 << 3 + 4 * i, r = (u ? 2 : 0) + r, i + r;
            }
        }, {
            attrName: "aOverlap",
            symbolName: "markerIgnorePlacement",
            type: Uint8Array,
            width: 1,
            evaluate: n => {
                let i = (h ? h(t.getZoom(), n) : e.markerAllowOverlap) || 0, r = u(t.getZoom(), n) || 0;
                return i = (h ? 8 : 0) + 4 * i, r = 2 + r, i + r;
            }
        } ];
    }
    function Un(t, e, n, i) {
        if (!n || !i || "none" === i) return;
        const r = function(t, e, n) {
            let i = t.properties.textFitFn;
            Pt(n) && (i = t.properties.textFitFn = Et(n));
            const r = "none" !== n, o = [], a = t.getElements(), s = t.data.aPickingId;
            let l, f, c;
            e && (l = e.getElements(), f = e.data.aPickingId, c = e.data.aCount);
            const h = t.properties.features;
            let u;
            if (e) {
                let t = l[0];
                u = {
                    pickingId: f[t],
                    start: 0,
                    end: 6 * c[t]
                };
            }
            let d = !1, m = !1, v = 0;
            const p = [];
            for (let t = 0; t < a.length; t += 6) {
                const e = a[t], y = s[e];
                if (!d && u) for (;u.pickingId < y && u.end < l.length; ) {
                    const t = u.end, e = l[t];
                    u.start = t, u.end = t + 6 * c[e], u.pickingId = f[e];
                }
                if (!d && u && u.pickingId < y && (d = !0, !r)) {
                    if (!m) return [];
                    for (let e = t; e < a.length; e += 6) o[v++] = [ -1, -1 ];
                    return o;
                }
                const g = h[y] && h[y].feature, b = g && g.properties || {};
                b.$layer = g && g.layer, b.$type = g && g.type;
                const _ = i ? i(null, b) : n;
                if (delete b.$layer, delete b.$type, u && y === u.pickingId) {
                    o[v++] = [ u.start, u.end ];
                    const t = u.end, e = l[t];
                    u.start = t, u.end = t + 6 * c[e], u.pickingId = f[e], m = !0;
                } else if (_ && "none" !== _) for (let e = t; e < t + 6; e++) p.push(e); else o[v++] = [ -1, -1 ];
            }
            if (p.length) if (p.length === a.length) t.setElements([]); else {
                const e = [];
                let n = 0, i = p[n];
                for (let t = 0; t < a.length; t++) t < i ? e.push(a[t]) : t === i && (n++, i = p[n]);
                t.setElements(new a.constructor(e));
            }
            if (!m) return [];
            return o;
        }(e, n, i);
        if (!e.getElements().length) return;
        if (!r.length) return;
        e.properties.labelIndex = r;
        if (r.length && i && "none" !== i && n) {
            const i = function(t, e) {
                const n = [], i = t.properties.labelIndex, {aShape: r} = e.data;
                let o = !1;
                for (let t = 0; t < i.length; t++) {
                    const [a, s] = i[t];
                    if (-1 === a) n.push(0, 0, 0, 0); else {
                        o = !0;
                        let t = 1 / 0, i = 1 / 0, l = -1 / 0, f = -1 / 0;
                        const c = e.elements;
                        for (let e = a; e < s; e++) {
                            const n = c[e], o = r[2 * n], a = r[2 * n + 1];
                            o < t && (t = o), o > l && (l = o), a < i && (i = a), a > f && (f = a);
                        }
                        n.push(t, i, l, f);
                    }
                }
                if (!o) return [];
                return n;
            }(e, n);
            i.length && (e.properties.labelShape = i, Wn.call(this, t, e, n));
        }
    }
    function Wn(t, e) {
        const n = this.getSymbolDef(e.properties.symbolIndex), i = n.markerTextFit, r = e.properties;
        let o = "both" === i || "width" === i, a = "both" === i || "height" === i;
        if (Pt(n.markerTextFit)) {
            let t = e.properties.textFitFn;
            t || (t = e.properties.textFitFn = Ct(n.markerTextFit));
            const {features: i} = e.properties, s = e.properties.elements || e.elements, {aPickingId: l} = e.data, f = [], c = [];
            let h = !0;
            for (let e = 0; e < s.length; e += 6) {
                const n = i[l[s[e]]], r = n && n.feature || {}, o = r.properties || {};
                o.$layer = r.layer, o.$type = r.type;
                let a = t(null, o);
                if (Pt(a)) {
                    a = (o.textFitFn = o.textFitFn || Ct(a))(null, o);
                }
                delete o.$layer, delete o.$type, "both" === a ? (f.push(e / 6), c.push(e / 6)) : "width" === a ? (h = !1, 
                f.push(e / 6)) : "height" === a && (h = !1, c.push(e / 6));
            }
            h ? (r.fitIcons = f, o = !0, a = !0) : (f.length && (r.fitWidthIcons = f, o = !0), 
            c.length && (r.fitHeightIcons = c, a = !0));
        }
        r.aPickingId || (r.aPickingId = new e.data.aPickingId.constructor(e.data.aPickingId));
        const {aMarkerWidth: s, aMarkerHeight: l, aPickingId: f} = r, c = f.length;
        if (o) if (s) {
            const t = e.data.aMarkerWidth;
            e.data.aMarkerWidth = new Uint16Array(t), r.aMarkerWidth = new Uint16Array(t), r[Jt + "aMarkerWidth"] && (r[Jt + "aMarkerWidth"] = r.aMarkerWidth);
        } else {
            const t = this.getSymbol(e.properties.symbolIndex).markerWidth || 0;
            r.aMarkerWidth = new Uint16Array(c), r.aMarkerWidth.fill(t), t && (r.aMarkerWidth.dirty = !0), 
            e.data.aMarkerWidth = new Uint16Array(c);
        }
        if (a) if (l) {
            const t = e.data.aMarkerHeight;
            e.data.aMarkerHeight = new Uint16Array(t), r.aMarkerHeight = new Uint16Array(t), 
            r[Jt + "aMarkerHeight"] && (r[Jt + "aMarkerHeight"] = r.aMarkerHeight);
        } else {
            const t = this.getSymbol(e.properties.symbolIndex).markerHeight || 0;
            r.aMarkerHeight = new Uint16Array(c), r.aMarkerHeight.fill(t), t && (r.aMarkerHeight.dirty = !0), 
            e.data.aMarkerHeight = new Uint16Array(c);
        }
        const h = this.getSymbolDef(e.properties.textGeo.properties.symbolIndex), u = Ct(h.textSize);
        Bn.call(this, t, e), (!Pt(h.textSize) || u.isZoomConstant && u.isFeatureConstant) && (r.isFitConstant = !0);
    }
    function Bn(t, e) {
        const n = e.properties.textGeo;
        if (!n) return;
        const i = n.properties, r = e.properties;
        if (r.isFitConstant || !r.labelShape || !r.labelShape.length) return;
        const o = this.getSymbolDef(e.properties.symbolIndex), a = this.getSymbolDef(n.properties.symbolIndex).textSize;
        let s;
        Pt(a) && (s = i.ue ? i.ue : i.ue = Ct(a));
        const l = o.markerTextFitPadding || [ 0, 0, 0, 0 ];
        let f;
        Pt(l) && (f = r.de ? r.de : r.de = Et(l));
        const c = t.getZoom(), {fitIcons: h, fitWidthIcons: u, fitHeightIcons: d} = r, {aMarkerWidth: m, aMarkerHeight: v, labelShape: p} = r, y = r.elements || e.elements, {features: g, aPickingId: b} = r, _ = (t, e, n, i) => {
            const o = p[4 * e], h = p[4 * e + 1], u = p[4 * e + 2], d = p[4 * e + 3];
            if (!(o || h || u || d)) return;
            const y = b[t], _ = g[y] && g[y].feature, A = _ && _.properties || {};
            A.$layer = _ && _.layer, A.$type = _ && _.type;
            let x = s ? s(c, A) : a;
            if (Pt(x)) {
                x = (A.textSizeFn = A.textSizeFn || Ct(x))(c, A);
            }
            x /= 24;
            let S, w, M = f ? f(c, A) : l;
            if (Pt(M)) {
                M = (A.fitPaddingFn = A.fitPaddingFn || Et(M))(c, A);
            }
            if (M[0] === M[2] && M[1] === M[3] || (S = r.aPadOffsetX, w = r.aPadOffsetY, S || (S = r.aPadOffsetX = new Int8Array(m.length), 
            w = r.aPadOffsetY = new Int8Array(m.length))), delete A.$layer, delete A.$type, 
            m && n) {
                const e = Math.abs((u - o) / 10 * x) + (M[1] + M[3] || 0);
                if (Fn[0] = e, m[t] !== Fn[0] && (Bt(m, Fn[0], t, t + 4), m.dirty = !0), S) {
                    const e = (M[1] + M[3]) / 2 - M[3];
                    Vn[0] = e, S[t] !== Vn[0] && (Bt(S, e, t, t + 4), S.dirty = !0);
                }
            }
            if (v && i) {
                const e = Math.abs((d - h) / 10 * x) + (M[0] + M[2] || 0);
                if (Fn[0] = e, v[t] !== Fn[0] && (Bt(v, Fn[0], t, t + 4), v.dirty = !0), w) {
                    const e = M[0] - (M[0] + M[2]) / 2;
                    Vn[0] = e, w[t] !== Vn[0] && (Bt(w, e, t, t + 4), w.dirty = !0);
                }
            }
        };
        if (h || u || d) {
            if (h) for (let t = 0; t < h.length; t++) {
                const e = h[t];
                _(y[6 * e], e, !0, !0);
            } else if (u || d) {
                if (u) for (let t = 0; t < u.length; t++) {
                    const e = u[t];
                    _(y[6 * e], e, !0, !1);
                }
                if (d) for (let t = 0; t < d.length; t++) {
                    const e = d[t];
                    _(y[6 * e], e, !1, !0);
                }
            }
        } else for (let t = 0; t < y.length; t += 6) {
            const e = t / 6;
            _(y[t], e, !0, !0);
        }
        const {aPadOffsetX: A, aPadOffsetY: x} = r;
        A && (e.data.aPadOffsetX = A, e.data.aPadOffsetY = x);
    }
    const Xn = function(t) {
        const e = this.layer.getRenderer();
        return !this.he(t) && e.isForeground(t) && !!t.geometry.properties.iconAtlas && !t.geometry.properties.isEmpty;
    }, Yn = function(t) {
        const e = this.layer.getRenderer();
        return !(this.he(t) || e.isForeground(t) || !t.geometry.properties.iconAtlas || t.geometry.properties.isEmpty);
    }, Kn = function(t) {
        const e = this.layer.getRenderer();
        return !this.he(t) && e.isForeground(t) && !!t.geometry.properties.glyphAtlas;
    }, qn = function(t) {
        const e = this.layer.getRenderer();
        return !this.he(t) && !e.isForeground(t) && !!t.geometry.properties.glyphAtlas;
    }, Jn = [], Zn = {
        colliides: -1
    };
    class $n extends je {
        constructor(t, e, n, i, r) {
            super(t, e, n, i, r), this.propAllowOverlap = "markerAllowOverlap", this.propIgnorePlacement = "markerIgnorePlacement", 
            this.U = {}, this.isLabelCollides = Rn.bind(this), this.me = Xn.bind(this), this.ve = Yn.bind(this), 
            this.pe = Kn.bind(this), this.ye = qn.bind(this), this.ge = [];
        }
        createFnTypeConfig(t, e) {
            return {
                icon: Gn.call(this, t, e),
                text: In.call(this, t, e)
            };
        }
        startFrame(...t) {
            return this.ge.length = 0, super.startFrame(...t);
        }
        createGeometry(t, e) {
            return t && t.empty && (t.data = {
                aPosition: new Uint8Array(t.data.aPosition),
                aPickingId: t.data.aPickingId
            }), super.createGeometry(t, e);
        }
        postCreateGeometry(t, e) {
            const {geometry: n, symbolIndex: i} = t, r = this.getSymbolDef(i), o = this.getFnTypeConfig(i);
            if (this.be(n)) n.properties.iconAtlas ? this.drawDebugAtlas(n.properties.iconAtlas) : n.properties.isEmpty = !0, 
            jn(n, r, o.icon); else if (this._e(n) && Yt(r)) {
                const t = e[e.length - 1];
                if (t) {
                    const {geometry: e, symbolIndex: o} = t;
                    if (e && o.index === i.index) {
                        const t = this.getMap(), i = r.markerTextFit;
                        e.properties.textGeo = n, Un.call(this, t, e, n, i);
                    }
                }
            }
        }
        Ae(t) {
            if (!this.layer.options.collision) return;
            const {collideIds: e, elements: n, aCount: i} = t.properties, r = e, o = {};
            if (!n) return void (t.properties.collideBoxIndex = o);
            let a = 0, s = n[0], l = 0, f = r[s], c = 1;
            i && (c = i[n[l]]);
            for (let t = 0; t <= n.length; t += 6) s = n[t], r[s] === f && t !== n.length || (o[f] = [ l, t, (t - l) / (6 * c), a++ ], 
            f = r[s], l = t, i && (c = i[n[l]]));
            t.properties.collideBoxIndex = o;
        }
        createMesh(t, e, i, r) {
            const o = this.isEnableCollision(), a = this.layer, {geometry: s, symbolIndex: l} = t;
            s.properties.symbolIndex = l;
            const f = this.getSymbolDef(l), c = this.getSymbol(l), h = this.getFnTypeConfig(l), u = [];
            if (this.be(s)) {
                const t = function(t, e, i, r, o, a, s, l) {
                    if (e.isDisposed() || 0 === e.data.aPosition.length) return null;
                    const f = e.properties.iconAtlas;
                    if (!f && !e.properties.isEmpty) return null;
                    const c = {
                        flipY: 0,
                        tileResolution: e.properties.tileResolution,
                        tileRatio: e.properties.tileRatio
                    };
                    //!geometry.properties.aAnchor 以避免重复创建collision数据
                                        if ((a || l) && !e.properties.aAnchor) {
                        const {aPosition: t, aShape: n} = e.data, i = e.data.aPosition.length / e.desc.positionSize, r = new Uint8Array(i);
                        s && r.fill(255, 0), e.data.aOpacity = {
                            usage: "dynamic",
                            data: r
                        }, e.properties.aOpacity = new Uint8Array(i), s && e.properties.aOpacity.fill(255, 0), 
                        e.properties.aAnchor = t, e.properties.aShape = n;
                    }
                    e.properties.visElemts || (e.properties.elements = e.elements, e.properties.visElemts = new e.elements.constructor(e.elements.length)), 
                    Vt(c, "markerOpacity", r, "markerOpacity", 1), Vt(c, "markerPerspectiveRatio", r, "markerPerspectiveRatio", r.markerTextFit ? 0 : 1), 
                    Vt(c, "markerWidth", r, "markerWidth", 15), Vt(c, "markerHeight", r, "markerHeight", 15), 
                    Vt(c, "markerDx", r, "markerDx", 0), Vt(c, "markerDy", r, "markerDy", 0), Vt(c, "markerRotation", r, "markerRotation", 0, t => t * Math.PI / 180), 
                    Vt(c, "pitchWithMap", r, "markerPitchAlignment", 0, t => "map" === t ? 1 : 0), Vt(c, "rotateWithMap", r, "markerRotationAlignment", 0, t => "map" === t ? 1 : 0), 
                    c.texture = f ? Me(t, f, !1) : null, c.texSize = f ? [ f.width, f.height ] : [ 0, 0 ], 
                    e.generateBuffers(t, {
                        excludeElementsInVAO: !0
                    });
                    const h = new n.reshader.Material(c), u = new n.reshader.Mesh(e, h, {
                        disableVAO: !0,
                        transparent: !0,
                        castShadow: !1,
                        picking: !0
                    }), d = {};
                    return a && (d.ENABLE_COLLISION = 1), e.data.aMarkerWidth && (d.HAS_MARKER_WIDTH = 1), 
                    e.data.aMarkerHeight && (d.HAS_MARKER_HEIGHT = 1), e.data.aColorOpacity && (d.HAS_OPACITY = 1), 
                    e.data.aMarkerDx && (d.HAS_MARKER_DX = 1), e.data.aMarkerDy && (d.HAS_MARKER_DY = 1), 
                    e.data.aPitchAlign && (d.HAS_PITCH_ALIGN = 1), e.data.aRotationAlign && (d.HAS_ROTATION_ALIGN = 1), 
                    e.data.aRotation && (d.HAS_ROTATION = 1), e.data.aPadOffsetX && (d.HAS_PAD_OFFSET = 1), 
                    u.setDefines(d), u.setLocalTransform(i), u.properties.symbolIndex = e.properties.symbolIndex, 
                    u;
                }(this.regl, s, e, f, h.icon, a.options.collision, !o, this.isEnableUniquePlacement());
                t && (delete t.geometry.properties.glyphAtlas, u.push(t));
            } else if (this._e(s)) {
                const t = wn.call(this, this.regl, s, e, f, c, h.text, a.options.collision, !o, this.isEnableUniquePlacement());
                t.length && (t.forEach(t => {
                    delete t.geometry.properties.iconAtlas;
                }), u.push(...t));
            }
            return "line" === f.markerPlacement && this.xe(s, r), "line" !== f.markerPlacement && "line" !== f.textPlacement || u.forEach(t => t.properties.isLinePlacement = !0), 
            this.Ae(s), u;
        }
        xe(t, e) {
            const {collideIds: n} = t.properties, i = new Uint16Array(n.length);
            if (this.be(t)) {
                let r = 0;
                for (let t = 0; t < n.length; t += 4) i.fill(r++, t, t + 4);
                t.properties.collideIds = i, t.properties.uniqueCollideIds = qt(i), e.markerCollideMap = {
                    old: n,
                    new: i
                };
            } else if (this._e(t)) {
                const {collideIds: n, aCount: i} = t.properties;
                if (!i) return;
                if (e.markerCollideMap) {
                    const {markerCollideMap: r} = e;
                    let o = r.new[r.new.length - 1], a = 0, s = n[0], l = e.markerCollideMap.old.indexOf(s), f = i[0];
                    for (let t = 0; t < n.length; ) {
                        const r = n[t];
                        s !== r && (s = r, l = e.markerCollideMap.old.indexOf(s), a = 0);
                        const c = -1 === l ? ++o : e.markerCollideMap.new[l + 4 * a], h = t + 4 * f;
                        n.fill(c, t, h), t += 4 * f, a++, h < n.length && (f = i[h]);
                    }
                    t.properties.uniqueCollideIds = qt(n);
                } else {
                    let e = 0, r = i[0];
                    for (let t = 0; t < n.length; ) {
                        const o = t + 4 * r;
                        n.fill(e++, t, o), t += 4 * r, o < n.length && (r = i[o]);
                    }
                    t.properties.uniqueCollideIds = qt(n);
                }
            }
        }
        addMesh(t) {
            if (this.Yt() && t.length > 0) {
                const e = new De(t);
                e.properties.uniqueCollideIds = t[0].geometry.properties.uniqueCollideIds, e.properties.meshKey = t[0].properties.meshKey, 
                e.properties.level = t[0].properties.level, this.ge.push(e);
            }
            for (let e = 0; e < t.length; e++) {
                if (!this.isMeshIterable(t[e])) continue;
                const n = t[e].geometry, {symbolIndex: i} = n.properties;
                Yt(this.getSymbolDef(i)) && Bn.call(this, this.getMap(), n);
            }
            const e = this.getMap().getZoom();
            for (let n = 0; n < t.length; n++) {
                if (!this.isMeshIterable(t[n])) continue;
                const i = t[n].geometry, {symbolIndex: r} = i.properties, o = this.getSymbolDef(r), a = this.getFnTypeConfig(r);
                ne(this.regl, o, 0 === r.type ? a.icon : a.text, t[n], e);
                const {aMarkerWidth: s, aMarkerHeight: l, aPadOffsetX: f, aPadOffsetY: c} = i.properties;
                s && s.dirty && (i.updateData("aMarkerWidth", s), s.dirty = !1), l && l.dirty && (i.updateData("aMarkerHeight", l), 
                l.dirty = !1), f && f.dirty && (i.updateData("aPadOffsetX", f), f.dirty = !1), c && c.dirty && (i.updateData("aPadOffsetY", c), 
                c.dirty = !1);
            }
            super.addMesh(...arguments);
        }
        updateCollision(t) {
            if (!this.Yt()) return;
            super.updateCollision(t);
            const e = this.scene.getMeshes();
            e && e.length ? (this.Se(t.timestamp), this.ge = [], this.St()) : this.St();
        }
        callCurrentTileShader(t, e) {
            this.shader.filter = e.sceneFilter ? [ this.me, e.sceneFilter ] : this.me, this.renderer.render(this.shader, t, this.scene, this.getRenderFBO(e)), 
            this.we.filter = e.sceneFilter ? [ this.pe, e.sceneFilter ] : this.pe, this.renderer.render(this.we, t, this.scene, this.getRenderFBO(e));
        }
        callBackgroundTileShader(t, e) {
            this.shader.filter = e.sceneFilter ? [ this.ve, e.sceneFilter ] : this.ve, this.renderer.render(this.shader, t, this.scene, this.getRenderFBO(e)), 
            this.we.filter = e.sceneFilter ? [ this.ye, e.sceneFilter ] : this.ye, this.renderer.render(this.we, t, this.scene, this.getRenderFBO(e));
        }
        isMeshIterable(t) {
            return t && t.geometry && !t.geometry.properties.isEmpty && t.material && !t.material.get("isHalo") && this.isMeshVisible(t) && !(this.shouldIgnoreBackground() && !this.layer.getRenderer().isForeground(t));
        }
        Se() {
            if (!this.Yt()) return;
            let t = this.ge;
            t && t.length && this.Me(t);
        }
        Te(t, e, n, i) {
            return this.updateBoxCollisionFading(!0, t, e, n, i);
        }
        isEnableUniquePlacement() {
            return this.isEnableCollision() && !0 === this.sceneConfig.uniquePlacement;
        }
        Me(t) {
            const e = this.layer.getRenderer();
            t = t.sort(Qn);
            for (let n = 0; n < t.length; n++) {
                const i = t[n];
                if (!i || !i.meshes.length) continue;
                let r = !1;
                if (1 === i.meshes.length) r = this.isMeshIterable(i.meshes[0]); else for (let t = 0; t < i.meshes.length; t++) if (this.isMeshIterable(i.meshes[t])) {
                    r = !0;
                    break;
                }
                if (!r) continue;
                const o = e.isForeground(i.meshes[0]);
                if (this.shouldIgnoreBackground() && !o) continue;
                const a = i.properties.meshKey;
                this.startMeshCollision(i), this.Oe(i), this.forEachBox(i, this.Te), this.Ie(i), 
                this.endMeshCollision(a);
                for (let t = 0; t < i.meshes.length; t++) this.He(i.meshes[t]);
            }
        }
        He(t) {
            const e = t && t.geometry && t.geometry.properties.aOpacity;
            e && e.dirty && (t.geometry.updateData("aOpacity", e), e.dirty = !1);
        }
        forEachBox(t, e) {
            const n = t.properties.uniqueCollideIds;
            if (!n) return;
            const i = {
                boxIndex: 0
            }, r = n.length;
            for (let o = 0; o < r; o++) this.Pe(t, n[o], e, i);
        }
        Pe(t, e, i, r) {
            const o = this.getMap(), {collideBoxIndex: a} = t.meshes[0].geometry.properties;
            if (!a[e]) return !1;
            const s = n.mat4.multiply(Jn, o.projViewMatrix, t.meshes[0].localTransform);
            let l, f = !1;
            const c = t.meshes;
            let h = 0;
            for (let t = 0; t < c.length; t++) {
                if (!this.isMeshIterable(c[t])) continue;
                const {collideBoxIndex: n} = c[t].geometry.properties;
                n[e] && h++;
            }
            if (!h) return !1;
            l = this.fe(h);
            let u = 0;
            for (let t = 0; t < c.length; t++) {
                const n = c[t];
                if (!this.isMeshIterable(n)) continue;
                f = !0;
                const {elements: i, aCount: r, collideBoxIndex: o} = c[t].geometry.properties, a = o[e];
                if (!a) continue;
                const [s, h, d] = a;
                let m = 1;
                r && (m = r[i[s]]);
                const v = s + 0 * m * 6;
                l[u].mesh = c[t], l[u].start = v, l[u].end = h, l[u].boxCount = d, l[u].allElements = i, 
                u++;
            }
            if (!f) return !1;
            return i.call(this, t, l, s, r.boxIndex++) && this.Ce(t, e), !0;
        }
        Oe(t) {
            const e = t.meshes;
            for (let t = 0; t < e.length; t++) {
                const n = e[t], i = n && n.geometry;
                i && (i.properties.visElemts.count = 0);
            }
        }
        Ce(t, e) {
            const n = t.meshes;
            for (let t = 0; t < n.length; t++) {
                const i = n[t];
                if (i.properties.isHalo) continue;
                const r = i && i.geometry;
                if (!r || r.properties.isEmpty) continue;
                const {collideBoxIndex: o, elements: a, visElemts: s} = r.properties, l = o[e];
                if (!l) continue;
                const [f, c] = l;
                let h = s.count;
                for (let t = f; t < c; t++) s[h++] = a[t];
                s.count = h;
            }
        }
        Ie(t) {
            const e = t.meshes;
            for (let t = 0; t < e.length; t++) {
                const n = e[t], i = n && n.geometry;
                if (!i) continue;
                const {visElemts: r} = i.properties;
                i.setElements(r, r.count);
            }
        }
        isBoxCollides(t, e, n, i, r, o) {
            if (this._e(t.geometry)) return Rn.call(this, 0, t, e, n, i, r, o);
            if (t.geometry.properties.isEmpty) return Zn;
            const a = this.getMap(), {boxes: s, collision: l} = this.le(t, i);
            let f = 0, c = 0, h = 0;
            for (let n = i; n < r; n += 6) {
                const i = s[h] = s[h] || [];
                h++;
                const r = dn.call(this, i, t, e[n], o, a);
                if (!f) {
                    const t = this.isCollides(r);
                    1 === t ? f = 1 : -1 === t && c++;
                }
            }
            return c === n && (f = -1), l.collides = f, l;
        }
        deleteMesh(t, e) {
            t && (t instanceof De && (t = t.meshes), e && (Array.isArray(t) ? t.forEach(t => {
                t && t.material && delete t.material.uniforms.texture;
            }) : t.material && delete t.material.uniforms.texture), super.deleteMesh(t, e));
        }
        isBloom(t) {
            const e = t && t.material && !zt(t.material.get("markerOpacity")), n = this.getSymbol(t.properties.symbolIndex);
            return !!(e ? n.markerBloom : n.textBloom);
        }
        init() {
            const t = this.regl, e = this.canvas;
            this.renderer = new n.reshader.Renderer(t);
            const i = {
                x: 0,
                y: 0,
                width: () => e ? e.width : 1,
                height: () => e ? e.height : 1
            };
            this.shader = new n.reshader.MeshShader({
                vert: We,
                frag: "#define SHADER_NAME MARKER\nprecision mediump float;\nuniform sampler2D texture;\nuniform lowp float markerOpacity;\nuniform lowp float blendSrcIsOne;\nvarying vec2 vTexCoord;\nvarying float vOpacity;\nvoid main() {\n  gl_FragColor = texture2D(texture, vTexCoord) * markerOpacity * vOpacity;\n  if(blendSrcIsOne == 1.) {\n    gl_FragColor *= gl_FragColor.a;\n  }\n}",
                uniforms: [ "flipY", "markerWidth", "markerHeight", "markerDx", "markerDy", "markerRotation", "cameraToCenterDistance", {
                    name: "projViewModelMatrix",
                    type: "function",
                    fn: function(t, e) {
                        return n.mat4.multiply([], e.projViewMatrix, e.modelMatrix);
                    }
                }, "texSize", "canvasSize", "iconSize", "pitchWithMap", "mapPitch", "markerPerspectiveRatio", "texture", "rotateWithMap", "mapRotation", "tileRatio", {
                    name: "zoomScale",
                    type: "function",
                    fn: function(t, e) {
                        return e.tileResolution / e.resolution;
                    }
                } ],
                extraCommandProps: {
                    viewport: i,
                    blend: {
                        enable: !0,
                        func: this.getBlendFunc(),
                        equation: "add"
                    },
                    depth: {
                        enable: !0,
                        range: () => this.sceneConfig.depthRange || [ 0, 1 ],
                        func: () => this.sceneConfig.depthFunc || "always",
                        mask: !1
                    },
                    polygonOffset: {
                        enable: !0,
                        offset: this.getPolygonOffset()
                    }
                }
            });
            const {uniforms: r, extraCommandProps: o} = On.call(this, this.layer, this.sceneConfig);
            if (this.we = new n.reshader.MeshShader({
                vert: Ln,
                frag: zn,
                uniforms: r,
                extraCommandProps: o
            }), this.pickingFBO) {
                const t = new n.reshader.FBORayPicking(this.renderer, {
                    vert: "#define PICKING_MODE 1\n" + We,
                    uniforms: [ "flipY", "markerWidth", "markerHeight", "markerDx", "markerDy", "markerRotation", "cameraToCenterDistance", {
                        name: "projViewModelMatrix",
                        type: "function",
                        fn: function(t, e) {
                            return n.mat4.multiply([], e.projViewMatrix, e.modelMatrix);
                        }
                    }, "canvasSize", "iconSize", "pitchWithMap", "mapPitch", "markerPerspectiveRatio", "rotateWithMap", "mapRotation", "tileRatio", {
                        name: "zoomScale",
                        type: "function",
                        fn: function(t, e) {
                            return e.tileResolution / e.resolution;
                        }
                    } ],
                    extraCommandProps: {
                        viewport: this.pickingViewport
                    }
                }, this.pickingFBO);
                t.filter = t => !!t.geometry.properties.iconAtlas;
                const e = new n.reshader.FBORayPicking(this.renderer, {
                    vert: "#define PICKING_MODE 1\n" + Ln,
                    uniforms: r,
                    extraCommandProps: {
                        viewport: this.pickingViewport
                    }
                }, this.pickingFBO);
                e.filter = t => !!t.geometry.properties.glyphAtlas, this.picking = [ t, e ];
            }
        }
        getUniformValues(t) {
            const e = t.projViewMatrix, n = t.cameraToCenterDistance, i = [ t.width, t.height ];
            return {
                layerScale: this.layer.options.styleScale || 1,
                mapPitch: t.getPitch() * Math.PI / 180,
                mapRotation: t.getBearing() * Math.PI / 180,
                projViewMatrix: e,
                cameraToCenterDistance: n,
                canvasSize: i,
                iconSize: [ 24, 24 ],
                resolution: t.getResolution(),
                glyphSize: 24,
                gammaScale: 1,
                blendSrcIsOne: +!("one" !== this.sceneConfig.blendSrc)
            };
        }
        getUniqueEntryKey(t, e) {
            if (!this._e(t.geometry)) return null;
            const {elements: n} = t.geometry.properties;
            return Dn(t, n[e]);
        }
        be(t) {
            const {symbolIndex: e} = t.properties;
            return 0 === e.type;
        }
        _e(t) {
            const {symbolIndex: e} = t.properties;
            return 1 === e.type;
        }
    }
    function Qn(t, e) {
        return t.properties.level - e.properties.level || t.properties.meshKey - e.properties.meshKey;
    }
    var ti = ei;
    function ei(t, e) {
        this.x = t, this.y = e;
    }
    ei.prototype = {
        clone: function() {
            return new ei(this.x, this.y);
        },
        add: function(t) {
            return this.clone().Ee(t);
        },
        sub: function(t) {
            return this.clone().Re(t);
        },
        multByPoint: function(t) {
            return this.clone().De(t);
        },
        divByPoint: function(t) {
            return this.clone().Ne(t);
        },
        mult: function(t) {
            return this.clone().ke(t);
        },
        div: function(t) {
            return this.clone().Le(t);
        },
        rotate: function(t) {
            return this.clone().ze(t);
        },
        rotateAround: function(t, e) {
            return this.clone().Fe(t, e);
        },
        matMult: function(t) {
            return this.clone().Ve(t);
        },
        unit: function() {
            return this.clone().je();
        },
        perp: function() {
            return this.clone().Ge();
        },
        round: function() {
            return this.clone().Ue();
        },
        mag: function() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        },
        equals: function(t) {
            return this.x === t.x && this.y === t.y;
        },
        dist: function(t) {
            return Math.sqrt(this.distSqr(t));
        },
        distSqr: function(t) {
            var e = t.x - this.x, n = t.y - this.y;
            return e * e + n * n;
        },
        angle: function() {
            return Math.atan2(this.y, this.x);
        },
        angleTo: function(t) {
            return Math.atan2(this.y - t.y, this.x - t.x);
        },
        angleWith: function(t) {
            return this.angleWithSep(t.x, t.y);
        },
        angleWithSep: function(t, e) {
            return Math.atan2(this.x * e - this.y * t, this.x * t + this.y * e);
        },
        Ve: function(t) {
            var e = t[0] * this.x + t[1] * this.y, n = t[2] * this.x + t[3] * this.y;
            return this.x = e, this.y = n, this;
        },
        Ee: function(t) {
            return this.x += t.x, this.y += t.y, this;
        },
        Re: function(t) {
            return this.x -= t.x, this.y -= t.y, this;
        },
        ke: function(t) {
            return this.x *= t, this.y *= t, this;
        },
        Le: function(t) {
            return this.x /= t, this.y /= t, this;
        },
        De: function(t) {
            return this.x *= t.x, this.y *= t.y, this;
        },
        Ne: function(t) {
            return this.x /= t.x, this.y /= t.y, this;
        },
        je: function() {
            return this.Le(this.mag()), this;
        },
        Ge: function() {
            var t = this.y;
            return this.y = this.x, this.x = -t, this;
        },
        ze: function(t) {
            var e = Math.cos(t), n = Math.sin(t), i = e * this.x - n * this.y, r = n * this.x + e * this.y;
            return this.x = i, this.y = r, this;
        },
        Fe: function(t, e) {
            var n = Math.cos(t), i = Math.sin(t), r = e.x + n * (this.x - e.x) - i * (this.y - e.y), o = e.y + i * (this.x - e.x) + n * (this.y - e.y);
            return this.x = r, this.y = o, this;
        },
        Ue: function() {
            return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
        }
    }, ei.convert = function(t) {
        return t instanceof ei ? t : Array.isArray(t) ? new ei(t[0], t[1]) : t;
    };
    const ni = [], ii = [], ri = [];
    function oi(t, e, i, r, o, a, s, l) {
        const {aGlyphOffset: f, aSegment: c, aTextDx: h, aTextDy: u, symbolIndex: d} = e.geometry.properties, m = this.getSymbol(d), v = h ? h[o] : m.textDx, p = u ? u[o] : m.textDy, y = n.vec2.set(ri, v || 0, p || 0), g = n.vec2.set(ni, f[2 * o], f[2 * o + 1]), b = n.vec3.set(ii, c[3 * o], c[3 * o + 1], c[3 * o + 2]);
        return function(t, e, n, i, r, o, a, s, l, f, c, h) {
            const u = i[0] * f, d = c ? u - r : u + r;
            let m = d > 0 ? 1 : -1, v = 0;
            c && (m *= -1, v = Math.PI), m < 0 && (v += Math.PI);
            const p = s + l, y = Math.abs(d);
            let g = m > 0 ? a : a + 1, b = ti.convert(n), _ = ti.convert(n), A = 0, x = 0;
            for (;A + x <= y; ) {
                if (g += m, g < s || g >= p) return null;
                _.x = b.x, _.y = b.y, b.x = e[3 * g], b.y = e[3 * g + 1], A += x, x = _.dist(b) / h;
            }
            const S = (y - A) / x, w = b.sub(_), M = w.mult(S).Ee(_);
            M.Ee(w.je().Ge().ke(o * m));
            const T = v + Math.atan2(b.y - _.y, b.x - _.x);
            return t[0] = (M.x - n[0]) / h, t[1] = (M.y - n[1]) / h, t[2] = T, t;
        }(t, r, a, g, y[0], y[1], b[0], b[1], b[2], i / 24, l, s);
    }
    const ai = [], si = [];
    function li(t, e, i, r, o, a, s, l, f, c, h) {
        const {aVertical: u} = i.geometry.properties, d = u[a];
        let m, v, p = oi.call(this, ai, i, r, o, a, l, f, !1);
        if (!p) return null;
        if (n.vec3.copy(t, p), p = oi.call(this, si, i, r, o, s, l, f, !1), !p) return null;
        if (n.vec3.copy(e, p), h && (n.vec2.transformMat2(ai, ai, h), n.vec2.transformMat2(si, si, h)), 
        d) {
            const t = Math.abs(si[1] - ai[1]), e = Math.abs(si[0] - ai[0]) * c;
            v = ai[0] > si[0] ? 1 : 0, t > e ? (m = 1, v = ai[1] < si[1] ? 0 : 1) : m = 0;
        } else m = 0, v = ai[0] > si[0] ? 1 : 0;
        return 2 * v + m;
    }
    var fi = "#define SHADER_NAME TEXT_LINE\nattribute vec3 aPosition;\nattribute vec2 aTexCoord;\nattribute vec2 aOffset;\n#ifdef ENABLE_COLLISION\nattribute float aOpacity;\n#endif\n#ifdef HAS_OPACITY\nattribute float aColorOpacity;\n#endif\n#ifdef HAS_TEXT_SIZE\nattribute float aTextSize;\n#else\nuniform float textSize;\n#endif\n#ifdef HAS_TEXT_DX\nattribute float aTextDx;\n#else\nuniform float textDx;\n#endif\n#ifdef HAS_TEXT_DY\nattribute float aTextDy;\n#else\nuniform float textDy;\n#endif\n#if defined(HAS_PITCH_ALIGN)\nattribute float aPitchAlign;\n#else\nuniform float pitchWithMap;\n#endif\nuniform float zoomScale;\nuniform float cameraToCenterDistance;\nuniform mat4 projViewModelMatrix;\nuniform float textPerspectiveRatio;\nuniform float mapPitch;\nuniform vec2 texSize;\nuniform vec2 canvasSize;\nuniform float tileRatio;\nuniform float layerScale;\n#ifndef PICKING_MODE\nvarying vec2 vTexCoord;\nvarying float vGammaScale;\nvarying float vSize;\nvarying float vOpacity;\n#ifdef HAS_TEXT_FILL\nattribute vec4 aTextFill;\nvarying vec4 vTextFill;\n#endif\n#ifdef HAS_TEXT_HALO_FILL\nattribute vec4 aTextHaloFill;\nvarying vec4 vTextHaloFill;\n#endif\n#ifdef HAS_TEXT_HALO_RADIUS\nattribute float aTextHaloRadius;\nvarying float vTextHaloRadius;\n#endif\n#ifdef HAS_TEXT_HALO_OPACITY\nattribute float aTextHaloOpacity;\nvarying float vTextHaloOpacity;\n#endif\n#else\n#include <fbo_picking_vert>\n#endif\nvoid main() {\n  vec3 c = aPosition;\n#ifdef HAS_TEXT_DX\nfloat d = aTextDx;\n#else\nfloat d = textDx;\n#endif\n#ifdef HAS_TEXT_DY\nfloat e = aTextDy;\n#else\nfloat e = textDy;\n#endif\n#ifdef HAS_TEXT_SIZE\nfloat f = aTextSize * layerScale;\n#else\nfloat f = textSize * layerScale;\n#endif\n#ifdef HAS_PITCH_ALIGN\nfloat h = aPitchAlign;\n#else\nfloat h = pitchWithMap;\n#endif\ngl_Position = projViewModelMatrix * vec4(c, 1.);\n  float i = gl_Position.w;\n  float j = i / cameraToCenterDistance;\n  float k = (1. - cameraToCenterDistance / i) * textPerspectiveRatio;\n  float l = clamp(.5 + .5 * (1. - k), .0, 4.);\n  vec2 m = aOffset / 10.0;\n  vec2 n = aTexCoord;\n  if(h == 1.) {\n    gl_Position = projViewModelMatrix * vec4(c + vec3(m, .0) * tileRatio / zoomScale * j * l, 1.);\n  } else {\n    gl_Position.xy += m * 2. / canvasSize * l * i;\n  }\n  gl_Position.xy += vec2(d, -e) * 2. / canvasSize * i;\n#ifndef PICKING_MODE\nif(h == 1.) {\n    vGammaScale = j + mapPitch / 4.;\n  } else {\n    vGammaScale = mix(1., j, textPerspectiveRatio);\n  }\n  vGammaScale = clamp(vGammaScale, .0, 1.);\n  vTexCoord = n / texSize;\n  vSize = f;\n#ifdef ENABLE_COLLISION\nvOpacity = aOpacity / 255.;\n#else\nvOpacity = 1.;\n#endif\n#ifdef HAS_OPACITY\nvOpacity *= aColorOpacity / 255.;\n#endif\n#ifdef HAS_TEXT_FILL\nvTextFill = aTextFill / 255.;\n#endif\n#ifdef HAS_TEXT_HALO_FILL\nvTextHaloFill = aTextHaloFill / 255.;\n#endif\n#ifdef HAS_TEXT_HALO_RADIUS\nvTextHaloRadius = aTextHaloRadius;\n#endif\n#ifdef HAS_TEXT_HALO_OPACITY\nvTextHaloOpacity = aTextHaloOpacity;\n#endif\n#else\n#ifdef ENABLE_COLLISION\nbool o = aOpacity == 255.;\n#else\nbool o = true;\n#endif\nfbo_picking_setData(gl_Position.w, o);\n#endif\n}";
    const ci = function(t) {
        const e = this.layer.getRenderer(), n = this.getSymbol(t.properties.symbolIndex);
        return !this.he(t) && e.isForeground(t) && "line" !== n.textPlacement;
    }, hi = function(t) {
        const e = this.layer.getRenderer(), n = this.getSymbol(t.properties.symbolIndex);
        return !this.he(t) && !e.isForeground(t) && "line" !== n.textPlacement;
    }, ui = function(t) {
        const e = this.layer.getRenderer(), n = this.getSymbol(t.properties.symbolIndex);
        return !this.he(t) && e.isForeground(t) && "line" === n.textPlacement;
    }, di = function(t) {
        const e = this.layer.getRenderer(), n = this.getSymbol(t.properties.symbolIndex);
        return !this.he(t) && !e.isForeground(t) && "line" === n.textPlacement;
    }, mi = [], vi = [], pi = [], yi = [], gi = [], bi = [], _i = [], Ai = [], xi = [], Si = [ 1, -1 ], wi = new Int16Array(2), Mi = [], Ti = [];
    class Oi extends je {
        constructor(t, e, n, i, r) {
            super(t, e, n, i, r), this.propAllowOverlap = "textAllowOverlap", this.propIgnorePlacement = "textIgnorePlacement", 
            this.colorCache = {}, this.We = ci.bind(this), this.Be = hi.bind(this), this.Xe = ui.bind(this), 
            this.Ye = di.bind(this), this.isLabelCollides = Rn.bind(this), this.Ke();
        }
        Ke() {
            this.qe = [];
            for (let t = 0; t < this.symbolDef.length; t++) {
                const e = this.symbolDef[t];
                Pt(e.textName) && (this.qe[t] = Ct(e.textName));
            }
        }
        updateSymbol(...t) {
            const e = super.updateSymbol(...t);
            return this.Ke(), e;
        }
        shouldDeleteMeshOnUpdateSymbol(t) {
            if (!Array.isArray(t)) return (0 === t.textHaloRadius || 0 === this.symbolDef[0].textHaloRadius) && t.textHaloRadius !== this.symbolDef[0].textHaloRadius;
            for (let e = 0; e < t.length; e++) if (t[e] && (0 === t[e].textHaloRadius || 0 === this.symbolDef[e].textHaloRadius) && t[e].textHaloRadius !== this.symbolDef[e].textHaloRadius) return !0;
            return !1;
        }
        createFnTypeConfig(t, e) {
            return In(t, e);
        }
        isBloom(t) {
            return !!this.getSymbol(t.properties.symbolIndex).textBloom;
        }
        createGeometry(t, e, n) {
            const i = t;
            if (!i.glyphAtlas) return null;
            const r = super.createGeometry(i);
            if (!r || !r.geometry) return null;
            const {geometry: o} = r;
            return o.properties.glyphAtlas && this.drawDebugAtlas(o.properties.glyphAtlas), 
            o && i.lineVertex && (o.properties.line = i.lineVertex, o.properties.line.id = n), 
            r;
        }
        createMesh(t, e) {
            const n = this.isEnableCollision(), i = this.isEnableUniquePlacement(), {geometry: r, symbolIndex: o} = t;
            r.properties.symbolIndex = o;
            const a = this.getSymbol(o), s = this.getSymbolDef(o), l = this.getFnTypeConfig(o), f = wn.call(this, this.regl, r, e, s, a, l, this.layer.options.collision, !n, i);
            if (f.length) {
                "line" === a.textPlacement ? this.Je = !0 : this.Ze = !0;
            }
            return f;
        }
        updateCollision(t) {
            super.updateCollision(t);
            const e = this.scene.getMeshes();
            e && e.length ? (this.$e = {}, this.Qe(t.timestamp), this.St()) : this.St();
        }
        callCurrentTileShader(t, e) {
            this.shader.filter = e.sceneFilter ? [ this.We, e.sceneFilter ] : this.We, this.renderer.render(this.shader, t, this.scene, this.getRenderFBO(e)), 
            this.tn.filter = e.sceneFilter ? [ this.Xe, e.sceneFilter ] : this.Xe, this.renderer.render(this.tn, t, this.scene, this.getRenderFBO(e));
        }
        callBackgroundTileShader(t, e) {
            this.shader.filter = e.sceneFilter ? [ this.Be, e.sceneFilter ] : this.Be, this.renderer.render(this.shader, t, this.scene, this.getRenderFBO(e)), 
            this.tn.filter = e.sceneFilter ? [ this.Ye, e.sceneFilter ] : this.Ye, this.renderer.render(this.tn, t, this.scene, this.getRenderFBO(e));
        }
        Qe() {
            let t = this.scene.getMeshes();
            if (!t || !t.length) return;
            const e = -this.getMap().getBearing() * Math.PI / 180, i = n.mat2.fromRotation(pi, e), r = (t, e, n, i) => {
                const {start: r, end: o, mesh: a, allElements: s} = e[0];
                if (this.updateBoxCollisionFading(!0, a, e, n, i)) {
                    let e = t.count;
                    for (let n = r; n < o; n++) t[e++] = s[n];
                    t.count = e;
                }
            }, o = this.Yt(), a = this.layer.getRenderer();
            t = t.sort(Ci);
            for (let e = 0; e < t.length; e++) {
                const n = t[e];
                if (!this.isMeshIterable(n)) continue;
                const s = a.isForeground(n);
                if (this.shouldIgnoreBackground() && !s) continue;
                const l = n.geometry, f = this.getSymbol(n.properties.symbolIndex);
                n.properties.textHaloRadius = zt(f.textHaloRadius) ? Sn.textHaloRadius : f.textHaloRadius;
                const c = n.properties.meshKey;
                if ("line" === f.textPlacement) {
                    if (!l.properties.line) continue;
                    o && this.startMeshCollision(n), this.en(n, i);
                    const {aOffset: t, aOpacity: e} = l.properties;
                    t.dirty && (l.updateData("aOffset", t), t.dirty = !1), e && e.dirty && (l.updateData("aOpacity", e), 
                    e.dirty = !1), o && this.endMeshCollision(c);
                } else if (o) {
                    this.startMeshCollision(n);
                    const {elements: t, aOpacity: e, visElemts: i} = l.properties;
                    i.count = 0, this.forEachBox(n, (t, e, n, o, a) => {
                        r(i, e, n, o);
                    }), e && e.dirty && l.updateData("aOpacity", e);
                    const o = i.count === t.length && l.count === t.length, a = !i.count && !l.count;
                    o || a || l.setElements(i, i.count), this.endMeshCollision(c);
                }
            }
        }
        isMeshIterable(t) {
            return t.isValid() && t.material && !t.material.get("isHalo") && !(this.shouldIgnoreBackground() && !this.layer.getRenderer().isForeground(t));
        }
        isMeshUniquePlaced(t) {
            if (!this.isMeshIterable(t)) return !1;
            return "line" !== this.getSymbol(t.properties.symbolIndex).textPlacement;
        }
        getUniqueEntryKey(t, e) {
            return Dn(t, e);
        }
        en(t, e) {
            const i = this.getMap(), r = t.geometry, o = r.properties, a = this.layer.getRenderer().isForeground(t);
            if (this.shouldIgnoreBackground() && !a) return;
            let s = o.line;
            if (!s) return;
            const l = 1 === t.material.uniforms.pitchWithMap, f = o.elements;
            if (!l) {
                const e = n.mat4.multiply(mi, i.projViewMatrix, t.localTransform), r = new Array(s.length);
                s = this.nn(r, s, e, i.width, i.height);
            }
            const c = this.Yt(), h = r.properties.visElemts = r.properties.visElemts || new f.constructor(f.length);
            c && (h.count = 0), this.forEachBox(t, (t, n, i, r) => {
                const {start: o, end: a} = n[0];
                let u = this.in(t, f, o, a, s, i, l ? e : null, r);
                if (c && (u = this.updateBoxCollisionFading(u, t, n, i, r), u)) {
                    let t = h.count;
                    for (let e = o; e < a; e++) h[t++] = f[e];
                    h.count = t;
                }
            }), !c || h.count === f.length && r.count === h.count || r.setElements(h, h.count);
        }
        nn(t, e, i, r, o) {
            const a = e.id + "-" + i.join();
            if (this.$e[a]) return this.$e[a];
            const s = function(t, e, i, r, o) {
                const a = [];
                for (let s = 0; s < e.length; s += 3) n.vec4.set(a, e[s], e[s + 1], e[s + 2], 1), 
                Xe(a, a, i, r, o), t[s] = a[0], t[s + 1] = a[1], t[s + 2] = e[s + 2];
                return t;
            }(t, e, i, r, o);
            return this.$e[a] = s, s;
        }
        forEachBox(t, e) {
            const i = this.getMap(), r = n.mat4.multiply(mi, i.projViewMatrix, t.localTransform), {collideIds: o, aCount: a, features: s, elements: l} = t.geometry.properties, f = o, c = this.isEnableUniquePlacement(), h = this.fe(1);
            h[0].allElements = l, h[0].mesh = t;
            let u = 0, d = l[0], m = 0, v = f[d];
            for (let n = 0; n <= l.length; n += 6) if (d = l[n], f[d] !== v || n === l.length) {
                const i = s[v] && s[v].feature;
                if (c && this.isMeshUniquePlaced(t) && i && !i.label) {
                    const e = i.properties || {};
                    e.$layer = i.layer, e.$type = i.type;
                    const r = Hi(this.qe[n] ? this.qe[n](null, e) : this.getSymbol(t.properties.symbolIndex).textName, e);
                    delete e.$layer, delete e.$type, i.label = r;
                }
                const o = n, p = a[l[m]];
                for (let n = m; n < o; n += 6 * p) h[0].start = n, h[0].end = n + 6 * p, h[0].boxCount = p, 
                e.call(this, t, h, r, u++);
                v = f[d], m = n;
            }
        }
        in(t, e, i, r, o, a, s) {
            const l = this.Yt(), f = this.getMap(), c = t.geometry, h = c.desc.positionSize, {aShape: u, aOffset: d, aAnchor: m} = c.properties, v = c.properties.aTextSize, p = !s, y = e[i] * h;
            let g = n.vec3.set(yi, m[y], m[y + 1], 2 === h ? 0 : m[y + 2]);
            const b = Xe(gi, g, a, f.width, f.height);
            if (n.vec4.set(bi, b[0], b[1], b[0], b[1]), f.isOffscreen(bi)) return l || Pi(d, e, i, r), 
            !1;
            p && (g = b);
            const _ = p ? 1 : c.properties.tileExtent / this.layer.options.tileSize[0];
            let A = !0;
            const x = e[i], S = e[r - 1], w = v ? v[x] : t.properties.textSize, M = this.rn(t, w, o, x, S, g, _, s);
            if (null === M) return Pi(d, e, i, r), !1;
            const T = S - x <= 3, O = t.material.uniforms, I = 1 === O.pitchWithMap, H = Math.floor(M / 2), P = M % 2;
            for (let a = i; a < r; a += 6) {
                const s = e[a];
                let f;
                if (f = H || a !== i || T ? H || a !== r - 6 || T ? oi.call(this, vi, t, w, o, s, g, _, H) : Ti : Mi, 
                !f) {
                    A = !1, l || Pi(d, e, i, r);
                    break;
                }
                let c = f[2];
                P && (c -= Math.PI / 2);
                const h = en(_i, c, 0, O.rotateWithMap, O.pitchWithMap);
                for (let t = 0; t < 4; t++) n.vec2.set(Ai, u[2 * (s + t)] / 10, u[2 * (s + t) + 1] / 10), 
                n.vec2.scale(Ai, Ai, w / 24), n.vec2.transformMat2(Ai, Ai, h), I ? (n.vec2.multiply(Ai, Ai, Si), 
                n.vec2.add(xi, Ai, f)) : (n.vec2.multiply(xi, f, Si), n.vec2.add(xi, Ai, xi)), wi[0] = 10 * xi[0], 
                wi[1] = 10 * xi[1], d[2 * (s + t)] === wi[0] && d[2 * (s + t) + 1] === wi[1] || (d.dirty = !0, 
                d[2 * (s + t)] = wi[0], d[2 * (s + t) + 1] = wi[1]);
            }
            return A;
        }
        rn(t, e, n, i, r, o, a, s) {
            const l = r - i <= 3, f = this.getMap();
            return l ? 0 : li.call(this, Mi, Ti, t, e, n, i, r, o, a, f.width / f.height, s);
        }
        isBoxCollides(t, e, n, i, r, o) {
            return this.isLabelCollides(0, t, e, n, i, r, o);
        }
        deleteMesh(t, e) {
            t && (e && (Array.isArray(t) ? t.forEach(t => {
                t && t.material && delete t.material.uniforms.texture;
            }) : t.material && delete t.material.uniforms.texture), super.deleteMesh(t, e));
        }
        delete() {
            super.delete(), this.tn.dispose(), delete this.$e, this.an && this.an.dispose();
        }
        needClearStencil() {
            return !0;
        }
        init() {
            const t = this.regl;
            this.renderer = new n.reshader.Renderer(t);
            const {uniforms: e, extraCommandProps: i} = On.call(this, this.layer, this.sceneConfig);
            this.shader = new n.reshader.MeshShader({
                vert: Ln,
                frag: zn,
                uniforms: e,
                extraCommandProps: i
            });
            let r = i;
            if (this.layer.getRenderer().isEnableWorkAround("win-intel-gpu-crash") && (r = Nt({}, i), 
            r.stencil = Nt({}, i.stencil), r.stencil.enable = !0), this.tn = new n.reshader.MeshShader({
                vert: fi,
                frag: zn,
                uniforms: e,
                extraCommandProps: r
            }), this.pickingFBO) {
                const t = new n.reshader.FBORayPicking(this.renderer, {
                    vert: "#define PICKING_MODE 1\n" + Ln,
                    uniforms: e,
                    extraCommandProps: {
                        viewport: this.pickingViewport
                    }
                }, this.pickingFBO);
                t.filter = t => {
                    const e = t.properties.symbolIndex;
                    return "line" !== this.getSymbol(e).textPlacement;
                };
                const i = new n.reshader.FBORayPicking(this.renderer, {
                    vert: "#define PICKING_MODE 1\n" + fi,
                    uniforms: e,
                    extraCommandProps: {
                        viewport: this.pickingViewport
                    }
                }, this.pickingFBO);
                i.filter = t => {
                    const e = t.properties.symbolIndex;
                    return "line" === this.getSymbol(e).textPlacement;
                }, this.picking = [ t, i ];
            }
        }
        getUniformValues(t) {
            const e = t.projViewMatrix, n = t.cameraToCenterDistance, i = [ t.width, t.height ];
            return {
                layerScale: this.layer.options.styleScale || 1,
                mapPitch: t.getPitch() * Math.PI / 180,
                mapRotation: t.getBearing() * Math.PI / 180,
                projViewMatrix: e,
                viewMatrix: t.viewMatrix,
                cameraToCenterDistance: n,
                canvasSize: i,
                glyphSize: 24,
                gammaScale: 1 * (this.layer.options.textGamma || 1),
                resolution: t.getResolution()
            };
        }
    }
    const Ii = /\{([\w_]+)\}/g;
    function Hi(t, e) {
        return t.replace(Ii, (function(t, n) {
            if (!e) return "";
            const i = e[n];
            return null == i ? "" : Array.isArray(i) ? i.join() : i;
        }));
    }
    function Pi(t, e, n, i) {
        for (let r = n; r < i; r += 6) {
            const n = e[r];
            for (let e = 0; e < 4; e++) (t[2 * (n + e)] || t[2 * (n + e) + 1]) && (t.dirty = !0, 
            t[2 * (n + e)] = 0, t[2 * (n + e) + 1] = 0);
        }
    }
    function Ci(t, e) {
        const n = t.uniforms.level - e.uniforms.level;
        return 0 === n ? t.properties.meshKey - e.properties.meshKey : n;
    }
    var Ei = "#define SHADER_NAME NATIVE_POINT\n#include <gl2_vert>\nattribute vec3 aPosition;\nuniform mat4 projViewModelMatrix;\nuniform float markerSize;\n#ifdef PICKING_MODE\n#include <fbo_picking_vert>\n#endif\nvoid main() {\n  gl_Position = projViewModelMatrix * vec4(aPosition, 1.);\n  gl_PointSize = markerSize;\n#ifdef PICKING_MODE\nfbo_picking_setData(gl_Position.w, true);\n#endif\n}";
    const Ri = {
        markerFill: [ 0, 0, 0 ],
        markerOpacity: 1,
        markerSize: 10
    };
    class Di extends Se {
        getPrimitive() {
            return "points";
        }
        createMesh(t, e) {
            const {geometry: i, symbolIndex: r, ref: o} = t, a = this.getSymbol(r);
            void 0 === o && i.generateBuffers(this.regl);
            const s = {};
            Vt(s, "markerOpacity", a, "markerOpacity", 1), Vt(s, "markerSize", a, "markerSize", 10), 
            Vt(s, "markerFill", a, "markerFill", "#000", Ut(this.colorCache, 3));
            const l = new n.reshader.Material(s, Ri);
            l.createDefines = () => "square" !== a.markerType ? {
                USE_CIRCLE: 1
            } : null, l.appendDefines = t => ("square" !== a.markerType && (t.USE_CIRCLE = 1), 
            t);
            const f = new n.reshader.Mesh(i, l, {
                castShadow: !1,
                picking: !0
            });
            return f.setLocalTransform(e), f.properties.symbolIndex = r, f;
        }
        init() {
            const t = this.regl;
            this.renderer = new n.reshader.Renderer(t);
            const e = {
                x: 0,
                y: 0,
                width: () => this.canvas ? this.canvas.width : 1,
                height: () => this.canvas ? this.canvas.height : 1
            }, i = this.layer.getRenderer().isEnableTileStencil && this.layer.getRenderer().isEnableTileStencil(), r = {
                vert: Ei,
                frag: "#define SHADER_NAME NATIVE_POINT\nprecision mediump float;\n#include <gl2_frag>\n#ifdef USE_CIRCLE\n#if __VERSION__ == 100\n#ifdef GL_OES_standard_derivatives\n#define STANDARD_DERIVATIVES_ENABLED 1\n#extension GL_OES_standard_derivatives : enable\n#endif\n#else\n#define STANDARD_DERIVATIVES_ENABLED 1\n#endif\n#endif\nuniform vec3 markerFill;\nuniform float markerOpacity;\nvoid main() {\n  float c = 1.;\n#ifdef USE_CIRCLE\nfloat r = .0, d = .0;\n  vec2 e = 2. * gl_PointCoord - 1.;\n  r = dot(e, e);\n  if(r > 1.) {\n    discard;\n  }\n#ifdef STANDARD_DERIVATIVES_ENABLED\nd = fwidth(r);\n  c = 1. - smoothstep(1. - d, 1. + d, r);\n#endif\n#endif\nglFragColor = vec4(markerFill, 1.) * markerOpacity * c;\n#if __VERSION__ == 100\ngl_FragColor = glFragColor;\n#endif\n}",
                uniforms: [ {
                    name: "projViewModelMatrix",
                    type: "function",
                    fn: function(t, e) {
                        const i = [];
                        return n.mat4.multiply(i, e.projViewMatrix, e.modelMatrix), i;
                    }
                } ],
                defines: null,
                extraCommandProps: {
                    viewport: e,
                    stencil: {
                        enable: !0,
                        func: {
                            cmp: () => i ? "=" : "<=",
                            ref: (t, e) => i ? e.stencilRef : e.level,
                            mask: 255
                        },
                        op: {
                            fail: "keep",
                            zfail: "keep",
                            zpass: "replace"
                        }
                    },
                    depth: {
                        enable: !0,
                        mask: !1,
                        range: this.sceneConfig.depthRange || [ 0, 1 ],
                        func: this.sceneConfig.depthFunc || "always"
                    },
                    blend: {
                        enable: !0,
                        func: this.getBlendFunc(),
                        equation: "add"
                    }
                }
            };
            this.shader = new n.reshader.MeshShader(r), this.shader.version = 300, this.pickingFBO && (this.picking = [ new n.reshader.FBORayPicking(this.renderer, {
                vert: "#define PICKING_MODE 1\n" + Ei,
                uniforms: [ {
                    name: "projViewModelMatrix",
                    type: "function",
                    fn: function(t, e) {
                        const i = [];
                        return n.mat4.multiply(i, e.projViewMatrix, e.modelMatrix), i;
                    }
                } ],
                extraCommandProps: {
                    viewport: this.pickingViewport
                }
            }, this.pickingFBO) ]);
        }
        getUniformValues(t) {
            return {
                projViewMatrix: t.projViewMatrix
            };
        }
    }
    var Ni = "#define SHADER_NAME NATIVE_LINE\nattribute vec3 aPosition;\nuniform mat4 projViewModelMatrix;\n#ifndef PICKING_MODE\n#if defined(HAS_COLOR)\nattribute vec4 aColor;\nvarying vec4 vColor;\n#endif\n#else\n#include <fbo_picking_vert>\n#endif\nvoid main() {\n  gl_Position = projViewModelMatrix * vec4(aPosition, 1.);\n#ifndef PICKING_MODE\n#if defined(HAS_COLOR)\nvColor = aColor / 255.;\n#endif\n#else\nfbo_picking_setData(gl_Position.w, true);\n#endif\n}";
    class ki extends Se {
        constructor(t, e, n, i, r) {
            if (super(t, e, n, i, r), this.primitive = "lines", Pt(this.symbolDef.lineColor)) {
                const t = e.getMap(), n = Et(this.symbolDef.lineColor);
                this.colorSymbol = e => n(t.getZoom(), e);
            }
        }
        needPolygonOffset() {
            return !0;
        }
        createMesh(t, e) {
            const {geometry: i, symbolIndex: r, ref: o} = t, a = this.getSymbol(r), s = this.getMeshUniforms(i, a);
            void 0 === o && i.generateBuffers(this.regl);
            const l = new n.reshader.Material(s), f = new n.reshader.Mesh(i, l, {
                castShadow: !1,
                picking: !0
            });
            return f.setLocalTransform(e), f.properties.symbolIndex = r, f;
        }
        getMeshUniforms(t, e) {
            const n = {};
            return Vt(n, "lineColor", e, "lineColor", "#000", Ut(this.colorCache)), Vt(n, "lineOpacity", e, "lineOpacity", 1), 
            n;
        }
        init() {
            const t = this.layer.getRenderer().isEnableTileStencil(), e = this.regl;
            this.renderer = new n.reshader.Renderer(e);
            const i = {
                x: 0,
                y: 0,
                width: () => this.canvas ? this.canvas.width : 1,
                height: () => this.canvas ? this.canvas.height : 1
            }, r = [ {
                name: "projViewModelMatrix",
                type: "function",
                fn: function(t, e) {
                    const i = [];
                    return n.mat4.multiply(i, e.projViewMatrix, e.modelMatrix), i;
                }
            } ], o = this.sceneConfig.depthRange, a = {
                vert: Ni,
                frag: "#define SHADER_NAME NATIVE_LINE\nprecision mediump float;\nuniform float lineOpacity;\nuniform vec4 lineColor;\n#if defined(HAS_COLOR)\nvarying vec4 vColor;\n#endif\nvoid main() {\n  gl_FragColor = lineColor * lineOpacity;\n#if defined(HAS_COLOR)\ngl_FragColor *= vColor;\n#endif\n}",
                uniforms: r,
                defines: null,
                extraCommandProps: {
                    viewport: i,
                    stencil: {
                        enable: !0,
                        mask: 255,
                        func: {
                            cmp: () => t ? "=" : "<=",
                            ref: (e, n) => t ? n.stencilRef : n.level,
                            mask: 255
                        },
                        op: {
                            fail: "keep",
                            zfail: "keep",
                            zpass: "replace"
                        }
                    },
                    depth: {
                        enable: !0,
                        range: o || [ 0, 1 ],
                        func: this.sceneConfig.depthFunc || "<="
                    },
                    blend: {
                        enable: !0,
                        func: this.getBlendFunc(),
                        equation: "add"
                    },
                    polygonOffset: {
                        enable: !0,
                        offset: this.getPolygonOffset()
                    }
                }
            };
            this.shader = new n.reshader.MeshShader(a), this.pickingFBO && (this.picking = [ new n.reshader.FBORayPicking(this.renderer, {
                vert: "#define PICKING_MODE 1\n" + Ni,
                uniforms: r,
                extraCommandProps: {
                    viewport: this.pickingViewport
                }
            }, this.pickingFBO) ]);
        }
        getUniformValues(t) {
            return {
                projViewMatrix: t.projViewMatrix
            };
        }
        getPrimitive() {
            return "lines";
        }
    }
    const Li = [ 1, 1, 1 ], zi = [ 1, 1, 1, 1 ], Fi = [ 0, 0 ];
    class Vi extends _e {
        supportRenderMode(t) {
            return this.isAnimating() ? "fxaa" === t || "fxaaAfterTaa" === t : "taa" === t || "fxaa" === t;
        }
        isAnimating() {
            return !1;
        }
        createMesh(t, e, {tilePoint: i, tileZoom: r}) {
            if (!this.material) return this.setToRedraw(), null;
            const {geometry: o, symbolIndex: a} = t, s = new n.reshader.Mesh(o, this.material);
            if (this.sceneConfig.animation) {
                Li[2] = .01;
                const t = [];
                n.mat4.fromScaling(t, Li), n.mat4.multiply(t, e, t), e = t;
            }
            const l = this.getSymbolDef(a), f = this.getFnTypeConfig(a);
            $t(o, l, f);
            const c = this.getShader(), h = c.getGeometryDefines ? c.getGeometryDefines(o) : {}, u = this.getSymbol(a);
            if (o.data.aExtrude) {
                h.IS_LINE_EXTRUSION = 1;
                const {tileResolution: t, tileRatio: e} = o.properties, n = this.getMap();
                Object.defineProperty(s.uniforms, "linePixelScale", {
                    enumerable: !0,
                    get: function() {
                        return e * n.getResolution() / t;
                    }
                }), Vt(s.uniforms, "lineWidth", u, "lineWidth", 4), Vt(s.uniforms, "lineOpacity", u, "lineOpacity", 1), 
                Vt(s.uniforms, "lineColor", u, "lineColor", "#fff", Ut(this.colorCache)), Object.defineProperty(s.uniforms, "lineHeight", {
                    enumerable: !0,
                    get: () => {
                        const t = this.dataConfig.defaultAltitude * (this.dataConfig.altitudeScale || 1);
                        return Xt(t) ? t : 0;
                    }
                });
            } else Vt(s.uniforms, "polygonFill", u, "polygonFill", zi, Ut(this.colorCache)), 
            Vt(s.uniforms, "polygonOpacity", u, "polygonOpacity", 1);
            if (o.data.aColor && (h.HAS_COLOR = 1), o.data.aLineWidth && (h.HAS_LINE_WIDTH = 1), 
            o.data.aLineHeight && (h.HAS_LINE_HEIGHT = 1), o.data.aOpacity) {
                const t = o.data.aOpacity;
                for (let e = 0; e < t.length; e++) if (t[e] < 255) {
                    o.properties.hasAlpha = !0;
                    break;
                }
            }
            o.generateBuffers(this.regl), s.setDefines(h), s.setLocalTransform(e), (o.properties.maxAltitude <= 0 || s.getUniform("level") >= 3) && (s.castShadow = !1), 
            s.setUniform("maxAltitude", s.geometry.properties.maxAltitude);
            const d = this.getMap(), m = d.getGLRes(), v = this.layer.getSpatialReference && this.layer.getSpatialReference(), p = (v ? v.getResolution(r) : d.getResolution(r)) / m;
            return Object.defineProperty(s.uniforms, "uvOrigin", {
                enumerable: !0,
                get: () => {
                    const t = this.getSymbol(a).material.uvScale || [ 1, 1 ], e = this.dataConfig.dataUVScale || [ 1, 1 ], n = t[0] * i[0] * p, r = t[1] * i[1] * p;
                    return [ n / (.5 * e[0]), r / (.5 * e[1]) ];
                }
            }), Object.defineProperty(s.uniforms, "uvOffset", {
                enumerable: !0,
                get: () => {
                    const t = this.getUVOffsetAnim(), e = this.getUVOffset(t);
                    return this.material && this.material.get("noiseTexture") && (e[0] *= -1), e;
                }
            }), Object.defineProperty(s.uniforms, "hasAlpha", {
                enumerable: !0,
                get: () => {
                    const t = this.getSymbol(a);
                    return o.properties.hasAlpha || t.polygonOpacity < 1;
                }
            }), s.properties.symbolIndex = a, s;
        }
        getUVOffsetAnim() {
            const t = this.getSymbols()[0];
            return t.material && t.material.uvOffsetAnim;
        }
        getUVOffset(t) {
            const e = this.getSymbols()[0], n = e.material && e.material.uvOffset || Fi, i = this.layer.getRenderer().getFrameTimestamp(), r = [ n[0], n[1] ], o = !!e.material && e.material.noiseTexture, a = o ? 5e5 : 1e3, s = o ? 256 : 1;
            return t && t[0] && (r[0] = i * t[0] % a / a * s), t && t[1] && (r[1] = i * t[1] % a / a * s), 
            r;
        }
        needPolygonOffset() {
            return this.sn;
        }
        startFrame(...t) {
            return delete this.sn, super.startFrame(...t);
        }
        addMesh(t, e) {
            t.forEach(t => {
                this.at(t, e);
            }), super.addMesh(...arguments);
        }
        at(t, e) {
            if (null !== e) {
                const i = t.localTransform;
                0 === e && (e = .01), Li[2] = e, n.mat4.fromScaling(i, Li), n.mat4.multiply(i, t.properties.tileTransform, i), 
                t.setLocalTransform(i);
            } else t.setLocalTransform(t.properties.tileTransform);
            t.material !== this.material && t.setMaterial(this.material), t.geometry.properties.maxAltitude <= 0 && (this.sn = !0), 
            this.getSymbol(t.properties.symbolIndex).ssr ? t.ssr = 1 : t.ssr = 0;
        }
        deleteMesh(t, e) {
            if (t) if (this.scene.removeMesh(t), Array.isArray(t)) for (let n = 0; n < t.length; n++) e || t[n].geometry.dispose(), 
            t[n].dispose(); else e || t.geometry.dispose(), t.dispose();
        }
        updateDataConfig(t, e) {
            return !("line-extrusion" === this.dataConfig.type && !t.altitudeProperty && !e.altitudeProperty);
        }
        createFnTypeConfig(t, e) {
            const n = Et(e.polygonFill || e.lineColor), i = Ct(e.polygonOpacity || e.lineOpacity), r = Ct(e.lineWidth), o = new Uint8Array(1), a = new Uint16Array(1), s = e.polygonFill ? "polygonFill" : e.lineColor ? "lineColor" : "polygonFill", l = e.polygonOpacity ? "polygonOpacity" : e.lineOpacity ? "lineOpacity" : "polygonOpacity";
            return [ {
                attrName: "aColor",
                type: Uint8Array,
                width: 4,
                symbolName: s,
                define: "HAS_COLOR",
                evaluate: e => {
                    let i = n(t.getZoom(), e);
                    return Array.isArray(i) || (i = this.colorCache[i] = this.colorCache[i] || bt(i).unitArray()), 
                    i = Gt(i), i;
                }
            }, {
                attrName: "aOpacity",
                type: Uint8Array,
                width: 1,
                symbolName: l,
                evaluate: (e, n, r) => {
                    const a = i(t.getZoom(), e);
                    return o[0] = 255 * a, o[0] < 255 && (r.properties.hasAlpha = !0), o[0];
                }
            }, {
                attrName: "aLineWidth",
                type: Uint8Array,
                width: 1,
                symbolName: "lineWidth",
                define: "HAS_LINE_WIDTH",
                evaluate: e => {
                    const n = r(t.getZoom(), e);
                    return a[0] = Math.round(2 * n), a[0];
                }
            } ];
        }
        getPolygonOffset() {
            return {
                enable: (t, e) => 0 === e.maxAltitude,
                offset: super.getPolygonOffset()
            };
        }
        updateSymbol(t, e) {
            const n = super.updateSymbol(t, e);
            return t.material && this.ln(t.material), n;
        }
        W(t, e) {
            return ji(t) !== ji(e);
        }
    }
    function ji(t) {
        if (!t || !t.material) return !1;
        for (const e in t.material) if (e.indexOf("Texture") > 0 && t.material[e]) return !0;
        return !1;
    }
    class Gi extends Vi {
        createGeometry(t) {
            const e = t.data, i = this.getSymbols()[0];
            if (i.material && i.material.extrusionOpacity) {
                const t = new Uint8Array(e.aPosition.length / 3);
                for (let n = 0; n < e.aPosition.length; n += 3) e.aPosition[n + 2] > 0 ? t[n / 3] = 0 : t[n / 3] = 1;
                e.aExtrusionOpacity = t;
            }
            const r = new n.reshader.Geometry(e, t.indices);
            return Nt(r.properties, t.properties), {
                geometry: r,
                symbolIndex: {
                    index: 0
                }
            };
        }
        updateSceneConfig(t) {
            let e;
            if (this.sceneConfig.cullFace !== t.cullFace && (e = !0), Nt(this.sceneConfig, t), 
            e) {
                const t = this.getShaderConfig();
                this.shader.dispose(), this.shader = new n.reshader.PhongShader(t);
            }
            this.setToRedraw();
        }
        getShader() {
            return this.shader;
        }
        delete(t) {
            this.getMap().off("updatelights", this.cn, this), super.delete(t), this.material.dispose();
        }
        init() {
            this.getMap().on("updatelights", this.cn, this);
            const t = this.regl;
            this.renderer = new n.reshader.Renderer(t);
            const e = this.getShaderConfig();
            this.shader = new n.reshader.PhongShader(e), this.ln();
            const i = {
                vert: this.getPickingVert(),
                uniforms: [ "projViewMatrix", "modelMatrix", "positionMatrix", {
                    name: "projViewModelMatrix",
                    type: "function",
                    fn: function(t, e) {
                        return n.mat4.multiply([], e.projViewMatrix, e.modelMatrix);
                    }
                } ],
                extraCommandProps: {
                    viewport: this.pickingViewport
                }
            };
            this.picking = [ new n.reshader.FBORayPicking(this.renderer, i, this.layer.getRenderer().pickingFBO) ];
        }
        cn() {
            this.setToRedraw();
        }
        getShaderConfig() {
            const t = this.canvas, e = {
                x: 0,
                y: 0,
                width: () => t ? t.width : 1,
                height: () => t ? t.height : 1
            };
            return {
                extraCommandProps: {
                    cull: {
                        enable: () => void 0 === this.sceneConfig.cullFace || !!this.sceneConfig.cullFace,
                        face: () => {
                            let t = this.sceneConfig.cullFace;
                            return !0 === t && (t = "back"), t || "back";
                        }
                    },
                    stencil: {
                        enable: !0,
                        func: {
                            cmp: "<=",
                            ref: (t, e) => e.level
                        },
                        op: {
                            fail: "keep",
                            zfail: "keep",
                            zpass: "replace"
                        }
                    },
                    depth: {
                        enable: !0,
                        range: this.sceneConfig.depthRange || [ 0, 1 ],
                        func: this.sceneConfig.depthFunc || "<="
                    },
                    blend: {
                        enable: !0,
                        func: {
                            src: "src alpha",
                            dst: "one minus src alpha"
                        },
                        equation: "add"
                    },
                    viewport: e,
                    polygonOffset: this.getPolygonOffset()
                }
            };
        }
        ln() {
            this.material && this.material.dispose();
            const t = this.getSymbols()[0].material, e = {};
            for (const n in t) Kt(t, n) && (e[n] = t[n]);
            this.material = new n.reshader.PhongMaterial(e);
        }
        getUniformValues(t, e) {
            const n = t.viewMatrix, i = t.projMatrix, r = t.cameraPosition, o = this.hn(), a = Nt({
                viewMatrix: n,
                projMatrix: i,
                cameraPosition: r,
                projViewMatrix: t.projViewMatrix
            }, o);
            e && e.jitter ? a.halton = e.jitter : a.halton = [ 0, 0 ];
            const s = this.layer.getRenderer().canvas;
            return a.outSize = [ s.width, s.height ], a;
        }
        getPickingVert() {
            return "\n            attribute vec3 aPosition;\n            uniform mat4 projViewModelMatrix;\n            uniform mat4 modelMatrix;\n            uniform mat4 positionMatrix;\n            //引入fbo picking的vert相关函数\n            #include <fbo_picking_vert>\n            #include <get_output>\n            void main()\n            {\n                mat4 localPositionMatrix = getPositionMatrix();\n                vec4 localPosition = getPosition(aPosition);\n\n                gl_Position = projViewModelMatrix * localPositionMatrix * localPosition;\n                //传入gl_Position的depth值\n                fbo_picking_setData(gl_Position.w, true);\n            }\n        ";
        }
        hn() {
            const t = this.getMap().getLightManager(), e = t && t.getAmbientLight() || {}, n = t && t.getDirectionalLight() || {};
            return {
                ambientColor: e.color || [ .2, .2, .2 ],
                light0_diffuse: [ ...n.color || [ .1, .1, .1 ], 1 ],
                lightSpecular: n.specular || [ .8, .8, .8 ],
                light0_viewDirection: n.direction || [ 1, 1, -1 ]
            };
        }
    }
    const Ui = [ 1, 1, 1 ];
    class Wi extends _e {
        constructor(t, e, n, i, r) {
            if (super(t, e, n, i, r), Pt(this.symbolDef[0].lineColor)) {
                const t = e.getMap(), n = Et(this.symbolDef.lineColor);
                this.colorSymbol = e => n(t.getZoom(), e);
            } else this.colorSymbol = this.getSymbol({
                index: 0
            }).lineColor || "#bbb";
        }
        createGeometry(t) {
            const {data: e, indices: i} = t, r = new n.reshader.Geometry(e, i, 0, {
                primitive: "lines"
            });
            return r.generateBuffers(this.regl), {
                geometry: r,
                symbolIndex: {
                    index: 0
                }
            };
        }
        createMesh(t, e) {
            const {geometry: i} = t, r = new n.reshader.Mesh(i);
            if (r.castShadow = !1, this.sceneConfig.animation) {
                Ui[2] = .01;
                const t = [];
                n.mat4.fromScaling(t, Ui), n.mat4.multiply(t, e, t), e = t;
            }
            return r.setLocalTransform(e), r.properties.symbolIndex = {
                index: 0
            }, r;
        }
        addMesh(t, e) {
            if (!t.length) return this;
            let i;
            null !== e ? (0 === e && (e = .01), i = t[0].localTransform, Ui[2] = e, n.mat4.fromScaling(i, Ui), 
            n.mat4.multiply(i, t[0].properties.tileTransform, i)) : i = t[0].properties.tileTransform;
            for (let e = 0; e < t.length; e++) t[e].setLocalTransform(i);
            return this.scene.addMesh(t), this;
        }
        init() {
            const t = this.regl;
            this.scene = new n.reshader.Scene, this.renderer = new n.reshader.Renderer(t);
            const e = {
                x: 0,
                y: 0,
                width: () => this.canvas ? this.canvas.width : 1,
                height: () => this.canvas ? this.canvas.height : 1
            }, i = {
                vert: "\n    attribute vec3 aPosition;\n    attribute vec4 aColor;\n\n    uniform mat4 projViewModelMatrix;\n    uniform vec2 outSize;\n\n    varying vec4 vColor;\n\n    void main()\n    {\n        gl_Position = projViewModelMatrix * vec4(aPosition, 1.0);\n        vColor = aColor / 255.0;\n    }\n",
                frag: "\n    #ifdef GL_ES\n        precision lowp float;\n    #endif\n\n    uniform float opacity;\n\n    varying vec4 vColor;\n\n    void main()\n    {\n        gl_FragColor = vColor * opacity;\n    }\n",
                uniforms: [ {
                    name: "projViewModelMatrix",
                    type: "function",
                    fn: function(t, e) {
                        const i = [];
                        return n.mat4.multiply(i, e.projViewMatrix, e.modelMatrix), i;
                    }
                }, "outSize", "opacity" ],
                extraCommandProps: {
                    stencil: {
                        enable: !0,
                        func: {
                            cmp: "<=",
                            ref: (t, e) => e.level
                        },
                        op: {
                            fail: "keep",
                            zfail: "keep",
                            zpass: "replace"
                        }
                    },
                    blend: {
                        enable: !0,
                        func: this.getBlendFunc(),
                        equation: "add"
                    },
                    viewport: e
                }
            };
            this.shader = new n.reshader.MeshShader(i);
        }
        getUniformValues(t) {
            const e = this.sceneConfig.opacity || .3, n = this.layer.getRenderer().canvas;
            return {
                projViewMatrix: t.projViewMatrix,
                outSize: [ n.width, n.height ],
                opacity: e
            };
        }
    }
    const {getPBRUniforms: Bi} = n.reshader.pbr.PBRUtils, Xi = [];
    class Yi extends Vi {
        constructor(...t) {
            super(...t), this.un = new n.reshader.ResourceLoader, this.scene.sortFunction = this.sortByCommandKey;
        }
        supportRenderMode(t) {
            return this.getSymbols()[0].ssr ? "fxaa" === t || "fxaaAfterTaa" === t : super.supportRenderMode(t);
        }
        isAnimating() {
            const t = this.dn();
            if (t && (t[0] || t[1])) return !0;
        }
        needToRedraw() {
            const t = this.dn();
            return !(!t || !t[0] && !t[1]) || super.needToRedraw();
        }
        dn() {
            const t = this.getSymbols()[0];
            return t.material && t.material.uvOffsetAnim;
        }
        createGeometry(t) {
            if (!t.data || !t.data.aPosition || !t.data.aPosition.length) return null;
            const e = new n.reshader.Geometry(t.data, t.indices, 0, {
                uv0Attribute: "aTexCoord0"
            });
            return Nt(e.properties, t.properties), {
                geometry: e,
                symbolIndex: {
                    index: 0
                }
            };
        }
        paint(t) {
            const e = !!t.shadow;
            t.states && t.states.includesChanged && (this.shader.dispose(), delete this.shader, 
            this.it(t));
            let n = !!t.ssr && this.getSymbols()[0].ssr;
            const i = this.shader, r = i.shaderDefines;
            if (n) {
                const e = Nt({}, r, t.ssr.defines);
                i.shaderDefines = e;
            }
            if (t.onlyUpdateDepthInTaa && (this.shader = this.mn, !n && this.vn && (this.shader = i, 
            this.setToRedraw(!0))), this.updateIBLDefines(i), super.paint(t), void 0 !== this.shadowCount && e) {
                const t = this.scene.getMeshes().length;
                this.shadowCount !== t && this.setToRedraw();
            }
            this.shader = i, n && (i.shaderDefines = r), delete this.shadowCount;
            const o = this.dn();
            if (o && (o[0] || o[1])) this.material.set("uvOffset", [ 0, 0 ]); else {
                const t = this.getUVOffset(o);
                this.material.set("uvOffset", t);
            }
            this.vn = n;
        }
        getShadowMeshes() {
            if (!this.isVisible()) return Xi;
            this.shadowCount = this.scene.getMeshes().length;
            const t = this.scene.getMeshes().filter(t => 0 === t.getUniform("level"));
            for (let e = 0; e < t.length; e++) {
                const n = t[e];
                n.material !== this.material && n.setMaterial(this.material);
            }
            return t;
        }
        updateSceneConfig(t) {
            Nt(this.sceneConfig, t), this.setToRedraw();
        }
        delete() {
            super.delete(), this.disposeIBLTextures(), this.material.dispose(), this.pn && this.pn.dispose(), 
            this.shader && (this.shader.dispose(), delete this.shader), this.mn && (this.mn.dispose(), 
            delete this.mn);
        }
        init(t) {
            this.getMap().on("updatelights", this.yn, this), this.createIBLTextures(), this.st = this.st || t;
            const e = this.regl;
            this.renderer = new n.reshader.Renderer(e), this.gn = this.bn.bind(this), this._n = this.disposeCachedTexture.bind(this), 
            this.An = this.xn.bind(this), this.ln(), this.it(t);
            const i = {
                vert: "\n                attribute vec3 aPosition;\n                uniform mat4 projViewModelMatrix;\n                uniform mat4 positionMatrix;\n                //引入fbo picking的vert相关函数\n                #include <line_extrusion_vert>\n                #include <get_output>\n                #include <fbo_picking_vert>\n                void main() {\n                    mat4 localPositionMatrix = getPositionMatrix();\n                    #ifdef IS_LINE_EXTRUSION\n                        vec3 linePosition = getLineExtrudePosition(aPosition);\n                        vec4 localVertex = getPosition(linePosition);\n                    #else\n                        vec4 localVertex = getPosition(aPosition);\n                    #endif\n\n                    gl_Position = projViewModelMatrix * localPositionMatrix * localVertex;\n                    fbo_picking_setData(gl_Position.w, true);\n                }\n            ",
                uniforms: [ {
                    name: "projViewModelMatrix",
                    type: "function",
                    fn: (t, e) => n.mat4.multiply([], e.projViewMatrix, e.modelMatrix)
                } ],
                extraCommandProps: {
                    viewport: this.pickingViewport
                }
            };
            this.picking = [ new n.reshader.FBORayPicking(this.renderer, i, this.layer.getRenderer().pickingFBO) ];
        }
        it(t) {
            const e = {
                x: 0,
                y: 0,
                width: () => this.canvas ? this.canvas.width : 1,
                height: () => this.canvas ? this.canvas.height : 1
            }, i = {}, r = [];
            r.push(...n.reshader.SsrPass.getUniformDeclares()), this.fillIncludes(i, r, t);
            const o = {
                cull: {
                    enable: () => void 0 === this.sceneConfig.cullFace || !!this.sceneConfig.cullFace,
                    face: this.sceneConfig.cullFace || "back"
                },
                stencil: {
                    enable: (t, e) => void 0 === e.hasAlpha || !!e.hasAlpha,
                    func: {
                        cmp: "<=",
                        ref: (t, e) => e.level
                    },
                    op: {
                        fail: "keep",
                        zfail: "keep",
                        zpass: "replace"
                    }
                },
                viewport: e,
                depth: {
                    enable: !0,
                    range: this.sceneConfig.depthRange || [ 0, 1 ],
                    func: this.sceneConfig.depthFunc || "<="
                },
                blend: {
                    enable: (t, e) => void 0 === e.hasAlpha || !!e.hasAlpha,
                    func: {
                        src: "src alpha",
                        dst: "one minus src alpha"
                    },
                    equation: "add"
                },
                polygonOffset: this.getPolygonOffset()
            }, a = {
                uniforms: r,
                defines: this.Sn(i),
                extraCommandProps: o
            };
            this.shader = new n.reshader.pbr.StandardShader(a), a.frag = "\n            precision mediump float;\n            #include <gl2_frag>\n            void main() {\n                glFragColor = vec4(0.0);\n                #if __VERSION__ == 100\n                    gl_FragColor = glFragColor;\n                #endif\n            }\n        ", 
            this.mn = new n.reshader.pbr.StandardShader(a);
        }
        bn({resources: t}) {
            for (let e = 0; e < t.length; e++) this.addCachedTexture(t[e].url, t[e].data);
            this.setToRedraw(!0);
        }
        xn() {
            this.setToRedraw(!0);
        }
        ln(t) {
            const e = t || this.getSymbols()[0].material, i = {};
            let r = !1;
            for (const t in e) if (Kt(e, t)) if (t.indexOf("Texture") > 0) {
                let o = e[t];
                if (!o) {
                    i[t] = void 0;
                    continue;
                }
                const a = "string" == typeof o ? o : o.url, s = this.getCachedTexture(a);
                s ? s.then ? a === o ? o = {
                    promise: s,
                    wrap: "repeat"
                } : o.promise = s : a === o ? o = {
                    data: s,
                    wrap: "repeat"
                } : o.data = s : a === o && (o = {
                    url: a,
                    wrap: "repeat"
                }), o.flipY = !0, i[t] = new n.reshader.Texture2D(o, this.un), i[t].once("complete", this.gn), 
                i[t].once("disposed", this._n), i[t].promise && this.addCachedTexture(a, i[t].promise), 
                r = !0;
            } else i[t] = e[t];
            if (this.material) {
                for (let t in i) this.material.set(t, i[t]);
                this.setToRedraw(!0);
            } else this.material = new n.reshader.pbr.StandardMaterial(i), this.material.once("complete", this.An);
            r || this.xn();
        }
        getShader() {
            return this.shader;
        }
        getUniformValues(t, e) {
            const {iblTexes: n, dfgLUT: i} = this.getIBLRes(), r = Bi(t, n, i, e && e.ssr, e && e.jitter);
            return this.setIncludeUniformValues(r, e), r;
        }
        Sn(t) {
            return this.hasIBL() ? t.HAS_IBL_LIGHTING = 1 : delete t.HAS_IBL_LIGHTING, t;
        }
        yn() {
            if (!this.shader) return;
            const t = this.shader.shaderDefines;
            this.Sn(t), this.shader.shaderDefines = t;
        }
    }
    const Ki = [], qi = [], Ji = [ 0, 0, 0 ], Zi = [ 0, 0, 0 ], $i = [ 1, 1, 1 ], Qi = [], tr = [ 1, 1, 1, 1 ], er = [], nr = t => class extends t {
        constructor(t, e, n, i, r) {
            super(t, e, n, i, r), this.wn = !1, this.scene.sortFunction = this.sortByCommandKey, 
            this.Mn = [];
        }
        isAnimating() {
            const t = this.getSymbols();
            for (let e = 0; e < t.length; e++) {
                if (t[e] && this.Tn[e] && this.On(e)) return !0;
            }
            return !1;
        }
        createGeometry(t, e) {
            if (this.In(), !this.wn) return null;
            const {data: n, positionSize: i} = t;
            return {
                geometry: {
                    properties: Nt({}, t.properties),
                    data: n,
                    positionSize: i,
                    features: e
                },
                symbolIndex: t.symbolIndex
            };
        }
        getFnTypeConfig() {
            return Qi;
        }
        createMesh(t, e, {tileTranslationMatrix: i, tileExtent: r}) {
            const o = this.getMap(), {geometry: a} = t, {positionSize: s, features: l} = a, {aPosition: f} = a.data, c = f.length / s;
            if (0 === c) return null;
            const h = {
                instance_vectorA: new Float32Array(4 * c),
                instance_vectorB: new Float32Array(4 * c),
                instance_vectorC: new Float32Array(4 * c),
                aPickingId: []
            };
            this.Hn(h, i, r, a.properties.z, f, s);
            const u = {};
            for (const t in h) u[t] = {
                buffer: this.regl.buffer({
                    dimension: h[t].length / c,
                    data: h[t]
                }),
                divisor: 1
            };
            const d = [], m = this.getSymbols();
            for (let t = 0; t < m.length; t++) {
                const e = m[t], r = this.Mn[t];
                if (!r) continue;
                const {translation: a, rotation: s, scale: f, fixSizeOnZoom: v} = e, p = this.Pn([], a, s, f);
                let y = 0;
                r.forEach(t => {
                    const {geometry: i, nodeMatrix: r} = t, o = n.mat4.multiply(er, p, r), a = i.boundingBox.copy();
                    a.transform(o);
                    const s = this.Cn(a, e);
                    s > y && (y = s);
                });
                const g = [ 0, 0, y ], b = r.map(r => {
                    const {geometry: a, nodeMatrix: s, materialInfo: f, skin: d, morphWeights: m, extraInfo: y} = r, b = new (this.getMaterialClazz(f))(f), _ = {}, A = new n.reshader.InstancedMesh(u, c, a, b, {
                        transparent: !1,
                        picking: !0
                    });
                    d && (A.setUniform("jointTexture", d.jointTexture), A.setUniform("jointTextureSize", d.jointTextureSize), 
                    A.setUniform("numJoints", d.numJoints), A.setUniform("skinAnimation", 0), _.HAS_SKIN = 1), 
                    m && (A.setUniform("morphWeights", m), _.HAS_MORPH = 1), A.setUniform("hasAlpha", y.alphaMode && "BLEND" === y.alphaMode.toUpperCase()), 
                    Vt(A.uniforms, "polygonFill", e, "polygonFill", tr, Ut(this.colorCache)), Vt(A.uniforms, "polygonOpacity", e, "polygonOpacity", 1);
                    const x = n.mat4.multiply([], p, s), S = [];
                    return n.mat4.fromTranslation(S, g), n.mat4.multiply(x, S, x), A.setPositionMatrix(() => {
                        if (Xt(v)) {
                            const t = o.getGLScale() / o.getGLScale(v);
                            return n.vec3.set(Ki, t, t, t), n.mat4.fromScaling(S, Ki), n.mat4.multiply(S, S, x);
                        }
                        return x;
                    }), A.setLocalTransform(i), a.generateBuffers(this.regl, {
                        excludeElementsInVAO: !0
                    }), h.instance_color && (_.HAS_INSTANCE_COLOR = 1), A.properties.features = l, A.setDefines(_), 
                    A.properties.symbolIndex = {
                        index: t
                    }, A;
                });
                d.push(...b);
            }
            return d.insContext = {
                instanceData: h,
                tileTranslationMatrix: i,
                tileExtent: r,
                aPosition: f,
                positionSize: s
            }, d;
        }
        Cn(t, e) {
            const n = e.anchorZ || "bottom";
            let i = 0;
            return "bottom" === n ? i = -t.min[2] : "top" === n ? i = -t.max[2] : "center" === n && (i = -(t.min[2] + t.max[2]) / 2), 
            i;
        }
        addMesh(t) {
            if (!t) return null;
            if (t[0].properties.level > 2) return null;
            for (let e = 0; e < t.length; e++) {
                if (!t[e] || !t[e].geometry) continue;
                const n = this.On(t[e].properties.symbolIndex.index);
                t[e].setUniform("skinAnimation", +n);
            }
            return this.scene.addMesh(t), this;
        }
        prepareRender(t) {
            const e = this.getSymbols();
            let n = !1;
            for (let i = 0; i < e.length; i++) {
                const r = e[i];
                if (!r || !this.Tn[i]) continue;
                if (this.On(i) && this.Tn[i]) {
                    n || (n = !0);
                    let e = r.speed;
                    const o = !!r.loop;
                    zt(e) && (e = 1), this.Tn[i].updateAnimation(t.timestamp, o, e);
                }
            }
            n && this.setToRedraw(!0), super.prepareRender(t);
        }
        getShadowMeshes() {
            if (!this.isVisible()) return Qi;
            this.shadowCount = this.scene.getMeshes().length;
            return this.scene.getMeshes().filter(t => 0 === t.getUniform("level"));
        }
        On(t) {
            const e = this.getSymbols()[t];
            return e && e.animation && this.Tn[t] && this.Tn[t].hasSkinAnimation();
        }
        Hn(t, e, i, r, o, a) {
            function s(e, n, i, r) {
                t[e][4 * n] = i[r], t[e][4 * n + 1] = i[r + 4], t[e][4 * n + 2] = i[r + 8], t[e][4 * n + 3] = i[r + 12];
            }
            const l = o.length / a, f = this.layer.getTileSize().width / i * this.layer.getRenderer().getTileGLScale(r), c = this.layer.getRenderer().getZScale(), h = [], u = [];
            for (let e = 0; e < l; e++) {
                const i = n.vec3.set(h, o[e * a] * f, -o[e * a + 1] * f, 2 === a ? 0 : o[e * a + 2] * c);
                n.mat4.fromTranslation(u, i), s("instance_vectorA", e, u, 0), s("instance_vectorB", e, u, 1), 
                s("instance_vectorC", e, u, 2), t.aPickingId[e] = e;
            }
        }
        getShaderConfig() {
            const t = super.getShaderConfig();
            return t.positionAttribute = "POSITION", t.normalAttribute = "NORMAL", t;
        }
        init(t) {
            super.init(t), this.In();
        }
        In() {
            if (this.Tn) return;
            this.Tn = [];
            const t = this.layer.getRenderer(), e = this.getSymbols();
            this.En = 0;
            for (let i = 0; i < e.length; i++) {
                const r = e[i].url;
                if (t.isCachePlaced(r)) continue;
                const o = t.fetchCache(r);
                o ? (this.Tn[i] = [ o ], this.Mn[i] = o.getMeshesInfo(), this.En++, t.addToCache(r)) : (t.placeCache(r), 
                n.reshader.GLTFHelper.load(r).then(o => {
                    const a = n.reshader.GLTFHelper.exportGLTFPack(o, this.regl);
                    this.Tn[i] = [ a ], this.Mn[i] = a.getMeshesInfo(), t.addToCache(r, a, t => {
                        t.dispose();
                    }), this.En++, this.En >= e.length && (this.wn = !0), this.setToRedraw(!0);
                }));
            }
            this.En >= e.length && (this.wn = !0);
        }
        getPickingVert() {
            return "\n    attribute vec3 aPosition;\n    uniform mat4 projViewModelMatrix;\n    uniform mat4 modelMatrix;\n    uniform mat4 positionMatrix;\n    //引入fbo picking的vert相关函数\n    #include <fbo_picking_vert>\n    #include <get_output>\n    void main()\n    {\n        mat4 localPositionMatrix = getPositionMatrix();\n        vec4 localPosition = getPosition(aPosition);\n\n        gl_Position = projViewModelMatrix * localPositionMatrix * localPosition;\n        //传入gl_Position的depth值\n        fbo_picking_setData(gl_Position.w, true);\n    }";
        }
        deleteMesh(t) {
            if (t) {
                this.scene.removeMesh(t);
                for (let e = 0; e < t.length; e++) t[e].disposeInstanceData(), t[e].dispose();
            }
        }
        delete() {
            super.delete();
            const t = this.getSymbols()[0].url;
            if (this.layer.getRenderer().removeCache(t), this.Mn) for (let t = 0; t < this.Mn.length; t++) {
                const e = this.Mn[t];
                for (let n = 0; n < e.length; n++) {
                    const n = e[t], {geometry: i, materialInfo: r} = n;
                    if (i && i.dispose(), r) for (const t in r) r[t] && r[t].destroy && r[t].destroy();
                }
            }
        }
        Pn(t, e, i, r) {
            const o = n.vec3.set(Ki, ...e || Ji), a = i || Zi, s = r || $i, l = n.quat.fromEuler(qi, a[0], a[1], a[2]);
            return n.mat4.fromRotationTranslationScale(t, l, o, s);
        }
    };
    class ir extends(nr(Gi)){
        getMaterialClazz(t) {
            return t.diffuseFactor ? n.reshader.PhongSpecularGlossinessMaterial : n.reshader.PhongMaterial;
        }
    }
    class rr extends(nr(Yi)){
        getMaterialClazz(t) {
            return t.specularGlossinessTexture || t.diffuseTexture ? n.reshader.pbr.StandardSpecularGlossinessMaterial : n.reshader.pbr.StandardMaterial;
        }
    }
    const or = {
        color: [ 2.0303, 2.028, 2.028 ],
        direction: [ 0, -.2717, -1 ]
    }, ar = {
        index: 0
    }, sr = [ 0, 0, 0 ];
    class lr extends Se {
        supportRenderMode(t) {
            return "fxaa" === t || "fxaaBeforeTaa" === t;
        }
        needPolygonOffset() {
            return !0;
        }
        needToRedraw() {
            return this.getSymbol(ar).animation;
        }
        createMesh(t, e) {
            const {geometry: i} = t;
            i.generateBuffers(this.regl);
            const r = new n.reshader.Mesh(i, null, {
                castShadow: !1,
                picking: !0
            });
            return r.properties.symbolIndex = ar, r.setLocalTransform(e), r;
        }
        callShader(t, e) {
            super.callShader(t, e), this.transformWater();
            const n = this.Rn(this.getMap(), e);
            this.renderer.render(this.Dn, n, this.Nn, this.getRenderFBO(e));
        }
        addMesh(t, e) {
            this.at(t, e), super.addMesh(...arguments);
        }
        at(t) {
            const e = this.getSymbol(ar).ssr;
            for (let n = 0; n < t.length; n++) t[n].ssr = e ? 1 : 0;
        }
        paint(t) {
            t.states && t.states.includesChanged && (this.shader.dispose(), this.Dn.dispose(), 
            this.it(t));
            const e = !!t.ssr && this.getSymbol(ar).ssr, n = this.Dn, i = n.shaderDefines;
            if (e) {
                const e = Nt({}, i, t.ssr.defines);
                n.shaderDefines = e;
            }
            this.updateIBLDefines(n), this.kn.ssr = e ? 1 : 0, super.paint(t), e && (n.shaderDefines = i);
        }
        init(t) {
            this.createIBLTextures();
            const e = this.regl;
            this.renderer = new n.reshader.Renderer(e), this.createGround(), this.it(t), this.pickingFBO && (this.picking = [ new n.reshader.FBORayPicking(this.renderer, {
                vert: we,
                uniforms: [ {
                    name: "projViewModelMatrix",
                    type: "function",
                    fn: function(t, e) {
                        const i = [];
                        return n.mat4.multiply(i, e.projViewMatrix, e.modelMatrix), i;
                    }
                } ],
                extraCommandProps: {
                    viewport: this.pickingViewport
                }
            }, this.pickingFBO) ]), this.Ln();
        }
        Ln() {
            const t = this.regl;
            this.zn = t.texture(2), this.Fn = [ 2, 2 ];
            const e = this.getSymbol({
                index: 0
            }), n = e.texWaveNormal, i = this.getCachedTexture(n), r = this;
            if (i) i.loading || (this.Vn = this.jn(t, i)); else {
                const e = new Image;
                e.loading = !0, e.onload = function() {
                    delete this.loading, r.Vn = r.jn(t, this), this.Fn = [ this.width, this.height ], 
                    r.setToRedraw();
                }, e.onerror = () => {
                    console.error("invalid water wave normal texture:" + n);
                }, this.addCachedTexture(n, e), e.src = n;
            }
            const o = e.texWavePerturbation, a = this.getCachedTexture(o);
            if (a) a.loading || (this.Gn = this.jn(t, a)); else {
                const e = new Image;
                e.loading = !0, e.onload = function() {
                    delete this.loading, r.Gn = r.jn(t, this), this.Fn = [ this.width, this.height ], 
                    r.setToRedraw();
                }, e.onerror = () => {
                    console.error("invalid water wave perturbation texture:" + o);
                }, this.addCachedTexture(o, e), e.src = o;
            }
        }
        jn(t, e) {
            return this.zn ? t.texture({
                width: this.Fn[0],
                height: this.Fn[1],
                mag: "linear",
                min: "linear mipmap linear",
                wrapS: "repeat",
                wrapT: "repeat",
                flipY: !0,
                data: e
            }) : null;
        }
        it(t) {
            const e = this.canvas, i = [ {
                name: "projViewModelMatrix",
                type: "function",
                fn: function(t, e) {
                    const i = [];
                    return n.mat4.multiply(i, e.projViewMatrix, e.modelMatrix), i;
                }
            }, {
                name: "modelViewNormalMatrix",
                type: "function",
                fn: (t, e) => {
                    const i = n.mat4.multiply([], e.viewMatrix, e.modelMatrix), r = n.mat4.invert(i, i), o = n.mat4.transpose(r, r);
                    return n.mat3.fromMat4([], o);
                }
            }, {
                name: "modelViewMatrix",
                type: "function",
                fn: (t, e) => n.mat4.multiply([], e.viewMatrix, e.modelMatrix)
            } ], r = {
                TIME_NOISE_TEXTURE_REPEAT: .3737
            };
            this.fillIncludes(r, i, t);
            const o = {
                x: 0,
                y: 0,
                width: () => e ? e.width : 1,
                height: () => e ? e.height : 1
            }, a = this.sceneConfig.depthRange;
            this.shader = new n.reshader.MeshShader({
                vert: "\n                attribute vec3 aPosition;\n\n                uniform mat4 projViewModelMatrix;\n\n                void main() {\n                    gl_Position = projViewModelMatrix * vec4(aPosition, 1.);\n                }\n            ",
                frag: "\n    #define SHADER_NAME WATER_STENCIL\n    precision mediump float;\n    void main() {\n        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n    }\n",
                uniforms: [ {
                    name: "projViewModelMatrix",
                    type: "function",
                    fn: function(t, e) {
                        const i = [];
                        return n.mat4.multiply(i, e.projViewMatrix, e.modelMatrix), i;
                    }
                } ],
                extraCommandProps: {
                    viewport: o,
                    colorMask: [ !1, !1, !1, !1 ],
                    stencil: {
                        enable: !0,
                        mask: 255,
                        func: {
                            cmp: "<=",
                            ref: 254,
                            mask: 255
                        },
                        op: {
                            fail: "keep",
                            zfail: "keep",
                            zpass: "replace"
                        }
                    },
                    depth: {
                        enable: !0,
                        range: a || [ 0, 1 ],
                        func: this.sceneConfig.depthFunc || "<="
                    },
                    polygonOffset: {
                        enable: !0,
                        offset: this.getPolygonOffset()
                    }
                }
            });
            const s = {
                viewport: o,
                stencil: {
                    enable: !0,
                    mask: 255,
                    func: {
                        cmp: "==",
                        ref: 254,
                        mask: 255
                    },
                    op: {
                        fail: "keep",
                        zfail: "keep",
                        zpass: "replace"
                    }
                },
                depth: {
                    enable: !1
                }
            };
            i.push(...n.reshader.SsrPass.getUniformDeclares()), this.Dn = new n.reshader.MeshShader({
                vert: "#define SHADER_NAME WATER\nuniform mat4 modelMatrix;\nuniform mat4 projViewModelMatrix;\nattribute vec3 aPosition;\nattribute vec2 aTexCoord;\nuniform vec2 uvOffset;\nuniform vec2 noiseUvOffset;\nuniform vec2 uvScale;\nvarying vec2 vUv;\nvarying vec2 vNoiseUv;\nvarying vec3 vPos;\nvarying mat3 vTbnMatrix;\n#ifdef HAS_SSR\nuniform mat4 modelViewMatrix;\nvarying vec4 vViewVertex;\n#endif\nmat3 c(in vec3 d) {\n  vec3 t = normalize(cross(d, vec3(.0, 1., .0)));\n  vec3 e = normalize(cross(d, t));\n  return mat3(t, e, d);\n}\n#if defined(HAS_SHADOWING)\n#include <vsm_shadow_vert>\n#endif\nconst vec3 f = vec3(0., 0., 1.);\nvoid main(void) {\n  vec4 h = vec4(aPosition, 1.);\n  vec4 i = modelMatrix * h;\n  vPos = i.xyz;\n  vTbnMatrix = c(f);\n  gl_Position = projViewModelMatrix * h;\n  vUv = aTexCoord * uvScale + uvOffset;\n  vNoiseUv = aTexCoord * uvScale * TIME_NOISE_TEXTURE_REPEAT + noiseUvOffset;\n#ifdef HAS_SSR\nvec4 j = modelViewMatrix * h;\n  vViewVertex = j;\n#endif\n#if defined(HAS_SHADOWING)\nshadow_computeShadowPars(h);\n#endif\n}",
                frag: "#define SHADER_NAME WATER\nprecision highp float;\nprecision highp sampler2D;\n#include <hsv_frag>\nuniform vec3 hsv;\nuniform float contrast;\n#if defined(HAS_SHADOWING)\n#include <vsm_shadow_frag>\n#endif\n#if defined(HAS_IBL_LIGHTING)\nuniform vec3 hdrHsv;\nuniform samplerCube specularPBR;\nuniform float rgbmRange;\nuniform vec3 diffuseSPH[9];\n#else\nuniform vec3 ambientColor;\n#endif\nstruct PBRShadingWater {\n  float NdotL;\n  float NdotV;\n  float NdotH;\n  float VdotH;\n  float LdotH;\n  float VdotN;\n};\nvec3 c(const in vec4 d, const in float e) {\n  if(e <= .0)\n    return d.rgb;\n  return e * d.rgb * d.a;\n}\n#ifdef HAS_SSR\nvarying vec4 vViewVertex;\nuniform mat3 modelViewNormalMatrix;\nuniform sampler2D TextureDepth;\nuniform highp vec2 outSize;\nuniform float ssrFactor;\nuniform float ssrQuality;\nuniform sampler2D TextureReflected;\nuniform highp mat4 projMatrix;\nuniform mat4 invProjMatrix;\nuniform vec4 outputFovInfo[2];\nuniform mat4 reprojViewProjMatrix;\nuniform vec2 cameraNearFar;\nfloat f(const in vec4 h) {\n  return h.r + h.g / 255.;\n}\nfloat i(const in vec2 j, const in float k) {\n  vec3 l = vec3(.06711056, .00583715, 52.9829189);\n  return fract(l.z * fract(dot(j.xy + k * vec2(47., 17.) * .695, l.xy))) * .5;\n}\nvec3 m(const in float n, const in float o, const in vec2 u) {\n  float v = min(o - .01, n);\n  float A = floor(v);\n  float B = min(o, A + 1.);\n  float C = pow(2., B);\n  vec2 D = 2. * C / u;\n  if(v - A > .5)\n    C *= 2.;\n  return vec3(D, C);\n}\nvec2 E(const in vec2 F, const in vec3 G) {\n  vec2 H = max(G.xy, min(1. - G.xy, F));\n  return vec2(2. * H.x, G.z - 1. - H.y) / G.z;\n}\nvec3 I(const in mat4 J, const in vec3 K) {\n  vec4 L = J * vec4(K, 1.);\n  return vec3(.5 + .5 * L.xy / L.w, L.w);\n}\nvec3 M(const in float N, const in vec2 H) {\n  return texture2D(TextureReflected, H).rgb;\n}\nfloat O(float P) {\n  highp mat4 J = projMatrix;\n  highp float z = P * 2. - 1.;\n  return -J[3].z / (z + J[2].z);\n}\nfloat Q(const vec2 H) {\n  float P = f(texture2D(TextureDepth, H));\n  return P;\n}\nvec3 R(const in float k, const in vec3 S, const in vec3 T, const in vec3 U, const in vec3 V, const in float W) {\n  vec2 X;\n  X.x = i(gl_FragCoord.yx, k);\n  X.y = fract(X.x * 52.9829189);\n  X.y = mix(X.y, 1., .7);\n  float Y = 2. * 3.14159 * X.x;\n  float Z = pow(max(X.y, .000001), W / (2. - W));\n  float ba = sqrt(1. - Z * Z);\n  vec3 bb = vec3(ba * cos(Y), ba * sin(Y), Z);\n  bb = bb.x * S + bb.y * T + bb.z * U;\n  return normalize((2. * dot(V, bb)) * bb - V);\n}\nfloat bc(const in float k) {\n  return (i(gl_FragCoord.xy, k) - .5);\n}\nvec3 bd(const in vec3 be, const in float bf, const in vec3 bg) {\n  vec3 bh = I(projMatrix, vViewVertex.xyz + bg * bf);\n  bh.z = 1. / bh.z;\n  bh -= be;\n  float bi = min(1., .99 * (1. - be.x) / max(1e-5, bh.x));\n  float bj = min(1., .99 * (1. - be.y) / max(1e-5, bh.y));\n  float bk = min(1., .99 * be.x / max(1e-5, -bh.x));\n  float bl = min(1., .99 * be.y / max(1e-5, -bh.y));\n  return bh * min(bi, bj) * min(bk, bl);\n}\nfloat bm(const in vec3 be, const in vec3 bh, inout float bn, inout float bo) {\n  float bp = (bo + bn) * .5;\n  vec3 bq = be + bh * bp;\n  float z = Q(bq.xy);\n  float P = O(z);\n  float br = -1. / bq.z;\n  bn = P > br ? bn : bp;\n  bo = P > br ? bp : bo;\n  return bp;\n}\nvec4 bs(const in vec3 be, const in float bf, in float bt, const in vec3 bg, const in float bu, const in float k) {\n  const int bv = 20;\n  float bw = 1. / float(bv);\n  bt *= bw;\n  vec3 bh = bd(be, bf, bg);\n  float bx = bw;\n  vec3 by = vec3(.0, bx, 1.);\n  vec3 bq;\n  float z, P, br, bz, bA, bB;\n  bool bC;\n  float bD = 1.;\n  float bp;\n  for(int bE = 0; bE < bv; bE++) {\n    bq = be + bh * by.y;\n    z = Q(bq.xy);\n    P = O(z);\n    br = -1. / bq.z;\n    bz = br - P;\n    bz *= clamp(sign(abs(bz) - bf * bw * bw), .0, 1.);\n    bC = abs(bz + bt) < bt;\n    bA = clamp(by.x / (by.x - bz), .0, 1.);\n    bB = bC ? by.y + bA * bw - bw : 1.;\n    by.z = min(by.z, bB);\n    by.x = bz;\n    if(bC) {\n      float bn = by.y - bw;\n      float bo = by.y;\n      bp = bm(be, bh, bn, bo);\n      bp = bm(be, bh, bn, bo);\n      bp = bm(be, bh, bn, bo);\n      bD = bp;\n      break;\n    }\n    by.y += bw;\n  }\n  return vec4(be + bh * bD, 1. - bD);\n}\nvec3 bF(in vec4 bG, const in float bH, const in vec3 bI, const in vec3 bJ, const in float bu) {\n  vec4 bK = mix(outputFovInfo[0], outputFovInfo[1], bG.x);\n  bG.xyz = vec3(mix(bK.xy, bK.zw, bG.y), 1.) * -1. / bG.z;\n  bG.xyz = (reprojViewProjMatrix * vec4(bG.xyz, 1.)).xyw;\n  bG.xy /= bG.z;\n  float bL = clamp(6. - 6. * max(abs(bG.x), abs(bG.y)), .0, 1.);\n  bG.xy = .5 + .5 * bG.xy;\n  return vec3(bG.xy, 1.);\n}\nvec3 ssr(const in vec3 bI, const in vec3 bJ, const in float bu, const in vec3 bM, const in vec3 V) {\n  float bN = .0;\n  vec4 bO = vec4(.0);\n  float W = bu * bu;\n  W = W * W;\n  vec3 bP = abs(bM.z) < .999 ? vec3(.0, .0, 1.) : vec3(1., .0, .0);\n  vec3 S = normalize(cross(bP, bM));\n  vec3 T = cross(bM, S);\n  float bH = ssrFactor * clamp(-4. * dot(V, bM) + 3.8, .0, 1.);\n  bH *= clamp(4.7 - bu * 5., .0, 1.);\n  vec3 be = I(projMatrix, vViewVertex.xyz);\n  be.z = 1. / be.z;\n  vec3 bg = R(bN, S, T, bM, V, W);\n  float bf = mix(cameraNearFar.y + vViewVertex.z, -vViewVertex.z - cameraNearFar.x, bg.z * .5 + .5);\n  float bt = .5 * bf;\n  vec4 bG;\n  if(dot(bg, bM) > .001 && bH > .0) {\n    bG = bs(be, bf, bt, bg, bu, bN);\n    if(bG.w > .0)\n      return bF(bG, bH, bI, bJ, bu);\n    \n  }\n  return vec3(.0);\n}\n#endif\nconst vec3 bQ = vec3(0., 0., 1.);\nuniform mat4 viewMatrix;\nuniform sampler2D normalTexture;\nuniform sampler2D heightTexture;\nuniform vec4 waveParams;\nuniform vec2 waterDir;\nuniform vec4 waterBaseColor;\nuniform vec3 lightDirection;\nuniform vec3 lightColor;\nuniform vec3 camPos;\nuniform float timeElapsed;\nvarying vec2 vUv;\nvarying vec2 vNoiseUv;\nvarying vec3 vPos;\nvarying mat3 vTbnMatrix;\nfloat bR(vec3 bS, float bT) {\n  float bU = max(.015, bT);\n  return max((bS.x + bS.y) * .3303545 / bU + .3303545, .0);\n}\nconst vec2 bV = vec2(6. / 25., 5. / 24.);\nvec2 bW(sampler2D bX, vec2 H) {\n  return 2. * texture2D(bX, H).rg - 1.;\n}\nfloat bY(vec2 H) {\n  return texture2D(heightTexture, H).b;\n}\nvec3 bZ(sampler2D bX, vec2 H) {\n  return 2. * texture2D(bX, H).rgb - 1.;\n}\nfloat ca(vec2 H, float cb) {\n  return fract(cb);\n}\nfloat cc(vec2 H, float cb) {\n  float cd = ca(H, cb);\n  return 1. - abs(1. - 2. * cd);\n}\nvec3 ce(sampler2D cf, vec2 H, float cb, float cg) {\n  float ch = waveParams[2];\n  float ci = waveParams[3];\n  vec2 cj = bW(cf, H) * ch;\n  float cd = ca(H, cb + cg);\n  float ck = cc(H, cb + cg);\n  vec2 bO = H;\n  bO -= cj * (cd + ci);\n  bO += cg;\n  bO += (cb - cd) * bV;\n  return vec3(bO, ck);\n}\nconst float cl = 7.77;\nvec3 cm(sampler2D cn, sampler2D co, vec2 cp, vec2 cq, float cb) {\n  float bT = waveParams[0];\n  vec2 cr = cb * -cq;\n  float cs = bY(vNoiseUv) * cl;\n  vec3 ct = ce(co, cp + cr, cb + cs, .0);\n  vec3 cu = ce(co, cp + cr, cb + cs, .5);\n  vec3 cv = bZ(cn, ct.xy) * ct.z;\n  vec3 cw = bZ(cn, cu.xy) * cu.z;\n  vec3 cx = normalize(cv + cw);\n  cx.xy *= bT;\n  cx.z = sqrt(1. - dot(cx.xy, cx.xy));\n  return cx;\n}\nvec4 cy(vec2 cp, float cz) {\n  float cA = waveParams[1];\n  vec3 bM = cm(normalTexture, heightTexture, cp * cA, waterDir, cz);\n  float cB = bR(bM, waveParams[0]);\n  return vec4(bM, cB);\n}\nconst float cC = 3.141592653589793;\nconst float cD = 1. / cC;\nconst float cE = .3183098861837907;\nconst float cF = 1.570796326794897;\nconst float cG = .4;\nfloat cH = 2.2;\nvec3 cI(float cJ, vec3 cK, float cL) {\n  return cK + (cL - cK) * pow(1. - cJ, 5.);\n}\nfloat cM(float cN, float bu) {\n  float cO = bu * bu;\n  float cP = cN * cN;\n  float cQ = pow((cP * (cO - 1.) + 1.), cH) * cC;\n  return cO / cQ;\n}\nfloat cR(float cS) {\n  return .25 / (cS * cS);\n}\nvec3 cT(const vec3 x) {\n  return (x * (2.51 * x + .03)) / (x * (2.43 * x + .59) + .14);\n}\nconst float cU = 2.2;\nconst float cV = .4545454545;\nvec4 cW(vec4 d) {\n  return vec4(pow(d.rgb, vec3(cV)), d.w);\n}\nvec3 cX(vec3 d) {\n  return pow(d, vec3(cU));\n}\nconst vec3 cY = vec3(.02, 1., 5.);\nconst vec2 cZ = vec2(.02, .1);\nconst float bu = .06;\nconst float da = 1.7;\nconst vec3 db = vec3(0, .6, .9);\nconst vec3 dc = vec3(.72, .92, 1.);\nconst float dd = .65;\nconst float de = 300000.0;\nconst float df = 500000.0;\nconst float dg = .775;\nconst float dh = .8;\nvec3 di(in vec3 bS, in vec3 dj) {\n  \n#ifdef HAS_IBL_LIGHTING\nvec3 dk = reflect(-dj, bS);\n  return c(textureCube(specularPBR, dk), rgbmRange);\n#else\nreturn ambientColor;\n#endif\n}\nPBRShadingWater dl;\nvec3 dm(in PBRShadingWater dn, float bu, vec3 dp, float dq) {\n  vec3 dr = cI(dn.VdotH, dp, dq);\n  float ds = cM(dn.NdotH, bu);\n  float dt = cR(dn.LdotH);\n  float du = mix(bu + .045, bu + .385, 1. - dn.VdotH);\n  float dv = 1.2;\n  float dw = cM(dn.NdotH, du) * dv;\n  return ((ds + dw) * dt) * dr;\n}\nvec3 dx(float da, float dy, vec3 db, float dz) {\n  return da * (.075 * db * pow(dy, 4.) + 50. * pow(dy, 23.)) * dz;\n}\nvec3 dA(in float Z, in vec3 dB, in vec3 dC) {\n  float dD = pow((1. - Z), cY[2]);\n  return mix(dC, dB, dD);\n}\nvec3 dE(in vec3 bS, in vec3 dj, in vec3 dF, vec3 d, in vec3 dG, in vec3 dH, in float dI, float dJ, vec3 dK) {\n  float dL = 0.;\n  vec3 dM = cX(d);\n  vec3 bb = normalize(dF + dj);\n  dl.NdotL = clamp(dot(bS, dF), .0, 1.);\n  dl.NdotV = clamp(dot(bS, dj), .001, 1.);\n  dl.VdotN = clamp(dot(dj, bS), .001, 1.);\n  dl.NdotH = clamp(dot(bS, bb), .0, 1.);\n  dl.VdotH = clamp(dot(dj, bb), .0, 1.);\n  dl.LdotH = clamp(dot(dF, bb), .0, 1.);\n  float dN = max(dot(dH, dj), .0);\n  vec3 dO = cX(dc);\n  vec3 dP = cX(db);\n  vec3 dc = dA(dN, dO, dP);\n  float dQ = max(dot(dH, dF), .0);\n  float dR = .1 + dQ * .9;\n  dc *= dR;\n  float dS = clamp(dI, .8, 1.);\n  vec3 dT = cI(dl.VdotN, vec3(cY[0]), cY[1]);\n  vec3 dU = dT * dc * dS;\n  vec3 dV = dM * mix(dc, dQ * dG * cD, 2. / 3.) * dS;\n  vec3 dW = vec3(.0);\n  if(dN > .0 && dQ > .0) {\n    vec3 dX = dm(dl, bu, vec3(cZ[0]), cZ[1]);\n    vec3 dY = dG * cD * dI;\n    dW = dl.NdotL * dY * dX;\n  }\n  vec3 cB = vec3(.0);\n  if(dN > .0) {\n    cB = dx(da, dJ, db, dR);\n  }\n  vec3 dZ = vec3(.0);\n#ifdef HAS_SSR\nfloat ea = smoothstep(df, de, -dK.z);\n  mat4 eb = viewMatrix;\n  vec4 ec = vec4(dK.xyz, 1.);\n  vec3 ed = normalize(ec.xyz);\n  vec4 ee = eb * vec4(bS, .0);\n  vec3 ef = normalize(ee.xyz);\n  vec4 eg = eb * vec4(dH, .0);\n  float eh = pow(max(dot(-ed, eg.xyz), .0), cG);\n  vec3 ei = mix(eg.xyz, ef, eh);\n  vec3 ej = ssr(vec3(.0), vec3(1.), bu, normalize(ei), -normalize(vViewVertex.xyz));\n  if(ej.z > .0) {\n    vec2 ek = smoothstep(.3, .6, abs(vec2(.5) - ej.xy));\n    dL = dg * clamp(1. - 1.3 * ek.y, .0, 1.) * ea;\n    vec3 el = M(.0, ej.xy);\n    dZ = cX(el) * dL * dT.y * dd;\n  }\n#endif\nfloat em = mix(dh, dh * .5, dL);\n  return cT((1. - dL) * dU + dZ + dV * em + dW + cB);\n}\nvoid main() {\n  vec3 dH = bQ;\n  vec4 en = cy(vUv, timeElapsed);\n  vec3 bS = normalize(vTbnMatrix * en.xyz);\n  vec3 dj = -normalize(vPos - camPos);\n  vec3 dF = normalize(-lightDirection);\n#if defined(HAS_SHADOWING)\nfloat dI = shadow_computeShadow();\n#else\nfloat dI = 1.;\n#endif\nvec4 eo = viewMatrix * vec4(vPos, 1.);\n  vec4 ep = vec4(dE(bS, dj, dF, waterBaseColor.rgb, lightColor, dH, dI, en.w, eo.xyz), waterBaseColor.a);\n  gl_FragColor = cW(ep);\n  if(contrast != 1.) {\n    gl_FragColor = contrastMatrix(contrast) * gl_FragColor;\n  }\n  if(length(hsv) > .0) {\n    gl_FragColor = hsv_apply(gl_FragColor, hsv);\n  }\n}",
                defines: r,
                uniforms: i,
                extraCommandProps: s
            });
        }
        needClearStencil() {
            return !0;
        }
        getUniformValues(t, e) {
            const n = this.canvas, i = {
                projMatrix: t.projMatrix,
                projViewMatrix: t.projViewMatrix,
                viewMatrix: t.viewMatrix,
                outSize: [ n.width, n.height ],
                halton: [ 0, 0 ]
            };
            return this.setIncludeUniformValues(i, e), i;
        }
        Rn(t, e) {
            const {iblTexes: n} = this.getIBLRes(), i = t.projViewMatrix, r = t.getLightManager();
            let o = r && r.getDirectionalLight() || {};
            const a = r && r.getAmbientLight() || {}, s = this.getSymbol(ar), l = this.Un = this.Un || [], f = {
                hdrHsv: a.hsv || [ 0, 0, 0 ],
                specularPBR: n && n.prefilterMap,
                rgbmRange: n && n.rgbmRange,
                ambientColor: a.color || [ .2, .2, .2 ],
                outSize: [ this.canvas.width, this.canvas.height ],
                projMatrix: t.projMatrix,
                projViewMatrix: i,
                viewMatrix: t.viewMatrix,
                cameraNearFar: [ t.cameraNear, t.cameraFar ],
                lightDirection: o.direction || or.direction,
                lightColor: o.color || or.color,
                camPos: t.cameraPosition,
                timeElapsed: s.animation ? (this.layer.getRenderer().getFrameTimestamp() || 0) / (1 / (s.waterSpeed || 1) * 1e4) : 0,
                normalTexture: this.Vn || this.zn,
                heightTexture: this.Gn || this.zn,
                waveParams: [ .09, s.uvScale || 3, .03, -.5 ],
                waterDir: fr(l, s.waterDirection || 0),
                waterBaseColor: s.waterBaseColor || [ .1451, .2588, .4863, 1 ],
                contrast: s.contrast || 1,
                hsv: s.hsv || sr
            };
            return this.setIncludeUniformValues(f, e), e && e.ssr && e.ssr.renderUniforms && Nt(f, e.ssr.renderUniforms), 
            f;
        }
        delete() {
            super.delete(), this.zn && (this.zn.destroy(), delete this.zn), this.Vn && this.Vn.destroy(), 
            this.Gn && this.Gn.destroy(), this.shader && this.shader.dispose(), this.Dn && this.Dn.dispose(), 
            this.kn && (this.kn.geometry.dispose(), this.kn.material && this.kn.material.dispose(), 
            this.kn.dispose(), delete this.kn), this.disposeIBLTextures();
        }
        createGround() {
            const t = new n.reshader.Plane;
            t.data.aTexCoord = new Uint8Array([ 0, 1, 1, 1, 0, 0, 1, 0 ]), t.generateBuffers(this.renderer.regl), 
            this.kn = new n.reshader.Mesh(t, null, {
                castShadow: !1
            }), this.Nn = new n.reshader.Scene([ this.kn ]);
        }
        transformWater() {
            const t = this.getMap(), e = n.GroundPainter.getGroundTransform(this.kn.localTransform, t);
            this.kn.setLocalTransform(e);
            const i = t._get2DExtentAtRes(t.getGLRes()), r = i.getWidth(), o = i.getHeight(), a = t.cameraLookAt, s = a[0] - r, l = a[1] + o, f = this.Fn, c = s / f[0], h = l / f[1], u = c % 1, d = h % 1, m = .3737 * c % 1, v = .3737 * h % 1, p = i.getWidth() / f[0] * 2, y = i.getHeight() / f[1] * 2;
            this.kn.setUniform("uvOffset", [ u, d ]), this.kn.setUniform("noiseUvOffset", [ m, v ]), 
            this.kn.setUniform("uvScale", [ p, -y ]);
        }
    }
    function fr(t, e) {
        var n;
        return n = e, e = Math.PI * n / 180, t[0] = Math.sin(e), t[1] = Math.cos(e), t;
    }
    const cr = St("fill", Oe);
    cr.registerAt(e.VectorTileLayer);
    const hr = St("line", He);
    hr.registerAt(e.VectorTileLayer);
    const ur = St("line-gradient", Pe);
    ur.registerAt(e.VectorTileLayer);
    const dr = St("icon", $n);
    dr.registerAt(e.VectorTileLayer);
    const mr = St("text", Oi);
    mr.registerAt(e.VectorTileLayer);
    const vr = St("native-line", ki);
    vr.registerAt(e.VectorTileLayer);
    St("native-point", Di).registerAt(e.VectorTileLayer);
    const pr = St("phong", Gi);
    pr.registerAt(e.VectorTileLayer);
    const yr = St("wireframe", Wi);
    yr.registerAt(e.VectorTileLayer);
    const gr = St("lit", Yi);
    gr.registerAt(e.VectorTileLayer);
    const br = St("cloth", class extends Yi {
        getShader(t) {
            return new n.reshader.pbr.ClothShader(t);
        }
        getMaterial(t) {
            return new n.reshader.pbr.ClothMaterial(t);
        }
    });
    br.registerAt(e.VectorTileLayer);
    const _r = St("subsurface", class extends Yi {
        getShader(t) {
            return new n.reshader.pbr.SubsurfaceShader(t);
        }
        getMaterial(t) {
            return new n.reshader.pbr.SubsurfaceMaterial(t);
        }
    });
    _r.registerAt(e.VectorTileLayer);
    St("gltf-phong", ir).registerAt(e.VectorTileLayer);
    const Ar = St("gltf-lit", rr);
    Ar.registerAt(e.VectorTileLayer);
    const xr = St("heatmap", class extends Se {
        createFnTypeConfig(t, e) {
            const n = Ct(e.heatWeight), i = new Int16Array(1);
            return [ {
                attrName: "aWeight",
                symbolName: "heatWeight",
                type: Uint8Array,
                size: 1,
                evaluate: e => {
                    const r = n(t.getZoom(), e);
                    return i[0] = r, i[0];
                }
            } ];
        }
        createGeometry(t, e) {
            const n = super.createGeometry(t, e);
            return $t(n, this.getSymbolDef({
                index: 0
            }), this.getFnTypeConfig({
                index: 0
            })), n;
        }
        createMesh(t, e) {
            const i = this.getSymbol({
                index: 0
            }), r = {
                tileRatio: t.properties.tileRatio,
                dataResolution: t.properties.tileResolution
            };
            Vt(r, "heatmapIntensity", i, "heatmapIntensity", 1), Vt(r, "heatmapRadius", i, "heatmapRadius", 6), 
            Vt(r, "heatmapWeight", i, "heatmapWeight", 1), Vt(r, "heatmapOpacity", i, "heatmapOpacity", 1), 
            t.generateBuffers(this.regl);
            const o = new n.reshader.Material(r), a = new n.reshader.Mesh(t, o, {
                transparent: !0,
                castShadow: !1,
                picking: !0
            }), s = {};
            return t.data.aWeight && (s.HAS_HEAT_WEIGHT = 1), a.setDefines(s), a.setLocalTransform(e), 
            a;
        }
        callRenderer(t, e) {
            this.Wn.render(this.scene, t, this.getRenderFBO(e));
        }
        getUniformValues(t) {
            const {projViewMatrix: e} = t;
            return {
                glScale: 1 / t.getGLScale(),
                resolution: t.getResolution(),
                projViewMatrix: e
            };
        }
        getHeatmapMeshes() {
            return this.scene.getMeshes();
        }
        delete() {
            super.delete(...arguments), this.Wn.dispose(), delete this.Wn;
        }
        init() {
            const t = this.regl;
            this.renderer = new n.reshader.Renderer(t);
            const e = this.layer.getRenderer().isEnableTileStencil(), i = {
                enable: !0,
                mask: 255,
                func: {
                    cmp: () => e ? "=" : "<=",
                    ref: (t, n) => e ? n.stencilRef : n.level,
                    mask: 255
                },
                op: {
                    fail: "keep",
                    zfail: "keep",
                    zpass: "replace"
                }
            }, r = this.getPolygonOffset(), o = this.getSymbols()[0];
            this.Wn = new n.HeatmapProcess(this.regl, this.sceneConfig, this.layer, o.heatmapColor, i, r);
        }
    });
    xr.registerAt(e.VectorTileLayer);
    const Sr = St("water", lr);
    Sr.registerAt(e.VectorTileLayer), e.Vector3DLayer.registerPainter("lit", Yi), e.Vector3DLayer.registerPainter("icon", $n), 
    e.Vector3DLayer.registerPainter("fill", Oe), e.Vector3DLayer.registerPainter("line", He), 
    e.Vector3DLayer.registerPainter("line-gradient", Pe), e.Vector3DLayer.registerPainter("water", lr), 
    t.ClothPlugin = br, t.FillPainter = Oe, t.FillPlugin = cr, t.GLTFStandardPlugin = Ar, 
    t.HeatmapPlugin = xr, t.IconPainter = $n, t.IconPlugin = dr, t.LineGlowPainter = class extends He {
        needToRedraw() {
            return !!super.needToRedraw() || this.sceneConfig.animation;
        }
        createShader() {
            const t = this.canvas, e = {
                x: 0,
                y: 0,
                width: () => t ? t.width : 1,
                height: () => t ? t.height : 1
            };
            this.shader = new n.reshader.MeshShader({
                vert: "#define DEVICE_PIXEL_RATIO 1.0\n#define ANTIALIASING 1.0 / DEVICE_PIXEL_RATIO / 2.0\n#define EXTRUDE_SCALE 0.0078740157\nattribute vec3 aPosition;\nattribute float aNormal;\nattribute vec2 aExtrude;\nattribute float aLinesofar;\nuniform float cameraToCenterDistance;\nuniform float lineStrokeWidth;\nuniform float lineWidth;\nuniform mat4 projViewModelMatrix;\nuniform float tileResolution;\nuniform float resolution;\nuniform float tileRatio;\nvarying vec2 vNormal;\nvarying vec2 vWidth;\nuniform float currentTime;\nuniform float trailLength;\nvarying float vTime;\nvoid main() {\n  float c = lineStrokeWidth / 2.;\n  float d = lineWidth / 2.;\n  float e = lineWidth + sign(lineWidth) * ANTIALIASING;\n  float f = d + c + sign(d) * ANTIALIASING;\n  vec2 h = aExtrude;\n  vec2 i = f * h * EXTRUDE_SCALE;\n  float j = tileResolution / resolution;\n  gl_Position = projViewModelMatrix * vec4(aPosition + vec3(i, .0) * tileRatio / j, 1.);\n  float k = gl_Position.w;\n  float l = float(int(aNormal) / 2);\n  float m = mod(aNormal, 2.);\n  vNormal = vec2(l, sign(m - .1));\n  vWidth = vec2(f, e);\n  vTime = 1. - (currentTime - aLinesofar / (tileRatio / j)) / trailLength;\n}",
                frag: "#define DEVICE_PIXEL_RATIO 1.0\nprecision mediump float;\nuniform lowp float lineOpacity;\nuniform lowp vec4 lineColor;\nvarying vec2 vNormal;\nvarying vec2 vWidth;\nuniform float animation;\nvarying float vTime;\nvoid main() {\n  if(animation == 1.) {\n    if(vTime > 1. || vTime < .0) {\n      discard;\n    }\n  }\n  float c = length(vNormal) * vWidth.s;\n  float r = (vWidth.s - c) / vWidth.s;\n  gl_FragColor = lineColor * lineOpacity;\n  float rrr = pow(r, 20.0);\n  gl_FragColor += vec4(rrr, rrr, rrr, .0);\n  gl_FragColor *= pow(r, 1.5);\n  if(animation == 1.) {\n    gl_FragColor *= vTime;\n  }\n}",
                uniforms: [ "lineOpacity", {
                    name: "projViewModelMatrix",
                    type: "function",
                    fn: function(t, e) {
                        const i = [];
                        return n.mat4.multiply(i, e.projViewMatrix, e.modelMatrix), i;
                    }
                } ],
                extraCommandProps: {
                    viewport: e,
                    stencil: {
                        enable: !0,
                        mask: 255,
                        func: {
                            cmp: "<=",
                            ref: (t, e) => e.level,
                            mask: 255
                        },
                        op: {
                            fail: "keep",
                            zfail: "keep",
                            zpass: "replace"
                        }
                    },
                    depth: {
                        enable: !0,
                        func: this.sceneConfig.depthFunc || "always"
                    },
                    blend: {
                        enable: !0,
                        func: {
                            src: "src alpha",
                            dst: "one"
                        },
                        equation: "add"
                    }
                }
            });
        }
        getUniformValues(t) {
            const e = super.getUniformValues(t);
            let n = this.layer.getRenderer().getFrameTimestamp();
            this.ct || (this.ct = n);
            const i = this.sceneConfig.loopTime || 18e5, r = this.sceneConfig.speed || 1;
            return e.trailLength = this.sceneConfig.trailLength || 300, e.currentTime = (n - this.ct) % i * r, 
            e.animation = !0 === this.sceneConfig.animation ? 1 : 0, e;
        }
    }, t.LineGradientPlugin = ur, t.LinePainter = He, t.LinePlugin = hr, t.LitPlugin = gr, 
    t.NativeLinePainter = ki, t.NativeLinePlugin = vr, t.NativePointPainter = Di, t.PhongPainter = Gi, 
    t.PhongPlugin = pr, t.SubsurfacePlugin = _r, t.TextPainter = Oi, t.TextPlugin = mr, 
    t.WaterPlugin = Sr, t.WireframePainter = Wi, t.WireframePlugin = yr, Object.defineProperty(t, "t", {
        value: !0
    }), "undefined" != typeof console && console.log("@maptalks/vt.basic v0.60.1");
}));
