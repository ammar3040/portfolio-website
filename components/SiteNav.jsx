'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SiteNav({ onOpenContact }) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const [isNight, setIsNight] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Sync theme on mount
    const saved = localStorage.getItem('theme');
    const night = saved === 'night';
    setIsNight(night);
    document.body.classList.toggle('night', night);

    // Audio sync
    const audio = document.getElementById('audio');
    if (audio) {
      const syncAudio = () => setIsPlaying(!audio.paused && !audio.ended);
      audio.addEventListener('play', syncAudio);
      audio.addEventListener('pause', syncAudio);
      audio.addEventListener('ended', syncAudio);
      return () => {
        audio.removeEventListener('play', syncAudio);
        audio.removeEventListener('pause', syncAudio);
        audio.removeEventListener('ended', syncAudio);
      };
    }
  }, []);

  const toggleTheme = () => {
    const nextNight = !isNight;
    setIsNight(nextNight);
    const switchTheme = () => {
      document.body.classList.toggle('night', nextNight);
      localStorage.setItem('theme', nextNight ? 'night' : 'day');
      if (typeof window !== 'undefined' && window.updateNavContrast) {
        window.updateNavContrast();
      }
    };

    if (document.startViewTransition) {
      document.startViewTransition(switchTheme);
    } else {
      document.body.classList.add('theme-fading');
      switchTheme();
      setTimeout(() => document.body.classList.remove('theme-fading'), 500);
    }
  };

  const toggleAudio = () => {
    const audio = document.getElementById('audio');
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  };

  // Nav contrast & scroll behavior
  useEffect(() => {
    const nav = document.getElementById('nav');
    const navPill = document.getElementById('nav-pill');
    const heroEl = document.querySelector('.hero');
    let lastY = 0;
    let heroH = 0;

    const handleResize = () => { heroH = 0; };
    window.addEventListener('resize', handleResize, { passive: true });

    const parseColor = str => {
      const m = str && str.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const p = m[1].split(',').map(parseFloat);
      return { r: p[0], g: p[1], b: p[2], a: p[3] === undefined ? 1 : p[3] };
    };

    const relLum = ({ r, g, b }) => {
      const f = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };

    const gradientLum = bg => {
      const cols = bg.match(/rgba?\([^)]+\)/g);
      if (!cols) return null;
      let sum = 0, n = 0;
      cols.forEach(c => { const p = parseColor(c); if (p && p.a > 0.1) { sum += relLum(p); n++; } });
      return n ? sum / n : null;
    };

    const lumAt = (x, y) => {
      const stack = document.elementsFromPoint(x, y);
      for (const el of stack) {
        if (el === nav || nav.contains(el)) continue;
        if (el.dataset && el.dataset.nav) return el.dataset.nav === 'dark' ? 0 : 1;
        const cs = getComputedStyle(el);
        const bc = parseColor(cs.backgroundColor);
        if (bc && bc.a >= 0.5) return relLum(bc);
        const bg = cs.backgroundImage;
        if (bg && bg !== 'none') {
          const gl = gradientLum(bg);
          if (gl !== null) return gl;
        }
      }
      return 1;
    };

    let navRect = null;
    const updateContrast = () => {
      if (!nav) return;
      const r = navRect || (navRect = nav.getBoundingClientRect());
      if (!r.width) { navRect = null; return; }
      const y = r.top + r.height / 2;
      const xs = [r.left + 70, (r.left + r.right) / 2, r.right - 70];
      let sum = 0, n = 0;
      xs.forEach(x => { const l = lumAt(Math.max(1, Math.min(x, window.innerWidth - 1)), y); sum += l; n++; });
      const dark = (sum / n) < 0.5;
      nav.classList.toggle('nav-on-dark', dark);
      nav.classList.toggle('nav-on-light', !dark);
    };

    window.updateNavContrast = updateContrast;

    const onScroll = () => {
      if (!nav) return;
      const y = window.scrollY || window.pageYOffset || 0;
      if (heroEl && !heroH) heroH = heroEl.offsetHeight;
      const threshold = heroEl ? heroH - 320 : 40;
      nav.classList.toggle('scrolled', y > threshold);
      if (navPill) {
        if (y > 50 && y > lastY) navPill.classList.add('compact');
        else if (y < lastY) navPill.classList.remove('compact');
      }
      lastY = y;
      updateContrast();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateContrast();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', onScroll);
    };
  }, [pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  return (
    <>
      <nav id="nav" className={menuOpen ? 'menu-open' : ''}>
        <div className="nav-side">
          {!isHome ? (
            <Link href="/" className="nav-back" aria-label="Back to work">
              <svg className="nav-back-arrow" width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
                <path d="M7 1 L1 7 L7 13 M1 7 H17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Back</span>
            </Link>
          ) : (
            <>
              <img className="pin" src="/assets/imgVector.svg" alt="" width="14" height="20" />
              <span className="nav-loc">SURAT,&nbsp;INDIA</span>
            </>
          )}
        </div>

        <div className="nav-pill" id="nav-pill">
          <div className="nav-id">
            <Link className="nav-avatar" href="/" aria-label="Ammar Shaikh — home">
              <img src="/assets/ammar1.jpeg" alt="Ammar Shaikh" width="40" height="40" />
            </Link>
          </div>
          <div className="avail-tag" aria-hidden="true">
            <span className="avail-text">Available for work</span>
          </div>
          <span className="avail-dot" aria-hidden="true"></span>
          <div className="nav-links" id="nav-links-group">
            <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>Work</Link>
            <Link href="/about" className={`nav-link ${pathname === '/about' ? 'active' : ''}`}>About</Link>
            <Link href="/playground" className={`nav-link ${pathname === '/playground' ? 'active' : ''}`}>Playground</Link>
            <button type="button" className="nav-cta" onClick={onOpenContact} data-contact-open>
              <img src="/assets/imgEmail.svg" alt="" width="24" height="24" />
              Work with me
            </button>
            <button
              className="nav-burger"
              id="nav-burger"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="menu-overlay"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span></span><span></span>
            </button>
          </div>
        </div>

        <div className="nav-side right">
          <button
            className={`nav-wave ${isPlaying ? 'playing' : ''}`}
            id="nav-wave"
            type="button"
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
            aria-pressed={isPlaying}
            onClick={toggleAudio}
          >
            <svg className="nav-wave-svg" viewBox="0 0 40 40" fill="none" aria-hidden="true">
              <defs><clipPath id="navWaveClip"><circle cx="20" cy="20" r="14.5"/></clipPath></defs>
              <rect className="nav-wave-bg" width="40" height="40" rx="20"/>
              <g clipPath="url(#navWaveClip)">
                <g className="nav-wave-travel">
                  <path className="nav-wave-path" d="M-20 20 C -17.5 11.1 -12.5 11.1 -10 20 C -7.5 28.9 -2.5 28.9 0 20 C 2.5 11.1 7.5 11.1 10 20 C 12.5 28.9 17.5 28.9 20 20 C 22.5 11.1 27.5 11.1 30 20 C 32.5 28.9 37.5 28.9 40 20 C 42.5 11.1 47.5 11.1 50 20 C 52.5 28.9 57.5 28.9 60 20"/>
                </g>
              </g>
            </svg>
          </button>
          <button
            className="day-toggle"
            id="theme-toggle"
            aria-label="Toggle day / night theme"
            aria-pressed={isNight}
            onClick={toggleTheme}
          >
            <svg className="toggle-ico ico-sun" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="4" fill="currentColor"/>
              <g fill="currentColor">
                <circle cx="12" cy="3.6" r="1.15"/><circle cx="12" cy="20.4" r="1.15"/>
                <circle cx="3.6" cy="12" r="1.15"/><circle cx="20.4" cy="12" r="1.15"/>
                <circle cx="6.1" cy="6.1" r="1.15"/><circle cx="17.9" cy="6.1" r="1.15"/>
                <circle cx="6.1" cy="17.9" r="1.15"/><circle cx="17.9" cy="17.9" r="1.15"/>
              </g>
            </svg>
            <svg className="toggle-ico ico-moon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 14.2A8 8 0 1 1 10.3 4.2a6.4 6.4 0 0 0 9.7 10z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`menu-overlay ${menuOpen ? 'open' : ''}`} id="menu-overlay" role="dialog" aria-modal="true" aria-label="Menu">
        <button className="menu-close" id="menu-close" aria-label="Close menu" onClick={() => setMenuOpen(false)}></button>
        <nav>
          <ul className="menu-links">
            <li><Link href="/" className="menu-link" onClick={() => setMenuOpen(false)}><span className="num">01</span><span className="word">Work</span></Link></li>
            <li><Link href="/about" className="menu-link" onClick={() => setMenuOpen(false)}><span className="num">02</span><span className="word">About</span></Link></li>
            <li><Link href="/playground" className="menu-link" onClick={() => setMenuOpen(false)}><span className="num">03</span><span className="word">Playground</span></Link></li>
          </ul>
        </nav>
        <p className="menu-footer">SURAT, GUJARAT · INDIA</p>
      </div>
    </>
  );
}
