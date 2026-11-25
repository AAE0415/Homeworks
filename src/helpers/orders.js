import { fechaLocalISO } from './format';

export const ESTADOS = ['recibido', 'anticipo_confirmado', 'en_cocina', 'en_camino', 'entregado'];

/** Estado que sigue al actual, o null si el pedido terminó o fue cancelado. */
export function siguienteEstado(estado) {
  const i = ESTADOS.indexOf(estado);
  return i === -1 || i === ESTADOS.length - 1 ? null : ESTADOS[i + 1];
}

/** Fechas que aún se pueden elegir: no vencidas (por día) y con cupo. */
export function fechasDisponibles(fechas, hoy = new Date()) {
  const dia = fechaLocalISO(hoy);
  return fechas.filter((f) => (!f.pedir_hasta || f.pedir_hasta >= dia) && f.ocupados < f.cupo);
}

/** Pone al día una canasta guardada con el menú actual. */
export function reconciliarCanasta(items, productosPorId) {
  const cambios = [];
  const resultado = [];
  for (const item of items) {
    const p = productosPorId[item.id];
    if (!p) { cambios.push({ id: item.id, tipo: 'eliminado' }); continue; }
    if (p.precio !== item.precio) cambios.push({ id: item.id, tipo: 'precio' });
    if (!p.disponible) cambios.push({ id: item.id, tipo: 'agotado' });
    resultado.push({ ...item, precio: p.precio, disponible: p.disponible });
  }
  return { items: resultado, cambios };
}
