document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollSpy();
  initOfferCarousel();
  initCurrentYear();
});

/* ---------------------------------------------------------
   1. Set Tahun Otomatis di Footer
   --------------------------------------------------------- */
function initCurrentYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ---------------------------------------------------------
   2. Mobile Navigation Drawer Toggle
   --------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('navToggle');
  const nav = document.getElementById('navMenu');

  if (!toggleBtn || !nav) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggleBtn.classList.toggle('is-open', isOpen);
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
  });

  // Tutup menu saat salah satu link diklik
  nav.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggleBtn.classList.remove('is-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------------------------------------------------------
   3. ScrollSpy (Active Navigation Link on Scroll)
   --------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          link.classList.toggle('is-active', href === `#${entry.target.id}`);
        });
      }
    });
  }, { 
    rootMargin: '-30% 0px -50% 0px', 
    threshold: 0 
  });

  sections.forEach((sec) => observer.observe(sec));
}

/* ---------------------------------------------------------
   4. Offer Section Infinite Carousel
   --------------------------------------------------------- */
function initOfferCarousel() {
  const offerData = [
    { icon: 'fa-solid fa-code', title: 'Web Development' },
    { icon: 'fa-solid fa-mobile-screen-button', title: 'App Development' },
    { icon: 'fa-solid fa-layer-group', title: 'Full Stack Developer' },
    { icon: 'fa-solid fa-brain', title: 'Artificial Intelligence' }
  ];

  const cardsContainer = document.getElementById('offerCards');
  const dotsContainer = document.getElementById('offerDots');
  const prevBtn = document.getElementById('offerPrev');
  const nextBtn = document.getElementById('offerNext');

  if (!cardsContainer || !dotsContainer) return;

  let currentIndex = 0;
  const total = offerData.length;

  // Render 3 slot kartu tetap
  cardsContainer.innerHTML = `
    <div class="offer-card"></div>
    <div class="offer-card is-active"></div>
    <div class="offer-card"></div>
  `;

  // Render indikator dots sesuai jumlah data
  dotsContainer.innerHTML = '';
  offerData.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => {
      currentIndex = i;
      updateCarousel();
    });
    dotsContainer.appendChild(dot);
  });

  const cardSlots = cardsContainer.querySelectorAll('.offer-card');
  const dotBtns = dotsContainer.querySelectorAll('button');

  // Update Tampilan Carousel & Indikator Active
  function updateCarousel() {
    const prevIdx = (currentIndex - 1 + total) % total;
    const currIdx = currentIndex;
    const nextIdx = (currentIndex + 1) % total;

    const indices = [prevIdx, currIdx, nextIdx];

    // Perbarui isi 3 slot kartu yang tampil di layar
    cardSlots.forEach((card, i) => {
      const data = offerData[indices[i]];
      card.innerHTML = `
        <div class="offer-card__icon"><i class="${data.icon}"></i></div>
        <h3>${data.title}</h3>
      `;

      // Tambahkan/Hapus status aktif pada kartu tengah
      card.classList.toggle('is-active', i === 1);

      // Klik kartu samping langsung menggeser kartu tersebut ke posisi tengah
      card.onclick = () => {
        currentIndex = indices[i];
        updateCarousel();
      };
    });

    // Perbarui status aktif tombol dot
    dotBtns.forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === currentIndex);
    });
  }

  // Event Listener Navigasi Panah
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + total) % total;
      updateCarousel();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % total;
      updateCarousel();
    });
  }

  // Inisialisasi awal
  updateCarousel();
}