export function circuloContraCoche(coche, huella, circulo) {
  const dx = circulo.x - coche.x,
    dz = circulo.z - coche.z,
    c = Math.cos(coche.rumbo),
    s = Math.sin(coche.rumbo);
  const x = dx * c - dz * s,
    z = dx * s + dz * c;
  const cx = Math.max(-huella.semiancho, Math.min(huella.semiancho, x)),
    cz = Math.max(-huella.semilargo, Math.min(huella.semilargo, z));
  return Math.hypot(x - cx, z - cz) < circulo.radio;
}

// SAT de rectángulos orientados. Separación simétrica para ambos jugadores.
export function separacionCoches(a, ha, b, hb) {
  const ejes = (r) => [
    { x: Math.cos(r), z: -Math.sin(r) },
    { x: Math.sin(r), z: Math.cos(r) },
  ];
  const ea = ejes(a.rumbo),
    eb = ejes(b.rumbo),
    dx = b.x - a.x,
    dz = b.z - a.z;
  let menor = Infinity,
    normal;
  const candidatos = [...ea, ...eb]
    .map((e) => (e.x < 0 || (Math.abs(e.x) < 1e-12 && e.z < 0) ? { x: -e.x, z: -e.z } : e))
    .sort((a, b) => Math.atan2(a.z, a.x) - Math.atan2(b.z, b.x));
  for (const e of candidatos) {
    const radio = (h, axes) =>
      h.semiancho * Math.abs(e.x * axes[0].x + e.z * axes[0].z) +
      h.semilargo * Math.abs(e.x * axes[1].x + e.z * axes[1].z);
    const d = dx * e.x + dz * e.z,
      solape = radio(ha, ea) + radio(hb, eb) - Math.abs(d);
    if (solape <= 0) return null;
    if (solape < menor - 1e-9) {
      menor = solape;
      const signo = d < 0 ? -1 : 1;
      normal = { x: e.x * signo, z: e.z * signo };
    }
  }
  return { x: (normal.x * (menor + 0.015)) / 2, z: (normal.z * (menor + 0.015)) / 2 };
}
export function resolverGanador(jugadores) {
  const final = jugadores
    .filter((j) => j.carrera.fase === 'terminada')
    .sort((a, b) => a.carrera.tiempo - b.carrera.tiempo);
  if (!final.length) return null;
  if (final.length > 1 && Math.abs(final[0].carrera.tiempo - final[1].carrera.tiempo) < 0.002)
    return 'empate';
  return final[0].id;
}
export function dividirPantallas(ancho, alto, numero) {
  if (numero === 1) return [{ x: 0, y: 0, w: ancho, h: alto, top: 0, left: 0 }];
  if (ancho >= 850) {
    const w = Math.floor(ancho / 2);
    return [
      { x: 0, y: 0, w, h: alto, top: 0, left: 0 },
      { x: w, y: 0, w: ancho - w, h: alto, top: 0, left: w },
    ];
  }
  const h = Math.floor(alto / 2);
  return [
    { x: 0, y: alto - h, w: ancho, h, top: 0, left: 0 },
    { x: 0, y: 0, w: ancho, h: alto - h, top: h, left: 0 },
  ];
}
