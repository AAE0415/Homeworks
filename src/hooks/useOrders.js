import { useCallback } from 'react';
import { validarComprobante } from '../helpers/validacion';
import { supabase } from '../lib/supabase';
import useAuth from './useAuth';

// Los errores de crear_pedido ya vienen en español desde la base de datos
const mensaje = (error) => (error?.message && !/fetch|network/i.test(error.message)
  ? error.message
  : 'No pudimos completar la operación. Revisa tu conexión e inténtalo de nuevo.');

// Operaciones del cliente sobre sus pedidos.
export default function useOrders() {
  const { user } = useAuth();

  /** Crea el pedido con la transacción crear_pedido (valida cupos y toma precios reales). */
  const crearPedido = useCallback(async ({ fecha_entrega_id, personas, nombre_recibe, barrio_id, direccion, notas, items }) => {
    const { data, error } = await supabase.rpc('crear_pedido', {
      p_fecha_entrega_id: fecha_entrega_id,
      p_personas: Number(personas),
      p_nombre_recibe: nombre_recibe.trim(),
      p_barrio_id: barrio_id,
      p_direccion: direccion.trim(),
      p_notas: notas?.trim() || null,
      p_items: items.map((i) => ({ producto_id: i.id, cantidad: i.cantidad, porciones: i.porciones ?? '' })),
    });
    return error ? { error: mensaje(error) } : { id: data };
  }, []);

  /** Sube el comprobante a Storage (carpeta del usuario) y lo registra en el pedido. */
  const subirComprobante = useCallback(async (pedidoId, archivo) => {
    const invalido = validarComprobante(archivo);
    if (invalido) return { error: invalido };
    const extension = archivo.name?.split('.').pop()?.toLowerCase() || (archivo.type === 'application/pdf' ? 'pdf' : 'jpg');
    const ruta = `${user.id}/${pedidoId}-${Date.now()}.${extension}`;
    const subida = await supabase.storage.from('comprobantes').upload(ruta, archivo, { contentType: archivo.type });
    if (subida.error) return { error: 'No pudimos subir el archivo. Revisa tu conexión e inténtalo de nuevo.' };
    const { error } = await supabase.rpc('registrar_comprobante', { p_pedido_id: pedidoId, p_url: ruta });
    return error ? { error: mensaje(error) } : { ok: true, ruta };
  }, [user]);

  /** Enlace temporal para ver un comprobante privado. */
  const urlComprobante = useCallback(async (ruta) => {
    const { data } = await supabase.storage.from('comprobantes').createSignedUrl(ruta, 60 * 10);
    return data?.signedUrl ?? null;
  }, []);

  return { crearPedido, subirComprobante, urlComprobante };
}
