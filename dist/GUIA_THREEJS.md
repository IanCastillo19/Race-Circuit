# Race Circuit: cargar vuestros GLB y conducir con WASD

<<<<<<< HEAD
Esta guía acompaña al código de esta carpeta. El resultado de este primer paso es: circuito y coche visibles, cámara de seguimiento, aceleración, frenada, marcha atrás, cuatro ruedas que ruedan, dos ruedas delanteras que orientan la dirección y un límite para mantenerse sobre el terreno. No necesitas programar animaciones en Blender: las ruedas se animan con JavaScript.

**Actualización según tu captura:** esta versión carga `Chasis.glb`, `RuedasD.glb`, `RuedasT.glb` y `Circuito.glb` desde `dist/assets/Modelos/modelos_prototipos/`. El coche se monta con los tres primeros archivos. Se entiende que D son las ruedas delanteras y T las traseras. Solo se ha recibido una captura; los GLB aún no se han adjuntado, por lo que hay que comprobar su geometría, escala y orientación. Este prototipo usa conducción arcade sencilla; todavía no incluye colisiones con obstáculos, vueltas, objetos, multijugador ni física de suspensión.

**Correcciones tras tu prueba en Live Server:** cámara a 12 m y 6.5 m de altura, rejilla de ayuda eliminada, giro del conjunto del coche a 90° y comprobación del suelo bajo el coche para detenerse en el borde. Si ya tienes la versión con `modelos.js`, reemplaza **`config.js`, `juego.js`, `movimiento.js` y `vehiculo.js`**, y añade **`limites.js`**. `modelos.js`, `jugar.html` y `juego.css` se conservan. Tus cuatro GLB mantienen su ubicación y nombre. Recarga con Ctrl+F5.
=======
Esta guía acompaña al código de esta carpeta. El resultado de este primer paso es: circuito y coche visibles, cámara de seguimiento, aceleración, frenada, marcha atrás, cuatro ruedas que ruedan y dos ruedas delanteras que orientan la dirección. No necesitas programar animaciones en Blender: las ruedas se animan con JavaScript.

**Actualización según tu captura:** esta versión carga `Chasis.glb`, `RuedasD.glb`, `RuedasT.glb` y `Circuito.glb` desde `dist/assets/Modelos/modelos_prototipos/`. El coche se monta con los tres primeros archivos. Se entiende que D son las ruedas delanteras y T las traseras. Solo se ha recibido una captura; los GLB aún no se han adjuntado, por lo que hay que comprobar su geometría, escala y orientación. Este prototipo usa conducción arcade sencilla; todavía no incluye colisiones, vueltas, objetos, multijugador ni física de suspensión.

Si ya copiaste la versión anterior, reemplaza `config.js`, `juego.js` y `vehiculo.js`, y añade el nuevo **`modelos.js`**. Puedes dejar `jugar.html`, `juego.css` y `movimiento.js` como están. Tus cuatro archivos GLB conservan su ubicación y nombre.
>>>>>>> T4

## 1. Preparar el coche en Blender

Abre el `.blend` original. Si solo tienes el GLB, usa **File → Import → glTF 2.0** para abrirlo.

1. La carrocería y las cuatro ruedas deben ser objetos independientes dentro de Blender. En tu estructura, la carrocería se exporta como `Chasis.glb`, las dos ruedas delanteras como `RuedasD.glb` y las dos traseras como `RuedasT.glb`. Un archivo GLB puede contener varios objetos separados: no hace falta unir las dos ruedas para exportarlas juntas.
2. Si todo está unido en una malla: selecciona el coche, entra en **Edit Mode** con Tab, deselecciona todo, coloca el ratón sobre la geometría de una rueda y pulsa **L**. Selecciona también la llanta si no está conectada al neumático. Pulsa **P → Selection**. Repite para las cuatro ruedas. Si hay caras compartidas con la carrocería, tendrás que separar esas caras manualmente.
3. Si una rueda está dividida en neumático y llanta, selecciona solo las piezas de ESA rueda y pulsa **Ctrl+J** en Object Mode. Repite por rueda. No unas las cuatro ruedas entre sí ni con la carrocería.
4. La base intenta detectar cada rueda por su lado si son objetos separados. Para identificar las ruedas de forma explícita, cambia en el Outliner el nombre de los **objetos**, no solo el nombre de sus datos de malla:

| Objeto | Nombre exacto |
|---|---|
| Rueda delantera izquierda | `Rueda_DI` |
| Rueda delantera derecha | `Rueda_DD` |
| Rueda trasera izquierda | `Rueda_TI` |
| Rueda trasera derecha | `Rueda_TD` |

Izquierda y derecha se entienden desde el asiento del conductor. No uses nombres duplicados como `Rueda_DI.001` para la misma rueda. La carrocería puede llamarse `Carroceria`.

5. En Object Mode, selecciona los objetos del coche y aplica **Ctrl+A → Rotation & Scale**. Comprueba que la escala sea `1, 1, 1`. Si usas un objeto padre, también debe tener escala uniforme; para este primer prototipo conviene evitar armatures.
6. Selecciona las ruedas y usa **Object → Set Origin → Origin to Geometry**. No uses *Geometry to Origin*, porque esa opción mueve la geometría.
7. Mantén el coche derecho, apoyado sobre sus ruedas. No exportes un plano, cámaras o luces dentro del archivo del coche. Los ejes verticales de Blender y Three.js son distintos; el exportador GLB realiza la conversión. No gires el coche 90° en X en JavaScript por defecto.
8. Exporta desde la **misma escena**, sin mover ni recentrar las piezas entre exportaciones. En **File → Export → glTF 2.0**, elige **glTF Binary (.glb)** y activa **Selected Objects**. Primero selecciona solo la carrocería y guarda `Chasis.glb`; después selecciona las dos delanteras y guarda `RuedasD.glb`; por último selecciona las dos traseras y guarda `RuedasT.glb`. Conserva materiales y desactiva la compresión Draco para esta prueba. No unas las ruedas entre sí: la selección permite exportar varios objetos en el mismo GLB.

Si exportaste cada archivo con su geometría centrada por separado en el origen, las piezas pueden superponerse al cargarlas. La solución preferida es reexportarlas conservando su colocación en la misma escena. También puedes ajustar manualmente su posición, giro y escala en `coche.piezas` dentro de `config.js`. El panel avisará si las ruedas quedan sin distancia entre el eje delantero y el trasero.

También se admite una rueda formada por varios objetos dentro de un grupo con el nombre requerido, siempre que no contenga otra rueda ni la carrocería. Los pivotes del código calculan el centro de cada rueda a partir de su geometría.

## 2. Preparar el circuito

1. Usa unidades coherentes: una carretera de aproximadamente 6–10 m de ancho es un punto de partida razonable para un coche de 4.2 m de largo. Son medidas propuestas para el prototipo, no un requisito del formato.
2. Empieza con una carretera plana o con pendientes suaves. Sitúala cerca del origen de Blender y aplica **Rotation & Scale** a sus objetos.
3. Si puedes, mantén la carretera como una malla separada y llámala `Carretera`. Esto permite buscar el suelo sin confundirlo con árboles, edificios o puentes.
4. Exporta las piezas del circuito como **glTF Binary (.glb)**, sin compresión Draco, a `Circuito.glb`.

La base puede seguir la altura de la carretera, pero aún mantiene el coche vertical. Las pendientes pronunciadas, saltos, puentes superpuestos y colisiones requieren un paso posterior.

## 3. Copiar los archivos a la web

Descomprime `Race_Circuit_ThreeJS.zip`. Copia estos archivos **al lado de vuestro `index.html`**:

| Archivo | Función |
|---|---|
| `jugar.html` | Página del juego y configuración de los módulos de Three.js |
| `juego.css` | Diseño del panel, botones y velocímetro |
| `juego.js` | Carga de GLB, escena, teclado, cámara y panel |
| `config.js` | Rutas, nombres de ruedas, tamaño y ajustes del coche |
| `movimiento.js` | Aceleración, frenada y dirección |
| `vehiculo.js` | Preparación del coche y pivotes de las ruedas |
| `modelos.js` | Carga y montaje de chasis, ruedas delanteras y ruedas traseras |
<<<<<<< HEAD
| `limites.js` | Comprueba la superficie del terreno bajo el coche y busca una salida válida |

Según tu captura, el proyecto usa **`dist/`**. Los ocho archivos de la tabla van en `dist/`, junto a `index.html`. Tus modelos se quedan en `dist/assets/Modelos/modelos_prototipos/`. Si más adelante mueves el contenido de `dist/` a la raíz del repositorio, conserva la misma posición relativa de los archivos.
=======

Según tu captura, el proyecto usa **`dist/`**. Los siete archivos de la tabla van en `dist/`, junto a `index.html`. Tus modelos se quedan en `dist/assets/Modelos/modelos_prototipos/`. Si más adelante mueves el contenido de `dist/` a la raíz del repositorio, conserva la misma posición relativa de los archivos.
>>>>>>> T4

Tu carpeta de modelos ya tiene los cuatro archivos necesarios. Las rutas en `config.js` son relativas a `jugar.html` y usan las mayúsculas de tu captura:

- `assets/Modelos/modelos_prototipos/Chasis.glb`
- `assets/Modelos/modelos_prototipos/RuedasD.glb`
- `assets/Modelos/modelos_prototipos/RuedasT.glb`
- `assets/Modelos/modelos_prototipos/Circuito.glb`

```js
modelos: {
  chasis: './assets/Modelos/modelos_prototipos/Chasis.glb',
  ruedasDelanteras: './assets/Modelos/modelos_prototipos/RuedasD.glb',
  ruedasTraseras: './assets/Modelos/modelos_prototipos/RuedasT.glb',
  circuito: './assets/Modelos/modelos_prototipos/Circuito.glb',
},
```

<<<<<<< HEAD
El juego necesita tanto `modelos.js` como `limites.js`: si falta uno de los módulos importados, la página puede quedarse en el texto inicial de carga. Cambiar solo las rutas de la primera versión no bastaría para cargar el coche dividido en tres archivos.
=======
Esta actualización incluye también `modelos.js`: cambiar solo las rutas de la versión anterior no bastaría para cargar el coche dividido en tres archivos.
>>>>>>> T4

El botón **Jugar ahora** de la web ya apunta a `jugar.html?lang=es`, cambiando `es` por `ca` o `en` según el idioma. El prototipo admite los tres idiomas. Si tu botón actual tiene otro enlace, usa:

```html
<a href="./jugar.html?lang=es">Jugar ahora</a>
```

## 4. Abrirlo con un servidor local

Este paso sí necesita un servidor, aunque la página informativa anterior pudiese abrirse directamente.

**Con Visual Studio Code:**

1. Abre la carpeta del proyecto con **File → Open Folder**.
2. Si ya usas Live Server, haz clic derecho sobre `jugar.html` y pulsa **Open with Live Server**. Si no lo tienes, instala la extensión Live Server o usa la alternativa de abajo.
3. La dirección debe empezar por `http://localhost:...` o `http://127.0.0.1:...`.
4. Mantén conexión a Internet: el `importmap` descarga Three.js y sus addons de un CDN, con la misma versión fija `0.186.0`.

**Alternativa si tienes Python:** abre una terminal en la carpeta que contiene `jugar.html` y ejecuta:

```bash
python -m http.server 8000
```

En Windows también puedes usar `py -m http.server 8000`. Abre `http://localhost:8000/jugar.html`. Si ejecutas el servidor en la raíz de un repositorio que conserva `dist/`, abre `http://localhost:8000/dist/jugar.html`.

No abras el juego con doble clic ni una URL `file:///...`: los módulos y la carga de GLB necesitan servirse por HTTP.

## 5. Hacer la primera prueba

1. Espera a que aparezca el mensaje de listo.
2. Abre **Modelos y ajustes**: debería mostrar **4/4 ruedas animables** y los nombres que contiene el coche.
3. Pulsa **W**: el coche acelera y las cuatro ruedas ruedan.
4. Pulsa **A** o **D** parado: solo las ruedas delanteras orientan la dirección. Pulsa **W+A** o **W+D** para tomar una curva.
5. Mantén **S** mientras avanzas: frena hasta cero y después inicia la marcha atrás. En marcha atrás también se invierte la rodadura. Suelta las teclas para perder velocidad progresivamente.
6. Usa **R** para volver al punto de salida. La ventana debe tener el foco para recibir WASD.

Cuando el coche va hacia atrás, el giro del vehículo cambia de sentido, como corresponde a la dirección de un coche.

## 6. Colocar el coche en la carretera

No sabemos dónde cae el origen de vuestro circuito. Para elegir un punto válido:

1. Pulsa **Ver circuito**. En esta vista se pausa la conducción.
2. Arrastra el ratón para mirar y usa la rueda del ratón para acercarte.
3. Mantén **Mayús** y haz un clic breve en una zona de carretera. El coche se coloca ahí.
4. Abre **Modelos y ajustes** y anota las coordenadas `[X, Y, Z]` que muestra.
5. Pulsa **Volver a conducir** y prueba. Ajusta el rumbo inicial si el coche mira en una dirección incorrecta para esa salida.
6. Para conservar la salida después de recargar, escribe las coordenadas en `config.js`, dentro de `salida`. Ejemplo ilustrativo: reemplázalo por tus valores.

```js
salida: {
  posicion: [12.5, 0.1, -8.2],
  rumboGrados: 90,
},
```

El clic guarda la salida solo durante la sesión; **R** vuelve a ese punto. `rumboGrados` gira todo el jugador al comenzar.

## 7. Ajustar vuestro modelo en config.js

Haz un cambio cada vez, guarda y recarga el navegador.

### Orientación

El jugador avanza hacia su eje local **-Z**. `giroModeloGrados` corrige cómo se ha exportado el coche, sin cambiar los controles:

<<<<<<< HEAD
- La versión actual usa `coche.giroModeloGrados: 90` para corregir el avance lateral que has observado.
- Si ahora W hace que el coche vaya de culo, cambia ese valor a `-90` y recarga. Sin los GLB no se puede confirmar cuál de los dos signos coincide con su parte frontal.
- Para un modelo que ya mire hacia -Z, usa `0`; para uno que mire hacia +Z, usa `180`.
=======
- Si W hace que el coche parezca ir de culo, cambia `coche.giroModeloGrados` de `0` a `180`.
- Si parece ir de lado, prueba `90` o `-90`.
>>>>>>> T4
- Vuelve a probar después de recargar. Las delanteras deben estar en la parte frontal, con Z local negativo. El panel avisa si detecta lo contrario.

No confundir `coche.giroModeloGrados` —corrección del modelo— con `salida.rumboGrados` —dirección inicial en la pista—.

### Tamaño y suelo

- `coche.longitudMetros: 4.2` normaliza el tamaño del coche de forma uniforme. Puedes cambiarlo si vuestro coche arcade tiene otra medida prevista.
- `circuito.escala: 1` mantiene el tamaño exportado. Si el circuito es 100 veces demasiado grande, prueba `0.01`; si es 100 veces demasiado pequeño, prueba `100`.
- Si la carretera se llama `Carretera`, configura `circuito.nombreSuelo: 'Carretera'`. Si es `null`, se busca el suelo sobre todo el circuito; evita escoger tejados o decoración como salida.
- Con `seguirAlturaSuelo: false`, el coche mantiene la Y de `salida.posicion`. Puede ser útil para una pista totalmente plana.

### Ruedas y velocidad

- La detección por lado admite ruedas separadas con otros nombres. Si no puede identificarlas, separa las ruedas y usa los cuatro nombres de la tabla, o cambia `coche.ruedas` para que coincida con tus nombres de objetos. Si las dos ruedas están fusionadas en una malla, cambiar el nombre no las separa.
- `radioRuedaMetros: null` calcula el radio de cada rueda. Si la rodadura parece demasiado rápida, comprueba el radio del neumático y fija su medida en metros, por ejemplo `0.33`.
- `distanciaEjesMetros: null` calcula la separación entre eje delantero y trasero. Se puede fijar una medida, por ejemplo `2.6`, para ajustar el giro.
- `conduccion.velocidadMaxima` está en m/s. Para convertirla a km/h, multiplícala por `3.6`.
- `conduccion.giroMaximoGrados` determina cuánto giran las delanteras; empieza con `30`.

<<<<<<< HEAD
### Cámara y rejilla

En `config.js`, la cámara usa `distancia: 12`, `altura: 6.5` y `mirarDelante: 4`. Puedes aumentar la distancia, por ejemplo a `15`, si todavía quieres ver más circuito. La rejilla `GridHelper` se ha eliminado de `juego.js`; no forma parte de tu GLB.

### Límite del terreno

`limites.activo: true` activa una comprobación del suelo bajo el centro y las cuatro esquinas del coche. También se comprueban pasos intermedios al conducir. Si el siguiente paso saca parte del coche de la superficie, se conserva su última posición válida y se detiene. Puedes retroceder o cambiar de dirección para alejarte del borde. No se añaden paredes visibles.

Por defecto, `limites.nombreZona: null` usa las superficies orientadas hacia arriba del circuito. **No identifica colores de la imagen:** si el GLB también contiene suelo fuera de lo verde, hay que seleccionar la malla o grupo que representa la zona permitida.

1. Abre **Modelos y ajustes** y busca la lista **Objetos del circuito**. Aparecen los nombres originales y los nombres de sus materiales.
2. Localiza la malla del terreno verde o, preferiblemente, un grupo que contenga todo el suelo permitido, carretera incluida.
3. Pon su nombre exacto en `config.js`, dentro de `limites.nombreZona`. Por ejemplo, si el objeto se llama realmente `ZonaConduccion`, usa:

```js
limites: {
  activo: true,
  nombreZona: 'ZonaConduccion', // Ejemplo: reemplázalo por el nombre real de tu GLB.
  margen: 0.1,
  pasoMaximo: 0.2,
  normalMinimaY: 0.55,
},
```

El margen deja un poco de separación adicional del borde. Si el nombre de zona no existe, el panel muestra el error y la conducción queda detenida hasta corregirlo. La salida también debe permitir que quepa el coche completo: un clic demasiado cerca del borde se rechaza. Si el origen inicial está fuera del terreno, la base busca un punto interior válido; puedes cambiarlo con Mayús + clic.

Es un límite para un prototipo de terreno plano o de pendiente suave. No sustituye las futuras colisiones contra obstáculos ni la física de puentes o saltos. Si quieres que el límite coincida exactamente con lo verde, usa una malla o grupo de esa zona, con normales orientadas hacia arriba.

=======
>>>>>>> T4
## 8. Cómo funcionan las ruedas

Cada rueda delantera tiene dos grupos anidados: el pivote de dirección está situado en su centro; dentro está el pivote de rodadura; dentro de este se coloca la rueda importada. Las traseras usan la misma estructura, pero su pivote de dirección se mantiene en cero.

```js
// Resumen de vehiculo.js; ya está implementado, no hace falta volver a pegarlo.
rueda.direccion.rotation.y = rueda.delantera ? anguloDireccion : 0;
rueda.angulo -= metrosRecorridos / rueda.radio;
rueda.rodadura.rotation.x = rueda.angulo;
```

La rodadura depende de la distancia recorrida: al pararse el coche, deja de rodar. Al ir hacia atrás, cambia de signo. No se gira toda la rueda en un único eje para ambas acciones, porque dirección y rodadura son movimientos distintos.

`rodadura.attach(ruedaImportada)` conserva la transformación del GLB al cambiar su padre. Esta operación requiere evitar escalas no uniformes en esa jerarquía; por eso se aplica Rotation & Scale en Blender. El código detecta esa condición y deja un aviso en lugar de deformar una rueda.

La dirección y el desplazamiento se actualizan con el tiempo transcurrido entre fotogramas (`dt`). Así la conducción no depende de que el ordenador dibuje exactamente 60 imágenes por segundo.

## 9. Si algo falla

| Síntoma | Qué comprobar |
|---|---|
| 404 en un GLB | Archivo dentro de `assets/Modelos/modelos_prototipos/`, nombre exacto y ruta de `config.js`. Conserva las mayúsculas de `Chasis.glb`, `Circuito.glb`, `RuedasD.glb` y `RuedasT.glb`. |
| Solo aparece la rejilla | Abre el panel y la consola F12. Revisa si falló un modelo, si usas HTTP y si el CDN tiene conexión. |
| 0/4 ruedas, pero el coche se mueve | La lista del panel muestra los nombres reales. Cambia `coche.ruedas` o separa y renombra las ruedas en Blender. |
| No se distinguen dos ruedas independientes | No gires el GLB del eje entero. Separa cada rueda en Blender, conserva sus posiciones, nómbralas y reexporta las dos seleccionadas juntas. |
| Chasis y ruedas se superponen | Reexporta desde la misma escena sin recentrar cada pieza, o ajusta `coche.piezas`. |
<<<<<<< HEAD
| El coche se detiene aunque el centro siga dentro | El límite exige suelo bajo las cuatro esquinas; aléjate del borde o corrige el tamaño del coche. |
| Se puede ir fuera de lo verde, pero sigue habiendo suelo | Selecciona la malla o grupo permitido en `limites.nombreZona`; el límite no clasifica los colores del material. |
| No se encuentra una salida válida | Usa Ver circuito y elige un punto interior, comprueba la escala del coche y que las normales del suelo apunten hacia arriba. |
=======
>>>>>>> T4
| Una rueda orbita alrededor del coche | Debe contener solo la geometría de esa rueda; elimina carrocería o ruedas adicionales del objeto o grupo. |
| Escala no uniforme o armature en el diagnóstico | Aplica Rotation & Scale a los objetos y padres. Para esta base usa ruedas como objetos estáticos independientes. |
| El coche va de lado o de culo | Ajusta `giroModeloGrados`, recarga y verifica los nombres delanteros/traseros. |
| El coche está fuera de la carretera | Elige la salida con Ver circuito → Mayús + clic y guarda las coordenadas. |
| El coche aparece encima de un edificio | Pon la malla de carretera en `nombreSuelo` y elige de nuevo la salida. |
| Material negro o distinto de Blender | Hay luces en esta base. Comprueba Principled BSDF, normales y texturas exportadas; los materiales procedurales complejos pueden necesitar horneado. |
| Error de DRACOLoader, KTX2 o Meshopt | Esta base no configura sus decodificadores. Reexporta el prototipo sin esas compresiones. |
| WASD no responde | Haz clic en el lienzo y vuelve a la vista de conducción. Comprueba que los modelos hayan terminado de cargar. |

## 10. Qué se ha comprobado y qué falta comprobar

<<<<<<< HEAD
El paquete se entrega con comprobaciones de sintaxis, pruebas de conducción, pivotes y límites con geometría de prueba, y una comprobación del bucle completo en un entorno simulado. Se comprueba que el coche se detenga en el borde y pueda retroceder. No se ha ejecutado con vuestros GLB ni se ha verificado su apariencia en navegador, porque aún no se han recibido. La prueba con los modelos reales debe confirmar el signo de los 90°, el tamaño del coche y qué malla corresponde a lo verde.
=======
El paquete se entrega con comprobaciones de sintaxis y pruebas de la conducción y los pivotes con geometría de prueba. No se ha ejecutado con vuestros GLB ni se ha verificado su apariencia en navegador, porque aún no se han recibido. La primera prueba con los modelos debe revisar orientación, nombres, tamaño y punto de salida.
>>>>>>> T4

Referencias oficiales:

- [Three.js: instalación, importmap y servidor local](https://threejs.org/manual/pages/installation.html)
- [Three.js: GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html)
- [Three.js: Object3D y attach](https://threejs.org/docs/pages/Object3D.html)
<<<<<<< HEAD
- [Three.js: Raycaster e intersecciones con superficies](https://threejs.org/docs/pages/Raycaster.html)
=======
>>>>>>> T4
- [Blender: exportar glTF/GLB](https://docs.blender.org/manual/en/latest/addons/scene_gltf2.html)
- [Blender: aplicar transformaciones](https://docs.blender.org/manual/en/latest/scene_layout/object/editing/apply.html)
- [Blender: origen de objetos](https://docs.blender.org/manual/en/latest/scene_layout/object/origin.html)
