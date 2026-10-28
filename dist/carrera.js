// Coordenadas LOCALES del Circuito.glb actual. No cambia config.js.
// nx/nz indican hacia dónde se cruza cada puerta. ancho es su anchura en metros.
export const TRAZADO = {
  id: 'prototipo-controles-v1',
  vueltas: 3,
  cuentaAtras: 3,
  mostrarControles: true,
  salida: { posicion: [12, 0, 16.5], rumboGrados: -80 },
  controles: [
    { x: 75, z: 29, nx: 1, nz: 0.1, ancho: 12 },
    { x: 124, z: 7, nx: 0, nz: -1, ancho: 16 },
    { x: 65, z: -22, nx: -1, nz: -0.28, ancho: 12 },
    { x: 11, z: -48, nx: 0.05, nz: -1, ancho: 16 },
    { x: 32, z: -98, nx: -0.15, nz: -1, ancho: 14 },
    { x: -23, z: -117, nx: -1, nz: 0, ancho: 12 },
    { x: -66, z: -86, nx: 0, nz: 1, ancho: 16 },
    { x: -70, z: -45, nx: -0.3, nz: 1, ancho: 16 },
    { x: -105, z: -5, nx: -0.5, nz: 1, ancho: 16 },
    { x: -90, z: 28, nx: 1, nz: 0.4, ancho: 14 },
    { x: -40, z: 29, nx: 1, nz: -0.15, ancho: 12 },
  ],
  meta: { x: 23.7440033, z: 14.0849981, nx: 0.926, nz: 0.377, ancho: 18 },
};

export function crearCarrera(puertas, vueltas = 3, cuentaAtras = 3) {
  if (!Number.isInteger(vueltas) || vueltas < 1 || puertas.length < 2) throw new Error('Revisa las vueltas y los controles de carrera.');
  const normalizadas = puertas.map(p => {
    const largo = Math.hypot(p.nx, p.nz);
    if (![p.x,p.z,p.nx,p.nz,p.ancho].every(Number.isFinite) || largo < 0.001 || p.ancho <= 0) throw new Error('Puerta de control inválida.');
    return {...p, nx:p.nx/largo, nz:p.nz/largo};
  });
  return { puertas:normalizadas, vueltas, cuentaInicial:cuentaAtras, cuentaAtras,
    fase:'espera', tiempo:0, control:0, vueltasCompletadas:0, tiemposVuelta:[], inicioVuelta:0 };
}

export function iniciarCarrera(carrera) {
  if (carrera.fase !== 'espera') return;
  carrera.fase = carrera.cuentaAtras > 0 ? 'cuenta' : 'corriendo';
}

// Devuelve la fracción del segmento en la que se cruza la puerta hacia delante.
// El segmento evita saltarse controles a alta velocidad entre dos fotogramas.
export function crucePuerta(a, b, puerta) {
  const da=(a.x-puerta.x)*puerta.nx+(a.z-puerta.z)*puerta.nz;
  const db=(b.x-puerta.x)*puerta.nx+(b.z-puerta.z)*puerta.nz;
  if (!(da < 0 && db >= 0)) return null;
  const t=-da/(db-da);
  const x=a.x+(b.x-a.x)*t, z=a.z+(b.z-a.z)*t;
  const lateral=(x-puerta.x)*(-puerta.nz)+(z-puerta.z)*puerta.nx;
  return Math.abs(lateral) <= puerta.ancho/2 ? {t,x,z} : null;
}

export function actualizarCarrera(carrera, anterior, actual, dt, enAsfalto = () => true) {
  if (!(dt > 0) || !Number.isFinite(dt)) return false;
  if (carrera.fase === 'cuenta') {
    carrera.cuentaAtras = Math.max(0,carrera.cuentaAtras-dt);
    if (carrera.cuentaAtras === 0) carrera.fase='corriendo';
    return false;
  }
  if (carrera.fase !== 'corriendo') return false;
  const inicio=carrera.tiempo;
  carrera.tiempo+=dt;
  // avance es la distancia con signo del fotograma: permite validar un cruce
  // realizado al frenar aunque la velocidad final ya sea cero.
  if (!((actual.avance ?? actual.velocidad) > 0)) return false;
  const cruces=carrera.puertas.map((p,i)=>({i,cruce:crucePuerta(anterior,actual,p)}))
    .filter(p=>p.cruce).sort((a,b)=>a.cruce.t-b.cruce.t);
  for (const {i,cruce} of cruces) {
    if (i !== carrera.control || !enAsfalto(cruce.x,cruce.z)) continue;
    carrera.control++;
    if (carrera.control === carrera.puertas.length) {
      const tiempoCruce=inicio+dt*cruce.t;
      carrera.tiemposVuelta.push(tiempoCruce-carrera.inicioVuelta);
      carrera.inicioVuelta=tiempoCruce;
      carrera.vueltasCompletadas++;
      carrera.control=0;
      if (carrera.vueltasCompletadas === carrera.vueltas) {
        carrera.tiempo=tiempoCruce;
        carrera.fase='terminada';
        return true;
      }
    }
  }
  return false;
}

export function formatearTiempo(segundos) {
  const ms=Math.max(0,Math.floor(segundos*1000));
  return `${Math.floor(ms/60000).toString().padStart(2,'0')}:${Math.floor(ms/1000)%60 < 10 ? '0' : ''}${Math.floor(ms/1000)%60}.${(ms%1000).toString().padStart(3,'0')}`;
}
