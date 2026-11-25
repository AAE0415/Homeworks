import { Route, Routes } from 'react-router-dom';
import Layout from '../components/shared/Layout';
import Canasta from '../pages/Canasta/Canasta';
import Cobertura from '../pages/Cobertura/Cobertura';
import Index from '../pages/Index/Index';
import Login from '../pages/Login/Login';
import Menu from '../pages/Menu/Menu';
import NotFound from '../pages/NotFound/NotFound';
import Plato from '../pages/Plato/Plato';
import Registro from '../pages/Registro/Registro';
import AdminRoutes from './AdminRoutes';
import UserRoutes from './UserRoutes';

// Rutas públicas; monta las privadas de cliente (/cuenta) y de administración (/admin).
export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Index />} />
        <Route path="menu" element={<Menu />} />
        <Route path="plato/:id" element={<Plato />} />
        <Route path="canasta" element={<Canasta />} />
        <Route path="cobertura" element={<Cobertura />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />
        <Route path="cuenta/*" element={<UserRoutes />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="admin/*" element={<AdminRoutes />} />
    </Routes>
  );
}
