import * as THREE from 'three';
import { CONFIG } from './config.js';
import { formatearTiempo } from './carrera.js';

export const TEXTOS = {
  es: {
    omitido: 'Te has saltado un checkpoint',
    volverAsfalto: 'Vuelve al asfalto',
    golpeRoca: 'Golpe con una roca',

    tresVueltas: 'TRES VUELTAS.',
    aFondo: 'A FONDO.',
    intro: 'Turbos, obstáculos y curvas. Mejora tu marca o reta a alguien a tu lado.',
    local: '1–2 JUGADORES · LOCAL',
    configura: 'CONFIGURA TU CARRERA',
    modo: 'Modo de juego',
    unJugador: '1 jugador',
    dosJugadores: '2 jugadores',
    contrarreloj: 'Contrarreloj',
    pantallaDividida: 'Pantalla dividida',
    ambiente: 'Ambiente',
    costa: 'Costa',
    neon: 'Neón',
    alpino: 'Alpino',
    mismoCircuito: 'El circuito prototipo, con tres ambientes visuales.',
    obstaculos: 'Rocas y plátanos',
    sonido: 'Sonido',
    idioma: 'Idioma',
    cargando: 'Cargando modelos…',
    empezar: 'EMPEZAR CARRERA →',
    controlesJ1: 'WASD · F para recolocarte',
    controlesJ2: 'Flechas · Enter para recolocarte',
    modelos: 'Modelos y ajustes',
    ajustarInicio:
      'En Ver circuito, Mayús + clic prueba otra salida para J1. Desactiva el récord de esa sesión.',
    pausa: 'Pausa',
    menu: 'Menú',
    recorrido: 'RECORRIDO',
    preparate: 'ACELERA CUANDO VEAS EL 1',
    salidaAnticipada: 'Salida anticipada',
    enPausa: 'CARRERA EN PAUSA',
    pausaAyuda: 'El tiempo, los turbos y los objetos están detenidos.',
    continuar: 'Continuar',
    reiniciar: 'Reiniciar · R',
    verCircuito: 'Ver circuito',
    volverConducir: 'Volver a conducir',
    volverMenu: 'Volver al menú',
    banderaCuadros: 'BANDERA A CUADROS',
    otraCarrera: 'Otra carrera',
    atajos: 'P / Esc pausa · R reinicia · F / Enter recoloca',
    vuelta: 'VUELTA',
    tiempo: 'TIEMPO',
    posicion: 'POSICIÓN',
    mejorVuelta: 'MEJOR VUELTA',
    control: 'CONTROL',
    meta: 'META',
    asfalto: 'Asfalto',
    cesped: 'Césped',
    recolocar: 'Recolocar',
    derrape: '¡Cuidado con el plátano!',
    recuperando: 'Recolocando…',
    sentido: 'Sentido contrario',
    completada: '¡CARRERA COMPLETADA!',
    empate: '¡EMPATE!',
    gana: 'Gana',
    nuevoRecord: '¡Nuevo récord personal!',
    record: 'Récord personal',
    sinRecord: 'Sin marca anterior',
    pendiente: 'Carrera sin terminar',
    vueltasHechas: 'vueltas completadas',
    listo: 'Modelos listos. Elige modo y empieza.',
    error: 'No se ha podido cargar el juego. Abre Modelos y ajustes.',
    entrenamiento: 'Salida de prueba: récord desactivado.',
    avisoGuardado: 'No se pueden guardar ajustes en este navegador.',
    total: 'Tiempo total',
    juega: '¡SALIDA!',
    noSonido: 'El sonido no está disponible en este navegador.',
  },
  ca: {
    omitido: 'T’has saltat un control',
    volverAsfalto: 'Torna a l’asfalt',
    golpeRoca: 'Cop amb una roca',

    tresVueltas: 'TRES VOLTES.',
    aFondo: 'A FONS.',
    intro: 'Turbos, obstacles i revolts. Millora la teva marca o desafia algú al teu costat.',
    local: '1–2 JUGADORS · LOCAL',
    configura: 'CONFIGURA LA CURSA',
    modo: 'Mode de joc',
    unJugador: '1 jugador',
    dosJugadores: '2 jugadors',
    contrarreloj: 'Contrarellotge',
    pantallaDividida: 'Pantalla dividida',
    ambiente: 'Ambient',
    costa: 'Costa',
    neon: 'Neó',
    alpino: 'Alpí',
    mismoCircuito: 'El circuit prototip, amb tres ambients visuals.',
    obstaculos: 'Roques i plàtans',
    sonido: 'So',
    idioma: 'Idioma',
    cargando: 'Carregant models…',
    empezar: 'COMENÇAR CURSA →',
    controlesJ1: 'WASD · F per recol·locar-te',
    controlesJ2: 'Fletxes · Retorn per recol·locar-te',
    modelos: 'Models i ajustos',
    ajustarInicio:
      'A Veure circuit, Majúscules + clic prova una altra sortida per a J1. Desactiva el rècord de la sessió.',
    pausa: 'Pausa',
    menu: 'Menú',
    recorrido: 'RECORREGUT',
    preparate: 'ACCELERA QUAN VEGIS L’1',
    salidaAnticipada: 'Sortida anticipada',
    enPausa: 'CURSA EN PAUSA',
    pausaAyuda: 'El temps, els turbos i els objectes estan aturats.',
    continuar: 'Continuar',
    reiniciar: 'Reiniciar · R',
    verCircuito: 'Veure circuit',
    volverConducir: 'Tornar a conduir',
    volverMenu: 'Tornar al menú',
    banderaCuadros: 'BANDERA DE QUADRES',
    otraCarrera: 'Una altra cursa',
    atajos: 'P / Esc pausa · R reinicia · F / Retorn recol·loca',
    vuelta: 'VOLTA',
    tiempo: 'TEMPS',
    posicion: 'POSICIÓ',
    mejorVuelta: 'MILLOR VOLTA',
    control: 'CONTROL',
    meta: 'META',
    asfalto: 'Asfalt',
    cesped: 'Gespa',
    recolocar: 'Recol·locar',
    derrape: 'Compte amb el plàtan!',
    recuperando: 'Recol·locant…',
    sentido: 'Sentit contrari',
    completada: 'CURSA COMPLETADA!',
    empate: 'EMPAT!',
    gana: 'Guanya',
    nuevoRecord: 'Nou rècord personal!',
    record: 'Rècord personal',
    sinRecord: 'Sense marca anterior',
    pendiente: 'Cursa sense acabar',
    vueltasHechas: 'voltes completades',
    listo: 'Models a punt. Tria el mode i comença.',
    error: 'No s’ha pogut carregar el joc. Obre Models i ajustos.',
    entrenamiento: 'Sortida de prova: rècord desactivat.',
    avisoGuardado: 'No es poden desar ajustos en aquest navegador.',
    total: 'Temps total',
    juega: 'SORTIDA!',
    noSonido: 'El so no està disponible en aquest navegador.',
  },
  en: {
    omitido: 'Checkpoint missed',
    volverAsfalto: 'Return to the road',
    golpeRoca: 'Rock hit',

    tresVueltas: 'THREE LAPS.',
    aFondo: 'FULL THROTTLE.',
    intro: 'Boost pads, obstacles and corners. Beat your best or challenge someone beside you.',
    local: '1–2 PLAYERS · LOCAL',
    configura: 'SET UP YOUR RACE',
    modo: 'Game mode',
    unJugador: '1 player',
    dosJugadores: '2 players',
    contrarreloj: 'Time trial',
    pantallaDividida: 'Split screen',
    ambiente: 'Atmosphere',
    costa: 'Coast',
    neon: 'Neon',
    alpino: 'Alpine',
    mismoCircuito: 'The prototype track, with three visual atmospheres.',
    obstaculos: 'Rocks and bananas',
    sonido: 'Sound',
    idioma: 'Language',
    cargando: 'Loading models…',
    empezar: 'START RACE →',
    controlesJ1: 'WASD · F to recover',
    controlesJ2: 'Arrow keys · Enter to recover',
    modelos: 'Models and settings',
    ajustarInicio:
      'In Track view, Shift + click tests a different start for P1. Personal best saving is disabled for that session.',
    pausa: 'Pause',
    menu: 'Menu',
    recorrido: 'TRACK',
    preparate: 'ACCELERATE WHEN YOU SEE 1',
    salidaAnticipada: 'False start',
    enPausa: 'RACE PAUSED',
    pausaAyuda: 'The clock, boosts and objects are paused.',
    continuar: 'Resume',
    reiniciar: 'Restart · R',
    verCircuito: 'Track view',
    volverConducir: 'Return to driving',
    volverMenu: 'Back to menu',
    banderaCuadros: 'CHEQUERED FLAG',
    otraCarrera: 'Race again',
    atajos: 'P / Esc pause · R restart · F / Enter recover',
    vuelta: 'LAP',
    tiempo: 'TIME',
    posicion: 'POSITION',
    mejorVuelta: 'BEST LAP',
    control: 'CHECKPOINT',
    meta: 'FINISH',
    asfalto: 'Road',
    cesped: 'Grass',
    recolocar: 'Recover',
    derrape: 'Watch out for the banana!',
    recuperando: 'Recovering…',
    sentido: 'Wrong way',
    completada: 'RACE COMPLETE!',
    empate: 'DRAW!',
    gana: 'Winner',
    nuevoRecord: 'New personal best!',
    record: 'Personal best',
    sinRecord: 'No previous best',
    pendiente: 'Race unfinished',
    vueltasHechas: 'laps completed',
    listo: 'Models ready. Choose a mode and start.',
    error: 'The game could not load. Open Models and settings.',
    entrenamiento: 'Test starting position: personal best saving disabled.',
    avisoGuardado: 'Settings cannot be saved in this browser.',
    total: 'Total time',
    juega: 'GO!',
    noSonido: 'Sound is unavailable in this browser.',
  },
};

const poner = (e, valor) => {
  const s = String(valor);
  if (e.textContent !== s) e.textContent = s;
};
const INICIO = -126;
const BARRIDO = 252;
const angulo = (valor, maximo) => INICIO + BARRIDO * Math.min(1, Math.max(0, valor / maximo));
function puntoDial(grados, radio) {
  const a = grados * Math.PI / 180;
  return [100 + Math.sin(a) * radio, 100 - Math.cos(a) * radio];
}
function arco(desde, hasta, radio) {
  const a = puntoDial(desde, radio), b = puntoDial(hasta, radio);
  return `M ${a} A ${radio} ${radio} 0 ${hasta - desde > 180 ? 1 : 0} 1 ${b}`;
}
function esfera(maximo) {
  const marcas = [];
  for (let kmh = 0; kmh <= maximo; kmh += 5) {
    const grados = angulo(kmh, maximo), mayor = kmh % 20 === 0;
    const [x1, y1] = puntoDial(grados, mayor ? 83 : 88);
    const [x2, y2] = puntoDial(grados, 93);
    marcas.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${mayor ? 'mayor' : ''}"/>`);
    if (mayor) {
      const [x, y] = puntoDial(grados, 72);
      marcas.push(`<text x="${x}" y="${y}">${kmh}</text>`);
    }
  }
  return `<svg viewBox="0 0 200 178" aria-hidden="true" class="dial-esfera">
    <path class="dial-carril" d="${arco(INICIO, INICIO + BARRIDO, 96)}"/>
    <path class="dial-limite" data-ref="zonaRoja"/>
    <path class="dial-carga" d="${arco(INICIO, INICIO + BARRIDO, 96)}" pathLength="100" data-ref="arco"/>
    <g class="dial-marcas">${marcas.join('')}</g>
    <g data-ref="aguja"><path class="dial-aguja" d="M 100 5 L 103 43 L 100 56 L 97 43 Z"/></g>
  </svg>`;
}

function ordenarParrilla(jugadores) {
  // Con los mismos controles validados, va delante quien está más cerca del siguiente.
  const distancia = (j) => {
    const puerta = j.carrera.puertas[j.carrera.control];
    return Math.hypot(puerta.x - j.estado.x, puerta.z - j.estado.z);
  };
  return [...jugadores].sort((a, b) =>
    b.carrera.vueltasCompletadas - a.carrera.vueltasCompletadas ||
    b.carrera.control - a.carrera.control ||
    (a.carrera.fase === 'terminada' ? a.carrera.tiempo - b.carrera.tiempo : distancia(a) - distancia(b)) ||
    a.id - b.id);
}

function marchaAutomatica(velocidad, anterior, maxima) {
  if (velocidad < -0.06) return 'R';
  if (velocidad < 0.06) return 'N';
  const banda = maxima / 5;
  let marcha = typeof anterior === 'number' ? anterior : 1;
  // Un pequeño margen al reducir evita que el número oscile al mantener el gas.
  while (marcha < 6 && velocidad >= banda * marcha) marcha++;
  while (marcha > 1 && velocidad < banda * (marcha - 1) - banda * 0.12) marcha--;
  return marcha;
}

export function crearInterfaz() {
  let idioma = 'es',
    referencias = [];
  function traducir(nuevo) {
    idioma = Object.hasOwn(TEXTOS, nuevo) ? nuevo : 'es';
    document.documentElement.lang = idioma;
    document
      .querySelectorAll('[data-i18n]')
      .forEach((e) => poner(e, TEXTOS[idioma][e.dataset.i18n] ?? e.dataset.i18n));
  }
  const contenedor = document.getElementById('huds');
  let mapa;
  function crearHuds(jugadores, pantallas, trazadoMapa) {
    mapa = trazadoMapa;
    contenedor.replaceChildren();
    referencias = [];
    jugadores.forEach((j, i) => {
      const h = document.createElement('section');
      h.className = 'jugador-hud';
      h.style.setProperty('--jugador', j.color);
      h.dataset.id = j.id;
      const maximo = Math.ceil(CONFIG.conduccion.velocidadMaxima * 3.6 * j.nitro.config.factorVelocidad / 20) * 20;
      h.innerHTML = `
        <div class="hud-crono">
          <div class="hud-cabecera"><strong data-ref="vuelta"></strong><span data-i18n="vuelta"></span></div>
          <dl class="hud-tiempos">
            <div><dt data-i18n="tiempo"></dt><dd data-ref="tiempo"></dd></div>
            <div><dt data-i18n="vuelta"></dt><dd data-ref="parcial"></dd></div>
            <div><dt data-i18n="mejorVuelta"></dt><dd data-ref="mejor"></dd></div>
          </dl>
        </div>
        <div class="hud-puesto"><span data-i18n="posicion"></span><strong data-ref="posicion"></strong>
          ${jugadores.length > 1 ? `<small>J${j.id}</small>` : ''}</div>
        <div class="hud-navegacion">
          <div class="hud-mapa"><canvas width="320" height="320" data-ref="mapa"></canvas></div>
          <div class="hud-control"><i></i><span data-i18n="control"></span> <b data-ref="control"></b></div>
        </div>
        <div class="hud-instrumentos"><div class="dial" data-ref="dial">
          ${esfera(maximo)}
          <div class="dial-lectura"><small>KM/H</small><strong data-ref="velocidad">0</strong>
            <span class="dial-auto">AUTO <b data-ref="marcha">N</b></span></div>
        </div>
        <div class="hud-efecto"><span data-ref="efecto"></span><div class="barra-nitro"><span data-ref="nitro"></span></div></div></div>
        <button class="recolocar" data-ref="recolocar" data-jugador="${j.id}" type="button"><kbd>${i ? '↵' : 'F'}</kbd> <span data-i18n="recolocar"></span></button>
        <p class="hud-aviso" data-ref="aviso" hidden></p>`;
      const p = pantallas[i];
      Object.assign(h.style, {
        left: p.left + 'px',
        top: p.top + 'px',
        width: p.w + 'px',
        height: p.h + 'px',
      });
      contenedor.append(h);
      const r = Object.fromEntries([...h.querySelectorAll('[data-ref]')].map(e => [e.dataset.ref, e]));
      referencias.push({ ...r, maximo, ctx: r.mapa.getContext('2d') });
    });
    traducir(idioma);
  }
  function pintar(jugadores) {
    const t = TEXTOS[idioma];
    const parrilla = ordenarParrilla(jugadores);
    jugadores.forEach((j, i) => {
      const r = referencias[i];
      if (!r) return;
      const c = j.carrera;
      poner(r.vuelta, Math.min(c.vueltasCompletadas + 1, c.vueltas) + '/' + c.vueltas);
      poner(r.posicion, (parrilla.indexOf(j) + 1) + '/' + parrilla.length);
      poner(r.tiempo, formatearTiempo(c.tiempo));
      poner(r.parcial, formatearTiempo(c.fase === 'terminada' ? c.tiemposVuelta.at(-1) : c.tiempo - c.inicioVuelta));
      poner(r.mejor, c.tiemposVuelta.length ? formatearTiempo(Math.min(...c.tiemposVuelta)) : '—');
      poner(r.control, c.control === c.puertas.length - 1 ? t.meta : (c.control + 1) + '/' + (c.puertas.length - 1));
      const kmh = Math.abs(j.estado.velocidad) * 3.6;
      const limite = (j.limiteHud ?? CONFIG.conduccion.velocidadMaxima) * 3.6;
      const fraccion = Math.min(1, kmh / r.maximo);
      poner(r.velocidad, Math.round(kmh));
      r.ultimaMarcha = marchaAutomatica(j.estado.velocidad, r.ultimaMarcha, CONFIG.conduccion.velocidadMaxima);
      poner(r.marcha, r.ultimaMarcha);
      r.aguja.setAttribute('transform', `rotate(${angulo(kmh, r.maximo)} 100 100)`);
      r.arco.setAttribute('stroke-dasharray', `${fraccion * 100} 100`);
      if (r.ultimoLimite !== limite) {
        r.zonaRoja.setAttribute('d', arco(angulo(limite * .90, r.maximo), angulo(limite, r.maximo), 96));
        r.ultimoLimite = limite;
      }
      const calor = Math.min(1, Math.max(0, (kmh / limite - .85) / .15));
      r.dial.style.setProperty('--calor', Math.round(calor * 100) + '%');
      if (!contenedor.hidden) mapa?.pintar(r.ctx, j, jugadores);
      poner(
        r.efecto,
        j.nitro.restante > 0
          ? 'NITRO · ' + j.nitro.restante.toFixed(1) + ' s'
          : j.cesped > 0
            ? t.cesped
            : t.asfalto,
      );
      r.nitro.style.width =
        Math.min(100, (j.nitro.restante / Math.max(0.001, j.nitro.config.duracion)) * 100) + '%';
      r.recolocar.classList.toggle('control-pendiente', c.controlOmitido);
      const aviso = j.aturdimiento > 0
        ? t.golpeRoca + ' · ' + j.aturdimiento.toFixed(1) + ' s'
        : j.penalizacionSalida > 0
        ? t.salidaAnticipada + ' · ' + j.penalizacionSalida.toFixed(1) + ' s'
        : j.recuperando > 0
          ? t.recuperando + ' ' + j.recuperando.toFixed(1) + ' s'
          : c.controlOmitido ? t.omitido
          : j.cesped >= .5 ? t.volverAsfalto
          : j.derrape > 0
            ? t.derrape
            : j.malSentido
              ? t.sentido
              : '';
      poner(r.aviso, aviso);
      r.aviso.hidden = !aviso;
    });
  }
  return {
    traducir,
    crearHuds,
    pintar,
    get t() {
      return TEXTOS[idioma];
    },
  };
}

export function crearMinimapa(circuito, puertas, nombresAsfalto) {
  const base = document.createElement('canvas');
  base.width = base.height = 1024;
  const fondo = base.getContext('2d'),
    triangulos = [],
    caja = new THREE.Box3(),
    v = new THREE.Vector3();
  const nombres = new Set(nombresAsfalto.map((n) => THREE.PropertyBinding.sanitizeNodeName(n)));
  circuito.traverse((m) => {
    if (!m.isMesh) return;
    let apto = false;
    for (let p = m; p; p = p.parent) {
      if (nombres.has(THREE.PropertyBinding.sanitizeNodeName(p.name))) apto = true;
      if (p === circuito) break;
    }
    if (!apto) return;
    const a = m.geometry.attributes.position,
      ind = m.geometry.index,
      n = ind ? ind.count : a.count;
    for (let i = 0; i < n; i += 3) {
      const puntos = [];
      for (let k = 0; k < 3; k++) {
        v.fromBufferAttribute(a, ind ? ind.getX(i + k) : i + k).applyMatrix4(m.matrixWorld);
        caja.expandByPoint(v);
        puntos.push({ x: v.x, z: v.z });
      }
      triangulos.push(puntos);
    }
  });
  // Rasterizar la carretera una sola vez, también para el segundo jugador.
  const centro = caja.getCenter(new THREE.Vector3());
  const escala = 980 / Math.max(1, caja.max.x - caja.min.x, caja.max.z - caja.min.z);
  const px = x => 512 + (x - centro.x) * escala;
  const py = z => 512 + (z - centro.z) * escala;
  fondo.fillStyle = fondo.strokeStyle = '#a7e9ee';
  fondo.lineWidth = 0.65;
  for (const [a, b, c] of triangulos) {
    fondo.beginPath();
    fondo.moveTo(px(a.x), py(a.z));
    fondo.lineTo(px(b.x), py(b.z));
    fondo.lineTo(px(c.x), py(c.z));
    fondo.closePath();
    fondo.fill();
    fondo.stroke();
  }
  return {
    pintar(ctx, piloto, jugadores) {
      const ancho = ctx.canvas.width, mitad = ancho / 2, zoom = ancho / 130;
      ctx.clearRect(0, 0, ancho, ancho);
      ctx.save();
      ctx.translate(mitad, mitad);
      ctx.rotate(piloto.estado.rumbo);
      ctx.scale(zoom, zoom);
      const { x, z } = piloto.estado;
      ctx.drawImage(base, -px(x) / escala, -py(z) / escala, base.width / escala, base.height / escala);
      const puerta = puertas[piloto.carrera.control];
      ctx.beginPath();
      ctx.arc(puerta.x - x, puerta.z - z, 2.6, 0, Math.PI * 2);
      ctx.lineWidth = 1.3;
      ctx.strokeStyle = '#ffe244';
      ctx.stroke();
      for (const j of jugadores) {
        if (j === piloto) continue;
        ctx.beginPath();
        ctx.arc(j.estado.x - x, j.estado.z - z, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = j.color;
        ctx.fill();
        ctx.lineWidth = .8;
        ctx.strokeStyle = '#091b29';
        ctx.stroke();
      }
      ctx.restore();
      ctx.save();
      ctx.translate(mitad, mitad);
      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.lineTo(10, 10);
      ctx.lineTo(0, 6);
      ctx.lineTo(-10, 10);
      ctx.closePath();
      ctx.fillStyle = '#fff';
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#102335';
      ctx.stroke();
      ctx.fill();
      ctx.restore();
    },
  };
}
