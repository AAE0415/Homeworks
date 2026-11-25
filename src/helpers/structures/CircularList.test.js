import { describe, expect, it } from 'vitest';
import CircularList from './CircularList';

describe('CircularList (lista doblemente enlazada circular)', () => {
  const lista = () => { const l = new CircularList(); ['a', 'b', 'c'].forEach((v) => l.append(v)); return l; };

  it('next da la vuelta al llegar al final', () => {
    const l = lista();
    expect(l.current()).toBe('a');
    l.next(); l.next();
    expect(l.next()).toBe('a');
  });

  it('prev desde el primero va al último', () => {
    expect(lista().prev()).toBe('c');
  });

  it('con un solo elemento, next devuelve el mismo', () => {
    const l = new CircularList();
    l.append('x');
    expect(l.next()).toBe('x');
    expect(l.prev()).toBe('x');
  });

  it('vacía devuelve null y toArray conserva el orden', () => {
    const l = new CircularList();
    expect(l.current()).toBeNull();
    expect(l.next()).toBeNull();
    expect(lista().toArray()).toEqual(['a', 'b', 'c']);
    expect(lista().size()).toBe(3);
  });
});
