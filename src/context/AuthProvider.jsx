import { useCallback, useMemo, useState } from 'react';
import { AuthContext } from './authContext';

const CLAVE_DEMO = 'delilicias:demo-sesion';

// PROVISIONAL (Hito 2): sesión simulada solo en desarrollo para probar las guardias de rutas.
// En el Hito 4 se reemplaza por Supabase Auth con el mismo contrato:
// { user, perfil, cargando, login, registrar, logout, actualizarPerfil }.
function leerDemo() {
  if (!import.meta.env.DEV) return null;
  try { return JSON.parse(localStorage.getItem(CLAVE_DEMO)); } catch { return null; }
}

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(leerDemo);

  const entrarDemo = useCallback((rol) => {
    const demo = { user: { id: `demo-${rol}` }, perfil: { id: `demo-${rol}`, nombre: rol === 'admin' ? 'Administradora' : 'Laura Gómez', rol } };
    localStorage.setItem(CLAVE_DEMO, JSON.stringify(demo));
    setSesion(demo);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(CLAVE_DEMO);
    setSesion(null);
  }, []);

  const valor = useMemo(() => ({
    user: sesion?.user ?? null,
    perfil: sesion?.perfil ?? null,
    cargando: false,
    entrarDemo,
    logout,
  }), [sesion, entrarDemo, logout]);

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
