
// === PORTFOLIO RUNTIME JS ===

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


// === EXTRACTED BODY SCRIPTS ===
if (localStorage.getItem('theme') === 'night') document.body.classList.add('night');

// -----------------------------------------

document.documentElement.classList.add('pl-lock');

// -----------------------------------------


  (function(){
    var SAFETY_CAP = 4000;
    setTimeout(function(){
      if (!window.pageLoader) {
        var pl = document.getElementById('page-loader');
        if (pl) { pl.classList.add('is-hiding'); setTimeout(function(){ pl.style.display = 'none'; }, 420); }
        document.documentElement.classList.remove('pl-lock');
        document.body.classList.remove('pl-lock');
      }
    }, SAFETY_CAP);
  })();
  

// -----------------------------------------


    (function () {
      // ── in-page routing: #about / #playground open their views, hide the landing ──
      const aboutView = document.getElementById('about-view');
      const playgroundView = document.getElementById('playground-view');
      const hatchaView = document.getElementById('hatcha-view');
      const fireflutView = document.getElementById('fireflut-view');
      const existenceView = document.getElementById('existence-view');
      const jumpableView = document.getElementById('jumpable-view');

      // Scroll the landing to an in-page anchor (e.g. the case-study Back button →
      // #work). #work (.featured-work) is position:sticky with a JS-set negative
      // top, so its offsetTop overshoots its real document position (that's what
      // dropped users into testimonials). getBoundingClientRect().top + scrollY IS
      // its true position and is accurate here because we run at scrollY≈0, before
      // the section enters its pinned range. Re-asserted because a View Transition
      // restores scroll when it ends, after any in-transition scroll.
      function scrollToHashTarget() {
        const target = location.hash && document.querySelector(location.hash);
        if (!target) return;
        const nav = document.getElementById('nav');
        const doScroll = () => {
          const navH = nav ? nav.getBoundingClientRect().height : 80;
          // reset to the top first so the sticky section is un-pinned and reads
          // its true position (coming from a deep case-study scroll it would
          // otherwise measure its pinned position and overshoot into testimonials).
          // behavior:'instant' is required — the page sets scroll-behavior:smooth,
          // so a plain scrollTo animates and we'd measure mid-animation.
          window.scrollTo({ top: 0, behavior: 'instant' });
          const docTop = target.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: Math.max(0, docTop - navH - 8), behavior: 'instant' });
        };
        doScroll();
        [80, 260].forEach(t => setTimeout(doScroll, t));
      }

      function applyAboutRoute() {
        const isAbout = route.token() === '#about';
        const isPlayground = route.token() === '#playground';
        const isHatcha = route.token() === '#hatcha';
        const isFireflut = route.token() === '#fireflut';
        const isExistence = route.token() === '#existence';
        const isJumpable = route.token() === '#jumpable';
        document.body.classList.toggle('route-about', isAbout);
        document.body.classList.toggle('route-playground', isPlayground);
        document.body.classList.toggle('route-hatcha', isHatcha);
        document.body.classList.toggle('route-fireflut', isFireflut);
        document.body.classList.toggle('route-existence', isExistence);
        document.body.classList.toggle('route-jumpable', isJumpable);
        if (aboutView) aboutView.hidden = !isAbout;
        if (playgroundView) playgroundView.hidden = !isPlayground;
        if (hatchaView) hatchaView.hidden = !isHatcha;
        if (fireflutView) fireflutView.hidden = !isFireflut;
        if (existenceView) existenceView.hidden = !isExistence;
        if (jumpableView) jumpableView.hidden = !isJumpable;
        document.querySelectorAll('.nav-link, .menu-link').forEach(l => {
          const href = l.getAttribute('href') || '';
          l.classList.toggle('active', (isAbout && (href.endsWith('#about') || href.endsWith('/about'))) ||                                       (isPlayground && (href.endsWith('#playground') || href.endsWith('/playground'))));
        });
        // the swapped-in view is a different backdrop under the fixed nav — re-run
        // the contrast check so the nav text/pin/toggle-label recolour to match.
        // fire across the view-transition settle window (the new view paints a few
        // frames after the class swap, so a single tick can sample the old snapshot).
        [0, 90, 320, 650].forEach(t => setTimeout(() => window.updateNavContrast?.(), t));
        // scroll to top after the section swap settles (defeat scroll-anchoring)
        if (isAbout || isPlayground || isHatcha || isFireflut || isExistence || isJumpable) {
          // behavior:'instant' is REQUIRED — the page sets scroll-behavior:smooth, so a bare
          // scrollTo animates the whole way down. Coming off a case study's read-next panel
          // that's a ~1.8s crawl from y≈20900 to 0, and the incoming deck renders every
          // intermediate offset: the next case study visibly plays backwards, last panel to
          // first, before the hero lands. Same gotcha scrollToHashTarget() documents above.
          window.scrollTo({ top: 0, behavior: 'instant' });
          requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        } else {
          // Returning to home: the landing sections were display:none, so their
          // scroll-driven geometry (plane path, sticky pin, tile reveal) was never
          // rebuilt against a real layout. Re-measure once they're painted, so the
          // plane flies and all four tiles reveal correctly.
          requestAnimationFrame(() => requestAnimationFrame(() => {
            window.dispatchEvent(new Event('resize'));
            // returning to the landing via an in-page anchor (e.g. the Back button
            // → #work): the target was display:none during the browser's native
            // anchor scroll, so scroll to it now it's painted. (For the View
            // Transition path the authoritative scroll happens in .finished below.)
            scrollToHashTarget();
          }));
        }
      }
      // entering/leaving the case study: morph the project tile into the hero
      // image via the View Transitions API (names set in the #hatcha-view CSS).
      // Other route changes, unsupported browsers, and reduced-motion users
      // keep the instant swap.
      // ── Curtain page transition: Home ⇄ About ⇄ Playground. Two panes close
      // to cover the outgoing page, applyAboutRoute swaps the route behind them,
      // then they open (top up / bottom down) revealing the new page while its
      // content fades in. Case studies keep their tile→hero View-Transition morph;
      // reduced-motion keeps the instant swap. ──
      const curtain = document.getElementById('route-curtain');
      const HEAVY_VIEW = { about: 'about-view', playground: 'playground-view' };

      function routeBucket(hash) {
        if (hash === '#about') return 'about';
        if (hash === '#playground') return 'playground';
        if (hash === '#hatcha') return 'hatcha';
        if (hash === '#fireflut') return 'fireflut';
        if (hash === '#existence') return 'existence';
        if (hash === '#jumpable') return 'jumpable';
        return 'home'; // '', '#work', and any in-page landing anchor
      }
      // mirror of pageLoader.showForView's decode wait, WITHOUT the Pac-Man overlay —
      // used to head-start the heavy views' imagery decode.
      function decodeReady(id) {
        const view = document.getElementById(id);
        const imgs = view ? Array.from(view.querySelectorAll('img')).slice(0, 6) : [];
        return Promise.all(imgs.map(img =>
          (img.decode ? img.decode().catch(() => {}) : Promise.resolve())));
      }
      let inTransition = false;
      let curtainHandled = false; // set per-event; tells the loader handler to stand down

      // ONE fixed timeline for EVERY route so the pace is identical regardless of how
      // heavy the destination is: close (T_CLOSE) → dwell (T_HOLD) → open (T_OPEN).
      // Driven purely by setTimeout, NOT transitionend — the panes are transform-only
      // (compositor/GPU) so they keep gliding smoothly even if the main thread stalls
      // while a heavy view (About photos) paints, and the sequence always self-completes
      // (no stuck 'is-active'). The route swap happens under full cover, so any paint
      // stall is hidden behind the panes rather than stuttering a visible frame.
      const T_CLOSE = 550, T_HOLD = 350, T_OPEN = 900;
      function runCurtain(destBucket) {
        inTransition = true;
        // 1) clear any stale state, activate, park panes at their open (off-screen)
        //    start, then close them. is-closed is added SYNCHRONOUSLY after a forced
        //    reflow (which commits the resting transform as the transition's start).
        curtain.classList.remove('is-closing', 'is-closed');
        curtain.classList.add('is-active', 'is-closing');
        void curtain.offsetWidth;                 // flush the resting transform
        curtain.classList.add('is-closed');       // slide in (T_CLOSE)

        // 2) fully covered → swap the route behind the curtain
        setTimeout(() => {
          applyAboutRoute();
          // head-start the heavy view's decode; do NOT await it (keeps pace uniform)
          const heavyId = HEAVY_VIEW[destBucket];
          if (heavyId) decodeReady(heavyId);

          // 3) after the fixed hold, open the panes (T_OPEN). The .rc-scrim fades out
          //    on the same schedule (CSS), so the new page fades 0→100% as it's revealed.
          setTimeout(() => {
            curtain.classList.remove('is-closing', 'is-closed');
            // 4) settle: retire the curtain and recolour the nav
            setTimeout(() => {
              curtain.classList.remove('is-active', 'is-closing', 'is-closed');
              window.updateNavContrast?.();
              inTransition = false;
            }, T_OPEN + 80);
          }, T_HOLD);
        }, T_CLOSE);
      }

      /* ── ROUTE HERO TRANSITION ────────────────────────────────────────────
         Opening a case study — from a home project tile, or from a read-next
         panel — expands that case study's hero asset out of the thing you
         clicked, takes the whole screen, then slides it DOWN into its resting
         place in the hero while the title and meta rise in above it.

         The overlay (.rt-hero) is ALWAYS exactly one viewport at 0,0 holding a
         clone of the DESTINATION hero mock, so all three states are one
         transform + clip-path off the same box (fitRect). Two consequences
         worth keeping:
          · the destination mock is already width:100% / height:100svh, so the
            settle phase is a PURE TRANSLATE — no scaling, so no warp recompute
            and no distortion on the frame that actually persists;
          · cloning the destination (not the source tile) means the landing is
            pixel-identical to the real mock underneath. The tiles carry their
            own --warp-zoom tuning, so cloning the source would pop on arrival.

         The route swaps at the END of the expand, under full cover, so the page
         you're leaving stays put and simply gets covered. ── */
      const rtHero = (function () {
        const T_EXPAND = 440, T_SETTLE = 620;
        // expand is punchy (quint) so the takeover feels decisive; the settle is a
        // gentler cubic so the drop stays legible the whole way instead of snapping
        // 90% down in the first 120ms and then creeping the rest
        const E_EXPAND = 'cubic-bezier(0.22, 1, 0.36, 1)';
        const E_SETTLE = 'cubic-bezier(0.33, 1, 0.68, 1)';
        let running = false, armed = false;

        // map the one-viewport overlay onto an arbitrary rect: uniform cover-scale
        // plus a clip so the visible window matches that rect's aspect and radius.
        function fitRect(r, radius) {
          const W = innerWidth, H = innerHeight;
          const s = Math.max(r.width / W, r.height / H) || 1;
          return {
            transform: `translate(${r.left + r.width / 2 - W * s / 2}px, ` +
                       `${r.top + r.height / 2 - H * s / 2}px) scale(${s})`,
            clipPath: `inset(${Math.max(0, (H - r.height / s) / 2)}px ` +
                      `${Math.max(0, (W - r.width / s) / 2)}px round ${(radius || 0) / s}px)`
          };
        }
        const fullRect = () => ({ left: 0, top: 0, width: innerWidth, height: innerHeight });

        function open(hash, srcEl) {
          const destView = document.getElementById(hash.slice(1) + '-view');
          const destMock = destView && destView.querySelector('.cs-hero .cs-hero-mock');
          const srcMock = srcEl && (srcEl.querySelector('.cs-hero-mock') || srcEl);
          const srcRect = srcMock && srcMock.getBoundingClientRect();
          if (running || !destMock || !srcRect || !srcRect.width || !srcRect.height ||
              matchMedia('(prefers-reduced-motion: reduce)').matches) {
            route.go(hash);
            return;
          }
          running = true;

          const overlay = document.createElement('div');
          overlay.className = 'rt-hero';
          overlay.setAttribute('aria-hidden', 'true');
          const clone = destMock.cloneNode(true);
          clone.removeAttribute('data-hero-mock');   // don't let anything else adopt it
          overlay.appendChild(clone);
          document.body.appendChild(overlay);

          // the clone came out of a display:none view, so it carries no usable warp
          // matrix — recompute now that it's laid out at the overlay's real size
          window.csWarpUpdate?.(clone);
          const cv = clone.querySelector('video'), sv = srcMock.querySelector('video');
          if (cv) {
            cv.muted = true;
            if (sv) { try { cv.currentTime = sv.currentTime; } catch (_) {} }
            cv.play?.().catch(() => {});
          }

          const radius = parseFloat(getComputedStyle(srcEl).borderRadius) || 0;
          const from = fitRect(srcRect, radius);
          const full = fitRect(fullRect(), 0);
          overlay.style.transform = from.transform;
          overlay.style.clipPath = from.clipPath;

          let gridAnim = null;
          const cleanup = () => {
            document.documentElement.classList.remove('rt-settling');
            overlay.remove();
            gridAnim?.cancel();
            running = false;
            window.updateNavContrast?.();
          };

          // PHASE A — expand out of the clicked thing and take the screen
          const expand = overlay.animate([from, full], { duration: T_EXPAND, easing: E_EXPAND, fill: 'both' });
          expand.finished.then(() => {
              // commit the end state to inline style and drop the animation, so phase B
              // isn't compositing against a still-filling phase A on the same properties
              overlay.style.transform = full.transform;
              overlay.style.clipPath = full.clipPath;
              expand.cancel();
              // swap the route under full cover: hide the real mock + hero copy first
              // so the incoming view can't flash them before the overlay hands off
              document.documentElement.classList.add('rt-settling');

              // Phase B can only be measured AFTER applyAboutRoute has un-hidden the
              // destination: hashchange is dispatched asynchronously, so measuring in a
              // plain rAF here still reads the view at display:none and every rect comes
              // back 0. Wait for the event (this listener is registered after the
              // router's, so the route is already applied when it fires), with a timeout
              // in case the hash was somehow already current and no event lands.
              let settled = false;
              const settle = () => {
                if (settled) return;
                settled = true;
                removeEventListener('hashchange', settle);
                requestAnimationFrame(() => {
                  const destRect = destMock.getBoundingClientRect();
                  if (destRect.width < 1 || destRect.height < 1) { cleanup(); return; }
                  const to = fitRect(destRect, 0);
                  // PHASE B — slide down into place (a pure translate on desktop, where
                  // the hero mock is already exactly one viewport)
                  const b = overlay.animate([full, to], { duration: T_SETTLE, easing: E_SETTLE, fill: 'both' });
                  const grid = destView.querySelector('.cs-hero .cs-hero-grid');
                  if (grid) gridAnim = grid.animate(
                    [{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }],
                    { duration: 520, delay: 120, easing: E_SETTLE, fill: 'both' });
                  b.finished.then(cleanup, cleanup);
                });
              };
              addEventListener('hashchange', settle);
              setTimeout(settle, 200);
              armed = true;
              route.go(hash);
            }, cleanup);
        }

        // the router asks whether this hashchange is ours, exactly once
        function consume() { const was = armed; armed = false; return was; }
        return { open, consume, isRunning: () => running };
      })();
      window.rtHero = rtHero;

      // clicking a project tile, a read-next asset, or a read-next title opens the
      // case study through the hero transition instead of the plain hash swap
      document.addEventListener('click', (e) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const a = e.target.closest?.('a.project-tile[href^="/work/"], a.rn-asset[href^="/work/"], a.rn-title-link[href^="/work/"]');
        if (!a) return;
        const hash = route.P2H[a.getAttribute('href')];
        if (!hash || hash === route.token() || !document.getElementById(hash.slice(1) + '-view')) return;
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;   // plain swap
        e.preventDefault();
        // the title link has no mock of its own — expand from its panel's asset
        const src = a.querySelector('.cs-hero-mock') ? a
                  : (a.closest('[data-readnext]')?.querySelector('.rn-asset') || a);
        rtHero.open(hash, src);
      });

      // any other internal path link (nav, menu, reduced-motion fallbacks) routes
      // through the SPA instead of a full document load. Registered AFTER the hero
      // delegate above, so a preventDefault there (defaultPrevented) wins here.
      document.addEventListener('click', (e) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const a = e.target.closest?.('a[href]');
        if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
        const href = a.getAttribute('href');
        if (route.P2H[href]) {                     // /about, /playground, /work/*
          e.preventDefault();
          if (route.P2H[href] !== route.token()) route.go(route.P2H[href]);
        } else if (href && href.startsWith('/#') && route.token() && !location.hash) {
          // in-page home anchor clicked from a sub-page path: without interception
          // this is a cross-document load; route home, the router scrolls to it
          e.preventDefault();
          route.go(href.slice(1));
        }
      });

      // per-route document titles — the static head carries the home title (and the
      // prerendered pages their own), this keeps the tab title honest on client-side navs
      const ROUTE_TITLES = {
        '#about': 'About Ammar Shaikh — Full-Stack Developer, Surat',
        '#playground': 'Playground — Code Experiments &amp; UI Prototypes | Ammar Shaikh',
        '#hatcha': 'CrystalStonesMart — B2B E-Commerce Platform | Ammar Shaikh',
        '#fireflut': 'Nutrition Mate — Health &amp; Wellness Platform | Ammar Shaikh',
        '#existence': 'CoderKube Systems — 15+ Production Apps | Ammar Shaikh',
        '#jumpable': 'Upwork Retainer &amp; Freelance Practice | Ammar Shaikh'
      };
      const HOME_TITLE = 'Ammar Shaikh — Full-Stack & MERN Developer';
      function applyRouteTitle() { document.title = ROUTE_TITLES[route.token()] || HOME_TITLE; }
      window.addEventListener('hashchange', applyRouteTitle);
      applyRouteTitle();

      /* Tile → hero morph, run with the shared view-transition-names switched ON.
         They live behind body.vt-hero (see the .project-tile rules) because a
         named element gets pulled out of the page into the view-transition top
         layer, which paints above the root snapshot and ignores the z-index that
         was covering it. Leaving the names on permanently meant the day/night
         toggle — also a view transition — hoisted the pinned home tiles over the
         sticky testimonials, so they flashed across the willows on every swap.
         Adding the class here keeps the names scoped to case-study navs only. */
      function startHeroTransition(update) {
        document.body.classList.add('vt-hero');
        void document.body.offsetHeight;   // flush styles so the OLD capture sees the names
        const vt = document.startViewTransition(update);
        const drop = () => document.body.classList.remove('vt-hero');
        vt.finished.then(drop, drop);
        return vt;
      }

      let prevHash = route.token();
      window.addEventListener('hashchange', () => {
        const from = routeBucket(prevHash);
        const to = routeBucket(route.token());
        prevHash = route.token();
        curtainHandled = false;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const involvesCaseStudy = from === 'hatcha' || to === 'hatcha' ||
                                  from === 'fireflut' || to === 'fireflut' ||
                                  from === 'existence' || to === 'existence' ||
                                  from === 'jumpable' || to === 'jumpable';

        if (rtHero.consume()) {
          // the hero transition owns this nav: it already has the screen covered and
          // drives the landing itself, so swap plainly — a View Transition here would
          // snapshot over the top of it and stall the hand-off.
          applyAboutRoute();
        } else if (involvesCaseStudy && document.startViewTransition && !reduced) {
          // the View Transition overlays a snapshot until it finishes, so the
          // deferred contrast ticks inside applyAboutRoute sample the OLD view.
          // Re-run once the transition settles so the nav reads the new backdrop.
          startHeroTransition(applyAboutRoute)
            .finished.then(() => { window.updateNavContrast?.(); scrollToHashTarget(); });
        } else if (curtain && !involvesCaseStudy && from !== to && !reduced && !inTransition) {
          curtainHandled = true; // this nav owns the cover; loader handler stands down
          runCurtain(to);
        } else {
          applyAboutRoute();
        }
      });

      // Pac-Man loader on the heavy, instant-swap views: Playground (WebGL canvas)
      // and About (~30MB of photos). Registered after the router's own hashchange
      // handler, so applyAboutRoute has already un-hidden the view (same synchronous
      // event dispatch, before paint) — the loader then covers it while its images
      // decode. Skipped when the curtain ran this nav (it owns the decode hold), and
      // left to run for reduced-motion / re-entrant instant swaps. Case studies are
      // left to their tile→hero View Transition morph rather than an overlay.
      window.addEventListener('hashchange', () => {
        if (curtainHandled) return;
        const HEAVY = { '#about': 'about-view', '#playground': 'playground-view' };
        const id = HEAVY[route.token()];
        if (id) window.pageLoader?.showForView(id);
      });

      // Hidden-view videos ship WITHOUT the autoplay attribute — Chrome starts
      // streaming an autoplay video even inside a display:none subtree, which
      // front-loaded ~16MB of case-study video on the landing page. They carry
      // data-vauto instead: play() fires when the view is actually revealed,
      // then the deck engines take over pausing/resuming per panel as usual.
      (function () {
        document.querySelectorAll('[id$="-view"]').forEach(view => {
          const playAll = () => view.querySelectorAll('video[data-vauto]').forEach(v => {
            const p = v.play(); if (p && p.catch) p.catch(() => {});
          });
          // Third-party embeds (the Existence reel) keep playing their AUDIO once the
          // route swaps away — the view only goes display:none, which stops nothing
          // inside a cross-origin iframe. Detach the document on the way out; on the
          // way back in, restore only the embeds whose deck panel is currently live,
          // so leaving the route mid-deck doesn't drag every embed back onto the wire.
          const stopEmbeds = () => view.querySelectorAll('iframe[data-src]').forEach(f => {
            if (f.getAttribute('src')) f.removeAttribute('src');
          });
          const startEmbeds = () => view.querySelectorAll('iframe[data-src]').forEach(f => {
            const panel = f.closest('.cs-slide-sec');
            if (panel && panel.style.visibility === 'hidden') return;
            if (f.getAttribute('src') !== f.dataset.src) f.src = f.dataset.src;
          });
          new MutationObserver(() => {
            if (view.hidden) stopEmbeds(); else { playAll(); startEmbeds(); }
          }).observe(view, { attributes: true, attributeFilter: ['hidden'] });
          if (!view.hidden) { playAll(); startEmbeds(); }
        });
      })();

      // Pre-decode the heavy views' imagery so the first Home→About /
      // Home→Playground hop doesn't pay a paint stall (which would make that
      // curtain dwell longer than the others). Decoding a hidden (display:none)
      // view's images is fine — it warms the decode cache without rendering them.
      // Fired on the first hover/focus/touch of an internal link (navigation
      // intent), NOT at idle: the idle version re-fetched the hidden views'
      // lazy-loaded images during initial load, defeating the deferral.
      function prewarmHeavyViews() {
        ['about-view', 'playground-view'].forEach(id => {
          const v = document.getElementById(id);
          if (!v) return;
          Array.from(v.querySelectorAll('img')).slice(0, 10).forEach(img => {
            if (img.decode) img.decode().catch(() => {});
          });
        });
      }
      let prewarmed = false;
      function prewarmOnIntent(e) {
        if (prewarmed) return;
        const a = e.target && e.target.closest && e.target.closest('a[href*="#"]');
        if (!a) return;
        prewarmed = true;
        ['pointerover', 'focusin', 'touchstart'].forEach(t =>
          document.removeEventListener(t, prewarmOnIntent, true));
        prewarmHeavyViews();
      }
      ['pointerover', 'focusin', 'touchstart'].forEach(t =>
        document.addEventListener(t, prewarmOnIntent, { capture: true, passive: true }));

      // ── Hatcha logo-band animation: scale the 1440×1024 stage to the viewport
      // and (re)play the zoom-out whenever the band scrolls into view ──
      const logoBand = document.querySelector('.cs-logoband');
      const animStage = logoBand && logoBand.querySelector('.cs-anim-stage');
      const animViewport = logoBand && logoBand.querySelector('.cs-anim-viewport');
      function fitAnimStage() {
        if (!animStage || !animViewport) return;
        const r = animViewport.getBoundingClientRect();
        if (!r.width || !r.height) return; // view hidden — keep the last good scale
        // Fit the FULL phone row to the viewport width so the zoom-out fills
        // edge-to-edge with every phone visible: the outer phones extend to
        // x −244…1684 = 1928px, wider than the 1440 stage. min() with the height
        // ratio keeps it contained (no vertical overflow) on tall / ultra-wide panels.
        const designW = window.innerWidth <= 720 ? 560 : 1928;
        animStage.style.setProperty('--s', Math.min(r.width / designW, r.height / 1024));
      }
      if (animStage) {
        window.addEventListener('resize', fitAnimStage);
        fitAnimStage();
        // the band starts inside a hidden view, so re-measure whenever the route
        // opens (rAF: after the section is painted) and when the band scrolls in
        // hold a reference to the observer — unreferenced observers can be GC'd
        // and silently stop firing (seen on direct #hatcha page loads)
        const bandIO = new IntersectionObserver(entries => entries.forEach(e => {
          fitAnimStage();
          logoBand.classList.toggle('play', e.isIntersecting);
        }), { threshold: 0.35 });
        bandIO.observe(logoBand);
        window.addEventListener('hashchange', () => requestAnimationFrame(() => { bandIO.takeRecords(); fitAnimStage(); }));
      }

      // ── scrolling phone mockups (section 03) — scale the 350px design stages
      // to their shells and ping-pong-scroll the card strips while in view ──
      const phonesBlock = document.querySelector('#hatcha-view .cs-phones');
      const phoneShells = phonesBlock ? phonesBlock.querySelectorAll('.cs-pshell') : [];
      function fitPhoneStages() {
        phoneShells.forEach(sh => {
          const w = sh.clientWidth;
          if (!w) return; // view hidden — keep the last good scale
          sh.querySelector('.cs-pstage').style.setProperty('--ps', w / 350);
        });
      }
      if (phoneShells.length) {
        window.addEventListener('resize', fitPhoneStages);
        fitPhoneStages();
        const phonesIO = new IntersectionObserver(entries => entries.forEach(e => {
          fitPhoneStages();
          phonesBlock.classList.toggle('play', e.isIntersecting);
        }), { threshold: 0.25 });
        phonesIO.observe(phonesBlock);
        window.addEventListener('hashchange', () => requestAnimationFrame(() => { phonesIO.takeRecords(); fitPhoneStages(); }));
      }

      // ── reveal on scroll — everything fades + rises (y-axis) as it enters view.
      // TWO treatments (both opacity/transform only, nudged on route because the view
      // starts hidden so IO can't fire until it's shown — same as bandIO/phonesIO):
      //   • text  → .reveal      (subtle 26px rise, css/site.css — matches home)
      //   • asset → .cs-areveal  (MetaLab-style 72px slide + settle-scale, clearly
      //                           visible on large media where 26px is imperceptible)
      (function () {
        const view = document.getElementById('hatcha-view');
        if (!view) return;
        // Text blocks → subtle reveal.
        const textTargets = [...view.querySelectorAll(
          '.cs-hero-h, .cs-hero-intro, .cs-meta > div, .cs-showcase-eye, .cs-showcase-h,' +
          '.cs-rail, .cs-sec-h, .cs-p, .cs-note, .cs-shift-eye, .cs-cmp, .cs-fx,' +
          '.cs-crit-eye, .cs-crit > div, .cs-quote p, .cs-step, .cs-stat,' +
          '.cs-theme-txt-h, .cs-mini, .cs-closing-h, .cs-closing-p, .rn-kicker, .rn-title, .rn-desc'
        )];
        // Assets → hard-edge clip-mask reveal. The hero image is excluded — its
        // entrance is the tile→hero view-transition zoom, which a reveal would fight.
        const assetTargets = [...view.querySelectorAll(
          '.cs-phones, .cs-palette, .cs-guardrail-img, .cs-ph'
        )];
        textTargets.forEach(el => el.classList.add('reveal'));
        // match the clip's rounded corners to each asset's own radius, and give the
        // sideways-overflowing phones assembly a side-safe (top-only) clip.
        const clip = el => {
          el.classList.add('cs-clip');
          el.style.setProperty('--clip-round', getComputedStyle(el).borderTopLeftRadius || '0px');
        };
        assetTargets.forEach(el => {
          clip(el);
          if (el.classList.contains('cs-phones')) el.classList.add('cs-clip-wide');
        });
        const targets = [...textTargets, ...assetTargets];
        if (!targets.length) return;

        // gentle per-row stagger where blocks sit side by side in a grid
        ['.cs-meta', '.cs-crit', '.cs-steps', '.cs-stats'].forEach(sel => {
          view.querySelectorAll(sel + ' > *').forEach((el, i) => {
            el.style.setProperty('--reveal-delay', (i * 0.08).toFixed(2) + 's');
          });
        });

        // The gallery is a horizontal auto-scroll loop — reveal its tiles (pronounced,
        // cascading left-to-right) when the strip enters vertical view; tiles scrolled
        // off to the right never intersect the viewport on their own.
        // NOTE: a later script (design-system gallery loop) clones this tile set for
        // the seamless wrap, so reveal the LIVE tiles in the observer below — the
        // clones don't exist yet here and would otherwise stay invisible.
        const gallery = view.querySelector('.cs-gallery');
        (gallery ? [...gallery.querySelectorAll('.cs-ds-tile')] : []).forEach((t, i) => {
          clip(t);
          t.style.setProperty('--reveal-delay', (i * 0.09).toFixed(2) + 's');
        });

        const REVEALABLE = '.reveal, .cs-clip';
        const reduce = matchMedia('(prefers-reduced-motion: reduce)');
        if (reduce.matches || !('IntersectionObserver' in window)) {
          view.querySelectorAll(REVEALABLE).forEach(el => el.classList.add('is-visible'));
          return;
        }
        const onReveal = (entries, obs) => {
          entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
          });
        };
        // Text: needs 15% in view before it fades — reads as intentional.
        const io = new IntersectionObserver(onReveal, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });
        textTargets.forEach(el => io.observe(el));
        // Assets: fire as soon as they enter (threshold ~0). A big asset (a 1090px
        // full-bleed, the 1391px phone stage) can never show 15% of itself in this
        // sticky/pinned layout without half-leaving again, so 0.15 would skip it —
        // a low threshold makes the clip-mask unveil reliable as it scrolls in.
        const assetIo = new IntersectionObserver(onReveal, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
        assetTargets.forEach(el => assetIo.observe(el));

        if (gallery) {
          const gio = new IntersectionObserver((entries, obs) => {
            entries.forEach(e => {
              if (e.isIntersecting) {
                // live query: includes the loop clones created after this script ran
                gallery.querySelectorAll('.cs-ds-tile').forEach(t => t.classList.add('is-visible'));
                obs.disconnect();
              }
            });
          }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
          gio.observe(gallery);
        }

        // Fail-safe for a clip-mask (which defaults to HIDDEN): this page uses a
        // sticky-pinned + smooth-scrolled layout that can make IntersectionObserver
        // miss a large asset — and a missed clip asset would stay invisible forever.
        // A cheap rAF-throttled scroll pass reveals any clip asset that is
        // geometrically in view (getBoundingClientRect is robust to sticky/smooth
        // scroll), so nothing can get stranded. Text stays on the IO above.
        let clipTick = false;
        const clipScrollPass = () => {
          clipTick = false;
          // This view isn't routed in — its clips can't be on screen, and without this
          // bail all four case studies re-query and re-measure their pending clips on
          // every scroll frame of the HOME page. (Their rects read 0 while hidden, so
          // nothing was ever revealed by it either.)
          if (view.hidden) return;
          const pending = view.querySelectorAll('.cs-clip:not(.is-visible)');
          pending.forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.top < innerHeight * 0.9 && r.bottom > 0) el.classList.add('is-visible');
          });
          if (!pending.length) window.removeEventListener('scroll', onClipScroll);
        };
        const onClipScroll = () => {
          if (view.hidden) return;   // don't even schedule a frame for a routed-out view
          if (!clipTick) { clipTick = true; requestAnimationFrame(clipScrollPass); }
        };
        window.addEventListener('scroll', onClipScroll, { passive: true });

        // when the view is routed in (or on a direct #hatcha load), reveal whatever
        // is already on-screen — a pure display:none→shown change may not fire IO.
        // Vertical-only check, so it also catches gallery tiles offset horizontally.
        function revealInView() {
          view.querySelectorAll('.reveal:not(.is-visible), .cs-clip:not(.is-visible)').forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.top < innerHeight * 0.88 && r.bottom > 0) el.classList.add('is-visible');
          });
        }
        window.addEventListener('hashchange', () => {
          if (route.token() === '#hatcha') requestAnimationFrame(revealInView);
        });
        if (route.token() === '#hatcha') requestAnimationFrame(revealInView);
      })();

      // ── Fireflut case study: same two-tier reveal (text .reveal / asset .cs-clip) ──
      (function () {
        const view = document.getElementById('fireflut-view');
        if (!view) return;
        const textTargets = [...view.querySelectorAll(
          '.cs-hero-h, .cs-hero-intro, .cs-meta > div, .cs-rail, .cs-sec-h, .cs-p,' +
          '.cs-ff-role, .cs-ff-eye, .cs-cmp, .cs-ff-prin > div, .cs-ff-swatch > div,' +
          '.cs-ff-micro, .cs-ff-cap, .cs-quote p, .cs-stat,' +
          '.cs-closing-h, .cs-closing-p, .rn-kicker, .rn-title, .rn-desc'
        )];
        // placeholder blocks + the before/after shots are the assets; the hero
        // mockup carries neither class, so it is excluded and its clip never
        // fights the tile→hero view-transition.
        const assetTargets = [...view.querySelectorAll('.cs-ph, .cs-ff-shot')];
        textTargets.forEach(el => el.classList.add('reveal'));
        const clip = el => {
          el.classList.add('cs-clip');
          el.style.setProperty('--clip-round', getComputedStyle(el).borderTopLeftRadius || '0px');
        };
        assetTargets.forEach(clip);
        const targets = [...textTargets, ...assetTargets];
        if (!targets.length) return;

        ['.cs-meta', '.cs-ff-prin', '.cs-ff-swatch', '.cs-stats', '.cs-ff-shots', '.cs-ff-duo', '.cs-ff-trio', '.cs-ff-quad'].forEach(sel => {
          view.querySelectorAll(sel + ' > *').forEach((el, i) => {
            el.style.setProperty('--reveal-delay', (i * 0.08).toFixed(2) + 's');
          });
        });

        const REVEALABLE = '.reveal, .cs-clip';
        const reduce = matchMedia('(prefers-reduced-motion: reduce)');
        if (reduce.matches || !('IntersectionObserver' in window)) {
          view.querySelectorAll(REVEALABLE).forEach(el => el.classList.add('is-visible'));
          return;
        }
        const onReveal = (entries, obs) => {
          entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
          });
        };
        const io = new IntersectionObserver(onReveal, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });
        textTargets.forEach(el => io.observe(el));
        const assetIo = new IntersectionObserver(onReveal, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
        assetTargets.forEach(el => assetIo.observe(el));

        // fail-safe for clip assets (default HIDDEN) — reveal anything geometrically in view
        let clipTick = false;
        const clipScrollPass = () => {
          clipTick = false;
          // This view isn't routed in — its clips can't be on screen, and without this
          // bail all four case studies re-query and re-measure their pending clips on
          // every scroll frame of the HOME page. (Their rects read 0 while hidden, so
          // nothing was ever revealed by it either.)
          if (view.hidden) return;
          const pending = view.querySelectorAll('.cs-clip:not(.is-visible)');
          pending.forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.top < innerHeight * 0.9 && r.bottom > 0) el.classList.add('is-visible');
          });
          if (!pending.length) window.removeEventListener('scroll', onClipScroll);
        };
        const onClipScroll = () => {
          if (view.hidden) return;   // don't even schedule a frame for a routed-out view
          if (!clipTick) { clipTick = true; requestAnimationFrame(clipScrollPass); }
        };
        window.addEventListener('scroll', onClipScroll, { passive: true });

        // the view is display:none until routed in — reveal on-screen items on route/open
        function revealInView() {
          view.querySelectorAll('.reveal:not(.is-visible), .cs-clip:not(.is-visible)').forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.top < innerHeight * 0.88 && r.bottom > 0) el.classList.add('is-visible');
          });
        }
        window.addEventListener('hashchange', () => {
          if (route.token() === '#fireflut') requestAnimationFrame(revealInView);
        });
        if (route.token() === '#fireflut') requestAnimationFrame(revealInView);
      })();

      /* ── READ NEXT · 8s auto-advance ──────────────────────────────────────
         One driver for all four panels. It keys off actual visibility rather
         than deck internals, so the same code covers the desktop cover-slide
         deck, the html.cs-static mobile scroll and the reduced-motion path
         (where the deck bails and the page is a plain document).

         In the deck each section is inset:0 and translated on X, so its
         intersection ratio only reaches ~1 once the panel has swept fully
         into rest — exactly the moment the countdown should start.

         The bar is stamped from a rAF loop rather than a CSS transition: it
         can be reset mid-flight, and a backgrounded tab throttles rAF so the
         countdown stalls on its own without a visibilitychange handler. */
      (function initReadNextAdvance() {
        const panels = Array.from(document.querySelectorAll('[data-readnext]'));
        if (!panels.length) return;
        const DUR = 8000;

        /* Nothing may auto-advance until the reader has moved the page at least
           once. Two reasons: deep-linking to a case study shouldn't start a
           countdown on a panel nobody has reached, and a deck that lays out while
           its view is still hidden measures 0 and momentarily leaves every section
           untransformed at inset:0 — which reads as a full-frame intersection. */
        let engaged = false;
        const engage = () => { engaged = true; };
        ['wheel', 'keydown', 'touchstart', 'pointerdown', 'scroll']
          .forEach(t => addEventListener(t, engage, { passive: true, once: true }));

        const armed = [];   // panels the observer says are on screen

        panels.forEach(el => {
          const view = el.closest('[id$="-view"]');
          const hash = view ? '#' + view.id.replace(/-view$/, '') : null;
          const fill = el.querySelector('.rn-bar-fill');
          const vids = Array.from(el.querySelectorAll('video'));
          const p = { el, fill, vids, raf: 0, t0: 0, on: false, lastCheck: 0, resting: false, sec: null };

          /* Re-checked while armed — but polled at ~15Hz, not per frame: the rect
             read + width test forces style/layout work, and running it on every
             frame of the deck's 1s snap tween was a per-frame reflow. A ≤66ms
             start/cancel delay is invisible on an 8s countdown. The panel must
             really be visible and really filling the frame: in the deck a section
             grows from scale 0.5 as it sweeps in, so the width test keeps the
             clock from starting until it has come to rest at full size. */
          p.atRest = () => {
            if (!engaged || !view || view.hidden || route.token() !== hash) return false;
            // the deck engine toggles inline visibility on the panel — read that
            // instead of getComputedStyle (no style recalc). Resolved LAZILY and
            // re-tried while null: the deck enhancer adds .cs-slide-sec AFTER this
            // IIFE runs, so a parse-time closest() finds nothing and the guard
            // silently disappears — deck panels are inset:0 (always full-frame
            // rects), and without this check the countdown runs from route entry
            // and yanks the reader to the next case study mid-scroll. No deck
            // (mobile, reduced-motion) → stays null → visible, matching before.
            if (!p.sec) p.sec = el.closest('.cs-slide-sec');
            if (p.sec && p.sec.style.visibility === 'hidden') return false;
            const b = el.getBoundingClientRect(), w = innerWidth, h = innerHeight;
            if (b.width < w * 0.9) return false;
            const vis = Math.max(0, Math.min(b.right, w) - Math.max(b.left, 0)) *
                        Math.max(0, Math.min(b.bottom, h) - Math.max(b.top, 0));
            return vis >= w * h * 0.9;
          };

          p.reset = () => {
            p.t0 = 0;
            if (p.fill && p.fill.style.transform !== 'scaleX(0)') p.fill.style.transform = 'scaleX(0)';
          };

          p.cancel = () => {
            p.on = false;
            if (p.raf) { cancelAnimationFrame(p.raf); p.raf = 0; }
            p.reset();
            const i = armed.indexOf(p); if (i > -1) armed.splice(i, 1);
          };

          p.arm = () => {
            if (p.on) return;
            p.on = true;
            if (armed.indexOf(p) === -1) armed.push(p);
            p.t0 = 0;
            p.lastCheck = 0; p.resting = false;   // force an immediate first check
            p.raf = requestAnimationFrame(function step(now) {
              p.raf = 0;
              if (!p.on) return;
              // hold at zero until the panel has actually settled (15Hz poll)
              if (now - p.lastCheck >= 66) { p.lastCheck = now; p.resting = p.atRest(); }
              if (!p.resting) { p.reset(); p.raf = requestAnimationFrame(step); return; }
              if (!p.t0) p.t0 = now;
              const k = Math.min(1, (now - p.t0) / DUR);
              if (p.fill) p.fill.style.transform = 'scaleX(' + k.toFixed(4) + ')';
              if (k < 1) { p.raf = requestAnimationFrame(step); return; }
              p.cancel();
              // hand off through the hero transition so the timer running out lands
              // exactly like a click on the asset does (it falls back to a plain
              // hash set when the transition can't run)
              if (window.rtHero) window.rtHero.open(el.dataset.next, el.querySelector('.rn-asset'));
              else route.go(el.dataset.next);
            });
          };

          new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting && entry.intersectionRatio >= 0.98) {
                p.vids.forEach(v => v.play().catch(() => {}));
                p.arm();
              } else {
                p.vids.forEach(v => { if (!v.paused) v.pause(); });
                p.cancel();
              }
            });
          }, { threshold: [0, 0.98, 1] }).observe(el);

          // a click is the reader taking over — don't race them to the same place
          el.addEventListener('click', p.cancel);
        });

        /* The IO ratio won't drop until the deck's 1000ms snap tween is well
           underway, so back-gestures cancel immediately instead of waiting. */
        const cancelAll = () => { for (let i = armed.length - 1; i >= 0; i--) armed[i].cancel(); };
        addEventListener('wheel', (e) => { if (armed.length && e.deltaY < 0) cancelAll(); }, { passive: true });
        addEventListener('keydown', (e) => {
          if (armed.length && /^(ArrowUp|PageUp|Home)$/.test(e.key)) cancelAll();
        });
        let tY = null;
        addEventListener('touchstart', (e) => { tY = e.touches[0].clientY; }, { passive: true });
        addEventListener('touchend', (e) => {
          if (armed.length && tY !== null && e.changedTouches[0].clientY - tY > 24) cancelAll();
          tY = null;
        }, { passive: true });
        addEventListener('hashchange', cancelAll);
      })();

      // ── Fireflut · section cover-slide (pinned choreography, scoped) ──
      (function () {
        const view = document.getElementById('fireflut-view');
        if (!view) return;
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (document.documentElement.classList.contains('cs-static')) return;
        const page = view.querySelector('.cs-page');
        if (!page) return;
        const sections = [...page.children].filter(el => el.classList.contains('cs-band'));
        if (sections.length < 2) return;

        const scroller = document.createElement('div');
        scroller.className = 'cs-slide-scroller';
        const stage = document.createElement('div');
        stage.className = 'cs-slide-stage';
        scroller.appendChild(stage);
        page.insertBefore(scroller, sections[0]);

        const secs = sections.map((sec, i) => {
          const inner = document.createElement('div');
          inner.className = 'cs-slide-inner';
          while (sec.firstChild) inner.appendChild(sec.firstChild);
          sec.appendChild(inner);
          sec.classList.add('cs-slide-sec');
          if (i > 0) sec.classList.add('cv');              // hero (base) has no slide-in
          sec.style.zIndex = String(i + 1);
          stage.appendChild(sec);
          return { el: sec, inner, videos: [...sec.querySelectorAll('video')], live: true, tx: -1, ty: -1 };
        });

        // the slide + read motion replaces the per-element reveal, so show all up front
        view.querySelectorAll('.reveal, .cs-clip').forEach(el => el.classList.add('is-visible'));

        const n = secs.length;
        const ease = t => 1 - Math.pow(1 - t, 3);
        const SL_FACTOR = 0.6;                 // sweep distance in viewports (~one gesture)
        const DW_FACTOR = 0.5;                 // dwell before the next section sweeps in
        const ENTER_SCALE = 0.5;               // incoming panel grows from 50% → 100% as it comes to rest (no tilt)
        let marks = [], V = 0;
        // ── snap-deck state: one wheel/key/swipe gesture advances exactly one panel ──
        let stops = [], curStop = 0, deckAnimating = false, deckRaf = 0, deckCooldown = false, wheelIdleTimer = 0, wheelMaxTimer = 0, tStartY = null;
        // stops is NOT 1:1 with panels (a taller-than-viewport panel adds a second stop),
        // so the pager needs panel index -> stop index to land a jump on the right panel
        const stopOfSec = [];

        function layout() {
          V = window.innerHeight;
          if (!V || view.hidden) return;
          const SL = Math.round(V * SL_FACTOR);
          const DW = Math.round(V * DW_FACTOR);
          let t = 0; marks = [];
          secs.forEach((s, i) => {
            const readH = Math.max(0, s.inner.scrollHeight - V);
            const readStart = t; t += readH; const readEnd = t;
            let slideStart = null, slideEnd = null;
            if (i < n - 1) {
              t += DW;
              slideStart = t; t += SL;
              slideEnd = t;
            }
            marks.push({ readStart, readEnd, readH, slideStart, slideEnd });
          });
          scroller.style.height = (t + V) + 'px';
          // deck stops: each panel's flat rest, PLUS an extra stop after any vertical read-scroll
          // region (e.g. the hero image reveal). So the first gesture scrolls the hero vertically
          // to its end, and only the NEXT gesture slides the following panel in horizontally —
          // the two motions no longer collide in one scroll.
          stops = [];
          secs.forEach((sec, i) => {
            stopOfSec[i] = stops.length;
            stops.push(i === 0 ? 0 : marks[i - 1].slideEnd);        // section fully arrived (top of its content)
            if (marks[i].readH > 0) stops.push(marks[i].readEnd);   // extra stop after reading a taller-than-viewport section
          });
          readTarget(); renderS = targetS; render(renderS);
        }

        // ── section pager ──
        // Which panel "owns" a scroll offset, and how far through it we are. The flip
        // happens at the MIDPOINT of the sweep, so the tick changes exactly when the
        // incoming panel visually takes over — not when it starts moving or lands.
        const midOf = i => i === 0 ? 0 : (marks[i - 1].slideStart + marks[i - 1].slideEnd) / 2;
        function activeAt(s) {
          let i = 0;
          for (let k = 1; k < n; k++) { if (s >= midOf(k)) i = k; else break; }
          return i;
        }
        const pager = csPager({ view, sections, goTo: i => goToStop(stopOfSec[i] || 0) });
        // render is a hoisted declaration, so this rebinding is live for every caller —
        // it keeps the pager in step without threading a call through the render body
        const drawPanels = render;
        render = function (s) {
          drawPanels(s);
          if (marks.length) pager.sync(activeAt(s));
        };

        let targetS = 0, renderS = 0, raf = 0;
        function readTarget() { targetS = Math.max(0, -scroller.getBoundingClientRect().top); }
        function frame() {
          // scroller rect is read HERE, at rAF time — reading it in the raw scroll
          // event fired several times a frame and forced synchronous layout each time
          readTarget();
          const diff = targetS - renderS;
          if (Math.abs(diff) < 0.4) { renderS = targetS; raf = 0; render(renderS); return; }
          renderS += diff * 0.22;
          render(renderS);
          raf = requestAnimationFrame(frame);
        }

        function render(s) {
          if (!marks.length) return;
          secs.forEach((sec, i) => {
            const m = marks[i];
            const liveStart = i === 0 ? -Infinity : marks[i - 1].slideStart - V;
            const liveEnd = i === n - 1 ? Infinity : m.slideEnd + V * 0.5;
            const live = s >= liveStart && s <= liveEnd;
            if (live !== sec.live) {
              sec.live = live;
              sec.el.style.visibility = live ? 'visible' : 'hidden';
              // promote only live panels — a static will-change on every panel held
              // ~2 full-viewport GPU layers per section for the whole session
              sec.el.style.willChange = live ? 'transform' : '';
              sec.inner.style.willChange = live ? 'transform' : '';
              if (live) sec.videos.forEach(v => v.play().catch(() => {}));
            }
            if (!live) {
              sec.videos.forEach(v => { if (!v.paused) v.pause(); });
              return;
            }
            const ty = s <= m.readStart ? 0 : s >= m.readEnd ? m.readH : (s - m.readStart);
            let tx = 0;
            if (i > 0) {
              const pm = marks[i - 1];
              if (s <= pm.slideStart) tx = 100;
              else if (s >= pm.slideEnd) tx = 0;
              else tx = (1 - ease((s - pm.slideStart) / (pm.slideEnd - pm.slideStart))) * 100;
            }
            if (tx !== sec.tx) {
              const p = tx / 100;                       // 1 = entering (off right), 0 = landed
              // grow-to-rest: incoming panel scales from ENTER_SCALE (50%) up to 100% as it lands,
              // coupled to the sweep so it reaches full size exactly when it comes to rest. No tilt.
              const sc = (1 - p * (1 - ENTER_SCALE)).toFixed(4);
              sec.el.style.transform = 'translate3d(' + tx + '%,0,0) scale(' + sc + ')';
              sec.tx = tx;
            }
            if (ty !== sec.ty) { sec.inner.style.transform = 'translate3d(0,' + (-ty) + 'px,0)'; sec.ty = ty; }
          });
        }

        // view.hidden: the four case-study decks all listen on window, so without this
        // each one measured its scroller on every scroll frame of every other page.
        const onScroll = () => { if (deckAnimating || view.hidden) return; if (!raf) raf = requestAnimationFrame(frame); };
        window.addEventListener('scroll', onScroll, { passive: true });

        // ── snap deck: each gesture tweens render() to the next panel's rest offset over a fixed
        // duration (the rolodex flip plays during the tween), keeping native scroll in sync
        // (instant, to dodge the site's CSS smooth-scroll). Free scrollbar drag still works. ──
        function scrollerTop() { return scroller.getBoundingClientRect().top + window.scrollY; }
        function nearestStop(v) { let b = 0, bd = Infinity; for (let i = 0; i < stops.length; i++) { const d = Math.abs(stops[i] - v); if (d < bd) { bd = d; b = i; } } return b; }
        function goToStop(i) {
          if (!stops.length) return;
          i = Math.max(0, Math.min(stops.length - 1, i));
          curStop = i;
          const O = scrollerTop(), startY = window.scrollY, endY = O + stops[i], t0 = performance.now(), DUR = 1000;
          deckAnimating = true;
          if (raf) { cancelAnimationFrame(raf); raf = 0; }
          if (deckRaf) cancelAnimationFrame(deckRaf);
          (function step(now) {
            const k = Math.min(1, (now - t0) / DUR);
            const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;   // easeInOutCubic — smooth start + settle
            const y = startY + (endY - startY) * e;
            window.scrollTo({ top: y, behavior: 'instant' });
            renderS = Math.max(0, y - O); render(renderS);
            if (k < 1) deckRaf = requestAnimationFrame(step);
            else { renderS = Math.max(0, endY - O); targetS = renderS; render(renderS); deckAnimating = false; }
          })(performance.now());
          // watchdog: if rAF stalls (throttled/background tab), force-finish so the deck never locks
          setTimeout(() => { if (deckAnimating && curStop === i) { renderS = Math.max(0, endY - O); targetS = renderS; window.scrollTo({ top: endY, behavior: 'instant' }); render(renderS); deckAnimating = false; } }, DUR + 300);
        }
        const deckActive = () => !view.hidden && route.token() === '#fireflut' && stops.length > 1;
        const inModal = (el) => el && el.closest && el.closest('.contact-drawer, .contact-scrim, .pgf-lightbox');
        function deckStep(dir) { if (!deckAnimating) goToStop(nearestStop(renderS) + dir); }
        window.addEventListener('wheel', (e) => {
          if (!deckActive() || e.ctrlKey || inModal(e.target)) return;
          e.preventDefault();
          if (Math.abs(e.deltaY) < 4) return;                 // drop the tiny trackpad-inertia tail
          // Idle unlock: fast release once events stop (discrete mouse notches / distinct swipes).
          clearTimeout(wheelIdleTimer);
          wheelIdleTimer = setTimeout(() => { deckCooldown = false; clearTimeout(wheelMaxTimer); }, 160);
          if (deckCooldown || deckAnimating) return;
          deckCooldown = true;
          // Hard max unlock (set once, NOT reset by events): a trackpad's near-continuous stream
          // would keep resetting the idle timer forever and lock the deck — this guarantees release.
          clearTimeout(wheelMaxTimer);
          wheelMaxTimer = setTimeout(() => { deckCooldown = false; }, 1400);
          deckStep(e.deltaY > 0 ? 1 : -1);
        }, { passive: false });
        window.addEventListener('keydown', (e) => {
          if (!deckActive()) return;
          const tag = (document.activeElement && document.activeElement.tagName) || '';
          if (/^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(tag)) return;
          let d = 0;
          if (e.key === 'ArrowDown' || e.key === 'PageDown') d = 1;
          else if (e.key === 'ArrowUp' || e.key === 'PageUp') d = -1;
          else if (e.key === 'Home') { e.preventDefault(); goToStop(0); return; }
          else if (e.key === 'End') { e.preventDefault(); goToStop(stops.length - 1); return; }
          if (!d) return;
          e.preventDefault(); deckStep(d);
        });
        window.addEventListener('touchstart', (e) => { tStartY = (deckActive() && !inModal(e.target)) ? e.touches[0].clientY : null; }, { passive: true });
        window.addEventListener('touchmove', (e) => { if (deckActive() && tStartY !== null) e.preventDefault(); }, { passive: false });
        window.addEventListener('touchend', (e) => {
          if (!deckActive() || tStartY === null) return;
          const dy = tStartY - e.changedTouches[0].clientY; tStartY = null;
          if (Math.abs(dy) >= 36) deckStep(dy > 0 ? 1 : -1);
        }, { passive: true });

        let rzT = 0; window.addEventListener('resize', () => { clearTimeout(rzT); rzT = setTimeout(layout, 120); });
        window.addEventListener('load', layout);
        new MutationObserver(() => { if (!view.hidden) { curStop = 0; requestAnimationFrame(layout); } })
          .observe(view, { attributes: true, attributeFilter: ['hidden'] });
        view.querySelectorAll('img, video').forEach(m => {
          m.addEventListener('load', layout);
          m.addEventListener('loadedmetadata', layout);
        });
        if (route.token() === '#fireflut') requestAnimationFrame(layout);
        layout();
      })();
      csPagerStatic('fireflut-view');

      // ── Case-study section pager (shared by the four decks) ──────────────────
      // A bottom bar of ticks, one per CHAPTER, that jumps the deck to a chapter and
      // shows "Section 02 | The Problem" on hover. Chapters are derived from the DOM,
      // so no case-study markup changes: a band carrying .cs-ledger-num + .cs-ledger-eye
      // opens a new chapter and every unlabelled band after it (media, quote, device
      // shots) folds into that chapter. The hero, closing and read-next slides get
      // their own unnumbered chapters.
      //
      // Overrides, for case studies the derivation gets wrong:
      //   data-pager="Label"  force a chapter break here with this label
      //   data-pager-skip     never break here; fold into the chapter above
      //   opts.renumber       ignore the DOM numbers, number chapters 01..N in order
      //                       (Jumpable's ledger skips 03/04)
      //
      // opts: { view, sections, goTo(panelIndex), renumber? }  →  { sync(panel, frac) }
      // goTo is the deck's own jump primitive, so the pager adds no scroll code of its
      // own; the reduced-motion / no-deck path passes a scrollIntoView-based goTo.
      function csPager(opts) {
        const view = opts.view, sections = opts.sections;
        if (!view || !sections || sections.length < 2) return { sync: function () {} };
        // html.cs-static is the site's one mobile decision, taken at load with a
        // clientWidth/screen.width fallback because innerWidth can read 0 before first
        // layout — re-deriving the width here would reintroduce exactly that bug.
        if (document.documentElement.classList.contains('cs-static')) return { sync: function () {} };
        if (!matchMedia('(hover: hover)').matches) return { sync: function () {} };

        // ── derive chapters ──
        const chapters = [];
        sections.forEach(function (sec, i) {
          const forced = sec.dataset ? sec.dataset.pager : null;
          const numEl = sec.querySelector('.cs-ledger-num');
          const eyeEl = sec.querySelector('.cs-ledger-eye');
          const skip = sec.dataset && sec.dataset.pagerSkip !== undefined;
          let label = null, num = null;
          if (!skip) {
            if (forced) label = forced;
            else if (numEl && eyeEl) { num = numEl.textContent.trim(); label = eyeEl.textContent.trim(); }
            else if (sec.classList.contains('cs-hero')) label = 'Overview';
            // .cs-cta is Existence's closing slide ("Reach out to know more") — same
            // structural beat as .cs-closing elsewhere, just a different class, so it
            // gets its own chapter rather than folding into the outcome above it
            else if (sec.classList.contains('cs-closing') || sec.classList.contains('cs-cta')) label = 'Closing';
            else if (sec.hasAttribute('data-readnext')) label = 'Read next';
          }
          if (label && (chapters.length || i === 0)) chapters.push({ label: label, num: num, first: i, count: 1 });
          else if (chapters.length) chapters[chapters.length - 1].count++;
          else chapters.push({ label: 'Overview', num: null, first: i, count: 1 });   // no label on the first band
        });
        if (chapters.length < 2) return { sync: function () {} };
        if (opts.renumber) {
          let k = 0;
          chapters.forEach(function (c) { if (c.num !== null) c.num = String(++k).padStart(2, '0'); });
        }

        // panel index → chapter index, resolved once
        const chapterOf = [];
        chapters.forEach(function (c, ci) { for (let p = c.first; p < c.first + c.count; p++) chapterOf[p] = ci; });

        // ── build ──
        const bar = document.createElement('nav');
        bar.className = 'cs-pager';
        bar.setAttribute('aria-label', 'Case study sections');
        const pill = document.createElement('div');
        pill.className = 'cs-pg-pill';
        pill.setAttribute('aria-hidden', 'true');
        pill.innerHTML = '<span class="cs-pg-num"></span><span class="cs-pg-rule"></span><span class="cs-pg-lab"></span>';
        const pillNum = pill.querySelector('.cs-pg-num'), pillLab = pill.querySelector('.cs-pg-lab');
        bar.appendChild(pill);

        const total = sections.length;
        const ticks = chapters.map(function (c, ci) {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'cs-pg-t';
          b.setAttribute('aria-label', (c.num ? 'Section ' + c.num + ' — ' : '') + c.label);
          b.innerHTML = '<i class="cs-pg-f"></i>';
          b.addEventListener('click', function () { opts.goTo(c.first); });
          b.addEventListener('pointerenter', function () { showPill(ci); });
          b.addEventListener('focus', function () { showPill(ci); });
          bar.appendChild(b);
          return { el: b, fill: b.querySelector('.cs-pg-f'), f: -1 };
        });
        bar.addEventListener('pointerleave', hidePill);
        bar.addEventListener('focusout', function (e) { if (!bar.contains(e.relatedTarget)) hidePill(); });
        view.appendChild(bar);

        function showPill(ci) {
          const c = chapters[ci];
          pillNum.textContent = c.num ? 'Section ' + c.num : '';
          pillLab.textContent = c.label;
          pill.classList.toggle('bare', !c.num);
          // a pill that's currently hidden is parked at the last tick it showed on, so
          // place it with transitions off — otherwise it glides in from there while
          // fading up. Once visible, the glide between ticks is the point.
          const wasOn = pill.classList.contains('on');
          if (!wasOn) pill.style.transition = 'none';
          // measure AFTER the text is in, so the width is this chapter's, not the last
          // one's. offsetLeft rather than a rect: both it and the pill's left:0 resolve
          // against the bar's padding box, so they stay in the same coordinate space.
          const t = ticks[ci].el, w = pill.offsetWidth;
          const px = t.offsetLeft + t.offsetWidth / 2 - w / 2;
          // the bar is centred and narrow, so clamp against the VIEWPORT rather than the
          // bar — end pills then overhang the row a little instead of jumping inward
          const originX = bar.getBoundingClientRect().left;
          const vw = document.documentElement.clientWidth || window.innerWidth;
          const lo = 16 - originX, hi = vw - 16 - w - originX;
          pill.style.setProperty('--px', Math.max(lo, Math.min(px, hi)).toFixed(1) + 'px');
          if (!wasOn) { void pill.offsetWidth; pill.style.transition = ''; }
          pill.classList.add('on');
        }
        function hidePill() { pill.classList.remove('on'); }

        // Is the panel behind the bar dark? Read from the panel's COMPUTED background,
        // not its .cream/.dark class: some panels (cs-logoband) carry neither, some are
        // transparent and inherit .cs-page's, and reading the computed value means night
        // mode — which repaints every band — is handled with no theme test at all.
        // A panel whose bar strip is full-bleed media rather than a flat colour can't be
        // read this way and declares itself with data-pager-nav, the same escape hatch
        // the nav's own contrast pass uses.
        function isDarkUnder(sec) {
          const forced = sec.dataset && sec.dataset.pagerNav;
          if (forced) return forced === 'dark';
          const lin = function (c) { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
          for (let el = sec; el && el !== document.documentElement; el = el.parentElement) {
            const m = getComputedStyle(el).backgroundColor.match(/rgba?\(([^)]+)\)/);
            if (!m) continue;
            const q = m[1].split(',').map(parseFloat);
            if (q[3] !== undefined && q[3] < 0.5) continue;          // see-through: keep walking up
            return (0.2126 * lin(q[0]) + 0.7152 * lin(q[1]) + 0.0722 * lin(q[2])) < 0.4;
          }
          return false;
        }

        // ── active state ──
        // panel = the panel now at rest. Writes are change-guarded: sync runs on every
        // deck frame, but only touches the DOM when a value actually moved.
        let lastCh = -1, lastDark = null, lastPanel = 0;
        function sync(panel) {
          const ci = chapterOf[Math.max(0, Math.min(total - 1, panel | 0))];
          if (ci === undefined) return;
          const c = chapters[ci];
          // slides REACHED, not slides completed: on slide 3 of 3 the rectangle is full,
          // rather than sitting at 2/3 and implying there is more of the chapter to come.
          // A one-slide chapter is 1/1, so it fills solid with no special case.
          const within = (panel - c.first + 1) / c.count;
          for (let i = 0; i < ticks.length; i++) {
            const f = i < ci ? 1 : i > ci ? 0 : Math.max(0, Math.min(1, within));
            if (Math.abs(f - ticks[i].f) > 0.004) { ticks[i].fill.style.setProperty('--f', f.toFixed(3)); ticks[i].f = f; }
          }
          if (ci !== lastCh) {
            if (lastCh >= 0) ticks[lastCh].el.removeAttribute('aria-current');
            ticks[ci].el.setAttribute('aria-current', 'true');
            lastCh = ci;
          }
          lastPanel = panel;
          const dark = isDarkUnder(sections[panel]);
          if (dark !== lastDark) {
            bar.classList.toggle('on-dark', dark);
            bar.classList.toggle('on-light', !dark);
            lastDark = dark;
          }
        }
        // the theme toggle doesn't move the deck, so re-run the polarity check on it
        new MutationObserver(function () { lastDark = null; sync(lastPanel); })
          .observe(document.body, { attributes: true, attributeFilter: ['class'] });

        sync(0);
        return { sync: sync };
      }

      // Reduced-motion desktop: the deck bails, so the panels are plain document flow
      // and there'd be no pager at all. Same bar, jumping with scrollIntoView and
      // tracking the active panel with an observer instead of the deck's own offsets.
      function csPagerStatic(viewId) {
        if (!matchMedia('(prefers-reduced-motion: reduce)').matches) return;   // the deck ran; it owns the pager
        const view = document.getElementById(viewId);
        const page = view && view.querySelector('.cs-page');
        if (!page) return;
        const sections = [...page.children].filter(el => el.classList.contains('cs-band'));
        const pager = csPager({
          view, sections,
          goTo: i => sections[i].scrollIntoView({ behavior: 'auto', block: 'start' })
        });
        const io = new IntersectionObserver(es => {
          es.forEach(e => { if (e.isIntersecting) pager.sync(sections.indexOf(e.target)); });
        }, { threshold: 0.55 });
        sections.forEach(s => io.observe(s));
      }

      // ── Hatcha · section cover-slide (pinned choreography, scoped) ──
      (function () {
        const view = document.getElementById('hatcha-view');
        if (!view) return;
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (document.documentElement.classList.contains('cs-static')) return;
        const page = view.querySelector('.cs-page');
        if (!page) return;
        const sections = [...page.children].filter(el => el.classList.contains('cs-band'));
        if (sections.length < 2) return;

        const scroller = document.createElement('div');
        scroller.className = 'cs-slide-scroller';
        const stage = document.createElement('div');
        stage.className = 'cs-slide-stage';
        scroller.appendChild(stage);
        page.insertBefore(scroller, sections[0]);

        const secs = sections.map((sec, i) => {
          const inner = document.createElement('div');
          inner.className = 'cs-slide-inner';
          while (sec.firstChild) inner.appendChild(sec.firstChild);
          sec.appendChild(inner);
          sec.classList.add('cs-slide-sec');
          if (i > 0) sec.classList.add('cv');              // hero (base) has no slide-in
          sec.style.zIndex = String(i + 1);
          stage.appendChild(sec);
          return { el: sec, inner, videos: [...sec.querySelectorAll('video')], live: true, tx: -1, ty: -1 };
        });

        // the slide + read motion replaces the per-element reveal, so show all up front
        view.querySelectorAll('.reveal, .cs-clip').forEach(el => el.classList.add('is-visible'));

        const n = secs.length;
        const ease = t => 1 - Math.pow(1 - t, 3);
        const SL_FACTOR = 0.6;                 // sweep distance in viewports (~one gesture)
        const DW_FACTOR = 0.5;                 // dwell before the next section sweeps in
        const ENTER_SCALE = 0.5;               // incoming panel grows from 50% → 100% as it comes to rest (no tilt)
        let marks = [], V = 0;
        // ── snap-deck state: one wheel/key/swipe gesture advances exactly one panel ──
        let stops = [], curStop = 0, deckAnimating = false, deckRaf = 0, deckCooldown = false, wheelIdleTimer = 0, wheelMaxTimer = 0, tStartY = null;
        // stops is NOT 1:1 with panels (a taller-than-viewport panel adds a second stop),
        // so the pager needs panel index → stop index to land a jump on the right panel
        const stopOfSec = [];

        function layout() {
          V = window.innerHeight;
          if (!V || view.hidden) return;
          const SL = Math.round(V * SL_FACTOR);
          const DW = Math.round(V * DW_FACTOR);
          let t = 0; marks = [];
          secs.forEach((s, i) => {
            const readH = Math.max(0, s.inner.scrollHeight - V);
            const readStart = t; t += readH; const readEnd = t;
            let slideStart = null, slideEnd = null;
            if (i < n - 1) {
              t += DW;
              slideStart = t; t += SL;
              slideEnd = t;
            }
            marks.push({ readStart, readEnd, readH, slideStart, slideEnd });
          });
          scroller.style.height = (t + V) + 'px';
          // deck stops: each panel's flat rest, PLUS an extra stop after any vertical read-scroll
          // region (e.g. the hero image reveal). So the first gesture scrolls the hero vertically
          // to its end, and only the NEXT gesture slides the following panel in horizontally —
          // the two motions no longer collide in one scroll.
          stops = [];
          secs.forEach((sec, i) => {
            stopOfSec[i] = stops.length;
            stops.push(i === 0 ? 0 : marks[i - 1].slideEnd);        // section fully arrived (top of its content)
            if (marks[i].readH > 0) stops.push(marks[i].readEnd);   // extra stop after reading a taller-than-viewport section
          });
          readTarget(); renderS = targetS; render(renderS);
        }

        // ── section pager ──
        // Which panel "owns" a scroll offset, and how far through it we are. The flip
        // happens at the MIDPOINT of the sweep, so the tick changes exactly when the
        // incoming panel visually takes over — not when it starts moving or lands.
        const midOf = i => i === 0 ? 0 : (marks[i - 1].slideStart + marks[i - 1].slideEnd) / 2;
        function activeAt(s) {
          let i = 0;
          for (let k = 1; k < n; k++) { if (s >= midOf(k)) i = k; else break; }
          return i;
        }
        const pager = csPager({ view, sections, goTo: i => goToStop(stopOfSec[i] || 0) });
        // render is a hoisted declaration, so this rebinding is live for every caller —
        // it keeps the pager in step without threading a call through the render body
        const drawPanels = render;
        render = function (s) {
          drawPanels(s);
          if (marks.length) pager.sync(activeAt(s));
        };

        let targetS = 0, renderS = 0, raf = 0;
        function readTarget() { targetS = Math.max(0, -scroller.getBoundingClientRect().top); }
        function frame() {
          // scroller rect is read HERE, at rAF time — reading it in the raw scroll
          // event fired several times a frame and forced synchronous layout each time
          readTarget();
          const diff = targetS - renderS;
          if (Math.abs(diff) < 0.4) { renderS = targetS; raf = 0; render(renderS); return; }
          renderS += diff * 0.22;
          render(renderS);
          raf = requestAnimationFrame(frame);
        }

        function render(s) {
          if (!marks.length) return;
          secs.forEach((sec, i) => {
            const m = marks[i];
            const liveStart = i === 0 ? -Infinity : marks[i - 1].slideStart - V;
            const liveEnd = i === n - 1 ? Infinity : m.slideEnd + V * 0.5;
            const live = s >= liveStart && s <= liveEnd;
            if (live !== sec.live) {
              sec.live = live;
              sec.el.style.visibility = live ? 'visible' : 'hidden';
              // promote only live panels — a static will-change on every panel held
              // ~2 full-viewport GPU layers per section for the whole session
              sec.el.style.willChange = live ? 'transform' : '';
              sec.inner.style.willChange = live ? 'transform' : '';
              if (live) sec.videos.forEach(v => v.play().catch(() => {}));
            }
            if (!live) {
              sec.videos.forEach(v => { if (!v.paused) v.pause(); });
              return;
            }
            const ty = s <= m.readStart ? 0 : s >= m.readEnd ? m.readH : (s - m.readStart);
            let tx = 0;
            if (i > 0) {
              const pm = marks[i - 1];
              if (s <= pm.slideStart) tx = 100;
              else if (s >= pm.slideEnd) tx = 0;
              else tx = (1 - ease((s - pm.slideStart) / (pm.slideEnd - pm.slideStart))) * 100;
            }
            if (tx !== sec.tx) {
              const p = tx / 100;                       // 1 = entering (off right), 0 = landed
              // grow-to-rest: incoming panel scales from ENTER_SCALE (50%) up to 100% as it lands,
              // coupled to the sweep so it reaches full size exactly when it comes to rest. No tilt.
              const sc = (1 - p * (1 - ENTER_SCALE)).toFixed(4);
              sec.el.style.transform = 'translate3d(' + tx + '%,0,0) scale(' + sc + ')';
              sec.tx = tx;
            }
            if (ty !== sec.ty) { sec.inner.style.transform = 'translate3d(0,' + (-ty) + 'px,0)'; sec.ty = ty; }
          });
        }

        // view.hidden: the four case-study decks all listen on window, so without this
        // each one measured its scroller on every scroll frame of every other page.
        const onScroll = () => { if (deckAnimating || view.hidden) return; if (!raf) raf = requestAnimationFrame(frame); };
        window.addEventListener('scroll', onScroll, { passive: true });

        // ── snap deck: each gesture tweens render() to the next panel's rest offset over a fixed
        // duration (the rolodex flip plays during the tween), keeping native scroll in sync
        // (instant, to dodge the site's CSS smooth-scroll). Free scrollbar drag still works. ──
        function scrollerTop() { return scroller.getBoundingClientRect().top + window.scrollY; }
        function nearestStop(v) { let b = 0, bd = Infinity; for (let i = 0; i < stops.length; i++) { const d = Math.abs(stops[i] - v); if (d < bd) { bd = d; b = i; } } return b; }
        function goToStop(i) {
          if (!stops.length) return;
          i = Math.max(0, Math.min(stops.length - 1, i));
          curStop = i;
          const O = scrollerTop(), startY = window.scrollY, endY = O + stops[i], t0 = performance.now(), DUR = 1000;
          deckAnimating = true;
          if (raf) { cancelAnimationFrame(raf); raf = 0; }
          if (deckRaf) cancelAnimationFrame(deckRaf);
          (function step(now) {
            const k = Math.min(1, (now - t0) / DUR);
            const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;   // easeInOutCubic — smooth start + settle
            const y = startY + (endY - startY) * e;
            window.scrollTo({ top: y, behavior: 'instant' });
            renderS = Math.max(0, y - O); render(renderS);
            if (k < 1) deckRaf = requestAnimationFrame(step);
            else { renderS = Math.max(0, endY - O); targetS = renderS; render(renderS); deckAnimating = false; }
          })(performance.now());
          // watchdog: if rAF stalls (throttled/background tab), force-finish so the deck never locks
          setTimeout(() => { if (deckAnimating && curStop === i) { renderS = Math.max(0, endY - O); targetS = renderS; window.scrollTo({ top: endY, behavior: 'instant' }); render(renderS); deckAnimating = false; } }, DUR + 300);
        }
        const deckActive = () => !view.hidden && route.token() === '#hatcha' && stops.length > 1;
        const inModal = (el) => el && el.closest && el.closest('.contact-drawer, .contact-scrim, .pgf-lightbox');
        function deckStep(dir) { if (!deckAnimating) goToStop(nearestStop(renderS) + dir); }
        window.addEventListener('wheel', (e) => {
          if (!deckActive() || e.ctrlKey || inModal(e.target)) return;
          e.preventDefault();
          if (Math.abs(e.deltaY) < 4) return;                 // drop the tiny trackpad-inertia tail
          // Idle unlock: fast release once events stop (discrete mouse notches / distinct swipes).
          clearTimeout(wheelIdleTimer);
          wheelIdleTimer = setTimeout(() => { deckCooldown = false; clearTimeout(wheelMaxTimer); }, 160);
          if (deckCooldown || deckAnimating) return;
          deckCooldown = true;
          // Hard max unlock (set once, NOT reset by events): a trackpad's near-continuous stream
          // would keep resetting the idle timer forever and lock the deck — this guarantees release.
          clearTimeout(wheelMaxTimer);
          wheelMaxTimer = setTimeout(() => { deckCooldown = false; }, 1400);
          deckStep(e.deltaY > 0 ? 1 : -1);
        }, { passive: false });
        window.addEventListener('keydown', (e) => {
          if (!deckActive()) return;
          const tag = (document.activeElement && document.activeElement.tagName) || '';
          if (/^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(tag)) return;
          let d = 0;
          if (e.key === 'ArrowDown' || e.key === 'PageDown') d = 1;
          else if (e.key === 'ArrowUp' || e.key === 'PageUp') d = -1;
          else if (e.key === 'Home') { e.preventDefault(); goToStop(0); return; }
          else if (e.key === 'End') { e.preventDefault(); goToStop(stops.length - 1); return; }
          if (!d) return;
          e.preventDefault(); deckStep(d);
        });
        window.addEventListener('touchstart', (e) => { tStartY = (deckActive() && !inModal(e.target)) ? e.touches[0].clientY : null; }, { passive: true });
        window.addEventListener('touchmove', (e) => { if (deckActive() && tStartY !== null) e.preventDefault(); }, { passive: false });
        window.addEventListener('touchend', (e) => {
          if (!deckActive() || tStartY === null) return;
          const dy = tStartY - e.changedTouches[0].clientY; tStartY = null;
          if (Math.abs(dy) >= 36) deckStep(dy > 0 ? 1 : -1);
        }, { passive: true });

        let rzT = 0; window.addEventListener('resize', () => { clearTimeout(rzT); rzT = setTimeout(layout, 120); });
        window.addEventListener('load', layout);
        new MutationObserver(() => { if (!view.hidden) { curStop = 0; requestAnimationFrame(layout); } })
          .observe(view, { attributes: true, attributeFilter: ['hidden'] });
        view.querySelectorAll('img, video').forEach(m => {
          m.addEventListener('load', layout);
          m.addEventListener('loadedmetadata', layout);
        });
        if (route.token() === '#hatcha') requestAnimationFrame(layout);
        layout();
      })();
      csPagerStatic('hatcha-view');

      // ── Existence case study: same two-tier reveal (text .reveal / asset .cs-clip) ──
      (function () {
        const view = document.getElementById('existence-view');
        if (!view) return;
        const textTargets = [...view.querySelectorAll(
          '.cs-hero-h, .cs-hero-intro, .cs-meta > div, .cs-ledger-num, .cs-ledger-eye,' +
          '.cs-ledger-h, .cs-ledger-p, .cs-ledger-label, .cs-ledger-row, .cs-ledger-note,' +
          '.cs-quote p, .cs-closing-h, .cs-closing-p, .rn-kicker, .rn-title, .rn-desc'
        )];
        // the hero mock uses .cs-ex-heroph (not .cs-ph) so its clip never fights the tile→hero morph
        const assetTargets = [...view.querySelectorAll('.cs-ph')];
        textTargets.forEach(el => el.classList.add('reveal'));
        const clip = el => {
          el.classList.add('cs-clip');
          el.style.setProperty('--clip-round', getComputedStyle(el).borderTopLeftRadius || '0px');
        };
        assetTargets.forEach(clip);
        const targets = [...textTargets, ...assetTargets];
        if (!targets.length) return;

        ['.cs-meta', '.cs-ledger-rows', '.cs-ex-shots'].forEach(sel => {
          view.querySelectorAll(sel + ' > *').forEach((el, i) => {
            el.style.setProperty('--reveal-delay', (i * 0.06).toFixed(2) + 's');
          });
        });

        const REVEALABLE = '.reveal, .cs-clip';
        const reduce = matchMedia('(prefers-reduced-motion: reduce)');
        if (reduce.matches || !('IntersectionObserver' in window)) {
          view.querySelectorAll(REVEALABLE).forEach(el => el.classList.add('is-visible'));
          return;
        }
        const onReveal = (entries, obs) => {
          entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
          });
        };
        const io = new IntersectionObserver(onReveal, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });
        textTargets.forEach(el => io.observe(el));
        const assetIo = new IntersectionObserver(onReveal, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
        assetTargets.forEach(el => assetIo.observe(el));

        // fail-safe for clip assets (default HIDDEN) — reveal anything geometrically in view
        let clipTick = false;
        const clipScrollPass = () => {
          clipTick = false;
          // This view isn't routed in — its clips can't be on screen, and without this
          // bail all four case studies re-query and re-measure their pending clips on
          // every scroll frame of the HOME page. (Their rects read 0 while hidden, so
          // nothing was ever revealed by it either.)
          if (view.hidden) return;
          const pending = view.querySelectorAll('.cs-clip:not(.is-visible)');
          pending.forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.top < innerHeight * 0.9 && r.bottom > 0) el.classList.add('is-visible');
          });
          if (!pending.length) window.removeEventListener('scroll', onClipScroll);
        };
        const onClipScroll = () => {
          if (view.hidden) return;   // don't even schedule a frame for a routed-out view
          if (!clipTick) { clipTick = true; requestAnimationFrame(clipScrollPass); }
        };
        window.addEventListener('scroll', onClipScroll, { passive: true });

        // the view is display:none until routed in — reveal on-screen items on route/open
        function revealInView() {
          view.querySelectorAll('.reveal:not(.is-visible), .cs-clip:not(.is-visible)').forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.top < innerHeight * 0.88 && r.bottom > 0) el.classList.add('is-visible');
          });
        }
        window.addEventListener('hashchange', () => {
          if (route.token() === '#existence') requestAnimationFrame(revealInView);
        });
        if (route.token() === '#existence') requestAnimationFrame(revealInView);
      })();

      // ── Existence · section cover-slide (pinned choreography, scoped) ──
      (function () {
        const view = document.getElementById('existence-view');
        if (!view) return;
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (document.documentElement.classList.contains('cs-static')) return;
        const page = view.querySelector('.cs-page');
        if (!page) return;
        const sections = [...page.children].filter(el => el.classList.contains('cs-band'));
        if (sections.length < 2) return;

        const scroller = document.createElement('div');
        scroller.className = 'cs-slide-scroller';
        const stage = document.createElement('div');
        stage.className = 'cs-slide-stage';
        scroller.appendChild(stage);
        page.insertBefore(scroller, sections[0]);

        const secs = sections.map((sec, i) => {
          const inner = document.createElement('div');
          inner.className = 'cs-slide-inner';
          while (sec.firstChild) inner.appendChild(sec.firstChild);
          sec.appendChild(inner);
          sec.classList.add('cs-slide-sec');
          if (i > 0) sec.classList.add('cv');              // hero (base) has no slide-in
          sec.style.zIndex = String(i + 1);
          stage.appendChild(sec);
          return { el: sec, inner, videos: [...sec.querySelectorAll('video')], frames: [...sec.querySelectorAll('iframe[data-src]')], live: true, tx: -1, ty: -1 };
        });

        // the slide + read motion replaces the per-element reveal, so show all up front
        view.querySelectorAll('.reveal, .cs-clip').forEach(el => el.classList.add('is-visible'));

        const n = secs.length;
        const ease = t => 1 - Math.pow(1 - t, 3);
        const SL_FACTOR = 0.6;                 // sweep distance in viewports (~one gesture)
        const DW_FACTOR = 0.5;                 // dwell before the next section sweeps in
        const ENTER_SCALE = 0.5;               // incoming panel grows from 50% → 100% as it comes to rest (no tilt)
        let marks = [], V = 0;
        // ── snap-deck state: one wheel/key/swipe gesture advances exactly one panel ──
        let stops = [], curStop = 0, deckAnimating = false, deckRaf = 0, deckCooldown = false, wheelIdleTimer = 0, wheelMaxTimer = 0, tStartY = null;
        // stops is NOT 1:1 with panels (a taller-than-viewport panel adds a second stop),
        // so the pager needs panel index -> stop index to land a jump on the right panel
        const stopOfSec = [];

        function layout() {
          V = window.innerHeight;
          if (!V || view.hidden) return;
          const SL = Math.round(V * SL_FACTOR);
          const DW = Math.round(V * DW_FACTOR);
          let t = 0; marks = [];
          secs.forEach((s, i) => {
            const readH = Math.max(0, s.inner.scrollHeight - V);
            const readStart = t; t += readH; const readEnd = t;
            let slideStart = null, slideEnd = null;
            if (i < n - 1) {
              t += DW;
              slideStart = t; t += SL;
              slideEnd = t;
            }
            marks.push({ readStart, readEnd, readH, slideStart, slideEnd });
          });
          scroller.style.height = (t + V) + 'px';
          // deck stops: each panel's flat rest, PLUS an extra stop after any vertical read-scroll
          // region (e.g. the hero image reveal). So the first gesture scrolls the hero vertically
          // to its end, and only the NEXT gesture slides the following panel in horizontally —
          // the two motions no longer collide in one scroll.
          stops = [];
          secs.forEach((sec, i) => {
            stopOfSec[i] = stops.length;
            stops.push(i === 0 ? 0 : marks[i - 1].slideEnd);        // section fully arrived (top of its content)
            if (marks[i].readH > 0) stops.push(marks[i].readEnd);   // extra stop after reading a taller-than-viewport section
          });
          readTarget(); renderS = targetS; render(renderS);
        }

        // ── section pager ──
        // Which panel "owns" a scroll offset, and how far through it we are. The flip
        // happens at the MIDPOINT of the sweep, so the tick changes exactly when the
        // incoming panel visually takes over — not when it starts moving or lands.
        const midOf = i => i === 0 ? 0 : (marks[i - 1].slideStart + marks[i - 1].slideEnd) / 2;
        function activeAt(s) {
          let i = 0;
          for (let k = 1; k < n; k++) { if (s >= midOf(k)) i = k; else break; }
          return i;
        }
        const pager = csPager({ view, sections, goTo: i => goToStop(stopOfSec[i] || 0) });
        // render is a hoisted declaration, so this rebinding is live for every caller —
        // it keeps the pager in step without threading a call through the render body
        const drawPanels = render;
        render = function (s) {
          drawPanels(s);
          if (marks.length) pager.sync(activeAt(s));
        };

        let targetS = 0, renderS = 0, raf = 0;
        function readTarget() { targetS = Math.max(0, -scroller.getBoundingClientRect().top); }
        function frame() {
          // scroller rect is read HERE, at rAF time — reading it in the raw scroll
          // event fired several times a frame and forced synchronous layout each time
          readTarget();
          const diff = targetS - renderS;
          if (Math.abs(diff) < 0.4) { renderS = targetS; raf = 0; render(renderS); return; }
          renderS += diff * 0.22;
          render(renderS);
          raf = requestAnimationFrame(frame);
        }

        function render(s) {
          if (!marks.length) return;
          secs.forEach((sec, i) => {
            const m = marks[i];
            const liveStart = i === 0 ? -Infinity : marks[i - 1].slideStart - V;
            const liveEnd = i === n - 1 ? Infinity : m.slideEnd + V * 0.5;
            const live = s >= liveStart && s <= liveEnd;
            if (live !== sec.live) {
              sec.live = live;
              sec.el.style.visibility = live ? 'visible' : 'hidden';
              // promote only live panels — a static will-change on every panel held
              // ~2 full-viewport GPU layers per section for the whole session
              sec.el.style.willChange = live ? 'transform' : '';
              sec.inner.style.willChange = live ? 'transform' : '';
              if (live) sec.videos.forEach(v => v.play().catch(() => {}));
              // Rob's reel is a cross-origin Instagram embed: no pause API reaches
              // into it, and hiding the panel (visibility:hidden, above) stops the
              // picture but NOT the audio — so it kept talking over the next panel.
              // Detaching the document is the only lever that actually stops it;
              // re-attaching on the way back in reloads the embed from its poster.
              sec.frames.forEach(f => {
                if (live) { if (f.getAttribute('src') !== f.dataset.src) f.src = f.dataset.src; }
                else if (f.getAttribute('src')) f.removeAttribute('src');
              });
            }
            if (!live) {
              sec.videos.forEach(v => { if (!v.paused) v.pause(); });
              return;
            }
            const ty = s <= m.readStart ? 0 : s >= m.readEnd ? m.readH : (s - m.readStart);
            let tx = 0;
            if (i > 0) {
              const pm = marks[i - 1];
              if (s <= pm.slideStart) tx = 100;
              else if (s >= pm.slideEnd) tx = 0;
              else tx = (1 - ease((s - pm.slideStart) / (pm.slideEnd - pm.slideStart))) * 100;
            }
            if (tx !== sec.tx) {
              const p = tx / 100;                       // 1 = entering (off right), 0 = landed
              // grow-to-rest: incoming panel scales from ENTER_SCALE (50%) up to 100% as it lands,
              // coupled to the sweep so it reaches full size exactly when it comes to rest. No tilt.
              const sc = (1 - p * (1 - ENTER_SCALE)).toFixed(4);
              sec.el.style.transform = 'translate3d(' + tx + '%,0,0) scale(' + sc + ')';
              sec.tx = tx;
            }
            if (ty !== sec.ty) { sec.inner.style.transform = 'translate3d(0,' + (-ty) + 'px,0)'; sec.ty = ty; }
          });
        }

        // view.hidden: the four case-study decks all listen on window, so without this
        // each one measured its scroller on every scroll frame of every other page.
        const onScroll = () => { if (deckAnimating || view.hidden) return; if (!raf) raf = requestAnimationFrame(frame); };
        window.addEventListener('scroll', onScroll, { passive: true });

        // ── snap deck: each gesture tweens render() to the next panel's rest offset over a fixed
        // duration (the rolodex flip plays during the tween), keeping native scroll in sync
        // (instant, to dodge the site's CSS smooth-scroll). Free scrollbar drag still works. ──
        function scrollerTop() { return scroller.getBoundingClientRect().top + window.scrollY; }
        function nearestStop(v) { let b = 0, bd = Infinity; for (let i = 0; i < stops.length; i++) { const d = Math.abs(stops[i] - v); if (d < bd) { bd = d; b = i; } } return b; }
        function goToStop(i) {
          if (!stops.length) return;
          i = Math.max(0, Math.min(stops.length - 1, i));
          curStop = i;
          const O = scrollerTop(), startY = window.scrollY, endY = O + stops[i], t0 = performance.now(), DUR = 1000;
          deckAnimating = true;
          if (raf) { cancelAnimationFrame(raf); raf = 0; }
          if (deckRaf) cancelAnimationFrame(deckRaf);
          (function step(now) {
            const k = Math.min(1, (now - t0) / DUR);
            const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;   // easeInOutCubic — smooth start + settle
            const y = startY + (endY - startY) * e;
            window.scrollTo({ top: y, behavior: 'instant' });
            renderS = Math.max(0, y - O); render(renderS);
            if (k < 1) deckRaf = requestAnimationFrame(step);
            else { renderS = Math.max(0, endY - O); targetS = renderS; render(renderS); deckAnimating = false; }
          })(performance.now());
          // watchdog: if rAF stalls (throttled/background tab), force-finish so the deck never locks
          setTimeout(() => { if (deckAnimating && curStop === i) { renderS = Math.max(0, endY - O); targetS = renderS; window.scrollTo({ top: endY, behavior: 'instant' }); render(renderS); deckAnimating = false; } }, DUR + 300);
        }
        const deckActive = () => !view.hidden && route.token() === '#existence' && stops.length > 1;
        const inModal = (el) => el && el.closest && el.closest('.contact-drawer, .contact-scrim, .pgf-lightbox');
        function deckStep(dir) { if (!deckAnimating) goToStop(nearestStop(renderS) + dir); }
        window.addEventListener('wheel', (e) => {
          if (!deckActive() || e.ctrlKey || inModal(e.target)) return;
          e.preventDefault();
          if (Math.abs(e.deltaY) < 4) return;                 // drop the tiny trackpad-inertia tail
          // Idle unlock: fast release once events stop (discrete mouse notches / distinct swipes).
          clearTimeout(wheelIdleTimer);
          wheelIdleTimer = setTimeout(() => { deckCooldown = false; clearTimeout(wheelMaxTimer); }, 160);
          if (deckCooldown || deckAnimating) return;
          deckCooldown = true;
          // Hard max unlock (set once, NOT reset by events): a trackpad's near-continuous stream
          // would keep resetting the idle timer forever and lock the deck — this guarantees release.
          clearTimeout(wheelMaxTimer);
          wheelMaxTimer = setTimeout(() => { deckCooldown = false; }, 1400);
          deckStep(e.deltaY > 0 ? 1 : -1);
        }, { passive: false });
        window.addEventListener('keydown', (e) => {
          if (!deckActive()) return;
          const tag = (document.activeElement && document.activeElement.tagName) || '';
          if (/^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(tag)) return;
          let d = 0;
          if (e.key === 'ArrowDown' || e.key === 'PageDown') d = 1;
          else if (e.key === 'ArrowUp' || e.key === 'PageUp') d = -1;
          else if (e.key === 'Home') { e.preventDefault(); goToStop(0); return; }
          else if (e.key === 'End') { e.preventDefault(); goToStop(stops.length - 1); return; }
          if (!d) return;
          e.preventDefault(); deckStep(d);
        });
        window.addEventListener('touchstart', (e) => { tStartY = (deckActive() && !inModal(e.target)) ? e.touches[0].clientY : null; }, { passive: true });
        window.addEventListener('touchmove', (e) => { if (deckActive() && tStartY !== null) e.preventDefault(); }, { passive: false });
        window.addEventListener('touchend', (e) => {
          if (!deckActive() || tStartY === null) return;
          const dy = tStartY - e.changedTouches[0].clientY; tStartY = null;
          if (Math.abs(dy) >= 36) deckStep(dy > 0 ? 1 : -1);
        }, { passive: true });

        let rzT = 0; window.addEventListener('resize', () => { clearTimeout(rzT); rzT = setTimeout(layout, 120); });
        window.addEventListener('load', layout);
        new MutationObserver(() => { if (!view.hidden) { curStop = 0; requestAnimationFrame(layout); } })
          .observe(view, { attributes: true, attributeFilter: ['hidden'] });
        view.querySelectorAll('img, video').forEach(m => {
          m.addEventListener('load', layout);
          m.addEventListener('loadedmetadata', layout);
        });
        if (route.token() === '#existence') requestAnimationFrame(layout);
        layout();
      })();
      csPagerStatic('existence-view');

      // ── Jumpable case study: same two-tier reveal (text .reveal / asset .cs-clip) ──
      (function () {
        const view = document.getElementById('jumpable-view');
        if (!view) return;
        const textTargets = [...view.querySelectorAll(
          '.cs-hero-h, .cs-hero-intro, .cs-meta > div, .cs-ledger-num, .cs-ledger-eye,' +
          '.cs-ledger-h, .cs-ledger-p, .cs-ledger-label, .cs-ledger-row, .cs-ledger-note,' +
          '.cs-quote p, .cs-closing-h, .cs-closing-p, .rn-kicker, .rn-title, .rn-desc'
        )];
        // the hero mock uses .cs-jp-heroph (not .cs-ph) so its clip never fights the tile→hero morph
        const assetTargets = [...view.querySelectorAll('.cs-ph')];
        textTargets.forEach(el => el.classList.add('reveal'));
        const clip = el => {
          el.classList.add('cs-clip');
          el.style.setProperty('--clip-round', getComputedStyle(el).borderTopLeftRadius || '0px');
        };
        assetTargets.forEach(clip);
        const targets = [...textTargets, ...assetTargets];
        if (!targets.length) return;

        ['.cs-meta', '.cs-ledger-rows', '.cs-jp-shots'].forEach(sel => {
          view.querySelectorAll(sel + ' > *').forEach((el, i) => {
            el.style.setProperty('--reveal-delay', (i * 0.06).toFixed(2) + 's');
          });
        });

        const REVEALABLE = '.reveal, .cs-clip';
        const reduce = matchMedia('(prefers-reduced-motion: reduce)');
        if (reduce.matches || !('IntersectionObserver' in window)) {
          view.querySelectorAll(REVEALABLE).forEach(el => el.classList.add('is-visible'));
          return;
        }
        const onReveal = (entries, obs) => {
          entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
          });
        };
        const io = new IntersectionObserver(onReveal, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });
        textTargets.forEach(el => io.observe(el));
        const assetIo = new IntersectionObserver(onReveal, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
        assetTargets.forEach(el => assetIo.observe(el));

        // fail-safe for clip assets (default HIDDEN) — reveal anything geometrically in view
        let clipTick = false;
        const clipScrollPass = () => {
          clipTick = false;
          // This view isn't routed in — its clips can't be on screen, and without this
          // bail all four case studies re-query and re-measure their pending clips on
          // every scroll frame of the HOME page. (Their rects read 0 while hidden, so
          // nothing was ever revealed by it either.)
          if (view.hidden) return;
          const pending = view.querySelectorAll('.cs-clip:not(.is-visible)');
          pending.forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.top < innerHeight * 0.9 && r.bottom > 0) el.classList.add('is-visible');
          });
          if (!pending.length) window.removeEventListener('scroll', onClipScroll);
        };
        const onClipScroll = () => {
          if (view.hidden) return;   // don't even schedule a frame for a routed-out view
          if (!clipTick) { clipTick = true; requestAnimationFrame(clipScrollPass); }
        };
        window.addEventListener('scroll', onClipScroll, { passive: true });

        // the view is display:none until routed in — reveal on-screen items on route/open
        function revealInView() {
          view.querySelectorAll('.reveal:not(.is-visible), .cs-clip:not(.is-visible)').forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.top < innerHeight * 0.88 && r.bottom > 0) el.classList.add('is-visible');
          });
        }
        window.addEventListener('hashchange', () => {
          if (route.token() === '#jumpable') requestAnimationFrame(revealInView);
        });
        if (route.token() === '#jumpable') requestAnimationFrame(revealInView);
      })();

      // ── Jumpable · recordings start from the top each time their slide is landed on ──
      (function () {
        const view = document.getElementById('jumpable-view');
        if (!view) return;
        // the cover-slide enhancer pauses a panel's video when it scrolls away; reset it to 0 on that
        // pause so the enhancer's next play() (on re-entry / landing) begins from the start, not mid-clip.
        view.querySelectorAll('video').forEach(v => {
          v.addEventListener('pause', () => { try { if (v.currentTime > 0) v.currentTime = 0; } catch (e) {} });
        });
      })();

      // ── Jumpable · section cover-slide (pinned choreography, scoped) ──
      (function () {
        const view = document.getElementById('jumpable-view');
        if (!view) return;
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (document.documentElement.classList.contains('cs-static')) return;
        const page = view.querySelector('.cs-page');
        if (!page) return;
        const sections = [...page.children].filter(el => el.classList.contains('cs-band'));
        if (sections.length < 2) return;

        const scroller = document.createElement('div');
        scroller.className = 'cs-slide-scroller';
        const stage = document.createElement('div');
        stage.className = 'cs-slide-stage';
        scroller.appendChild(stage);
        page.insertBefore(scroller, sections[0]);

        const secs = sections.map((sec, i) => {
          const inner = document.createElement('div');
          inner.className = 'cs-slide-inner';
          while (sec.firstChild) inner.appendChild(sec.firstChild);
          sec.appendChild(inner);
          sec.classList.add('cs-slide-sec');
          if (i > 0) sec.classList.add('cv');              // hero (base) has no slide-in
          sec.style.zIndex = String(i + 1);
          stage.appendChild(sec);
          return { el: sec, inner, videos: [...sec.querySelectorAll('video')], live: true, tx: -1, ty: -1 };
        });

        // the slide + read motion replaces the per-element reveal, so show all up front
        view.querySelectorAll('.reveal, .cs-clip').forEach(el => el.classList.add('is-visible'));

        const n = secs.length;
        const ease = t => 1 - Math.pow(1 - t, 3);
        const SL_FACTOR = 0.6;                 // sweep distance in viewports (~one gesture)
        const DW_FACTOR = 0.5;                 // dwell before the next section sweeps in
        const ENTER_SCALE = 0.5;               // incoming panel grows from 50% → 100% as it comes to rest (no tilt)
        let marks = [], V = 0;
        // ── snap-deck state: one wheel/key/swipe gesture advances exactly one panel ──
        let stops = [], curStop = 0, deckAnimating = false, deckRaf = 0, deckCooldown = false, wheelIdleTimer = 0, wheelMaxTimer = 0, tStartY = null;
        // stops is NOT 1:1 with panels (a taller-than-viewport panel adds a second stop),
        // so the pager needs panel index -> stop index to land a jump on the right panel
        const stopOfSec = [];

        function layout() {
          V = window.innerHeight;
          if (!V || view.hidden) return;
          const SL = Math.round(V * SL_FACTOR);
          const DW = Math.round(V * DW_FACTOR);
          let t = 0; marks = [];
          secs.forEach((s, i) => {
            const readH = Math.max(0, s.inner.scrollHeight - V);
            const readStart = t; t += readH; const readEnd = t;
            let slideStart = null, slideEnd = null;
            if (i < n - 1) {
              t += DW;
              slideStart = t; t += SL;
              slideEnd = t;
            }
            marks.push({ readStart, readEnd, readH, slideStart, slideEnd });
          });
          scroller.style.height = (t + V) + 'px';
          // deck stops: each panel's flat rest, PLUS an extra stop after any vertical read-scroll
          // region (e.g. the hero image reveal). So the first gesture scrolls the hero vertically
          // to its end, and only the NEXT gesture slides the following panel in horizontally —
          // the two motions no longer collide in one scroll.
          stops = [];
          secs.forEach((sec, i) => {
            stopOfSec[i] = stops.length;
            stops.push(i === 0 ? 0 : marks[i - 1].slideEnd);        // section fully arrived (top of its content)
            if (marks[i].readH > 0) stops.push(marks[i].readEnd);   // extra stop after reading a taller-than-viewport section
          });
          readTarget(); renderS = targetS; render(renderS);
        }

        // ── section pager ──
        // Which panel "owns" a scroll offset, and how far through it we are. The flip
        // happens at the MIDPOINT of the sweep, so the tick changes exactly when the
        // incoming panel visually takes over — not when it starts moving or lands.
        const midOf = i => i === 0 ? 0 : (marks[i - 1].slideStart + marks[i - 1].slideEnd) / 2;
        function activeAt(s) {
          let i = 0;
          for (let k = 1; k < n; k++) { if (s >= midOf(k)) i = k; else break; }
          return i;
        }
        const pager = csPager({ view, sections, goTo: i => goToStop(stopOfSec[i] || 0) });
        // render is a hoisted declaration, so this rebinding is live for every caller —
        // it keeps the pager in step without threading a call through the render body
        const drawPanels = render;
        render = function (s) {
          drawPanels(s);
          if (marks.length) pager.sync(activeAt(s));
        };

        let targetS = 0, renderS = 0, raf = 0;
        function readTarget() { targetS = Math.max(0, -scroller.getBoundingClientRect().top); }
        function frame() {
          // scroller rect is read HERE, at rAF time — reading it in the raw scroll
          // event fired several times a frame and forced synchronous layout each time
          readTarget();
          const diff = targetS - renderS;
          if (Math.abs(diff) < 0.4) { renderS = targetS; raf = 0; render(renderS); return; }
          renderS += diff * 0.22;
          render(renderS);
          raf = requestAnimationFrame(frame);
        }

        function render(s) {
          if (!marks.length) return;
          secs.forEach((sec, i) => {
            const m = marks[i];
            const liveStart = i === 0 ? -Infinity : marks[i - 1].slideStart - V;
            const liveEnd = i === n - 1 ? Infinity : m.slideEnd + V * 0.5;
            const live = s >= liveStart && s <= liveEnd;
            if (live !== sec.live) {
              sec.live = live;
              sec.el.style.visibility = live ? 'visible' : 'hidden';
              // promote only live panels — a static will-change on every panel held
              // ~2 full-viewport GPU layers per section for the whole session
              sec.el.style.willChange = live ? 'transform' : '';
              sec.inner.style.willChange = live ? 'transform' : '';
              if (live) sec.videos.forEach(v => v.play().catch(() => {}));
            }
            if (!live) {
              sec.videos.forEach(v => { if (!v.paused) v.pause(); });
              return;
            }
            const ty = s <= m.readStart ? 0 : s >= m.readEnd ? m.readH : (s - m.readStart);
            let tx = 0;
            if (i > 0) {
              const pm = marks[i - 1];
              if (s <= pm.slideStart) tx = 100;
              else if (s >= pm.slideEnd) tx = 0;
              else tx = (1 - ease((s - pm.slideStart) / (pm.slideEnd - pm.slideStart))) * 100;
            }
            if (tx !== sec.tx) {
              const p = tx / 100;                       // 1 = entering (off right), 0 = landed
              // grow-to-rest: incoming panel scales from ENTER_SCALE (50%) up to 100% as it lands,
              // coupled to the sweep so it reaches full size exactly when it comes to rest. No tilt.
              const sc = (1 - p * (1 - ENTER_SCALE)).toFixed(4);
              sec.el.style.transform = 'translate3d(' + tx + '%,0,0) scale(' + sc + ')';
              sec.tx = tx;
            }
            if (ty !== sec.ty) { sec.inner.style.transform = 'translate3d(0,' + (-ty) + 'px,0)'; sec.ty = ty; }
          });
        }

        // view.hidden: the four case-study decks all listen on window, so without this
        // each one measured its scroller on every scroll frame of every other page.
        const onScroll = () => { if (deckAnimating || view.hidden) return; if (!raf) raf = requestAnimationFrame(frame); };
        window.addEventListener('scroll', onScroll, { passive: true });

        // ── snap deck: each gesture tweens render() to the next panel's rest offset over a fixed
        // duration (the rolodex flip plays during the tween), keeping native scroll in sync
        // (instant, to dodge the site's CSS smooth-scroll). Free scrollbar drag still works. ──
        function scrollerTop() { return scroller.getBoundingClientRect().top + window.scrollY; }
        function nearestStop(v) { let b = 0, bd = Infinity; for (let i = 0; i < stops.length; i++) { const d = Math.abs(stops[i] - v); if (d < bd) { bd = d; b = i; } } return b; }
        function goToStop(i) {
          if (!stops.length) return;
          i = Math.max(0, Math.min(stops.length - 1, i));
          curStop = i;
          const O = scrollerTop(), startY = window.scrollY, endY = O + stops[i], t0 = performance.now(), DUR = 1000;
          deckAnimating = true;
          if (raf) { cancelAnimationFrame(raf); raf = 0; }
          if (deckRaf) cancelAnimationFrame(deckRaf);
          (function step(now) {
            const k = Math.min(1, (now - t0) / DUR);
            const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;   // easeInOutCubic — smooth start + settle
            const y = startY + (endY - startY) * e;
            window.scrollTo({ top: y, behavior: 'instant' });
            renderS = Math.max(0, y - O); render(renderS);
            if (k < 1) deckRaf = requestAnimationFrame(step);
            else { renderS = Math.max(0, endY - O); targetS = renderS; render(renderS); deckAnimating = false; }
          })(performance.now());
          // watchdog: if rAF stalls (throttled/background tab), force-finish so the deck never locks
          setTimeout(() => { if (deckAnimating && curStop === i) { renderS = Math.max(0, endY - O); targetS = renderS; window.scrollTo({ top: endY, behavior: 'instant' }); render(renderS); deckAnimating = false; } }, DUR + 300);
        }
        const deckActive = () => !view.hidden && route.token() === '#jumpable' && stops.length > 1;
        const inModal = (el) => el && el.closest && el.closest('.contact-drawer, .contact-scrim, .pgf-lightbox');
        function deckStep(dir) { if (!deckAnimating) goToStop(nearestStop(renderS) + dir); }
        window.addEventListener('wheel', (e) => {
          if (!deckActive() || e.ctrlKey || inModal(e.target)) return;
          e.preventDefault();
          if (Math.abs(e.deltaY) < 4) return;                 // drop the tiny trackpad-inertia tail
          // Idle unlock: fast release once events stop (discrete mouse notches / distinct swipes).
          clearTimeout(wheelIdleTimer);
          wheelIdleTimer = setTimeout(() => { deckCooldown = false; clearTimeout(wheelMaxTimer); }, 160);
          if (deckCooldown || deckAnimating) return;
          deckCooldown = true;
          // Hard max unlock (set once, NOT reset by events): a trackpad's near-continuous stream
          // would keep resetting the idle timer forever and lock the deck — this guarantees release.
          clearTimeout(wheelMaxTimer);
          wheelMaxTimer = setTimeout(() => { deckCooldown = false; }, 1400);
          deckStep(e.deltaY > 0 ? 1 : -1);
        }, { passive: false });
        window.addEventListener('keydown', (e) => {
          if (!deckActive()) return;
          const tag = (document.activeElement && document.activeElement.tagName) || '';
          if (/^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(tag)) return;
          let d = 0;
          if (e.key === 'ArrowDown' || e.key === 'PageDown') d = 1;
          else if (e.key === 'ArrowUp' || e.key === 'PageUp') d = -1;
          else if (e.key === 'Home') { e.preventDefault(); goToStop(0); return; }
          else if (e.key === 'End') { e.preventDefault(); goToStop(stops.length - 1); return; }
          if (!d) return;
          e.preventDefault(); deckStep(d);
        });
        window.addEventListener('touchstart', (e) => { tStartY = (deckActive() && !inModal(e.target)) ? e.touches[0].clientY : null; }, { passive: true });
        window.addEventListener('touchmove', (e) => { if (deckActive() && tStartY !== null) e.preventDefault(); }, { passive: false });
        window.addEventListener('touchend', (e) => {
          if (!deckActive() || tStartY === null) return;
          const dy = tStartY - e.changedTouches[0].clientY; tStartY = null;
          if (Math.abs(dy) >= 36) deckStep(dy > 0 ? 1 : -1);
        }, { passive: true });

        let rzT = 0; window.addEventListener('resize', () => { clearTimeout(rzT); rzT = setTimeout(layout, 120); });
        window.addEventListener('load', layout);
        new MutationObserver(() => { if (!view.hidden) { curStop = 0; requestAnimationFrame(layout); } })
          .observe(view, { attributes: true, attributeFilter: ['hidden'] });
        view.querySelectorAll('img, video').forEach(m => {
          m.addEventListener('load', layout);
          m.addEventListener('loadedmetadata', layout);
        });
        if (route.token() === '#jumpable') requestAnimationFrame(layout);
        layout();
      })();
      csPagerStatic('jumpable-view');

      // ── Fireflut · themed-variants loop (node 470:2603) ──
      // The variants mockup cycles blue→amber→green→red like a gif — a hard cut,
      // no dissolve: each frame swaps in instantly and the card background flips
      // to the new brand colour on the same beat. Frames are pre-normalised to
      // an identical dead-centre box, so only the colour changes — the mockup
      // never shifts. Advances only while on-screen; static under reduced-motion.
      // Two instances share this markup (the moodboard row + the trio's mini
      // card), each gets its own independent timer/state.
      (function () {
        const figs = document.querySelectorAll('#fireflut-view [data-ff-variants]');
        if (!figs.length) return;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
        const STEP = 850; // ms each frame is shown (hard cut, no fade)

        figs.forEach(fig => {
          const frames = [...fig.querySelectorAll('.ff-vframe')];
          if (frames.length < 2) return;
          const colors = ['--v1', '--v2', '--v3', '--v4'].map(v =>
            getComputedStyle(fig).getPropertyValue(v).trim() || null);
          let cur = 0, timer = null, onScreen = false;

          function show(n) {
            frames.forEach((f, k) => {
              f.classList.toggle('is-active', k === n);
              f.style.opacity = k === n ? '1' : '0';
            });
            if (colors[n]) fig.style.background = colors[n];
            cur = n;
          }
          show(0);

          function tick() { show((cur + 1) % frames.length); }
          function start() {
            if (timer || reduce.matches) return;
            timer = window.setInterval(tick, STEP);
          }
          function stop() { if (timer) { clearInterval(timer); timer = null; } }

          const io = new IntersectionObserver(es => es.forEach(e => {
            onScreen = e.isIntersecting;
            onScreen ? start() : stop();
          }), { threshold: 0.15 });
          io.observe(fig);
          document.addEventListener('visibilitychange', () => {
            document.hidden ? stop() : (onScreen && start());
          });
        });
      })();

      // ── Fireflut · recommendations card stage-fit (node 475:3504) ──
      // Fixed 720×626 design stage scaled to fit the trio cell (contain), same
      // technique as the gauge, so type/icon proportions never drift from Figma.
      (function () {
        const stage = document.querySelector('#fireflut-view [data-rc-stage]');
        if (!stage) return;
        const card = stage.closest('.cs-ff-recs');
        const DW = 720, DH = 626;
        const fit = () => {
          const w = card.clientWidth, h = card.clientHeight;
          if (!w || !h) return;
          stage.style.setProperty('--rc-scale', Math.min(w / DW, h / DH).toFixed(4));
        };
        fit();
        if ('ResizeObserver' in window) new ResizeObserver(fit).observe(card);
        window.addEventListener('resize', fit);
        window.addEventListener('hashchange', () => { if (route.token() === '#fireflut') requestAnimationFrame(fit); });
      })();

      // ── Fireflut · recommendations items loop (node 475:3504) ──
      // The three rows fade up one by one, hold, fade out, and cycle again —
      // a continuous cascade (CSS animation, staggered per row) that plays
      // only while the card is on-screen (battery), pausing off-screen.
      (function () {
        const card = document.querySelector('#fireflut-view .cs-ff-recs');
        if (!card) return;
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; // items stay visible via CSS
        const play = () => card.classList.add('rc-play');
        const stop = () => card.classList.remove('rc-play');
        if ('IntersectionObserver' in window) {
          new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? play() : stop()),
            { threshold: 0.3 }).observe(card);
        } else { play(); }
      })();

      // ── Fireflut · loading reply card stage-fit (node 507:2551) ──
      // Fixed 585×626 design stage (the exact Figma canvas the phone sits
      // in), CONTAIN-fit into the quad cell so the phone's size relative to
      // its black surroundings matches Figma exactly, rather than being
      // blown up to the cell's full width. querySelectorAll — the chat-
      // details marquee duplicates this card for its seamless loop.
      (function () {
        const stages = document.querySelectorAll('#fireflut-view [data-lr-stage]');
        if (!stages.length) return;
        const DW = 585, DH = 626;
        stages.forEach(stage => {
          const card = stage.closest('.cs-ff-loading');
          const fit = () => {
            const w = card.clientWidth, h = card.clientHeight;
            if (!w || !h) return;
            stage.style.setProperty('--lr-scale', Math.min(w / DW, h / DH).toFixed(4));
          };
          fit();
          if ('ResizeObserver' in window) new ResizeObserver(fit).observe(card);
          window.addEventListener('resize', fit);
          window.addEventListener('hashchange', () => { if (route.token() === '#fireflut') requestAnimationFrame(fit); });
        });
      })();

      // ── Fireflut · loading reply shimmer (node 507:2551) ──
      // The skeleton bars shimmer and the sparkle glyph pulses only while
      // the card is on-screen (battery), pausing off-screen. querySelectorAll
      // — the chat-details marquee duplicates this card for its seamless loop.
      (function () {
        const cards = document.querySelectorAll('#fireflut-view .cs-ff-loading');
        if (!cards.length) return;
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (!('IntersectionObserver' in window)) { cards.forEach(c => c.classList.add('load-play')); return; }
        const io = new IntersectionObserver(es => es.forEach(e =>
          e.target.classList.toggle('load-play', e.isIntersecting)), { threshold: 0.3 });
        cards.forEach(card => io.observe(card));
      })();

      // ── Fireflut · motion cards (looping screen recordings: gauge, location, pre-prompts) ──
      // Each plays only while on-screen (saves battery); static poster frame
      // under reduced-motion.
      (function () {
        const vids = document.querySelectorAll('#fireflut-view [data-gg-video]');
        if (!vids.length) return;
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; // poster stays
        const play = vid => { const p = vid.play(); if (p) p.catch(() => {}); };
        if ('IntersectionObserver' in window) {
          const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? play(e.target) : e.target.pause()),
            { threshold: 0.25 });
          vids.forEach(vid => io.observe(vid));
        } else { vids.forEach(play); }
      })();

      // ── Case studies · autoplay safety net ──────────────────────────────
      // Every case-study clip is decorative: muted, looping, no controls. So a
      // refused first autoplay (iOS Low Power Mode, or a document backgrounded
      // at load) leaves it frozen on its poster with no affordance to start it.
      // Retry at the moments that refusal lifts — page becomes visible, first
      // user gesture, route change — and only for clips actually in the
      // viewport, so the per-card observers keep owning off-screen pausing.
      (function () {
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const VIEWS = '#hatcha-view, #fireflut-view, #existence-view, #jumpable-view';
        // both axes: deck panels sit at inset:0 and are swept aside on X, so a
        // vertical-only test would call an off-screen panel's clips visible
        const onScreen = el => {
          const r = el.getBoundingClientRect();
          return r.height > 0 && r.top < innerHeight && r.bottom > 0
                              && r.left < innerWidth && r.right > 0;
        };
        const kick = () => {
          document.querySelectorAll(VIEWS).forEach(view => {
            if (view.hidden) return;
            view.querySelectorAll('video[autoplay]').forEach(vid => {
              if (!vid.paused || !onScreen(vid)) return;
              const p = vid.play();
              if (p) p.catch(() => {});
            });
          });
        };
        document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });
        ['touchstart', 'click'].forEach(evt =>
          window.addEventListener(evt, kick, { passive: true, once: true }));
        window.addEventListener('hashchange', () => setTimeout(kick, 80));
      })();

      // profile picture → top of home page, via the SAME curtain transition as the
      // nav links. The avatar is a native <a href="/#work"> (js/site.js); we hijack the
      // click so it plays the curtain and lands at the very top instead of the work
      // section. We strip the hash with replaceState (NOT a hashchange) so ONLY this
      // curtain runs — not the router's hashchange handler too — and keep prevHash in
      // sync so the next navigation still animates.
      function goHome(e) {
        if (e && e.preventDefault) e.preventDefault();
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const leavingSubpage = routeBucket(route.token()) !== 'home';
        if (route.token()) history.replaceState(null, '', '/' + location.search);
        prevHash = route.token();

        // Already on home → no route swap; just glide up to the hero at the very top.
        if (!leavingSubpage) {
          window.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' });
          return;
        }

        // Coming from a sub-page → play the curtain and land on the hero. behavior:'instant'
        // overrides the page's CSS scroll-behavior:smooth; we re-pin to the top across the
        // whole covered+open window (a scrollTo(0) when already at 0 is a no-op) so the home
        // re-measure — which can stall ~1s — can't leave us parked below the hero.
        const toTop = () => window.scrollTo({ top: 0, behavior: 'instant' });
        if (curtain && !reduced && !inTransition) {
          runCurtain('home');            // close → swap (applyAboutRoute) → open
          [T_CLOSE, T_CLOSE + 120, T_CLOSE + 260, T_CLOSE + T_HOLD,
           T_CLOSE + T_HOLD + T_OPEN, T_CLOSE + T_HOLD + T_OPEN + 250].forEach(d => setTimeout(toTop, d));
        } else {
          applyAboutRoute();
          toTop();
        }
      }
      function wireNav() {
        // the parse-time applyAboutRoute() below already set the route; the nav
        // has only just rendered, so re-sync ONLY the nav-dependent bits instead
        // of re-running the whole route swap (which double-fired the synthetic
        // resize remeasure and a second batch of contrast timers at every load)
        const isAbout = route.token() === '#about';
        const isPlayground = route.token() === '#playground';
        document.querySelectorAll('.nav-link, .menu-link').forEach(l => {
          const href = l.getAttribute('href') || '';
          l.classList.toggle('active', (isAbout && (href.endsWith('#about') || href.endsWith('/about'))) ||                                       (isPlayground && (href.endsWith('#playground') || href.endsWith('/playground'))));
        });
        [0, 320].forEach(t => setTimeout(() => window.updateNavContrast?.(), t));
        const avatar = document.querySelector('.nav-avatar');
        if (avatar && !avatar.dataset.homeWired) {
          avatar.dataset.homeWired = '1';
          avatar.addEventListener('click', goHome);   // native <a> handles focus/Enter/role
        }
      }
      // run once the shared nav (js/site.js, deferred) has rendered
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', wireNav);
      } else {
        wireNav();
      }
      applyAboutRoute();

      // ── experience accordion (single-open) ──
      const items = Array.from(document.querySelectorAll('#about-view .aexp-item'));
      items.forEach(item => {
        const head = item.querySelector('.aexp-head');
        head.addEventListener('click', () => {
          const willOpen = !item.classList.contains('is-open');
          items.forEach(other => {
            const isTarget = other === item;
            other.classList.toggle('is-open', isTarget && willOpen);
            other.querySelector('.aexp-head').setAttribute('aria-expanded', String(isTarget && willOpen));
          });
        });
      });
      // mobile: start with every row collapsed (gskinner opens by default only on desktop)
      if (window.matchMedia('(max-width: 1100px)').matches) {
        items.forEach(item => {
          item.classList.remove('is-open');
          item.querySelector('.aexp-head').setAttribute('aria-expanded', 'false');
        });
      }

      // ── "the About view is now actually visible" signal ──
      // Every measurer below sizes itself against real layout, and #about-view is
      // display:none until its route opens. `hashchange` is NOT a safe cue: on the
      // curtain path the router defers applyAboutRoute() until the panes have
      // closed, so the hashchange listeners fire while the view is still hidden and
      // measure a zero-height layout. Those that also listen to `scroll` self-heal;
      // the experience pin doesn't, so it stayed unsized and left its last rows
      // stranded below the fold. Watch the `hidden` attribute instead — that flips
      // exactly when the layout becomes real — and re-measure again once webfonts
      // land, since row heights depend on how the text wraps.
      (function initAboutMeasureSignal() {
        const view = document.getElementById('about-view');
        if (!view) return;
        const ping = () => window.dispatchEvent(new Event('about:measure'));
        // two frames: one for the un-hide to lay out, one for it to settle
        const pingSettled = () => requestAnimationFrame(() => requestAnimationFrame(ping));
        new MutationObserver(() => { if (!view.hidden) pingSettled(); })
          .observe(view, { attributes: true, attributeFilter: ['hidden'] });
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(() => { if (!view.hidden) pingSettled(); });
        }
      })();

      // ── fit the intro hero so the land shows within the viewport height ──
      (function initIntroFit() {
        const intro = document.querySelector('#about-view .about-intro');
        if (!intro) return;
        const content = intro.querySelector('.ai-content');
        function fit() {
          // polaroid-stack scale for the ≤1100px reflow (fills the column, never >1)
          intro.style.setProperty('--pol-scale', Math.min(1, (window.innerWidth - 48) / 516).toFixed(4));
          // scale the 1440×1024 frame down to fit both viewport dimensions (never up)
          const vh = window.innerHeight;
          const s = Math.min(1, vh / 1024, window.innerWidth / 1440);
          intro.style.setProperty('--intro-scale', s.toFixed(4));
          // drop the frame so the content column is centred in the viewport height;
          // clamp so the scaled frame never leaves the section (no clipping / gap)
          const cTop = content ? content.offsetTop : 233.75;       // 233.75 within the stage
          const cH   = content ? content.offsetHeight : 0;         // unscaled layout height
          const contentCenter = (cTop + cH / 2) * s;               // visual px from the frame's top
          let offset = vh / 2 - contentCenter;
          offset = Math.max(0, Math.min(offset, vh - 1024 * s));
          intro.style.setProperty('--intro-offset', offset.toFixed(1) + 'px');
        }
        fit();
        window.addEventListener('resize', fit);
        window.addEventListener('orientationchange', fit);
        // the About view is hidden at load — re-measure when it's routed into view
        window.addEventListener('hashchange', () => requestAnimationFrame(fit));
        window.addEventListener('about:measure', fit);
      })();

      // ── hero content shrinks on scroll — mirrors the home page's .hero-content
      //    (scale 1.0 → 0.88, eased). Progress runs over the first 80% of the hero. ──
      (function initIntroScale() {
        const view  = document.getElementById('about-view');
        const hero  = document.querySelector('#about-view .about-intro');
        const scene = document.getElementById('ai-scene');
        if (!view || !hero || !scene) return;
        let raf = 0;
        let lastS = null;                                // skip identical writes (no repaint)
        function update() {
          raf = 0;
          if (view.hidden) return;
          const heroH = hero.offsetHeight || 1;
          const progress = Math.min(Math.max(window.scrollY / (heroH * 0.8), 0), 1);
          const eased = 1 - Math.pow(1 - progress, 3);   // ease-out cubic (as on home)
          const scale = (1 - eased * 0.12).toFixed(4);   // 1.0 → 0.88
          if (scale !== lastS) { scene.style.setProperty('--intro-scroll', scale); lastS = scale; }
        }
        // routed-out on the home page, but it still scheduled a frame per scroll —
        // the shared scheduler costs nothing when update() bails on view.hidden
        function onScroll() { Scroll.kick(); }
        Scroll.add(update);
        window.addEventListener('resize', onScroll, { passive: true });
        window.addEventListener('hashchange', () => requestAnimationFrame(update));
        window.addEventListener('about:measure', update);
        update();
      })();

      // ── experience section recedes into shadow as Fun-facts scrolls over it —
      //    mirrors the home page's featured-work dim under the testimonials. ──
      (function initExpRecede() {
        const view = document.getElementById('about-view');
        const exp  = document.querySelector('#about-view .about-exp');
        const fun  = document.querySelector('#about-view .about-fun');
        if (!view || !exp || !fun) return;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
        const ease = (t) => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
        let raf = 0;
        let lastF = null;                                // skip identical writes (no repaint)
        function update() {
          raf = 0;
          if (view.hidden || reduce.matches) { if (lastF !== '') { exp.style.filter = ''; lastF = ''; } return; }
          const vh = window.innerHeight;
          const top = fun.getBoundingClientRect().top;   // fun-facts top in viewport
          const p = ease((vh - top) / vh);               // 0 (just entering) → 1 (covering)
          const f = `brightness(${(1 - 0.42 * p).toFixed(3)}) saturate(${(1 - 0.25 * p).toFixed(3)})`;
          if (f !== lastF) { exp.style.filter = f; lastF = f; }
        }
        // routed-out on the home page, but it still scheduled a frame per scroll —
        // the shared scheduler costs nothing when update() bails on view.hidden
        function onScroll() { Scroll.kick(); }
        Scroll.add(update);
        window.addEventListener('resize', onScroll, { passive: true });
        window.addEventListener('hashchange', () => requestAnimationFrame(update));
        window.addEventListener('about:measure', update);
        if (reduce.addEventListener) reduce.addEventListener('change', update);
        update();
      })();

      // ── experience section: size it to the open accordion and pin its BOTTOM to
      //    the viewport so, when the open list is taller than the screen, the section
      //    scrolls through (revealing every row) and then holds while Fun-facts slides
      //    over it — the home page's featured-work pattern. ──
      (function initExpPin() {
        const view  = document.getElementById('about-view');
        const exp   = document.querySelector('#about-view .about-exp');
        const stage = document.querySelector('#about-view .about-exp-stage');
        const list  = document.querySelector('#about-view .aexp-list');
        const label = exp.querySelector('.aexp-label');
        const intro = document.querySelector('#about-view .about-intro');
        const fun   = document.querySelector('#about-view .about-fun');
        if (!view || !exp || !stage || !list) return;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        // bottom-anchor a section: scrolls through its content, then holds its last
        // screen while the next section (higher z-index) slides up over it
        function pinBottom(el) {
          el.style.position = 'sticky';
          el.style.top = Math.min(0, window.innerHeight - el.offsetHeight) + 'px';
        }
        function unpin(el) { el.style.position = ''; el.style.top = ''; }
        // Hold window between the two sections. Fun-facts sits directly after
        // Experience in flow, so without it Fun-facts starts sliding up the instant
        // Experience finishes scrolling through — the last rows flash past before
        // they can be read. Pushing Fun-facts down by ~a screen leaves that much
        // scroll where the bottom-pinned (viewport-filling) Experience just sits
        // still, fully revealed, before the cover-up begins.
        function setHold(vh, sectionH, holdVh) {
          if (!fun) return;
          // only safe while Experience actually fills the viewport — otherwise the
          // gap would expose the page background below it
          fun.style.marginTop = sectionH >= vh ? Math.round(vh * holdVh) + 'px' : '';
        }
        function fit() {
          if (view.hidden) return;
          // ≤1100px the sections reflow into a flow column; drop the desktop pin's
          // inline styles and bottom-pin each section instead, so the page keeps
          // the layered reveal: intro → experience → fun facts → footer
          if (window.matchMedia('(max-width: 1100px)').matches) {
            stage.style.height = '';
            if (label) label.style.top = '';
            if (reduce) {
              [intro, exp, fun].forEach(s => s && unpin(s));
              exp.style.minHeight = '';
              setHold(0, -1, 0);
              return;
            }
            const mvh = window.innerHeight;
            // the collapsed list is shorter than the screen, so the section would
            // pin without filling it — floor it at a full viewport so the hold below
            // has something to sit behind
            exp.style.minHeight = mvh + 'px';
            if (intro) pinBottom(intro);
            pinBottom(exp);
            setHold(mvh, exp.offsetHeight, 0.6);
            if (fun) pinBottom(fun);
            return;
          }
          // desktop: clear the mobile pins (CSS sticky top:0 + the logic below take over)
          if (intro) unpin(intro);
          if (fun) unpin(fun);
          exp.style.position = '';
          exp.style.minHeight = '';
          const vh = window.innerHeight;
          // tall enough to hold the open list, plus padding below the last row so
          // Fun-facts stays off-screen longer before it slides up (the pad scrolls
          // past as empty space before the overlap begins)
          const PAD_BELOW = 180;
          const needed = list.offsetTop + list.offsetHeight + PAD_BELOW;
          const H = Math.max(vh, needed);
          stage.style.height = H + 'px';
          // taller than the viewport → pin the bottom (top negative) so it scrolls
          // through; otherwise pin normally at the top
          exp.style.top = Math.min(0, vh - H) + 'px';
          setHold(vh, H, 0.9);
          // align the rotated "Professional Experience" label with the first (gskinner)
          // row. Anchor to the row's TOP (fixed) — not its centre — so the label stays
          // put when a row expands/collapses (only the panel below the header changes).
          if (label) {
            const first = list.querySelector('.aexp-item');
            const half = label.offsetWidth / 2;                 // rotated → half its height
            const rowTop = list.offsetTop + first.offsetTop;    // stable across open/close
            label.style.top = (rowTop + half) + 'px';
          }
        }
        fit();
        window.addEventListener('resize', fit);
        window.addEventListener('hashchange', () => requestAnimationFrame(fit));
        window.addEventListener('about:measure', fit);
        // re-fit after a row opens/closes (list height changes once the panel settles)
        list.addEventListener('transitionend', (e) => { if (e.propertyName === 'max-height') fit(); });
      })();

      // ── fun facts: cards start as a stacked deck in the centre, then fan out into
      //    the grid as you scroll through the pinned section (hold stacked to ~60%,
      //    then ease open across the rest of the runway) ──
      (function initFunFactsStack() {
        const view    = document.getElementById('about-view');
        const section = document.querySelector('#about-view .about-fun');
        const stage   = document.querySelector('#about-view .about-fun-stage');
        if (!view || !section || !stage) return;
        const cards  = Array.from(stage.querySelectorAll('.ff-card'));
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

        // scale the grid down (never up) so every card fits with a little breathing room.
        // Fit against the cards' real bounding box — NOT the full 1440×1088 stage, which has
        // ~200px of empty padding top/bottom — so the grid keeps its native size on laptop
        // viewports (e.g. a 13" MacBook) instead of needlessly shrinking.
        const PAD = 40;
        function fit() {
          if (view.hidden) return;
          let minL = Infinity, minT = Infinity, maxR = -Infinity, maxB = -Infinity;
          cards.forEach(c => {
            const halfW = c.offsetWidth / 2;               // cards are translateX(-50%)
            minL = Math.min(minL, c.offsetLeft - halfW);
            maxR = Math.max(maxR, c.offsetLeft + halfW);
            minT = Math.min(minT, c.offsetTop);
            maxB = Math.max(maxB, c.offsetTop + c.offsetHeight);
          });
          const cw = (maxR - minL) || 1440;                // card bounding box (≈1058×681)
          const ch = (maxB - minT) || 1088;
          let s = Math.min(1, (window.innerWidth - PAD) / cw, (window.innerHeight - PAD) / ch);
          if (s < 0.1) s = 0.1;
          stage.style.setProperty('--ff-fit', s.toFixed(4));
        }

        // closed-state offset: pull every card's centre to the EXACT stage centre with
        // no jitter or rotation, so the cards land in one perfectly-aligned pile — only
        // the top card is visible until they spread out into the grid.
        function layout() {
          const scx = stage.offsetWidth  / 2;
          const scy = stage.offsetHeight / 2;
          cards.forEach((c) => {
            const gcx = c.offsetLeft;                    // grid centre-x (card is translateX(-50%))
            const gcy = c.offsetTop + c.offsetHeight / 2; // grid centre-y
            c.style.setProperty('--dx', (scx - gcx).toFixed(1) + 'px');
            c.style.setProperty('--dy', (scy - gcy).toFixed(1) + 'px');
            c.style.setProperty('--rot', '0deg');
          });
        }

        // smoothstep — ease-in-out from a→b
        function smooth(x, a, b) {
          let t = (x - a) / (b - a);
          t = t < 0 ? 0 : t > 1 ? 1 : t;
          return t * t * (3 - 2 * t);
        }

        let raf = 0;
        let lastOpen = null;                            // skip identical writes (no repaint)
        let flowTop = 0;                                // doc-Y where the section pins (top:0)
        function update() {
          raf = 0;
          if (view.hidden) return;
          let open;
          if (reduce.matches) {
            open = 1;                                   // no motion → show the grid outright
          } else {
            const rect = section.getBoundingClientRect();
            if (rect.top > 0.5) flowTop = window.scrollY + rect.top;  // capture before it pins
            else if (!flowTop) flowTop = section.offsetTop;          // fallback if we start pinned
            const vh = window.innerHeight || 1;
            // Long, gentle spread runway measured in scroll distance (not the short
            // reveal window): begin when the section is ~70% risen and finish partway
            // into the pinned hold — so most of the fan-out plays over a static, pinned
            // background rather than while the whole section is still travelling up.
            const start = flowTop - vh * 0.30;
            const end   = flowTop + vh * 0.70;
            let p = (window.scrollY - start) / (end - start);
            p = p < 0 ? 0 : p > 1 ? 1 : p;
            open = smooth(p, 0, 1);                      // eased across the full runway
          }
          const o = open.toFixed(4);
          if (o !== lastOpen) { stage.style.setProperty('--ff-open', o); lastOpen = o; }
        }
        function onScroll() { Scroll.kick(); }
        Scroll.add(update);
        window.addEventListener('resize', () => { fit(); layout(); onScroll(); }, { passive: true });
        window.addEventListener('orientationchange', () => { fit(); layout(); onScroll(); });
        window.addEventListener('hashchange', () => requestAnimationFrame(() => { fit(); layout(); update(); }));
        window.addEventListener('about:measure', () => { fit(); layout(); update(); });
        if (reduce.addEventListener) reduce.addEventListener('change', update);
        fit();
        layout();
        update();
      })();

      // ── gully card: sweep the playback track 0:00 → end on hover ──
      (function initGullyPlayback() {
        const card = document.querySelector('#about-view .ff-gully');
        if (!card) return;
        const fill = card.querySelector('.ff-gully-bar span');
        const times = card.querySelectorAll('.ff-gully-time span');
        const cur = times[0], rem = times[1];
        if (!fill || !cur || !rem) return;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

        const TOTAL = 133;    // 2:13 track length
        const DUR   = 1500;   // ms to sweep the whole bar — brisk, ~1.5s
        const HOLD  = 550;    // ms to rest at the end before rewinding to 0:00
        const fmt = (s) => { s = Math.max(0, Math.round(s)); return Math.floor(s/60) + ':' + String(s%60).padStart(2,'0'); };

        function set(p) {
          fill.style.width = (p * 100) + '%';
          cur.textContent = fmt(p * TOTAL);
          rem.textContent = '-' + fmt(TOTAL - p * TOTAL);
        }
        const rewind = () => set(0);       // default = 0:00, empty bar

        // Once triggered the sweep always runs to completion — it is NOT tied to how long
        // the pointer stays, so a quick flick still plays the track all the way through.
        let raf = 0, startT = 0, playing = false;
        function frame(t) {
          if (!startT) startT = t;
          const p = Math.min(1, (t - startT) / DUR);
          set(p);
          if (p < 1) { raf = requestAnimationFrame(frame); }
          else { playing = false; setTimeout(rewind, HOLD); }   // hold at end, then rewind
        }
        card.addEventListener('mouseenter', () => {
          if (reduce.matches || playing) return;                // ignore re-entry mid-play
          playing = true; startT = 0; set(0);
          raf = requestAnimationFrame(frame);
        });
      })();

      // ── draggable polaroids — pick up & move each photo one by one ──
      (function initPolaroidDrag() {
        const stage = document.querySelector('#about-view .ai-photos');
        if (!stage) return;
        const cards = Array.from(stage.querySelectorAll('.ai-polaroid'));
        const resetBtn = stage.querySelector('.ai-photos-reset');
        // base z-index per card so front tile stays front until picked up
        const baseZ = new Map(cards.map(c => [c, parseInt(getComputedStyle(c).zIndex, 10) || 1]));
        let topZ = Math.max(...baseZ.values());
        const pos = new Map(cards.map(c => [c, { x: 0, y: 0 }]));

        // invisible bounding box: how far past the photo stage a tile may roam (px)
        const BOUND = { left: 130, right: 130, top: 80, bottom: 120 };
        // render a tile's translate + a scale (used for the pickup/drop bounce)
        function paint(card, x, y, scale) {
          card.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
        }
        // clamp a proposed offset so the tile's box stays inside the bounding box
        function clampToBox(card, x, y) {
          const w = stage.clientWidth, h = stage.clientHeight;
          const minX = -BOUND.left - card.offsetLeft;
          const maxX = w + BOUND.right - card.offsetLeft - card.offsetWidth;
          const minY = -BOUND.top - card.offsetTop;
          const maxY = h + BOUND.bottom - card.offsetTop - card.offsetHeight;
          return {
            x: Math.min(Math.max(x, Math.min(minX, maxX)), Math.max(minX, maxX)),
            y: Math.min(Math.max(y, Math.min(minY, maxY)), Math.max(minY, maxY)),
          };
        }

        cards.forEach(card => {
          let startX = 0, startY = 0, originX = 0, originY = 0, dragging = false, pid = null;

          card.addEventListener('pointerdown', e => {
            if (e.button != null && e.button !== 0) return;
            dragging = true;
            pid = e.pointerId;
            const p = pos.get(card);
            originX = p.x; originY = p.y;
            startX = e.clientX; startY = e.clientY;
            card.classList.remove('is-settling', 'is-dropping');
            card.classList.add('is-dragging');
            card.style.zIndex = ++topZ;          // bring picked tile to the front
            paint(card, p.x, p.y, 1.04);         // subtle "lift" pop on pickup
            card.setPointerCapture(pid);
            stage.classList.add('has-moved');    // reveal the reset button
            e.preventDefault();
          });

          card.addEventListener('pointermove', e => {
            if (!dragging || e.pointerId !== pid) return;
            // the hero frame may be scaled to fit the viewport — convert the
            // screen-space cursor delta into the stage's local coordinate space
            const s = stage.getBoundingClientRect().width / (stage.offsetWidth || 1) || 1;
            const { x, y } = clampToBox(card, originX + (e.clientX - startX) / s, originY + (e.clientY - startY) / s);
            pos.set(card, { x, y });
            paint(card, x, y, 1.04);             // hold the lift while dragging
          });

          function end(e) {
            if (!dragging || (e && e.pointerId !== pid)) return;
            dragging = false;
            card.classList.remove('is-dragging');
            card.classList.add('is-dropping');   // spring the scale back → subtle bounce
            const p = pos.get(card);
            paint(card, p.x, p.y, 1);
            card.addEventListener('transitionend', function done() {
              card.classList.remove('is-dropping');
              card.removeEventListener('transitionend', done);
            }, { once: true });
            if (pid != null && card.hasPointerCapture(pid)) card.releasePointerCapture(pid);
            pid = null;
          }
          card.addEventListener('pointerup', end);
          card.addEventListener('pointercancel', end);
        });

        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            // glide every tile home — but KEEP the current stacking order the
            // user arranged, so the front photo never swaps on reset.
            cards.forEach(card => {
              card.classList.remove('is-dropping');
              card.classList.add('is-settling');
              paint(card, 0, 0, 1);              // smooth glide home
              pos.set(card, { x: 0, y: 0 });
            });
            stage.classList.remove('has-moved');
            // drop the transition class once the glide finishes (pointerdown
            // also clears it, so a lingering class can't lag a fresh drag)
            setTimeout(() => {
              cards.forEach(card => card.classList.remove('is-settling'));
            }, 760);
          });
        }
      })();
    })();
  

// -----------------------------------------



    // ── hero content scale on scroll (page-specific; nav/footer behavior lives in js/site.js) ──
    (function () {
      const heroEl = document.querySelector('.hero');
      const heroContent = document.getElementById('hero-content');
      if (!heroEl || !heroContent) return;
      // Base fit-scale: the staggered layout is tuned for the ~1440 canvas and the
      // block (vertical label → "who") is ~911px wide. Between the mobile reflow
      // (<=640, handled by CSS flex) and laptop (>1100) we keep the SAME staggered
      // composition and just scale it to fit, so it never snaps — it shrinks
      // continuously to hold ~48px side margins down through tablet.
      // matches the CSS hero-reflow query — when the hero is a flex column we do
      // NOT fit-scale (the column handles fit); we only scale the staggered canvas.
      const reflowMQ = window.matchMedia('(max-width: 640px), (max-height: 480px) and (orientation: landscape)');
      function baseHeroScale() {
        const w = Scroll.vw();
        if (w > 1100 || reflowMQ.matches) return 1;   // laptop keeps 1:1; mobile uses the flex column
        return Math.min(1, Math.max(0.6, (w - 96) / 911));
      }
      // hero height only moves on resize — caching it keeps a layout read out of the
      // scroll frame entirely
      let heroH = 0, lastScale = null;
      function updateHeroScale() {
        if (!heroH) heroH = heroEl.offsetHeight;
        const progress = Math.min(Math.max(Scroll.y() / (heroH * 0.8), 0), 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const scale = baseHeroScale() * (1 - eased * 0.12);   // fit-scale × (1.0 → 0.88)
        const t = `scale(${scale.toFixed(4)})`;
        if (t !== lastScale) { heroContent.style.transform = t; lastScale = t; }
      }
      Scroll.add(updateHeroScale);
      window.addEventListener('resize', () => { heroH = 0; Scroll.kick(); }, { passive: true });
      updateHeroScale();   // apply the fit-scale immediately (before any scroll)
    })();

    // ── scroll-triggered text reveal ──
    // Fade + rise each .reveal element once as it enters the viewport.
    (function () {
      const reveals = document.querySelectorAll('.reveal');
      if (!reveals.length) return;

      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce || !('IntersectionObserver' in window)) {
        reveals.forEach(el => el.classList.add('is-visible'));
        return;
      }

      const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });

      reveals.forEach(el => revealObserver.observe(el));
    })();



    // ── About intro: line-by-line reveal on scroll ──
    (function () {
      const container = document.querySelector('.intro-copy');
      const paras = container ? Array.from(container.querySelectorAll('.intro-type')) : [];
      if (!container || !paras.length) return;

      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Split one paragraph into visual-line spans by detecting word wrap points
      // (words sharing an offsetTop are on the same rendered line).
      function splitLines(p) {
        if (p.dataset.twText === undefined) p.dataset.twText = p.textContent;
        const tokens = p.dataset.twText.split(/(\s+)/);   // keep whitespace tokens

        p.innerHTML = '';
        const spans = tokens.map(t => {
          const s = document.createElement('span');
          s.textContent = t;
          p.appendChild(s);
          return s;
        });

        const lines = [];
        let cur = null, curTop = null;
        spans.forEach(s => {
          const top = s.offsetTop;
          if (curTop === null || top !== curTop) { cur = []; lines.push(cur); curTop = top; }
          cur.push(s.textContent);
        });

        p.innerHTML = '';
        return lines.map(words => {
          const line = document.createElement('span');
          line.className = 'tw-line';
          line.textContent = words.join('').replace(/^\s+|\s+$/g, '');
          p.appendChild(line);
          return line;
        });
      }

      function build() {
        const all = [];
        paras.forEach(p => splitLines(p).forEach(l => all.push(l)));
        return all;
      }

      let lines = build();

      if (reduce) {
        lines.forEach(l => l.classList.add('is-in'));
        return;
      }

      // Progress is driven by the blurb's own travel up the viewport: 0 when its
      // top sits low on screen, 1 by the time it has risen to the upper third.
      // Because it's tied to scroll position (not a timer), the reveal can't be
      // outrun — and it scrolls seamlessly with the page (no pin).
      function apply() {
        const vh = Scroll.vh();
        const top = Scroll.rect(container).top;
        const start = vh * 0.88;   // progress 0: blurb top low on screen
        const end   = vh * 0.32;   // progress 1: blurb top in the upper third
        let progress = (start - top) / (start - end);
        progress = progress < 0 ? 0 : progress > 1 ? 1 : progress;
        // class churn invalidates style for the whole subtree — only touch the DOM
        // when the number of revealed lines actually changes
        const shown = Math.floor(progress * (lines.length + 1));
        if (shown === lastShown) return;
        lastShown = shown;

        const n = lines.length;
        lines.forEach((line, i) => {
          // evenly spaced thresholds; line 0 starts hidden (threshold > 0)
          const threshold = (i + 1) / (n + 1);
          line.classList.toggle('is-in', progress >= threshold);
        });
      }
      let lastShown = null;

      Scroll.add(apply);

      // build() makes fresh line elements (none carrying .is-in), so the dedupe
      // cache has to go with them or the rebuilt lines stay hidden
      const rebuild = () => { lines = build(); lastShown = null; apply(); };

      let rt;
      addEventListener('resize', () => {
        clearTimeout(rt);
        rt = setTimeout(rebuild, 200);
      }, { passive: true });

      apply();  // set initial state

      // wait for webfonts so wrap points are measured against the real type
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(rebuild);
      }
    })();

    // ── Work featured on: reveal the logo marquee as a group on scroll ──
    (function () {
      const wrap = document.querySelector('.logo-marquee-wrap');
      if (!wrap) return;

      if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
        wrap.classList.add('logos-in');
        return;
      }

      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
          if (e.isIntersecting) { wrap.classList.add('logos-in'); obs.disconnect(); }
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.2 });
      io.observe(wrap);
    })();

    // ── recorder ──
    const audio      = document.getElementById('audio');
    const playBtn    = document.getElementById('play-btn');
    const diskL      = document.getElementById('disk-l');
    const diskR      = document.getElementById('disk-r');
    const slider     = document.getElementById('play-slider');
    const sliderFill = document.getElementById('slider-fill');
    const sliderKnob = document.getElementById('slider-knob');
    const tCurrent   = document.getElementById('t-current');
    const tTotal     = document.getElementById('t-total');

    const KNOB = 23.45;
    let playing = false;

    const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

    function setPlaying(state) {
      playing = state;
      playBtn.classList.toggle('playing', state);
      playBtn.setAttribute('aria-label', state ? 'Pause' : 'Play');
      diskL.classList.toggle('spinning', state);
      diskR.classList.toggle('spinning', state);
    }

    function togglePlay() {
      if (playing) { audio.pause(); setPlaying(false); }
      else { audio.play().catch(() => {}); setPlaying(true); }
    }

    // the whole recorder is a play/pause target — clicks anywhere toggle the song,
    // except on the scrubber (which owns its own pointer interaction). The inner
    // <button> stays the accessible control; its click just bubbles up to here.
    const recorder = document.querySelector('.recorder');
    recorder.addEventListener('click', e => {
      if (e.target.closest('#play-slider')) return;
      togglePlay();
    });

    audio.addEventListener('ended', () => setPlaying(false));
    // keep the recorder UI in sync when playback is toggled elsewhere (e.g. the nav wave button)
    audio.addEventListener('play',  () => setPlaying(true));
    audio.addEventListener('pause', () => setPlaying(false));
    audio.addEventListener('loadedmetadata', () => { tTotal.textContent = fmt(audio.duration); });

    let scrubbing = false;

    // paint the knob + fill + current-time label at a 0..1 position
    function renderAt(pct) {
      const knobX = pct * (slider.clientWidth - KNOB);
      sliderKnob.style.left = knobX + 'px';
      sliderFill.style.width = (knobX + KNOB / 2) + 'px';
      tCurrent.textContent = fmt(pct * (audio.duration || 0));
    }

    // map a pointer x to a 0..1 position, centring the knob under the pointer
    function pctFromEvent(e) {
      const rect = slider.getBoundingClientRect();
      const x = e.clientX - rect.left - KNOB / 2;
      return Math.min(Math.max(x / (rect.width - KNOB), 0), 1);
    }

    audio.addEventListener('timeupdate', () => {
      if (!audio.duration || scrubbing) return;
      renderAt(audio.currentTime / audio.duration);
    });

    slider.addEventListener('pointerdown', e => {
      if (!audio.duration) return;
      scrubbing = true;
      slider.classList.add('scrubbing');
      slider.setPointerCapture(e.pointerId);
      const pct = pctFromEvent(e);
      renderAt(pct);
      audio.currentTime = pct * audio.duration;
    });

    slider.addEventListener('pointermove', e => {
      if (!scrubbing) return;
      const pct = pctFromEvent(e);
      renderAt(pct);
      audio.currentTime = pct * audio.duration;
    });

    function endScrub(e) {
      if (!scrubbing) return;
      scrubbing = false;
      slider.classList.remove('scrubbing');
      try { slider.releasePointerCapture(e.pointerId); } catch (_) {}
    }
    slider.addEventListener('pointerup', endScrub);
    slider.addEventListener('pointercancel', endScrub);


    /* ── scroll-driven paper plane + dotted trail ── */
    (function () {
      const section = document.querySelector('.featured-work');
      const sky = document.querySelector('.sky-band');
      const blurb = document.querySelector('.intro-copy');
      const fly = document.querySelector('.plane-fly');
      const sprite = document.querySelector('.plane-sprite');
      const trail = document.getElementById('planeTrailPath');
      const maskPath = document.getElementById('planeTrailMaskPath');
      const motion = document.getElementById('planeMotionPath');
      if (!section || !sky || !blurb || !fly || !sprite || !trail || !maskPath || !motion) return;

      // The sprite's nose points ~31° (down-right) when un-rotated; subtract that
      // so the nose always aligns with the path's travel direction.
      const PLANE_OFFSET = -31;
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Opening arc as a FIXED-SIZE shape (px), pinned by its end point to a spot
      // just above-left of the blurb. Rebuilt on resize so it keeps the same size
      // and the same relationship to the (centred) blurb at any viewport width —
      // it never stretches with the viewport above 1440.
      const ARC = {
        start: [210, 110],
        curves: [
          [[110, 200], [70, 325], [88, 410]],
          [[103, 488], [192, 528], [255, 555]],
        ],
        end: [255, 555],   // pinned to (blurb.left + 26, blurbTop - 33)
      };

      // Segments 2 & 3 — the real Figma trail vectors (seg 2 = node 209:2683,
      // seg 3 = node 209:2689) in the projects-frame coordinate system (each
      // vector's bbox offset folded in). Anchored to the blurb at 1:1 scale so
      // seg 2 lands on the plane beside "Work featured on" and seg 3 sweeps from
      // the header's left edge down through the tiles to the bottom plane.
      const FBLURB = { x: 220.55078, y: 309.10114, w: 998.8994 };
      const FSEGS = [
        { // segment 2 → ends at the "Work featured on" plane
          start: [1225.129, 513.643],
          curves: [
            [[1400.529, 571.048], [1408.849, 837.583], [1177.289, 928.232]],
          ],
        },
        { // segment 3 (node 209:2689, offset 87.294,943.689) → down to bottom plane
          start: [526.523, 944.189],
          curves: [
            [[343.309, 950.485], [-12.056, 1108.034], [114.406, 1503.226]],
            [[181.773, 1632.295], [428.301, 1799.056], [685.184, 1627.938]],
            [[1049.722, 1385.108], [1402.934, 1429.163], [1402.934, 1762.044]],
            [[1402.934, 2099.399], [1089.394, 2154.919], [826.844, 2073.699]],
            [[564.300, 1992.479], [279.257, 1966.169], [203.537, 2255.019]],
            [[123.170, 2561.609], [552.967, 2708.339], [800.401, 2549.679]],
            [[1047.835, 2391.019], [1393.484, 2589.339], [1253.714, 2887.779]],
          ],
        },
      ];
      const norm = (v) => {
        const m = Math.hypot(v[0], v[1]) || 1;
        return [v[0] / m, v[1] / m];
      };
      // build one drawn subpath in page px → {start, end, startTan, endTan, d}
      function makeSeg(pts) {
        const fmt = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
        let d = `M ${fmt(pts.start)}`;
        for (const c of pts.curves) d += ` C ${fmt(c[0])} ${fmt(c[1])} ${fmt(c[2])}`;
        const last = pts.curves[pts.curves.length - 1];
        return {
          start: pts.start, end: last[2],
          startTan: norm([pts.curves[0][0][0] - pts.start[0], pts.curves[0][0][1] - pts.start[1]]),
          endTan: norm([last[2][0] - last[1][0], last[2][1] - last[1][1]]),
          d,
        };
      }

      // overlay pixel coordinate space (1 unit = 1px); set per build
      let curW = 1440, curH = 3021, pathTopY = 0, pathBotY = 0;
      // each drawn segment carries its motion-space [mStart,mEnd] and
      // visible-space [vStart,vEnd]; bridges fill the gaps between them
      let SEGS = [], motionLen = 0, visLen = 0;

      function setupGeometry() {
        const f = section.getBoundingClientRect();
        const sk = sky.getBoundingClientRect();
        fly.style.top = (sk.top - f.top) + 'px';     // negative → reaches up into the sky
        fly.style.height = (f.bottom - sk.top) + 'px';
      }

      function buildPath() {
        const f = section.getBoundingClientRect();
        const sk = sky.getBoundingClientRect();
        const bl = blurb.getBoundingClientRect();
        curW = fly.clientWidth;
        curH = f.bottom - sk.top;
        // pixel-matched viewBox → no horizontal/vertical distortion at any width
        trail.closest('svg').setAttribute('viewBox', `0 0 ${curW} ${curH}`);
        // segment 1: pin the fixed-px arc just above-left of the blurb
        const dx = (bl.left + 26) - ARC.end[0];
        const dy = (bl.top - sk.top - 33) - ARC.end[1];
        const A = (pt) => [pt[0] + dx, pt[1] + dy];
        // segments 2 & 3: Figma frame coords → overlay px, anchored to the blurb
        const s = bl.width / FBLURB.w;
        const F = (pt) => [
          bl.left + (pt[0] - FBLURB.x) * s,
          (bl.top - sk.top) + (pt[1] - FBLURB.y) * s,
        ];
        // assemble the drawn segments in page px (seg 1 = arc, seg 2 & 3 = Figma)
        const segs = [];
        segs.push(makeSeg({ start: A(ARC.start), curves: ARC.curves.map(c => c.map(A)) }));
        for (const fs of FSEGS) segs.push(makeSeg({ start: F(fs.start), curves: fs.curves.map(c => c.map(F)) }));

        // visible trail: each segment is its own subpath, so the M between them
        // leaves a GAP — nothing is drawn across the blurb or between segments.
        const visD = segs.map(sg => sg.d).join(' ');
        trail.setAttribute('d', visD);

        // continuous motion path = seg + invisible bridge + seg + bridge + seg …
        // The plane parks at each segment's end while crossing a bridge, then
        // restarts at the next segment — it never glides over the gaps.
        let motionD = segs[0].d;
        motion.setAttribute('d', motionD);
        let accM = motion.getTotalLength();
        segs[0].mStart = 0; segs[0].mEnd = accM;
        segs[0].vStart = 0; segs[0].vEnd = accM;
        for (let i = 1; i < segs.length; i++) {
          const prev = segs[i - 1], cur = segs[i];
          const span = Math.hypot(cur.start[0] - prev.end[0], cur.start[1] - prev.end[1]) * 0.4;
          const b1 = [prev.end[0] + prev.endTan[0] * span, prev.end[1] + prev.endTan[1] * span];
          const b2 = [cur.start[0] - cur.startTan[0] * span, cur.start[1] - cur.startTan[1] * span];
          const bridgeD = ` C ${b1[0].toFixed(1)} ${b1[1].toFixed(1)}`
                        + ` ${b2[0].toFixed(1)} ${b2[1].toFixed(1)}`
                        + ` ${cur.start[0].toFixed(1)} ${cur.start[1].toFixed(1)}`;
          motion.setAttribute('d', motionD + bridgeD);
          const afterBridge = motion.getTotalLength();
          motionD += bridgeD + cur.d.replace(/^M[^C]*/, ''); // append seg, drop its M
          motion.setAttribute('d', motionD);
          const afterSeg = motion.getTotalLength();
          cur.mStart = afterBridge; cur.mEnd = afterSeg;
          cur.vStart = prev.vEnd;   cur.vEnd = prev.vEnd + (afterSeg - afterBridge);
          accM = afterSeg;
        }
        motionLen = motion.getTotalLength();
        visLen = trail.getTotalLength();
        maskPath.setAttribute('d', motionD);
        maskPath.style.strokeDasharray = motionLen;
        SEGS = segs;
        buildPlaneLUT();

        const bb = motion.getBBox();
        pathTopY = bb.y; pathBotY = bb.y + bb.height;

        // scroll position at which the plane finishes its flight (p === 1):
        // read-line (vh/2) reaches the path bottom → botVp = vh/2.
        // botVp = sky.top + pathBotY and sky.top = skyFlowTop − scrollY, so
        // scrollY = skyFlowTop + pathBotY − vh/2. Published for the pin logic
        // below, which delays the testimonials slide until the plane is done.
        const skyFlowTop = sk.top + window.scrollY;
        window.__planeEndScroll = skyFlowTop + pathBotY - window.innerHeight * 0.5;
      }

      const LUT_SIZE = 800;
      let planeLUT = null;
      let lastMaskOffset = null;
      function buildPlaneLUT() {
        if (!motionLen) return;
        planeLUT = new Array(LUT_SIZE + 1);
        for (let i = 0; i <= LUT_SIZE; i++) {
          const d = (i / LUT_SIZE) * motionLen;
          const p0 = motion.getPointAtLength(d);
          const p1 = motion.getPointAtLength(Math.max(0, d - 1));
          const p2 = motion.getPointAtLength(Math.min(motionLen, d + 1));
          const a = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
          planeLUT[i] = { x: p0.x, y: p0.y, ang: a };
        }
      }
      let lastMd = null, lastAppear = null, lastFade = 1;
      function update() {
        const sk = Scroll.rect(sky);
        const vh = Scroll.vh();
        // Don't show the plane on first load: only reveal it once the user starts
        // scrolling and the sky band slides up over the hero. appear = 0 at the top,
        // then eases in gently over roughly a full viewport of scroll.
        const scrolled = Scroll.y();
        // path top/bottom in viewport space (overlay box is 1:1 px now)
        const topVp = sk.top + pathTopY;
        const botVp = sk.top + pathBotY;
        // Read-line ~half-way down the viewport: the plane completes the path as
        // that line crosses from the path's top to its bottom — so the arc is fully
        // flown by the time its end (above the blurb) reaches mid-screen.
        let p = (vh * 0.5 - topVp) / (botVp - topVp);
        p = Math.max(0, Math.min(1, p));
        if (reduce) p = 1;

        // three SEPARATE segments: the plane flies a segment, then PARKS at its
        // end while the read-line crosses the gap (the blurb, then the header),
        // then RESTARTS at the next segment — it never glides over a gap.
        const md = p * motionLen;
        const ease = (t) => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
        // p clamps to 0 before the flight and 1 after it, so md stops changing while
        // the plane is parked — but the three getPointAtLength() samples below are the
        // most expensive JS on the page. Bail when neither the distance nor the fade
        // moved and the last write is still on screen.
        const appearNow = reduce ? 1 : ease(scrolled / (vh * 0.95));
        if (md === lastMd && appearNow === lastAppear) return;
        const mdChanged = md !== lastMd;
        lastAppear = appearNow;
        // While the plane is PARKED (md unchanged) only the fade is moving — reuse
        // the cached fade/position and skip the three getPointAtLength() samples,
        // which are the most expensive JS on the page and used to run for the
        // whole first viewport of scroll just to update this opacity.
        if (!mdChanged) { sprite.style.opacity = lastFade * appearNow; return; }
        lastMd = md;
        // fade the plane out→in while crossing a gap (bridge) between segments,
        // so the jump to the next segment is never seen, nor shown over the text
        let opacity = 1;
        for (let i = 1; i < SEGS.length; i++) {
          const pv = SEGS[i - 1], sg = SEGS[i];
          if (md > pv.mEnd && md < sg.mStart) {
            const bp = (md - pv.mEnd) / (sg.mStart - pv.mEnd);
            opacity = Math.max(1 - ease(bp / 0.4), ease((bp - 0.6) / 0.4));
            break;
          }
        }
        lastFade = opacity;
        let pt, ang;
        if (planeLUT && planeLUT.length) {
          const lIdx = Math.min(planeLUT.length - 1, Math.max(0, Math.round(p * (planeLUT.length - 1))));
          pt = planeLUT[lIdx];
          ang = pt.ang;
        } else {
          pt = motion.getPointAtLength(md);
          const pA = motion.getPointAtLength(Math.max(0, md - 1));
          const pB = motion.getPointAtLength(Math.min(motionLen, md + 1));
          ang = Math.atan2(pB.y - pA.y, pB.x - pA.x) * 180 / Math.PI;
        }

        const appear = appearNow;

        // Throttled strokeDashoffset write: avoid re-rasterizing the 1440x3021 SVG mask every frame
        if (lastMaskOffset == null || Math.abs(lastMaskOffset - (motionLen - md)) >= 1.5) {
          maskPath.style.strokeDashoffset = (motionLen - md).toFixed(1);
          lastMaskOffset = motionLen - md;
        }
        sprite.style.opacity = opacity * appear;

        sprite.style.transform =
          `translate3d(${pt.x.toFixed(1)}px, ${pt.y.toFixed(1)}px, 0) translate(-50%, -50%) rotate(${ang + PLANE_OFFSET}deg)`;
      }
      function rebuild() {
        // Skip while the section is hidden (e.g. the #about route sets it to
        // display:none): zero-size rects would overwrite the good geometry with a
        // collapsed path. Keep the last valid build until the section is shown again.
        if (!section.offsetHeight || !fly.clientWidth) return;
        lastMd = lastAppear = null;   // geometry moved → the skip-cache is stale
        setupGeometry(); buildPath(); update();
      }
      Scroll.add(update);
      window.addEventListener('resize', rebuild);
      rebuild();
    })();

    /* ── pin featured-work's tail so testimonials scrolls up over it ──
       sticky `top` = 100vh − section height pins the section's BOTTOM to the
       viewport bottom: it scrolls normally through the tiles, then holds its last
       screen while the (higher z-index) testimonials slides up and overlaps it. */
    (function () {
      const fw = document.querySelector('.featured-work');
      const testi = document.querySelector('.testimonials');
      if (!fw || !testi) return;
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const desktop = matchMedia('(min-width: 1101px)');   // below this it reflows static
      const PLANE_BUFFER = 160;   // extra scroll after the plane lands before the slide
      let mobilePinned = false;   // true while the mobile bottom-pin is active
      // The recede dim is an OVERLAY, not a filter on the section: writing
      // `filter: brightness()` on .featured-work every frame forced the whole
      // subtree — four playing warped tile videos included — to re-rasterize
      // into a filter layer per frame. An opacity fade on a black overlay is
      // compositor-only, so the dim costs nothing while it scrubs.
      const shade = document.createElement('div');
      shade.setAttribute('aria-hidden', 'true');
      shade.style.cssText = 'position:absolute;inset:0;background:#000;opacity:0;pointer-events:none;z-index:99;';
      fw.appendChild(shade);
      let testiH = 0;             // cached testimonials height (avoids per-frame reflow)
      let fwH = 0;                // ditto for the work section
      // keep the mobile bottom-pins glued to the LIVE viewport bottom. The iOS toolbar
      // show/hide changes innerHeight without a width change; recomputing top here (cheap,
      // no reflow — the heights are cached) stops a gap from opening under a section where
      // the pinned hero would otherwise peek through as a blue band.
      // BOTH sections need this: they are bottom-pinned by the same frozen `vh - height`
      // sum, so re-syncing only the testimonials left the work section's own bottom short
      // of the viewport during its hold window (the gap showed up between the last tile
      // and the testimonials sliding up).
      function repinMobile() {
        if (!mobilePinned) return;
        const vh = Scroll.vh();
        const top = Math.min(0, vh - testiH) + 'px';
        if (top !== lastPinTop) { testi.style.top = top; lastPinTop = top; }
        const fwTop = Math.min(0, vh - fwH) + 'px';
        if (fwTop !== lastFwTop) { fw.style.top = fwTop; lastFwTop = fwTop; }
      }
      let lastPinTop = null, lastFwTop = null;
      function setPin() {
        lastPinTop = lastFwTop = null;   // this rewrites `top` itself; don't let the dedupe skip the next sync
        if (reduce) {
          fw.style.position = 'relative';   // no pin under reduced-motion
          fw.style.top = 'auto';
          fw.style.transform = '';
          shade.style.opacity = '0';
          testi.style.marginTop = '';
          testi.style.position = '';
          testi.style.top = '';
          testi.style.bottom = '';
          mobilePinned = false;
          return;
        }
        // Hidden (e.g. the #about route) → offsetHeight is 0; bail so we don't pin
        // the section to top:0 and clobber the testimonials margin with garbage.
        if (!fw.offsetHeight) return;
        fw.style.position = 'sticky';
        const vh = window.innerHeight;
        fwH = fw.offsetHeight;   // cached so repinMobile() can re-sync without a reflow
        fw.style.top = Math.min(0, vh - fwH) + 'px';
        if (desktop.matches) {
          // Desktop: testimonials pins via its own CSS (sticky top:0). Hold the
          // pinned work section until the plane has finished, THEN let the
          // testimonials slide over it. The work section pins when its bottom hits
          // the viewport bottom; we push the testimonials down so it doesn't enter
          // until the plane's completion scroll (+ a small buffer) — the held screen
          // (tiles + the plane landing) stays put through the gap, then the green
          // slides up over it.
          testi.style.position = '';
          testi.style.top = '';
          testi.style.bottom = '';
          mobilePinned = false;
          const planeEnd = window.__planeEndScroll || 0;
          const testiNaturalTop = fw.offsetTop + fw.offsetHeight;   // flow top w/o margin
          const margin = Math.max(0, planeEnd + PLANE_BUFFER + vh - testiNaturalTop);
          testi.style.marginTop = margin + 'px';
        } else {
          // Mobile: no plane hold. Bottom-pin the testimonials the same way the
          // work section is pinned, so the footer (z:12) slides up over it —
          // the full layered reveal: work → testimonials → footer. The `top` is
          // kept in sync with the LIVE innerHeight by repinMobile() on scroll, so
          // the iOS toolbar showing/hiding can't leave the pinned bottom short of
          // the viewport bottom (which opened a gap where the blue hero peeked through
          // above the footer crest). Cache the height so the scroll handler doesn't
          // reflow every frame.
          //
          // HOLD BUFFER: without this the testimonials sit exactly at the viewport
          // bottom the instant the work section pins, so the last two tiles (which
          // land at the bottom of the held screen) get wiped by the rising green
          // before they can be read. Push the testimonials down by ~0.6vh of extra
          // flow so the pinned work screen holds — the last tiles stay on-screen —
          // for a comfortable scroll before the green slides up (the mobile analogue
          // of the desktop PLANE_BUFFER hold).
          testi.style.marginTop = Math.round(vh * 0.6) + 'px';
          testi.style.bottom = '';
          testi.style.position = 'sticky';
          testiH = testi.offsetHeight;
          testi.style.top = Math.min(0, vh - testiH) + 'px';
          mobilePinned = true;
        }
        recede();
      }
      // As the testimonials section scrolls up over the pinned work section, push
      // the work section back: dim it down as the green slides over so it visibly
      // recedes into shadow — a more dramatic, layered reveal. (Shade overlay only —
      // a full-bleed scale would expose the pinned hero at the section's edges.)
      const ease = (t) => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
      function recede() {
        // Mobile: skip the dim entirely — the section is fully covered there anyway.
        if (reduce || !desktop.matches) { shade.style.opacity = '0'; return; }
        const vh = Scroll.vh();
        const top = Scroll.rect(testi).top;              // testimonials top in viewport
        const p = ease((vh - top) / vh);                 // 0 (just entering) → 1 (covering)
        const o = (0.45 * p).toFixed(3);                 // ≈ the old brightness(1−0.42p) dim
        if (o !== lastShade) { shade.style.opacity = o; lastShade = o; }   // skip no-op writes
      }
      let lastShade = null;
      setPin();
      Scroll.add(() => { repinMobile(); recede(); });
      // Only re-pin on a real width/orientation change. Mobile browsers fire `resize`
      // on every toolbar show/hide (height-only) while scrolling; re-pinning there
      // recomputes the sticky tops from a fluctuating innerHeight, which makes the
      // pinned sections jump mid-scroll (the choppiness) and briefly exposes the page
      // background (the "load state" flash). Ignoring height-only resizes keeps the
      // pin rock-steady so the scroll stays smooth.
      let lastW = window.innerWidth;
      window.addEventListener('resize', () => {
        // height-only (toolbar) change: don't run the full setPin (that's the jump/
        // flash the note above describes) — just glue the mobile pin's bottom back to
        // the new viewport bottom. Cheap, no reflow, no gap.
        if (window.innerWidth === lastW) { repinMobile(); return; }
        lastW = window.innerWidth;
        setPin();
      });
      window.addEventListener('load', setPin);
      // Both pin values are derived from .featured-work's measured height: the
      // sticky `top` (= vh - height) that decides WHERE the section stops
      // scrolling, and the testimonials margin that decides HOW LONG it holds.
      // Nothing above re-reads that height when content lands late — and a short
      // reading is not a small error: `top` becomes too shallow, so the section
      // pins before its last tile row has scrolled into the viewport, and the
      // testimonials then rises over a row that was never seen. A refresh serves
      // the art from cache, so the final height is known up front and the same
      // page looks correct — which is exactly the first-visit-only shape of this
      // bug. Re-pin whenever the measured height actually changes. Guarded on a
      // real change and rAF-collapsed, so it costs nothing once the page settles
      // (and never fires for the iOS toolbar, which moves the viewport, not this
      // section's own height).
      if ('ResizeObserver' in window) {
        let lastH = 0, queued = 0;
        new ResizeObserver(() => {
          const h = fw.offsetHeight;
          if (!h || Math.abs(h - lastH) < 2) return;
          lastH = h;
          if (queued) return;
          queued = requestAnimationFrame(() => { queued = 0; setPin(); });
        }).observe(fw);
      }
    })();

    /* ── testimonial deck: fan the stacked cards out left/right on scroll ──
       The cards stay stacked through the whole slide-in; only once the section has
       pinned (filled the viewport) does further scroll scrub the fan open. */
    (function () {
      const cards = document.getElementById('t-cards');
      const section = document.querySelector('.testimonials');
      if (!cards || !section) return;
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const desktop = matchMedia('(min-width: 1101px)');
      const SCRUB = 460;   // scroll distance over which the deck fans fully open
      const ease = (t) => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
      // The section is sticky, so once it pins its rect.top clamps to 0 and can no
      // longer reveal where the section actually sits in the flow. While it's still
      // scrolling in (rect.top > 0) that's a free read, so keep taking it — but that
      // read never happens if the page LOADS already scrolled past the pin point
      // (reload while parked here, back-navigation, a deep link). Without a flow-top
      // the deck used to sit at --spread 0 for the rest of the session, i.e. the cards
      // never fanned. So measure it directly in that case: drop the sticky for one
      // synchronous layout read and put it straight back (sticky doesn't affect
      // siblings' layout, and nothing paints in between, so this is invisible).
      // Cached — only ever re-measured on load/resize, never per scroll frame.
      let flowTop = null;
      function measureFlowTop() {
        const prevPos = section.style.position;
        const prevTop = section.style.top;
        section.style.position = 'static';
        section.style.top = 'auto';
        flowTop = section.getBoundingClientRect().top + (window.scrollY || 0);
        section.style.position = prevPos;
        section.style.top = prevTop;
      }
      function upd() {
        if (!desktop.matches) { cards.style.removeProperty('--spread'); return; }
        if (reduce) { cards.style.setProperty('--spread', '1'); return; }   // static, all visible
        const sy = Scroll.y();
        // one cached read per frame — height doubles as the visibility check, so this
        // doesn't add a second read to the frame
        const rect = Scroll.rect(section);
        // Hidden (e.g. the #about route) → rects are all 0; bail rather than cache
        // a garbage flow-top off a collapsed section.
        if (!rect.height) return;
        const rectTop = rect.top;
        if (rectTop > 0.5) flowTop = rectTop + sy;   // not pinned yet → free true flow-top
        else if (flowTop == null) measureFlowTop();  // loaded already pinned → measure it
        // past = scroll beyond the point the section fills the viewport (pins).
        // Stacked through the slide-in; scrub the fan only after it pins.
        const past = sy - flowTop;
        const p = ease(past / SCRUB);
        cards.style.setProperty('--spread', p.toFixed(4));
      }
      // The pinned-work script (earlier in this file, so it subscribes first) sets the
      // testimonials' margin-top on load/resize, which moves the flow-top. Drop the
      // cache on those events so the next frame re-derives it.
      function invalidate() { flowTop = null; Scroll.kick(); }
      Scroll.add(upd);
      window.addEventListener('resize', invalidate);
      window.addEventListener('load', invalidate);
    })();

    /* ── testimonials (mobile): infinite-loop horizontal carousel ──
       Below 1100px the deck is a swipe carousel; with only three cards it dead-ends.
       Clone a full set on each side and wrap scrollLeft by one set-width at the seams
       so swiping loops forever and seamlessly. Desktop (the fan deck) is left with its
       original three cards untouched — clones only ever exist in the mobile range. */
    (function () {
      const track = document.getElementById('t-cards');
      if (!track) return;
      const mobile = matchMedia('(max-width: 1100px)');
      const originals = Array.from(track.children);
      if (originals.length < 2) return;
      let clones = [];
      let setW = 0, lo = 0, hi = 0, looping = false;

      function clearClones() {
        clones.forEach((c) => c.remove());
        clones = [];
        looping = false;
      }
      function measure() {
        if (!clones.length) return;
        const first = originals[0];
        const trailFirst = clones[clones.length - originals.length];  // clone of originals[0], appended
        setW = trailFirst.offsetLeft - first.offsetLeft;              // exactly one set (N strides)
        const stride = setW / originals.length;
        const baseX = first.offsetLeft - (track.clientWidth - first.offsetWidth) / 2;  // centre first real card
        // Wrap band is one set wide, shifted by half a card so both edges sit in the
        // gaps BETWEEN cards — never on a snap point (avoids boundary ping-pong) and
        // always reachable (the ±half-card slack absorbs the centre-snap offset).
        lo = baseX - stride / 2;
        hi = baseX + setW - stride / 2;
        looping = setW > 10;                                          // guard against hidden/0-width routes
        if (looping) track.scrollLeft = baseX;
      }
      function build() {
        clearClones();
        if (!mobile.matches) return;
        const lead = originals.map((c) => c.cloneNode(true));
        const trail = originals.map((c) => c.cloneNode(true));
        [...lead, ...trail].forEach((c) => { c.setAttribute('aria-hidden', 'true'); c.tabIndex = -1; });
        lead.forEach((c) => track.insertBefore(c, originals[0]));
        trail.forEach((c) => track.appendChild(c));
        clones = [...lead, ...trail];
        measure();                       // offsetLeft is valid synchronously after insertion
        requestAnimationFrame(measure);  // re-measure once layout/fonts settle
      }

      // Wrap only AFTER the scroll settles on a snap point — never mid-scroll. A
      // settled position outside the middle band is always a clone resting on a card
      // centre; hopping by exactly one set-width lands on that clone's identical twin
      // (snap-point → snap-point), so the jump is invisible and can never snap onto
      // the wrong card (the mid-scroll version could land between cards and snap back
      // onto the clone, showing the same author twice).
      let idleTimer = 0;
      track.addEventListener('scroll', () => {
        if (!looping) return;
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
          const x = track.scrollLeft;
          if (x >= hi) track.scrollLeft = x - setW;        // settled on a trailing clone → hop to its twin
          else if (x < lo) track.scrollLeft = x + setW;    // settled on a leading clone → hop to its twin
        }, 80);
      }, { passive: true });

      mobile.addEventListener('change', build);
      let rt;
      window.addEventListener('resize', () => {
        clearTimeout(rt);
        rt = setTimeout(() => {
          if (!mobile.matches) { clearClones(); return; }
          if (!clones.length) build(); else measure();
        }, 150);
      });
      window.addEventListener('load', () => { if (mobile.matches) measure(); });
      build();
    })();

    /* ── hero heading: split each word into per-letter spans so each letter can
       tilt + lift (and turn gold) on its own hover. (line 2 is rebuilt by the
       roll below, so skip it here) ── */
    (function () {
      document.querySelectorAll('.h-line').forEach((line) => {
        if (line.id === 'scramble') return;
        const text = line.textContent;
        line.textContent = '';
        for (const ch of text) {
          const span = document.createElement('span');
          // tag word-spaces so CSS can target them (e.g. force a mobile line break)
          span.className = ch === ' ' ? 'h-letter h-space' : 'h-letter';
          span.textContent = ch === ' ' ? ' ' : ch;   // keep word-spaces from collapsing in inline-block
          line.appendChild(span);
        }
      });
    })();

    /* ── hero line 2: vertical roll (slot) through the word cycle
       Builds → Codes → Ships → Solves → (loop), each held ~2.5s. Each letter is
       an .h-letter span so it inherits the title's hover tilt/gold. Honors
       prefers-reduced-motion (plain swap, no motion). ── */
    (function () {
      const host = document.getElementById('scramble');
      if (!host) return;

      const WORDS = ['Ships', 'Codes', 'Builds', 'Scales'];  // starts on Ships; reorder freely
      /* HOLD is the pace knob — it's the dead pause between rolls, and the only
         one worth touching. DUR is the roll itself and stays at the original 560
         so the spring overshoot below still has room to read. */
      const HOLD = 900;    // ms a word rests before it rolls
      const DUR  = 560;    // ms of the roll
      const EASE = 'cubic-bezier(0.22, 1.15, 0.36, 1)';   // slight spring overshoot
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      let index = 0;

      function makeWord(text) {
        const w = document.createElement('span');
        w.className = 'roll-word';
        for (const ch of text) {
          const s = document.createElement('span');
          s.className = 'h-letter';
          s.textContent = ch;
          w.appendChild(s);
        }
        return w;
      }

      host.textContent = '';
      const track = document.createElement('span');
      track.className = 'roll';
      track.appendChild(makeWord(WORDS[0]));
      host.appendChild(track);

      function next() {
        const word = WORDS[(index + 1) % WORDS.length];
        if (reduce) {                          // no motion — plain swap
          track.replaceChild(makeWord(word), track.firstChild);
          index = (index + 1) % WORDS.length;
          setTimeout(next, HOLD);
          return;
        }
        host.style.overflowClipMargin = '0px';  // tight clip while rolling — nothing peeks past the slot edges
        track.appendChild(makeWord(word));     // stacks directly below the current word

        const h = track.firstChild.getBoundingClientRect().height;   // one word's height
        track.style.transition = `transform ${DUR}ms ${EASE}`;
        requestAnimationFrame(() => { track.style.transform = `translateY(${-h}px)`; });

        function done(e) {
          if (e.propertyName !== 'transform') return;
          track.removeEventListener('transitionend', done);
          track.style.transition = 'none';
          track.style.transform = 'none';
          track.removeChild(track.firstChild);   // drop the word that rolled out
          host.style.overflowClipMargin = '';    // restore the margin so a hover lift can show at rest
          index = (index + 1) % WORDS.length;
          setTimeout(next, HOLD);
        }
        track.addEventListener('transitionend', done);
      }

      setTimeout(next, HOLD);
    })();

    /* ── project tiles: scrub each row from half size up to full as it scrolls
       into view. The row is scaled as a unit from its centre, so the tiles grow
       toward the page centre. Progress tracks the row's viewport position. ── */
    (function () {
      const rows = Array.from(document.querySelectorAll('.tiles-row'));
      if (!rows.length) return;
      // Desktop/tablet scales each ROW as a unit (see .tiles-row CSS). On mobile the
      // rows stack into one column and the reveal is moved onto each .project-tile
      // (see the <=640 CSS), so we also scrub a per-tile --reveal from each tile's own
      // top — that makes the stacked tiles animate one by one instead of two at once.
      const tiles = Array.from(document.querySelectorAll('.project-tile'));
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) {
        rows.forEach(r => r.style.setProperty('--reveal', '1'));
        tiles.forEach(t => t.style.setProperty('--reveal', '1'));
        return;
      }
      const ease = (t) => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
      const rowCache = new Map(), tileCache = new Map();
      function upd() {
        const vh = Scroll.vh();
        const start = vh * 0.95;   // element top here → reveal begins (0)
        const end   = vh * 0.45;   // element top here → fully revealed (1)
        // Mobile stacks the tiles and bottom-pins the section, so the last tiles never
        // scroll up past 0.45vh — with the desktop threshold they'd stay half-revealed
        // (small + faded) at the pinned hold. Complete their reveal higher up the screen
        // so they're crisp while held.
        const tileEnd = (Scroll.vw() <= 640) ? vh * 0.68 : end;
        // ALL reads, THEN all writes. Reading and writing per element inside one loop
        // means each write dirties layout and the next element's read forces a full
        // synchronous relayout — six elements here was ~75% of the whole page's forced
        // reflows per frame. Two passes costs nothing and removes all of them.
        const rowTops  = rows.map(r => Scroll.rect(r).top);
        const tileTops = tiles.map(t => Scroll.rect(t).top);
        rows.forEach((row, i) => {
          const raw = ease((start - rowTops[i]) / (start - end));
          const val = raw <= 0 ? '0' : raw >= 1 ? '1' : raw.toFixed(3);
          if (rowCache.get(row) !== val) {
            row.style.setProperty('--reveal', val);
            rowCache.set(row, val);
          }
        });
        tiles.forEach((tile, i) => {
          const raw = ease((start - tileTops[i]) / (start - tileEnd));
          const val = raw <= 0 ? '0' : raw >= 1 ? '1' : raw.toFixed(3);
          if (tileCache.get(tile) !== val) {
            tile.style.setProperty('--reveal', val);
            tileCache.set(tile, val);
          }
        });
      }
      Scroll.add(upd);
    })();

    /* ── project-tile videos: deferred load + viewport-gated playback. The four
       tile videos are ~12MB combined; with autoplay in the markup the browser
       streamed all of them during initial load, competing with everything else.
       Sources ship as data-src (preload="none"), and this promotes + plays each
       video only when its tile nears the viewport, pausing it again off-screen. ── */
    (function () {
      const vids = Array.from(document.querySelectorAll('video[data-tile-vid]'));
      if (!vids.length || !('IntersectionObserver' in window)) {
        // no IO → promote immediately so the tiles still play
        vids.forEach(v => {
          v.querySelectorAll('source[data-src]').forEach(s => { s.src = s.dataset.src; });
          v.load(); const q = v.play(); if (q && q.catch) q.catch(() => {});
        });
        return;
      }
      const io = new IntersectionObserver((entries) => {
        entries.forEach(({ target: v, isIntersecting }) => {
          if (isIntersecting) {
            const pending = v.querySelectorAll('source[data-src]');
            if (pending.length) {
              pending.forEach(s => { s.src = s.dataset.src; s.removeAttribute('data-src'); });
              v.load();
            }
            const q = v.play(); if (q && q.catch) q.catch(() => {});
          } else {
            try { v.pause(); } catch (e) {}
          }
        });
      }, { rootMargin: '40px 0px', threshold: 0.05 });
      vids.forEach(v => io.observe(v));
    })();

    /* ── ambient animation gate: the willow sway, logo marquee and footer garden
       run infinite animations (~23 of them) whether or not their section is on
       screen. Park them via .anim-idle (site.css) while off-screen — purely a
       play-state toggle, so nothing about the animations themselves changes.
       DOMContentLoaded so the <site-footer> custom element has rendered. ── */
    const initAmbientGate = () => {
      if (!('IntersectionObserver' in window)) return;
      const targets = ['.logo-marquee-wrap', '.testimonials', '.footer']
        .map(sel => document.querySelector(sel)).filter(Boolean);
      if (!targets.length) return;
      const io = new IntersectionObserver(entries => entries.forEach(e =>
        e.target.classList.toggle('anim-idle', !e.isIntersecting)
      ), { rootMargin: '80px 0px' });
      targets.forEach(t => io.observe(t));
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAmbientGate);
    } else {
      initAmbientGate();
    }

    /* ── night shooting star: one meteor at a time, crossing the hero left→right
       on a loose cadence. Deliberately NOT an infinite CSS animation — it runs
       ~1.5s every 5–13s, so between passes there is nothing on the compositor at
       all. The timer parks itself whenever the hero scrolls off screen or the
       site is in day mode, so it costs nothing on the pages/themes without it. ── */
    (function () {
      var hero = document.querySelector('.hero');
      var star = document.querySelector('.hero-meteor');
      if (!hero || !star) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      var timer = 0, flying = false;
      var wasNight = document.body.classList.contains('night');

      function rnd(a, b) { return a + Math.random() * (b - a); }
      function schedule(ms) { clearTimeout(timer); timer = setTimeout(fire, ms); }

      /* .hero is position:sticky, so it never stops intersecting the viewport —
         the projects section just scrolls OVER it. An IntersectionObserver here
         reports "visible" at every scroll position and gates nothing; the real
         test is whether the page has scrolled past the hero's own height. */
      var onHero = function () {
        var y  = (window.Scroll && Scroll.y)  ? Scroll.y()  : (window.pageYOffset || 0);
        var vh = (window.Scroll && Scroll.vh) ? Scroll.vh() : window.innerHeight;
        return y < (hero.offsetHeight || vh) * 0.9;
      };
      var wasOnHero = onHero();

      function fire() {
        /* day mode or scrolled past — skip this pass and check back, rather than
           tearing the loop down and needing to rebuild it on the theme toggle */
        if (!document.body.classList.contains('night') || !onHero()) { schedule(4000); return; }
        var h = hero.offsetHeight || window.innerHeight;
        var w = hero.offsetWidth  || window.innerWidth;
        /* start high and fall shallowly: at 14°+ the streak drops ~460px over a
           desktop crossing and ploughs straight through the headline */
        star.style.setProperty('--m-top',    Math.round(rnd(0.05, 0.28) * h) + 'px');
        star.style.setProperty('--m-len',    Math.round(rnd(130, 260)) + 'px');
        star.style.setProperty('--m-angle',  rnd(7, 13).toFixed(1) + 'deg');
        /* overshoot the width so the streak fully clears the right edge */
        star.style.setProperty('--m-travel', Math.round(w * 1.15 + 260) + 'px');
        star.style.animation = 'none';
        void star.offsetWidth;               // reflow, or re-assigning the same name won't restart it
        star.style.animation = 'hero-meteor-fly ' + rnd(1.1, 1.8).toFixed(2) + 's linear';
      }

      star.addEventListener('animationstart', function () { flying = true; });
      star.addEventListener('animationend', function () {
        flying = false;
        star.style.animation = 'none';       // back to the opacity:0 base state
        schedule(rnd(5200, 13000));
      });

      /* answer the theme toggle directly instead of waiting on the day-mode poll —
         that poll only rechecks every 4s, so flipping to night could sit empty
         that long before the first pass. Guarded on `flying` so toggling mid-pass
         doesn't restart a streak that is already halfway across. */
      if ('MutationObserver' in window) {
        new MutationObserver(function () {
          var night = document.body.classList.contains('night');
          if (night && !wasNight && !flying) schedule(600);
          wasNight = night;
        }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
      }

      /* scrolling back up to the hero resumes without waiting on the 4s poll.
         Cheap: Scroll.y() is the value the scheduler already captured this frame,
         so this adds a comparison and no layout read. */
      if (window.Scroll && Scroll.add) {
        Scroll.add(function () {
          var now = onHero();
          if (now && !wasOnHero && !flying) schedule(700);
          wasOnHero = now;
        });
      }

      schedule(1400);   // booting straight into night (persisted theme) shouldn't wait either
    })();

    /* ── day wind gust: the night→day counterpart to the shooting star. The
       cirrus layer drifts left→right and settles, so the switch lands as a gust
       of wind clearing the night sky rather than a straight cut. Fires only on
       the transition, never on a plain day load — the hero is otherwise still,
       and an unprompted drift on every visit reads as a glitch. ── */
    (function () {
      var sky = document.querySelector('.hero-sky');
      if (!sky || !('MutationObserver' in window)) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      var wasNight = document.body.classList.contains('night');

      sky.addEventListener('animationend', function () { sky.style.animation = 'none'; });

      new MutationObserver(function () {
        var night = document.body.classList.contains('night');
        if (!night && wasNight) {
          sky.style.animation = 'none';
          void sky.offsetWidth;            // reflow, or re-assigning the same name won't restart it
          /* curve picked off a sampled filmstrip: a harder ease covered 60% of the
             drift in the first 360ms and then sat still for 2.5s, which reads as a
             snap, not a gust. This one still decelerates but stays visibly in
             motion to ~1.8s. */
          sky.style.animation = 'hero-sky-gust 3s cubic-bezier(0.2,0.7,0.3,1)';
        }
        wasNight = night;
      }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    })();

    /* ── playground: 3D coverflow carousel. Cards sit on a rotating ring —
       the centred card is upright and playing, neighbours recede in Z, rotate
       away and dim. Drag / wheel / ← → to rotate; click the centre card (or
       "Open full screen") to expand into a lightbox. Replaces the old infinite
       draggable warping grid. ── */
    (function () {
      var view  = document.getElementById('playground-view');
      var stage = document.getElementById('pgf-stage');
      var track = document.getElementById('pgf-track');
      if (!view || !stage || !track) return;

      var DATA = [
        { src:'/assets/playground/pg-fitflow-card.mp4',      type:'video', title:'Membership Card',   tool:'Spline · 2024',  desc:'Built for a FlutterFlow vignette, showcased at the FlutterFlow Developer Conference 2024.' },
        { src:'/assets/playground/pg-burger.mp4',            type:'video', title:'Exploding Burger',   tool:'Blender · 2024', desc:'A playful deconstructed burger crafted for a circular carousel vignette in the Flutter Animate showcase.' },
        { src:'/assets/playground/pg-neon-factory.mp4',      type:'video', title:'G-Land',             tool:'Spline · 2024',  desc:'An interactive island reimagining the gskinner workspace and workflow as an explorable digital world.' },
        { src:'/assets/playground/pg-digital-innovators.mp4',type:'video', title:'Digital Innovators', tool:'Spline · 2023',  desc:'A scattering-pixel experiment dissolving form into motion and light.' },
        { src:'/assets/playground/pg-gradient-sphere.mp4',   type:'video', title:'Dispersion',         tool:'Spline · 2024', desc:'Exploring gradient blends and prismatic color through dispersion effects.' },
        { src:'/assets/playground/pg-desk-frame.mp4',        type:'video', title:'The Frame',          tool:'Blender · 2023', desc:'A custom-designed and 3D-printed frame created for a gskinner company offsite.' },
        { src:'/assets/playground/pg-light-streaks.mp4',     type:'video', title:'Light Streaks',      tool:'Blender · 2023', desc:'A thunder-inspired experiment capturing energy through streaking light and motion.' },
        { src:'/assets/playground/pg-distopia.mp4',          type:'video', title:'Dystopian City',     tool:'Blender · 2024',  desc:'A moody urban experiment envisioning a fractured, futuristic skyline.' },
        { src:'/assets/playground/pg-donut.png',             type:'img',   title:'Realistic Donut',    tool:'Blender · 2023', desc:'A study in texture, lighting, and realism — rendered down to the last sprinkle.' },
        { src:'/assets/playground/pg-dungeon.mp4',           type:'video', title:'Dungeons & Dragons', tool:'Blender · 2023',  desc:'An interactive build bringing a tabletop fantasy world to life in 3D.' }
      ];
      var N = DATA.length;
      var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      var mod = function (a, b) { return ((a % b) + b) % b; };
      function pad(n) { return n < 10 ? '0' + n : '' + n; }
      function posterFor(d) { return d.type === 'img' ? d.src : d.src.replace('/playground/', '/playground/posters/').replace(/\.mp4$/, '.jpg'); }
      function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

      var active = 0;

      /* ── build cards ── */
      var cards = DATA.map(function (d, i) {
        var card = document.createElement('div');
        card.className = 'pgf-card';
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', d.title + ' — open full screen');
        card.setAttribute('tabindex', '-1');
        var poster = posterFor(d);
        var media = d.type === 'video'
          ? '<video muted loop playsinline preload="none" poster="' + esc(poster) + '"><source data-src="' + esc(d.src) + '" type="video/mp4"></video>'
          : '<img src="' + esc(d.src) + '" alt="' + esc(d.title) + '" loading="lazy">';
        card.innerHTML =
          '<div class="pgf-card-media">' + media + '</div>' +
          '<div class="pgf-card-vhs"></div>' +
          '<span class="pgf-card-expand" aria-hidden="true">⤢<i>Open</i></span>';
        track.appendChild(card);
        return card;
      });

      /* ── coverflow layout ── */
      function layout() {
        var isMobile = innerWidth < 620;
        var spread  = isMobile ? 60 : 54;   // % translateX per step
        var depth   = isMobile ? 250 : 300; // px translateZ per step
        var rot     = isMobile ? 32 : 38;   // deg rotateY per step
        var visible = isMobile ? 1 : 2;     // neighbours shown each side

        cards.forEach(function (card, i) {
          var off = i - active;
          if (off >  N / 2) off -= N;       // wrap to shortest path → continuous ring
          if (off < -N / 2) off += N;
          var abs = Math.abs(off);
          var dir = off < 0 ? -1 : (off > 0 ? 1 : 0);

          if (abs > visible) {
            card.style.opacity = '0';
            card.style.pointerEvents = 'none';
            card.style.transform =
              'translate3d(' + (dir * spread * (visible + 1)) + '%,0,' + (-depth * (visible + 1)) + 'px) rotateY(' + (-dir * rot) + 'deg) scale(.5)';
            return;
          }
          var scale = 1 - abs * (isMobile ? 0.16 : 0.14);
          var opacity = abs === 0 ? 1 : (abs === 1 ? 0.55 : 0.22);
          card.style.opacity = String(opacity);
          card.style.pointerEvents = 'auto';
          card.style.zIndex = String(100 - abs);
          card.style.transform =
            'translate3d(' + (off * spread) + '%,0,' + (-abs * depth) + 'px) rotateY(' + (-off * rot) + 'deg) scale(' + scale + ')';
          card.classList.toggle('is-active', off === 0);
          card.setAttribute('tabindex', off === 0 ? '0' : '-1');
        });
        updateActiveMedia();
        updateCaption();
      }

      /* ── only the centred clip plays ── */
      function updateActiveMedia() {
        cards.forEach(function (card, i) {
          var video = card.querySelector('video');
          if (!video) return;
          if (i === active && !document.hidden && route.token() === '#playground') {
            var src = video.querySelector('source');
            if (src && !src.src) { src.src = src.dataset.src; video.load(); }
            if (!reduce) { var q = video.play(); if (q && q.catch) q.catch(function () {}); }
          } else {
            try { video.pause(); } catch (e) {}
          }
        });
      }

      /* ── caption ── */
      var cap      = document.getElementById('pgf-caption');
      var capIndex = document.getElementById('pgf-cap-index');
      var capTags  = document.getElementById('pgf-cap-tags');
      var capTitle = document.getElementById('pgf-cap-title');
      var capDesc  = document.getElementById('pgf-cap-desc');
      function updateCaption() {
        var d = DATA[active];
        cap.classList.add('swap');
        setTimeout(function () {
          capIndex.textContent = pad(active + 1) + ' / ' + pad(N);
          capTags.textContent  = d.tool;
          capTitle.textContent = d.title;
          capDesc.textContent  = d.desc;
          cap.classList.remove('swap');
        }, 180);
      }

      /* ── navigation ── */
      function go(i) { active = mod(i, N); layout(); }
      function next() { go(active + 1); }
      function prev() { go(active - 1); }

      document.getElementById('pgf-next').addEventListener('click', next);
      document.getElementById('pgf-prev').addEventListener('click', prev);

      // card click → open (if centred) or rotate to it, unless it was a drag
      cards.forEach(function (card, i) {
        card.addEventListener('click', function () {
          if (dragMoved) return;
          if (i === active) openLightbox(i); else go(i);
        });
        card.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
        });
      });

      /* keyboard rotate (only on the playground route, lightbox closed) */
      window.addEventListener('keydown', function (e) {
        if (route.token() !== '#playground') return;
        if (lb.classList.contains('open')) return;
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft')  prev();
      });

      /* ── drag / swipe — axis-locked. Horizontal rotates the ring; a plain
         tap still opens the lightbox (no pointer capture). ── */
      var dragging = false, startX = 0, startY = 0, axis = null, dragMoved = false;
      stage.addEventListener('pointerdown', function (e) {
        if (e.target.closest('.pgf-arrow')) return;   // let arrow buttons click
        dragging = true; startX = e.clientX; startY = e.clientY; axis = null; dragMoved = false;
      });
      stage.addEventListener('pointermove', function (e) {
        if (!dragging) return;
        var dx = e.clientX - startX, dy = e.clientY - startY;
        if (!axis) {
          if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
          axis = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y';
        }
        if (axis === 'x' && Math.abs(dx) > 50) { dragMoved = true; if (dx < 0) next(); else prev(); startX = e.clientX; }
      });
      function endDrag() { dragging = false; axis = null; setTimeout(function () { dragMoved = false; }, 50); }
      stage.addEventListener('pointerup', endDrag);
      stage.addEventListener('pointercancel', endDrag);
      stage.addEventListener('pointerleave', endDrag);

      /* ── wheel over the stage → rotate (endless loop, page never scrolls) ── */
      var wheelLock = false;
      stage.addEventListener('wheel', function (e) {
        var dx = e.deltaX, dy = e.deltaY;
        var dir = (Math.abs(dx) > Math.abs(dy)) ? (dx < 0 ? -1 : 1) : (dy < 0 ? -1 : 1);
        if (dir === 0) return;
        e.preventDefault();
        if (wheelLock) return;
        wheelLock = true;
        if (dir > 0) next(); else prev();
        setTimeout(function () { wheelLock = false; }, 420);
      }, { passive: false });

      /* ── lightbox ── */
      var lb      = document.getElementById('pgf-lightbox');
      var lbStage = document.getElementById('pgf-lb-stage');
      var lbIndex = document.getElementById('pgf-lb-index');
      var lbTitle = document.getElementById('pgf-lb-title');
      var lbDesc  = document.getElementById('pgf-lb-desc');
      var lbTags  = document.getElementById('pgf-lb-tags');
      var lbCurrent = 0;

      function renderLightbox(i) {
        var d = DATA[i]; lbCurrent = i;
        // native controls (pause / skip / scrub) on desktop only — on phones they
        // overlay the clip, so there we play muted+looping with no chrome.
        var isMobile = matchMedia('(max-width: 620px)').matches;
        var vAttrs = isMobile ? 'muted autoplay loop playsinline' : 'controls autoplay loop playsinline';
        lbStage.innerHTML = d.type === 'video'
          ? '<video src="' + esc(d.src) + '" poster="' + esc(posterFor(d)) + '" ' + vAttrs + '></video>'
          : '<img src="' + esc(d.src) + '" alt="' + esc(d.title) + '">';
        lbIndex.textContent = pad(i + 1) + ' / ' + pad(N);
        lbTitle.textContent = d.title;
        lbDesc.textContent  = d.desc;
        lbTags.textContent  = d.tool;
      }
      function openLightbox(i) {
        go(i);
        renderLightbox(i);
        lb.classList.add('open');
        lb.setAttribute('aria-hidden', 'false');
        document.getElementById('pgf-lb-close').focus();
      }
      function closeLightbox() {
        lb.classList.remove('open');
        lb.setAttribute('aria-hidden', 'true');
        lbStage.innerHTML = '';
        updateActiveMedia();
      }
      function lbGo(step) { var i = mod(lbCurrent + step, N); go(i); renderLightbox(i); }
      document.getElementById('pgf-lb-close').addEventListener('click', closeLightbox);
      document.getElementById('pgf-lb-next').addEventListener('click', function () { lbGo(1); });
      document.getElementById('pgf-lb-prev').addEventListener('click', function () { lbGo(-1); });
      lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });
      window.addEventListener('keydown', function (e) {
        if (!lb.classList.contains('open')) return;
        if (e.key === 'Escape')     closeLightbox();
        if (e.key === 'ArrowRight') lbGo(1);
        if (e.key === 'ArrowLeft')  lbGo(-1);
      });

      /* ── lifecycle — play/pause the centred clip on route + tab-visibility ── */
      function start() { active = 0; layout(); }
      function stop() {
        closeLightbox();
        cards.forEach(function (card) { var v = card.querySelector('video'); if (v) { try { v.pause(); } catch (e) {} } });
      }
      window.addEventListener('hashchange', function () { if (route.token() === '#playground') start(); else stop(); });
      window.addEventListener('resize', function () { clearTimeout(window._pgfRz); window._pgfRz = setTimeout(layout, 120); });
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) stop();
        else if (route.token() === '#playground') updateActiveMedia();
      });

      layout();
      if (route.token() === '#playground') start();
    })();

  

// -----------------------------------------


  /* design-system gallery: seamless, non-interactive auto-scroll loop */
  (function(){
    var g = document.querySelector('#hatcha-view .cs-gallery');
    if(!g) return;
    /* mobile: the gallery stacks into a plain vertical run, so neither the
       duplicate tile set nor the rAF scrollLeft loop has anything to do —
       and the loop would fight the page's own scrolling. */
    if(document.documentElement.classList.contains('cs-static')) return;

    /* duplicate the tile set once so the loop wraps invisibly */
    var originals = Array.prototype.slice.call(g.children);
    var half = 0;
    originals.forEach(function(node){
      var c = node.cloneNode(true);
      c.setAttribute('data-clone','');
      c.setAttribute('aria-hidden','true');
      g.appendChild(c);
      c.querySelectorAll('video').forEach(function(v){
        v.muted = true; var p = v.play && v.play(); if(p && p.catch) p.catch(function(){});
      });
    });
    /* ── measuring the wrap distance is the whole ballgame ──
       #hatcha-view starts hidden on every load that doesn't open straight into the
       case study, and inside a display:none subtree every offsetLeft is 0 — so the
       original one-shot measure() left half at 0, the loop's half>0 test never
       passed, and the marquee sat dead unless something happened to fire a resize.
       Measuring once on first paint isn't enough either: the tiles are sized by
       images and videos that haven't decoded yet, so an early read returns a couple
       of px and locks THAT in. So: re-measure until the value repeats for half a
       second, and re-arm on anything that can change tile widths. */
    var settled = 0;
    function measure(){
      var first = g.children[0], mid = g.children[originals.length];
      if(!mid || !g.offsetParent) return;
      var h = mid.offsetLeft - first.offsetLeft;
      if(h <= 0) return;
      settled = (h === half) ? settled + 1 : 0;
      half = h;
    }
    function remeasure(){ settled = 0; measure(); }
    measure();
    window.addEventListener('resize', remeasure);
    window.addEventListener('load', remeasure);
    window.addEventListener('hashchange', function(){ requestAnimationFrame(remeasure); });
    g.querySelectorAll('img').forEach(function(im){ im.addEventListener('load', remeasure); });
    g.querySelectorAll('video').forEach(function(v){ v.addEventListener('loadedmetadata', remeasure); });

    function norm(){
      if(half > 0){
        while(g.scrollLeft >= half) g.scrollLeft -= half;
        while(g.scrollLeft < 0)     g.scrollLeft += half;
      }
    }

    /* ── speed is in px per SECOND, and the loop below spends it via a fractional
       carry, for two reasons the old `scrollLeft += 1.4` per-frame value hid ──
       1. this scroller snaps scrollLeft to whole pixels on read-back, so any
          per-frame value under 1px rounded UP to a full pixel: 0.6 and 1.4 both
          scrolled at exactly 1px/frame, which is why lowering the number alone
          changed nothing.
       2. per-frame means the strip runs twice as fast on a 120Hz display.
       Only whole pixels are ever written; the remainder rides in `carry`. */
    var SPEED = 40;                  /* px per second */
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* hover parks the strip so a tile can actually be looked at. Wired only on
       real hover devices — a touch screen wide enough to miss cs-static fires
       mouseenter with no matching mouseleave, which would strand it paused.
       The rAF keeps running while paused so it picks straight back up. */
    var paused = false;
    var hoverTarget = g.closest('.cs-gal-marq') || g;
    if(!window.matchMedia || window.matchMedia('(hover: hover)').matches){
      hoverTarget.addEventListener('mouseenter', function(){ paused = true;  });
      hoverTarget.addEventListener('mouseleave', function(){ paused = false; });
    }

    /* the loop runs ONLY while #hatcha-view is actually shown (and the tab is
       visible) — the old unconditional rAF ran forever on every route, and its
       per-frame g.offsetParent guard was itself a layout read. Visibility is
       tracked via the view's `hidden` attribute instead of read per frame. */
    var view = document.getElementById('hatcha-view');
    var running = false;
    var rafId = 0, last = 0, carry = 0;
    function tick(ts){
      rafId = 0;
      if(!running) return;           // view hidden → loop parks until re-shown
      if(!reduce){
        if(settled < 30) measure();  // ~0.5s of agreement, then stop forcing layout each frame
        if(half > 0 && !paused){
          /* clamped so a long hover or a backgrounded tab can't bank a jump */
          var dt = last ? Math.min((ts - last) / 1000, 0.05) : 0;
          carry += SPEED * dt;
          var step = Math.floor(carry);
          if(step){ carry -= step; g.scrollLeft += step; norm(); }
        }
      }
      last = ts;
      rafId = requestAnimationFrame(tick);
    }
    /* One chain, ever. The old version scheduled a fresh rAF on every off→on
       flip without cancelling the pending callback, and a hide/show inside a
       single frame let the stale callback see running===true again and keep
       going — seven had piled up by the time the page settled, each adding its
       own pixel per frame. Cancelling the outstanding handle here, and having
       tick() own the next one, keeps exactly one loop alive. */
    function syncRunning(){
      var on = !view.hidden && !document.hidden;
      if(on === running) return;
      running = on;
      if(rafId){ cancelAnimationFrame(rafId); rafId = 0; }
      if(on){ settled = 0; last = 0; carry = 0; rafId = requestAnimationFrame(tick); }
    }
    new MutationObserver(syncRunning).observe(view, { attributes:true, attributeFilter:['hidden'] });
    document.addEventListener('visibilitychange', syncRunning);
    syncRunning();
  })();
  

// -----------------------------------------


  (function(){
    // Screen-quad corners as fractions of the plate (measured off cs-hero-laptop.png).
    // Order: TL, TR, BR, BL.
    var Q = [[0.3933,0.3257],[0.5851,0.3071],[0.5955,0.6063],[0.4021,0.6352]];
    // Base box takes the SCREEN's aspect (measured quad is 458.2x307.6px on the
    // 2376x1008 plate), not the 1294x920 recording's — object-fit:cover then crops
    // ~3% off the top and bottom of the capture instead of stretching it.
    var SW = 1000, SH = 671;
    // Pull the quad in toward its centroid so the plate's black bezel shows
    // around the video — real screens never run content to the aluminum edge.
    // Insetting in screen space means the near (bottom) edge gets a thicker
    // margin than the far (top) edge, which is the correct look in perspective.
    var INSET = 0.028;
    var BOTTOM_INSET = 0.032;

    function adj(m){return [
      m[4]*m[8]-m[5]*m[7], m[2]*m[7]-m[1]*m[8], m[1]*m[5]-m[2]*m[4],
      m[5]*m[6]-m[3]*m[8], m[0]*m[8]-m[2]*m[6], m[2]*m[3]-m[0]*m[5],
      m[3]*m[7]-m[4]*m[6], m[1]*m[6]-m[0]*m[7], m[0]*m[4]-m[1]*m[3]];}
    function mm(a,b){var r=[];for(var i=0;i<3;i++)for(var j=0;j<3;j++){var s=0;for(var k=0;k<3;k++)s+=a[3*i+k]*b[3*k+j];r[3*i+j]=s;}return r;}
    function mv(m,v){return [m[0]*v[0]+m[1]*v[1]+m[2]*v[2], m[3]*v[0]+m[4]*v[1]+m[5]*v[2], m[6]*v[0]+m[7]*v[1]+m[8]*v[2]];}
    function basis(x1,y1,x2,y2,x3,y3,x4,y4){
      var m=[x1,x2,x3,y1,y2,y3,1,1,1];
      var v=mv(adj(m),[x4,y4,1]);
      return mm(m,[v[0],0,0,0,v[1],0,0,0,v[2]]);}
    function proj(a,b){return mm(basis.apply(null,b), adj(basis.apply(null,a)));}

    function update(mock){
      var vid = mock.querySelector('.cs-hero-vid');
      if(!vid) return;
      var w = mock.clientWidth, h = mock.clientHeight;
      if(!w || !h) return; // hidden (display:none) — skip until shown
      // Per-element config via data-warp (JSON). Absent → the laptop defaults
      // above, so the hero + home tile keep working with no attribute.
      var cfg = mock.__warp || (mock.__warp = mock.dataset.warp ? JSON.parse(mock.dataset.warp) : {});
      var q = cfg.Q || Q, sw = cfg.sw || SW, sh = cfg.sh || SH;
      var inset = cfg.inset != null ? cfg.inset : INSET;
      var bottomInset = cfg.bottomInset != null ? cfg.bottomInset : BOTTOM_INSET;
      var vext = cfg.vext || 0; // push the top+bottom edges back out along the side rails
      // Mirror the plate's object-fit:cover so the quad tracks the screen even
      // when the box aspect differs from the plate (e.g. the fixed-height tile).
      var plateAR = cfg.plateAR || (2376 / 1008), boxAR = w / h, rw, rh, ox, oy;
      if(boxAR > plateAR){ rw = w; rh = w / plateAR; ox = 0; oy = (h - rh) / 2; }
      else { rh = h; rw = h * plateAR; oy = 0; ox = (w - rw) / 2; }
      // Optional scene zoom, read from CSS so media queries can drive it (--warp-zoom).
      // Sitting a scene in closer via transform:scale() on the .cs-hero-zoom wrapper costs
      // real sharpness: the compositor rasterizes that layer once and GPU-stretches it, so
      // the video texture is resampled twice. Folding the same zoom into the cover-fit rect
      // here instead lets the video be sampled straight to its final size — measured 17%
      // sharper on the watch mockup, which is the one that needs the legibility. The plate
      // is grown to match in CSS (width/left off the same variable), so the two stay locked.
      var zoom = parseFloat(getComputedStyle(mock).getPropertyValue('--warp-zoom')) || 1;
      if(zoom !== 1){
        rw *= zoom; rh *= zoom;
        ox = ox * zoom - (zoom - 1) / 2 * w;   // == scaling the cover rect about the mock centre
        oy = oy * zoom - (zoom - 1) / 2 * h;
      }
      var d = q.map(function(p){return [ox + p[0]*rw, oy + p[1]*rh];});
      var cx = (d[0][0]+d[1][0]+d[2][0]+d[3][0])/4, cy = (d[0][1]+d[1][1]+d[2][1]+d[3][1])/4;
      d = d.map(function(p){return [p[0] + (cx-p[0])*inset, p[1] + (cy-p[1])*inset];});
      // Extra lift on the bottom edge: slide BR→TR and BL→TL along the side
      // rails so the lower bezel is as thick as the sides (a laptop's bottom
      // sits at the hinge; a phone sets bottomInset:0 for a uniform bezel).
      d[2] = [d[2][0] + (d[1][0]-d[2][0])*bottomInset, d[2][1] + (d[1][1]-d[2][1])*bottomInset];
      d[3] = [d[3][0] + (d[0][0]-d[3][0])*bottomInset, d[3][1] + (d[0][1]-d[3][1])*bottomInset];
      if(vext){ // extend top edge up and bottom edge down along the side rails.
        // A uniform centroid inset over-thickens the far top/bottom bezel of a
        // tall portrait screen; this pushes those two edges back toward the glass.
        var a0=d[0],a1=d[1],a2=d[2],a3=d[3];
        d[0]=[a0[0]+(a0[0]-a3[0])*vext, a0[1]+(a0[1]-a3[1])*vext]; // TL out along BL→TL
        d[1]=[a1[0]+(a1[0]-a2[0])*vext, a1[1]+(a1[1]-a2[1])*vext]; // TR out along BR→TR
        d[2]=[a2[0]+(a2[0]-a1[0])*vext, a2[1]+(a2[1]-a1[1])*vext]; // BR out along TR→BR
        d[3]=[a3[0]+(a3[0]-a0[0])*vext, a3[1]+(a3[1]-a0[1])*vext]; // BL out along TL→BL
      }
      // Optional source offset: map a SUB-RECT of the element onto the screen quad
      // instead of the whole element. Lets a recording whose capture carries empty
      // margins be scaled + shifted so its live area fills the glass, with the empty
      // strips landing outside the quad (on the plate's black bezel) rather than being
      // cut out of the file. Absent → 0, so every other mockup is unaffected.
      var sx = cfg.sx || 0, sy = cfg.sy || 0;
      var t = proj([sx,sy, sx+sw,sy, sx+sw,sy+sh, sx,sy+sh],
                   [d[0][0],d[0][1], d[1][0],d[1][1], d[2][0],d[2][1], d[3][0],d[3][1]]);
      for(var i=0;i<9;i++) t[i] /= t[8];
      var m = [t[0],t[3],0,t[6], t[1],t[4],0,t[7], 0,0,1,0, t[2],t[5],0,t[8]];
      vid.style.transform = 'matrix3d('+m.join(',')+')';
    }

    // the route hero transition clones a mock into a fixed overlay; that clone was
    // never registered here, and its source lived in a display:none view so it may
    // carry no matrix at all. Let the transition recompute the warp on demand.
    window.csWarpUpdate = update;

    /* ONE observer + ONE listener set for all mocks — this used to register a
       ResizeObserver, a window resize listener AND a hashchange listener PER
       mock (13 of each), so every iOS toolbar show/hide fired 13 handlers doing
       style+layout reads mid-scroll. The shared window listeners are belt and
       braces for view swaps; the ResizeObserver still catches every real box
       change, so the resize fallback can skip height-only events entirely. */
    var mocks = Array.prototype.slice.call(document.querySelectorAll('[data-hero-mock]'));
    var updateAll = function(){ mocks.forEach(update); };
    var ro = new ResizeObserver(function(entries){
      entries.forEach(function(en){ update(en.target); });
    });
    mocks.forEach(function(mock){
      ro.observe(mock);
      var v = mock.querySelector('.cs-hero-vid');
      if (v) v.addEventListener('loadedmetadata', function(){ update(mock); });
      update(mock);
    });
    var lastW = window.innerWidth;
    window.addEventListener('resize', function(){
      if (window.innerWidth === lastW) return;   // height-only (mobile toolbar) → RO covers real changes
      lastW = window.innerWidth;
      updateAll();
    });
    window.addEventListener('hashchange', function(){ requestAnimationFrame(updateAll); });
  })();
  

// -----------------------------------------


  (function(){
    // Measured screen quad of the photo's iPad (fractions of the plate, TL,TR,BR,BL).
    // This plate ships a chroma-GREEN screen, so it was measured off a green-vs-rest
    // mask rather than the usual dark flood fill.
    var Q = [[0.3350,0.1752],[0.6586,0.2259],[0.6617,0.8400],[0.3318,0.8065]];
    var PLATE_AR = 2400/1800;
    var FW = 703, FH = 1000;     // fill base box = the glass's own aspect (788x1121 on the plate)
    // The fill already matches the glass, so there's nothing to widen — just a hair
    // outward on all four edges so no anti-aliased green survives at the rim.
    var KV = 1.006;
    var KX = 1.006;

    function adj(m){return [m[4]*m[8]-m[5]*m[7],m[2]*m[7]-m[1]*m[8],m[1]*m[5]-m[2]*m[4],
      m[5]*m[6]-m[3]*m[8],m[0]*m[8]-m[2]*m[6],m[2]*m[3]-m[0]*m[5],
      m[3]*m[7]-m[4]*m[6],m[1]*m[6]-m[0]*m[7],m[0]*m[4]-m[1]*m[3]];}
    function mm(a,b){var r=[];for(var i=0;i<3;i++)for(var j=0;j<3;j++){var t=0;for(var k=0;k<3;k++)t+=a[3*i+k]*b[3*k+j];r[3*i+j]=t;}return r;}
    function mv(m,v){return [m[0]*v[0]+m[1]*v[1]+m[2]*v[2],m[3]*v[0]+m[4]*v[1]+m[5]*v[2],m[6]*v[0]+m[7]*v[1]+m[8]*v[2]];}
    function basis(x1,y1,x2,y2,x3,y3,x4,y4){var m=[x1,x2,x3,y1,y2,y3,1,1,1];var v=mv(adj(m),[x4,y4,1]);return mm(m,[v[0],0,0,0,v[1],0,0,0,v[2]]);}
    function proj(a,b){return mm(basis.apply(null,b), adj(basis.apply(null,a)));}
    function scaleEdge(a,b,k){var mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;
      return [[mx+(a[0]-mx)*k, my+(a[1]-my)*k],[mx+(b[0]-mx)*k, my+(b[1]-my)*k]];}

    function update(block){
      var frame = block.querySelector('.cs-phone-frame');
      if(!frame) return;
      var w = block.clientWidth, h = block.clientHeight;
      if(!w || !h) return;
      var boxAR = w/h, rw, rh, ox, oy;
      if(boxAR > PLATE_AR){ rw=w; rh=w/PLATE_AR; ox=0; oy=(h-rh)/2; }
      else { rh=h; rw=h*PLATE_AR; oy=0; ox=(w-rw)/2; }
      var d = Q.map(function(p){return [ox+p[0]*rw, oy+p[1]*rh];});
      var e = scaleEdge(d[0], d[1], KX); d[0]=e[0]; d[1]=e[1];   // widen top edge
      e = scaleEdge(d[3], d[2], KX); d[3]=e[0]; d[2]=e[1];       // widen bottom edge
      e = scaleEdge(d[0], d[3], KV); d[0]=e[0]; d[3]=e[1];       // stretch left rail
      e = scaleEdge(d[1], d[2], KV); d[1]=e[0]; d[2]=e[1];       // stretch right rail
      var t = proj([0,0, FW,0, FW,FH, 0,FH],
                   [d[0][0],d[0][1], d[1][0],d[1][1], d[2][0],d[2][1], d[3][0],d[3][1]]);
      for(var i=0;i<9;i++) t[i] /= t[8];
      frame.style.transform = 'matrix3d('+[t[0],t[3],0,t[6], t[1],t[4],0,t[7], 0,0,1,0, t[2],t[5],0,t[8]].join(',')+')';
    }

    /* shared observer + width-guarded fallback, same consolidation as the
       hero-mock warp above (was one RO + two window listeners per block) */
    var blocks = Array.prototype.slice.call(document.querySelectorAll('.cs-phone-bleed'));
    var updateAll = function(){ blocks.forEach(update); };
    var ro = new ResizeObserver(function(entries){
      entries.forEach(function(en){ update(en.target); });
    });
    blocks.forEach(function(block){ ro.observe(block); update(block); });
    var lastW = window.innerWidth;
    window.addEventListener('resize', function(){
      if (window.innerWidth === lastW) return;
      lastW = window.innerWidth;
      updateAll();
    });
    window.addEventListener('hashchange', function(){ requestAnimationFrame(updateAll); });
  })();
  
