// ============================================
//  TTT SYSTEMS — CYBERPUNK EDITION
//  script.js — Interactive Animations
// ============================================

// ===== CUSTOM CURSOR =====
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

let mouseX = 0;
let mouseY = 0;
let ringX = 0;
let ringY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
});

function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    
    requestAnimationFrame(animateRing);
}
animateRing();

// Cursor hover effects
const hoverElements = document.querySelectorAll('a, button, .service-card, .solution-card');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorDot.style.transform = 'scale(2)';
        cursorRing.style.transform = 'scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
        cursorDot.style.transform = 'scale(1)';
        cursorRing.style.transform = 'scale(1)';
    });
});

// ===== PARTICLE CANVAS =====
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const particles = [];
const particleCount = 80;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = Math.random() > 0.5 ? 'rgba(255, 0, 64, 0.6)' : 'rgba(0, 240, 255, 0.6)';
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
    }
}

function initParticles() {
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
            const dx = particles[a].x - particles[b].x;
            const dy = particles[a].y - particles[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
                ctx.strokeStyle = `rgba(0, 240, 255, ${1 - distance / 120})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    connectParticles();
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    highlightActiveNav();
});

// Mobile menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
});

// Close menu on link click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
    });
});

// Active nav highlight
function highlightActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        
        if (link) {
            if (scrollPos >= top && scrollPos < top + height) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        
        e.preventDefault();
        window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
        });
    });
});

// ===== ANIMATED COUNTERS =====
const statNums = document.querySelectorAll('.stat-num');
let countStarted = false;

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    if (!target) return;
    
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !countStarted) {
            countStarted = true;
            statNums.forEach(stat => {
                if (stat.hasAttribute('data-target')) {
                    animateCounter(stat);
                }
            });
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

const revealElements = document.querySelectorAll(
    '.service-card, .solution-card, .about-content, .about-visual, .contact-info, .contact-form-wrapper'
);

revealElements.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
});

// ===== GLITCH TEXT EFFECT =====
function glitchEffect(element) {
    const text = element.textContent;
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    
    let iterations = 0;
    const interval = setInterval(() => {
        element.textContent = text
            .split('')
            .map((char, index) => {
                if (index < iterations) {
                    return text[index];
                }
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');
        
        if (iterations >= text.length) {
            clearInterval(interval);
        }
        iterations += 1/3;
    }, 30);
}

// Apply glitch to titles on scroll
const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            glitchEffect(entry.target);
            titleObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.section-title').forEach(title => {
    titleObserver.observe(title);
});

// ===== SERVICE CARDS TILT EFFECT =====
const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.querySelector('.btn-content').textContent;
        
        // Animate button
        btn.querySelector('.btn-content').textContent = 'TRANSMITTING...';
        btn.disabled = true;
        btn.style.opacity = '0.6';
        
        // Simulate sending (replace with actual backend call)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Success state
        btn.querySelector('.btn-content').textContent = '✓ MESSAGE SENT';
        btn.style.background = '#27C93F';
        btn.style.borderColor = '#27C93F';
        btn.style.boxShadow = '0 0 30px rgba(39, 201, 63, 0.6)';
        
        contactForm.reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
            btn.querySelector('.btn-content').textContent = originalText;
            btn.style.background = '';
            btn.style.borderColor = '';
            btn.style.boxShadow = '';
            btn.style.opacity = '';
            btn.disabled = false;
        }, 3000);
    });
}

// ===== TYPING EFFECT FOR HERO =====
const heroSub = document.querySelector('.hero-sub');
if (heroSub) {
    const text = heroSub.textContent;
    heroSub.textContent = '';
    
    let charIndex = 0;
    function typeText() {
        if (charIndex < text.length) {
            heroSub.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(typeText, 30);
        }
    }
    
    setTimeout(typeText, 1000);
}

// ===== PARALLAX SCROLL EFFECT =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    const heroCircuit = document.querySelector('.hero-circuit');
    const heroHologram = document.querySelector('.hero-hologram');
    
    if (heroCircuit) {
        heroCircuit.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
    
    if (heroHologram) {
        heroHologram.style.transform = `translateY(${scrolled * 0.2}px) rotate(${scrolled * 0.05}deg)`;
    }
});

// ===== SOLUTION CARDS HOVER EFFECT =====
const solutionCards = document.querySelectorAll('.solution-card');

solutionCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const hex = card.querySelector('.solution-hex');
        if (hex) {
            hex.style.transform = 'scale(1.2) rotate(360deg)';
            hex.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        }
    });
    
    card.addEventListener('mouseleave', () => {
        const hex = card.querySelector('.solution-hex');
        if (hex) {
            hex.style.transform = '';
        }
    });
});

// ===== MAGNETIC BUTTON EFFECT =====
const cyberBtns = document.querySelectorAll('.cyber-btn');

cyberBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

// ===== TERMINAL TYPING EFFECT =====
const terminalLines = document.querySelectorAll('.terminal-line');

terminalLines.forEach((line, index) => {
    const cmd = line.querySelector('.line-cmd');
    if (cmd) {
        const text = cmd.textContent;
        cmd.textContent = '';
        
        setTimeout(() => {
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < text.length) {
                    cmd.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typeInterval);
                }
            }, 50);
        }, index * 800);
    }
});

// ===== PAGE LOAD ANIMATION =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ===== CONSOLE SIGNATURE =====
console.log('%c┌─────────────────────────────────┐', 'color: #FF0040; font-weight: bold;');
console.log('%c│  TTT SYSTEMS - CYBERPUNK v2.0  │', 'color: #00F0FF; font-weight: bold; font-size: 14px;');
console.log('%c└─────────────────────────────────┘', 'color: #FF0040; font-weight: bold;');
console.log('%cTRANSFORMING_TECHNOLOGY_TOGETHER', 'color: #8892B0; font-size: 10px; letter-spacing: 2px;');
console.log('%c> SYSTEM_STATUS: ONLINE', 'color: #27C93F; font-weight: bold;');
console.log('%c> ALL_PROTOCOLS: ACTIVE', 'color: #00F0FF;');

// ===== PERFORMANCE MONITORING =====
if (window.performance) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`%c⚡ Page loaded in ${pageLoadTime}ms`, 'color: #FFFC00; font-weight: bold;');
        }, 0);
    });
}

// ===== INIT =====
highlightActiveNav();

// Prevent console errors on mobile
if (!('ontouchstart' in window)) {
    // Desktop-only code
}

// Debug mode
const debugMode = false;
if (debugMode) {
    console.log('Debug mode enabled');
    document.addEventListener('click', (e) => {
        console.log('Clicked:', e.target);
    });
}