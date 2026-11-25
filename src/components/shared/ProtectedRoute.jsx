import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Loader from './Loader';

// Guardia de rutas privadas. Sin sesión: al login con "volver". Rol distinto: a inicio.
export default function ProtectedRoute({ requireRole }) {
  const { user, perfil, cargando } = useAuth();
  const { pathname, search } = useLocation();

  if (cargando) return <Loader texto="Revisando tu sesión…" />;
  if (!user) return <Navigate to={`/login?volver=${encodeURIComponent(pathname + search)}`} replace />;
  if (requireRole && perfil?.rol !== requireRole) return <Navigate to="/" replace />;
  return <Outlet />;
}
