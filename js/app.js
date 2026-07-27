/* ============================================
   Guia HTML5 - Interactive JavaScript v2
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initScrollProgress();
  initHeaderScroll();
  initSidebar();
  initDropdowns();
  initSearch();
  initCopyButtons();
  initBackToTop();
  initFavorites();
  initTabs();
  initQuiz();
  initScrollSpy();
  initScrollAnimations();
  initSectionReveal();
});

/* --- Theme Toggle --- */
function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcon(saved);
  }
  if (!toggle) return;
  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
  });
}

function updateThemeIcon(theme) {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;
  toggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  toggle.title = theme === 'dark' ? 'Modo claro' : 'Modo oscuro';
}

/* --- Scroll Progress Bar --- */
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}

/* --- Header Scroll Effect --- */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
}

/* --- Sidebar Navigation (Mobile) --- */
function initSidebar() {
  const toggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  if (!toggle || !sidebar) return;

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay?.classList.toggle('active');
  });

  overlay?.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  });

  sidebar.querySelectorAll('.sidebar__link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1024) {
        sidebar.classList.remove('open');
        overlay?.classList.remove('active');
      }
    });
  });
}

/* --- Dropdown Navigation --- */
function initDropdowns() {
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach(item => {
    const link = item.querySelector('.nav-link');

    // Click toggle for mobile/touch
    link.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Close other dropdowns
      navItems.forEach(other => {
        if (other !== item) other.classList.remove('open');
      });

      item.classList.toggle('open');
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item')) {
      navItems.forEach(item => item.classList.remove('open'));
    }
  });

  // Close dropdowns on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      navItems.forEach(item => item.classList.remove('open'));
    }
  });

  // Close mobile sidebar when clicking a dropdown link
  document.querySelectorAll('.nav-dropdown a').forEach(link => {
    link.addEventListener('click', () => {
      const sidebar = document.querySelector('.sidebar');
      const overlay = document.querySelector('.sidebar-overlay');
      if (sidebar) sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
      navItems.forEach(item => item.classList.remove('open'));
    });
  });
}

/* --- Search --- */
function initSearch() {
  const input = document.getElementById('search-input');
  const results = document.querySelector('.search-results');
  if (!input || !results) return;

  const sections = [];
  document.querySelectorAll('.section[id]').forEach(sec => {
    const title = sec.querySelector('.section__title');
    const text = sec.textContent || '';
    sections.push({
      id: sec.id,
      title: title ? title.textContent.trim() : sec.id,
      text: text.substring(0, 500).toLowerCase()
    });
  });

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) {
      results.classList.remove('active');
      results.innerHTML = '';
      return;
    }
    const matches = sections.filter(s => s.text.includes(q) || s.title.toLowerCase().includes(q)).slice(0, 8);
    if (matches.length === 0) {
      results.innerHTML = '<div class="search-results__empty"><i class="fas fa-search"></i>No se encontraron resultados para "' + escapeHtml(input.value.trim()) + '"</div>';
      results.classList.add('active');
      return;
    }
    results.innerHTML = matches.map(m => {
      const idx = m.text.indexOf(q);
      let excerpt = '';
      if (idx >= 0) {
        const start = Math.max(0, idx - 40);
        const end = Math.min(m.text.length, idx + q.length + 60);
        excerpt = (start > 0 ? '...' : '') + m.text.substring(start, end) + (end < m.text.length ? '...' : '');
        excerpt = excerpt.replace(new RegExp('(' + escapeRegex(q) + ')', 'gi'), '<strong>$1</strong>');
      }
      return '<div class="search-results__item" data-href="#' + m.id + '">' +
        '<div class="search-results__item-title"><i class="fas fa-file-alt" style="color:var(--color-primary);font-size:.8rem"></i> ' + highlightText(m.title, q) + '</div>' +
        (excerpt ? '<div class="search-results__item-excerpt">' + excerpt + '</div>' : '') +
        '</div>';
    }).join('');
    results.classList.add('active');

    results.querySelectorAll('.search-results__item').forEach(item => {
      item.addEventListener('click', () => {
        const href = item.getAttribute('data-href');
        window.location.hash = href;
        results.classList.remove('active');
        input.value = '';
      });
    });
  });

  input.addEventListener('blur', () => {
    setTimeout(() => results.classList.remove('active'), 200);
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      input.focus();
    }
    if (e.key === 'Escape') {
      input.blur();
      results.classList.remove('active');
    }
  });
}

function highlightText(text, query) {
  if (!query) return escapeHtml(text);
  return escapeHtml(text).replace(new RegExp('(' + escapeRegex(query) + ')', 'gi'), '<strong>$1</strong>');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* --- Copy Code Buttons --- */
function initCopyButtons() {
  document.querySelectorAll('.code-header__copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const pre = btn.closest('.code-header')?.nextElementSibling;
      if (!pre || pre.tagName !== 'PRE') return;
      const code = pre.textContent;
      navigator.clipboard.writeText(code).then(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Copiado';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = '<i class="fas fa-copy"></i> Copiar';
          btn.classList.remove('copied');
        }, 2000);
      });
    });
  });
}

/* --- Back to Top --- */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --- Favorites --- */
function initFavorites() {
  const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
  document.querySelectorAll('.fav-btn').forEach(btn => {
    const section = btn.getAttribute('data-section');
    if (favs.includes(section)) btn.classList.add('active');
    btn.addEventListener('click', () => {
      const idx = favs.indexOf(section);
      if (idx >= 0) {
        favs.splice(idx, 1);
        btn.classList.remove('active');
      } else {
        favs.push(section);
        btn.classList.add('active');
      }
      localStorage.setItem('favorites', JSON.stringify(favs));
    });
  });
}

/* --- Tabs --- */
function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabs => {
    const buttons = tabs.querySelectorAll('.tabs__btn');
    const panels = tabs.querySelectorAll('.tabs__panel');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');
        buttons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const panel = tabs.querySelector('[data-panel="' + target + '"]');
        if (panel) panel.classList.add('active');
      });
    });
  });
}

/* --- Quiz Engine --- */
function initQuiz() {
  const quizEl = document.querySelector('.quiz');
  if (!quizEl) return;

  const questions = [
    { q: '\u00BFQu\u00e9 etiqueta se usa para definir la estructura b\u00e1sica de un documento HTML5?', opts: ['<body>', '<html>', '<head>', '<meta>'], correct: 1 },
    { q: '\u00BFCu\u00e1l es la diferencia principal entre <strong>&lt;section&gt;</strong> y <strong>&lt;div&gt;</strong>?', opts: ['<section> es v\u00e1lida en HTML4', '<section> representa un grupo tem\u00e1tico de contenido', '<div> solo se usa en CSS', 'No hay diferencia'], correct: 1 },
    { q: '\u00BFQu\u00e9 tipo de contenido representa la etiqueta <strong>&lt;article&gt;</strong>?', opts: ['Contenido de soporte', 'Contenido导航', 'Contenido independiente y autocontenido', 'Contenido complementario'], correct: 2 },
    { q: '\u00BFQu\u00e9 atributo se usa para hacer que un elemento sea editable en el navegador?', opts: ['contenteditable', 'editable', 'content-modifiable', 'spellcheck'], correct: 0 },
    { q: 'La diferencia entre <strong>localStorage</strong> y <strong>sessionStorage</strong> es:', opts: ['localStorage es m\u00e1s r\u00e1pido', 'localStorage persiste, sessionStorage se borra al cerrar pesta\u00f1a', 'No hay diferencia', 'sessionStorage es m\u00e1s seguro'], correct: 1 },
    { q: '\u00BFQu\u00e9 etiqueta se usa para representar contenido que est\u00e1 temporalmente oculto?', opts: ['<hidden>', '<template>', '<toggle>', '<unused>'], correct: 1 },
    { q: 'Los <strong>Web Components</strong> se componen de:', opts: ['HTML + CSS s\u00f3lo', 'Custom Elements + Shadow DOM + HTML Templates', 'Custom Elements + React', 'Shadow DOM + jQuery'], correct: 1 },
    { q: 'La API <strong>Geolocation</strong> se accede a trav\u00e9s de:', opts: ['window.geolocation', 'navigator.geolocation', 'document.geolocation', 'location.geolocation'], correct: 1 },
    { q: '\u00BFQu\u00e9 permite hacer el m\u00e9todo <strong>fetch()</strong>?', opts: ['Hacer peticiones HTTP al servidor', 'Crear gr\u00e1ficos en Canvas', 'Manipular el DOM', 'Almacenar datos localmente'], correct: 0 },
    { q: 'Las <strong>PWA</strong> (Progressive Web Apps) permiten:', opts: ['Solo crear p\u00e1ginas est\u00e1ticas', 'Funcionar offline, ser instaladas y acceder a APIs nativas', 'Reemplazar completamente a las apps nativas', 'Solo funcionar en Chrome'], correct: 1 },
    { q: '\u00BFQu\u00e9 elemento se usa para contenido que se muestra como una nota al pie de p\u00e1gina?', opts: ['<bottom>', '<aside>', '<footer>', '<footnote>'], correct: 2 },
    { q: 'El atributo <strong>crossorigin</strong> en <code>&lt;script&gt;</code> se usa para:', opts: ['Mejorar el rendimiento', 'Controlar solicitudes CORS al cargar el archivo', 'Hacer el script invisible', 'Permitir solo scripts internos'], correct: 1 },
    { q: '\u00BFQu\u00e9 etiqueta permite definir m\u00faltiples fuentes de imagen adaptadas al dispositivo?', opts: ['<image>', '<picture>', '<responsive>', '<media>'], correct: 1 },
    { q: 'La API <strong>Canvas</strong> se usa para:', opts: ['Crear formularios', 'Dibujar gr\u00e1ficos 2D/3D con JavaScript', 'Almacenar datos', 'Crear enlaces'], correct: 1 },
    { q: '\u00BFQu\u00e9 API permite detectar cuando un elemento entra o sale del viewport?', opts: ['Viewport API', 'Scroll API', 'Intersection Observer', 'Element API'], correct: 2 }
  ];

  let current = 0;
  let score = 0;
  let answered = new Array(questions.length).fill(null);

  function render() {
    const q = questions[current];
    const pct = ((current) / questions.length) * 100;
    quizEl.innerHTML = `
      <div class="quiz__progress">
        <span><i class="fas fa-question-circle" style="color:var(--color-primary)"></i> Pregunta ${current + 1} de ${questions.length}</span>
        <span class="quiz__score"><i class="fas fa-star"></i> Puntuaci\u00f3n: ${score}/${questions.length}</span>
      </div>
      <div style="height:4px;background:var(--border-color);border-radius:4px;margin-bottom:20px;overflow:hidden;">
        <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--color-primary),var(--color-accent));border-radius:4px;transition:width 0.4s ease;"></div>
      </div>
      <div class="quiz__question">${q.q}</div>
      <div class="quiz__options">
        ${q.opts.map((opt, i) => {
          let cls = 'quiz__option';
          if (answered[current] !== null) {
            if (i === q.correct) cls += ' correct';
            else if (i === answered[current] && i !== q.correct) cls += ' incorrect';
          }
          return `<div class="${cls}" data-idx="${i}"><span style="font-weight:700;color:var(--color-primary);min-width:24px">${String.fromCharCode(65 + i)}.</span> ${opt}</div>`;
        }).join('')}
      </div>
      <div class="quiz__nav">
        ${current > 0 ? '<button class="quiz__prev"><i class="fas fa-arrow-left"></i> Anterior</button>' : ''}
        <button class="primary quiz__next">${current < questions.length - 1 ? 'Siguiente <i class="fas fa-arrow-right"></i>' : 'Ver Resultado <i class="fas fa-check"></i>'}</button>
      </div>
    `;

    quizEl.querySelectorAll('.quiz__option').forEach(opt => {
      if (answered[current] !== null) return;
      opt.addEventListener('click', () => {
        const idx = parseInt(opt.getAttribute('data-idx'));
        answered[current] = idx;
        if (idx === q.correct) score++;
        render();
      });
    });

    quizEl.querySelector('.quiz__prev')?.addEventListener('click', () => {
      if (current > 0) current--;
      render();
    });

    quizEl.querySelector('.quiz__next')?.addEventListener('click', () => {
      if (current < questions.length - 1) {
        current++;
        render();
      } else {
        renderResult();
      }
    });
  }

  function renderResult() {
    const pct = Math.round((score / questions.length) * 100);
    let msg = pct >= 80 ? '\u00a1Excelente! Dominas HTML5.' :
              pct >= 60 ? '\u00a1Buen trabajo! Sigue practicando.' :
              pct >= 40 ? 'Puedes mejorar. Revisa las secciones.' : 'Te recomendamos repasar la gu\u00eda.';
    let icon = pct >= 80 ? 'fa-trophy' : pct >= 60 ? 'fa-medal' : 'fa-book-open';
    quizEl.innerHTML = `
      <div style="text-align:center;padding:20px 0;">
        <div style="width:80px;height:80px;margin:0 auto 20px;background:linear-gradient(135deg,var(--color-primary-50),var(--color-primary-100));border-radius:50%;display:flex;align-items:center;justify-content:center"><i class="fas ${icon}" style="font-size:2rem;color:var(--color-primary)"></i></div>
        <h3 style="margin-bottom:8px;">\u00a1Quiz Completado!</h3>
        <p style="font-size:1.75rem;font-weight:800;color:var(--color-primary);margin-bottom:4px;">${score}/${questions.length} (${pct}%)</p>
        <p style="color:var(--text-secondary);margin-bottom:24px;">${msg}</p>
        <button class="primary quiz__next" style="padding:12px 32px;background:linear-gradient(135deg,var(--color-primary),var(--color-primary-dark));color:white;border:none;border-radius:var(--border-radius-sm);font-family:var(--font-body);font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:8px;box-shadow:0 4px 12px rgba(99,102,241,0.3);"><i class="fas fa-redo"></i> Reiniciar Quiz</button>
      </div>
    `;
    quizEl.querySelector('.quiz__next').addEventListener('click', () => {
      current = 0;
      score = 0;
      answered = new Array(questions.length).fill(null);
      render();
    });
  }

  render();
}

/* --- Scroll Spy for Sidebar --- */
function initScrollSpy() {
  const sections = document.querySelectorAll('.section[id]');
  const links = document.querySelectorAll('.sidebar__link');
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector('.sidebar__link[href="#' + entry.target.id + '"]');
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-80px 0px -60% 0px', threshold: 0 });

  sections.forEach(sec => observer.observe(sec));
}

/* --- Scroll Animations --- */
function initScrollAnimations() {
  const els = document.querySelectorAll('.animate-on-scroll');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

/* --- Section Reveal Animation --- */
function initSectionReveal() {
  const sections = document.querySelectorAll('.section');
  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
        entry.target.classList.remove('section-hidden');
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -60px 0px' });

  sections.forEach(sec => {
    sec.classList.add('section-hidden');
    observer.observe(sec);
  });
}

/* --- Toast Notification --- */
function showToast(msg) {
  var t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = '<i class="fas fa-check-circle"></i> ' + msg;
  document.body.appendChild(t);
  setTimeout(function(){ t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(function(){ t.remove(); }, 300); }, 2500);
}

/* --- Typography Editor Demo --- */
function wrapTypo(tag) {
  var editor = document.getElementById('typoEditor');
  var sel = window.getSelection();
  if (!sel.rangeCount || sel.isCollapsed) { showToast('Selecciona texto primero'); return; }
  var range = sel.getRangeAt(0);
  if (!editor.contains(range.commonAncestorContainer)) { showToast('Selecciona texto dentro del editor'); return; }
  var el = document.createElement(tag);
  try { range.surroundContents(el); } catch(e) { el.textContent = range.toString(); range.deleteContents(); range.insertNode(el); }
  sel.removeAllRanges();
  showToast('Texto envuelto en <' + tag + '>');
}
function clearTypo() {
  document.getElementById('typoEditor').textContent = 'Selecciona este texto y pulsa un boton para formatearlo';
}

/* --- Data Attributes Demo --- */
function showDataAttr(btn) {
  var out = document.getElementById('dataAttrOutput');
  out.style.display = 'block';
  out.textContent = 'dataset.productId  -> "' + btn.dataset.productId + '"\n' +
                    'dataset.price      -> "' + btn.dataset.price + '"\n' +
                    'dataset.category   -> "' + btn.dataset.category + '"';
  showToast('Producto ID ' + btn.dataset.productId + ' - $' + btn.dataset.price);
}

/* --- Form Validation Demo --- */
function handleDemoForm(e) {
  e.preventDefault();
  var nombre = document.getElementById('df-nombre').value.trim();
  var email = document.getElementById('df-email').value.trim();
  var mensaje = document.getElementById('df-mensaje').value.trim();
  var res = document.getElementById('form-result');
  if (!nombre || nombre.length < 3) {
    res.innerHTML = '<div style="color:#ef4444;background:rgba(239,68,68,0.1);border-radius:8px;padding:10px 14px;display:flex;align-items:center;gap:8px"><i class="fas fa-exclamation-circle"></i> El nombre debe tener al menos 3 caracteres.</div>';
    res.style.display = 'block'; return;
  }
  if (!email || !email.includes('@') || !email.includes('.')) {
    res.innerHTML = '<div style="color:#ef4444;background:rgba(239,68,68,0.1);border-radius:8px;padding:10px 14px;display:flex;align-items:center;gap:8px"><i class="fas fa-exclamation-circle"></i> El email no tiene un formato valido.</div>';
    res.style.display = 'block'; return;
  }
  if (!mensaje || mensaje.length < 10) {
    res.innerHTML = '<div style="color:#ef4444;background:rgba(239,68,68,0.1);border-radius:8px;padding:10px 14px;display:flex;align-items:center;gap:8px"><i class="fas fa-exclamation-circle"></i> El mensaje debe tener al menos 10 caracteres.</div>';
    res.style.display = 'block'; return;
  }
  res.innerHTML = '<div style="color:#22c55e;background:rgba(34,197,94,0.1);border-radius:8px;padding:10px 14px;display:flex;align-items:center;gap:8px"><i class="fas fa-check-circle"></i> Formulario valido! Hola, <strong>' + nombre + '</strong>. (Simulado)</div>';
  res.style.display = 'block';
  showToast('Formulario enviado con exito (simulado)');
}

/* --- Web Storage Demo --- */
function storageSet() {
  var key = document.getElementById('storage-key').value.trim();
  var val = document.getElementById('storage-value').value.trim();
  var out = document.getElementById('storage-output');
  if (!key) { out.textContent = 'Error: la clave no puede estar vacia'; return; }
  try {
    localStorage.setItem('html5demo_' + key, val);
    out.textContent = 'localStorage.setItem("html5demo_' + key + '", "' + val + '")\nGuardado correctamente!';
  } catch (e) { out.textContent = 'Error: ' + e.message; }
}
function storageGet() {
  var key = document.getElementById('storage-key').value.trim();
  var out = document.getElementById('storage-output');
  try {
    var val = localStorage.getItem('html5demo_' + key);
    if (val === null) { out.textContent = 'Clave "html5demo_' + key + '" no encontrada\nUsa Guardar primero'; }
    else { out.textContent = 'localStorage.getItem("html5demo_' + key + '")\n-> "' + val + '"'; }
  } catch (e) { out.textContent = 'Error: ' + e.message; }
}
function storageRemove() {
  var key = document.getElementById('storage-key').value.trim();
  var out = document.getElementById('storage-output');
  localStorage.removeItem('html5demo_' + key);
  out.textContent = 'localStorage.removeItem("html5demo_' + key + '")\nEliminado correctamente!';
}
function storageList() {
  var out = document.getElementById('storage-output');
  var keys = Object.keys(localStorage).filter(function(k){ return k.startsWith('html5demo_'); });
  if (keys.length === 0) { out.textContent = 'No hay claves de esta demo en localStorage\nGuarda algo primero'; return; }
  out.textContent = 'Claves de la demo:\n' + keys.map(function(k){ return '  "' + k + '"\n  -> "' + localStorage.getItem(k) + '"'; }).join('\n');
}

/* --- Geolocation Demo --- */
function getGeoLocation() {
  var out = document.getElementById('geo-output');
  var btn = document.getElementById('geoBtn');
  if (!navigator.geolocation) { out.textContent = 'Geolocation API no soportada'; return; }
  out.textContent = 'Solicitando permiso de ubicacion...\nPor favor acepta en el dialogo del navegador';
  btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Obteniendo...';
  navigator.geolocation.getCurrentPosition(
    function(pos) {
      var lat = pos.coords.latitude.toFixed(6);
      var lon = pos.coords.longitude.toFixed(6);
      var acc = Math.round(pos.coords.accuracy);
      var time = new Date(pos.timestamp).toLocaleTimeString('es');
      out.textContent = 'latitude:   ' + lat + '\nlongitude:  ' + lon + '\naccuracy:   +' + acc + ' metros\ntimestamp:  ' + time;
      btn.disabled = false; btn.innerHTML = '<i class="fas fa-location-crosshairs"></i> Obtener mis coordenadas';
      var link = document.getElementById('geoMapsLink');
      if (link) { link.href = 'https://www.google.com/maps?q=' + lat + ',' + lon; link.style.display = 'inline-flex'; link.textContent = 'Ver en Google Maps (' + lat + ', ' + lon + ')'; }
    },
    function(err) {
      var msgs = {1:'Permiso denegado',2:'Posicion no disponible',3:'Tiempo agotado'};
      out.textContent = 'Error: ' + (msgs[err.code] || 'Desconocido') + ' (codigo: ' + err.code + ')';
      btn.disabled = false; btn.innerHTML = '<i class="fas fa-location-crosshairs"></i> Obtener mis coordenadas';
    },
    {enableHighAccuracy:true, timeout:10000, maximumAge:0}
  );
}
function clearGeo() {
  document.getElementById('geo-output').textContent = 'Haz clic para obtener tu ubicacion';
  var link = document.getElementById('geoMapsLink'); if(link) link.style.display = 'none';
}

/* --- Canvas Demo --- */
var canvasAnimId = null;
function drawCanvas() {
  stopCanvasAnim();
  var canvas = document.getElementById('myCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  var bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#0b0f1a'); bg.addColorStop(1, '#1a1040');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(99,102,241,0.12)';
  for (var x = 25; x < W; x += 30) { for (var y = 20; y < H; y += 28) { ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI * 2); ctx.fill(); } }
  var grd = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, 90);
  grd.addColorStop(0, 'rgba(99,102,241,0.35)'); grd.addColorStop(1, 'transparent');
  ctx.fillStyle = grd; ctx.fillRect(0, 0, W, H);
  var hexData = [{x:W/2-115,c1:'#6366f1',c2:'#818cf8',l:'HTML'},{x:W/2,c1:'#8b5cf6',c2:'#a78bfa',l:'CSS'},{x:W/2+115,c1:'#06b6d4',c2:'#22d3ee',l:'JS'}];
  hexData.forEach(function(h){ drawHexagon(ctx,h.x,H/2,52,h.c1,h.c2,h.l); });
  ctx.font = 'bold 13px sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.textAlign = 'center';
  ctx.fillText('HTML5 Canvas API - dibujado con JavaScript', W/2, H-16);
}
function drawHexagon(ctx, cx, cy, r, c1, c2, label) {
  var grd = ctx.createLinearGradient(cx-r, cy-r, cx+r, cy+r);
  grd.addColorStop(0, c1); grd.addColorStop(1, c2);
  ctx.beginPath();
  for (var i = 0; i < 6; i++) { var angle = (Math.PI/3)*i - Math.PI/6; var x = cx + r*Math.cos(angle); var y = cy + r*Math.sin(angle); i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y); }
  ctx.closePath(); ctx.fillStyle = grd; ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.font = 'bold 12px sans-serif'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(label, cx, cy);
}
function animateCanvas() {
  stopCanvasAnim();
  var canvas = document.getElementById('myCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W = canvas.width, H = canvas.height, angle = 0;
  var particles = [];
  for (var i = 0; i < 35; i++) { particles.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*2.5+0.8,vx:(Math.random()-0.5)*1.2,vy:(Math.random()-0.5)*1.2,hue:Math.floor(Math.random()*60)+220}); }
  function loop() {
    ctx.clearRect(0, 0, W, H);
    var bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#0b0f1a'); bg.addColorStop(1, '#1a1040');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    particles.forEach(function(p) { p.x+=p.vx; p.y+=p.vy; if(p.x<0||p.x>W) p.vx*=-1; if(p.y<0||p.y>H) p.vy*=-1; var alpha=0.3+0.5*Math.abs(Math.sin(angle+p.x*0.01)); ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle='hsla('+p.hue+',80%,70%,'+alpha+')'; ctx.fill(); });
    [{ox:-115,c1:'#6366f1',c2:'#818cf8',l:'HTML',d:1},{ox:0,c1:'#8b5cf6',c2:'#a78bfa',l:'CSS',d:-1},{ox:115,c1:'#06b6d4',c2:'#22d3ee',l:'JS',d:1}].forEach(function(c,idx){ ctx.save(); ctx.translate(W/2+c.ox,H/2); ctx.rotate(angle*c.d*0.5); var pulse=46+Math.sin(angle*2+idx)*8; drawHexagon(ctx,0,0,pulse,c.c1,c.c2,c.l); ctx.restore(); });
    ctx.font = 'bold 12px sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillText('requestAnimationFrame - ' + Math.round(angle*10) + ' frames', W/2, H-14);
    angle += 0.025; canvasAnimId = requestAnimationFrame(loop);
  }
  loop();
}
function stopCanvasAnim() { if (canvasAnimId) { cancelAnimationFrame(canvasAnimId); canvasAnimId = null; } }
function exportCanvas() {
  var canvas = document.getElementById('myCanvas');
  if (!canvas) return;
  var link = document.createElement('a');
  link.download = 'canvas-html5.png'; link.href = canvas.toDataURL('image/png'); link.click();
  showToast('Canvas exportado como PNG');
}
window.addEventListener('load', function(){ drawCanvas(); });

/* --- Drag and Drop Demo --- */
function ddDrag(e) { e.dataTransfer.setData('text/plain', e.target.id); e.target.style.opacity = '0.5'; }
function ddAllowDrop(e) { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--color-primary)'; }
function ddDrop(e) {
  e.preventDefault();
  var id = e.dataTransfer.getData('text/plain');
  var el = document.getElementById(id);
  var zone = e.currentTarget;
  zone.style.borderColor = '';
  if (el) { el.style.opacity = '1'; var ph = zone.querySelector('span'); if(ph) ph.remove(); zone.appendChild(el); }
  ['dropZone1','dropZone2'].forEach(function(zid){ var z=document.getElementById(zid); if(z && z.querySelectorAll('.drag-item').length===0 && !z.querySelector('span')){ var sp=document.createElement('span'); sp.style.cssText='font-size:.85rem;color:var(--text-muted);align-self:center;margin:auto'; sp.textContent=zid==='dropZone1'?'Vacia':'Suelta aqui'; z.appendChild(sp); } });
}
document.addEventListener('dragend', function(){ document.querySelectorAll('#dropZone1,#dropZone2').forEach(function(z){ z.style.borderColor=''; }); document.querySelectorAll('.drag-item').forEach(function(el){ el.style.opacity='1'; }); });
function resetDragDrop() {
  var z1=document.getElementById('dropZone1'), z2=document.getElementById('dropZone2');
  if(!z1||!z2) return;
  z1.innerHTML=[{id:'d1',l:'HTML5'},{id:'d2',l:'CSS3'},{id:'d3',l:'JavaScript'},{id:'d4',l:'Canvas'}].map(function(i){return '<div class="drag-item" draggable="true" id="'+i.id+'" ondragstart="ddDrag(event)" style="padding:8px 16px;background:var(--color-primary);color:white;border-radius:8px;cursor:grab;font-size:.85rem;font-weight:600">'+i.l+'</div>';}).join('');
  z2.innerHTML='<span style="font-size:.85rem;color:var(--text-muted);align-self:center;margin:auto">Suelta aqui</span>';
}

/* --- SVG Demo --- */
function setSvgColor(fill, stroke) {
  var star = document.getElementById('svgStar');
  if (star) { star.setAttribute('fill', fill); star.setAttribute('stroke', stroke); }
  var txt = document.querySelector('#demoSvg text');
  if (txt) txt.setAttribute('fill', fill);
  var code = document.getElementById('svgColorCode');
  if (code) code.textContent = "setAttribute('fill', '" + fill + "')";
  showToast('Color SVG cambiado a ' + fill);
}

/* --- Fetch API Demo --- */
async function fetchUsers() {
  var btn=document.getElementById('fetchBtn'), status=document.getElementById('fetchStatus'), results=document.getElementById('fetchResults');
  if(btn){btn.disabled=true;btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Cargando...';}
  status.innerHTML='<i class="fas fa-globe" style="color:var(--color-info)"></i> GET https://jsonplaceholder.typicode.com/users ...';
  results.innerHTML='';
  try {
    var resp = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!resp.ok) throw new Error('HTTP '+resp.status);
    var data = await resp.json();
    status.innerHTML='<i class="fas fa-check-circle" style="color:var(--color-success)"></i> '+data.length+' usuarios cargados - Status: '+resp.status+' OK';
    results.innerHTML=data.slice(0,6).map(function(u){return '<div style="padding:10px 14px;border:1px solid var(--border-color);border-radius:8px;margin-bottom:8px;background:var(--bg-surface);display:flex;align-items:center;gap:10px"><div style="width:36px;height:36px;background:linear-gradient(135deg,var(--color-primary),var(--color-primary-dark));border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:.8rem;flex-shrink:0">'+u.name.charAt(0)+'</div><div><div style="font-weight:600;color:var(--text-heading)">'+u.name+' <span style="font-size:.8rem;color:var(--text-muted)">(@'+u.username+')</span></div><div style="font-size:.85rem;color:var(--text-secondary);margin-top:2px">'+u.email+' - '+u.website+' - '+u.address.city+'</div></div></div>';}).join('');
  } catch(e) { status.innerHTML='<i class="fas fa-exclamation-triangle" style="color:var(--color-danger)"></i> Error: '+e.message; }
  if(btn){btn.disabled=false;btn.innerHTML='<i class="fas fa-users"></i> Cargar usuarios';}
}
async function fetchPosts() {
  var status=document.getElementById('fetchStatus'), results=document.getElementById('fetchResults');
  status.innerHTML='<i class="fas fa-globe" style="color:var(--color-info)"></i> GET https://jsonplaceholder.typicode.com/posts?_limit=5 ...';
  results.innerHTML='';
  try {
    var resp = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
    var data = await resp.json();
    status.innerHTML='<i class="fas fa-check-circle" style="color:var(--color-success)"></i> '+data.length+' posts cargados - Status: '+resp.status+' OK';
    results.innerHTML=data.map(function(p){return '<div style="padding:10px 14px;border:1px solid var(--border-color);border-radius:8px;margin-bottom:8px;background:var(--bg-surface)"><div style="font-weight:600;color:var(--text-heading)"><i class="fas fa-file-alt" style="color:var(--color-primary);font-size:.8rem"></i> '+p.title.charAt(0).toUpperCase()+p.title.slice(1)+'</div><div style="font-size:.85rem;color:var(--text-secondary);margin-top:4px">'+p.body.substring(0,90)+'...</div></div>';}).join('');
  } catch(e) { status.innerHTML='<i class="fas fa-exclamation-triangle" style="color:var(--color-danger)"></i> Error: '+e.message; }
}
function clearFetch() { document.getElementById('fetchStatus').innerHTML=''; document.getElementById('fetchResults').innerHTML=''; }

/* --- ARIA Demos --- */
function toggleAriaPanel() {
  var btn=document.getElementById('ariaExpandBtn'), panel=document.getElementById('ariaPanel');
  var expanded=btn.getAttribute('aria-expanded')==='true';
  btn.setAttribute('aria-expanded',String(!expanded));
  panel.hidden=expanded;
}
function triggerLiveRegion() {
  var zone=document.getElementById('ariaLiveZone');
  var msgs=['Perfil actualizado correctamente','Tienes 3 mensajes nuevos','Tu sesion expirara en 5 minutos','Has completado el 100% del curso','Pedido #1234 enviado','Nueva notificacion de sistema'];
  zone.textContent=msgs[Math.floor(Math.random()*msgs.length)];
  showToast('Lector de pantalla anunciaria el cambio');
}
function triggerAlertDemo() {
  var zone=document.getElementById('ariaAlertZone');
  zone.textContent='';
  setTimeout(function(){ zone.textContent='Esto se anuncia INMEDIATAMENTE con role="alert", sin esperar pausa en el habla!'; }, 50);
}

/* --- Intersection Observer Scroll Demo --- */
function initScrollDemo() {
  var container=document.getElementById('scrollDemoContainer');
  if(!container) return;
  var items=container.querySelectorAll('.scroll-demo-item');
  if(!items.length) return;
  var observer=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){ entry.target.style.borderColor='var(--color-primary)'; entry.target.style.background='var(--color-primary-50,#eef2ff)'; entry.target.style.transform='scale(1.02)'; }
      else { entry.target.style.borderColor='var(--border-color)'; entry.target.style.background='var(--bg-surface)'; entry.target.style.transform='scale(1)'; }
    });
  },{root:container,threshold:0.5});
  items.forEach(function(item){observer.observe(item);});
}
window.addEventListener('load', initScrollDemo);

/* --- Web Components Demo --- */
class MiBoton extends HTMLElement {
  constructor() {
    super();
    var shadow = this.attachShadow({mode:'open'});
    var color = this.style.getPropertyValue('--btn-color') || '#6366f1';
    shadow.innerHTML = '<style>button{padding:10px 20px;background:'+color+';color:white;border:none;border-radius:8px;cursor:pointer;font-family:Inter,sans-serif;font-weight:600;font-size:.9rem;transition:all .2s}button:hover{transform:scale(1.05);box-shadow:0 4px 12px rgba(0,0,0,0.2)}</style><button><slot></slot></button>';
  }
}
customElements.define('mi-boton', MiBoton);
