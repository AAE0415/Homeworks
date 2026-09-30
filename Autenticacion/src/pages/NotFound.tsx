import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="page">
      <h1 className="page-title">404</h1>
      <p className="page-subtitle">Esta página no existe.</p>
      <Link className="nav-link nav-link-active" to="/login">
        Volver al login
      </Link>
    </div>
  );
}

export default NotFound;
