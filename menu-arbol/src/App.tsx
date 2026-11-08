import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import { raiz, dfs } from './arbol';

function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <Sidebar nodo={raiz} />

        <main className="contenido">
          <Routes>
            {/* Una ruta por cada nodo del árbol, con su link y su componente */}
            {dfs(raiz).map((nodo) => (
              <Route
                key={nodo.valor.link}
                path={nodo.valor.link}
                element={nodo.valor.componente}
              />
            ))}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
