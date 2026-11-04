import * as THREE from 'three';
import { formatearTiempo } from './carrera.js';

export const TEXTOS = {
  es: {
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
    calidad: 'Calidad',
    baja: 'Baja',
    media: 'Media',
    alta: 'Alta',
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
    preparate: 'PREPÁRATE',
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
    calidad: 'Qualitat',
    baja: 'Baixa',
    media: 'Mitjana',
    alta: 'Alta',
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
    preparate: 'PREPARA’T',
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
    calidad: 'Quality',
    baja: 'Low',
    media: 'Medium',
    alta: 'High',
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
    preparate: 'GET READY',
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
  function crearHuds(jugadores, pantallas) {
    const root = document.getElementById('huds');
    root.innerHTML = '';
    referencias = [];
    jugadores.forEach((j, i) => {
      const h = document.createElement('section');
      h.className = 'jugador-hud';
      h.style.setProperty('--jugador', j.color);
      h.dataset.id = j.id;
      h.innerHTML =
        '<div class="hud-top"><b class="hud-nombre">J' +
        j.id +
        '</b><div class="hud-datos"><div><small data-i18n="vuelta"></small><strong data-ref="vuelta"></strong></div><div><small data-i18n="tiempo"></small><strong data-ref="tiempo"></strong></div><div><small data-i18n="control"></small><strong data-ref="control"></strong></div></div></div><div class="hud-abajo"><div class="hud-velocidad"><strong data-ref="velocidad">0</strong><small>km/h</small></div><div class="hud-efecto"><span data-ref="efecto"></span><div class="barra-nitro"><span data-ref="nitro"></span></div><button class="recolocar" data-jugador="' +
        j.id +
        '" type="button"><span data-i18n="recolocar"></span> · ' +
        (i === 0 ? 'F' : 'Enter') +
        '</button></div></div><p class="hud-aviso" data-ref="aviso" hidden></p>';
      const p = pantallas[i];
      Object.assign(h.style, {
        left: p.left + 'px',
        top: p.top + 'px',
        width: p.w + 'px',
        height: p.h + 'px',
      });
      root.append(h);
      referencias.push(
        Object.fromEntries([...h.querySelectorAll('[data-ref]')].map((e) => [e.dataset.ref, e])),
      );
    });
    traducir(idioma);
  }
  function pintar(jugadores) {
    const t = TEXTOS[idioma];
    jugadores.forEach((j, i) => {
      const r = referencias[i];
      if (!r) return;
      poner(
        r.vuelta,
        Math.min(j.carrera.vueltasCompletadas + 1, j.carrera.vueltas) + '/' + j.carrera.vueltas,
      );
      poner(r.tiempo, formatearTiempo(j.carrera.tiempo));
      poner(
        r.control,
        j.carrera.control === j.carrera.puertas.length - 1
          ? t.meta
          : j.carrera.control + 1 + '/' + (j.carrera.puertas.length - 1),
      );
      poner(r.velocidad, Math.round(Math.abs(j.estado.velocidad) * 3.6));
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
      const aviso =
        j.recuperando > 0
          ? t.recuperando + ' ' + j.recuperando.toFixed(1) + ' s'
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

export function crearMinimapa(canvas, circuito, puertas, nombresAsfalto) {
  const ctx = canvas.getContext('2d'),
    base = document.createElement('canvas');
  base.width = canvas.width;
  base.height = canvas.height;
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
  const escala = Math.min(
    (canvas.width - 25) / (caja.max.x - caja.min.x),
    (canvas.height - 25) / (caja.max.z - caja.min.z),
  );
  const centro = caja.getCenter(new THREE.Vector3());
  const proyectar = (p) => ({
    x: canvas.width / 2 + (p.x - centro.x) * escala,
    y: canvas.height / 2 + (p.z - centro.z) * escala,
  });
  fondo.fillStyle = '#587282';
  triangulos.forEach((t) => {
    fondo.beginPath();
    t.forEach((p, i) => {
      const q = proyectar(p);
      if (i === 0) fondo.moveTo(q.x, q.y);
      else fondo.lineTo(q.x, q.y);
    });
    fondo.closePath();
    fondo.fill();
  });
  const meta = proyectar(puertas.at(-1));
  fondo.fillStyle = '#fff';
  fondo.fillRect(meta.x - 2, meta.y - 2, 4, 4);
  return {
    pintar(jugadores) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(base, 0, 0);
      jugadores.forEach((j) => {
        const control = proyectar(puertas[j.carrera.control]);
        ctx.strokeStyle = j.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(control.x, control.y, 4, 0, Math.PI * 2);
        ctx.stroke();
        const p = proyectar(j.estado);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(-j.estado.rumbo);
        ctx.fillStyle = j.color;
        ctx.beginPath();
        ctx.moveTo(0, -5);
        ctx.lineTo(4, 4);
        ctx.lineTo(-4, 4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });
    },
  };
}
