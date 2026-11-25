import { formatCOP } from './format';

export const WHATSAPP_NEGOCIO = '573152377306';

const numeroPedido = (id) => String(id).padStart(4, '0');

export function linkWhatsApp(numero, mensaje) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

/** Mensaje del cliente a Delilicias sobre su pedido. */
export function mensajePedido({ id, fechaTexto, barrio, items = [], subtotal }) {
  const lineas = items.map((i) => `• ${i.nombre} × ${i.cantidad}${i.unidad === 'libra' ? ' lb' : ''}`);
  return [
    `Hola Delilicias, les escribo por mi pedido N.º ${numeroPedido(id)}.`,
    `Entrega: ${fechaTexto} · Barrio: ${barrio}`,
    ...lineas,
    subtotal != null ? `Subtotal: ${formatCOP(subtotal)}` : null,
  ].filter(Boolean).join('\n');
}

/** Mensaje de la administradora al cliente. */
export function mensajeAdmin({ id, nombre, fechaTexto }) {
  const primerNombre = (nombre ?? '').split(' ')[0];
  return `Hola ${primerNombre}, te escribimos de Delilicias por tu pedido N.º ${numeroPedido(id)} para el ${fechaTexto}.`;
}
