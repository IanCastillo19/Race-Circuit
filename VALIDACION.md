# Validación · Race Circuit Arcade

Fecha: 3 de noviembre de 2026.

## Pruebas de navegador

Chrome Headless 135 con WebGL mediante SwiftShader. Se cargaron los GLB reales del coche, ruedas, circuito y nitro, incluidas sus dos texturas. Las peticiones externas se bloquearon en la prueba completa para verificar los recursos locales.

Resultado: 21 comprobaciones end-to-end superadas; cero errores de JavaScript o de consola.

- Carga offline de Three.js, 4 GLB originales y nitro real con sus 2 texturas
- Menú, salida, cuenta atrás y teclado real
- El nitro real activa impulso sin W, respeta S y desaparece durante recarga
- Césped frena de 90 a 36 km/h y mantiene las ruedas sobre la superficie
- 3 rocas sólidas y 3 plátanos sobre asfalto; el coche no atraviesa una roca
- Plátano: pérdida de velocidad, giro temporal y recarga
- Pausa congela cronómetro, nitro y recargas; el teclado reanuda
- Meta sin controles y cruces en sentido contrario no suman progreso
- F devuelve al último control, mantiene progreso y penaliza con inmovilización
- Tres vueltas completas con controles ordenados, resultado y tiempo congelado
- R reinicia tiempo, controles, objetos y efecto de nitro
- Dos coches independientes: WASD mueve solo J1 y flechas solo J2
- Las colisiones entre jugadores separan ambos coches
- Nitro compartido: J2 no puede recoger la plataforma consumida por J1
- Enter recupera J2 sin reiniciar a J1
- Pantalla dividida con dos cámaras y HUD independientes
- Victoria de J2 al completar primero las tres vueltas
- Castellano, catalán e inglés sin claves de traducción perdidas
- Pantalla estrecha: vistas apiladas y menú accesible sin desbordamiento horizontal
- Sonido activable y desactivable con gesto de usuario
- Web informativa enlaza al modo, idioma y ambiente elegidos

## Comprobaciones complementarias

- Las tres ambientaciones cargan y renderizan: Costa, Neón y Alpino.
- El contador de salida se oculta al comenzar y la animación de victoria se reinicia entre partidas.
- La marca local se muestra en el menú y se separa según los obstáculos.
- Se revisó visualmente la interfaz de escritorio, pantalla dividida, ventana estrecha y resultados.

## Pruebas de reglas y geometría

- 13 casos de césped, marcha atrás, frenado gradual, mezcla por ruedas, normales invertidas, nombres y transformaciones.
- 8 casos de reglas de carrera, orden, sentido, segmentos rápidos, vueltas y cronómetro.
- 7 casos de nitro y dirección, incluidas ruta fallida y plataformas provisionales.
- 7 casos nuevos de rocas, separación entre coches, ganador/empate, partición del canvas, nitro compartido, récords y terreno.
- La altura del índice espacial coincide con raycasting contra las superficies de suelo en 1000 puntos del Circuito.glb. El arco se excluye deliberadamente.

Los valores de física de algunos tests unitarios se fijan como fixtures para repetir los casos anteriores. La prueba WebGL confirma que el paquete conserva los valores reales de T7: máximo 25 m/s, aceleración 3 y frenada 6.

## Límites de estas pruebas

Los cruces de tres vueltas se automatizaron situando el coche antes de cada puerta y avanzando la física a través de ella. Esto verifica progresión y victoria, pero no equivale a que una persona haya recorrido tres vueltas completas con el teclado.

El renderizado con SwiftShader permite detectar errores de carga y WebGL, pero no mide el rendimiento de vuestras tarjetas gráficas. No se han probado físicamente vuestras combinaciones de teclado ni otros navegadores.

## Comprobación manual del equipo

1. Recorrer una carrera completa de un jugador en cada ambiente.
2. Probar dos jugadores simultáneos con el teclado que usaréis en clase.
3. Revisar la dificultad de las curvas y las posiciones de objetos a 90 km/h.
4. Ajustar giro, nitro y cámara si la sensación de conducción lo pide.
5. Confirmar que los récords sobreviven a recargar en vuestro Live Server.
6. Revisar la salida y las puertas si modificáis el circuito en Blender.
7. Sustituir rocas y plátanos por vuestros modelos cuando estén listos.
