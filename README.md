# Race Circuit

Juego de carreras arcade 3D para uno o dos jugadores locales, desarrollado por Ian Castillo, Eric Abidal y Wassim Akka. La web de presentación y el prototipo jugable están en `dist/`.

## Estado del proyecto

La base jugable se integra por milestones. `MS2` contiene el prototipo con pantalla dividida; `T15` añade el cambio manual y `T17` reúne correcciones posteriores. El equipo integrará el trabajo en `main` después de MS3.

El prototipo incluye tres vueltas con checkpoints obligatorios, contrarreloj y récord local, dos jugadores en el mismo teclado, pantalla dividida vertical u horizontal, nitro, rocas, plátanos, penalización de césped, colisiones, recuperación en el último control y seis marchas con RPM y calado.

Costa, neón y montaña son **ambientes visuales del mismo circuito**. No son tres trazados distintos todavía. El modo de dos jugadores es local; no hay multijugador online ni bots por ahora.

## Ejecutar

Sirve la carpeta del proyecto con Live Server y abre `dist/index.html`; también puedes abrir `dist/jugar.html` directamente. Otra opción desde la raíz del repositorio es `py -m http.server 8000` y después `http://localhost:8000/dist/index.html`. El juego carga módulos JavaScript, Three.js, Rapier y recursos locales desde `dist/`; utiliza un servidor HTTP local, no `file://`. No requiere instalar paquetes npm para jugar.

Si el botón «Empezar» permanece desactivado, abre «Modelos y ajustes» en el menú del juego para ver el error de carga. Las rutas y parámetros principales están en `dist/config.js`, `dist/ajustes-juego.js`, `dist/carrera.js` y `dist/nitro.js`.

## Controles

| Acción | Jugador 1 | Jugador 2 |
| --- | --- | --- |
| Acelerar y girar | W, A, D | Flecha arriba, izquierda, derecha |
| Frenar y retroceder | S | Flecha abajo |
| Bajar / subir marcha | Q / E | K / L |
| Volver al último control | F | Enter |

En solitario también funcionan las flechas para conducir. `P` o `Esc` pausa; `R` reinicia. Se sale en primera. Si el motor se cala en una marcha alta, bajar hasta primera lo vuelve a encender. El menú permite elegir 1 o 2 jugadores, orientación de pantalla, ambiente, obstáculos, sonido e idioma (ES/CA/EN).

## Reglas de carrera y récord

La meta solo cuenta después de cruzar todos los checkpoints en orden y en el sentido correcto. En dos jugadores gana el primero que complete la tercera vuelta. En solitario la mejor marca se guarda en este navegador para el circuito actual, separando partidas con obstáculos y sin ellos. Las salidas de prueba elegidas desde «Ver circuito» no guardan récord.

El cronómetro avanza con los pasos de física mientras la carrera está activa. Pausa y cambio de pestaña lo detienen. Si un fotograma tarda demasiado, se simulan como máximo 0,25 segundos: el tiempo descartado tampoco se añade al cronómetro, de modo que un bloqueo del navegador no penalice una marca sin avance equivalente.

## Archivos de código

- `dist/index.html`, `dist/script.js`, `dist/style.css`, `dist/themes.css`: web e idiomas.
- `dist/jugar.html`, `dist/juego.js`, `dist/juego.css`, `dist/interfaz.js`: partida, menús y HUD.
- `dist/carrera.js`, `dist/movimiento.js`, `dist/marchas.js`, `dist/fisica.js`: reglas, conducción y colisiones.
- `dist/terreno.js`, `dist/limites.js`, `dist/objetos.js`, `dist/nitro.js`: pista y elementos de carrera.
- `dist/vendor/`: bibliotecas usadas por el navegador; `dist/assets/`: recursos locales.

Consulta `dist/GUIA_THREEJS.md` para el flujo técnico y los puntos de configuración. `LEEME.md` y `VALIDACION.md` documentan una entrega anterior (T7) y sus pruebas; no describen la validación actual de T17.

## Próximos desarrollos

Primero: fantasma de la mejor vuelta, derrape con miniturbo, resultados con parciales e historial y configuración de carreras por datos. Después: bots para carreras en solitario. Con bots y tres circuitos funcionales, un torneo de tres carreras sumará los tiempos de finalización de cada participante; ganará el menor total. Al completar su tercera vuelta, cada coche dejará de ocupar pista y de colisionar, mientras los demás terminan. La puntuación y el resultado del torneo se mostrarán cuando todos hayan acabado.

Los trazados definitivos y sus reglas se configurarán cuando estén listos; el detector actual todavía requiere asfalto y césped. El multijugador online y los controles táctiles no forman parte del prototipo actual.
