import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// Fechas de entrega con sus cupos ocupados (vista pública fechas_disponibilidad).
export default function useFechas() {
  const [estado, setEstado] = useState({ fechas: [], cargando: Boolean(supabase), error: null });

  useEffect(() => {
    if (!supabase) return undefined;
    let activo = true;
    supabase.from('fechas_disponibilidad').select('*').order('fecha').then(({ data, error }) => {
      if (!activo) return;
      setEstado(error
        ? { fechas: [], cargando: false, error: 'No pudimos cargar las fechas de entrega.' }
        : { fechas: data, cargando: false, error: null });
    });
    return () => { activo = false; };
  }, []);

  return estado;
}
