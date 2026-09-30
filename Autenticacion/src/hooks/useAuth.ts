import { useEffect, useState } from "react";

// Credenciales de prueba para esta demo (normalmente vendrían de una API)
const VALID_EMAIL = "user@mail.com";
const VALID_PASSWORD = "123";

// Custom Hook: encapsula toda la lógica de autenticación (useState + useEffect).
// Regla de los custom hooks: el nombre DEBE empezar con "use" para que React
// pueda aplicarle las reglas de los hooks internamente.
export function useAuth() {
  // El estado inicial se lee de localStorage, así la sesión sobrevive a un refresh de página
  const [user, setUser] = useState<string | null>(() => {
    return localStorage.getItem("auth_user");
  });

  // Cada vez que "user" cambia, sincronizamos ese valor con localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("auth_user", user);
    } else {
      localStorage.removeItem("auth_user");
    }
  }, [user]);

  // Retorna true si las credenciales son correctas, false en caso contrario
  const login = (email: string, password: string): boolean => {
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      setUser(email);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return { user, login, logout };
}
