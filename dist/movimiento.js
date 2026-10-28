// Lógica sin DOM ni WebGL: facilita ajustar y comprobar la conducción.
export function acercar(valor, objetivo, paso) {
  return valor < objetivo
    ? Math.min(valor + paso, objetivo)
    : Math.max(valor - paso, objetivo);
}

export function crearEstado(posicion = [0, 0, 0], rumboGrados = 0) {
  return {
    x: posicion[0], z: posicion[2],
    rumbo: rumboGrados * Math.PI / 180,
    velocidad: 0, direccion: 0,
  };
}

// Mezcla asfalto/césped según las ruedas que han salido de la carretera.
// No cambia la velocidad actual: avanzar() la ajusta de forma progresiva.
export function conduccionEnTerreno(base, cesped, proporcion) {
  if (!cesped.activo || !(proporcion > 0)) return base;
  const p = Math.min(proporcion, 1);
  const mezclar = factor => 1 + (factor - 1) * p;
  return {
    ...base,
    velocidadMaxima: base.velocidadMaxima * mezclar(cesped.factorVelocidad),
    velocidadMarchaAtras: base.velocidadMarchaAtras * mezclar(cesped.factorVelocidad),
    aceleracion: base.aceleracion * mezclar(cesped.factorAceleracion),
    aceleracionMarchaAtras: base.aceleracionMarchaAtras * mezclar(cesped.factorAceleracion),
    desaceleracion: base.desaceleracion * mezclar(cesped.factorDesaceleracion),
    frenadaExceso: cesped.frenadaExceso * p,
  };
}

// Devuelve los metros recorridos CON SIGNO: negativo al ir marcha atrás.
export function avanzar(estado, teclas, dt, ajustes, distanciaEjes) {
  if (!(dt > 0)) return 0;
  dt = Math.min(dt, 0.05); // Evita saltos al volver a una pestaña suspendida.
  const velocidadAnterior = estado.velocidad;
  const acelerar = teclas.has('KeyW');
  const frenar = teclas.has('KeyS');
  const frenadaExceso = ajustes.frenadaExceso ?? ajustes.frenada;

  if (acelerar && !frenar) {
    estado.velocidad = estado.velocidad < 0
      ? acercar(estado.velocidad, 0, ajustes.frenada * dt)
      : estado.velocidad > ajustes.velocidadMaxima
        ? acercar(estado.velocidad, ajustes.velocidadMaxima, frenadaExceso * dt)
        : Math.min(ajustes.velocidadMaxima, estado.velocidad + ajustes.aceleracion * dt);
  } else if (frenar && !acelerar) {
    estado.velocidad = estado.velocidad > 0
      ? acercar(estado.velocidad, 0, ajustes.frenada * dt)
      : estado.velocidad < -ajustes.velocidadMarchaAtras
        ? acercar(estado.velocidad, -ajustes.velocidadMarchaAtras, frenadaExceso * dt)
        : Math.max(-ajustes.velocidadMarchaAtras,
            estado.velocidad - ajustes.aceleracionMarchaAtras * dt);
  } else {
    estado.velocidad = acercar(estado.velocidad, 0, ajustes.desaceleracion * dt);
  }

  const lado = Number(teclas.has('KeyA')) - Number(teclas.has('KeyD'));
  const objetivo = lado * ajustes.giroMaximoGrados * Math.PI / 180;
  const direccionAnterior = estado.direccion;
  estado.direccion += (objetivo - estado.direccion)
    * (1 - Math.exp(-ajustes.respuestaDireccion * dt));

  const distancia = (velocidadAnterior + estado.velocidad) * 0.5 * dt;
  const direccionMedia = (direccionAnterior + estado.direccion) * 0.5;
  const cambioRumbo = distancia / Math.max(distanciaEjes, 0.1) * Math.tan(direccionMedia);
  const rumboMedio = estado.rumbo + cambioRumbo * 0.5;
  estado.x -= Math.sin(rumboMedio) * distancia;
  estado.z -= Math.cos(rumboMedio) * distancia;
  estado.rumbo += cambioRumbo;
  return distancia;
}

// Comprueba también el recorrido intermedio, no solo el destino del fotograma.
export function avanzarConLimite(estado, teclas, dt, ajustes, distanciaEjes, permitida, pasoMaximo = 0.2) {
  if (!(dt > 0)) return { distancia: 0, bloqueado: false };
  dt = Math.min(dt, 0.05);
  const pasos = Math.max(1, Math.ceil(
    Math.max(Math.abs(estado.velocidad), ajustes.velocidadMaxima, ajustes.velocidadMarchaAtras)
      * dt / Math.max(pasoMaximo, 0.02),
  ));
  let distancia = 0;
  for (let i = 0; i < pasos; i++) {
    const anterior = { x: estado.x, z: estado.z, rumbo: estado.rumbo };
    const tramo = avanzar(estado, teclas, dt / pasos, ajustes, distanciaEjes);
    if (!permitida(estado)) {
      Object.assign(estado, anterior);
      estado.velocidad = 0;
      return { distancia, bloqueado: true };
    }
    distancia += tramo;
  }
  return { distancia, bloqueado: false };
}
