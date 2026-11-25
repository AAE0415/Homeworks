import { describe, expect, it } from 'vitest';
import CanastaConDeshacer, { claveItem } from './cartLogic';

const costilla = { id: 'costilla', nombre: 'Costilla San Luis', precio: 45900, unidad: 'libra', foto_url: '/img/c.jpg', disponible: true };
const ensalada = { id: 'ensalada', nombre: 'Ensalada dulce', precio: 7800, unidad: 'porción', foto_url: '/img/e.jpg', disponible: true };
const P4 = '4 porciones de 125 g';

describe('CanastaConDeshacer', () => {
  it('agregar dos veces el mismo plato con las mismas porciones suma la cantidad', () => {
    const c = new CanastaConDeshacer();
    c.agregar(costilla, { cantidad: 1, porciones: P4 });
    c.agregar(costilla, { cantidad: 2, porciones: P4 });
    expect(c.items).toHaveLength(1);
    expect(c.items[0].cantidad).toBe(3);
  });

  it('el mismo plato con otras porciones es otra línea', () => {
    const c = new CanastaConDeshacer();
    c.agregar(costilla, { porciones: P4 });
    c.agregar(costilla, { porciones: '3 porciones de 166 g' });
    expect(c.items).toHaveLength(2);
    expect(claveItem('costilla', P4)).toBe('costilla|4 porciones de 125 g');
  });

  it('quitar y deshacer restaura la línea con su cantidad y porciones', () => {
    const c = new CanastaConDeshacer();
    c.agregar(costilla, { cantidad: 2, porciones: P4 });
    c.agregar(ensalada, { cantidad: 4 });
    c.quitar(claveItem('costilla', P4));
    expect(c.items.map((i) => i.id)).toEqual(['ensalada']);
    expect(c.ultimaAccion).toMatchObject({ tipo: 'quitar', nombre: 'Costilla San Luis' });
    c.deshacer();
    expect(c.items[0]).toMatchObject({ id: 'costilla', cantidad: 2, porciones: P4 });
    expect(c.items).toHaveLength(2);
  });

  it('vaciar y deshacer restaura toda la canasta', () => {
    const c = new CanastaConDeshacer();
    c.agregar(costilla);
    c.agregar(ensalada, { cantidad: 3 });
    c.vaciar();
    expect(c.items).toEqual([]);
    c.deshacer();
    expect(c.items).toHaveLength(2);
  });

  it('deshacer con la pila vacía no cambia nada', () => {
    const c = new CanastaConDeshacer([{ ...ensalada, clave: 'ensalada|', cantidad: 1, porciones: null }]);
    expect(c.puedeDeshacer).toBe(false);
    c.deshacer();
    expect(c.items).toHaveLength(1);
  });

  it('cambiar la cantidad a 0 equivale a quitar', () => {
    const c = new CanastaConDeshacer();
    c.agregar(ensalada, { cantidad: 2 });
    c.cambiarCantidad(claveItem('ensalada', null), 0);
    expect(c.items).toEqual([]);
    expect(c.ultimaAccion.tipo).toBe('quitar');
  });

  it('cambiar la cantidad se puede deshacer', () => {
    const c = new CanastaConDeshacer();
    c.agregar(ensalada, { cantidad: 2 });
    c.cambiarCantidad(claveItem('ensalada', null), 5);
    expect(c.items[0].cantidad).toBe(5);
    c.deshacer();
    expect(c.items[0].cantidad).toBe(2);
  });

  it('items es una copia nueva tras cada cambio (para React)', () => {
    const c = new CanastaConDeshacer();
    const antes = c.items;
    c.agregar(ensalada);
    expect(c.items).not.toBe(antes);
  });

  it('no agrega platos agotados', () => {
    const c = new CanastaConDeshacer();
    c.agregar({ ...costilla, disponible: false });
    expect(c.items).toEqual([]);
  });
});
