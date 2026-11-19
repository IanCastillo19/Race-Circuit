# Cambio manual — Race Circuit
J1: Q baja / E sube. J2: K baja / L sube.
Salida en primera. S o flecha abajo frena y retrocede; indicador R al retroceder.
Límites: 27, 47, 67, 87, 104 y 120 km/h. Nitro: hasta 162 km/h en sexta.
Calado tras 1 segundo por debajo de 9/18/28/40/55 km/h en 2ª–6ª. Primera no se cala.
Para arrancar automáticamente, baja hasta primera. Las reducciones frenan progresivamente a 10 m/s²; puedes subir rápidamente para aliviar la retención.
El motor calado conserva inercia y permite frenar y dirigir.
Recolocar y reiniciar restauran primera y motor encendido.
Sonido de motor según RPM y efecto al cambiar (activa Sonido en el menú).
Récords separados de las versiones anteriores por el cambio de velocidad y reglas.

Archivos modificados: config.js, movimiento.js, juego.js, interfaz.js, audio.js, juego.css.
Archivo nuevo: marchas.js.
Usar Live Server como en la versión anterior.

Tarea: Implementar cambio manual y calado.
Commit: feat: añade marchas manuales, calado y HUD de revoluciones
Descripción: Integra seis marchas hasta 120 km/h, reducciones progresivas y rearranque al seleccionar primera. Añade controles independientes, RPM, sonido y compatibilidad con nitro y pantalla dividida.
