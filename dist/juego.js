import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CONFIG } from './config.js';
<<<<<<< HEAD
import { crearEstado, avanzarConLimite } from './movimiento.js';
import { crearVehiculo } from './vehiculo.js';
import { cargarConjuntoCoche } from './modelos.js';
import { crearLimite } from './limites.js';
=======
import { crearEstado, avanzar } from './movimiento.js';
import { crearVehiculo } from './vehiculo.js';
import { cargarConjuntoCoche } from './modelos.js';
>>>>>>> T4

const $ = id => document.getElementById(id);
const textos = {
  es: {
    volver: '← Volver', prototipo: 'PROTOTIPO DE CONDUCCIÓN', vista: 'Ver circuito', conducir: 'Volver a conducir',
    reiniciar: 'Reiniciar · R', diagnostico: 'Modelos y ajustes',
    controles: '<kbd>W</kbd> acelerar · <kbd>S</kbd> frenar / marcha atrás · <kbd>A</kbd><kbd>D</kbd> dirección',
    salida: 'En la vista del circuito: Mayús + clic sobre la carretera para elegir la salida.',
    cargando: 'Cargando los modelos…', listo: 'Listo. Usa WASD para conducir.',
    inspeccion: 'Arrastra para mirar el circuito; usa la rueda del ratón para acercarte. Mayús + clic elige la salida.',
    salidaElegida: 'Salida guardada para esta sesión. R vuelve a este punto.',
<<<<<<< HEAD
    borde: 'Límite del terreno. Frena y cambia de dirección o retrocede.',
    salidaFuera: 'El coche completo debe caber dentro del terreno. Elige un punto más alejado del borde.',
    salidaInvalida: 'No se encuentra una salida válida. Elige una con Ver circuito y Mayús + clic, o revisa el tamaño del coche y la zona del límite.',
    salidaReubicada: 'El punto inicial estaba fuera del terreno. Se ha colocado el coche en una zona válida; usa WASD.',
=======
>>>>>>> T4
    avisos: 'El coche se puede mover. Revisa las ruedas en «Modelos y ajustes».',
    error: 'No se han podido cargar todos los modelos. Revisa las rutas y el servidor en «Modelos y ajustes».',
    webgl: 'No se ha podido iniciar WebGL. Comprueba que tu navegador tenga aceleración gráfica.',
    nombres: 'Nombres originales del coche', problemas: 'Diagnóstico',
<<<<<<< HEAD
    nombresCircuito: 'Objetos del circuito', limite: 'Zona del límite', todoCircuito: 'Superficie del circuito',
=======
>>>>>>> T4
    posicion: 'Posición', rumbo: 'Rumbo', circuito: 'Tamaño del circuito', ruedas: 'Ruedas animables',
    ejes: 'Distancia entre ejes', radio: 'Radios de las ruedas',
  },
  ca: {
    volver: '← Tornar', prototipo: 'PROTOTIP DE CONDUCCIÓ', vista: 'Veure circuit', conducir: 'Tornar a conduir',
    reiniciar: 'Reiniciar · R', diagnostico: 'Models i ajustos',
    controles: '<kbd>W</kbd> accelerar · <kbd>S</kbd> frenar / marxa enrere · <kbd>A</kbd><kbd>D</kbd> direcció',
    salida: 'A la vista del circuit: Majúscules + clic sobre la carretera per triar la sortida.',
    cargando: 'Carregant els models…', listo: 'A punt. Fes servir WASD per conduir.',
    inspeccion: 'Arrossega per mirar el circuit; fes servir la roda del ratolí per apropar-te. Majúscules + clic tria la sortida.',
    salidaElegida: 'Sortida desada per a aquesta sessió. R torna a aquest punt.',
<<<<<<< HEAD
    borde: 'Límit del terreny. Frena i canvia de direcció o fes marxa enrere.',
    salidaFuera: 'El cotxe sencer ha de cabre dins del terreny. Tria un punt més allunyat de la vora.',
    salidaInvalida: 'No es troba una sortida vàlida. Tria-la amb Veure circuit i Majúscules + clic, o revisa la mida del cotxe i la zona del límit.',
    salidaReubicada: 'El punt inicial era fora del terreny. El cotxe s’ha col·locat en una zona vàlida; fes servir WASD.',
=======
>>>>>>> T4
    avisos: 'El cotxe es pot moure. Revisa les rodes a «Models i ajustos».',
    error: 'No s’han pogut carregar tots els models. Revisa les rutes i el servidor a «Models i ajustos».',
    webgl: 'No s’ha pogut iniciar WebGL. Comprova que el navegador tingui acceleració gràfica.',
    nombres: 'Noms originals del cotxe', problemas: 'Diagnòstic',
<<<<<<< HEAD
    nombresCircuito: 'Objectes del circuit', limite: 'Zona del límit', todoCircuito: 'Superfície del circuit',
=======
>>>>>>> T4
    posicion: 'Posició', rumbo: 'Orientació', circuito: 'Mida del circuit', ruedas: 'Rodes animables',
    ejes: 'Distància entre eixos', radio: 'Radis de les rodes',
  },
  en: {
    volver: '← Back', prototipo: 'DRIVING PROTOTYPE', vista: 'View track', conducir: 'Return to driving',
    reiniciar: 'Reset · R', diagnostico: 'Models and settings',
    controles: '<kbd>W</kbd> accelerate · <kbd>S</kbd> brake / reverse · <kbd>A</kbd><kbd>D</kbd> steer',
    salida: 'In track view: Shift + click on the road to choose the starting position.',
    cargando: 'Loading models…', listo: 'Ready. Use WASD to drive.',
    inspeccion: 'Drag to look around; scroll to zoom. Shift + click chooses the starting position.',
    salidaElegida: 'Starting position saved for this session. R returns here.',
<<<<<<< HEAD
    borde: 'Terrain edge. Brake and steer away or reverse.',
    salidaFuera: 'The whole car must fit on the terrain. Choose a point farther from the edge.',
    salidaInvalida: 'No valid starting position found. Choose one with View track and Shift + click, or check the car size and allowed terrain.',
    salidaReubicada: 'The initial position was outside the terrain. The car was moved to a valid position; use WASD.',
=======
>>>>>>> T4
    avisos: 'You can drive. Check the wheels under “Models and settings”.',
    error: 'Some models failed to load. Check paths and the local server under “Models and settings”.',
    webgl: 'WebGL could not start. Check that your browser has graphics acceleration enabled.',
    nombres: 'Original car object names', problemas: 'Diagnostics',
<<<<<<< HEAD
    nombresCircuito: 'Track objects', limite: 'Boundary area', todoCircuito: 'Track surface',
=======
>>>>>>> T4
    posicion: 'Position', rumbo: 'Heading', circuito: 'Track size', ruedas: 'Animatable wheels',
    ejes: 'Wheelbase', radio: 'Wheel radii',
  },
};

let idiomaGuardado;
try { idiomaGuardado = localStorage.getItem('race-circuit-language'); } catch { /* Almacenamiento opcional. */ }
const idiomaPedido = new URLSearchParams(location.search).get('lang') || idiomaGuardado;
let idioma = Object.hasOwn(textos, idiomaPedido) ? idiomaPedido : 'es';
let mensaje = 'cargando';
let vistaCircuito = false;
let fallosCarga = false;
let diagnosticos = [];
let nombresCoche = [];
<<<<<<< HEAD
let nombresCircuito = [];
=======
>>>>>>> T4
let tamañoCircuito = null;
let vehiculo = null;
let circuito = null;
let suelo = null;
<<<<<<< HEAD
let limite = null;
let salidaInvalida = false;
=======
>>>>>>> T4
let salida = { posicion: [...CONFIG.salida.posicion], rumboGrados: CONFIG.salida.rumboGrados };
let estado = crearEstado(salida.posicion, salida.rumboGrados);
const teclas = new Set();
const gravedadRay = new THREE.Raycaster();
const clicRay = new THREE.Raycaster();
const cajaCircuito = new THREE.Box3();
let camaraInmediata = true;

function mostrarMensaje(clave) {
  mensaje = clave;
  $('estado').textContent = textos[idioma][clave];
}

function pintarDiagnostico() {
  const t = textos[idioma];
  const partes = [];
  if (tamañoCircuito) partes.push(`${t.circuito}: ${tamañoCircuito.toArray().map(v => v.toFixed(2)).join(' × ')} m (X × Y × Z)`);
  if (vehiculo) {
    partes.push(`${t.ruedas}: ${vehiculo.ruedas.length}/4`);
    partes.push(`${t.ejes}: ${vehiculo.distanciaEjes.toFixed(2)} m`);
    partes.push(`${t.radio}: ${vehiculo.ruedas.map(r => `${r.nombre}=${r.radio.toFixed(3)} m`).join(', ')}`);
  }
<<<<<<< HEAD
  if (limite) partes.push(`${t.limite}: ${CONFIG.limites.nombreZona || t.todoCircuito}`);
  if (diagnosticos.length) partes.push(`\n${t.problemas}:\n${diagnosticos.join('\n')}`);
  if (nombresCoche.length) partes.push(`\n${t.nombres}:\n${nombresCoche.join('\n')}`);
  if (nombresCircuito.length) partes.push(`\n${t.nombresCircuito}:\n${nombresCircuito.join('\n')}`);
=======
  if (diagnosticos.length) partes.push(`\n${t.problemas}:\n${diagnosticos.join('\n')}`);
  if (nombresCoche.length) partes.push(`\n${t.nombres}:\n${nombresCoche.join('\n')}`);
>>>>>>> T4
  $('lista-modelos').textContent = partes.join('\n');
}

function cambiarIdioma(nuevo) {
  idioma = nuevo;
  const t = textos[idioma];
  document.documentElement.lang = idioma;
  $('volver').textContent = t.volver;
  $('volver').href = `./index.html?lang=${idioma}`;
  $('etiqueta-prototipo').textContent = t.prototipo;
  $('controles').innerHTML = t.controles;
  $('vista').textContent = vistaCircuito ? t.conducir : t.vista;
  $('reiniciar').textContent = t.reiniciar;
  $('titulo-diagnostico').textContent = t.diagnostico;
  $('ayuda-salida').textContent = t.salida;
  $('idioma').textContent = idioma.toUpperCase();
  $('idioma').setAttribute('aria-label', { es: 'Cambiar idioma', ca: 'Canviar idioma', en: 'Change language' }[idioma]);
  $('juego').setAttribute('aria-label', { es: 'Prototipo de conducción', ca: 'Prototip de conducció', en: 'Driving prototype' }[idioma]);
  mostrarMensaje(mensaje);
  pintarDiagnostico();
  try { localStorage.setItem('race-circuit-language', idioma); } catch { /* Opcional. */ }
}

const escena = new THREE.Scene();
escena.background = new THREE.Color('#819aa7');
const camara = new THREE.PerspectiveCamera(65, 1, 0.05, 2000);
camara.position.set(0, 5, 8);
camara.lookAt(0, 0, 0);
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas: $('escena'), antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
} catch (error) {
  diagnosticos.push(String(error));
  cambiarIdioma(idioma);
  mostrarMensaje('webgl');
  $('diagnostico').open = true;
}

if (renderer) iniciar();

function iniciar() {
  escena.add(new THREE.HemisphereLight(0xffffff, 0x617f51, 2.4));
  const sol = new THREE.DirectionalLight(0xfff4dc, 3);
  sol.position.set(-20, 35, 15);
  escena.add(sol);
<<<<<<< HEAD
=======
  // Rejilla orientativa, visible aunque todavía no existan los GLB.
  const rejilla = new THREE.GridHelper(200, 100, 0x344f65, 0x698792);
  rejilla.position.y = -0.05;
  escena.add(rejilla);
>>>>>>> T4
  const orbit = new OrbitControls(camara, renderer.domElement);
  orbit.enabled = false;
  orbit.enableDamping = true;
  orbit.maxPolarAngle = Math.PI * 0.49;

  function redimensionar() {
    const ancho = renderer.domElement.clientWidth;
    const alto = renderer.domElement.clientHeight;
    renderer.setSize(ancho, alto, false);
    camara.aspect = ancho / Math.max(alto, 1);
    camara.updateProjectionMatrix();
  }
  window.addEventListener('resize', redimensionar);
  redimensionar();
  cambiarIdioma(idioma);

  function cambiarVista(inspeccionar) {
    vistaCircuito = inspeccionar;
    orbit.enabled = inspeccionar;
    teclas.clear();
    if (vehiculo) estado.velocidad = 0;
    if (inspeccionar && circuito) {
      const centro = cajaCircuito.getCenter(new THREE.Vector3());
      const distancia = Math.max(tamañoCircuito.x, tamañoCircuito.z, 10) * 0.8;
      orbit.target.copy(centro);
      camara.position.set(centro.x, cajaCircuito.max.y + distancia, centro.z + distancia * 0.6);
      orbit.update();
      mostrarMensaje('inspeccion');
    } else {
      camaraInmediata = true;
<<<<<<< HEAD
      mostrarMensaje(fallosCarga ? 'error' : salidaInvalida ? 'salidaInvalida' : vehiculo?.avisos.length ? 'avisos' : 'listo');
=======
      mostrarMensaje(fallosCarga ? 'error' : vehiculo?.avisos.length ? 'avisos' : 'listo');
>>>>>>> T4
    }
    $('vista').textContent = textos[idioma][inspeccionar ? 'conducir' : 'vista'];
  }

  function colocarCoche() {
    if (!vehiculo) return;
<<<<<<< HEAD
    salidaInvalida = false;
    let reubicada = false;
    if (limite) {
      const segura = limite.salidaSegura(salida.posicion, salida.rumboGrados * Math.PI / 180, vehiculo.huella);
      if (segura) {
        reubicada = Math.hypot(segura[0] - salida.posicion[0], segura[2] - salida.posicion[2]) > 0.001;
        salida.posicion = segura;
      } else salidaInvalida = true;
    }
=======
>>>>>>> T4
    estado = crearEstado(salida.posicion, salida.rumboGrados);
    vehiculo.actor.position.set(...salida.posicion);
    vehiculo.actor.rotation.y = estado.rumbo;
    vehiculo.reiniciarRuedas();
    ajustarAltura(true);
    camaraInmediata = true;
    teclas.clear();
<<<<<<< HEAD
    if (salidaInvalida) mostrarMensaje('salidaInvalida');
    else if (reubicada) mostrarMensaje('salidaReubicada');
    return reubicada;
=======
>>>>>>> T4
  }

  function ajustarAltura(inicial = false) {
    if (!vehiculo || !suelo || !CONFIG.circuito.seguirAlturaSuelo) return;
    // La carretera debe ser plana o de pendiente suave para este primer paso.
    const coche = vehiculo.actor;
<<<<<<< HEAD
    if (limite) {
      const y = limite.alturaEn(coche.position.x, coche.position.z);
      if (y !== null) coche.position.y = y + 0.015;
      return;
    }
=======
>>>>>>> T4
    const alturaOrigen = inicial ? Math.max(cajaCircuito.max.y + 2, coche.position.y + 2) : coche.position.y + 1.5;
    gravedadRay.set(new THREE.Vector3(coche.position.x, alturaOrigen, coche.position.z), new THREE.Vector3(0, -1, 0));
    gravedadRay.far = inicial ? Math.max(20, alturaOrigen - cajaCircuito.min.y + 5) : 8;
    const impacto = gravedadRay.intersectObject(suelo, true)[0];
    if (impacto) coche.position.y = impacto.point.y + 0.015;
  }

  $('vista').addEventListener('click', () => cambiarVista(!vistaCircuito));
  $('reiniciar').addEventListener('click', colocarCoche);
  $('idioma').addEventListener('click', () => {
    const idiomas = ['es', 'ca', 'en'];
    cambiarIdioma(idiomas[(idiomas.indexOf(idioma) + 1) % idiomas.length]);
  });
  const esCampo = elemento => elemento?.matches('input, textarea, select, [contenteditable="true"]');
  window.addEventListener('keydown', evento => {
    if (esCampo(evento.target)) return;
    if (['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(evento.code)) {
      evento.preventDefault();
      if (!vistaCircuito) teclas.add(evento.code);
    }
    if (evento.code === 'KeyR' && !evento.repeat) colocarCoche();
  });
  window.addEventListener('keyup', evento => teclas.delete(evento.code));
  window.addEventListener('blur', () => teclas.clear());
  document.addEventListener('visibilitychange', () => { if (document.hidden) teclas.clear(); });

  // Pointerup evita colocar la salida por accidente al arrastrar la vista.
  let puntoPulsado = null;
  renderer.domElement.addEventListener('pointerdown', evento => {
    puntoPulsado = { x: evento.clientX, y: evento.clientY };
  });
  renderer.domElement.addEventListener('pointerup', evento => {
    if (!vistaCircuito || !evento.shiftKey || !suelo || !vehiculo || !puntoPulsado) return;
    if (Math.hypot(evento.clientX - puntoPulsado.x, evento.clientY - puntoPulsado.y) > 6) return;
    const rect = renderer.domElement.getBoundingClientRect();
    const raton = new THREE.Vector2(
      ((evento.clientX - rect.left) / rect.width) * 2 - 1,
      -((evento.clientY - rect.top) / rect.height) * 2 + 1,
    );
    clicRay.setFromCamera(raton, camara);
    const impacto = clicRay.intersectObject(suelo, true)[0];
    if (!impacto) return;
<<<<<<< HEAD
    if (limite && !limite.contiene(impacto.point.x, impacto.point.z,
      salida.rumboGrados * Math.PI / 180, vehiculo.huella)) {
      mostrarMensaje('salidaFuera');
      return;
    }
=======
>>>>>>> T4
    salida.posicion = impacto.point.toArray();
    colocarCoche();
    mostrarMensaje('salidaElegida');
  });

  cargarModelos().then(() => {
<<<<<<< HEAD
    const reubicada = colocarCoche();
    $('vista').disabled = !circuito || !vehiculo;
    $('reiniciar').disabled = !vehiculo;
    if (fallosCarga || vehiculo?.avisos.length) $('diagnostico').open = true;
    mostrarMensaje(fallosCarga ? 'error' : salidaInvalida ? 'salidaInvalida' : vehiculo?.avisos.length ? 'avisos' : reubicada ? 'salidaReubicada' : 'listo');
=======
    colocarCoche();
    $('vista').disabled = !circuito || !vehiculo;
    $('reiniciar').disabled = !vehiculo;
    if (fallosCarga || vehiculo?.avisos.length) $('diagnostico').open = true;
    mostrarMensaje(fallosCarga ? 'error' : vehiculo?.avisos.length ? 'avisos' : 'listo');
>>>>>>> T4
  });

  const posicionCamara = new THREE.Vector3();
  const objetivoCamara = new THREE.Vector3();
  const objetivoSuave = new THREE.Vector3();
  let instanteAnterior;
  renderer.setAnimationLoop(instante => {
    const dt = instanteAnterior === undefined ? 0 : Math.min((instante - instanteAnterior) / 1000, 0.05);
    instanteAnterior = instante;
    if (vehiculo) {
      if (!vistaCircuito) {
<<<<<<< HEAD
        let distancia = 0;
        if (!CONFIG.limites.activo || (limite && !salidaInvalida)) {
          const movimiento = avanzarConLimite(estado, teclas, dt, CONFIG.conduccion, vehiculo.distanciaEjes,
            candidato => !CONFIG.limites.activo || limite.contiene(candidato.x, candidato.z, candidato.rumbo, vehiculo.huella),
            CONFIG.limites.pasoMaximo);
          distancia = movimiento.distancia;
          if (movimiento.bloqueado && mensaje !== 'borde') mostrarMensaje('borde');
          else if (!movimiento.bloqueado && distancia !== 0 && mensaje === 'borde') {
            mostrarMensaje(vehiculo.avisos.length ? 'avisos' : 'listo');
          }
        } else estado.velocidad = 0;
=======
        const distancia = avanzar(estado, teclas, dt, CONFIG.conduccion, vehiculo.distanciaEjes);
>>>>>>> T4
        vehiculo.actor.position.x = estado.x;
        vehiculo.actor.position.z = estado.z;
        vehiculo.actor.rotation.y = estado.rumbo;
        ajustarAltura();
        vehiculo.actualizarRuedas(distancia, estado.direccion);
        posicionCamara.set(
          estado.x + Math.sin(estado.rumbo) * CONFIG.camara.distancia,
          vehiculo.actor.position.y + CONFIG.camara.altura,
          estado.z + Math.cos(estado.rumbo) * CONFIG.camara.distancia,
        );
        objetivoCamara.set(
          estado.x - Math.sin(estado.rumbo) * CONFIG.camara.mirarDelante,
          vehiculo.actor.position.y + 0.8,
          estado.z - Math.cos(estado.rumbo) * CONFIG.camara.mirarDelante,
        );
        const suavidad = camaraInmediata ? 1 : 1 - Math.exp(-CONFIG.camara.suavidad * dt);
        camara.position.lerp(posicionCamara, suavidad);
        objetivoSuave.lerp(objetivoCamara, suavidad);
        camara.lookAt(objetivoSuave);
        camaraInmediata = false;
      }
      $('velocidad').textContent = Math.round(Math.abs(estado.velocidad) * 3.6);
      const t = textos[idioma];
      const grados = ((estado.rumbo * 180 / Math.PI) % 360 + 360) % 360;
      $('coordenadas').textContent = `${t.posicion}: [${vehiculo.actor.position.toArray().map(v => v.toFixed(2)).join(', ')}] · ${t.rumbo}: ${grados.toFixed(1)}°`;
    }
    if (vistaCircuito) orbit.update();
    renderer.render(escena, camara);
  });
}

async function cargarModelos() {
  const loader = new GLTFLoader();
  const resultados = await Promise.allSettled([
    loader.loadAsync(CONFIG.modelos.circuito),
    cargarConjuntoCoche(loader, CONFIG.modelos, CONFIG.coche),
  ]);
  const resultadoCircuito = resultados[0];
  const resultadoCoche = resultados[1];
  if (resultadoCircuito.status === 'fulfilled') {
    try {
      circuito = resultadoCircuito.value.scene;
<<<<<<< HEAD
      circuito.traverse(objeto => {
        if (!objeto.name) return;
        const materiales = (Array.isArray(objeto.material) ? objeto.material : [objeto.material])
          .filter(Boolean).map(material => material.name).filter(Boolean);
        nombresCircuito.push(`${objeto.name} (${objeto.type})${materiales.length ? ' · ' + materiales.join(', ') : ''}`);
      });
=======
>>>>>>> T4
      circuito.scale.multiplyScalar(CONFIG.circuito.escala);
      circuito.rotation.y += CONFIG.circuito.giroGrados * Math.PI / 180;
      circuito.position.add(new THREE.Vector3(...CONFIG.circuito.posicion));
      escena.add(circuito);
      circuito.updateWorldMatrix(true, true);
      cajaCircuito.setFromObject(circuito, true);
      if (cajaCircuito.isEmpty()) throw new Error('El circuito no contiene geometría visible.');
      tamañoCircuito = cajaCircuito.getSize(new THREE.Vector3());
      suelo = CONFIG.circuito.nombreSuelo ? circuito.getObjectByName(CONFIG.circuito.nombreSuelo) : circuito;
      if (!suelo) {
        diagnosticos.push(`No se encuentra el suelo '${CONFIG.circuito.nombreSuelo}'. Se usará todo el circuito.`);
        suelo = circuito;
      }
      camara.far = Math.max(2000, tamañoCircuito.length() * 4);
      camara.updateProjectionMatrix();
    } catch (error) {
      fallosCarga = true;
      diagnosticos.push(`Circuito: ${error.message}`);
      if (circuito) escena.remove(circuito);
      circuito = suelo = null;
    }
  } else {
    fallosCarga = true;
    diagnosticos.push(`Circuito: ${CONFIG.modelos.circuito}\n${resultadoCircuito.reason}`);
  }

  if (resultadoCoche.status === 'fulfilled') {
    try {
      resultadoCoche.value.modelo.traverse(objeto => {
        if (objeto.name) nombresCoche.push(`${objeto.name} (${objeto.type})`);
      });
      vehiculo = crearVehiculo(resultadoCoche.value.modelo, CONFIG.coche, resultadoCoche.value);
      escena.add(vehiculo.actor);
      diagnosticos.push(...vehiculo.avisos);
    } catch (error) {
      fallosCarga = true;
      diagnosticos.push(`Coche: ${error.message}`);
    }
  } else {
    fallosCarga = true;
    diagnosticos.push(`Coche: ${resultadoCoche.reason}`);
  }
<<<<<<< HEAD
  if (CONFIG.limites.activo && circuito && vehiculo) {
    try { limite = crearLimite(circuito, CONFIG.limites); }
    catch (error) {
      fallosCarga = true;
      diagnosticos.push(`Límite: ${error.message}`);
    }
  }
=======
>>>>>>> T4
  pintarDiagnostico();
}
