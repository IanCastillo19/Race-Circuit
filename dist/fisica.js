// Rapier integra las poses y resuelve los contactos. El controlador arcade
// aporta la tracción y el giro. El terreno existente proporciona la cota Y.
import RAPIER from './vendor/rapier/rapier-0.17.3.js';
import { avanzar } from './movimiento.js';

const COCHE = 1, ROCA = 2, PLATANO = 4;
const grupos = (pertenece, detecta) => (pertenece << 16) | detecta;
const cero = { x: 0, y: 0, z: 0 };
const rotacionY = a => ({ x: 0, y: Math.sin(a / 2), z: 0, w: Math.cos(a / 2) });

export async function crearFisica(dt) {
  await RAPIER.init();
  const mundo = new RAPIER.World(cero);
  mundo.timestep = dt;
  const cola = new RAPIER.EventQueue(true);
  const sensores = new Map();
  const rocas = new Map();
  const jugadoresPorCollider = new Map();
  const obstaculos = [];

  function instalarObjetos(objetos, terreno) {
    for (const p of [...objetos.rocas, ...objetos.platanos]) {
      const sensor = objetos.platanos.includes(p);
      const y = terreno.alturaEn(p.x, p.z) ?? 0;
      const desc = RAPIER.ColliderDesc.cylinder(p.radio, p.radio)
        .setTranslation(p.x, y + p.radio, p.z).setSensor(true)
        .setFriction(0.45).setRestitution(0.03)
        .setCollisionGroups(grupos(sensor ? PLATANO : ROCA, COCHE));
      const col = mundo.createCollider(desc);
      obstaculos.push(col);
      if (sensor) sensores.set(col.handle, p);
      else rocas.set(col.handle, { objeto: p, collider: col });
    }
  }
  function crearCoche(j) {
    const h = j.vehiculo.huella;
    const cuerpo = mundo.createRigidBody(RAPIER.RigidBodyDesc.dynamic()
      .enabledTranslations(true, false, true).enabledRotations(false, true, false)
      .setCcdEnabled(true));
    const caja = mundo.createCollider(RAPIER.ColliderDesc.cuboid(h.semiancho, h.semialto, h.semilargo)
      .setTranslation(0, h.semialto, 0).setMass(1000).setContactSkin(.012)
      .setFriction(0.45).setRestitution(0.46)
      .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)
      .setCollisionGroups(grupos(COCHE, COCHE | ROCA | PLATANO)), cuerpo);
    jugadoresPorCollider.set(caja.handle, j);
    return { cuerpo, caja, fantasma: false, inmovil: false, giroMotor: 0 };
  }
  function colocar(j, pose, altura) {
    const f = j.fisica;
    f.cuerpo.setTranslation({ x: pose.x, y: altura, z: pose.z }, true);
    f.cuerpo.setRotation(rotacionY(pose.rumbo), true);
    f.cuerpo.setLinvel(cero, true);
    f.cuerpo.setAngvel(cero, true);
    f.giroMotor = 0;
  }
  function conducir(j, entrada, ajustes, altura, inmovil) {
    const f = j.fisica, b = f.cuerpo, e = j.estado;
    const fantasma = j.fantasma > 0;
    if (fantasma !== f.fantasma) {
      f.caja.setCollisionGroups(grupos(COCHE, fantasma ? 0 : COCHE | ROCA | PLATANO));
      f.fantasma = fantasma;
    }
    if (inmovil !== f.inmovil) {
      b.setBodyType(inmovil ? RAPIER.RigidBodyType.Fixed : RAPIER.RigidBodyType.Dynamic, true);
      b.setLinvel(cero, true);
      b.setAngvel(cero, true);
      f.giroMotor = 0;
      f.inmovil = inmovil;
    }
    if (inmovil) return;
    const pos = b.translation();
    if (Math.abs(altura - pos.y) > .002) b.setTranslation({ ...pos, y: altura }, true);
    const objetivo = { ...e };
    avanzar(objetivo, entrada, dt, ajustes, j.vehiculo.distanciaEjes);
    e.direccion = objetivo.direccion;
    const s = Math.sin(e.rumbo), c = Math.cos(e.rumbo), vel = b.linvel();
    // Los impactos laterales se disipan por agarre, sin borrar el empujón del rival.
    const lateral = (vel.x * c - vel.z * s) * Math.exp(-8 * dt);
    b.setLinvel({ x: -s * objetivo.velocidad + c * lateral, y: 0,
      z: -c * objetivo.velocidad - s * lateral }, true);
    const giroImpacto = (b.angvel().y - f.giroMotor) * Math.exp(-7 * dt);
    f.giroMotor = (objetivo.rumbo - e.rumbo) / dt;
    b.setAngvel({ x: 0, y: f.giroMotor + giroImpacto, z: 0 }, true);
  }
  function leer(j, limite, terreno) {
    const f = j.fisica, e = j.estado;
    if (f.inmovil) { e.velocidad = 0; return 0; }
    const pos = f.cuerpo.translation(), q = f.cuerpo.rotation();
    const rumbo = 2 * Math.atan2(q.y, q.w);
    if (limite && !limite.contiene(pos.x, pos.z, rumbo, j.vehiculo.huella)) {
      colocar(j, e, terreno.alturaEn(e.x, e.z) ?? pos.y);
      e.velocidad = 0;
      return 0;
    }
    const s = Math.sin(rumbo), c = Math.cos(rumbo), v = f.cuerpo.linvel();
    const avance = -(pos.x - e.x) * s - (pos.z - e.z) * c;
    Object.assign(e, { x: pos.x, z: pos.z, rumbo, velocidad: -v.x * s - v.z * c });
    return avance;
  }
  return {
    instalarObjetos, crearCoche, colocar, conducir, leer,
    activarObjetos(activos) { for (const col of obstaculos) col.setEnabled(activos); },
    quitarCoche(j) {
      const cuerpo = j.fisica;
      if (cuerpo.eliminado) return;
      cuerpo.eliminado = true;
      jugadoresPorCollider.delete(cuerpo.caja.handle);
      mundo.removeRigidBody(cuerpo.cuerpo);
    },
    paso(alGolpe, alTocarRoca) {
      mundo.step(cola);
      cola.drainCollisionEvents((a, b, inicio) => {
        if (!inicio || sensores.has(a) || sensores.has(b)) return;
        const ja = jugadoresPorCollider.get(a), jb = jugadoresPorCollider.get(b);
        const roca = rocas.get(a) ?? rocas.get(b);
        if (roca) {
          if (!roca.objeto.modelo.visible) return;
          roca.objeto.modelo.visible = false;
          roca.collider.setEnabled(false);
          const j = ja ?? jb;
          j.fisica.cuerpo.setLinvel(cero, true);
          j.fisica.cuerpo.setAngvel(cero, true);
          alTocarRoca(j);
        } else if (ja && jb) alGolpe(ja, jb);
      });
    },
    platanoEn(j) {
      let encontrado;
      mundo.intersectionPairsWith(j.fisica.caja, col => {
        const p = sensores.get(col.handle);
        if (p && p.recarga === 0) encontrado = p;
      });
      return encontrado;
    },
  };
}
