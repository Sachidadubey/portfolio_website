/* ─── CUSTOM CURSOR ─── */
const cur = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cur.style.left = mx + 'px';
  cur.style.top = my + 'px';
});

(function loop() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(loop);
})();

document.querySelectorAll('a, button, .sk-card, .proj-card').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovered'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovered'));
});

/* ─── SCROLL PROGRESS BAR ─── */
const bar = document.getElementById('progress');
window.addEventListener('scroll', () => {
  const p = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  bar.style.width = (p * 100) + '%';
});

/* ─── PARTICLE CANVAS BACKGROUND ─── */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, pts = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.r = Math.random() * 1.5 + 0.5;
    this.a = Math.random();
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,229,255,${this.a * 0.4})`;
    ctx.fill();
  }
}

for (let i = 0; i < 80; i++) pts.push(new Particle());

function frame() {
  ctx.clearRect(0, 0, W, H);
  pts.forEach(p => { p.update(); p.draw(); });

  // Draw connecting lines between close particles
  pts.forEach((a, i) => {
    pts.slice(i + 1).forEach(b => {
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 120) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(0,229,255,${0.12 * (1 - d / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });
  });
  requestAnimationFrame(frame);
}
frame();

/* ─── SCROLL REVEAL ─── */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('vis');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.rev, .tl-item').forEach(el => revObs.observe(el));

/* ─── ACTIVE NAV HIGHLIGHT ─── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 160) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--accent)' : '';
  });
});

/* ─── MOUSE GLOW FOLLOW ON PROJECT CARDS ─── */
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
    card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
  });
});

/* ─── TYPEWRITER EFFECT (Hero role) ─── */
const roles = ['Backend Developer', 'MERN Developer', 'API Architect', 'SaaS Builder'];
let ri = 0, ci = 0, deleting = false, wait = 0;
const roleEl = document.querySelector('.hero-sub .tag2');

if (roleEl) {
  setInterval(() => {
    if (wait > 0) { wait--; return; }
    const word = roles[ri];
    if (!deleting) {
      roleEl.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; wait = 25; }
    } else {
      roleEl.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; wait = 8; }
    }
  }, deleting ? 55 : 110);
}

/* ─── COUNTER ANIMATION (About stats) ─── */
function animCount(el, target, suffix = '') {
  let s = 0;
  const step = target / 60;
  const timer = setInterval(() => {
    s = Math.min(s + step, target);
    el.textContent = Math.floor(s) + suffix;
    if (s >= target) clearInterval(timer);
  }, 16);
}

const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.a-stat-n').forEach(n => {
        const raw = n.textContent;
        const num = parseInt(raw);
        const suf = raw.replace(/[0-9]/g, '');
        if (!isNaN(num)) animCount(n, num, suf);
      });
      countObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.about-stats').forEach(el => countObs.observe(el));
// ─── CONTACT FORM ───
function sendMsg() {
  const inputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
  let ok = true;
  inputs.forEach(i => { if (!i.value.trim()) ok = false; });
  if (!ok) { alert('Please fill all fields!'); return; }
  const btn = document.querySelector('.submit-btn');
  btn.textContent = '✓ Sent! Will get back to you soon.';
  btn.style.background = '#7c3aed';
  inputs.forEach(i => i.value = '');
  setTimeout(() => { btn.textContent = 'Send Message →'; btn.style.background = ''; }, 3000);
}
