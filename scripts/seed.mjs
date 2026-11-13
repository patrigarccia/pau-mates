// scripts/seed.mjs
//
// Sube el contenido de data/content.json a las tablas de Supabase definidas
// en supabase/schema.sql. Usa la service-role key (acceso total, solo en
// servidor) porque las tablas tienen RLS activado y solo permiten lectura
// pública; los inserts/updates necesitan saltarse esa política.
//
// Uso:
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed.mjs
// o, si tienes un .env.local con esas variables:
//   node --env-file=.env.local scripts/seed.mjs

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    'Faltan variables de entorno. Necesitas SUPABASE_URL (o NEXT_PUBLIC_SUPABASE_URL) y SUPABASE_SERVICE_ROLE_KEY.\n' +
    'Cópialas desde Supabase > Project Settings > API.'
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const dataPath = path.join(__dirname, '..', 'data', 'content.json');
const raw = readFileSync(dataPath, 'utf-8');
const data = JSON.parse(raw);

async function upsert(table, rows, label) {
  if (!rows || rows.length === 0) {
    console.log(`(${label}) nada que insertar`);
    return;
  }
  const { error, count } = await supabase
    .from(table)
    .upsert(rows, { onConflict: 'id', count: 'exact' });
  if (error) {
    console.error(`Error insertando en ${table}:`, error.message);
    process.exitCode = 1;
    return;
  }
  console.log(`✔ ${label}: ${rows.length} filas (upsert en "${table}")`);
}

async function main() {
  console.log('Seed: conectando a', SUPABASE_URL);

  // 1) comunidades
  const comunidades = (data.comunidades || []).map((c) => ({
    id: c.id,
    nombre: c.nombre,
  }));
  await upsert('comunidades', comunidades, 'comunidades');

  // 2) bloques (el temario)
  const bloques = (data.bloques || []).map((b) => ({
    id: b.id,
    nombre: b.nombre,
    orden: b.orden,
    resumen: b.resumen,
    secciones: b.secciones || [],
  }));
  await upsert('bloques', bloques, 'bloques');

  // 3) ejercicios (banco de ejercicios, con pasos)
  const ejercicios = (data.ejercicios || []).map((e) => ({
    id: e.id,
    bloque: e.bloque,
    subtema: e.subtema,
    tipo: e.tipo,
    tipo_label: e.tipoLabel,
    enunciado: e.enunciado,
    solucion: e.solucion,
    pasos: e.pasos || [],
  }));
  await upsert('ejercicios', ejercicios, 'ejercicios');

  // 4) examenes (hemeroteca)
  const examenes = (data.examenes || []).map((ex) => ({
    id: ex.id,
    comunidad_id: ex.comunidadId || null,
    comunidad: ex.comunidad,
    convocatoria: ex.convocatoria,
    anio: ex.anio,
    fase: ex.fase,
    url: ex.url,
    fuente: ex.fuente,
  }));
  await upsert('examenes', examenes, 'examenes');

  console.log('Seed completado.');
}

main().catch((err) => {
  console.error('Fallo inesperado en el seed:', err);
  process.exitCode = 1;
});
