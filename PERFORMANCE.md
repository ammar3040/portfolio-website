# Footer and section performance pass

The active site is the Next.js page in `app/page.jsx`. It loads shared custom elements from `public/js/site.js` and section interactions from `public/js/portfolio-runtime.js`. Older root HTML/CSS/JS have matching changes for local template previews.

Changes:
- Home sections use normal document scrolling instead of pinned overlapping scenes.
- Removed continuous paper-plane path sampling, work-section dimming, project scaling, testimonial fanning and paragraph word-wrap measuring from the default home experience.
- Desktop testimonials use three responsive columns; the mobile swipe layout remains.
- Disabled continuous willow/background zoom and garden sway animations.
- Removed testimonial backdrop blur and footer SVG turbulence/displacement filters.
- Footer heading is fully visible without a scroll callback.
- Garden initializes only within 200px of the footer and after the land image loads.
- Garden uses six plants on compact screens and ten on desktop, previously twenty.
- Ridge sampling uses a 144-pixel-wide canvas rather than full-resolution image pixels.
- Removed pointer-move particle emission; desktop click particles are capped at 24. Touch and reduced-motion users do not emit particles.
- Reduced the old testimonial scroll runway to 64px and fixed the garden's missing night-land URL.

Validation: active and legacy JavaScript syntax, active CSS parsing, and simulated footer initialization checks passed. Production build is blocked: Next.js is not installed, and npm dependency installation fails because registry.npmjs.org cannot resolve. GitHub operations also fail DNS resolution. Browser smoothness and screenshots require a browser-capable environment; no measured frame-rate claim is made.
