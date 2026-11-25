import { describe, expect, it } from 'vitest';
import Heap from './Heap';

describe('Heap (montículo binario en arreglo)', () => {
  it('por defecto es un min-heap', () => {
    const h = new Heap(undefined, [5, 3, 8, 1]);
    expect([h.pop(), h.pop(), h.pop(), h.pop()]).toEqual([1, 3, 5, 8]);
  });

  it('push mantiene la propiedad del heap', () => {
    const h = new Heap();
    [7, 2, 9, 4].forEach((v) => h.push(v));
    expect(h.peek()).toBe(2);
    expect(h.size()).toBe(4);
  });

  it('pop o peek en un heap vacío devuelven undefined', () => {
    const h = new Heap();
    expect(h.pop()).toBeUndefined();
    expect(h.peek()).toBeUndefined();
    expect(h.isEmpty()).toBe(true);
  });

  it('con el comparador de agenda saca primero la fecha más cercana', () => {
    const porAgenda = (a, b) => a.fecha.localeCompare(b.fecha) || a.confirmado_at.localeCompare(b.confirmado_at);
    const h = new Heap(porAgenda);
    h.push({ id: 1, fecha: '2026-12-31', confirmado_at: '2026-11-01' });
    h.push({ id: 2, fecha: '2026-12-24', confirmado_at: '2026-11-20' });
    h.push({ id: 3, fecha: '2026-12-24', confirmado_at: '2026-11-10' });
    expect([h.pop().id, h.pop().id, h.pop().id]).toEqual([3, 2, 1]);
  });

  it('topK devuelve los k mayores, de mayor a menor', () => {
    const ventas = [{ id: 'a', cantidad: 4 }, { id: 'b', cantidad: 9 }, { id: 'c', cantidad: 1 }, { id: 'd', cantidad: 7 }];
    const top = Heap.topK(ventas, 2, (x, y) => x.cantidad - y.cantidad);
    expect(top.map((v) => v.id)).toEqual(['b', 'd']);
  });

  it('topK con k mayor que la lista devuelve todo ordenado', () => {
    expect(Heap.topK([2, 9, 4], 10)).toEqual([9, 4, 2]);
  });
});
