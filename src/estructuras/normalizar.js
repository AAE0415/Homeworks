/** Minúsculas, sin tildes y con espacios simples: "Ojalá" → "ojala". */
export function normalizar(texto = '') {
  return String(texto).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
}
