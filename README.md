# PAU Mates — Comunitat Valenciana (Matemáticas II)

Plataforma web real (no una maqueta) para preparar la PAU de Matemáticas II
en la Comunitat Valenciana: temario completo, banco de ejercicios con
resolución paso a paso, un mini-simulacro cronometrado y una hemeroteca de
examenes reales.

Construido con **Next.js 14 (App Router)** + **Supabase** (Postgres). Se
despliega gratis en Vercel + Supabase.

## Estructura del proyecto

```
app/            Páginas (App Router): /, /temario, /ejercicios, /simulacro, /hemeroteca
components/     Componentes reutilizables (tarjeta de ejercicio, typeset de MathJax)
lib/            Cliente de Supabase
data/           content.json — contenido original (temario, ejercicios, examenes)
scripts/        seed.mjs — sube data/content.json a Supabase
supabase/       schema.sql — esquema de las tablas + políticas de seguridad (RLS)
```

## 1. Crear el proyecto en Supabase

1. Crea una cuenta gratis en [supabase.com](https://supabase.com) y un
   nuevo proyecto.
2. Ve a **SQL Editor** → **New query**, pega el contenido de
   `supabase/schema.sql` y ejecútalo. Esto crea las tablas
   (`comunidades`, `bloques`, `ejercicios`, `examenes`) con Row Level
   Security activado: cualquiera puede **leer**, nadie puede escribir sin
   la clave de servicio.
3. Ve a **Project Settings → API** y copia:
   - `Project URL`
   - clave `anon public`
   - clave `service_role` (¡secreta! nunca la subas a git ni la pongas en
     código del navegador)

## 2. Configurar las variables de entorno

```bash
cp .env.example .env.local
```

Rellena `.env.local` con los tres valores anteriores.

## 3. Instalar dependencias

```bash
npm install
```

## 4. Subir el contenido a la base de datos (seed)

```bash
node --env-file=.env.local scripts/seed.mjs
```

Esto sube los 4 bloques de temario (20 secciones en total), los 48
ejercicios con resolución paso a paso, y los 4 examenes de la hemeroteca.
Puedes volver a ejecutarlo siempre que cambies `data/content.json`: usa
`upsert`, así que no duplica filas.

## 5. Arrancar en local

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## 6. Desplegar gratis (Vercel + Supabase)

1. Sube este proyecto a un repositorio de GitHub.
2. Entra en [vercel.com](https://vercel.com), "Add New Project", importa
   el repo.
3. En **Environment Variables** añade `NEXT_PUBLIC_SUPABASE_URL` y
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` (la `service_role` **no** se necesita en
   Vercel: el seed se ejecuta una vez, desde tu máquina o desde una GitHub
   Action, no en cada despliegue).
4. Despliega. Cada vez que hagas `git push`, Vercel reconstruye el sitio
   automáticamente.

## Ampliar el contenido más adelante

Para añadir más ejercicios, secciones de temario o examenes:

1. Añade los nuevos documentos a `data/content.json` (sigue el mismo
   formato que los existentes).
2. Vuelve a ejecutar `node --env-file=.env.local scripts/seed.mjs`.

No hace falta tocar el código de las páginas: leen siempre de Supabase.

## Nota sobre el origen del contenido

El temario y los ejercicios son contenido original, escrito para este
proyecto (no copiado de libros de texto con copyright). Los examenes de la
hemeroteca **no se rehospedan**: la tabla `examenes` solo guarda enlaces a
su fuente original (la Generalitat Valenciana) o a resoluciones publicadas
por profesores, con su atribución correspondiente.
