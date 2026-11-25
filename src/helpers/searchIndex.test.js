import { describe, expect, it } from 'vitest';
import { buildSearchIndex } from './searchIndex';

const productos = [
  { id: 'dip', nombre: 'Dip de queso crema y tocineta', ingredientes: ['queso crema', 'tocineta', 'pimentón'] },
  { id: 'arroz', nombre: 'Arroz con maicitos y tocineta', ingredientes: ['arroz', 'maíz', 'tocineta'] },
  { id: 'rollo-mixto', nombre: 'Rollo mixto', ingredientes: ['cerdo', 'res', 'pollo', 'tocineta'] },
  { id: 'jamon-pollo', nombre: 'Jamón de pollo', ingredientes: ['pollo'] },
];

describe('buildSearchIndex', () => {
  it('busca por cualquier palabra del nombre', () => {
    expect(buildSearchIndex(productos).startsWith('mixto')).toEqual(['rollo-mixto']);
  });

  it('busca por ingrediente', () => {
    const ids = buildSearchIndex(productos).startsWith('toci');
    expect(ids).toEqual(expect.arrayContaining(['dip', 'arroz', 'rollo-mixto']));
    expect(ids).toHaveLength(3);
  });

  it('ignora palabras cortas como "de" o "y"', () => {
    expect(buildSearchIndex(productos).startsWith('de')).toEqual([]);
  });
});
