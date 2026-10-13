/**
 * Centralized requestAnimationFrame scroll scheduler + layout read cache.
 * Mirrors the original window.Scroll interface for smooth 60/120fps animations.
 */
let initialized = false;

export function initScrollScheduler() {
  if (typeof window === 'undefined' || initialized) return;
  initialized = true;

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
      try { reads[i](); } catch (e) { /* ignore */ }
    }
    for (var i = 0; i < subs.length; i++) {
      try { subs[i](); } catch (e) { /* ignore */ }
    }
    prev = want;
  }

  function schedule() {
    if (!queued) {
      queued = true;
      requestAnimationFrame(frame);
    }
  }

  window.Scroll = {
    add: function (fn) {
      subs.push(fn);
      schedule();
      return fn;
    },
    remove: function (fn) {
      const idx = subs.indexOf(fn);
      if (idx !== -1) subs.splice(idx, 1);
    },
    addRead: function (fn) {
      reads.push(fn);
      schedule();
      return fn;
    },
    removeRead: function (fn) {
      const idx = reads.indexOf(fn);
      if (idx !== -1) reads.splice(idx, 1);
    },
    rect: function (el) {
      if (!el) return { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0 };
      var r = cache.get(el);
      if (!r) {
        r = el.getBoundingClientRect();
        cache.set(el, r);
      }
      want.add(el);
      return r;
    },
    y:  function () { return _y || (typeof window !== 'undefined' ? (window.scrollY || window.pageYOffset || 0) : 0); },
    vh: function () { return _vh || (typeof window !== 'undefined' ? window.innerHeight : 900); },
    vw: function () { return _vw || (typeof window !== 'undefined' ? window.innerWidth : 1440); },
    kick: schedule,
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('load', schedule);
}
