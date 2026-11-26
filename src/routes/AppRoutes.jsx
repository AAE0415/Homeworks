import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from '../components/shared/Layout';
import Loader from '../components/shared/Loader';
import Canasta from '../pages/Canasta/Canasta';
import Index from '../pages/Index/Index';
import Login from '../pages/Login/Login';
import Menu from '../pages/Menu/Menu';
import NotFound from '../pages/NotFound/NotFound';
import Plato from '../pages/Plato/Plato';
import Registro from '../pages/Registro/Registro';

// Se cargan aparte (solo cuando se visitan): el mapa, la cuenta del cliente y el panel de administración.
const Cobertura = lazy(() => import('../pages/Cobertura/Cobertura'));
const UserRoutes = lazy(() => import('./UserRoutes'));
const AdminRoutes = lazy(() => import('./AdminRoutes'));

const diferida = (elemento) => <Suspense fallback={<Loader />}>{elemento}</Suspense>;

// Rutas públicas; monta las privadas de cliente (/cuenta) y de administración (/admin).
export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Index />} />
        <Route path="menu" element={<Menu />} />
        <Route path="plato/:id" element={<Plato />} />
        <Route path="canasta" element={<Canasta />} />
        <Route path="cobertura" element={diferida(<Cobertura />)} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />
        <Route path="cuenta/*" element={diferida(<UserRoutes />)} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="admin/*" element={diferida(<AdminRoutes />)} />
    </Routes>
  );
}
