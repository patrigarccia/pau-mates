import { supabase } from '@/lib/supabaseClient';
import TemarioView from './TemarioView';

export const revalidate = 300;

export const metadata = {
  title: 'Temario — PAU Mates CV',
};

async function getBloques() {
  const { data, error } = await supabase
    .from('bloques')
    .select('id, nombre, orden, resumen, secciones')
    .order('orden', { ascending: true });

  if (error) {
    console.error('Error cargando bloques:', error.message);
    return [];
  }
  return data || [];
}

export default async function TemarioPage() {
  const bloques = await getBloques();

  return (
    <>
      <div className="kicker">
        <span className="live-dot"></span> Temario completo · {bloques.length}{' '}
        bloques
      </div>
      <h1>Temario</h1>
      <p className="lede">
        Repaso completo de los cuatro bloques de Matemáticas II: Álgebra,
        Análisis, Geometría y Probabilidad y Estadística.
      </p>

      {bloques.length === 0 ? (
        <p className="empty-state">
          No se ha podido cargar el temario. Comprueba que la base de datos
          de Supabase está configurada y tiene datos (ver README.md).
        </p>
      ) : (
        <TemarioView bloques={bloques} />
      )}
    </>
  );
}
