/* =========================================
   PRANJAL ENTERPRISES – MAIN SCRIPT
   ========================================= */

/* ── 1. LOADER ─────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    document.querySelectorAll('#hero .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('in'), 200 + i * 160);
    });
  }, 1500);
});

/* ── 2. NAVBAR SCROLL BEHAVIOUR ────────────────────────────── */
const navbar   = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
const hamburger= document.getElementById('hamburger');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveNavLink();
  toggleBackToTop();
}, { passive: true });

/* ── 3. HAMBURGER MENU ─────────────────────────────────────── */
const navOverlay = document.getElementById('navOverlay');

function openNav() {
  navLinks.classList.add('open');
  navOverlay.classList.add('open');
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeNav() {
  navLinks.classList.remove('open');
  navOverlay.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  navLinks.classList.contains('open') ? closeNav() : openNav();
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeNav);
});

navOverlay.addEventListener('click', closeNav);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (navLinks.classList.contains('open')) closeNav();
    if (!document.getElementById('enquiryModal').hasAttribute('hidden')) closeModal();
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
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  }
  requestAnimationFrame(tick);
}

/* ── 8. PROPERTY FILTER ────────────────────────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');
const propCards  = document.querySelectorAll('.prop-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    propCards.forEach(card => {
      const show = filter === 'all' || card.dataset.type === filter;
      card.style.display = show ? '' : 'none';
      if (show) {
        card.classList.remove('visible');
        setTimeout(() => card.classList.add('visible'), 50);
      }
    });
  });
});

/* ── 9. TESTIMONIALS CAROUSEL ──────────────────────────────── */
const track   = document.getElementById('testimonialsTrack');
const dots    = document.querySelectorAll('.testi-dot');
let   current = 0;
let   autoPlay;

function goToSlide(index) {
  current = index;
  track.style.transform = 'translateX(calc(-' + (index * 100) + '% - ' + (index * 1.5) + 'rem))';
  dots.forEach((d, i) => d.classList.toggle('active', i === index));
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    goToSlide(parseInt(dot.dataset.index, 10));
    resetAutoPlay();
  });
});

function startAutoPlay() {
  autoPlay = setInterval(() => goToSlide((current + 1) % dots.length), 5000);
}
function resetAutoPlay() { clearInterval(autoPlay); startAutoPlay(); }
startAutoPlay();

let touchStartX = 0;
track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    goToSlide(diff > 0 ? Math.min(current + 1, dots.length - 1) : Math.max(current - 1, 0));
    resetAutoPlay();
  }
});

/* ── 10. ENQUIRY MODAL ─────────────────────────────────────── */
const modal         = document.getElementById('enquiryModal');
const modalClose    = document.getElementById('modalClose');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalProp     = document.getElementById('modalProp');

function openEnquiry(propertyName) {
  modalProp.textContent = propertyName;
  modal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  setTimeout(() => modal.querySelector('input')?.focus(), 50);
}

function closeModal() {
  modal.setAttribute('hidden', '');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);

document.getElementById('enquiryForm').addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Request Sent!';
  btn.style.background = '#2C7A4B';
  setTimeout(() => {
    closeModal();
    btn.textContent = 'Request Callback';
    btn.style.background = '';
    e.target.reset();
  }, 1800);
});

/* ── 11. CONTACT FORM -> WHATSAPP ──────────────────────────── */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

// Replace with the actual business WhatsApp number (country code + number, no spaces or +)
const WA_NUMBER = '916294537321';

contactForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const name  = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const msg   = document.getElementById('message').value.trim();

  // Shake and abort if any field is empty
  if (!name || !phone || !msg) {
    shakeForm(contactForm);
    return;
  }

  // Build the structured message line by line
  var lines = [];
  lines.push('*New Enquiry - Pranjal Enterprises*');
  lines.push('');
  lines.push('*Name:* ' + name);
  lines.push('*Phone:* ' + phone);
  lines.push('');
  lines.push('*Message:*');
  lines.push(msg);
  lines.push('');
  lines.push('_Sent via pranjalenterprises.in_');

  var waText = lines.join('\n');
  var waURL  = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(waText);

  // Open WhatsApp in a new tab
  window.open(waURL, '_blank', 'noopener,noreferrer');

  // Show success banner and reset form
  formSuccess.style.display = 'block';
  contactForm.reset();
  setTimeout(function() { formSuccess.style.display = 'none'; }, 6000);
});

/* ── 12. SHAKE ANIMATION ───────────────────────────────────── */
function shakeForm(form) {
  form.style.animation = 'shake .4s ease';
  form.addEventListener('animationend', () => { form.style.animation = ''; }, { once: true });
}
const shakeStyle = document.createElement('style');
shakeStyle.textContent = '@keyframes shake{0%,100%{transform:none}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}';
document.head.appendChild(shakeStyle);

/* ── 13. SMOOTH SCROLL FOR ANCHOR LINKS ────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 16;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

/* ── 14. STICKY MOBILE CTA SHOW/HIDE ───────────────────────── */
const stickyMobileCTA = document.getElementById('stickyMobileCTA');

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
}, { passive: true });

/* ── 15. INIT ───────────────────────────────────────────────── */
navbar.classList.toggle('scrolled', window.scrollY > 60);
updateActiveNavLink();
toggleBackToTop();