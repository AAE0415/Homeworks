import { NavLink } from "react-router-dom";

function Navbar() {
  const linkStyle = ({ isActive }: { isActive: boolean }) =>
    isActive ? "nav-link nav-link-active" : "nav-link";

  return (
    <nav className="navbar">
      <span className="navbar-brand">Estructuras de Datos II</span>
      <div className="navbar-links">
        <NavLink to="/canciones" className={linkStyle}>
          Lista enlazada (canciones)
        </NavLink>
        <NavLink to="/historial" className={linkStyle}>
          Lista doblemente enlazada (historial)
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
