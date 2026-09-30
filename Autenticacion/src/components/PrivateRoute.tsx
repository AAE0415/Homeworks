import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

interface Props {
  children: ReactElement;
}

function PrivateRoute({ children }: Props) {
  const { user } = useAuthContext();

  // Si no hay usuario autenticado en el contexto, se le niega el acceso
  // y se le redirige al login (replace evita que quede en el historial)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;
