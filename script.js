// ============================================
//  TTT SYSTEMS — script.js
// ============================================

// ---------- NAVBAR ----------
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

// Scroll shadow
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    highlightActiveNav();
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
});

// Close menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
    });
});

// ---------- ACTIVE NAV LINK ON SCROLL ----------
function highlightActiveNav() {
    const sections  = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const top    = section.offsetTop;
        const height = section.offsetHeight;
        const id     = section.getAttribute('id');
        const link   = document.querySelector(`.nav-link[href="#${id}"]`);
        if (link) {
            link.classList.toggle('active', scrollPos >= top && scrollPos < top + height);
        }
    });
}

// ---------- SMOOTH SCROLL ----------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 72, behavior: 'smooth' });
    });
});

// ---------- SCROLL REVEAL ----------
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll(
    '.service-card, .solution-card, .about-card, .whyus-item, .contact-info-item'
).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 0.07}s`;
    revealObserver.observe(el);
});

// ---------- CONTACT FORM ----------
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        const original = btn.textContent;

        btn.textContent = 'Sending…';
        btn.disabled = true;

        // Simulate send (replace with real backend call)
        setTimeout(() => {
            btn.textContent  = '✓ Message Sent!';
            btn.style.background = '#16a34a';
            contactForm.reset();

            setTimeout(() => {
                btn.textContent  = original;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        }, 1200);
    });
}

// ---------- INIT ----------
highlightActiveNav();
console.log('%cTTT Systems', 'color:#E31E24;font-size:18px;font-weight:bold;');
console.log('%cTransforming Technology Together', 'color:#111;font-size:12px;');