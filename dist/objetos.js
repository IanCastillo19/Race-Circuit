import * as THREE from 'three';

function rocaProvisional() {
  const m = new THREE.Mesh(
    new THREE.DodecahedronGeometry(1, 0),
    new THREE.MeshStandardMaterial({ color: 0x697780, roughness: 1 }),
  );
  m.scale.set(1, 0.8, 0.85);
  m.rotation.set(0.2, 0.5, 0.1);
  return m;
}
function platanoProvisional() {
  const g = new THREE.Group(),
    amarillo = new THREE.MeshStandardMaterial({ color: 0xffda23, roughness: 0.6 });
  for (let i = 0; i < 3; i++) {
    const angulo = (i * Math.PI * 2) / 3;
    const puntos = [
      new THREE.Vector3(0, 0.65, 0),
      new THREE.Vector3(Math.cos(angulo) * 0.18, 0.4, Math.sin(angulo) * 0.18),
      new THREE.Vector3(Math.cos(angulo) * 0.55, 0.12, Math.sin(angulo) * 0.55),
      new THREE.Vector3(Math.cos(angulo) * 0.65, 0.28, Math.sin(angulo) * 0.65),
    ];
    const curva = new THREE.CatmullRomCurve3(puntos);
    g.add(new THREE.Mesh(new THREE.TubeGeometry(curva, 8, 0.12, 5, false), amarillo));
  }
  const tallo = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.12, 0.2, 6),
    new THREE.MeshStandardMaterial({ color: 0x735a26 }),
  );
  tallo.position.y = 0.72;
  g.add(tallo);
  return g;
}
function ajustarModelo(modelo, diametro) {
  const caja = new THREE.Box3().setFromObject(modelo, true),
    size = caja.getSize(new THREE.Vector3());
  if (caja.isEmpty()) throw new Error('Modelo vacío');
  const grupo = new THREE.Group();
  grupo.add(modelo);
  grupo.scale.setScalar(diametro / Math.max(size.x, size.z, 0.01));
  grupo.updateWorldMatrix(true, true);
  caja.setFromObject(grupo, true);
  const c = caja.getCenter(new THREE.Vector3());
  const raiz = new THREE.Group();
  raiz.add(grupo);
  grupo.position.sub(new THREE.Vector3(c.x, caja.min.y, c.z));
  return raiz;
}
export async function crearObjetos(loader, circuito, terreno, escena, ajustes) {
  const grupo = new THREE.Group();
  grupo.name = 'Obstaculos';
  escena.add(grupo);
  const avisos = [],
    rocas = [],
    platanos = [];
  const prototipos = { roca: rocaProvisional(), platano: platanoProvisional() };
  for (const tipo of ['roca', 'platano']) {
    const ruta = ajustes.modelos[tipo];
    if (!ruta) continue;
    try {
      prototipos[tipo] = (await loader.loadAsync(ruta)).scene;
    } catch (e) {
      avisos.push(tipo + ': ' + ruta + ' · ' + e.message);
    }
  }
  for (const [tipo, lista] of [
    ['roca', ajustes.rocas],
    ['platano', ajustes.platanos],
  ]) {
    for (const [i, p] of lista.entries()) {
      const centro = circuito.localToWorld(new THREE.Vector3(p.x, 0, p.z)),
        y = terreno.alturaEn(centro.x, centro.z);
      if (y === null || terreno.tipoEn(centro.x, centro.z) !== 'asfalto') {
        avisos.push(tipo + ' ' + (i + 1) + ': posición fuera del asfalto.');
        continue;
      }
      const modelo = ajustarModelo(prototipos[tipo].clone(true), p.radio * 2);
      modelo.position.set(centro.x, y + 0.02, centro.z);
      modelo.name = tipo + '_' + i;
      grupo.add(modelo);
      const objeto = { x: centro.x, z: centro.z, radio: p.radio, modelo, recarga: 0 };
      (tipo === 'roca' ? rocas : platanos).push(objeto);
    }
  }
  return {
    grupo,
    rocas,
    platanos,
    avisos,
    reiniciar() {
      platanos.forEach((p) => {
        p.recarga = 0;
        p.modelo.visible = true;
      });
    },
    actualizar(dt) {
      platanos.forEach((p) => {
        p.recarga = Math.max(0, p.recarga - dt);
        p.modelo.visible = p.recarga === 0;
      });
    },
  };
}

export function crearSenales(puertas, terreno, escena) {
  const grupo = new THREE.Group();
  grupo.name = 'Controles';
  escena.add(grupo);
  const materiales = [];
  puertas.slice(0, -1).forEach((p, i) => {
    const y = terreno.alturaEn(p.x, p.z);
    if (y === null) return;
    const material = new THREE.MeshBasicMaterial({ color: 0x3a99a6 }),
      g = new THREE.Group();
    g.position.set(p.x, y + 0.03, p.z);
    g.rotation.y = Math.atan2(p.nx, p.nz);
    for (const x of [-p.ancho / 2, p.ancho / 2]) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.6, 0.1), material);
      m.position.set(x, 1.3, 0);
      g.add(m);
    }
    const barra = new THREE.Mesh(new THREE.BoxGeometry(p.ancho, 0.1, 0.1), material);
    barra.position.y = 2.6;
    g.add(barra);
    g.add(
      new THREE.ArrowHelper(
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0.1, -1),
        2,
        0xffe336,
        0.8,
        0.6,
      ),
    );
    const canvas = document.createElement('canvas');
    canvas.width = 96;
    canvas.height = 96;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#091624';
    ctx.beginPath();
    ctx.arc(48, 48, 43, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#62deec';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.font = 'bold 51px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(i + 1), 48, 50);
    const etiqueta = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas), depthTest: false }),
    );
    etiqueta.position.y = 3.6;
    etiqueta.scale.set(1.7, 1.7, 1);
    g.add(etiqueta);
    grupo.add(g);
    materiales.push({ indice: i, material });
  });
  return {
    grupo,
    actualizar(jugadores) {
      materiales.forEach(({ indice, material }) =>
        material.color.setHex(
          jugadores.some((j) => j.carrera.control === indice)
            ? 0xffde45
            : jugadores.every((j) => j.carrera.control > indice)
              ? 0x40704f
              : 0x388795,
        ),
      );
    },
  };
}

export function crearAmbiente(escena, circuito) {
  const hemisferio = new THREE.HemisphereLight(0xffffff, 0x526c47, 2.2),
    sol = new THREE.DirectionalLight(0xfff4dd, 3);
  sol.position.set(-30, 55, 20);
  escena.add(hemisferio, sol);
  const colores = [],
    bordes = [];
  circuito.traverse((m) => {
    if (m.isMesh) {
      m.material = Array.isArray(m.material)
        ? m.material.map((x) => x.clone())
        : m.material.clone();
      for (const mat of Array.isArray(m.material) ? m.material : [m.material])
        if (mat.color)
          colores.push({ mat, color: mat.color.clone(), cesped: mat.name === 'Material.012' });
    }
  });
  circuito.traverse((m) => {
    if (
      m.isMesh &&
      (Array.isArray(m.material) ? m.material : [m.material]).some(
        (mat) => mat.name === 'Material.010',
      )
    ) {
      const linea = new THREE.LineSegments(
        new THREE.EdgesGeometry(m.geometry, 20),
        new THREE.LineBasicMaterial({ color: 0x38d6f2 }),
      );
      linea.position.y = 0.025;
      linea.visible = false;
      m.add(linea);
      bordes.push(linea);
    }
  });
  const fondo = new THREE.Group();
  fondo.name = 'DecoracionExterior';
  escena.add(fondo);
  for (let i = 0; i < 14; i++) {
    const a = (i * Math.PI * 2) / 14;
    const m = new THREE.Mesh(
      new THREE.ConeGeometry(25, 30 + (i % 4) * 8, 6),
      new THREE.MeshStandardMaterial({ color: 0x647d77, roughness: 1 }),
    );
    m.position.set(Math.cos(a) * 205, 8, -35 + Math.sin(a) * 170);
    fondo.add(m);
  }
  function cambiar(tema) {
    const noche = tema === 'neon',
      nieve = tema === 'alpino';
    const color = noche ? 0x11152c : nieve ? 0xb5d8ee : 0x84cbe6;
    escena.background = new THREE.Color(color);
    escena.fog = new THREE.FogExp2(color, noche ? 0.0028 : 0.0018);
    hemisferio.intensity = noche ? 1.8 : 2.2;
    sol.intensity = noche ? 2.6 : 3;
    sol.color.setHex(noche ? 0xb7d7ff : 0xfff4dd);
    colores.forEach(({ mat, color, cesped }) => {
      mat.color.copy(color);
      if (cesped) mat.color.setHex(noche ? 0x183944 : nieve ? 0xdbedf4 : 0x42834e);
      else if (mat.name === 'Material.010') {
        mat.color.setHex(noche ? 0x2f4666 : nieve ? 0x354555 : 0x303a4b);
        if ('roughness' in mat) mat.roughness = 0.95;
        if (mat.emissive) mat.emissive.setHex(noche ? 0x071329 : 0x000000);
      }
    });
    bordes.forEach((m) => {
      m.visible = noche;
    });
    fondo.children.forEach((m) =>
      m.material.color.setHex(noche ? 0x242c56 : nieve ? 0xa8becb : 0x658a72),
    );
  }
  cambiar('costa');
  return { cambiar };
}
