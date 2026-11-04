export function crearAudio() {
  let contexto = null,
    maestro = null,
    motores = [],
    habilitado = false;
  async function activar(valor) {
    habilitado = valor;
    try {
      if (valor && !contexto) {
        const Audio = globalThis.AudioContext || globalThis.webkitAudioContext;
        if (!Audio) return false;
        contexto = new Audio();
        maestro = contexto.createGain();
        maestro.gain.value = 0.15;
        maestro.connect(contexto.destination);
        for (let i = 0; i < 2; i++) {
          const osc = contexto.createOscillator(),
            gain = contexto.createGain();
          osc.type = 'sawtooth';
          gain.gain.value = 0;
          osc.connect(gain);
          gain.connect(maestro);
          osc.start();
          motores.push({ osc, gain });
        }
      }
      if (valor && contexto.state === 'suspended') await contexto.resume();
      if (!valor) actualizar([], false);
      return true;
    } catch {
      return false;
    }
  }
  function actualizar(jugadores, corriendo) {
    if (!contexto) return;
    jugadores.forEach((j, i) =>
      motores[i]?.osc.frequency.setTargetAtTime(
        35 + Math.abs(j.estado.velocidad) * 5 + (j.nitro.restante > 0 ? 25 : 0),
        contexto.currentTime,
        0.08,
      ),
    );
    motores.forEach((m, i) =>
      m.gain.gain.setTargetAtTime(
        habilitado && corriendo && jugadores[i] && jugadores[i].estado.velocidad !== 0 ? 0.035 : 0,
        contexto.currentTime,
        0.06,
      ),
    );
  }
  function efecto(tipo) {
    if (!contexto || !habilitado) return;
    const frecuencias = {
      cuenta: 500,
      salida: 850,
      control: 740,
      nitro: 1050,
      golpe: 90,
      platano: 230,
      victoria: 990,
      recuperar: 390,
    };
    const osc = contexto.createOscillator(),
      gain = contexto.createGain(),
      ahora = contexto.currentTime;
    osc.type = tipo === 'golpe' ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(frecuencias[tipo] ?? 440, ahora);
    osc.frequency.exponentialRampToValueAtTime(
      tipo === 'victoria' ? 1480 : Math.max(50, (frecuencias[tipo] ?? 440) * 0.65),
      ahora + 0.2,
    );
    gain.gain.setValueAtTime(0.25, ahora);
    gain.gain.exponentialRampToValueAtTime(0.001, ahora + 0.28);
    osc.connect(gain);
    gain.connect(maestro);
    osc.start();
    osc.stop(ahora + 0.3);
  }
  return { activar, actualizar, efecto };
}
