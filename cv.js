/* ============================================================
   CV PAGE JAVASCRIPT — cv.js
   ============================================================ */

(function () {
  'use strict';

  // ── Fade-up on scroll ──────────────────────────────────────
  const fadeEls = document.querySelectorAll('.fade-in');
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08 }
  );
  fadeEls.forEach(el => io.observe(el));

  // ── Navbar scroll effect ───────────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }

  // ── Hide loading overlays when iframes load ────────────────
  function setupLoader(iframeId, loaderId) {
    const iframe = document.getElementById(iframeId);
    const loader = document.getElementById(loaderId);
    if (!iframe || !loader) return;

    iframe.addEventListener('load', () => {
      loader.classList.add('hidden');
      setTimeout(() => { if (loader.parentNode) loader.remove(); }, 600);
    });

    // Fallback: hide after 5s in case the load event doesn't fire (e.g., PDF in some browsers)
    setTimeout(() => loader.classList.add('hidden'), 5000);
  }

  setupLoader('iframe-standard', 'loading-standard');
  setupLoader('iframe-ats',      'loading-ats');

  // ── Ripple effect on download buttons ─────────────────────
  // Inject keyframes
  const style = document.createElement('style');
  style.textContent = '@keyframes cvRipple { to { transform: scale(3); opacity: 0; } }';
  document.head.appendChild(style);

  document.querySelectorAll('.btn-cv-download').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect  = this.getBoundingClientRect();
      const size  = 80;
      const x     = e.clientX - rect.left - size / 2;
      const y     = e.clientY - rect.top  - size / 2;

      const ripple = document.createElement('span');
      ripple.style.cssText = [
        'position:absolute',
        'border-radius:50%',
        'background:rgba(255,255,255,0.3)',
        width:px,
        height:px,
        left:px,
        	op:px,
        'transform:scale(0)',
        'animation:cvRipple 0.55s ease-out forwards',
        'pointer-events:none',
      ].join(';');

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

})();
