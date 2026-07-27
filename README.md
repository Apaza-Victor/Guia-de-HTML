# Guia de HTML5

Guia completa de HTML5 con diseno moderno, interfaz renovada, animaciones, submenus desplegables y demos interactivas. Arquitectura modular con secciones en archivos separados.

## Caracteristicas

- **Arquitectura modular** - 49 secciones en archivos HTML separados bajo `sections/`
- **Header con submenus desplegables** - Navegacion organizada por categorias
- **225+ iconos Font Awesome** - Iconografia profesional en toda la interfaz
- **Animaciones en secciones** - Bordes gradientes animados, fondo con formas flotantes
- **Tarjetas con efecto glassmorphism** - Cada seccion como tarjeta moderna
- **Fondos animados** - Hero con formas flotantes y gradientes animados
- **Modo oscuro / modo claro** - Toggle con persistencia en localStorage
- **Barra de progreso** - Indicador visual de scroll con gradiente
- **Busqueda rapida** - Con Ctrl+K y dropdown de resultados
- **Favoritos** - Guarda secciones favoritas en localStorage
- **Scroll animations** - Secciones que aparecen al hacer scroll
- **Responsive** - Adaptado para movil, tablet y escritorio (desde 368px)
- **49 secciones** que cubren HTML5 desde basico hasta APIs modernas
- **18 demos interactivas** para practicar en el navegador
- **63 recursos** organizados en 9 categorias colapsables
- **Quiz** con 15 preguntas en formato colapsable
- **Glosario** con 25 terminos clave

## Estructura del Proyecto

```
Guia-de-HTML/
  index.html                  # Shell principal (350 lineas)
  css/styles.css              # Estilos completos (~1900 lineas)
  js/app.js                   # Funcionalidad interactiva
  js/section-loader.js        # Carga dinamica de secciones via fetch
  sections/
    00-intro.html             # Seccion 00
    01-estructura-basica.html # Seccion 01
    ...
    48-quiz.html              # Seccion 48
  assets/                     # Archivos estaticos (reservado)
  README.md
```

### Como funciona la carga de secciones

1. `index.html` contiene placeholders: `<div class="section-placeholder" id="intro" data-section="sections/00-intro.html"></div>`
2. `section-loader.js` busca todos los placeholders y carga cada archivo via `fetch()`
3. Una vez cargadas todas las secciones, se dispara el evento `sectionsLoaded`
4. `app.js` inicializa search, scroll-spy, quiz, demos y demas funcionalidades

### Para agregar una nueva seccion

1. Crea el archivo `sections/XX-nombre-seccion.html`:
```html
<!-- SECCION XX: NOMBRE -->
<section class="section" id="mi-seccion">
  <div class="section__header">
    <span class="section__number"><i class="fas fa-icon"></i> Seccion XX</span>
    <h2 class="section__title"><i class="fas fa-icon"></i> Titulo</h2>
  </div>
  <!-- contenido -->
</section>
```

2. Agrega en `index.html` dentro de `<div class="content">`:
```html
<div class="section-placeholder" id="mi-seccion" data-section="sections/XX-nombre-seccion.html"></div>
```

3. Agrega links de navegacion en el sidebar y header dropdown

## Estructura de Navegacion

### Sidebar y Header Dropdown
- **Introduccion**: Introduccion, Estructura Basica
- **Fundamentos**: Semantica, Tipografia, Enlaces, Multimedia, Iframes, Listas, Tablas, Formularios, Formularios Avanzados
- **Avanzado**: Atributos Globales, Meta Tags y SEO, Etiquetas Extra, Seguridad HTML
- **APIs de JavaScript**: Web Storage, Geolocation, Canvas, Drag and Drop, SVG, Web Workers y Fetch, WebSockets, Clipboard API, Web Share, Notifications, Fullscreen, Wake Lock, History API, IndexedDB, Observers
- **Modern Web**: Accesibilidad ARIA, Microdatos, Details y Dialog, Web Components, PWA, Service Workers, Multimedia Avanzado, Web Fonts, Performance, Intersection Observer
- **Extras**: CSS3, JavaScript Basico, HTML Living Standard, Pointer Events y Touch, HTML en Moviles, Herramientas, Recursos, Glosario, Quiz

## Secciones

| # | Seccion | Archivo | Contenido |
|---|---------|---------|-----------|
| 00 | Introduccion a HTML5 | `00-intro.html` | Que es HTML5, historial, compatible |
| 01 | Estructura Basica | `01-estructura-basica.html` | DOCTYPE, head, body, nesting |
| 02 | Etiquetas Semanticas | `02-semantica.html` | header, nav, main, article, section, footer |
| 03 | Texto y Tipografia | `03-tipografia.html` | h1-h6, p, blockquote, mark, time, code |
| 04 | Enlaces y Rutas | `04-enlaces.html` | a, href, target, rel, rutas absolutas/relativas |
| 05 | Imagenes y Multimedia | `05-multimedia.html` | img, picture, video, audio, track |
| 06 | Iframes, Embed y Object | `06-iframes.html` | iframe, embed, object, responsive embed |
| 07 | Listas | `07-listas.html` | ul, ol, dl, menu |
| 08 | Tablas Avanzadas | `08-tablas.html` | table, thead, tbody, colspan, rowspan |
| 09 | Formularios y Validacion | `09-formularios.html` | input types, validation, datalist |
| 10 | Formularios Avanzados | `10-formularios-avanzados.html` | Constraint Validation API, FormData |
| 11 | Atributos Globales | `11-atributos-globales.html` | id, class, data-*, hidden, tabindex |
| 12 | Meta Tags y SEO | `12-meta-seo.html` | meta charset, viewport, Open Graph |
| 13 | Etiquetas Adicionales | `13-etiquetas-adicionales.html` | mark, details, summary, output |
| 14 | Seguridad HTML | `14-seguridad.html` | CSP, SRI, noopener, sandbox, XSS |
| 15 | Web Storage | `15-web-storage.html` | localStorage, sessionStorage |
| 16 | Geolocation API | `16-geolocation.html` | getCurrentPosition, watchPosition |
| 17 | Canvas API | `17-canvas.html` | dibujo 2D, animaciones, exportar |
| 18 | Drag and Drop | `18-drag-drop.html` | draggable, ondragstart, ondrop |
| 19 | SVG | `19-svg.html` | graficos vectoriales, inline SVG |
| 20 | Web Workers y Fetch | `20-web-workers.html` | hilos en segundo plano, fetch API |
| 21 | WebSockets | `21-websockets.html` | conexion en tiempo real |
| 22 | Clipboard API | `22-clipboard-api.html` | copy, paste, readText, writeText |
| 23 | Web Share API | `23-web-share.html` | navigator.share(), compartir contenido |
| 24 | Notifications API | `24-notification-api.html` | notificaciones del navegador |
| 25 | Fullscreen API | `25-fullscreen-api.html` | modo pantalla completa |
| 26 | Screen Wake Lock API | `26-wake-lock.html` | mantener pantalla encendida |
| 27 | History API | `27-history-api.html` | pushState, popState, SPA routing |
| 28 | IndexedDB | `28-indexeddb.html` | base de datos client-side |
| 29 | Resize y Performance Observer | `29-observers.html` | Core Web Vitals, resize |
| 30 | Accesibilidad ARIA | `30-accesibilidad.html` | roles, live regions, atributos ARIA |
| 31 | Microdatos | `31-microdatos.html` | schema.org, itemscope |
| 32 | Details, Summary y Dialog | `32-details-summary.html` | contenido colapsable, dialogos nativos |
| 33 | Intersection Observer | `33-intersection-observer.html` | lazy loading, scroll detection |
| 34 | Web Components | `34-web-components.html` | custom elements, shadow DOM, templates |
| 35 | Progressive Web Apps | `35-pwa.html` | service workers, manifest, offline |
| 36 | Service Workers y Cache API | `36-service-workers.html` | estrategias de cache |
| 37 | Multimedia Avanzado | `37-multimedia-avanzado.html` | track WebVTT, poster, kind |
| 38 | Web Fonts | `38-web-fonts.html` | font-display, @font-face |
| 39 | Performance y Optimizacion | `39-performance.html` | lazy loading, resource hints, CWV |
| 40 | CSS3 Complementario | `40-css3.html` | grid, flexbox, variables, animaciones |
| 41 | JavaScript Basico | `41-javascript-basico.html` | DOM, eventos, fetch |
| 42 | HTML Living Standard | `42-html-living.html` | deprecated tags, popover |
| 43 | Pointer Events y Touch | `43-touch-events.html` | eventos tactiles, pointer events |
| 44 | HTML en Moviles | `44-html-mobile.html` | meta Apple/Android, manifest.json |
| 45 | Herramientas de Desarrollo | `45-devtools.html` | DevTools, Lighthouse, W3C validator |
| 46 | Recursos | `46-recursos.html` | 63 enlaces en 9 categorias colapsables |
| 47 | Glosario | `47-glosario.html` | 25 terminos HTML5 |
| 48 | Quiz | `48-quiz.html` | 15 preguntas en formato colapsable |

## Demos Interactivas

1. **Editor de Tipografia** - Aplica estilos de texto en tiempo real
2. **Atributos data-*** - Muestra el valor de atributos personalizados
3. **Validacion de Formularios** - Validacion nativa de HTML5
4. **Constraint Validation API** - Validacion avanzada de formularios
5. **Web Storage** - Guarda y recupera datos en localStorage
6. **Geolocation** - Obtiene tu posicion actual
7. **Canvas** - Dibuja graficos y animaciones
8. **Drag and Drop** - Arrastra y suelta elementos
9. **SVG Color Picker** - Cambia colores de graficos SVG
10. **Fetch API** - Consulta APIs externas
11. **Clipboard API** - Copiar y pegar texto
12. **Web Share API** - Compartir contenido
13. **Notifications API** - Notificaciones del navegador
14. **Fullscreen API** - Modo pantalla completa
15. **Wake Lock API** - Mantener pantalla encendida
16. **Popover API** - Popovers nativos
17. **Web Components** - Crea componentes personalizados
18. **ARIA** - Panel de accesibilidad interactivo

## Iconografia

- **Font Awesome 6.5.1** - Libreria de iconos utilizada en toda la interfaz
- Iconos en navegacion, secciones, tarjetas de recursos, botones de demo, y mas

## Tecnologias

- HTML5
- CSS3 (variables, grid, flexbox, dark mode, animaciones)
- JavaScript vanilla (sin dependencias)
- Font Awesome 6.5.1 (iconos via CDN)

## Como Usar

1. Clona el repositorio
2. Abre `index.html` en tu navegador
3. No necesita servidor local

```bash
git clone https://github.com/Apaza-Victor/Guia-de-HTML.git
cd Guia-de-HTML
# Abre index.html en tu navegador
```

## GitHub Pages

La guia esta desplegada en: https://apaza-victor.github.io/Guia-de-HTML/

## Licencia

Proyecto abierto para fines educativos.
