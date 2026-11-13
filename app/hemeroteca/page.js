import { supabase } from '@/lib/supabaseClient';

export const revalidate = 300;

export const metadata = {
  title: 'Hemeroteca — PAU Mates CV',
};

async function getExamenes() {
  const { data, error } = await supabase
    .from('examenes')
    .select('id, comunidad, convocatoria, anio, fase, url, fuente')
    .order('anio', { ascending: false });

  if (error) {
    console.error('Error cargando examenes:', error.message);
    return [];
  }
  return data || [];
}

export default async function HemerotecaPage() {
  const examenes = await getExamenes();

  return (
    <>
      <div className="kicker">
        <span className="live-dot"></span> {examenes.length} examenes reales
      </div>
      <h1>Hemeroteca</h1>
      <p className="lede">
        Examenes reales de la PAU — Matemáticas II, Comunitat Valenciana, de
        convocatorias anteriores. Los PDFs enlazan a su fuente original o a
        una resolución publicada por un profesor; no se rehospedan aquí.
      </p>

      {examenes.length === 0 ? (
        <p className="empty-state">
          No se ha podido cargar la hemeroteca. Comprueba la configuración de
          Supabase (ver README.md).
        </p>
      ) : (
        <table className="exam-table">
          <thead>
            <tr>
              <th>Convocatoria</th>
              <th>Año</th>
              <th>Fase</th>
              <th>Fuente</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {examenes.map((ex) => (
              <tr key={ex.id}>
                <td>{ex.convocatoria}</td>
                <td>{ex.anio}</td>
                <td>{ex.fase}</td>
                <td style={{ color: 'var(--text-dim)' }}>{ex.fuente}</td>
                <td>
                  <a href={ex.url} target="_blank" rel="noopener noreferrer">
                    Ver PDF ↗
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
