import { useEffect, useMemo, useState } from 'react';
import { buildMenuTree } from '../helpers/menuTree';
import { supabase } from '../lib/supabase';

// Carga el menú una sola vez y lo comparte entre pantallas (caché del módulo).
let cache = null;

async function cargarMenu() {
  const [categorias, productos, ventas, configuracion] = await Promise.all([
    supabase.from('categorias').select('*').order('orden'),
    supabase.from('productos').select('*').order('orden'),
    supabase.from('ventas_por_producto').select('*'),
    supabase.from('configuracion').select('*').eq('id', 1).maybeSingle(),
  ]);
  const error = categorias.error || productos.error || ventas.error || configuracion.error;
  if (error) throw error;
  return {
    categorias: categorias.data,
    productos: productos.data,
    ventas: ventas.data,
    configuracion: configuracion.data,
  };
}

/** Obliga a recargar el menú la próxima vez (por ejemplo, tras editarlo en el panel). */
export function invalidarMenu() {
  cache = null;
}

const VACIO = { categorias: [], productos: [], ventas: [], configuracion: null };

export default function useMenu() {
  const [estado, setEstado] = useState(() => (
    cache?.datos ? { datos: cache.datos, cargando: false, error: null } : { datos: VACIO, cargando: Boolean(supabase), error: null }
  ));

  useEffect(() => {
    if (!supabase || cache?.datos) return undefined;
    let activo = true;
    cache ??= { promesa: cargarMenu() };
    cache.promesa
      .then((datos) => {
        if (cache) cache.datos = datos;
        if (activo) setEstado({ datos, cargando: false, error: null });
      })
      .catch(() => {
        cache = null;
        if (activo) setEstado({ datos: VACIO, cargando: false, error: 'No pudimos cargar el menú. Revisa tu conexión y recarga la página.' });
      });
    return () => { activo = false; };
  }, []);

  return useMemo(() => {
    const { categorias, productos } = estado.datos;
    return {
      ...estado.datos,
      cargando: estado.cargando,
      error: estado.error,
      productosPorId: Object.fromEntries(productos.map((p) => [p.id, p])),
      arbol: buildMenuTree(categorias, productos),
    };
  }, [estado]);
}
