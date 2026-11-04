export const AJUSTES = {
  pasoFisica: 1 / 120,
  recuperacionSegundos: 2,
  inmunidadRecuperacion: 3,
  duracionPlatano: 1.2,
  recargaPlatano: 10,
  // Rutas GLB opcionales; null utiliza un prototipo geométrico.
  modelos: { roca: null, platano: null },
  rocas: [
    { x: 96, z: -9, radio: 0.9 },
    { x: -63, z: -56, radio: 0.85 },
    { x: -20, z: 24, radio: 0.9 },
  ],
  platanos: [
    { x: 96, z: 31, radio: 0.7 },
    { x: 27, z: -80, radio: 0.7 },
    { x: -104, z: 12, radio: 0.7 },
  ],
  colores: ['#51e2f5', '#ff8569'],
};
