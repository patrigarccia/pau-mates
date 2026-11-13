import { supabase } from '@/lib/supabaseClient';
import SimulacroView from './SimulacroView';

export const revalidate = 300;

export const metadata = {
  title: 'Mini-simulacro — PAU Mates CV',
};

async function getEjercicios() {
  const { data, error } = await supabase
    .from('ejercicios')
    .select('id, bloque, subtema, tipo, tipo_label, enunciado, solucion, pasos')
    .order('id');

  if (error) {
    console.error('Error cargando ejercicios:', error.message);
    return [];
  }
  return data || [];
}

export default async function SimulacroPage() {
  const ejercicios = await getEjercicios();

  return (
    <>
      <div className="kicker">
        <span className="live-dot"></span> Mini-simulacro cronometrado
      </div>
      <h1>Mini-simulacro</h1>
      <p className="lede">
        Elige cuántos ejercicios quieres (uno de cada bloque, al azar) y
        pon en marcha el cronómetro. Al terminar verás todas las soluciones
        explicadas paso a paso.
      </p>

      {ejercicios.length === 0 ? (
        <p className="empty-state">
          No se ha podido cargar el banco de ejercicios. Comprueba la
          configuración de Supabase (ver README.md).
        </p>
      ) : (
        <SimulacroView ejercicios={ejercicios} />
      )}
    </>
  );
}
