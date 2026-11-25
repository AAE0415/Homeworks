import { describe, expect, it } from 'vitest';
import Trie from './Trie';

const trie = () => {
  const t = new Trie();
  t.insert('Jamón de pollo', 'jamon-pollo');
  t.insert('Dip de queso crema y tocineta', 'dip');
  t.insert('Arroz con maicitos y tocineta', 'arroz');
  return t;
};

describe('Trie (árbol de caracteres)', () => {
  it('startsWith encuentra por prefijo sin importar mayúsculas ni tildes', () => {
    expect(trie().startsWith('JAM')).toEqual(['jamon-pollo']);
    expect(trie().startsWith('jam')).toEqual(['jamon-pollo']);
    expect(trie().startsWith('jamón')).toEqual(['jamon-pollo']);
  });

  it('startsWith sin coincidencias o con prefijo vacío devuelve []', () => {
    expect(trie().startsWith('xyz')).toEqual([]);
    expect(trie().startsWith('')).toEqual([]);
  });

  it('search solo es verdadero para palabras completas', () => {
    expect(trie().search('jamon de pollo')).toBe(true);
    expect(trie().search('jam')).toBe(false);
  });

  it('no repite ids cuando varias palabras llevan al mismo producto', () => {
    const t = new Trie();
    t.insert('rollo', 'rollo-mixto');
    t.insert('rollo mixto', 'rollo-mixto');
    expect(t.startsWith('rol')).toEqual(['rollo-mixto']);
  });
});
