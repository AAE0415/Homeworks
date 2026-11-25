import { describe, expect, it } from 'vitest';
import { buildMenuTree, PORCIONES } from './menuTree';

const categorias = [
  { id: 'fuertes', titulo: 'Platos fuertes', orden: 2 },
  { id: 'entradas', titulo: 'Entradas', orden: 1 },
  { id: 'acompanantes', titulo: 'Acompañantes', orden: 3 },
];
const productos = [
  { id: 'rollo-mixto', categoria_id: 'fuertes', nombre: 'Rollo mixto', unidad: 'libra' },
  { id: 'dip', categoria_id: 'entradas', nombre: 'Dip', unidad: '350 g' },
  { id: 'arroz-verde', categoria_id: 'acompanantes', nombre: 'Arroz verde', unidad: 'porción' },
  { id: 'costilla', categoria_id: 'fuertes', nombre: 'Costilla', unidad: 'libra' },
];

describe('buildMenuTree', () => {
  const t = buildMenuTree(categorias, productos, PORCIONES);

  it('la raíz es el menú y sus hijos son las secciones en orden', () => {
    const [raiz, ...resto] = t.bfs();
    expect(raiz.tipo).toBe('menu');
    expect(resto.slice(0, 3).map((v) => v.id)).toEqual(['entradas', 'fuertes', 'acompanantes']);
  });

  it('los platos por libra tienen 3 hijos de porción', () => {
    const rollo = t.find((v) => v.id === 'rollo-mixto');
    expect(rollo.children).toHaveLength(3);
    expect(rollo.children.map((c) => c.value.texto)).toEqual(PORCIONES);
  });

  it('un acompañante no tiene hijos', () => {
    expect(t.find((v) => v.id === 'arroz-verde').isLeaf()).toBe(true);
  });

  it('dfs recorre la sección I completa antes de la II', () => {
    const ids = t.dfs().filter((v) => v.id).map((v) => v.id);
    expect(ids.indexOf('dip')).toBeLessThan(ids.indexOf('fuertes'));
  });
});
