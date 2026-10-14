import * as THREE from 'three';

// No crea paredes visibles: exige suelo bajo el centro y las cuatro esquinas
// del coche. Se puede restringir a una malla/grupo concreto del GLB.
export function crearLimite(circuito, config) {
  const zona = config.nombreZona ? circuito.getObjectByName(config.nombreZona) : circuito;
  if (!zona) throw new Error(`No existe la zona de conducción '${config.nombreZona}'. Revisa su nombre en el panel.`);
  circuito.updateWorldMatrix(true, true);
  const caja = new THREE.Box3().setFromObject(zona, true);
  if (caja.isEmpty()) throw new Error('La zona de conducción no contiene geometría.');
  const ray = new THREE.Raycaster();
  const origen = new THREE.Vector3();
  const abajo = new THREE.Vector3(0, -1, 0);
  const matrizNormal = new THREE.Matrix3();
  const normal = new THREE.Vector3();
  const transformacion = new THREE.Matrix4();
  const instancia = new THREE.Matrix4();
  const altura = caja.max.y + 2;
  ray.far = altura - caja.min.y + 2;
  const margen = Math.max(0, config.margen);

  function alturaEn(x, z) {
    if (x < caja.min.x || x > caja.max.x || z < caja.min.z || z > caja.max.z) return null;
    origen.set(x, altura, z); ray.set(origen, abajo);
    for (const impacto of ray.intersectObject(zona, true)) {
      if (!impacto.face) continue;
      let visible = true;
      for (let nodo = impacto.object; nodo; nodo = nodo.parent) {
        if (!nodo.visible) { visible = false; break; }
      }
      if (!visible) continue;
      transformacion.copy(impacto.object.matrixWorld);
      if (impacto.object.isInstancedMesh && impacto.instanceId !== undefined) {
        impacto.object.getMatrixAt(impacto.instanceId, instancia);
        transformacion.multiply(instancia);
      }
      matrizNormal.getNormalMatrix(transformacion);
      normal.copy(impacto.face.normal).applyMatrix3(matrizNormal).normalize();
      if (normal.y >= config.normalMinimaY) return impacto.point.y;
    }
    return null;
  }

  function contiene(x, z, rumbo, huella) {
    const ancho = huella.semiancho + margen;
    const largo = huella.semilargo + margen;
    const c = Math.cos(rumbo), s = Math.sin(rumbo);
    if (alturaEn(x, z) === null) return false;
    for (const dx of [-ancho, ancho]) {
      for (const dz of [-largo, largo]) {
        const px = x + dx * c + dz * s;
        const pz = z - dx * s + dz * c;
        if (alturaEn(px, pz) === null) return false;
      }
    }
    return true;
  }

  function salidaSegura(posicion, rumbo, huella) {
    if (contiene(posicion[0], posicion[2], rumbo, huella)) {
      return [posicion[0], alturaEn(posicion[0], posicion[2]), posicion[2]];
    }
    const centro = caja.getCenter(new THREE.Vector3());
    const candidatos = [[centro.x, centro.z]];
    // Busca una salida válida si el origen cae fuera del terreno o en un hueco.
    for (let i = 1; i < 10; i++) {
      for (let j = 1; j < 10; j++) {
        candidatos.push([
          THREE.MathUtils.lerp(caja.min.x, caja.max.x, i / 10),
          THREE.MathUtils.lerp(caja.min.z, caja.max.z, j / 10),
        ]);
      }
    }
    candidatos.sort((a, b) => Math.hypot(a[0] - posicion[0], a[1] - posicion[2])
      - Math.hypot(b[0] - posicion[0], b[1] - posicion[2]));
    for (const [x, z] of candidatos) {
      if (contiene(x, z, rumbo, huella)) return [x, alturaEn(x, z), z];
    }
    return null;
  }
  return { contiene, alturaEn, salidaSegura, caja };
}
