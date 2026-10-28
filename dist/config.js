// Rutas ajustadas a los cuatro GLB de tu captura.
// Three.js usa metros en esta base. El coche mira hacia -Z; Y es arriba.
export const CONFIG = {
  modelos: {
    chasis: './assets/Modelos/modelos_prototipos/Chasis.glb',
    ruedasDelanteras: './assets/Modelos/modelos_prototipos/RuedasD.glb',
    ruedasTraseras: './assets/Modelos/modelos_prototipos/RuedasT.glb',
    circuito: './assets/Modelos/modelos_prototipos/Circuito.glb',
  },
  coche: {
    longitudMetros: 4.2,       // Ajusta el tamaño de todo el coche de forma uniforme.
    giroModeloGrados: -90,     // Corrige el avance lateral. Si queda de culo, usa -90.
    radioRuedaMetros: null,   // null = calcular a partir de las ruedas del modelo.
    distanciaEjesMetros: null,// null = calcular entre ruedas delanteras y traseras.
    sentidoRodadura: 1,       // Mantén 1 para un coche que mira hacia -Z.
    // Si todas las piezas se exportaron desde la misma escena de Blender,
    // conserva estos ajustes. No recentres cada pieza por separado al exportar.
    piezas: {
      chasis: { posicion: [0, 0, 0], giroGrados: 0, escala: 1 },
      ruedasDelanteras: { posicion: [0, 0, 0], giroGrados: 0, escala: 1 },
      ruedasTraseras: { posicion: [0, 0, 0], giroGrados: 0, escala: 1 },
    },
    ruedas: {
      delanteraIzquierda: 'Rueda_DI',
      delanteraDerecha: 'Rueda_DD',
      traseraIzquierda: 'Rueda_TI',
      traseraDerecha: 'Rueda_TD',
    },
  },
  circuito: {
    escala: 1,                // Ejemplo: 0.01 si el circuito está 100 veces más grande.
    giroGrados: 0,
    posicion: [0, 0, 0],
    nombreSuelo: null,        // Mejor: nombre de la malla de carretera, p. ej. 'Carretera'.
    seguirAlturaSuelo: true,  // Sigue la altura, pero todavía no inclina el coche.
  },
  limites: {
    activo: true,
    nombreZona: null,         // null = superficie del circuito. O el nombre de la malla/grupo del terreno permitido.
    margen: 0.1,             // Separación adicional del borde, en metros.
    pasoMaximo: 0.2,         // Comprueba el recorrido en pasos cortos para no saltar un borde.
    normalMinimaY: 0.55,      // Ignora paredes verticales al buscar terreno.
  },
  salida: {
    posicion: [0, 0, 0],      // X, Y, Z. Puedes elegirla con Mayús + clic en el circuito.
    rumboGrados: 0,          // Orientación inicial del jugador, independiente del GLB.
  },
  conduccion: {
    velocidadMaxima: 16,      // m/s: aproximadamente 58 km/h.
    velocidadMarchaAtras: 5,
    aceleracion: 6,
    aceleracionMarchaAtras: 4,
    frenada: 12,
    desaceleracion: 2,        // Pérdida de velocidad al soltar W/S.
    giroMaximoGrados: 30,
    respuestaDireccion: 9,
  },
  camara: {
    distancia: 12,
    altura: 6.5,
    mirarDelante: 4,
    suavidad: 7,
  },
};
