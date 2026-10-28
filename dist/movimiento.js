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

// Devuelve los metros recorridos CON SIGNO: negativo al ir marcha atrás.
export function avanzar(estado, teclas, dt, ajustes, distanciaEjes) {
  if (!(dt > 0)) return 0;
  dt = Math.min(dt, 0.05); // Evita saltos al volver a una pestaña suspendida.
  const velocidadAnterior = estado.velocidad;
  const acelerar = teclas.has('KeyW');
  const frenar = teclas.has('KeyS');

  if (acelerar && !frenar) {
    estado.velocidad = estado.velocidad < 0
      ? acercar(estado.velocidad, 0, ajustes.frenada * dt)
      : Math.min(ajustes.velocidadMaxima, estado.velocidad + ajustes.aceleracion * dt);
  } else if (frenar && !acelerar) {
    estado.velocidad = estado.velocidad > 0
      ? acercar(estado.velocidad, 0, ajustes.frenada * dt)
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
