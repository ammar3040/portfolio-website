
/* ── path router shim ── */
window.route = window.route || (function () {
  var P2H = { '/about': '#about', '/playground': '#playground',
              '/work/hatcha': '#hatcha', '/work/fireflut': '#fireflut',
              '/work/existence': '#existence', '/work/jumpable': '#jumpable' };
  var H2P = {}; Object.keys(P2H).forEach(function (p) { H2P[P2H[p]] = p; });
  function token() {
    var p = location.pathname.replace(/\/+$/, '') || '/';
    return P2H[p] || location.hash;
  }
  function fire() { window.dispatchEvent(new HashChangeEvent('hashchange')); }
  function go(t) { history.pushState(null, '', H2P[t] || ('/' + t)); fire(); }
  window.addEventListener('popstate', fire);
  return { token: token, go: go, P2H: P2H, H2P: H2P };
})();
(function () {
  var p = window.route && window.route.H2P && window.route.H2P[location.hash];
  if (p) history.replaceState(null, '', p);
})();

/* mobile gate: <=820px */
(function () {
  var w = window.innerWidth || document.documentElement.clientWidth || screen.width;
  if (w && w <= 820) document.documentElement.classList.add('cs-static');
})();

/* ── unified scroll scheduler + per-frame layout-read cache ── */
(function () {
  if (window.Scroll) return;
  var subs = [], reads = [], queued = false;
  var cache = new Map(), want = new Set(), prev = new Set();
  var _y = 0, _vh = 0, _vw = 0;

  function frame() {
    queued = false;
    _y = window.scrollY || window.pageYOffset || 0;
    _vh = window.innerHeight;
    _vw = window.innerWidth;
    cache.clear();
    prev.forEach(function (el) {
      if (el.isConnected) cache.set(el, el.getBoundingClientRect());
    });
    want = new Set();
    for (var i = 0; i < reads.length; i++) {
      try { reads[i](); } catch (e) { }
    }
    for (var i = 0; i < subs.length; i++) {
      try { subs[i](); } catch (e) { }
    }
    prev = want;
  }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(frame); } }

  window.Scroll = {
    add: function (fn) { subs.push(fn); schedule(); return fn; },
    addRead: function (fn) { reads.push(fn); schedule(); return fn; },
    rect: function (el) {
      var r = cache.get(el);
      if (!r) { r = el.getBoundingClientRect(); cache.set(el, r); }
      want.add(el);
      return r;
    },
    y:  function () { return _y; },
    vh: function () { return _vh || window.innerHeight; },
    vw: function () { return _vw || window.innerWidth; },
    kick: schedule,
  };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  addEventListener('load', schedule);
})();

/* night theme check */
try {
  if (localStorage.getItem('theme') === 'night') {
    document.documentElement.classList.add('night');
  }
} catch (e) {}
