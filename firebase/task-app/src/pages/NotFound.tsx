import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="full-center text-center">
    <div>
      <h1>Página no encontrada</h1>
      <p>La dirección que buscas no existe.</p>
      <Link to="/">Volver al inicio</Link>
    </div>
  </div>
);

export default NotFound;
