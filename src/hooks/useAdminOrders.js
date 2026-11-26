import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const CONSULTA = '*, pedido_items(*), fechas_entrega(id, texto, fecha, cupo)';

// Todos los pedidos para la administradora, con el perfil del cliente y en tiempo real:
// si entra un pedido nuevo o cambia uno, la bandeja y la agenda se actualizan solas.
export default function useAdminOrders() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    const [p, perfiles] = await Promise.all([
      supabase.from('pedidos').select(CONSULTA).order('created_at'),
      supabase.from('profiles').select('id, nombre, telefono'),
    ]);
    if (p.error || perfiles.error) {
      setError('No pudimos cargar los pedidos. Revisa tu conexión.');
      setCargando(false);
      return;
    }
    const porId = Object.fromEntries(perfiles.data.map((x) => [x.id, x]));
    setPedidos(p.data.map((x) => ({ ...x, cliente: porId[x.user_id] ?? null })));
    setError(null);
    setCargando(false);
  }, []);

  useEffect(() => {
    let activo = true;
    const recargar = () => { if (activo) cargar(); };
    recargar();
    const canal = supabase.channel('admin-pedidos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pedidos' }, recargar)
      .subscribe();
    return () => { activo = false; supabase.removeChannel(canal); };
  }, [cargar]);

  const actualizar = useCallback(async (id, cambios) => {
    // Cambio optimista: la pantalla responde de inmediato y luego confirma con la base
    setPedidos((lista) => lista.map((x) => (x.id === id ? { ...x, ...cambios } : x)));
    const { error: e } = await supabase.from('pedidos').update(cambios).eq('id', id);
    if (e) { await cargar(); return { error: 'No pudimos guardar el cambio. Inténtalo de nuevo.' }; }
    return { ok: true };
  }, [cargar]);

  const cambiarEstado = useCallback((id, estado) => actualizar(id, { estado }), [actualizar]);
  const anotarDomicilio = useCallback((id, valor) => actualizar(id, { domicilio_acordado: valor === '' ? null : Number(valor) }), [actualizar]);

  const urlComprobante = useCallback(async (ruta) => {
    if (!ruta) return null;
    const { data } = await supabase.storage.from('comprobantes').createSignedUrl(ruta, 60 * 10);
    return data?.signedUrl ?? null;
  }, []);

  return { pedidos, cargando, error, recargar: cargar, cambiarEstado, anotarDomicilio, urlComprobante };
}
