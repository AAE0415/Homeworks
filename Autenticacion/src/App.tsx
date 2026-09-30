import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthContext } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import BooksPage from "./pages/BooksPage";
import ATMPage from "./pages/ATMPage";
import NotFound from "./pages/NotFound";

function App() {
  const { user } = useAuthContext();

  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Routes>
          {/* Ruta raíz: si ya hay sesión, va directo a libros; si no, al login */}
          <Route path="/" element={<Navigate to={user ? "/libros" : "/login"} replace />} />

          {/* Ruta pública */}
          <Route path="/login" element={<Login />} />

          {/* Rutas privadas: cada una envuelta en PrivateRoute */}
          <Route
            path="/libros"
            element={
              <PrivateRoute>
                <BooksPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/cajero"
            element={
              <PrivateRoute>
                <ATMPage />
              </PrivateRoute>
            }
          />

          {/* Página 404 con ruta comodín */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
