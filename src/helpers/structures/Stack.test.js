import { describe, expect, it } from 'vitest';
import Stack from './Stack';

describe('Stack (pila LIFO)', () => {
  it('sale primero el último que entró', () => {
    const s = new Stack();
    s.push(10); s.push(20); s.push(30);
    expect(s.pop()).toBe(30);
    expect(s.peek()).toBe(20);
    expect(s.size()).toBe(2);
  });

  it('pop y peek en una pila vacía devuelven null', () => {
    const s = new Stack();
    expect(s.pop()).toBeNull();
    expect(s.peek()).toBeNull();
    expect(s.isEmpty()).toBe(true);
  });

  it('toArray muestra el tope primero y clear la vacía', () => {
    const s = new Stack();
    s.push('a'); s.push('b');
    expect(s.toArray()).toEqual(['b', 'a']);
    s.clear();
    expect(s.size()).toBe(0);
  });
});
