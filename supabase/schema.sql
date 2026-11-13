-- supabase/schema.sql
--
-- Esquema de base de datos para PAU Mates (Comunitat Valenciana).
-- Ejecuta este archivo en Supabase: Project > SQL Editor > New query > pega
-- y ejecuta. Crea las tablas y activa Row Level Security con políticas de
-- solo lectura pública (cualquiera puede leer, nadie puede escribir salvo
-- con la service-role key, que se usa únicamente en scripts/seed.mjs).

create table if not exists comunidades (
  id text primary key,
  nombre text not null,
  created_at timestamptz not null default now()
);

create table if not exists bloques (
  id text primary key,
  nombre text not null,
  orden int not null,
  resumen text,
  secciones jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ejercicios (
  id text primary key,
  bloque text not null references bloques(id) on delete cascade,
  subtema text not null,
  tipo text not null,
  tipo_label text not null,
  enunciado text not null,
  solucion text not null,
  pasos jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_ejercicios_bloque on ejercicios(bloque);

create table if not exists examenes (
  id text primary key,
  comunidad_id text references comunidades(id),
  comunidad text not null,
  convocatoria text not null,
  anio int not null,
  fase text not null,
  url text not null,
  fuente text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_examenes_anio on examenes(anio desc);

-- Row Level Security: lectura pública, escritura solo con service-role key.
alter table comunidades enable row level security;
alter table bloques enable row level security;
alter table ejercicios enable row level security;
alter table examenes enable row level security;

drop policy if exists "public read comunidades" on comunidades;
create policy "public read comunidades" on comunidades for select using (true);

drop policy if exists "public read bloques" on bloques;
create policy "public read bloques" on bloques for select using (true);

drop policy if exists "public read ejercicios" on ejercicios;
create policy "public read ejercicios" on ejercicios for select using (true);

drop policy if exists "public read examenes" on examenes;
create policy "public read examenes" on examenes for select using (true);
