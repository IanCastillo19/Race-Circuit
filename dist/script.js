/* Race Circuit — HTML, CSS y JavaScript sin frameworks.
 * Edita los textos de cada idioma aquí. Las mecánicas descritas son propuestas.
 */
(() => {
  'use strict';

  const translations = {
    es: {
      pageTitle: 'Race Circuit — Un mundo en cada curva', ribbonLaps: '3 VUELTAS', ribbonFun: 'BUENOS RATOS',
      metaDescription: 'Race Circuit: un proyecto de carreras arcade con mundos por explorar. Descubre la idea, las mecánicas previstas y al equipo.',
      skip: 'Saltar al contenido', navLabel: 'Navegación principal', navGame: 'El juego', navWorlds: 'Los mundos', navTeam: 'El equipo', language: 'Idioma', openMenu: 'Abrir menú', closeMenu: 'Cerrar menú',
      heroEyebrow: 'PROYECTO ARCADE EN DESARROLLO', heroTitle1: 'Un mundo nuevo', heroTitle2: 'en cada curva.',
      heroDescription: 'Tres vueltas, objetos en la pista y mucho por explorar. Estamos creando un juego de carreras en el que cada escenario tendrá su propia personalidad.',
      discover: 'Descubre el juego', exploreWorlds: 'Explora los mundos', laps: 'vueltas', players: 'jugadores', manyWorlds: 'Mundos por imaginar', madeToHaveFun: 'HECHO PARA DIVERTIRSE', conceptLabel: 'ARTE CONCEPTUAL · NO ES UNA CAPTURA DEL JUEGO',
      gameEyebrow: 'LA IDEA DEL JUEGO', gameTitle: 'Una carrera sencilla.\nUn montón de posibilidades.',
      gameDescription: 'Sal desde la línea de salida, completa el circuito y cruza la meta después de tres vueltas. El reto está en controlar las curvas y aprovechar lo que encuentres por el camino.', plannedTag: 'Mecánicas previstas para el prototipo',
      rule1Title: 'Tres vueltas a la meta', rule1Text: 'Un circuito completo, tres veces. Mantente en la pista: salir al césped reducirá la velocidad.',
      rule2Title: 'Tu mejor tiempo', rule2Text: 'En el modo individual, el cronómetro marcará el reto: superar tu propia marca.',
      rule3Title: 'Un rival en la salida', rule3Text: 'Con dos jugadores, ganará quien termine primero las tres vueltas. Una animación anunciará al ganador.',
      worldEyebrow: 'UN CIRCUITO, DIFERENTES UNIVERSOS', worldTitle: '¿Dónde será la próxima carrera?', worldIntro: 'Estos son tres ambientes que imaginamos para el juego. Son propuestas visuales para explorar, no niveles terminados.', chooseWorld: 'Elige un escenario',
      world1Type: '01 / TROPICAL', world1Name: 'Costa Turbo', world1Short: 'Sol, palmeras y curvas junto al mar.', world1Description: 'Un circuito costero entre palmeras, agua turquesa y curvas llenas de color.',
      world2Type: '02 / NOCTURNO', world2Name: 'Ciudad Neón', world2Short: 'Una ciudad que ilumina cada curva.', world2Description: 'Una propuesta urbana con luces de colores, puentes y una pista que atraviesa la ciudad.',
      world3Type: '03 / MONTAÑA', world3Name: 'Cumbre Helada', world3Short: 'Aire fresco y carreteras entre montañas.', world3Description: 'Un paisaje de nieve, pinos y montañas para imaginar una carrera con vistas diferentes.',
      coastAlt: 'Concepto de dos coches arcade en un circuito tropical junto al mar', neonAlt: 'Concepto de dos coches arcade en una ciudad futurista con luces de neón', alpineAlt: 'Concepto de dos coches arcade en un circuito entre montañas nevadas',
      conceptShort: 'Concepto visual', conceptNote: 'Imágenes conceptuales creadas con IA para comunicar la dirección artística. Los modelos y escenarios del juego se construirán en Blender.',
      objectsEyebrow: 'ALGO MÁS QUE ACELERAR', objectsTitle: 'La pista también juega.', objectsIntro: 'Pensamos en objetos fáciles de reconocer que hagan cada vuelta diferente. Estos efectos todavía son propuestas de diseño.',
      obstacle: 'OBSTÁCULO', boost: 'IMPULSO', bananaName: 'Plátano', bananaText: 'Podría hacer resbalar al coche y dificultar el control durante un momento.', rockName: 'Roca', rockText: 'Un obstáculo que reduciría la velocidad al chocar. Mejor encontrar otra trayectoria.', turboName: 'Turbo', turboText: 'Un aumento temporal de velocidad para darle un poco más de emoción a la carrera.',
      controlsEyebrow: 'CÓMO SE JUGARÁ', controlsTitle: 'Al volante,\nsin complicaciones.', controlsDescription: 'Acelera progresivamente, frena hasta detenerte y sigue pulsando para dar marcha atrás. La cámara seguirá al coche desde detrás para ver lo que viene.',
      cameraText: 'Cámara prevista: gran angular, a unos 4 metros del coche y con un ángulo aproximado de 60°.', chooseMode: 'Explorar los controles', soloMode: '1 jugador', duoMode: '2 jugadores', arrowLabel: 'FLECHAS', accelerate: 'Acelerar', brake: 'Frenar / marcha atrás', turn: 'Girar',
      soloDescription: 'Contra tu marca personal. Controles previstos: WASD o las flechas.', duoDescription: 'Una carrera entre dos. Propuesta: J1 con WASD y J2 con las flechas.', wasdP1: 'J1 / WASD', arrowsP2: 'J2 / FLECHAS', controlNote: 'Esquema de controles propuesto. La experiencia de dos jugadores está pensada para compartir teclado.',
      teamEyebrow: 'DETRÁS DE LA LÍNEA DE SALIDA', teamTitle: 'Tres compañeros.\nUna idea en marcha.', teamIntro: 'Somos Ian, Eric y Wassim. Estamos dando forma a Race Circuit, desde esta web hasta los primeros prototipos de un coche y un circuito.', ianRole: 'Web del proyecto', teamRole: 'Equipo del proyecto',
      developmentTitle: 'Estamos en la fase de prototipo.', developmentText: 'Creamos los modelos en Blender y queremos darles vida con Three.js. El siguiente paso será probar la conducción y construir la primera versión jugable.',
      playEyebrow: 'LA PRÓXIMA PARADA', playTitle: 'Nos vemos en\nla línea de salida.', playDescription: 'El juego sigue en desarrollo. Aquí estará el acceso a la futura versión jugable de Race Circuit.', playNow: 'Jugar ahora', playNote: 'Versión jugable próximamente · Página del juego pendiente',
      footerText: 'Un proyecto de Ian Castillo, Eric Abidal y Wassim Akka.', backTop: 'Volver arriba'
    },
    ca: {
      pageTitle: 'Race Circuit — Un món a cada revolt', ribbonLaps: '3 VOLTES', ribbonFun: 'BONS MOMENTS',
      metaDescription: 'Race Circuit: un projecte de curses arcade amb mons per explorar. Descobreix la idea, les mecàniques previstes i l’equip.',
      skip: 'Saltar al contingut', navLabel: 'Navegació principal', navGame: 'El joc', navWorlds: 'Els mons', navTeam: 'L’equip', language: 'Idioma', openMenu: 'Obrir menú', closeMenu: 'Tancar menú',
      heroEyebrow: 'PROJECTE ARCADE EN DESENVOLUPAMENT', heroTitle1: 'Un món nou', heroTitle2: 'a cada revolt.',
      heroDescription: 'Tres voltes, objectes a la pista i molt per explorar. Estem creant un joc de curses en què cada escenari tindrà la seva pròpia personalitat.',
      discover: 'Descobreix el joc', exploreWorlds: 'Explora els mons', laps: 'voltes', players: 'jugadors', manyWorlds: 'Mons per imaginar', madeToHaveFun: 'FET PER DIVERTIR-SE', conceptLabel: 'ART CONCEPTUAL · NO ÉS UNA CAPTURA DEL JOC',
      gameEyebrow: 'LA IDEA DEL JOC', gameTitle: 'Una cursa senzilla.\nUn munt de possibilitats.',
      gameDescription: 'Surt des de la línia de sortida, completa el circuit i travessa la meta després de tres voltes. El repte és controlar els revolts i aprofitar el que trobis pel camí.', plannedTag: 'Mecàniques previstes per al prototip',
      rule1Title: 'Tres voltes fins a la meta', rule1Text: 'Un circuit complet, tres vegades. Mantén-te a la pista: sortir a la gespa reduirà la velocitat.',
      rule2Title: 'El teu millor temps', rule2Text: 'En el mode individual, el cronòmetre marcarà el repte: superar la teva pròpia marca.',
      rule3Title: 'Un rival a la sortida', rule3Text: 'Amb dos jugadors, guanyarà qui acabi primer les tres voltes. Una animació anunciarà el guanyador.',
      worldEyebrow: 'UN CIRCUIT, DIFERENTS UNIVERSOS', worldTitle: 'On serà la pròxima cursa?', worldIntro: 'Aquests són tres ambients que imaginem per al joc. Són propostes visuals per explorar, no nivells acabats.', chooseWorld: 'Tria un escenari',
      world1Type: '01 / TROPICAL', world1Name: 'Costa Turbo', world1Short: 'Sol, palmeres i revolts vora el mar.', world1Description: 'Un circuit costaner entre palmeres, aigua turquesa i revolts plens de color.',
      world2Type: '02 / NOCTURN', world2Name: 'Ciutat Neó', world2Short: 'Una ciutat que il·lumina cada revolt.', world2Description: 'Una proposta urbana amb llums de colors, ponts i una pista que travessa la ciutat.',
      world3Type: '03 / MUNTANYA', world3Name: 'Cim Gelat', world3Short: 'Aire fresc i carreteres entre muntanyes.', world3Description: 'Un paisatge de neu, pins i muntanyes per imaginar una cursa amb vistes diferents.',
      coastAlt: 'Concepte de dos cotxes arcade en un circuit tropical vora el mar', neonAlt: 'Concepte de dos cotxes arcade en una ciutat futurista amb llums de neó', alpineAlt: 'Concepte de dos cotxes arcade en un circuit entre muntanyes nevades',
      conceptShort: 'Concepte visual', conceptNote: 'Imatges conceptuals creades amb IA per comunicar la direcció artística. Els models i escenaris del joc es construiran a Blender.',
      objectsEyebrow: 'ALGUNA COSA MÉS QUE ACCELERAR', objectsTitle: 'La pista també juga.', objectsIntro: 'Pensem en objectes fàcils de reconèixer que facin cada volta diferent. Aquests efectes encara són propostes de disseny.',
      obstacle: 'OBSTACLE', boost: 'IMPULS', bananaName: 'Plàtan', bananaText: 'Podria fer relliscar el cotxe i dificultar-ne el control durant un moment.', rockName: 'Roca', rockText: 'Un obstacle que reduiria la velocitat en xocar-hi. Millor trobar una altra trajectòria.', turboName: 'Turbo', turboText: 'Un augment temporal de velocitat per donar una mica més d’emoció a la cursa.',
      controlsEyebrow: 'COM S’HI JUGARÀ', controlsTitle: 'Al volant,\nsense complicacions.', controlsDescription: 'Accelera progressivament, frena fins a aturar-te i continua prement per fer marxa enrere. La càmera seguirà el cotxe des de darrere per veure el que ve.',
      cameraText: 'Càmera prevista: gran angular, a uns 4 metres del cotxe i amb un angle aproximat de 60°.', chooseMode: 'Explorar els controls', soloMode: '1 jugador', duoMode: '2 jugadors', arrowLabel: 'FLETXES', accelerate: 'Accelerar', brake: 'Frenar / marxa enrere', turn: 'Girar',
      soloDescription: 'Contra la teva marca personal. Controls previstos: WASD o les fletxes.', duoDescription: 'Una cursa entre dos. Proposta: J1 amb WASD i J2 amb les fletxes.', wasdP1: 'J1 / WASD', arrowsP2: 'J2 / FLETXES', controlNote: 'Esquema de controls proposat. L’experiència de dos jugadors està pensada per compartir teclat.',
      teamEyebrow: 'DARRERE DE LA LÍNIA DE SORTIDA', teamTitle: 'Tres companys.\nUna idea en marxa.', teamIntro: 'Som l’Ian, l’Eric i el Wassim. Estem donant forma a Race Circuit, des d’aquesta web fins als primers prototips d’un cotxe i un circuit.', ianRole: 'Web del projecte', teamRole: 'Equip del projecte',
      developmentTitle: 'Som a la fase de prototip.', developmentText: 'Creem els models a Blender i volem donar-los vida amb Three.js. El següent pas serà provar la conducció i construir la primera versió jugable.',
      playEyebrow: 'LA PRÒXIMA PARADA', playTitle: 'Ens veiem a\nla línia de sortida.', playDescription: 'El joc continua en desenvolupament. Aquí hi haurà l’accés a la futura versió jugable de Race Circuit.', playNow: 'Jugar ara', playNote: 'Versió jugable pròximament · Pàgina del joc pendent',
      footerText: 'Un projecte d’Ian Castillo, Eric Abidal i Wassim Akka.', backTop: 'Tornar amunt'
    },
    en: {
      pageTitle: 'Race Circuit — A world around every corner', ribbonLaps: '3 LAPS', ribbonFun: 'GOOD TIMES',
      metaDescription: 'Race Circuit: an arcade racing project with worlds to explore. Discover the idea, the planned mechanics and the team.',
      skip: 'Skip to content', navLabel: 'Main navigation', navGame: 'The game', navWorlds: 'The worlds', navTeam: 'The team', language: 'Language', openMenu: 'Open menu', closeMenu: 'Close menu',
      heroEyebrow: 'ARCADE PROJECT IN DEVELOPMENT', heroTitle1: 'A new world', heroTitle2: 'around every corner.',
      heroDescription: 'Three laps, objects on the track and plenty to explore. We’re creating a racing game where every setting will have a personality of its own.',
      discover: 'Discover the game', exploreWorlds: 'Explore the worlds', laps: 'laps', players: 'players', manyWorlds: 'Worlds to imagine', madeToHaveFun: 'BUILT FOR GOOD TIMES', conceptLabel: 'CONCEPT ART · NOT A GAME SCREENSHOT',
      gameEyebrow: 'THE GAME IDEA', gameTitle: 'A simple race.\nSo many possibilities.',
      gameDescription: 'Start at the grid, complete the circuit and cross the finish line after three laps. The challenge is to handle the corners and make the most of what you find along the way.', plannedTag: 'Planned mechanics for the prototype',
      rule1Title: 'Three laps to the finish', rule1Text: 'One full circuit, three times. Stay on the track: driving onto the grass will slow you down.',
      rule2Title: 'Your personal best', rule2Text: 'In solo mode, the stopwatch will set the challenge: beating your own time.',
      rule3Title: 'A rival on the grid', rule3Text: 'With two players, the first to finish all three laps will win. An animation will announce the winner.',
      worldEyebrow: 'ONE CIRCUIT, DIFFERENT UNIVERSES', worldTitle: 'Where’s the next race?', worldIntro: 'These are three settings we’re imagining for the game. They’re visual ideas to explore, not finished levels.', chooseWorld: 'Choose a setting',
      world1Type: '01 / TROPICAL', world1Name: 'Turbo Coast', world1Short: 'Sun, palms and corners by the sea.', world1Description: 'A coastal circuit surrounded by palm trees, turquoise water and colourful corners.',
      world2Type: '02 / NIGHT', world2Name: 'Neon City', world2Short: 'A city that lights up every corner.', world2Description: 'An urban concept with colourful lights, bridges and a track winding through the city.',
      world3Type: '03 / MOUNTAIN', world3Name: 'Frozen Peak', world3Short: 'Fresh air and mountain roads.', world3Description: 'Snow, pine trees and mountains for imagining a race with a different view.',
      coastAlt: 'Concept of two arcade cars on a tropical circuit beside the sea', neonAlt: 'Concept of two arcade cars in a futuristic city with neon lights', alpineAlt: 'Concept of two arcade cars racing between snowy mountains',
      conceptShort: 'Visual concept', conceptNote: 'AI-generated concept images showing the artistic direction. The game’s models and environments will be built in Blender.',
      objectsEyebrow: 'MORE THAN JUST ACCELERATING', objectsTitle: 'The track plays a part, too.', objectsIntro: 'We’re thinking of easy-to-recognise objects that make every lap different. These effects are still design proposals.',
      obstacle: 'OBSTACLE', boost: 'BOOST', bananaName: 'Banana', bananaText: 'It could make the car slip and become harder to control for a moment.', rockName: 'Rock', rockText: 'An obstacle that would slow the car down on impact. Better find another line.', turboName: 'Turbo', turboText: 'A temporary speed boost to make the race a little more exciting.',
      controlsEyebrow: 'HOW YOU’LL PLAY', controlsTitle: 'Behind the wheel.\nKeeping it simple.', controlsDescription: 'Build up speed, brake to a stop and keep holding the key to reverse. A camera will follow the car from behind so you can see what’s ahead.',
      cameraText: 'Planned camera: a wide-angle view, about 4 metres behind the car and at an angle of roughly 60°.', chooseMode: 'Explore the controls', soloMode: '1 player', duoMode: '2 players', arrowLabel: 'ARROW KEYS', accelerate: 'Accelerate', brake: 'Brake / reverse', turn: 'Steer',
      soloDescription: 'Race against your personal best. Planned controls: WASD or arrow keys.', duoDescription: 'A race for two. Proposed controls: P1 uses WASD and P2 uses the arrow keys.', wasdP1: 'P1 / WASD', arrowsP2: 'P2 / ARROWS', controlNote: 'Proposed controls. The two-player experience is designed around a shared keyboard.',
      teamEyebrow: 'BEHIND THE STARTING LINE', teamTitle: 'Three teammates.\nAn idea in motion.', teamIntro: 'We’re Ian, Eric and Wassim. We’re bringing Race Circuit to life, from this website to the first car and circuit prototypes.', ianRole: 'Project website', teamRole: 'Project team',
      developmentTitle: 'We’re at the prototype stage.', developmentText: 'We’re creating the models in Blender and want to bring them to life with Three.js. Next comes testing the driving mechanics and building the first playable version.',
      playEyebrow: 'THE NEXT STOP', playTitle: 'See you at\nthe starting line.', playDescription: 'The game is still in development. This will be the way into the future playable version of Race Circuit.', playNow: 'Play now', playNote: 'Playable version coming soon · Game page not yet created',
      footerText: 'A project by Ian Castillo, Eric Abidal and Wassim Akka.', backTop: 'Back to top'
    }
  };

  const worlds = {
    coast: { number: '01', nameKey: 'world1Name', descriptionKey: 'world1Description', altKey: 'coastAlt', image: 'assets/coast.webp' },
    neon: { number: '02', nameKey: 'world2Name', descriptionKey: 'world2Description', altKey: 'neonAlt', image: 'assets/neon.webp' },
    alpine: { number: '03', nameKey: 'world3Name', descriptionKey: 'world3Description', altKey: 'alpineAlt', image: 'assets/alpine.webp' }
  };
  const languageButtons = [...document.querySelectorAll('[data-language]')];
  const worldButtons = [...document.querySelectorAll('[data-world]')];
  const modeButtons = [...document.querySelectorAll('[data-mode]')];
  const menuButton = document.getElementById('menu-toggle');
  const navigation = document.getElementById('navigation');
  const controlBoard = document.querySelector('.control-board');
  const ribbon = document.querySelector('.track-ribbon');
  const ribbonTrack = document.querySelector('.ribbon-track');
  const sceneLayers = [...document.querySelectorAll('[data-scene]')];
  const sceneMarkers = [...document.querySelectorAll('[data-background-scene]')];
  // Velocidad constante en píxeles/segundo: baja el valor para ir más despacio.
  const RIBBON_SPEED = 32;
  let ribbonResizeTimer;
  let sceneFramePending = false;
  let activeLanguage = 'es';
  let activeWorld = 'coast';
  let activeMode = 'solo';

  // Storage can be unavailable in private browsing or when opening a local file.
  function storedLanguage() {
    try { return window.localStorage.getItem('race-circuit-language'); }
    catch { return null; }
  }
  function saveLanguage(language) {
    try { window.localStorage.setItem('race-circuit-language', language); }
    catch { /* The page works even without browser storage. */ }
  }
  function setText(element, value) {
    if (!element) return;
    const lines = value.split('\n');
    const fragment = document.createDocumentFragment();
    lines.forEach((line, index) => {
      if (index) fragment.appendChild(document.createElement('br'));
      fragment.appendChild(document.createTextNode(line));
    });
    element.replaceChildren(fragment);
  }
  function createRibbonUnit() {
    const unit = document.createElement('div');
    unit.className = 'ribbon-unit';
    const copy = translations[activeLanguage];
    const words = [
      ['RACE CIRCUIT', null], ['✦', null], [copy.ribbonLaps, 'ribbonLaps'],
      ['✦', null], [copy.ribbonFun, 'ribbonFun'], ['✦', null]
    ];
    words.forEach(([text, key]) => {
      const span = document.createElement('span');
      span.textContent = text;
      if (key) span.dataset.i18n = key;
      unit.appendChild(span);
    });
    return unit;
  }
  function renderRibbon() {
    if (!ribbonTrack || !ribbon) return;
    ribbonTrack.style.animation = 'none';
    const firstGroup = document.createElement('div');
    firstGroup.className = 'ribbon-group';
    const firstUnit = createRibbonUnit();
    firstGroup.appendChild(firstUnit);
    ribbonTrack.replaceChildren(firstGroup);
    const unitWidth = firstUnit.getBoundingClientRect().width;
    if (unitWidth <= 0) return;
    // Cada copia cubre al menos la pantalla y una unidad extra.
    const repetitions = Math.max(2, Math.ceil(ribbon.clientWidth / unitWidth) + 1);
    for (let i = 1; i < repetitions; i++) firstGroup.appendChild(createRibbonUnit());
    ribbonTrack.appendChild(firstGroup.cloneNode(true));
    const groupWidth = firstGroup.getBoundingClientRect().width;
    ribbonTrack.style.setProperty('--ribbon-duration', (groupWidth / RIBBON_SPEED).toFixed(2) + 's');
    // Reinicia después de medir: las dos copias siempre tienen la misma longitud.
    void ribbonTrack.offsetWidth;
    ribbonTrack.style.animation = '';
  }
  function updateScene() {
    const activationLine = window.innerHeight * 0.43;
    let scene = 'coast';
    sceneMarkers.forEach(marker => {
      if (marker.getBoundingClientRect().top <= activationLine) scene = marker.dataset.backgroundScene;
    });
    if (document.body.dataset.background === scene) return;
    document.body.dataset.background = scene;
    sceneLayers.forEach(layer => layer.classList.toggle('is-visible', layer.dataset.scene === scene));
  }
  function queueSceneUpdate() {
    if (sceneFramePending) return;
    sceneFramePending = true;
    window.requestAnimationFrame(() => { updateScene(); sceneFramePending = false; });
  }
  function renderWorld() {
    const world = worlds[activeWorld];
    const copy = translations[activeLanguage];
    const image = document.getElementById('world-image');
    image.setAttribute('src', world.image);
    image.setAttribute('alt', copy[world.altKey]);
    setText(document.getElementById('world-name'), copy[world.nameKey]);
    setText(document.getElementById('world-description'), copy[world.descriptionKey]);
    setText(document.getElementById('world-index'), world.number);
    document.getElementById('world-panel').setAttribute('aria-labelledby', 'tab-' + activeWorld);
    worldButtons.forEach(button => {
      const selected = button.dataset.world === activeWorld;
      button.setAttribute('aria-selected', String(selected));
      button.setAttribute('tabindex', selected ? '0' : '-1');
      button.classList.toggle('is-active', selected);
    });
  }
  function renderMode() {
    const copy = translations[activeLanguage];
    const duo = activeMode === 'duo';
    controlBoard.classList.toggle('is-duo', duo);
    setText(document.getElementById('mode-description'), copy[duo ? 'duoDescription' : 'soloDescription']);
    setText(document.getElementById('keyboard-label'), duo ? copy.wasdP1 : 'WASD');
    setText(document.querySelector('#arrow-group .keyboard-label'), duo ? copy.arrowsP2 : copy.arrowLabel);
    modeButtons.forEach(button => {
      const selected = button.dataset.mode === activeMode;
      button.setAttribute('aria-pressed', String(selected));
      button.classList.toggle('is-active', selected);
    });
  }
  function setMenu(open, restoreFocus = false) {
    navigation.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', translations[activeLanguage][open ? 'closeMenu' : 'openMenu']);
    if (!open && restoreFocus) menuButton.focus();
  }
  function setLanguage(language) {
    if (!Object.hasOwn(translations, language)) return;
    activeLanguage = language;
    const copy = translations[language];
    document.documentElement.lang = language;
    document.title = copy.pageTitle;
    document.querySelector('meta[name="description"]').setAttribute('content', copy.metaDescription);
    document.querySelectorAll('[data-i18n]').forEach(element => setText(element, copy[element.dataset.i18n]));
    document.querySelectorAll('[data-i18n-alt]').forEach(element => element.setAttribute('alt', copy[element.dataset.i18nAlt]));
    document.querySelectorAll('[data-i18n-aria]').forEach(element => element.setAttribute('aria-label', copy[element.dataset.i18nAria]));
    languageButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
    document.getElementById('play-link').setAttribute('href', 'jugar.html?lang=' + language);
    saveLanguage(language);
    renderWorld();
    renderMode();
    setMenu(navigation.classList.contains('is-open'));
    renderRibbon();
    queueSceneUpdate();
  }

  languageButtons.forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.language)));
  worldButtons.forEach((button, index) => {
    button.addEventListener('click', () => { activeWorld = button.dataset.world; renderWorld(); });
    button.addEventListener('keydown', event => {
      let nextIndex;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % worldButtons.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + worldButtons.length) % worldButtons.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = worldButtons.length - 1;
      else return;
      event.preventDefault();
      activeWorld = worldButtons[nextIndex].dataset.world;
      renderWorld();
      worldButtons[nextIndex].focus();
    });
  });
  modeButtons.forEach(button => button.addEventListener('click', () => { activeMode = button.dataset.mode; renderMode(); }));
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false, navigation.classList.contains('is-open')); });
  document.addEventListener('click', event => {
    if (!navigation.contains(event.target) && !menuButton.contains(event.target)) setMenu(false);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 600) setMenu(false);
    window.clearTimeout(ribbonResizeTimer);
    ribbonResizeTimer = window.setTimeout(renderRibbon, 160);
    queueSceneUpdate();
  });
  window.addEventListener('scroll', queueSceneUpdate, { passive: true });
  window.addEventListener('load', queueSceneUpdate);
  if (document.fonts) {
    document.fonts.ready.then(() => { renderRibbon(); queueSceneUpdate(); });
  }

  const requestedLanguage = new URLSearchParams(window.location.search).get('lang');
  const initialLanguage = requestedLanguage || storedLanguage() || 'es';
  setLanguage(Object.hasOwn(translations, initialLanguage) ? initialLanguage : 'es');
})();
