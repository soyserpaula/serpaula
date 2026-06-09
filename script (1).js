/*
  ============================================
  PAULA GIGENA — PORTFOLIO
  script.js
  ============================================

  Este archivo maneja:
  - Efecto de escritura del nombre en la portada
  - Navegación: scroll y menú mobile
  - Lightbox para las obras
  - Expandir/colapsar textos de investigación
  - Formulario de contacto
  - Animaciones al hacer scroll
  ============================================
*/

/* ============================================
   1. EFECTO DE ESCRITURA — PAULA GIGENA
   El nombre aparece letra por letra en la portada.
   Para cambiar el nombre: modificá la variable "nombre" abajo.
   ============================================ */
document.addEventListener('DOMContentLoaded', function () {

  const nombre = 'PAULA GIGENA';  // ← Cambiá aquí si necesitás
  const el = document.getElementById('heroNombre');

  if (el) {
    let i = 0;
    const velocidad = 95; // milisegundos entre letra y letra
    const inicio = 700;   // pausa antes de comenzar (ms)

    function escribir() {
      if (i < nombre.length) {
        // Agregamos el carácter; los espacios se muestran como espacio normal
        el.textContent += nombre[i];
        i++;
        setTimeout(escribir, velocidad);
      } else {
        // Cuando termina, agregamos la clase para quitar el cursor parpadeante
        el.classList.add('escrito');
      }
    }

    setTimeout(escribir, inicio);
  }

  // ============================================
  // 2. AÑO AUTOMÁTICO EN EL FOOTER
  // ============================================
  const yearEl = document.getElementById('footerYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ============================================
  // 3. NAVEGACIÓN — SCROLL Y MENÚ MOBILE
  // ============================================
  const nav        = document.getElementById('nav');
  const navToggle  = document.getElementById('navToggle');
  const navLinks   = document.getElementById('navLinks');
  const navItems   = document.querySelectorAll('.nav__link');

  // Clase al hacer scroll para cambiar fondo de nav
  // Si la portada es crema, el nav arranca oscuro desde el inicio
  const heroCrema = document.querySelector('.hero--crema');
  if (heroCrema) {
    nav.classList.add('nav--crema', 'nav--scroll');
  }

  window.addEventListener('scroll', function () {
    if (window.scrollY > 60) {
      nav.classList.add('nav--scroll');
    } else {
      if (!heroCrema) nav.classList.remove('nav--scroll');
    }
    actualizarNavActivo();
  }, { passive: true });

  // Menú hamburguesa (móvil)
  navToggle.addEventListener('click', function () {
    const estaAbierto = navLinks.classList.toggle('abierto');
    navToggle.classList.toggle('abierto');
    navToggle.setAttribute('aria-expanded', estaAbierto);
    // Bloquear scroll del body cuando el menú está abierto
    document.body.style.overflow = estaAbierto ? 'hidden' : '';
  });

  // Cerrar menú al hacer clic en un ítem
  navItems.forEach(function (item) {
    item.addEventListener('click', function () {
      navLinks.classList.remove('abierto');
      navToggle.classList.remove('abierto');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Marcar ítem activo según sección visible
  function actualizarNavActivo() {
    const secciones = document.querySelectorAll('section[id]');
    let actual = '';

    secciones.forEach(function (sec) {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) {
        actual = sec.getAttribute('id');
      }
    });

    navItems.forEach(function (item) {
      item.classList.remove('activo');
      if (item.getAttribute('href') === '#' + actual) {
        item.classList.add('activo');
      }
    });
  }

  // ============================================
  // 4. LIGHTBOX — OBRAS CON MÚLTIPLES FOTOS
  //
  // Cada obra tiene un atributo data-fotos con la lista
  // de todas sus imágenes. El lightbox navega entre ellas
  // con flechas o teclado. Al terminar las fotos de una
  // obra, pasa a la siguiente obra automáticamente.
  // ============================================
  const obras      = document.querySelectorAll('.obra__item');
  const lightbox   = document.getElementById('lightbox');
  const lbImg      = document.getElementById('lightboxImg');
  const lbTitulo   = document.getElementById('lightboxTitulo');
  const lbDatos    = document.getElementById('lightboxDatos');
  const lbContador = document.getElementById('lightboxContador');
  const lbClose    = document.getElementById('lightboxClose');
  const lbPrev     = document.getElementById('lightboxPrev');
  const lbNext     = document.getElementById('lightboxNext');

  // Estado actual del lightbox
  let obraActual = 0;   // índice de la obra
  let fotoActual = 0;   // índice de la foto dentro de esa obra

  // Leemos los datos de todas las obras desde el HTML
  function leerObras() {
    return Array.from(obras).map(function (el) {
      let fotos;
      try {
        fotos = JSON.parse(el.dataset.fotos || '[]');
      } catch (e) {
        fotos = [];
      }
      // Si no hay lista, usamos la imagen que ya muestra la grilla
      if (fotos.length === 0) {
        const imgSrc = el.querySelector('img')?.src || '';
        fotos = imgSrc ? [imgSrc] : [];
      }
      return {
        titulo: el.dataset.titulo || el.querySelector('.obra__titulo-obra')?.textContent || '',
        datos:  el.dataset.datos  || el.querySelector('.obra__datos')?.textContent || '',
        fotos:  fotos
      };
    });
  }

  // Muestra la foto indicada en el lightbox
  function mostrarFoto(indexObra, indexFoto) {
    const lista = leerObras();
    const obra  = lista[indexObra];
    if (!obra) return;

    // Ajustamos índices si se pasan de rango
    if (indexFoto < 0)               indexFoto = obra.fotos.length - 1;
    if (indexFoto >= obra.fotos.length) indexFoto = 0;

    obraActual = indexObra;
    fotoActual = indexFoto;

    // Transición suave
    lbImg.style.opacity = '0';
    setTimeout(function () {
      lbImg.src = obra.fotos[fotoActual];
      lbImg.alt = obra.titulo;
      lbImg.style.opacity = '1';
    }, 180);

    lbTitulo.textContent = obra.titulo;
    lbDatos.textContent  = obra.datos;

    // Contador: "2 / 4" — solo se muestra si hay más de 1 foto
    if (obra.fotos.length > 1) {
      lbContador.textContent = (fotoActual + 1) + ' / ' + obra.fotos.length;
    } else {
      lbContador.textContent = '';
    }

    // Mostramos/ocultamos flechas según si hay más fotos
    lbPrev.style.opacity = obra.fotos.length > 1 ? '1' : '0';
    lbNext.style.opacity = obra.fotos.length > 1 ? '1' : '0';
  }

  function abrirLightbox(indexObra) {
    mostrarFoto(indexObra, 0);
    lightbox.classList.add('activo');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function cerrarLightbox() {
    lightbox.classList.remove('activo');
    document.body.style.overflow = '';
    setTimeout(function () { lbImg.src = ''; }, 400);
  }

  function fotoAnterior() {
    const lista = leerObras();
    if (fotoActual > 0) {
      // Foto anterior dentro de la misma obra
      mostrarFoto(obraActual, fotoActual - 1);
    } else {
      // Si estamos en la primera foto, vamos a la obra anterior
      const obraAnterior = (obraActual - 1 + lista.length) % lista.length;
      mostrarFoto(obraAnterior, lista[obraAnterior].fotos.length - 1);
    }
  }

  function fotoSiguiente() {
    const lista = leerObras();
    const obra  = lista[obraActual];
    if (fotoActual < obra.fotos.length - 1) {
      // Siguiente foto dentro de la misma obra
      mostrarFoto(obraActual, fotoActual + 1);
    } else {
      // Si estamos en la última foto, vamos a la obra siguiente
      const obraSiguiente = (obraActual + 1) % lista.length;
      mostrarFoto(obraSiguiente, 0);
    }
  }

  // Clic en una obra de la grilla
  obras.forEach(function (obra, i) {
    obra.addEventListener('click', function () { abrirLightbox(i); });
  });

  lbClose.addEventListener('click', cerrarLightbox);
  lbPrev.addEventListener('click', fotoAnterior);
  lbNext.addEventListener('click', fotoSiguiente);

  // Cerrar al hacer clic fuera de la imagen
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) cerrarLightbox();
  });

  // Navegación con teclado
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('activo')) return;
    if (e.key === 'Escape')      cerrarLightbox();
    if (e.key === 'ArrowLeft')   fotoAnterior();
    if (e.key === 'ArrowRight')  fotoSiguiente();
  });

  // Swipe táctil en celular
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', function (e) {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? fotoSiguiente() : fotoAnterior();
    }
  }, { passive: true });

  lbImg.style.transition = 'opacity 0.18s ease';

  // Ocultar el contador "1 imágenes" en obras con una sola foto
  obras.forEach(function (obra) {
    let fotos = [];
    try { fotos = JSON.parse(obra.dataset.fotos || '[]'); } catch(e) {}
    const contador = obra.querySelector('.obra__contador');
    if (contador && fotos.length <= 1) contador.classList.add('unica');
  });

  // ============================================
  // 5. TEXTOS — EXPANDIR / COLAPSAR
  // ============================================
  const toggles = document.querySelectorAll('.texto__toggle');

  toggles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const contenido = btn.nextElementSibling; // .texto__completo
      const expandido = !contenido.hidden;

      contenido.hidden = expandido;
      btn.textContent  = expandido ? 'leer más' : 'leer menos';
      btn.setAttribute('aria-expanded', !expandido);
    });
  });

  // ============================================
  // 6. FORMULARIO DE CONTACTO
  // Por defecto muestra un mensaje de confirmación.
  // Para conectarlo con Formspree:
  //   1. Ir a formspree.io y crear una cuenta gratuita
  //   2. Crear un formulario nuevo
  //   3. En index.html, agregar al <form>:
  //      action="https://formspree.io/f/TU_CODIGO" method="POST"
  //   4. Podés dejar este JS tal cual o eliminarlo.
  // ============================================
  const form        = document.getElementById('contactForm');
  const formMensaje = document.getElementById('formMensaje');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nombre  = form.querySelector('#nombre').value.trim();
      const email   = form.querySelector('#email').value.trim();
      const mensaje = form.querySelector('#mensaje').value.trim();

      // Validación básica
      if (!nombre || !email || !mensaje) {
        formMensaje.textContent = 'Por favor completá todos los campos.';
        return;
      }

      if (!email.includes('@')) {
        formMensaje.textContent = 'El correo electrónico no es válido.';
        return;
      }

      /*
        PARA ENVIAR EL FORMULARIO REALMENTE:
        Descomentá el bloque fetch() de abajo y
        agregá tu URL de Formspree al <form action="...">.
        Podés eliminar el bloque de simulación.
      */

      // — SIMULACIÓN (borrar cuando uses Formspree) —
      formMensaje.textContent = 'Enviando…';
      setTimeout(function () {
        formMensaje.textContent = 'Mensaje enviado. Muchas gracias.';
        form.reset();
      }, 1200);

      /*
      // — CON FORMSPREE (descomentá esto) —
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
      .then(function (res) {
        if (res.ok) {
          formMensaje.textContent = 'Mensaje enviado. Muchas gracias.';
          form.reset();
        } else {
          formMensaje.textContent = 'Hubo un error. Intentá de nuevo.';
        }
      })
      .catch(function () {
        formMensaje.textContent = 'Error de conexión. Intentá de nuevo.';
      });
      */
    });
  }

  // ============================================
  // 7. ANIMACIONES AL SCROLL (fade-in)
  // Los elementos con clase .fade-in aparecen
  // suavemente al entrar al viewport.
  // ============================================
  const fadels = document.querySelectorAll(
    '.obra__item, .proyecto, .texto__item, .cv__bloque, .sobre__foto, .sobre__texto'
  );

  fadels.forEach(function (el) {
    el.classList.add('fade-in');
  });

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  fadels.forEach(function (el) {
    observer.observe(el);
  });

});
