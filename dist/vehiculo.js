import * as THREE from 'three';

const RAD = Math.PI / 180;

function cajaDe(objeto) {
  objeto.updateWorldMatrix(true, true);
  return new THREE.Box3().setFromObject(objeto, true);
}

function escalaApta(objeto, limite) {
  for (let actual = objeto; actual && actual !== limite; actual = actual.parent) {
    const { x, y, z } = actual.scale;
    if (x <= 0 || y <= 0 || z <= 0) return false;
    if (Math.max(x, y, z) - Math.min(x, y, z) > Math.max(x, y, z) * 1e-4) return false;
  }
  return true;
}

// Si un GLB contiene dos ruedas separadas sin los nombres previstos, agrupa
// sus piezas por lado. Una malla que contiene ambas ruedas necesita separarse
// en Blender: girar el eje entero haría orbitar las ruedas alrededor del coche.
function prepararEje(origen, modelo, actor, nombres, etiqueta, avisos) {
  if (!origen) return;
  if (nombres.some(nombre => origen.getObjectByName(nombre))) return;
  const caja = cajaDe(origen);
  if (caja.isEmpty()) return;
  const medioX = caja.getCenter(new THREE.Vector3()).x;
  const margen = Math.max(caja.getSize(new THREE.Vector3()).x * 1e-5, 1e-6);
  const lados = [[], []];
  let geometriaCentral = false;
  function buscar(objeto) {
    const limites = cajaDe(objeto);
    if (limites.isEmpty()) return;
    if (limites.max.x < medioX - margen) lados[0].push(objeto);
    else if (limites.min.x > medioX + margen) lados[1].push(objeto);
    else if (objeto.isMesh) geometriaCentral = true;
    else objeto.children.forEach(buscar);
  }
  buscar(origen);
  let huesos = false;
  origen.traverse(nodo => { if (nodo.isSkinnedMesh) huesos = true; });
  if (geometriaCentral || !lados[0].length || !lados[1].length || huesos) {
    avisos.push(`${etiqueta}: no se distinguen dos ruedas independientes. Sepáralas en Blender y nómbralas ${nombres.join(' / ')}.`);
    return;
  }
  if (lados.flat().some(objeto => !escalaApta(objeto, actor))) {
    avisos.push(`${etiqueta}: aplica Rotation & Scale antes de exportar las ruedas.`);
    return;
  }
  lados.forEach((objetos, i) => {
    const grupo = new THREE.Group();
    grupo.name = nombres[i];
    modelo.add(grupo);
    actor.updateWorldMatrix(true, true);
    objetos.forEach(objeto => grupo.attach(objeto));
  });
}

export function crearVehiculo(modelo, config, ejes = {}) {
  const avisos = [];
  const actor = new THREE.Group();
  actor.name = 'Jugador';
  actor.add(modelo);
  modelo.rotation.y += config.giroModeloGrados * RAD;

  let caja = cajaDe(actor);
  if (caja.isEmpty()) throw new Error('El GLB del coche no contiene geometría visible.');
  const tamaño = caja.getSize(new THREE.Vector3());
  if (tamaño.z < 0.001) throw new Error('Comprueba la orientación y el tamaño del coche.');
  modelo.scale.multiplyScalar(config.longitudMetros / tamaño.z);

  // Centramos el coche sobre el jugador; su punto más bajo queda en Y=0.
  caja = cajaDe(actor);
  const centro = caja.getCenter(new THREE.Vector3());
  modelo.position.x -= centro.x;
  modelo.position.y -= caja.min.y;
  modelo.position.z -= centro.z;
  actor.updateWorldMatrix(true, true);

  prepararEje(ejes.delanteras, modelo, actor,
    [config.ruedas.delanteraIzquierda, config.ruedas.delanteraDerecha], 'RuedasD.glb', avisos);
  prepararEje(ejes.traseras, modelo, actor,
    [config.ruedas.traseraIzquierda, config.ruedas.traseraDerecha], 'RuedasT.glb', avisos);

  // Localiza primero todas las ruedas, antes de cambiar su jerarquía.
  const encontrados = Object.entries(config.ruedas).map(([tipo, nombre]) => {
    const candidatos = [];
    modelo.traverse(objeto => { if (objeto.name === nombre) candidatos.push(objeto); });
    if (candidatos.length !== 1) {
      avisos.push(`${nombre}: ${candidatos.length === 0 ? 'no se encuentra' : 'nombre duplicado'}.`);
      return null;
    }
    return { tipo, nombre, objeto: candidatos[0] };
  }).filter(Boolean);

  const ruedas = [];
  for (const item of encontrados) {
    let animadaPorHuesos = false;
    item.objeto.traverse(nodo => { if (nodo.isSkinnedMesh) animadaPorHuesos = true; });
    const solapada = encontrados.some(otro => {
      if (otro === item) return false;
      for (let padre = item.objeto.parent; padre; padre = padre.parent) {
        if (padre === otro.objeto) return true;
      }
      return false;
    });
    if (solapada || animadaPorHuesos || !escalaApta(item.objeto, actor)) {
      avisos.push(`${item.nombre}: aplica Rotation & Scale, usa ruedas independientes y sin armature.`);
      continue;
    }

    const cajaRueda = cajaDe(item.objeto);
    if (cajaRueda.isEmpty()) {
      avisos.push(`${item.nombre}: no tiene geometría.`);
      continue;
    }
    const centroLocal = actor.worldToLocal(cajaRueda.getCenter(new THREE.Vector3()));
    const tamañoRueda = cajaRueda.getSize(new THREE.Vector3());
    const radio = config.radioRuedaMetros ?? Math.max(tamañoRueda.y, tamañoRueda.z) / 2;
    if (!(radio > 0)) throw new Error(`Radio inválido de ${item.nombre}.`);

    const direccion = new THREE.Group();
    direccion.name = `${item.nombre}_Direccion`;
    direccion.position.copy(centroLocal);
    const rodadura = new THREE.Group();
    rodadura.name = `${item.nombre}_Rodadura`;
    actor.add(direccion);
    direccion.add(rodadura);
    actor.updateWorldMatrix(true, true);

    // Conserva posición, rotación y escala del GLB al cambiar de padre.
    rodadura.attach(item.objeto);
    ruedas.push({ ...item, direccion, rodadura, centro: centroLocal,
      delantera: item.tipo.startsWith('delantera'), radio, angulo: 0 });
  }

  const delanteras = ruedas.filter(rueda => rueda.delantera);
  const traseras = ruedas.filter(rueda => !rueda.delantera);
  let distanciaEjes = config.distanciaEjesMetros;
  if (distanciaEjes === null || distanciaEjes === undefined) {
    const mediaZ = lista => lista.reduce((suma, rueda) => suma + rueda.centro.z, 0) / lista.length;
    distanciaEjes = delanteras.length && traseras.length
      ? Math.abs(mediaZ(delanteras) - mediaZ(traseras)) : 2.6;
  }
  if (!(distanciaEjes > 0.1)) throw new Error('La distancia entre ejes debe ser mayor que 0.1 m.');
  if (delanteras.some(rueda => rueda.centro.z > 0)) {
    avisos.push('Las ruedas delanteras están detrás del centro: comprueba giroModeloGrados y los nombres.');
  }

  return {
    actor, ruedas, avisos, distanciaEjes,
    actualizarRuedas(distancia, anguloDireccion) {
      for (const rueda of ruedas) {
        rueda.direccion.rotation.y = rueda.delantera ? anguloDireccion : 0;
        // -X produce rodadura hacia -Z. La marcha atrás invierte el signo.
        rueda.angulo = (rueda.angulo - distancia / rueda.radio * config.sentidoRodadura)
          % (Math.PI * 2);
        rueda.rodadura.rotation.x = rueda.angulo;
      }
    },
    reiniciarRuedas() {
      for (const rueda of ruedas) {
        rueda.angulo = 0;
        rueda.direccion.rotation.y = 0;
        rueda.rodadura.rotation.x = 0;
      }
    },
  };
}
