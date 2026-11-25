import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import Checkout from '../pages/Checkout/Checkout';
import MisPedidos from '../pages/MisPedidos/MisPedidos';
import PedidoEnVivo from '../pages/PedidoEnVivo/PedidoEnVivo';
import Perfil from '../pages/Perfil/Perfil';

// Rutas privadas del cliente, montadas en /cuenta/*. Requieren sesión.
export default function UserRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="checkout" element={<Checkout />} />
        <Route path="pedidos" element={<MisPedidos />} />
        <Route path="pedidos/:id" element={<PedidoEnVivo />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="*" element={<Navigate to="/cuenta/pedidos" replace />} />
      </Route>
    </Routes>
  );
}
