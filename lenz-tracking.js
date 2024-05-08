const b = () => {
  let e = "";
  const n = "0123456789abcdef";
  for (let r = 0; r < 16; r++)
    e += n.charAt(Math.floor(Math.random() * n.length));
  return e;
}, _ = (e) => {
  const n = document.cookie.match(`(^|;)\\s*${e}\\s*=\\s*([^;]+)`);
  return n ? n.pop() : "";
}, C = (e, n, r) => {
  const s = new Date(Date.now() + r * 864e5).toUTCString();
  document.cookie = `${e}=${n};expires=${s};path=/`;
}, S = () => {
  const e = "event_logger_il", n = _(e);
  if (!n) {
    const r = b();
    return C(e, r, 365), r;
  }
  return n;
}, L = (e, n, ...r) => {
  for (const i in e)
    if (/^on/.test(i)) {
      const u = i.slice(2);
      e.addEventListener(u, n, ...r);
    }
  const s = EventTarget.prototype.dispatchEvent;
  function o(i) {
    return e.addEventListener(i.type, n, ...r), s.apply(this, [i]);
  }
  if (EventTarget.prototype.dispatchEvent = o, EventTarget.prototype.dispatchEvent !== o)
    throw new Error("Browser is smarter than you think!");
}, O = (e) => {
  const n = e.parentNode;
  return n ? Array.from(n.children).indexOf(e) : -1;
}, I = (e) => {
  let n = e.target, r = "";
  for (; n; ) {
    const s = n.tagName.toLowerCase(), o = O(n);
    if (r = `${s}:nth-child(${o})${r ? ` > ${r}` : ""}`, s === "body")
      break;
    n = n.parentElement;
  }
  return r;
}, U = (e) => e instanceof HTMLElement ? e.baseURI : null, $ = (e) => e instanceof HTMLElement ? e.outerHTML : null, A = (e) => e instanceof HTMLInputElement ? e.value : null, K = (e) => {
  if (!e)
    return null;
  const n = e.target, r = e;
  return {
    eventName: e.type.toLowerCase(),
    type: e.type,
    time: e.timeStamp,
    baseUri: U(n),
    x: r.x,
    y: r.y,
    target: $(n),
    cssSelector: I(e),
    inputValue: e.type === "input" ? A(n) : null
  };
};
var M = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, y = { exports: {} };
(function(e) {
  (function(n) {
    var r = function(t, a, c) {
      if (!g(a) || T(a) || w(a) || x(a) || E(a))
        return a;
      var l, p = 0, h = 0;
      if (k(a))
        for (l = [], h = a.length; p < h; p++)
          l.push(r(t, a[p], c));
      else {
        l = {};
        for (var v in a)
          Object.prototype.hasOwnProperty.call(a, v) && (l[t(v, c)] = r(t, a[v], c));
      }
      return l;
    }, s = function(t, a) {
      a = a || {};
      var c = a.separator || "_", l = a.split || /(?=[A-Z])/;
      return t.split(l).join(c);
    }, o = function(t) {
      return z(t) ? t : (t = t.replace(/[\-_\s]+(.)?/g, function(a, c) {
        return c ? c.toUpperCase() : "";
      }), t.substr(0, 1).toLowerCase() + t.substr(1));
    }, i = function(t) {
      var a = o(t);
      return a.substr(0, 1).toUpperCase() + a.substr(1);
    }, u = function(t, a) {
      return s(t, a).toLowerCase();
    }, f = Object.prototype.toString, E = function(t) {
      return typeof t == "function";
    }, g = function(t) {
      return t === Object(t);
    }, k = function(t) {
      return f.call(t) == "[object Array]";
    }, T = function(t) {
      return f.call(t) == "[object Date]";
    }, w = function(t) {
      return f.call(t) == "[object RegExp]";
    }, x = function(t) {
      return f.call(t) == "[object Boolean]";
    }, z = function(t) {
      return t = t - 0, t === t;
    }, d = function(t, a) {
      var c = a && "process" in a ? a.process : a;
      return typeof c != "function" ? t : function(l, p) {
        return c(l, t, p);
      };
    }, m = {
      camelize: o,
      decamelize: u,
      pascalize: i,
      depascalize: u,
      camelizeKeys: function(t, a) {
        return r(d(o, a), t);
      },
      decamelizeKeys: function(t, a) {
        return r(d(u, a), t, a);
      },
      pascalizeKeys: function(t, a) {
        return r(d(i, a), t);
      },
      depascalizeKeys: function() {
        return this.decamelizeKeys.apply(this, arguments);
      }
    };
    e.exports ? e.exports = m : n.humps = m;
  })(M);
})(y);
var N = y.exports;
const D = (e, n) => {
  const r = K(n), s = {
    user: e,
    event_timestamp: r ? r.time : null,
    url: r ? r.baseUri : null,
    event: r
  };
  H(s);
}, H = async (e) => {
  try {
    const n = await fetch("https://muskox-keen-anteater.ngrok-free.app/api/v1/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: N.decamelizeKeys(JSON.stringify(e))
    });
    n.ok ? console.log("Event sent successfully!") : console.error("Failed to send event:", n.status, n.statusText);
  } catch (n) {
    console.error("An error occurred while sending the event:", n);
  }
}, B = () => {
  const e = S();
  if (!(localStorage.shouldTrack !== 0))
    return;
  const r = (o) => (o.time = o.time || (/* @__PURE__ */ new Date()).toISOString(), o);
  L(window, (o) => {
    if (R(o)) {
      const i = r(o);
      D(e, i);
    }
  });
}, R = (e) => ["click", "input", "pointerdown", /select/].some(
  (r) => e.type === r || typeof r == "string" && e.type.match(r)
);
B();
