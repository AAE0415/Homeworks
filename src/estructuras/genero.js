import { normalizar } from './normalizar';

const CONOCIDOS = ['salsa', 'regueton', 'vallenato', 'pop', 'trova', 'llanera'];

/** "Vallenato pop" → "genero-vallenato" (clase generada en Sass con @each). */
export function claseGenero(genero) {
  const clave = normalizar(genero).split(' ')[0];
  return `genero-${CONOCIDOS.includes(clave) ? clave : 'otro'}`;
}
