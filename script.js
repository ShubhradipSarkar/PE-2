/* =========================================
   PRANJAL ENTERPRISES – MAIN SCRIPT
   ========================================= */

/* ── 1. LOADER ─────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    // Trigger hero reveal animations after loader
    document.querySelectorAll('#hero .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('in'), 200 + i * 160);
    });
  }, 1500);
});

/* ── 2. NAVBAR SCROLL BEHAVIOUR ────────────────────────────── */
const navbar    = document.getElementById('navbar');
const navLinks  = document.getElementById('navLinks');
const hamburger = document.getElementById('hamburger');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveNavLink();
  toggleBackToTop();
});

/* ── 3. HAMBURGER MENU ─────────────────────────────────────── */
hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close nav on link click (mobile)
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Close nav on outside click
document.addEventListener('click', e => {
  if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

/* ── 4. ACTIVE NAV LINK ON SCROLL ──────────────────────────── */
const sections = document.querySelectorAll('section[id], footer[id]');

function updateActiveNavLink() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}

/* ── 5. BACK TO TOP ────────────────────────────────────────── */
const backToTop = document.getElementById('backToTop');

function toggleBackToTop() {
  backToTop.classList.toggle('show', window.scrollY > 500);
}

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── 6. INTERSECTION OBSERVER – SCROLL ANIMATIONS ─────────── */
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

/* ── 7. COUNTER ANIMATION (STATS) ──────────────────────────── */
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start    = performance.now();

  function tick(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  }
  requestAnimationFrame(tick);
}

/* ── 8. PROPERTY FILTER ────────────────────────────────────── */
const filterBtns   = document.querySelectorAll('.filter-btn');
const propCards    = document.querySelectorAll('.prop-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    propCards.forEach(card => {
      const show = filter === 'all' || card.dataset.type === filter;
      card.style.display = show ? '' : 'none';

      // Re-trigger fade animation
      if (show) {
        card.classList.remove('visible');
        setTimeout(() => card.classList.add('visible'), 50);
      }
    });
  });
});

/* ── 9. TESTIMONIALS CAROUSEL ──────────────────────────────── */
const track    = document.getElementById('testimonialsTrack');
const dots     = document.querySelectorAll('.testi-dot');
let   current  = 0;
let   autoPlay;

function goToSlide(index) {
  current = index;
  track.style.transform = `translateX(calc(-${index * 100}% - ${index * 1.5}rem))`;
  dots.forEach((d, i) => d.classList.toggle('active', i === index));
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    goToSlide(parseInt(dot.dataset.index, 10));
    resetAutoPlay();
  });
});

function startAutoPlay() {
  autoPlay = setInterval(() => {
    goToSlide((current + 1) % dots.length);
  }, 5000);
}

function resetAutoPlay() {
  clearInterval(autoPlay);
  startAutoPlay();
}

startAutoPlay();

// Touch/swipe support for testimonials
let touchStartX = 0;
track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    goToSlide(diff > 0
      ? Math.min(current + 1, dots.length - 1)
      : Math.max(current - 1, 0));
    resetAutoPlay();
  }
});

/* ── 10. ENQUIRY MODAL ─────────────────────────────────────── */
const modal        = document.getElementById('enquiryModal');
const modalClose   = document.getElementById('modalClose');
const modalBackdrop= document.getElementById('modalBackdrop');
const modalProp    = document.getElementById('modalProp');

function openEnquiry(propertyName) {
  modalProp.textContent = propertyName;
  modal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  // Focus first input for accessibility
  setTimeout(() => modal.querySelector('input')?.focus(), 50);
}

function closeModal() {
  modal.setAttribute('hidden', '');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !modal.hasAttribute('hidden')) closeModal();
});

// Enquiry form submit
document.getElementById('enquiryForm').addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = '✓ Request Sent!';
  btn.style.background = '#2C7A4B';
  setTimeout(() => {
    closeModal();
    btn.textContent = 'Request Callback';
    btn.style.background = '';
    e.target.reset();
  }, 1800);
});

/* ── 11. CONTACT FORM ──────────────────────────────────────── */
const contactForm    = document.getElementById('contactForm');
const formSuccess    = document.getElementById('formSuccess');

contactForm.addEventListener('submit', e => {
  e.preventDefault();

  const name  = contactForm.querySelector('#name').value.trim();
  const phone = contactForm.querySelector('#phone').value.trim();
  const msg   = contactForm.querySelector('#message').value.trim();

  if (!name || !phone || !msg) {
    shakeForm(contactForm);
    return;
  }

  const submitBtn = contactForm.querySelector('button[type="submit"]');
  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;

  // Simulated async submission
  setTimeout(() => {
    submitBtn.textContent = 'Send Message';
    submitBtn.disabled = false;
    formSuccess.style.display = 'block';
    contactForm.reset();
    setTimeout(() => { formSuccess.style.display = 'none'; }, 5000);
  }, 1400);
});

function shakeForm(form) {
  form.style.animation = 'shake .4s ease';
  form.addEventListener('animationend', () => { form.style.animation = ''; }, { once: true });
}

// Add shake keyframe dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `@keyframes shake{0%,100%{transform:none}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}`;
document.head.appendChild(shakeStyle);

/* ── 12. SMOOTH SCROLL FOR ANCHOR LINKS ────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 16;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

/* ── 13. STICKY MOBILE CTA SHOW/HIDE ───────────────────────── */
const stickyMobileCTA = document.getElementById('stickyMobileCTA');
let   lastScrollY     = 0;

window.addEventListener('scroll', () => {
  const heroBottom = document.getElementById('hero').offsetTop + document.getElementById('hero').offsetHeight;
  const inFooter   = window.scrollY + window.innerHeight >= document.body.scrollHeight - 100;

  if (window.scrollY > heroBottom && !inFooter) {
    stickyMobileCTA.style.display = 'flex';
    stickyMobileCTA.setAttribute('aria-hidden', 'false');
  } else {
    stickyMobileCTA.style.display = '';
    stickyMobileCTA.setAttribute('aria-hidden', 'true');
  }
  lastScrollY = window.scrollY;
}, { passive: true });

/* ── 14. NAVBAR LOGO COLOUR FIX ON SCROLL ──────────────────── */
// Already handled by CSS .scrolled class; ensure initial state
navbar.classList.toggle('scrolled', window.scrollY > 60);

/* ── 15. INIT ───────────────────────────────────────────────── */
// Run once on page load
updateActiveNavLink();
toggleBackToTop();