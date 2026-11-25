// Construye el árbol del menú: menú › sección › plato › porción.
import NaryTree, { TreeNode } from './structures/NaryTree';

/** Formas de porcionar cada libra de los platos fuertes. */
export const PORCIONES = ['3 porciones de 166 g', '4 porciones de 125 g', '5 porciones de 100 g'];

export function buildMenuTree(categorias, productos, porciones = PORCIONES) {
  const raiz = new TreeNode({ tipo: 'menu' });
  [...categorias]
    .sort((a, b) => a.orden - b.orden)
    .forEach((categoria) => {
      const seccion = raiz.addChild(new TreeNode({ tipo: 'seccion', ...categoria }));
      productos
        .filter((p) => p.categoria_id === categoria.id)
        .forEach((producto) => {
          const plato = seccion.addChild(new TreeNode({ tipo: 'plato', ...producto }));
          if (producto.unidad === 'libra') {
            porciones.forEach((texto) => plato.addChild(new TreeNode({ tipo: 'porcion', texto })));
          }
        });
    });
  return new NaryTree(raiz);
}
