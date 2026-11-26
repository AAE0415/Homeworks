import { describe, expect, it } from 'vitest';
import { masPedidos, ordenarAgenda } from './orders';

describe('ordenarAgenda (usa Heap)', () => {
  it('ordena por fecha de entrega y luego por confirmación', () => {
    const pedidos = [
      { id: 'a', fecha: '2026-12-31', confirmado_at: '2026-11-02T10:00' },
      { id: 'b', fecha: '2026-12-24', confirmado_at: '2026-11-20T10:00' },
      { id: 'c', fecha: '2026-12-24', confirmado_at: '2026-11-05T10:00' },
    ];
    expect(ordenarAgenda(pedidos).map((p) => p.id)).toEqual(['c', 'b', 'a']);
  });

  it('no modifica el arreglo original', () => {
    const pedidos = [{ id: 'x', fecha: '2026-12-31', confirmado_at: '1' }, { id: 'y', fecha: '2026-12-24', confirmado_at: '1' }];
    ordenarAgenda(pedidos);
    expect(pedidos[0].id).toBe('x');
  });
});

describe('masPedidos (usa Heap.topK)', () => {
  it('devuelve los k productos más vendidos', () => {
    const ventas = [
      { producto_id: 'rollo', cantidad: 12 }, { producto_id: 'dip', cantidad: 3 },
      { producto_id: 'costilla', cantidad: 20 }, { producto_id: 'arroz', cantidad: 8 },
    ];
    expect(masPedidos(ventas, 2).map((v) => v.producto_id)).toEqual(['costilla', 'rollo']);
  });

  it('por defecto devuelve 4', () => {
    const ventas = Array.from({ length: 6 }, (_, i) => ({ producto_id: `p${i}`, cantidad: i }));
    expect(masPedidos(ventas)).toHaveLength(4);
  });
});

describe('colaAnticipos (usa Queue)', () => {
  const pedidos = [
    { id: 3, estado: 'recibido', comprobante_url: 'c3', created_at: '2026-11-20T10:00' },
    { id: 1, estado: 'recibido', comprobante_url: 'c1', created_at: '2026-11-18T10:00' },
    { id: 2, estado: 'recibido', comprobante_url: null, created_at: '2026-11-19T10:00' },
    { id: 4, estado: 'en_cocina', comprobante_url: 'c4', created_at: '2026-11-10T10:00' },
  ];

  it('atiende primero al que llegó primero, entre los que ya subieron comprobante', async () => {
    const { colaAnticipos } = await import('./orders');
    const { cola } = colaAnticipos(pedidos);
    expect(cola.peek().id).toBe(1);
    expect(cola.toArray().map((p) => p.id)).toEqual([1, 3]);
  });

  it('separa los que aún no tienen comprobante', async () => {
    const { colaAnticipos } = await import('./orders');
    expect(colaAnticipos(pedidos).sinComprobante.map((p) => p.id)).toEqual([2]);
  });
});
