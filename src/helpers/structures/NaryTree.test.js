import { describe, expect, it } from 'vitest';
import NaryTree, { TreeNode } from './NaryTree';

const arbol = () => {
  const raiz = new TreeNode('menu');
  const a = raiz.addChild(new TreeNode('A'));
  const b = raiz.addChild(new TreeNode('B'));
  a.addChild(new TreeNode('A1'));
  a.addChild(new TreeNode('A2'));
  b.addChild(new TreeNode('B1'));
  return new NaryTree(raiz);
};

describe('NaryTree (árbol n-ario)', () => {
  it('dfs visita cada rama completa antes de pasar a la siguiente', () => {
    expect(arbol().dfs()).toEqual(['menu', 'A', 'A1', 'A2', 'B', 'B1']);
  });

  it('bfs visita por niveles', () => {
    expect(arbol().bfs()).toEqual(['menu', 'A', 'B', 'A1', 'A2', 'B1']);
  });

  it('find devuelve el nodo o null', () => {
    const t = arbol();
    expect(t.find((v) => v === 'A2').value).toBe('A2');
    expect(t.find((v) => v === 'Z')).toBeNull();
  });

  it('isLeaf distingue hojas', () => {
    const t = arbol();
    expect(t.find((v) => v === 'B1').isLeaf()).toBe(true);
    expect(t.find((v) => v === 'A').isLeaf()).toBe(false);
  });

  it('un árbol vacío recorre []', () => {
    expect(new NaryTree().dfs()).toEqual([]);
    expect(new NaryTree().bfs()).toEqual([]);
  });
});
