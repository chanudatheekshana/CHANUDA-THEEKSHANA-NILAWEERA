/* ============================================================
   CHANUDA NILAWEERA — PERSONAL PORTFOLIO
   script.js | Interactions, Animations & Canvas Sequence
   ============================================================ */

/* ── DOM Ready ────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initStatCounters();
  initSmoothScroll();
  initActiveNavHighlight();
  initScrollImageAnimation();
  initIconOrbitAnimation();
  initEduLogoEffects();
});

/* ============================================================
   NAVBAR — shrink on scroll
   ============================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}

/* ============================================================
   MOBILE MENU — hamburger toggle
   ============================================================ */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');

  if (!hamburger || !mobileMenu) return;

  const toggleMenu = (open) => {
    hamburger.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    toggleMenu(!isOpen);
  });

  // Close on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleMenu(false);
  });
}

/* ============================================================
   FADE-IN ON SCROLL — IntersectionObserver
   ============================================================ */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after first trigger to save resources
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    }
  );

  elements.forEach(el => observer.observe(el));
}

/* ============================================================
   ANIMATED STAT COUNTERS
   ============================================================ */
function initStatCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 1800;
    const start = performance.now();

    const step = (timestamp) => {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = prefix + current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + target + suffix;
      }
    };

    requestAnimationFrame(step);
  };

  // Trigger counters when they enter view
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => observer.observe(counter));
}

/* ============================================================
   SMOOTH SCROLL — for anchor links
   ============================================================ */
function initSmoothScroll() {
  const navbarHeight = 80; // Account for fixed navbar

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ============================================================
   ACTIVE NAV HIGHLIGHT — highlight current section in nav
   ============================================================ */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const onScroll = () => {
    let current = '';
    const scrollPos = window.scrollY;

    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top + scrollPos - 140;
      if (scrollPos >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === `#${current}`) {
        link.style.color = 'var(--accent)';
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ============================================================
   SUBTLE PARALLAX on hero watermark
   ============================================================ */
const watermark = document.querySelector('.hero-watermark');
if (watermark) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    watermark.style.transform = `translate(-50%, calc(-50% + ${scrolled * 0.15}px))`;
  }, { passive: true });
}

/* ============================================================
   BACKGROUND SCROLL IMAGE SEQUENCE ANIMATION
   Sticky HTML5 Canvas from About Me down to the Website End
   ============================================================ */
function initScrollImageAnimation() {
  const canvas = document.getElementById('scroll-canvas');
  const wrapper = document.getElementById('scroll-animation-wrapper');
  const loaderBadge = document.getElementById('animation-loader');
  const loaderPercent = document.getElementById('loader-percent');

  if (!canvas || !wrapper) return;

  const ctx = canvas.getContext('2d');
  const FRAME_COUNT = 180;
  const images = [];
  let loadedCount = 0;
  let currentFrameIndex = -1;
  let targetFrameIndex = 0;
  let rafId = null;

  // Primary path and fallback path for the 180 frames
  function getImagePath(i) {
    return `images/${i}.jpg`;
  }

  function getFallbackImagePath(i) {
    const padded = String(i).padStart(3, '0');
    return `scroll animation jpg files/ezgif-frame-${padded}.jpg`;
  }

  // Preload all 180 images
  function preloadImages() {
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      const frameNum = i;

      img.onload = () => handleImageLoad();
      img.onerror = () => {
        img.src = getFallbackImagePath(frameNum);
        img.onload = () => handleImageLoad();
        img.onerror = () => handleImageLoad();
      };

      img.src = getImagePath(frameNum);
      images.push(img);
    }
  }

  function handleImageLoad() {
    loadedCount++;
    const percent = Math.round((loadedCount / FRAME_COUNT) * 100);

    if (loaderPercent) {
      loaderPercent.textContent = `${percent}%`;
    }

    // Render initial frame once available
    if (loadedCount === 1 && currentFrameIndex === -1) {
      resizeCanvas();
      drawFrame(0);
    }

    // Hide loader badge once all images are preloaded
    if (loadedCount === FRAME_COUNT) {
      if (loaderBadge) {
        loaderBadge.classList.add('hidden');
      }
      resizeCanvas();
      updateFrameOnScroll();
    }
  }

  // Draw frame with object-fit: cover scaling
  function drawFrame(index) {
    const img = images[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / imgRatio;
      offsetX = 0;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      drawHeight = canvasHeight;
      drawWidth = canvasHeight * imgRatio;
      offsetX = (canvasWidth - drawWidth) / 2;
      offsetY = 0;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }

  // Resize canvas according to device pixel ratio
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    drawFrame(currentFrameIndex >= 0 ? currentFrameIndex : 0);
  }

  // Update frame based on scroll progress through #scroll-animation-wrapper
  function updateFrameOnScroll() {
    if (images.length === 0) return;

    const rect = wrapper.getBoundingClientRect();
    const totalScroll = wrapper.offsetHeight - window.innerHeight;

    if (totalScroll <= 0) return;

    // Calculate progress: 0 when wrapper top reaches viewport top, 1 when wrapper bottom reaches viewport bottom
    const currentScroll = -rect.top;
    const progress = Math.min(Math.max(currentScroll / totalScroll, 0), 1);

    targetFrameIndex = Math.min(
      FRAME_COUNT - 1,
      Math.max(0, Math.round(progress * (FRAME_COUNT - 1)))
    );

    if (rafId === null) {
      rafId = requestAnimationFrame(render);
    }
  }

  function render() {
    rafId = null;
    if (targetFrameIndex !== currentFrameIndex) {
      drawFrame(targetFrameIndex);
      currentFrameIndex = targetFrameIndex;
    }
  }

  window.addEventListener('scroll', updateFrameOnScroll, { passive: true });
  window.addEventListener('resize', () => {
    resizeCanvas();
    updateFrameOnScroll();
  });

  // Start preloading
  preloadImages();
}

/* ============================================================
   CLOCKWISE ORBIT ANIMATION FOR 14 APP ICONS
   Rotates the 14 icons slowly clockwise along the red line
   ============================================================ */
function initIconOrbitAnimation() {
  const path = document.getElementById('orbit-track-path');
  const icons = document.querySelectorAll('.orbit-icon');
  const trackWrap = document.getElementById('orbit-track-wrap');

  if (!path || icons.length === 0) return;

  const totalLength = path.getTotalLength();
  const count = icons.length;
  const viewBoxWidth = 1000;
  const viewBoxHeight = 1250;
  const SAMPLES = 2000;
  const points = [];

  // Precompute points along the path for ultra-smooth 60/120fps rendering
  for (let i = 0; i < SAMPLES; i++) {
    const distance = (i / SAMPLES) * totalLength;
    const pt = path.getPointAtLength(distance);
    points.push({
      x: (pt.x / viewBoxWidth) * 100,
      y: (pt.y / viewBoxHeight) * 100
    });
  }

  // Duration for one complete clockwise rotation (in milliseconds)
  const DURATION = 38000; // 38 seconds: slow, graceful, and smooth
  let currentOffset = 0;
  let lastTime = performance.now();
  let isHovered = false;

  function updateOrbit(now) {
    const delta = now - lastTime;
    lastTime = now;

    // Slow down to 15% speed when user hovers over an icon or the photo
    const speed = isHovered ? 0.15 : 1.0;
    currentOffset = (currentOffset + (delta * speed) / DURATION) % 1;

    for (let i = 0; i < count; i++) {
      // Space the 14 icons evenly along the 100% path perimeter
      const iconProgress = (currentOffset + (i / count)) % 1;
      const sampleIdx = Math.floor(iconProgress * SAMPLES) % SAMPLES;
      const pt = points[sampleIdx];

      icons[i].style.left = `${pt.x}%`;
      icons[i].style.top = `${pt.y}%`;
    }

    requestAnimationFrame(updateOrbit);
  }

  // Hover interactions
  if (trackWrap) {
    trackWrap.addEventListener('mouseenter', () => { isHovered = true; });
    trackWrap.addEventListener('mouseleave', () => { isHovered = false; });
  }

  // Initialize icon positions immediately
  for (let i = 0; i < count; i++) {
    const iconProgress = (i / count) % 1;
    const sampleIdx = Math.floor(iconProgress * SAMPLES) % SAMPLES;
    const pt = points[sampleIdx];
    icons[i].style.left = `${pt.x}%`;
    icons[i].style.top = `${pt.y}%`;
  }

  // Start animation loop
  requestAnimationFrame(updateOrbit);
}

/* ============================================================
   COOL CLICK ANIMATION FOR EDUCATION LOGOS
   ============================================================ */
function initEduLogoEffects() {
  const logoLinks = document.querySelectorAll('.edu-logo-link');
  logoLinks.forEach(link => {
    link.addEventListener('click', function () {
      this.classList.remove('clicked');
      // Trigger DOM reflow to restart animation
      void this.offsetWidth;
      this.classList.add('clicked');
      setTimeout(() => {
        this.classList.remove('clicked');
      }, 700);
    });
  });
}


