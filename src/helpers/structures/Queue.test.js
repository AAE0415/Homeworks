import { describe, expect, it } from 'vitest';
import Queue from './Queue';

describe('Queue (cola FIFO sobre lista enlazada)', () => {
  it('sale primero el que entró primero', () => {
    const q = new Queue();
    q.enqueue('A'); q.enqueue('B'); q.enqueue('C');
    expect(q.dequeue()).toBe('A');
    expect(q.dequeue()).toBe('B');
    expect(q.peek()).toBe('C');
    expect(q.size()).toBe(1);
  });

  it('dequeue y peek en una cola vacía devuelven null', () => {
    const q = new Queue();
    expect(q.dequeue()).toBeNull();
    expect(q.peek()).toBeNull();
    expect(q.isEmpty()).toBe(true);
  });

  it('después de vaciarla, tail queda en null y se puede volver a usar', () => {
    const q = new Queue();
    q.enqueue(1); q.dequeue();
    expect(q.tail).toBeNull();
    q.enqueue(2);
    expect(q.peek()).toBe(2);
    expect(q.toArray()).toEqual([2]);
  });

  it('toArray respeta el orden de llegada', () => {
    const q = new Queue();
    [3, 1, 2].forEach((v) => q.enqueue(v));
    expect(q.toArray()).toEqual([3, 1, 2]);
  });
});
