import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import SongsPage from "./pages/SongsPage";
import HistoryPage from "./pages/HistoryPage";

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/canciones" replace />} />
          <Route path="/canciones" element={<SongsPage />} />
          <Route path="/historial" element={<HistoryPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
