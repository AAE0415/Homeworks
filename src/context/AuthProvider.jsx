import { useCallback, useEffect, useMemo, useState } from 'react';
import { limpiarTelefono, traducirErrorAuth } from '../helpers/validacion';
import { supabase, supabaseConfigurado } from '../lib/supabase';
import { AuthContext } from './authContext';

// Sesión real con Supabase Auth. Contrato:
// { user, perfil, cargando, configurado, login, registrar, logout, actualizarPerfil }
// Las funciones devuelven { error: string } en español, o { ok: true }.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(supabaseConfigurado);
  // id del usuario cuyo perfil ya se intentó cargar (evita mostrar rutas con el perfil a medias)
  const [perfilDe, setPerfilDe] = useState(null);

  const cargarPerfil = useCallback(async (usuario) => {
    if (!usuario) { setPerfil(null); setPerfilDe(null); return; }
    const { data } = await supabase.from('profiles').select('*').eq('id', usuario.id).maybeSingle();
    setPerfil(data ?? null);
    setPerfilDe(usuario.id);
  }, []);

  useEffect(() => {
    if (!supabaseConfigurado) return undefined;
    let activo = true;

    supabase.auth.getSession().then(async ({ data }) => {
      const usuario = data.session?.user ?? null;
      if (!activo) return;
      setUser(usuario);
      await cargarPerfil(usuario);
      if (activo) setCargandoSesion(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_evento, session) => {
      const usuario = session?.user ?? null;
      setUser(usuario);
      // Fuera del callback para no bloquear el cliente de auth
      setTimeout(() => cargarPerfil(usuario), 0);
    });

    return () => { activo = false; sub.subscription.unsubscribe(); };
  }, [cargarPerfil]);

  const login = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    return error ? { error: traducirErrorAuth(error) } : { ok: true };
  }, []);

  const registrar = useCallback(async ({ nombre, telefono, barrio_id, email, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { nombre: nombre.trim(), telefono: limpiarTelefono(telefono), barrio_id } },
    });
    if (error) return { error: traducirErrorAuth(error) };
    // Si el proyecto exige confirmar el correo, no hay sesión todavía
    return { ok: true, confirmarCorreo: !data.session };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setPerfil(null);
  }, []);

  const actualizarPerfil = useCallback(async ({ nombre, telefono, barrio_id }) => {
    const cambios = { nombre: nombre.trim(), telefono: limpiarTelefono(telefono), barrio_id };
    const { data, error } = await supabase.from('profiles').update(cambios).eq('id', user.id).select().single();
    if (error) return { error: traducirErrorAuth(error) };
    setPerfil(data);
    return { ok: true };
  }, [user]);

  const cargando = cargandoSesion || Boolean(user && perfilDe !== user.id);

  const valor = useMemo(() => ({
    user, perfil, cargando, configurado: supabaseConfigurado, login, registrar, logout, actualizarPerfil,
  }), [user, perfil, cargando, login, registrar, logout, actualizarPerfil]);

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
