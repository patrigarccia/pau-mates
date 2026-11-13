import { supabase } from '@/lib/supabaseClient';
import EjerciciosView from './EjerciciosView';

export const revalidate = 300;

export const metadata = {
  title: 'Banco de ejercicios — PAU Mates CV',
};

async function getData() {
  const [bloquesRes, ejerciciosRes] = await Promise.all([
    supabase.from('bloques').select('id, nombre, orden').order('orden'),
    supabase
      .from('ejercicios')
      .select('id, bloque, subtema, tipo, tipo_label, enunciado, solucion, pasos')
      .order('id'),
  ]);

  if (bloquesRes.error) console.error(bloquesRes.error.message);
  if (ejerciciosRes.error) console.error(ejerciciosRes.error.message);

  return {
    bloques: bloquesRes.data || [],
    ejercicios: ejerciciosRes.data || [],
  };
}

export default async function EjerciciosPage() {
  const { bloques, ejercicios } = await getData();

  return (
    <>
      <div className="kicker">
        <span className="live-dot"></span> {ejercicios.length} ejercicios con
        resolución paso a paso
      </div>
      <h1>Banco de ejercicios</h1>
      <p className="lede">
        Filtra por bloque y abre cada ejercicio para ver su resolución
        explicada paso a paso, no solo el resultado final.
      </p>

      {ejercicios.length === 0 ? (
        <p className="empty-state">
          No se ha podido cargar el banco de ejercicios. Comprueba la
          configuración de Supabase (ver README.md).
        </p>
      ) : (
        <EjerciciosView bloques={bloques} ejercicios={ejercicios} />
      )}
    </>
  );
}
