import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CONFIG } from './config.js';
import { crearEstado, avanzarConLimite, conduccionEnTerreno } from './movimiento.js';
import { crearVehiculo } from './vehiculo.js';
import { cargarConjuntoCoche } from './modelos.js';
import { crearLimite } from './limites.js';
import { crearDetectorTerreno } from './terreno.js';
import { TRAZADO, crearCarrera, iniciarCarrera, actualizarCarrera, formatearTiempo } from './carrera.js';

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
    borde: 'Límite del terreno. Frena y cambia de dirección o retrocede.',
    salidaFuera: 'El coche completo debe caber dentro del terreno. Elige un punto más alejado del borde.',
    salidaInvalida: 'No se encuentra una salida válida. Elige una con Ver circuito y Mayús + clic, o revisa el tamaño del coche y la zona del límite.',
    salidaReubicada: 'El punto inicial estaba fuera del terreno. Se ha colocado el coche en una zona válida; usa WASD.',
    avisos: 'El coche se puede mover. Revisa las ruedas en «Modelos y ajustes».',
    error: 'No se han podido cargar todos los modelos. Revisa las rutas y el servidor en «Modelos y ajustes».',
    webgl: 'No se ha podido iniciar WebGL. Comprueba que tu navegador tenga aceleración gráfica.',
    nombres: 'Nombres originales del coche', problemas: 'Diagnóstico',
    nombresCircuito: 'Objetos del circuito', limite: 'Zona del límite', todoCircuito: 'Superficie del circuito',
    posicion: 'Posición', rumbo: 'Rumbo', circuito: 'Tamaño del circuito', ruedas: 'Ruedas animables',
    ejes: 'Distancia entre ejes', radio: 'Radios de las ruedas',
    suelo: 'Suelo', asfalto: 'Asfalto', cesped: 'Césped',
  },
  ca: {
    volver: '← Tornar', prototipo: 'PROTOTIP DE CONDUCCIÓ', vista: 'Veure circuit', conducir: 'Tornar a conduir',
    reiniciar: 'Reiniciar · R', diagnostico: 'Models i ajustos',
    controles: '<kbd>W</kbd> accelerar · <kbd>S</kbd> frenar / marxa enrere · <kbd>A</kbd><kbd>D</kbd> direcció',
    salida: 'A la vista del circuit: Majúscules + clic sobre la carretera per triar la sortida.',
    cargando: 'Carregant els models…', listo: 'A punt. Fes servir WASD per conduir.',
    inspeccion: 'Arrossega per mirar el circuit; fes servir la roda del ratolí per apropar-te. Majúscules + clic tria la sortida.',
    salidaElegida: 'Sortida desada per a aquesta sessió. R torna a aquest punt.',
    borde: 'Límit del terreny. Frena i canvia de direcció o fes marxa enrere.',
    salidaFuera: 'El cotxe sencer ha de cabre dins del terreny. Tria un punt més allunyat de la vora.',
    salidaInvalida: 'No es troba una sortida vàlida. Tria-la amb Veure circuit i Majúscules + clic, o revisa la mida del cotxe i la zona del límit.',
    salidaReubicada: 'El punt inicial era fora del terreny. El cotxe s’ha col·locat en una zona vàlida; fes servir WASD.',
    avisos: 'El cotxe es pot moure. Revisa les rodes a «Models i ajustos».',
    error: 'No s’han pogut carregar tots els models. Revisa les rutes i el servidor a «Models i ajustos».',
    webgl: 'No s’ha pogut iniciar WebGL. Comprova que el navegador tingui acceleració gràfica.',
    nombres: 'Noms originals del cotxe', problemas: 'Diagnòstic',
    nombresCircuito: 'Objectes del circuit', limite: 'Zona del límit', todoCircuito: 'Superfície del circuit',
    posicion: 'Posició', rumbo: 'Orientació', circuito: 'Mida del circuit', ruedas: 'Rodes animables',
    ejes: 'Distància entre eixos', radio: 'Radis de les rodes',
    suelo: 'Terra', asfalto: 'Asfalt', cesped: 'Gespa',
  },
  en: {
    volver: '← Back', prototipo: 'DRIVING PROTOTYPE', vista: 'View track', conducir: 'Return to driving',
    reiniciar: 'Reset · R', diagnostico: 'Models and settings',
    controles: '<kbd>W</kbd> accelerate · <kbd>S</kbd> brake / reverse · <kbd>A</kbd><kbd>D</kbd> steer',
    salida: 'In track view: Shift + click on the road to choose the starting position.',
    cargando: 'Loading models…', listo: 'Ready. Use WASD to drive.',
    inspeccion: 'Drag to look around; scroll to zoom. Shift + click chooses the starting position.',
    salidaElegida: 'Starting position saved for this session. R returns here.',
    borde: 'Terrain edge. Brake and steer away or reverse.',
    salidaFuera: 'The whole car must fit on the terrain. Choose a point farther from the edge.',
    salidaInvalida: 'No valid starting position found. Choose one with View track and Shift + click, or check the car size and allowed terrain.',
    salidaReubicada: 'The initial position was outside the terrain. The car was moved to a valid position; use WASD.',
    avisos: 'You can drive. Check the wheels under “Models and settings”.',
    error: 'Some models failed to load. Check paths and the local server under “Models and settings”.',
    webgl: 'WebGL could not start. Check that your browser has graphics acceleration enabled.',
    nombres: 'Original car object names', problemas: 'Diagnostics',
    nombresCircuito: 'Track objects', limite: 'Boundary area', todoCircuito: 'Track surface',
    posicion: 'Position', rumbo: 'Heading', circuito: 'Track size', ruedas: 'Animatable wheels',
    ejes: 'Wheelbase', radio: 'Wheel radii',
    suelo: 'Surface', asfalto: 'Road', cesped: 'Grass',
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
let nombresCircuito = [];
let tamañoCircuito = null;
let vehiculo = null;
let circuito = null;
let suelo = null;
let limite = null;
let detectorTerreno = null;
let puntosRuedas = [];
let proporcionCesped = 0;
let carrera = null;
let puertasCarrera = [];
let señalesCarrera = [];
let recordCarrera = null;
const claveRecord = `race-circuit-record:${TRAZADO.id}:${TRAZADO.vueltas}`;
const textosCarrera = {
  es: { vuelta:'VUELTA', tiempo:'TIEMPO', control:'CONTROL', meta:'META', record:'RÉCORD', espera:'¿Listo para correr?', descripcion:'Completa 3 vueltas. Cruza los controles amarillos en orden y sobre el asfalto. Espacio o el botón para empezar.', empezar:'Empezar carrera', cuenta:'Prepárate', terminada:'¡Carrera completada!', otra:'Volver a correr', nuevo:'¡Nuevo récord personal!', total:'Tiempo total', parcial:'Vuelta', sinSuelo:'No se detecta el asfalto o el césped. Revisa los nombres de las superficies en Modelos y ajustes.', pausa:'PAUSA' },
  ca: { vuelta:'VOLTA', tiempo:'TEMPS', control:'CONTROL', meta:'META', record:'RÈCORD', espera:'A punt per córrer?', descripcion:'Completa 3 voltes. Travessa els controls grocs en ordre i sobre l’asfalt. Espai o el botó per començar.', empezar:'Començar cursa', cuenta:'Prepara’t', terminada:'Cursa completada!', otra:'Tornar a córrer', nuevo:'Nou rècord personal!', total:'Temps total', parcial:'Volta', sinSuelo:'No es detecta l’asfalt o la gespa. Revisa els noms de les superfícies a Models i ajustos.', pausa:'PAUSA' },
  en: { vuelta:'LAP', tiempo:'TIME', control:'CHECKPOINT', meta:'FINISH', record:'BEST', espera:'Ready to race?', descripcion:'Complete 3 laps. Cross the yellow checkpoints in order, on the road. Press Space or the button to start.', empezar:'Start race', cuenta:'Get ready', terminada:'Race complete!', otra:'Race again', nuevo:'New personal best!', total:'Total time', parcial:'Lap', sinSuelo:'Road or grass could not be detected. Check the surface names under Models and settings.', pausa:'PAUSED' },
};

function pintarCarrera() {
  const t=textosCarrera[idioma];
  $('etiqueta-vuelta').textContent=t.vuelta;
  $('etiqueta-tiempo').textContent=t.tiempo;
  $('etiqueta-control').textContent=t.control;
  $('etiqueta-record').textContent=t.record;
  $('record-carrera').textContent=recordCarrera === null ? '—' : formatearTiempo(recordCarrera);
  $('vueltas').textContent=`${carrera ? Math.min(carrera.vueltasCompletadas+1,carrera.vueltas) : 1}/${TRAZADO.vueltas}`;
  $('tiempo-carrera').textContent=formatearTiempo(carrera?.tiempo ?? 0);
  $('control-carrera').textContent=vistaCircuito ? t.pausa : carrera?.control === TRAZADO.controles.length ? t.meta : `${(carrera?.control ?? 0)+1}/${TRAZADO.controles.length}`;
  $('capa-carrera').hidden=!carrera || vistaCircuito || carrera.fase==='corriendo';
  if (!carrera) return;
  const final=carrera.fase==='terminada', cuenta=carrera.fase==='cuenta';
  $('titulo-carrera').textContent=cuenta ? `${Math.ceil(carrera.cuentaAtras)}` : final ? t.terminada : t.espera;
  $('detalle-carrera').textContent=cuenta ? t.cuenta : final ? `${t.total}: ${formatearTiempo(carrera.tiempo)}${carrera.nuevoRecord ? '\n'+t.nuevo : ''}` : detectorTerreno ? t.descripcion : t.sinSuelo;
  $('parciales-carrera').textContent=final ? carrera.tiemposVuelta.map((v,i)=>`${t.parcial} ${i+1}: ${formatearTiempo(v)}`).join('\n') : '';
  $('empezar-carrera').hidden=cuenta;
  $('empezar-carrera').disabled=!detectorTerreno;
  $('empezar-carrera').textContent=final ? t.otra : t.empezar;
  for (let i=0;i<señalesCarrera.length;i++) {
    señalesCarrera[i].color.setHex(i === carrera.control ? 0xffe336 : i < carrera.control ? 0x4b995c : 0x2b8494);
  }
}

function prepararCarrera() {
  const transformar=p=>{
    const centro=circuito.localToWorld(new THREE.Vector3(p.x,0,p.z));
    const normal=new THREE.Vector3(p.nx,0,p.nz).transformDirection(circuito.matrixWorld);
    const largo=Math.hypot(p.nx,p.nz);
    const borde=circuito.localToWorld(new THREE.Vector3(p.x-p.nz/largo*p.ancho/2,0,p.z+p.nx/largo*p.ancho/2));
    return {x:centro.x,z:centro.z,nx:normal.x,nz:normal.z,ancho:2*Math.hypot(borde.x-centro.x,borde.z-centro.z)};
  };
  puertasCarrera=[...TRAZADO.controles,TRAZADO.meta].map(transformar);
  const inicio=circuito.localToWorld(new THREE.Vector3(...TRAZADO.salida.posicion));
  const angulo=TRAZADO.salida.rumboGrados*Math.PI/180;
  const direccion=new THREE.Vector3(-Math.sin(angulo),0,-Math.cos(angulo)).transformDirection(circuito.matrixWorld);
  salida={posicion:inicio.toArray(),rumboGrados:Math.atan2(-direccion.x,-direccion.z)*180/Math.PI};
  try { const guardado=JSON.parse(localStorage.getItem(claveRecord)); if(Number.isFinite(guardado)&&guardado>0)recordCarrera=guardado; } catch { /* Opcional. */ }
  if (TRAZADO.mostrarControles && detectorTerreno) {
    puertasCarrera.slice(0,-1).forEach(p=>{
      const y=detectorTerreno.alturaEn(p.x,p.z);
      if(y===null)return;
      const material=new THREE.MeshBasicMaterial({color:0x2b8494});
      const grupo=new THREE.Group();
      grupo.position.set(p.x,y+.05,p.z);
      grupo.rotation.y=Math.atan2(p.nx,p.nz);
      for(const x of [-p.ancho/2,p.ancho/2]) {
        const poste=new THREE.Mesh(new THREE.BoxGeometry(.12,2.5,.12),material);poste.position.set(x,1.25,0);grupo.add(poste);
      }
      const travesaño=new THREE.Mesh(new THREE.BoxGeometry(p.ancho,.12,.12),material);travesaño.position.y=2.5;grupo.add(travesaño);
      const flecha=new THREE.ArrowHelper(new THREE.Vector3(0,0,1),new THREE.Vector3(0,.12,-1.5),3,0xffe336,1,.6);grupo.add(flecha);
      escena.add(grupo);señalesCarrera.push(material);
    });
  }
}
let salidaInvalida = false;
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
  if (limite) partes.push(`${t.limite}: ${CONFIG.limites.nombreZona || t.todoCircuito}`);
  if (diagnosticos.length) partes.push(`\n${t.problemas}:\n${diagnosticos.join('\n')}`);
  if (nombresCoche.length) partes.push(`\n${t.nombres}:\n${nombresCoche.join('\n')}`);
  if (nombresCircuito.length) partes.push(`\n${t.nombresCircuito}:\n${nombresCircuito.join('\n')}`);
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
  pintarCarrera();
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
      mostrarMensaje(fallosCarga ? 'error' : salidaInvalida ? 'salidaInvalida' : vehiculo?.avisos.length ? 'avisos' : 'listo');
    }
    $('vista').textContent = textos[idioma][inspeccionar ? 'conducir' : 'vista'];
  }

  function colocarCoche() {
    if (!vehiculo) return;
    if (puertasCarrera.length) carrera=crearCarrera(puertasCarrera,TRAZADO.vueltas,TRAZADO.cuentaAtras);
    salidaInvalida = false;
    let reubicada = false;
    if (limite) {
      const segura = limite.salidaSegura(salida.posicion, salida.rumboGrados * Math.PI / 180, vehiculo.huella);
      if (segura) {
        reubicada = Math.hypot(segura[0] - salida.posicion[0], segura[2] - salida.posicion[2]) > 0.001;
        salida.posicion = segura;
      } else salidaInvalida = true;
    }
    estado = crearEstado(salida.posicion, salida.rumboGrados);
    vehiculo.actor.position.set(...salida.posicion);
    vehiculo.actor.rotation.y = estado.rumbo;
    vehiculo.reiniciarRuedas();
    ajustarAltura(true);
    proporcionCesped = detectorTerreno?.porcentajeCesped(estado, puntosRuedas) ?? 0;
    camaraInmediata = true;
    teclas.clear();
    pintarCarrera();
    if (salidaInvalida) mostrarMensaje('salidaInvalida');
    else if (reubicada) mostrarMensaje('salidaReubicada');
    return reubicada;
  }

  function ajustarAltura(inicial = false) {
    if (!vehiculo || !suelo || !CONFIG.circuito.seguirAlturaSuelo) return;
    // La carretera debe ser plana o de pendiente suave para este primer paso.
    const coche = vehiculo.actor;
    if (detectorTerreno) {
      const y=detectorTerreno.alturaEn(coche.position.x,coche.position.z);
      if(y !== null) { coche.position.y=y+.015; return; }
    }
    if (limite) {
      const y = limite.alturaEn(coche.position.x, coche.position.z);
      if (y !== null) coche.position.y = y + 0.015;
      return;
    }
    const alturaOrigen = inicial ? Math.max(cajaCircuito.max.y + 2, coche.position.y + 2) : coche.position.y + 1.5;
    gravedadRay.set(new THREE.Vector3(coche.position.x, alturaOrigen, coche.position.z), new THREE.Vector3(0, -1, 0));
    gravedadRay.far = inicial ? Math.max(20, alturaOrigen - cajaCircuito.min.y + 5) : 8;
    const impacto = gravedadRay.intersectObject(suelo, true)[0];
    if (impacto) coche.position.y = impacto.point.y + 0.015;
  }

  $('vista').addEventListener('click', () => cambiarVista(!vistaCircuito));
  $('reiniciar').addEventListener('click', colocarCoche);
  function empezar() {
    if (!carrera || !detectorTerreno || vistaCircuito) return;
    if (carrera.fase==='terminada') colocarCoche();
    teclas.clear();
    iniciarCarrera(carrera);
    pintarCarrera();
  }
  $('empezar-carrera').addEventListener('click',empezar);
  $('idioma').addEventListener('click', () => {
    const idiomas = ['es', 'ca', 'en'];
    cambiarIdioma(idiomas[(idiomas.indexOf(idioma) + 1) % idiomas.length]);
  });
  const esCampo = elemento => elemento?.matches('input, textarea, select, [contenteditable="true"]');
  window.addEventListener('keydown', evento => {
    if (esCampo(evento.target)) return;
    if (evento.code==='Space' && !evento.repeat) { evento.preventDefault(); empezar(); }
    if (['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(evento.code)) {
      evento.preventDefault();
      if (!vistaCircuito) teclas.add(evento.code);
    }
    if (evento.code === 'KeyR' && !evento.repeat) colocarCoche();
  });
  window.addEventListener('keyup', evento => teclas.delete(evento.code));
  window.addEventListener('blur', () => teclas.clear());
  document.addEventListener('visibilitychange', () => { teclas.clear(); instanteAnterior=undefined; });

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
    if (limite && !limite.contiene(impacto.point.x, impacto.point.z,
      salida.rumboGrados * Math.PI / 180, vehiculo.huella)) {
      mostrarMensaje('salidaFuera');
      return;
    }
    salida.posicion = impacto.point.toArray();
    colocarCoche();
    mostrarMensaje('salidaElegida');
  });

  cargarModelos().then(() => {
    const reubicada = colocarCoche();
    $('vista').disabled = !circuito || !vehiculo;
    $('reiniciar').disabled = !vehiculo;
    if (fallosCarga || vehiculo?.avisos.length) $('diagnostico').open = true;
    mostrarMensaje(fallosCarga ? 'error' : salidaInvalida ? 'salidaInvalida' : vehiculo?.avisos.length ? 'avisos' : reubicada ? 'salidaReubicada' : 'listo');
  });

  const posicionCamara = new THREE.Vector3();
  const objetivoCamara = new THREE.Vector3();
  const objetivoSuave = new THREE.Vector3();
  let instanteAnterior;
  renderer.setAnimationLoop(instante => {
    const tiempoReal = instanteAnterior === undefined || document.hidden ? 0 : Math.max(0,(instante-instanteAnterior)/1000);
    const dt = instanteAnterior === undefined ? 0 : Math.min((instante - instanteAnterior) / 1000, 0.05);
    instanteAnterior = instante;
    if (vehiculo) {
      if (!vistaCircuito) {
        const anterior={x:estado.x,z:estado.z};
        const enCarrera=carrera?.fase==='corriendo' && !document.hidden;
        let distancia = 0;
        if (enCarrera && (!CONFIG.limites.activo || (limite && !salidaInvalida))) {
          proporcionCesped = detectorTerreno?.porcentajeCesped(estado, puntosRuedas) ?? 0;
          const conduccion = conduccionEnTerreno(CONFIG.conduccion, CONFIG.cesped, proporcionCesped);
          const movimiento = avanzarConLimite(estado, teclas, dt, conduccion, vehiculo.distanciaEjes,
            candidato => !CONFIG.limites.activo || limite.contiene(candidato.x, candidato.z, candidato.rumbo, vehiculo.huella),
            CONFIG.limites.pasoMaximo);
          distancia = movimiento.distancia;
          if (movimiento.bloqueado && mensaje !== 'borde') mostrarMensaje('borde');
          else if (!movimiento.bloqueado && distancia !== 0 && mensaje === 'borde') {
            mostrarMensaje(vehiculo.avisos.length ? 'avisos' : 'listo');
          }
        } else estado.velocidad = 0;
        vehiculo.actor.position.x = estado.x;
        vehiculo.actor.position.z = estado.z;
        vehiculo.actor.rotation.y = estado.rumbo;
        ajustarAltura();
        vehiculo.actualizarRuedas(distancia, estado.direccion);
        if (carrera && actualizarCarrera(carrera,anterior,{...estado,avance:distancia},tiempoReal,(x,z)=>detectorTerreno?.tipoEn(x,z)==='asfalto')) {
          estado.velocidad=0;
          if(recordCarrera===null || carrera.tiempo<recordCarrera) {
            recordCarrera=carrera.tiempo; carrera.nuevoRecord=true;
            try { localStorage.setItem(claveRecord,JSON.stringify(recordCarrera)); } catch { /* Opcional. */ }
          }
        }
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
      const superficie = proporcionCesped > 0 ? `${t.cesped} (${Math.round(proporcionCesped * 100)} %)` : t.asfalto;
      $('coordenadas').textContent = `${t.posicion}: [${vehiculo.actor.position.toArray().map(v => v.toFixed(2)).join(', ')}] · ${t.rumbo}: ${grados.toFixed(1)}°${detectorTerreno ? ` · ${t.suelo}: ${superficie}` : ''}`;
    }
    if (vistaCircuito) orbit.update();
    pintarCarrera();
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
      circuito.traverse(objeto => {
        if (!objeto.name) return;
        const materiales = (Array.isArray(objeto.material) ? objeto.material : [objeto.material])
          .filter(Boolean).map(material => material.name).filter(Boolean);
        nombresCircuito.push(`${objeto.name} (${objeto.type})${materiales.length ? ' · ' + materiales.join(', ') : ''}`);
      });
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
  if (CONFIG.limites.activo && circuito && vehiculo) {
    try { limite = crearLimite(circuito, CONFIG.limites); }
    catch (error) {
      fallosCarga = true;
      diagnosticos.push(`Límite: ${error.message}`);
    }
  }
  if (circuito && vehiculo) {
    try {
      const detector = crearDetectorTerreno(circuito, CONFIG.cesped);
      diagnosticos.push(...detector.avisos);
      if (detector.disponible) detectorTerreno = detector;
      else $('diagnostico').open = true;
      // Usa los centros reales de las 4 ruedas, ya corregidos al montar el GLB.
      puntosRuedas = vehiculo.ruedas.length === 4
        ? vehiculo.ruedas.map(rueda => ({ x: rueda.centro.x, z: rueda.centro.z }))
        : [-1, 1].flatMap(lado => [-1, 1].map(eje => ({
            x: lado * vehiculo.huella.semiancho * 0.85,
            z: eje * vehiculo.huella.semilargo * 0.65,
          })));
    } catch (error) {
      diagnosticos.push(`Césped: ${error.message}`);
    }
  }
  if(circuito && vehiculo) prepararCarrera();
  pintarDiagnostico();
}
