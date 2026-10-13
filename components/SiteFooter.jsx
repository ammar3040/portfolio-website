'use client';

import React, { useEffect, useRef } from 'react';

export default function SiteFooter({ onOpenContact }) {
  const footerRef = useRef(null);
  const gardenRef = useRef(null);

  useEffect(() => {
    const footer = footerRef.current;
    const garden = gardenRef.current;
    if (!footer || !garden) return;

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = matchMedia('(pointer: fine)').matches;
    const compactMQ = matchMedia('(max-width: 1100px)');
    const phoneMQ = matchMedia('(max-width: 640px)');

    const rnd = (a, b) => a + Math.random() * (b - a);
    const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
    const pick = a => a[(Math.random() * a.length) | 0];

    const CREAM = ['#faf5e6', '#fbf7ec', '#f7f1df'];
    const PETAL_EDGE = '#e2d5b0';
    const DISC = '#e89a1c', DISC_HI = '#f6c740', DISC_SH = '#b9791a';
    const STEM = ['#b06a4d', '#a95c42', '#bb765b'];
    const OLIVE = ['#33361a', '#2b2e14', '#3c4020', '#454a24'];
    const LAV = ['#7c5fa6', '#684c90', '#8f73b8', '#5b4680', '#9a80c2'];
    const LEAFG = ['#5c7d3f', '#4a6b33', '#6f9450'];

    function petalPath(len, w, col, extra) {
      return `<path d="M0 0 C ${-w} ${(-len * 0.42).toFixed(1)} ${(-w * 0.55).toFixed(1)} ${-len} 0 ${-len} C ${(w * 0.55).toFixed(1)} ${-len} ${w} ${(-len * 0.42).toFixed(1)} 0 0 Z" fill="${col}" ${extra || ''}/>`;
    }
    function blade(x, y, ang, len, col) {
      const tx = x + Math.sin(ang * Math.PI / 180) * len, ty = y - Math.cos(ang * Math.PI / 180) * len;
      return `<path d="M${x} ${y} Q ${((x + tx) / 2 + rnd(-3, 3)).toFixed(1)} ${((y + ty) / 2).toFixed(1)} ${tx.toFixed(1)} ${ty.toFixed(1)}" stroke="${col}" stroke-width="${rnd(2.4, 3.6).toFixed(1)}" fill="none" stroke-linecap="round"/>`;
    }
    function frond(x, y, ang, len, col) {
      const fingers = 3 + ((Math.random() * 3) | 0);
      let g = `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(1)})">`;
      for (let i = 0; i < fingers; i++) {
        const fa = (i - (fingers - 1) / 2) * rnd(15, 21);
        const fl = len * (1 - Math.abs(i - (fingers - 1) / 2) * 0.1) * rnd(0.8, 1);
        g += `<g transform="rotate(${fa.toFixed(1)})">${petalPath(fl, rnd(6, 9), col)}</g>`;
      }
      return g + '</g>';
    }
    function wrap(w, h, inner) {
      return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><g filter="url(#ft-paint)">${inner}</g></svg>`;
    }

    function buildDaisy() {
      const h = rnd(165, 245), w = 96, cx = w / 2, top = 28, bend = rnd(-15, 15);
      const stemC = pick(STEM), olive = pick(OLIVE), cream = pick(CREAM);
      const stem = `<path d="M${cx} ${h} C ${(cx + bend).toFixed(1)} ${(h * 0.6).toFixed(1)} ${(cx - bend).toFixed(1)} ${(h * 0.34).toFixed(1)} ${cx} ${top + 6}" stroke="${stemC}" stroke-width="${rnd(3.4, 4.6).toFixed(1)}" fill="none" stroke-linecap="round"/>`;
      let base = frond(cx + rnd(-4, 4), h - 2, rnd(-42, -22), rnd(48, 70), olive)
               + frond(cx + rnd(-4, 4), h - 2, rnd(22, 42), rnd(48, 70), olive)
               + frond(cx + rnd(-3, 3), h - 2, rnd(-10, 10), rnd(40, 58), olive);
      const calyx = `<path d="M${cx - 11} ${top + 2} q11 15 22 0 q-3 12 -11 12 q-8 0 -11 -12 z" fill="${olive}"/>`;
      const n = 11 + ((Math.random() * 4) | 0);
      let petals = '';
      for (let i = 0; i < n; i++) {
        const a = 360 / n * i + rnd(-4, 4), L = rnd(27, 35);
        petals += `<g transform="translate(${cx} ${top}) rotate(${a.toFixed(1)})">${petalPath(L, rnd(7, 10), cream, `stroke="${PETAL_EDGE}" stroke-width="1"`)}</g>`;
      }
      const cr = rnd(8.5, 10.5);
      let disc = `<circle cx="${cx}" cy="${top}" r="${cr.toFixed(1)}" fill="${DISC}"/>`;
      for (let i = 0; i < 16; i++) {
        const aa = rnd(0, 6.28), rr = rnd(0, cr * 0.82);
        disc += `<circle cx="${(cx + Math.cos(aa) * rr).toFixed(1)}" cy="${(top + Math.sin(aa) * rr).toFixed(1)}" r="${rnd(0.8, 1.6).toFixed(1)}" fill="${Math.random() < 0.5 ? DISC_HI : DISC_SH}"/>`;
      }
      const head = `<g class="head">${calyx}${petals}${disc}</g>`;
      return { svg: wrap(w, h, base + stem + head), h };
    }

    function buildLavender() {
      const h = rnd(150, 215), w = 56, cx = w / 2;
      const green = pick(LEAFG);
      const stem = `<path d="M${cx} ${h} C ${(cx + rnd(-6, 6)).toFixed(1)} ${(h * 0.6).toFixed(1)} ${(cx + rnd(-4, 4)).toFixed(1)} ${(h * 0.42).toFixed(1)} ${cx} ${(h * 0.3).toFixed(1)}" stroke="${green}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`;
      const leaves = blade(cx, h, rnd(-32, -18), rnd(46, 66), green) + blade(cx, h, rnd(18, 32), rnd(46, 66), green);
      const spikeBot = h * 0.34, spikeTop = 12;
      let florets = '';
      const rows = 11 + ((Math.random() * 6) | 0);
      for (let i = 0; i <= rows; i++) {
        const t = i / rows, yy = spikeBot + (spikeTop - spikeBot) * t, spread = (1 - t) * 7 + 3;
        for (let k = 0; k < 2 + ((Math.random() * 2) | 0); k++)
          florets += `<circle cx="${(cx + rnd(-spread, spread)).toFixed(1)}" cy="${(yy + rnd(-3, 3)).toFixed(1)}" r="${rnd(2.6, 4.3).toFixed(1)}" fill="${pick(LAV)}" opacity="${rnd(0.78, 1).toFixed(2)}"/>`;
      }
      return { svg: wrap(w, h, leaves + stem + `<g class="head">${florets}</g>`), h };
    }

    function buildFoliage() {
      const h = rnd(80, 130), w = 110, cx = w / 2;
      const olive = pick(OLIVE);
      let g = '';
      const n = 4 + ((Math.random() * 3) | 0);
      for (let i = 0; i < n; i++) g += frond(cx + rnd(-10, 10), h - 2, (i - (n - 1) / 2) * rnd(20, 30), rnd(h * 0.7, h * 1.05), olive);
      return { svg: wrap(w, h, `<g class="head">${g}</g>`), h };
    }

    // Shared SVG paint filter
    let defs = footer.querySelector('#ft-paint-defs');
    if (!defs) {
      defs = document.createElement('div');
      defs.id = 'ft-paint-defs';
      defs.setAttribute('aria-hidden', 'true');
      defs.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
      defs.innerHTML = `<svg><defs><filter id="ft-paint" x="-30%" y="-30%" width="160%" height="160%">
        <feTurbulence type="fractalNoise" baseFrequency="0.028 0.04" numOctaves="2" seed="6" result="n"/>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="4" xChannelSelector="R" yChannelSelector="G"/>
      </filter></defs></svg>`;
      footer.appendChild(defs);
    }

    // Ridge sampling
    const landImg = footer.querySelector('.ft-land');
    let ridgeProf = null, landTop = 0, landH = 0, landW = 0, footerW = 0;

    function buildRidge(img) {
      try {
        const W = img.naturalWidth, H = img.naturalHeight;
        if (!W) return null;
        const c = document.createElement('canvas'); c.width = W; c.height = H;
        const ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0);
        const d = ctx.getImageData(0, 0, W, H).data;
        const S = 72, prof = [];
        for (let s = 0; s < S; s++) {
          const col = Math.min(W - 1, ((s + 0.5) / S * W) | 0);
          let ridge = H * 0.45;
          for (let y = 0; y < H; y++) {
            const i = (y * W + col) * 4;
            if (d[i + 3] > 200 && (d[i] + d[i + 1] + d[i + 2]) / 3 < 72) {
              ridge = y;
              break;
            }
          }
          prof.push(ridge / H);
        }
        return prof;
      } catch (e) {
        return null;
      }
    }

    function refreshLand() {
      if (!landImg) return;
      const lr = landImg.getBoundingClientRect();
      const fr = footer.getBoundingClientRect();
      landH = lr.height; landW = lr.width;
      footerW = fr.width;
      landTop = lr.top - fr.top;
    }

    function imgFrac(xf) {
      if (!landW) return clamp(xf, 0, 1);
      return clamp(0.5 + (clamp(xf, 0, 1) - 0.5) * (footerW / landW), 0, 1);
    }

    function ridgeFrac(xf) {
      const prof = ridgeProf;
      if (!prof) return 0.42;
      const t = imgFrac(xf) * (prof.length - 1), i = t | 0, f = t - i;
      return prof[i] * (1 - f) + prof[Math.min(prof.length - 1, i + 1)] * f;
    }

    function soilY(xf) { return landTop + ridgeFrac(xf) * landH + 7; }

    const BAR_RESERVE = phoneMQ.matches ? 196 : 96;
    function plantY(xf, depthPx) {
      const soil = soilY(xf);
      if (!depthPx) return soil;
      return Math.max(soil, Math.min(soil + depthPx, footer.clientHeight - BAR_RESERVE));
    }

    // Clear old plants
    garden.innerHTML = '';

    // Populate garden
    const N = 20, plants = [];
    const nc = 5 + ((Math.random() * 2) | 0);
    const centers = [];
    for (let c = 0; c < nc; c++) centers.push(clamp((c + 0.5) / nc * 100 + rnd(-5, 5), 7, 93));

    for (let i = 0; i < N; i++) {
      const roll = Math.random();
      const built = roll < 0.5 ? buildDaisy() : roll < 0.78 ? buildLavender() : buildFoliage();
      const el = document.createElement('div');
      el.className = 'plant';
      const xPct = clamp(centers[i % nc] + rnd(-6, 6), 2, 98);
      const depthPx = compactMQ.matches ? rnd(4, 28) : 0;
      const baseY = plantY(xPct / 100, depthPx);
      el.style.left = xPct + '%';
      el.style.bottom = (footer.clientHeight - baseY).toFixed(1) + 'px';
      el.style.zIndex = String(1 + ((Math.random() * 2) | 0) + Math.round(depthPx / 12));
      const g0 = phoneMQ.matches ? rnd(0.4, 0.7) : rnd(0.55, 0.95);
      el.style.setProperty('--g', g0.toFixed(3));

      const stalk = document.createElement('div');
      stalk.className = 'sway';
      stalk.style.cssText = `--swayA:${rnd(1.4, 3.4).toFixed(1)}deg;--sway:${rnd(4, 7).toFixed(1)}s;--sway-d:${rnd(-3, 0).toFixed(1)}s`;
      stalk.innerHTML = built.svg;
      el.appendChild(stalk);
      garden.appendChild(el);
      plants.push({ el, g: g0, max: 1.75, fullH: built.h, xPct, baseY, depthPx });
    }

    function reroot() {
      plants.forEach(pl => {
        pl.baseY = plantY(pl.xPct / 100, pl.depthPx);
        pl.el.style.bottom = (footer.clientHeight - pl.baseY).toFixed(1) + 'px';
      });
    }

    let rz = 0;
    function relayout() {
      if (rz) return;
      rz = requestAnimationFrame(() => { rz = 0; refreshLand(); reroot(); });
    }

    window.addEventListener('resize', relayout, { passive: true });
    window.addEventListener('orientationchange', relayout, { passive: true });

    if (landImg) {
      if (landImg.complete && landImg.naturalWidth) {
        ridgeProf = buildRidge(landImg);
        refreshLand();
        reroot();
      } else {
        landImg.addEventListener('load', () => {
          ridgeProf = buildRidge(landImg);
          refreshLand();
          reroot();
        }, { once: true });
      }
    }

    // Droplets FX
    let fx = footer.querySelector('.ft-fx');
    if (!fx) {
      fx = document.createElement('div');
      fx.className = 'ft-fx';
      footer.appendChild(fx);
    }

    const GRAV = 0.42, drops = [];
    let raf = 0;

    function emit(fx0, fy0, n, spread, vy0) {
      const cap = 90;
      for (let i = 0; i < n && drops.length < cap; i++) {
        const r = rnd(2.4, 4.6);
        const d = document.createElement('div');
        d.className = 'ft-drop';
        d.style.width = d.style.height = r.toFixed(1) + 'px';
        fx.appendChild(d);
        drops.push({ el: d, x: fx0 + rnd(-4, 4), y: fy0 + rnd(-3, 3), vx: rnd(-spread, spread), vy: vy0 + rnd(0, 1.6), r, a: 1 });
      }
      if (!raf) raf = requestAnimationFrame(tick);
    }

    function tick() {
      const fw = footer.clientWidth;
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        d.vy += GRAV; d.x += d.vx; d.y += d.vy;
        const g = soilY(d.x / fw);
        if (d.y >= g) { d.y = g; d.a -= 0.16; d.vx *= 0.7; }
        if (d.a <= 0) { d.el.remove(); drops.splice(i, 1); continue; }
        d.el.style.transform = `translate(${d.x.toFixed(1)}px, ${d.y.toFixed(1)}px)`;
        d.el.style.opacity = d.a.toFixed(2);
      }
      raf = drops.length ? requestAnimationFrame(tick) : 0;
    }

    // Cursor & tips
    let cursor = null, tipX = 44, tipY = 43;
    if (fine && !reduce) {
      cursor = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      cursor.setAttribute('viewBox', '0 0 60 60');
      cursor.setAttribute('width', '58'); cursor.setAttribute('height', '58');
      cursor.setAttribute('class', 'ft-cursor');
      cursor.innerHTML = `
        <g filter="url(#ft-paint)">
          <g transform="rotate(20 27 27)">
            <path d="M16 21 Q7.5 22 8 29 Q8.3 34 15 34" fill="none" stroke="#c9856f" stroke-width="3.2" stroke-linecap="round"/>
            <path d="M34.5 24 L47 29 L49.5 33.5 L46 37 L33 31 Z" fill="#d69880"/>
            <ellipse cx="47.5" cy="34.5" rx="2.6" ry="3.8" transform="rotate(28 47.5 34.5)" fill="#cf8f7b"/>
            <path d="M16 22 Q16 18 20 18 L32 18 Q36 18 36 22 L35 35 Q35 38 31 38 L21 38 Q16 38 16 34 Z" fill="#d99f8c"/>
            <ellipse cx="26" cy="18" rx="8.2" ry="2.6" fill="#cf8f7b"/>
            <path d="M16.5 16 Q26 1 35.5 15" fill="none" stroke="#d99f8c" stroke-width="4.6" stroke-linecap="round"/>
            <path d="M24 29.5 C 20.5 26.5 21.6 23.4 24 25.2 C 26.4 23.4 27.5 26.5 24 29.5 Z" fill="#a85a48"/>
          </g>
        </g>
        <g class="tip-spray">
          <circle cx="44" cy="43" r="1.5" fill="#6cc2ee" style="--mx:2px;--my:12px"/>
          <circle cx="44" cy="43" r="1.2" fill="#6cc2ee" style="--mx:6px;--my:13px;animation-delay:.3s"/>
          <circle cx="44" cy="43" r="1.3" fill="#6cc2ee" style="--mx:9px;--my:11px;animation-delay:.6s"/>
        </g>`;
      document.body.appendChild(cursor);
    }

    let tip = null;
    if (cursor) {
      tip = document.createElement('div');
      tip.className = 'ft-tip';
      tip.textContent = 'Click to grow';
      tip.setAttribute('aria-hidden', 'true');
      document.body.appendChild(tip);
    }

    const toFooter = e => {
      const r = footer.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top, r };
    };

    function nearPlant(p) {
      return plants.some(pl => {
        const bx = p.r.width * pl.xPct / 100;
        const by = pl.baseY;
        const cy = clamp(p.y, by - pl.fullH * pl.g - 8, by);
        return Math.hypot(p.x - bx, p.y - cy) < 80;
      });
    }

    const onControl = t => !!(t && t.closest && t.closest('.ft-head-btn, .ft-social, a, button'));

    let lastSpray = 0;
    const onPointerEnter = () => {
      footer.classList.add('garden-live');
      if (cursor) cursor.classList.add('on');
    };
    const onPointerLeave = () => {
      footer.classList.remove('garden-live');
      if (cursor) cursor.classList.remove('on');
      if (tip) tip.classList.remove('on');
    };
    const onPointerMove = e => {
      if (cursor) cursor.style.transform = `translate(${e.clientX - tipX}px, ${e.clientY - tipY}px)`;
      if (tip) {
        tip.style.transform = `translate(${e.clientX + 16}px, ${e.clientY + 2}px)`;
        const q = toFooter(e);
        tip.classList.toggle('on', !onControl(e.target) && nearPlant(q));
      }
      if (reduce) return;
      const now = performance.now();
      if (now - lastSpray > 120) {
        lastSpray = now;
        const p = toFooter(e);
        if (p.y < soilY(p.x / p.r.width)) emit(p.x, p.y + 6, 1, 0.5, 0.4);
      }
    };

    const onPointerDown = e => {
      if (onControl(e.target)) return;
      const p = toFooter(e);
      emit(p.x, p.y + 6, reduce ? 5 : 16, 2.6, 0.6);
      let ceil = -Infinity;
      const inner = footer.querySelector('.ft-inner');
      if (inner) ceil = inner.getBoundingClientRect().bottom - p.r.top + 18;
      plants.forEach(pl => {
        const bx = p.r.width * pl.xPct / 100;
        const by = pl.baseY;
        const cy = clamp(p.y, by - pl.fullH * pl.g - 8, by);
        const dist = Math.hypot(p.x - bx, p.y - cy);
        if (dist < 80) {
          const gCap = Math.min(pl.max, (pl.baseY - ceil) / pl.fullH);
          if (pl.g < gCap) {
            pl.g = Math.min(gCap, pl.g + rnd(0.14, 0.24));
            pl.el.style.setProperty('--g', pl.g.toFixed(3));
          } else {
            pl.el.classList.remove('bloomed');
            void pl.el.offsetWidth;
            pl.el.classList.add('bloomed');
          }
        }
      });
    };

    footer.addEventListener('pointerenter', onPointerEnter);
    footer.addEventListener('pointerleave', onPointerLeave);
    footer.addEventListener('pointermove', onPointerMove, { passive: true });
    footer.addEventListener('pointerdown', onPointerDown);

    return () => {
      window.removeEventListener('resize', relayout);
      window.removeEventListener('orientationchange', relayout);
      footer.removeEventListener('pointerenter', onPointerEnter);
      footer.removeEventListener('pointerleave', onPointerLeave);
      footer.removeEventListener('pointermove', onPointerMove);
      footer.removeEventListener('pointerdown', onPointerDown);
      if (cursor) cursor.remove();
      if (tip) tip.remove();
    };
  }, []);

  return (
    <footer className="footer" id="contact" ref={footerRef}>
      {/* Wavy crest mask */}
      <div className="ft-wavy" aria-hidden="true" />
      {/* Land artwork clipped */}
      <div className="ft-land-clip" aria-hidden="true">
        <img className="ft-land" src="/assets/footer-land.png" alt="" />
      </div>
      {/* Interactive flower garden */}
      <div className="ft-garden" aria-hidden="true" ref={gardenRef} />

      <div className="ft-inner">
        <p className="ft-sub reveal">
          From scalable backend architectures to polished, responsive web apps, I help teams build software that performs, scales smoothly, and earns user trust.
        </p>
        <h2 className="ft-head">
          <button className="ft-head-btn" type="button" onClick={onOpenContact} data-contact-open>
            Let’s build your next product
          </button>
        </h2>
      </div>

      <p className="ft-credit">Crafted &amp; Engineered by Ammar Shaikh · Surat, India @2026</p>
      <nav className="ft-social" aria-label="Social links">
        <a href="https://www.linkedin.com/in/ammar-shaikh-747897250" target="_blank" rel="noopener">LinkedIn</a>
        <a href="https://github.com/ammar3040" target="_blank" rel="noopener">GitHub</a>
        <a href="https://wa.me/919898326125" target="_blank" rel="noopener">WhatsApp</a>
        <a href="https://www.instagram.com/ammar_3040/" target="_blank" rel="noopener">Instagram</a>
      </nav>
    </footer>
  );
}
