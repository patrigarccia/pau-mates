'use client';

import { useMemo, useState } from 'react';
import MathJaxTypeset from '@/components/MathJaxTypeset';
import ExerciseCard from '@/components/ExerciseCard';

export default function EjerciciosView({ bloques, ejercicios }) {
  const [filtro, setFiltro] = useState('todos');

  const filtrados = useMemo(() => {
    if (filtro === 'todos') return ejercicios;
    return ejercicios.filter((e) => e.bloque === filtro);
  }, [filtro, ejercicios]);

  return (
    <>
      <div className="filters">
        <button
          className={filtro === 'todos' ? 'active' : ''}
          onClick={() => setFiltro('todos')}
        >
          Todos
        </button>
        {bloques.map((b) => (
          <button
            key={b.id}
            className={filtro === b.id ? 'active' : ''}
            onClick={() => setFiltro(b.id)}
          >
            {b.nombre}
          </button>
        ))}
      </div>

      {filtrados.map((ex, i) => (
        <ExerciseCard ex={ex} index={i} key={ex.id} />
      ))}

      <MathJaxTypeset deps={[filtro]} />
    </>
  );
}
