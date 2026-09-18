# ALBOR · Bodas en Asturias

App web instalable, al estilo de Brisa, para descubrir espacios y profesionales de bodas en Asturias. Tiene pantallas de Inicio, Explorar, Guardados, Mi plan y fichas de cada negocio. La navegación funciona con rutas internas y se adapta a móvil y escritorio.

## Uso

Abre `https://mestizobeach.github.io/brisa/bodas/` y usa el menú del navegador para instalarla o añadirla a la pantalla de inicio. En iPhone, abre el enlace en Safari y elige **Compartir → Añadir a pantalla de inicio**. Tras la primera visita, el servicio de caché permite abrir la app sin conexión. Los enlaces a proveedores requieren conexión.

Los favoritos y el progreso se guardan en el dispositivo, sin cuenta. No se muestran precios, disponibilidad ni opiniones sin confirmar. La selección inicial no incluye todavía todos los proveedores de Asturias.

## Desarrollo

HTML, CSS y JavaScript sin compilación. `data.js` contiene las fichas, `app.js` controla navegación y estado, `app-shell.css` define el diseño, y `sw.js` gestiona la caché. Publicación desde la carpeta `bodas/` del repositorio `mestizobeach/brisa`.
