import { supabase } from '@/lib/supabaseClient';

export const revalidate = 300; // refresca cada 5 minutos

async function getCounts() {
  const [bloques, ejercicios, examenes] = await Promise.all([
    supabase.from('bloques').select('id', { count: 'exact', head: true }),
    supabase.from('ejercicios').select('id', { count: 'exact', head: true }),
    supabase.from('examenes').select('id', { count: 'exact', head: true }),
  ]);
  return {
    bloques: bloques.count ?? 0,
    ejercicios: ejercicios.count ?? 0,
    examenes: examenes.count ?? 0,
  };
}

export default async function HomePage() {
  const counts = await getCounts();

  return (
    <>
      <div className="kicker">
        <span className="live-dot"></span> {counts.bloques} bloques ·{' '}
        {counts.ejercicios} ejercicios con resolución paso a paso ·{' '}
        {counts.examenes} examenes reales
      </div>
      <h1>Prepara la PAU de Matemáticas II</h1>
      <p className="lede">
        Temario completo, banco de ejercicios resueltos paso a paso, un
        mini-simulacro cronometrado y una hemeroteca de examenes reales de la
        Comunitat Valenciana. Todo en un solo sitio, gratis.
      </p>

      <div className="grid-cards">
        <a className="block-card" href="/temario">
          <h3>📘 Temario</h3>
          <p>
            Álgebra, Análisis, Geometría y Probabilidad — explicado desde
            cero, con la notación y el nivel exacto de la PAU.
          </p>
        </a>
        <a className="block-card" href="/ejercicios">
          <h3>✏️ Banco de ejercicios</h3>
          <p>
            Ejercicios filtrables por bloque, con solución final y
            explicación paso a paso de cada uno.
          </p>
        </a>
        <a className="block-card" href="/simulacro">
          <h3>⏱️ Mini-simulacro</h3>
          <p>
            Pon a prueba tu tiempo con una selección de ejercicios
            cronometrada, como el día del examen.
          </p>
        </a>
        <a className="block-card" href="/hemeroteca">
          <h3>🗂️ Hemeroteca</h3>
          <p>
            Examenes reales de convocatorias anteriores de la Comunitat
            Valenciana, con sus soluciones.
          </p>
        </a>
      </div>
    </>
  );
}
