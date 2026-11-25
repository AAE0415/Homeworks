import { createContext } from 'react';

// Contexto de sesión: { user, perfil, cargando, ... }. El proveedor está en AuthProvider.jsx.
export const AuthContext = createContext(null);
