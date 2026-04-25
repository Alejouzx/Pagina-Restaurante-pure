document.addEventListener('DOMContentLoaded', () => {

/* ─── 1. NAVBAR ─── */
const header     = document.getElementById('header');
const navToggle  = document.getElementById('navToggle');
const nav        = document.querySelector('nav');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
});

navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
  navToggle.textContent = isOpen ? '✕' : '☰';
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle.textContent = '☰';
    navToggle.setAttribute('aria-expanded', false);
  });
});


/* ─── 2. REVEAL SCROLL ─── */
const revealEls = document.querySelectorAll('.card, .section-header, .reservas-text, .grid-galeria img');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const delay = (entry.target.dataset.delay || 0);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach((el, i) => {
  el.classList.add('reveal');
  el.dataset.delay = (i % 4) * 80;
  revealObserver.observe(el);
});


/* ─── 3. CONTADORES ─── */
function animarContador(el) {
  const target  = parseInt(el.dataset.target, 10);
  const duracion = 1600;
  const inicio  = performance.now();

  function step(ahora) {
    const progreso = Math.min((ahora - inicio) / duracion, 1);
    const ease = 1 - Math.pow(1 - progreso, 3);
    const valor = Math.floor(ease * target);

    el.textContent = target >= 1000
      ? valor.toLocaleString('es-CO')
      : valor;

    if (progreso < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(animarContador);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

const historiaStats = document.querySelector('.historia-stats');
if (historiaStats) statsObserver.observe(historiaStats);


/* ─── 4. PLATO ESTRELLA ─── */
(function () {
  const escena = document.getElementById('peEscena');
  if (!escena) return;

  const ings = escena.querySelectorAll('.pe-ingrediente');

  function getFactor() {
    return window.innerWidth <= 640 ? 150 : 270;
  }

  function explotar() {
    const f = getFactor();
    ings.forEach(el => {
      const px = parseFloat(el.dataset.posX) / 100;
      const py = parseFloat(el.dataset.posY) / 100;
      el.style.transform = `translate(calc(-50% + ${px * f}px), calc(-50% + ${py * f}px))`;
    });
    escena.classList.add('exploded');
  }

  function ensamblar() {
    ings.forEach(el => {
      el.style.transform = 'translate(-50%, -50%)';
    });
    escena.classList.remove('exploded');
  }

  escena.addEventListener('mouseenter', explotar);
  escena.addEventListener('mouseleave', ensamblar);

  let explodedMobile = false;
  escena.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (!explodedMobile) {
      explotar();
      explodedMobile = true;
    } else {
      ensamblar();
      explodedMobile = false;
    }
  }, { passive: false });

})();


/* ─── 5. SPOTLIGHT ─── */
const spotlight = document.createElement('div');
spotlight.className = 'spotlight';
document.body.appendChild(spotlight);

window.addEventListener('mousemove', (e) => {
  spotlight.style.setProperty('--x', `${e.clientX}px`);
  spotlight.style.setProperty('--y', `${e.clientY}px`);
});


/* ─── 6. VAPOR ─── */
function crearVapor(card) {
  const vapor = document.createElement('div');
  vapor.className = 'vapor';
  card.appendChild(vapor);

  setInterval(() => {
    const humo = document.createElement('span');
    humo.className = 'humo';
    humo.style.left = Math.random() * 60 + 20 + '%';
    vapor.appendChild(humo);
    setTimeout(() => humo.remove(), 4000);
  }, 900);
}

document.querySelectorAll('.card.caliente').forEach(crearVapor);


/* ─── 7. RIPPLE ─── */
document.querySelectorAll('.btn-pedir').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';

    const rect = btn.getBoundingClientRect();
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;

    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});


/* ─── 8. SECCIONES FADE ─── */
const sections = document.querySelectorAll('section');

const blurObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('section-visible');
    }
  });
}, { threshold: 0.2 });

sections.forEach(sec => {
  sec.classList.add('section-hidden');
  blurObserver.observe(sec);
});


/* ─── 9. ANIMACIÓN FLOTANTE ─── */
function animacionFlotante(ingrediente, i) {
  const baseX = parseFloat(ingrediente.dataset.posX);
  const baseY = parseFloat(ingrediente.dataset.posY);

  setInterval(() => {
    const offsetX = (Math.random() - 0.5) * 20;
    const offsetY = (Math.random() - 0.5) * 20;

    ingrediente.style.transform = `
      translate(calc(-50% + ${baseX * 2 + offsetX}px),
                calc(-50% + ${baseY * 2 + offsetY}px))
      rotate(${offsetX}deg)
    `;
  }, 2000 + i * 200);
}

document.querySelectorAll('.pe-ingrediente').forEach(animacionFlotante);

});