# Race Circuit: tres tipos de coche

Propuestas inspiradas en los coches y los tres ambientes de la web: costa tropical, ciudad neón y montaña helada. Los renders conceptuales se han creado con generación de imágenes; los planos son proyecciones de una misma geometría simplificada por coche. Sirven para construir el volumen en Blender y añadir después los acabados del concepto.

| Coche | Idea visual | Papel propuesto para más adelante |
|---|---|---|
| Sprint GT | Naranja, franja blanca, faros redondos y alerón | Equilibrado; recomendado para empezar a modelar |
| Pulso Neón | Morado y cian, silueta baja, faros estrechos | Deportivo centrado en velocidad |
| Cumbre Rally | Turquesa, franja blanca, cabina alta y ruedas grandes | Mayor control y menor penalización fuera del asfalto |

Estas características de conducción son propuestas; no están implementadas por estos archivos.

## Qué hay en cada carpeta

- `concepto_visual.png`: propuesta de colores, materiales y detalles. No es una imagen ortográfica.
- `superior.png`, `lateral.png`, `frontal.png` y `trasera.png`: referencias ortográficas de 2200 x 2200 px.
- Los mismos cuatro archivos en SVG para ampliar sin pérdida.
- `lamina_A3.png` y `lamina_A3.svg`: las cuatro vistas juntas, con cotas.
- `volumen_isometrico.png` y `.svg`: vista del volumen simplificado usado para calcular los planos.

El PDF reúne la comparación, las tres láminas y una guía para Blender. Las láminas de los coches se imprimen en A3 horizontal a escala 1:25 al 100%, sin ajustar a página.

## Dimensiones de diseño, en metros

| Coche | Largo | Ancho total | Alto total | Batalla | Diámetro rueda | Ancho neumático |
|---|---:|---:|---:|---:|---:|---:|
| Sprint GT | 4.20 | 2.05 | 1.50 | 2.60 | 0.76 | 0.32 |
| Pulso Neón | 4.20 | 2.10 | 1.28 | 2.68 | 0.72 | 0.32 |
| Cumbre Rally | 4.20 | 2.08 | 1.76 | 2.56 | 0.88 | 0.32 |

Las medidas fijan el volumen de partida para el videojuego. Los detalles pequeños del render conceptual son libres; para alinear vistas, usad las cotas y los PNG ortográficos.

## Ejes y colocación de las referencias

En Blender: **X = ancho, +Y = frente, +Z = arriba**. El origen está en el suelo y en el centro de la longitud y anchura del coche.

Las cuatro imágenes de referencia de cada coche usan el mismo lienzo físico: **5.5 x 5.5 m**. La cruz central representa el origen; en vistas lateral, frontal y trasera, esa cruz está en el suelo. Es normal que haya espacio vacío debajo del coche: permite alinear todas las imágenes por su centro.

1. Crea una escena y usa unidades métricas.
2. Cambia a la vista correspondiente con las teclas de la tabla.
3. Usa **Añadir > Imagen > Referencia** e importa el PNG individual.
4. Fija el tamaño de la imagen en **5.5 m**, comprueba que su centro esté en el origen y reduce su opacidad a 0.35-0.5.
5. Usa cada referencia únicamente en su vista ortográfica correspondiente. No estires las imágenes por separado.

| Archivo | Vista del coche | Tecla de Blender |
|---|---|---|
| `superior.png` | Desde arriba | Numpad 7 |
| `lateral.png` | Lateral derecho, frente a la derecha de la imagen | Numpad 3 |
| `frontal.png` | Mirando al frente del coche, desde +Y | Ctrl + Numpad 1 |
| `trasera.png` | Mirando a la parte trasera, desde -Y | Numpad 1 |

## Orden para modelar

1. **Carrocería:** parte de un cubo, crea media carrocería y usa Mirror en X. Ajusta primero largo, ancho y alto en las cuatro vistas.
2. **Cabina y cristales:** marca el parabrisas y las ventanas con caras y materiales sencillos. El concepto visual sirve para decidir el acabado.
3. **Pasos de rueda:** abre los huecos siguiendo los arcos de los planos; no dejes la carrocería atravesando los neumáticos.
4. **Ruedas:** empieza con cilindros de 12-16 lados. Modela neumático y llanta, y agrupa las piezas de cada rueda sin unir las cuatro ruedas a la carrocería.
5. **Detalles:** añade alerón, faros, tomas de aire y escapes. Comparte materiales y ruedas entre coches al principio para avanzar más rápido.
6. **Comprobación:** mira las cuatro vistas y asegúrate de que los neumáticos apoyan en Z=0.

## Ruedas e integración con el juego

Usa estos cuatro nombres de objeto:

- `Rueda_DI`: delantera izquierda.
- `Rueda_DD`: delantera derecha.
- `Rueda_TI`: trasera izquierda.
- `Rueda_TD`: trasera derecha.

La izquierda y la derecha se entienden desde el asiento del conductor, mirando hacia +Y. Las coordenadas de sus centros están en `centros_ruedas_Blender.csv`; cada fila corresponde a un coche y una rueda.

Centra el origen de cada rueda en su geometría. Aplica **Ctrl+A > Rotation & Scale** en Object Mode y recalcula las normales hacia fuera con **Shift+N** en Edit Mode.

Para mantener el cargador actual, exporta desde la misma escena:

- `Chasis.glb`: carrocería y detalles fijos.
- `RuedasD.glb`: los dos objetos de las ruedas delanteras.
- `RuedasT.glb`: los dos objetos de las ruedas traseras.

Activa Selected Objects al exportar y conserva las posiciones originales de las piezas. Cada GLB de ruedas puede contener varios objetos separados; no hace falta unir las dos ruedas entre sí.

Al convertir los ejes con el exportador glTF, el frente +Y de Blender queda en -Z de Three.js. Para estos modelos nuevos se prevé `giroModeloGrados: 0`. El prototipo actual usa -90: conserva ese ajuste hasta sustituirlo y comprobar la orientación del nuevo coche.

## Próximo trabajo

Esta entrega no modifica el código del juego ni el repositorio. Después retomamos la limpieza de los marcadores de conflictos del merge y comprobamos el apoyo del coche sobre el césped.
