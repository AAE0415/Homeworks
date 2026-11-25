// Funciones generales de formato.

const formatoCOP = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

/** Minúsculas, sin tildes ni diéresis (la ñ queda como n) y espacios colapsados. */
export function normalizeText(str = '') {
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/** 52500 → "$ 52.500" */
export function formatCOP(n) {
  return formatoCOP.format(n);
}

/** "2026-12-24" → "24 de diciembre" (sin desfase de zona horaria). */
export function formatFecha(isoDate) {
  const [, mes, dia] = isoDate.split('-').map(Number);
  return `${dia} de ${MESES[mes - 1]}`;
}

/** Date → "2026-12-17" en hora local. */
export function fechaLocalISO(fecha) {
  const p = (n) => String(n).padStart(2, '0');
  return `${fecha.getFullYear()}-${p(fecha.getMonth() + 1)}-${p(fecha.getDate())}`;
}
