# Race Circuit · Web del proyecto

Web informativa arcade escrita en HTML, CSS y JavaScript. Presenta la idea del juego, las mecánicas previstas, tres escenarios conceptuales y el equipo: Ian Castillo, Eric Abidal y Wassim Akka.

## Abrir y editar

Los archivos de la página están en `dist/`. Abre `dist/index.html` en un navegador. No hacen falta npm, un framework, una API ni conexión a servicios externos para usar esta página.

- `dist/index.html`: estructura y contenido inicial en castellano.
- `dist/style.css`: diseño, tamaños de móvil y escritorio y estados de los controles.
- `dist/themes.css`: tipografía de carreras, cinta continua y fondos de costa, neón y montaña.
- `dist/script.js`: textos en ES/CA/EN, selector de escenarios, controles informativos y menú móvil.
- `dist/assets/`: favicon e imágenes conceptuales optimizadas.

Puedes copiar el contenido de `dist/` a la carpeta de la web de vuestro repositorio de GitHub. Conserva `assets/` junto a `index.html`, `style.css` y `script.js` para que las rutas funcionen.

## Idiomas

El castellano es el idioma inicial. Los botones ES, CA y EN cambian los textos, los títulos, las etiquetas accesibles y las descripciones de las imágenes. La elección se guarda en el navegador cuando el almacenamiento está disponible. También puedes abrir `index.html?lang=ca` o `index.html?lang=en`.

## Cinta y fondos

La cinta repite «Race Circuit / 3 vueltas / Buenos ratos» sin dejar un espacio vacío al terminar. JavaScript calcula cuántas repeticiones hacen falta para cubrir la pantalla, crea dos grupos idénticos y CSS desplaza uno de ellos. La velocidad se controla con `RIBBON_SPEED = 32` en `script.js` (píxeles por segundo). Baja ese número para mover las palabras más despacio.

Los fondos usan las tres imágenes conceptuales existentes. Los atributos `data-background-scene` de las secciones marcan dónde comienza cada ambiente: costa en la introducción, ciudad neón en los mundos y montaña helada en los controles. Puedes mover esos atributos a otras secciones para cambiar el recorrido. Las capas cambian suavemente al desplazarte; `themes.css` define los colores y las capas que mantienen la lectura.

La tipografía de títulos, marca y cinta es Racing Sans One, incluida localmente en `dist/assets/fonts/` junto con su licencia SIL Open Font License. Fuente original: https://github.com/google/fonts/tree/main/ofl/racingsansone. Los párrafos conservan una tipografía de lectura. El modo de movimiento reducido detiene la cinta y elimina los fundidos.

Los textos se editan en el objeto `translations` de `script.js`. Las claves deben existir en los tres idiomas. Los saltos `\n` dentro de los títulos se convierten en saltos de línea, sin insertar HTML arbitrario.

## Página del juego

El botón **Jugar ahora** apunta a `jugar.html?lang=es` (o al idioma seleccionado). **No se incluye `jugar.html`**, porque todavía no existe la versión jugable. Por ahora, seguir el enlace puede mostrar un error de página no encontrada, como corresponde a esa ruta pendiente.

Cuando integréis el juego, cread `dist/jugar.html` junto a `index.html` y añadid ahí los módulos y recursos de Three.js. Esta página informativa no carga Three.js ni simula que el juego está terminado. Los controles mostrados solo explican el diseño previsto.

## Imágenes y dirección visual

Las tres imágenes son arte conceptual generado con IA para esta web, no capturas de un juego ni modelos finales:

- `coast.webp`: Costa Turbo, entorno tropical.
- `neon.webp`: Ciudad Neón, entorno urbano nocturno.
- `alpine.webp`: Cumbre Helada, entorno nevado.

Sus nombres y ambientes son propuestas visuales. Los modelos reales se crearán en Blender y podrán sustituir estas imágenes cuando tengáis capturas. Los prompts se conservan en `CONCEPTOS_IMAGENES.md`.

## Comportamiento y accesibilidad

El diseño se adapta a diferentes anchos de pantalla. El menú móvil puede cerrarse con Escape. El selector de mundos admite las flechas del teclado, Home y End. Hay etiquetas accesibles, textos alternativos traducidos, foco visible y respeto por `prefers-reduced-motion`.

## Estado del proyecto

Están previstos tres vueltas, cronómetro, dos jugadores, conducción con WASD/flechas, marcha atrás, ralentización en césped y cámara de seguimiento. Los efectos de plátanos, rocas y turbo se presentan como propuestas de diseño. La web no afirma que estas mecánicas ya estén implementadas.

La publicación de demostración se gestiona con Sites. Para trasladar la web a vuestro GitHub, bastan los archivos de `dist/`; no necesitáis la configuración de Sites.
