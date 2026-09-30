import { NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const linkStyle = ({ isActive }: { isActive: boolean }) =>
    isActive ? "nav-link nav-link-active" : "nav-link";

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar">
      <span className="navbar-brand">Context API Demo</span>

      {user && (
        <div className="navbar-links">
          <NavLink to="/libros" className={linkStyle}>
            Pila de libros
          </NavLink>
          <NavLink to="/cajero" className={linkStyle}>
            Cola del cajero
          </NavLink>
        </div>
      )}

      <div className="navbar-user">
        {user ? (
          <>
            <span className="navbar-username">Hola, {user}</span>
            <button className="logout-button" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <span className="navbar-username">No has iniciado sesión</span>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
