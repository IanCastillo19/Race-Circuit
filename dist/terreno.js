import * as THREE from 'three';

// Índice espacial del terreno estático. Acepta caras invertidas y elige la
// superficie superior sin recorrer todas las mallas en cada paso de física.
export function crearDetectorTerreno(circuito, config) {
  const nombre = (n) => THREE.PropertyBinding.sanitizeNodeName(n);
  const tipos = new Map([
    ...config.nombresAsfalto.map((n) => [nombre(n), 'asfalto']),
    ...config.nombresCesped.map((n) => [nombre(n), 'cesped']),
  ]);
  const celdas = new Map(),
    clases = new Set(),
    caja = new THREE.Box3(),
    tam = 8;
  const a = new THREE.Vector3(),
    b = new THREE.Vector3(),
    c = new THREE.Vector3(),
    u = new THREE.Vector3(),
    v = new THREE.Vector3();
  circuito.updateWorldMatrix(true, true);
  circuito.traverse((m) => {
    if (!m.isMesh || !m.geometry?.attributes.position) return;
    let tipo;
    for (let p = m; p; p = p.parent) {
      if (!p.visible) return;
      if (!tipo) tipo = tipos.get(nombre(p.name));
      if (p === circuito) break;
    }
    if (!tipo) return;
    clases.add(tipo);
    const pos = m.geometry.attributes.position,
      idx = m.geometry.index,
      n = idx ? idx.count : pos.count;
    for (let i = 0; i < n; i += 3) {
      a.fromBufferAttribute(pos, idx ? idx.getX(i) : i).applyMatrix4(m.matrixWorld);
      b.fromBufferAttribute(pos, idx ? idx.getX(i + 1) : i + 1).applyMatrix4(m.matrixWorld);
      c.fromBufferAttribute(pos, idx ? idx.getX(i + 2) : i + 2).applyMatrix4(m.matrixWorld);
      u.subVectors(b, a);
      v.subVectors(c, a);
      u.cross(v);
      if (Math.abs(u.y) / Math.max(u.length(), 1e-12) < 0.55) continue;
      const den = (b.z - c.z) * (a.x - c.x) + (c.x - b.x) * (a.z - c.z);
      if (Math.abs(den) < 1e-12) continue;
      const t = {
        ax: a.x,
        ay: a.y,
        az: a.z,
        bx: b.x,
        by: b.y,
        bz: b.z,
        cx: c.x,
        cy: c.y,
        cz: c.z,
        den,
        tipo,
      };
      caja.expandByPoint(a);
      caja.expandByPoint(b);
      caja.expandByPoint(c);
      for (
        let x = Math.floor(Math.min(a.x, b.x, c.x) / tam);
        x <= Math.floor(Math.max(a.x, b.x, c.x) / tam);
        x++
      )
        for (
          let z = Math.floor(Math.min(a.z, b.z, c.z) / tam);
          z <= Math.floor(Math.max(a.z, b.z, c.z) / tam);
          z++
        ) {
          const k = x + ',' + z;
          if (!celdas.has(k)) celdas.set(k, []);
          celdas.get(k).push(t);
        }
    }
  });
  const disponible = clases.has('asfalto') && clases.has('cesped');
  const avisos = disponible
    ? []
    : ['No se encuentran ambas superficies. Revisa los nombres de asfalto y césped en config.js.'];
  function superficieEn(x, z) {
    if (!disponible) return null;
    let mejor = null;
    for (const t of celdas.get(Math.floor(x / tam) + ',' + Math.floor(z / tam)) ?? []) {
      const p = ((t.bz - t.cz) * (x - t.cx) + (t.cx - t.bx) * (z - t.cz)) / t.den;
      const q = ((t.cz - t.az) * (x - t.cx) + (t.ax - t.cx) * (z - t.cz)) / t.den,
        r = 1 - p - q;
      if (p < -0.000001 || q < -0.000001 || r < -0.000001) continue;
      const y = p * t.ay + q * t.by + r * t.cy;
      if (!mejor || y > mejor.y) mejor = { y, tipo: t.tipo };
    }
    return mejor;
  }
  const tipoEn = (x, z) => superficieEn(x, z)?.tipo ?? null,
    alturaEn = (x, z) => superficieEn(x, z)?.y ?? null;
  function porcentajeCesped(e, puntos) {
    if (!config.activo || !puntos.length) return 0;
    const c = Math.cos(e.rumbo),
      s = Math.sin(e.rumbo);
    return (
      puntos.filter((p) => tipoEn(e.x + p.x * c + p.z * s, e.z - p.x * s + p.z * c) === 'cesped')
        .length / puntos.length
    );
  }
  return { tipoEn, alturaEn, superficieEn, porcentajeCesped, disponible, avisos, caja };
}
