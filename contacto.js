/* ================================================
   contacto.js — Épure · Página de contacto
   ================================================ */

/* ─── 1. NAVBAR: scroll + mobile toggle ─── */
const header    = document.getElementById('header');
const navToggle = document.getElementById('navToggle');
const nav       = document.querySelector('nav');

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
  });
});


/* ─── 2. REVEAL de la sección de contacto ─── */
const revealEls = document.querySelectorAll('.contacto-info, .formulario, .info-list li');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('visible'), Number(delay));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach((el, i) => {
  el.classList.add('reveal');
  el.dataset.delay = i * 60;
  revealObserver.observe(el);
});


/* ─── 3. DATOS del formulario ─── */
const datos = {
  Nombre:   '',
  Apellido: '',
  Celular:  '',
  Email:    '',
  Mensaje:  '',
};


/* ─── 4. REFERENCIAS al DOM ─── */
const formulario = document.getElementById('formularioContacto');
const campos = {
  Nombre:   document.getElementById('nombre'),
  Apellido: document.getElementById('apellido'),
  Celular:  document.getElementById('celular'),
  Email:    document.getElementById('email'),
  Mensaje:  document.getElementById('mensaje'),
};
const btnEnviar = formulario.querySelector('.boton_enviar');


/* ─── 5. CONTADOR de caracteres en textarea ─── */
const maxChars  = 500;
const contador  = document.createElement('span');
contador.className = 'char-counter';
contador.textContent = `0 / ${maxChars}`;
campos.Mensaje.parentElement.appendChild(contador);

campos.Mensaje.setAttribute('maxlength', maxChars);
campos.Mensaje.addEventListener('input', () => {
  const len = campos.Mensaje.value.length;
  contador.textContent = `${len} / ${maxChars}`;
  contador.classList.toggle('char-warn', len > maxChars * 0.85);
});


/* ─── 6. VALIDACIÓN en tiempo real por campo ─── */
const reglas = {
  Nombre:   { required: true,  min: 2,  msg: 'Mínimo 2 caracteres.' },
  Apellido: { required: true,  min: 2,  msg: 'Mínimo 2 caracteres.' },
  Celular:  { required: false, pattern: /^[0-9]{7,15}$/, msg: 'Solo números (7–15 dígitos).' },
  Email:    { required: true,  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: 'Ingresa un email válido.' },
  Mensaje:  { required: true,  min: 10, msg: 'Mínimo 10 caracteres.' },
};

function validarCampo(key) {
  const el    = campos[key];
  const regla = reglas[key];
  const val   = el.value.trim();
  let error   = '';

  if (regla.required && val === '') {
    error = 'Este campo es obligatorio.';
  } else if (val !== '') {
    if (regla.min && val.length < regla.min) error = regla.msg;
    if (regla.pattern && !regla.pattern.test(val)) error = regla.msg;
  }

  // Mostrar/ocultar mensaje de error inline
  let hint = el.parentElement.querySelector('.campo-error');
  if (error) {
    if (!hint) {
      hint = document.createElement('span');
      hint.className = 'campo-error';
      el.parentElement.appendChild(hint);
    }
    hint.textContent = error;
    el.classList.add('input-error');
    el.classList.remove('input-ok');
  } else {
    if (hint) hint.remove();
    el.classList.remove('input-error');
    if (val !== '') el.classList.add('input-ok');
  }

  return error === '';
}

// Leer datos + validar al perder el foco (blur)
Object.keys(campos).forEach(key => {
  campos[key].addEventListener('input', () => {
    datos[key] = campos[key].value;
  });

  campos[key].addEventListener('blur', () => {
    validarCampo(key);
  });

  // Si ya tiene contenido y vuelve a editar, limpiar clases visuales
  campos[key].addEventListener('focus', () => {
    campos[key].classList.remove('input-ok', 'input-error');
    const hint = campos[key].parentElement.querySelector('.campo-error');
    if (hint) hint.remove();
  });
});


/* ─── 7. ENVÍO del formulario ─── */
formulario.addEventListener('submit', function (e) {
  e.preventDefault();

  // Actualizar datos por si acaso
  Object.keys(campos).forEach(key => { datos[key] = campos[key].value.trim(); });

  // Validar todos los campos
  const camposRequeridos = ['Nombre', 'Apellido', 'Email', 'Mensaje'];
  const validos = camposRequeridos.map(key => validarCampo(key));

  if (validos.includes(false)) {
    // Hacer scroll al primer campo con error
    const primerError = formulario.querySelector('.input-error');
    if (primerError) primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // Estado de carga en el botón
  btnEnviar.disabled = true;
  btnEnviar.textContent = 'Enviando...';
  btnEnviar.classList.add('btn-loading');

  // Simular envío (aquí conectarías tu backend / EmailJS / etc.)
  setTimeout(() => {
    mostrarMensajeOK('¡Mensaje enviado! Te responderemos pronto ✅');

    // Reset completo
    formulario.reset();
    Object.keys(datos).forEach(k => datos[k] = '');
    Object.keys(campos).forEach(key => {
      campos[key].classList.remove('input-ok', 'input-error');
      const hint = campos[key].parentElement.querySelector('.campo-error');
      if (hint) hint.remove();
    });
    contador.textContent = `0 / ${maxChars}`;
    contador.classList.remove('char-warn');

    btnEnviar.disabled = false;
    btnEnviar.textContent = 'Enviar mensaje';
    btnEnviar.classList.remove('btn-loading');
  }, 1400);
});


/* ─── 8. HELPERS de notificación ─── */
function mostrarMensajeOK(texto) {
  eliminarNotificacion();
  const el = document.createElement('p');
  el.className = 'MensajeOK';
  el.textContent = texto;
  formulario.appendChild(el);
  setTimeout(() => {
    el.classList.add('error-hide');
    setTimeout(() => el.remove(), 350);
  }, 3500);
}

function mostrarError(texto) {
  eliminarNotificacion();
  const el = document.createElement('p');
  el.className = 'error';
  el.textContent = texto;
  formulario.appendChild(el);
  setTimeout(() => {
    el.classList.add('error-hide');
    setTimeout(() => el.remove(), 350);
  }, 3000);
}

function eliminarNotificacion() {
  formulario.querySelectorAll('.error, .MensajeOK').forEach(n => n.remove());
}

document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-pregunta');
 
  btn.addEventListener('click', () => {
    const estaAbierto = item.classList.contains('abierto');
 
    // Cerrar todos
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('abierto');
      i.querySelector('.faq-pregunta').setAttribute('aria-expanded', 'false');
    });
 
    // Si estaba cerrado, abrir este
    if (!estaAbierto) {
      item.classList.add('abierto');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

