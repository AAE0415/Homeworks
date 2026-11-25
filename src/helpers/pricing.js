// Reglas de precios de Delilicias.

export const DOMICILIO_GRATIS_DESDE = 149900;
export const PORCENTAJE_ANTICIPO = 50;

export function calcularSubtotal(items) {
  return items.reduce((total, { precio, cantidad }) => total + precio * cantidad, 0);
}

export function domicilioEsGratis(subtotal, desde = DOMICILIO_GRATIS_DESDE) {
  return subtotal >= desde;
}

export function calcularAnticipo(subtotal, porcentaje = PORCENTAJE_ANTICIPO) {
  return Math.round((subtotal * porcentaje) / 100);
}
