# Guía técnica de Race Circuit

Esta guía describe el prototipo jugable de la rama `T17`. Para una presentación general, consulta el `README.md` de la raíz.

## Puesta en marcha

1. Abre la raíz del repositorio con VS Code.
2. Inicia Live Server y abre `dist/index.html`, o ejecuta `py -m http.server 8000` desde la raíz y visita `http://localhost:8000/dist/index.html`.
3. Entra con «Jugar ahora». También puedes visitar `dist/jugar.html` directamente.
4. Espera a que el botón «Empezar carrera» esté activo. Si no lo está, lee «Modelos y ajustes» y revisa la consola.

Los módulos, Three.js, Rapier y los recursos del juego se sirven desde `dist/`. No hacen falta paquetes npm. No abras `jugar.html` como `file://`, ya que los módulos y modelos necesitan un servidor HTTP.

## Estructura y configuración

| Archivo | Responsabilidad |
| --- | --- |
| `juego.js` | Estado de partida, entrada, bucle de simulación y renderizado |
| `carrera.js` | Salida, checkpoints, meta, vueltas y tiempos |
| `movimiento.js`, `marchas.js` | Conducción arcade, límites por marcha, calado y RPM |
| `fisica.js`, `colisiones.js` | Cuerpos rígidos, contactos y utilidades de choque |
| `terreno.js`, `limites.js` | Superficies, altura, césped y límites de pista |
| `nitro.js`, `objetos.js`, `ajustes-juego.js` | Recargas, obstáculos y parámetros de objetos |
| `interfaz.js`, `juego.css` | Traducciones, HUD, minimapa y pantalla dividida |
| `config.js` | Rutas y parámetros generales del coche, pista y cámara |

`config.js` espera `Chasis.glb`, `RuedasD.glb`, `RuedasT.glb` y `Circuito.glb` en `assets/Modelos/modelos_prototipos/`. Las rutas son relativas a `jugar.html`. Los nombres de asfalto y césped se declaran en `CONFIG.cesped`; si cambian los nombres de las superficies, hay que actualizar esa lista. El prototipo requiere ambas superficies incluso al desactivar la penalización de césped; esto se revisará al incorporar los circuitos definitivos.

Los checkpoints, la meta y la salida están en `TRAZADO` de `carrera.js`. Las posiciones de nitro están en `nitro.js` y las de rocas y plátanos en `ajustes-juego.js`. Sus coordenadas son locales al circuito y se convierten a coordenadas del mundo al cargar.

## Flujo de una partida

1. El menú lee modo, orientación, ambiente, obstáculos, sonido e idioma y crea uno o dos jugadores.
2. La cuenta atrás inicia la carrera. Una salida anticipada impone una inmovilización breve.
3. La física avanza en pasos fijos de 1/120 s; cada coche actualiza conducción, colisiones, superficies, nitro y progreso.
4. Solo cuentan los cruces de checkpoints en orden, hacia delante y sobre asfalto. Al terminar la tercera vuelta se muestran tiempos y resultados.
5. `F` o `Enter` devuelve al último control validado con una penalización e inmunidad breve. `R` reinicia toda la carrera.

El cronómetro usa únicamente tiempo simulado durante la fase de carrera. En un fotograma lento se simulan hasta 0,25 s y se descarta el resto tanto para movimiento como para el crono; pausa y pestaña oculta detienen ambos. En dos jugadores, la carrera termina en cuanto el primero completa las tres vueltas: la espera a los demás es una función futura para bots y torneos.

## Cambio manual y controles

J1 conduce con WASD y cambia con Q/E; J2 conduce con flechas y cambia con K/L. `P` o `Esc` pausa, `R` reinicia y `F`/`Enter` recupera J1/J2. Hay seis marchas de 27, 47, 67, 87, 104 y 120 km/h. El nitro puede llevar la sexta hasta 162 km/h. En marchas altas, circular demasiado lento durante un segundo cala el motor; bajar a primera lo enciende. La zona roja del dial refleja el límite de la marcha actual, con las modificaciones de nitro y césped.

## Diagnóstico y validación

Para problemas de carga, comprueba las rutas de `config.js` y el panel «Modelos y ajustes». Para una salida personalizada, pausa, elige «Ver circuito» y usa Mayús + clic sobre el asfalto: esa sesión no guarda récord. Prueba también un recorrido completo de tres vueltas, ambos jugadores con el teclado real, recuperación, nitro, objetos y un fotograma lento. `VALIDACION.md` recoge pruebas de T7 y no certifica esta rama.
