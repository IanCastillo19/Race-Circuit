# Race Circuit · Arcade completo y dos jugadores

Versión preparada el 3 de noviembre de 2026 sobre la rama **T7**, commit `b30687898726b4f6cac9f5ec3e6095d70919a0f5`, del repositorio `IanCastillo19/Race-Circuit`.

Incluye la web informativa y un juego en HTML, CSS y JavaScript con los GLB reales del coche, circuito y nitro. El modo de dos jugadores es **local**, en el mismo ordenador y teclado, con pantalla dividida.

## Probar e incorporar

1. Descomprime el ZIP en una carpeta.
2. Abre la carpeta con VS Code y ejecuta `dist/index.html` con Live Server. El botón «Jugar ahora» abre el juego; también puedes abrir directamente `dist/jugar.html` con Live Server.
3. Elige uno o dos jugadores, ambiente, calidad, obstáculos y sonido. Pulsa «Empezar carrera».
4. Para incorporarlo al repositorio, crea una rama desde T7, por ejemplo `arcade-multijugador`, y copia esta carpeta `dist` sobre la del proyecto. Recarga con Ctrl + F5 y revisa el diff antes del commit.

Three.js 0.186.0, sus dependencias y la tipografía están incluidos localmente: no necesitas npm ni conexión a una CDN para ejecutar esta versión. Sigue siendo necesario un servidor HTTP local, como Live Server; abrir el HTML mediante `file://` puede bloquear los módulos.

El paquete incluye el nitro real en `dist/assets/Modelos/nitro.glb`. El archivo que estaba en `modelos/nitro.glb` se ha copiado a esa ruta para unificar la carga. Los cuatro GLB del coche y circuito conservan sus rutas en `assets/Modelos/modelos_prototipos`.

## Qué se ha mejorado

| Área | Resultado |
|---|---|
| Conducción | Conserva 90 km/h, aceleración 3, frenada 6 y retención 1,5 de tu T7. Giro máximo de 20° a baja velocidad y 9° a alta velocidad. S tiene prioridad sobre W. |
| Césped y límites | Superficie superior aunque las caras estén invertidas; penalización progresiva según las ruedas fuera. Se respeta la huella del coche en el borde. El arco de meta no se usa como suelo. |
| Rendimiento | Terreno estático con índice espacial; física en pasos de 1/120 s; geometrías compartidas entre jugadores; calidad mediante pixel ratio configurable. |
| Cámara | Seguimiento independiente por jugador, mayor distancia y campo de visión durante el nitro. El giro visual del plátano no hace girar la cámara. |
| Carrera | Salida configurada, cuenta atrás, 11 controles obligatorios y tres vueltas. Cruces con anchura y sentido; detección del segmento entre fotogramas. |
| Tiempos | Cronómetro, parciales por vuelta, resultado y récord local de contrarreloj. La marca objetivo aparece en el menú. |
| Nitro | GLB real, tres plataformas, 3 s de impulso, máximo ×1,35 y aceleración ×2,5. S permite frenar. Las plataformas se comparten entre jugadores y reaparecen tras 6 s. |
| Rocas | Tres obstáculos con colisión contra la carrocería: no se atraviesan. |
| Plátanos | Tres obstáculos que reducen la velocidad y provocan un giro visual de 1,2 s. Reaparecen tras 10 s. |
| Recuperación | Regresa al último control validado, conserva el progreso y deja el coche inmóvil 2 s mientras el cronómetro sigue contando. Inmunidad breve para evitar choques al reaparecer. |
| Dos jugadores | Dos coches con colores, cámaras, ruedas, controles, cronómetros y progreso independientes. Colisión entre coches. Gana quien termina primero; WIN J1 / WIN J2 y empate si los tiempos coinciden prácticamente. |
| Interfaz | Menú de partida, HUD por jugador, minimapa con posiciones y siguiente control, indicadores de efecto, pausa y resultados. |
| Aspecto | Ambientes Costa, Neón y Alpino, asfalto más legible, bordes luminosos en Neón, tipografía Racing Sans One. |
| Sonido | Motor según velocidad y efectos de cuenta atrás, nitro, impactos, controles y victoria. Activable y desactivable. |
| Idiomas y web | ES/CA/EN. La web describe las funciones disponibles y transmite modo, idioma y ambiente al juego. Mantiene el texto en bucle y los fondos temáticos. |

## Controles

| Acción | J1 | J2 |
|---|---|---|
| Acelerar | W | ↑ |
| Frenar / marcha atrás | S | ↓ |
| Girar | A / D | ← / → |
| Volver al último control | F | Enter |
| Pausa / continuar | P o Esc | Compartido |
| Reiniciar toda la carrera | R | Compartido |
| Empezar / continuar desde pausa | Espacio o botón | Compartido |

En un jugador también sirven las flechas para conducir. En dos jugadores, WASD pertenece a J1 y las flechas a J2. La pantalla se divide en columnas en ventanas amplias y se apila en ventanas estrechas. No hay controles táctiles ni mandos en esta versión.

Algunos teclados limitan ciertas combinaciones simultáneas de teclas. La compatibilidad física debe probarse con el teclado que usaréis para la presentación.

## Reglas, pausa y recuperación

- El primer paso por la meta desde la parrilla no suma vuelta. Primero debes completar los controles 1–11.
- Los controles solo cuentan al atravesarlos hacia delante, dentro de su anchura y sobre el asfalto. Rodear el circuito por el césped y cruzar la meta no suma una vuelta.
- Se validan puertas en orden, no toda la trayectoria entre ellas. Para restringir más un recorte concreto, añade controles en `carrera.js`.
- El nitro no se acumula. Si J1 consume una plataforma, J2 espera a que reaparezca. El efecto individual y la recarga se detienen en pausa.
- Las rocas bloquean. Los plátanos reducen la velocidad y anulan el nitro activo durante el impacto.
- F / Enter no avanzan controles: solo devuelven al último que ya se ha validado. El cronómetro sigue corriendo durante los 2 s de inmovilización.
- P / Esc, el botón de pausa, perder el foco o cambiar de pestaña detienen la partida. Para seguir, pulsa Continuar.
- R borra el progreso de los dos jugadores, restaura objetos y nitros y repite la cuenta atrás.
- En dos jugadores la carrera acaba al primer tercer paso válido por meta. Si ambos terminan en el mismo paso de física, se compara el instante interpolado del cruce.

## Récords

Las marcas de contrarreloj se guardan mediante localStorage para ese navegador y origen del servidor. Se separan las carreras con obstáculos y sin obstáculos. La versión usa una clave nueva para no mezclar marcas de físicas anteriores; las claves antiguas no se borran.

El modo de dos jugadores muestra el ganador y los tiempos por vuelta, pero no guarda un récord de contrarreloj. Cambiar la calidad o el ambiente no altera las reglas físicas.

«Ver circuito», dentro de pausa, permite inspeccionar la pista. Mayús + clic prueba otra posición de salida para J1 y reinicia la carrera. Esa sesión queda marcada como entrenamiento y no guarda récords. Recarga para restaurar la salida normal.

## Archivos para ajustar el juego

| Archivo | Qué modificar |
|---|---|
| `dist/config.js` | Rutas del coche/circuito, tamaño, giro del modelo, aceleración, velocidad, frenada, césped y cámara. |
| `dist/carrera.js` | Salida, dirección, controles, meta y número de vueltas. Las coordenadas son locales al circuito. |
| `dist/nitro.js` | Ruta del GLB, tamaño, orientación, duración, recarga, multiplicadores y ángulos de dirección. |
| `dist/ajustes-juego.js` | Posiciones y radios de rocas/plátanos, duración del efecto, recuperación y rutas opcionales de sus GLB. |
| `dist/objetos.js` | Modelos geométricos provisionales, señales de control y aspecto de cada ambiente. |
| `dist/interfaz.js` | Textos del juego en los tres idiomas y HUD/minimapa. |
| `dist/audio.js` | Sonidos sintetizados y volumen. |
| `dist/script.js` | Textos y comportamiento de la web informativa. |

Para sustituir los modelos provisionales por vuestros GLB, cambia `AJUSTES.modelos.roca` y `AJUSTES.modelos.platano`, inicialmente `null`, por sus rutas. El código los carga una vez, centra, escala y duplica en las posiciones configuradas. Si una posición no está en asfalto, aparece un aviso y se omite.

## Qué sigue siendo prototipo

- Los dos jugadores usan dos copias del mismo coche, con materiales independientes y colores cian/coral. No se han inventado tres modelos terminados.
- Costa, Neón y Alpino son tres ambientaciones del **mismo circuito**, no tres mapas distintos. Las ilustraciones de la web siguen identificadas como arte conceptual.
- Las rocas, los plátanos y las montañas exteriores usan geometrías provisionales de código. Coche, circuito y nitro usan vuestros GLB de Blender.
- La conducción es arcade sobre el terreno: no hay suspensión física completa ni inclinación de la carrocería en pendientes.
- El multijugador es local, no online.

Las mejoras adicionales están en `MEJORAS_PARA_DECIDIR.md`; no se han implementado sin discutirlas.

## Validación y entrega

Consulta `VALIDACION.md`: incluye pruebas de reglas, colisiones, terreno, récords, navegador WebGL y dos jugadores, así como las comprobaciones manuales que quedan para vuestro equipo.

Licencias de dependencias: `dist/vendor/three/LICENSE` y `dist/assets/fonts/OFL-RacingSansOne.txt`.

Commit sugerido tras probar: `Mejorar el prototipo arcade y añadir multijugador local a pantalla dividida`.
