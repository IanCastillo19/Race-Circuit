// Ajustes de nitro y dirección. Conserva tus valores generales en config.js.
export const MEJORAS = {
  modelo: './assets/Modelos/nitro.glb', // Ruta relativa a jugar.html, respeta mayúsculas.
  diametroMetros: 4,
  alturaMaximaMetros: 0.2, // Evita que la plataforma oculte medio coche.
  giroModeloGrados: [0, 0, 0], // X, Y, Z: para corregir orientación del GLB si hace falta.
  duracion: 3,
  recarga: 6,
  factorVelocidad: 1.35,
  factorAceleracion: 2.5,
  direccion: { gradosLento: 20, gradosRapido: 9 },
  // Coordenadas locales al Circuito.glb. El código transforma y duplica el modelo.
  posiciones: [
    { x: 78, z: -18, rumboGrados: 74 },
    { x: -66, z: -75, rumboGrados: 180 },
    { x: -47, z: 30, rumboGrados: -84 },
  ],
};

function distanciaSegmento(a, b, p) {
  const dx=b.x-a.x, dz=b.z-a.z, longitud=dx*dx+dz*dz;
  const t=longitud > 0 ? Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/longitud)) : 0;
  return {distancia:Math.hypot(a.x+dx*t-p.x,a.z+dz*t-p.z),x:a.x+dx*t,z:a.z+dz*t};
}

export function crearNitro(zonas, config = MEJORAS) {
  return {restante:0,config,zonas:zonas.map(p=>({...p,recarga:0,ocupada:false}))};
}

export function reiniciarNitro(nitro, posicion) {
  nitro.restante=0;
  for(const zona of nitro.zonas) {
    zona.recarga=0;
    zona.ocupada=posicion ? Math.hypot(posicion.x-zona.x,posicion.z-zona.z)<=zona.radio : false;
  }
}

// Solo se llama durante la carrera: las pausas también pausan efecto y recarga.
export function actualizarNitro(nitro, anterior, actual, dt, enAsfalto=()=>true) {
  if (!(dt>0) || !Number.isFinite(dt)) return false;
  nitro.restante=Math.max(0,nitro.restante-dt);
  let activado=false;
  for(const zona of nitro.zonas) {
    zona.recarga=Math.max(0,zona.recarga-dt);
    const antesOcupada=zona.ocupada;
    const dentro=Math.hypot(actual.x-zona.x,actual.z-zona.z)<=zona.radio;
    const paso=distanciaSegmento(anterior,actual,zona);
    const seMueve=(actual.avance??actual.velocidad)>0;
    if (!antesOcupada && paso.distancia<=zona.radio && seMueve) {
      zona.ocupada=true;
      if (zona.recarga===0 && nitro.restante===0 && enAsfalto(paso.x,paso.z)) {
        nitro.restante=nitro.config.duracion;
        zona.recarga=nitro.config.recarga;
        activado=true;
      }
    } else if (!dentro && Math.hypot(actual.x-zona.x,actual.z-zona.z)>zona.radio+.3) zona.ocupada=false;
  }
  return activado;
}

export function ajustarConduccion(base, velocidad, nitro, config = MEJORAS) {
  const t=Math.min(1,Math.abs(velocidad)/Math.max(base.velocidadMaxima,1));
  const suave=t*t*(3-2*t);
  const giro=Math.min(base.giroMaximoGrados,config.direccion.gradosLento+(config.direccion.gradosRapido-config.direccion.gradosLento)*suave);
  const activo=nitro?.restante>0;
  return {...base, giroMaximoGrados:giro,
    velocidadMaxima:base.velocidadMaxima*(activo?config.factorVelocidad:1),
    aceleracion:base.aceleracion*(activo?config.factorAceleracion:1)};
}
