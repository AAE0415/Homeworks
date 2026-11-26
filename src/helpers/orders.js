import { fechaLocalISO } from './format';
import Heap from './structures/Heap';
import Queue from './structures/Queue';

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

const porAgenda = (a, b) => a.fecha.localeCompare(b.fecha) || String(a.confirmado_at).localeCompare(String(b.confirmado_at));

/** Agenda de cocina: primero la entrega más cercana; a igual fecha, lo confirmado antes. Usa un Heap. */
export function ordenarAgenda(pedidos) {
  const heap = new Heap(porAgenda, pedidos);
  const ordenados = [];
  while (!heap.isEmpty()) ordenados.push(heap.pop());
  return ordenados;
}

/** Los k productos con más unidades vendidas ({ producto_id, cantidad }). Usa Heap.topK. */
export function masPedidos(ventas, k = 4) {
  return Heap.topK(ventas, k, (a, b) => a.cantidad - b.cantidad);
}

/**
 * Bandeja de anticipos: COLA (FIFO) de pedidos "recibido" con comprobante, en orden de llegada.
 * Los que aún no suben comprobante quedan aparte para no frenar la fila.
 */
export function colaAnticipos(pedidos) {
  const recibidos = pedidos
    .filter((p) => p.estado === 'recibido')
    .sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)));
  const cola = new Queue();
  recibidos.filter((p) => p.comprobante_url).forEach((p) => cola.enqueue(p));
  return { cola, sinComprobante: recibidos.filter((p) => !p.comprobante_url) };
}
