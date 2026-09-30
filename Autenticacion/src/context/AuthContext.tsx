import { createContext, useContext, type ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

interface AuthContextType {
  user: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

// Paso 1: crear el contexto
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

// Paso 2: el Provider llama al custom hook useAuth() y expone user/login/logout
// a todos sus componentes hijos mediante value={{ ... }}
export function AuthProvider({ children }: Props) {
  const { user, login, logout } = useAuth();

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook de conveniencia: envuelve useContext(AuthContext) y valida que se use
// dentro del <AuthProvider>. Así, en vez de escribir useContext(AuthContext)
// en cada página, simplemente llamamos useAuthContext().
export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext debe usarse dentro de un <AuthProvider>");
  }
  return context;
}
