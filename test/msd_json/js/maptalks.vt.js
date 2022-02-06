/*!
 * @maptalks/vt v0.60.1
 * LICENSE : undefined
 * (c) 2016-2022 maptalks.org
 */
!function(t, i) {
    "object" == typeof exports && "undefined" != typeof module ? i(require("maptalks"), require("@maptalks/gl")) : "function" == typeof define && define.amd ? define([ "maptalks", "@maptalks/gl" ], i) : i((t = "undefined" != typeof globalThis ? globalThis : t || self).maptalks, t.maptalksgl);
}(this, (function(t, i) {
    var e, n = "object" == typeof exports && "undefined" != typeof module;
    t = t, i = i;
    function r(r, s) {
        e ? s(n ? module.exports : t, t, i) : (t.registerWorkerAdapter("@maptalks/vt", s), 
        e = !0);
    }
    function s(t) {
        if (t && t.t) return t;
        var i = Object.create(null);
        return t && Object.keys(t).forEach((function(e) {
            if ("default" !== e) {
                var n = Object.getOwnPropertyDescriptor(t, e);
                Object.defineProperty(i, e, n.get ? n : {
                    enumerable: !0,
                    get: function() {
                        return t[e];
                    }
                });
            }
        })), i.default = t, Object.freeze(i);
    }
    n && (t = t || require("maptalks"), i = i || require("@maptalks/gl"));
    var o = s(i);
    r(0, (function(t, i) {
        /*!
            Feature Filter by

            (c) mapbox 2016 and maptalks 2018
            www.mapbox.com | www.maptalks.org
            License: MIT, header required.
        */
        const e = [ "Unknown", "Point", "LineString", "Polygon", "MultiPoint", "MultiLineString", "MultiPolygon", "GeometryCollection" ];
        function n(t) {
            return new Function("f", "var p = (f && f.properties || {}); return " + r(t));
        }
        function r(t) {
            if (!t) return "true";
            const i = t[0];
            if (t.length <= 1) return "any" === i ? "false" : "true";
            return `(${"==" === i ? o(t[1], t[2], "===", !1) : "!=" === i ? o(t[1], t[2], "!==", !1) : "<" === i || ">" === i || "<=" === i || ">=" === i ? o(t[1], t[2], i, !0) : "any" === i ? h(t.slice(1), "||") : "all" === i ? h(t.slice(1), "&&") : "none" === i ? u(h(t.slice(1), "||")) : "in" === i ? a(t[1], t.slice(2)) : "!in" === i ? u(a(t[1], t.slice(2))) : "has" === i ? l(t[1]) : "!has" === i ? u(l(t[1])) : "true"})`;
        }
        function s(t) {
            return "$" === t[0] ? "f." + t.substring(1) : "p[" + JSON.stringify(t) + "]";
        }
        function o(t, i, n, r) {
            const o = s(t), h = "$type" === t ? e.indexOf(i) : JSON.stringify(i);
            return (r ? `typeof ${o}=== typeof ${h}&&` : "") + o + n + h;
        }
        function h(t, i) {
            return t.map(r).join(i);
        }
        function a(t, i) {
            "$type" === t && (i = i.map(t => e.indexOf(t)));
            const n = JSON.stringify(i.sort(c)), r = s(t);
            return i.length <= 200 ? `${n}.indexOf(${r}) !== -1` : `function(v, a, i, j) {\n        while (i <= j) { var m = (i + j) >> 1;\n            if (a[m] === v) return true; if (a[m] > v) j = m - 1; else i = m + 1;\n        }\n    return false; }(${r}, ${n},0,${i.length - 1})`;
        }
        function l(t) {
            return "$id" === t ? '"id" in f' : JSON.stringify(t) + " in p";
        }
        function u(t) {
            return `!(${t})`;
        }
        function c(t, i) {
            return t < i ? -1 : t > i ? 1 : 0;
        }
        function f(t) {
            for (let i = 1; i < arguments.length; i++) {
                const e = arguments[i];
                for (const i in e) t[i] = e[i];
            }
            return t;
        }
        function d(t, i) {
            for (let e = 0; e < t.stops.length; e++) if (i === t.stops[e][0]) return t.stops[e][1];
            return t.default;
        }
        function y(t, i) {
            for (var e = 0; e < t.stops.length && !(i < t.stops[e][0]); e++) ;
            return t.stops[Math.max(e - 1, 0)][1];
        }
        function p(t, i) {
            for (var e = void 0 !== t.base ? t.base : 1, n = 0; !(n >= t.stops.length || i <= t.stops[n][0]); ) n++;
            return 0 === n ? t.stops[n][1] : n === t.stops.length ? t.stops[n - 1][1] : function t(i, e, n, r, s, o) {
                return "function" == typeof s ? function() {
                    var h = s.apply(void 0, arguments), a = o.apply(void 0, arguments);
                    return t(i, e, n, r, h, a);
                } : s.length ? function(t, i, e, n, r, s) {
                    var o = [];
                    for (let h = 0; h < r.length; h++) o[h] = v(t, i, e, n, r[h], s[h]);
                    return o;
                }(i, e, n, r, s, o) : v(i, e, n, r, s, o);
            }(i, e, t.stops[n - 1][0], t.stops[n][0], t.stops[n - 1][1], t.stops[n][1]);
        }
        function m(t, i) {
            return e = i, n = t.default, void 0 !== e ? e : void 0 !== n ? n : void 0 !== r ? r : null;
            var e, n, r;
        }
        function v(t, i, e, n, r, s) {
            var o, h = n - e, a = t - e;
            return r * (1 - (o = 1 === i ? a / h : (Math.pow(i, a) - 1) / (Math.pow(i, h) - 1))) + s * o;
        }
        function g(t) {
            return t && "object" == typeof t && (t.stops || t.property && "identity" === t.type);
        }
        function w(t) {
            return x(t, "exponential");
        }
        function b(t) {
            return x(t, "interval");
        }
        function M(t, i) {
            if (!t) return null;
            var e = !1;
            if (Array.isArray(t)) {
                var n, r = [];
                for (let s = 0; s < t.length; s++) (n = M(t[s], i)) ? (r.push(n), e = !0) : r.push(t[s]);
                return e ? r : t;
            }
            var s, o = {
                __fn_types_loaded: !0
            }, h = [];
            for (s in t) t.hasOwnProperty(s) && h.push(s);
            const a = function(t) {
                Object.defineProperty(o, t, {
                    get: function() {
                        return this["__fn_" + t] || (this["__fn_" + t] = w(this["_" + t])), this["__fn_" + t].apply(this, i());
                    },
                    set: function(i) {
                        this["_" + t] = i;
                    },
                    configurable: !0,
                    enumerable: !0
                });
            };
            for (let i = 0, n = h.length; i < n; i++) g(t[s = h[i]]) ? (e = !0, o["_" + s] = t[s], 
            a(s)) : o[s] = t[s];
            return e ? o : t;
        }
        function x(t, i) {
            if (!g(t)) return function() {
                return t;
            };
            let e = !0, n = !0;
            const r = (t = JSON.parse(JSON.stringify(t))).stops;
            if (r) for (let t = 0; t < r.length; t++) if (g(r[t][1])) {
                const s = x(r[t][1], i);
                e = e && s.isZoomConstant, n = n && s.isFeatureConstant, r[t] = [ r[t][0], s ];
            }
            const s = function t(i, e) {
                var n, r, s;
                if (g(i)) {
                    var o, h = i.stops && "object" == typeof i.stops[0][0], a = h || void 0 !== i.property, l = h || !a, u = i.type || e || "exponential";
                    if ("exponential" === u) o = p; else if ("interval" === u) o = y; else if ("categorical" === u) o = d; else {
                        if ("identity" !== u) throw new Error('Unknown function type "' + u + '"');
                        o = m;
                    }
                    if (h) {
                        var c = {}, f = [];
                        for (let t = 0; t < i.stops.length; t++) {
                            var v = i.stops[t];
                            void 0 === c[v[0].zoom] && (c[v[0].zoom] = {
                                zoom: v[0].zoom,
                                type: i.type,
                                property: i.property,
                                default: i.default,
                                stops: []
                            }), c[v[0].zoom].stops.push([ v[0].value, v[1] ]);
                        }
                        for (let i in c) f.push([ c[i].zoom, t(c[i]) ]);
                        n = function(t, e) {
                            const n = p({
                                stops: f,
                                base: i.base
                            }, t)(t, e);
                            return "function" == typeof n ? n(t, e) : n;
                        }, r = !1, s = !1;
                    } else l ? (n = function(t) {
                        const e = o(i, t);
                        return "function" == typeof e ? e(t) : e;
                    }, r = !0, s = !1) : (n = function(t, e) {
                        const n = o(i, e ? e[i.property] : null);
                        return "function" == typeof n ? n(t, e) : n;
                    }, r = !1, s = !0);
                } else n = function() {
                    return i;
                }, r = !0, s = !0;
                return n.isZoomConstant = s, n.isFeatureConstant = r, n;
            }(t, i);
            return s.isZoomConstant = e && s.isZoomConstant, s.isFeatureConstant = n && s.isFeatureConstant, 
            s;
        }
        let F = 0;
        const A = "function" == typeof Object.assign;
        function k(t, ...i) {
            if (A) return Object.assign(t, ...i), t;
            for (let e = 0; e < i.length; e++) {
                const n = i[e];
                for (const i in n) t[i] = n[i];
            }
            return t;
        }
        function _(t) {
            return !C(t) && ("string" == typeof t || null !== t.constructor && t.constructor === String);
        }
        function S(t) {
            return "number" == typeof t && !isNaN(t);
        }
        function P(t) {
            return !C(t) && ("function" == typeof t || null !== t.constructor && t.constructor === Function);
        }
        function O(t) {
            return !Array.isArray(t) && "object" == typeof t && !!t;
        }
        function C(t) {
            return null == t;
        }
        function I(t) {
            for (let i = 1; i < arguments.length; i++) {
                const e = arguments[i];
                if (e) for (let i = 0, n = e.length; i < n; i++) t.push(e[i]);
            }
            return t.length;
        }
        function T(t) {
            return t < 65536 ? Uint16Array : Uint32Array;
        }
        function D(t) {
            return t < 256 ? Uint8Array : t < 65536 ? Uint16Array : Uint32Array;
        }
        function L(t) {
            return (t = Math.abs(t)) < 128 ? Int8Array : t < 32768 ? Int16Array : Float32Array;
        }
        function U(t) {
            return function t(i) {
                if (!Array.isArray(i)) return t([ i ]);
                const e = [];
                for (let t = 0; t < i.length; t++) {
                    let r;
                    r = !0 === i[t].filter ? function() {
                        return !0;
                    } : n(i[t].filter), e.push(f({}, i[t], {
                        filter: r
                    }));
                }
                return e;
            }(t = t.map(t => {
                const i = k({}, t);
                return i.filter && i.filter.value && (i.filter = i.filter.value), i;
            }));
        }
        function E(t, i) {
            return g(i[t]) && i[t].property;
        }
        const j = "function" == typeof fetch && "function" == typeof AbortController, R = {
            jsonp: function(t, i) {
                const e = "_maptalks_jsonp_" + F++;
                t.match(/\?/) ? t += "&callback=" + e : t += "?callback=" + e;
                let n = document.createElement("script");
                return n.type = "text/javascript", n.src = t, window[e] = function(t) {
                    i(null, t), document.getElementsByTagName("head")[0].removeChild(n), n = null, delete window[e];
                }, document.getElementsByTagName("head")[0].appendChild(n), this;
            },
            get: function(t, i, e) {
                if (P(i)) {
                    const t = e;
                    e = i, i = t;
                }
                (i = i || {}).method && (i.method = i.method.toUpperCase());
                const n = "POST" === i.method;
                if (j) {
                    const r = new AbortController, s = {
                        signal: r.signal,
                        method: i.method || "GET",
                        referrerPolicy: "origin"
                    };
                    return n && (C(i.body) || (s.body = JSON.stringify(i.body))), C(i.headers) || (s.headers = i.headers), 
                    C(i.credentials) || (s.credentials = i.credentials), fetch(t, s).then(t => {
                        const n = this.s(t, i.returnJSON, i.responseType);
                        n.message ? e(n) : n.then(n => {
                            "arraybuffer" === i.responseType ? e(null, {
                                data: n,
                                cacheControl: t.headers.get("Cache-Control"),
                                expires: t.headers.get("Expires"),
                                contentType: t.headers.get("Content-Type")
                            }) : e(null, n);
                        }).catch(t => {
                            t.code && t.code === DOMException.ABORT_ERR || (console.error(t), e(t));
                        });
                    }).catch(t => {
                        t.code && t.code === DOMException.ABORT_ERR || (console.error(t), e(t));
                    }), r;
                }
                {
                    const r = R.o(e);
                    if (r.open(i.method || "GET", t, !0), i) {
                        for (const t in i.headers) r.setRequestHeader(t, i.headers[t]);
                        r.withCredentials = "include" === i.credentials, i.responseType && (r.responseType = i.responseType);
                    }
                    return r.send(n ? i.body : null), r;
                }
            },
            s: (t, i, e) => 200 !== t.status ? {
                status: t.status,
                statusText: t.statusText,
                message: `incorrect http request with status code(${t.status}): ${t.statusText}`
            } : "arraybuffer" === e ? t.arrayBuffer() : i ? t.json() : t.text(),
            u: function(t, i) {
                return function() {
                    if (4 === t.readyState) if (200 === t.status) if ("arraybuffer" === t.responseType) {
                        0 === t.response.byteLength ? i({
                            status: 200,
                            statusText: t.statusText,
                            message: "http status 200 returned without content."
                        }) : i(null, {
                            data: t.response,
                            cacheControl: t.getResponseHeader("Cache-Control"),
                            expires: t.getResponseHeader("Expires"),
                            contentType: t.getResponseHeader("Content-Type")
                        });
                    } else i(null, t.responseText); else i({
                        status: t.status,
                        statusText: t.statusText,
                        message: `incorrect http request with status code(${t.status}): ${t.statusText}`
                    });
                };
            },
            o: function(t) {
                let i;
                try {
                    i = new XMLHttpRequest;
                } catch (t) {
                    try {
                        i = new ActiveXObject("Msxml2.XMLHTTP");
                    } catch (t) {
                        try {
                            i = new ActiveXObject("Microsoft.XMLHTTP");
                        } catch (t) {}
                    }
                }
                return i.onreadystatechange = R.u(i, t), i;
            },
            getArrayBuffer(t, i, e) {
                if (P(i)) {
                    const t = e;
                    e = i, i = t;
                }
                return i || (i = {}), i.responseType = "arraybuffer", R.get(t, i, e);
            }
        };
        function z(t, i, e, n, r, s) {
            var o = r - e, h = s - n;
            if (0 !== o || 0 !== h) {
                var a = ((t - e) * o + (i - n) * h) / (o * o + h * h);
                a > 1 ? (e = r, n = s) : a > 0 && (e += o * a, n += h * a);
            }
            return (o = t - e) * o + (h = i - n) * h;
        }
        function N(t, i, e, n) {
            var r = {
                id: void 0 === t ? null : t,
                type: i,
                geometry: e,
                tags: n,
                minX: 1 / 0,
                minY: 1 / 0,
                maxX: -1 / 0,
                maxY: -1 / 0
            };
            return function(t) {
                var i = t.geometry, e = t.type;
                if ("Point" === e || "MultiPoint" === e || "LineString" === e) W(t, i); else if ("Polygon" === e || "MultiLineString" === e) for (var n = 0; n < i.length; n++) W(t, i[n]); else if ("MultiPolygon" === e) for (n = 0; n < i.length; n++) for (var r = 0; r < i[n].length; r++) W(t, i[n][r]);
            }(r), r;
        }
        function W(t, i) {
            for (var e = 0; e < i.length; e += 3) t.minX = Math.min(t.minX, i[e]), t.minY = Math.min(t.minY, i[e + 1]), 
            t.maxX = Math.max(t.maxX, i[e]), t.maxY = Math.max(t.maxY, i[e + 1]);
        }
        function H(t, i, e, n) {
            if (i.geometry) {
                var r = i.geometry.coordinates, s = i.geometry.type, o = Math.pow(e.tolerance / ((1 << e.maxZoom) * e.extent), 2), h = [], a = i.id;
                if (e.promoteId ? a = i.properties[e.promoteId] : e.generateId && (a = n || 0), 
                "Point" === s) V(r, h); else if ("MultiPoint" === s) for (var l = 0; l < r.length; l++) V(r[l], h); else if ("LineString" === s) $(r, h, o, !1); else if ("MultiLineString" === s) {
                    if (e.lineMetrics) {
                        for (l = 0; l < r.length; l++) h = [], $(r[l], h, o, !1), t.push(N(a, "LineString", h, i.properties));
                        return;
                    }
                    G(r, h, o, !1);
                } else if ("Polygon" === s) G(r, h, o, !0); else {
                    if ("MultiPolygon" !== s) {
                        if ("GeometryCollection" === s) {
                            for (l = 0; l < i.geometry.geometries.length; l++) H(t, {
                                id: a,
                                geometry: i.geometry.geometries[l],
                                properties: i.properties
                            }, e, n);
                            return;
                        }
                        throw new Error("Input data is not a valid GeoJSON object.");
                    }
                    for (l = 0; l < r.length; l++) {
                        var u = [];
                        G(r[l], u, o, !0), h.push(u);
                    }
                }
                t.push(N(a, s, h, i.properties));
            }
        }
        function V(t, i) {
            i.push(J(t[0])), i.push(q(t[1])), i.push(0);
        }
        function $(t, i, e, n) {
            for (var r, s, o = 0, h = 0; h < t.length; h++) {
                var a = J(t[h][0]), l = q(t[h][1]);
                i.push(a), i.push(l), i.push(0), h > 0 && (o += n ? (r * l - a * s) / 2 : Math.sqrt(Math.pow(a - r, 2) + Math.pow(l - s, 2))), 
                r = a, s = l;
            }
            var u = i.length - 3;
            i[2] = 1, function t(i, e, n, r) {
                for (var s, o = r, h = n - e >> 1, a = n - e, l = i[e], u = i[e + 1], c = i[n], f = i[n + 1], d = e + 3; d < n; d += 3) {
                    var y = z(i[d], i[d + 1], l, u, c, f);
                    if (y > o) s = d, o = y; else if (y === o) {
                        var p = Math.abs(d - h);
                        p < a && (s = d, a = p);
                    }
                }
                o > r && (s - e > 3 && t(i, e, s, r), i[s + 2] = o, n - s > 3 && t(i, s, n, r));
            }(i, 0, u, e), i[u + 2] = 1, i.size = Math.abs(o), i.start = 0, i.end = i.size;
        }
        function G(t, i, e, n) {
            for (var r = 0; r < t.length; r++) {
                var s = [];
                $(t[r], s, e, n), i.push(s);
            }
        }
        function J(t) {
            return t / 360 + .5;
        }
        function q(t) {
            var i = Math.sin(t * Math.PI / 180), e = .5 - .25 * Math.log((1 + i) / (1 - i)) / Math.PI;
            return e < 0 ? 0 : e > 1 ? 1 : e;
        }
        function B(t, i, e, n, r, s, o, h) {
            if (n /= i, s >= (e /= i) && o < n) return t;
            if (o < e || s >= n) return null;
            for (var a = [], l = 0; l < t.length; l++) {
                var u = t[l], c = u.geometry, f = u.type, d = 0 === r ? u.minX : u.minY, y = 0 === r ? u.maxX : u.maxY;
                if (d >= e && y < n) a.push(u); else if (!(y < e || d >= n)) {
                    var p = [];
                    if ("Point" === f || "MultiPoint" === f) X(c, p, e, n, r); else if ("LineString" === f) Z(c, p, e, n, r, !1, h.lineMetrics); else if ("MultiLineString" === f) K(c, p, e, n, r, !1); else if ("Polygon" === f) K(c, p, e, n, r, !0); else if ("MultiPolygon" === f) for (var m = 0; m < c.length; m++) {
                        var v = [];
                        K(c[m], v, e, n, r, !0), v.length && p.push(v);
                    }
                    if (p.length) {
                        if (h.lineMetrics && "LineString" === f) {
                            for (m = 0; m < p.length; m++) a.push(N(u.id, f, p[m], u.tags));
                            continue;
                        }
                        "LineString" !== f && "MultiLineString" !== f || (1 === p.length ? (f = "LineString", 
                        p = p[0]) : f = "MultiLineString"), "Point" !== f && "MultiPoint" !== f || (f = 3 === p.length ? "Point" : "MultiPoint"), 
                        a.push(N(u.id, f, p, u.tags));
                    }
                }
            }
            return a.length ? a : null;
        }
        function X(t, i, e, n, r) {
            for (var s = 0; s < t.length; s += 3) {
                var o = t[s + r];
                o >= e && o <= n && (i.push(t[s]), i.push(t[s + 1]), i.push(t[s + 2]));
            }
        }
        function Z(t, i, e, n, r, s, o) {
            for (var h, a, l = Y(t), u = 0 === r ? tt : it, c = t.start, f = 0; f < t.length - 3; f += 3) {
                var d = t[f], y = t[f + 1], p = t[f + 2], m = t[f + 3], v = t[f + 4], g = 0 === r ? d : y, w = 0 === r ? m : v, b = !1;
                o && (h = Math.sqrt(Math.pow(d - m, 2) + Math.pow(y - v, 2))), g < e ? w > e && (a = u(l, d, y, m, v, e), 
                o && (l.start = c + h * a)) : g > n ? w < n && (a = u(l, d, y, m, v, n), o && (l.start = c + h * a)) : Q(l, d, y, p), 
                w < e && g >= e && (a = u(l, d, y, m, v, e), b = !0), w > n && g <= n && (a = u(l, d, y, m, v, n), 
                b = !0), !s && b && (o && (l.end = c + h * a), i.push(l), l = Y(t)), o && (c += h);
            }
            var M = t.length - 3;
            d = t[M], y = t[M + 1], p = t[M + 2], (g = 0 === r ? d : y) >= e && g <= n && Q(l, d, y, p), 
            M = l.length - 3, s && M >= 3 && (l[M] !== l[0] || l[M + 1] !== l[1]) && Q(l, l[0], l[1], l[2]), 
            l.length && i.push(l);
        }
        function Y(t) {
            var i = [];
            return i.size = t.size, i.start = t.start, i.end = t.end, i;
        }
        function K(t, i, e, n, r, s) {
            for (var o = 0; o < t.length; o++) Z(t[o], i, e, n, r, s, !1);
        }
        function Q(t, i, e, n) {
            t.push(i), t.push(e), t.push(n);
        }
        function tt(t, i, e, n, r, s) {
            var o = (s - i) / (n - i);
            return t.push(s), t.push(e + (r - e) * o), t.push(1), o;
        }
        function it(t, i, e, n, r, s) {
            var o = (s - e) / (r - e);
            return t.push(i + (n - i) * o), t.push(s), t.push(1), o;
        }
        function et(t, i) {
            for (var e = [], n = 0; n < t.length; n++) {
                var r, s = t[n], o = s.type;
                if ("Point" === o || "MultiPoint" === o || "LineString" === o) r = nt(s.geometry, i); else if ("MultiLineString" === o || "Polygon" === o) {
                    r = [];
                    for (var h = 0; h < s.geometry.length; h++) r.push(nt(s.geometry[h], i));
                } else if ("MultiPolygon" === o) for (r = [], h = 0; h < s.geometry.length; h++) {
                    for (var a = [], l = 0; l < s.geometry[h].length; l++) a.push(nt(s.geometry[h][l], i));
                    r.push(a);
                }
                e.push(N(s.id, o, r, s.tags));
            }
            return e;
        }
        function nt(t, i) {
            var e = [];
            e.size = t.size, void 0 !== t.start && (e.start = t.start, e.end = t.end);
            for (var n = 0; n < t.length; n += 3) e.push(t[n] + i, t[n + 1], t[n + 2]);
            return e;
        }
        function rt(t, i) {
            if (t.transformed) return t;
            var e, n, r, s = 1 << t.z, o = t.x, h = t.y;
            for (e = 0; e < t.features.length; e++) {
                var a = t.features[e], l = a.geometry, u = a.type;
                if (a.geometry = [], 1 === u) for (n = 0; n < l.length; n += 2) a.geometry.push(st(l[n], l[n + 1], i, s, o, h)); else for (n = 0; n < l.length; n++) {
                    var c = [];
                    for (r = 0; r < l[n].length; r += 2) c.push(st(l[n][r], l[n][r + 1], i, s, o, h));
                    a.geometry.push(c);
                }
            }
            return t.transformed = !0, t;
        }
        function st(t, i, e, n, r, s) {
            return [ Math.round(e * (t * n - r)), Math.round(e * (i * n - s)) ];
        }
        function ot(t, i, e, n, r) {
            for (var s = i === r.maxZoom ? 0 : r.tolerance / ((1 << i) * r.extent), o = {
                features: [],
                numPoints: 0,
                numSimplified: 0,
                numFeatures: 0,
                source: null,
                x: e,
                y: n,
                z: i,
                transformed: !1,
                minX: 2,
                minY: 1,
                maxX: -1,
                maxY: 0
            }, h = 0; h < t.length; h++) {
                o.numFeatures++, ht(o, t[h], s, r);
                var a = t[h].minX, l = t[h].minY, u = t[h].maxX, c = t[h].maxY;
                a < o.minX && (o.minX = a), l < o.minY && (o.minY = l), u > o.maxX && (o.maxX = u), 
                c > o.maxY && (o.maxY = c);
            }
            return o;
        }
        function ht(t, i, e, n) {
            var r = i.geometry, s = i.type, o = [];
            if ("Point" === s || "MultiPoint" === s) for (var h = 0; h < r.length; h += 3) o.push(r[h]), 
            o.push(r[h + 1]), t.numPoints++, t.numSimplified++; else if ("LineString" === s) at(o, r, t, e, !1, !1); else if ("MultiLineString" === s || "Polygon" === s) for (h = 0; h < r.length; h++) at(o, r[h], t, e, "Polygon" === s, 0 === h); else if ("MultiPolygon" === s) for (var a = 0; a < r.length; a++) {
                var l = r[a];
                for (h = 0; h < l.length; h++) at(o, l[h], t, e, !0, 0 === h);
            }
            if (o.length) {
                var u = i.tags || null;
                if ("LineString" === s && n.lineMetrics) {
                    for (var c in u = {}, i.tags) u[c] = i.tags[c];
                    u.mapbox_clip_start = r.start / r.size, u.mapbox_clip_end = r.end / r.size;
                }
                var f = {
                    geometry: o,
                    type: "Polygon" === s || "MultiPolygon" === s ? 3 : "LineString" === s || "MultiLineString" === s ? 2 : 1,
                    tags: u
                };
                null !== i.id && (f.id = i.id), t.features.push(f);
            }
        }
        function at(t, i, e, n, r, s) {
            var o = n * n;
            if (n > 0 && i.size < (r ? o : n)) e.numPoints += i.length / 3; else {
                for (var h = [], a = 0; a < i.length; a += 3) (0 === n || i[a + 2] > o) && (e.numSimplified++, 
                h.push(i[a]), h.push(i[a + 1])), e.numPoints++;
                r && function(t, i) {
                    for (var e = 0, n = 0, r = t.length, s = r - 2; n < r; s = n, n += 2) e += (t[n] - t[s]) * (t[n + 1] + t[s + 1]);
                    if (e > 0 === i) for (n = 0, r = t.length; n < r / 2; n += 2) {
                        var o = t[n], h = t[n + 1];
                        t[n] = t[r - 2 - n], t[n + 1] = t[r - 1 - n], t[r - 2 - n] = o, t[r - 1 - n] = h;
                    }
                }(h, s), t.push(h);
            }
        }
        function lt(t, i) {
            var e = (i = this.options = function(t, i) {
                for (var e in i) t[e] = i[e];
                return t;
            }(Object.create(this.options), i)).debug;
            if (e && console.time("preprocess data"), i.maxZoom < 0 || i.maxZoom > 24) throw new Error("maxZoom should be in the 0-24 range");
            if (i.promoteId && i.generateId) throw new Error("promoteId and generateId cannot be used together.");
            var n = function(t, i) {
                var e = [];
                if ("FeatureCollection" === t.type) for (var n = 0; n < t.features.length; n++) H(e, t.features[n], i, n); else "Feature" === t.type ? H(e, t, i) : H(e, {
                    geometry: t
                }, i);
                return e;
            }(t, i);
            this.tiles = {}, this.tileCoords = [], e && (console.timeEnd("preprocess data"), 
            console.log("index: maxZoom: %d, maxPoints: %d", i.indexMaxZoom, i.indexMaxPoints), 
            console.time("generate tiles"), this.stats = {}, this.total = 0), (n = function(t, i) {
                var e = i.buffer / i.extent, n = t, r = B(t, 1, -1 - e, e, 0, -1, 2, i), s = B(t, 1, 1 - e, 2 + e, 0, -1, 2, i);
                return (r || s) && (n = B(t, 1, -e, 1 + e, 0, -1, 2, i) || [], r && (n = et(r, 1).concat(n)), 
                s && (n = n.concat(et(s, -1)))), n;
            }(n, i)).length && this.splitTile(n, 0, 0, 0), e && (n.length && console.log("features: %d, points: %d", this.tiles[0].numFeatures, this.tiles[0].numPoints), 
            console.timeEnd("generate tiles"), console.log("tiles generated:", this.total, JSON.stringify(this.stats)));
        }
        function ut(t, i, e) {
            return 32 * ((1 << t) * e + i) + t;
        }
        function ct(t, i, e, n, r, s) {
            const o = e && Array.isArray(e[0]);
            for (let h = 0, a = e.length; h < a; h++) {
                t[i] = Math.round((o ? e[h][0] : e[h].x) * n), t[i + 1] = Math.round((o ? e[h][1] : e[h].y) * n);
                let l = r || 0;
                Array.isArray(r) && (l = r[h]), l = l ? Math.round(n * l) : 0, t[i + 2] = l, i += 3, 
                s && 0 !== h && h !== a - 1 && (t[i] = t[i - 3], t[i + 1] = t[i - 2], t[i + 2] = t[i - 1], 
                i += 3);
            }
            return i;
        }
        function ft(t, i, e, n) {
            const r = t[3 * i], s = t[3 * i + 1], o = t[3 * e], h = t[3 * e + 1];
            return r === o && (r < 0 || r > n) || s === h && (s < 0 || s > n);
        }
        R.getJSON = function(t, i, e) {
            if (P(i)) {
                const t = e;
                e = i, i = t;
            }
            const n = function(t, i) {
                const n = "string" == typeof i ? JSON.parse(i) : i || null;
                e(t, n);
            };
            return i && i.jsonp ? R.jsonp(t, n) : ((i = i || {}).returnJSON = !0, R.get(t, i, n));
        }, lt.prototype.options = {
            maxZoom: 14,
            indexMaxZoom: 5,
            indexMaxPoints: 1e5,
            tolerance: 3,
            extent: 4096,
            buffer: 64,
            lineMetrics: !1,
            promoteId: null,
            generateId: !1,
            debug: 0
        }, lt.prototype.splitTile = function(t, i, e, n, r, s, o) {
            for (var h = [ t, i, e, n ], a = this.options, l = a.debug; h.length; ) {
                n = h.pop(), e = h.pop(), i = h.pop(), t = h.pop();
                var u = 1 << i, c = ut(i, e, n), f = this.tiles[c];
                if (!f && (l > 1 && console.time("creation"), f = this.tiles[c] = ot(t, i, e, n, a), 
                this.tileCoords.push({
                    z: i,
                    x: e,
                    y: n
                }), l)) {
                    l > 1 && (console.log("tile z%d-%d-%d (features: %d, points: %d, simplified: %d)", i, e, n, f.numFeatures, f.numPoints, f.numSimplified), 
                    console.timeEnd("creation"));
                    var d = "z" + i;
                    this.stats[d] = (this.stats[d] || 0) + 1, this.total++;
                }
                if (f.source = t, r) {
                    if (i === a.maxZoom || i === r) continue;
                    var y = 1 << r - i;
                    if (e !== Math.floor(s / y) || n !== Math.floor(o / y)) continue;
                } else if (i === a.indexMaxZoom || f.numPoints <= a.indexMaxPoints) continue;
                if (f.source = null, 0 !== t.length) {
                    l > 1 && console.time("clipping");
                    var p, m, v, g, w, b, M = .5 * a.buffer / a.extent, x = .5 - M, F = .5 + M, A = 1 + M;
                    p = m = v = g = null, w = B(t, u, e - M, e + F, 0, f.minX, f.maxX, a), b = B(t, u, e + x, e + A, 0, f.minX, f.maxX, a), 
                    t = null, w && (p = B(w, u, n - M, n + F, 1, f.minY, f.maxY, a), m = B(w, u, n + x, n + A, 1, f.minY, f.maxY, a), 
                    w = null), b && (v = B(b, u, n - M, n + F, 1, f.minY, f.maxY, a), g = B(b, u, n + x, n + A, 1, f.minY, f.maxY, a), 
                    b = null), l > 1 && console.timeEnd("clipping"), h.push(p || [], i + 1, 2 * e, 2 * n), 
                    h.push(m || [], i + 1, 2 * e, 2 * n + 1), h.push(v || [], i + 1, 2 * e + 1, 2 * n), 
                    h.push(g || [], i + 1, 2 * e + 1, 2 * n + 1);
                }
            }
        }, lt.prototype.getTile = function(t, i, e) {
            var n = this.options, r = n.extent, s = n.debug;
            if (t < 0 || t > 24) return null;
            var o = 1 << t, h = ut(t, i = (i % o + o) % o, e);
            if (this.tiles[h]) return rt(this.tiles[h], r);
            s > 1 && console.log("drilling down to z%d-%d-%d", t, i, e);
            for (var a, l = t, u = i, c = e; !a && l > 0; ) l--, u = Math.floor(u / 2), c = Math.floor(c / 2), 
            a = this.tiles[ut(l, u, c)];
            return a && a.source ? (s > 1 && console.log("found parent tile z%d-%d-%d", l, u, c), 
            s > 1 && console.time("drilling down"), this.splitTile(a.source, l, u, c, t, i, e), 
            s > 1 && console.timeEnd("drilling down"), this.tiles[h] ? rt(this.tiles[h], r) : null) : null;
        };
        class dt {
            constructor(t, i) {
                this.x = t, this.y = i;
            }
            clone() {
                return new dt(this.x, this.y);
            }
            normalize() {
                const t = this.length();
                this.x /= t, this.y /= t;
            }
            negate() {
                this.x = -this.x, this.y = -this.y;
            }
            length() {
                return Math.sqrt(this.x * this.x + this.y * this.y);
            }
            diff(t) {
                return new dt(this.x - t.x, this.y - t.y);
            }
            distance(t) {
                const i = this.x - t.x, e = this.y - t.y;
                return Math.sqrt(i * i + e * e);
            }
            dot(t) {
                return this.x * t.x + this.y * t.y;
            }
            equals(t) {
                return this.x === t.x && this.y === t.y;
            }
            orthogonal() {
                return new dt(this.y, -this.x);
            }
        }
        function yt(t, i, e) {
            const n = (i.x - t.x) * (e.y - t.y) - (i.y - t.y) * (e.x - t.x);
            return n > 1e-5 ? 1 : n < -1e-5 ? 2 : 0;
        }
        function pt(t, i, e, n) {
            const r = i.x * n.y - i.y * n.x, s = e.x - t.x, o = e.y - t.y, h = (s * n.y - o * n.x) / r;
            return new dt(t.x + h * i.x, t.y + h * i.y);
        }
        const mt = [];
        function vt(t, i, e) {
            let n = 0;
            const r = [];
            for (let s = i; s < e; s += 3) mt[n] ? (mt[n].x = t[s], mt[n].y = t[s + 1]) : mt[n] = new dt(t[s], t[s + 1]), 
            r.push(mt[n]), n++;
            const s = function(t) {
                let i;
                this.UpdateOmbb = function(t, e, n, r, s, o, h, a) {
                    const l = pt(t, e, s, o), u = pt(n, r, s, o), c = pt(h, a, t, e), f = pt(h, a, n, r), d = l.distance(u) * l.distance(c);
                    d < this.BestObbArea && (i = [ l, c, f, u ], this.BestObbArea = d);
                }, this.BestObbArea = Number.MAX_VALUE;
                const e = [];
                for (let i = 0; i < t.length; i++) e.push(t[(i + 1) % t.length].diff(t[i])), e[i].normalize();
                const n = new dt(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY), r = new dt(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
                let s, o, h, a;
                for (let i = 0; i < t.length; i++) {
                    const e = t[i];
                    e.x < n.x && (n.x = e.x, s = i), e.x > r.x && (r.x = e.x, o = i), e.y < n.y && (n.y = e.y, 
                    a = i), e.y > r.y && (r.y = e.y, h = i);
                }
                let l = new dt(0, -1), u = new dt(0, 1), c = new dt(-1, 0), f = new dt(1, 0);
                for (let i = 0; i < t.length; i++) {
                    const i = [ Math.acos(l.dot(e[s])), Math.acos(u.dot(e[o])), Math.acos(c.dot(e[h])), Math.acos(f.dot(e[a])) ];
                    switch (i.indexOf(Math.min.apply(Math, i))) {
                      case 0:
                        l = e[s].clone(), u = l.clone(), u.negate(), c = l.orthogonal(), f = c.clone(), 
                        f.negate(), s = (s + 1) % t.length;
                        break;

                      case 1:
                        u = e[o].clone(), l = u.clone(), l.negate(), c = l.orthogonal(), f = c.clone(), 
                        f.negate(), o = (o + 1) % t.length;
                        break;

                      case 2:
                        c = e[h].clone(), f = c.clone(), f.negate(), l = f.orthogonal(), u = l.clone(), 
                        u.negate(), h = (h + 1) % t.length;
                        break;

                      case 3:
                        f = e[a].clone(), c = f.clone(), c.negate(), l = f.orthogonal(), u = l.clone(), 
                        u.negate(), a = (a + 1) % t.length;
                    }
                    this.UpdateOmbb(t[s], l, t[o], u, t[h], c, t[a], f);
                }
                return i;
            }(function(t) {
                if (t.length < 3) return t;
                let i = t[0];
                const e = [];
                for (let e = 1; e < t.length; e++) (t[e].x < i.x || Math.abs(t[e].x - i.x) < 1e-5 && t[e].y < i.y) && (i = t[e]);
                let n = t[0];
                do {
                    e.unshift(i.clone());
                    for (let e = 1; e < t.length; e++) {
                        const r = yt(i, n, t[e]);
                        (n.equals(i) || 1 === r || 0 === r && i.distance(t[e]) > i.distance(n)) && (n = t[e]);
                    }
                    i = n;
                } while (!n.equals(e[e.length - 1]));
                return e;
            }(r)), o = s[0].distance(s[1]), h = s[1].distance(s[2]), a = s.map(t => [ t.x, t.y ]);
            return a.push(+(h > o)), a;
        }
        var gt, wt = "undefined" != typeof Float32Array ? Float32Array : Array;
        function bt(t, i, e, n) {
            return t[0] = i, t[1] = e, t[2] = n, t;
        }
        function Mt(t, i) {
            return t[0] = i[0], t[1] = i[1], t[2] = i[2], t[3] = i[3], t;
        }
        function xt(t, i, e, n, r) {
            return t[0] = i, t[1] = e, t[2] = n, t[3] = r, t;
        }
        function Ft(t, i) {
            var e = i[0] - t[0], n = i[1] - t[1];
            return Math.sqrt(e * e + n * n);
        }
        function At(t, i, e, n, r, s, o, h, a, l) {
            0 === t ? function(t, i, e, n, r, s, o, h, a) {
                const l = [ 0, 0 ];
                for (let r = t; r < i; r += 3) {
                    const t = r / 3 * 2, i = n[r], u = n[r + 1];
                    e[t] = l[0] + i * s * o / h, e[t + 1] = l[1] - u * s * o / a;
                }
            }(i, e, n, r, 0, o, h, a, l) : 1 === t && function(t, i, e, n) {
                const r = vt(n, t, i), s = r[4], o = r[s], h = r[s + 1], a = r[s + 2], l = (h[1] - o[1]) / (h[0] - o[0]), u = (a[1] - h[1]) / (a[0] - h[0]), c = Ft(o, h), f = Ft(h, a);
                for (let r = t; r < i; r += 3) {
                    const t = r / 3 * 2, i = n[r], s = n[r + 1];
                    e[t] = _t(i, s, o, l, c), e[t + 1] = -_t(i, s, h, u, f);
                }
            }(i, e, n, r);
        }
        gt = new wt(3), wt != Float32Array && (gt[0] = 0, gt[1] = 0, gt[2] = 0), function() {
            var t = function() {
                var t = new wt(4);
                return wt != Float32Array && (t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 0), t;
            }();
        }(), function() {
            var t = function() {
                var t = new wt(2);
                return wt != Float32Array && (t[0] = 0, t[1] = 0), t;
            }();
        }();
        const kt = [];
        function _t(t, i, e, n, r) {
            return kt[0] = (n * n * e[0] + n * (i - e[1]) + t) / (n * n + 1), kt[1] = n * (kt[0] - e[0]) + e[1], 
            Ft(e, kt) / r;
        }
        function St(t, i, e, n, r) {
            const s = 3 * i[e - 1], o = 3 * i[e - 1] + 1, h = t[s], a = t[o];
            return l = n, u = r, c = h, f = a, Math.sqrt((c - l) * (c - l) + (f - u) * (f - u));
            var l, u, c, f;
        }
        "undefined" != typeof undefinedThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof self && self;
        var Pt = Ot;
        function Ot(t, i) {
            this.x = t, this.y = i;
        }
        Ot.prototype = {
            clone: function() {
                return new Ot(this.x, this.y);
            },
            add: function(t) {
                return this.clone().m(t);
            },
            sub: function(t) {
                return this.clone().M(t);
            },
            multByPoint: function(t) {
                return this.clone().F(t);
            },
            divByPoint: function(t) {
                return this.clone().A(t);
            },
            mult: function(t) {
                return this.clone().k(t);
            },
            div: function(t) {
                return this.clone().S(t);
            },
            rotate: function(t) {
                return this.clone().P(t);
            },
            rotateAround: function(t, i) {
                return this.clone().O(t, i);
            },
            matMult: function(t) {
                return this.clone().C(t);
            },
            unit: function() {
                return this.clone().I();
            },
            perp: function() {
                return this.clone().T();
            },
            round: function() {
                return this.clone().D();
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
                var i = t.x - this.x, e = t.y - this.y;
                return i * i + e * e;
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
            angleWithSep: function(t, i) {
                return Math.atan2(this.x * i - this.y * t, this.x * t + this.y * i);
            },
            C: function(t) {
                var i = t[0] * this.x + t[1] * this.y, e = t[2] * this.x + t[3] * this.y;
                return this.x = i, this.y = e, this;
            },
            m: function(t) {
                return this.x += t.x, this.y += t.y, this;
            },
            M: function(t) {
                return this.x -= t.x, this.y -= t.y, this;
            },
            k: function(t) {
                return this.x *= t, this.y *= t, this;
            },
            S: function(t) {
                return this.x /= t, this.y /= t, this;
            },
            F: function(t) {
                return this.x *= t.x, this.y *= t.y, this;
            },
            A: function(t) {
                return this.x /= t.x, this.y /= t.y, this;
            },
            I: function() {
                return this.S(this.mag()), this;
            },
            T: function() {
                var t = this.y;
                return this.y = this.x, this.x = -t, this;
            },
            P: function(t) {
                var i = Math.cos(t), e = Math.sin(t), n = i * this.x - e * this.y, r = e * this.x + i * this.y;
                return this.x = n, this.y = r, this;
            },
            O: function(t, i) {
                var e = Math.cos(t), n = Math.sin(t), r = i.x + e * (this.x - i.x) - n * (this.y - i.y), s = i.y + n * (this.x - i.x) + e * (this.y - i.y);
                return this.x = r, this.y = s, this;
            },
            D: function() {
                return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
            }
        }, Ot.convert = function(t) {
            return t instanceof Ot ? t : Array.isArray(t) ? new Ot(t[0], t[1]) : t;
        };
        const Ct = {
            Point: 1,
            LineString: 2,
            Polygon: 3,
            MultiPoint: 4,
            MultiLineString: 5,
            MultiPolygon: 6
        };
        function It(t, i = {}) {
            var e = [];
            if ("FeatureCollection" === t.type) for (var n = 0; n < t.features.length; n++) Tt(e, t.features[n], i, n); else "Feature" === t.type ? Tt(e, t, i) : Tt(e, {
                geometry: t
            }, i);
            return e;
        }
        function Tt(t, i, e, n) {
            if (i.geometry && i.geometry.geometry) {
                var r = i.geometry.coordinates, s = i.geometry.type, o = [], h = i.id;
                if (e.promoteId ? h = i.properties[e.promoteId] : e.generateId && (h = n || 0), 
                "Point" === s) Dt(r, o); else if ("MultiPoint" === s) for (var a = 0; a < r.length; a++) Dt(r[a], o); else if ("LineString" === s) Ut([ r ], o); else if ("MultiLineString" === s) {
                    if (e.lineMetrics) {
                        for (a = 0; a < r.length; a++) o = [], Lt(r[a], o), t.push(Et(h, "LineString", o, i.properties));
                        return;
                    }
                    Ut(r, o);
                } else if ("Polygon" === s) Ut(r, o); else {
                    if ("MultiPolygon" !== s) {
                        if ("GeometryCollection" === s) {
                            for (a = 0; a < i.geometry.geometries.length; a++) Tt(t, {
                                id: h,
                                geometry: i.geometry.geometries[a],
                                properties: i.properties
                            }, e, n);
                            return;
                        }
                        throw new Error("Input data is not a valid GeoJSON object.");
                    }
                    for (a = 0; a < r.length; a++) {
                        var l = [];
                        Ut(r[a], l), o.push(l);
                    }
                }
                t.push(Et(h, s, o, i.properties));
            }
        }
        function Dt(t, i) {
            i.push([ new Pt(t[0], t[1]) ]);
        }
        function Lt(t, i) {
            for (var e = 0; e < t.length; e++) {
                var n = t[e][0], r = t[e][1];
                i.push(new Pt(n, r));
            }
        }
        function Ut(t, i, e, n) {
            for (var r = 0; r < t.length; r++) {
                var s = [];
                Lt(t[r], s), i.push(s);
            }
        }
        function Et(t, i, e, n) {
            return {
                id: void 0 === t ? null : t,
                type: Ct[i],
                geometry: e,
                properties: n
            };
        }
        function jt(t, i, e) {
            e = e || {}, this.w = t || 64, this.h = i || 64, this.autoResize = !!e.autoResize, 
            this.shelves = [], this.freebins = [], this.stats = {}, this.bins = {}, this.maxId = 0;
        }
        function Rt(t, i, e) {
            this.x = 0, this.y = t, this.w = this.free = i, this.h = e;
        }
        function zt(t, i, e, n, r, s, o) {
            this.id = t, this.x = i, this.y = e, this.w = n, this.h = r, this.maxw = s || n, 
            this.maxh = o || r, this.refcount = 0;
        }
        /*!
         * Codes from mapbox-gl-js
         * github.com/mapbox/mapbox-gl-js
         * MIT License
         */        function Nt(t, {width: i, height: e}, n, r) {
            if (r) {
                if (r.length !== i * e * n) throw new RangeError("mismatched image size");
            } else r = new Uint8Array(i * e * n);
            return t.width = i, t.height = e, t.data = r, t;
        }
        function Wt(t, {width: i, height: e}, n) {
            if (i === t.width && e === t.height) return;
            const r = Nt({}, {
                width: i,
                height: e
            }, n);
            Ht(t, r, {
                x: 0,
                y: 0
            }, {
                x: 0,
                y: 0
            }, {
                width: Math.min(t.width, i),
                height: Math.min(t.height, e)
            }, n), t.width = i, t.height = e, t.data = r.data;
        }
        function Ht(t, i, e, n, r, s) {
            if (0 === r.width || 0 === r.height) return i;
            if (r.width > t.width || r.height > t.height || e.x > t.width - r.width || e.y > t.height - r.height) throw new RangeError("out of range source coordinates for image copy");
            if (r.width > i.width || r.height > i.height || n.x > i.width - r.width || n.y > i.height - r.height) throw new RangeError("out of range destination coordinates for image copy");
            const o = t.data, h = i.data;
            if (o === h) return i;
            for (let a = 0; a < r.height; a++) {
                const l = ((e.y + a) * t.width + e.x) * s, u = ((n.y + a) * i.width + n.x) * s;
                for (let t = 0; t < r.width * s; t++) h[u + t] = o[l + t];
            }
            return i;
        }
        jt.prototype.pack = function(t, i) {
            t = [].concat(t), i = i || {};
            for (var e, n, r, s, o = [], h = 0; h < t.length; h++) if (e = t[h].w || t[h].width, 
            n = t[h].h || t[h].height, r = t[h].id, e && n) {
                if (!(s = this.packOne(e, n, r))) continue;
                i.inPlace && (t[h].x = s.x, t[h].y = s.y, t[h].id = s.id), o.push(s);
            }
            return this.shrink(), o;
        }, jt.prototype.packOne = function(t, i, e) {
            var n, r, s, o, h, a, l, u, c = {
                freebin: -1,
                shelf: -1,
                waste: 1 / 0
            }, f = 0;
            if ("string" == typeof e || "number" == typeof e) {
                if (n = this.getBin(e)) return this.ref(n), n;
                "number" == typeof e && (this.maxId = Math.max(e, this.maxId));
            } else e = ++this.maxId;
            for (o = 0; o < this.freebins.length; o++) {
                if (i === (n = this.freebins[o]).maxh && t === n.maxw) return this.allocFreebin(o, t, i, e);
                i > n.maxh || t > n.maxw || i <= n.maxh && t <= n.maxw && (s = n.maxw * n.maxh - t * i) < c.waste && (c.waste = s, 
                c.freebin = o);
            }
            for (o = 0; o < this.shelves.length; o++) if (f += (r = this.shelves[o]).h, !(t > r.free)) {
                if (i === r.h) return this.allocShelf(o, t, i, e);
                i > r.h || i < r.h && (s = (r.h - i) * t) < c.waste && (c.freebin = -1, c.waste = s, 
                c.shelf = o);
            }
            return -1 !== c.freebin ? this.allocFreebin(c.freebin, t, i, e) : -1 !== c.shelf ? this.allocShelf(c.shelf, t, i, e) : i <= this.h - f && t <= this.w ? (r = new Rt(f, this.w, i), 
            this.allocShelf(this.shelves.push(r) - 1, t, i, e)) : this.autoResize ? (h = a = this.h, 
            ((l = u = this.w) <= h || t > l) && (u = 2 * Math.max(t, l)), (h < l || i > h) && (a = 2 * Math.max(i, h)), 
            this.resize(u, a), this.packOne(t, i, e)) : null;
        }, jt.prototype.allocFreebin = function(t, i, e, n) {
            var r = this.freebins.splice(t, 1)[0];
            return r.id = n, r.w = i, r.h = e, r.refcount = 0, this.bins[n] = r, this.ref(r), 
            r;
        }, jt.prototype.allocShelf = function(t, i, e, n) {
            var r = this.shelves[t].alloc(i, e, n);
            return this.bins[n] = r, this.ref(r), r;
        }, jt.prototype.shrink = function() {
            if (this.shelves.length > 0) {
                for (var t = 0, i = 0, e = 0; e < this.shelves.length; e++) {
                    var n = this.shelves[e];
                    i += n.h, t = Math.max(n.w - n.free, t);
                }
                this.resize(t, i);
            }
        }, jt.prototype.getBin = function(t) {
            return this.bins[t];
        }, jt.prototype.ref = function(t) {
            if (1 == ++t.refcount) {
                var i = t.h;
                this.stats[i] = 1 + (0 | this.stats[i]);
            }
            return t.refcount;
        }, jt.prototype.unref = function(t) {
            return 0 === t.refcount ? 0 : (0 == --t.refcount && (this.stats[t.h]--, delete this.bins[t.id], 
            this.freebins.push(t)), t.refcount);
        }, jt.prototype.clear = function() {
            this.shelves = [], this.freebins = [], this.stats = {}, this.bins = {}, this.maxId = 0;
        }, jt.prototype.resize = function(t, i) {
            this.w = t, this.h = i;
            for (var e = 0; e < this.shelves.length; e++) this.shelves[e].resize(t);
            return !0;
        }, Rt.prototype.alloc = function(t, i, e) {
            if (t > this.free || i > this.h) return null;
            var n = this.x;
            return this.x += t, this.free -= t, new zt(e, n, this.y, t, i, t, this.h);
        }, Rt.prototype.resize = function(t) {
            return this.free += t - this.w, this.w = t, !0;
        };
        class Vt {
            constructor(t, i) {
                Nt(this, t, 1, i);
            }
            resize(t) {
                Wt(this, t, 1);
            }
            clone() {
                return new Vt({
                    width: this.width,
                    height: this.height
                }, new Uint8Array(this.data));
            }
            static copy(t, i, e, n, r) {
                Ht(t, i, e, n, r, 1);
            }
        }
        class $t {
            constructor(t, i) {
                Nt(this, t, 4, i);
            }
            resize(t) {
                Wt(this, t, 4);
            }
            clone() {
                return new $t({
                    width: this.width,
                    height: this.height
                }, new Uint8Array(this.data));
            }
            static copy(t, i, e, n, r) {
                Ht(t, i, e, n, r, 4);
            }
        }
        /*!
         * Codes from mapbox-gl-js
         * github.com/mapbox/mapbox-gl-js
         * MIT License
         */        class Gt {
            constructor(t, {pixelRatio: i}) {
                this.paddedRect = t, this.pixelRatio = i || 1;
            }
            get tl() {
                return [ this.paddedRect.x + 1, this.paddedRect.y + 1 ];
            }
            get br() {
                return [ this.paddedRect.x + this.paddedRect.w - 1, this.paddedRect.y + this.paddedRect.h - 1 ];
            }
            get displaySize() {
                return [ (this.paddedRect.w - 2) / this.pixelRatio, (this.paddedRect.h - 2) / this.pixelRatio ];
            }
        }
        class Jt {
            constructor(t) {
                this.glyphMap = t, this.build();
            }
            build() {
                const t = this.glyphMap, i = {}, e = new jt(0, 0, {
                    autoResize: !0
                }), n = [];
                for (const e in t) {
                    const r = t[e], s = {
                        x: 0,
                        y: 0,
                        w: r.data.width + 2,
                        h: r.data.height + 2
                    };
                    n.push(s), i[e] = new Gt(s, r);
                }
                if (e.pack(n, {
                    inPlace: !0
                }), !qt(e.w) || !qt(e.h)) {
                    const t = Bt(e.w), i = Bt(e.h);
                    e.resize(t, i);
                }
                const r = new $t({
                    width: e.w,
                    height: e.h
                });
                for (const e in t) {
                    const n = t[e], s = i[e].paddedRect;
                    $t.copy(n.data, r, {
                        x: 0,
                        y: 0
                    }, {
                        x: s.x + 1,
                        y: s.y + 1
                    }, n.data);
                }
                this.image = r, this.positions = i;
            }
        }
        function qt(t) {
            return 0 == (t & t - 1) && 0 !== t;
        }
        function Bt(t) {
            return Math.pow(2, Math.ceil(Math.log(t) / Math.LN2));
        }
        /*!
         * Codes from mapbox-gl-js
         * github.com/mapbox/mapbox-gl-js
         * MIT License
         * TODO 升级为potpack
         */        class Xt {
            constructor(t) {
                this.glyphMap = t, this.build();
            }
            build() {
                const t = this.glyphMap, i = {}, e = new jt(0, 0, {
                    autoResize: !0
                }), n = [];
                for (const e in t) {
                    const r = t[e], s = i[e] = {};
                    for (const t in r) {
                        const i = r[+t];
                        if (!i || 0 === i.bitmap.width || 0 === i.bitmap.height) continue;
                        const e = {
                            x: 0,
                            y: 0,
                            w: i.bitmap.width + 2,
                            h: i.bitmap.height + 2
                        };
                        n.push(e), s[t] = {
                            rect: e,
                            metrics: i.metrics
                        };
                    }
                }
                e.pack(n, {
                    inPlace: !0
                });
                const r = new Vt({
                    width: e.w,
                    height: e.h
                });
                for (const e in t) {
                    const n = t[e];
                    for (const t in n) {
                        const s = n[+t];
                        if (!s || 0 === s.bitmap.width || 0 === s.bitmap.height) continue;
                        const o = i[e][t].rect;
                        Vt.copy(s.bitmap, r, {
                            x: 0,
                            y: 0
                        }, {
                            x: o.x + 1,
                            y: o.y + 1
                        }, s.bitmap);
                    }
                }
                this.image = r, this.positions = i;
            }
        }
        function Zt(t) {
            return t < 65536 ? Uint16Array : Uint32Array;
        }
        function Yt(t) {
            return (t = Math.abs(t)) < 128 ? Int8Array : t < 32768 ? Int16Array : Float32Array;
        }
        function Kt(t) {
            return t < 256 ? Uint8Array : t < 65536 ? Uint16Array : Float32Array;
        }
        function Qt(t) {
            const i = t.type, e = [];
            if (1 === i || 4 === i) for (let i = 0; i < t.geometry.length; i++) Dt(t.geometry[i], e); else if (2 === i) Ut(t.geometry, e); else if (3 === i) Ut(t.geometry, e); else if (5 === i) Ut(t.geometry, e); else if (6 === i) for (let i = 0; i < t.geometry.length; i++) {
                const n = [];
                Ut(t.geometry[i], n), e.push(n);
            }
            return t.geometry = e, t;
        }
        function ti(t) {
            for (let i = 1; i < arguments.length; i++) {
                const e = arguments[i];
                for (const i in e) t[i] = e[i];
            }
            return t;
        }
        function ii(t) {
            return null == t;
        }
        function ei(t) {
            return "number" == typeof t && !isNaN(t);
        }
        function ni(t) {
            return "object" == typeof t && !!t;
        }
        function ri(t) {
            return !ii(t) && ("string" == typeof t || null !== t.constructor && t.constructor === String);
        }
        const si = Object.prototype.hasOwnProperty;
        function oi(t, i) {
            return si.call(t, i);
        }
        function hi(t, i) {
            return g(i[t]) && i[t].property;
        }
        function ai(t) {
            let i = 0;
            for (let e, n, r = 0, s = t.length, o = s - 1; r < s; o = r++) e = t[r], n = t[o], 
            void 0 !== e.x ? i += (n.x - e.x) * (e.y + n.y) : i += (n[0] - e[0]) * (e[1] + n[1]);
            return i;
        }
        function li(t, i, e, n, r) {
            const s = t[i * n], o = t[i * n + 1], h = t[e * n], a = t[e * n + 1];
            return s === h && (s < 0 || s > r) && o !== a || o === a && (o < 0 || o > r) && s !== h;
        }
        function ui(t, i, e) {
            let n = e;
            return i && t && (n = t[i]), void 0 === n && (n = e), 10 * (n || 0);
        }
        function ci(t, i, e, n, r, s, o) {
            const h = ui(t.properties, e, n), a = h * i;
            let l = h;
            return r ? l = ui(t.properties, r, s) : o && (l = h - ui(t.properties, o, 0)), l *= i, 
            {
                altitude: a,
                height: l
            };
        }
        function fi(t, i) {
            return i < 1 / 0 && (t.x < 0 || t.x > i || t.y < 0 || t.y > i);
        }
        function di(t) {
            return null == t;
        }
        function yi(t, i, e) {
            if (t === e || t === i) return t;
            const n = e - i;
            return ((t - i) % n + n) % n + i;
        }
        class pi {
            constructor(t, i, e, n) {
                this.feature = t, this.symbol = i, this.fnTypes = e, this.options = n;
            }
            getPolygonResource() {
                let t = this.symbol.polygonPatternFile;
                const {polygonPatternFileFn: i} = this.fnTypes, e = i;
                return this.L(t, e);
            }
            getLineResource() {
                let t = this.symbol.linePatternFile;
                const {linePatternFileFn: i} = this.fnTypes, e = i;
                return this.L(t, e);
            }
            L(t, i) {
                if (i) {
                    const e = this.feature.properties;
                    t = i(this.options.zoom, e);
                }
                return t;
            }
        }
        const mi = {
            lineWidth: 1,
            lineStrokeWidth: 1,
            lineDx: 1,
            lineDy: 1,
            lineOpacity: 1,
            linePatternAnimSpeed: 1,
            markerWidth: 1,
            markerHeight: 1,
            markerDx: 1,
            markerDy: 1,
            markerSpacing: 1,
            markerOpacity: 1,
            markerRotation: 1,
            textWrapWidth: 1,
            textSpacing: 1,
            textSize: 1,
            textHaloRadius: 1,
            textHaloOpacity: 1,
            textDx: 1,
            textDy: 1,
            textOpacity: 1,
            textRotation: 1,
            polygonOpacity: 1
        };
        class vi {
            static isAtlasLoaded(t, i = {}) {
                const {iconAtlas: e} = i;
                return !!(!t || e && e.positions[t]);
            }
            static genFnTypes(t) {
                const i = {};
                for (const e in t) hi(e, t) && (i[e + "Fn"] = mi[e] ? w(t[e]) : b(t[e]));
                return i;
            }
            constructor(t, i, e) {
                this.options = e, this.features = this.U(t), this.symbolDef = i, this.symbol = M(i, () => [ e.zoom ]), 
                this.styledVectors = [], this.properties = {}, this.j = vi.genFnTypes(this.symbolDef), 
                hi("visible", this.symbolDef) && (this.R = w(this.symbolDef.visible)), e.atlas && (this.iconAtlas = e.atlas.iconAtlas, 
                this.glyphAtlas = e.atlas.glyphAtlas);
            }
            U(t) {
                if (!t.length) return t;
                const i = "__fea_idx".trim();
                let e, r = 0, s = t[r];
                for (;!s.geometry; ) r++, s = t[r];
                if (Array.isArray(s.geometry) && s.properties) {
                    let i = s.geometry[0];
                    for (;Array.isArray(i); ) i = i[0];
                    i instanceof Pt && (e = t);
                }
                if (!e) if (e = [], Array.isArray(s.geometry)) for (let i = 0; i < t.length; i++) {
                    const n = ti({}, t[i]);
                    e.push(Qt(n));
                } else for (let n = 0; n < t.length; n++) {
                    const r = t[n], s = It(r);
                    for (let t = 0; t < s.length; t++) {
                        const n = s[t];
                        n[i] = r[i], e.push(n);
                    }
                }
                const o = this.options.order;
                if (o) {
                    const t = [];
                    for (let i = 0; i < o.length; i++) o[i] && t.push(n(o[i]));
                    e = e.sort((i, e) => {
                        const n = t.length;
                        let r = n, s = n;
                        for (let o = 0; o < n && (t[o](i) && (r = o), t[o](e) && (s = o), !(r < n && s < n)); o++) ;
                        return r - s;
                    });
                }
                return e;
            }
            load(t = 1) {
                const i = "__fea_idx".trim(), e = this.j, n = this.styledVectors;
                this.count = 0;
                const r = this.features;
                if (!r || !r.length) return Promise.resolve(null);
                const s = {}, o = {}, h = {
                    zoom: this.options.zoom
                }, a = M(this.symbolDef, () => [ h.zoom ]);
                let l = 0, u = r.length;
                const c = this.options.debugIndex;
                for (;l < u; l++) {
                    const t = r[l];
                    if (!t || !t.geometry) continue;
                    if (void 0 !== c && t._debug_info.index !== c) continue;
                    t.properties || (t.properties = {}), t.properties.$layer = t.layer, t.properties.$type = t.type;
                    const u = this.createStyledVector(t, a, e, h, s, o);
                    u && u.feature.geometry && (u.featureIdx = void 0 === t[i] ? l : t[i], this.count++, 
                    n.push(u));
                }
                return this.options.atlas ? Promise.resolve(this.pack(t)) : this.loadAtlas(s, o).then(() => this.pack(t));
            }
            loadAtlas(t, i) {
                return new Promise((e, n) => {
                    this.fetchAtlas(t, i, (t, i) => {
                        if (t) n(t); else {
                            if (i) {
                                const {icons: t, glyphs: e} = i;
                                if (t && Object.keys(t).length) {
                                    for (const i in t) {
                                        const e = t[i], {width: n, height: r, data: s} = e.data;
                                        e.data = new $t({
                                            width: n,
                                            height: r
                                        }, s);
                                    }
                                    this.iconAtlas = new Jt(t);
                                }
                                if (e && Object.keys(e).length) {
                                    for (const t in e) {
                                        const i = e[t];
                                        for (const t in i) {
                                            const e = i[t], {width: n, height: r, data: s} = e.bitmap;
                                            e.bitmap = new Vt({
                                                width: n,
                                                height: r
                                            }, s);
                                        }
                                    }
                                    this.glyphAtlas = new Xt(e);
                                }
                            }
                            e({
                                glyphAtlas: this.glyphAtlas,
                                iconAtlas: this.iconAtlas
                            });
                        }
                    });
                });
            }
            fetchAtlas(t, i, e) {
                Object.keys(t).length > 0 || Object.keys(i).length > 0 ? this.options.requestor(t, i, e) : e();
            }
            pack(t) {
                if (!this.count) return null;
                if (null == t) throw new Error("layout scale is undefined");
                const i = this.createDataPack(this.styledVectors, t);
                if (!i) return null;
                i.properties = this.properties, this.empty && (i.empty = !0);
                const e = i.buffers;
                delete i.buffers;
                const n = {
                    data: i,
                    buffers: e
                };
                if (this.iconAtlas) {
                    const t = n.data.iconAtlas = gi(this.iconAtlas);
                    if (t.glyphMap) for (const i in t.glyphMap) {
                        const n = t.glyphMap[i];
                        e.push(n.data.data.buffer);
                    }
                    e.push(n.data.iconAtlas.image.data.buffer);
                }
                return this.glyphAtlas && (n.data.glyphAtlas = gi(this.glyphAtlas), e.push(n.data.glyphAtlas.image.data.buffer)), 
                n;
            }
            createStyledVector(t, i, e, n) {
                return new pi(t, i, e, n);
            }
            createDataPack(t, i) {
                if (!t || !t.length) return null;
                this.maxIndex = 0, this.maxPos = 0, this.maxAltitude = 0;
                const e = this.data = {};
                let n = this.elements = [];
                const r = this.getFormat(Array.isArray(t[0]) ? t[0][0].symbol : t[0].symbol);
                for (let t = 0; t < r.length; t++) e[r[t].name] = [];
                let s = [], o = 0;
                const h = [];
                let a = 0, l = !1;
                for (let n = 0, r = t.length; n < r; n++) {
                    if (!t[n].feature.geometry) continue;
                    const r = Array.isArray(t[n]) ? t[n][0].feature.id : t[n].feature.id;
                    ei(r) && (Math.abs(r) > a && (a = Math.abs(r)), r < 0 && (l = !0));
                    const u = this.data.aPosition.length;
                    if (Array.isArray(t[n])) for (let e = 0; e < t[n].length; e++) this.N(t[n][e], i); else this.N(t[n], i);
                    const c = (e.aPosition.length - u) / 3;
                    for (let i = 0; i < c; i++) s.push(t[n].featureIdx), ei(r) && h.push(r);
                    o = Math.max(o, t[n].featureIdx);
                }
                if (this.hasElements() && !n.length) return null;
                s = new (Kt(o))(s), this.options.positionType ? r[0].type = this.options.positionType : r[0].type = Yt(Math.max(this.maxPos, this.maxAltitude));
                const u = this.options.center;
                if (u && (u[0] || u[1])) {
                    const t = e.aPosition;
                    for (let i = 0; i < t.length; i += 3) t[i] -= u[0], t[i + 1] -= u[1];
                }
                const c = function(t, i) {
                    const e = {};
                    for (let n = 0; n < t.length; n++) {
                        const r = t[n], s = r.type, o = r.name;
                        e[o] = s === Array ? i[o] : new s(i[o]);
                    }
                    return e;
                }(r, e);
                c.aPickingId = s;
                const f = [];
                for (const t in c) f.push(c[t].buffer);
                n = new (Zt(this.maxIndex))(n), f.push(n.buffer);
                const d = {
                    data: c,
                    indices: this.hasElements() ? n : null,
                    positionSize: 3,
                    //!this.maxAltitude ? 2 : 3,
                    buffers: f,
                    symbolIndex: this.symbolDef.index || {
                        index: 0
                    }
                };
                if (h.length) {
                    const t = l ? Yt(a) : Kt(a);
                    d.featureIds = new t(h), f.push(d.featureIds.buffer);
                } else d.featureIds = [];
                return d;
            }
            N(t, i) {
                const e = t.feature.properties;
                this.R && this.R.isZoomConstant && !this.R(null, e) || this.placeVector(t, i, this.formatWidth);
            }
            addElements(...t) {
                this.maxIndex = Math.max(this.maxIndex, ...t), this.elements.push(...t);
            }
            hasElements() {
                return !0;
            }
            getAltitude(t) {
                const {altitudeProperty: i, defaultAltitude: e, altitudeScale: n} = this.options;
                let r = ui(t, i, e);
                return n && (r *= n), this.maxAltitude = Math.max(this.maxAltitude, Math.abs(r)), 
                r;
            }
            getIconAtlasMaxValue() {
                const t = this.iconAtlas.positions;
                let i = 0;
                for (const e in t) if (oi(t, e)) {
                    const {tl: n, displaySize: r} = t[e], s = Math.max(n[0], n[1], r[0] - 1, r[1] - 1);
                    s > i && (i = s);
                }
                return i;
            }
        }
        function gi(t) {
            let i = t.positions, e = t.image && t.image.format || "alpha";
            if (t instanceof Jt) {
                i = {};
                for (const e in t.positions) {
                    const n = t.positions[e];
                    i[e] = {
                        paddedRect: n.paddedRect,
                        pixelRatio: n.pixelRatio,
                        tl: n.tl,
                        br: n.br,
                        displaySize: n.displaySize
                    };
                }
                e = "rgba";
            }
            const n = t.image;
            return {
                image: {
                    width: n.width,
                    height: n.height,
                    data: n.data,
                    format: e
                },
                glyphMap: t.glyphMap,
                positions: i
            };
        }
        function wi(t, i, e, n) {
            let r = t.textSize;
            if (ii(i.textSize)) return [ 16, 16 ];
            t.__fn_textSize && (r = t.__fn_textSize);
            const s = [];
            var o;
            return ii(o = r) || "function" != typeof o && (null === o.constructor || o.constructor !== Function) ? s[0] = r : s[0] = r(n, e), 
            s[1] = s[0], s;
        }
        function bi(t) {
            const i = t.stops;
            let e = -1 / 0;
            for (let t = 0; t < i.length; t++) {
                let n = i[t][1];
                ni(i[t][1]) && (n = bi(i[t][1])), n > e && (e = n);
            }
            return e;
        }
        const Mi = /\{([\w_]+)\}/g;
        function xi(t, i) {
            return ri(t) ? t.replace(Mi, (function(t, e) {
                if (!i) return "";
                const n = i[e];
                return ii(n) ? "" : Array.isArray(n) ? n.join() : n;
            })) : t;
        }
        const Fi = t => t >= 128 && t <= 255, Ai = t => t >= 1536 && t <= 1791, ki = t => t >= 1872 && t <= 1919, _i = t => t >= 2208 && t <= 2303, Si = t => t >= 4352 && t <= 4607, Pi = t => t >= 5120 && t <= 5759, Oi = t => t >= 6320 && t <= 6399, Ci = t => t >= 8192 && t <= 8303, Ii = t => t >= 8448 && t <= 8527, Ti = t => t >= 8528 && t <= 8591, Di = t => t >= 8960 && t <= 9215, Li = t => t >= 9216 && t <= 9279, Ui = t => t >= 9280 && t <= 9311, Ei = t => t >= 9312 && t <= 9471, ji = t => t >= 9632 && t <= 9727, Ri = t => t >= 9728 && t <= 9983, zi = t => t >= 11008 && t <= 11263, Ni = t => t >= 11904 && t <= 12031, Wi = t => t >= 12032 && t <= 12255, Hi = t => t >= 12272 && t <= 12287, Vi = t => t >= 12288 && t <= 12351, $i = t => t >= 12352 && t <= 12447, Gi = t => t >= 12448 && t <= 12543, Ji = t => t >= 12544 && t <= 12591, qi = t => t >= 12592 && t <= 12687, Bi = t => t >= 12688 && t <= 12703, Xi = t => t >= 12704 && t <= 12735, Zi = t => t >= 12736 && t <= 12783, Yi = t => t >= 12784 && t <= 12799, Ki = t => t >= 12800 && t <= 13055, Qi = t => t >= 13056 && t <= 13311, te = t => t >= 13312 && t <= 19903, ie = t => t >= 19904 && t <= 19967, ee = t => t >= 19968 && t <= 40959, ne = t => t >= 40960 && t <= 42127, re = t => t >= 42128 && t <= 42191, se = t => t >= 43360 && t <= 43391, oe = t => t >= 44032 && t <= 55215, he = t => t >= 55216 && t <= 55295, ae = t => t >= 57344 && t <= 63743, le = t => t >= 63744 && t <= 64255, ue = t => t >= 64336 && t <= 65023, ce = t => t >= 65040 && t <= 65055, fe = t => t >= 65072 && t <= 65103, de = t => t >= 65104 && t <= 65135, ye = t => t >= 65136 && t <= 65279, pe = t => t >= 65280 && t <= 65519;
        function me(t) {
            return !Ai(t) && (!ki(t) && (!_i(t) && (!ue(t) && !ye(t))));
        }
        function ve(t) {
            return 746 === t || 747 === t || !(t < 4352) && (!!Xi(t) || (!!Ji(t) || (!(!fe(t) || t >= 65097 && t <= 65103) || (!!le(t) || (!!Qi(t) || (!!Ni(t) || (!!Zi(t) || (!(!Vi(t) || t >= 12296 && t <= 12305 || t >= 12308 && t <= 12319 || 12336 === t) || (!!te(t) || (!!ee(t) || (!!Ki(t) || (!!qi(t) || (!!se(t) || (!!he(t) || (!!Si(t) || (!!oe(t) || (!!$i(t) || (!!Hi(t) || (!!Bi(t) || (!!Wi(t) || (!!Yi(t) || (!(!Gi(t) || 12540 === t) || (!(!pe(t) || 65288 === t || 65289 === t || 65293 === t || t >= 65306 && t <= 65310 || 65339 === t || 65341 === t || 65343 === t || t >= 65371 && t <= 65503 || 65507 === t || t >= 65512 && t <= 65519) || (!(!de(t) || t >= 65112 && t <= 65118 || t >= 65123 && t <= 65126) || (!!Pi(t) || (!!Oi(t) || (!!ce(t) || (!!ie(t) || (!!ne(t) || !!re(t))))))))))))))))))))))))))))));
        }
        function ge(t) {
            return !(ve(t) || function(t) {
                return !(!Fi(t) || 167 !== t && 169 !== t && 174 !== t && 177 !== t && 188 !== t && 189 !== t && 190 !== t && 215 !== t && 247 !== t) || (!(!Ci(t) || 8214 !== t && 8224 !== t && 8225 !== t && 8240 !== t && 8241 !== t && 8251 !== t && 8252 !== t && 8258 !== t && 8263 !== t && 8264 !== t && 8265 !== t && 8273 !== t) || (!!Ii(t) || (!!Ti(t) || (!(!Di(t) || !(t >= 8960 && t <= 8967 || t >= 8972 && t <= 8991 || t >= 8996 && t <= 9e3 || 9003 === t || t >= 9085 && t <= 9114 || t >= 9150 && t <= 9165 || 9167 === t || t >= 9169 && t <= 9179 || t >= 9186 && t <= 9215)) || (!(!Li(t) || 9251 === t) || (!!Ui(t) || (!!Ei(t) || (!!ji(t) || (!(!Ri(t) || t >= 9754 && t <= 9759) || (!(!zi(t) || !(t >= 11026 && t <= 11055 || t >= 11088 && t <= 11097 || t >= 11192 && t <= 11243)) || (!!Vi(t) || (!!Gi(t) || (!!ae(t) || (!!fe(t) || (!!de(t) || (!!pe(t) || (8734 === t || 8756 === t || 8757 === t || t >= 9984 && t <= 10087 || t >= 10102 && t <= 10131 || 65532 === t || 65533 === t)))))))))))))))));
            }(t));
        }
        function we(t) {
            return t >= 1424 && t <= 2303 || ue(t) || ye(t);
        }
        const be = [ [ 9, 9 ], [ 32, 32 ], [ 5760, 5760 ], [ 8192, 8198 ], [ 8200, 8202 ], [ 8287, 12288 ], [ 6158, 6158 ], [ 8203, 8205 ] ];
        function Me(t) {
            for (const i of be) if (t >= i[0] && t <= i[1]) return !0;
            return !1;
        }
        const xe = {
            "!": "︕",
            "#": "＃",
            $: "＄",
            "%": "％",
            "&": "＆",
            "(": "︵",
            ")": "︶",
            "*": "＊",
            "+": "＋",
            ",": "︐",
            "-": "︲",
            ".": "・",
            "/": "／",
            ":": "︓",
            ";": "︔",
            "<": "︿",
            "=": "＝",
            ">": "﹀",
            "?": "︖",
            "@": "＠",
            "[": "﹇",
            "\\": "＼",
            "]": "﹈",
            "^": "＾",
            _: "︳",
            "`": "｀",
            "{": "︷",
            "|": "―",
            "}": "︸",
            "~": "～",
            "¢": "￠",
            "£": "￡",
            "¥": "￥",
            "¦": "￤",
            "¬": "￢",
            "¯": "￣",
            "–": "︲",
            "—": "︱",
            "‘": "﹃",
            "’": "﹄",
            "“": "﹁",
            "”": "﹂",
            "…": "︙",
            "‧": "・",
            "₩": "￦",
            "、": "︑",
            "。": "︒",
            "〈": "︿",
            "〉": "﹀",
            "《": "︽",
            "》": "︾",
            "「": "﹁",
            "」": "﹂",
            "『": "﹃",
            "』": "﹄",
            "【": "︻",
            "】": "︼",
            "〔": "︹",
            "〕": "︺",
            "〖": "︗",
            "〗": "︘",
            "！": "︕",
            "（": "︵",
            "）": "︶",
            "，": "︐",
            "－": "︲",
            "．": "・",
            "：": "︓",
            "；": "︔",
            "＜": "︿",
            "＞": "﹀",
            "？": "︖",
            "［": "﹇",
            "］": "﹈",
            "＿": "︳",
            "｛": "︷",
            "｜": "―",
            "｝": "︸",
            "｟": "︵",
            "｠": "︶",
            "｡": "︒",
            "｢": "﹁",
            "｣": "﹂"
        };
        const Fe = 1, Ae = 2;
        function ke(t, i, e, n, r, s, o, h, a, l) {
            let u = t.trim();
            l === Ae && (u = function(t) {
                let i = "";
                for (let e = 0; e < t.length; e++) {
                    const n = t.charCodeAt(e + 1) || null, r = t.charCodeAt(e - 1) || null;
                    (!n || !ge(n) || xe[t[e + 1]]) && (!r || !ge(r) || xe[t[e - 1]]) && xe[t[e]] ? i += xe[t[e]] : i += t[e];
                }
                return i;
            }(u));
            const c = [], f = {
                positionedGlyphs: c,
                text: u,
                top: h[1],
                bottom: h[1],
                left: h[0],
                right: h[0],
                writingMode: l
            };
            let d;
            return d = function(t, i) {
                const e = [];
                let n = 0;
                for (let r = 0; r < i.length; r++) {
                    const s = i[r];
                    e.push(t.substring(n, s)), n = s;
                }
                return n < t.length && e.push(t.substring(n, t.length)), e;
            }(u, function(t, i, e, n) {
                if (!e) return [];
                if (!t) return [];
                const r = [], s = function(t, i, e, n) {
                    let r = 0;
                    for (let e = 0; e < t.length; e++) {
                        const s = n[t.charCodeAt(e)];
                        s && (r += s.metrics.advance + i);
                    }
                    const s = Math.max(1, Math.ceil(r / e));
                    return r / s;
                }(t, i, e, n);
                let o = 0;
                for (let e = 0; e < t.length; e++) {
                    const a = t.charCodeAt(e), l = n[a];
                    l && !_e[a] && (o += l.metrics.advance + i), e < t.length - 1 && (Se[a] || !((h = a) < 11904) && (Xi(h) || Ji(h) || fe(h) || le(h) || Qi(h) || Ni(h) || Zi(h) || Vi(h) || te(h) || ee(h) || Ki(h) || pe(h) || $i(h) || Hi(h) || Wi(h) || Yi(h) || Gi(h) || ce(h) || re(h) || ne(h))) && r.push(Ce(e + 1, o, s, r, Oe(a, t.charCodeAt(e + 1)), !1));
                }
                var h;
                return function t(i) {
                    if (!i) return [];
                    return t(i.priorBreak).concat(i.index);
                }(Ce(t.length, o, s, r, 0, !0));
            }(u, o, e, i)), function(t, i, e, n, r, s, o, h, a) {
                let l = 0, u = 8, c = 0;
                const f = t.positionedGlyphs, d = "right" === s ? 1 : "left" === s ? 0 : .5;
                for (let t = 0; t < e.length; t++) {
                    let r = e[t];
                    if (r = r.trim(), !r.length) {
                        u -= n;
                        continue;
                    }
                    const s = f.length;
                    for (let t = 0; t < r.length; t++) {
                        const e = r.charCodeAt(t), n = i[e];
                        n && (ve(e) && o !== Fe ? (32 !== e && f.push({
                            glyph: e,
                            x: l,
                            y: 0,
                            vertical: !0
                        }), l += a + h) : (32 !== e && f.push({
                            glyph: e,
                            x: l,
                            y: u,
                            vertical: !1
                        }), l += n.metrics.advance + h));
                    }
                    if (f.length !== s) {
                        const t = l - h;
                        c = Math.max(t, c), Te(f, i, s, f.length - 1, d);
                    }
                    l = 0, u -= n;
                }
                const {horizontalAlign: y, verticalAlign: p} = Ie(r);
                !function(t, i, e, n, r, s, o) {
                    const h = (i - e) * r, a = -(-n * o + .5) * s;
                    if (!h && !a) return;
                    for (let i = 0; i < t.length; i++) t[i].x += h, t[i].y += a;
                }(f, d, y, p, c, n, e.length);
                const m = e.length * n;
                t.top += -p * m, t.bottom = t.top + m, t.left += -y * c, t.right = t.left + c;
            }(f, i, d, n, r, s, l, o, a), !!c.length && f;
        }
        const _e = {
            9: !0,
            10: !0,
            11: !0,
            12: !0,
            13: !0,
            32: !0
        }, Se = {
            10: !0,
            32: !0,
            38: !0,
            40: !0,
            41: !0,
            43: !0,
            45: !0,
            47: !0,
            173: !0,
            183: !0,
            8203: !0,
            8208: !0,
            8211: !0,
            8231: !0
        };
        function Pe(t, i, e, n) {
            const r = Math.pow(t - i, 2);
            return n ? t < i ? r / 2 : 2 * r : r + Math.abs(e) * e;
        }
        function Oe(t, i) {
            let e = 0;
            return 10 === t && (e -= 1e4), 40 !== t && 65288 !== t || (e += 50), 41 !== i && 65289 !== i || (e += 50), 
            e;
        }
        function Ce(t, i, e, n, r, s) {
            let o = null, h = Pe(i, e, r, s);
            for (let t = 0; t < n.length; t++) {
                const a = n[t], l = Pe(i - a.x, e, r, s) + a.badness;
                l <= h && (o = a, h = l);
            }
            return {
                index: t,
                x: i,
                priorBreak: o,
                badness: h
            };
        }
        function Ie(t) {
            let i = .5, e = .5;
            switch (t) {
              case "right":
              case "top-right":
              case "bottom-right":
                i = 1;
                break;

              case "left":
              case "top-left":
              case "bottom-left":
                i = 0;
            }
            switch (t) {
              case "bottom":
              case "bottom-right":
              case "bottom-left":
                e = 1;
                break;

              case "top":
              case "top-right":
              case "top-left":
                e = 0;
            }
            return {
                horizontalAlign: i,
                verticalAlign: e
            };
        }
        function Te(t, i, e, n, r) {
            if (!r) return;
            const s = i[t[n].glyph];
            if (s) {
                const i = s.metrics.advance, o = (t[n].x + i) * r;
                if (!o) return;
                for (let i = e; i <= n; i++) t[i].x -= o;
            }
        }
        function De(t) {
            if (!function(t) {
                for (const i of t) if (we(i.charCodeAt(0))) return !0;
                return !1;
            }(t)) return t;
            const i = [], e = [], n = [];
            let r = 0, s = 0, o = 1, h = 1;
            for (const a of t) {
                const t = a.codePointAt(0);
                Me(t) ? (n.push(a), r++) : (o = we(t) ? -1 : 1, h !== o ? (s = r, e.length && (h > 0 && e.reverse(), 
                i.push(...e)), n.length && (i.splice(s, 0, ...n), n.length = 0), h = o, e.length = 0) : n.length && (e.push(...n), 
                n.length = 0), e.push(a), r++);
            }
            return n.length && e.push(...n), e.length && (h > 0 && e.reverse(), i.push(...e)), 
            i.reverse().join("");
        }
        const Le = /\{ *([\w_]+) *\}/g;
        class Ue {
            constructor(t, i, e, n, r) {
                this.feature = t, this.symbolDef = i, this.symbol = e, this.options = r, this.W = this.H.bind(this), 
                this.j = n;
            }
            H(t, i) {
                return this.feature.properties[i] || "default";
            }
            getShape(t, i) {
                if (this.V) return this.V;
                const {textHorizontalAlignmentFn: e, textVerticalAlignmentFn: n, markerHorizontalAlignmentFn: r, markerVerticalAlignmentFn: s, textWrapWidthFn: o} = this.j;
                let h;
                const a = this.symbol, l = this.getIconAndGlyph(), u = this.feature.properties;
                if (l && l.glyph) {
                    const {font: t, text: r} = l.glyph;
                    if ("" === r) return null;
                    const s = 24, c = this.size[0] / s, f = 24, d = a.textKeepUpright, y = "map" === a.textRotationAlignment && "line" === a.textPlacement && !a.isIconText, p = i.glyphMap[t], m = Ee(e ? e(null, u) : a.textHorizontalAlignment, n ? n(null, u) : a.textVerticalAlignment), v = 1.2 * f, g = function(t) {
                        for (let i = 0; i < t.length; i++) {
                            if (!me(t.charAt(i).charCodeAt(0))) return !1;
                        }
                        return !0;
                    }(r), w = g && a.textLetterSpacing / c || 0, b = [ a.textDx / c || 0, a.textDy / c || 0 ], M = ((o ? o(null, u) : a.textWrapWidth) || 10 * f) / c;
                    h = {}, h.horizontal = ke(r, p, M, v, m, "center", w, b, f, Fe), g && y && d && (h.vertical = ke(r, p, M, v, m, "center", w, b, f, Ae));
                } else if (l && l.icon) {
                    if (!t.positions[l.icon.url]) return null;
                    const i = Ee(r ? r(null, u) : a.markerHorizontalAlignment, s ? s(null, u) : a.markerVerticalAlignment);
                    h = function(t, i) {
                        const {horizontalAlign: e, verticalAlign: n} = Ie(i), r = -24 * e, s = -24 * n;
                        return {
                            image: t,
                            top: s,
                            bottom: s + 24,
                            left: r,
                            right: r + 24
                        };
                    }(t.positions[l.icon.url], i), this.size || (this.size = h.image.displaySize);
                }
                return this.V = h, h;
            }
            getIconAndGlyph() {
                if (this.iconGlyph) return this.iconGlyph;
                const {markerFileFn: t, markerTypeFn: i, markerWidthFn: e, markerHeightFn: n, markerFillFn: r, markerFillPatternFileFn: s, markerFillOpacityFn: o, markerTextFitFn: h, markerTextFitPaddingFn: a, markerLineColorFn: l, markerLineWidthFn: u, markerLineOpacityFn: c, markerLineDasharrayFn: f, markerLinePatternFileFn: d, textNameFn: y, textFaceNameFn: p, textStyleFn: m, textWeightFn: v} = this.j, {zoom: b} = this.options, M = {}, x = this.symbol, F = this.feature.properties, A = t ? t(null, F) : x.markerFile, k = i ? i(null, F) : x.markerType, _ = A || k || x.markerPath, S = !ii(this.symbolDef.textName);
                let P;
                if (_ && (P = function(t, i, e, n) {
                    if (ii(i.markerWidth) && ii(i.markerHeight)) return null;
                    let r = i.markerWidth || 0, s = i.markerHeight || 0;
                    return ni(r) && ("identity" !== r.type ? r = bi(r) : (r = t.markerWidth, t.__fn_markerWidth && (r = t.__fn_markerWidth(n, e)), 
                    ni(r) && (r = bi(r)))), ni(s) && ("identity" !== s.type ? s = bi(s) : (s = t.markerHeight, 
                    t.__fn_markerHeight && (s = t.__fn_markerHeight(n, e)), ni(s) && (s = bi(s)))), 
                    [ r, s ];
                }(x, this.symbolDef, F, b) || [ 0, 0 ], x.markerTextFit)) {
                    let t = x.markerTextFit;
                    if (h && (t = h(b, F)), t && "none" !== t) {
                        const i = x.text.textSize, e = xi(x.text.textName, F);
                        if (e) {
                            g(i) && !x.text.__fn_textSize && (x.text.__fn_textSize = w(i));
                            const n = wi(x.text, F, b);
                            if ("width" !== t && "both" !== t || (P[0] = n[0] * e.length), "height" !== t && "both" !== t || (P[1] = n[1]), 
                            n[0] && n[1]) {
                                let t = x.markerTextFitPadding || [ 0, 0, 0, 0 ];
                                a && (t = a(b, F)), P[0] += t[1] + t[3], P[1] += t[0] + t[2];
                            }
                        } else P[0] = P[1] = -1;
                    }
                }
                if (S && (P = wi(x, this.symbolDef, F, b)), !P) return M;
                if (P[0] = Math.ceil(P[0]), P[1] = Math.ceil(P[1]), this.size = P, _ && P[0] >= 0 && P[1] >= 0) {
                    let t;
                    if (k) {
                        const i = {};
                        if (i.markerType = k, e) {
                            const t = e(null, F);
                            ii(t) || (i.markerWidth = t);
                        } else x.markerWidth >= 0 && (i.markerWidth = x.markerWidth);
                        if (n) {
                            const t = n(null, F);
                            ii(t) || (i.markerHeight = t);
                        } else x.markerHeight >= 0 && (i.markerHeight = x.markerHeight);
                        if (r) {
                            const t = r(null, F);
                            ii(t) || (i.markerFill = t);
                        } else x.markerFill && (i.markerFill = x.markerFill);
                        if (s) {
                            const t = s(null, F);
                            ii(t) || (i.markerFillPatternFile = t);
                        } else x.markerFillPatternFile && (i.markerFillPatternFile = x.markerFillPatternFile);
                        if (o) {
                            const t = o(null, F);
                            ii(t) || (i.markerFillOpacity = t);
                        } else x.markerFillOpacity >= 0 && (i.markerFillOpacity = x.markerFillOpacity);
                        if (l) {
                            const t = l(null, F);
                            ii(t) || (i.markerLineColor = t);
                        } else x.markerLineColor && (i.markerLineColor = x.markerLineColor);
                        if (u) {
                            const t = u(null, F);
                            ii(t) || (i.markerLineWidth = t);
                        } else x.markerLineWidth >= 0 && (i.markerLineWidth = x.markerLineWidth);
                        if (c) {
                            const t = c(null, F);
                            ii(t) || (i.markerLineOpacity = t);
                        } else x.markerLineOpacity >= 0 && (i.markerLineOpacity = x.markerLineOpacity);
                        if (f) {
                            const t = f(null, F);
                            ii(t) || (i.markerLineDasharray = t);
                        } else x.markerLineDasharray && (i.markerLineDasharray = x.markerLineDasharray);
                        if (d) {
                            const t = d(null, F);
                            ii(t) || (i.markerLinePatternFile = t);
                        } else x.markerLinePatternFile && (i.markerLinePatternFile = x.markerLinePatternFile);
                        t = "vector://" + JSON.stringify(i);
                    } else t = A ? A.replace(Le, this.W) : x.markerPath ? function(t, i, e) {
                        if (!t.markerPath) return null;
                        let n = 1;
                        const r = function(t) {
                            const i = {
                                stroke: {
                                    stroke: t.markerLineColor,
                                    "stroke-width": t.markerLineWidth,
                                    "stroke-opacity": t.markerLineOpacity,
                                    "stroke-dasharray": null,
                                    "stroke-linecap": "butt",
                                    "stroke-linejoin": "round"
                                },
                                fill: {
                                    fill: t.markerFill,
                                    "fill-opacity": t.markerFillOpacity
                                }
                            };
                            0 === i.stroke["stroke-width"] && (i.stroke["stroke-opacity"] = 0);
                            return i;
                        }(t);
                        ei(t.markerOpacity) && (n = t.markerOpacity), ei(t.opacity) && (n *= t.opacity);
                        const s = {};
                        if (r) {
                            for (const t in r.stroke) oi(r.stroke, t) && (ii(r.stroke[t]) || (s[t] = r.stroke[t]));
                            for (const t in r.fill) oi(r.fill, t) && (ii(r.fill[t]) || (s[t] = r.fill[t]));
                        }
                        const o = Array.isArray(t.markerPath) ? t.markerPath : [ t.markerPath ];
                        let h;
                        const a = [];
                        for (let t = 0; t < o.length; t++) h = ri(o[t]) ? {
                            path: o[t]
                        } : o[t], h = ti({}, h, s), h.d = h.path, delete h.path, a.push(h);
                        const l = [ '<svg version="1.1"', 'xmlns="http://www.w3.org/2000/svg"' ];
                        n < 1 && l.push('opacity="' + n + '"'), t.markerPathWidth && t.markerPathHeight && l.push('viewBox="0 0 ' + t.markerPathWidth + " " + t.markerPathHeight + '"'), 
                        l.push('preserveAspectRatio="none"'), i && l.push('width="' + i + '"'), e && l.push('height="' + e + '"'), 
                        l.push("><defs></defs>");
                        for (let t = 0; t < a.length; t++) {
                            let i = "<path ";
                            for (const e in a[t]) oi(a[t], e) && (i += " " + e + '="' + a[t][e] + '"');
                            i += "></path>", l.push(i);
                        }
                        return l.push("</svg>"), "data:image/svg+xml;base64," + btoa(l.join(" "));
                    }(x, P[0], P[1]) : null;
                    M.icon = {
                        url: t,
                        size: P
                    };
                }
                if (S) {
                    const t = y ? y(null, F) : x.textName;
                    if (t || 0 === t) {
                        const i = function(t, i, e) {
                            return [ i || "normal", e || "normal", "24px", t || "monospace" ].join(" ");
                        }(p ? p(null, F) : x.textFaceName, m ? m(null, F) : x.textStyle, v ? v(null, F) : x.textWeight);
                        let e = xi(t, F);
                        e && e.length && (e = De(e), M.glyph = {
                            font: i,
                            text: e
                        });
                    }
                }
                return this.iconGlyph = M, M;
            }
        }
        function Ee(t, i) {
            i && "middle" !== i || (i = "center"), t && "middle" !== t || (t = "center");
            let e = "center" !== i ? i : "";
            return e += "center" !== t ? (e.length ? "-" : "") + t : "", e;
        }
        /*!
         * From mapbox-gl-js
         * MIT License
         * https://github.com/mapbox/mapbox-gl-js
         */        function je(t, i, e, n, r) {
            const s = [];
            for (let o = 0; o < t.length; o++) {
                const h = t[o];
                let a;
                for (let t = 0; t < h.length - 1; t++) {
                    let o = h[t], l = h[t + 1];
                    o.x < i && l.x < i || (o.x < i ? o = new Pt(i, o.y + (l.y - o.y) * ((i - o.x) / (l.x - o.x))).D() : l.x < i && (l = new Pt(i, o.y + (l.y - o.y) * ((i - o.x) / (l.x - o.x))).D()), 
                    o.y < e && l.y < e || (o.y < e ? o = new Pt(o.x + (l.x - o.x) * ((e - o.y) / (l.y - o.y)), e).D() : l.y < e && (l = new Pt(o.x + (l.x - o.x) * ((e - o.y) / (l.y - o.y)), e).D()), 
                    o.x >= n && l.x >= n || (o.x >= n ? o = new Pt(n, o.y + (l.y - o.y) * ((n - o.x) / (l.x - o.x))).D() : l.x >= n && (l = new Pt(n, o.y + (l.y - o.y) * ((n - o.x) / (l.x - o.x))).D()), 
                    o.y >= r && l.y >= r || (o.y >= r ? o = new Pt(o.x + (l.x - o.x) * ((r - o.y) / (l.y - o.y)), r).D() : l.y >= r && (l = new Pt(o.x + (l.x - o.x) * ((r - o.y) / (l.y - o.y)), r).D()), 
                    a && o.equals(a[a.length - 1]) || (a = [ o ], s.push(a)), a.push(l)))));
                }
            }
            return s;
        }
        class Re extends Pt {
            constructor(t, i, e, n) {
                super(t, i), this.angle = e, void 0 !== n && (this.segment = n);
            }
            clone() {
                return new Re(this.x, this.y, this.angle, this.segment);
            }
        }
        /*!
         * From mapbox-gl-js
         * MIT License
         * https://github.com/mapbox/mapbox-gl-js
         */        function ze(t, i, e, n, r) {
            if (void 0 === i.segment) return !0;
            let s = i, o = i.segment + 1, h = 0;
            for (;h > -e / 2; ) {
                if (o--, o < 0) return !1;
                h -= t[o].dist(s), s = t[o];
            }
            h += t[o].dist(t[o + 1]), o++;
            const a = [];
            let l = 0;
            for (;h < e / 2; ) {
                const i = t[o - 1], e = t[o], s = t[o + 1];
                if (!s) return !1;
                let u = i.angleTo(e) - e.angleTo(s);
                for (u = Math.abs((u + 3 * Math.PI) % (2 * Math.PI) - Math.PI), a.push({
                    distance: h,
                    angleDelta: u
                }), l += u; h - a[0].distance > n; ) l -= a.shift().angleDelta;
                if (l > r) return !1;
                o++, h += e.dist(s);
            }
            return !0;
        }
        function Ne(t, i, e, n, r, s, o, h, a) {
            const l = function(t, i, e) {
                return t ? .6 * i * e : 0;
            }(n, s, o), u = function(t, i) {
                return Math.max(t ? t.right - t.left : 0, i ? i.right - i.left : 0);
            }(n, r), c = 0 === t[0].x || t[0].x === a || 0 === t[0].y || t[0].y === a;
            i - u * o < i / 4 && (i = u * o + i / 4);
            return function t(i, e, n, r, s, o, h, a, l) {
                const u = o / 2, c = function(t) {
                    let i = 0;
                    for (let e = 0; e < t.length - 1; e++) i += t[e].dist(t[e + 1]);
                    return i;
                }(i);
                let f = 0, d = e - n, y = [];
                for (let t = 0; t < i.length - 1; t++) {
                    const e = i[t], h = i[t + 1], a = e.dist(h), p = h.angleTo(e);
                    for (;d + n < f + a; ) {
                        d += n;
                        const m = (d - f) / a, v = We(e.x, h.x, m), g = We(e.y, h.y, m);
                        if (v >= 0 && v < l && g >= 0 && g < l && d - u >= 0 && d + u <= c) {
                            const e = new Re(v, g, p, t);
                            e.line = i, e.D(), r && !ze(i, e, o, r, s) || y.push(e);
                        }
                    }
                    f += a;
                }
                a || y.length || h || (y = t(i, f / 2, n, r, s, o, h, !0, l));
                return y;
            }(t, c ? i / 2 * h % i : (u / 2 + 2 * s) * o * h % i, i, l, e, u * o, c, !1, a);
        }
        function We(t, i, e) {
            return t * (1 - e) + i * e;
        }
        var He = {
            exports: {}
        };
        !function(t, i) {
            t.exports = function() {
                function t(t, i, e) {
                    var n = t[i];
                    t[i] = t[e], t[e] = n;
                }
                function i(t, i) {
                    return t < i ? -1 : t > i ? 1 : 0;
                }
                return function(e, n, r, s, o) {
                    !function i(e, n, r, s, o) {
                        for (;s > r; ) {
                            if (s - r > 600) {
                                var h = s - r + 1, a = n - r + 1, l = Math.log(h), u = .5 * Math.exp(2 * l / 3), c = .5 * Math.sqrt(l * u * (h - u) / h) * (a - h / 2 < 0 ? -1 : 1), f = Math.max(r, Math.floor(n - a * u / h + c)), d = Math.min(s, Math.floor(n + (h - a) * u / h + c));
                                i(e, n, f, d, o);
                            }
                            var y = e[n], p = r, m = s;
                            for (t(e, r, n), o(e[s], y) > 0 && t(e, r, s); p < m; ) {
                                for (t(e, p, m), p++, m--; o(e[p], y) < 0; ) p++;
                                for (;o(e[m], y) > 0; ) m--;
                            }
                            0 === o(e[r], y) ? t(e, r, m) : (m++, t(e, m, s)), m <= n && (r = m + 1), n <= m && (s = m - 1);
                        }
                    }(e, n, r || 0, s || e.length - 1, o || i);
                };
            }();
        }(He);
        var Ve = He.exports;
        function $e(t, i) {
            const e = t.length;
            if (e <= 1) return [ t ];
            const n = [];
            let r, s;
            for (let i = 0; i < e; i++) {
                const e = ai(t[i]);
                0 !== e && (t[i].area = Math.abs(e), void 0 === s && (s = e < 0), s === e < 0 ? (r && n.push(r), 
                r = [ t[i] ]) : r.push(t[i]));
            }
            if (r && n.push(r), i > 1) for (let t = 0; t < n.length; t++) n[t].length <= i || (Ve(n[t], i, 1, n[t].length - 1, Ge), 
            n[t] = n[t].slice(0, i));
            return n;
        }
        function Ge(t, i) {
            return i.area - t.area;
        }
        var Je = {
            exports: {}
        };
        function qe(t, i) {
            if (!(this instanceof qe)) return new qe(t, i);
            if (this.data = t || [], this.length = this.data.length, this.compare = i || Be, 
            this.length > 0) for (var e = (this.length >> 1) - 1; e >= 0; e--) this.G(e);
        }
        function Be(t, i) {
            return t < i ? -1 : t > i ? 1 : 0;
        }
        Je.exports = qe, Je.exports.default = qe, qe.prototype = {
            push: function(t) {
                this.data.push(t), this.length++, this.J(this.length - 1);
            },
            pop: function() {
                if (0 !== this.length) {
                    var t = this.data[0];
                    return this.length--, this.length > 0 && (this.data[0] = this.data[this.length], 
                    this.G(0)), this.data.pop(), t;
                }
            },
            peek: function() {
                return this.data[0];
            },
            J: function(t) {
                for (var i = this.data, e = this.compare, n = i[t]; t > 0; ) {
                    var r = t - 1 >> 1, s = i[r];
                    if (e(n, s) >= 0) break;
                    i[t] = s, t = r;
                }
                i[t] = n;
            },
            G: function(t) {
                for (var i = this.data, e = this.compare, n = this.length >> 1, r = i[t]; t < n; ) {
                    var s = 1 + (t << 1), o = s + 1, h = i[s];
                    if (o < this.length && e(i[o], h) < 0 && (s = o, h = i[o]), e(h, r) >= 0) break;
                    i[t] = h, t = s;
                }
                i[t] = r;
            }
        };
        var Xe = Je.exports;
        function Ze(t, i, e) {
            const n = i.distSqr(e);
            if (0 === n) return t.distSqr(i);
            const r = ((t.x - i.x) * (e.x - i.x) + (t.y - i.y) * (e.y - i.y)) / n;
            return r < 0 ? t.distSqr(i) : r > 1 ? t.distSqr(e) : t.distSqr(e.sub(i).k(r).m(i));
        }
        function Ye(t, i = 1, e = !1) {
            let n = 1 / 0, r = 1 / 0, s = -1 / 0, o = -1 / 0;
            const h = t[0];
            for (let t = 0; t < h.length; t++) {
                const i = h[t];
                (!t || i.x < n) && (n = i.x), (!t || i.y < r) && (r = i.y), (!t || i.x > s) && (s = i.x), 
                (!t || i.y > o) && (o = i.y);
            }
            const a = s - n, l = o - r, u = Math.min(a, l);
            let c = u / 2;
            const f = new Xe(null, Ke);
            if (0 === u) return new Pt(n, r);
            for (let i = n; i < s; i += u) for (let e = r; e < o; e += u) f.push(new Qe(i + c, e + c, c, t));
            let d = function(t) {
                let i = 0, e = 0, n = 0;
                const r = t[0];
                for (let t = 0, s = r.length, o = s - 1; t < s; o = t++) {
                    const s = r[t], h = r[o], a = s.x * h.y - h.x * s.y;
                    e += (s.x + h.x) * a, n += (s.y + h.y) * a, i += 3 * a;
                }
                return new Qe(e / i, n / i, 0, t);
            }(t), y = f.length;
            for (;f.length; ) {
                const n = f.pop();
                (n.d > d.d || !d.d) && (d = n, e && console.log("found best %d after %d probes", Math.round(1e4 * n.d) / 1e4, y)), 
                n.max - d.d <= i || (c = n.h / 2, f.push(new Qe(n.p.x - c, n.p.y - c, c, t)), f.push(new Qe(n.p.x + c, n.p.y - c, c, t)), 
                f.push(new Qe(n.p.x - c, n.p.y + c, c, t)), f.push(new Qe(n.p.x + c, n.p.y + c, c, t)), 
                y += 4);
            }
            return e && (console.log("num probes: " + y), console.log("best distance: " + d.d)), 
            d.p;
        }
        function Ke(t, i) {
            return i.max - t.max;
        }
        function Qe(t, i, e, n) {
            this.p = new Pt(t, i), this.h = e, this.d = function(t, i) {
                let e = !1, n = 1 / 0;
                for (let r = 0; r < i.length; r++) {
                    const s = i[r];
                    for (let i = 0, r = s.length, o = r - 1; i < r; o = i++) {
                        const r = s[i], h = s[o];
                        r.y > t.y != h.y > t.y && t.x < (h.x - r.x) * (t.y - r.y) / (h.y - r.y) + r.x && (e = !e), 
                        n = Math.min(n, Ze(t, r, h));
                    }
                }
                return (e ? 1 : -1) * Math.sqrt(n);
            }(this.p, n), this.max = this.d + this.h * Math.SQRT2;
        }
        const tn = 45 * Math.PI / 100;
        var en = {
            exports: {}
        }, nn = {
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
        }, rn = {
            exports: {}
        }, sn = function(t) {
            return !(!t || "string" == typeof t) && (t instanceof Array || Array.isArray(t) || t.length >= 0 && (t.splice instanceof Function || Object.getOwnPropertyDescriptor(t, t.length - 1) && "String" !== t.constructor.name));
        }, on = Array.prototype.concat, hn = Array.prototype.slice, an = rn.exports = function(t) {
            for (var i = [], e = 0, n = t.length; e < n; e++) {
                var r = t[e];
                sn(r) ? i = on.call(i, hn.call(r)) : i.push(r);
            }
            return i;
        };
        an.wrap = function(t) {
            return function() {
                return t(an(arguments));
            };
        };
        var ln = nn, un = rn.exports, cn = {};
        for (var fn in ln) ln.hasOwnProperty(fn) && (cn[ln[fn]] = fn);
        var dn = en.exports = {
            to: {},
            get: {}
        };
        function yn(t, i, e) {
            return Math.min(Math.max(i, t), e);
        }
        function pn(t) {
            var i = t.toString(16).toUpperCase();
            return i.length < 2 ? "0" + i : i;
        }
        dn.get = function(t) {
            var i, e;
            switch (t.substring(0, 3).toLowerCase()) {
              case "hsl":
                i = dn.get.hsl(t), e = "hsl";
                break;

              case "hwb":
                i = dn.get.hwb(t), e = "hwb";
                break;

              default:
                i = dn.get.rgb(t), e = "rgb";
            }
            return i ? {
                model: e,
                value: i
            } : null;
        }, dn.get.rgb = function(t) {
            if (!t) return null;
            var i, e, n, r = [ 0, 0, 0, 1 ];
            if (i = t.match(/^#([a-f0-9]{6})([a-f0-9]{2})?$/i)) {
                for (n = i[2], i = i[1], e = 0; e < 3; e++) {
                    var s = 2 * e;
                    r[e] = parseInt(i.slice(s, s + 2), 16);
                }
                n && (r[3] = Math.round(parseInt(n, 16) / 255 * 100) / 100);
            } else if (i = t.match(/^#([a-f0-9]{3,4})$/i)) {
                for (n = (i = i[1])[3], e = 0; e < 3; e++) r[e] = parseInt(i[e] + i[e], 16);
                n && (r[3] = Math.round(parseInt(n + n, 16) / 255 * 100) / 100);
            } else if (i = t.match(/^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/)) {
                for (e = 0; e < 3; e++) r[e] = parseInt(i[e + 1], 0);
                i[4] && (r[3] = parseFloat(i[4]));
            } else {
                if (!(i = t.match(/^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/))) return (i = t.match(/(\D+)/)) ? "transparent" === i[1] ? [ 0, 0, 0, 0 ] : (r = ln[i[1]]) ? (r[3] = 1, 
                r) : null : null;
                for (e = 0; e < 3; e++) r[e] = Math.round(2.55 * parseFloat(i[e + 1]));
                i[4] && (r[3] = parseFloat(i[4]));
            }
            for (e = 0; e < 3; e++) r[e] = yn(r[e], 0, 255);
            return r[3] = yn(r[3], 0, 1), r;
        }, dn.get.hsl = function(t) {
            if (!t) return null;
            var i = t.match(/^hsla?\(\s*([+-]?(?:\d*\.)?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/);
            if (i) {
                var e = parseFloat(i[4]);
                return [ (parseFloat(i[1]) + 360) % 360, yn(parseFloat(i[2]), 0, 100), yn(parseFloat(i[3]), 0, 100), yn(isNaN(e) ? 1 : e, 0, 1) ];
            }
            return null;
        }, dn.get.hwb = function(t) {
            if (!t) return null;
            var i = t.match(/^hwb\(\s*([+-]?\d*[\.]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/);
            if (i) {
                var e = parseFloat(i[4]);
                return [ (parseFloat(i[1]) % 360 + 360) % 360, yn(parseFloat(i[2]), 0, 100), yn(parseFloat(i[3]), 0, 100), yn(isNaN(e) ? 1 : e, 0, 1) ];
            }
            return null;
        }, dn.to.hex = function() {
            var t = un(arguments);
            return "#" + pn(t[0]) + pn(t[1]) + pn(t[2]) + (t[3] < 1 ? pn(Math.round(255 * t[3])) : "");
        }, dn.to.rgb = function() {
            var t = un(arguments);
            return t.length < 4 || 1 === t[3] ? "rgb(" + Math.round(t[0]) + ", " + Math.round(t[1]) + ", " + Math.round(t[2]) + ")" : "rgba(" + Math.round(t[0]) + ", " + Math.round(t[1]) + ", " + Math.round(t[2]) + ", " + t[3] + ")";
        }, dn.to.rgb.percent = function() {
            var t = un(arguments), i = Math.round(t[0] / 255 * 100), e = Math.round(t[1] / 255 * 100), n = Math.round(t[2] / 255 * 100);
            return t.length < 4 || 1 === t[3] ? "rgb(" + i + "%, " + e + "%, " + n + "%)" : "rgba(" + i + "%, " + e + "%, " + n + "%, " + t[3] + ")";
        }, dn.to.hsl = function() {
            var t = un(arguments);
            return t.length < 4 || 1 === t[3] ? "hsl(" + t[0] + ", " + t[1] + "%, " + t[2] + "%)" : "hsla(" + t[0] + ", " + t[1] + "%, " + t[2] + "%, " + t[3] + ")";
        }, dn.to.hwb = function() {
            var t = un(arguments), i = "";
            return t.length >= 4 && 1 !== t[3] && (i = ", " + t[3]), "hwb(" + t[0] + ", " + t[1] + "%, " + t[2] + "%" + i + ")";
        }, dn.to.keyword = function(t) {
            return cn[t.slice(0, 3)];
        };
        var mn = {
            exports: {}
        }, vn = nn, gn = {};
        for (var wn in vn) vn.hasOwnProperty(wn) && (gn[vn[wn]] = wn);
        var bn = mn.exports = {
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
        for (var Mn in bn) if (bn.hasOwnProperty(Mn)) {
            if (!("channels" in bn[Mn])) throw new Error("missing channels property: " + Mn);
            if (!("labels" in bn[Mn])) throw new Error("missing channel labels property: " + Mn);
            if (bn[Mn].labels.length !== bn[Mn].channels) throw new Error("channel and label counts mismatch: " + Mn);
            var xn = bn[Mn].channels, Fn = bn[Mn].labels;
            delete bn[Mn].channels, delete bn[Mn].labels, Object.defineProperty(bn[Mn], "channels", {
                value: xn
            }), Object.defineProperty(bn[Mn], "labels", {
                value: Fn
            });
        }
        bn.rgb.hsl = function(t) {
            var i, e, n = t[0] / 255, r = t[1] / 255, s = t[2] / 255, o = Math.min(n, r, s), h = Math.max(n, r, s), a = h - o;
            return h === o ? i = 0 : n === h ? i = (r - s) / a : r === h ? i = 2 + (s - n) / a : s === h && (i = 4 + (n - r) / a), 
            (i = Math.min(60 * i, 360)) < 0 && (i += 360), e = (o + h) / 2, [ i, 100 * (h === o ? 0 : e <= .5 ? a / (h + o) : a / (2 - h - o)), 100 * e ];
        }, bn.rgb.hsv = function(t) {
            var i, e, n = t[0], r = t[1], s = t[2], o = Math.min(n, r, s), h = Math.max(n, r, s), a = h - o;
            return e = 0 === h ? 0 : a / h * 1e3 / 10, h === o ? i = 0 : n === h ? i = (r - s) / a : r === h ? i = 2 + (s - n) / a : s === h && (i = 4 + (n - r) / a), 
            (i = Math.min(60 * i, 360)) < 0 && (i += 360), [ i, e, h / 255 * 1e3 / 10 ];
        }, bn.rgb.hwb = function(t) {
            var i = t[0], e = t[1], n = t[2];
            return [ bn.rgb.hsl(t)[0], 100 * (1 / 255 * Math.min(i, Math.min(e, n))), 100 * (n = 1 - 1 / 255 * Math.max(i, Math.max(e, n))) ];
        }, bn.rgb.cmyk = function(t) {
            var i, e = t[0] / 255, n = t[1] / 255, r = t[2] / 255;
            return [ 100 * ((1 - e - (i = Math.min(1 - e, 1 - n, 1 - r))) / (1 - i) || 0), 100 * ((1 - n - i) / (1 - i) || 0), 100 * ((1 - r - i) / (1 - i) || 0), 100 * i ];
        }, bn.rgb.keyword = function(t) {
            var i = gn[t];
            if (i) return i;
            var e, n, r, s = 1 / 0;
            for (var o in vn) if (vn.hasOwnProperty(o)) {
                var h = vn[o], a = (n = t, r = h, Math.pow(n[0] - r[0], 2) + Math.pow(n[1] - r[1], 2) + Math.pow(n[2] - r[2], 2));
                a < s && (s = a, e = o);
            }
            return e;
        }, bn.keyword.rgb = function(t) {
            return vn[t];
        }, bn.rgb.xyz = function(t) {
            var i = t[0] / 255, e = t[1] / 255, n = t[2] / 255;
            return [ 100 * (.4124 * (i = i > .04045 ? Math.pow((i + .055) / 1.055, 2.4) : i / 12.92) + .3576 * (e = e > .04045 ? Math.pow((e + .055) / 1.055, 2.4) : e / 12.92) + .1805 * (n = n > .04045 ? Math.pow((n + .055) / 1.055, 2.4) : n / 12.92)), 100 * (.2126 * i + .7152 * e + .0722 * n), 100 * (.0193 * i + .1192 * e + .9505 * n) ];
        }, bn.rgb.lab = function(t) {
            var i = bn.rgb.xyz(t), e = i[0], n = i[1], r = i[2];
            return n /= 100, r /= 108.883, e = (e /= 95.047) > .008856 ? Math.pow(e, 1 / 3) : 7.787 * e + 16 / 116, 
            [ 116 * (n = n > .008856 ? Math.pow(n, 1 / 3) : 7.787 * n + 16 / 116) - 16, 500 * (e - n), 200 * (n - (r = r > .008856 ? Math.pow(r, 1 / 3) : 7.787 * r + 16 / 116)) ];
        }, bn.hsl.rgb = function(t) {
            var i, e, n, r, s, o = t[0] / 360, h = t[1] / 100, a = t[2] / 100;
            if (0 === h) return [ s = 255 * a, s, s ];
            i = 2 * a - (e = a < .5 ? a * (1 + h) : a + h - a * h), r = [ 0, 0, 0 ];
            for (var l = 0; l < 3; l++) (n = o + 1 / 3 * -(l - 1)) < 0 && n++, n > 1 && n--, 
            s = 6 * n < 1 ? i + 6 * (e - i) * n : 2 * n < 1 ? e : 3 * n < 2 ? i + (e - i) * (2 / 3 - n) * 6 : i, 
            r[l] = 255 * s;
            return r;
        }, bn.hsl.hsv = function(t) {
            var i = t[0], e = t[1] / 100, n = t[2] / 100, r = e, s = Math.max(n, .01);
            return e *= (n *= 2) <= 1 ? n : 2 - n, r *= s <= 1 ? s : 2 - s, [ i, 100 * (0 === n ? 2 * r / (s + r) : 2 * e / (n + e)), 100 * ((n + e) / 2) ];
        }, bn.hsv.rgb = function(t) {
            var i = t[0] / 60, e = t[1] / 100, n = t[2] / 100, r = Math.floor(i) % 6, s = i - Math.floor(i), o = 255 * n * (1 - e), h = 255 * n * (1 - e * s), a = 255 * n * (1 - e * (1 - s));
            switch (n *= 255, r) {
              case 0:
                return [ n, a, o ];

              case 1:
                return [ h, n, o ];

              case 2:
                return [ o, n, a ];

              case 3:
                return [ o, h, n ];

              case 4:
                return [ a, o, n ];

              case 5:
                return [ n, o, h ];
            }
        }, bn.hsv.hsl = function(t) {
            var i, e, n, r = t[0], s = t[1] / 100, o = t[2] / 100, h = Math.max(o, .01);
            return n = (2 - s) * o, e = s * h, [ r, 100 * (e = (e /= (i = (2 - s) * h) <= 1 ? i : 2 - i) || 0), 100 * (n /= 2) ];
        }, bn.hwb.rgb = function(t) {
            var i, e, n, r, s, o, h, a = t[0] / 360, l = t[1] / 100, u = t[2] / 100, c = l + u;
            switch (c > 1 && (l /= c, u /= c), n = 6 * a - (i = Math.floor(6 * a)), 0 != (1 & i) && (n = 1 - n), 
            r = l + n * ((e = 1 - u) - l), i) {
              default:
              case 6:
              case 0:
                s = e, o = r, h = l;
                break;

              case 1:
                s = r, o = e, h = l;
                break;

              case 2:
                s = l, o = e, h = r;
                break;

              case 3:
                s = l, o = r, h = e;
                break;

              case 4:
                s = r, o = l, h = e;
                break;

              case 5:
                s = e, o = l, h = r;
            }
            return [ 255 * s, 255 * o, 255 * h ];
        }, bn.cmyk.rgb = function(t) {
            var i = t[0] / 100, e = t[1] / 100, n = t[2] / 100, r = t[3] / 100;
            return [ 255 * (1 - Math.min(1, i * (1 - r) + r)), 255 * (1 - Math.min(1, e * (1 - r) + r)), 255 * (1 - Math.min(1, n * (1 - r) + r)) ];
        }, bn.xyz.rgb = function(t) {
            var i, e, n, r = t[0] / 100, s = t[1] / 100, o = t[2] / 100;
            return e = -.9689 * r + 1.8758 * s + .0415 * o, n = .0557 * r + -.204 * s + 1.057 * o, 
            i = (i = 3.2406 * r + -1.5372 * s + -.4986 * o) > .0031308 ? 1.055 * Math.pow(i, 1 / 2.4) - .055 : 12.92 * i, 
            e = e > .0031308 ? 1.055 * Math.pow(e, 1 / 2.4) - .055 : 12.92 * e, n = n > .0031308 ? 1.055 * Math.pow(n, 1 / 2.4) - .055 : 12.92 * n, 
            [ 255 * (i = Math.min(Math.max(0, i), 1)), 255 * (e = Math.min(Math.max(0, e), 1)), 255 * (n = Math.min(Math.max(0, n), 1)) ];
        }, bn.xyz.lab = function(t) {
            var i = t[0], e = t[1], n = t[2];
            return e /= 100, n /= 108.883, i = (i /= 95.047) > .008856 ? Math.pow(i, 1 / 3) : 7.787 * i + 16 / 116, 
            [ 116 * (e = e > .008856 ? Math.pow(e, 1 / 3) : 7.787 * e + 16 / 116) - 16, 500 * (i - e), 200 * (e - (n = n > .008856 ? Math.pow(n, 1 / 3) : 7.787 * n + 16 / 116)) ];
        }, bn.lab.xyz = function(t) {
            var i, e, n, r = t[0];
            i = t[1] / 500 + (e = (r + 16) / 116), n = e - t[2] / 200;
            var s = Math.pow(e, 3), o = Math.pow(i, 3), h = Math.pow(n, 3);
            return e = s > .008856 ? s : (e - 16 / 116) / 7.787, i = o > .008856 ? o : (i - 16 / 116) / 7.787, 
            n = h > .008856 ? h : (n - 16 / 116) / 7.787, [ i *= 95.047, e *= 100, n *= 108.883 ];
        }, bn.lab.lch = function(t) {
            var i, e = t[0], n = t[1], r = t[2];
            return (i = 360 * Math.atan2(r, n) / 2 / Math.PI) < 0 && (i += 360), [ e, Math.sqrt(n * n + r * r), i ];
        }, bn.lch.lab = function(t) {
            var i, e = t[0], n = t[1];
            return i = t[2] / 360 * 2 * Math.PI, [ e, n * Math.cos(i), n * Math.sin(i) ];
        }, bn.rgb.ansi16 = function(t) {
            var i = t[0], e = t[1], n = t[2], r = 1 in arguments ? arguments[1] : bn.rgb.hsv(t)[2];
            if (0 === (r = Math.round(r / 50))) return 30;
            var s = 30 + (Math.round(n / 255) << 2 | Math.round(e / 255) << 1 | Math.round(i / 255));
            return 2 === r && (s += 60), s;
        }, bn.hsv.ansi16 = function(t) {
            return bn.rgb.ansi16(bn.hsv.rgb(t), t[2]);
        }, bn.rgb.ansi256 = function(t) {
            var i = t[0], e = t[1], n = t[2];
            return i === e && e === n ? i < 8 ? 16 : i > 248 ? 231 : Math.round((i - 8) / 247 * 24) + 232 : 16 + 36 * Math.round(i / 255 * 5) + 6 * Math.round(e / 255 * 5) + Math.round(n / 255 * 5);
        }, bn.ansi16.rgb = function(t) {
            var i = t % 10;
            if (0 === i || 7 === i) return t > 50 && (i += 3.5), [ i = i / 10.5 * 255, i, i ];
            var e = .5 * (1 + ~~(t > 50));
            return [ (1 & i) * e * 255, (i >> 1 & 1) * e * 255, (i >> 2 & 1) * e * 255 ];
        }, bn.ansi256.rgb = function(t) {
            if (t >= 232) {
                var i = 10 * (t - 232) + 8;
                return [ i, i, i ];
            }
            var e;
            return t -= 16, [ Math.floor(t / 36) / 5 * 255, Math.floor((e = t % 36) / 6) / 5 * 255, e % 6 / 5 * 255 ];
        }, bn.rgb.hex = function(t) {
            var i = (((255 & Math.round(t[0])) << 16) + ((255 & Math.round(t[1])) << 8) + (255 & Math.round(t[2]))).toString(16).toUpperCase();
            return "000000".substring(i.length) + i;
        }, bn.hex.rgb = function(t) {
            var i = t.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
            if (!i) return [ 0, 0, 0 ];
            var e = i[0];
            3 === i[0].length && (e = e.split("").map((function(t) {
                return t + t;
            })).join(""));
            var n = parseInt(e, 16);
            return [ n >> 16 & 255, n >> 8 & 255, 255 & n ];
        }, bn.rgb.hcg = function(t) {
            var i, e = t[0] / 255, n = t[1] / 255, r = t[2] / 255, s = Math.max(Math.max(e, n), r), o = Math.min(Math.min(e, n), r), h = s - o;
            return i = h <= 0 ? 0 : s === e ? (n - r) / h % 6 : s === n ? 2 + (r - e) / h : 4 + (e - n) / h + 4, 
            i /= 6, [ 360 * (i %= 1), 100 * h, 100 * (h < 1 ? o / (1 - h) : 0) ];
        }, bn.hsl.hcg = function(t) {
            var i = t[1] / 100, e = t[2] / 100, n = 1, r = 0;
            return (n = e < .5 ? 2 * i * e : 2 * i * (1 - e)) < 1 && (r = (e - .5 * n) / (1 - n)), 
            [ t[0], 100 * n, 100 * r ];
        }, bn.hsv.hcg = function(t) {
            var i = t[1] / 100, e = t[2] / 100, n = i * e, r = 0;
            return n < 1 && (r = (e - n) / (1 - n)), [ t[0], 100 * n, 100 * r ];
        }, bn.hcg.rgb = function(t) {
            var i = t[0] / 360, e = t[1] / 100, n = t[2] / 100;
            if (0 === e) return [ 255 * n, 255 * n, 255 * n ];
            var r, s = [ 0, 0, 0 ], o = i % 1 * 6, h = o % 1, a = 1 - h;
            switch (Math.floor(o)) {
              case 0:
                s[0] = 1, s[1] = h, s[2] = 0;
                break;

              case 1:
                s[0] = a, s[1] = 1, s[2] = 0;
                break;

              case 2:
                s[0] = 0, s[1] = 1, s[2] = h;
                break;

              case 3:
                s[0] = 0, s[1] = a, s[2] = 1;
                break;

              case 4:
                s[0] = h, s[1] = 0, s[2] = 1;
                break;

              default:
                s[0] = 1, s[1] = 0, s[2] = a;
            }
            return r = (1 - e) * n, [ 255 * (e * s[0] + r), 255 * (e * s[1] + r), 255 * (e * s[2] + r) ];
        }, bn.hcg.hsv = function(t) {
            var i = t[1] / 100, e = i + t[2] / 100 * (1 - i), n = 0;
            return e > 0 && (n = i / e), [ t[0], 100 * n, 100 * e ];
        }, bn.hcg.hsl = function(t) {
            var i = t[1] / 100, e = t[2] / 100 * (1 - i) + .5 * i, n = 0;
            return e > 0 && e < .5 ? n = i / (2 * e) : e >= .5 && e < 1 && (n = i / (2 * (1 - e))), 
            [ t[0], 100 * n, 100 * e ];
        }, bn.hcg.hwb = function(t) {
            var i = t[1] / 100, e = i + t[2] / 100 * (1 - i);
            return [ t[0], 100 * (e - i), 100 * (1 - e) ];
        }, bn.hwb.hcg = function(t) {
            var i = t[1] / 100, e = 1 - t[2] / 100, n = e - i, r = 0;
            return n < 1 && (r = (e - n) / (1 - n)), [ t[0], 100 * n, 100 * r ];
        }, bn.apple.rgb = function(t) {
            return [ t[0] / 65535 * 255, t[1] / 65535 * 255, t[2] / 65535 * 255 ];
        }, bn.rgb.apple = function(t) {
            return [ t[0] / 255 * 65535, t[1] / 255 * 65535, t[2] / 255 * 65535 ];
        }, bn.gray.rgb = function(t) {
            return [ t[0] / 100 * 255, t[0] / 100 * 255, t[0] / 100 * 255 ];
        }, bn.gray.hsl = bn.gray.hsv = function(t) {
            return [ 0, 0, t[0] ];
        }, bn.gray.hwb = function(t) {
            return [ 0, 100, t[0] ];
        }, bn.gray.cmyk = function(t) {
            return [ 0, 0, 0, t[0] ];
        }, bn.gray.lab = function(t) {
            return [ t[0], 0, 0 ];
        }, bn.gray.hex = function(t) {
            var i = 255 & Math.round(t[0] / 100 * 255), e = ((i << 16) + (i << 8) + i).toString(16).toUpperCase();
            return "000000".substring(e.length) + e;
        }, bn.rgb.gray = function(t) {
            return [ (t[0] + t[1] + t[2]) / 3 / 255 * 100 ];
        };
        var An = mn.exports;
        function kn(t) {
            var i = function() {
                for (var t = {}, i = Object.keys(An), e = i.length, n = 0; n < e; n++) t[i[n]] = {
                    distance: -1,
                    parent: null
                };
                return t;
            }(), e = [ t ];
            for (i[t].distance = 0; e.length; ) for (var n = e.pop(), r = Object.keys(An[n]), s = r.length, o = 0; o < s; o++) {
                var h = r[o], a = i[h];
                -1 === a.distance && (a.distance = i[n].distance + 1, a.parent = n, e.unshift(h));
            }
            return i;
        }
        function _n(t, i) {
            return function(e) {
                return i(t(e));
            };
        }
        function Sn(t, i) {
            for (var e = [ i[t].parent, t ], n = An[i[t].parent][t], r = i[t].parent; i[r].parent; ) e.unshift(i[r].parent), 
            n = _n(An[i[r].parent][r], n), r = i[r].parent;
            return n.conversion = e, n;
        }
        var Pn = mn.exports, On = function(t) {
            for (var i = kn(t), e = {}, n = Object.keys(i), r = n.length, s = 0; s < r; s++) {
                var o = n[s];
                null !== i[o].parent && (e[o] = Sn(o, i));
            }
            return e;
        }, Cn = {};
        Object.keys(Pn).forEach((function(t) {
            Cn[t] = {}, Object.defineProperty(Cn[t], "channels", {
                value: Pn[t].channels
            }), Object.defineProperty(Cn[t], "labels", {
                value: Pn[t].labels
            });
            var i = On(t);
            Object.keys(i).forEach((function(e) {
                var n = i[e];
                Cn[t][e] = function(t) {
                    var i = function(i) {
                        if (null == i) return i;
                        arguments.length > 1 && (i = Array.prototype.slice.call(arguments));
                        var e = t(i);
                        if ("object" == typeof e) for (var n = e.length, r = 0; r < n; r++) e[r] = Math.round(e[r]);
                        return e;
                    };
                    return "conversion" in t && (i.conversion = t.conversion), i;
                }(n), Cn[t][e].raw = function(t) {
                    var i = function(i) {
                        return null == i ? i : (arguments.length > 1 && (i = Array.prototype.slice.call(arguments)), 
                        t(i));
                    };
                    return "conversion" in t && (i.conversion = t.conversion), i;
                }(n);
            }));
        }));
        var In = Cn, Tn = en.exports, Dn = In, Ln = [].slice, Un = [ "keyword", "gray", "hex" ], En = {};
        Object.keys(Dn).forEach((function(t) {
            En[Ln.call(Dn[t].labels).sort().join("")] = t;
        }));
        var jn = {};
        function Rn(t, i) {
            if (!(this instanceof Rn)) return new Rn(t, i);
            if (i && i in Un && (i = null), i && !(i in Dn)) throw new Error("Unknown model: " + i);
            var e, n;
            if (null == t) this.model = "rgb", this.color = [ 0, 0, 0 ], this.valpha = 1; else if (t instanceof Rn) this.model = t.model, 
            this.color = t.color.slice(), this.valpha = t.valpha; else if ("string" == typeof t) {
                var r = Tn.get(t);
                if (null === r) throw new Error("Unable to parse color from string: " + t);
                this.model = r.model, n = Dn[this.model].channels, this.color = r.value.slice(0, n), 
                this.valpha = "number" == typeof r.value[n] ? r.value[n] : 1;
            } else if (t.length) {
                this.model = i || "rgb", n = Dn[this.model].channels;
                var s = Ln.call(t, 0, n);
                this.color = Hn(s, n), this.valpha = "number" == typeof t[n] ? t[n] : 1;
            } else if ("number" == typeof t) t &= 16777215, this.model = "rgb", this.color = [ t >> 16 & 255, t >> 8 & 255, 255 & t ], 
            this.valpha = 1; else {
                this.valpha = 1;
                var o = Object.keys(t);
                "alpha" in t && (o.splice(o.indexOf("alpha"), 1), this.valpha = "number" == typeof t.alpha ? t.alpha : 0);
                var h = o.sort().join("");
                if (!(h in En)) throw new Error("Unable to parse color from object: " + JSON.stringify(t));
                this.model = En[h];
                var a = Dn[this.model].labels, l = [];
                for (e = 0; e < a.length; e++) l.push(t[a[e]]);
                this.color = Hn(l);
            }
            if (jn[this.model]) for (n = Dn[this.model].channels, e = 0; e < n; e++) {
                var u = jn[this.model][e];
                u && (this.color[e] = u(this.color[e]));
            }
            this.valpha = Math.max(0, Math.min(1, this.valpha)), Object.freeze && Object.freeze(this);
        }
        function zn(t, i, e) {
            return (t = Array.isArray(t) ? t : [ t ]).forEach((function(t) {
                (jn[t] || (jn[t] = []))[i] = e;
            })), t = t[0], function(n) {
                var r;
                return arguments.length ? (e && (n = e(n)), (r = this[t]()).color[i] = n, r) : (r = this[t]().color[i], 
                e && (r = e(r)), r);
            };
        }
        function Nn(t) {
            return function(i) {
                return Math.max(0, Math.min(t, i));
            };
        }
        function Wn(t) {
            return Array.isArray(t) ? t : [ t ];
        }
        function Hn(t, i) {
            for (var e = 0; e < i; e++) "number" != typeof t[e] && (t[e] = 0);
            return t;
        }
        Rn.prototype = {
            toString: function() {
                return this.string();
            },
            toJSON: function() {
                return this[this.model]();
            },
            string: function(t) {
                var i = this.model in Tn.to ? this : this.rgb(), e = 1 === (i = i.round("number" == typeof t ? t : 1)).valpha ? i.color : i.color.concat(this.valpha);
                return Tn.to[i.model](e);
            },
            percentString: function(t) {
                var i = this.rgb().round("number" == typeof t ? t : 1), e = 1 === i.valpha ? i.color : i.color.concat(this.valpha);
                return Tn.to.rgb.percent(e);
            },
            array: function() {
                return 1 === this.valpha ? this.color.slice() : this.color.concat(this.valpha);
            },
            object: function() {
                for (var t = {}, i = Dn[this.model].channels, e = Dn[this.model].labels, n = 0; n < i; n++) t[e[n]] = this.color[n];
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
                return t = Math.max(t || 0, 0), new Rn(this.color.map(function(t) {
                    return function(i) {
                        return function(t, i) {
                            return Number(t.toFixed(i));
                        }(i, t);
                    };
                }(t)).concat(this.valpha), this.model);
            },
            alpha: function(t) {
                return arguments.length ? new Rn(this.color.concat(Math.max(0, Math.min(1, t))), this.model) : this.valpha;
            },
            red: zn("rgb", 0, Nn(255)),
            green: zn("rgb", 1, Nn(255)),
            blue: zn("rgb", 2, Nn(255)),
            hue: zn([ "hsl", "hsv", "hsl", "hwb", "hcg" ], 0, (function(t) {
                return (t % 360 + 360) % 360;
            })),
            saturationl: zn("hsl", 1, Nn(100)),
            lightness: zn("hsl", 2, Nn(100)),
            saturationv: zn("hsv", 1, Nn(100)),
            value: zn("hsv", 2, Nn(100)),
            chroma: zn("hcg", 1, Nn(100)),
            gray: zn("hcg", 2, Nn(100)),
            white: zn("hwb", 1, Nn(100)),
            wblack: zn("hwb", 2, Nn(100)),
            cyan: zn("cmyk", 0, Nn(100)),
            magenta: zn("cmyk", 1, Nn(100)),
            yellow: zn("cmyk", 2, Nn(100)),
            black: zn("cmyk", 3, Nn(100)),
            x: zn("xyz", 0, Nn(100)),
            y: zn("xyz", 1, Nn(100)),
            z: zn("xyz", 2, Nn(100)),
            l: zn("lab", 0, Nn(100)),
            a: zn("lab", 1),
            b: zn("lab", 2),
            keyword: function(t) {
                return arguments.length ? new Rn(t) : Dn[this.model].keyword(this.color);
            },
            hex: function(t) {
                return arguments.length ? new Rn(t) : Tn.to.hex(this.rgb().round().color);
            },
            rgbNumber: function() {
                var t = this.rgb().color;
                return (255 & t[0]) << 16 | (255 & t[1]) << 8 | 255 & t[2];
            },
            luminosity: function() {
                for (var t = this.rgb().color, i = [], e = 0; e < t.length; e++) {
                    var n = t[e] / 255;
                    i[e] = n <= .03928 ? n / 12.92 : Math.pow((n + .055) / 1.055, 2.4);
                }
                return .2126 * i[0] + .7152 * i[1] + .0722 * i[2];
            },
            contrast: function(t) {
                var i = this.luminosity(), e = t.luminosity();
                return i > e ? (i + .05) / (e + .05) : (e + .05) / (i + .05);
            },
            level: function(t) {
                var i = this.contrast(t);
                return i >= 7.1 ? "AAA" : i >= 4.5 ? "AA" : "";
            },
            isDark: function() {
                var t = this.rgb().color;
                return (299 * t[0] + 587 * t[1] + 114 * t[2]) / 1e3 < 128;
            },
            isLight: function() {
                return !this.isDark();
            },
            negate: function() {
                for (var t = this.rgb(), i = 0; i < 3; i++) t.color[i] = 255 - t.color[i];
                return t;
            },
            lighten: function(t) {
                var i = this.hsl();
                return i.color[2] += i.color[2] * t, i;
            },
            darken: function(t) {
                var i = this.hsl();
                return i.color[2] -= i.color[2] * t, i;
            },
            saturate: function(t) {
                var i = this.hsl();
                return i.color[1] += i.color[1] * t, i;
            },
            desaturate: function(t) {
                var i = this.hsl();
                return i.color[1] -= i.color[1] * t, i;
            },
            whiten: function(t) {
                var i = this.hwb();
                return i.color[1] += i.color[1] * t, i;
            },
            blacken: function(t) {
                var i = this.hwb();
                return i.color[2] += i.color[2] * t, i;
            },
            grayscale: function() {
                var t = this.rgb().color, i = .3 * t[0] + .59 * t[1] + .11 * t[2];
                return Rn.rgb(i, i, i);
            },
            fade: function(t) {
                return this.alpha(this.valpha - this.valpha * t);
            },
            opaquer: function(t) {
                return this.alpha(this.valpha + this.valpha * t);
            },
            rotate: function(t) {
                var i = this.hsl(), e = i.color[0];
                return e = (e = (e + t) % 360) < 0 ? 360 + e : e, i.color[0] = e, i;
            },
            mix: function(t, i) {
                if (!t || !t.rgb) throw new Error('Argument to "mix" was not a Color instance, but rather an instance of ' + typeof t);
                var e = t.rgb(), n = this.rgb(), r = void 0 === i ? .5 : i, s = 2 * r - 1, o = e.alpha() - n.alpha(), h = ((s * o == -1 ? s : (s + o) / (1 + s * o)) + 1) / 2, a = 1 - h;
                return Rn.rgb(h * e.red() + a * n.red(), h * e.green() + a * n.green(), h * e.blue() + a * n.blue(), e.alpha() * r + n.alpha() * (1 - r));
            }
        }, Object.keys(Dn).forEach((function(t) {
            if (-1 === Un.indexOf(t)) {
                var i = Dn[t].channels;
                Rn.prototype[t] = function() {
                    if (this.model === t) return new Rn(this);
                    if (arguments.length) return new Rn(arguments, t);
                    var e = "number" == typeof arguments[i] ? i : this.valpha;
                    return new Rn(Wn(Dn[this.model][t].raw(this.color)).concat(e), t);
                }, Rn[t] = function(e) {
                    return "number" == typeof e && (e = Hn(Ln.call(arguments), i)), new Rn(e, t);
                };
            }
        }));
        var Vn = Rn;
        function $n(t, i) {
            const e = {}, n = {}, r = [];
            let s = 0;
            function o(i) {
                r.push(t[i]), s++;
            }
            function h(t, i, e) {
                const s = n[t];
                return delete n[t], n[i] = s, r[s].geometry[0].pop(), r[s].geometry[0] = r[s].geometry[0].concat(e[0]), 
                s;
            }
            function a(t, i, n) {
                const s = e[i];
                return delete e[i], e[t] = s, r[s].geometry[0].shift(), r[s].geometry[0] = n[0].concat(r[s].geometry[0]), 
                s;
            }
            function l(t, i, e) {
                const n = e ? i[0][i[0].length - 1] : i[0][0];
                return `${t}:${n.x}:${n.y}`;
            }
            for (let u = 0; u < t.length; u++) {
                const c = t[u], f = c.geometry;
                if (!f) continue;
                const d = c.properties[i] ? c.properties[i].toString() : null;
                if (!d) {
                    o(u);
                    continue;
                }
                const y = l(d, f), p = l(d, f, !0);
                if (y in n && p in e && n[y] !== e[p]) {
                    const t = a(y, p, f), i = h(y, p, r[t].geometry);
                    delete e[y], delete n[p], n[l(d, r[i].geometry, !0)] = i, r[t].geometry = null;
                } else y in n ? h(y, p, f) : p in e ? a(y, p, f) : (o(u), e[y] = s - 1, n[p] = s - 1);
            }
            return r.filter(t => t.geometry);
        }
        const Gn = 14;
        class Jn extends vi {
            static needMerge(t) {
                return t.mergeOnProperty && ("line" === t.textPlacement || "line" === t.markerPlacement);
            }
            static mergeLineFeatures(t, i, e) {
                const n = function(t, i, e) {
                    const n = vi.genFnTypes(i), {mergeOnPropertyFn: r} = n;
                    if (!i.mergeOnProperty || "line" !== i.textPlacement && "line" !== i.markerPlacement) return [];
                    if (!(s = i.mergeOnProperty, di(s) || "string" != typeof s && (null === s.constructor || s.constructor !== String) || "line" !== i.textPlacement && "line" !== i.markerPlacement)) return [ {
                        features: t,
                        property: i.mergeOnProperty
                    } ];
                    var s;
                    const o = [], h = {}, a = [];
                    for (let n = 0; n < t.length; n++) {
                        t[n].__index = n;
                        const s = t[n].properties = t[n].properties || {};
                        s.$layer = t[n].layer, s.$type = t[n].type;
                        let l = i.markerPlacement;
                        "line" !== l && (l = i.textPlacement);
                        const u = r ? r(e, s) : i.mergeOnProperty;
                        "line" !== l || di(u) ? a.push(t[n]) : (void 0 === h[u] && (h[u] = o.length, o.push({
                            features: [],
                            property: u
                        })), o[h[u]].features.push(t[n]));
                    }
                    a.length && o.push({
                        features: a
                    });
                    return o;
                }(t, i, e);
                if (n.length) {
                    const i = [];
                    for (let e = 0; e < n.length; e++) n[e].property ? i.push($n(n[e].features, n[e].property)) : i.push(t);
                    if (1 === i.length) return i[0];
                    {
                        let t = [];
                        for (let e = 0; e < i.length; e++) t = t.concat(i[e]);
                        return t.sort((t, i) => t.__index - i.__index), t;
                    }
                }
            }
            static splitPointSymbol(t, i = 0) {
                const e = [];
                if (Array.isArray(t)) {
                    const i = t;
                    for (let t = 0; t < i.length; t++) i[t] && e.push(...Jn.splitPointSymbol(i[t], t));
                    return e;
                }
                let n = null, r = null;
                for (const i in t) 0 === i.indexOf("marker") ? (n = n || {}, n[i] = t[i]) : 0 === i.indexOf("text") && (r = r || {}, 
                r[i] = t[i]);
                return n && (n.isIconText = !0, t.mergeOnProperty && (n.mergeOnProperty = t.mergeOnProperty), 
                e.push(n)), r && (n && (r.textPlacement = n.markerPlacement, r.textSpacing = n.markerSpacing, 
                r.isIconText = !0), t.mergeOnProperty && (r.mergeOnProperty = t.mergeOnProperty), 
                e.push(r)), void 0 !== t.visible && (n && (n.visible = t.visible), r && (r.visible = t.visible)), 
                n && (n.markerTextFit && r && (n.text = {}, n.text.textName = r.textName, n.text.textSize = r.textSize), 
                n.index = {
                    index: i,
                    type: 0
                }), r && (r.index = {
                    index: i,
                    type: 1
                }), e;
            }
            static isAtlasLoaded(t, i) {
                const {icon: e, glyph: n} = t, {iconAtlas: r, glyphAtlas: s} = i;
                if (e && (!r || !r.positions[e.url])) return !1;
                if (n) {
                    if (!s || !s.positions[n.font]) return !1;
                    const t = s.positions[n.font], {text: i} = n;
                    for (let e = 0; e < i.length; e++) if (!t[i.charCodeAt(e)]) return !1;
                }
                return !0;
            }
            constructor(t, i, e) {
                super(t, i, e);
            }
            createStyledVector(t, i, e, n, r, s) {
                const o = new Ue(t, this.symbolDef, i, e, n), h = o.getIconAndGlyph();
                if (h.icon && !this.options.atlas) {
                    const {url: t, size: i} = h.icon;
                    r[t] || (r[t] = h.icon.size), r[t][0] < i[0] && (r[t][0] = i[0]), r[t][1] < i[1] && (r[t][1] = i[1]);
                }
                if (h.glyph && !this.options.atlas) {
                    const {font: t, text: e} = h.glyph, n = s[t] = s[t] || {};
                    for (let t = 0; t < e.length; t++) n[e.charCodeAt(t)] = 1;
                    "line" === i.textPlacement && (s.options = {
                        isCharsCompact: !1
                    });
                }
                return this.options.allowEmptyPack || h.icon || h.glyph ? o : null;
            }
            getFormat(t) {
                const i = void 0 !== t.textName, e = i ? function(t) {
                    return "line" !== t.textPlacement || t.isIconText ? [ {
                        type: Int16Array,
                        width: 3,
                        name: "aPosition"
                    }, {
                        type: Int16Array,
                        width: 2,
                        name: "aShape"
                    }, {
                        type: Uint16Array,
                        width: 2,
                        name: "aTexCoord"
                    }, {
                        type: Uint8Array,
                        width: 1,
                        name: "aCount"
                    } ] : [ {
                        type: Int16Array,
                        width: 3,
                        name: "aPosition"
                    }, {
                        type: Int16Array,
                        width: 2,
                        name: "aShape"
                    }, {
                        type: Uint16Array,
                        width: 2,
                        name: "aTexCoord"
                    }, {
                        type: Uint8Array,
                        width: 1,
                        name: "aCount"
                    }, {
                        type: Int16Array,
                        width: 2,
                        name: "aGlyphOffset"
                    }, {
                        type: Uint16Array,
                        width: 3,
                        name: "aSegment"
                    }, {
                        type: Uint8Array,
                        width: 1,
                        name: "aVertical"
                    } ];
                }(t) : [ {
                    type: Int16Array,
                    width: 3,
                    name: "aPosition"
                }, {
                    type: Int16Array,
                    width: 2,
                    name: "aShape"
                }, {
                    type: Uint16Array,
                    width: 2,
                    name: "aTexCoord"
                } ];
                i ? e.push(...this.q()) : e.push(...this.B());
                const {markerOpacityFn: n, textOpacityFn: r, markerPitchAlignmentFn: s, textPitchAlignmentFn: o, markerRotationAlignmentFn: h, textRotationAlignmentFn: a, markerRotationFn: l, textRotationFn: u, markerAllowOverlapFn: c, textAllowOverlapFn: f, markerIgnorePlacementFn: d, textIgnorePlacementFn: y} = this.j;
                return (n || r) && e.push({
                    type: Uint8Array,
                    width: 1,
                    name: "aColorOpacity"
                }), (s || o) && e.push({
                    type: Uint8Array,
                    width: 1,
                    name: "aPitchAlign"
                }), (h || a) && e.push({
                    type: Uint8Array,
                    width: 1,
                    name: "aRotationAlign"
                }), (l || u) && e.push({
                    type: Uint16Array,
                    width: 1,
                    name: "aRotation"
                }), (c || f || d || y) && e.push({
                    type: Uint8Array,
                    width: 1,
                    name: "aOverlap"
                }), e;
            }
            q() {
                const {textFillFn: t, textSizeFn: i, textHaloFillFn: e, textHaloRadiusFn: n, textHaloOpacityFn: r, textDxFn: s, textDyFn: o} = this.j, h = [];
                return t && h.push({
                    type: Uint8Array,
                    width: 4,
                    name: "aTextFill"
                }), i && h.push({
                    type: Uint8Array,
                    width: 1,
                    name: "aTextSize"
                }), e && h.push({
                    type: Uint8Array,
                    width: 4,
                    name: "aTextHaloFill"
                }), n && h.push({
                    type: Uint8Array,
                    width: 1,
                    name: "aTextHaloRadius"
                }), r && h.push({
                    type: Uint8Array,
                    width: 1,
                    name: "aTextHaloOpacity"
                }), s && h.push({
                    type: Int8Array,
                    width: 1,
                    name: "aTextDx"
                }), o && h.push({
                    type: Int8Array,
                    width: 1,
                    name: "aTextDy"
                }), h;
            }
            B() {
                const {markerWidthFn: t, markerHeightFn: i, markerDxFn: e, markerDyFn: n} = this.j, r = [];
                return t && r.push({
                    type: Uint8Array,
                    width: 1,
                    name: "aMarkerWidth"
                }), i && r.push({
                    type: Uint8Array,
                    width: 1,
                    name: "aMarkerHeight"
                }), e && r.push({
                    type: Int8Array,
                    width: 1,
                    name: "aMarkerDx"
                }), n && r.push({
                    type: Int8Array,
                    width: 1,
                    name: "aMarkerDy"
                }), r;
            }
            createDataPack() {
                if (!this.iconAtlas && !this.glyphAtlas) {
                    if (!this.options.allowEmptyPack) return null;
                    this.empty = !0;
                }
                this.lineVertex = [];
                const t = super.createDataPack.apply(this, arguments);
                return t ? (t.lineVertex = new Int16Array(this.lineVertex), t.buffers.push(t.lineVertex.buffer), 
                t) : null;
            }
            placeVector(t, i) {
                const e = t.getShape(this.iconAtlas, this.glyphAtlas);
                if (!this.options.allowEmptyPack && !e) return;
                const n = this.X(t, e, i);
                if (0 === n.length) return;
                const r = this.data;
                let s = this.data.aPosition.length / 3;
                const o = t.symbol, h = t.feature.properties, a = "line" === o.textPlacement && !o.isIconText, l = void 0 !== o.textName, u = l && a && function(t) {
                    let i = 0;
                    for (let e = 0; e < t.length; e++) {
                        if (ve(t.charAt(e).charCodeAt(0))) i = 0; else if (i++, i >= 1) return !1;
                    }
                    return !0;
                }(t.getIconAndGlyph().glyph.text) ? 1 : 0, {textFillFn: c, textSizeFn: f, textHaloFillFn: d, textHaloRadiusFn: y, textHaloOpacityFn: p, textDxFn: m, textDyFn: v, textPitchAlignmentFn: w, textRotationAlignmentFn: b, textRotationFn: M, textAllowOverlapFn: x, textIgnorePlacementFn: F, textOpacityFn: A, markerWidthFn: k, markerHeightFn: _, markerDxFn: S, markerDyFn: P, markerPitchAlignmentFn: O, markerRotationAlignmentFn: C, markerRotationFn: I, markerAllowOverlapFn: T, markerIgnorePlacementFn: D, markerOpacityFn: L} = this.j;
                let U, E, j, R, z, N, W, H, V, $, G, J, q, B, X, Z, Y;
                if (l) {
                    const i = t.getIconAndGlyph().glyph.font;
                    U = function(t, i, e) {
                        const n = t.positionedGlyphs, r = [];
                        for (let s = 0; s < n.length; s++) {
                            const o = n[s], h = e[o.glyph];
                            if (!h) continue;
                            const a = h.rect;
                            if (!a) continue;
                            const l = 4, u = h.metrics.advance / 2, c = h.metrics.height / 2, f = i ? [ o.x + u, 0 ] : [ 0, 0 ], d = i ? [ 0, o.y - c ] : [ o.x + u, o.y - c ], y = h.metrics.left - l - u + d[0], p = h.metrics.top - l + d[1], m = y + a.w, v = p + a.h, g = new Pt(y, p), w = new Pt(m, p), b = new Pt(y, v), M = new Pt(m, v);
                            if (i && o.vertical) {
                                const t = new Pt(-u, u), i = -Math.PI / 2, e = new Pt(5, 0);
                                g.O(i, t).m(e), w.O(i, t).m(e), b.O(i, t).m(e), M.O(i, t).m(e);
                            }
                            r.push({
                                tl: g,
                                tr: w,
                                bl: b,
                                br: M,
                                tex: a,
                                writingMode: t.writingMode,
                                glyphOffset: f
                            });
                        }
                        return r;
                    }(e.horizontal, a, this.glyphAtlas.positions[i]), c && (E = c(null, h), g(E) ? E = [ 0, 0, 0, 0 ] : (E = Array.isArray(E) ? E.map(t => 255 * t) : Vn(E).array(), 
                    3 === E.length && E.push(255))), f && (j = f(this.options.zoom, h), di(j) && (j = Gn)), 
                    d && (R = d(null, h), R = Array.isArray(R) ? R.map(t => 255 * t) : Vn(R).array(), 
                    3 === R.length && R.push(255)), y && (z = y(null, h)), p && (N = 255 * p(null, h)), 
                    m && (W = m(null, h) || 0), v && (H = v(null, h) || 0), w && (q = +("map" === w(null, h))), 
                    b && (B = +("map" === b(null, h))), M && (X = yi(M(null, h), 0, 360) * Math.PI / 180);
                } else U = e ? function(t) {
                    const i = t.image, e = t.top - 1 / i.pixelRatio, n = t.left - 1 / i.pixelRatio, r = t.bottom + 1 / i.pixelRatio, s = t.right + 1 / i.pixelRatio;
                    let o, h, a, l;
                    return o = new Pt(n, e), h = new Pt(s, e), a = new Pt(s, r), l = new Pt(n, r), [ {
                        tl: o,
                        tr: h,
                        bl: l,
                        br: a,
                        tex: {
                            x: i.tl[0],
                            y: i.tl[1],
                            w: i.displaySize[0],
                            h: i.displaySize[1]
                        },
                        writingMode: void 0,
                        glyphOffset: [ 0, 0 ]
                    } ];
                }(e) : function() {
                    const t = new Pt(0, 0), i = new Pt(0, 0), e = new Pt(0, 0);
                    return [ {
                        tl: t,
                        tr: i,
                        bl: new Pt(0, 0),
                        br: e,
                        tex: {
                            x: 0,
                            y: 0,
                            w: 0,
                            h: 0
                        },
                        writingMode: void 0,
                        glyphOffset: [ 0, 0 ]
                    } ];
                }(), k && (V = k(null, h)), _ && ($ = _(null, h)), S && (G = S(null, h)), P && (J = P(null, h)), 
                O && (q = +("map" === O(null, h))), C && (B = +("map" === C(null, h))), I && (X = yi(I(null, h), 0, 360) * Math.PI / 180);
                const K = T || x;
                K && (Z = K(null, h) || 0);
                const Q = D || F;
                let tt;
                Q && (Y = Q(null, h) || 0);
                const it = A || L;
                it && (tt = 255 * it(this.options.zoom, h));
                const et = this.options.EXTENT, nt = U.length, rt = this.getAltitude(t.feature.properties);
                for (let t = 0; t < n.length; t++) {
                    const i = n[t];
                    if (et !== 1 / 0 && fi(i, et)) continue;
                    const e = i.x, o = i.y, h = U.length;
                    for (let t = 0; t < h; t++) {
                        const n = U[t], {tl: h, tr: c, bl: f, br: d, tex: y} = n;
                        this.Z(r, e, o, rt, 10 * h.x, 10 * h.y, y.x, y.y + y.h), l && this.Y(r, a, nt, n.glyphOffset, i, u), 
                        this.K(r, E, j, R, z, N, W, H, V, $, G, J, tt, q, B, X, Z, Y), this.Z(r, e, o, rt, 10 * c.x, 10 * c.y, y.x + y.w, y.y + y.h), 
                        l && this.Y(r, a, nt, n.glyphOffset, i, u), this.K(r, E, j, R, z, N, W, H, V, $, G, J, tt, q, B, X, Z, Y), 
                        this.Z(r, e, o, rt, 10 * f.x, 10 * f.y, y.x, y.y), l && this.Y(r, a, nt, n.glyphOffset, i, u), 
                        this.K(r, E, j, R, z, N, W, H, V, $, G, J, tt, q, B, X, Z, Y), this.Z(r, e, o, rt, 10 * d.x, 10 * d.y, y.x + y.w, y.y), 
                        l && this.Y(r, a, nt, n.glyphOffset, i, u), this.K(r, E, j, R, z, N, W, H, V, $, G, J, tt, q, B, X, Z, Y), 
                        this.addElements(s, s + 1, s + 2), this.addElements(s + 1, s + 2, s + 3), s += 4;
                        const p = Math.max(Math.abs(e), Math.abs(o), Math.abs(rt));
                        p > this.maxPos && (this.maxPos = p);
                    }
                }
            }
            Z(t, i, e, n, r, s, o, h) {
                t.aPosition.push(i, e, n), t.aShape.push(r, s), t.aTexCoord.push(o, h);
            }
            Y(t, i, e, n, r, s) {
                if (t.aCount.push(e), i) {
                    t.aGlyphOffset.push(n[0], n[1]);
                    const i = r.startIndex;
                    t.aSegment.push(r.segment + i, i, r.line.length), t.aVertical.push(s);
                }
            }
            K(t, i, e, n, r, s, o, h, a, l, u, c, f, d, y, p, m, v) {
                const {textFillFn: g, textSizeFn: w, textHaloFillFn: b, textHaloRadiusFn: M, textHaloOpacityFn: x, textDxFn: F, textDyFn: A, textPitchAlignmentFn: k, textRotationAlignmentFn: _, textRotationFn: S, textAllowOverlapFn: P, textIgnorePlacementFn: O, textOpacityFn: C, markerWidthFn: I, markerHeightFn: T, markerDxFn: D, markerDyFn: L, markerPitchAlignmentFn: U, markerRotationAlignmentFn: E, markerRotationFn: j, markerAllowOverlapFn: R, markerIgnorePlacementFn: z, markerOpacityFn: N} = this.j;
                g && t.aTextFill.push(...i), w && t.aTextSize.push(e), b && t.aTextHaloFill.push(...n), 
                M && t.aTextHaloRadius.push(r), x && t.aTextHaloOpacity.push(s), F && t.aTextDx.push(o), 
                A && t.aTextDy.push(h), I && t.aMarkerWidth.push(a), T && t.aMarkerHeight.push(l), 
                D && t.aMarkerDx.push(u), L && t.aMarkerDy.push(c);
                (N || C) && t.aColorOpacity.push(f), (k || U) && t.aPitchAlign.push(d), (E || _) && t.aRotationAlign.push(y), 
                (j || S) && t.aRotation.push(9362 * p);
                const W = R || P, H = z || O;
                if (W || H) {
                    const i = (W ? 8 : 0) + 4 * m, e = (H ? 2 : 0) + v;
                    t.aOverlap.push(i + e);
                }
                r > 0 && (this.properties.hasHalo = 1);
            }
            X(t, i, e) {
                const {feature: n, symbol: r} = t, s = this.tt(r), o = n.properties, {markerSpacingFn: h, textSpacingFn: a} = this.j, l = ((h ? h(null, o) : r.markerSpacing) || (a ? a(null, o) : r.textSpacing) || 250) * e, u = this.options.EXTENT;
                return function(t, i, e, n, r, s, o) {
                    const {feature: h, size: a, symbol: l} = t, u = a ? 24 : 0, c = n * (a ? a[0] / u : 1), f = [];
                    if ("line" === s) {
                        let t = h.geometry;
                        r && (t = je(h.geometry, 0, 0, r, r));
                        for (let n = 0; n < t.length; n++) {
                            const s = Ne(t[n], o, tn, l.isIconText ? null : e.vertical || e.horizontal || e, null, u, l.isIconText ? 1 : c, 1, r || 1 / 0);
                            if (l.textPlacement && !l.isIconText) for (let t = 0; t < s.length; t++) s[t].startIndex = i.length / 3;
                            if (f.push.apply(f, s), l.textPlacement && !l.isIconText) for (let e = 0; e < t[n].length; e++) i.push(t[n][e].x, t[n][e].y, 0);
                        }
                    } else if (3 === h.type) {
                        const t = $e(h.geometry, 0);
                        for (let i = 0; i < t.length; i++) {
                            const e = Ye(t[i], 16);
                            fi(e, r) || f.push(e);
                        }
                    } else if (2 === h.type) for (let t = 0; t < h.geometry.length; t++) {
                        const i = h.geometry[t];
                        fi(i[0], r) || f.push(i[0]);
                    } else if (1 === h.type) for (let t = 0; t < h.geometry.length; t++) {
                        const i = h.geometry[t];
                        for (let t = 0; t < i.length; t++) {
                            const e = i[t];
                            fi(e, r) || f.push(e);
                        }
                    }
                    return f;
                }(t, this.lineVertex, i, e, u, s, l);
            }
            tt(t) {
                return t.markerPlacement || t.textPlacement;
            }
        }
        const qn = Math.cos(Math.PI / 180 * 37.5), Bn = Math.pow(2, 16) / 1;
        class Xn extends vi {
            constructor(t, i, e) {
                super(t, i, e);
                let n = !1;
                const {lineDasharrayFn: r, lineDashColorFn: s} = this.j;
                r && (n = function(t, i, e) {
                    for (let n = 0; n < t.length; n++) {
                        const r = t[n].properties;
                        if (e(i, r)) return !0;
                    }
                    return !1;
                }(t, this.options.zoom, r), n && (this.dasharrayFn = r)), (Kn(this.symbol.lineDasharray) || n) && s && (this.dashColorFn = s);
            }
            createStyledVector(t, i, e, n, r) {
                const s = new pi(t, i, e, n), o = s.getLineResource();
                return !this.options.atlas && o && (r[o] = [ 0, 0 ]), s;
            }
            getFormat() {
                const {lineWidthFn: t, lineStrokeWidthFn: i, lineStrokeColorFn: e, lineColorFn: n, lineOpacityFn: r, lineDxFn: s, lineDyFn: o, linePatternAnimSpeedFn: h, linePatternGapFn: a} = this.j, l = [ {
                    type: Int16Array,
                    width: 3,
                    name: "aPosition"
                } ];
                if (this.options.center || this.iconAtlas ? l.push({
                    type: Int8Array,
                    width: 3,
                    name: "aExtrude"
                }) : l.push({
                    type: Int8Array,
                    width: 2,
                    name: "aExtrude"
                }), l.push({
                    type: Uint16Array,
                    width: 1,
                    name: "aLinesofar"
                }), t && l.push({
                    type: Uint8Array,
                    width: 1,
                    name: "aLineWidth"
                }), i && l.push({
                    type: Uint8Array,
                    width: 1,
                    name: "aLineStrokeWidth"
                }), n && l.push({
                    type: Uint8Array,
                    width: 4,
                    name: "aColor"
                }), e && l.push({
                    type: Uint8Array,
                    width: 4,
                    name: "aStrokeColor"
                }), r && l.push({
                    type: Uint8Array,
                    width: 1,
                    name: "aOpacity"
                }), this.symbol.lineOffset && l.push({
                    type: Int8Array,
                    width: 2,
                    name: "aExtrudeOffset"
                }), this.dasharrayFn && l.push({
                    type: Uint8Array,
                    width: 4,
                    name: "aDasharray"
                }), this.dashColorFn && l.push({
                    type: Uint8Array,
                    width: 4,
                    name: "aDashColor"
                }), this.iconAtlas) {
                    const t = this.getIconAtlasMaxValue();
                    l.push({
                        type: t > 255 ? Uint16Array : Uint8Array,
                        width: 4,
                        name: "aTexInfo"
                    });
                }
                return s && l.push({
                    type: Int8Array,
                    width: 1,
                    name: "aLineDx"
                }), o && l.push({
                    type: Int8Array,
                    width: 1,
                    name: "aLineDy"
                }), h && l.push({
                    type: Int8Array,
                    width: 1,
                    name: "aLinePatternAnimSpeed"
                }), a && l.push({
                    type: Uint8Array,
                    width: 1,
                    name: "aLinePatternGap"
                }), l;
            }
            placeVector(t) {
                const {lineJoinFn: i, lineCapFn: e, lineWidthFn: n, lineStrokeWidthFn: r, lineStrokeColorFn: s, lineColorFn: o, lineOpacityFn: h, lineJoinPatternModeFn: a, lineDxFn: l, lineDyFn: u, linePatternAnimSpeedFn: c, linePatternGapFn: f} = this.j, d = this.symbol, y = t.feature, p = 3 === y.type, m = y.properties, v = this.elements;
                p && (this.elements = []);
                let w = d.lineJoin || "miter", b = d.lineCap || "butt";
                if (i && (w = i(this.options.zoom, m) || "miter"), e && (b = e(this.options.zoom, m) || "butt"), 
                n) {
                    let t = n(this.options.zoom, m);
                    ii(t) && (t = 4), this.feaLineWidth = t;
                } else this.feaLineWidth = d.lineWidth;
                if (r) {
                    let t = r(this.options.zoom, m);
                    ii(t) && (t = 0), this.feaLineStrokeWidth = t;
                } else this.feaLineStrokeWidth = d.lineStrokeWidth || 0;
                if (o && (this.feaColor = o(this.options.zoom, m) || [ 0, 0, 0, 255 ], g(this.feaColor) ? this.feaColor = [ 0, 0, 0, 0 ] : (Array.isArray(this.feaColor) ? this.feaColor = this.feaColor.map(t => 255 * t) : this.feaColor = Vn(this.feaColor).array(), 
                3 === this.feaColor.length && this.feaColor.push(255))), s && (this.feaStrokeColor = s(this.options.zoom, m) || [ 0, 0, 0, 255 ], 
                g(this.feaStrokeColor) ? this.feaStrokeColor = [ 0, 0, 0, 0 ] : (Array.isArray(this.feaStrokeColor) ? this.feaStrokeColor = this.feaStrokeColor.map(t => 255 * t) : this.feaStrokeColor = Vn(this.feaStrokeColor).array(), 
                3 === this.feaStrokeColor.length && this.feaStrokeColor.push(255))), h) {
                    let t = h(this.options.zoom, m);
                    ii(t) && (t = 1), this.feaOpacity = 255 * t;
                }
                if (this.dasharrayFn) {
                    let t = this.dasharrayFn(this.options.zoom, m) || [ 0, 0, 0, 0 ];
                    if (t.length < 4) {
                        const i = t;
                        1 === t.length ? t = [ i[0], i[0], i[0], i[0] ] : 2 === t.length ? t = [ i[0], i[1], i[0], i[1] ] : 3 === t.length && (t = [ i[0], i[1], i[2], i[2] ]);
                    }
                    this.feaDash = t;
                }
                if (this.dashColorFn) {
                    let t = (this.dashColorFn ? this.dashColorFn(this.options.zoom, m) : this.symbol.lineDashColor) || [ 0, 0, 0, 0 ];
                    t = Array.isArray(t) ? t.map(t => 255 * t) : Vn(t).array(), 3 === t.length && t.push(255), 
                    this.feaDashColor = t;
                }
                if (this.iconAtlas) {
                    const i = t.getLineResource(), e = this.iconAtlas.glyphMap[i];
                    if (this.feaTexInfo = this.feaTexInfo || [ 0, 0, 0, 0 ], e) {
                        const {tl: t, displaySize: e} = this.iconAtlas.positions[i];
                        this.feaTexInfo[0] = t[0] + 1, this.feaTexInfo[1] = t[1] + 1, this.feaTexInfo[2] = e[0] - 3, 
                        this.feaTexInfo[3] = e[1] - 3;
                    } else this.feaTexInfo[0] = this.feaTexInfo[1] = this.feaTexInfo[2] = this.feaTexInfo[3] = 0;
                    this.feaJoinPatternMode = a ? a(this.options.zoom, m) || 0 : d.lineJoinPatternMode || 0;
                }
                if (l) {
                    let t = l(this.options.zoom, m);
                    ii(t) && (t = 0), this.feaLineDx = t;
                }
                if (u) {
                    let t = u(this.options.zoom, m);
                    ii(t) && (t = 0), this.feaLineDy = t;
                }
                if (c) {
                    let t = c(this.options.zoom, m);
                    ii(t) && (t = 0), 0 !== t && (this.properties.hasPatternAnim = 1), this.feaPatternAnimSpeed = t;
                }
                if (f) {
                    let t = f(this.options.zoom, m);
                    ii(t) && (t = 0), this.feaLinePatternGap = t;
                }
                const M = this.options.EXTENT;
                let x = y.geometry;
                M !== 1 / 0 && 3 !== y.type && (x = je(y.geometry, -1, -1, M + 1, M + 1));
                for (let t = 0; t < x.length; t++) {
                    this.offset = this.data.aPosition.length / 3;
                    const i = x[t];
                    this.it(i, y, w, b, 2, 1.05), p && (this.et(v), this.elements = []);
                }
                p && (this.elements = v);
            }
            nt() {
                return this.iconAtlas && this.feaTexInfo[2] && this.feaTexInfo[3];
            }
            it(t, i, e, n, r, s) {
                const o = this.nt() || Kn(this.feaDash) || Kn(this.symbol.lineDasharray);
                this.overscaling = 1;
                const h = this.options.EXTENT;
                if (this.distance = 0, this.scaledDistance = 0, this.totalDistance = 0, this.symbol.lineGradientProperty && i.properties && oi(i.properties, "mapbox_clip_start") && oi(i.properties, "mapbox_clip_end")) {
                    this.clipStart = +i.properties.mapbox_clip_start, this.clipEnd = +i.properties.mapbox_clip_end;
                    for (let i = 0; i < t.length - 1; i++) this.totalDistance += t[i].dist(t[i + 1]);
                    this.updateScaledDistance();
                }
                const a = 3 === i.type;
                let l = t.length;
                for (;l >= 2 && t[l - 1].equals(t[l - 2]); ) l--;
                let u = 0;
                for (;u < l - 1 && t[u].equals(t[u + 1]); ) u++;
                if (l < (a ? 3 : 2)) return;
                "bevel" === e && (r = 1.05);
                const c = this.overscaling <= 16 ? 15 * h / (512 * this.overscaling) : 0, f = {
                    vertexLength: 0,
                    primitiveLength: 0
                };
                let d, y, p, m, v;
                this.e1 = this.e2 = -1, a && (d = t[l - 2], v = t[u].sub(d).I().T());
                for (let i = u; i < l; i++) {
                    if (p = i === l - 1 ? a ? t[u + 1] : void 0 : t[i + 1], p && t[i].equals(p)) continue;
                    v && (m = v), d && (y = d), d = t[i], v = p ? p.sub(d).I().T() : m, m = m || v;
                    let h = m.add(v);
                    0 === h.x && 0 === h.y || h.I();
                    const g = m.x * v.x + m.y * v.y, w = h.x * v.x + h.y * v.y, b = 0 !== w ? 1 / w : 1 / 0, M = 2 * Math.sqrt(2 - 2 * w), x = w < qn && y && p, F = m.x * v.y - m.y * v.x > 0;
                    if (!o && x && i > u) {
                        const t = d.dist(y);
                        if (t > 2 * c) {
                            const i = d.sub(d.sub(y).k(c / t).D());
                            this.updateDistance(y, i), this.addCurrentVertex(i, m, 0, 0, f), y = i;
                        }
                    }
                    const A = y && p;
                    let k = A ? e : a ? "butt" : n;
                    if (A && "round" === k && (b < s ? k = "miter" : b <= 2 && (k = "fakeround")), "miter" === k && b > r && (k = "bevel"), 
                    "bevel" === k && (b > 2 && (k = "flipbevel"), b < r && (k = "miter")), y && this.updateDistance(y, d), 
                    (i > u && i < l - 1 || a && i === l - 1) && o) {
                        const t = this.feaJoinPatternMode ? 0 : -m.mag() * w;
                        this.addCurrentVertex(d, m, t, t, f), this.rt = 1;
                    }
                    if ("miter" === k) h.k(b), this.addCurrentVertex(d, h, 0, 0, f); else if ("flipbevel" === k) {
                        if (b > 100) h = v.mult(-1); else {
                            const t = b * m.add(v).mag() / m.sub(v).mag();
                            h.T().k(t * (F ? -1 : 1));
                        }
                        this.addCurrentVertex(d, h, 0, 0, f), this.addCurrentVertex(d, h.mult(-1), 0, 0, f);
                    } else if ("bevel" === k || "fakeround" === k) {
                        const t = -Math.sqrt(b * b - 1), i = F ? t : 0, e = F ? 0 : t;
                        if (y && this.addCurrentVertex(d, m, i, e, f), "fakeround" === k) {
                            const t = Math.round(180 * M / Math.PI / 20);
                            for (let i = 1; i < t; i++) {
                                let e = i / t;
                                if (.5 !== e) {
                                    const t = e - .5;
                                    e += e * t * (e - 1) * ((1.0904 + g * (g * (3.55645 - 1.43519 * g) - 3.2452)) * t * t + (.848013 + g * (.215638 * g - 1.06021)));
                                }
                                const n = v.sub(m).k(e).m(m).I().k(F ? -1 : 1);
                                this.addHalfVertex(d, n.x, n.y, !1, F, 0, f);
                            }
                        }
                        p && this.addCurrentVertex(d, v, -i, -e, f);
                    } else if ("butt" === k) this.addCurrentVertex(d, h, 0, 0, f); else if ("square" === k) {
                        const t = y ? 1 : -1;
                        this.addCurrentVertex(d, h, t, t, f);
                    } else "round" === k && (y && (this.addCurrentVertex(d, m, 0, 0, f), this.addCurrentVertex(d, m, 1, 1, f, !0)), 
                    p && (this.addCurrentVertex(d, v, -1, -1, f, !0), this.addCurrentVertex(d, v, 0, 0, f)));
                    if (!o && x && i < l - 1) {
                        const t = d.dist(p);
                        if (t > 2 * c) {
                            const i = d.add(p.sub(d).k(c / t).D());
                            this.updateDistance(d, i), this.addCurrentVertex(i, v, 0, 0, f), d = i;
                        }
                    }
                    if ((i > u && i < l - 1 || a && i === u) && o) {
                        delete this.rt;
                        const t = this.feaJoinPatternMode ? 0 : v.mag() * w;
                        this.addCurrentVertex(d, v, t, t, f);
                    }
                }
            }
            addCurrentVertex(t, i, e, n, r, s = !1) {
                const o = i.x + i.y * e, h = i.y - i.x * e, a = -i.x + i.y * n, l = -i.y - i.x * n;
                this.addHalfVertex(t, o, h, s, !1, e, r), this.addHalfVertex(t, a, l, s, !0, -n, r), 
                this.distance > Bn / 2 && 0 === this.totalDistance && (this.distance = 0, this.updateScaledDistance(), 
                this.addCurrentVertex(t, i, e, n, r, s));
            }
            addHalfVertex({x: t, y: i}, e, n, r, s, o, h) {
                const a = 1 * this.scaledDistance;
                this.fillData(this.data, t, i, e, n, r, s, a);
                const l = h.vertexLength++;
                this.e1 >= 0 && this.e2 >= 0 && (this.addElements(this.e1, this.e2, l), h.primitiveLength++), 
                s ? this.e2 = l : this.e1 = l;
            }
            fillData(t, i, e, n, r, s, o, h) {
                const {lineWidthFn: a, lineStrokeWidthFn: l, lineStrokeColorFn: u, lineColorFn: c, lineOpacityFn: f, lineDxFn: d, lineDyFn: y, linePatternAnimSpeedFn: p, linePatternGapFn: m} = this.j;
                if (this.options.center || (i = (i << 1) + (s ? 1 : 0), e = (e << 1) + (o ? 1 : 0)), 
                t.aPosition.push(i, e, 0), t.aExtrude.push(63 * n, 63 * r), this.options.center || this.iconAtlas) {
                    let i = 0;
                    this.options.center && (i += 2 * s + o), this.iconAtlas && (i += 4 * (this.rt && this.feaJoinPatternMode ? 1 : 0)), 
                    t.aExtrude.push(i);
                }
                t.aLinesofar.push(h), a && t.aLineWidth.push(Math.round(2 * this.feaLineWidth)), 
                l && t.aLineStrokeWidth.push(Math.round(2 * this.feaLineStrokeWidth)), c && t.aColor.push(...this.feaColor), 
                u && t.aStrokeColor.push(...this.feaStrokeColor), f && t.aOpacity.push(this.feaOpacity), 
                this.dasharrayFn && t.aDasharray.push(...this.feaDash), this.dashColorFn && t.aDashColor.push(...this.feaDashColor), 
                this.iconAtlas && t.aTexInfo.push(...this.feaTexInfo), d && t.aLineDx.push(this.feaLineDx), 
                y && t.aLineDy.push(this.feaLineDy), p && t.aLinePatternAnimSpeed.push(127 * this.feaPatternAnimSpeed), 
                m && t.aLinePatternGap.push(10 * this.feaLinePatternGap), this.maxPos = Math.max(this.maxPos, Math.abs(i) + 1, Math.abs(e) + 1);
            }
            addElements(t, i, e) {
                super.addElements(this.offset + t, this.offset + i, this.offset + e);
            }
            et(t) {
                const i = this.options.EXTENT, e = this.elements;
                for (let n = 0; n < e.length; n += 3) i !== 1 / 0 && (Yn(this.data.aPosition, e[n], e[n + 1], 3, i) || Yn(this.data.aPosition, e[n + 1], e[n + 2], 3, i)) || t.push(e[n], e[n + 1], e[n + 2]);
            }
            st(t) {
                if (t.length <= 1) return t;
                const i = [], e = this.options.EXTENT;
                let n, r = !0;
                for (n = 0; n < t.length - 1; n++) {
                    const s = Zn(t[n], t[n + 1], e);
                    s && r || (i.push(t[n]), r = s);
                }
                return r || i.push(t[n]), i;
            }
            updateDistance(t, i) {
                this.distance += t.dist(i), this.updateScaledDistance();
            }
            updateScaledDistance() {
                this.scaledDistance = this.totalDistance > 0 ? (this.clipStart + (this.clipEnd - this.clipStart) * this.distance / this.totalDistance) * (Bn - 1) : this.distance;
            }
        }
        function Zn(t, i, e) {
            return e !== 1 / 0 && (t.x < 0 && i.x < 0 || t.x > e && i.x > e || t.y < 0 && i.y < 0 || t.y > e && i.y > e);
        }
        function Yn(t, i, e, n, r) {
            if (r === 1 / 0) return !1;
            const s = Math.floor(.5 * t[i * n]), o = Math.floor(.5 * t[i * n + 1]), h = Math.floor(.5 * t[e * n]), a = Math.floor(.5 * t[e * n + 1]);
            return s === h && (s < 0 || s > r) && o !== a || o === a && (o < 0 || o > r) && s !== h;
        }
        function Kn(t) {
            if (!Array.isArray(t)) return !1;
            for (let i = 0; i < t.length; i++) if (t[i]) return !0;
            return !1;
        }
        var Qn = "undefined" != typeof Float32Array ? Float32Array : Array;
        function tr() {
            var t = new Qn(3);
            return Qn != Float32Array && (t[0] = 0, t[1] = 0, t[2] = 0), t;
        }
        function ir(t, i, e) {
            var n = new Qn(3);
            return n[0] = t, n[1] = i, n[2] = e, n;
        }
        function er(t, i) {
            return t[0] = i[0], t[1] = i[1], t[2] = i[2], t;
        }
        function nr(t, i, e, n) {
            return t[0] = i, t[1] = e, t[2] = n, t;
        }
        function rr(t, i, e) {
            return t[0] = i[0] + e[0], t[1] = i[1] + e[1], t[2] = i[2] + e[2], t;
        }
        function sr(t, i, e) {
            return t[0] = i[0] / e[0], t[1] = i[1] / e[1], t[2] = i[2] / e[2], t;
        }
        function or(t, i) {
            var e = i[0], n = i[1], r = i[2], s = e * e + n * n + r * r;
            return s > 0 && (s = 1 / Math.sqrt(s)), t[0] = i[0] * s, t[1] = i[1] * s, t[2] = i[2] * s, 
            t;
        }
        function hr(t, i) {
            return t[0] * i[0] + t[1] * i[1] + t[2] * i[2];
        }
        function ar(t, i, e) {
            var n = i[0], r = i[1], s = i[2], o = e[0], h = e[1], a = e[2];
            return t[0] = r * a - s * h, t[1] = s * o - n * a, t[2] = n * h - r * o, t;
        }
        Math.hypot || (Math.hypot = function() {
            for (var t = 0, i = arguments.length; i--; ) t += arguments[i] * arguments[i];
            return Math.sqrt(t);
        });
        var lr = function(t, i, e) {
            return t[0] = i[0] - e[0], t[1] = i[1] - e[1], t[2] = i[2] - e[2], t;
        };
        function ur() {
            var t = new Qn(4);
            return Qn != Float32Array && (t[0] = 0, t[1] = 0, t[2] = 0), t[3] = 1, t;
        }
        function cr(t, i) {
            var e, n = i[0] + i[4] + i[8];
            if (n > 0) e = Math.sqrt(n + 1), t[3] = .5 * e, e = .5 / e, t[0] = (i[5] - i[7]) * e, 
            t[1] = (i[6] - i[2]) * e, t[2] = (i[1] - i[3]) * e; else {
                var r = 0;
                i[4] > i[0] && (r = 1), i[8] > i[3 * r + r] && (r = 2);
                var s = (r + 1) % 3, o = (r + 2) % 3;
                e = Math.sqrt(i[3 * r + r] - i[3 * s + s] - i[3 * o + o] + 1), t[r] = .5 * e, e = .5 / e, 
                t[3] = (i[3 * s + o] - i[3 * o + s]) * e, t[s] = (i[3 * s + r] + i[3 * r + s]) * e, 
                t[o] = (i[3 * o + r] + i[3 * r + o]) * e;
            }
            return t;
        }
        !function() {
            var t = tr();
        }(), function() {
            var t = function() {
                var t = new Qn(4);
                return Qn != Float32Array && (t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 0), t;
            }();
        }();
        var fr = function(t, i, e) {
            return t[0] = i[0] * e, t[1] = i[1] * e, t[2] = i[2] * e, t[3] = i[3] * e, t;
        }, dr = function(t, i) {
            var e = i[0], n = i[1], r = i[2], s = i[3], o = e * e + n * n + r * r + s * s;
            return o > 0 && (o = 1 / Math.sqrt(o)), t[0] = e * o, t[1] = n * o, t[2] = r * o, 
            t[3] = s * o, t;
        };
        tr(), ir(1, 0, 0), ir(0, 1, 0), ur(), ur(), function() {
            var t = new Qn(9);
            Qn != Float32Array && (t[1] = 0, t[2] = 0, t[3] = 0, t[5] = 0, t[6] = 0, t[7] = 0), 
            t[0] = 1, t[4] = 1, t[8] = 1;
        }();
        class yr {
            constructor(t, i) {
                this.position = t, this.index = i, this.faces = [], this.neighbors = [];
            }
            addUniqueNeighbor(t) {
                -1 === this.neighbors.indexOf(t) && this.neighbors.push(t);
            }
        }
        class pr {
            constructor(t, i, e, n) {
                this.a = n.a, this.b = n.b, this.c = n.c, this.v1 = t, this.v2 = i, this.v3 = e, 
                this.normal = [], this.computeNormal(), t.faces.push(this), t.addUniqueNeighbor(i), 
                t.addUniqueNeighbor(e), i.faces.push(this), i.addUniqueNeighbor(t), i.addUniqueNeighbor(e), 
                e.faces.push(this), e.addUniqueNeighbor(t), e.addUniqueNeighbor(i);
            }
            computeNormal() {
                const t = this.v1.position, i = this.v2.position, e = this.v3.position, n = ar([], lr([], e, i), lr([], t, i));
                or(this.normal, n);
            }
            hasVertex(t) {
                return t === this.v1 || t === this.v2 || t === this.v3;
            }
        }
        /*!
         * Contains code from google filament
         * https://github.com/google/filament/
         * License Apache-2.0
         */        const mr = [], vr = [], gr = [], wr = [];
        function br(t, i, e) {
            const n = ar(vr, i, e);
            t = cr(t, function(t, i, e, n, r, s, o, h, a, l) {
                return t[0] = i, t[1] = e, t[2] = n, t[3] = r, t[4] = s, t[5] = o, t[6] = h, t[7] = a, 
                t[8] = l, t;
            }(mr, e[0], e[1], e[2], ...n, ...i));
            if ((t = function(t) {
                return t[3] < 0 ? fr(t, t, -1) : t;
            }(t = dr(t, t)))[3] < 1 / 32767) {
                t[3] = 1 / 32767;
                const i = Math.sqrt(.9999999990686206);
                t[0] *= i, t[1] *= i, t[2] *= i;
            }
            const r = e[3] > 0 ? ar(gr, e, i) : ar(gr, i, e);
            return hr(ar(wr, e, i), r) < 0 && fr(t, t, -1), t;
        }
        function Mr(t, i) {
            const e = [], n = [];
            let r = 0;
            for (r = 0; r < t.length; r += 3) {
                const i = new yr([ t[r], t[r + 1], t[r + 2] ], r / 3);
                e.push(i);
            }
            if (!i.length) {
                const t = i;
                i = [];
                for (let e = 0; e < t; e++) i.push(e);
            }
            for (r = 0; r < i.length / 3; r++) {
                const t = {
                    a: i[3 * r],
                    b: i[3 * r + 1],
                    c: i[3 * r + 2]
                };
                new pr(e[t.a], e[t.b], e[t.c], t);
            }
            const s = [], o = [ 0, 0, 0 ];
            for (r = 0; r < e.length; r++) {
                const t = e[r], i = t.index;
                nr(o, 0, 0, 0);
                let h = t.faces.length;
                for (let i = 0; i < h; i++) rr(o, o, t.faces[i].normal);
                h = h || 1, nr(s, h, h, h), sr(o, o, s), n[3 * i] = o[0], n[3 * i + 1] = o[1], n[3 * i + 2] = o[2];
            }
            return n;
        }
        /*!
         * Contains code from THREE.JS
         * https://github.com/mrdoob/three.js/
         * License MIT
         * 
         * Generate tangents per vertex.
         */        function xr(t, i, e) {
            return t[0] = i[e], t[1] = i[e + 1], t[2] = i[e + 2], t;
        }
        function Fr(t, i, e) {
            return t[0] = i[e], t[1] = i[e + 1], t;
        }
        class Ar extends Xn {
            constructor(t, i, e) {
                super(t, i, e), this.ot = e.altitudeProperty;
            }
            getFormat() {
                const {lineColorFn: t, lineWidthFn: i} = this.j, e = [ {
                    type: Int16Array,
                    width: 3,
                    name: "aPosition"
                }, {
                    type: Uint16Array,
                    width: 1,
                    name: "aLinesofar"
                }, {
                    type: Uint8Array,
                    width: 1,
                    name: "aUp"
                }, {
                    type: Int16Array,
                    width: 3,
                    name: "aExtrudedPosition"
                }, {
                    type: Int8Array,
                    width: 2,
                    name: "aExtrude"
                } ];
                return t && e.push({
                    type: Uint8Array,
                    width: 4,
                    name: "aColor"
                }), i && e.push({
                    type: Uint8Array,
                    width: 1,
                    name: "aLineWidth"
                }), this.ot && e.push({
                    type: Array,
                    width: 1,
                    name: "aLineHeight"
                }), e;
            }
            placeVector(t) {
                const i = t.feature;
                if (this.ot) {
                    const {altitudeScale: t, altitudeProperty: e, defaultAltitude: n, heightProperty: r, defaultHeight: s, minHeightProperty: o} = this.options, {altitude: h, height: a} = ci(i, t, e, n, r, s, o);
                    this.feaAltitude = h, this.feaMinHeight = (h - a) / h * 32767, h > this.maxAltitude && (this.maxAltitude = h);
                }
                return super.placeVector(t);
            }
            it(t, i, e, n, r, s) {
                const o = this.data.aPosition.length / 3;
                super.it(t, i, e, n, r, s);
                const h = this.data.aPosition.length / 3, a = this.data.aPosition.length / 3 - this.offset, l = 3 === i.type, u = !1 !== this.options.side;
                if (!l && a > 0 && u) {
                    const t = !1 !== this.options.top ? 1 : 0, i = t + 4;
                    let e = this.data.aPosition.length / 3;
                    for (const t in this.data) {
                        const i = this.data[t], n = i.length / e;
                        for (let t = 0; t < n; t++) i.push(i[o * n + 3 * n + t]);
                    }
                    e = this.data.aPosition.length / 3;
                    for (const t in this.data) {
                        const n = this.data[t], r = n.length / e;
                        for (let t = 0; t < r; t++) n.push(n[o * r + r * i + t]);
                    }
                    e = this.data.aPosition.length / 3;
                    for (const t in this.data) {
                        const n = this.data[t], r = n.length / e;
                        for (let t = 0; t < r; t++) n.push(n[o * r + r * (i + 3) + t]);
                    }
                    super.addElements(t + 1, a + 1, a), super.addElements(a, a + 1, a + 2);
                    const n = this.data.aPosition.length / 3 - this.offset;
                    e = this.data.aPosition.length / 3;
                    for (const t in this.data) {
                        const i = this.data[t], n = i.length / e;
                        for (let t = 0; t < n; t++) i.push(i[h * n - n + t]);
                    }
                    e = this.data.aPosition.length / 3;
                    for (const t in this.data) {
                        const n = this.data[t], r = n.length / e;
                        for (let t = 0; t < r; t++) n.push(n[h * r - i * r - r + t]);
                    }
                    e = this.data.aPosition.length / 3;
                    for (const t in this.data) {
                        const n = this.data[t], r = n.length / e;
                        for (let t = 0; t < r; t++) n.push(n[h * r - i * r - 3 * r + t]);
                    }
                    super.addElements(n, a - 3, n + 1), super.addElements(a - 3, n + 2, n + 1);
                }
            }
            fillData(t, i, e, n, r, s, o, h) {
                const a = !1 !== this.options.top, l = !1 !== this.options.side, u = this.options.EXTENT / this.options.tileSize, c = this.feaLineWidth || this.symbol.lineWidth / 2 * u, f = 63 * n, d = 63 * r, y = c * n + i, p = c * r + e;
                this.ht(t, i, e, n, r, s, o, h, y, p, f, d), l && (a && this.ht(t, i, e, n, r, s, o, h, y, p, f, d), 
                this.ht(t, i, e, n, r, s, o, h, y, p, f, d), this.at(t, i, e, n, r, s, o, h, y, p, f, d), 
                this.at(t, i, e, n, r, s, o, h, y, p, f, d)), this.maxPos = Math.max(this.maxPos, Math.abs(i), Math.abs(e));
            }
            ht(t, i, e, n, r, s, o, h, a, l, u, c) {
                const {lineColorFn: f, lineWidthFn: d} = this.j;
                t.aPosition.push(i, e, 32767), t.aLinesofar.push(h), t.aUp.push(+o), t.aExtrudedPosition.push(a, l, 1), 
                t.aExtrude.push(u, c), f && t.aColor.push(...this.feaColor), d && t.aLineWidth.push(Math.round(2 * this.feaLineWidth)), 
                this.ot && t.aLineHeight.push(this.feaAltitude);
            }
            at(t, i, e, n, r, s, o, h, a, l, u, c) {
                const {lineColorFn: f, lineWidthFn: d} = this.j;
                t.aPosition.push(i, e, this.feaMinHeight || 0), t.aLinesofar.push(h), t.aUp.push(+o), 
                t.aExtrudedPosition.push(a, l, 1), t.aExtrude.push(u, c), f && t.aColor.push(...this.feaColor), 
                d && t.aLineWidth.push(Math.round(2 * this.feaLineWidth)), this.ot && t.aLineHeight.push(this.feaAltitude);
            }
            addElements(t, i, e) {
                const n = !1 !== this.options.top, r = !1 !== this.options.side, s = (n ? 1 : 0) + (r ? 4 : 0), o = this.offset;
                t *= s, i *= s, e *= s;
                if (this.data.aUp[o + e + 4]) {
                    if (n && super.addElements(i, t, e), r) {
                        const t = n ? 1 : 0;
                        super.addElements(i + t, e + t, e + t + 2), super.addElements(i + t + 1, e + t + 1 + 2, i + t + 1 + 2);
                    }
                } else if (n && super.addElements(t, e, i), r) {
                    const i = n ? 1 : 0;
                    super.addElements(t + i, t + i + 2, e + i), super.addElements(t + i + 1 + 2, e + i + 1 + 2, e + i + 1);
                }
            }
            createDataPack(t, i) {
                this.maxAltitude = 0;
                const e = super.createDataPack(t, i);
                if (!e) return e;
                const {data: n, indices: r} = e;
                this.getFormat().reduce((t, i) => (t[i.name] = {
                    size: i.width
                }, t), {}).aPickingId = {
                    size: 1
                };
                const {aExtrudedPosition: s, aPosition: o, aLinesofar: h, aUp: a, aExtrude: l, aColor: u, aLineHeight: c, aLineWidth: f} = n, d = {}, y = Mr(s, r);
                let p, m = !0;
                for (let t = 0; t < y.length; t++) y[t] = -y[t], y[t] % 1 != 0 && (m = !1);
                if (!1 !== this.options.top && this.symbol.material && function(t) {
                    for (const i in t) if (i.indexOf("Texture") >= 0 && t[i]) return !0;
                    return !1;
                }(this.symbol.material) && (p = function(t, i, e) {
                    const n = [];
                    for (let r = 0; r < t.length; r += 3) {
                        const t = i[r / 3];
                        e[r / 3] ? n.push(t / 256, 1) : n.push(t / 256, 0);
                    }
                    return n;
                }(s, h, a)), d.aPosition = o, p && (d.aTexCoord0 = new Float32Array(p)), d.aNormal = m ? new Int8Array(y) : new Float32Array(y), 
                d.aPickingId = n.aPickingId, d.aExtrude = l, u && (d.aColor = u), f && (d.aLineWidth = f), 
                c) {
                    const t = Yt(this.maxAltitude);
                    d.aLineHeight = new t(c);
                }
                const v = [];
                for (const t in d) v.push(d[t].buffer);
                return e.data = d, e.buffers = v, e;
            }
        }
        const kr = Math.pow(2, 16) / 1;
        class _r extends vi {
            getFormat() {
                return [ {
                    type: Int16Array,
                    width: 3,
                    name: "aPosition"
                } ];
            }
            placeVector(t) {
                const i = t.feature, e = 3 === i.type, n = i.geometry, r = this.elements;
                e && (this.elements = []);
                for (let t = 0; t < n.length; t++) this.offset = this.data.aPosition.length / 3, 
                this.it(n[t], i), e && (this.et(r), this.elements = []);
                e && (this.elements = r);
            }
            it(t, i) {
                const e = 3 === i.type;
                let n = t.length;
                for (;n >= 2 && t[n - 1].equals(t[n - 2]); ) n--;
                let r, s, o, h = 0;
                for (;h < n - 1 && t[h].equals(t[h + 1]); ) h++;
                if (!(n < (e ? 3 : 2))) {
                    this.distance = 0, this.vertexLength = 0, this.primitiveLength = 0, this.e1 = this.e2 = this.e3 = -1, 
                    e && (r = t[n - 2]);
                    for (let i = h; i < n; i++) o = e && i === n - 1 ? t[h + 1] : t[i + 1], o && t[i].equals(o) || (r && (s = r), 
                    r = t[i], s && (this.distance += r.dist(s)), this.addCurrentVertex(r, this.distance));
                }
            }
            addCurrentVertex(t, i) {
                const e = this.vertexLength++;
                this.addLineVertex(this.data, t, i), e >= 1 && this.addElements(e - 1, e), i > kr && (this.distance = 0, 
                this.addCurrentVertex(t, this.distance));
            }
            addLineVertex(t, i) {
                t.aPosition.push(i.x, i.y, 0), this.maxPos = Math.max(this.maxPos, Math.abs(i.x), Math.abs(i.y));
            }
            addElements(t, i) {
                super.addElements(this.offset + t, this.offset + i);
            }
            et(t) {
                const i = this.options.EXTENT, e = this.elements;
                for (let n = 0; n < e.length; n += 2) li(this.data.aPosition, e[n], e[n + 1], 3, i) || t.push(e[n], e[n + 1]);
            }
        }
        const Sr = 45 * Math.PI / 100;
        class Pr extends vi {
            getFormat() {
                return [ {
                    type: Int16Array,
                    width: 3,
                    name: "aPosition"
                } ];
            }
            placeVector(t) {
                const i = this.symbol.markerSpacing || 250, e = this.symbol.markerPlacement || "point", n = this.X(t, i, e), r = this.getAltitude(t.feature.properties);
                for (let t = 0; t < n.length; t++) {
                    const i = n[t];
                    this.data.aPosition.push(i.x, i.y), this.data.aPosition.push(r);
                    const e = Math.max(Math.abs(i.x), Math.abs(i.y));
                    e > this.maxPos && (this.maxPos = e);
                }
            }
            X(t, i, e) {
                const n = t.feature, r = t.feature.type, s = this.options.EXTENT, o = [];
                if ("line" === e) {
                    let t = n.geometry;
                    s && (t = je(n.geometry, 0, 0, s, s));
                    for (let e = 0; e < t.length; e++) {
                        const n = Ne(t[e], i, Sr, null, null, 24, 1, 1, s || 1 / 0);
                        o.push.apply(o, n);
                    }
                } else if (3 === r) {
                    const t = $e(n.geometry, 0);
                    for (let i = 0; i < t.length; i++) {
                        const e = Ye(t[i], 16);
                        fi(e, s) || o.push(e);
                    }
                } else if (2 === n.type) for (let t = 0; t < n.geometry.length; t++) {
                    const i = n.geometry[t];
                    fi(i[0], s) || o.push(i[0]);
                } else if (1 === n.type) for (let t = 0; t < n.geometry.length; t++) {
                    const i = n.geometry[t];
                    for (let t = 0; t < i.length; t++) {
                        const e = i[t];
                        fi(e, s) || o.push(e);
                    }
                }
                return o;
            }
            hasElements() {
                return !1;
            }
        }
        var Or = {
            exports: {}
        };
        function Cr(t, i, e) {
            e = e || 2;
            var n, r, s, o, h, a, l, u = i && i.length, c = u ? i[0] * e : t.length, f = Ir(t, 0, c, e, !0), d = [];
            if (!f || f.next === f.prev) return d;
            if (u && (f = function(t, i, e, n) {
                var r, s, o, h, a, l = [];
                for (r = 0, s = i.length; r < s; r++) o = i[r] * n, h = r < s - 1 ? i[r + 1] * n : t.length, 
                (a = Ir(t, o, h, n, !1)) === a.next && (a.steiner = !0), l.push(Hr(a));
                for (l.sort(Rr), r = 0; r < l.length; r++) zr(l[r], e), e = Tr(e, e.next);
                return e;
            }(t, i, f, e)), t.length > 80 * e) {
                n = s = t[0], r = o = t[1];
                for (var y = e; y < c; y += e) (h = t[y]) < n && (n = h), (a = t[y + 1]) < r && (r = a), 
                h > s && (s = h), a > o && (o = a);
                l = 0 !== (l = Math.max(s - n, o - r)) ? 1 / l : 0;
            }
            return Dr(f, d, e, n, r, l), d;
        }
        function Ir(t, i, e, n, r) {
            var s, o;
            if (r === is(t, i, e, n) > 0) for (s = i; s < e; s += n) o = Kr(s, t[s], t[s + 1], o); else for (s = e - n; s >= i; s -= n) o = Kr(s, t[s], t[s + 1], o);
            return o && Jr(o, o.next) && (Qr(o), o = o.next), o;
        }
        function Tr(t, i) {
            if (!t) return t;
            i || (i = t);
            var e, n = t;
            do {
                if (e = !1, n.steiner || !Jr(n, n.next) && 0 !== Gr(n.prev, n, n.next)) n = n.next; else {
                    if (Qr(n), (n = i = n.prev) === n.next) break;
                    e = !0;
                }
            } while (e || n !== i);
            return i;
        }
        function Dr(t, i, e, n, r, s, o) {
            if (t) {
                !o && s && function(t, i, e, n) {
                    var r = t;
                    do {
                        null === r.z && (r.z = Wr(r.x, r.y, i, e, n)), r.prevZ = r.prev, r.nextZ = r.next, 
                        r = r.next;
                    } while (r !== t);
                    r.prevZ.nextZ = null, r.prevZ = null, function(t) {
                        var i, e, n, r, s, o, h, a, l = 1;
                        do {
                            for (e = t, t = null, s = null, o = 0; e; ) {
                                for (o++, n = e, h = 0, i = 0; i < l && (h++, n = n.nextZ); i++) ;
                                for (a = l; h > 0 || a > 0 && n; ) 0 !== h && (0 === a || !n || e.z <= n.z) ? (r = e, 
                                e = e.nextZ, h--) : (r = n, n = n.nextZ, a--), s ? s.nextZ = r : t = r, r.prevZ = s, 
                                s = r;
                                e = n;
                            }
                            s.nextZ = null, l *= 2;
                        } while (o > 1);
                    }(r);
                }(t, n, r, s);
                for (var h, a, l = t; t.prev !== t.next; ) if (h = t.prev, a = t.next, s ? Ur(t, n, r, s) : Lr(t)) i.push(h.i / e), 
                i.push(t.i / e), i.push(a.i / e), Qr(t), t = a.next, l = a.next; else if ((t = a) === l) {
                    o ? 1 === o ? Dr(t = Er(Tr(t), i, e), i, e, n, r, s, 2) : 2 === o && jr(t, i, e, n, r, s) : Dr(Tr(t), i, e, n, r, s, 1);
                    break;
                }
            }
        }
        function Lr(t) {
            var i = t.prev, e = t, n = t.next;
            if (Gr(i, e, n) >= 0) return !1;
            for (var r = t.next.next; r !== t.prev; ) {
                if (Vr(i.x, i.y, e.x, e.y, n.x, n.y, r.x, r.y) && Gr(r.prev, r, r.next) >= 0) return !1;
                r = r.next;
            }
            return !0;
        }
        function Ur(t, i, e, n) {
            var r = t.prev, s = t, o = t.next;
            if (Gr(r, s, o) >= 0) return !1;
            for (var h = r.x < s.x ? r.x < o.x ? r.x : o.x : s.x < o.x ? s.x : o.x, a = r.y < s.y ? r.y < o.y ? r.y : o.y : s.y < o.y ? s.y : o.y, l = r.x > s.x ? r.x > o.x ? r.x : o.x : s.x > o.x ? s.x : o.x, u = r.y > s.y ? r.y > o.y ? r.y : o.y : s.y > o.y ? s.y : o.y, c = Wr(h, a, i, e, n), f = Wr(l, u, i, e, n), d = t.prevZ, y = t.nextZ; d && d.z >= c && y && y.z <= f; ) {
                if (d !== t.prev && d !== t.next && Vr(r.x, r.y, s.x, s.y, o.x, o.y, d.x, d.y) && Gr(d.prev, d, d.next) >= 0) return !1;
                if (d = d.prevZ, y !== t.prev && y !== t.next && Vr(r.x, r.y, s.x, s.y, o.x, o.y, y.x, y.y) && Gr(y.prev, y, y.next) >= 0) return !1;
                y = y.nextZ;
            }
            for (;d && d.z >= c; ) {
                if (d !== t.prev && d !== t.next && Vr(r.x, r.y, s.x, s.y, o.x, o.y, d.x, d.y) && Gr(d.prev, d, d.next) >= 0) return !1;
                d = d.prevZ;
            }
            for (;y && y.z <= f; ) {
                if (y !== t.prev && y !== t.next && Vr(r.x, r.y, s.x, s.y, o.x, o.y, y.x, y.y) && Gr(y.prev, y, y.next) >= 0) return !1;
                y = y.nextZ;
            }
            return !0;
        }
        function Er(t, i, e) {
            var n = t;
            do {
                var r = n.prev, s = n.next.next;
                !Jr(r, s) && qr(r, n, n.next, s) && Zr(r, s) && Zr(s, r) && (i.push(r.i / e), i.push(n.i / e), 
                i.push(s.i / e), Qr(n), Qr(n.next), n = t = s), n = n.next;
            } while (n !== t);
            return Tr(n);
        }
        function jr(t, i, e, n, r, s) {
            var o = t;
            do {
                for (var h = o.next.next; h !== o.prev; ) {
                    if (o.i !== h.i && $r(o, h)) {
                        var a = Yr(o, h);
                        return o = Tr(o, o.next), a = Tr(a, a.next), Dr(o, i, e, n, r, s), void Dr(a, i, e, n, r, s);
                    }
                    h = h.next;
                }
                o = o.next;
            } while (o !== t);
        }
        function Rr(t, i) {
            return t.x - i.x;
        }
        function zr(t, i) {
            if (i = function(t, i) {
                var e, n = i, r = t.x, s = t.y, o = -1 / 0;
                do {
                    if (s <= n.y && s >= n.next.y && n.next.y !== n.y) {
                        var h = n.x + (s - n.y) * (n.next.x - n.x) / (n.next.y - n.y);
                        if (h <= r && h > o) {
                            if (o = h, h === r) {
                                if (s === n.y) return n;
                                if (s === n.next.y) return n.next;
                            }
                            e = n.x < n.next.x ? n : n.next;
                        }
                    }
                    n = n.next;
                } while (n !== i);
                if (!e) return null;
                if (r === o) return e;
                var a, l = e, u = e.x, c = e.y, f = 1 / 0;
                n = e;
                do {
                    r >= n.x && n.x >= u && r !== n.x && Vr(s < c ? r : o, s, u, c, s < c ? o : r, s, n.x, n.y) && (a = Math.abs(s - n.y) / (r - n.x), 
                    Zr(n, t) && (a < f || a === f && (n.x > e.x || n.x === e.x && Nr(e, n))) && (e = n, 
                    f = a)), n = n.next;
                } while (n !== l);
                return e;
            }(t, i)) {
                var e = Yr(i, t);
                Tr(i, i.next), Tr(e, e.next);
            }
        }
        function Nr(t, i) {
            return Gr(t.prev, t, i.prev) < 0 && Gr(i.next, t, t.next) < 0;
        }
        function Wr(t, i, e, n, r) {
            return (t = 1431655765 & ((t = 858993459 & ((t = 252645135 & ((t = 16711935 & ((t = 32767 * (t - e) * r) | t << 8)) | t << 4)) | t << 2)) | t << 1)) | (i = 1431655765 & ((i = 858993459 & ((i = 252645135 & ((i = 16711935 & ((i = 32767 * (i - n) * r) | i << 8)) | i << 4)) | i << 2)) | i << 1)) << 1;
        }
        function Hr(t) {
            var i = t, e = t;
            do {
                (i.x < e.x || i.x === e.x && i.y < e.y) && (e = i), i = i.next;
            } while (i !== t);
            return e;
        }
        function Vr(t, i, e, n, r, s, o, h) {
            return (r - o) * (i - h) - (t - o) * (s - h) >= 0 && (t - o) * (n - h) - (e - o) * (i - h) >= 0 && (e - o) * (s - h) - (r - o) * (n - h) >= 0;
        }
        function $r(t, i) {
            return t.next.i !== i.i && t.prev.i !== i.i && !function(t, i) {
                var e = t;
                do {
                    if (e.i !== t.i && e.next.i !== t.i && e.i !== i.i && e.next.i !== i.i && qr(e, e.next, t, i)) return !0;
                    e = e.next;
                } while (e !== t);
                return !1;
            }(t, i) && (Zr(t, i) && Zr(i, t) && function(t, i) {
                var e = t, n = !1, r = (t.x + i.x) / 2, s = (t.y + i.y) / 2;
                do {
                    e.y > s != e.next.y > s && e.next.y !== e.y && r < (e.next.x - e.x) * (s - e.y) / (e.next.y - e.y) + e.x && (n = !n), 
                    e = e.next;
                } while (e !== t);
                return n;
            }(t, i) && (Gr(t.prev, t, i.prev) || Gr(t, i.prev, i)) || Jr(t, i) && Gr(t.prev, t, t.next) > 0 && Gr(i.prev, i, i.next) > 0);
        }
        function Gr(t, i, e) {
            return (i.y - t.y) * (e.x - i.x) - (i.x - t.x) * (e.y - i.y);
        }
        function Jr(t, i) {
            return t.x === i.x && t.y === i.y;
        }
        function qr(t, i, e, n) {
            var r = Xr(Gr(t, i, e)), s = Xr(Gr(t, i, n)), o = Xr(Gr(e, n, t)), h = Xr(Gr(e, n, i));
            return r !== s && o !== h || (!(0 !== r || !Br(t, e, i)) || (!(0 !== s || !Br(t, n, i)) || (!(0 !== o || !Br(e, t, n)) || !(0 !== h || !Br(e, i, n)))));
        }
        function Br(t, i, e) {
            return i.x <= Math.max(t.x, e.x) && i.x >= Math.min(t.x, e.x) && i.y <= Math.max(t.y, e.y) && i.y >= Math.min(t.y, e.y);
        }
        function Xr(t) {
            return t > 0 ? 1 : t < 0 ? -1 : 0;
        }
        function Zr(t, i) {
            return Gr(t.prev, t, t.next) < 0 ? Gr(t, i, t.next) >= 0 && Gr(t, t.prev, i) >= 0 : Gr(t, i, t.prev) < 0 || Gr(t, t.next, i) < 0;
        }
        function Yr(t, i) {
            var e = new ts(t.i, t.x, t.y), n = new ts(i.i, i.x, i.y), r = t.next, s = i.prev;
            return t.next = i, i.prev = t, e.next = r, r.prev = e, n.next = e, e.prev = n, s.next = n, 
            n.prev = s, n;
        }
        function Kr(t, i, e, n) {
            var r = new ts(t, i, e);
            return n ? (r.next = n.next, r.prev = n, n.next.prev = r, n.next = r) : (r.prev = r, 
            r.next = r), r;
        }
        function Qr(t) {
            t.next.prev = t.prev, t.prev.next = t.next, t.prevZ && (t.prevZ.nextZ = t.nextZ), 
            t.nextZ && (t.nextZ.prevZ = t.prevZ);
        }
        function ts(t, i, e) {
            this.i = t, this.x = i, this.y = e, this.prev = null, this.next = null, this.z = null, 
            this.prevZ = null, this.nextZ = null, this.steiner = !1;
        }
        function is(t, i, e, n) {
            for (var r = 0, s = i, o = e - n; s < e; s += n) r += (t[o] - t[s]) * (t[s + 1] + t[o + 1]), 
            o = s;
            return r;
        }
        Or.exports = Cr, Or.exports.default = Cr, Cr.deviation = function(t, i, e, n) {
            var r = i && i.length, s = r ? i[0] * e : t.length, o = Math.abs(is(t, 0, s, e));
            if (r) for (var h = 0, a = i.length; h < a; h++) {
                var l = i[h] * e, u = h < a - 1 ? i[h + 1] * e : t.length;
                o -= Math.abs(is(t, l, u, e));
            }
            var c = 0;
            for (h = 0; h < n.length; h += 3) {
                var f = n[h] * e, d = n[h + 1] * e, y = n[h + 2] * e;
                c += Math.abs((t[f] - t[y]) * (t[d + 1] - t[f + 1]) - (t[f] - t[d]) * (t[y + 1] - t[f + 1]));
            }
            return 0 === o && 0 === c ? 0 : Math.abs((c - o) / o);
        }, Cr.flatten = function(t) {
            for (var i = t[0][0].length, e = {
                vertices: [],
                holes: [],
                dimensions: i
            }, n = 0, r = 0; r < t.length; r++) {
                for (var s = 0; s < t[r].length; s++) for (var o = 0; o < i; o++) e.vertices.push(t[r][s][o]);
                r > 0 && (n += t[r - 1].length, e.holes.push(n));
            }
            return e;
        };
        var es = Or.exports;
        /*!
         * from @turf/bboxClip
         * https://github.com/Turfjs/turf
         * MIT LICENSE
         */        const ns = [], rs = [];
        function ss(t, i) {
            var e, n, r, s, o, h, a;
            for (n = 1; n <= 8; n *= 2) {
                for (e = [], s = !(hs(r = t[t.length - 1], i) & n), o = 0; o < t.length; o++) {
                    if ((a = !(hs(h = t[o], i) & n)) !== s) {
                        const t = os(r, h, n, i);
                        void 0 !== h.x ? e.push(new Pt(t[0], t[1])) : e.push(t);
                    }
                    a && e.push(h), r = h, s = a;
                }
                if (!(t = e).length) break;
            }
            return e;
        }
        function os(t, i, e, n) {
            return ns[0] = void 0 === t.x ? t[0] : t.x, ns[1] = void 0 === t.y ? t[1] : t.y, 
            t = ns, rs[0] = void 0 === i.x ? i[0] : i.x, rs[1] = void 0 === i.y ? i[1] : i.y, 
            i = rs, 8 & e ? [ t[0] + (i[0] - t[0]) * (n[3] - t[1]) / (i[1] - t[1]), n[3] ] : 4 & e ? [ t[0] + (i[0] - t[0]) * (n[1] - t[1]) / (i[1] - t[1]), n[1] ] : 2 & e ? [ n[2], t[1] + (i[1] - t[1]) * (n[2] - t[0]) / (i[0] - t[0]) ] : 1 & e ? [ n[0], t[1] + (i[1] - t[1]) * (n[0] - t[0]) / (i[0] - t[0]) ] : null;
        }
        function hs(t, i) {
            ns[0] = void 0 === t.x ? t[0] : t.x, ns[1] = void 0 === t.y ? t[1] : t.y;
            var e = 0;
            return (t = ns)[0] < i[0] ? e |= 1 : t[0] > i[2] && (e |= 2), t[1] < i[1] ? e |= 4 : t[1] > i[3] && (e |= 8), 
            e;
        }
        class as extends vi {
            constructor(...t) {
                super(...t), this.lineElements = [];
            }
            createStyledVector(t, i, e, n, r) {
                const s = new pi(t, i, e, n), o = s.getPolygonResource();
                return !this.options.atlas && o && (r[o] = [ 0, 0 ]), s;
            }
            getFormat() {
                const t = [ {
                    type: Int16Array,
                    width: 3,
                    name: "aPosition"
                } ], {polygonFillFn: i, polygonOpacityFn: e, uvScaleFn: n, uvOffsetFn: r} = this.j;
                if (this.iconAtlas) {
                    const i = this.getIconAtlasMaxValue();
                    t.push({
                        type: i > 255 ? Uint16Array : Uint8Array,
                        width: 4,
                        name: "aTexInfo"
                    });
                }
                return i && t.push({
                    type: Uint8Array,
                    width: 4,
                    name: "aColor"
                }), e && t.push({
                    type: Uint8Array,
                    width: 1,
                    name: "aOpacity"
                }), n && t.push({
                    type: Uint16Array,
                    width: 2,
                    name: "aUVScale"
                }), r && t.push({
                    type: Uint8Array,
                    width: 2,
                    name: "aUVOffset"
                }), t;
            }
            createDataPack(...t) {
                this.maxLineIndex = 0, this.lineElements = [];
                const i = super.createDataPack(...t);
                if (!i) return i;
                let e = this.lineElements;
                return e = new (Zt(this.maxLineIndex))(this.lineElements), i.lineIndices = e, i.buffers.push(e.buffer), 
                i;
            }
            placeVector(t, i) {
                const e = t.feature, n = e.geometry;
                this.lt(n, e, i);
            }
            lt(t, i) {
                let e, n, r, s;
                const {polygonFillFn: o, polygonOpacityFn: h, uvScaleFn: a, uvOffsetFn: l} = this.j, u = i.properties;
                o && (e = o(this.options.zoom, u) || [ 255, 255, 255, 255 ], g(e) ? e = [ 0, 0, 0, 0 ] : (e = Array.isArray(e) ? e.map(t => 255 * t) : Vn(e).array(), 
                3 === e.length && e.push(255))), h && (n = h(this.options.zoom, u), ii(n) && (n = 1), 
                n *= 255), a && (r = a(this.options.zoom, u), ii(r) && (r = [ 1, 1 ]), r = [ 255 * r[0], 255 * r[1] ]), 
                l && (s = l(this.options.zoom, u), ii(s) && (s = [ 0, 0 ]), s = [ 255 * s[0], 255 * s[1] ]);
                const c = !!this.iconAtlas, f = $e(t, 500), d = this.getAltitude(u), y = [ 0, 0 ], p = [ 0, 0 ];
                if (c) {
                    const {polygonPatternFileFn: t} = this.j, i = t ? t(null, u) : this.symbol.polygonPatternFile;
                    if (this.iconAtlas.glyphMap[i]) {
                        const t = this.iconAtlas.positions[i];
                        y[0] = t.tl[0] + 1, y[1] = t.tl[1] + 1, p[0] = t.displaySize[0] - 3, p[1] = t.displaySize[1] - 3;
                    }
                }
                const m = [ -1, -1, i.extent + 1, i.extent + 1 ];
                for (let t = 0; t < f.length; t++) {
                    const i = f[t], o = this.data.aPosition.length / 3, h = [], a = [];
                    for (let t = 0; t < i.length; t++) {
                        let o = i[t];
                        if (this.options.EXTENT !== 1 / 0 && (o = ss(o, m)), 0 === o.length) continue;
                        0 !== t && a.push(h.length / 2);
                        const l = this.lineElements.length;
                        this.data.aPosition.push(o[0].x, o[0].y, d), c && this.data.aTexInfo.push(...y, ...p), 
                        void 0 !== e && this.data.aColor.push(...e), void 0 !== n && this.data.aOpacity.push(n), 
                        void 0 !== r && this.data.aUVScale.push(...r), void 0 !== s && this.data.aUVOffset.push(...s), 
                        this.maxPos = Math.max(this.maxPos, Math.abs(o[0].x), Math.abs(o[0].y)), this.addLineElements(l + o.length - 1, l), 
                        h.push(o[0].x), h.push(o[0].y);
                        for (let t = 1; t < o.length; t++) this.data.aPosition.push(o[t].x, o[t].y, d), 
                        c && this.data.aTexInfo.push(...y, ...p), void 0 !== e && this.data.aColor.push(...e), 
                        void 0 !== n && this.data.aOpacity.push(n), void 0 !== r && this.data.aUVScale.push(...r), 
                        void 0 !== s && this.data.aUVOffset.push(...s), this.maxPos = Math.max(this.maxPos, Math.abs(o[t].x), Math.abs(o[t].y)), 
                        this.addLineElements(l + t - 1, l + t), h.push(o[t].x), h.push(o[t].y);
                    }
                    const l = es(h, a);
                    for (let t = 0; t < l.length; t += 3) this.addElements(o + l[t], o + l[t + 1], o + l[t + 2]);
                }
            }
            addLineElements(...t) {
                this.maxLineIndex = Math.max(this.maxLineIndex, ...t), this.lineElements.push(...t);
            }
        }
        const ls = {
            polygonPatternFile: 1,
            markerFile: 1,
            markerPlacement: 1,
            markerSpacing: 1,
            textName: 1,
            textStyle: 1,
            textFaceName: 1,
            textWeight: 1,
            textPlacement: 1,
            textSpacing: 1,
            lineJoin: 1,
            lineCap: 1,
            linePatternFile: 1
        };
        Object.assign({
            visible: 1,
            textHorizontalAlignment: 1,
            textVerticalAlignment: 1,
            textWrapWidth: 1,
            markerHorizontalAlignment: 1,
            markerVerticalAlignment: 1
        }, ls), Object.assign({
            lineDasharray: 1
        }, ls);
        function us(t, i, e, n, r, s, o, h, a, l, u, c, f, d, y) {
            const p = i.length, m = r / 3;
            for (let e = 2, n = p; e < n; e += 3) t[r + e - 2] = i[e - 2], t[r + e - 1] = i[e - 1], 
            t[r + e - 0] = i[e] - s;
            r += p;
            for (let e = 2, n = p; e < n; e += 3) t[r + e - 2] = i[e - 2], t[r + e - 1] = i[e - 1], 
            t[r + e - 0] = i[e] - o;
            r += p;
            for (let e = 2, n = p; e < n; e += 3) t[r + e - 2] = i[e - 2], t[r + e - 1] = i[e - 1], 
            t[r + e - 0] = i[e] - s;
            r += p;
            for (let e = 2, n = p; e < n; e += 3) t[r + e - 2] = i[e - 2], t[r + e - 1] = i[e - 1], 
            t[r + e - 0] = i[e] - o;
            r += p, (e = e || []).push(p / 3);
            for (let i = 0; i < e.length; i++) {
                cs(m + (e[i - 1] || 0), m + e[i], t, p / 3, h, n, a, l, u, c, f, d, y);
            }
            return r;
        }
        function cs(t, i, e, n, r, s, o, h, a, l, u, c, f) {
            const d = s.length;
            let y, p;
            for (let o = t, h = i; o < h - 1; o++) y = o, p = o + 1, ft(e, y, p, r) || ((o - t) % 2 == 1 && (y += 2 * n, 
            p += 2 * n), s.push(y + n, y, p), s.push(p, p + n, y + n));
            o && function(t, i, e, n, r, s, o, h, a) {
                let l, u = 0, c = 0, f = 0, d = 0;
                for (let y = n.length - 1; y >= 0; y--) {
                    const p = 3 * n[y], m = 3 * n[y] + 1, v = 3 * n[y] + 2, g = e[p], w = e[m], b = e[v];
                    u || c || (u = Math.max(e[v], e[3 * n[y - 2] + 2]), c = Math.min(e[v], e[3 * n[y - 2] + 2]), 
                    l = u - c);
                    let M = f;
                    const x = y % 6;
                    0 === t ? (5 === x && (d = St(e, n, y, g, w)), M = 2 === x || 3 === x || 4 === x ? f : f + d) : 1 === t && (2 === x || 3 === x || 4 === x ? M = 0 : 5 === x ? (d = St(e, n, y, g, w), 
                    M = d) : M = d);
                    const F = M * o * h / r, A = b === u ? 0 : l * a / s;
                    i[p / 3 * 2] = F, i[p / 3 * 2 + 1] = -A, 0 === x && (f += d);
                }
            }(h, a, e, s.slice(d, s.length), l[0], l[1], u, c, f);
        }
        function fs(t, i, e, n, r, s, o, h, a, l) {
            void 0 === i.top && (i.top = !0), void 0 === i.side && (i.side = !0);
            const {altitudeScale: u, altitudeProperty: c, defaultAltitude: f, heightProperty: d, minHeightProperty: y, defaultHeight: p, tangent: m, uv: v, uvScale: g, topUVMode: M, sideUVMode: x, top: F, side: A, topThickness: k} = i, _ = function(t, i, {altitudeScale: e, altitudeProperty: n, defaultAltitude: r, heightProperty: s, minHeightProperty: o, defaultHeight: h}, {side: a, top: l, topThickness: u, uvOrigin: c, uv: f, uvSize: d, topUVMode: y, sideUVMode: p, glScale: m, localScale: v, vScale: g}, w) {
                const b = i / t[0].extent, M = [], x = [], F = [], A = [], k = [], _ = [], P = !!f, O = !!l, C = !!a, T = P ? [] : null;
                function U(t, e, n, r) {
                    if (O) {
                        const r = es(A, n, 3);
                        if (0 === r.length) return e;
                        let s;
                        I(k, A), e += A.length;
                        for (let i = 2, e = r.length; i < e; i += 3) s = r[i - 1], r[i - 1] = r[i] + t / 3, 
                        r[i] = s + t / 3, r[i - 2] += t / 3;
                        I(_, r), P && At(y || 0, t, e, T, k, 0, m, v, d[0], d[1]), u > 0 && !C && (e = us(k, A, n, _, e, 0, u, i, P, p || 0, T, d, m, v, g));
                    }
                    return C && (O && (u = 0), e = us(k, A, n, _, e, u, r, i, P, p || 0, T, d, m, v, g)), 
                    e;
                }
                let E = 0, j = 0;
                const R = [ -1, -1, i + 1, i + 1 ];
                let z = 0, N = t.length;
                void 0 !== w && (z = w, N = w + 1);
                let W = 0, H = !1;
                for (;z < N; z++) {
                    const a = t[z], l = a.id;
                    S(l) && (Math.abs(l) > W && (W = Math.abs(l)), l < 0 && (H = !0));
                    const u = a.geometry, {altitude: c, height: f} = ci(a, e, n, r, s, h, o);
                    E = Math.max(Math.abs(c), E);
                    const d = k.length;
                    let y = j, p = [];
                    A.length = 0;
                    for (let t = 0, e = u.length; t < e; t++) {
                        const n = ai(u[t]) < 0;
                        !n && t > 0 && (j = U(y, j, p, f * b), A.length = 0, p = [], y = j);
                        let r = u[t];
                        if (i !== 1 / 0 && (r = ss(r, R)), !r.length) {
                            t === e - 1 && (j = U(y, j, p, f * b));
                            continue;
                        }
                        const s = r.length;
                        Array.isArray(r[0]) ? r[0][0] === r[s - 1][0] && r[0][1] === r[s - 1][1] || r.push([ r[0][0], r[0][1] ]) : r[0].x === r[s - 1].x && r[0].y === r[s - 1].y || r.push(r[0]), 
                        n && p.push(A.length / 3), ct(A, A.length, r, b, c), t === e - 1 && (j = U(y, j, p, f * b));
                    }
                    const m = k.length - d, v = "__fea_idx".trim();
                    for (let t = 0; t < m / 3; t++) x.push(void 0 === a[v] ? z : a[v]), M.push(z), S(l) && F.push(l);
                }
                const V = D(x.length ? x[x.length - 1] : 0), $ = {
                    maxAltitude: E,
                    vertices: new (L(Math.max(512, E)))(k),
                    indices: _,
                    pickingIds: new V(x),
                    featureIndexes: M
                };
                if (F.length) {
                    const t = H ? L(W) : D(W);
                    $.featureIds = new t(F);
                } else $.featureIds = [];
                return T && (T.length = k.length / 3 * 2, $.uvs = T), $;
            }(t, e, {
                altitudeScale: u,
                altitudeProperty: c,
                defaultAltitude: f || 0,
                heightProperty: d,
                minHeightProperty: y,
                defaultHeight: p || 0
            }, {
                top: F,
                side: A,
                topThickness: 10 * k || 0,
                uv: v || m,
                uvSize: g ? [ .5 * g[0], .5 * g[1] ] : [ .5, .5 ],
                uvOrigin: n,
                topUVMode: M,
                sideUVMode: x,
                glScale: r,
                localScale: o,
                vScale: s
            }, l), P = [], O = new (T(_.vertices.length / 3))(_.indices);
            delete _.indices, P.push(O.buffer, _.vertices.buffer, _.pickingIds.buffer);
            const C = Mr(_.vertices, O);
            let U = !0;
            for (let t = 0; t < C.length; t++) C[t] = -C[t], C[t] % 1 != 0 && (U = !1);
            if (_.normals = C, m) {
                let t = function(t, i, e, n) {
                    const r = t.length / 3, s = new Array(4 * r), o = [], h = [];
                    for (let t = 0; t < r; t++) o[t] = [ 0, 0, 0 ], h[t] = [ 0, 0, 0 ];
                    const a = [ 0, 0, 0 ], l = [ 0, 0, 0 ], u = [ 0, 0, 0 ], c = [ 0, 0 ], f = [ 0, 0 ], d = [ 0, 0 ], y = [ 0, 0, 0 ], p = [ 0, 0, 0 ];
                    function m(i, n, r) {
                        xr(a, t, 3 * i), xr(l, t, 3 * n), xr(u, t, 3 * r), Fr(c, e, 2 * i), Fr(f, e, 2 * n), 
                        Fr(d, e, 2 * r);
                        const s = l[0] - a[0], m = u[0] - a[0], v = l[1] - a[1], g = u[1] - a[1], w = l[2] - a[2], b = u[2] - a[2], M = f[0] - c[0], x = d[0] - c[0], F = f[1] - c[1], A = d[1] - c[1], k = 1 / (M * A - x * F);
                        nr(y, (A * s - F * m) * k, (A * v - F * g) * k, (A * w - F * b) * k), nr(p, (M * m - x * s) * k, (M * g - x * v) * k, (M * b - x * w) * k), 
                        rr(o[i], o[i], y), rr(o[n], o[n], y), rr(o[r], o[r], y), rr(h[i], h[i], p), rr(h[n], h[n], p), 
                        rr(h[r], h[r], p);
                    }
                    for (let t = 0, i = n.length; t < i; t += 3) m(n[t + 0], n[t + 1], n[t + 2]);
                    const v = [], g = [], w = [], b = [];
                    let M, x, F;
                    function A(t) {
                        xr(w, i, 3 * t), er(b, w), x = o[t], er(v, x), lr(v, v, function(t, i, e) {
                            return t[0] = i[0] * e, t[1] = i[1] * e, t[2] = i[2] * e, t;
                        }(w, w, hr(w, x))), or(v, v), ar(g, b, x), F = hr(g, h[t]), M = F < 0 ? -1 : 1, 
                        s[4 * t] = v[0], s[4 * t + 1] = v[1], s[4 * t + 2] = v[2], s[4 * t + 3] = M;
                    }
                    for (let t = 0, i = n.length; t < i; t += 3) A(n[t + 0]), A(n[t + 1]), A(n[t + 2]);
                    return s;
                }(_.vertices, _.normals, _.uvs, O);
                t = function(t, i) {
                    const e = new Float32Array(i.length), n = [], r = [], s = [];
                    for (let o = 0; o < i.length; o += 4) {
                        const h = o / 4 * 3;
                        bt(r, t[h] || 0, t[h + 1] || 0, t[h + 2] || 0), xt(n, i[o] || 0, i[o + 1] || 0, i[o + 2] || 0, i[o + 3] || 0), 
                        br(s, r, n), Mt(e.subarray(o, o + 4), s);
                    }
                    return e;
                }(_.normals, t), _.tangents = t, P.push(t.buffer), delete _.normals;
            }
            if (_.normals && (_.normals = U ? new Int8Array(_.normals) : new Float32Array(_.normals), 
            P.push(_.normals.buffer)), _.uvs) {
                const t = _.uvs;
                _.uvs = new Float32Array(t), P.push(_.uvs.buffer);
            }
            const j = function(t, i, e, n) {
                const r = {};
                if (E("polygonFill", i)) {
                    const s = {}, o = b(i.polygonFill), h = new Uint8Array(4 * n.length);
                    for (let i = 0; i < n.length; i++) {
                        const r = t[n[i]], a = r.properties || {};
                        a.$layer = r.layer, a.$type = r.type;
                        let l = o(e, a);
                        if (delete a.$layer, delete a.$type, Array.isArray(l) || (l = s[l] = s[l] || Vn(l).array()), 
                        Array.isArray(l)) {
                            for (let t = 0; t < l.length; t++) ds[t] = 255 * l[t];
                            3 === l.length && (ds[3] = 255);
                        }
                        h[4 * i] = ds[0], h[4 * i + 1] = ds[1], h[4 * i + 2] = ds[2], h[4 * i + 3] = ds[3];
                    }
                    r.aColor = h;
                }
                if (E("polygonOpacity", i)) {
                    const s = w(i.polygonOpacity), o = new Uint8Array(n.length);
                    for (let i = 0; i < n.length; i++) {
                        const r = t[n[i]], h = r.properties || {};
                        h.$layer = r.layer, h.$type = r.type;
                        const a = s(e, h);
                        delete h.$layer, delete h.$type, o[i] = 255 * a;
                    }
                    r.aOpacity = o;
                }
                return r;
            }(t, h, a, _.featureIndexes), R = {
                data: {
                    data: {
                        aPosition: _.vertices,
                        aNormal: _.normals,
                        aTexCoord0: _.uvs,
                        aTangent: _.tangents,
                        aPickingId: _.pickingIds
                    },
                    indices: O,
                    properties: {
                        maxAltitude: _.maxAltitude
                    }
                },
                buffers: P
            };
            return _.featureIds.length ? (R.data.featureIds = _.featureIds, P.push(R.data.featureIds.buffer)) : R.data.featureIds = [], 
            j.aColor && (R.data.data.aColor = j.aColor, R.buffers.push(j.aColor.buffer)), j.aOpacity && (R.data.data.aOpacity = j.aOpacity, 
            R.buffers.push(j.aOpacity.buffer)), R;
        }
        const ds = [];
        function ys(t, i, {altitudeScale: e, altitudeProperty: n, defaultAltitude: r, heightProperty: s, minHeightProperty: o, defaultHeight: h, bottom: a}) {
            const l = a, u = i / t[0].extent, c = 2 * function(t, i) {
                let e = 0;
                for (let n = 0, r = t.length; n < r; n++) {
                    const r = t[n];
                    if (S(r.geometry[0][0])) {
                        const t = 3 * r.geometry.length;
                        e += i ? 2 * t - 6 : t;
                    } else for (let t = 0, n = r.geometry.length; t < n; t++) {
                        let n = 3 * r.geometry[t].length;
                        3 === r.type && (n -= 3), e += i ? 2 * n - 6 : n;
                    }
                }
                return e;
            }(t) + 3 * t.length * 2, f = [], d = new Int16Array(c), y = [];
            function p(t, e, n) {
                const r = e - t, s = d.subarray(t, e), o = d.subarray(e, e + r);
                o.set(s);
                for (let t = 2, i = o.length; t < i; t += 3) o[t] = s[t] - n;
                const h = t / 3, a = r / 3;
                let u, c;
                for (let t = h, e = a + h; t < e; t++) t < e - 1 ? (u = t, c = t + 1) : (u = t, 
                c = h), ft(d, u, c, i) || (y.push(u, c), l && y.push(u + a, c + a), ps(d, u, i) || y.push(u, u + a));
                return e + r;
            }
            let m = 0, v = 0;
            const g = "__fea_idx".trim();
            for (let i = 0, a = t.length; i < a; i++) {
                const a = t[i], l = a.geometry, {altitude: c, height: w} = ci(a, e, n, r, s, h, o);
                v = Math.max(Math.abs(c), v);
                let b = m;
                for (let t = 0, i = l.length; t < i; t++) {
                    let i = l[t];
                    const e = i.length;
                    i[0][0] === i[e - 1][0] && i[0][1] === i[e - 1][1] && (i = i.slice(0, e - 1)), m = ct(d, b, i, u, c), 
                    m = p(b, m, w * u), b = m;
                }
                const M = y.length - f.length;
                for (let t = 0; t < M; t++) f.push(a[g]);
            }
            const w = new (T(y.reduce((t, i) => Math.max(t, i), 0)))(y), b = D(t.length);
            return {
                aPosition: new (L(Math.max(512, v)))(d),
                indices: w,
                aPickingId: new b(f)
            };
        }
        function ps(t, i, e) {
            const n = t[3 * i], r = t[3 * i + 1];
            return n < 0 || n > e || r < 0 || r > e;
        }
        function ms(t, i, e) {
            const n = ys(t, e, i), r = [ n.aPosition.buffer, n.indices.buffer, n.aPickingId.buffer ], s = n.indices;
            return delete n.indices, {
                data: {
                    data: n,
                    indices: s
                },
                buffers: r
            };
        }
        class vs {
            constructor(t, i, e, n, r) {
                this.id = t, this.options = i, this.upload = e, this.ut(i.style), this.requests = {}, 
                this.ct = 0, this.ft = n, this.loadings = r;
            }
            updateStyle(t, i) {
                this.options.style = t, this.ut(t), this.ct++, i();
            }
            updateOptions(t, i) {
                this.options = k(this.options, t), i();
            }
            loadTile(t, i) {
                const e = this.loadings, n = t.tileInfo.url, r = this.options.debugTile;
                if (r) {
                    const {x: e, y: n, z: s} = t.tileInfo;
                    if (s !== r.z || e !== r.x || n !== r.y) return void i();
                }
                if (this.ft.has(n)) {
                    const {features: r, layers: s} = this.ft.get(n), o = e[n];
                    if (delete e[n], !r || !r.length) return this.dt(o), void i();
                    if (o) for (let i = 0; i < o.length; i++) this.yt.call(o[i].ref, t, o[i].callback, n, s, r);
                    this.yt(t, i, n, s, r);
                } else e[n] ? e[n].push({
                    callback: i,
                    ref: this
                }) : (e[n] = [ {
                    callback: i,
                    ref: this
                } ], this.requests[n] = this.getTileFeatures(t.tileInfo, (i, r, s, o) => {
                    const h = e[n];
                    if (delete e[n], this.checkIfCanceled(n)) return delete this.requests[n], void this.dt(h, null, {
                        canceled: !0
                    });
                    if (delete this.requests[n], this.options.debug && r) for (let i = 0; i < r.length; i++) r[i]._debug_info = {
                        index: i,
                        tileId: t.tileInfo.id
                    };
                    if (i) return i.loading || this.ft.add(n, {
                        features: [],
                        layers: []
                    }), void this.dt(h, i);
                    if (!r || !r.length) return this.ft.add(n, {
                        features: [],
                        layers: []
                    }), void this.dt(h);
                    if (this.ft.add(n, {
                        features: r,
                        layers: s
                    }), h) for (let i = 0; i < h.length; i++) this.yt.call(h[i].ref, t, h[i].callback, n, s, r, o);
                }));
            }
            yt(t, i, e, n, r, s) {
                this.pt(n, r, t).then(t => {
                    t.canceled ? i(null, {
                        canceled: !0
                    }) : (t.data.style = this.ct, s && k(t.data, s), i(null, t.data, t.buffers));
                });
            }
            abortTile(t, i) {
                delete this.requests[t], this.vt(t), i();
            }
            vt(t) {
                const i = this.loadings[t];
                if (i) for (let t = 0; t < i.length; t++) i[t].callback(null, {
                    canceled: !0
                });
                delete this.loadings[t];
            }
            dt(t, i, e) {
                if (t) for (let n = 0; n < t.length; n++) t[n].callback(i, e);
            }
            checkIfCanceled(t) {
                return !this.requests[t];
            }
            fetchIconGlyphs(t, i, e) {
                this.upload("fetchIconGlyphs", {
                    icons: t,
                    glyphs: i
                }, null, e);
            }
            pt(t, i, {glScale: e, zScale: n, tileInfo: r}) {
                if (!i.length) return Promise.resolve({
                    data: null,
                    buffers: []
                });
                const s = !this.options.style.style.length && !this.options.style.featureStyle.length;
                let o = this.pluginConfig.slice(0);
                s && (o = this.gt(t)), this.featurePlugins && I(o, this.featurePlugins);
                const h = i[0].extent, a = r.z, l = {
                    x: r.extent2d.xmin * e,
                    y: r.extent2d.ymax * e
                }, u = [], c = [], f = [], d = this.options, y = [], p = {}, m = [ Promise.resolve(this.ct) ];
                let v = 0, g = -1;
                for (let t = 0; t < o.length; t++) {
                    g++;
                    const r = o[t];
                    r.type !== v && (g = 0, v = r.type);
                    const d = 0 === r.type ? u : c;
                    if (r.symbol && !1 === r.symbol.visible) {
                        d[g] = null;
                        continue;
                    }
                    const {tileFeatures: w, tileFeaIndexes: b} = this.wt(r.type, r.filter, i, p, t);
                    if (!w.length) {
                        d[g] = null;
                        continue;
                    }
                    const M = T(b[b.length - 1]);
                    d[g] = {
                        styledFeatures: new M(b)
                    }, f.push({
                        idx: t,
                        typeIdx: g
                    }), y.push(d[g].styledFeatures.buffer);
                    let x = this.bt(w, r, {
                        extent: h,
                        tilePoint: l,
                        glScale: e,
                        zScale: n,
                        zoom: a
                    });
                    s && (x = x.then(t => {
                        if (!t) return null;
                        if (t.data) t.data.layer = w[0].layer; else if (Array.isArray(t)) for (let i = 0; i < t.length; i++) t[i] && t[i].data && (t[i].data.layer = w[0].layer);
                        return t;
                    })), m.push(x);
                }
                return Promise.all(m).then(([e, ...n]) => {
                    function r(t, i) {
                        if (void 0 === t.data.ref && (t.data.type = o[f[i].idx].renderPlugin.dataConfig.type, 
                        t.data.filter = o[f[i].idx].filter.def, t.buffers && t.buffers.length)) for (let i = 0; i < t.buffers.length; i++) y.push(t.buffers[i]);
                    }
                    if (e !== this.ct) return {
                        canceled: !0
                    };
                    for (let t = 0; t < n.length; t++) {
                        if (!n[t]) continue;
                        const i = n[t], e = 0 === o[f[t].idx].type ? u : c;
                        if (Array.isArray(i)) {
                            const n = [];
                            for (let e = 0; e < i.length; e++) i[e] && (r(i[e], t), (void 0 === i[e].data.ref || i[i[e].data.ref]) && n.push(i[e].data));
                            n.length && (e[f[t].typeIdx].data = n);
                        } else r(i, t), e[f[t].typeIdx].data = i.data;
                    }
                    const s = {}, a = t;
                    if (d.features || d.schema) {
                        let t;
                        for (let e = 0, n = i.length; e < n; e++) if (t = i[e], a[t.layer].properties || (a[t.layer].properties = bs(t.properties)), 
                        d.features && t && p[e]) if ("id" === d.features) s[e] = t.id; else {
                            const i = k({}, t);
                            d.pickingGeometry || delete i.geometry, delete i.extent, delete i.properties.$layer, 
                            delete i.properties.$type, delete i.__index, s[e] = i;
                        }
                    }
                    return {
                        data: {
                            schema: a,
                            data: u,
                            featureData: c,
                            extent: h,
                            features: s
                        },
                        buffers: y
                    };
                });
            }
            bt(t, i, e) {
                const n = i.renderPlugin.dataConfig, r = i.symbol, s = this.options.tileSize[0], {extent: o, glScale: h, zScale: a, zoom: l, tilePoint: u} = e, c = o / s, f = n.type, d = this.options.debugTile && this.options.debugTile.index;
                if ("3d-extrusion" === f) {
                    const i = Ms(r);
                    return i && (n.uv = 1, 2 === i && (n.tangent = 1)), Promise.all([ Promise.resolve(fs(t, n, o, u, h, a, this.options.tileSize[1] / o, r, l, d)) ]);
                }
                if ("3d-wireframe" === f) return Promise.all([ Promise.resolve(ms(t, n, o)) ]);
                if ("point" === f) {
                    const i = k({}, n, {
                        EXTENT: o,
                        requestor: this.fetchIconGlyphs.bind(this),
                        zoom: l,
                        debugIndex: d
                    }), e = Jn.splitPointSymbol(r);
                    return Jn.needMerge(e[0]) && (t = Jn.mergeLineFeatures(t, e[0], l)), Promise.all(e.map(e => new Jn(t, e, i).load(c)));
                }
                if ("native-point" === f) {
                    const i = k({}, n, {
                        EXTENT: o,
                        zoom: l,
                        debugIndex: d
                    });
                    return xs(t, r, i, Pr, o / s);
                }
                if ("line" === f) {
                    const i = k({}, n, {
                        EXTENT: o,
                        requestor: this.fetchIconGlyphs.bind(this),
                        tileRatio: c,
                        zoom: l,
                        debugIndex: d
                    });
                    return xs(t, r, i, Xn);
                }
                if ("native-line" === f) {
                    const i = k({}, n, {
                        EXTENT: o,
                        zoom: l,
                        debugIndex: d
                    });
                    return xs(t, r, i, _r);
                }
                if ("fill" === f) {
                    const i = k({}, n, {
                        EXTENT: o,
                        requestor: this.fetchIconGlyphs.bind(this),
                        zoom: l,
                        debugIndex: d
                    });
                    return xs(t, r, i, as);
                }
                if ("line-extrusion" === f) {
                    delete r.lineGradientProperty, r.lineJoin = "miter", r.lineCap = "butt";
                    const i = Ms(r);
                    i && (n.uv = 1, 2 === i && (n.tangent = 1));
                    const e = k({}, n, {
                        EXTENT: o,
                        tileSize: s,
                        zScale: a,
                        glScale: h,
                        zoom: l,
                        debugIndex: d
                    });
                    if (i) {
                        const i = [];
                        if (!1 !== n.top) {
                            const n = k({}, e);
                            n.side = !1, i.push(new Ar(t, r, n));
                        }
                        return !1 !== n.side && (e.side = !0, e.top = !1, i.push(new Ar(t, r, e))), Promise.all(i.map(t => t.load()));
                    }
                    return Promise.all([ new Ar(t, r, e).load() ]);
                }
                return Promise.resolve([]);
            }
            wt(t, i, e, n) {
                const r = "__fea_idx".trim(), s = [], o = [], h = e.length;
                for (let a = 0; a < h; a++) if ((1 === t || void 0 === e[a].id || !this.styledFeatures[e[a].id]) && ((!i.def || "default" === i.def) && !n[a] || !0 === i.def || Array.isArray(i.def) && i(e[a]))) {
                    n[a] = 1;
                    const i = k({}, e[a]);
                    if (i[r] = a, o.push(i), s.push(a), 1 === t) break;
                }
                return {
                    tileFeatures: o,
                    tileFeaIndexes: s
                };
            }
            ut(t) {
                const {style: i, featureStyle: e} = t, n = {};
                e.forEach(t => {
                    Array.isArray(t.id) ? (t.id.forEach(t => {
                        n[t] = 1;
                    }), t.filter = [ "in", "$id", ...t.id ]) : (n[t.id] = 1, t.filter = [ "==", "$id", t.id ]);
                });
                const r = U(i);
                for (let t = 0; t < i.length; t++) r[t].filter && (r[t].filter.def = i[t].filter ? i[t].filter.value || i[t].filter : void 0), 
                r[t].type = 0;
                const s = [], o = U(e);
                for (let t = 0; t < e.length; t++) o[t].type = 1, o[t].filter.def = e[t].filter ? e[t].filter.value || e[t].filter : void 0, 
                o[t].renderPlugin && s.push(o[t]);
                this.pluginConfig = r, this.featurePlugins = s, this.styledFeatures = n;
            }
            gt(t) {
                let i = this.Mt;
                this.Mt || (i = this.Mt = {});
                const e = [ "", "Point", "LineString", "Polygon", "MultiPoint", "MultiLineString", "MultiPolygon" ], r = [];
                for (const s in t) {
                    const o = s;
                    if (!i[s]) {
                        const r = [];
                        for (let i = 0; i < t[s].types.length; i++) {
                            const h = t[s].types[i], a = [ "all", [ "==", "$layer", o ], [ "==", "$type", e[h] ] ], l = {
                                filter: n(a),
                                renderPlugin: gs(h),
                                symbol: ws(h)
                            };
                            l.filter.def = a, l.type = 0, r.push(l);
                        }
                        i[o] = r;
                    }
                    r.push(...i[o]);
                }
                return r;
            }
        }
        function gs(t) {
            switch (t) {
              case 1:
                return {
                    type: "native-point",
                    dataConfig: {
                        type: "native-point",
                        only2D: !0
                    }
                };

              case 2:
                return {
                    type: "native-line",
                    dataConfig: {
                        type: "native-line",
                        only2D: !0
                    }
                };

              case 3:
                return {
                    type: "fill",
                    dataConfig: {
                        type: "fill",
                        only2D: !0
                    }
                };
            }
            return null;
        }
        function ws(t) {
            switch (t) {
              case 1:
                return {
                    markerFill: "#f00",
                    markerSize: 10
                };

              case 2:
                return {
                    lineColor: "#fff"
                };

              case 3:
                return {
                    polygonFill: "#00f",
                    polygonOpacity: .4
                };
            }
            return null;
        }
        function bs(t) {
            if (Array.isArray(t) || !O(t)) return {};
            const i = {};
            for (const e in t) {
                const n = t[e];
                _(n) ? i[e] = "string" : S(n) ? i[e] = "number" : !0 === n || !1 === n ? i[e] = "boolean" : Array.isArray(n) ? i[e] = "array" : i[e] = "object";
            }
            return i;
        }
        function Ms(t) {
            if (!t) return 0;
            let i = 0;
            for (const e in t) {
                if (("normalTexture" === e || "bumpTexture" === e) && t[e]) return 2;
                if (e.indexOf("Texture") > 0 && t[e]) i = 1; else if (O(t[e])) {
                    const n = Ms(t[e]);
                    if (2 === n) return n;
                    1 === n && (i = 1);
                }
            }
            return i;
        }
        function xs(t, i, e, n, r) {
            const s = {}, o = Array.isArray(i) ? i : [ i ];
            let h = -1;
            for (let t = 0; t < o.length; t++) s[t] = Fs(o[t]), !s[t] && o[t] && -1 === h && (h = t);
            const a = [];
            for (let i = 0; i < o.length; i++) o[i] && (o[i].index = {
                index: i
            }, s[i] || i === h ? a.push(new n(t, o[i], e).load(r)) : a.push({
                data: {
                    ref: h,
                    symbolIndex: {
                        index: i
                    }
                }
            }));
            return Promise.all(a);
        }
        function Fs(t) {
            if (!t) return 0;
            for (const i in t) if (E(i, t)) return 1;
            return 0;
        }
        function As(t, i) {
            ks(t.geometry, i);
        }
        function ks(t, i) {
            if (t) switch (t.type) {
              case "Point":
                _s(t.coordinates, i);
                break;

              case "MultiPoint":
              case "LineString":
                Ss(t.coordinates, i);
                break;

              case "MultiLineString":
              case "Polygon":
                Ps(t.coordinates, i);
                break;

              case "MultiPolygon":
                !function(t, i) {
                    for (let e = 0; e < t.length; e++) Ps(t[e], i);
                }(t.coordinates, i);
                break;

              case "GeometryCollection":
                for (let e = 0; e < t.geometries.length; e++) ks(t.geometries[e], i);
            }
        }
        function _s(t, i) {
            i[0] = Math.min(i[0], t[0]), i[1] = Math.min(i[1], t[1]), i[2] = Math.max(i[2], t[0]), 
            i[3] = Math.max(i[3], t[1]);
        }
        function Ss(t, i) {
            for (let e = 0; e < t.length; e++) _s(t[e], i);
        }
        function Ps(t, i) {
            for (let e = 0; e < t.length; e++) Ss(t[e], i);
        }
        class Os extends vs {
            constructor(t, i, e, n, r, s) {
                super(t, i, e, n, r), (i = i || {}).extent || (i.extent = 8192), this.zoomOffset = 0, 
                i.tileSize && (this.zoomOffset = -function(t) {
                    if (Math.log2) return Math.log2(t);
                    const i = Math.log(t) * Math.LOG2E, e = Math.round(i);
                    return Math.abs(e - i) < 1e-14 ? e : i;
                }(i.tileSize[0] / 256)), this.setData(i.data, s);
            }
            setData(t, i) {
                if (delete this.index, !t) return void i();
                const e = {
                    maxZoom: 24,
                    tolerance: this.options.extent / this.options.tileSize[0] * 1,
                    extent: this.options.extent,
                    buffer: this.options.tileBuffer || 64,
                    debug: 0,
                    lineMetrics: !0,
                    indexMaxZoom: 5,
                    indexMaxPoints: 1e5
                };
                if (_(t) && "{" != t.substring(0, 1) || t.url) R.getJSON(t.url ? t.url : t, t.url ? t : {}, (t, n) => {
                    if (t && i(t), !n) return void i(null, {
                        extent: null,
                        idMap: {}
                    });
                    const r = n, {first1000: s, idMap: o} = this.xt(r);
                    this.Ft(s, o, r, e, i);
                }); else {
                    "string" == typeof t && (t = JSON.parse(t));
                    const n = Array.isArray(t) ? t : t.features;
                    let r = n;
                    n && n.length > 1e3 && (r = n.slice(0, 1e3)), this.Ft(r, null, t, e, i);
                }
            }
            Ft(t, i, e, n, r) {
                try {
                    const s = t && t.length ? function(t) {
                        let i = [ Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY ];
                        switch (t.type) {
                          case "FeatureCollection":
                            for (let e = 0; e < t.features.length; e++) As(t.features[e], i);
                            break;

                          case "Feature":
                            As(t, i);
                            break;

                          default:
                            ks(t, i);
                        }
                        return i;
                    }({
                        type: "FeatureCollection",
                        features: t
                    }) : null;
                    this.index = function(t, i) {
                        return new lt(t, i);
                    }(e, this.options.geojsonvt || n), r(null, {
                        extent: s,
                        idMap: i
                    });
                } catch (t) {
                    console.warn(t), r({
                        error: t.message
                    });
                }
            }
            xt(t) {
                const i = [], e = {};
                let n = 0;
                function r(t) {
                    t && ("Feature" !== t.type || t.geometry) && (void 0 !== t.id && null !== t.id || (t.id = n++), 
                    e[t.id] = k({}, t), t.geometry ? (e[t.id].geometry = k({}, t.geometry), e[t.id].geometry.coordinates = null) : t.coordinates && (e[t.id].coordinates = null), 
                    i.length < 1e3 && i.push(t));
                }
                return Array.isArray(t) ? t.forEach(t => {
                    r(t);
                }) : t.features && t.features.forEach(t => {
                    r(t);
                }), {
                    first1000: i,
                    idMap: e
                };
            }
            getTileFeatures(t, i) {
                const e = [];
                if (!this.index) return setTimeout((function() {
                    i({
                        loading: !0
                    });
                }), 1), 1;
                const n = this.index.getTile(t.z + this.zoomOffset, t.x, t.y);
                if (!n || 0 === n.features.length) return setTimeout((function() {
                    i(null, e, []);
                }), 1), 1;
                const r = [];
                for (let t = 0, i = n.features.length; t < i; t++) {
                    const i = n.features[t];
                    let s = i.layer;
                    void 0 === s && (s = "0"), r[s] = {
                        types: {}
                    };
                    r[s].types[i.type] = 1, i.tags = i.tags || {}, e.push({
                        type: i.type,
                        layer: s,
                        id: i.id,
                        geometry: i.geometry,
                        properties: i.tags,
                        extent: this.options.extent
                    });
                }
                for (const t in r) r[t].types = Object.keys(r[t].types).map(t => +t);
                return setTimeout((function() {
                    i(null, e, r);
                }), 1), 1;
            }
            onRemove() {
                delete this.index;
            }
        }
        var Cs = {
            read: function(t, i, e, n, r) {
                var s, o, h = 8 * r - n - 1, a = (1 << h) - 1, l = a >> 1, u = -7, c = e ? r - 1 : 0, f = e ? -1 : 1, d = t[i + c];
                for (c += f, s = d & (1 << -u) - 1, d >>= -u, u += h; u > 0; s = 256 * s + t[i + c], 
                c += f, u -= 8) ;
                for (o = s & (1 << -u) - 1, s >>= -u, u += n; u > 0; o = 256 * o + t[i + c], c += f, 
                u -= 8) ;
                if (0 === s) s = 1 - l; else {
                    if (s === a) return o ? NaN : 1 / 0 * (d ? -1 : 1);
                    o += Math.pow(2, n), s -= l;
                }
                return (d ? -1 : 1) * o * Math.pow(2, s - n);
            },
            write: function(t, i, e, n, r, s) {
                var o, h, a, l = 8 * s - r - 1, u = (1 << l) - 1, c = u >> 1, f = 23 === r ? Math.pow(2, -24) - Math.pow(2, -77) : 0, d = n ? 0 : s - 1, y = n ? 1 : -1, p = i < 0 || 0 === i && 1 / i < 0 ? 1 : 0;
                for (i = Math.abs(i), isNaN(i) || i === 1 / 0 ? (h = isNaN(i) ? 1 : 0, o = u) : (o = Math.floor(Math.log(i) / Math.LN2), 
                i * (a = Math.pow(2, -o)) < 1 && (o--, a *= 2), (i += o + c >= 1 ? f / a : f * Math.pow(2, 1 - c)) * a >= 2 && (o++, 
                a /= 2), o + c >= u ? (h = 0, o = u) : o + c >= 1 ? (h = (i * a - 1) * Math.pow(2, r), 
                o += c) : (h = i * Math.pow(2, c - 1) * Math.pow(2, r), o = 0)); r >= 8; t[e + d] = 255 & h, 
                d += y, h /= 256, r -= 8) ;
                for (o = o << r | h, l += r; l > 0; t[e + d] = 255 & o, d += y, o /= 256, l -= 8) ;
                t[e + d - y] |= 128 * p;
            }
        }, Is = Ds, Ts = Cs;
        function Ds(t) {
            this.buf = ArrayBuffer.isView && ArrayBuffer.isView(t) ? t : new Uint8Array(t || 0), 
            this.pos = 0, this.type = 0, this.length = this.buf.length;
        }
        Ds.Varint = 0, Ds.Fixed64 = 1, Ds.Bytes = 2, Ds.Fixed32 = 5;
        var Ls = "undefined" == typeof TextDecoder ? null : new TextDecoder("utf8");
        function Us(t) {
            return t.type === Ds.Bytes ? t.readVarint() + t.pos : t.pos + 1;
        }
        function Es(t, i, e) {
            return e ? 4294967296 * i + (t >>> 0) : 4294967296 * (i >>> 0) + (t >>> 0);
        }
        function js(t, i, e) {
            var n = i <= 16383 ? 1 : i <= 2097151 ? 2 : i <= 268435455 ? 3 : Math.floor(Math.log(i) / (7 * Math.LN2));
            e.realloc(n);
            for (var r = e.pos - 1; r >= t; r--) e.buf[r + n] = e.buf[r];
        }
        function Rs(t, i) {
            for (var e = 0; e < t.length; e++) i.writeVarint(t[e]);
        }
        function zs(t, i) {
            for (var e = 0; e < t.length; e++) i.writeSVarint(t[e]);
        }
        function Ns(t, i) {
            for (var e = 0; e < t.length; e++) i.writeFloat(t[e]);
        }
        function Ws(t, i) {
            for (var e = 0; e < t.length; e++) i.writeDouble(t[e]);
        }
        function Hs(t, i) {
            for (var e = 0; e < t.length; e++) i.writeBoolean(t[e]);
        }
        function Vs(t, i) {
            for (var e = 0; e < t.length; e++) i.writeFixed32(t[e]);
        }
        function $s(t, i) {
            for (var e = 0; e < t.length; e++) i.writeSFixed32(t[e]);
        }
        function Gs(t, i) {
            for (var e = 0; e < t.length; e++) i.writeFixed64(t[e]);
        }
        function Js(t, i) {
            for (var e = 0; e < t.length; e++) i.writeSFixed64(t[e]);
        }
        function qs(t, i) {
            return (t[i] | t[i + 1] << 8 | t[i + 2] << 16) + 16777216 * t[i + 3];
        }
        function Bs(t, i, e) {
            t[e] = i, t[e + 1] = i >>> 8, t[e + 2] = i >>> 16, t[e + 3] = i >>> 24;
        }
        function Xs(t, i) {
            return (t[i] | t[i + 1] << 8 | t[i + 2] << 16) + (t[i + 3] << 24);
        }
        Ds.prototype = {
            destroy: function() {
                this.buf = null;
            },
            readFields: function(t, i, e) {
                for (e = e || this.length; this.pos < e; ) {
                    var n = this.readVarint(), r = n >> 3, s = this.pos;
                    this.type = 7 & n, t(r, i, this), this.pos === s && this.skip(n);
                }
                return i;
            },
            readMessage: function(t, i) {
                return this.readFields(t, i, this.readVarint() + this.pos);
            },
            readFixed32: function() {
                var t = qs(this.buf, this.pos);
                return this.pos += 4, t;
            },
            readSFixed32: function() {
                var t = Xs(this.buf, this.pos);
                return this.pos += 4, t;
            },
            readFixed64: function() {
                var t = qs(this.buf, this.pos) + 4294967296 * qs(this.buf, this.pos + 4);
                return this.pos += 8, t;
            },
            readSFixed64: function() {
                var t = qs(this.buf, this.pos) + 4294967296 * Xs(this.buf, this.pos + 4);
                return this.pos += 8, t;
            },
            readFloat: function() {
                var t = Ts.read(this.buf, this.pos, !0, 23, 4);
                return this.pos += 4, t;
            },
            readDouble: function() {
                var t = Ts.read(this.buf, this.pos, !0, 52, 8);
                return this.pos += 8, t;
            },
            readVarint: function(t) {
                var i, e, n = this.buf;
                return i = 127 & (e = n[this.pos++]), e < 128 ? i : (i |= (127 & (e = n[this.pos++])) << 7, 
                e < 128 ? i : (i |= (127 & (e = n[this.pos++])) << 14, e < 128 ? i : (i |= (127 & (e = n[this.pos++])) << 21, 
                e < 128 ? i : function(t, i, e) {
                    var n, r, s = e.buf;
                    if (r = s[e.pos++], n = (112 & r) >> 4, r < 128) return Es(t, n, i);
                    if (r = s[e.pos++], n |= (127 & r) << 3, r < 128) return Es(t, n, i);
                    if (r = s[e.pos++], n |= (127 & r) << 10, r < 128) return Es(t, n, i);
                    if (r = s[e.pos++], n |= (127 & r) << 17, r < 128) return Es(t, n, i);
                    if (r = s[e.pos++], n |= (127 & r) << 24, r < 128) return Es(t, n, i);
                    if (r = s[e.pos++], n |= (1 & r) << 31, r < 128) return Es(t, n, i);
                    throw new Error("Expected varint not more than 10 bytes");
                }(i |= (15 & (e = n[this.pos])) << 28, t, this))));
            },
            readVarint64: function() {
                return this.readVarint(!0);
            },
            readSVarint: function() {
                var t = this.readVarint();
                return t % 2 == 1 ? (t + 1) / -2 : t / 2;
            },
            readBoolean: function() {
                return Boolean(this.readVarint());
            },
            readString: function() {
                var t = this.readVarint() + this.pos, i = this.pos;
                return this.pos = t, t - i >= 12 && Ls ? function(t, i, e) {
                    return Ls.decode(t.subarray(i, e));
                }(this.buf, i, t) : function(t, i, e) {
                    var n = "", r = i;
                    for (;r < e; ) {
                        var s, o, h, a = t[r], l = null, u = a > 239 ? 4 : a > 223 ? 3 : a > 191 ? 2 : 1;
                        if (r + u > e) break;
                        1 === u ? a < 128 && (l = a) : 2 === u ? 128 == (192 & (s = t[r + 1])) && (l = (31 & a) << 6 | 63 & s) <= 127 && (l = null) : 3 === u ? (s = t[r + 1], 
                        o = t[r + 2], 128 == (192 & s) && 128 == (192 & o) && ((l = (15 & a) << 12 | (63 & s) << 6 | 63 & o) <= 2047 || l >= 55296 && l <= 57343) && (l = null)) : 4 === u && (s = t[r + 1], 
                        o = t[r + 2], h = t[r + 3], 128 == (192 & s) && 128 == (192 & o) && 128 == (192 & h) && ((l = (15 & a) << 18 | (63 & s) << 12 | (63 & o) << 6 | 63 & h) <= 65535 || l >= 1114112) && (l = null)), 
                        null === l ? (l = 65533, u = 1) : l > 65535 && (l -= 65536, n += String.fromCharCode(l >>> 10 & 1023 | 55296), 
                        l = 56320 | 1023 & l), n += String.fromCharCode(l), r += u;
                    }
                    return n;
                }(this.buf, i, t);
            },
            readBytes: function() {
                var t = this.readVarint() + this.pos, i = this.buf.subarray(this.pos, t);
                return this.pos = t, i;
            },
            readPackedVarint: function(t, i) {
                if (this.type !== Ds.Bytes) return t.push(this.readVarint(i));
                var e = Us(this);
                for (t = t || []; this.pos < e; ) t.push(this.readVarint(i));
                return t;
            },
            readPackedSVarint: function(t) {
                if (this.type !== Ds.Bytes) return t.push(this.readSVarint());
                var i = Us(this);
                for (t = t || []; this.pos < i; ) t.push(this.readSVarint());
                return t;
            },
            readPackedBoolean: function(t) {
                if (this.type !== Ds.Bytes) return t.push(this.readBoolean());
                var i = Us(this);
                for (t = t || []; this.pos < i; ) t.push(this.readBoolean());
                return t;
            },
            readPackedFloat: function(t) {
                if (this.type !== Ds.Bytes) return t.push(this.readFloat());
                var i = Us(this);
                for (t = t || []; this.pos < i; ) t.push(this.readFloat());
                return t;
            },
            readPackedDouble: function(t) {
                if (this.type !== Ds.Bytes) return t.push(this.readDouble());
                var i = Us(this);
                for (t = t || []; this.pos < i; ) t.push(this.readDouble());
                return t;
            },
            readPackedFixed32: function(t) {
                if (this.type !== Ds.Bytes) return t.push(this.readFixed32());
                var i = Us(this);
                for (t = t || []; this.pos < i; ) t.push(this.readFixed32());
                return t;
            },
            readPackedSFixed32: function(t) {
                if (this.type !== Ds.Bytes) return t.push(this.readSFixed32());
                var i = Us(this);
                for (t = t || []; this.pos < i; ) t.push(this.readSFixed32());
                return t;
            },
            readPackedFixed64: function(t) {
                if (this.type !== Ds.Bytes) return t.push(this.readFixed64());
                var i = Us(this);
                for (t = t || []; this.pos < i; ) t.push(this.readFixed64());
                return t;
            },
            readPackedSFixed64: function(t) {
                if (this.type !== Ds.Bytes) return t.push(this.readSFixed64());
                var i = Us(this);
                for (t = t || []; this.pos < i; ) t.push(this.readSFixed64());
                return t;
            },
            skip: function(t) {
                var i = 7 & t;
                if (i === Ds.Varint) for (;this.buf[this.pos++] > 127; ) ; else if (i === Ds.Bytes) this.pos = this.readVarint() + this.pos; else if (i === Ds.Fixed32) this.pos += 4; else {
                    if (i !== Ds.Fixed64) throw new Error("Unimplemented type: " + i);
                    this.pos += 8;
                }
            },
            writeTag: function(t, i) {
                this.writeVarint(t << 3 | i);
            },
            realloc: function(t) {
                for (var i = this.length || 16; i < this.pos + t; ) i *= 2;
                if (i !== this.length) {
                    var e = new Uint8Array(i);
                    e.set(this.buf), this.buf = e, this.length = i;
                }
            },
            finish: function() {
                return this.length = this.pos, this.pos = 0, this.buf.subarray(0, this.length);
            },
            writeFixed32: function(t) {
                this.realloc(4), Bs(this.buf, t, this.pos), this.pos += 4;
            },
            writeSFixed32: function(t) {
                this.realloc(4), Bs(this.buf, t, this.pos), this.pos += 4;
            },
            writeFixed64: function(t) {
                this.realloc(8), Bs(this.buf, -1 & t, this.pos), Bs(this.buf, Math.floor(t * (1 / 4294967296)), this.pos + 4), 
                this.pos += 8;
            },
            writeSFixed64: function(t) {
                this.realloc(8), Bs(this.buf, -1 & t, this.pos), Bs(this.buf, Math.floor(t * (1 / 4294967296)), this.pos + 4), 
                this.pos += 8;
            },
            writeVarint: function(t) {
                (t = +t || 0) > 268435455 || t < 0 ? function(t, i) {
                    var e, n;
                    t >= 0 ? (e = t % 4294967296 | 0, n = t / 4294967296 | 0) : (n = ~(-t / 4294967296), 
                    4294967295 ^ (e = ~(-t % 4294967296)) ? e = e + 1 | 0 : (e = 0, n = n + 1 | 0));
                    if (t >= 0x10000000000000000 || t < -0x10000000000000000) throw new Error("Given varint doesn't fit into 10 bytes");
                    i.realloc(10), function(t, i, e) {
                        e.buf[e.pos++] = 127 & t | 128, t >>>= 7, e.buf[e.pos++] = 127 & t | 128, t >>>= 7, 
                        e.buf[e.pos++] = 127 & t | 128, t >>>= 7, e.buf[e.pos++] = 127 & t | 128, t >>>= 7, 
                        e.buf[e.pos] = 127 & t;
                    }(e, 0, i), function(t, i) {
                        var e = (7 & t) << 4;
                        if (i.buf[i.pos++] |= e | ((t >>>= 3) ? 128 : 0), !t) return;
                        if (i.buf[i.pos++] = 127 & t | ((t >>>= 7) ? 128 : 0), !t) return;
                        if (i.buf[i.pos++] = 127 & t | ((t >>>= 7) ? 128 : 0), !t) return;
                        if (i.buf[i.pos++] = 127 & t | ((t >>>= 7) ? 128 : 0), !t) return;
                        if (i.buf[i.pos++] = 127 & t | ((t >>>= 7) ? 128 : 0), !t) return;
                        i.buf[i.pos++] = 127 & t;
                    }(n, i);
                }(t, this) : (this.realloc(4), this.buf[this.pos++] = 127 & t | (t > 127 ? 128 : 0), 
                t <= 127 || (this.buf[this.pos++] = 127 & (t >>>= 7) | (t > 127 ? 128 : 0), t <= 127 || (this.buf[this.pos++] = 127 & (t >>>= 7) | (t > 127 ? 128 : 0), 
                t <= 127 || (this.buf[this.pos++] = t >>> 7 & 127))));
            },
            writeSVarint: function(t) {
                this.writeVarint(t < 0 ? 2 * -t - 1 : 2 * t);
            },
            writeBoolean: function(t) {
                this.writeVarint(Boolean(t));
            },
            writeString: function(t) {
                t = String(t), this.realloc(4 * t.length), this.pos++;
                var i = this.pos;
                this.pos = function(t, i, e) {
                    for (var n, r, s = 0; s < i.length; s++) {
                        if ((n = i.charCodeAt(s)) > 55295 && n < 57344) {
                            if (!r) {
                                n > 56319 || s + 1 === i.length ? (t[e++] = 239, t[e++] = 191, t[e++] = 189) : r = n;
                                continue;
                            }
                            if (n < 56320) {
                                t[e++] = 239, t[e++] = 191, t[e++] = 189, r = n;
                                continue;
                            }
                            n = r - 55296 << 10 | n - 56320 | 65536, r = null;
                        } else r && (t[e++] = 239, t[e++] = 191, t[e++] = 189, r = null);
                        n < 128 ? t[e++] = n : (n < 2048 ? t[e++] = n >> 6 | 192 : (n < 65536 ? t[e++] = n >> 12 | 224 : (t[e++] = n >> 18 | 240, 
                        t[e++] = n >> 12 & 63 | 128), t[e++] = n >> 6 & 63 | 128), t[e++] = 63 & n | 128);
                    }
                    return e;
                }(this.buf, t, this.pos);
                var e = this.pos - i;
                e >= 128 && js(i, e, this), this.pos = i - 1, this.writeVarint(e), this.pos += e;
            },
            writeFloat: function(t) {
                this.realloc(4), Ts.write(this.buf, t, this.pos, !0, 23, 4), this.pos += 4;
            },
            writeDouble: function(t) {
                this.realloc(8), Ts.write(this.buf, t, this.pos, !0, 52, 8), this.pos += 8;
            },
            writeBytes: function(t) {
                var i = t.length;
                this.writeVarint(i), this.realloc(i);
                for (var e = 0; e < i; e++) this.buf[this.pos++] = t[e];
            },
            writeRawMessage: function(t, i) {
                this.pos++;
                var e = this.pos;
                t(i, this);
                var n = this.pos - e;
                n >= 128 && js(e, n, this), this.pos = e - 1, this.writeVarint(n), this.pos += n;
            },
            writeMessage: function(t, i, e) {
                this.writeTag(t, Ds.Bytes), this.writeRawMessage(i, e);
            },
            writePackedVarint: function(t, i) {
                i.length && this.writeMessage(t, Rs, i);
            },
            writePackedSVarint: function(t, i) {
                i.length && this.writeMessage(t, zs, i);
            },
            writePackedBoolean: function(t, i) {
                i.length && this.writeMessage(t, Hs, i);
            },
            writePackedFloat: function(t, i) {
                i.length && this.writeMessage(t, Ns, i);
            },
            writePackedDouble: function(t, i) {
                i.length && this.writeMessage(t, Ws, i);
            },
            writePackedFixed32: function(t, i) {
                i.length && this.writeMessage(t, Vs, i);
            },
            writePackedSFixed32: function(t, i) {
                i.length && this.writeMessage(t, $s, i);
            },
            writePackedFixed64: function(t, i) {
                i.length && this.writeMessage(t, Gs, i);
            },
            writePackedSFixed64: function(t, i) {
                i.length && this.writeMessage(t, Js, i);
            },
            writeBytesField: function(t, i) {
                this.writeTag(t, Ds.Bytes), this.writeBytes(i);
            },
            writeFixed32Field: function(t, i) {
                this.writeTag(t, Ds.Fixed32), this.writeFixed32(i);
            },
            writeSFixed32Field: function(t, i) {
                this.writeTag(t, Ds.Fixed32), this.writeSFixed32(i);
            },
            writeFixed64Field: function(t, i) {
                this.writeTag(t, Ds.Fixed64), this.writeFixed64(i);
            },
            writeSFixed64Field: function(t, i) {
                this.writeTag(t, Ds.Fixed64), this.writeSFixed64(i);
            },
            writeVarintField: function(t, i) {
                this.writeTag(t, Ds.Varint), this.writeVarint(i);
            },
            writeSVarintField: function(t, i) {
                this.writeTag(t, Ds.Varint), this.writeSVarint(i);
            },
            writeStringField: function(t, i) {
                this.writeTag(t, Ds.Bytes), this.writeString(i);
            },
            writeFloatField: function(t, i) {
                this.writeTag(t, Ds.Fixed32), this.writeFloat(i);
            },
            writeDoubleField: function(t, i) {
                this.writeTag(t, Ds.Fixed64), this.writeDouble(i);
            },
            writeBooleanField: function(t, i) {
                this.writeVarintField(t, Boolean(i));
            }
        };
        var Zs = Pt, Ys = Ks;
        function Ks(t, i, e, n, r) {
            this.properties = {}, this.extent = e, this.type = 0, this.At = t, this.kt = -1, 
            this._t = n, this.St = r, t.readFields(Qs, this, i);
        }
        function Qs(t, i, e) {
            1 == t ? i.id = e.readVarint() : 2 == t ? function(t, i) {
                var e = t.readVarint() + t.pos;
                for (;t.pos < e; ) {
                    var n = i._t[t.readVarint()], r = i.St[t.readVarint()];
                    i.properties[n] = r;
                }
            }(e, i) : 3 == t ? i.type = e.readVarint() : 4 == t && (i.kt = e.pos);
        }
        function to(t) {
            for (var i, e, n = 0, r = 0, s = t.length, o = s - 1; r < s; o = r++) i = t[r], 
            n += ((e = t[o]).x - i.x) * (i.y + e.y);
            return n;
        }
        Ks.types = [ "Unknown", "Point", "LineString", "Polygon" ], Ks.prototype.loadGeometry = function() {
            var t = this.At;
            t.pos = this.kt;
            for (var i, e = t.readVarint() + t.pos, n = 1, r = 0, s = 0, o = 0, h = []; t.pos < e; ) {
                if (r <= 0) {
                    var a = t.readVarint();
                    n = 7 & a, r = a >> 3;
                }
                if (r--, 1 === n || 2 === n) s += t.readSVarint(), o += t.readSVarint(), 1 === n && (i && h.push(i), 
                i = []), i.push(new Zs(s, o)); else {
                    if (7 !== n) throw new Error("unknown command " + n);
                    i && i.push(i[0].clone());
                }
            }
            return i && h.push(i), h;
        }, Ks.prototype.bbox = function() {
            var t = this.At;
            t.pos = this.kt;
            for (var i = t.readVarint() + t.pos, e = 1, n = 0, r = 0, s = 0, o = 1 / 0, h = -1 / 0, a = 1 / 0, l = -1 / 0; t.pos < i; ) {
                if (n <= 0) {
                    var u = t.readVarint();
                    e = 7 & u, n = u >> 3;
                }
                if (n--, 1 === e || 2 === e) (r += t.readSVarint()) < o && (o = r), r > h && (h = r), 
                (s += t.readSVarint()) < a && (a = s), s > l && (l = s); else if (7 !== e) throw new Error("unknown command " + e);
            }
            return [ o, a, h, l ];
        }, Ks.prototype.toGeoJSON = function(t, i, e) {
            var n, r, s = this.extent * Math.pow(2, e), o = this.extent * t, h = this.extent * i, a = this.loadGeometry(), l = Ks.types[this.type];
            function u(t) {
                for (var i = 0; i < t.length; i++) {
                    var e = t[i], n = 180 - 360 * (e.y + h) / s;
                    t[i] = [ 360 * (e.x + o) / s - 180, 360 / Math.PI * Math.atan(Math.exp(n * Math.PI / 180)) - 90 ];
                }
            }
            switch (this.type) {
              case 1:
                var c = [];
                for (n = 0; n < a.length; n++) c[n] = a[n][0];
                u(a = c);
                break;

              case 2:
                for (n = 0; n < a.length; n++) u(a[n]);
                break;

              case 3:
                for (a = function(t) {
                    var i = t.length;
                    if (i <= 1) return [ t ];
                    for (var e, n, r = [], s = 0; s < i; s++) {
                        var o = to(t[s]);
                        0 !== o && (void 0 === n && (n = o < 0), n === o < 0 ? (e && r.push(e), e = [ t[s] ]) : e.push(t[s]));
                    }
                    e && r.push(e);
                    return r;
                }(a), n = 0; n < a.length; n++) for (r = 0; r < a[n].length; r++) u(a[n][r]);
            }
            1 === a.length ? a = a[0] : l = "Multi" + l;
            var f = {
                type: "Feature",
                geometry: {
                    type: l,
                    coordinates: a
                },
                properties: this.properties
            };
            return "id" in this && (f.id = this.id), f;
        };
        var io = Ys, eo = no;
        function no(t, i) {
            this.version = 1, this.name = null, this.extent = 4096, this.length = 0, this.At = t, 
            this._t = [], this.St = [], this.Pt = [], t.readFields(ro, this, i), this.length = this.Pt.length;
        }
        function ro(t, i, e) {
            15 === t ? i.version = e.readVarint() : 1 === t ? i.name = e.readString() : 5 === t ? i.extent = e.readVarint() : 2 === t ? i.Pt.push(e.pos) : 3 === t ? i._t.push(e.readString()) : 4 === t && i.St.push(function(t) {
                var i = null, e = t.readVarint() + t.pos;
                for (;t.pos < e; ) {
                    var n = t.readVarint() >> 3;
                    i = 1 === n ? t.readString() : 2 === n ? t.readFloat() : 3 === n ? t.readDouble() : 4 === n ? t.readVarint64() : 5 === n ? t.readVarint() : 6 === n ? t.readSVarint() : 7 === n ? t.readBoolean() : null;
                }
                return i;
            }(e));
        }
        no.prototype.feature = function(t) {
            if (t < 0 || t >= this.Pt.length) throw new Error("feature index out of bounds");
            this.At.pos = this.Pt[t];
            var i = this.At.readVarint() + this.At.pos;
            return new io(this.At, i, this.extent, this._t, this.St);
        };
        var so = eo;
        function oo(t, i, e) {
            if (3 === t) {
                var n = new so(e, e.readVarint() + e.pos);
                n.length && (i[n.name] = n);
            }
        }
        var ho = function(t, i) {
            this.layers = t.readFields(oo, {}, i);
        };
        class ao extends vs {
            constructor(t, i, e, n, r, s) {
                super(t, i, e, n, r), i = i || {}, s();
            }
            getTileFeatures(t, i) {
                const e = t.url;
                return R.getArrayBuffer(e, (t, e) => {
                    if (t) return void i(t);
                    const n = new ho(new Is(e.data)), r = [];
                    if (!n.layers) return void i(null, r, []);
                    const s = {};
                    let o;
                    for (const t in n.layers) if (h = n.layers, a = t, Object.prototype.hasOwnProperty.call(h, a)) {
                        s[t] = {
                            types: {}
                        };
                        const i = s[t].types;
                        for (let e = 0, s = n.layers[t].length; e < s; e++) o = n.layers[t].feature(e), 
                        i[o.type] = 1, r.push({
                            type: o.type,
                            layer: t,
                            geometry: o.loadGeometry(),
                            properties: o.properties,
                            extent: o.extent
                        });
                    }
                    var h, a;
                    for (const t in s) s[t].types = Object.keys(s[t].types).map(t => +t);
                    i(null, r, s, {
                        byteLength: e.data.byteLength
                    });
                });
            }
            abortTile(t, i) {
                const e = this.requests[t];
                delete this.requests[t], e && e.abort && e.abort(), this.vt(t), i();
            }
            onRemove() {
                for (const t in this.requests) this.requests[t].abort();
                this.requests = {};
            }
        }
        let lo = 0;
        const uo = new class {
            constructor(t) {
                this.max = t, this.reset();
            }
            reset() {
                return this.data = {}, this.order = [], this;
            }
            clear() {
                this.reset();
            }
            add(t, i) {
                return this.has(t) ? (this.order.splice(this.order.indexOf(t), 1), this.data[t] = i, 
                this.order.push(t)) : (this.data[t] = i, this.order.push(t), this.order.length > this.max && this.getAndRemove(this.order[0])), 
                this;
            }
            has(t) {
                return t in this.data;
            }
            keys() {
                return this.order;
            }
            getAndRemove(t) {
                if (!this.has(t)) return null;
                const i = this.data[t];
                return delete this.data[t], this.order.splice(this.order.indexOf(t), 1), i;
            }
            get(t) {
                if (!this.has(t)) return null;
                return this.data[t];
            }
            remove(t) {
                return this.has(t) ? (delete this.data[t], this.order.splice(this.order.indexOf(t), 1), 
                this) : this;
            }
            setMaxSize(t) {
                for (this.max = t; this.order.length > this.max; ) this.getAndRemove(this.order[0]);
                return this;
            }
        }(128), co = {};
        class fo {
            constructor(t) {
                this.Ot = {}, this.Ct = {}, this.workerId = t;
            }
            addLayer({actorId: t, mapId: i, layerId: e, params: n}, r) {
                if (this.It(i, e)) return;
                const s = this.Tt(i, e), o = n.type, h = n.options, a = this.send.bind(this, t);
                this.Ot[s] = "GeoJSONVectorTileLayer" === o ? new Os(e, h, a, uo, co, r) : new ao(e, h, a, uo, co, r);
            }
            removeLayer({mapId: t, layerId: i}, e) {
                const n = this.It(t, i), r = this.Tt(t, i);
                delete this.Ot[r], n && (n.onRemove(e), this.Dt());
            }
            loadTile({mapId: t, layerId: i, params: e}, n) {
                const r = this.It(t, i);
                r && r.loadTile(e, n);
            }
            abortTile({mapId: t, layerId: i, params: e}, n) {
                const r = this.It(t, i);
                r && r.abortTile && r.abortTile(e.url, n);
            }
            removeTile({mapId: t, layerId: i, params: e}, n) {
                const r = this.It(t, i);
                r && r.removeTile(e, n);
            }
            updateStyle({mapId: t, layerId: i, params: e}, n) {
                const r = this.It(t, i);
                r && (r.updateStyle(e, n), this.Dt());
            }
            updateOptions({mapId: t, layerId: i, params: e}, n) {
                const r = this.It(t, i);
                r && (r.updateOptions(e, n), this.Dt());
            }
            setData({mapId: t, layerId: i, params: e}, n) {
                const r = this.It(t, i);
                r && (r.setData(e.data, n), this.Dt());
            }
            receive(t) {
                const i = t.callback, e = this.Ct[i];
                delete this.Ct[i], e && t.error ? e(new Error(t.error)) : e && e(null, t.data);
            }
            send(t, i, e, n, r) {
                const s = r ? `${t}-${lo++}` : null;
                r && (this.Ct[s] = r), postMessage({
                    type: "<request>",
                    workerId: this.workerId,
                    actorId: t,
                    command: i,
                    params: e,
                    callback: String(s)
                }, n || []);
            }
            Tt(t, i) {
                return `${t}-${i}`;
            }
            It(t, i) {
                const e = this.Tt(t, i);
                return this.Ot[e];
            }
            Dt() {
                const t = Object.keys(co);
                for (let i = 0; i < t.length; i++) delete co[t[i]];
                uo.reset();
            }
        }
        t.initialize = function() {}, t.onmessage = function(t, i) {
            const e = t.data;
            this.dispatcher || (this.dispatcher = new fo(t.workerId)), "<response>" === t.type ? this.dispatcher.workerId === t.workerId && this.dispatcher.receive(t) : this.dispatcher[e.command]({
                actorId: t.actorId,
                mapId: e.mapId,
                layerId: e.layerId,
                params: e.params
            }, (t, e, n) => {
                i(t, e, n);
            });
        }, Object.defineProperty(t, "t", {
            value: !0
        });
    })), r(0, (function(t, i, e) {
        function n(t) {
            if (t && t.t) return t;
            var i = Object.create(null);
            return t && Object.keys(t).forEach((function(e) {
                if ("default" !== e) {
                    var n = Object.getOwnPropertyDescriptor(t, e);
                    Object.defineProperty(i, e, n.get ? n : {
                        enumerable: !0,
                        get: function() {
                            return t[e];
                        }
                    });
                }
            })), i.default = t, Object.freeze(i);
        }
        var r = n(i);
        /*!
          Feature Filter by

          (c) mapbox 2016 and maptalks 2018
          www.mapbox.com | www.maptalks.org
          License: MIT, header required.
      */
        const s = [ "Unknown", "Point", "LineString", "Polygon", "MultiPoint", "MultiLineString", "MultiPolygon", "GeometryCollection" ];
        function o(t) {
            return new Function("f", "var p = (f && f.properties || {}); return " + h(t));
        }
        function h(t) {
            if (!t) return "true";
            const i = t[0];
            if (t.length <= 1) return "any" === i ? "false" : "true";
            return `(${"==" === i ? l(t[1], t[2], "===", !1) : "!=" === i ? l(t[1], t[2], "!==", !1) : "<" === i || ">" === i || "<=" === i || ">=" === i ? l(t[1], t[2], i, !0) : "any" === i ? u(t.slice(1), "||") : "all" === i ? u(t.slice(1), "&&") : "none" === i ? d(u(t.slice(1), "||")) : "in" === i ? c(t[1], t.slice(2)) : "!in" === i ? d(c(t[1], t.slice(2))) : "has" === i ? f(t[1]) : "!has" === i ? d(f(t[1])) : "true"})`;
        }
        function a(t) {
            return "$" === t[0] ? "f." + t.substring(1) : "p[" + JSON.stringify(t) + "]";
        }
        function l(t, i, e, n) {
            const r = a(t), o = "$type" === t ? s.indexOf(i) : JSON.stringify(i);
            return (n ? `typeof ${r}=== typeof ${o}&&` : "") + r + e + o;
        }
        function u(t, i) {
            return t.map(h).join(i);
        }
        function c(t, i) {
            "$type" === t && (i = i.map(t => s.indexOf(t)));
            const e = JSON.stringify(i.sort(y)), n = a(t);
            return i.length <= 200 ? `${e}.indexOf(${n}) !== -1` : `function(v, a, i, j) {\n        while (i <= j) { var m = (i + j) >> 1;\n            if (a[m] === v) return true; if (a[m] > v) j = m - 1; else i = m + 1;\n        }\n    return false; }(${n}, ${e},0,${i.length - 1})`;
        }
        function f(t) {
            return "$id" === t ? '"id" in f' : JSON.stringify(t) + " in p";
        }
        function d(t) {
            return `!(${t})`;
        }
        function y(t, i) {
            return t < i ? -1 : t > i ? 1 : 0;
        }
        function p(t) {
            for (let i = 1; i < arguments.length; i++) {
                const e = arguments[i];
                for (const i in e) t[i] = e[i];
            }
            return t;
        }
        function m(t, i) {
            for (let e = 0; e < t.stops.length; e++) if (i === t.stops[e][0]) return t.stops[e][1];
            return t.default;
        }
        function v(t, i) {
            for (var e = 0; e < t.stops.length && !(i < t.stops[e][0]); e++) ;
            return t.stops[Math.max(e - 1, 0)][1];
        }
        function g(t, i) {
            for (var e = void 0 !== t.base ? t.base : 1, n = 0; !(n >= t.stops.length || i <= t.stops[n][0]); ) n++;
            return 0 === n ? t.stops[n][1] : n === t.stops.length ? t.stops[n - 1][1] : function t(i, e, n, r, s, o) {
                return "function" == typeof s ? function() {
                    var h = s.apply(void 0, arguments), a = o.apply(void 0, arguments);
                    return t(i, e, n, r, h, a);
                } : s.length ? function(t, i, e, n, r, s) {
                    var o = [];
                    for (let h = 0; h < r.length; h++) o[h] = b(t, i, e, n, r[h], s[h]);
                    return o;
                }(i, e, n, r, s, o) : b(i, e, n, r, s, o);
            }(i, e, t.stops[n - 1][0], t.stops[n][0], t.stops[n - 1][1], t.stops[n][1]);
        }
        function w(t, i) {
            return e = i, n = t.default, void 0 !== e ? e : void 0 !== n ? n : void 0 !== r ? r : null;
            var e, n, r;
        }
        function b(t, i, e, n, r, s) {
            var o, h = n - e, a = t - e;
            return r * (1 - (o = 1 === i ? a / h : (Math.pow(i, a) - 1) / (Math.pow(i, h) - 1))) + s * o;
        }
        function M(t) {
            return t && "object" == typeof t && (t.stops || t.property && "identity" === t.type);
        }
        function x(t) {
            return A(t, "exponential");
        }
        function F(t, i) {
            if (!t) return null;
            var e = !1;
            if (Array.isArray(t)) {
                var n, r = [];
                for (let s = 0; s < t.length; s++) (n = F(t[s], i)) ? (r.push(n), e = !0) : r.push(t[s]);
                return e ? r : t;
            }
            var s, o = {
                __fn_types_loaded: !0
            }, h = [];
            for (s in t) t.hasOwnProperty(s) && h.push(s);
            const a = function(t) {
                Object.defineProperty(o, t, {
                    get: function() {
                        return this["__fn_" + t] || (this["__fn_" + t] = x(this["_" + t])), this["__fn_" + t].apply(this, i());
                    },
                    set: function(i) {
                        this["_" + t] = i;
                    },
                    configurable: !0,
                    enumerable: !0
                });
            };
            for (let i = 0, n = h.length; i < n; i++) M(t[s = h[i]]) ? (e = !0, o["_" + s] = t[s], 
            a(s)) : o[s] = t[s];
            return e ? o : t;
        }
        function A(t, i) {
            if (!M(t)) return function() {
                return t;
            };
            let e = !0, n = !0;
            const r = (t = JSON.parse(JSON.stringify(t))).stops;
            if (r) for (let t = 0; t < r.length; t++) if (M(r[t][1])) {
                const s = A(r[t][1], i);
                e = e && s.isZoomConstant, n = n && s.isFeatureConstant, r[t] = [ r[t][0], s ];
            }
            const s = function t(i, e) {
                var n, r, s;
                if (M(i)) {
                    var o, h = i.stops && "object" == typeof i.stops[0][0], a = h || void 0 !== i.property, l = h || !a, u = i.type || e || "exponential";
                    if ("exponential" === u) o = g; else if ("interval" === u) o = v; else if ("categorical" === u) o = m; else {
                        if ("identity" !== u) throw new Error('Unknown function type "' + u + '"');
                        o = w;
                    }
                    if (h) {
                        var c = {}, f = [];
                        for (let t = 0; t < i.stops.length; t++) {
                            var d = i.stops[t];
                            void 0 === c[d[0].zoom] && (c[d[0].zoom] = {
                                zoom: d[0].zoom,
                                type: i.type,
                                property: i.property,
                                default: i.default,
                                stops: []
                            }), c[d[0].zoom].stops.push([ d[0].value, d[1] ]);
                        }
                        for (let i in c) f.push([ c[i].zoom, t(c[i]) ]);
                        n = function(t, e) {
                            const n = g({
                                stops: f,
                                base: i.base
                            }, t)(t, e);
                            return "function" == typeof n ? n(t, e) : n;
                        }, r = !1, s = !1;
                    } else l ? (n = function(t) {
                        const e = o(i, t);
                        return "function" == typeof e ? e(t) : e;
                    }, r = !0, s = !1) : (n = function(t, e) {
                        const n = o(i, e ? e[i.property] : null);
                        return "function" == typeof n ? n(t, e) : n;
                    }, r = !1, s = !0);
                } else n = function() {
                    return i;
                }, r = !0, s = !0;
                return n.isZoomConstant = s, n.isFeatureConstant = r, n;
            }(t, i);
            return s.isZoomConstant = e && s.isZoomConstant, s.isFeatureConstant = n && s.isFeatureConstant, 
            s;
        }
        let k = 0;
        const _ = "function" == typeof Object.assign;
        function S(t, ...i) {
            if (_) return Object.assign(t, ...i), t;
            for (let e = 0; e < i.length; e++) {
                const n = i[e];
                for (const i in n) t[i] = n[i];
            }
            return t;
        }
        function P(t) {
            return !I(t) && ("string" == typeof t || null !== t.constructor && t.constructor === String);
        }
        function O(t) {
            return "number" == typeof t && !isNaN(t);
        }
        function C(t) {
            return !I(t) && ("function" == typeof t || null !== t.constructor && t.constructor === Function);
        }
        function I(t) {
            return null == t;
        }
        function T(t) {
            for (let i = 1; i < arguments.length; i++) {
                const e = arguments[i];
                if (e) for (let i = 0, n = e.length; i < n; i++) t.push(e[i]);
            }
            return t.length;
        }
        function D(t) {
            const i = {};
            for (const e in t) void 0 !== t[e] && null !== t[e] && (t[e].toJSON ? i[e] = t[e].toJSON() : i[e] = t[e]);
            return i;
        }
        function L(t) {
            return function t(i) {
                if (!Array.isArray(i)) return t([ i ]);
                const e = [];
                for (let t = 0; t < i.length; t++) {
                    let n;
                    n = !0 === i[t].filter ? function() {
                        return !0;
                    } : o(i[t].filter), e.push(p({}, i[t], {
                        filter: n
                    }));
                }
                return e;
            }(t = t.map(t => {
                const i = S({}, t);
                return i.filter && i.filter.value && (i.filter = i.filter.value), i;
            }));
        }
        function U(t, i) {
            return Object.prototype.hasOwnProperty.call(t, i);
        }
        "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self && self;
        var E = j;
        function j(t, i) {
            this.x = t, this.y = i;
        }
        j.prototype = {
            clone: function() {
                return new j(this.x, this.y);
            },
            add: function(t) {
                return this.clone().m(t);
            },
            sub: function(t) {
                return this.clone().M(t);
            },
            multByPoint: function(t) {
                return this.clone().F(t);
            },
            divByPoint: function(t) {
                return this.clone().A(t);
            },
            mult: function(t) {
                return this.clone().k(t);
            },
            div: function(t) {
                return this.clone().S(t);
            },
            rotate: function(t) {
                return this.clone().P(t);
            },
            rotateAround: function(t, i) {
                return this.clone().O(t, i);
            },
            matMult: function(t) {
                return this.clone().C(t);
            },
            unit: function() {
                return this.clone().I();
            },
            perp: function() {
                return this.clone().T();
            },
            round: function() {
                return this.clone().D();
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
                var i = t.x - this.x, e = t.y - this.y;
                return i * i + e * e;
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
            angleWithSep: function(t, i) {
                return Math.atan2(this.x * i - this.y * t, this.x * t + this.y * i);
            },
            C: function(t) {
                var i = t[0] * this.x + t[1] * this.y, e = t[2] * this.x + t[3] * this.y;
                return this.x = i, this.y = e, this;
            },
            m: function(t) {
                return this.x += t.x, this.y += t.y, this;
            },
            M: function(t) {
                return this.x -= t.x, this.y -= t.y, this;
            },
            k: function(t) {
                return this.x *= t, this.y *= t, this;
            },
            S: function(t) {
                return this.x /= t, this.y /= t, this;
            },
            F: function(t) {
                return this.x *= t.x, this.y *= t.y, this;
            },
            A: function(t) {
                return this.x /= t.x, this.y /= t.y, this;
            },
            I: function() {
                return this.S(this.mag()), this;
            },
            T: function() {
                var t = this.y;
                return this.y = this.x, this.x = -t, this;
            },
            P: function(t) {
                var i = Math.cos(t), e = Math.sin(t), n = i * this.x - e * this.y, r = e * this.x + i * this.y;
                return this.x = n, this.y = r, this;
            },
            O: function(t, i) {
                var e = Math.cos(t), n = Math.sin(t), r = i.x + e * (this.x - i.x) - n * (this.y - i.y), s = i.y + n * (this.x - i.x) + e * (this.y - i.y);
                return this.x = r, this.y = s, this;
            },
            D: function() {
                return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
            }
        }, j.convert = function(t) {
            return t instanceof j ? t : Array.isArray(t) ? new j(t[0], t[1]) : t;
        };
        const R = {
            Point: 1,
            LineString: 2,
            Polygon: 3,
            MultiPoint: 4,
            MultiLineString: 5,
            MultiPolygon: 6
        };
        function z(t, i = {}) {
            var e = [];
            if ("FeatureCollection" === t.type) for (var n = 0; n < t.features.length; n++) N(e, t.features[n], i, n); else "Feature" === t.type ? N(e, t, i) : N(e, {
                geometry: t
            }, i);
            return e;
        }
        function N(t, i, e, n) {
            if (i.geometry && i.geometry.geometry) {
                var r = i.geometry.coordinates, s = i.geometry.type, o = [], h = i.id;
                if (e.promoteId ? h = i.properties[e.promoteId] : e.generateId && (h = n || 0), 
                "Point" === s) W(r, o); else if ("MultiPoint" === s) for (var a = 0; a < r.length; a++) W(r[a], o); else if ("LineString" === s) V([ r ], o); else if ("MultiLineString" === s) {
                    if (e.lineMetrics) {
                        for (a = 0; a < r.length; a++) o = [], H(r[a], o), t.push($(h, "LineString", o, i.properties));
                        return;
                    }
                    V(r, o);
                } else if ("Polygon" === s) V(r, o); else {
                    if ("MultiPolygon" !== s) {
                        if ("GeometryCollection" === s) {
                            for (a = 0; a < i.geometry.geometries.length; a++) N(t, {
                                id: h,
                                geometry: i.geometry.geometries[a],
                                properties: i.properties
                            }, e, n);
                            return;
                        }
                        throw new Error("Input data is not a valid GeoJSON object.");
                    }
                    for (a = 0; a < r.length; a++) {
                        var l = [];
                        V(r[a], l), o.push(l);
                    }
                }
                t.push($(h, s, o, i.properties));
            }
        }
        function W(t, i) {
            i.push([ new E(t[0], t[1]) ]);
        }
        function H(t, i) {
            for (var e = 0; e < t.length; e++) {
                var n = t[e][0], r = t[e][1];
                i.push(new E(n, r));
            }
        }
        function V(t, i, e, n) {
            for (var r = 0; r < t.length; r++) {
                var s = [];
                H(t[r], s), i.push(s);
            }
        }
        function $(t, i, e, n) {
            return {
                id: void 0 === t ? null : t,
                type: R[i],
                geometry: e,
                properties: n
            };
        }
        function G(t, i, e) {
            e = e || {}, this.w = t || 64, this.h = i || 64, this.autoResize = !!e.autoResize, 
            this.shelves = [], this.freebins = [], this.stats = {}, this.bins = {}, this.maxId = 0;
        }
        function J(t, i, e) {
            this.x = 0, this.y = t, this.w = this.free = i, this.h = e;
        }
        function q(t, i, e, n, r, s, o) {
            this.id = t, this.x = i, this.y = e, this.w = n, this.h = r, this.maxw = s || n, 
            this.maxh = o || r, this.refcount = 0;
        }
        /*!
       * Codes from mapbox-gl-js
       * github.com/mapbox/mapbox-gl-js
       * MIT License
       */        function B(t, {width: i, height: e}, n, r) {
            if (r) {
                if (r.length !== i * e * n) throw new RangeError("mismatched image size");
            } else r = new Uint8Array(i * e * n);
            return t.width = i, t.height = e, t.data = r, t;
        }
        function X(t, {width: i, height: e}, n) {
            if (i === t.width && e === t.height) return;
            const r = B({}, {
                width: i,
                height: e
            }, n);
            Z(t, r, {
                x: 0,
                y: 0
            }, {
                x: 0,
                y: 0
            }, {
                width: Math.min(t.width, i),
                height: Math.min(t.height, e)
            }, n), t.width = i, t.height = e, t.data = r.data;
        }
        function Z(t, i, e, n, r, s) {
            if (0 === r.width || 0 === r.height) return i;
            if (r.width > t.width || r.height > t.height || e.x > t.width - r.width || e.y > t.height - r.height) throw new RangeError("out of range source coordinates for image copy");
            if (r.width > i.width || r.height > i.height || n.x > i.width - r.width || n.y > i.height - r.height) throw new RangeError("out of range destination coordinates for image copy");
            const o = t.data, h = i.data;
            if (o === h) return i;
            for (let a = 0; a < r.height; a++) {
                const l = ((e.y + a) * t.width + e.x) * s, u = ((n.y + a) * i.width + n.x) * s;
                for (let t = 0; t < r.width * s; t++) h[u + t] = o[l + t];
            }
            return i;
        }
        G.prototype.pack = function(t, i) {
            t = [].concat(t), i = i || {};
            for (var e, n, r, s, o = [], h = 0; h < t.length; h++) if (e = t[h].w || t[h].width, 
            n = t[h].h || t[h].height, r = t[h].id, e && n) {
                if (!(s = this.packOne(e, n, r))) continue;
                i.inPlace && (t[h].x = s.x, t[h].y = s.y, t[h].id = s.id), o.push(s);
            }
            return this.shrink(), o;
        }, G.prototype.packOne = function(t, i, e) {
            var n, r, s, o, h, a, l, u, c = {
                freebin: -1,
                shelf: -1,
                waste: 1 / 0
            }, f = 0;
            if ("string" == typeof e || "number" == typeof e) {
                if (n = this.getBin(e)) return this.ref(n), n;
                "number" == typeof e && (this.maxId = Math.max(e, this.maxId));
            } else e = ++this.maxId;
            for (o = 0; o < this.freebins.length; o++) {
                if (i === (n = this.freebins[o]).maxh && t === n.maxw) return this.allocFreebin(o, t, i, e);
                i > n.maxh || t > n.maxw || i <= n.maxh && t <= n.maxw && (s = n.maxw * n.maxh - t * i) < c.waste && (c.waste = s, 
                c.freebin = o);
            }
            for (o = 0; o < this.shelves.length; o++) if (f += (r = this.shelves[o]).h, !(t > r.free)) {
                if (i === r.h) return this.allocShelf(o, t, i, e);
                i > r.h || i < r.h && (s = (r.h - i) * t) < c.waste && (c.freebin = -1, c.waste = s, 
                c.shelf = o);
            }
            return -1 !== c.freebin ? this.allocFreebin(c.freebin, t, i, e) : -1 !== c.shelf ? this.allocShelf(c.shelf, t, i, e) : i <= this.h - f && t <= this.w ? (r = new J(f, this.w, i), 
            this.allocShelf(this.shelves.push(r) - 1, t, i, e)) : this.autoResize ? (h = a = this.h, 
            ((l = u = this.w) <= h || t > l) && (u = 2 * Math.max(t, l)), (h < l || i > h) && (a = 2 * Math.max(i, h)), 
            this.resize(u, a), this.packOne(t, i, e)) : null;
        }, G.prototype.allocFreebin = function(t, i, e, n) {
            var r = this.freebins.splice(t, 1)[0];
            return r.id = n, r.w = i, r.h = e, r.refcount = 0, this.bins[n] = r, this.ref(r), 
            r;
        }, G.prototype.allocShelf = function(t, i, e, n) {
            var r = this.shelves[t].alloc(i, e, n);
            return this.bins[n] = r, this.ref(r), r;
        }, G.prototype.shrink = function() {
            if (this.shelves.length > 0) {
                for (var t = 0, i = 0, e = 0; e < this.shelves.length; e++) {
                    var n = this.shelves[e];
                    i += n.h, t = Math.max(n.w - n.free, t);
                }
                this.resize(t, i);
            }
        }, G.prototype.getBin = function(t) {
            return this.bins[t];
        }, G.prototype.ref = function(t) {
            if (1 == ++t.refcount) {
                var i = t.h;
                this.stats[i] = 1 + (0 | this.stats[i]);
            }
            return t.refcount;
        }, G.prototype.unref = function(t) {
            return 0 === t.refcount ? 0 : (0 == --t.refcount && (this.stats[t.h]--, delete this.bins[t.id], 
            this.freebins.push(t)), t.refcount);
        }, G.prototype.clear = function() {
            this.shelves = [], this.freebins = [], this.stats = {}, this.bins = {}, this.maxId = 0;
        }, G.prototype.resize = function(t, i) {
            this.w = t, this.h = i;
            for (var e = 0; e < this.shelves.length; e++) this.shelves[e].resize(t);
            return !0;
        }, J.prototype.alloc = function(t, i, e) {
            if (t > this.free || i > this.h) return null;
            var n = this.x;
            return this.x += t, this.free -= t, new q(e, n, this.y, t, i, t, this.h);
        }, J.prototype.resize = function(t) {
            return this.free += t - this.w, this.w = t, !0;
        };
        class Y {
            constructor(t, i) {
                B(this, t, 1, i);
            }
            resize(t) {
                X(this, t, 1);
            }
            clone() {
                return new Y({
                    width: this.width,
                    height: this.height
                }, new Uint8Array(this.data));
            }
            static copy(t, i, e, n, r) {
                Z(t, i, e, n, r, 1);
            }
        }
        class K {
            constructor(t, i) {
                B(this, t, 4, i);
            }
            resize(t) {
                X(this, t, 4);
            }
            clone() {
                return new K({
                    width: this.width,
                    height: this.height
                }, new Uint8Array(this.data));
            }
            static copy(t, i, e, n, r) {
                Z(t, i, e, n, r, 4);
            }
        }
        /*!
       * Codes from mapbox-gl-js
       * github.com/mapbox/mapbox-gl-js
       * MIT License
       */        class Q {
            constructor(t, {pixelRatio: i}) {
                this.paddedRect = t, this.pixelRatio = i || 1;
            }
            get tl() {
                return [ this.paddedRect.x + 1, this.paddedRect.y + 1 ];
            }
            get br() {
                return [ this.paddedRect.x + this.paddedRect.w - 1, this.paddedRect.y + this.paddedRect.h - 1 ];
            }
            get displaySize() {
                return [ (this.paddedRect.w - 2) / this.pixelRatio, (this.paddedRect.h - 2) / this.pixelRatio ];
            }
        }
        class tt {
            constructor(t) {
                this.glyphMap = t, this.build();
            }
            build() {
                const t = this.glyphMap, i = {}, e = new G(0, 0, {
                    autoResize: !0
                }), n = [];
                for (const e in t) {
                    const r = t[e], s = {
                        x: 0,
                        y: 0,
                        w: r.data.width + 2,
                        h: r.data.height + 2
                    };
                    n.push(s), i[e] = new Q(s, r);
                }
                if (e.pack(n, {
                    inPlace: !0
                }), !it(e.w) || !it(e.h)) {
                    const t = et(e.w), i = et(e.h);
                    e.resize(t, i);
                }
                const r = new K({
                    width: e.w,
                    height: e.h
                });
                for (const e in t) {
                    const n = t[e], s = i[e].paddedRect;
                    K.copy(n.data, r, {
                        x: 0,
                        y: 0
                    }, {
                        x: s.x + 1,
                        y: s.y + 1
                    }, n.data);
                }
                this.image = r, this.positions = i;
            }
        }
        function it(t) {
            return 0 == (t & t - 1) && 0 !== t;
        }
        function et(t) {
            return Math.pow(2, Math.ceil(Math.log(t) / Math.LN2));
        }
        /*!
       * Codes from mapbox-gl-js
       * github.com/mapbox/mapbox-gl-js
       * MIT License
       * TODO 升级为potpack
       */        class nt {
            constructor(t) {
                this.glyphMap = t, this.build();
            }
            build() {
                const t = this.glyphMap, i = {}, e = new G(0, 0, {
                    autoResize: !0
                }), n = [];
                for (const e in t) {
                    const r = t[e], s = i[e] = {};
                    for (const t in r) {
                        const i = r[+t];
                        if (!i || 0 === i.bitmap.width || 0 === i.bitmap.height) continue;
                        const e = {
                            x: 0,
                            y: 0,
                            w: i.bitmap.width + 2,
                            h: i.bitmap.height + 2
                        };
                        n.push(e), s[t] = {
                            rect: e,
                            metrics: i.metrics
                        };
                    }
                }
                e.pack(n, {
                    inPlace: !0
                });
                const r = new Y({
                    width: e.w,
                    height: e.h
                });
                for (const e in t) {
                    const n = t[e];
                    for (const t in n) {
                        const s = n[+t];
                        if (!s || 0 === s.bitmap.width || 0 === s.bitmap.height) continue;
                        const o = i[e][t].rect;
                        Y.copy(s.bitmap, r, {
                            x: 0,
                            y: 0
                        }, {
                            x: o.x + 1,
                            y: o.y + 1
                        }, s.bitmap);
                    }
                }
                this.image = r, this.positions = i;
            }
        }
        function rt(t) {
            return t < 65536 ? Uint16Array : Uint32Array;
        }
        function st(t) {
            return (t = Math.abs(t)) < 128 ? Int8Array : t < 32768 ? Int16Array : Float32Array;
        }
        function ot(t) {
            return t < 256 ? Uint8Array : t < 65536 ? Uint16Array : Float32Array;
        }
        function ht(t) {
            const i = t.type, e = [];
            if (1 === i || 4 === i) for (let i = 0; i < t.geometry.length; i++) W(t.geometry[i], e); else if (2 === i) V(t.geometry, e); else if (3 === i) V(t.geometry, e); else if (5 === i) V(t.geometry, e); else if (6 === i) for (let i = 0; i < t.geometry.length; i++) {
                const n = [];
                V(t.geometry[i], n), e.push(n);
            }
            return t.geometry = e, t;
        }
        function at(t) {
            for (let i = 1; i < arguments.length; i++) {
                const e = arguments[i];
                for (const i in e) t[i] = e[i];
            }
            return t;
        }
        function lt(t) {
            return null == t;
        }
        function ut(t) {
            return "number" == typeof t && !isNaN(t);
        }
        function ct(t) {
            return "object" == typeof t && !!t;
        }
        function ft(t) {
            return !lt(t) && ("string" == typeof t || null !== t.constructor && t.constructor === String);
        }
        const dt = Object.prototype.hasOwnProperty;
        function yt(t, i) {
            return dt.call(t, i);
        }
        function pt(t, i) {
            return M(i[t]) && i[t].property;
        }
        function mt(t) {
            let i = 0;
            for (let e, n, r = 0, s = t.length, o = s - 1; r < s; o = r++) e = t[r], n = t[o], 
            void 0 !== e.x ? i += (n.x - e.x) * (e.y + n.y) : i += (n[0] - e[0]) * (e[1] + n[1]);
            return i;
        }
        function vt(t, i, e) {
            let n = e;
            return i && t && (n = t[i]), void 0 === n && (n = e), 10 * (n || 0);
        }
        function gt(t, i) {
            return i < 1 / 0 && (t.x < 0 || t.x > i || t.y < 0 || t.y > i);
        }
        function wt(t) {
            return null == t;
        }
        function bt(t, i, e) {
            if (t === e || t === i) return t;
            const n = e - i;
            return ((t - i) % n + n) % n + i;
        }
        class Mt {
            constructor(t, i, e, n) {
                this.feature = t, this.symbol = i, this.fnTypes = e, this.options = n;
            }
            getPolygonResource() {
                let t = this.symbol.polygonPatternFile;
                const {polygonPatternFileFn: i} = this.fnTypes, e = i;
                return this.L(t, e);
            }
            getLineResource() {
                let t = this.symbol.linePatternFile;
                const {linePatternFileFn: i} = this.fnTypes, e = i;
                return this.L(t, e);
            }
            L(t, i) {
                if (i) {
                    const e = this.feature.properties;
                    t = i(this.options.zoom, e);
                }
                return t;
            }
        }
        const xt = {
            lineWidth: 1,
            lineStrokeWidth: 1,
            lineDx: 1,
            lineDy: 1,
            lineOpacity: 1,
            linePatternAnimSpeed: 1,
            markerWidth: 1,
            markerHeight: 1,
            markerDx: 1,
            markerDy: 1,
            markerSpacing: 1,
            markerOpacity: 1,
            markerRotation: 1,
            textWrapWidth: 1,
            textSpacing: 1,
            textSize: 1,
            textHaloRadius: 1,
            textHaloOpacity: 1,
            textDx: 1,
            textDy: 1,
            textOpacity: 1,
            textRotation: 1,
            polygonOpacity: 1
        };
        class Ft {
            static isAtlasLoaded(t, i = {}) {
                const {iconAtlas: e} = i;
                return !!(!t || e && e.positions[t]);
            }
            static genFnTypes(t) {
                const i = {};
                for (const e in t) pt(e, t) && (i[e + "Fn"] = xt[e] ? x(t[e]) : A(t[e], "interval"));
                return i;
            }
            constructor(t, i, e) {
                this.options = e, this.features = this.U(t), this.symbolDef = i, this.symbol = F(i, () => [ e.zoom ]), 
                this.styledVectors = [], this.properties = {}, this.j = Ft.genFnTypes(this.symbolDef), 
                pt("visible", this.symbolDef) && (this.R = x(this.symbolDef.visible)), e.atlas && (this.iconAtlas = e.atlas.iconAtlas, 
                this.glyphAtlas = e.atlas.glyphAtlas);
            }
            U(t) {
                if (!t.length) return t;
                const i = "__fea_idx".trim();
                let e, n = 0, r = t[n];
                for (;!r.geometry; ) n++, r = t[n];
                if (Array.isArray(r.geometry) && r.properties) {
                    let i = r.geometry[0];
                    for (;Array.isArray(i); ) i = i[0];
                    i instanceof E && (e = t);
                }
                if (!e) if (e = [], Array.isArray(r.geometry)) for (let i = 0; i < t.length; i++) {
                    const n = at({}, t[i]);
                    e.push(ht(n));
                } else for (let n = 0; n < t.length; n++) {
                    const r = t[n], s = z(r);
                    for (let t = 0; t < s.length; t++) {
                        const n = s[t];
                        n[i] = r[i], e.push(n);
                    }
                }
                const s = this.options.order;
                if (s) {
                    const t = [];
                    for (let i = 0; i < s.length; i++) s[i] && t.push(o(s[i]));
                    e = e.sort((i, e) => {
                        const n = t.length;
                        let r = n, s = n;
                        for (let o = 0; o < n && (t[o](i) && (r = o), t[o](e) && (s = o), !(r < n && s < n)); o++) ;
                        return r - s;
                    });
                }
                return e;
            }
            load(t = 1) {
                const i = "__fea_idx".trim(), e = this.j, n = this.styledVectors;
                this.count = 0;
                const r = this.features;
                if (!r || !r.length) return Promise.resolve(null);
                const s = {}, o = {}, h = {
                    zoom: this.options.zoom
                }, a = F(this.symbolDef, () => [ h.zoom ]);
                let l = 0, u = r.length;
                const c = this.options.debugIndex;
                for (;l < u; l++) {
                    const t = r[l];
                    if (!t || !t.geometry) continue;
                    if (void 0 !== c && t._debug_info.index !== c) continue;
                    t.properties || (t.properties = {}), t.properties.$layer = t.layer, t.properties.$type = t.type;
                    const u = this.createStyledVector(t, a, e, h, s, o);
                    u && u.feature.geometry && (u.featureIdx = void 0 === t[i] ? l : t[i], this.count++, 
                    n.push(u));
                }
                return this.options.atlas ? Promise.resolve(this.pack(t)) : this.loadAtlas(s, o).then(() => this.pack(t));
            }
            loadAtlas(t, i) {
                return new Promise((e, n) => {
                    this.fetchAtlas(t, i, (t, i) => {
                        if (t) n(t); else {
                            if (i) {
                                const {icons: t, glyphs: e} = i;
                                if (t && Object.keys(t).length) {
                                    for (const i in t) {
                                        const e = t[i], {width: n, height: r, data: s} = e.data;
                                        e.data = new K({
                                            width: n,
                                            height: r
                                        }, s);
                                    }
                                    this.iconAtlas = new tt(t);
                                }
                                if (e && Object.keys(e).length) {
                                    for (const t in e) {
                                        const i = e[t];
                                        for (const t in i) {
                                            const e = i[t], {width: n, height: r, data: s} = e.bitmap;
                                            e.bitmap = new Y({
                                                width: n,
                                                height: r
                                            }, s);
                                        }
                                    }
                                    this.glyphAtlas = new nt(e);
                                }
                            }
                            e({
                                glyphAtlas: this.glyphAtlas,
                                iconAtlas: this.iconAtlas
                            });
                        }
                    });
                });
            }
            fetchAtlas(t, i, e) {
                Object.keys(t).length > 0 || Object.keys(i).length > 0 ? this.options.requestor(t, i, e) : e();
            }
            pack(t) {
                if (!this.count) return null;
                if (null == t) throw new Error("layout scale is undefined");
                const i = this.createDataPack(this.styledVectors, t);
                if (!i) return null;
                i.properties = this.properties, this.empty && (i.empty = !0);
                const e = i.buffers;
                delete i.buffers;
                const n = {
                    data: i,
                    buffers: e
                };
                if (this.iconAtlas) {
                    const t = n.data.iconAtlas = At(this.iconAtlas);
                    if (t.glyphMap) for (const i in t.glyphMap) {
                        const n = t.glyphMap[i];
                        e.push(n.data.data.buffer);
                    }
                    e.push(n.data.iconAtlas.image.data.buffer);
                }
                return this.glyphAtlas && (n.data.glyphAtlas = At(this.glyphAtlas), e.push(n.data.glyphAtlas.image.data.buffer)), 
                n;
            }
            createStyledVector(t, i, e, n) {
                return new Mt(t, i, e, n);
            }
            createDataPack(t, i) {
                if (!t || !t.length) return null;
                this.maxIndex = 0, this.maxPos = 0, this.maxAltitude = 0;
                const e = this.data = {};
                let n = this.elements = [];
                const r = this.getFormat(Array.isArray(t[0]) ? t[0][0].symbol : t[0].symbol);
                for (let t = 0; t < r.length; t++) e[r[t].name] = [];
                let s = [], o = 0;
                const h = [];
                let a = 0, l = !1;
                for (let n = 0, r = t.length; n < r; n++) {
                    if (!t[n].feature.geometry) continue;
                    const r = Array.isArray(t[n]) ? t[n][0].feature.id : t[n].feature.id;
                    ut(r) && (Math.abs(r) > a && (a = Math.abs(r)), r < 0 && (l = !0));
                    const u = this.data.aPosition.length;
                    if (Array.isArray(t[n])) for (let e = 0; e < t[n].length; e++) this.N(t[n][e], i); else this.N(t[n], i);
                    const c = (e.aPosition.length - u) / 3;
                    for (let i = 0; i < c; i++) s.push(t[n].featureIdx), ut(r) && h.push(r);
                    o = Math.max(o, t[n].featureIdx);
                }
                if (this.hasElements() && !n.length) return null;
                s = new (ot(o))(s), this.options.positionType ? r[0].type = this.options.positionType : r[0].type = st(Math.max(this.maxPos, this.maxAltitude));
                const u = this.options.center;
                if (u && (u[0] || u[1])) {
                    const t = e.aPosition;
                    for (let i = 0; i < t.length; i += 3) t[i] -= u[0], t[i + 1] -= u[1];
                }
                const c = function(t, i) {
                    const e = {};
                    for (let n = 0; n < t.length; n++) {
                        const r = t[n], s = r.type, o = r.name;
                        e[o] = s === Array ? i[o] : new s(i[o]);
                    }
                    return e;
                }(r, e);
                c.aPickingId = s;
                const f = [];
                for (const t in c) f.push(c[t].buffer);
                n = new (rt(this.maxIndex))(n), f.push(n.buffer);
                const d = {
                    data: c,
                    indices: this.hasElements() ? n : null,
                    positionSize: 3,
                    //!this.maxAltitude ? 2 : 3,
                    buffers: f,
                    symbolIndex: this.symbolDef.index || {
                        index: 0
                    }
                };
                if (h.length) {
                    const t = l ? st(a) : ot(a);
                    d.featureIds = new t(h), f.push(d.featureIds.buffer);
                } else d.featureIds = [];
                return d;
            }
            N(t, i) {
                const e = t.feature.properties;
                this.R && this.R.isZoomConstant && !this.R(null, e) || this.placeVector(t, i, this.formatWidth);
            }
            addElements(...t) {
                this.maxIndex = Math.max(this.maxIndex, ...t), this.elements.push(...t);
            }
            hasElements() {
                return !0;
            }
            getAltitude(t) {
                const {altitudeProperty: i, defaultAltitude: e, altitudeScale: n} = this.options;
                let r = vt(t, i, e);
                return n && (r *= n), this.maxAltitude = Math.max(this.maxAltitude, Math.abs(r)), 
                r;
            }
            getIconAtlasMaxValue() {
                const t = this.iconAtlas.positions;
                let i = 0;
                for (const e in t) if (yt(t, e)) {
                    const {tl: n, displaySize: r} = t[e], s = Math.max(n[0], n[1], r[0] - 1, r[1] - 1);
                    s > i && (i = s);
                }
                return i;
            }
        }
        function At(t) {
            let i = t.positions, e = t.image && t.image.format || "alpha";
            if (t instanceof tt) {
                i = {};
                for (const e in t.positions) {
                    const n = t.positions[e];
                    i[e] = {
                        paddedRect: n.paddedRect,
                        pixelRatio: n.pixelRatio,
                        tl: n.tl,
                        br: n.br,
                        displaySize: n.displaySize
                    };
                }
                e = "rgba";
            }
            const n = t.image;
            return {
                image: {
                    width: n.width,
                    height: n.height,
                    data: n.data,
                    format: e
                },
                glyphMap: t.glyphMap,
                positions: i
            };
        }
        function kt(t, i, e, n) {
            let r = t.textSize;
            if (lt(i.textSize)) return [ 16, 16 ];
            t.__fn_textSize && (r = t.__fn_textSize);
            const s = [];
            var o;
            return lt(o = r) || "function" != typeof o && (null === o.constructor || o.constructor !== Function) ? s[0] = r : s[0] = r(n, e), 
            s[1] = s[0], s;
        }
        function _t(t) {
            const i = t.stops;
            let e = -1 / 0;
            for (let t = 0; t < i.length; t++) {
                let n = i[t][1];
                ct(i[t][1]) && (n = _t(i[t][1])), n > e && (e = n);
            }
            return e;
        }
        const St = /\{([\w_]+)\}/g;
        function Pt(t, i) {
            return ft(t) ? t.replace(St, (function(t, e) {
                if (!i) return "";
                const n = i[e];
                return lt(n) ? "" : Array.isArray(n) ? n.join() : n;
            })) : t;
        }
        const Ot = t => t >= 128 && t <= 255, Ct = t => t >= 1536 && t <= 1791, It = t => t >= 1872 && t <= 1919, Tt = t => t >= 2208 && t <= 2303, Dt = t => t >= 4352 && t <= 4607, Lt = t => t >= 5120 && t <= 5759, Ut = t => t >= 6320 && t <= 6399, Et = t => t >= 8192 && t <= 8303, jt = t => t >= 8448 && t <= 8527, Rt = t => t >= 8528 && t <= 8591, zt = t => t >= 8960 && t <= 9215, Nt = t => t >= 9216 && t <= 9279, Wt = t => t >= 9280 && t <= 9311, Ht = t => t >= 9312 && t <= 9471, Vt = t => t >= 9632 && t <= 9727, $t = t => t >= 9728 && t <= 9983, Gt = t => t >= 11008 && t <= 11263, Jt = t => t >= 11904 && t <= 12031, qt = t => t >= 12032 && t <= 12255, Bt = t => t >= 12272 && t <= 12287, Xt = t => t >= 12288 && t <= 12351, Zt = t => t >= 12352 && t <= 12447, Yt = t => t >= 12448 && t <= 12543, Kt = t => t >= 12544 && t <= 12591, Qt = t => t >= 12592 && t <= 12687, ti = t => t >= 12688 && t <= 12703, ii = t => t >= 12704 && t <= 12735, ei = t => t >= 12736 && t <= 12783, ni = t => t >= 12784 && t <= 12799, ri = t => t >= 12800 && t <= 13055, si = t => t >= 13056 && t <= 13311, oi = t => t >= 13312 && t <= 19903, hi = t => t >= 19904 && t <= 19967, ai = t => t >= 19968 && t <= 40959, li = t => t >= 40960 && t <= 42127, ui = t => t >= 42128 && t <= 42191, ci = t => t >= 43360 && t <= 43391, fi = t => t >= 44032 && t <= 55215, di = t => t >= 55216 && t <= 55295, yi = t => t >= 57344 && t <= 63743, pi = t => t >= 63744 && t <= 64255, mi = t => t >= 64336 && t <= 65023, vi = t => t >= 65040 && t <= 65055, gi = t => t >= 65072 && t <= 65103, wi = t => t >= 65104 && t <= 65135, bi = t => t >= 65136 && t <= 65279, Mi = t => t >= 65280 && t <= 65519;
        function xi(t) {
            return !Ct(t) && (!It(t) && (!Tt(t) && (!mi(t) && !bi(t))));
        }
        function Fi(t) {
            return 746 === t || 747 === t || !(t < 4352) && (!!ii(t) || (!!Kt(t) || (!(!gi(t) || t >= 65097 && t <= 65103) || (!!pi(t) || (!!si(t) || (!!Jt(t) || (!!ei(t) || (!(!Xt(t) || t >= 12296 && t <= 12305 || t >= 12308 && t <= 12319 || 12336 === t) || (!!oi(t) || (!!ai(t) || (!!ri(t) || (!!Qt(t) || (!!ci(t) || (!!di(t) || (!!Dt(t) || (!!fi(t) || (!!Zt(t) || (!!Bt(t) || (!!ti(t) || (!!qt(t) || (!!ni(t) || (!(!Yt(t) || 12540 === t) || (!(!Mi(t) || 65288 === t || 65289 === t || 65293 === t || t >= 65306 && t <= 65310 || 65339 === t || 65341 === t || 65343 === t || t >= 65371 && t <= 65503 || 65507 === t || t >= 65512 && t <= 65519) || (!(!wi(t) || t >= 65112 && t <= 65118 || t >= 65123 && t <= 65126) || (!!Lt(t) || (!!Ut(t) || (!!vi(t) || (!!hi(t) || (!!li(t) || !!ui(t))))))))))))))))))))))))))))));
        }
        function Ai(t) {
            return !(Fi(t) || function(t) {
                return !(!Ot(t) || 167 !== t && 169 !== t && 174 !== t && 177 !== t && 188 !== t && 189 !== t && 190 !== t && 215 !== t && 247 !== t) || (!(!Et(t) || 8214 !== t && 8224 !== t && 8225 !== t && 8240 !== t && 8241 !== t && 8251 !== t && 8252 !== t && 8258 !== t && 8263 !== t && 8264 !== t && 8265 !== t && 8273 !== t) || (!!jt(t) || (!!Rt(t) || (!(!zt(t) || !(t >= 8960 && t <= 8967 || t >= 8972 && t <= 8991 || t >= 8996 && t <= 9e3 || 9003 === t || t >= 9085 && t <= 9114 || t >= 9150 && t <= 9165 || 9167 === t || t >= 9169 && t <= 9179 || t >= 9186 && t <= 9215)) || (!(!Nt(t) || 9251 === t) || (!!Wt(t) || (!!Ht(t) || (!!Vt(t) || (!(!$t(t) || t >= 9754 && t <= 9759) || (!(!Gt(t) || !(t >= 11026 && t <= 11055 || t >= 11088 && t <= 11097 || t >= 11192 && t <= 11243)) || (!!Xt(t) || (!!Yt(t) || (!!yi(t) || (!!gi(t) || (!!wi(t) || (!!Mi(t) || (8734 === t || 8756 === t || 8757 === t || t >= 9984 && t <= 10087 || t >= 10102 && t <= 10131 || 65532 === t || 65533 === t)))))))))))))))));
            }(t));
        }
        function ki(t) {
            return t >= 1424 && t <= 2303 || mi(t) || bi(t);
        }
        const _i = [ [ 9, 9 ], [ 32, 32 ], [ 5760, 5760 ], [ 8192, 8198 ], [ 8200, 8202 ], [ 8287, 12288 ], [ 6158, 6158 ], [ 8203, 8205 ] ];
        function Si(t) {
            for (const i of _i) if (t >= i[0] && t <= i[1]) return !0;
            return !1;
        }
        const Pi = {
            "!": "︕",
            "#": "＃",
            $: "＄",
            "%": "％",
            "&": "＆",
            "(": "︵",
            ")": "︶",
            "*": "＊",
            "+": "＋",
            ",": "︐",
            "-": "︲",
            ".": "・",
            "/": "／",
            ":": "︓",
            ";": "︔",
            "<": "︿",
            "=": "＝",
            ">": "﹀",
            "?": "︖",
            "@": "＠",
            "[": "﹇",
            "\\": "＼",
            "]": "﹈",
            "^": "＾",
            _: "︳",
            "`": "｀",
            "{": "︷",
            "|": "―",
            "}": "︸",
            "~": "～",
            "¢": "￠",
            "£": "￡",
            "¥": "￥",
            "¦": "￤",
            "¬": "￢",
            "¯": "￣",
            "–": "︲",
            "—": "︱",
            "‘": "﹃",
            "’": "﹄",
            "“": "﹁",
            "”": "﹂",
            "…": "︙",
            "‧": "・",
            "₩": "￦",
            "、": "︑",
            "。": "︒",
            "〈": "︿",
            "〉": "﹀",
            "《": "︽",
            "》": "︾",
            "「": "﹁",
            "」": "﹂",
            "『": "﹃",
            "』": "﹄",
            "【": "︻",
            "】": "︼",
            "〔": "︹",
            "〕": "︺",
            "〖": "︗",
            "〗": "︘",
            "！": "︕",
            "（": "︵",
            "）": "︶",
            "，": "︐",
            "－": "︲",
            "．": "・",
            "：": "︓",
            "；": "︔",
            "＜": "︿",
            "＞": "﹀",
            "？": "︖",
            "［": "﹇",
            "］": "﹈",
            "＿": "︳",
            "｛": "︷",
            "｜": "―",
            "｝": "︸",
            "｟": "︵",
            "｠": "︶",
            "｡": "︒",
            "｢": "﹁",
            "｣": "﹂"
        };
        const Oi = 1, Ci = 2;
        function Ii(t, i, e, n, r, s, o, h, a, l) {
            let u = t.trim();
            l === Ci && (u = function(t) {
                let i = "";
                for (let e = 0; e < t.length; e++) {
                    const n = t.charCodeAt(e + 1) || null, r = t.charCodeAt(e - 1) || null;
                    (!n || !Ai(n) || Pi[t[e + 1]]) && (!r || !Ai(r) || Pi[t[e - 1]]) && Pi[t[e]] ? i += Pi[t[e]] : i += t[e];
                }
                return i;
            }(u));
            const c = [], f = {
                positionedGlyphs: c,
                text: u,
                top: h[1],
                bottom: h[1],
                left: h[0],
                right: h[0],
                writingMode: l
            };
            let d;
            return d = function(t, i) {
                const e = [];
                let n = 0;
                for (let r = 0; r < i.length; r++) {
                    const s = i[r];
                    e.push(t.substring(n, s)), n = s;
                }
                return n < t.length && e.push(t.substring(n, t.length)), e;
            }(u, function(t, i, e, n) {
                if (!e) return [];
                if (!t) return [];
                const r = [], s = function(t, i, e, n) {
                    let r = 0;
                    for (let e = 0; e < t.length; e++) {
                        const s = n[t.charCodeAt(e)];
                        s && (r += s.metrics.advance + i);
                    }
                    const s = Math.max(1, Math.ceil(r / e));
                    return r / s;
                }(t, i, e, n);
                let o = 0;
                for (let e = 0; e < t.length; e++) {
                    const a = t.charCodeAt(e), l = n[a];
                    l && !Ti[a] && (o += l.metrics.advance + i), e < t.length - 1 && (Di[a] || !((h = a) < 11904) && (ii(h) || Kt(h) || gi(h) || pi(h) || si(h) || Jt(h) || ei(h) || Xt(h) || oi(h) || ai(h) || ri(h) || Mi(h) || Zt(h) || Bt(h) || qt(h) || ni(h) || Yt(h) || vi(h) || ui(h) || li(h))) && r.push(Ei(e + 1, o, s, r, Ui(a, t.charCodeAt(e + 1)), !1));
                }
                var h;
                return function t(i) {
                    if (!i) return [];
                    return t(i.priorBreak).concat(i.index);
                }(Ei(t.length, o, s, r, 0, !0));
            }(u, o, e, i)), function(t, i, e, n, r, s, o, h, a) {
                let l = 0, u = 8, c = 0;
                const f = t.positionedGlyphs, d = "right" === s ? 1 : "left" === s ? 0 : .5;
                for (let t = 0; t < e.length; t++) {
                    let r = e[t];
                    if (r = r.trim(), !r.length) {
                        u -= n;
                        continue;
                    }
                    const s = f.length;
                    for (let t = 0; t < r.length; t++) {
                        const e = r.charCodeAt(t), n = i[e];
                        n && (Fi(e) && o !== Oi ? (32 !== e && f.push({
                            glyph: e,
                            x: l,
                            y: 0,
                            vertical: !0
                        }), l += a + h) : (32 !== e && f.push({
                            glyph: e,
                            x: l,
                            y: u,
                            vertical: !1
                        }), l += n.metrics.advance + h));
                    }
                    if (f.length !== s) {
                        const t = l - h;
                        c = Math.max(t, c), Ri(f, i, s, f.length - 1, d);
                    }
                    l = 0, u -= n;
                }
                const {horizontalAlign: y, verticalAlign: p} = ji(r);
                !function(t, i, e, n, r, s, o) {
                    const h = (i - e) * r, a = -(-n * o + .5) * s;
                    if (!h && !a) return;
                    for (let i = 0; i < t.length; i++) t[i].x += h, t[i].y += a;
                }(f, d, y, p, c, n, e.length);
                const m = e.length * n;
                t.top += -p * m, t.bottom = t.top + m, t.left += -y * c, t.right = t.left + c;
            }(f, i, d, n, r, s, l, o, a), !!c.length && f;
        }
        const Ti = {
            9: !0,
            10: !0,
            11: !0,
            12: !0,
            13: !0,
            32: !0
        }, Di = {
            10: !0,
            32: !0,
            38: !0,
            40: !0,
            41: !0,
            43: !0,
            45: !0,
            47: !0,
            173: !0,
            183: !0,
            8203: !0,
            8208: !0,
            8211: !0,
            8231: !0
        };
        function Li(t, i, e, n) {
            const r = Math.pow(t - i, 2);
            return n ? t < i ? r / 2 : 2 * r : r + Math.abs(e) * e;
        }
        function Ui(t, i) {
            let e = 0;
            return 10 === t && (e -= 1e4), 40 !== t && 65288 !== t || (e += 50), 41 !== i && 65289 !== i || (e += 50), 
            e;
        }
        function Ei(t, i, e, n, r, s) {
            let o = null, h = Li(i, e, r, s);
            for (let t = 0; t < n.length; t++) {
                const a = n[t], l = Li(i - a.x, e, r, s) + a.badness;
                l <= h && (o = a, h = l);
            }
            return {
                index: t,
                x: i,
                priorBreak: o,
                badness: h
            };
        }
        function ji(t) {
            let i = .5, e = .5;
            switch (t) {
              case "right":
              case "top-right":
              case "bottom-right":
                i = 1;
                break;

              case "left":
              case "top-left":
              case "bottom-left":
                i = 0;
            }
            switch (t) {
              case "bottom":
              case "bottom-right":
              case "bottom-left":
                e = 1;
                break;

              case "top":
              case "top-right":
              case "top-left":
                e = 0;
            }
            return {
                horizontalAlign: i,
                verticalAlign: e
            };
        }
        function Ri(t, i, e, n, r) {
            if (!r) return;
            const s = i[t[n].glyph];
            if (s) {
                const i = s.metrics.advance, o = (t[n].x + i) * r;
                if (!o) return;
                for (let i = e; i <= n; i++) t[i].x -= o;
            }
        }
        function zi(t) {
            if (!function(t) {
                for (const i of t) if (ki(i.charCodeAt(0))) return !0;
                return !1;
            }(t)) return t;
            const i = [], e = [], n = [];
            let r = 0, s = 0, o = 1, h = 1;
            for (const a of t) {
                const t = a.codePointAt(0);
                Si(t) ? (n.push(a), r++) : (o = ki(t) ? -1 : 1, h !== o ? (s = r, e.length && (h > 0 && e.reverse(), 
                i.push(...e)), n.length && (i.splice(s, 0, ...n), n.length = 0), h = o, e.length = 0) : n.length && (e.push(...n), 
                n.length = 0), e.push(a), r++);
            }
            return n.length && e.push(...n), e.length && (h > 0 && e.reverse(), i.push(...e)), 
            i.reverse().join("");
        }
        const Ni = /\{ *([\w_]+) *\}/g;
        class Wi {
            constructor(t, i, e, n, r) {
                this.feature = t, this.symbolDef = i, this.symbol = e, this.options = r, this.W = this.H.bind(this), 
                this.j = n;
            }
            H(t, i) {
                return this.feature.properties[i] || "default";
            }
            getShape(t, i) {
                if (this.V) return this.V;
                const {textHorizontalAlignmentFn: e, textVerticalAlignmentFn: n, markerHorizontalAlignmentFn: r, markerVerticalAlignmentFn: s, textWrapWidthFn: o} = this.j;
                let h;
                const a = this.symbol, l = this.getIconAndGlyph(), u = this.feature.properties;
                if (l && l.glyph) {
                    const {font: t, text: r} = l.glyph;
                    if ("" === r) return null;
                    const s = 24, c = this.size[0] / s, f = 24, d = a.textKeepUpright, y = "map" === a.textRotationAlignment && "line" === a.textPlacement && !a.isIconText, p = i.glyphMap[t], m = Hi(e ? e(null, u) : a.textHorizontalAlignment, n ? n(null, u) : a.textVerticalAlignment), v = 1.2 * f, g = function(t) {
                        for (let i = 0; i < t.length; i++) {
                            if (!xi(t.charAt(i).charCodeAt(0))) return !1;
                        }
                        return !0;
                    }(r), w = g && a.textLetterSpacing / c || 0, b = [ a.textDx / c || 0, a.textDy / c || 0 ], M = ((o ? o(null, u) : a.textWrapWidth) || 10 * f) / c;
                    h = {}, h.horizontal = Ii(r, p, M, v, m, "center", w, b, f, Oi), g && y && d && (h.vertical = Ii(r, p, M, v, m, "center", w, b, f, Ci));
                } else if (l && l.icon) {
                    if (!t.positions[l.icon.url]) return null;
                    const i = Hi(r ? r(null, u) : a.markerHorizontalAlignment, s ? s(null, u) : a.markerVerticalAlignment);
                    h = function(t, i) {
                        const {horizontalAlign: e, verticalAlign: n} = ji(i), r = -24 * e, s = -24 * n;
                        return {
                            image: t,
                            top: s,
                            bottom: s + 24,
                            left: r,
                            right: r + 24
                        };
                    }(t.positions[l.icon.url], i), this.size || (this.size = h.image.displaySize);
                }
                return this.V = h, h;
            }
            getIconAndGlyph() {
                if (this.iconGlyph) return this.iconGlyph;
                const {markerFileFn: t, markerTypeFn: i, markerWidthFn: e, markerHeightFn: n, markerFillFn: r, markerFillPatternFileFn: s, markerFillOpacityFn: o, markerTextFitFn: h, markerTextFitPaddingFn: a, markerLineColorFn: l, markerLineWidthFn: u, markerLineOpacityFn: c, markerLineDasharrayFn: f, markerLinePatternFileFn: d, textNameFn: y, textFaceNameFn: p, textStyleFn: m, textWeightFn: v} = this.j, {zoom: g} = this.options, w = {}, b = this.symbol, F = this.feature.properties, A = t ? t(null, F) : b.markerFile, k = i ? i(null, F) : b.markerType, _ = A || k || b.markerPath, S = !lt(this.symbolDef.textName);
                let P;
                if (_ && (P = function(t, i, e, n) {
                    if (lt(i.markerWidth) && lt(i.markerHeight)) return null;
                    let r = i.markerWidth || 0, s = i.markerHeight || 0;
                    return ct(r) && ("identity" !== r.type ? r = _t(r) : (r = t.markerWidth, t.__fn_markerWidth && (r = t.__fn_markerWidth(n, e)), 
                    ct(r) && (r = _t(r)))), ct(s) && ("identity" !== s.type ? s = _t(s) : (s = t.markerHeight, 
                    t.__fn_markerHeight && (s = t.__fn_markerHeight(n, e)), ct(s) && (s = _t(s)))), 
                    [ r, s ];
                }(b, this.symbolDef, F, g) || [ 0, 0 ], b.markerTextFit)) {
                    let t = b.markerTextFit;
                    if (h && (t = h(g, F)), t && "none" !== t) {
                        const i = b.text.textSize, e = Pt(b.text.textName, F);
                        if (e) {
                            M(i) && !b.text.__fn_textSize && (b.text.__fn_textSize = x(i));
                            const n = kt(b.text, F, g);
                            if ("width" !== t && "both" !== t || (P[0] = n[0] * e.length), "height" !== t && "both" !== t || (P[1] = n[1]), 
                            n[0] && n[1]) {
                                let t = b.markerTextFitPadding || [ 0, 0, 0, 0 ];
                                a && (t = a(g, F)), P[0] += t[1] + t[3], P[1] += t[0] + t[2];
                            }
                        } else P[0] = P[1] = -1;
                    }
                }
                if (S && (P = kt(b, this.symbolDef, F, g)), !P) return w;
                if (P[0] = Math.ceil(P[0]), P[1] = Math.ceil(P[1]), this.size = P, _ && P[0] >= 0 && P[1] >= 0) {
                    let t;
                    if (k) {
                        const i = {};
                        if (i.markerType = k, e) {
                            const t = e(null, F);
                            lt(t) || (i.markerWidth = t);
                        } else b.markerWidth >= 0 && (i.markerWidth = b.markerWidth);
                        if (n) {
                            const t = n(null, F);
                            lt(t) || (i.markerHeight = t);
                        } else b.markerHeight >= 0 && (i.markerHeight = b.markerHeight);
                        if (r) {
                            const t = r(null, F);
                            lt(t) || (i.markerFill = t);
                        } else b.markerFill && (i.markerFill = b.markerFill);
                        if (s) {
                            const t = s(null, F);
                            lt(t) || (i.markerFillPatternFile = t);
                        } else b.markerFillPatternFile && (i.markerFillPatternFile = b.markerFillPatternFile);
                        if (o) {
                            const t = o(null, F);
                            lt(t) || (i.markerFillOpacity = t);
                        } else b.markerFillOpacity >= 0 && (i.markerFillOpacity = b.markerFillOpacity);
                        if (l) {
                            const t = l(null, F);
                            lt(t) || (i.markerLineColor = t);
                        } else b.markerLineColor && (i.markerLineColor = b.markerLineColor);
                        if (u) {
                            const t = u(null, F);
                            lt(t) || (i.markerLineWidth = t);
                        } else b.markerLineWidth >= 0 && (i.markerLineWidth = b.markerLineWidth);
                        if (c) {
                            const t = c(null, F);
                            lt(t) || (i.markerLineOpacity = t);
                        } else b.markerLineOpacity >= 0 && (i.markerLineOpacity = b.markerLineOpacity);
                        if (f) {
                            const t = f(null, F);
                            lt(t) || (i.markerLineDasharray = t);
                        } else b.markerLineDasharray && (i.markerLineDasharray = b.markerLineDasharray);
                        if (d) {
                            const t = d(null, F);
                            lt(t) || (i.markerLinePatternFile = t);
                        } else b.markerLinePatternFile && (i.markerLinePatternFile = b.markerLinePatternFile);
                        t = "vector://" + JSON.stringify(i);
                    } else t = A ? A.replace(Ni, this.W) : b.markerPath ? function(t, i, e) {
                        if (!t.markerPath) return null;
                        let n = 1;
                        const r = function(t) {
                            const i = {
                                stroke: {
                                    stroke: t.markerLineColor,
                                    "stroke-width": t.markerLineWidth,
                                    "stroke-opacity": t.markerLineOpacity,
                                    "stroke-dasharray": null,
                                    "stroke-linecap": "butt",
                                    "stroke-linejoin": "round"
                                },
                                fill: {
                                    fill: t.markerFill,
                                    "fill-opacity": t.markerFillOpacity
                                }
                            };
                            0 === i.stroke["stroke-width"] && (i.stroke["stroke-opacity"] = 0);
                            return i;
                        }(t);
                        ut(t.markerOpacity) && (n = t.markerOpacity), ut(t.opacity) && (n *= t.opacity);
                        const s = {};
                        if (r) {
                            for (const t in r.stroke) yt(r.stroke, t) && (lt(r.stroke[t]) || (s[t] = r.stroke[t]));
                            for (const t in r.fill) yt(r.fill, t) && (lt(r.fill[t]) || (s[t] = r.fill[t]));
                        }
                        const o = Array.isArray(t.markerPath) ? t.markerPath : [ t.markerPath ];
                        let h;
                        const a = [];
                        for (let t = 0; t < o.length; t++) h = ft(o[t]) ? {
                            path: o[t]
                        } : o[t], h = at({}, h, s), h.d = h.path, delete h.path, a.push(h);
                        const l = [ '<svg version="1.1"', 'xmlns="http://www.w3.org/2000/svg"' ];
                        n < 1 && l.push('opacity="' + n + '"'), t.markerPathWidth && t.markerPathHeight && l.push('viewBox="0 0 ' + t.markerPathWidth + " " + t.markerPathHeight + '"'), 
                        l.push('preserveAspectRatio="none"'), i && l.push('width="' + i + '"'), e && l.push('height="' + e + '"'), 
                        l.push("><defs></defs>");
                        for (let t = 0; t < a.length; t++) {
                            let i = "<path ";
                            for (const e in a[t]) yt(a[t], e) && (i += " " + e + '="' + a[t][e] + '"');
                            i += "></path>", l.push(i);
                        }
                        return l.push("</svg>"), "data:image/svg+xml;base64," + btoa(l.join(" "));
                    }(b, P[0], P[1]) : null;
                    w.icon = {
                        url: t,
                        size: P
                    };
                }
                if (S) {
                    const t = y ? y(null, F) : b.textName;
                    if (t || 0 === t) {
                        const i = function(t, i, e) {
                            return [ i || "normal", e || "normal", "24px", t || "monospace" ].join(" ");
                        }(p ? p(null, F) : b.textFaceName, m ? m(null, F) : b.textStyle, v ? v(null, F) : b.textWeight);
                        let e = Pt(t, F);
                        e && e.length && (e = zi(e), w.glyph = {
                            font: i,
                            text: e
                        });
                    }
                }
                return this.iconGlyph = w, w;
            }
        }
        function Hi(t, i) {
            i && "middle" !== i || (i = "center"), t && "middle" !== t || (t = "center");
            let e = "center" !== i ? i : "";
            return e += "center" !== t ? (e.length ? "-" : "") + t : "", e;
        }
        /*!
       * From mapbox-gl-js
       * MIT License
       * https://github.com/mapbox/mapbox-gl-js
       */        function Vi(t, i, e, n, r) {
            const s = [];
            for (let o = 0; o < t.length; o++) {
                const h = t[o];
                let a;
                for (let t = 0; t < h.length - 1; t++) {
                    let o = h[t], l = h[t + 1];
                    o.x < i && l.x < i || (o.x < i ? o = new E(i, o.y + (l.y - o.y) * ((i - o.x) / (l.x - o.x))).D() : l.x < i && (l = new E(i, o.y + (l.y - o.y) * ((i - o.x) / (l.x - o.x))).D()), 
                    o.y < e && l.y < e || (o.y < e ? o = new E(o.x + (l.x - o.x) * ((e - o.y) / (l.y - o.y)), e).D() : l.y < e && (l = new E(o.x + (l.x - o.x) * ((e - o.y) / (l.y - o.y)), e).D()), 
                    o.x >= n && l.x >= n || (o.x >= n ? o = new E(n, o.y + (l.y - o.y) * ((n - o.x) / (l.x - o.x))).D() : l.x >= n && (l = new E(n, o.y + (l.y - o.y) * ((n - o.x) / (l.x - o.x))).D()), 
                    o.y >= r && l.y >= r || (o.y >= r ? o = new E(o.x + (l.x - o.x) * ((r - o.y) / (l.y - o.y)), r).D() : l.y >= r && (l = new E(o.x + (l.x - o.x) * ((r - o.y) / (l.y - o.y)), r).D()), 
                    a && o.equals(a[a.length - 1]) || (a = [ o ], s.push(a)), a.push(l)))));
                }
            }
            return s;
        }
        class $i extends E {
            constructor(t, i, e, n) {
                super(t, i), this.angle = e, void 0 !== n && (this.segment = n);
            }
            clone() {
                return new $i(this.x, this.y, this.angle, this.segment);
            }
        }
        /*!
       * From mapbox-gl-js
       * MIT License
       * https://github.com/mapbox/mapbox-gl-js
       */        function Gi(t, i, e, n, r) {
            if (void 0 === i.segment) return !0;
            let s = i, o = i.segment + 1, h = 0;
            for (;h > -e / 2; ) {
                if (o--, o < 0) return !1;
                h -= t[o].dist(s), s = t[o];
            }
            h += t[o].dist(t[o + 1]), o++;
            const a = [];
            let l = 0;
            for (;h < e / 2; ) {
                const i = t[o - 1], e = t[o], s = t[o + 1];
                if (!s) return !1;
                let u = i.angleTo(e) - e.angleTo(s);
                for (u = Math.abs((u + 3 * Math.PI) % (2 * Math.PI) - Math.PI), a.push({
                    distance: h,
                    angleDelta: u
                }), l += u; h - a[0].distance > n; ) l -= a.shift().angleDelta;
                if (l > r) return !1;
                o++, h += e.dist(s);
            }
            return !0;
        }
        function Ji(t, i, e, n, r, s, o, h, a) {
            const l = function(t, i, e) {
                return t ? .6 * i * e : 0;
            }(n, s, o), u = function(t, i) {
                return Math.max(t ? t.right - t.left : 0, i ? i.right - i.left : 0);
            }(n, r), c = 0 === t[0].x || t[0].x === a || 0 === t[0].y || t[0].y === a;
            i - u * o < i / 4 && (i = u * o + i / 4);
            return function t(i, e, n, r, s, o, h, a, l) {
                const u = o / 2, c = function(t) {
                    let i = 0;
                    for (let e = 0; e < t.length - 1; e++) i += t[e].dist(t[e + 1]);
                    return i;
                }(i);
                let f = 0, d = e - n, y = [];
                for (let t = 0; t < i.length - 1; t++) {
                    const e = i[t], h = i[t + 1], a = e.dist(h), p = h.angleTo(e);
                    for (;d + n < f + a; ) {
                        d += n;
                        const m = (d - f) / a, v = qi(e.x, h.x, m), g = qi(e.y, h.y, m);
                        if (v >= 0 && v < l && g >= 0 && g < l && d - u >= 0 && d + u <= c) {
                            const e = new $i(v, g, p, t);
                            e.line = i, e.D(), r && !Gi(i, e, o, r, s) || y.push(e);
                        }
                    }
                    f += a;
                }
                a || y.length || h || (y = t(i, f / 2, n, r, s, o, h, !0, l));
                return y;
            }(t, c ? i / 2 * h % i : (u / 2 + 2 * s) * o * h % i, i, l, e, u * o, c, !1, a);
        }
        function qi(t, i, e) {
            return t * (1 - e) + i * e;
        }
        var Bi = {
            exports: {}
        };
        !function(t, i) {
            t.exports = function() {
                function t(t, i, e) {
                    var n = t[i];
                    t[i] = t[e], t[e] = n;
                }
                function i(t, i) {
                    return t < i ? -1 : t > i ? 1 : 0;
                }
                return function(e, n, r, s, o) {
                    !function i(e, n, r, s, o) {
                        for (;s > r; ) {
                            if (s - r > 600) {
                                var h = s - r + 1, a = n - r + 1, l = Math.log(h), u = .5 * Math.exp(2 * l / 3), c = .5 * Math.sqrt(l * u * (h - u) / h) * (a - h / 2 < 0 ? -1 : 1), f = Math.max(r, Math.floor(n - a * u / h + c)), d = Math.min(s, Math.floor(n + (h - a) * u / h + c));
                                i(e, n, f, d, o);
                            }
                            var y = e[n], p = r, m = s;
                            for (t(e, r, n), o(e[s], y) > 0 && t(e, r, s); p < m; ) {
                                for (t(e, p, m), p++, m--; o(e[p], y) < 0; ) p++;
                                for (;o(e[m], y) > 0; ) m--;
                            }
                            0 === o(e[r], y) ? t(e, r, m) : (m++, t(e, m, s)), m <= n && (r = m + 1), n <= m && (s = m - 1);
                        }
                    }(e, n, r || 0, s || e.length - 1, o || i);
                };
            }();
        }(Bi);
        var Xi = Bi.exports;
        function Zi(t, i) {
            const e = t.length;
            if (e <= 1) return [ t ];
            const n = [];
            let r, s;
            for (let i = 0; i < e; i++) {
                const e = mt(t[i]);
                0 !== e && (t[i].area = Math.abs(e), void 0 === s && (s = e < 0), s === e < 0 ? (r && n.push(r), 
                r = [ t[i] ]) : r.push(t[i]));
            }
            if (r && n.push(r), i > 1) for (let t = 0; t < n.length; t++) n[t].length <= i || (Xi(n[t], i, 1, n[t].length - 1, Yi), 
            n[t] = n[t].slice(0, i));
            return n;
        }
        function Yi(t, i) {
            return i.area - t.area;
        }
        var Ki = {
            exports: {}
        };
        function Qi(t, i) {
            if (!(this instanceof Qi)) return new Qi(t, i);
            if (this.data = t || [], this.length = this.data.length, this.compare = i || te, 
            this.length > 0) for (var e = (this.length >> 1) - 1; e >= 0; e--) this.G(e);
        }
        function te(t, i) {
            return t < i ? -1 : t > i ? 1 : 0;
        }
        Ki.exports = Qi, Ki.exports.default = Qi, Qi.prototype = {
            push: function(t) {
                this.data.push(t), this.length++, this.J(this.length - 1);
            },
            pop: function() {
                if (0 !== this.length) {
                    var t = this.data[0];
                    return this.length--, this.length > 0 && (this.data[0] = this.data[this.length], 
                    this.G(0)), this.data.pop(), t;
                }
            },
            peek: function() {
                return this.data[0];
            },
            J: function(t) {
                for (var i = this.data, e = this.compare, n = i[t]; t > 0; ) {
                    var r = t - 1 >> 1, s = i[r];
                    if (e(n, s) >= 0) break;
                    i[t] = s, t = r;
                }
                i[t] = n;
            },
            G: function(t) {
                for (var i = this.data, e = this.compare, n = this.length >> 1, r = i[t]; t < n; ) {
                    var s = 1 + (t << 1), o = s + 1, h = i[s];
                    if (o < this.length && e(i[o], h) < 0 && (s = o, h = i[o]), e(h, r) >= 0) break;
                    i[t] = h, t = s;
                }
                i[t] = r;
            }
        };
        var ie = Ki.exports;
        function ee(t, i, e) {
            const n = i.distSqr(e);
            if (0 === n) return t.distSqr(i);
            const r = ((t.x - i.x) * (e.x - i.x) + (t.y - i.y) * (e.y - i.y)) / n;
            return r < 0 ? t.distSqr(i) : r > 1 ? t.distSqr(e) : t.distSqr(e.sub(i).k(r).m(i));
        }
        function ne(t, i = 1, e = !1) {
            let n = 1 / 0, r = 1 / 0, s = -1 / 0, o = -1 / 0;
            const h = t[0];
            for (let t = 0; t < h.length; t++) {
                const i = h[t];
                (!t || i.x < n) && (n = i.x), (!t || i.y < r) && (r = i.y), (!t || i.x > s) && (s = i.x), 
                (!t || i.y > o) && (o = i.y);
            }
            const a = s - n, l = o - r, u = Math.min(a, l);
            let c = u / 2;
            const f = new ie(null, re);
            if (0 === u) return new E(n, r);
            for (let i = n; i < s; i += u) for (let e = r; e < o; e += u) f.push(new se(i + c, e + c, c, t));
            let d = function(t) {
                let i = 0, e = 0, n = 0;
                const r = t[0];
                for (let t = 0, s = r.length, o = s - 1; t < s; o = t++) {
                    const s = r[t], h = r[o], a = s.x * h.y - h.x * s.y;
                    e += (s.x + h.x) * a, n += (s.y + h.y) * a, i += 3 * a;
                }
                return new se(e / i, n / i, 0, t);
            }(t), y = f.length;
            for (;f.length; ) {
                const n = f.pop();
                (n.d > d.d || !d.d) && (d = n, e && console.log("found best %d after %d probes", Math.round(1e4 * n.d) / 1e4, y)), 
                n.max - d.d <= i || (c = n.h / 2, f.push(new se(n.p.x - c, n.p.y - c, c, t)), f.push(new se(n.p.x + c, n.p.y - c, c, t)), 
                f.push(new se(n.p.x - c, n.p.y + c, c, t)), f.push(new se(n.p.x + c, n.p.y + c, c, t)), 
                y += 4);
            }
            return e && (console.log("num probes: " + y), console.log("best distance: " + d.d)), 
            d.p;
        }
        function re(t, i) {
            return i.max - t.max;
        }
        function se(t, i, e, n) {
            this.p = new E(t, i), this.h = e, this.d = function(t, i) {
                let e = !1, n = 1 / 0;
                for (let r = 0; r < i.length; r++) {
                    const s = i[r];
                    for (let i = 0, r = s.length, o = r - 1; i < r; o = i++) {
                        const r = s[i], h = s[o];
                        r.y > t.y != h.y > t.y && t.x < (h.x - r.x) * (t.y - r.y) / (h.y - r.y) + r.x && (e = !e), 
                        n = Math.min(n, ee(t, r, h));
                    }
                }
                return (e ? 1 : -1) * Math.sqrt(n);
            }(this.p, n), this.max = this.d + this.h * Math.SQRT2;
        }
        const oe = 45 * Math.PI / 100;
        var he = {
            exports: {}
        }, ae = {
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
        }, le = {
            exports: {}
        }, ue = function(t) {
            return !(!t || "string" == typeof t) && (t instanceof Array || Array.isArray(t) || t.length >= 0 && (t.splice instanceof Function || Object.getOwnPropertyDescriptor(t, t.length - 1) && "String" !== t.constructor.name));
        }, ce = Array.prototype.concat, fe = Array.prototype.slice, de = le.exports = function(t) {
            for (var i = [], e = 0, n = t.length; e < n; e++) {
                var r = t[e];
                ue(r) ? i = ce.call(i, fe.call(r)) : i.push(r);
            }
            return i;
        };
        de.wrap = function(t) {
            return function() {
                return t(de(arguments));
            };
        };
        var ye = ae, pe = le.exports, me = {};
        for (var ve in ye) ye.hasOwnProperty(ve) && (me[ye[ve]] = ve);
        var ge = he.exports = {
            to: {},
            get: {}
        };
        function we(t, i, e) {
            return Math.min(Math.max(i, t), e);
        }
        function be(t) {
            var i = t.toString(16).toUpperCase();
            return i.length < 2 ? "0" + i : i;
        }
        ge.get = function(t) {
            var i, e;
            switch (t.substring(0, 3).toLowerCase()) {
              case "hsl":
                i = ge.get.hsl(t), e = "hsl";
                break;

              case "hwb":
                i = ge.get.hwb(t), e = "hwb";
                break;

              default:
                i = ge.get.rgb(t), e = "rgb";
            }
            return i ? {
                model: e,
                value: i
            } : null;
        }, ge.get.rgb = function(t) {
            if (!t) return null;
            var i, e, n, r = [ 0, 0, 0, 1 ];
            if (i = t.match(/^#([a-f0-9]{6})([a-f0-9]{2})?$/i)) {
                for (n = i[2], i = i[1], e = 0; e < 3; e++) {
                    var s = 2 * e;
                    r[e] = parseInt(i.slice(s, s + 2), 16);
                }
                n && (r[3] = Math.round(parseInt(n, 16) / 255 * 100) / 100);
            } else if (i = t.match(/^#([a-f0-9]{3,4})$/i)) {
                for (n = (i = i[1])[3], e = 0; e < 3; e++) r[e] = parseInt(i[e] + i[e], 16);
                n && (r[3] = Math.round(parseInt(n + n, 16) / 255 * 100) / 100);
            } else if (i = t.match(/^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/)) {
                for (e = 0; e < 3; e++) r[e] = parseInt(i[e + 1], 0);
                i[4] && (r[3] = parseFloat(i[4]));
            } else {
                if (!(i = t.match(/^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/))) return (i = t.match(/(\D+)/)) ? "transparent" === i[1] ? [ 0, 0, 0, 0 ] : (r = ye[i[1]]) ? (r[3] = 1, 
                r) : null : null;
                for (e = 0; e < 3; e++) r[e] = Math.round(2.55 * parseFloat(i[e + 1]));
                i[4] && (r[3] = parseFloat(i[4]));
            }
            for (e = 0; e < 3; e++) r[e] = we(r[e], 0, 255);
            return r[3] = we(r[3], 0, 1), r;
        }, ge.get.hsl = function(t) {
            if (!t) return null;
            var i = t.match(/^hsla?\(\s*([+-]?(?:\d*\.)?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/);
            if (i) {
                var e = parseFloat(i[4]);
                return [ (parseFloat(i[1]) + 360) % 360, we(parseFloat(i[2]), 0, 100), we(parseFloat(i[3]), 0, 100), we(isNaN(e) ? 1 : e, 0, 1) ];
            }
            return null;
        }, ge.get.hwb = function(t) {
            if (!t) return null;
            var i = t.match(/^hwb\(\s*([+-]?\d*[\.]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/);
            if (i) {
                var e = parseFloat(i[4]);
                return [ (parseFloat(i[1]) % 360 + 360) % 360, we(parseFloat(i[2]), 0, 100), we(parseFloat(i[3]), 0, 100), we(isNaN(e) ? 1 : e, 0, 1) ];
            }
            return null;
        }, ge.to.hex = function() {
            var t = pe(arguments);
            return "#" + be(t[0]) + be(t[1]) + be(t[2]) + (t[3] < 1 ? be(Math.round(255 * t[3])) : "");
        }, ge.to.rgb = function() {
            var t = pe(arguments);
            return t.length < 4 || 1 === t[3] ? "rgb(" + Math.round(t[0]) + ", " + Math.round(t[1]) + ", " + Math.round(t[2]) + ")" : "rgba(" + Math.round(t[0]) + ", " + Math.round(t[1]) + ", " + Math.round(t[2]) + ", " + t[3] + ")";
        }, ge.to.rgb.percent = function() {
            var t = pe(arguments), i = Math.round(t[0] / 255 * 100), e = Math.round(t[1] / 255 * 100), n = Math.round(t[2] / 255 * 100);
            return t.length < 4 || 1 === t[3] ? "rgb(" + i + "%, " + e + "%, " + n + "%)" : "rgba(" + i + "%, " + e + "%, " + n + "%, " + t[3] + ")";
        }, ge.to.hsl = function() {
            var t = pe(arguments);
            return t.length < 4 || 1 === t[3] ? "hsl(" + t[0] + ", " + t[1] + "%, " + t[2] + "%)" : "hsla(" + t[0] + ", " + t[1] + "%, " + t[2] + "%, " + t[3] + ")";
        }, ge.to.hwb = function() {
            var t = pe(arguments), i = "";
            return t.length >= 4 && 1 !== t[3] && (i = ", " + t[3]), "hwb(" + t[0] + ", " + t[1] + "%, " + t[2] + "%" + i + ")";
        }, ge.to.keyword = function(t) {
            return me[t.slice(0, 3)];
        };
        var Me = {
            exports: {}
        }, xe = ae, Fe = {};
        for (var Ae in xe) xe.hasOwnProperty(Ae) && (Fe[xe[Ae]] = Ae);
        var ke = Me.exports = {
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
        for (var _e in ke) if (ke.hasOwnProperty(_e)) {
            if (!("channels" in ke[_e])) throw new Error("missing channels property: " + _e);
            if (!("labels" in ke[_e])) throw new Error("missing channel labels property: " + _e);
            if (ke[_e].labels.length !== ke[_e].channels) throw new Error("channel and label counts mismatch: " + _e);
            var Se = ke[_e].channels, Pe = ke[_e].labels;
            delete ke[_e].channels, delete ke[_e].labels, Object.defineProperty(ke[_e], "channels", {
                value: Se
            }), Object.defineProperty(ke[_e], "labels", {
                value: Pe
            });
        }
        ke.rgb.hsl = function(t) {
            var i, e, n = t[0] / 255, r = t[1] / 255, s = t[2] / 255, o = Math.min(n, r, s), h = Math.max(n, r, s), a = h - o;
            return h === o ? i = 0 : n === h ? i = (r - s) / a : r === h ? i = 2 + (s - n) / a : s === h && (i = 4 + (n - r) / a), 
            (i = Math.min(60 * i, 360)) < 0 && (i += 360), e = (o + h) / 2, [ i, 100 * (h === o ? 0 : e <= .5 ? a / (h + o) : a / (2 - h - o)), 100 * e ];
        }, ke.rgb.hsv = function(t) {
            var i, e, n = t[0], r = t[1], s = t[2], o = Math.min(n, r, s), h = Math.max(n, r, s), a = h - o;
            return e = 0 === h ? 0 : a / h * 1e3 / 10, h === o ? i = 0 : n === h ? i = (r - s) / a : r === h ? i = 2 + (s - n) / a : s === h && (i = 4 + (n - r) / a), 
            (i = Math.min(60 * i, 360)) < 0 && (i += 360), [ i, e, h / 255 * 1e3 / 10 ];
        }, ke.rgb.hwb = function(t) {
            var i = t[0], e = t[1], n = t[2];
            return [ ke.rgb.hsl(t)[0], 100 * (1 / 255 * Math.min(i, Math.min(e, n))), 100 * (n = 1 - 1 / 255 * Math.max(i, Math.max(e, n))) ];
        }, ke.rgb.cmyk = function(t) {
            var i, e = t[0] / 255, n = t[1] / 255, r = t[2] / 255;
            return [ 100 * ((1 - e - (i = Math.min(1 - e, 1 - n, 1 - r))) / (1 - i) || 0), 100 * ((1 - n - i) / (1 - i) || 0), 100 * ((1 - r - i) / (1 - i) || 0), 100 * i ];
        }, ke.rgb.keyword = function(t) {
            var i = Fe[t];
            if (i) return i;
            var e, n, r, s = 1 / 0;
            for (var o in xe) if (xe.hasOwnProperty(o)) {
                var h = xe[o], a = (n = t, r = h, Math.pow(n[0] - r[0], 2) + Math.pow(n[1] - r[1], 2) + Math.pow(n[2] - r[2], 2));
                a < s && (s = a, e = o);
            }
            return e;
        }, ke.keyword.rgb = function(t) {
            return xe[t];
        }, ke.rgb.xyz = function(t) {
            var i = t[0] / 255, e = t[1] / 255, n = t[2] / 255;
            return [ 100 * (.4124 * (i = i > .04045 ? Math.pow((i + .055) / 1.055, 2.4) : i / 12.92) + .3576 * (e = e > .04045 ? Math.pow((e + .055) / 1.055, 2.4) : e / 12.92) + .1805 * (n = n > .04045 ? Math.pow((n + .055) / 1.055, 2.4) : n / 12.92)), 100 * (.2126 * i + .7152 * e + .0722 * n), 100 * (.0193 * i + .1192 * e + .9505 * n) ];
        }, ke.rgb.lab = function(t) {
            var i = ke.rgb.xyz(t), e = i[0], n = i[1], r = i[2];
            return n /= 100, r /= 108.883, e = (e /= 95.047) > .008856 ? Math.pow(e, 1 / 3) : 7.787 * e + 16 / 116, 
            [ 116 * (n = n > .008856 ? Math.pow(n, 1 / 3) : 7.787 * n + 16 / 116) - 16, 500 * (e - n), 200 * (n - (r = r > .008856 ? Math.pow(r, 1 / 3) : 7.787 * r + 16 / 116)) ];
        }, ke.hsl.rgb = function(t) {
            var i, e, n, r, s, o = t[0] / 360, h = t[1] / 100, a = t[2] / 100;
            if (0 === h) return [ s = 255 * a, s, s ];
            i = 2 * a - (e = a < .5 ? a * (1 + h) : a + h - a * h), r = [ 0, 0, 0 ];
            for (var l = 0; l < 3; l++) (n = o + 1 / 3 * -(l - 1)) < 0 && n++, n > 1 && n--, 
            s = 6 * n < 1 ? i + 6 * (e - i) * n : 2 * n < 1 ? e : 3 * n < 2 ? i + (e - i) * (2 / 3 - n) * 6 : i, 
            r[l] = 255 * s;
            return r;
        }, ke.hsl.hsv = function(t) {
            var i = t[0], e = t[1] / 100, n = t[2] / 100, r = e, s = Math.max(n, .01);
            return e *= (n *= 2) <= 1 ? n : 2 - n, r *= s <= 1 ? s : 2 - s, [ i, 100 * (0 === n ? 2 * r / (s + r) : 2 * e / (n + e)), 100 * ((n + e) / 2) ];
        }, ke.hsv.rgb = function(t) {
            var i = t[0] / 60, e = t[1] / 100, n = t[2] / 100, r = Math.floor(i) % 6, s = i - Math.floor(i), o = 255 * n * (1 - e), h = 255 * n * (1 - e * s), a = 255 * n * (1 - e * (1 - s));
            switch (n *= 255, r) {
              case 0:
                return [ n, a, o ];

              case 1:
                return [ h, n, o ];

              case 2:
                return [ o, n, a ];

              case 3:
                return [ o, h, n ];

              case 4:
                return [ a, o, n ];

              case 5:
                return [ n, o, h ];
            }
        }, ke.hsv.hsl = function(t) {
            var i, e, n, r = t[0], s = t[1] / 100, o = t[2] / 100, h = Math.max(o, .01);
            return n = (2 - s) * o, e = s * h, [ r, 100 * (e = (e /= (i = (2 - s) * h) <= 1 ? i : 2 - i) || 0), 100 * (n /= 2) ];
        }, ke.hwb.rgb = function(t) {
            var i, e, n, r, s, o, h, a = t[0] / 360, l = t[1] / 100, u = t[2] / 100, c = l + u;
            switch (c > 1 && (l /= c, u /= c), n = 6 * a - (i = Math.floor(6 * a)), 0 != (1 & i) && (n = 1 - n), 
            r = l + n * ((e = 1 - u) - l), i) {
              default:
              case 6:
              case 0:
                s = e, o = r, h = l;
                break;

              case 1:
                s = r, o = e, h = l;
                break;

              case 2:
                s = l, o = e, h = r;
                break;

              case 3:
                s = l, o = r, h = e;
                break;

              case 4:
                s = r, o = l, h = e;
                break;

              case 5:
                s = e, o = l, h = r;
            }
            return [ 255 * s, 255 * o, 255 * h ];
        }, ke.cmyk.rgb = function(t) {
            var i = t[0] / 100, e = t[1] / 100, n = t[2] / 100, r = t[3] / 100;
            return [ 255 * (1 - Math.min(1, i * (1 - r) + r)), 255 * (1 - Math.min(1, e * (1 - r) + r)), 255 * (1 - Math.min(1, n * (1 - r) + r)) ];
        }, ke.xyz.rgb = function(t) {
            var i, e, n, r = t[0] / 100, s = t[1] / 100, o = t[2] / 100;
            return e = -.9689 * r + 1.8758 * s + .0415 * o, n = .0557 * r + -.204 * s + 1.057 * o, 
            i = (i = 3.2406 * r + -1.5372 * s + -.4986 * o) > .0031308 ? 1.055 * Math.pow(i, 1 / 2.4) - .055 : 12.92 * i, 
            e = e > .0031308 ? 1.055 * Math.pow(e, 1 / 2.4) - .055 : 12.92 * e, n = n > .0031308 ? 1.055 * Math.pow(n, 1 / 2.4) - .055 : 12.92 * n, 
            [ 255 * (i = Math.min(Math.max(0, i), 1)), 255 * (e = Math.min(Math.max(0, e), 1)), 255 * (n = Math.min(Math.max(0, n), 1)) ];
        }, ke.xyz.lab = function(t) {
            var i = t[0], e = t[1], n = t[2];
            return e /= 100, n /= 108.883, i = (i /= 95.047) > .008856 ? Math.pow(i, 1 / 3) : 7.787 * i + 16 / 116, 
            [ 116 * (e = e > .008856 ? Math.pow(e, 1 / 3) : 7.787 * e + 16 / 116) - 16, 500 * (i - e), 200 * (e - (n = n > .008856 ? Math.pow(n, 1 / 3) : 7.787 * n + 16 / 116)) ];
        }, ke.lab.xyz = function(t) {
            var i, e, n, r = t[0];
            i = t[1] / 500 + (e = (r + 16) / 116), n = e - t[2] / 200;
            var s = Math.pow(e, 3), o = Math.pow(i, 3), h = Math.pow(n, 3);
            return e = s > .008856 ? s : (e - 16 / 116) / 7.787, i = o > .008856 ? o : (i - 16 / 116) / 7.787, 
            n = h > .008856 ? h : (n - 16 / 116) / 7.787, [ i *= 95.047, e *= 100, n *= 108.883 ];
        }, ke.lab.lch = function(t) {
            var i, e = t[0], n = t[1], r = t[2];
            return (i = 360 * Math.atan2(r, n) / 2 / Math.PI) < 0 && (i += 360), [ e, Math.sqrt(n * n + r * r), i ];
        }, ke.lch.lab = function(t) {
            var i, e = t[0], n = t[1];
            return i = t[2] / 360 * 2 * Math.PI, [ e, n * Math.cos(i), n * Math.sin(i) ];
        }, ke.rgb.ansi16 = function(t) {
            var i = t[0], e = t[1], n = t[2], r = 1 in arguments ? arguments[1] : ke.rgb.hsv(t)[2];
            if (0 === (r = Math.round(r / 50))) return 30;
            var s = 30 + (Math.round(n / 255) << 2 | Math.round(e / 255) << 1 | Math.round(i / 255));
            return 2 === r && (s += 60), s;
        }, ke.hsv.ansi16 = function(t) {
            return ke.rgb.ansi16(ke.hsv.rgb(t), t[2]);
        }, ke.rgb.ansi256 = function(t) {
            var i = t[0], e = t[1], n = t[2];
            return i === e && e === n ? i < 8 ? 16 : i > 248 ? 231 : Math.round((i - 8) / 247 * 24) + 232 : 16 + 36 * Math.round(i / 255 * 5) + 6 * Math.round(e / 255 * 5) + Math.round(n / 255 * 5);
        }, ke.ansi16.rgb = function(t) {
            var i = t % 10;
            if (0 === i || 7 === i) return t > 50 && (i += 3.5), [ i = i / 10.5 * 255, i, i ];
            var e = .5 * (1 + ~~(t > 50));
            return [ (1 & i) * e * 255, (i >> 1 & 1) * e * 255, (i >> 2 & 1) * e * 255 ];
        }, ke.ansi256.rgb = function(t) {
            if (t >= 232) {
                var i = 10 * (t - 232) + 8;
                return [ i, i, i ];
            }
            var e;
            return t -= 16, [ Math.floor(t / 36) / 5 * 255, Math.floor((e = t % 36) / 6) / 5 * 255, e % 6 / 5 * 255 ];
        }, ke.rgb.hex = function(t) {
            var i = (((255 & Math.round(t[0])) << 16) + ((255 & Math.round(t[1])) << 8) + (255 & Math.round(t[2]))).toString(16).toUpperCase();
            return "000000".substring(i.length) + i;
        }, ke.hex.rgb = function(t) {
            var i = t.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
            if (!i) return [ 0, 0, 0 ];
            var e = i[0];
            3 === i[0].length && (e = e.split("").map((function(t) {
                return t + t;
            })).join(""));
            var n = parseInt(e, 16);
            return [ n >> 16 & 255, n >> 8 & 255, 255 & n ];
        }, ke.rgb.hcg = function(t) {
            var i, e = t[0] / 255, n = t[1] / 255, r = t[2] / 255, s = Math.max(Math.max(e, n), r), o = Math.min(Math.min(e, n), r), h = s - o;
            return i = h <= 0 ? 0 : s === e ? (n - r) / h % 6 : s === n ? 2 + (r - e) / h : 4 + (e - n) / h + 4, 
            i /= 6, [ 360 * (i %= 1), 100 * h, 100 * (h < 1 ? o / (1 - h) : 0) ];
        }, ke.hsl.hcg = function(t) {
            var i = t[1] / 100, e = t[2] / 100, n = 1, r = 0;
            return (n = e < .5 ? 2 * i * e : 2 * i * (1 - e)) < 1 && (r = (e - .5 * n) / (1 - n)), 
            [ t[0], 100 * n, 100 * r ];
        }, ke.hsv.hcg = function(t) {
            var i = t[1] / 100, e = t[2] / 100, n = i * e, r = 0;
            return n < 1 && (r = (e - n) / (1 - n)), [ t[0], 100 * n, 100 * r ];
        }, ke.hcg.rgb = function(t) {
            var i = t[0] / 360, e = t[1] / 100, n = t[2] / 100;
            if (0 === e) return [ 255 * n, 255 * n, 255 * n ];
            var r, s = [ 0, 0, 0 ], o = i % 1 * 6, h = o % 1, a = 1 - h;
            switch (Math.floor(o)) {
              case 0:
                s[0] = 1, s[1] = h, s[2] = 0;
                break;

              case 1:
                s[0] = a, s[1] = 1, s[2] = 0;
                break;

              case 2:
                s[0] = 0, s[1] = 1, s[2] = h;
                break;

              case 3:
                s[0] = 0, s[1] = a, s[2] = 1;
                break;

              case 4:
                s[0] = h, s[1] = 0, s[2] = 1;
                break;

              default:
                s[0] = 1, s[1] = 0, s[2] = a;
            }
            return r = (1 - e) * n, [ 255 * (e * s[0] + r), 255 * (e * s[1] + r), 255 * (e * s[2] + r) ];
        }, ke.hcg.hsv = function(t) {
            var i = t[1] / 100, e = i + t[2] / 100 * (1 - i), n = 0;
            return e > 0 && (n = i / e), [ t[0], 100 * n, 100 * e ];
        }, ke.hcg.hsl = function(t) {
            var i = t[1] / 100, e = t[2] / 100 * (1 - i) + .5 * i, n = 0;
            return e > 0 && e < .5 ? n = i / (2 * e) : e >= .5 && e < 1 && (n = i / (2 * (1 - e))), 
            [ t[0], 100 * n, 100 * e ];
        }, ke.hcg.hwb = function(t) {
            var i = t[1] / 100, e = i + t[2] / 100 * (1 - i);
            return [ t[0], 100 * (e - i), 100 * (1 - e) ];
        }, ke.hwb.hcg = function(t) {
            var i = t[1] / 100, e = 1 - t[2] / 100, n = e - i, r = 0;
            return n < 1 && (r = (e - n) / (1 - n)), [ t[0], 100 * n, 100 * r ];
        }, ke.apple.rgb = function(t) {
            return [ t[0] / 65535 * 255, t[1] / 65535 * 255, t[2] / 65535 * 255 ];
        }, ke.rgb.apple = function(t) {
            return [ t[0] / 255 * 65535, t[1] / 255 * 65535, t[2] / 255 * 65535 ];
        }, ke.gray.rgb = function(t) {
            return [ t[0] / 100 * 255, t[0] / 100 * 255, t[0] / 100 * 255 ];
        }, ke.gray.hsl = ke.gray.hsv = function(t) {
            return [ 0, 0, t[0] ];
        }, ke.gray.hwb = function(t) {
            return [ 0, 100, t[0] ];
        }, ke.gray.cmyk = function(t) {
            return [ 0, 0, 0, t[0] ];
        }, ke.gray.lab = function(t) {
            return [ t[0], 0, 0 ];
        }, ke.gray.hex = function(t) {
            var i = 255 & Math.round(t[0] / 100 * 255), e = ((i << 16) + (i << 8) + i).toString(16).toUpperCase();
            return "000000".substring(e.length) + e;
        }, ke.rgb.gray = function(t) {
            return [ (t[0] + t[1] + t[2]) / 3 / 255 * 100 ];
        };
        var Oe = Me.exports;
        function Ce(t) {
            var i = function() {
                for (var t = {}, i = Object.keys(Oe), e = i.length, n = 0; n < e; n++) t[i[n]] = {
                    distance: -1,
                    parent: null
                };
                return t;
            }(), e = [ t ];
            for (i[t].distance = 0; e.length; ) for (var n = e.pop(), r = Object.keys(Oe[n]), s = r.length, o = 0; o < s; o++) {
                var h = r[o], a = i[h];
                -1 === a.distance && (a.distance = i[n].distance + 1, a.parent = n, e.unshift(h));
            }
            return i;
        }
        function Ie(t, i) {
            return function(e) {
                return i(t(e));
            };
        }
        function Te(t, i) {
            for (var e = [ i[t].parent, t ], n = Oe[i[t].parent][t], r = i[t].parent; i[r].parent; ) e.unshift(i[r].parent), 
            n = Ie(Oe[i[r].parent][r], n), r = i[r].parent;
            return n.conversion = e, n;
        }
        var De = Me.exports, Le = function(t) {
            for (var i = Ce(t), e = {}, n = Object.keys(i), r = n.length, s = 0; s < r; s++) {
                var o = n[s];
                null !== i[o].parent && (e[o] = Te(o, i));
            }
            return e;
        }, Ue = {};
        Object.keys(De).forEach((function(t) {
            Ue[t] = {}, Object.defineProperty(Ue[t], "channels", {
                value: De[t].channels
            }), Object.defineProperty(Ue[t], "labels", {
                value: De[t].labels
            });
            var i = Le(t);
            Object.keys(i).forEach((function(e) {
                var n = i[e];
                Ue[t][e] = function(t) {
                    var i = function(i) {
                        if (null == i) return i;
                        arguments.length > 1 && (i = Array.prototype.slice.call(arguments));
                        var e = t(i);
                        if ("object" == typeof e) for (var n = e.length, r = 0; r < n; r++) e[r] = Math.round(e[r]);
                        return e;
                    };
                    return "conversion" in t && (i.conversion = t.conversion), i;
                }(n), Ue[t][e].raw = function(t) {
                    var i = function(i) {
                        return null == i ? i : (arguments.length > 1 && (i = Array.prototype.slice.call(arguments)), 
                        t(i));
                    };
                    return "conversion" in t && (i.conversion = t.conversion), i;
                }(n);
            }));
        }));
        var Ee = Ue, je = he.exports, Re = Ee, ze = [].slice, Ne = [ "keyword", "gray", "hex" ], We = {};
        Object.keys(Re).forEach((function(t) {
            We[ze.call(Re[t].labels).sort().join("")] = t;
        }));
        var He = {};
        function Ve(t, i) {
            if (!(this instanceof Ve)) return new Ve(t, i);
            if (i && i in Ne && (i = null), i && !(i in Re)) throw new Error("Unknown model: " + i);
            var e, n;
            if (null == t) this.model = "rgb", this.color = [ 0, 0, 0 ], this.valpha = 1; else if (t instanceof Ve) this.model = t.model, 
            this.color = t.color.slice(), this.valpha = t.valpha; else if ("string" == typeof t) {
                var r = je.get(t);
                if (null === r) throw new Error("Unable to parse color from string: " + t);
                this.model = r.model, n = Re[this.model].channels, this.color = r.value.slice(0, n), 
                this.valpha = "number" == typeof r.value[n] ? r.value[n] : 1;
            } else if (t.length) {
                this.model = i || "rgb", n = Re[this.model].channels;
                var s = ze.call(t, 0, n);
                this.color = qe(s, n), this.valpha = "number" == typeof t[n] ? t[n] : 1;
            } else if ("number" == typeof t) t &= 16777215, this.model = "rgb", this.color = [ t >> 16 & 255, t >> 8 & 255, 255 & t ], 
            this.valpha = 1; else {
                this.valpha = 1;
                var o = Object.keys(t);
                "alpha" in t && (o.splice(o.indexOf("alpha"), 1), this.valpha = "number" == typeof t.alpha ? t.alpha : 0);
                var h = o.sort().join("");
                if (!(h in We)) throw new Error("Unable to parse color from object: " + JSON.stringify(t));
                this.model = We[h];
                var a = Re[this.model].labels, l = [];
                for (e = 0; e < a.length; e++) l.push(t[a[e]]);
                this.color = qe(l);
            }
            if (He[this.model]) for (n = Re[this.model].channels, e = 0; e < n; e++) {
                var u = He[this.model][e];
                u && (this.color[e] = u(this.color[e]));
            }
            this.valpha = Math.max(0, Math.min(1, this.valpha)), Object.freeze && Object.freeze(this);
        }
        function $e(t, i, e) {
            return (t = Array.isArray(t) ? t : [ t ]).forEach((function(t) {
                (He[t] || (He[t] = []))[i] = e;
            })), t = t[0], function(n) {
                var r;
                return arguments.length ? (e && (n = e(n)), (r = this[t]()).color[i] = n, r) : (r = this[t]().color[i], 
                e && (r = e(r)), r);
            };
        }
        function Ge(t) {
            return function(i) {
                return Math.max(0, Math.min(t, i));
            };
        }
        function Je(t) {
            return Array.isArray(t) ? t : [ t ];
        }
        function qe(t, i) {
            for (var e = 0; e < i; e++) "number" != typeof t[e] && (t[e] = 0);
            return t;
        }
        Ve.prototype = {
            toString: function() {
                return this.string();
            },
            toJSON: function() {
                return this[this.model]();
            },
            string: function(t) {
                var i = this.model in je.to ? this : this.rgb(), e = 1 === (i = i.round("number" == typeof t ? t : 1)).valpha ? i.color : i.color.concat(this.valpha);
                return je.to[i.model](e);
            },
            percentString: function(t) {
                var i = this.rgb().round("number" == typeof t ? t : 1), e = 1 === i.valpha ? i.color : i.color.concat(this.valpha);
                return je.to.rgb.percent(e);
            },
            array: function() {
                return 1 === this.valpha ? this.color.slice() : this.color.concat(this.valpha);
            },
            object: function() {
                for (var t = {}, i = Re[this.model].channels, e = Re[this.model].labels, n = 0; n < i; n++) t[e[n]] = this.color[n];
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
                return t = Math.max(t || 0, 0), new Ve(this.color.map(function(t) {
                    return function(i) {
                        return function(t, i) {
                            return Number(t.toFixed(i));
                        }(i, t);
                    };
                }(t)).concat(this.valpha), this.model);
            },
            alpha: function(t) {
                return arguments.length ? new Ve(this.color.concat(Math.max(0, Math.min(1, t))), this.model) : this.valpha;
            },
            red: $e("rgb", 0, Ge(255)),
            green: $e("rgb", 1, Ge(255)),
            blue: $e("rgb", 2, Ge(255)),
            hue: $e([ "hsl", "hsv", "hsl", "hwb", "hcg" ], 0, (function(t) {
                return (t % 360 + 360) % 360;
            })),
            saturationl: $e("hsl", 1, Ge(100)),
            lightness: $e("hsl", 2, Ge(100)),
            saturationv: $e("hsv", 1, Ge(100)),
            value: $e("hsv", 2, Ge(100)),
            chroma: $e("hcg", 1, Ge(100)),
            gray: $e("hcg", 2, Ge(100)),
            white: $e("hwb", 1, Ge(100)),
            wblack: $e("hwb", 2, Ge(100)),
            cyan: $e("cmyk", 0, Ge(100)),
            magenta: $e("cmyk", 1, Ge(100)),
            yellow: $e("cmyk", 2, Ge(100)),
            black: $e("cmyk", 3, Ge(100)),
            x: $e("xyz", 0, Ge(100)),
            y: $e("xyz", 1, Ge(100)),
            z: $e("xyz", 2, Ge(100)),
            l: $e("lab", 0, Ge(100)),
            a: $e("lab", 1),
            b: $e("lab", 2),
            keyword: function(t) {
                return arguments.length ? new Ve(t) : Re[this.model].keyword(this.color);
            },
            hex: function(t) {
                return arguments.length ? new Ve(t) : je.to.hex(this.rgb().round().color);
            },
            rgbNumber: function() {
                var t = this.rgb().color;
                return (255 & t[0]) << 16 | (255 & t[1]) << 8 | 255 & t[2];
            },
            luminosity: function() {
                for (var t = this.rgb().color, i = [], e = 0; e < t.length; e++) {
                    var n = t[e] / 255;
                    i[e] = n <= .03928 ? n / 12.92 : Math.pow((n + .055) / 1.055, 2.4);
                }
                return .2126 * i[0] + .7152 * i[1] + .0722 * i[2];
            },
            contrast: function(t) {
                var i = this.luminosity(), e = t.luminosity();
                return i > e ? (i + .05) / (e + .05) : (e + .05) / (i + .05);
            },
            level: function(t) {
                var i = this.contrast(t);
                return i >= 7.1 ? "AAA" : i >= 4.5 ? "AA" : "";
            },
            isDark: function() {
                var t = this.rgb().color;
                return (299 * t[0] + 587 * t[1] + 114 * t[2]) / 1e3 < 128;
            },
            isLight: function() {
                return !this.isDark();
            },
            negate: function() {
                for (var t = this.rgb(), i = 0; i < 3; i++) t.color[i] = 255 - t.color[i];
                return t;
            },
            lighten: function(t) {
                var i = this.hsl();
                return i.color[2] += i.color[2] * t, i;
            },
            darken: function(t) {
                var i = this.hsl();
                return i.color[2] -= i.color[2] * t, i;
            },
            saturate: function(t) {
                var i = this.hsl();
                return i.color[1] += i.color[1] * t, i;
            },
            desaturate: function(t) {
                var i = this.hsl();
                return i.color[1] -= i.color[1] * t, i;
            },
            whiten: function(t) {
                var i = this.hwb();
                return i.color[1] += i.color[1] * t, i;
            },
            blacken: function(t) {
                var i = this.hwb();
                return i.color[2] += i.color[2] * t, i;
            },
            grayscale: function() {
                var t = this.rgb().color, i = .3 * t[0] + .59 * t[1] + .11 * t[2];
                return Ve.rgb(i, i, i);
            },
            fade: function(t) {
                return this.alpha(this.valpha - this.valpha * t);
            },
            opaquer: function(t) {
                return this.alpha(this.valpha + this.valpha * t);
            },
            rotate: function(t) {
                var i = this.hsl(), e = i.color[0];
                return e = (e = (e + t) % 360) < 0 ? 360 + e : e, i.color[0] = e, i;
            },
            mix: function(t, i) {
                if (!t || !t.rgb) throw new Error('Argument to "mix" was not a Color instance, but rather an instance of ' + typeof t);
                var e = t.rgb(), n = this.rgb(), r = void 0 === i ? .5 : i, s = 2 * r - 1, o = e.alpha() - n.alpha(), h = ((s * o == -1 ? s : (s + o) / (1 + s * o)) + 1) / 2, a = 1 - h;
                return Ve.rgb(h * e.red() + a * n.red(), h * e.green() + a * n.green(), h * e.blue() + a * n.blue(), e.alpha() * r + n.alpha() * (1 - r));
            }
        }, Object.keys(Re).forEach((function(t) {
            if (-1 === Ne.indexOf(t)) {
                var i = Re[t].channels;
                Ve.prototype[t] = function() {
                    if (this.model === t) return new Ve(this);
                    if (arguments.length) return new Ve(arguments, t);
                    var e = "number" == typeof arguments[i] ? i : this.valpha;
                    return new Ve(Je(Re[this.model][t].raw(this.color)).concat(e), t);
                }, Ve[t] = function(e) {
                    return "number" == typeof e && (e = qe(ze.call(arguments), i)), new Ve(e, t);
                };
            }
        }));
        var Be = Ve;
        function Xe(t, i) {
            const e = {}, n = {}, r = [];
            let s = 0;
            function o(i) {
                r.push(t[i]), s++;
            }
            function h(t, i, e) {
                const s = n[t];
                return delete n[t], n[i] = s, r[s].geometry[0].pop(), r[s].geometry[0] = r[s].geometry[0].concat(e[0]), 
                s;
            }
            function a(t, i, n) {
                const s = e[i];
                return delete e[i], e[t] = s, r[s].geometry[0].shift(), r[s].geometry[0] = n[0].concat(r[s].geometry[0]), 
                s;
            }
            function l(t, i, e) {
                const n = e ? i[0][i[0].length - 1] : i[0][0];
                return `${t}:${n.x}:${n.y}`;
            }
            for (let u = 0; u < t.length; u++) {
                const c = t[u], f = c.geometry;
                if (!f) continue;
                const d = c.properties[i] ? c.properties[i].toString() : null;
                if (!d) {
                    o(u);
                    continue;
                }
                const y = l(d, f), p = l(d, f, !0);
                if (y in n && p in e && n[y] !== e[p]) {
                    const t = a(y, p, f), i = h(y, p, r[t].geometry);
                    delete e[y], delete n[p], n[l(d, r[i].geometry, !0)] = i, r[t].geometry = null;
                } else y in n ? h(y, p, f) : p in e ? a(y, p, f) : (o(u), e[y] = s - 1, n[p] = s - 1);
            }
            return r.filter(t => t.geometry);
        }
        const Ze = 14;
        class Ye extends Ft {
            static needMerge(t) {
                return t.mergeOnProperty && ("line" === t.textPlacement || "line" === t.markerPlacement);
            }
            static mergeLineFeatures(t, i, e) {
                const n = function(t, i, e) {
                    const n = Ft.genFnTypes(i), {mergeOnPropertyFn: r} = n;
                    if (!i.mergeOnProperty || "line" !== i.textPlacement && "line" !== i.markerPlacement) return [];
                    if (!(s = i.mergeOnProperty, wt(s) || "string" != typeof s && (null === s.constructor || s.constructor !== String) || "line" !== i.textPlacement && "line" !== i.markerPlacement)) return [ {
                        features: t,
                        property: i.mergeOnProperty
                    } ];
                    var s;
                    const o = [], h = {}, a = [];
                    for (let n = 0; n < t.length; n++) {
                        t[n].__index = n;
                        const s = t[n].properties = t[n].properties || {};
                        s.$layer = t[n].layer, s.$type = t[n].type;
                        let l = i.markerPlacement;
                        "line" !== l && (l = i.textPlacement);
                        const u = r ? r(e, s) : i.mergeOnProperty;
                        "line" !== l || wt(u) ? a.push(t[n]) : (void 0 === h[u] && (h[u] = o.length, o.push({
                            features: [],
                            property: u
                        })), o[h[u]].features.push(t[n]));
                    }
                    a.length && o.push({
                        features: a
                    });
                    return o;
                }(t, i, e);
                if (n.length) {
                    const i = [];
                    for (let e = 0; e < n.length; e++) n[e].property ? i.push(Xe(n[e].features, n[e].property)) : i.push(t);
                    if (1 === i.length) return i[0];
                    {
                        let t = [];
                        for (let e = 0; e < i.length; e++) t = t.concat(i[e]);
                        return t.sort((t, i) => t.__index - i.__index), t;
                    }
                }
            }
            static splitPointSymbol(t, i = 0) {
                const e = [];
                if (Array.isArray(t)) {
                    const i = t;
                    for (let t = 0; t < i.length; t++) i[t] && e.push(...Ye.splitPointSymbol(i[t], t));
                    return e;
                }
                let n = null, r = null;
                for (const i in t) 0 === i.indexOf("marker") ? (n = n || {}, n[i] = t[i]) : 0 === i.indexOf("text") && (r = r || {}, 
                r[i] = t[i]);
                return n && (n.isIconText = !0, t.mergeOnProperty && (n.mergeOnProperty = t.mergeOnProperty), 
                e.push(n)), r && (n && (r.textPlacement = n.markerPlacement, r.textSpacing = n.markerSpacing, 
                r.isIconText = !0), t.mergeOnProperty && (r.mergeOnProperty = t.mergeOnProperty), 
                e.push(r)), void 0 !== t.visible && (n && (n.visible = t.visible), r && (r.visible = t.visible)), 
                n && (n.markerTextFit && r && (n.text = {}, n.text.textName = r.textName, n.text.textSize = r.textSize), 
                n.index = {
                    index: i,
                    type: 0
                }), r && (r.index = {
                    index: i,
                    type: 1
                }), e;
            }
            static isAtlasLoaded(t, i) {
                const {icon: e, glyph: n} = t, {iconAtlas: r, glyphAtlas: s} = i;
                if (e && (!r || !r.positions[e.url])) return !1;
                if (n) {
                    if (!s || !s.positions[n.font]) return !1;
                    const t = s.positions[n.font], {text: i} = n;
                    for (let e = 0; e < i.length; e++) if (!t[i.charCodeAt(e)]) return !1;
                }
                return !0;
            }
            constructor(t, i, e) {
                super(t, i, e);
            }
            createStyledVector(t, i, e, n, r, s) {
                const o = new Wi(t, this.symbolDef, i, e, n), h = o.getIconAndGlyph();
                if (h.icon && !this.options.atlas) {
                    const {url: t, size: i} = h.icon;
                    r[t] || (r[t] = h.icon.size), r[t][0] < i[0] && (r[t][0] = i[0]), r[t][1] < i[1] && (r[t][1] = i[1]);
                }
                if (h.glyph && !this.options.atlas) {
                    const {font: t, text: e} = h.glyph, n = s[t] = s[t] || {};
                    for (let t = 0; t < e.length; t++) n[e.charCodeAt(t)] = 1;
                    "line" === i.textPlacement && (s.options = {
                        isCharsCompact: !1
                    });
                }
                return this.options.allowEmptyPack || h.icon || h.glyph ? o : null;
            }
            getFormat(t) {
                const i = void 0 !== t.textName, e = i ? function(t) {
                    return "line" !== t.textPlacement || t.isIconText ? [ {
                        type: Int16Array,
                        width: 3,
                        name: "aPosition"
                    }, {
                        type: Int16Array,
                        width: 2,
                        name: "aShape"
                    }, {
                        type: Uint16Array,
                        width: 2,
                        name: "aTexCoord"
                    }, {
                        type: Uint8Array,
                        width: 1,
                        name: "aCount"
                    } ] : [ {
                        type: Int16Array,
                        width: 3,
                        name: "aPosition"
                    }, {
                        type: Int16Array,
                        width: 2,
                        name: "aShape"
                    }, {
                        type: Uint16Array,
                        width: 2,
                        name: "aTexCoord"
                    }, {
                        type: Uint8Array,
                        width: 1,
                        name: "aCount"
                    }, {
                        type: Int16Array,
                        width: 2,
                        name: "aGlyphOffset"
                    }, {
                        type: Uint16Array,
                        width: 3,
                        name: "aSegment"
                    }, {
                        type: Uint8Array,
                        width: 1,
                        name: "aVertical"
                    } ];
                }(t) : [ {
                    type: Int16Array,
                    width: 3,
                    name: "aPosition"
                }, {
                    type: Int16Array,
                    width: 2,
                    name: "aShape"
                }, {
                    type: Uint16Array,
                    width: 2,
                    name: "aTexCoord"
                } ];
                i ? e.push(...this.q()) : e.push(...this.B());
                const {markerOpacityFn: n, textOpacityFn: r, markerPitchAlignmentFn: s, textPitchAlignmentFn: o, markerRotationAlignmentFn: h, textRotationAlignmentFn: a, markerRotationFn: l, textRotationFn: u, markerAllowOverlapFn: c, textAllowOverlapFn: f, markerIgnorePlacementFn: d, textIgnorePlacementFn: y} = this.j;
                return (n || r) && e.push({
                    type: Uint8Array,
                    width: 1,
                    name: "aColorOpacity"
                }), (s || o) && e.push({
                    type: Uint8Array,
                    width: 1,
                    name: "aPitchAlign"
                }), (h || a) && e.push({
                    type: Uint8Array,
                    width: 1,
                    name: "aRotationAlign"
                }), (l || u) && e.push({
                    type: Uint16Array,
                    width: 1,
                    name: "aRotation"
                }), (c || f || d || y) && e.push({
                    type: Uint8Array,
                    width: 1,
                    name: "aOverlap"
                }), e;
            }
            q() {
                const {textFillFn: t, textSizeFn: i, textHaloFillFn: e, textHaloRadiusFn: n, textHaloOpacityFn: r, textDxFn: s, textDyFn: o} = this.j, h = [];
                return t && h.push({
                    type: Uint8Array,
                    width: 4,
                    name: "aTextFill"
                }), i && h.push({
                    type: Uint8Array,
                    width: 1,
                    name: "aTextSize"
                }), e && h.push({
                    type: Uint8Array,
                    width: 4,
                    name: "aTextHaloFill"
                }), n && h.push({
                    type: Uint8Array,
                    width: 1,
                    name: "aTextHaloRadius"
                }), r && h.push({
                    type: Uint8Array,
                    width: 1,
                    name: "aTextHaloOpacity"
                }), s && h.push({
                    type: Int8Array,
                    width: 1,
                    name: "aTextDx"
                }), o && h.push({
                    type: Int8Array,
                    width: 1,
                    name: "aTextDy"
                }), h;
            }
            B() {
                const {markerWidthFn: t, markerHeightFn: i, markerDxFn: e, markerDyFn: n} = this.j, r = [];
                return t && r.push({
                    type: Uint8Array,
                    width: 1,
                    name: "aMarkerWidth"
                }), i && r.push({
                    type: Uint8Array,
                    width: 1,
                    name: "aMarkerHeight"
                }), e && r.push({
                    type: Int8Array,
                    width: 1,
                    name: "aMarkerDx"
                }), n && r.push({
                    type: Int8Array,
                    width: 1,
                    name: "aMarkerDy"
                }), r;
            }
            createDataPack() {
                if (!this.iconAtlas && !this.glyphAtlas) {
                    if (!this.options.allowEmptyPack) return null;
                    this.empty = !0;
                }
                this.lineVertex = [];
                const t = super.createDataPack.apply(this, arguments);
                return t ? (t.lineVertex = new Int16Array(this.lineVertex), t.buffers.push(t.lineVertex.buffer), 
                t) : null;
            }
            placeVector(t, i) {
                const e = t.getShape(this.iconAtlas, this.glyphAtlas);
                if (!this.options.allowEmptyPack && !e) return;
                const n = this.X(t, e, i);
                if (0 === n.length) return;
                const r = this.data;
                let s = this.data.aPosition.length / 3;
                const o = t.symbol, h = t.feature.properties, a = "line" === o.textPlacement && !o.isIconText, l = void 0 !== o.textName, u = l && a && function(t) {
                    let i = 0;
                    for (let e = 0; e < t.length; e++) {
                        if (Fi(t.charAt(e).charCodeAt(0))) i = 0; else if (i++, i >= 1) return !1;
                    }
                    return !0;
                }(t.getIconAndGlyph().glyph.text) ? 1 : 0, {textFillFn: c, textSizeFn: f, textHaloFillFn: d, textHaloRadiusFn: y, textHaloOpacityFn: p, textDxFn: m, textDyFn: v, textPitchAlignmentFn: g, textRotationAlignmentFn: w, textRotationFn: b, textAllowOverlapFn: x, textIgnorePlacementFn: F, textOpacityFn: A, markerWidthFn: k, markerHeightFn: _, markerDxFn: S, markerDyFn: P, markerPitchAlignmentFn: O, markerRotationAlignmentFn: C, markerRotationFn: I, markerAllowOverlapFn: T, markerIgnorePlacementFn: D, markerOpacityFn: L} = this.j;
                let U, j, R, z, N, W, H, V, $, G, J, q, B, X, Z, Y, K;
                if (l) {
                    const i = t.getIconAndGlyph().glyph.font;
                    U = function(t, i, e) {
                        const n = t.positionedGlyphs, r = [];
                        for (let s = 0; s < n.length; s++) {
                            const o = n[s], h = e[o.glyph];
                            if (!h) continue;
                            const a = h.rect;
                            if (!a) continue;
                            const l = 4, u = h.metrics.advance / 2, c = h.metrics.height / 2, f = i ? [ o.x + u, 0 ] : [ 0, 0 ], d = i ? [ 0, o.y - c ] : [ o.x + u, o.y - c ], y = h.metrics.left - l - u + d[0], p = h.metrics.top - l + d[1], m = y + a.w, v = p + a.h, g = new E(y, p), w = new E(m, p), b = new E(y, v), M = new E(m, v);
                            if (i && o.vertical) {
                                const t = new E(-u, u), i = -Math.PI / 2, e = new E(5, 0);
                                g.O(i, t).m(e), w.O(i, t).m(e), b.O(i, t).m(e), M.O(i, t).m(e);
                            }
                            r.push({
                                tl: g,
                                tr: w,
                                bl: b,
                                br: M,
                                tex: a,
                                writingMode: t.writingMode,
                                glyphOffset: f
                            });
                        }
                        return r;
                    }(e.horizontal, a, this.glyphAtlas.positions[i]), c && (j = c(null, h), M(j) ? j = [ 0, 0, 0, 0 ] : (j = Array.isArray(j) ? j.map(t => 255 * t) : Be(j).array(), 
                    3 === j.length && j.push(255))), f && (R = f(this.options.zoom, h), wt(R) && (R = Ze)), 
                    d && (z = d(null, h), z = Array.isArray(z) ? z.map(t => 255 * t) : Be(z).array(), 
                    3 === z.length && z.push(255)), y && (N = y(null, h)), p && (W = 255 * p(null, h)), 
                    m && (H = m(null, h) || 0), v && (V = v(null, h) || 0), g && (B = +("map" === g(null, h))), 
                    w && (X = +("map" === w(null, h))), b && (Z = bt(b(null, h), 0, 360) * Math.PI / 180);
                } else U = e ? function(t) {
                    const i = t.image, e = t.top - 1 / i.pixelRatio, n = t.left - 1 / i.pixelRatio, r = t.bottom + 1 / i.pixelRatio, s = t.right + 1 / i.pixelRatio;
                    let o, h, a, l;
                    return o = new E(n, e), h = new E(s, e), a = new E(s, r), l = new E(n, r), [ {
                        tl: o,
                        tr: h,
                        bl: l,
                        br: a,
                        tex: {
                            x: i.tl[0],
                            y: i.tl[1],
                            w: i.displaySize[0],
                            h: i.displaySize[1]
                        },
                        writingMode: void 0,
                        glyphOffset: [ 0, 0 ]
                    } ];
                }(e) : function() {
                    const t = new E(0, 0), i = new E(0, 0), e = new E(0, 0);
                    return [ {
                        tl: t,
                        tr: i,
                        bl: new E(0, 0),
                        br: e,
                        tex: {
                            x: 0,
                            y: 0,
                            w: 0,
                            h: 0
                        },
                        writingMode: void 0,
                        glyphOffset: [ 0, 0 ]
                    } ];
                }(), k && ($ = k(null, h)), _ && (G = _(null, h)), S && (J = S(null, h)), P && (q = P(null, h)), 
                O && (B = +("map" === O(null, h))), C && (X = +("map" === C(null, h))), I && (Z = bt(I(null, h), 0, 360) * Math.PI / 180);
                const Q = T || x;
                Q && (Y = Q(null, h) || 0);
                const tt = D || F;
                let it;
                tt && (K = tt(null, h) || 0);
                const et = A || L;
                et && (it = 255 * et(this.options.zoom, h));
                const nt = this.options.EXTENT, rt = U.length, st = this.getAltitude(t.feature.properties);
                for (let t = 0; t < n.length; t++) {
                    const i = n[t];
                    if (nt !== 1 / 0 && gt(i, nt)) continue;
                    const e = i.x, o = i.y, h = U.length;
                    for (let t = 0; t < h; t++) {
                        const n = U[t], {tl: h, tr: c, bl: f, br: d, tex: y} = n;
                        this.Z(r, e, o, st, 10 * h.x, 10 * h.y, y.x, y.y + y.h), l && this.Y(r, a, rt, n.glyphOffset, i, u), 
                        this.K(r, j, R, z, N, W, H, V, $, G, J, q, it, B, X, Z, Y, K), this.Z(r, e, o, st, 10 * c.x, 10 * c.y, y.x + y.w, y.y + y.h), 
                        l && this.Y(r, a, rt, n.glyphOffset, i, u), this.K(r, j, R, z, N, W, H, V, $, G, J, q, it, B, X, Z, Y, K), 
                        this.Z(r, e, o, st, 10 * f.x, 10 * f.y, y.x, y.y), l && this.Y(r, a, rt, n.glyphOffset, i, u), 
                        this.K(r, j, R, z, N, W, H, V, $, G, J, q, it, B, X, Z, Y, K), this.Z(r, e, o, st, 10 * d.x, 10 * d.y, y.x + y.w, y.y), 
                        l && this.Y(r, a, rt, n.glyphOffset, i, u), this.K(r, j, R, z, N, W, H, V, $, G, J, q, it, B, X, Z, Y, K), 
                        this.addElements(s, s + 1, s + 2), this.addElements(s + 1, s + 2, s + 3), s += 4;
                        const p = Math.max(Math.abs(e), Math.abs(o), Math.abs(st));
                        p > this.maxPos && (this.maxPos = p);
                    }
                }
            }
            Z(t, i, e, n, r, s, o, h) {
                t.aPosition.push(i, e, n), t.aShape.push(r, s), t.aTexCoord.push(o, h);
            }
            Y(t, i, e, n, r, s) {
                if (t.aCount.push(e), i) {
                    t.aGlyphOffset.push(n[0], n[1]);
                    const i = r.startIndex;
                    t.aSegment.push(r.segment + i, i, r.line.length), t.aVertical.push(s);
                }
            }
            K(t, i, e, n, r, s, o, h, a, l, u, c, f, d, y, p, m, v) {
                const {textFillFn: g, textSizeFn: w, textHaloFillFn: b, textHaloRadiusFn: M, textHaloOpacityFn: x, textDxFn: F, textDyFn: A, textPitchAlignmentFn: k, textRotationAlignmentFn: _, textRotationFn: S, textAllowOverlapFn: P, textIgnorePlacementFn: O, textOpacityFn: C, markerWidthFn: I, markerHeightFn: T, markerDxFn: D, markerDyFn: L, markerPitchAlignmentFn: U, markerRotationAlignmentFn: E, markerRotationFn: j, markerAllowOverlapFn: R, markerIgnorePlacementFn: z, markerOpacityFn: N} = this.j;
                g && t.aTextFill.push(...i), w && t.aTextSize.push(e), b && t.aTextHaloFill.push(...n), 
                M && t.aTextHaloRadius.push(r), x && t.aTextHaloOpacity.push(s), F && t.aTextDx.push(o), 
                A && t.aTextDy.push(h), I && t.aMarkerWidth.push(a), T && t.aMarkerHeight.push(l), 
                D && t.aMarkerDx.push(u), L && t.aMarkerDy.push(c);
                (N || C) && t.aColorOpacity.push(f), (k || U) && t.aPitchAlign.push(d), (E || _) && t.aRotationAlign.push(y), 
                (j || S) && t.aRotation.push(9362 * p);
                const W = R || P, H = z || O;
                if (W || H) {
                    const i = (W ? 8 : 0) + 4 * m, e = (H ? 2 : 0) + v;
                    t.aOverlap.push(i + e);
                }
                r > 0 && (this.properties.hasHalo = 1);
            }
            X(t, i, e) {
                const {feature: n, symbol: r} = t, s = this.tt(r), o = n.properties, {markerSpacingFn: h, textSpacingFn: a} = this.j, l = ((h ? h(null, o) : r.markerSpacing) || (a ? a(null, o) : r.textSpacing) || 250) * e, u = this.options.EXTENT;
                return function(t, i, e, n, r, s, o) {
                    const {feature: h, size: a, symbol: l} = t, u = a ? 24 : 0, c = n * (a ? a[0] / u : 1), f = [];
                    if ("line" === s) {
                        let t = h.geometry;
                        r && (t = Vi(h.geometry, 0, 0, r, r));
                        for (let n = 0; n < t.length; n++) {
                            const s = Ji(t[n], o, oe, l.isIconText ? null : e.vertical || e.horizontal || e, null, u, l.isIconText ? 1 : c, 1, r || 1 / 0);
                            if (l.textPlacement && !l.isIconText) for (let t = 0; t < s.length; t++) s[t].startIndex = i.length / 3;
                            if (f.push.apply(f, s), l.textPlacement && !l.isIconText) for (let e = 0; e < t[n].length; e++) i.push(t[n][e].x, t[n][e].y, 0);
                        }
                    } else if (3 === h.type) {
                        const t = Zi(h.geometry, 0);
                        for (let i = 0; i < t.length; i++) {
                            const e = ne(t[i], 16);
                            gt(e, r) || f.push(e);
                        }
                    } else if (2 === h.type) for (let t = 0; t < h.geometry.length; t++) {
                        const i = h.geometry[t];
                        gt(i[0], r) || f.push(i[0]);
                    } else if (1 === h.type) for (let t = 0; t < h.geometry.length; t++) {
                        const i = h.geometry[t];
                        for (let t = 0; t < i.length; t++) {
                            const e = i[t];
                            gt(e, r) || f.push(e);
                        }
                    }
                    return f;
                }(t, this.lineVertex, i, e, u, s, l);
            }
            tt(t) {
                return t.markerPlacement || t.textPlacement;
            }
        }
        const Ke = Math.cos(Math.PI / 180 * 37.5), Qe = Math.pow(2, 16) / 1;
        class tn extends Ft {
            constructor(t, i, e) {
                super(t, i, e);
                let n = !1;
                const {lineDasharrayFn: r, lineDashColorFn: s} = this.j;
                r && (n = function(t, i, e) {
                    for (let n = 0; n < t.length; n++) {
                        const r = t[n].properties;
                        if (e(i, r)) return !0;
                    }
                    return !1;
                }(t, this.options.zoom, r), n && (this.dasharrayFn = r)), (rn(this.symbol.lineDasharray) || n) && s && (this.dashColorFn = s);
            }
            createStyledVector(t, i, e, n, r) {
                const s = new Mt(t, i, e, n), o = s.getLineResource();
                return !this.options.atlas && o && (r[o] = [ 0, 0 ]), s;
            }
            getFormat() {
                const {lineWidthFn: t, lineStrokeWidthFn: i, lineStrokeColorFn: e, lineColorFn: n, lineOpacityFn: r, lineDxFn: s, lineDyFn: o, linePatternAnimSpeedFn: h, linePatternGapFn: a} = this.j, l = [ {
                    type: Int16Array,
                    width: 3,
                    name: "aPosition"
                } ];
                if (this.options.center || this.iconAtlas ? l.push({
                    type: Int8Array,
                    width: 3,
                    name: "aExtrude"
                }) : l.push({
                    type: Int8Array,
                    width: 2,
                    name: "aExtrude"
                }), l.push({
                    type: Uint16Array,
                    width: 1,
                    name: "aLinesofar"
                }), t && l.push({
                    type: Uint8Array,
                    width: 1,
                    name: "aLineWidth"
                }), i && l.push({
                    type: Uint8Array,
                    width: 1,
                    name: "aLineStrokeWidth"
                }), n && l.push({
                    type: Uint8Array,
                    width: 4,
                    name: "aColor"
                }), e && l.push({
                    type: Uint8Array,
                    width: 4,
                    name: "aStrokeColor"
                }), r && l.push({
                    type: Uint8Array,
                    width: 1,
                    name: "aOpacity"
                }), this.symbol.lineOffset && l.push({
                    type: Int8Array,
                    width: 2,
                    name: "aExtrudeOffset"
                }), this.dasharrayFn && l.push({
                    type: Uint8Array,
                    width: 4,
                    name: "aDasharray"
                }), this.dashColorFn && l.push({
                    type: Uint8Array,
                    width: 4,
                    name: "aDashColor"
                }), this.iconAtlas) {
                    const t = this.getIconAtlasMaxValue();
                    l.push({
                        type: t > 255 ? Uint16Array : Uint8Array,
                        width: 4,
                        name: "aTexInfo"
                    });
                }
                return s && l.push({
                    type: Int8Array,
                    width: 1,
                    name: "aLineDx"
                }), o && l.push({
                    type: Int8Array,
                    width: 1,
                    name: "aLineDy"
                }), h && l.push({
                    type: Int8Array,
                    width: 1,
                    name: "aLinePatternAnimSpeed"
                }), a && l.push({
                    type: Uint8Array,
                    width: 1,
                    name: "aLinePatternGap"
                }), l;
            }
            placeVector(t) {
                const {lineJoinFn: i, lineCapFn: e, lineWidthFn: n, lineStrokeWidthFn: r, lineStrokeColorFn: s, lineColorFn: o, lineOpacityFn: h, lineJoinPatternModeFn: a, lineDxFn: l, lineDyFn: u, linePatternAnimSpeedFn: c, linePatternGapFn: f} = this.j, d = this.symbol, y = t.feature, p = 3 === y.type, m = y.properties, v = this.elements;
                p && (this.elements = []);
                let g = d.lineJoin || "miter", w = d.lineCap || "butt";
                if (i && (g = i(this.options.zoom, m) || "miter"), e && (w = e(this.options.zoom, m) || "butt"), 
                n) {
                    let t = n(this.options.zoom, m);
                    lt(t) && (t = 4), this.feaLineWidth = t;
                } else this.feaLineWidth = d.lineWidth;
                if (r) {
                    let t = r(this.options.zoom, m);
                    lt(t) && (t = 0), this.feaLineStrokeWidth = t;
                } else this.feaLineStrokeWidth = d.lineStrokeWidth || 0;
                if (o && (this.feaColor = o(this.options.zoom, m) || [ 0, 0, 0, 255 ], M(this.feaColor) ? this.feaColor = [ 0, 0, 0, 0 ] : (Array.isArray(this.feaColor) ? this.feaColor = this.feaColor.map(t => 255 * t) : this.feaColor = Be(this.feaColor).array(), 
                3 === this.feaColor.length && this.feaColor.push(255))), s && (this.feaStrokeColor = s(this.options.zoom, m) || [ 0, 0, 0, 255 ], 
                M(this.feaStrokeColor) ? this.feaStrokeColor = [ 0, 0, 0, 0 ] : (Array.isArray(this.feaStrokeColor) ? this.feaStrokeColor = this.feaStrokeColor.map(t => 255 * t) : this.feaStrokeColor = Be(this.feaStrokeColor).array(), 
                3 === this.feaStrokeColor.length && this.feaStrokeColor.push(255))), h) {
                    let t = h(this.options.zoom, m);
                    lt(t) && (t = 1), this.feaOpacity = 255 * t;
                }
                if (this.dasharrayFn) {
                    let t = this.dasharrayFn(this.options.zoom, m) || [ 0, 0, 0, 0 ];
                    if (t.length < 4) {
                        const i = t;
                        1 === t.length ? t = [ i[0], i[0], i[0], i[0] ] : 2 === t.length ? t = [ i[0], i[1], i[0], i[1] ] : 3 === t.length && (t = [ i[0], i[1], i[2], i[2] ]);
                    }
                    this.feaDash = t;
                }
                if (this.dashColorFn) {
                    let t = (this.dashColorFn ? this.dashColorFn(this.options.zoom, m) : this.symbol.lineDashColor) || [ 0, 0, 0, 0 ];
                    t = Array.isArray(t) ? t.map(t => 255 * t) : Be(t).array(), 3 === t.length && t.push(255), 
                    this.feaDashColor = t;
                }
                if (this.iconAtlas) {
                    const i = t.getLineResource(), e = this.iconAtlas.glyphMap[i];
                    if (this.feaTexInfo = this.feaTexInfo || [ 0, 0, 0, 0 ], e) {
                        const {tl: t, displaySize: e} = this.iconAtlas.positions[i];
                        this.feaTexInfo[0] = t[0] + 1, this.feaTexInfo[1] = t[1] + 1, this.feaTexInfo[2] = e[0] - 3, 
                        this.feaTexInfo[3] = e[1] - 3;
                    } else this.feaTexInfo[0] = this.feaTexInfo[1] = this.feaTexInfo[2] = this.feaTexInfo[3] = 0;
                    this.feaJoinPatternMode = a ? a(this.options.zoom, m) || 0 : d.lineJoinPatternMode || 0;
                }
                if (l) {
                    let t = l(this.options.zoom, m);
                    lt(t) && (t = 0), this.feaLineDx = t;
                }
                if (u) {
                    let t = u(this.options.zoom, m);
                    lt(t) && (t = 0), this.feaLineDy = t;
                }
                if (c) {
                    let t = c(this.options.zoom, m);
                    lt(t) && (t = 0), 0 !== t && (this.properties.hasPatternAnim = 1), this.feaPatternAnimSpeed = t;
                }
                if (f) {
                    let t = f(this.options.zoom, m);
                    lt(t) && (t = 0), this.feaLinePatternGap = t;
                }
                const b = this.options.EXTENT;
                let x = y.geometry;
                b !== 1 / 0 && 3 !== y.type && (x = Vi(y.geometry, -1, -1, b + 1, b + 1));
                for (let t = 0; t < x.length; t++) {
                    this.offset = this.data.aPosition.length / 3;
                    const i = x[t];
                    this.it(i, y, g, w, 2, 1.05), p && (this.et(v), this.elements = []);
                }
                p && (this.elements = v);
            }
            nt() {
                return this.iconAtlas && this.feaTexInfo[2] && this.feaTexInfo[3];
            }
            it(t, i, e, n, r, s) {
                const o = this.nt() || rn(this.feaDash) || rn(this.symbol.lineDasharray);
                this.overscaling = 1;
                const h = this.options.EXTENT;
                if (this.distance = 0, this.scaledDistance = 0, this.totalDistance = 0, this.symbol.lineGradientProperty && i.properties && yt(i.properties, "mapbox_clip_start") && yt(i.properties, "mapbox_clip_end")) {
                    this.clipStart = +i.properties.mapbox_clip_start, this.clipEnd = +i.properties.mapbox_clip_end;
                    for (let i = 0; i < t.length - 1; i++) this.totalDistance += t[i].dist(t[i + 1]);
                    this.updateScaledDistance();
                }
                const a = 3 === i.type;
                let l = t.length;
                for (;l >= 2 && t[l - 1].equals(t[l - 2]); ) l--;
                let u = 0;
                for (;u < l - 1 && t[u].equals(t[u + 1]); ) u++;
                if (l < (a ? 3 : 2)) return;
                "bevel" === e && (r = 1.05);
                const c = this.overscaling <= 16 ? 15 * h / (512 * this.overscaling) : 0, f = {
                    vertexLength: 0,
                    primitiveLength: 0
                };
                let d, y, p, m, v;
                this.e1 = this.e2 = -1, a && (d = t[l - 2], v = t[u].sub(d).I().T());
                for (let i = u; i < l; i++) {
                    if (p = i === l - 1 ? a ? t[u + 1] : void 0 : t[i + 1], p && t[i].equals(p)) continue;
                    v && (m = v), d && (y = d), d = t[i], v = p ? p.sub(d).I().T() : m, m = m || v;
                    let h = m.add(v);
                    0 === h.x && 0 === h.y || h.I();
                    const g = m.x * v.x + m.y * v.y, w = h.x * v.x + h.y * v.y, b = 0 !== w ? 1 / w : 1 / 0, M = 2 * Math.sqrt(2 - 2 * w), x = w < Ke && y && p, F = m.x * v.y - m.y * v.x > 0;
                    if (!o && x && i > u) {
                        const t = d.dist(y);
                        if (t > 2 * c) {
                            const i = d.sub(d.sub(y).k(c / t).D());
                            this.updateDistance(y, i), this.addCurrentVertex(i, m, 0, 0, f), y = i;
                        }
                    }
                    const A = y && p;
                    let k = A ? e : a ? "butt" : n;
                    if (A && "round" === k && (b < s ? k = "miter" : b <= 2 && (k = "fakeround")), "miter" === k && b > r && (k = "bevel"), 
                    "bevel" === k && (b > 2 && (k = "flipbevel"), b < r && (k = "miter")), y && this.updateDistance(y, d), 
                    (i > u && i < l - 1 || a && i === l - 1) && o) {
                        const t = this.feaJoinPatternMode ? 0 : -m.mag() * w;
                        this.addCurrentVertex(d, m, t, t, f), this.rt = 1;
                    }
                    if ("miter" === k) h.k(b), this.addCurrentVertex(d, h, 0, 0, f); else if ("flipbevel" === k) {
                        if (b > 100) h = v.mult(-1); else {
                            const t = b * m.add(v).mag() / m.sub(v).mag();
                            h.T().k(t * (F ? -1 : 1));
                        }
                        this.addCurrentVertex(d, h, 0, 0, f), this.addCurrentVertex(d, h.mult(-1), 0, 0, f);
                    } else if ("bevel" === k || "fakeround" === k) {
                        const t = -Math.sqrt(b * b - 1), i = F ? t : 0, e = F ? 0 : t;
                        if (y && this.addCurrentVertex(d, m, i, e, f), "fakeround" === k) {
                            const t = Math.round(180 * M / Math.PI / 20);
                            for (let i = 1; i < t; i++) {
                                let e = i / t;
                                if (.5 !== e) {
                                    const t = e - .5;
                                    e += e * t * (e - 1) * ((1.0904 + g * (g * (3.55645 - 1.43519 * g) - 3.2452)) * t * t + (.848013 + g * (.215638 * g - 1.06021)));
                                }
                                const n = v.sub(m).k(e).m(m).I().k(F ? -1 : 1);
                                this.addHalfVertex(d, n.x, n.y, !1, F, 0, f);
                            }
                        }
                        p && this.addCurrentVertex(d, v, -i, -e, f);
                    } else if ("butt" === k) this.addCurrentVertex(d, h, 0, 0, f); else if ("square" === k) {
                        const t = y ? 1 : -1;
                        this.addCurrentVertex(d, h, t, t, f);
                    } else "round" === k && (y && (this.addCurrentVertex(d, m, 0, 0, f), this.addCurrentVertex(d, m, 1, 1, f, !0)), 
                    p && (this.addCurrentVertex(d, v, -1, -1, f, !0), this.addCurrentVertex(d, v, 0, 0, f)));
                    if (!o && x && i < l - 1) {
                        const t = d.dist(p);
                        if (t > 2 * c) {
                            const i = d.add(p.sub(d).k(c / t).D());
                            this.updateDistance(d, i), this.addCurrentVertex(i, v, 0, 0, f), d = i;
                        }
                    }
                    if ((i > u && i < l - 1 || a && i === u) && o) {
                        delete this.rt;
                        const t = this.feaJoinPatternMode ? 0 : v.mag() * w;
                        this.addCurrentVertex(d, v, t, t, f);
                    }
                }
            }
            addCurrentVertex(t, i, e, n, r, s = !1) {
                const o = i.x + i.y * e, h = i.y - i.x * e, a = -i.x + i.y * n, l = -i.y - i.x * n;
                this.addHalfVertex(t, o, h, s, !1, e, r), this.addHalfVertex(t, a, l, s, !0, -n, r), 
                this.distance > Qe / 2 && 0 === this.totalDistance && (this.distance = 0, this.updateScaledDistance(), 
                this.addCurrentVertex(t, i, e, n, r, s));
            }
            addHalfVertex({x: t, y: i}, e, n, r, s, o, h) {
                const a = 1 * this.scaledDistance;
                this.fillData(this.data, t, i, e, n, r, s, a);
                const l = h.vertexLength++;
                this.e1 >= 0 && this.e2 >= 0 && (this.addElements(this.e1, this.e2, l), h.primitiveLength++), 
                s ? this.e2 = l : this.e1 = l;
            }
            fillData(t, i, e, n, r, s, o, h) {
                const {lineWidthFn: a, lineStrokeWidthFn: l, lineStrokeColorFn: u, lineColorFn: c, lineOpacityFn: f, lineDxFn: d, lineDyFn: y, linePatternAnimSpeedFn: p, linePatternGapFn: m} = this.j;
                if (this.options.center || (i = (i << 1) + (s ? 1 : 0), e = (e << 1) + (o ? 1 : 0)), 
                t.aPosition.push(i, e, 0), t.aExtrude.push(63 * n, 63 * r), this.options.center || this.iconAtlas) {
                    let i = 0;
                    this.options.center && (i += 2 * s + o), this.iconAtlas && (i += 4 * (this.rt && this.feaJoinPatternMode ? 1 : 0)), 
                    t.aExtrude.push(i);
                }
                t.aLinesofar.push(h), a && t.aLineWidth.push(Math.round(2 * this.feaLineWidth)), 
                l && t.aLineStrokeWidth.push(Math.round(2 * this.feaLineStrokeWidth)), c && t.aColor.push(...this.feaColor), 
                u && t.aStrokeColor.push(...this.feaStrokeColor), f && t.aOpacity.push(this.feaOpacity), 
                this.dasharrayFn && t.aDasharray.push(...this.feaDash), this.dashColorFn && t.aDashColor.push(...this.feaDashColor), 
                this.iconAtlas && t.aTexInfo.push(...this.feaTexInfo), d && t.aLineDx.push(this.feaLineDx), 
                y && t.aLineDy.push(this.feaLineDy), p && t.aLinePatternAnimSpeed.push(127 * this.feaPatternAnimSpeed), 
                m && t.aLinePatternGap.push(10 * this.feaLinePatternGap), this.maxPos = Math.max(this.maxPos, Math.abs(i) + 1, Math.abs(e) + 1);
            }
            addElements(t, i, e) {
                super.addElements(this.offset + t, this.offset + i, this.offset + e);
            }
            et(t) {
                const i = this.options.EXTENT, e = this.elements;
                for (let n = 0; n < e.length; n += 3) i !== 1 / 0 && (nn(this.data.aPosition, e[n], e[n + 1], 3, i) || nn(this.data.aPosition, e[n + 1], e[n + 2], 3, i)) || t.push(e[n], e[n + 1], e[n + 2]);
            }
            st(t) {
                if (t.length <= 1) return t;
                const i = [], e = this.options.EXTENT;
                let n, r = !0;
                for (n = 0; n < t.length - 1; n++) {
                    const s = en(t[n], t[n + 1], e);
                    s && r || (i.push(t[n]), r = s);
                }
                return r || i.push(t[n]), i;
            }
            updateDistance(t, i) {
                this.distance += t.dist(i), this.updateScaledDistance();
            }
            updateScaledDistance() {
                this.scaledDistance = this.totalDistance > 0 ? (this.clipStart + (this.clipEnd - this.clipStart) * this.distance / this.totalDistance) * (Qe - 1) : this.distance;
            }
        }
        function en(t, i, e) {
            return e !== 1 / 0 && (t.x < 0 && i.x < 0 || t.x > e && i.x > e || t.y < 0 && i.y < 0 || t.y > e && i.y > e);
        }
        function nn(t, i, e, n, r) {
            if (r === 1 / 0) return !1;
            const s = Math.floor(.5 * t[i * n]), o = Math.floor(.5 * t[i * n + 1]), h = Math.floor(.5 * t[e * n]), a = Math.floor(.5 * t[e * n + 1]);
            return s === h && (s < 0 || s > r) && o !== a || o === a && (o < 0 || o > r) && s !== h;
        }
        function rn(t) {
            if (!Array.isArray(t)) return !1;
            for (let i = 0; i < t.length; i++) if (t[i]) return !0;
            return !1;
        }
        var sn = {
            exports: {}
        };
        function on(t, i, e) {
            e = e || 2;
            var n, r, s, o, h, a, l, u = i && i.length, c = u ? i[0] * e : t.length, f = hn(t, 0, c, e, !0), d = [];
            if (!f || f.next === f.prev) return d;
            if (u && (f = function(t, i, e, n) {
                var r, s, o, h, a, l = [];
                for (r = 0, s = i.length; r < s; r++) o = i[r] * n, h = r < s - 1 ? i[r + 1] * n : t.length, 
                (a = hn(t, o, h, n, !1)) === a.next && (a.steiner = !0), l.push(gn(a));
                for (l.sort(yn), r = 0; r < l.length; r++) pn(l[r], e), e = an(e, e.next);
                return e;
            }(t, i, f, e)), t.length > 80 * e) {
                n = s = t[0], r = o = t[1];
                for (var y = e; y < c; y += e) (h = t[y]) < n && (n = h), (a = t[y + 1]) < r && (r = a), 
                h > s && (s = h), a > o && (o = a);
                l = 0 !== (l = Math.max(s - n, o - r)) ? 1 / l : 0;
            }
            return ln(f, d, e, n, r, l), d;
        }
        function hn(t, i, e, n, r) {
            var s, o;
            if (r === In(t, i, e, n) > 0) for (s = i; s < e; s += n) o = Pn(s, t[s], t[s + 1], o); else for (s = e - n; s >= i; s -= n) o = Pn(s, t[s], t[s + 1], o);
            return o && xn(o, o.next) && (On(o), o = o.next), o;
        }
        function an(t, i) {
            if (!t) return t;
            i || (i = t);
            var e, n = t;
            do {
                if (e = !1, n.steiner || !xn(n, n.next) && 0 !== Mn(n.prev, n, n.next)) n = n.next; else {
                    if (On(n), (n = i = n.prev) === n.next) break;
                    e = !0;
                }
            } while (e || n !== i);
            return i;
        }
        function ln(t, i, e, n, r, s, o) {
            if (t) {
                !o && s && function(t, i, e, n) {
                    var r = t;
                    do {
                        null === r.z && (r.z = vn(r.x, r.y, i, e, n)), r.prevZ = r.prev, r.nextZ = r.next, 
                        r = r.next;
                    } while (r !== t);
                    r.prevZ.nextZ = null, r.prevZ = null, function(t) {
                        var i, e, n, r, s, o, h, a, l = 1;
                        do {
                            for (e = t, t = null, s = null, o = 0; e; ) {
                                for (o++, n = e, h = 0, i = 0; i < l && (h++, n = n.nextZ); i++) ;
                                for (a = l; h > 0 || a > 0 && n; ) 0 !== h && (0 === a || !n || e.z <= n.z) ? (r = e, 
                                e = e.nextZ, h--) : (r = n, n = n.nextZ, a--), s ? s.nextZ = r : t = r, r.prevZ = s, 
                                s = r;
                                e = n;
                            }
                            s.nextZ = null, l *= 2;
                        } while (o > 1);
                    }(r);
                }(t, n, r, s);
                for (var h, a, l = t; t.prev !== t.next; ) if (h = t.prev, a = t.next, s ? cn(t, n, r, s) : un(t)) i.push(h.i / e), 
                i.push(t.i / e), i.push(a.i / e), On(t), t = a.next, l = a.next; else if ((t = a) === l) {
                    o ? 1 === o ? ln(t = fn(an(t), i, e), i, e, n, r, s, 2) : 2 === o && dn(t, i, e, n, r, s) : ln(an(t), i, e, n, r, s, 1);
                    break;
                }
            }
        }
        function un(t) {
            var i = t.prev, e = t, n = t.next;
            if (Mn(i, e, n) >= 0) return !1;
            for (var r = t.next.next; r !== t.prev; ) {
                if (wn(i.x, i.y, e.x, e.y, n.x, n.y, r.x, r.y) && Mn(r.prev, r, r.next) >= 0) return !1;
                r = r.next;
            }
            return !0;
        }
        function cn(t, i, e, n) {
            var r = t.prev, s = t, o = t.next;
            if (Mn(r, s, o) >= 0) return !1;
            for (var h = r.x < s.x ? r.x < o.x ? r.x : o.x : s.x < o.x ? s.x : o.x, a = r.y < s.y ? r.y < o.y ? r.y : o.y : s.y < o.y ? s.y : o.y, l = r.x > s.x ? r.x > o.x ? r.x : o.x : s.x > o.x ? s.x : o.x, u = r.y > s.y ? r.y > o.y ? r.y : o.y : s.y > o.y ? s.y : o.y, c = vn(h, a, i, e, n), f = vn(l, u, i, e, n), d = t.prevZ, y = t.nextZ; d && d.z >= c && y && y.z <= f; ) {
                if (d !== t.prev && d !== t.next && wn(r.x, r.y, s.x, s.y, o.x, o.y, d.x, d.y) && Mn(d.prev, d, d.next) >= 0) return !1;
                if (d = d.prevZ, y !== t.prev && y !== t.next && wn(r.x, r.y, s.x, s.y, o.x, o.y, y.x, y.y) && Mn(y.prev, y, y.next) >= 0) return !1;
                y = y.nextZ;
            }
            for (;d && d.z >= c; ) {
                if (d !== t.prev && d !== t.next && wn(r.x, r.y, s.x, s.y, o.x, o.y, d.x, d.y) && Mn(d.prev, d, d.next) >= 0) return !1;
                d = d.prevZ;
            }
            for (;y && y.z <= f; ) {
                if (y !== t.prev && y !== t.next && wn(r.x, r.y, s.x, s.y, o.x, o.y, y.x, y.y) && Mn(y.prev, y, y.next) >= 0) return !1;
                y = y.nextZ;
            }
            return !0;
        }
        function fn(t, i, e) {
            var n = t;
            do {
                var r = n.prev, s = n.next.next;
                !xn(r, s) && Fn(r, n, n.next, s) && _n(r, s) && _n(s, r) && (i.push(r.i / e), i.push(n.i / e), 
                i.push(s.i / e), On(n), On(n.next), n = t = s), n = n.next;
            } while (n !== t);
            return an(n);
        }
        function dn(t, i, e, n, r, s) {
            var o = t;
            do {
                for (var h = o.next.next; h !== o.prev; ) {
                    if (o.i !== h.i && bn(o, h)) {
                        var a = Sn(o, h);
                        return o = an(o, o.next), a = an(a, a.next), ln(o, i, e, n, r, s), void ln(a, i, e, n, r, s);
                    }
                    h = h.next;
                }
                o = o.next;
            } while (o !== t);
        }
        function yn(t, i) {
            return t.x - i.x;
        }
        function pn(t, i) {
            if (i = function(t, i) {
                var e, n = i, r = t.x, s = t.y, o = -1 / 0;
                do {
                    if (s <= n.y && s >= n.next.y && n.next.y !== n.y) {
                        var h = n.x + (s - n.y) * (n.next.x - n.x) / (n.next.y - n.y);
                        if (h <= r && h > o) {
                            if (o = h, h === r) {
                                if (s === n.y) return n;
                                if (s === n.next.y) return n.next;
                            }
                            e = n.x < n.next.x ? n : n.next;
                        }
                    }
                    n = n.next;
                } while (n !== i);
                if (!e) return null;
                if (r === o) return e;
                var a, l = e, u = e.x, c = e.y, f = 1 / 0;
                n = e;
                do {
                    r >= n.x && n.x >= u && r !== n.x && wn(s < c ? r : o, s, u, c, s < c ? o : r, s, n.x, n.y) && (a = Math.abs(s - n.y) / (r - n.x), 
                    _n(n, t) && (a < f || a === f && (n.x > e.x || n.x === e.x && mn(e, n))) && (e = n, 
                    f = a)), n = n.next;
                } while (n !== l);
                return e;
            }(t, i)) {
                var e = Sn(i, t);
                an(i, i.next), an(e, e.next);
            }
        }
        function mn(t, i) {
            return Mn(t.prev, t, i.prev) < 0 && Mn(i.next, t, t.next) < 0;
        }
        function vn(t, i, e, n, r) {
            return (t = 1431655765 & ((t = 858993459 & ((t = 252645135 & ((t = 16711935 & ((t = 32767 * (t - e) * r) | t << 8)) | t << 4)) | t << 2)) | t << 1)) | (i = 1431655765 & ((i = 858993459 & ((i = 252645135 & ((i = 16711935 & ((i = 32767 * (i - n) * r) | i << 8)) | i << 4)) | i << 2)) | i << 1)) << 1;
        }
        function gn(t) {
            var i = t, e = t;
            do {
                (i.x < e.x || i.x === e.x && i.y < e.y) && (e = i), i = i.next;
            } while (i !== t);
            return e;
        }
        function wn(t, i, e, n, r, s, o, h) {
            return (r - o) * (i - h) - (t - o) * (s - h) >= 0 && (t - o) * (n - h) - (e - o) * (i - h) >= 0 && (e - o) * (s - h) - (r - o) * (n - h) >= 0;
        }
        function bn(t, i) {
            return t.next.i !== i.i && t.prev.i !== i.i && !function(t, i) {
                var e = t;
                do {
                    if (e.i !== t.i && e.next.i !== t.i && e.i !== i.i && e.next.i !== i.i && Fn(e, e.next, t, i)) return !0;
                    e = e.next;
                } while (e !== t);
                return !1;
            }(t, i) && (_n(t, i) && _n(i, t) && function(t, i) {
                var e = t, n = !1, r = (t.x + i.x) / 2, s = (t.y + i.y) / 2;
                do {
                    e.y > s != e.next.y > s && e.next.y !== e.y && r < (e.next.x - e.x) * (s - e.y) / (e.next.y - e.y) + e.x && (n = !n), 
                    e = e.next;
                } while (e !== t);
                return n;
            }(t, i) && (Mn(t.prev, t, i.prev) || Mn(t, i.prev, i)) || xn(t, i) && Mn(t.prev, t, t.next) > 0 && Mn(i.prev, i, i.next) > 0);
        }
        function Mn(t, i, e) {
            return (i.y - t.y) * (e.x - i.x) - (i.x - t.x) * (e.y - i.y);
        }
        function xn(t, i) {
            return t.x === i.x && t.y === i.y;
        }
        function Fn(t, i, e, n) {
            var r = kn(Mn(t, i, e)), s = kn(Mn(t, i, n)), o = kn(Mn(e, n, t)), h = kn(Mn(e, n, i));
            return r !== s && o !== h || (!(0 !== r || !An(t, e, i)) || (!(0 !== s || !An(t, n, i)) || (!(0 !== o || !An(e, t, n)) || !(0 !== h || !An(e, i, n)))));
        }
        function An(t, i, e) {
            return i.x <= Math.max(t.x, e.x) && i.x >= Math.min(t.x, e.x) && i.y <= Math.max(t.y, e.y) && i.y >= Math.min(t.y, e.y);
        }
        function kn(t) {
            return t > 0 ? 1 : t < 0 ? -1 : 0;
        }
        function _n(t, i) {
            return Mn(t.prev, t, t.next) < 0 ? Mn(t, i, t.next) >= 0 && Mn(t, t.prev, i) >= 0 : Mn(t, i, t.prev) < 0 || Mn(t, t.next, i) < 0;
        }
        function Sn(t, i) {
            var e = new Cn(t.i, t.x, t.y), n = new Cn(i.i, i.x, i.y), r = t.next, s = i.prev;
            return t.next = i, i.prev = t, e.next = r, r.prev = e, n.next = e, e.prev = n, s.next = n, 
            n.prev = s, n;
        }
        function Pn(t, i, e, n) {
            var r = new Cn(t, i, e);
            return n ? (r.next = n.next, r.prev = n, n.next.prev = r, n.next = r) : (r.prev = r, 
            r.next = r), r;
        }
        function On(t) {
            t.next.prev = t.prev, t.prev.next = t.next, t.prevZ && (t.prevZ.nextZ = t.nextZ), 
            t.nextZ && (t.nextZ.prevZ = t.prevZ);
        }
        function Cn(t, i, e) {
            this.i = t, this.x = i, this.y = e, this.prev = null, this.next = null, this.z = null, 
            this.prevZ = null, this.nextZ = null, this.steiner = !1;
        }
        function In(t, i, e, n) {
            for (var r = 0, s = i, o = e - n; s < e; s += n) r += (t[o] - t[s]) * (t[s + 1] + t[o + 1]), 
            o = s;
            return r;
        }
        sn.exports = on, sn.exports.default = on, on.deviation = function(t, i, e, n) {
            var r = i && i.length, s = r ? i[0] * e : t.length, o = Math.abs(In(t, 0, s, e));
            if (r) for (var h = 0, a = i.length; h < a; h++) {
                var l = i[h] * e, u = h < a - 1 ? i[h + 1] * e : t.length;
                o -= Math.abs(In(t, l, u, e));
            }
            var c = 0;
            for (h = 0; h < n.length; h += 3) {
                var f = n[h] * e, d = n[h + 1] * e, y = n[h + 2] * e;
                c += Math.abs((t[f] - t[y]) * (t[d + 1] - t[f + 1]) - (t[f] - t[d]) * (t[y + 1] - t[f + 1]));
            }
            return 0 === o && 0 === c ? 0 : Math.abs((c - o) / o);
        }, on.flatten = function(t) {
            for (var i = t[0][0].length, e = {
                vertices: [],
                holes: [],
                dimensions: i
            }, n = 0, r = 0; r < t.length; r++) {
                for (var s = 0; s < t[r].length; s++) for (var o = 0; o < i; o++) e.vertices.push(t[r][s][o]);
                r > 0 && (n += t[r - 1].length, e.holes.push(n));
            }
            return e;
        };
        var Tn = sn.exports;
        /*!
       * from @turf/bboxClip
       * https://github.com/Turfjs/turf
       * MIT LICENSE
       */        const Dn = [], Ln = [];
        function Un(t, i) {
            var e, n, r, s, o, h, a;
            for (n = 1; n <= 8; n *= 2) {
                for (e = [], s = !(jn(r = t[t.length - 1], i) & n), o = 0; o < t.length; o++) {
                    if ((a = !(jn(h = t[o], i) & n)) !== s) {
                        const t = En(r, h, n, i);
                        void 0 !== h.x ? e.push(new E(t[0], t[1])) : e.push(t);
                    }
                    a && e.push(h), r = h, s = a;
                }
                if (!(t = e).length) break;
            }
            return e;
        }
        function En(t, i, e, n) {
            return Dn[0] = void 0 === t.x ? t[0] : t.x, Dn[1] = void 0 === t.y ? t[1] : t.y, 
            t = Dn, Ln[0] = void 0 === i.x ? i[0] : i.x, Ln[1] = void 0 === i.y ? i[1] : i.y, 
            i = Ln, 8 & e ? [ t[0] + (i[0] - t[0]) * (n[3] - t[1]) / (i[1] - t[1]), n[3] ] : 4 & e ? [ t[0] + (i[0] - t[0]) * (n[1] - t[1]) / (i[1] - t[1]), n[1] ] : 2 & e ? [ n[2], t[1] + (i[1] - t[1]) * (n[2] - t[0]) / (i[0] - t[0]) ] : 1 & e ? [ n[0], t[1] + (i[1] - t[1]) * (n[0] - t[0]) / (i[0] - t[0]) ] : null;
        }
        function jn(t, i) {
            Dn[0] = void 0 === t.x ? t[0] : t.x, Dn[1] = void 0 === t.y ? t[1] : t.y;
            var e = 0;
            return (t = Dn)[0] < i[0] ? e |= 1 : t[0] > i[2] && (e |= 2), t[1] < i[1] ? e |= 4 : t[1] > i[3] && (e |= 8), 
            e;
        }
        class Rn extends Ft {
            constructor(...t) {
                super(...t), this.lineElements = [];
            }
            createStyledVector(t, i, e, n, r) {
                const s = new Mt(t, i, e, n), o = s.getPolygonResource();
                return !this.options.atlas && o && (r[o] = [ 0, 0 ]), s;
            }
            getFormat() {
                const t = [ {
                    type: Int16Array,
                    width: 3,
                    name: "aPosition"
                } ], {polygonFillFn: i, polygonOpacityFn: e, uvScaleFn: n, uvOffsetFn: r} = this.j;
                if (this.iconAtlas) {
                    const i = this.getIconAtlasMaxValue();
                    t.push({
                        type: i > 255 ? Uint16Array : Uint8Array,
                        width: 4,
                        name: "aTexInfo"
                    });
                }
                return i && t.push({
                    type: Uint8Array,
                    width: 4,
                    name: "aColor"
                }), e && t.push({
                    type: Uint8Array,
                    width: 1,
                    name: "aOpacity"
                }), n && t.push({
                    type: Uint16Array,
                    width: 2,
                    name: "aUVScale"
                }), r && t.push({
                    type: Uint8Array,
                    width: 2,
                    name: "aUVOffset"
                }), t;
            }
            createDataPack(...t) {
                this.maxLineIndex = 0, this.lineElements = [];
                const i = super.createDataPack(...t);
                if (!i) return i;
                let e = this.lineElements;
                return e = new (rt(this.maxLineIndex))(this.lineElements), i.lineIndices = e, i.buffers.push(e.buffer), 
                i;
            }
            placeVector(t, i) {
                const e = t.feature, n = e.geometry;
                this.lt(n, e, i);
            }
            lt(t, i) {
                let e, n, r, s;
                const {polygonFillFn: o, polygonOpacityFn: h, uvScaleFn: a, uvOffsetFn: l} = this.j, u = i.properties;
                o && (e = o(this.options.zoom, u) || [ 255, 255, 255, 255 ], M(e) ? e = [ 0, 0, 0, 0 ] : (e = Array.isArray(e) ? e.map(t => 255 * t) : Be(e).array(), 
                3 === e.length && e.push(255))), h && (n = h(this.options.zoom, u), lt(n) && (n = 1), 
                n *= 255), a && (r = a(this.options.zoom, u), lt(r) && (r = [ 1, 1 ]), r = [ 255 * r[0], 255 * r[1] ]), 
                l && (s = l(this.options.zoom, u), lt(s) && (s = [ 0, 0 ]), s = [ 255 * s[0], 255 * s[1] ]);
                const c = !!this.iconAtlas, f = Zi(t, 500), d = this.getAltitude(u), y = [ 0, 0 ], p = [ 0, 0 ];
                if (c) {
                    const {polygonPatternFileFn: t} = this.j, i = t ? t(null, u) : this.symbol.polygonPatternFile;
                    if (this.iconAtlas.glyphMap[i]) {
                        const t = this.iconAtlas.positions[i];
                        y[0] = t.tl[0] + 1, y[1] = t.tl[1] + 1, p[0] = t.displaySize[0] - 3, p[1] = t.displaySize[1] - 3;
                    }
                }
                const m = [ -1, -1, i.extent + 1, i.extent + 1 ];
                for (let t = 0; t < f.length; t++) {
                    const i = f[t], o = this.data.aPosition.length / 3, h = [], a = [];
                    for (let t = 0; t < i.length; t++) {
                        let o = i[t];
                        if (this.options.EXTENT !== 1 / 0 && (o = Un(o, m)), 0 === o.length) continue;
                        0 !== t && a.push(h.length / 2);
                        const l = this.lineElements.length;
                        this.data.aPosition.push(o[0].x, o[0].y, d), c && this.data.aTexInfo.push(...y, ...p), 
                        void 0 !== e && this.data.aColor.push(...e), void 0 !== n && this.data.aOpacity.push(n), 
                        void 0 !== r && this.data.aUVScale.push(...r), void 0 !== s && this.data.aUVOffset.push(...s), 
                        this.maxPos = Math.max(this.maxPos, Math.abs(o[0].x), Math.abs(o[0].y)), this.addLineElements(l + o.length - 1, l), 
                        h.push(o[0].x), h.push(o[0].y);
                        for (let t = 1; t < o.length; t++) this.data.aPosition.push(o[t].x, o[t].y, d), 
                        c && this.data.aTexInfo.push(...y, ...p), void 0 !== e && this.data.aColor.push(...e), 
                        void 0 !== n && this.data.aOpacity.push(n), void 0 !== r && this.data.aUVScale.push(...r), 
                        void 0 !== s && this.data.aUVOffset.push(...s), this.maxPos = Math.max(this.maxPos, Math.abs(o[t].x), Math.abs(o[t].y)), 
                        this.addLineElements(l + t - 1, l + t), h.push(o[t].x), h.push(o[t].y);
                    }
                    const l = Tn(h, a);
                    for (let t = 0; t < l.length; t += 3) this.addElements(o + l[t], o + l[t + 1], o + l[t + 2]);
                }
            }
            addLineElements(...t) {
                this.maxLineIndex = Math.max(this.maxLineIndex, ...t), this.lineElements.push(...t);
            }
        }
        class zn {
            constructor(t) {
                this.max = t, this.reset();
            }
            reset() {
                return this.data = {}, this.order = [], this;
            }
            clear() {
                this.reset();
            }
            add(t, i) {
                return this.has(t) ? (this.order.splice(this.order.indexOf(t), 1), this.data[t] = i, 
                this.order.push(t)) : (this.data[t] = i, this.order.push(t), this.order.length > this.max && this.getAndRemove(this.order[0])), 
                this;
            }
            has(t) {
                return t in this.data;
            }
            keys() {
                return this.order;
            }
            getAndRemove(t) {
                if (!this.has(t)) return null;
                const i = this.data[t];
                return delete this.data[t], this.order.splice(this.order.indexOf(t), 1), i;
            }
            get(t) {
                if (!this.has(t)) return null;
                return this.data[t];
            }
            remove(t) {
                return this.has(t) ? (delete this.data[t], this.order.splice(this.order.indexOf(t), 1), 
                this) : this;
            }
            setMaxSize(t) {
                for (this.max = t; this.order.length > this.max; ) this.getAndRemove(this.order[0]);
                return this;
            }
        }
        /*!
       * based on @mapbox/tiny-sdf
       * https://github.com/mapbox/tiny-sdf
       * @License BSD 2-Clause
       */        var Nn = 1e20;
        function Wn(t, i, e, n, r, s, o) {
            this.fontSize = t || 24, this.buffer = void 0 === i ? 3 : i, this.cutoff = n || .25, 
            this.fontFamily = r || "sans-serif", this.fontWeight = s || "normal", this.fontStyle = o || "normal", 
            this.radius = e || 8;
            var h = this.size = this.fontSize + 2 * this.buffer;
            this.canvas = "undefined" == typeof document ? new OffscreenCanvas(h, h) : document.createElement("canvas"), 
            this.canvas.width = this.canvas.height = h, this.ctx = this.canvas.getContext("2d"), 
            this.ctx.font = this.fontStyle + " " + this.fontWeight + " " + this.fontSize + "px " + this.fontFamily, 
            this.ctx.textBaseline = "middle", this.ctx.fillStyle = "black", this.gridOuter = new Float64Array(h * h), 
            this.gridInner = new Float64Array(h * h), this.f = new Float64Array(h), this.z = new Float64Array(h + 1), 
            this.v = new Uint16Array(h), this.middle = Math.round(h / 2 * (navigator.userAgent.indexOf("Gecko/") >= 0 ? 1.2 : 1));
        }
        function Hn(t, i, e, n, r, s) {
            for (var o = 0; o < i; o++) Vn(t, o, i, e, n, r, s);
            for (var h = 0; h < e; h++) Vn(t, h * i, 1, i, n, r, s);
        }
        function Vn(t, i, e, n, r, s, o) {
            var h, a, l, u;
            for (s[0] = 0, o[0] = -Nn, o[1] = Nn, h = 0; h < n; h++) r[h] = t[i + h * e];
            for (h = 1, a = 0, l = 0; h < n; h++) {
                do {
                    u = s[a], l = (r[h] - r[u] + h * h - u * u) / (h - u) / 2;
                } while (l <= o[a] && --a > -1);
                s[++a] = h, o[a] = l, o[a + 1] = Nn;
            }
            for (h = 0, a = 0; h < n; h++) {
                for (;o[a + 1] < h; ) a++;
                u = s[a], t[i + h * e] = r[u] + (h - u) * (h - u);
            }
        }
        Wn.prototype.draw = function(t, i, e) {
            this.ctx.clearRect(0, 0, this.size, this.size), this.ctx.textBaseline = "bottom", 
            this.ctx.fillText(t, this.buffer, e - this.buffer + 1);
            for (var n = this.ctx.getImageData(0, 0, i, e), r = new Uint8ClampedArray(i * e), s = 0; s < i * e; s++) {
                var o = n.data[4 * s + 3] / 255;
                this.gridOuter[s] = 1 === o ? 0 : 0 === o ? Nn : Math.pow(Math.max(0, .5 - o), 2), 
                this.gridInner[s] = 1 === o ? Nn : 0 === o ? 0 : Math.pow(Math.max(0, o - .5), 2);
            }
            for (Hn(this.gridOuter, i, e, this.f, this.v, this.z), Hn(this.gridInner, i, e, this.f, this.v, this.z), 
            s = 0; s < i * e; s++) {
                var h = Math.sqrt(this.gridOuter[s]) - Math.sqrt(this.gridInner[s]);
                r[s] = Math.round(255 - 255 * (h / this.radius + this.cutoff));
            }
            return r;
        };
        let $n = 0;
        class Gn {
            constructor(t, i = 15, e) {
                this.entries = {}, this.Lt = {}, this.ft = new zn(2048, (function() {})), this.Ut = t, 
                this.Et = i, this.jt = e;
            }
            getGlyphs(t, i) {
                if (!t || !Object.keys(t).length) return void i(null, {
                    glyphs: null
                });
                const e = this.entries, n = t.options;
                let r = !0;
                n && (r = !1 !== n.isCharsCompact), r = r || this.jt;
                const s = (n, s, h) => {
                    let a = 0, l = 0;
                    for (const i in t) if ("options" !== i) {
                        e[i] = e[i] || {}, s[i] = s[i] || {};
                        for (const u in t[i]) {
                            if (l++, l <= n) continue;
                            const t = i.split(" "), c = r && "normal" === t[0] && !Fi(+u), f = i + ":" + u + ":" + c;
                            let d;
                            if (this.ft.has(f) ? d = this.ft.get(f) : (d = this.Rt(e[i], t, u, c), this.ft.add(f, d), 
                            a++), d = Jn(d), s[i][u] = d, h.push(d.bitmap.data.buffer), a > this.Et) return void this.Ut(o(l, s, h));
                        }
                    }
                    i(null, {
                        glyphs: s,
                        buffers: h
                    });
                };
                function o(t, i, e) {
                    return () => {
                        s(t, i, e);
                    };
                }
                s(0, {}, []);
            }
            Rt(t, i, e, n) {
                const r = i[0], s = i[1], o = i.slice(3).join(" ");
                let h = t.tinySDF, a = "normal" !== r ? 5 : 2;
                const l = n ? -1 : 2;
                if (!h) {
                    let i = "400";
                    /bolder/i.test(s) ? i = "1000" : /bold/i.test(s) ? i = "900" : /medium/i.test(s) ? i = "500" : /light/i.test(s) && (i = "200"), 
                    h = t.tinySDF = new Wn(24, a, 8, .25, o, i, r);
                }
                const u = String.fromCharCode(e), c = h.ctx.measureText(u), f = Math.round(c.width), d = h.draw(String.fromCharCode(e), f + 2 * a, 24 + 2 * a);
                if ($n < 4) {
                    const t = "undefined" != typeof document && document.getElementById("sdf-debug-" + $n++);
                    if (t) {
                        t.width = f + 2 * a, t.height = h.canvas.height;
                        t.getContext("2d").drawImage(h.canvas, 0, 0);
                    }
                }
                return {
                    charCode: e,
                    bitmap: {
                        width: f + 2 * a,
                        height: 24 + 2 * a,
                        data: d
                    },
                    metrics: {
                        width: f,
                        height: 24,
                        left: 0,
                        top: -7 - (a - 2),
                        advance: f + a + l
                    }
                };
            }
        }
        function Jn(t) {
            const i = {
                width: t.bitmap.width,
                height: t.bitmap.height,
                data: new Uint8ClampedArray(t.bitmap.data)
            };
            return {
                charCode: t.charCode,
                bitmap: i,
                metrics: at({}, t.metrics)
            };
        }
        class qn {
            constructor(t) {
                this.options = t || {}, this.resources = new i.renderer.ResourceCache, this.zt = {}, 
                this.ft = new zn(256, (function() {}));
                const e = document.createElement("canvas");
                this.ctx = e.getContext("2d");
            }
            getIcons(t, e) {
                if (!t || !Object.keys(t).length) return void e(null, {
                    icons: null
                });
                const n = Object.keys(t), r = {}, s = [];
                let o = 0, h = 0;
                const a = this;
                function l(t, i) {
                    r[t] = a.Nt(t, i), r[t] && "error" !== r[t] ? s.push(r[t].data.data.buffer) : delete r[t], 
                    h++, h === o && e(null, {
                        icons: r,
                        buffers: s
                    });
                }
                function u(t) {
                    const i = a.zt[t.url];
                    for (let e = 0; e < i.length; e++) i[e].call(t, t.url, t.size);
                    delete a.zt[t.url];
                }
                function c() {
                    const t = a.ctx;
                    let i, e;
                    try {
                        const n = this.width / this.height;
                        i = this.size[0] ? this.size[0] : this.width, this.size[1] ? (e = this.size[1], 
                        this.size[0] || (i = e * n)) : e = this.size[0] ? i / n : this.height, this.size[0] = i, 
                        this.size[1] = e, a.Wt(null, this.size), i = this.size[0], e = this.size[1], t.canvas.width = i, 
                        t.canvas.height = e, t.drawImage(this, 0, 0, i, e);
                        const r = t.getImageData(0, 0, i, e).data;
                        a.Ht(this.url, r, i, e);
                    } catch (t) {
                        console.warn(t);
                    }
                    u(this);
                }
                function f(t) {
                    console.warn(`failed loading icon(${this.index}) at "${this.url}"`), console.warn(t), 
                    a.options.iconErrorUrl ? this.src = a.options.iconErrorUrl : (a.Ht(this.url), u(this));
                }
                let d, y = !1;
                for (let e = 0; e < n.length; e++) {
                    const h = n[e], a = t[h];
                    this.Wt(h, a);
                    const u = this.Nt(h, a);
                    if (u && "error" !== u) r[h] = this.Nt(h, a); else if ("error" !== u) if (0 === h.indexOf("vector://")) {
                        d = d || new i.Marker([ 0, 0 ]);
                        const t = JSON.parse(h.substring("vector://".length)), {markerFill: e, markerLineColor: n} = t;
                        e && Array.isArray(e) && (t.markerFill = Bn(e)), n && Array.isArray(n) && (t.markerLineColor = Bn(n)), 
                        delete t.markerHorizontalAlignment, delete t.markerVerticalAlignment, delete t.markerDx, 
                        delete t.markerDy, delete t.markerPlacement, delete t.markerFile, t.markerWidth = a[0], 
                        t.markerHeight = a[1], d.setSymbol(t);
                        const o = d._getSprite(this.resources);
                        if (o) {
                            const t = o.canvas, i = t.width, e = t.height, n = t.getContext("2d").getImageData(0, 0, i, e).data;
                            r[h] = {
                                data: {
                                    data: new Uint8ClampedArray(n),
                                    width: i,
                                    height: e
                                },
                                url: h
                            }, s.push(r[h].data.data.buffer), this.Ht(h, n, i, e);
                        }
                    } else {
                        if (this.zt[h]) {
                            y = !0, o++, this.zt[h].push(l);
                            continue;
                        }
                        this.zt[h] = [], this.zt[h].push(l);
                        const t = new Image;
                        t.index = e, t.size = a, t.onload = c, t.onerror = f, t.onabort = f, t.url = h, 
                        t.crossOrigin = "Anonymous", y = !0, o++, t.src = h;
                    }
                }
                y || e(null, {
                    icons: r,
                    buffers: s
                });
            }
            Vt(t, i, e) {
                const n = this.ft.get(t);
                return n && "error" !== n && n.data.width >= i && n.data.height >= e;
            }
            Ht(t, i, e, n) {
                this.Vt(t, e, n) || (i ? this.ft.add(t, {
                    data: {
                        data: i,
                        width: e,
                        height: n
                    },
                    url: t
                }) : this.ft.add(t, "error"));
            }
            Nt(t, i) {
                if (!this.Vt(t, i[0], i[1])) return null;
                const e = this.ft.get(t);
                return e ? "error" === e ? e : {
                    data: {
                        data: new Uint8ClampedArray(e.data.data),
                        width: e.data.width,
                        height: e.data.height
                    },
                    url: e.url
                } : null;
            }
            Wt(t, i) {
                if (!i[0] || !i[1]) return;
                const e = this.options.maxSize || 254;
                let [n, r] = i;
                const s = n / r;
                if (t) {
                    const i = this.ft.get(t);
                    if (i && "error" !== i) {
                        const {width: t, height: e} = i.data;
                        t > n && (n = t), e > r && (r = e);
                    }
                }
                n > e && (r = e / s, n = e), r > e && (n = e * s, r = e), i[0] = Math.floor(n), 
                i[1] = Math.floor(r);
            }
        }
        function Bn(t) {
            return 3 === t.length && t.push(1), t.reduce((t, i, e) => t += e < 3 ? 255 * i + "," : i + ")", "rgba(");
        }
        var Xn = Object.freeze({
            __proto__: null,
            clipPolygon: Un,
            calculateSignedArea: mt,
            getFeaAltitudeAndHeight: function(t, i, e, n, r, s, o) {
                const h = vt(t.properties, e, n), a = h * i;
                let l = h;
                return r ? l = vt(t.properties, r, s) : o && (l = h - vt(t.properties, o, 0)), l *= i, 
                {
                    altitude: a,
                    height: l
                };
            },
            convertRTLText: zi
        });
        const Zn = {
            polygonPatternFile: 1,
            markerFile: 1,
            markerPlacement: 1,
            markerSpacing: 1,
            textName: 1,
            textStyle: 1,
            textFaceName: 1,
            textWeight: 1,
            textPlacement: 1,
            textSpacing: 1,
            lineJoin: 1,
            lineCap: 1,
            linePatternFile: 1
        }, Yn = {
            visible: 1,
            textHorizontalAlignment: 1,
            textVerticalAlignment: 1,
            textWrapWidth: 1,
            markerHorizontalAlignment: 1,
            markerVerticalAlignment: 1
        }, Kn = {
            lineDasharray: 1
        };
        Object.assign(Yn, Zn), Object.assign(Kn, Zn);
        const Qn = [ "GeoJSONVectorTileLayer" ];
        class tr extends r.worker.Actor {
            constructor(t, i) {
                super(t);
                const e = i.getMap().id;
                this.$t = i, this.Gt = e, this.Jt = "vt_" + r.Util.UID();
                const n = i.getJSONType();
                this.qt = Qn.indexOf(n) >= 0, this.Bt = {}, this.Xt = new qn({
                    iconErrorUrl: i.options.iconErrorUrl,
                    maxSize: i.options.maxIconSize
                });
                const s = !i.getRenderer().isEnableWorkAround("win-intel-gpu-crash");
                this.Zt = new Gn(t => {
                    i.getMap().getRenderer().callInNextFrame(t);
                }, i.options.glyphSdfLimitPerFrame, s);
            }
            initialize(t) {
                t(null);
            }
            addLayer(t) {
                const i = this.$t, e = i.getWorkerOptions() || {}, n = this.Jt, r = i.getJSONType(), s = {
                    mapId: this.Gt,
                    layerId: n,
                    command: "addLayer",
                    params: {
                        type: r,
                        options: e
                    }
                };
                this.qt ? (void 0 === this.Bt[n] && (this.Bt[n] = this.getDedicatedWorker()), this.send(s, null, t, this.Bt[n])) : this.broadcast(s, null, t);
            }
            abortTile(t, i) {
                const e = this.Jt, n = {
                    mapId: this.Gt,
                    layerId: e,
                    command: "abortTile",
                    params: {
                        url: t
                    }
                };
                this.qt ? (void 0 === this.Bt[e] && (this.Bt[e] = this.getDedicatedWorker()), this.send(n, null, i, this.Bt[e])) : this.broadcast(n, null, i);
            }
            removeLayer(t) {
                const i = this.Jt, e = {
                    mapId: this.Gt,
                    layerId: i,
                    command: "removeLayer"
                };
                this.qt ? (void 0 !== this.Bt[i] && this.send(e, null, t, this.Bt[i]), delete this.Bt[i]) : this.broadcast(e, null, t);
            }
            updateStyle(t, i) {
                const e = this.Jt, n = {
                    mapId: this.Gt,
                    layerId: e,
                    command: "updateStyle",
                    params: t
                };
                this.qt ? void 0 !== this.Bt[e] && this.send(n, null, i, this.Bt[e]) : this.broadcast(n, null, i);
            }
            updateOptions(t, i) {
                const e = this.Jt, n = {
                    mapId: this.Gt,
                    layerId: e,
                    command: "updateOptions",
                    params: t
                };
                this.qt ? void 0 !== this.Bt[e] && this.send(n, null, i, this.Bt[e]) : this.broadcast(n, null, i);
            }
            loadTile(t, i) {
                const e = this.Jt, n = {
                    mapId: this.Gt,
                    layerId: e,
                    command: "loadTile",
                    params: {
                        tileInfo: D(t.tileInfo),
                        glScale: t.glScale,
                        zScale: t.zScale
                    }
                }, {x: r, y: s} = t.tileInfo, o = (r + s) % this.workers.length;
                this.send(n, null, i, void 0 === this.Bt[e] ? this.workers[o].id : this.Bt[e]);
            }
            remove() {
                super.remove(), this.Bt = {};
            }
            fetchIconGlyphs({icons: t, glyphs: i}, e) {
                this.Zt.getGlyphs(i, (i, n) => {
                    if (i) throw i;
                    const r = n.buffers || [];
                    this.Xt.getIcons(t, (t, i) => {
                        if (t) throw t;
                        i.buffers && i.buffers.length && r.push(...i.buffers), e(null, {
                            icons: i.icons,
                            glyphs: n.glyphs
                        }, r);
                    });
                });
            }
            setData(t, i) {
                const e = this.Jt, n = {
                    mapId: this.Gt,
                    layerId: e,
                    command: "setData",
                    params: {
                        data: t
                    }
                };
                this.send(n, null, i, this.Bt[e]);
            }
            Yt(t) {
                return t.id;
            }
        }
        const ir = {};
        class er {
            constructor(t, i, e) {
                this.Kt = t, this.Qt = i, this.ti = e || [ 0, 1, 0 ];
            }
            draw(t, i, e, n, r) {
                this.ii || this.ei();
                if (!this.ni) {
                    this.ni = this.Kt.buffer(new Uint16Array([ 0, 0, 0, n, 0, n, n, n, n, n, n, 0, n, 0, 0, 0 ]));
                    const t = n / e;
                    this.ri = this.Kt.buffer(new Uint16Array([ 0, n - 64 * t, 0, n, 512 * t, n - 64 * t, 512 * t, n ]));
                }
                let s = this.si;
                if (!s) {
                    const t = this.Qt.getDevicePixelRatio() > 1 ? 2 : 1;
                    s = this.si = document.createElement("canvas"), s.width = 512 * t, s.height = 64 * t;
                    const i = s.getContext("2d");
                    i.font = "36px monospace", i.scale(t, t), this.oi = this.Kt.texture({
                        width: s.width,
                        height: s.height,
                        data: s
                    });
                }
                const o = s.getContext("2d");
                o.clearRect(0, 0, s.width, s.height), o.fillStyle = `rgba(${this.ti.map(t => 255 * t).join()})`, 
                o.fillText(t, 20, 36), this.oi({
                    width: s.width,
                    height: s.height,
                    data: s
                }), this.ii({
                    transform: i,
                    data: this.ni,
                    debugLine: 1,
                    primitive: "lines",
                    framebuffer: r || null,
                    image: this.oi,
                    count: 8
                }), this.ii({
                    transform: i,
                    data: this.ri,
                    debugLine: 0,
                    primitive: "triangle strip",
                    framebuffer: r || null,
                    image: this.oi,
                    count: 4
                });
            }
            delete() {
                this.oi && (this.oi.destroy(), delete this.oi), this.hi && (this.hi.destroy(), delete this.hi), 
                this.ni && (this.ni.destroy(), this.ri.destroy(), delete this.ni, delete this.ri), 
                this.ii && (this.ii.destroy(), delete this.ii);
            }
            ei() {
                this.hi = this.Kt.buffer(new Uint8Array([ 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1 ])), 
                this.ii = this.Kt({
                    vert: "\n                attribute vec2 aPosition;\n                attribute vec2 aTexCoord;\n                uniform mat4 transform;\n\n                varying vec2 vTexCoord;\n                void main()\n                {\n                    gl_Position = transform * vec4(aPosition, 0.0, 1.0);\n                    vTexCoord = aTexCoord;\n                }\n            ",
                    frag: "\n                precision mediump float;\n                uniform sampler2D uImage;\n                uniform vec3 uColor;\n                uniform float uOpacity;\n                uniform float uDebugLine;\n\n                varying vec2 vTexCoord;\n\n                void main()\n                {\n                    if (uDebugLine == 1.) {\n                        gl_FragColor = vec4(uColor, 1.0) * uOpacity;\n                    } else {\n                        gl_FragColor = texture2D(uImage, vTexCoord) * uOpacity;\n                    }\n                    gl_FragColor *= gl_FragColor.a;\n                }\n            ",
                    attributes: {
                        aPosition: this.Kt.prop("data"),
                        aTexCoord: this.hi
                    },
                    uniforms: {
                        transform: this.Kt.prop("transform"),
                        uColor: this.ti,
                        uOpacity: 1,
                        uDebugLine: this.Kt.prop("debugLine"),
                        uImage: this.Kt.prop("image")
                    },
                    count: this.Kt.prop("count"),
                    primitive: this.Kt.prop("primitive"),
                    depth: {
                        enable: !1,
                        mask: !1
                    },
                    blend: {
                        enable: !0,
                        func: {
                            src: "one",
                            dst: "one minus src alpha"
                        },
                        equation: "add"
                    },
                    stencil: {
                        enable: !1
                    },
                    viewport: {
                        x: 0,
                        y: 0,
                        width: () => this.Qt.getRenderer().canvas.width,
                        height: () => this.Qt.getRenderer().canvas.height
                    },
                    framebuffer: this.Kt.prop("framebuffer")
                });
            }
        }
        const nr = new Uint8Array([ 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1 ]), rr = [];
        class sr {
            constructor(t, i, n) {
                this.Kt = t;
                (this.kt = new e.reshader.Geometry({
                    aPosition: nr
                }, null, nr.length / 2, {
                    positionSize: 2
                })).generateBuffers(t), this.ai = new e.reshader.Scene, this.li = [], this.ui = 0, 
                this.ci = i, this.Qt = n, this.ei(t);
            }
            start() {
                this.ui = 0, this.ai.clear();
            }
            add(t, i, n) {
                const r = this.fi(n);
                r.setUniform("ref", t), e.vec3.set(rr, i, i, 1);
                const s = r.localTransform;
                e.mat4.fromScaling(s, rr), e.mat4.mul(s, n, s), r.setLocalTransform(s), this.ai.addMesh(r);
            }
            render(t) {
                this.di.render(this.yi, {
                    projViewMatrix: this.Qt.projViewMatrix
                }, this.ai, t);
            }
            fi() {
                const t = this.ui++;
                return this.li[t] || (this.li[t] = new e.reshader.Mesh(this.kt)), this.li[t];
            }
            ei(t) {
                const i = this.ci, n = {
                    viewport: {
                        x: 0,
                        y: 0,
                        width: () => i.width,
                        height: () => i.height
                    },
                    stencil: {
                        enable: !0,
                        mask: 255,
                        func: {
                            cmp: "always",
                            ref: (t, i) => i.ref,
                            mask: 255
                        },
                        op: {
                            fail: "replace",
                            zfail: "replace",
                            zpass: "replace"
                        }
                    },
                    depth: {
                        enable: !0,
                        func: "always",
                        mask: !1
                    },
                    colorMask: [ !1, !1, !1, !1 ]
                };
                this.yi = new e.reshader.MeshShader({
                    vert: "\n#define SHADER_NAME TILE_STENCIL_VERT\nattribute vec2 aPosition;\nuniform mat4 projViewModelMatrix;\n\nvoid main()\n{\n    gl_Position = projViewModelMatrix * vec4(aPosition, 0.0, 1.0);\n}\n",
                    frag: "\n#define SHADER_NAME TILE_STENCIL_FRAG\nvoid main()\n{\n    gl_FragColor = vec4(1.0, 0.0, 0.0, 0.1);\n}\n",
                    uniforms: [ {
                        name: "projViewModelMatrix",
                        type: "function",
                        fn: function(t, i) {
                            const n = [];
                            return e.mat4.multiply(n, i.projViewMatrix, i.modelMatrix), n;
                        }
                    } ],
                    extraCommandProps: n
                }), this.di = new e.reshader.Renderer(t);
            }
            remove() {
                this.kt.dispose();
                for (let t = 0; t < this.li.length; t++) this.li[t].dispose();
                this.li.length = 0, this.yi.dispose();
            }
        }
        const or = [], hr = [ 0, 0, 0, 0 ], ar = new r.Point(0, 0);
        class lr extends r.renderer.TileLayerCanvasRenderer {
            supportRenderMode() {
                return !0;
            }
            constructor(t) {
                super(t), this.ready = !1, this.ct = 0, this.pi = {}, this.mi = {}, this.vi = {};
            }
            getTileLevelValue(t, i) {
                if (this.isBackTile(t.id)) {
                    const e = t.z;
                    return e - i >= 0 ? 0 : i - e;
                }
                return 0;
            }
            getWorkerConnection() {
                return this.gi;
            }
            setStyle() {
                this.wi && this.wi.update(), this.gi ? (this.ct++, this.gi.updateStyle(this.layer.bi(), t => {
                    if (t) throw new Error(t);
                    this.Mi = !0, this.clear(), this.xi(), this.Fi(), this.setToRedraw();
                }), this.layer.fire("refreshstyle")) : this.Fi();
            }
            updateOptions(t) {
                this.gi && this.gi.updateOptions(this.layer.getWorkerOptions(), i => {
                    if (i) throw new Error(i);
                    (t.features || t.pickingGeometry || t.altitudeProperty) && (this.clear(), this.xi(), 
                    this.Fi()), this.setToRedraw();
                });
            }
            updateSceneConfig(t, i, e) {
                const n = 0 === t ? this.plugins : this.featurePlugins;
                if (!n || !n[i]) return;
                this.Mi = !0;
                const r = this.layer.bi(), s = this.layer.Ai(t, r);
                n[i].config = s[i].renderPlugin, n[i].updateSceneConfig({
                    sceneConfig: e
                }), this.setToRedraw();
            }
            updateDataConfig(t, i, e, n) {
                const r = 0 === t ? this.plugins : this.featurePlugins;
                r && r[i] && (this.Mi = !0, r[i].updateDataConfig(e, n) ? this.setStyle() : this.setToRedraw());
            }
            updateSymbol(t, i, e) {
                const n = 0 === t ? this.plugins : this.featurePlugins;
                if (!n || !n[i]) return !1;
                const r = this.layer.bi(), s = this.layer.Ai(t, r), o = n[i];
                o.style = s[i];
                const h = o.updateSymbol(e, s[i].symbol);
                return this.setToRedraw(), h;
            }
            needToRedraw() {
                const t = super.needToRedraw();
                if (!t) {
                    const t = this.ki();
                    for (let i = 0; i < t.length; i++) if (t[i] && t[i].needToRedraw()) return !0;
                }
                return t;
            }
            needRetireFrames() {
                if (this.Mi) return !0;
                const t = this.ki();
                for (let i = 0; i < t.length; i++) if (t[i] && t[i].needToRetireFrames()) return !0;
                return !1;
            }
            createContext() {
                const t = this.canvas.gl && this.canvas.gl.wrap;
                t ? (this.gl = this.canvas.gl.wrap(), this.regl = this.canvas.gl.regl) : this._i(), 
                t && (this.canvas.pickingFBO = this.canvas.pickingFBO || this.regl.framebuffer(this.canvas.width, this.canvas.height)), 
                this.pickingFBO = this.canvas.pickingFBO || this.regl.framebuffer(this.canvas.width, this.canvas.height), 
                this.Si = new er(this.regl, this.getMap()), this.Pi(), this.wi = new e.GroundPainter(this.regl, this.layer);
            }
            _i() {
                const t = this.layer, i = t.options.glOptions || {
                    alpha: !0,
                    depth: !0,
                    antialias: this.layer.options.antialias
                };
                i.preserveDrawingBuffer = !0, i.stencil = !0, this.glOptions = i, this.gl = this.gl || this.Oi(this.canvas, i), 
                this.regl = e.createREGL({
                    gl: this.gl,
                    attributes: i,
                    extensions: [ "ANGLE_instanced_arrays", "OES_element_index_uint", "OES_standard_derivatives" ],
                    optionalExtensions: t.options.glExtensions || [ "OES_vertex_array_object", "OES_texture_half_float", "OES_texture_half_float_linear", "OES_texture_float", "OES_texture_float_linear", "WEBGL_draw_buffers", "EXT_shader_texture_lod" ]
                });
            }
            Pi() {
                this.gi || (this.gi = new tr("@maptalks/vt", this.layer));
                this.gi.addLayer((t, i) => {
                    this.layer && (this.ready = !0, this.layer.onWorkerReady(t, i), this.layer.fire("workerready"), 
                    this.setToRedraw());
                });
            }
            clearCanvas() {
                super.clearCanvas(), this.regl && (this.glOptions.depth ? this.regl.clear({
                    color: hr,
                    depth: 1,
                    stencil: 0
                }) : this.regl.clear({
                    color: hr,
                    stencil: 0
                }));
            }
            isDrawable() {
                return !0;
            }
            checkResources() {
                return or;
            }
            draw(t, i) {
                this.Ci !== t && (this.Mi = !1, this.Ii());
                const e = this.layer;
                this.prepareCanvas(), this.ready && e.ready ? (this.plugins || this.Fi(), e.isDefaultRender() || this.plugins.length || this.featurePlugins.length ? (e.options.collision && (e.clearCollisionIndex(), 
                e.clearBackgroundCollisionIndex()), this.Ti = t, this.Di = this.Li(this.getMap().getGLRes()), 
                this.Ui = i || {}, this.Ei(t), super.draw(t), this.Ci !== t && this.ji(t), this.Ri(t), 
                this.completeRender(), this.Ci = t) : this.completeRender()) : this.completeRender();
            }
            Ii() {
                this.ki().forEach((t, i) => {
                    t.renderIndex = i;
                });
            }
            ji() {
                const t = this.ki();
                this.zi = [];
                let i = +!!this.layer.getGroundConfig().enable;
                t.forEach((t, e) => {
                    t.isVisible() && fr(t) && (this.zi[e] = i, t.needPolygonOffset() && i++);
                }), this.Ni = i;
            }
            getFrameTimestamp() {
                return this.Ti;
            }
            drawOnInteracting(t, i, e) {
                this.draw(i, e);
            }
            drawOutline(t) {
                (this.Wi || this.Hi) && (this.Hi ? this.paintOutlineAll(t) : this.Wi.forEach(i => {
                    this[i[0]](t, ...i[1]);
                }));
            }
            getShadowMeshes() {
                const t = [];
                return this.ki().forEach((i, e) => {
                    if (!i) return;
                    if (!this.Vi(e)) return;
                    const n = i.getShadowMeshes();
                    if (Array.isArray(n)) for (let i = 0; i < n.length; i++) t.push(n[i]);
                }), t;
            }
            isForeground(t) {
                return !(!this.$i || !this.$i[t.properties.tile.id]);
            }
            isBackTile(t) {
                return !(!this.Gi || !this.Gi[t]);
            }
            loadTile(t) {
                const {url: i} = t, e = this.pi[i];
                if (e) e.keys[t.id] || (e.tiles.push(t), e.keys[t.id] = 1); else {
                    const e = this.getTileGLScale(t.z);
                    this.pi[i] = {
                        keys: {},
                        tiles: [ t ]
                    }, this.pi[i].keys[t.id] = 1, this.gi.loadTile({
                        tileInfo: t,
                        glScale: e,
                        zScale: this.Di
                    }, this.Ji.bind(this, i));
                }
                return {};
            }
            getTileGLScale(t) {
                const i = this.getMap();
                return this.layer.getSpatialReference().getResolution(t) / i.getGLRes();
            }
            Ji(t, i, e) {
                if (!this.pi[t]) return;
                if (e && e.canceled) return;
                const n = this.layer, r = n.isDefaultRender(), {tiles: s} = this.pi[t];
                if (delete this.pi[t], i) {
                    if (i.status && 404 === i.status) for (let t = 0; t < s.length; t++) {
                        const i = s[t];
                        this.onTileError(ir, i);
                    }
                    return;
                }
                if (!e) {
                    for (let t = 0; t < s.length; t++) {
                        const i = s[t];
                        this.onTileLoad({
                            qi: !0
                        }, i);
                    }
                    return;
                }
                if (e.style !== this.ct) return;
                let o = !1;
                const h = e.features, a = [];
                for (let t = 0; t < e.data.length; t++) {
                    const i = e.data[t];
                    if (!i || !i.data || !i.styledFeatures.length) continue;
                    const {isUpdated: n, layer: r} = this.Bi(0, t, i, h, a);
                    a.push(r), n && (o = n);
                }
                for (let t = 0; t < e.featureData.length; t++) {
                    const i = e.featureData[t];
                    i && i.data && i.styledFeatures.length && this.Bi(1, t, i, h);
                }
                o && n.ut();
                const l = s[0].z, u = this.layer.getDataSchema(l);
                if (this.Xi(u, e.schema), delete e.features, r && e.data.length !== a.length) {
                    const t = e.data;
                    e.data = [];
                    for (let i = 0; i < t.length; i++) t[i] && t[i].features && e.data.push(t[i]);
                }
                e.layers = a;
                for (let t = 0; t < s.length; t++) {
                    const i = s[t];
                    this.onTileLoad(0 === t ? e : ur(e), i);
                }
                this.layer.fire("datareceived");
            }
            Bi(t, i, e, n) {
                const {style: r, isUpdated: s} = this.Zi(t, i, e.data), o = this.layer, h = o.isDefaultRender(), a = r.symbol, l = e.styledFeatures, u = {};
                if (function(t) {
                    if (!t) return !1;
                    for (const i in t) if (void 0 !== t[i] && null !== t[i]) return !0;
                    return !1;
                }(n)) for (let t = 0, e = l.length; t < e; t++) {
                    let e = n[l[t]];
                    "id" === o.options.features && o.getFeature && (e = o.getFeature(e), e.layer = i), 
                    u[l[t]] = {
                        feature: e,
                        symbol: a
                    };
                }
                delete e.styledFeatures, e.features = u;
                let c = e.data;
                return Array.isArray(c) && (c = c[0]), {
                    isUpdated: s,
                    layer: h ? {
                        layer: c.layer,
                        type: c.type
                    } : null
                };
            }
            Xi(t, i) {
                for (const e in i) {
                    t[e] || (t[e] = {
                        types: i[e].types,
                        properties: {}
                    });
                    const n = i[e].properties, r = t[e].properties;
                    for (const t in n) (!r[t] || r[t] && "object" !== n[t] && "object" === r[t]) && (r[t] = n[t]);
                }
            }
            Zi(t, i, e) {
                Array.isArray(e) && (e = e[0]);
                const n = this.layer;
                let r, s = !1;
                if (n.isDefaultRender() && 0 === t) {
                    let t = this.Mt;
                    t || (t = this.Mt = {});
                    const i = e.layer, n = e.type;
                    t[i] || (t[i] = []), t[i]["plugin_" + n] ? r = t[i]["plugin_" + n] : (r = this.Yi(n), 
                    r.filter = e.filter, t[i].push(r), t[i]["plugin_" + n] = r, s = !0);
                } else {
                    const o = n.bi();
                    if (r = n.Ai(t, o)[i], !r.renderPlugin) {
                        s = !0;
                        const {plugin: t, symbol: n, renderPlugin: o} = this.Yi(e.type);
                        this.plugins[i] = t, r.symbol = n, r.renderPlugin = o;
                    }
                }
                return {
                    style: r,
                    isUpdated: s
                };
            }
            ki(t) {
                let i = this.plugins || [];
                return this.layer.isDefaultRender() && this.Mt && (i = [], t ? t.layers.forEach(t => {
                    i.push(this.Mt[t.layer]["plugin_" + t.type].plugin);
                }) : Object.keys(this.Mt).forEach(t => {
                    for (let e = 0; e < this.Mt[t].length; e++) i.push(this.Mt[t][e].plugin);
                })), this.featurePlugins && this.featurePlugins.length && (i = i.slice(), T(i, this.featurePlugins)), 
                i;
            }
            Ki() {
                if (this.layer.isDefaultRender() && this.Mt) {
                    const t = [];
                    return Object.keys(this.Mt).forEach(i => {
                        for (let e = 0; e < this.Mt[i].length; e++) t.push(this.Mt[i][e].plugin);
                    }), t;
                }
                return this.plugins;
            }
            Ei(t) {
                const i = this.layer.isDefaultRender() && this.Mt, e = this.Ui;
                this.ki().forEach((n, r) => {
                    if (!n) return;
                    if (!this.Vi(r)) return;
                    const s = i ? n.defaultSymbol : n.style && n.style.symbol, o = {
                        regl: this.regl,
                        layer: this.layer,
                        symbol: s,
                        gl: this.gl,
                        sceneConfig: n.config ? n.config.sceneConfig : null,
                        dataConfig: n.config ? n.config.dataConfig : null,
                        pluginIndex: r,
                        timestamp: t
                    };
                    e && S(o, e), n.startFrame(o);
                });
            }
            Ri(t) {
                const i = this.Ui, e = i.renderMode, n = i && i.renderTarget && i.renderTarget.fbo, r = this.getMap().cameraPosition, s = this.ki();
                this.layer.options.collision ? s.forEach(i => {
                    if (!fr(i)) return;
                    if (e && "default" !== e && !i.supportRenderMode(e)) return;
                    const n = this.Qi(i, 0, r, t);
                    i.prepareRender(n), i.updateCollision(n);
                }) : s.forEach(i => {
                    if (!fr(i)) return;
                    if (e && "default" !== e && !i.supportRenderMode(e)) return;
                    const n = this.Qi(i, 0, r, t);
                    i.prepareRender(n);
                });
                const o = !i.timestamp || i.isFinalRender, h = this.Ci !== i.timestamp;
                let a = !1;
                if (h) {
                    const i = -this.layer.getPolygonOffset(), e = this.Qi(null, i, r, t);
                    e.offsetFactor = e.offsetUnits = i, this.wi.paint(e);
                }
                s.forEach((i, s) => {
                    if (!this.te(i)) return;
                    if (e && "default" !== e && !i.supportRenderMode(e)) return;
                    this.regl.clear({
                        stencil: 255,
                        fbo: n
                    }), this.isEnableTileStencil() && i.painter && !i.painter.needClearStencil() && this.ie(n);
                    const o = this.zi[s] || 0, h = this.Qi(i, o, r, t), l = i.endFrame(h);
                    l && l.redraw && this.setToRedraw(), a = !0;
                }), a && this.layer.fire("canvasisdirty"), o && this.ee();
            }
            getPolygonOffsetCount() {
                return this.Ni || 0;
            }
            ee() {
                if (this.layer.options.debug) {
                    const t = this.Ui, i = [], n = this.getMap().projViewMatrix;
                    for (const r in this.tilesInView) {
                        const s = this.tilesInView[r].info, o = s.transform, h = this.tilesInView[r].image.extent, a = t && t.renderTarget;
                        o && h && this.Si.draw(this.getDebugInfo(s.id), e.mat4.multiply(i, n, o), this.layer.getTileSize().width, h, a && a.fbo);
                    }
                }
            }
            te(t) {
                if (!t) return !0;
                const i = t.renderIndex, e = this.Ui, n = this.Vi(i), r = e && e.states && e.states.includesChanged, s = this.ne(t.painter.scene.getMeshes());
                return !n || !r && !s ? 0 : s ? 2 : 1;
            }
            Qi(t, i, e, n) {
                const r = {
                    regl: this.regl,
                    layer: this.layer,
                    gl: this.gl,
                    sceneConfig: t && t.config.sceneConfig,
                    pluginIndex: t && t.renderIndex,
                    polygonOffsetIndex: i,
                    cameraPosition: e,
                    timestamp: n
                }, s = this.Ui;
                return s && S(r, s), r;
            }
            ne(t) {
                if (!t) return !1;
                const i = this.Ui && this.Ui.sceneFilter;
                return i ? t.filter(i).length > 0 : t.length > 0;
            }
            ie(t) {
                const i = this.isEnableTileStencil(), e = this.getCurrentTileZoom();
                let n = this.re;
                n || (n = this.re = new sr(this.regl, this.canvas, this.getMap())), n.start();
                const {tiles: r} = this.se;
                let {parentTiles: s, childTiles: o} = this.se, h = 1;
                o = o.sort(cr);
                for (let t = 0; t < o.length; t++) this.oe(o[t].info, i ? h : this.getTileLevelValue(o[t].info.z, e)), 
                h++;
                s = s.sort(cr);
                for (let t = 0; t < s.length; t++) this.oe(s[t].info, i ? h : this.getTileLevelValue(s[t].info.z, e)), 
                h++;
                const a = r.sort(cr);
                for (let t = a.length - 1; t >= 0; t--) this.oe(a[t].info, i ? h : this.getTileLevelValue(a[t].info.z, e)), 
                h++;
                n.render(t);
            }
            oe(t, i) {
                const e = this.he, n = ar.set(t.extent2d.xmin, t.extent2d.ymax), r = t.transform = t.transform || this.calculateTileMatrix(n, t.z);
                t.stencilRef = i, this.re.add(i, e, r);
            }
            onDrawTileStart(t) {
                super.onDrawTileStart(t);
                const {tiles: i, childTiles: e, parentTiles: n} = t;
                this.$i = {}, this.Gi = {};
                for (let t = 0; t < i.length; t++) this.$i[i[t].info.id] = 1;
                for (let t = 0; t < e.length; t++) this.Gi[e[t].info.id] = 1;
                for (let t = 0; t < n.length; t++) this.Gi[n[t].info.id] = 1;
                this.se = t;
            }
            isEnableTileStencil() {
                return this.layer.isOnly2D();
            }
            drawTile(t, i) {
                if (!i.loadTime || i.qi) return;
                let e = i.cache;
                e || (e = i.cache = {}), this.he || (this.he = i.extent);
                const n = ar.set(t.extent2d.xmin, t.extent2d.ymax), r = t.transform = t.transform || this.calculateTileMatrix(n, t.z), s = t.tileTranslationMatrix = t.tileTranslationMatrix || this.calculateTileTranslationMatrix(n, t.z), o = [];
                T(o, i.data), T(o, i.featureData);
                this.ki(i).forEach((n, h) => {
                    if (!n) return;
                    const a = this.Vi(h);
                    if (!o[h] || !a) return;
                    e[h] || (e[h] = {});
                    const l = {
                        regl: this.regl,
                        layer: this.layer,
                        gl: this.gl,
                        sceneConfig: n.config.sceneConfig,
                        pluginIndex: h,
                        tileCache: e[h],
                        tileData: o[h],
                        tileTransform: r,
                        tileTranslationMatrix: s,
                        tileExtent: i.extent,
                        timestamp: this.Ti,
                        tileInfo: t,
                        tileZoom: this._tileZoom,
                        bloom: this.Ui && this.Ui.bloom
                    }, u = n.paintTile(l);
                    e[h].geometry && (o[h] = 1), !this.Mi && (u.retire || u.redraw) && n.supportRenderMode("taa") && (this.Mi = !0), 
                    u.redraw && this.setToRedraw();
                }), this.setCanvasUpdated();
            }
            pick(t, i, e) {
                const n = [];
                return this.ki().forEach((r, s) => {
                    if (!r) return;
                    if (!this.Vi(s)) return;
                    const o = r.pick(t, i, e.tolerance);
                    o && (o.type = r.getType(), n.push(o));
                }), n;
            }
            deleteTile(t) {
                if (t) {
                    if (t.image && !t.image.qi) {
                        const i = this.Ki();
                        i && i.forEach((i, e) => {
                            i && i.deleteTile({
                                pluginIndex: e,
                                regl: this.regl,
                                layer: this.layer,
                                gl: this.gl,
                                tileCache: t.image.cache ? t.image.cache[e] : {},
                                tileInfo: t.info,
                                tileData: t.image
                            });
                        }), t.image.cache = {};
                    }
                    super.deleteTile(t);
                }
            }
            abortTileLoading(t, i) {
                i && i.url && (this.gi && this.gi.abortTile(i.url), delete this.pi[i.url]), super.abortTileLoading(t, i);
            }
            resizeCanvas(t) {
                super.resizeCanvas(t);
                const i = this.canvas;
                i && (!this.pickingFBO || this.pickingFBO.width === i.width && this.pickingFBO.height === i.height || this.pickingFBO.resize(i.width, i.height), 
                this.ki().forEach(t => {
                    t && t.resize(i.width, i.height);
                }));
            }
            onRemove() {
                this.re && this.re.remove(), this.gi && (this.gi.removeLayer(t => {
                    if (t) throw t;
                }), this.gi.remove(), delete this.gi), this.pickingFBO && (this.canvas.pickingFBO || this.pickingFBO.destroy(), 
                delete this.pickingFBO), this.Si && this.Si.delete(), super.onRemove && super.onRemove(), 
                this.xi();
            }
            xi() {
                this.ki().forEach(t => {
                    t.remove();
                }), this.plugins = [];
            }
            hitDetect(t) {
                if (!this.gl || !this.layer.options.hitDetect) return !1;
                const i = this.gl, e = new Uint8Array(4), n = this.canvas.height;
                return i.readPixels(t.x, n - t.y, 1, 1, i.RGBA, i.UNSIGNED_BYTE, e), e[3] > 0;
            }
            Fi() {
                const {style: t, featureStyle: i} = this.layer.bi(), e = t.map((t, i) => {
                    const e = t.renderPlugin;
                    if (!e) return null;
                    if (!e.type) throw new Error("invalid plugin type for style at " + i);
                    const n = this.ae(e);
                    return n.style = t, n;
                }), n = [];
                return i.forEach((t, i) => {
                    const e = t.renderPlugin;
                    if (!e) return null;
                    if (!e.type) throw new Error("invalid plugin type for features at " + i);
                    const r = this.ae(e);
                    return r.style = t, n.push(r), r;
                }), this.plugins = e, this.featurePlugins = n, this.layer.fire("pluginsinited"), 
                e;
            }
            ae(t) {
                const i = this.layer.constructor.getPlugins()[t.type];
                if (!i) throw new Error(`Plugin for (${t.type}) is not loaded.`);
                const e = new i;
                return e.config = t, e.config.sceneConfig || (e.config.sceneConfig = {}), e;
            }
            Oi(t, i) {
                const e = [ "webgl", "experimental-webgl" ];
                let n = null;
                for (let r = 0; r < e.length; ++r) {
                    try {
                        n = t.getContext(e[r], i);
                    } catch (t) {}
                    if (n) break;
                }
                return n;
            }
            Li(t) {
                return this.getMap().distanceToPointAtRes(1e3, 0, t).x / 1e3 / 10;
            }
            debugFBO(t, i) {
                const e = document.getElementById(t), n = i.width, r = i.height;
                e.width = n, e.height = r;
                const s = e.getContext("2d"), o = this.regl.read({
                    framebuffer: i
                }), h = r / 2 | 0, a = 4 * n;
                for (let t = 0; t < o.length; t++) o[t] *= 255;
                const l = new Uint8Array(4 * n);
                for (let t = 0; t < h; ++t) {
                    const i = t * a, e = (r - t - 1) * a;
                    l.set(o.subarray(i, i + a)), o.copyWithin(i, e, e + a), o.set(l, e);
                }
                const u = new ImageData(n, r);
                u.data.set(o), s.putImageData(u, 0, 0);
            }
            Yi(t) {
                let i;
                switch (t) {
                  case "native-line":
                    i = {
                        type: "native-line",
                        dataConfig: {
                            type: "native-line",
                            only2D: !0
                        }
                    };
                    break;

                  case "native-point":
                    i = {
                        type: "native-point",
                        dataConfig: {
                            type: "native-point",
                            only2D: !0
                        }
                    };
                    break;

                  case "fill":
                    i = {
                        type: "fill",
                        dataConfig: {
                            type: "fill",
                            only2D: !0
                        }
                    };
                    break;

                  default:
                    i = null;
                }
                const e = function(t) {
                    switch (t) {
                      case "native-point":
                        return {
                            markerFill: "#f00",
                            markerSize: 6,
                            markerOpacity: .5
                        };

                      case "native-line":
                        return {
                            lineColor: "#bbb",
                            lineOpacity: .5
                        };

                      case "fill":
                        return {
                            polygonFill: "#00f",
                            polygonOpacity: .6
                        };
                    }
                    return null;
                }(t), n = this.ae(i);
                return n.defaultSymbol = e, {
                    plugin: n,
                    symbol: e,
                    renderPlugin: i
                };
            }
            Vi() {
                return !0;
            }
            isEnableWorkAround(t) {
                return "win-intel-gpu-crash" === t && (this.layer.options.workarounds["win-intel-gpu-crash"] && function(t) {
                    const i = t.getExtension("WEBGL_debug_renderer_info");
                    if (i && "undefined" != typeof navigator) {
                        const e = t.getParameter(i.UNMASKED_RENDERER_WEBGL), n = "Win32" === navigator.platform || "Win64" === navigator.platform;
                        if (e && e.toLowerCase().indexOf("intel") >= 0 && n) return !0;
                    }
                    return !1;
                }(this.gl));
            }
            isCachePlaced(t) {
                return 1 === this.vi[t];
            }
            placeCache(t) {
                this.vi[t] = 1;
            }
            fetchCache(t) {
                return this.mi[t] && this.mi[t].resource;
            }
            removeCache(t) {
                delete this.vi[t];
                const i = this.mi[t];
                i && (i.count--, i.count <= 0 && (i.onDelete && i.onDelete(i.resource), delete this.mi[t]));
            }
            addToCache(t, i, e) {
                delete this.vi[t], this.mi[t] ? this.mi[t].count++ : this.mi[t] = {
                    resource: i,
                    onDelete: e,
                    count: 1
                };
            }
            getZScale() {
                return this.Di;
            }
            outline(t, i) {
                i && (Array.isArray(i) || (i = [ i ]), this.Wi || (this.Wi = []), this.Wi.push([ "paintOutline", [ t, i ] ]), 
                this.setToRedraw());
            }
            outlineBatch(t) {
                this.Wi || (this.Wi = []), this.Wi.push([ "paintBatchOutline", [ t ] ]), this.setToRedraw();
            }
            outlineAll() {
                this.Hi = !0, this.setToRedraw();
            }
            paintOutlineAll(t) {
                const i = this.ki();
                for (let e = 0; e < i.length; e++) i[e].outlineAll(t);
            }
            paintOutline(t, i, e) {
                const n = i, r = this.ki();
                !r[n] || r[n].painter && !r[n].painter.isVisible() || r[n].outline(t, e);
            }
            paintBatchOutline(t, i) {
                const e = this.ki();
                !e[i] || e[i].painter && !e[i].painter.isVisible() || e[i].outlineAll(t);
            }
            cancelOutline() {
                delete this.Wi, delete this.Hi, this.setToRedraw();
            }
            setZIndex() {
                return this.setToRedraw(), this.Mi = !0, super.setZIndex.apply(this, arguments);
            }
        }
        function ur(t) {
            let i;
            Array.isArray(t.data) ? (i = [], T(i, t.data)) : (i = {}, S(i, t.data));
            const e = S({}, t);
            return e.data = i, e;
        }
        function cr(t, i) {
            return i.info.z - t.info.z;
        }
        function fr(t) {
            const i = t.painter && t.painter.scene && t.painter.scene.getMeshes();
            return i && i.length;
        }
        lr.include({
            calculateTileMatrix: function() {
                const t = new Array(3), i = new Array(3), n = new Array(3);
                return function(r, s) {
                    const o = this.he, h = this.getTileGLScale(s), a = r, l = this.layer.getTileSize(), u = e.mat4.identity([]);
                    return e.mat4.scale(u, u, e.vec3.set(t, h, h, this.Di)), e.mat4.translate(u, u, e.vec3.set(i, a.x, a.y, 0)), 
                    e.mat4.scale(u, u, e.vec3.set(n, l.width / o, -l.height / o, 1)), u;
                };
            }(),
            calculateTileTranslationMatrix: function() {
                const t = new Array(3);
                return function(i, n) {
                    const r = this.getTileGLScale(n), s = i, o = e.mat4.identity([]);
                    return e.mat4.translate(o, o, e.vec3.set(t, s.x * r, s.y * r, 0)), o;
                };
            }()
        });
        var dr = Array.isArray, yr = Object.keys, pr = Object.prototype.hasOwnProperty, mr = function t(i, e) {
            if (i === e) return !0;
            if (i && e && "object" == typeof i && "object" == typeof e) {
                var n, r, s, o = dr(i), h = dr(e);
                if (o && h) {
                    if ((r = i.length) != e.length) return !1;
                    for (n = r; 0 != n--; ) if (!t(i[n], e[n])) return !1;
                    return !0;
                }
                if (o != h) return !1;
                var a = i instanceof Date, l = e instanceof Date;
                if (a != l) return !1;
                if (a && l) return i.getTime() == e.getTime();
                var u = i instanceof RegExp, c = e instanceof RegExp;
                if (u != c) return !1;
                if (u && c) return i.toString() == e.toString();
                var f = yr(i);
                if ((r = f.length) !== yr(e).length) return !1;
                for (n = r; 0 != n--; ) if (!pr.call(e, f[n])) return !1;
                for (n = r; 0 != n--; ) if (!t(i[s = f[n]], e[s])) return !1;
                return !0;
            }
            return i != i && e != e;
        };
        function vr(t, i, e) {
            for (let n = 0; n < t.length; n++) {
                const r = t[n], s = S({}, r), {renderPlugin: o} = r, h = S({}, o);
                h.sceneConfig && !Object.keys(h.sceneConfig).length && delete h.sceneConfig;
                let a = -1;
                for (let t = e.length - 1; t >= 0; t--) if (mr(h, e[t])) {
                    a = t;
                    break;
                }
                a < 0 && (a = e.length, e.push(h)), s.renderPlugin = a, i.push(s);
            }
        }
        const gr = "function" == typeof fetch && "function" == typeof AbortController, wr = {
            jsonp: function(t, i) {
                const e = "_maptalks_jsonp_" + k++;
                t.match(/\?/) ? t += "&callback=" + e : t += "?callback=" + e;
                let n = document.createElement("script");
                return n.type = "text/javascript", n.src = t, window[e] = function(t) {
                    i(null, t), document.getElementsByTagName("head")[0].removeChild(n), n = null, delete window[e];
                }, document.getElementsByTagName("head")[0].appendChild(n), this;
            },
            get: function(t, i, e) {
                if (C(i)) {
                    const t = e;
                    e = i, i = t;
                }
                (i = i || {}).method && (i.method = i.method.toUpperCase());
                const n = "POST" === i.method;
                if (gr) {
                    const r = new AbortController, s = {
                        signal: r.signal,
                        method: i.method || "GET",
                        referrerPolicy: "origin"
                    };
                    return n && (I(i.body) || (s.body = JSON.stringify(i.body))), I(i.headers) || (s.headers = i.headers), 
                    I(i.credentials) || (s.credentials = i.credentials), fetch(t, s).then(t => {
                        const n = this.s(t, i.returnJSON, i.responseType);
                        n.message ? e(n) : n.then(n => {
                            "arraybuffer" === i.responseType ? e(null, {
                                data: n,
                                cacheControl: t.headers.get("Cache-Control"),
                                expires: t.headers.get("Expires"),
                                contentType: t.headers.get("Content-Type")
                            }) : e(null, n);
                        }).catch(t => {
                            t.code && t.code === DOMException.ABORT_ERR || (console.error(t), e(t));
                        });
                    }).catch(t => {
                        t.code && t.code === DOMException.ABORT_ERR || (console.error(t), e(t));
                    }), r;
                }
                {
                    const r = wr.o(e);
                    if (r.open(i.method || "GET", t, !0), i) {
                        for (const t in i.headers) r.setRequestHeader(t, i.headers[t]);
                        r.withCredentials = "include" === i.credentials, i.responseType && (r.responseType = i.responseType);
                    }
                    return r.send(n ? i.body : null), r;
                }
            },
            s: (t, i, e) => 200 !== t.status ? {
                status: t.status,
                statusText: t.statusText,
                message: `incorrect http request with status code(${t.status}): ${t.statusText}`
            } : "arraybuffer" === e ? t.arrayBuffer() : i ? t.json() : t.text(),
            u: function(t, i) {
                return function() {
                    if (4 === t.readyState) if (200 === t.status) if ("arraybuffer" === t.responseType) {
                        0 === t.response.byteLength ? i({
                            status: 200,
                            statusText: t.statusText,
                            message: "http status 200 returned without content."
                        }) : i(null, {
                            data: t.response,
                            cacheControl: t.getResponseHeader("Cache-Control"),
                            expires: t.getResponseHeader("Expires"),
                            contentType: t.getResponseHeader("Content-Type")
                        });
                    } else i(null, t.responseText); else i({
                        status: t.status,
                        statusText: t.statusText,
                        message: `incorrect http request with status code(${t.status}): ${t.statusText}`
                    });
                };
            },
            o: function(t) {
                let i;
                try {
                    i = new XMLHttpRequest;
                } catch (t) {
                    try {
                        i = new ActiveXObject("Msxml2.XMLHTTP");
                    } catch (t) {
                        try {
                            i = new ActiveXObject("Microsoft.XMLHTTP");
                        } catch (t) {}
                    }
                }
                return i.onreadystatechange = wr.u(i, t), i;
            },
            getArrayBuffer(t, i, e) {
                if (C(i)) {
                    const t = e;
                    e = i, i = t;
                }
                return i || (i = {}), i.responseType = "arraybuffer", wr.get(t, i, e);
            },
            getJSON: function(t, i, e) {
                if (C(i)) {
                    const t = e;
                    e = i, i = t;
                }
                const n = function(t, i) {
                    const n = "string" == typeof i ? JSON.parse(i) : i || null;
                    e(t, n);
                };
                return i && i.jsonp ? wr.jsonp(t, n) : ((i = i || {}).returnJSON = !0, wr.get(t, i, n));
            }
        }, br = {
            renderer: "gl",
            fadeAnimation: !1,
            altitudeProperty: "altitude",
            forceRenderOnZooming: !0,
            forceRenderOnMoving: !0,
            forceRenderOnRotating: !0,
            clipByPitch: !1,
            zoomBackground: !0,
            tileSize: [ 512, 512 ],
            tileSystem: [ 1, -1, -6378137 * Math.PI, 6378137 * Math.PI ],
            stencil: !1,
            features: !0,
            schema: !1,
            cascadeTiles: !0,
            collision: !0,
            picking: !0,
            pickingPoint: !1,
            pickingGeometry: !1,
            glyphSdfLimitPerFrame: 15,
            boxLimitOnZoomout: 7,
            maxCacheSize: 72,
            antialias: !1,
            iconErrorUrl: null,
            collisionFrameLimit: 1.5,
            defaultRendering: !0,
            textGamma: 1,
            tileMeshCreationLimitPerFrame: 0,
            maxIconSize: 254,
            workarounds: {
                "win-intel-gpu-crash": !0
            },
            pyramidMode: 1,
            styleScale: 1,
            spatialReference: null
        };
        class Mr extends r.TileLayer {
            constructor(t, i) {
                super(t, i), this.VERSION = Mr.VERSION;
                const e = i && i.style;
                this.setStyle(e);
            }
            onAdd() {
                const t = this.getMap(), i = this.getSpatialReference().toJSON().projection, e = t.getSpatialReference().toJSON().projection;
                if ((i && i.toLowerCase()) !== (e && e.toLowerCase())) throw new Error(`VectorTileLayer's projection(${i}) must be the same with map(${e}).`);
            }
            onWorkerReady() {}
            onConfig(t) {
                const i = this.getRenderer();
                i && i.updateOptions(t);
            }
            getWorkerOptions() {
                const t = this.getMap();
                return {
                    debug: this.options.debug,
                    debugTile: this.options.debugTile,
                    altitudeProperty: this.options.altitudeProperty,
                    tileSize: this.options.tileSize,
                    baseRes: t.getGLRes(),
                    style: this.isDefaultRender() ? {
                        style: [],
                        featureStyle: []
                    } : this.bi(),
                    features: this.options.features,
                    schema: this.options.schema,
                    pickingGeometry: this.options.pickingGeometry
                };
            }
            setStyle(t) {
                if (t && (P(t) || t.url)) {
                    const i = t, e = i.lastIndexOf("/"), n = e < 0 ? "." : i.substring(0, e);
                    return this.ready = !1, wr.getJSON(t.url ? t.url : t, t.url ? t : {}, (t, e) => {
                        if (t) throw this.setStyle([]), t;
                        let r;
                        e.style ? (r = e, r.$root || (r.$root = n)) : r = {
                            $root: n,
                            style: e
                        }, this.setStyle(r), this.options.style = i;
                    }), this;
                }
                if (this.options.style = t, t && (t.$root || t.$iconset)) {
                    let i = t.$root, e = t.$iconset;
                    i && "/" === i[i.length - 1] && (i = i.substring(0, i.length - 1)), e && "/" === e[e.length - 1] && (e = e.substring(0, e.length - 1)), 
                    this.H = function(t) {
                        return "{$root}" === t ? i : "{$iconset}" === t ? e : null;
                    };
                }
                this.ready = !0, t = t || [], (Array.isArray(t) || t.renderPlugin) && (t = {
                    style: t
                }), t = function(t) {
                    if (!t.plugins) return t;
                    const {plugins: i, styles: e} = t;
                    let {style: n, featureStyle: r} = e;
                    n = n || [], r = r || [];
                    const s = new Array(n.length);
                    for (let t = 0; t < n.length; t++) s[t] = S({}, n[t]), s[t].renderPlugin = i[n[t].renderPlugin];
                    const o = new Array(r.length);
                    for (let t = 0; t < r.length; t++) o[t] = S({}, r[t]), o[t].renderPlugin = i[r[t].renderPlugin];
                    const h = {
                        style: s,
                        featureStyle: o
                    };
                    return t.$root && (h.$root = t.$root), t.$iconset && (h.$iconset = t.$iconset), 
                    h;
                }(t = JSON.parse(JSON.stringify(t))), this.le = t.featureStyle || [], this.ue = function(t) {
                    if (!t || !Array.isArray(t)) return [];
                    const i = [];
                    for (let e = 0; e < t.length; e++) {
                        const n = t[e].style;
                        if (n && Array.isArray(n) && n.length) for (let r = 0; r < n.length; r++) {
                            const s = S({}, t[e], n[r]);
                            n[r].ce = i.length, delete s.style, i.push(s);
                        } else i.push(S({}, t[e]));
                    }
                    return i;
                }(t.featureStyle), this.fe = t.style || [];
                const i = t.background || {};
                this.de = {
                    enable: i.enable || !1,
                    color: Fr(i.color) || [ 0, 0, 0, 0 ],
                    opacity: Ar(i.opacity, 1),
                    patternFile: i.patternFile,
                    depthRange: i.depthRange
                }, this.validateStyle(), this.H && this.ye(), this.ut();
                const e = this.getRenderer();
                return e && e.setStyle(), this.fire("setstyle", {
                    style: this.getStyle(),
                    computedStyle: this.getComputedStyle()
                }), this;
            }
            getPolygonOffsetCount() {
                const t = this.getRenderer();
                return t ? t.getPolygonOffsetCount() : 0;
            }
            getPolygonOffset() {
                return this.pe || 0;
            }
            setPolygonOffset(t, i) {
                return this.pe = t, this.me = i, this;
            }
            getTotalPolygonOffset() {
                return this.me;
            }
            outlineAll() {
                const t = this.getRenderer();
                return t ? (t.outlineAll(), this) : this;
            }
            outline(t, i) {
                const e = this.getRenderer();
                return e ? (e.outline(t, i), this) : this;
            }
            outlineBatch(t) {
                const i = this.getRenderer();
                return i ? (i.outlineBatch(t), this) : this;
            }
            cancelOutline() {
                const t = this.getRenderer();
                return t ? (t.cancelOutline(), this) : this;
            }
            ye() {
                r.Util.convertStylePath(this.fe, this.H), r.Util.convertStylePath(this.ue, this.H);
            }
            updateSceneConfig(t, i) {
                return this.ve(0, t, i);
            }
            updateFeatureSceneConfig(t, i, e) {
                return this.ve(1, t, e, i);
            }
            ve(t, i, e, n) {
                const r = this.Ai(t);
                if (!r) return this;
                let s, o = i;
                if (r[i].renderPlugin.sceneConfig || (r[i].renderPlugin.sceneConfig = {}), S(r[i].renderPlugin.sceneConfig, e), 
                void 0 !== n) {
                    kr(this.le, i, n), o = this.le[i].style[n].ce;
                    const t = r[o].renderPlugin;
                    t.sceneConfig || (t.sceneConfig = {}), s = t.sceneConfig;
                } else _r(r, i), s = r[i].renderPlugin.sceneConfig;
                if (S(s, e), Array.isArray(this.options.style)) {
                    const t = this.options.style[i].renderPlugin;
                    t.sceneConfig || (t.sceneConfig = {}), S(t.sceneConfig, e);
                } else {
                    const r = this.Ai(t, this.options.style);
                    let s;
                    void 0 !== n ? (kr(r, i, n), s = r[i].style[n].renderPlugin) : (_r(r, i), s = r[i].renderPlugin), 
                    s.sceneConfig || (s.sceneConfig = {}), S(s.sceneConfig, e);
                }
                const h = this.getRenderer();
                return h && h.updateSceneConfig(t, o, e), 0 === t ? this.fire("updatesceneconfig", {
                    index: i,
                    sceneConfig: e
                }) : 1 === t && this.fire("updatefeaturesceneconfig", {
                    index: i,
                    styleIdx: n,
                    sceneConfig: e
                }), this;
            }
            updateDataConfig(t, i) {
                return this.ge(0, t, i);
            }
            updateFeatureDataConfig(t, i, e) {
                return this.ge(1, t, e, i);
            }
            ge(t, i, e, n) {
                const r = this.Ai(t);
                if (!r) return this;
                let s, o = i;
                void 0 !== n ? (kr(this.le, i, n), o = this.le[i].style[n].ce, s = r[o].renderPlugin.dataConfig) : (_r(r, i), 
                s = r[i].renderPlugin.dataConfig);
                const h = S({}, s);
                if (S(s, e), Array.isArray(this.options.style)) S(this.options.style[i].renderPlugin.dataConfig, e); else {
                    const r = this.Ai(t, this.options.style);
                    let s;
                    void 0 !== n ? (kr(r, i, n), s = r[i].style[n].renderPlugin) : (_r(r, i), s = r[i].renderPlugin), 
                    s.dataConfig || (s.dataConfig = {}), S(s.dataConfig, e);
                }
                const a = this.getRenderer();
                return a && a.updateDataConfig(t, o, e, h), 0 === t ? this.fire("updatedataconfig", {
                    index: i,
                    dataConfig: e
                }) : 1 === t && this.fire("updatefeaturedataconfig", {
                    index: i,
                    styleIdx: n,
                    dataConfig: e
                }), this;
            }
            updateSymbol(t, i) {
                return this.we(0, t, i);
            }
            updateFeatureSymbol(t, i, e) {
                return this.we(1, t, e, i);
            }
            we(t, i, e, n) {
                const s = this.Ai(t);
                if (!s) return this;
                let o = i;
                void 0 !== n && (kr(this.le, i, n), o = this.le[i].style[n].ce);
                const h = s[o];
                if (!h) throw new Error("No style defined at " + i);
                const a = this, l = this.H;
                function u(e, s, o) {
                    if (!e) return !1;
                    l && (e = JSON.parse(JSON.stringify(e)), r.Util.parseSymbolPath(e, l));
                    const h = Object.keys(e);
                    let u = !1;
                    for (let t = 0; t < h.length; t++) {
                        const i = h[t];
                        if (xr(s[i]) || xr(e[i])) {
                            u = !0;
                            break;
                        }
                    }
                    for (const t in e) U(e, t) && (!r.Util.isObject(e[t]) || Array.isArray(e[t]) || e[t].stops ? s[t] = e[t] : (s[t] || (s[t] = {}), 
                    S(s[t], e[t])));
                    let c = a.options.style;
                    Array.isArray(c) || (c = a.Ai(t, a.options.style));
                    const f = JSON.parse(JSON.stringify(s));
                    return void 0 !== n ? (kr(c, i, n), void 0 === o ? c[i].style[n].symbol = f : c[i].style[n].symbol[o] = f) : (_r(c, i), 
                    void 0 === o ? c[i].symbol = f : c[i].symbol[o] = f), u;
                }
                const c = this.getRenderer();
                if (!c) return u(), this.ut(), this;
                let f = !1;
                const d = h.symbol;
                if (Array.isArray(e)) for (let t = 0; t < e.length; t++) {
                    const i = u(e[t], d[t], t);
                    i && (f = i);
                } else u(e, d);
                return this.ut(), f ? c.setStyle() : (f = c.updateSymbol(t, o, e), f && c.setStyle()), 
                0 === t ? this.fire("updatesymbol", {
                    index: i,
                    symbol: e
                }) : 1 === t && this.fire("updatefeaturesymbol", {
                    index: i,
                    featureStyleIndex: n,
                    symbol: e
                }), this;
            }
            Ai(t, i) {
                if (i) {
                    return 0 === t ? i.style : i.featureStyle;
                }
                return 0 === t ? this.fe : this.ue;
            }
            isDefaultRender() {
                return !!this.be && this.options.defaultRendering;
            }
            validateStyle() {
                this.Me = !0, this.be = !1;
                let t = this.fe;
                this.options.style || (this.be = !0, t = this.fe = []), Array.isArray(t) || (t = this.fe = [ t ]);
                for (let i = 0; i < t.length; i++) {
                    let e = t[i].filter;
                    if (e && e.value && (e = e.value), void 0 !== e && "default" !== e && !0 !== e && !Array.isArray(e)) throw new Error(`Invalid filter at ${i} : ${JSON.stringify(e)}`);
                    t[i].renderPlugin.dataConfig.only2D || (this.Me = !1);
                }
            }
            getStyle() {
                return this.options.style ? JSON.parse(JSON.stringify(this.options.style)) : null;
            }
            getGroundConfig() {
                this.xe || (this.xe = {
                    enable: !0,
                    renderPlugin: {
                        type: "fill",
                        sceneConfig: {}
                    },
                    symbol: {
                        polygonFill: [ 0, 0, 0, 0 ],
                        polygonOpacity: 1
                    }
                });
                const t = this.bi().background || {};
                return this.xe.enable = t.enable, this.xe.symbol.polygonFill = t.color, this.xe.symbol.polygonOpacity = t.opacity, 
                this.xe.symbol.polygonPatternFile = t.patternFile, this.xe.renderPlugin.sceneConfig.depthRange = t.depthRange, 
                this.xe;
            }
            getComputedStyle() {
                return JSON.parse(JSON.stringify(this.bi()));
            }
            bi() {
                return {
                    background: this.de,
                    style: this.fe || [],
                    featureStyle: this.ue || []
                };
            }
            isOnly2D() {
                return this.Me;
            }
            getCompiledStyle() {
                return {
                    style: this.Fe || [],
                    featureStyle: this.Ae || []
                };
            }
            identify(t, i = {}) {
                const e = this.getMap(), n = this.getRenderer();
                if (!e || !n) return [];
                const s = e.coordToContainerPoint(new r.Coordinate(t));
                return this.identifyAtPoint(s, i);
            }
            identifyAtPoint(t, i = {}) {
                const e = this.getMap(), n = this.getRenderer();
                if (!e || !n) return [];
                const r = e.getDevicePixelRatio();
                return n.pick(t.x * r, t.y * r, i);
            }
            getBackgroundCollisionIndex() {
                return this.ke || (this.ke = new r.CollisionIndex), this.ke;
            }
            clearBackgroundCollisionIndex() {
                return this.ke && this.ke.clear(), this;
            }
            getDataSchema(t) {
                return this._e || (this._e = {}), I(t) || this._e[t] || (this._e[t] = {}), I(t) ? this._e : this._e[t];
            }
            onRemove() {
                super.onRemove();
            }
            static fromJSON(t) {
                return t && "VectorTileLayer" === t.type ? new Mr(t.id, t.options) : null;
            }
            ut() {
                this.fe && (this.Fe = L(this.fe)), this.ue && (this.Ae = L(this.ue));
            }
            static registerPlugin(t) {
                Mr.plugins || (Mr.plugins = {}), Mr.plugins[t.type] = t;
            }
            static getPlugins() {
                return Mr.plugins || {};
            }
            static compressStyleJSON(t) {
                return Array.isArray(t) && t.length ? function(t) {
                    Array.isArray(t) && (t = {
                        style: t,
                        featureStyle: []
                    });
                    const i = [], e = [], n = [];
                    vr(t.style, i, n), vr(t.featureStyle, e, n);
                    const r = {
                        plugins: n,
                        styles: {
                            style: i,
                            featureStyle: e
                        }
                    };
                    return t.$root && (r.$root = t.$root), t.$iconset && (r.$iconset = t.$iconset), 
                    r;
                }(t) : t;
            }
        }
        function xr(t) {
            return !(!t || !t.properties);
        }
        function Fr(t) {
            return t ? (Array.isArray(t) || (t = Be(t).unitArray()), 3 === t.length && t.push(1), 
            t) : null;
        }
        function Ar(t, i) {
            return null == t ? i : t;
        }
        function kr(t, i, e) {
            if (!t[i] || !t[i].style || !t[i].style[e]) throw new Error(`No plugin defined at feature style of ${i} - ${e}`);
        }
        function _r(t, i) {
            if (!t[i]) throw new Error("No plugin defined at style of " + i);
        }
        Mr.prototype._getTileZoom = function(t) {
            return t = Math.floor(t), r.TileLayer.prototype._getTileZoom.call(this, t);
        }, Mr.registerJSONType("VectorTileLayer"), Mr.mergeOptions(br), Mr.registerRenderer("gl", lr), 
        Mr.registerRenderer("canvas", null);
        class Sr extends Mr {
            getTileUrl(t, i, e) {
                const n = this.getMap().getResolution(e);
                return super.getTileUrl(t, i, function(t) {
                    return 19 - Math.log(t / Pr) / Math.LN2;
                }(n));
            }
            static fromJSON(t) {
                return t && "MapboxVectorTileLayer" === t.type ? new Sr(t.id, t.options) : null;
            }
        }
        Sr.registerJSONType("MapboxVectorTileLayer");
        const Pr = 12756274 * Math.PI / (256 * Math.pow(2, 20));
        class Or extends Mr {
            constructor(t, i = {}) {
                i.spatialReference = null, super(t, i), this.setData(i.data);
            }
            getWorkerOptions() {
                const t = super.getWorkerOptions();
                let i = this.options.data;
                return i = P(i) || i && i.url ? Ir(i) : this.features, t.data = i, t.tileBuffer = this.options.tileBuffer, 
                t.extent = this.options.extent, t;
            }
            setData(t) {
                if (this.options.data = t, t && (P(t) || t.url)) {
                    return !!this.getRenderer() && this.Se(), this;
                }
                return this.Pe(t), this.Se(), this;
            }
            Pe(t) {
                if (this.options.convertFn) {
                    t = new Function("data", this.options.convertFn + "\nreturn convert(data)")(t);
                }
                return this.features = t, this.Oe(), this;
            }
            Se() {
                const t = this.getRenderer();
                if (t) {
                    const i = t.getWorkerConnection();
                    if (i) {
                        let e = this.options.data;
                        e = P(e) || e.url ? Ir(e) : this.features, i.setData(e, (i, e) => {
                            t.clear(), this.onWorkerReady(null, e), t.setToRedraw();
                        });
                    }
                }
            }
            getExtent() {
                return this.Ce;
            }
            onWorkerReady(t, i) {
                t ? this.fire("dataerror", {
                    error: t
                }) : (i && (i.extent && this.Ie(i.extent), i.idMap && (this.Te = i.idMap)), this.fire("dataload", {
                    extent: i && i.extent
                }));
            }
            Ie(t) {
                this.Ce = new r.Extent(...t);
            }
            De(t, i) {
                P(t) ? wr.getJSON(t, i) : wr.getJSON(t.url, t, i);
            }
            getData() {
                return this.features || null;
            }
            getTileUrl(t, i, e) {
                return this.getId() + "," + t + "," + i + "," + e;
            }
            getFeature(t) {
                return this.Te[t];
            }
            static fromJSON(t) {
                return t && "GeoJSONVectorTileLayer" === t.type ? new Or(t.id, t.options) : null;
            }
            Oe() {
                if (!this.features) return;
                if (this.features = JSON.parse(JSON.stringify(this.features)), !this.features) return;
                let t = 0;
                this.Te = {};
                const i = this.features;
                Array.isArray(i) ? i.forEach(i => {
                    void 0 !== i.id && null !== i.id || (i.id = t++), this.Te[i.id] = i;
                }) : i.features && i.features.forEach(i => {
                    void 0 !== i.id && null !== i.id || (i.id = t++), this.Te[i.id] = i;
                });
            }
        }
        function Cr(t) {
            let i = document.createElement("a");
            return i.href = t, t = i.href, i = null, t;
        }
        function Ir(t) {
            return t.url ? t.url = Cr(t.url) : t = Cr(t), t;
        }
        Or.registerJSONType("GeoJSONVectorTileLayer"), Or.mergeOptions({
            features: "id",
            tileBuffer: 64,
            extent: 8192,
            pyramidMode: 1
        });
        class Tr extends r.OverlayLayer {
            static registerPainter(t, i) {
                Tr.painters || (Tr.painters = {}), Tr.painters[t] = i;
            }
            static get3DPainterClass(t) {
                return Tr.painters[t];
            }
            constructor(...t) {
                super(...t), this.options.sceneConfig || (this.options.sceneConfig = {});
            }
            updateSymbol(t, i) {
                if (!this.options.style) throw new Error("can't call update symbol when style is not set");
                const e = Array.isArray(this.options.style) ? this.options.style : this.options.style.style;
                if (!e[t]) throw new Error("invalid style at " + t);
                return S(e[t].symbol, i), this.setStyle(this.options.style), this;
            }
            getPolygonOffsetCount() {
                return 1;
            }
            getPolygonOffset() {
                return this.pe || 0;
            }
            setPolygonOffset(t, i) {
                return this.pe = t, this.me = i, this;
            }
            getTotalPolygonOffset() {
                return this.me;
            }
            identify(t, i = {}) {
                const e = this.getMap(), n = this.getRenderer();
                if (!e || !n) return [];
                const s = e.coordToContainerPoint(new r.Coordinate(t));
                return this.identifyAtPoint(s, i);
            }
            identifyAtPoint(t, i = {}) {
                const e = this.getMap(), n = this.getRenderer();
                if (!e || !n) return [];
                const r = this.getMap().getDevicePixelRatio();
                return n.pick(t.x * r, t.y * r, i);
            }
            getComputedStyle() {
                return {
                    style: this.getStyle() || []
                };
            }
            outlineAll() {
                const t = this.getRenderer();
                return t ? (t.outlineAll(), this) : this;
            }
            outline(t) {
                if (!Array.isArray(t) || !t.length) return this;
                const i = this.getRenderer();
                return i ? (i.outline(t), this) : this;
            }
            cancelOutline() {
                const t = this.getRenderer();
                return t ? (t.cancelOutline(), this) : this;
            }
            toJSON() {
                const t = {
                    type: this.getJSONType(),
                    id: this.getId(),
                    options: this.config(),
                    geometries: []
                }, i = this.getGeometries();
                for (let e = 0, n = i.length; e < n; e++) {
                    const n = i[e].toJSON();
                    t.geometries.push(n);
                }
                return t;
            }
        }
        Tr.mergeOptions({
            picking: !0,
            renderer: "gl",
            collision: !1,
            textGamma: 1,
            geometryEvents: !0,
            styleScale: 1,
            forceRenderOnZooming: !0,
            forceRenderOnMoving: !0,
            forceRenderOnRotating: !0,
            workarounds: {
                "win-intel-gpu-crash": !0
            }
        });
        const Dr = new r.Point(0, 0), Lr = "_vector3dlayer_id";
        function Ur(t, i, e) {
            const n = "__fea_idx".trim(), s = t.getMap(), o = s.getGLRes();
            let h = t.getCoordinates();
            const a = [];
            let l = 1;
            if (t instanceof r.Marker || t instanceof r.MultiPoint) {
                t instanceof r.Marker && (h = [ h ]);
                for (let t = 0; t < h.length; t++) s.coordToPointAtRes(h[t], o, Dr), a.push([ Dr.x, Dr.y ]);
            } else if (t instanceof r.LineString || t instanceof r.MultiLineString) {
                l = 2, t instanceof r.LineString && (h = [ h ]);
                for (let t = 0; t < h.length; t++) {
                    a[t] = [];
                    for (let i = 0; i < h[t].length; i++) s.coordToPointAtRes(h[t][i], o, Dr), a[t].push([ Dr.x, Dr.y ]);
                }
            } else if (t instanceof r.Polygon || t instanceof r.MultiPolygon) {
                l = 3, t instanceof r.Polygon && (h = [ h ]);
                let i = 0;
                for (let t = 0; t < h.length; t++) for (let e = 0; e < h[t].length; e++) {
                    a[i] = [];
                    for (let n = 0; n < h[t][e].length; n++) s.coordToPointAtRes(h[t][e][n], o, Dr), 
                    a[i].push([ Dr.x, Dr.y ]);
                    i++;
                }
            }
            const u = t.getProperties() ? Object.assign({}, t.getProperties()) : {}, c = t._getInternalSymbol(), f = e ? Array.isArray(e) ? e[0][n] : e[n] : i.id++;
            if (Array.isArray(c) && c.length) {
                const r = [], s = c.length;
                for (let o = 0; o < s; o++) {
                    const h = o === s - 1 ? u : S({}, u);
                    for (const t in c[o]) U(c[o], t) && (h["_symbol_" + t] = c[o][t]);
                    const d = e && e[o] ? e[o].id : i.pickingId++, y = {
                        type: l,
                        id: f,
                        properties: h,
                        visible: t.isVisible(),
                        geometry: a,
                        extent: 1 / 0
                    };
                    y[n] = d, r.push(y);
                }
                return r;
            }
            for (const t in c) U(c, t) && (u["_symbol_" + t] = c[t]);
            const d = e ? e.id : i.pickingId++, y = {
                type: l,
                id: f,
                properties: u,
                visible: t.isVisible(),
                geometry: a,
                extent: 1 / 0
            };
            return y[n] = d, y;
        }
        const Er = {
            markerFile: {
                type: "identity",
                default: void 0,
                property: "_symbol_markerFile"
            },
            markerWidth: {
                type: "identity",
                default: 20,
                property: "_symbol_markerWidth"
            },
            markerHeight: {
                type: "identity",
                default: 20,
                property: "_symbol_markerHeight"
            },
            markerDx: {
                type: "identity",
                default: void 0,
                property: "_symbol_markerDx"
            },
            markerDy: {
                type: "identity",
                default: void 0,
                property: "_symbol_markerDy"
            },
            markerType: {
                type: "identity",
                default: void 0,
                property: "_symbol_markerType"
            },
            markerFill: {
                type: "identity",
                default: void 0,
                property: "_symbol_markerFill"
            },
            markerFillPatternFile: {
                type: "identity",
                default: void 0,
                property: "_symbol_markerFillPatternFile"
            },
            markerFillOpacity: {
                type: "identity",
                default: void 0,
                property: "_symbol_markerFillOpacity"
            },
            markerLineColor: {
                type: "identity",
                default: void 0,
                property: "_symbol_markerLineColor"
            },
            markerLineWidth: {
                type: "identity",
                default: void 0,
                property: "_symbol_markerLineWidth"
            },
            markerLineOpacity: {
                type: "identity",
                default: void 0,
                property: "_symbol_markerLineOpacity"
            },
            markerLineDasharray: {
                type: "identity",
                default: void 0,
                property: "_symbol_markerLineDasharray"
            },
            markerLinePatternFile: {
                type: "identity",
                default: void 0,
                property: "_symbol_markerLinePatternFile"
            },
            markerVerticalAlignment: {
                type: "identity",
                default: "top",
                property: "_symbol_markerVerticalAlignment"
            },
            markerHorizontalAlignment: {
                type: "identity",
                default: "middle",
                property: "_symbol_markerHorizontalAlignment"
            },
            markerOpacity: {
                type: "identity",
                default: 1,
                property: "_symbol_markerOpacity"
            },
            markerPitchAlignment: {
                type: "identity",
                default: "viewport",
                property: "_symbol_markerPitchAlignment"
            },
            markerRotationAlignment: {
                type: "identity",
                default: "viewport",
                property: "_symbol_markerRotationAlignment"
            },
            markerRotation: {
                type: "identity",
                default: 0,
                property: "_symbol_markerRotation"
            },
            markerAllowOverlap: {
                type: "identity",
                default: 0,
                property: "_symbol_markerAllowOverlap"
            },
            markerIgnorePlacement: {
                type: "identity",
                default: 0,
                property: "_symbol_markerIgnorePlacement"
            },
            markerTextFit: {
                type: "identity",
                default: null,
                property: "_symbol_markerTextFit"
            },
            markerSpacing: {
                type: "identity",
                default: 250,
                property: "_symbol_markerSpacing"
            },
            markerTextFitPadding: {
                type: "identity",
                default: null,
                property: "_symbol_markerTextFitPadding"
            }
        }, jr = {
            textName: {
                type: "identity",
                default: void 0,
                property: "_symbol_textName"
            },
            textFaceName: {
                type: "identity",
                default: void 0,
                property: "_symbol_textFaceName"
            },
            textWeight: {
                type: "identity",
                default: void 0,
                property: "_symbol_textWeight"
            },
            textStyle: {
                type: "identity",
                default: void 0,
                property: "_symbol_textStyle"
            },
            textWrapWidth: {
                type: "identity",
                default: void 0,
                property: "_symbol_textWrapWidth"
            },
            textHorizontalAlignment: {
                type: "identity",
                default: void 0,
                property: "_symbol_textHorizontalAlignment"
            },
            textVerticalAlignment: {
                type: "identity",
                default: void 0,
                property: "_symbol_textVerticalAlignment"
            },
            textFill: {
                type: "identity",
                default: void 0,
                property: "_symbol_textFill"
            },
            textSize: {
                type: "identity",
                default: void 0,
                property: "_symbol_textSize"
            },
            textHaloRadius: {
                type: "identity",
                default: void 0,
                property: "_symbol_textHaloRadius"
            },
            textHaloFill: {
                type: "identity",
                default: void 0,
                property: "_symbol_textHaloFill"
            },
            textHaloOpacity: {
                type: "identity",
                default: 1,
                property: "_symbol_textHaloOpacity"
            },
            textDx: {
                type: "identity",
                default: void 0,
                property: "_symbol_textDx"
            },
            textDy: {
                type: "identity",
                default: void 0,
                property: "_symbol_textDy"
            },
            textOpacity: {
                type: "identity",
                default: 1,
                property: "_symbol_textOpacity"
            },
            textPitchAlignment: {
                type: "identity",
                default: "viewport",
                property: "_symbol_textPitchAlignment"
            },
            textRotationAlignment: {
                type: "identity",
                default: "viewport",
                property: "_symbol_textRotationAlignment"
            },
            textRotation: {
                type: "identity",
                default: 0,
                property: "_symbol_textRotation"
            },
            textAllowOverlap: {
                type: "identity",
                default: 0,
                property: "_symbol_textAllowOverlap"
            },
            textIgnorePlacement: {
                type: "identity",
                default: 0,
                property: "_symbol_textIgnorePlacement"
            },
            textSpacing: {
                type: "identity",
                default: 250,
                property: "_symbol_textSpacing"
            }
        }, Rr = {
            lineWidth: {
                type: "identity",
                default: 2,
                property: "_symbol_lineWidth"
            },
            lineStrokeWidth: {
                type: "identity",
                default: 0,
                property: "_symbol_lineStrokeWidth"
            },
            lineColor: {
                type: "identity",
                default: [ 1, 0, 0, 1 ],
                property: "_symbol_lineColor"
            },
            lineStrokeColor: {
                type: "identity",
                default: [ 0, 0, 0, 0 ],
                property: "_symbol_lineStrokeColor"
            },
            lineDx: {
                type: "identity",
                default: 0,
                property: "_symbol_lineDx"
            },
            lineDy: {
                type: "identity",
                default: 0,
                property: "_symbol_lineDy"
            },
            linePatternFile: {
                type: "identity",
                default: void 0,
                property: "_symbol_linePatternFile"
            },
            linePatternAnimSpeed: {
                type: "identity",
                default: 0,
                property: "_symbol_linePatternAnimSpeed"
            },
            linePatternGap: {
                type: "identity",
                default: 0,
                property: "_symbol_linePatternGap"
            },
            lineJoinPatternMode: {
                type: "identity",
                default: 0,
                property: "_symbol_lineJoinPatternMode"
            },
            lineOpacity: {
                type: "identity",
                default: 1,
                property: "_symbol_lineOpacity"
            },
            lineJoin: {
                type: "identity",
                default: void 0,
                property: "_symbol_lineJoin"
            },
            lineCap: {
                type: "identity",
                default: void 0,
                property: "_symbol_lineCap"
            },
            lineDasharray: {
                type: "identity",
                default: void 0,
                property: "_symbol_lineDasharray"
            },
            lineDashColor: {
                type: "identity",
                default: void 0,
                property: "_symbol_lineDashColor"
            }
        };
        let zr = 1;
        const Nr = "_symbol_", Wr = "__fea_idx".trim();
        let Hr = new Float32Array(1);
        class Vr extends r.renderer.CanvasRenderer {
            constructor(...t) {
                super(...t), this.features = {}, this.Le = {}, this.ui = 1, this.Ue = {}, this.Ee = {}, 
                this.je = {}, this.Re = {}, this.ze = {}, this.Ne = !0, this.We = {
                    id: 0,
                    pickingId: 0
                }, this.He = S({}, Er, jr), this.Ve = {};
            }
            hasNoAARendering() {
                return !0;
            }
            needToRedraw() {
                const t = super.needToRedraw();
                return t || (this.painter && this.painter.needToRedraw() || this.$e && this.$e.needToRedraw() || this.Ge && this.Ge.needToRedraw());
            }
            draw(t, i) {
                const e = this.layer;
                if (this.prepareCanvas(), this.Di = this.Li(this.getMap().getGLRes()), this.Ne) this.buildMesh(), 
                this.Je(), this.qe(), this.Ve = {}, this.Be = !1, this.Ne = !1, this.Xe = !1; else if (this.Be) {
                    const t = this.atlas, i = this.Ze, e = this.Ye;
                    delete this.atlas, delete this.Ze, delete this.Ye, this.buildMesh(t), this.Je(i), 
                    this.qe(e), this.Be = !1, this.Xe = !1;
                } else if (this.Xe) {
                    const t = this.Ye;
                    delete this.Ye, this.qe(t), this.Xe = !1;
                }
                if (!this.meshes && !this.Ke && !this.Qe) return void this.completeRender();
                this.tn && (this.in(), this.tn = !1), this.en(), e.options.collision && e.clearCollisionIndex(), 
                this.Ti = t, this.Ui = i || {};
                const n = this.nn();
                let r = 0;
                this.painter && this.meshes && (this.painter.startFrame(n), this.painter.addMesh(this.meshes, null, {
                    bloom: 1
                }), this.painter.prepareRender(n), n.polygonOffsetIndex = r++, this.painter.render(n)), 
                this.Qe && (this.Ge.startFrame(n), this.Ge.addMesh(this.Qe, null, {
                    bloom: 1
                }), this.Ge.prepareRender(n), n.polygonOffsetIndex = r++, this.Ge.render(n)), this.Ke && (this.$e.startFrame(n), 
                this.$e.addMesh(this.Ke, null, {
                    bloom: 1
                }), this.$e.prepareRender(n), e.options.collision && this.$e.updateCollision(n), 
                this.$e.render(n)), this.completeRender(), this.layer.fire("canvasisdirty");
            }
            supportRenderMode(t) {
                return "noAa" === t;
            }
            isForeground() {
                return !0;
            }
            nn() {
                const t = {
                    regl: this.regl,
                    layer: this.layer,
                    symbol: this.rn,
                    gl: this.gl,
                    sceneConfig: this.layer.options.sceneConfig,
                    pluginIndex: 0,
                    cameraPosition: this.getMap().cameraPosition,
                    timestamp: this.getFrameTimestamp()
                };
                return this.Ui && S(t, this.Ui), t;
            }
            drawOnInteracting(t, i, e) {
                this.draw(i, e);
            }
            getFrameTimestamp() {
                return this.Ti;
            }
            sn() {
                const t = [], i = [ 0, 0, 0, 0 ];
                this.layer._sortGeometries();
                const e = this.layer.getGeometries();
                for (let n = 0; n < e.length; n++) {
                    const r = e[n][Lr];
                    if (!this.features[r]) continue;
                    const s = this.features[r];
                    if (Array.isArray(s)) for (let e = 0; e < s.length; e++) {
                        const n = s[e];
                        n.visible || (this.tn = !0), this.hn(n.geometry, i), t.push(n);
                    } else s.visible || (this.tn = !0), this.hn(s.geometry, i), t.push(s);
                }
                return t.length || (this.meshes && this.painter && (this.painter.deleteMesh(this.meshes), 
                delete this.meshes), this.Ke && (this.$e.deleteMesh(this.Ke), delete this.Ke), this.Qe && (this.Ge.deleteMesh(this.Qe), 
                delete this.Qe)), i[3] && (i[0] /= i[3], i[1] /= i[3]), {
                    features: t,
                    center: i
                };
            }
            buildMesh() {}
            createVectorPacks(t, i, e, n, r, s) {
                if (!t || !n || !n.length) return Promise.resolve(null);
                return new i(n, e, {
                    zoom: this.getMap().getZoom(),
                    EXTENT: 1 / 0,
                    requestor: this.requestor,
                    atlas: r,
                    center: s,
                    positionType: Float32Array
                }).load();
            }
            createMesh(t, i, n, r, s, o) {
                const h = [], a = [];
                return this.createVectorPacks(t, i, n, r, s, o).then(i => {
                    if (!i) return null;
                    const n = t.createGeometries([ i.data ], r.map(t => ({
                        feature: t
                    })));
                    for (let t = 0; t < n.length; t++) this.an(n[t].geometry);
                    const s = e.mat4.identity([]);
                    e.mat4.translate(s, s, e.vec3.set(a, o[0], o[1], 0)), e.mat4.scale(s, s, e.vec3.set(h, 1, 1, this.Di));
                    const l = t.createMeshes(n, s, {
                        tilePoint: [ o[0], o[1] ]
                    });
                    for (let t = 0; t < l.length; t++) {
                        const i = l[t];
                        i.setUniform("level", 0);
                        const e = i.defines;
                        e.ENABLE_TILE_STENCIL = 1, i.setDefines(e), i.properties.meshKey = this.layer.getId();
                    }
                    return {
                        meshes: l,
                        atlas: {
                            iconAtlas: i.data.iconAtlas
                        }
                    };
                });
            }
            hn(t, i) {
                for (let e = 0; e < t.length; e++) if (O(t[e][0])) i[0] += t[e][0], i[1] += t[e][1], 
                i[3] += 1; else for (let n = 0; n < t[e].length; n++) if (O(t[e][n][0])) i[0] += t[e][n][0], 
                i[1] += t[e][n][1], i[3] += 1; else for (let r = 0; r < t[e][n].length; r++) i[0] += t[e][n][r][0], 
                i[1] += t[e][n][r][1], i[3] += 1;
            }
            an(t) {
                const i = this.getMap(), e = t.properties;
                Object.defineProperty(e, "tileResolution", {
                    enumerable: !0,
                    get: function() {
                        return i.getGLRes();
                    }
                }), e.tileRatio = 1, e.z = 1, e.tileExtent = 1;
            }
            ln(t) {
                return "win-intel-gpu-crash" === t && (this.layer.options.workarounds["win-intel-gpu-crash"] && Gr(this.gl));
            }
            prepareRequestors() {
                if (this.Xt) return;
                const t = this.layer;
                this.Xt = new qn({
                    iconErrorUrl: t.options.iconErrorUrl
                });
                const i = !this.ln("win-intel-gpu-crash");
                this.Zt = new Gn(i => {
                    t.getMap().getRenderer().callInNextFrame(i);
                }, t.options.glyphSdfLimitPerFrame, i), this.requestor = this.un.bind(this), this.cn = this.dn.bind(this);
            }
            un(t, i, e) {
                const n = [];
                this.Xt.getIcons(t, (t, i) => {
                    if (t) throw t;
                    i.buffers && n.push(...i.buffers), e(null, {
                        icons: i.icons
                    }, n);
                });
            }
            dn(t, i, e) {
                this.Zt.getGlyphs(i, (i, n) => {
                    if (i) throw i;
                    const r = n.buffers || [];
                    this.Xt.getIcons(t, (t, i) => {
                        if (t) throw t;
                        i.buffers && i.buffers.length && r.push(...i.buffers), e(null, {
                            icons: i.icons,
                            glyphs: n.glyphs
                        }, r);
                    });
                });
            }
            Je(t) {
                const i = Object.keys(this.je), n = Object.keys(this.Re);
                if (!i.length && !n.length) return void (this.Ke && (this.$e.deleteMesh(this.Ke), 
                delete this.Ke));
                const {features: r, center: s} = this.sn(), o = [], h = [];
                for (let t = 0; t < r.length; t++) {
                    const i = r[t][Wr];
                    this.je[i] && o.push(r[t]), this.Re[i] && h.push(r[t]);
                }
                if (!o.length && !h.length) return void (this.Ke && (this.$e.deleteMesh(this.Ke), 
                delete this.Ke));
                const a = this.tn;
                this.yn = s;
                const l = this.pn(o, h, t, s);
                this.Ze = {};
                const u = [], c = [];
                this.mn = !0, Promise.all(l).then(t => {
                    if (this.Ke && (this.$e.deleteMesh(this.Ke), delete this.Ke), !t || !t.length) return void this.setToRedraw();
                    const i = this.$e.createGeometries(t.map(t => t && t.data), this.Ue);
                    for (let e = 0; e < i.length; e++) this.an(i[e].geometry, t[e] && t[e].data);
                    const n = t[0] && t[0].data.iconAtlas, r = t[0] && t[0].data.glyphAtlas || t[1] && t[1].data.glyphAtlas;
                    n && (this.Ze.iconAtlas = n), r && (this.Ze.glyphAtlas = r);
                    const o = e.mat4.identity([]);
                    e.mat4.translate(o, o, e.vec3.set(c, s[0], s[1], 0)), e.mat4.scale(o, o, e.vec3.set(u, 1, 1, this.Di));
                    const h = this.$e.createMeshes(i, o);
                    for (let t = 0; t < h.length; t++) h[t].geometry.properties.originElements = h[t].geometry.properties.elements.slice(), 
                    h[t].setUniform("level", 0), h[t].material.set("flipY", 1), h[t].properties.meshKey = zr++;
                    this.Ke = h, a && (this.tn = !0), this.mn = !1, this.setToRedraw();
                });
            }
            in() {
                if (this.Ke && (this.vn(this.Ke[0], this.je), this.vn(this.Ke[1], this.Re)), this.Qe) for (let t = 0; t < this.Qe.length; t++) this.vn(this.Qe[t], this.ze);
                if (this.meshes) for (let t = 0; t < this.meshes.length; t++) this.vn(this.meshes[t], this.Ue);
            }
            vn(t, i) {
                if (!t) return;
                const {aPickingId: e, originElements: n} = t.geometry.properties, r = [];
                for (let t = 0; t < n.length; t++) {
                    const s = e[n[t]];
                    i[s] && i[s].feature.visible && r.push(n[t]);
                }
                const s = t.geometry.properties.elements = new n.constructor(r);
                t.geometry.setElements(s);
            }
            pn(t, i, e, n) {
                const r = {
                    zoom: this.getMap().getZoom(),
                    EXTENT: 1 / 0,
                    requestor: this.cn,
                    atlas: e,
                    center: n,
                    positionType: Float32Array,
                    altitudeProperty: "altitude",
                    defaultAltitude: 0
                }, s = S({}, r);
                r.allowEmptyPack = 1;
                return Ye.splitPointSymbol(this.He).map((e, n) => new Ye(0 === n ? t : i, e, 0 === n ? r : s).load());
            }
            updateMesh() {}
            gn(t) {
                const i = t._getInternalSymbol(), e = {
                    zoom: this.getMap().getZoom()
                }, n = this.wn(t);
                if (!this.Ke) return !1;
                let r = this.features[n];
                Array.isArray(r) || (r = [ r ]);
                const s = [], o = [], h = this.getMap().getZoom();
                let a, l;
                a = Array.isArray(i) ? i.map(t => t ? F(t, () => h) : t) : F(i, () => h), l = Array.isArray(i) ? i.map(t => t ? Ft.genFnTypes(t) : t) : Ft.genFnTypes(i);
                for (let t = 0; t < r.length; t++) {
                    if (!r[t]) continue;
                    const n = Array.isArray(i) ? i[t] : i, s = Array.isArray(a) ? a[t] : a, o = Array.isArray(l) ? l[t] : l, h = new Wi(r, n, s, o, e).getIconAndGlyph();
                    if (!this.Ze || !Ye.isAtlasLoaded(h, this.Ze)) return this.bn(), this.setToRedraw(), 
                    !1;
                }
                for (let t = 0; t < r.length; t++) {
                    const i = r[t][Wr];
                    this.je[i] && s.push(r[t]), this.Re[i] && o.push(r[t]);
                }
                const u = r[0].id, c = this.pn(s, o, this.Ze, this.yn), f = this.Ke;
                return Promise.all(c).then(t => {
                    for (let i = 0; i < t.length; i++) {
                        if (!t[i]) continue;
                        const e = f[i], n = e.geometry.properties.aFeaIds.indexOf(u);
                        if (n < 0) continue;
                        const r = t[i].data.featureIds.length;
                        for (const s in t[i].data.data) {
                            if ("aPickingId" === s) continue;
                            const o = t[i].data.data[s];
                            e.geometry.updateSubData(s, o, n * o.length / r);
                        }
                    }
                    this.setToRedraw();
                }), !0;
            }
            Mn(t) {
                return this.xn(t, this.Qe, this.Ye, this.Fn, this.Ge, tn, Rr, this.An);
            }
            xn(t, i, e, n, r, s, o, h) {
                if (!i) return !1;
                if (!e) return this.bn(), this.setToRedraw(), !1;
                const a = t._getInternalSymbol(), l = {
                    zoom: this.getMap().getZoom()
                }, u = t[Lr];
                let c = this.features[u];
                Array.isArray(c) || (c = [ c ]);
                const f = [];
                for (let t = 0; t < c.length; t++) {
                    const i = c[t];
                    if (!i) continue;
                    const n = Array.isArray(a) ? a[t] : a, r = Ft.genFnTypes(n), o = new Mt(c, n, r, l), h = s === tn ? o.getLineResource() : o.getPolygonResource();
                    if (!Ft.isAtlasLoaded(h, e[t])) return this.bn(), this.setToRedraw(), !1;
                    f.push(i);
                }
                const d = c[0].id, y = h.call(this, f);
                for (let t = 0; t < y.length; t++) if (y[t].length) {
                    const e = i.filter(i => i.feaGroupIndex === t);
                    if (!e.length) return this.bn(), this.setToRedraw(), !1;
                    if (e[0].geometry.properties.aFeaIds.indexOf(d) < 0) return this.bn(), this.setToRedraw(), 
                    !1;
                }
                const p = S({}, o), m = y.map(t => this.createVectorPacks(r, s, p, t, e[0], n));
                return Promise.all(m).then(t => {
                    for (let e = 0; e < t.length; e++) {
                        let n;
                        if (Array.isArray(i)) {
                            for (let t = 0; t < i.length; t++) if (i[t].feaGroupIndex === e) {
                                n = i[t];
                                break;
                            }
                        } else n = i;
                        if (!n) continue;
                        const r = n.geometry.properties.aFeaIds, s = r.indexOf(d);
                        if (!(s < 0)) {
                            if (t[e]) {
                                const i = t[e].data.featureIds.length, r = t[e].data.data;
                                for (const t in r) if (U(r, t)) {
                                    const e = r[t];
                                    n.geometry.updateSubData(t, e, s * e.length / i);
                                }
                            } else {
                                let t = s + 1;
                                for (;r[t] === d; ) t++;
                                const i = t - s;
                                Hr.length !== 3 * i && (Hr = new Float32Array(3 * i), Hr.fill(-1 / 0, 0)), n.geometry.updateSubData(n.geometry.desc.positionAttribute, Hr, 3 * s);
                            }
                            this.setToRedraw();
                        }
                    }
                }), !0;
            }
            qe(t) {
                if (!Object.keys(this.ze).length) return void (this.Qe && (this.Ge.deleteMesh(this.Qe), 
                delete this.Qe));
                const {features: i, center: e} = this.sn();
                if (!i.length) return;
                const n = this.tn;
                this.Fn = e;
                const r = this.An(i), s = S({}, Rr), o = r.map((i, n) => this.createMesh(this.Ge, tn, s, i, t && t[n], e));
                this.kn = !0, Promise.all(o).then(t => {
                    this.Qe && this.Ge.deleteMesh(this.Qe);
                    const i = [], e = [];
                    for (let n = 0; n < t.length; n++) {
                        const r = t[n] && t[n].meshes;
                        if (r) {
                            for (let t = 0; t < r.length; t++) {
                                const e = r[t];
                                e.feaGroupIndex = n, i.push(e), e.geometry.properties.originElements = e.geometry.properties.elements.slice();
                            }
                            e[n] = t[n].atlas;
                        }
                    }
                    this.Qe = i, this.Ye = e, n && (this.tn = n), this.kn = !1, this.setToRedraw();
                });
            }
            An(t) {
                const i = [], e = [], n = [];
                for (let r = 0; r < t.length; r++) {
                    const s = t[r], o = s.properties && s.properties[Nr + "lineDasharray"];
                    o && Xr(o) ? n.push(s) : s.properties && s.properties[Nr + "linePatternFile"] ? e.push(s) : i.push(s);
                }
                return [ e, n, i ];
            }
            _n() {
                this.Be = !0, this.setToRedraw();
            }
            bn() {
                this.Ne = !0, this.setToRedraw();
            }
            Sn(t) {
                const i = this.layer.getId();
                for (let e = 0; e < t.length; e++) {
                    const n = t[e];
                    let r = !1;
                    for (let t = 0; t < this.GeometryTypes.length; t++) if (n instanceof this.GeometryTypes[t]) {
                        r = !0;
                        break;
                    }
                    if (!r) throw new Error(`${n.getJSONType()} can't be added to ${this.layer.getJSONType()}(id:${i}).`);
                    this.wn(n);
                }
            }
            wn(t) {
                t[Lr] || (t[Lr] = this.ui++);
                const i = t[Lr];
                this.features[i] && this.Pn(i), this.features[i] = Ur(t, this.We, this.features[i]);
                const e = this.features[i];
                return this.On(e), this.features[i][Lr] = i, this.Le[i] = t, i;
            }
            On(t) {
                if (!t) return;
                const i = Array.isArray(t) ? t[0].id : t.id;
                if (this.Ee[i] = t, Array.isArray(t)) for (let i = 0; i < t.length; i++) {
                    const e = t[i][Wr];
                    this.Ue[e] = {
                        feature: t[i]
                    };
                    const n = {
                        feature: t[i]
                    };
                    Jr(t[i]) && (this.je[e] = n), qr(t[i]) && (this.Re[e] = n), Br(t[i]) && (this.ze[e] = n);
                } else {
                    const i = {
                        feature: t
                    }, e = t[Wr];
                    Jr(t) && (this.je[e] = i), qr(t) && (this.Re[e] = i), Br(t) && (this.ze[e] = i), 
                    this.Ue[e] = i;
                }
            }
            Pn(t) {
                const i = this.features[t];
                if (Array.isArray(i)) for (let t = 0; t < i.length; t++) {
                    const e = i[t][Wr], n = i[t].id;
                    delete this.Ee[n], delete this.Ue[e], delete this.je[e], delete this.Re[e], delete this.ze[e];
                } else {
                    const t = i[Wr], e = i.id;
                    delete this.Ee[e], delete this.Ue[t], delete this.je[t], delete this.Re[t], delete this.ze[t];
                }
            }
            pick(t, i, e) {
                const n = [];
                return [ this.painter, this.$e, this.Ge ].forEach(r => {
                    if (!r) return;
                    const s = r.pick(t, i, e.tolerance);
                    if (s && s.data && s.data.feature) {
                        const t = s.data.feature;
                        n.push(this.Le[t[Lr]]);
                    }
                }), n;
            }
            Cn(t) {
                const i = t[Lr], e = this.features[i];
                return Array.isArray(e) ? e[0][Wr] : e[Wr];
            }
            en() {
                let t = !1;
                for (const i in this.Ve) {
                    const e = this.Ve[i], n = this.Cn(e);
                    if (!this.mn && (this.je[n] || this.Re[n])) {
                        const i = this.gn(e);
                        t = t || i;
                    }
                    if (!this.kn && this.ze[n]) {
                        const i = this.Mn(e);
                        t = t || i;
                    }
                    if (!this.In) {
                        const i = this.updateMesh(e);
                        t = t || i;
                    }
                }
                this.Ve = {}, t && ($r(this), this.layer.fire("partialupdate"));
            }
            Tn(t) {
                this.wn(t), this.bn(), $r(this);
            }
            onGeometryAdd(t) {
                t && t.length && (this.Sn(t), this.bn(), $r(this));
            }
            onGeometryRemove(t) {
                if (t && t.length) {
                    for (let i = 0; i < t.length; i++) {
                        const e = t[i][Lr];
                        void 0 !== e && (delete this.Le[e], this.Pn(e), delete this.features[e]);
                    }
                    this.bn(), $r(this);
                }
            }
            onGeometrySymbolChange(t) {
                const i = t.target._getParent() || t.target, e = t.properties;
                for (const t in e) if (U(e, t) && Kn[t]) return void this.Tn(i);
                const n = i[Lr], r = i._getInternalSymbol(), s = this.features[n];
                if (this.wn(i), s) if (function(t, i) {
                    return Array.isArray(t) ? !!Array.isArray(i) && t.length === i.length : !Array.isArray(i);
                }(r, s)) {
                    if (Array.isArray(r)) for (let t = 0; t < r.length; t++) {
                        if (!Zr(r[t], s[t])) return void this.Tn(i);
                    } else if (!Zr(r, s)) return void this.Tn(i);
                    this.onGeometryPositionChange(t);
                } else this.Tn(i); else this.Tn(i);
            }
            onGeometryShapeChange(t) {
                const i = t.target._getParent() || t.target, e = Ur(i, {
                    id: 0
                }).geometry, n = i[Lr], r = this.features[n];
                if (function t(i, e) {
                    if (i.length !== e.length) return !1;
                    if (Array.isArray(i[0]) && Array.isArray(e[0])) {
                        for (let n = 0; n < i.length; n++) if (!t(i[0], e[0])) return !1;
                    } else if (Array.isArray(i[0]) || Array.isArray(e[0])) return !1;
                    return !0;
                }(e, (Array.isArray(r) ? r[0] : r).geometry)) return this.Qe && (this.Xe = !0), 
                void this.onGeometryPositionChange(t);
                this.Sn([ i ]), this._n(), $r(this);
            }
            onGeometryPositionChange(t) {
                const i = t.target._getParent() || t.target, e = i[Lr];
                this.Sn([ i ]), this.Ve[e] = i, $r(this);
            }
            onGeometryZIndexChange() {
                this.bn();
            }
            onGeometryShow(t) {
                this.Dn(t);
            }
            onGeometryHide(t) {
                this.Dn(t);
            }
            Dn(t) {
                const i = t.target, e = i[Lr], n = this.features[e];
                if (n) {
                    const t = i.isVisible();
                    if (Array.isArray(n)) {
                        if (t === n[0].visible) return;
                        for (let i = 0; i < n.length; i++) n[i].visible = t;
                    } else {
                        if (t === n.visible) return;
                        n.visible = t;
                    }
                    this.Ln(), $r(this);
                }
            }
            Ln() {
                this.tn = !0;
            }
            onGeometryPropertiesChange(t) {
                const i = t.target, e = i[Lr];
                if (this.features[e] = Ur(i, this.We), Array.isArray(this.features[e])) {
                    const t = this.features[e];
                    for (let i = 0; i < t.length; i++) t[i][Lr] = e;
                } else this.features[e][Lr] = e;
                this.On(this.features[e]), this.bn(), $r(this);
            }
            createContext() {
                const t = this.canvas.gl && this.canvas.gl.wrap;
                t ? (this.gl = this.canvas.gl.wrap(), this.regl = this.canvas.gl.regl) : this._i(), 
                t && (this.canvas.pickingFBO = this.canvas.pickingFBO || this.regl.framebuffer(this.canvas.width, this.canvas.height)), 
                this.prepareRequestors(), this.pickingFBO = this.canvas.pickingFBO || this.regl.framebuffer(this.canvas.width, this.canvas.height), 
                this.painter = this.createPainter();
                const i = Tr.get3DPainterClass("icon"), e = S({}, Er, jr);
                this.$e = new i(this.regl, this.layer, e, this.layer.options.sceneConfig, 0);
                const n = Tr.get3DPainterClass("line"), r = S({}, Rr);
                this.Ge = new n(this.regl, this.layer, r, this.layer.options.sceneConfig, 0), this.layer.getGeometries() && this.onGeometryAdd(this.layer.getGeometries());
            }
            createPainter() {}
            _i() {
                const t = this.layer.options.glOptions || {
                    alpha: !0,
                    depth: !0,
                    antialias: !1
                };
                t.preserveDrawingBuffer = !0, t.stencil = !0, this.glOptions = t, this.gl = this.gl || this.Oi(this.canvas, t), 
                this.regl = e.createREGL({
                    gl: this.gl,
                    attributes: t,
                    extensions: e.reshader.Constants.WEBGL_EXTENSIONS,
                    optionalExtensions: e.reshader.Constants.WEBGL_OPTIONAL_EXTENSIONS
                });
            }
            Oi(t, i) {
                const e = [ "webgl", "experimental-webgl" ];
                let n = null;
                for (let r = 0; r < e.length; ++r) {
                    try {
                        n = t.getContext(e[r], i);
                    } catch (t) {}
                    if (n) break;
                }
                return n;
            }
            clearCanvas() {
                super.clearCanvas(), this.regl && this.regl.clear({
                    color: [ 0, 0, 0, 0 ],
                    depth: 1,
                    stencil: 255
                });
            }
            resizeCanvas(t) {
                super.resizeCanvas(t);
                const i = this.canvas;
                i && (!this.pickingFBO || this.pickingFBO.width === i.width && this.pickingFBO.height === i.height || this.pickingFBO.resize(i.width, i.height), 
                this.painter && this.painter.resize(i.width, i.height));
            }
            onRemove() {
                super.onRemove(), this.painter && this.painter.delete(), this.$e && this.$e.delete(), 
                this.Ge && this.Ge.delete();
            }
            drawOutline(t) {
                if (this.Hi && (this.painter && this.painter.outlineAll(t), this.$e.outlineAll(t), 
                this.Ge.outlineAll(t)), this.Un) for (let i = 0; i < this.Un.length; i++) this.painter && this.painter.outline(t, this.Un[i]), 
                this.$e.outline(t, this.Un[i]), this.Ge.outline(t, this.Un[i]);
            }
            outlineAll() {
                this.Hi = !0, this.setToRedraw();
            }
            outline(t) {
                this.Un || (this.Un = []);
                const i = [];
                for (let e = 0; e < t.length; e++) {
                    const n = this.layer.getGeometryById(t[e]);
                    if (n) {
                        const t = this.features[n[Lr]];
                        if (Array.isArray(t)) for (let e = 0; e < t.length; e++) i.push(t[e].id); else i.push(t.id);
                    }
                }
                this.Un.push(i), this.setToRedraw();
            }
            cancelOutline() {
                delete this.Hi, delete this.Un, this.setToRedraw();
            }
            isEnableWorkAround(t) {
                return "win-intel-gpu-crash" === t && (this.layer.options.workarounds["win-intel-gpu-crash"] && Gr(this.gl));
            }
            Li(t) {
                return this.getMap().distanceToPoint(1e3, 0, t).x / 1e3 / 10;
            }
        }
        function $r(t) {
            t.setToRedraw();
        }
        function Gr(t) {
            const i = t.getExtension("WEBGL_debug_renderer_info");
            if (i && "undefined" != typeof navigator) {
                const e = t.getParameter(i.UNMASKED_RENDERER_WEBGL), n = "Win32" === navigator.platform || "Win64" === navigator.platform;
                if (e && e.toLowerCase().indexOf("intel") >= 0 && n) return !0;
            }
            return !1;
        }
        function Jr({properties: t}) {
            return t[Nr + "markerFile"] || t[Nr + "markerType"];
        }
        function qr({properties: t}) {
            return t[Nr + "textName"];
        }
        function Br(t) {
            return 2 === t.type || 3 === t.type && !!t.properties[Nr + "lineWidth"];
        }
        function Xr(t) {
            if (!Array.isArray(t)) return 0;
            let i = 0;
            for (let e = 0; e < t.length; e++) i += t[e];
            return i;
        }
        function Zr(t, i) {
            if (Object.keys(t).sort().join() !== Object.keys(i.properties || {}).filter(t => 0 === t.indexOf(Nr)).map(t => t.substring(Nr.length)).sort().join()) return !1;
            for (const e in t) if (U(t, e) && M(t[e]) !== M(i.properties[Nr + e])) return !1;
            return !0;
        }
        function Yr(t, i, e) {
            if (!t || t.type !== i) return null;
            const n = new e(t.id, t.options), s = t.geometries, o = [];
            for (let t = 0; t < s.length; t++) {
                const i = r.Geometry.fromJSON(s[t]);
                i && o.push(i);
            }
            return n.addGeometry(o), n;
        }
        class Kr extends Tr {
            static fromJSON(t) {
                return Yr(t, "PointLayer", Kr);
            }
        }
        Kr.mergeOptions({
            glyphSdfLimitPerFrame: 15,
            iconErrorUrl: null,
            workarounds: {
                "win-intel-gpu-crash": !0
            },
            collision: !1,
            collisionFrameLimit: 1,
            sceneConfig: {
                collision: !1,
                fading: !1,
                fadingDuration: 224,
                fadeInDelay: 600,
                fadeOutDelay: 100,
                uniquePlacement: !1,
                depthFunc: "always"
            }
        }), Kr.registerJSONType("PointLayer"), Kr.registerRenderer("canvas", null);
        Kr.registerRenderer("gl", class extends Vr {
            constructor(...t) {
                super(...t), this.GeometryTypes = [ r.Marker, r.MultiPoint ];
            }
            onGeometryAdd(t) {
                t && (Array.isArray(t) ? t.forEach(t => {
                    t.options.maxMarkerWidth = t.options.maxMarkerHeight = 255;
                }) : t.options.maxMarkerWidth = t.options.maxMarkerHeight = 255, super.onGeometryAdd(t));
            }
        });
        class Qr extends Tr {
            static fromJSON(t) {
                return Yr(t, "LineStringLayer", Qr);
            }
        }
        Qr.registerJSONType("LineStringLayer");
        Qr.registerRenderer("gl", class extends Vr {
            constructor(...t) {
                super(...t), this.GeometryTypes = [ r.LineString, r.MultiLineString ];
            }
        }), Qr.registerRenderer("canvas", null);
        class ts extends Tr {
            static fromJSON(t) {
                return Yr(t, "PolygonLayer", ts);
            }
        }
        ts.registerJSONType("PolygonLayer");
        const is = {
            polygonFill: {
                type: "identity",
                default: void 0,
                property: "_symbol_polygonFill"
            },
            polygonPatternFile: {
                type: "identity",
                default: void 0,
                property: "_symbol_polygonPatternFile"
            },
            polygonOpacity: {
                type: "identity",
                default: 1,
                property: "_symbol_polygonOpacity"
            },
            uvScale: {
                type: "identity",
                default: [ 1, 1 ],
                property: "_symbol_uvScale"
            },
            uvOffset: {
                type: "identity",
                default: [ 0, 0 ],
                property: "_symbol_uvOffset"
            }
        };
        ts.registerRenderer("gl", class extends Vr {
            constructor(...t) {
                super(...t), this.PackClass = Rn, this.GeometryTypes = [ r.Polygon, r.MultiPolygon ];
            }
            buildMesh(t) {
                const {features: i, center: e} = this.sn();
                if (!i.length) return;
                const n = this.tn;
                this.En = e;
                const r = this.jn(i), s = S({}, is), o = r.map((i, n) => this.createMesh(this.painter, Rn, s, i, t && t[n], e));
                this.In = !0, Promise.all(o).then(t => {
                    this.meshes && this.painter.deleteMesh(this.meshes);
                    const i = [], e = [];
                    for (let n = 0; n < t.length; n++) {
                        const r = t[n] && t[n].meshes;
                        if (r) {
                            i.push(...r);
                            for (let t = 0; t < r.length; t++) r[t].feaGroupIndex = n, r[t].geometry.properties.originElements = r[t].geometry.properties.elements.slice(), 
                            1 === n && (r[t].transparent = !0);
                            e[n] = t[n].atlas;
                        }
                    }
                    this.meshes = i, this.atlas = e, n && (this.tn = n), this.In = !1, this.setToRedraw();
                });
            }
            jn(t) {
                const i = [], e = [];
                for (let n = 0; n < t.length; n++) {
                    const r = t[n];
                    r.properties && r.properties._symbol_polygonOpacity < 1 ? e.push(r) : i.push(r);
                }
                return [ i, e ];
            }
            createPainter() {
                const t = Tr.get3DPainterClass("fill");
                this.painterSymbol = S({}, is);
                return new t(this.regl, this.layer, this.painterSymbol, this.layer.options.sceneConfig, 0);
            }
            updateMesh(t) {
                return this.xn(t, this.meshes, this.atlas, this.En, this.painter, Rn, is, this.jn);
            }
        }), ts.registerRenderer("canvas", null), Mr.VERSION = "0.60.1", Tr.VERSION = "0.60.1", 
        t.GeoJSONVectorTileLayer = Or, t.LineStringLayer = Qr, t.MapboxVectorTileLayer = Sr, 
        t.PackUtil = Xn, t.PointLayer = Kr, t.PolygonLayer = ts, t.SYMBOLS_NEED_REBUILD_IN_VECTOR = Kn, 
        t.SYMBOLS_NEED_REBUILD_IN_VT = Yn, t.Vector3DLayer = Tr, t.VectorTileLayer = Mr, 
        t.VectorTileLayerRenderer = lr, Object.defineProperty(t, "t", {
            value: !0
        });
    }));
    o.mat4.create(), "undefined" != typeof console && console.log("@maptalks/vt v0.60.1");
}));
