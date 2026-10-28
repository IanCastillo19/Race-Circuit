import * as THREE from 'three';

// Los tres archivos mantienen las posiciones relativas exportadas en Blender.
export async function cargarConjuntoCoche(loader, rutas, ajustes) {
  const claves = ['chasis', 'ruedasDelanteras', 'ruedasTraseras'];
  const resultados = await Promise.allSettled(claves.map(clave => loader.loadAsync(rutas[clave])));
  const errores = resultados.flatMap((resultado, i) => resultado.status === 'rejected'
    ? [`${claves[i]}: ${rutas[claves[i]]}\n${resultado.reason}`] : []);
  if (errores.length) throw new Error(errores.join('\n'));

  const modelo = new THREE.Group();
  modelo.name = 'CocheMontado';
  const piezas = {};
  resultados.forEach((resultado, i) => {
    const clave = claves[i];
    const pieza = resultado.value.scene;
    if (new THREE.Box3().setFromObject(pieza, true).isEmpty()) {
      throw new Error(`${rutas[clave]} no contiene geometría visible.`);
    }
    const ajuste = ajustes.piezas?.[clave];
    if (ajuste) {
      if (!(ajuste.escala > 0)) throw new Error(`La escala de ${clave} debe ser positiva.`);
      pieza.scale.multiplyScalar(ajuste.escala);
      pieza.rotation.y += ajuste.giroGrados * Math.PI / 180;
      pieza.position.add(new THREE.Vector3(...ajuste.posicion));
    }
    piezas[clave] = pieza;
    modelo.add(pieza);
  });
  return { modelo, delanteras: piezas.ruedasDelanteras, traseras: piezas.ruedasTraseras };
}
