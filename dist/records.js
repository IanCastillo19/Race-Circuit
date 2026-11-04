export function leerMarca(storage, clave) {
  try {
    const n = JSON.parse(storage.getItem(clave));
    return Number.isFinite(n) && n > 0 ? n : null;
  } catch {
    return null;
  }
}
export function guardarMarca(storage, clave, tiempo) {
  const anterior = leerMarca(storage, clave);
  if (!Number.isFinite(tiempo) || tiempo <= 0)
    return { mejorado: false, guardado: false, anterior };
  const mejorado = anterior === null || tiempo < anterior;
  if (!mejorado) return { mejorado: false, guardado: true, anterior };
  try {
    storage.setItem(clave, JSON.stringify(tiempo));
    return { mejorado: true, guardado: true, anterior };
  } catch {
    return { mejorado: true, guardado: false, anterior };
  }
}
