import { describe, expect, it } from 'vitest';
import Trie from './Trie';

const trie = () => {
  const t = new Trie();
  ['Cali Pachanguero', 'Calle Luna Calle Sol', 'Caballo Viejo', 'Oiga, mire, vea', 'Ojalá'].forEach((s) => t.insert(s));
  return t;
};

describe('Trie de títulos de canciones', () => {
  it('search encuentra canciones completas sin importar tildes ni mayúsculas', () => {
    expect(trie().search('cali pachanguero')).toBe(true);
    expect(trie().search('OJALA')).toBe(true);
    expect(trie().search('Cali')).toBe(false);
  });

  it('suggest devuelve los títulos originales que empiezan por el prefijo', () => {
    expect(trie().suggest('cal')).toEqual(['Cali Pachanguero', 'Calle Luna Calle Sol']);
    expect(trie().suggest('CA')).toHaveLength(3);
    expect(trie().suggest('oj')).toEqual(['Ojalá']);
  });

  it('suggest respeta el límite y devuelve [] sin coincidencias o con prefijo vacío', () => {
    expect(trie().suggest('ca', 2)).toHaveLength(2);
    expect(trie().suggest('xyz')).toEqual([]);
    expect(trie().suggest('')).toEqual([]);
  });

  it('no duplica una canción insertada dos veces y cuenta las palabras', () => {
    const t = trie();
    t.insert('Ojalá');
    expect(t.suggest('oj')).toEqual(['Ojalá']);
    expect(t.size()).toBe(5);
  });
});
