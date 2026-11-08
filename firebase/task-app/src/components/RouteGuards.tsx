import { Navigate, Outlet } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const FullScreenSpinner = () => (
  <div className="full-center">
    <Spinner animation="border" role="status" aria-label="Cargando" />
  </div>
);

/** Solo deja pasar a usuarios con sesión iniciada. */
export const PrivateRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <FullScreenSpinner />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

/** Login y registro: si ya hay sesión, redirige a las tareas. */
export const PublicRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <FullScreenSpinner />;
  return user ? <Navigate to="/" replace /> : <Outlet />;
};
