'use client';

import { useEffect } from 'react';

export default function DotCursor() {
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!fine.matches) return;

    const dot = document.createElement('div');
    dot.className = 'dot-cursor';
    dot.setAttribute('aria-hidden', 'true');
    document.body.appendChild(dot);

    let mouseX = -100, mouseY = -100;
    let dotX = -100, dotY = -100;
    let visible = false, rafId = 0;

    const onPointerMove = e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) {
        visible = true;
        dot.classList.add('is-visible');
        dotX = mouseX;
        dotY = mouseY;
      }
    };

    const onMouseLeave = () => {
      visible = false;
      dot.classList.remove('is-visible');
    };

    const loop = () => {
      if (visible) {
        dotX += (mouseX - dotX) * 0.35;
        dotY += (mouseY - dotY) * 0.35;
        dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
      }
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(rafId);
      dot.remove();
    };
  }, []);

  return null;
}
