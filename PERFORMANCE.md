# Animation-preserving performance pass

The active Next.js page loads `public/js/bootstrap.js`, `public/js/site.js`, and `public/js/portfolio-runtime.js`. Legacy HTML/CSS/JS previews have matching changes.

Restored the reference ZIP’s pinned section transitions, hero scroll scaling, paragraph reveal, plane flight, project scaling, testimonial fan, ambient sway/zoom, and footer heading growth. The static `smooth-sections` mode now applies only when the browser requests reduced motion.

Performance work preserves animations:
- The shared requestAnimationFrame scheduler pauses hero, project reveal, testimonial fan, and footer heading callbacks outside a 160px viewport margin, and refreshes them on re-entry.
- Project reveals measure only rows on desktop and individual tiles on mobile.
- Existing plane lookup tables, cached geometry, unchanged-value write guards, off-screen ambient pausing, and deferred video playback remain.
- Lazy garden initialization, smaller ridge sampling, and capped particles remain.

Removed the portrait icon from the introduction. Raised the hero headline and mobile heading above the sun/cloud layers.

Validation: JavaScript syntax checks, scheduler behavior checks (batched frames, off-screen pause, re-entry, unscoped callbacks), and production Next.js build passed. Browser animation smoothness and frame rates have not been measured.
