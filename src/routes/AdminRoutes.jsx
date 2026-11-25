import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from '../components/shared/AdminLayout';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import Agenda from '../pages/admin/Agenda/Agenda';
import Anticipos from '../pages/admin/Anticipos/Anticipos';
import Cupos from '../pages/admin/Cupos/Cupos';
import MenuAdmin from '../pages/admin/MenuAdmin/MenuAdmin';
import PedidoDetalle from '../pages/admin/PedidoDetalle/PedidoDetalle';
import Resumen from '../pages/admin/Resumen/Resumen';

// Rutas de administración, montadas en /admin/*. Requieren rol "admin".
export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute requireRole="admin" />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Resumen />} />
          <Route path="anticipos" element={<Anticipos />} />
          <Route path="agenda" element={<Agenda />} />
          <Route path="pedidos/:id" element={<PedidoDetalle />} />
          <Route path="menu" element={<MenuAdmin />} />
          <Route path="cupos" element={<Cupos />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
