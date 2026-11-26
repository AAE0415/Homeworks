import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const CONSULTA = '*, pedido_items(*), fechas_entrega(texto, fecha)';

// Un pedido con seguimiento en tiempo real: cuando la cocina cambia el estado en la base de datos,
// Supabase Realtime avisa y la pantalla se actualiza sola (sin recargar).
export default function useRealtimeOrder(pedidoId) {
  const [pedido, setPedido] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [conectado, setConectado] = useState(false);

  const recargar = useCallback(async () => {
    const { data } = await supabase.from('pedidos').select(CONSULTA).eq('id', pedidoId).maybeSingle();
    setPedido(data);
    setCargando(false);
  }, [pedidoId]);

  useEffect(() => {
    let activo = true;
    supabase.from('pedidos').select(CONSULTA).eq('id', pedidoId).maybeSingle().then(({ data }) => {
      if (!activo) return;
      setPedido(data);
      setCargando(false);
    });

    const canal = supabase
      .channel(`pedido-${pedidoId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'pedidos', filter: `id=eq.${pedidoId}` },
        ({ new: cambios }) => setPedido((p) => (p ? { ...p, ...cambios } : p)))
      .subscribe((estado) => setConectado(estado === 'SUBSCRIBED'));

    return () => {
      activo = false;
      supabase.removeChannel(canal);
    };
  }, [pedidoId]);

  return { pedido, cargando, conectado, recargar };
}
