import { createClient } from '@supabase/supabase-js';

// Cliente único de Supabase para toda la app. La llave es la "publishable" (pública):
// la seguridad real la dan las políticas RLS de supabase/schema.sql.
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_KEY;

export const supabaseConfigurado = Boolean(url && key);

export const supabase = supabaseConfigurado ? createClient(url, key) : null;
