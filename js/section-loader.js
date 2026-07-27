/* ============================================
   Section Loader - Dynamic Section Loading
   ============================================
   Loads section content from individual HTML files
   into placeholder divs in index.html.

   To add a new section:
   1. Create sections/XX-name.html with <section class="section" id="your-id"> content
   2. Add <div class="section-placeholder" id="your-id" data-section="sections/XX-name.html"></div> in index.html
   3. Add nav links in sidebar + header dropdown
   ============================================ */

(function() {
  'use strict';

  async function loadSection(placeholder) {
    const file = placeholder.getAttribute('data-section');
    if (!file) return;

    try {
      const resp = await fetch(file);
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const html = await resp.text();

      const temp = document.createElement('div');
      temp.innerHTML = html;

      const section = temp.querySelector('section');
      if (!section) throw new Error('No <section> found in ' + file);

      placeholder.replaceWith(section);
    } catch (err) {
      console.error('Error loading section: ' + file, err);
      placeholder.innerHTML =
        '<section class="section" id="' + placeholder.id + '">' +
        '<div class="section__header"><span class="section__number"><i class="fas fa-exclamation-triangle"></i> Error</span>' +
        '<h2 class="section__title"><i class="fas fa-exclamation-triangle"></i> Error al cargar</h2>' +
        '<p class="section__subtitle">No se pudo cargar: ' + file + '</p></div>' +
        '<div style="padding:20px;text-align:center;color:var(--text-muted)">' +
        '<p>' + err.message + '</p>' +
        '<button onclick="location.reload()" style="margin-top:12px;padding:8px 16px;border:1px solid var(--border-color);border-radius:6px;background:var(--bg-card);color:var(--text-primary);cursor:pointer">Reintentar</button>' +
        '</div></section>';
    }
  }

  async function loadAllSections() {
    const placeholders = document.querySelectorAll('.section-placeholder');
    if (placeholders.length === 0) return;

    const loadPromises = Array.from(placeholders).map(ph => loadSection(ph));
    await Promise.all(loadPromises);

    document.dispatchEvent(new CustomEvent('sectionsLoaded'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAllSections);
  } else {
    loadAllSections();
  }
})();
