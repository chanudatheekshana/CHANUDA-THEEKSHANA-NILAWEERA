/* ============================================================
   CHANUDA NILAWEERA — PORTFOLIO DETAIL PAGES
   details.js | Lightbox, Smooth Transitions & Interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initLightbox();
});

function initLightbox() {
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const modalCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const galleryCards = document.querySelectorAll('.gallery-card');

  if (!modal || !modalImg) return;

  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('.gallery-img');
      const caption = card.querySelector('.gallery-caption');

      if (!img) return;

      modalImg.src = img.src;
      modalImg.alt = img.alt || 'Full size preview';
      
      if (modalCaption) {
        modalCaption.textContent = caption ? (caption.getAttribute('data-full-caption') || caption.innerText) : '';
      }

      modal.style.display = 'flex';
      setTimeout(() => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }, 10);
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.style.display = 'none';
      modalImg.src = '';
      document.body.style.overflow = '';
    }, 300);
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('lightbox-content-box')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}
