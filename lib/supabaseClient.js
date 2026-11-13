// lib/supabaseClient.js
//
// Cliente de Supabase para usar en Server Components y Client Components.
// Usa siempre la clave "anon" (pública): las tablas tienen RLS activado
// y solo permiten SELECT, así que esta clave nunca puede escribir datos
// aunque alguien la vea en el navegador.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // No lanzamos un error duro en build para no romper `next build` si
  // alguien todavía no ha configurado las variables; pero avisamos claro
  // en consola para que se note rápido en desarrollo.
  console.warn(
    '[supabaseClient] Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
    'Copia .env.example a .env.local y rellena los valores de tu proyecto Supabase.'
  );
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: { persistSession: false },
  }
);
