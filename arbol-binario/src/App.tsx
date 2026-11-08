import Tree from 'react-d3-tree';
import { ArbolBinario, aFormatoD3 } from './arbol';

// Serie de números a insertar en el árbol
const numeros = [25, 15, 50, 10, 22, 35, 70, 12, 18, 44, 66, 90, 11, 64];

const arbol = new ArbolBinario();
numeros.forEach((n) => arbol.insertar(n));

// Recorridos por consola
console.log('InOrden:  ', arbol.inorden().join(' '));
console.log('PostOrden:', arbol.postorden().join(' '));
console.log('PreOrden: ', arbol.preorden().join(' '));

// 1. Verificar si un valor está en el árbol
console.log('¿Está el 44?', arbol.buscar(44));
console.log('¿Está el 100?', arbol.buscar(100));

// 2. Datos en el formato de react-d3-tree
const datos = aFormatoD3(arbol.raiz!);

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Tree
        data={datos}
        orientation="vertical"
        pathFunc="straight"
        translate={{ x: window.innerWidth / 2, y: 60 }}
      />
    </div>
  );
}

export default App;
