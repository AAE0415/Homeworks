import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import type { Nodo } from './arbol';

interface Props {
  nodo: Nodo;
}

// Imprime un nodo y, de forma recursiva, sus hijos (submenús)
function ItemSidebar({ nodo }: Props) {
  const [abierto, setAbierto] = useState(false);
  const tieneHijos = nodo.hijos.length > 0;

  return (
    <li>
      <NavLink
        to={nodo.valor.link}
        end
        className="item"
        onClick={() => tieneHijos && setAbierto(!abierto)}
      >
        {nodo.valor.titulo}
        {tieneHijos && <span className={abierto ? 'flecha abierta' : 'flecha'}>▶</span>}
      </NavLink>

      {tieneHijos && abierto && (
        <ul className="submenu">
          {nodo.hijos.map((hijo) => (
            <ItemSidebar key={hijo.valor.link} nodo={hijo} />
          ))}
        </ul>
      )}
    </li>
  );
}

// El sidebar imprime los hijos de la raíz
function Sidebar({ nodo }: Props) {
  return (
    <nav className="sidebar">
      <ul>
        {nodo.hijos.map((hijo) => (
          <ItemSidebar key={hijo.valor.link} nodo={hijo} />
        ))}
      </ul>
    </nav>
  );
}

export default Sidebar;
