import { describe, expect, it } from 'vitest';
import MaxHeap from './MaxHeap';

describe('MaxHeap de canciones por reproducciones', () => {
  const canciones = [
    { id: 'a', plays: 120 }, { id: 'b', plays: 980 }, { id: 'c', plays: 450 }, { id: 'd', plays: 700 },
  ];

  it('extractMax saca siempre la más escuchada', () => {
    const h = new MaxHeap((c) => c.plays, canciones);
    expect([h.extractMax().id, h.extractMax().id, h.extractMax().id, h.extractMax().id]).toEqual(['b', 'd', 'c', 'a']);
  });

  it('insert mantiene la propiedad del max heap y peek no saca', () => {
    const h = new MaxHeap((c) => c.plays);
    canciones.forEach((c) => h.insert(c));
    expect(h.peek().id).toBe('b');
    expect(h.size()).toBe(4);
    h.insert({ id: 'e', plays: 5000 });
    expect(h.peek().id).toBe('e');
  });

  it('un heap vacío devuelve null', () => {
    const h = new MaxHeap((c) => c.plays);
    expect(h.extractMax()).toBeNull();
    expect(h.peek()).toBeNull();
    expect(h.isEmpty()).toBe(true);
  });

  it('topK devuelve el top sin modificar el heap', () => {
    const h = new MaxHeap((c) => c.plays, canciones);
    expect(h.topK(2).map((c) => c.id)).toEqual(['b', 'd']);
    expect(h.size()).toBe(4);
    expect(h.topK(10)).toHaveLength(4);
  });

  it('cada padre es mayor o igual que sus hijos', () => {
    const h = new MaxHeap((n) => n, [5, 1, 9, 3, 7, 2, 8]);
    const a = h.toArray();
    a.forEach((v, i) => {
      if (2 * i + 1 < a.length) expect(v).toBeGreaterThanOrEqual(a[2 * i + 1]);
      if (2 * i + 2 < a.length) expect(v).toBeGreaterThanOrEqual(a[2 * i + 2]);
    });
  });
});
