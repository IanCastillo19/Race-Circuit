import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CONFIG } from './config.js';
import { crearEstado, avanzarConLimite, conduccionEnTerreno } from './movimiento.js';
import { crearVehiculo } from './vehiculo.js';
import { cargarConjuntoCoche, clonarConjuntoCoche } from './modelos.js';
import { crearDetectorTerreno } from './terreno.js';
import { crearLimite } from './limites.js';
import {
  TRAZADO,
  crearCarrera,
  iniciarCarrera,
  actualizarCarrera,
  formatearTiempo,
} from './carrera.js';
import {
  MEJORAS,
  crearNitro,
  reiniciarNitro,
  actualizarNitro,
  ajustarConduccion,
} from './nitro.js';
import { crearZonasNitro } from './nitro-modelos.js';
import { AJUSTES } from './ajustes-juego.js';
import {
  circuloContraCoche,
  separacionCoches,
  resolverGanador,
  dividirPantallas,
} from './colisiones.js';
import { crearObjetos, crearSenales, crearAmbiente } from './objetos.js';
import { crearInterfaz, crearMinimapa, TEXTOS } from './interfaz.js';
import { crearAudio } from './audio.js';
import { leerMarca, guardarMarca } from './records.js';

const $ = (id) => document.getElementById(id),
  ui = crearInterfaz(),
  audio = crearAudio(),
  teclas = new Set();
const parametros = new URLSearchParams(location.search),
  modoTest = parametros.has('test');
const permitidos = {
  modo: ['1', '2'],
  ambiente: ['costa', 'neon', 'alpino'],
  calidad: ['baja', 'media', 'alta'],
  idioma: ['es', 'ca', 'en'],
};
let opciones = {
  modo: '1',
  ambiente: 'costa',
  calidad: 'media',
  objetos: true,
  sonido: false,
  idioma: 'es',
};
try {
  const prev = JSON.parse(localStorage.getItem('race-circuit-ajustes-v2'));
  if (prev && typeof prev === 'object')
    for (const k of Object.keys(opciones)) {
      if (permitidos[k]?.includes(prev[k]) || (!permitidos[k] && typeof prev[k] === 'boolean'))
        opciones[k] = prev[k];
    }
} catch {
  /* Almacenamiento opcional. */
}
let idiomaAnterior;
try {
  idiomaAnterior = localStorage.getItem('race-circuit-language');
} catch {}
opciones.idioma = permitidos.idioma.includes(parametros.get('lang'))
  ? parametros.get('lang')
  : permitidos.idioma.includes(idiomaAnterior)
    ? idiomaAnterior
    : opciones.idioma;
for (const k of ['modo', 'ambiente'])
  if (permitidos[k].includes(parametros.get(k))) opciones[k] = parametros.get(k);
for (const k of Object.keys(opciones)) {
  if (typeof opciones[k] === 'boolean') $(k).checked = opciones[k];
  else $(k).value = opciones[k];
}
ui.traducir(opciones.idioma);
$('imagen-ambiente').src =
  './assets/' + { costa: 'coast', neon: 'neon', alpino: 'alpine' }[opciones.ambiente] + '.webp';

const escena = new THREE.Scene();
escena.background = new THREE.Color('#07111e');
const inspeccionCamara = new THREE.PerspectiveCamera(65, 1, 0.05, 2500);
inspeccionCamara.position.set(0, 80, 90);
let renderer,
  orbit,
  circuito,
  baseCoche,
  terreno,
  limite,
  objetos,
  nitroVisual,
  senales,
  ambiente,
  minimapa;
let listo = false,
  jugadores = [],
  puertas = [],
  salidaBase = null,
  salidaPrueba = null,
  pantallas = [],
  ancho = 1,
  alto = 1,
  acumulador = 0,
  ultimoInstante;
let partida = { fase: 'menu', cuenta: 3, previa: 'corriendo', ganador: null, inspeccion: false };
let compartidas = [],
  diagnosticos = [],
  mensajeHasta = 0,
  segundoCuenta = 0,
  recordAnterior = null,
  nuevoRecord = false;

function mensaje(texto) {
  $('mensaje').textContent = texto;
  mensajeHasta = performance.now() + 3600;
}
function guardarOpciones() {
  try {
    localStorage.setItem('race-circuit-ajustes-v2', JSON.stringify(opciones));
    localStorage.setItem('race-circuit-language', opciones.idioma);
  } catch {
    /* El juego sigue funcionando. */
  }
}
function leerOpciones() {
  for (const k of Object.keys(opciones))
    opciones[k] = typeof opciones[k] === 'boolean' ? $(k).checked : $(k).value;
  guardarOpciones();
}
function claveRecord() {
  return (
    'race-circuit-record:arcade-v2:solo:' +
    TRAZADO.id +
    ':' +
    TRAZADO.vueltas +
    ':' +
    (opciones.objetos ? 'objetos' : 'libre')
  );
}
function leerRecord() {
  try {
    return leerMarca(localStorage, claveRecord());
  } catch {
    return null;
  }
}
function pintarMarcaMenu() {
  const e = $('marca-menu');
  e.hidden = $('modo').value !== '1';
  const clave =
    'race-circuit-record:arcade-v2:solo:' +
    TRAZADO.id +
    ':' +
    TRAZADO.vueltas +
    ':' +
    ($('objetos').checked ? 'objetos' : 'libre');
  let n = null;
  try {
    n = leerMarca(localStorage, clave);
  } catch {}
  e.textContent = ui.t.record + ': ' + (n === null ? ui.t.sinRecord : formatearTiempo(n));
}

function transformarPuerta(p) {
  const centro = circuito.localToWorld(new THREE.Vector3(p.x, 0, p.z)),
    n = new THREE.Vector3(p.nx, 0, p.nz).transformDirection(circuito.matrixWorld);
  const l = Math.hypot(p.nx, p.nz),
    borde = circuito.localToWorld(
      new THREE.Vector3(p.x - ((p.nz / l) * p.ancho) / 2, 0, p.z + ((p.nx / l) * p.ancho) / 2),
    );
  return {
    x: centro.x,
    z: centro.z,
    nx: n.x,
    nz: n.z,
    ancho: 2 * Math.hypot(borde.x - centro.x, borde.z - centro.z),
  };
}
function configurarTrazado() {
  puertas = [...TRAZADO.controles, TRAZADO.meta].map(transformarPuerta);
  const p = circuito.localToWorld(new THREE.Vector3(...TRAZADO.salida.posicion)),
    r = (TRAZADO.salida.rumboGrados * Math.PI) / 180;
  const d = new THREE.Vector3(-Math.sin(r), 0, -Math.cos(r)).transformDirection(
    circuito.matrixWorld,
  );
  salidaBase = { x: p.x, z: p.z, rumbo: Math.atan2(-d.x, -d.z) };
}
function apta(e, huella, asfalto = false) {
  if (limite && !limite.contiene(e.x, e.z, e.rumbo, huella)) return false;
  if (terreno.alturaEn(e.x, e.z) === null) return false;
  if (asfalto && terreno.tipoEn(e.x, e.z) !== 'asfalto') return false;
  return !opciones.objetos || !objetos.rocas.some((r) => circuloContraCoche(e, huella, r));
}
function buscarPosicion(pose, j, desplazamiento = 0) {
  const c = Math.cos(pose.rumbo),
    s = Math.sin(pose.rumbo);
  for (const lado of [desplazamiento, 0, desplazamiento + 1, desplazamiento - 1])
    for (const avance of [0, -1, 1, -2, 2]) {
      const e = {
        x: pose.x + lado * c - avance * s,
        z: pose.z - lado * s - avance * c,
        rumbo: pose.rumbo,
      };
      if (apta(e, j.vehiculo.huella, true)) return e;
    }
  const segura = limite?.salidaSegura([pose.x, 0, pose.z], pose.rumbo, j.vehiculo.huella);
  if (segura) return { x: segura[0], z: segura[2], rumbo: pose.rumbo };
  throw new Error('No se encuentra una posición válida de salida.');
}
function colocar(j, pose) {
  j.estado = crearEstado([pose.x, 0, pose.z], (pose.rumbo * 180) / Math.PI);
  j.camaraInmediata = true;
  j.vehiculo.reiniciarRuedas();
  j.distanciaFrame = 0;
  j.derrape = 0;
  const y = terreno.alturaEn(pose.x, pose.z);
  j.vehiculo.actor.position.set(pose.x, (y ?? 0) + 0.015, pose.z);
  j.vehiculo.actor.rotation.y = pose.rumbo;
  reiniciarNitro(j.nitro, j.estado);
}
function liberarJugadores() {
  for (const j of jugadores) {
    escena.remove(j.vehiculo.actor, j.sombra);
    j.sombra.geometry.dispose();
    j.sombra.material.dispose();
    j.vehiculo.actor.traverse((m) => {
      if (m.isMesh)
        for (const mat of Array.isArray(m.material) ? m.material : [m.material]) mat.dispose();
    });
  }
  jugadores = [];
}
function prepararJugadores() {
  liberarJugadores();
  const n = Number(opciones.modo);
  for (let i = 0; i < n; i++) {
    const conjunto = clonarConjuntoCoche(baseCoche),
      color = AJUSTES.colores[i];
    let carroceria = null,
      volumen = -1;
    conjunto.modelo.children[0].traverse((m) => {
      if (m.isMesh) {
        const s = new THREE.Box3().setFromObject(m, true).getSize(new THREE.Vector3()),
          v = s.x * s.y * s.z;
        if (v > volumen) {
          volumen = v;
          carroceria = m;
        }
      }
    });
    if (carroceria)
      for (const mat of Array.isArray(carroceria.material)
        ? carroceria.material
        : [carroceria.material])
        if (mat.color && Math.max(mat.color.r, mat.color.g, mat.color.b) > 0.12)
          mat.color.set(color);
    const vehiculo = crearVehiculo(conjunto.modelo, CONFIG.coche, conjunto);
    vehiculo.actor.name = 'Jugador_' + (i + 1);
    escena.add(vehiculo.actor);
    const sombra = new THREE.Mesh(
      new THREE.CircleGeometry(1.4, 24),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.2,
        depthWrite: false,
      }),
    );
    sombra.rotation.x = -Math.PI / 2;
    escena.add(sombra);
    const j = {
      id: i + 1,
      color,
      vehiculo,
      sombra,
      camara: new THREE.PerspectiveCamera(65, 1, 0.05, 2500),
      objetivoSuave: new THREE.Vector3(),
      nitro: crearNitro(nitroVisual.zonas),
      carrera: crearCarrera(puertas, TRAZADO.vueltas, 0),
      puntos: vehiculo.ruedas.map((r) => ({ x: r.centro.x, z: r.centro.z })),
      recuperando: 0,
      fantasma: 0,
      derrape: 0,
      cesped: 0,
      malSentido: false,
      golpe: 0,
      distanciaFrame: 0,
    };
    if (j.puntos.length !== 4)
      j.puntos = [-1, 1].flatMap((x) =>
        [-1, 1].map((z) => ({
          x: x * vehiculo.huella.semiancho * 0.85,
          z: z * vehiculo.huella.semilargo * 0.65,
        })),
      );
    const pose = buscarPosicion(
      i === 0 && salidaPrueba ? salidaPrueba : salidaBase,
      j,
      n === 2 ? (i === 0 ? -1.5 : 1.5) : 0,
    );
    colocar(j, pose);
    j.ultimoPunto = { ...pose };
    jugadores.push(j);
    diagnosticos.push(...vehiculo.avisos.map((x) => 'J' + j.id + ': ' + x));
  }
  redimensionar();
}

async function iniciarPartida() {
  if (!listo) return;
  leerOpciones();
  partida = {
    fase: 'cuenta',
    cuenta: TRAZADO.cuentaAtras,
    previa: 'corriendo',
    ganador: null,
    inspeccion: false,
  };
  orbit.enabled = false;
  acumulador = 0;
  ultimoInstante = undefined;
  teclas.clear();
  segundoCuenta = 0;
  recordAnterior = leerRecord();
  nuevoRecord = false;
  document.querySelector('.resultado-tarjeta').classList.remove('ganador');
  objetos.grupo.visible = opciones.objetos;
  objetos.reiniciar();
  compartidas = nitroVisual.zonas.map((p) => ({ ...p, recarga: 0 }));
  nitroVisual.actualizar({ zonas: compartidas });
  ambiente.cambiar(opciones.ambiente);
  prepararJugadores();
  renderer.setPixelRatio(
    Math.min(devicePixelRatio, { baja: 1, media: 1.5, alta: 2 }[opciones.calidad]),
  );
  redimensionar();
  $('escena').focus({ preventScroll: true });
  if (opciones.sonido && !(await audio.activar(true))) mensaje(ui.t.noSonido);
  else if (!opciones.sonido) audio.activar(false);
  if (partida.cuenta <= 0) salida();
  pintarPantallas();
}
function salida() {
  partida.fase = 'corriendo';
  jugadores.forEach((j) => iniciarCarrera(j.carrera));
  audio.efecto('salida');
  mensaje(ui.t.juega);
  pintarPantallas();
}
function pausar() {
  if (!['corriendo', 'cuenta'].includes(partida.fase)) return;
  partida.previa = partida.fase;
  partida.fase = 'pausa';
  teclas.clear();
  audio.actualizar([], false);
  pintarPantallas();
}
function continuar() {
  if (partida.fase !== 'pausa') return;
  partida.fase = partida.previa;
  partida.inspeccion = false;
  orbit.enabled = false;
  jugadores.forEach((j) => (j.camaraInmediata = true));
  ultimoInstante = undefined;
  teclas.clear();
  $('escena').focus({ preventScroll: true });
  pintarPantallas();
}
function alternarPausa() {
  if (partida.fase === 'pausa') continuar();
  else pausar();
}
function volverMenu() {
  partida.fase = 'menu';
  partida.inspeccion = false;
  if (orbit) orbit.enabled = false;
  teclas.clear();
  audio.actualizar([], false);
  pintarPantallas();
}
function verCircuito() {
  if (partida.fase !== 'pausa') return;
  partida.inspeccion = true;
  orbit.enabled = true;
  const caja = terreno.caja,
    centro = caja.getCenter(new THREE.Vector3()),
    distancia = Math.max(caja.max.x - caja.min.x, caja.max.z - caja.min.z) * 0.8;
  orbit.target.copy(centro);
  inspeccionCamara.position.set(centro.x, caja.max.y + distancia, centro.z + distancia * 0.6);
  orbit.update();
  mensaje(ui.t.ajustarInicio);
  redimensionar();
  pintarPantallas();
}
function recuperar(id) {
  if (partida.fase !== 'corriendo') return;
  const j = jugadores.find((p) => p.id === id);
  if (!j || j.recuperando > 0) return;
  const pose = buscarPosicion(j.ultimoPunto, j, jugadores.length === 2 ? (id === 1 ? -1 : 1) : 0);
  colocar(j, pose);
  j.recuperando = AJUSTES.recuperacionSegundos;
  j.fantasma = AJUSTES.inmunidadRecuperacion;
  audio.efecto('recuperar');
}

function entradaJugador(j) {
  const flechas = { ArrowUp: 'KeyW', ArrowDown: 'KeyS', ArrowLeft: 'KeyA', ArrowRight: 'KeyD' };
  const e = new Set(),
    mapa =
      j.id === 1
        ? {
            KeyW: 'KeyW',
            KeyS: 'KeyS',
            KeyA: 'KeyA',
            KeyD: 'KeyD',
            ...(jugadores.length === 1 ? flechas : {}),
          }
        : flechas;
  for (const [fisica, logica] of Object.entries(mapa)) if (teclas.has(fisica)) e.add(logica);
  if (j.derrape > 0) return new Set();
  if (e.has('KeyS')) e.delete('KeyW');
  else if (j.nitro.restante > 0 && j.estado.velocidad >= 0) e.add('KeyW');
  return e;
}
function guardarControl(j, puerta) {
  const largo = Math.hypot(puerta.nx, puerta.nz);
  const nx = puerta.nx / largo,
    nz = puerta.nz / largo;
  const pose = { x: puerta.x + nx * 2, z: puerta.z + nz * 2, rumbo: Math.atan2(-nx, -nz) };
  j.ultimoPunto = buscarPosicion(pose, j);
  audio.efecto('control');
}
function paso(dt) {
  if (partida.fase !== 'corriendo') return;
  compartidas.forEach((z) => (z.recarga = Math.max(0, z.recarga - dt)));
  objetos.actualizar(dt);
  for (const j of jugadores) {
    j.anterior = { x: j.estado.x, z: j.estado.z, rumbo: j.estado.rumbo };
    j.avance = 0;
    j.golpe = Math.max(0, j.golpe - dt);
    j.fantasma = Math.max(0, j.fantasma - dt);
    j.recuperando = Math.max(0, j.recuperando - dt);
    j.derrape = Math.max(0, j.derrape - dt);
    j.cesped = terreno.porcentajeCesped(j.estado, j.puntos);
    if (j.recuperando > 0) {
      j.estado.velocidad = 0;
      actualizarNitro(j.nitro, j.estado, { ...j.estado, avance: 0 }, dt, () => false, compartidas);
      continue;
    }
    const mejorada = ajustarConduccion(CONFIG.conduccion, j.estado.velocidad, j.nitro),
      ajustes = conduccionEnTerreno(mejorada, CONFIG.cesped, j.cesped);
    let roca = false;
    const movimiento = avanzarConLimite(
      j.estado,
      entradaJugador(j),
      dt,
      ajustes,
      j.vehiculo.distanciaEjes,
      (e) => {
        if (CONFIG.limites.activo && !limite.contiene(e.x, e.z, e.rumbo, j.vehiculo.huella))
          return false;
        if (
          opciones.objetos &&
          objetos.rocas.some((r) => circuloContraCoche(e, j.vehiculo.huella, r))
        ) {
          roca = true;
          return false;
        }
        return true;
      },
      CONFIG.limites.pasoMaximo,
    );
    j.avance = movimiento.distancia;
    j.distanciaFrame += j.avance;
    if (roca && j.golpe === 0) {
      j.golpe = 0.7;
      audio.efecto('golpe');
    }
    if (
      actualizarNitro(
        j.nitro,
        j.anterior,
        { ...j.estado, avance: j.avance },
        dt,
        (x, z) => terreno.tipoEn(x, z) === 'asfalto',
        compartidas,
      )
    )
      audio.efecto('nitro');
    if (opciones.objetos && j.fantasma === 0 && j.derrape === 0) {
      const b = objetos.platanos.find(
        (p) => p.recarga === 0 && circuloContraCoche(j.estado, j.vehiculo.huella, p),
      );
      if (b) {
        b.recarga = AJUSTES.recargaPlatano;
        b.modelo.visible = false;
        j.derrape = AJUSTES.duracionPlatano;
        j.estado.velocidad *= 0.45;
        j.nitro.restante = 0;
        audio.efecto('platano');
      }
    }
  }
  if (jugadores.length === 2) {
    const [a, b] = jugadores;
    if (a.fantasma === 0 && b.fantasma === 0) {
      const v = separacionCoches(a.estado, a.vehiculo.huella, b.estado, b.vehiculo.huella);
      if (v) {
        const pa = { ...a.estado, x: a.estado.x - v.x, z: a.estado.z - v.z },
          pb = { ...b.estado, x: b.estado.x + v.x, z: b.estado.z + v.z };
        if (apta(pa, a.vehiculo.huella)) Object.assign(a.estado, pa);
        else Object.assign(a.estado, a.anterior);
        if (apta(pb, b.vehiculo.huella)) Object.assign(b.estado, pb);
        else Object.assign(b.estado, b.anterior);
        a.estado.velocidad *= 0.6;
        b.estado.velocidad *= 0.6;
        if (a.golpe === 0 && b.golpe === 0) audio.efecto('golpe');
        a.golpe = b.golpe = 0.6;
      }
    }
  }
  for (const j of jugadores) {
    const control = j.carrera.control,
      vueltas = j.carrera.vueltasCompletadas;
    actualizarCarrera(
      j.carrera,
      j.anterior,
      { ...j.estado, avance: j.avance },
      dt,
      (x, z) => terreno.tipoEn(x, z) === 'asfalto',
    );
    if (j.carrera.control !== control || j.carrera.vueltasCompletadas !== vueltas)
      guardarControl(j, puertas[(j.carrera.control + puertas.length - 1) % puertas.length]);
    const siguiente = puertas[j.carrera.control],
      dot = -Math.sin(j.estado.rumbo) * siguiente.nx - Math.cos(j.estado.rumbo) * siguiente.nz;
    j.malSentido = j.estado.velocidad > 2 && dot < -0.55;
  }
  const ganador = resolverGanador(jugadores);
  if (ganador !== null) {
    partida.ganador = ganador;
    partida.fase = 'resultado';
    jugadores.forEach((j) => {
      j.estado.velocidad = 0;
      j.nitro.restante = 0;
    });
    if (jugadores.length === 1 && !salidaPrueba && !modoTest) {
      try {
        nuevoRecord = guardarMarca(
          localStorage,
          claveRecord(),
          jugadores[0].carrera.tiempo,
        ).mejorado;
      } catch {}
    }
    audio.efecto('victoria');
    mostrarResultados();
    pintarPantallas();
  }
}

function actualizarVisuales(dt) {
  for (const j of jugadores) {
    const y = terreno.alturaEn(j.estado.x, j.estado.z) ?? j.vehiculo.actor.position.y - 0.015;
    j.vehiculo.actor.position.set(j.estado.x, y + 0.015, j.estado.z);
    const giro = j.derrape > 0 ? (1 - j.derrape / AJUSTES.duracionPlatano) * Math.PI * 2 : 0;
    j.vehiculo.actor.rotation.y = j.estado.rumbo + giro;
    j.vehiculo.actor.visible = j.fantasma === 0 || Math.floor(performance.now() / 120) % 2 === 0;
    j.vehiculo.actualizarRuedas(j.distanciaFrame, j.estado.direccion);
    j.distanciaFrame = 0;
    j.sombra.position.set(j.estado.x, y + 0.025, j.estado.z);
    j.sombra.scale.set(1, 1.6, 1);
    j.sombra.rotation.z = -j.estado.rumbo;
    const extra = j.nitro.restante > 0 ? 1.12 : 1;
    const destino = new THREE.Vector3(
      j.estado.x + Math.sin(j.estado.rumbo) * CONFIG.camara.distancia * extra,
      y + CONFIG.camara.altura,
      j.estado.z + Math.cos(j.estado.rumbo) * CONFIG.camara.distancia * extra,
    );
    const objetivo = new THREE.Vector3(
      j.estado.x - Math.sin(j.estado.rumbo) * CONFIG.camara.mirarDelante,
      y + 0.8,
      j.estado.z - Math.cos(j.estado.rumbo) * CONFIG.camara.mirarDelante,
    );
    const t = j.camaraInmediata ? 1 : 1 - Math.exp(-CONFIG.camara.suavidad * dt);
    j.camara.position.lerp(destino, t);
    j.objetivoSuave.lerp(objetivo, t);
    j.camara.lookAt(j.objetivoSuave);
    j.camaraInmediata = false;
    j.camara.fov += ((j.nitro.restante > 0 ? 72 : 65) - j.camara.fov) * (1 - Math.exp(-4 * dt));
  }
  nitroVisual?.actualizar({ zonas: compartidas });
  senales?.actualizar(jugadores);
  minimapa?.pintar(jugadores);
  ui.pintar(jugadores);
  audio.actualizar(jugadores, partida.fase === 'corriendo');
}
function cuadro(delta) {
  if (!listo) return;
  if (partida.fase === 'cuenta') {
    const anterior = partida.cuenta;
    partida.cuenta = Math.max(0, partida.cuenta - delta);
    const segundo = Math.ceil(partida.cuenta);
    if (segundo !== segundoCuenta && segundo > 0) {
      segundoCuenta = segundo;
      audio.efecto('cuenta');
    }
    $('cuenta-texto').textContent = String(Math.max(1, segundo));
    if (partida.cuenta === 0) {
      salida();
      delta = Math.max(0, delta - anterior);
    }
  }
  if (partida.fase === 'corriendo') {
    if (delta > 0.25) jugadores.forEach((j) => (j.carrera.tiempo += delta - 0.25));
    acumulador += Math.min(delta, 0.25);
    while (acumulador >= AJUSTES.pasoFisica && partida.fase === 'corriendo') {
      paso(AJUSTES.pasoFisica);
      acumulador -= AJUSTES.pasoFisica;
    }
  }
  actualizarVisuales(Math.min(delta, 0.1));
  if (performance.now() > mensajeHasta) $('mensaje').textContent = '';
}

function redimensionar() {
  ancho = Math.max(1, $('escena').clientWidth);
  alto = Math.max(1, $('escena').clientHeight);
  if (renderer) renderer.setSize(ancho, alto, false);
  pantallas = dividirPantallas(ancho, alto, jugadores.length || 1);
  ui.crearHuds(jugadores, pantallas);
  document.body.classList.toggle('dos-jugadores', jugadores.length === 2);
  const separador = $('separador');
  separador.style.cssText =
    ancho >= 850 ? 'left:50%;top:0;width:2px;height:100%' : 'left:0;top:50%;width:100%;height:2px';
  inspeccionCamara.aspect = ancho / alto;
  inspeccionCamara.updateProjectionMatrix();
  ui.pintar(jugadores);
}
function dibujar() {
  if (!renderer) return;
  renderer.setScissorTest(true);
  if (!jugadores.length || partida.inspeccion) {
    renderer.setViewport(0, 0, ancho, alto);
    renderer.setScissor(0, 0, ancho, alto);
    if (partida.inspeccion) orbit.update();
    renderer.render(escena, inspeccionCamara);
  } else
    jugadores.forEach((j, i) => {
      const p = pantallas[i];
      j.camara.aspect = p.w / p.h;
      j.camara.updateProjectionMatrix();
      renderer.setViewport(p.x, p.y, p.w, p.h);
      renderer.setScissor(p.x, p.y, p.w, p.h);
      renderer.render(escena, j.camara);
    });
  renderer.setScissorTest(false);
}
function pintarPantallas() {
  const menu = partida.fase === 'menu',
    pausa = partida.fase === 'pausa',
    resultado = partida.fase === 'resultado';
  $('pantalla-menu').hidden = !menu;
  $('pantalla-pausa').hidden = !pausa || partida.inspeccion;
  $('pantalla-resultados').hidden = !resultado;
  $('cuenta').hidden = partida.fase !== 'cuenta';
  $('huds').hidden = menu || resultado || partida.inspeccion;
  $('mapa-panel').hidden = menu || resultado || partida.inspeccion;
  $('separador').hidden = menu || resultado || partida.inspeccion || jugadores.length !== 2;
  $('ayuda-teclas').hidden = menu || resultado || partida.inspeccion;
  $('pausa').textContent = pausa ? ui.t.continuar : ui.t.pausa;
  $('audio').setAttribute('aria-pressed', String(opciones.sonido));
  $('estado-global').textContent = menu
    ? 'ARCADE / PROTOTIPO'
    : pausa
      ? ui.t.enPausa
      : jugadores.length === 2
        ? 'J1 × J2'
        : 'TIME TRIAL';
  pintarMarcaMenu();
}
function mostrarResultados() {
  const t = ui.t,
    multi = jugadores.length === 2;
  $('titulo-resultado').textContent = multi
    ? partida.ganador === 'empate'
      ? t.empate
      : 'WIN J' + partida.ganador
    : t.completada;
  $('subtitulo-resultado').textContent = multi
    ? partida.ganador === 'empate'
      ? ''
      : t.gana + ' J' + partida.ganador
    : salidaPrueba || modoTest
      ? t.entrenamiento
      : nuevoRecord
        ? t.nuevoRecord
        : recordAnterior === null
          ? t.sinRecord
          : t.record + ': ' + formatearTiempo(recordAnterior);
  $('mensaje').textContent = '';
  const contenedor = $('resultados');
  contenedor.innerHTML = '';
  for (const j of jugadores) {
    const fila = document.createElement('div');
    fila.className = 'fila-resultado';
    const titulo = document.createElement('h3');
    titulo.style.color = j.color;
    titulo.textContent = 'J' + j.id;
    fila.append(titulo);
    const total = document.createElement('strong');
    total.textContent =
      j.carrera.fase === 'terminada'
        ? formatearTiempo(j.carrera.tiempo)
        : j.carrera.vueltasCompletadas + '/' + j.carrera.vueltas + ' · ' + t.pendiente;
    fila.append(total);
    j.carrera.tiemposVuelta.forEach((v, i) => {
      const p = document.createElement('p');
      p.textContent = t.vuelta + ' ' + (i + 1) + ' · ' + formatearTiempo(v);
      fila.append(p);
    });
    contenedor.append(fila);
  }
  document.querySelector('.resultado-tarjeta').classList.add('ganador');
}

function enlazar() {
  $('empezar').addEventListener('click', () => iniciarPartida());
  $('revancha').addEventListener('click', () => iniciarPartida());
  $('reiniciar').addEventListener('click', () => iniciarPartida());
  $('pausa').addEventListener('click', alternarPausa);
  $('continuar').addEventListener('click', continuar);
  $('vista').addEventListener('click', verCircuito);
  for (const id of ['menu', 'salir-pausa', 'salir-resultados'])
    $(id).addEventListener('click', volverMenu);
  $('huds').addEventListener('click', (e) => {
    const b = e.target.closest('[data-jugador]');
    if (b) recuperar(Number(b.dataset.jugador));
  });
  $('audio').addEventListener('click', async () => {
    opciones.sonido = !opciones.sonido;
    $('sonido').checked = opciones.sonido;
    guardarOpciones();
    if (!(await audio.activar(opciones.sonido))) mensaje(ui.t.noSonido);
    pintarPantallas();
  });
  $('idioma').addEventListener('change', () => {
    opciones.idioma = $('idioma').value;
    ui.traducir(opciones.idioma);
    guardarOpciones();
    if (listo) $('empezar').textContent = ui.t.empezar;
    if (partida.fase === 'resultado') mostrarResultados();
    pintarPantallas();
  });
  $('ambiente').addEventListener('change', () => {
    $('imagen-ambiente').src =
      './assets/' +
      { costa: 'coast', neon: 'neon', alpino: 'alpine' }[$('ambiente').value] +
      '.webp';
  });
  for (const id of ['modo', 'objetos']) $(id).addEventListener('change', pintarMarcaMenu);
  window.addEventListener('keydown', (e) => {
    if (e.target.matches('input,textarea,select,[contenteditable=true]')) return;
    if (
      [
        'KeyW',
        'KeyA',
        'KeyS',
        'KeyD',
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        'Space',
        'Enter',
      ].includes(e.code)
    )
      e.preventDefault();
    teclas.add(e.code);
    if (e.repeat) return;
    if (e.code === 'KeyP' || e.code === 'Escape') alternarPausa();
    if (e.code === 'Space') {
      if (partida.fase === 'menu' || partida.fase === 'resultado') iniciarPartida();
      else if (partida.fase === 'pausa') continuar();
    }
    if (e.code === 'KeyR' && listo && partida.fase !== 'menu') iniciarPartida();
    if (e.code === 'KeyF') recuperar(1);
    if (e.code === 'Enter') recuperar(2);
  });
  window.addEventListener('keyup', (e) => teclas.delete(e.code));
  window.addEventListener('blur', () => {
    teclas.clear();
    pausar();
  });
  document.addEventListener('visibilitychange', () => {
    teclas.clear();
    ultimoInstante = undefined;
    if (document.hidden) pausar();
  });
  window.addEventListener('resize', redimensionar);
  let pulsacion = null;
  $('escena').addEventListener('pointerdown', (e) => {
    pulsacion = { x: e.clientX, y: e.clientY };
  });
  $('escena').addEventListener('pointerup', (e) => {
    if (
      !partida.inspeccion ||
      !e.shiftKey ||
      !pulsacion ||
      Math.hypot(e.clientX - pulsacion.x, e.clientY - pulsacion.y) > 6
    )
      return;
    const rect = $('escena').getBoundingClientRect(),
      r = new THREE.Raycaster();
    r.setFromCamera(
      new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        (-(e.clientY - rect.top) / rect.height) * 2 + 1,
      ),
      inspeccionCamara,
    );
    const p = r.intersectObject(circuito, true)[0]?.point;
    if (!p || terreno.tipoEn(p.x, p.z) !== 'asfalto') return;
    salidaPrueba = { x: p.x, z: p.z, rumbo: salidaBase.rumbo };
    iniciarPartida();
    mensaje(ui.t.entrenamiento);
  });
}

async function inicializar() {
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: $('escena'),
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    orbit = new OrbitControls(inspeccionCamara, $('escena'));
    orbit.enabled = false;
    orbit.enableDamping = true;
    orbit.maxPolarAngle = Math.PI * 0.49;
    $('escena').tabIndex = 0;
    enlazar();
    redimensionar();
    renderer.setAnimationLoop((instante) => {
      if (document.hidden) return;
      const dt = ultimoInstante === undefined ? 0 : Math.max(0, (instante - ultimoInstante) / 1000);
      ultimoInstante = instante;
      cuadro(dt);
      dibujar();
    });
    const gestor = new THREE.LoadingManager();
    gestor.onProgress = (url, cargados, total) => {
      $('estado-carga').textContent = ui.t.cargando + ' ' + cargados + '/' + total;
    };
    const loader = new GLTFLoader(gestor),
      resultados = await Promise.all([
        loader.loadAsync(CONFIG.modelos.circuito),
        cargarConjuntoCoche(loader, CONFIG.modelos, CONFIG.coche),
      ]);
    circuito = resultados[0].scene;
    baseCoche = resultados[1];
    circuito.scale.multiplyScalar(CONFIG.circuito.escala);
    circuito.rotation.y += (CONFIG.circuito.giroGrados * Math.PI) / 180;
    circuito.position.add(new THREE.Vector3(...CONFIG.circuito.posicion));
    escena.add(circuito);
    circuito.updateWorldMatrix(true, true);
    terreno = crearDetectorTerreno(circuito, CONFIG.cesped);
    if (!terreno.disponible) throw new Error(terreno.avisos.join('\n'));
    limite = crearLimite(circuito, CONFIG.limites, terreno);
    configurarTrazado();
    ambiente = crearAmbiente(escena, circuito);
    nitroVisual = await crearZonasNitro(loader, circuito, terreno, escena, MEJORAS);
    objetos = await crearObjetos(loader, circuito, terreno, escena, AJUSTES);
    diagnosticos.push(...nitroVisual.avisos, ...objetos.avisos);
    compartidas = nitroVisual.zonas.map((p) => ({ ...p, recarga: 0 }));
    senales = crearSenales(puertas, terreno, escena);
    senales.grupo.visible = TRAZADO.mostrarControles;
    minimapa = crearMinimapa($('minimapa'), circuito, puertas, CONFIG.cesped.nombresAsfalto);
    prepararJugadores();
    actualizarVisuales(0);
    listo = true;
    $('empezar').disabled = false;
    $('empezar').textContent = ui.t.empezar;
    $('estado-carga').textContent = ui.t.listo;
    $('lista-modelos').textContent =
      'Coche: ' +
      CONFIG.modelos.chasis +
      '\nCircuito: ' +
      CONFIG.modelos.circuito +
      '\nNitro: ' +
      MEJORAS.modelo +
      '\n' +
      (diagnosticos.length
        ? diagnosticos.join('\n')
        : 'OK · GLB / 4 ruedas por jugador / terreno / controles');
    if (diagnosticos.length) $('diagnostico').open = true;
    ambiente.cambiar(opciones.ambiente);
    pintarPantallas();
  } catch (error) {
    console.error(error);
    $('estado-carga').textContent = ui.t.error;
    $('lista-modelos').textContent = String(error.stack || error);
    $('diagnostico').open = true;
    $('empezar').disabled = true;
  }
}

if (modoTest)
  globalThis.__raceTest = {
    get listo() {
      return listo;
    },
    get jugadores() {
      return jugadores;
    },
    get partida() {
      return partida;
    },
    get objetos() {
      return objetos;
    },
    get terreno() {
      return terreno;
    },
    get compartidas() {
      return compartidas;
    },
    get renderer() {
      return renderer;
    },
    get escena() {
      return escena;
    },
    get opciones() {
      return opciones;
    },
    teclas,
    iniciar: iniciarPartida,
    pausar,
    continuar,
    recuperar,
    menu: volverMenu,
    detenerRAF() {
      renderer.setAnimationLoop(null);
    },
    avanzar(dt) {
      cuadro(dt);
      dibujar();
    },
    simular(segundos) {
      const n = Math.round(segundos * 120);
      for (let i = 0; i < n; i++) cuadro(1 / 120);
      dibujar();
    },
    dibujar,
  };
inicializar();
