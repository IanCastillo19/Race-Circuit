// Límites en km/h; todo el controlador utiliza m/s.
export const MARCHAS = [27, 47, 67, 87, 104, 120];
const MINIMOS = [0, 9, 18, 28, 40, 55];
export function crearCambio() { return { marcha: 1, calado: false, baja: 0, rpm: 900 }; }
export function cambiarMarcha(estado, salto) {
  if (estado.velocidad < -0.1) return false;
  const c = estado.cambio, nueva = Math.max(1, Math.min(6, c.marcha + salto));
  if (nueva === c.marcha) return false;
  c.marcha = nueva;
  if (nueva === 1) { c.calado = false; c.baja = 0; }
  return true;
}
export function actualizarCambio(estado, dt, ajustes) {
  const c = estado.cambio;
  if (estado.velocidad < -.01 && !c.calado) { c.marcha = 1; c.baja = 0; }
  const kmh = Math.max(0, estado.velocidad * 3.6);
  c.baja = c.marcha > 1 && kmh < MINIMOS[c.marcha - 1] ? c.baja + dt : 0;
  if (c.baja >= 1) c.calado = true;
  const factor = ajustes.velocidadMaxima / (120 / 3.6);
  const limite = MARCHAS[c.marcha - 1] / 3.6 * factor;
  c.rpm = c.calado ? 0 : Math.min(7500, 900 + Math.abs(estado.velocidad) / Math.max(limite, .1) * 6100);
  return { ...ajustes, velocidadMaxima: limite, frenadaExceso: Math.max(10, ajustes.frenadaExceso ?? 0) };
}
