import * as THREE from 'three';

// Solo consulta las mallas de suelo indicadas en config.js. Así, el arco
// de meta y los futuros objetos no se confunden con la carretera.
export function crearDetectorTerreno(circuito, config) {
  const avisos = [];
  // Compara los nombres con la misma normalización de GLTFLoader.
  // Acepta tanto 'Plane.002' de Blender como 'Plane002' del juego.
  const normalizar = nombre => THREE.PropertyBinding.sanitizeNodeName(nombre);
  const tipos = new Map([
    ...config.nombresAsfalto.map(nombre => [normalizar(nombre), 'asfalto']),
    ...config.nombresCesped.map(nombre => [normalizar(nombre), 'cesped']),
  ]);
  const tipoPorMalla = new Map();
  circuito.traverse(objeto => {
    if (!objeto.isMesh) return;
    for (let nodo = objeto; nodo; nodo = nodo.parent) {
      const nombre = normalizar(nodo.name);
      if (tipos.has(nombre)) {
        tipoPorMalla.set(objeto, tipos.get(nombre));
        break;
      }
      if (nodo === circuito) break;
    }
  });
  const mallas = [...tipoPorMalla.keys()];
  const clases = new Set(tipoPorMalla.values());
  const disponible = clases.has('asfalto') && clases.has('cesped');
  if (!disponible) {
    avisos.push('Césped: no se encuentran ambas superficies. Revisa cesped.nombresCesped y cesped.nombresAsfalto en config.js; la penalización se desactiva hasta corregirlos.');
  }
  circuito.updateWorldMatrix(true, true);
  const caja = new THREE.Box3();
  for (const malla of mallas) caja.expandByObject(malla, true);
  const origen = new THREE.Vector3();
  const abajo = new THREE.Vector3(0, -1, 0);
  const normal = new THREE.Vector3();
  const matrizNormal = new THREE.Matrix3();
  const ray = new THREE.Raycaster();
  const impactos = [];
  const altura = caja.max.y + 2;
  ray.far = altura - caja.min.y + 2;

  function superficieEn(x, z) {
    if (!disponible || x < caja.min.x || x > caja.max.x || z < caja.min.z || z > caja.max.z) return null;
    origen.set(x, altura, z);
    ray.set(origen, abajo);
    impactos.length = 0;
    ray.intersectObjects(mallas, false, impactos);
    // Three.js ordena los impactos por distancia. La carretera situada
    // sobre el césped gana; no basta con detectar césped en cualquier altura.
    for (const impacto of impactos) {
      if (!impacto.face) continue;
      let visible = true;
      for (let nodo = impacto.object; nodo; nodo = nodo.parent) {
        if (!nodo.visible) { visible = false; break; }
      }
      if (!visible) continue;
      matrizNormal.getNormalMatrix(impacto.object.matrixWorld);
      normal.copy(impacto.face.normal).applyMatrix3(matrizNormal).normalize();
      // Conserva la compatibilidad con las normales invertidas del prototipo.
      if (Math.abs(normal.y) >= 0.55) return { tipo: tipoPorMalla.get(impacto.object), y: impacto.point.y };
    }
    return null;
  }

  const tipoEn = (x, z) => superficieEn(x, z)?.tipo ?? null;
  const alturaEn = (x, z) => superficieEn(x, z)?.y ?? null;

  function porcentajeCesped(estado, puntosRuedas) {
    if (!config.activo || !disponible || !puntosRuedas.length) return 0;
    const c = Math.cos(estado.rumbo), s = Math.sin(estado.rumbo);
    let fuera = 0;
    for (const punto of puntosRuedas) {
      const x = estado.x + punto.x * c + punto.z * s;
      const z = estado.z - punto.x * s + punto.z * c;
      if (tipoEn(x, z) === 'cesped') fuera++;
    }
    return fuera / puntosRuedas.length;
  }
  return { tipoEn, alturaEn, porcentajeCesped, avisos, disponible };
}
