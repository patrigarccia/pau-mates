'use client';

// Tarjeta de ejercicio reutilizada en /ejercicios y /simulacro: enunciado,
// y un desplegable con la resolución paso a paso + solución final.
export default function ExerciseCard({ ex, index }) {
  const pasos = Array.isArray(ex.pasos) ? ex.pasos : [];

  return (
    <div className="card">
      <div className="tags">
        <span className="tag subtema">{ex.subtema}</span>
        <span className="tag">{ex.tipo_label || ex.tipoLabel}</span>
      </div>
      <p>
        <strong>{index != null ? `Ejercicio ${index + 1}.` : 'Ejercicio.'}</strong>{' '}
        <span dangerouslySetInnerHTML={{ __html: ex.enunciado }} />
      </p>
      <details>
        <summary>Ver resolución paso a paso</summary>
        <div className="sol">
          {pasos.length > 0 && (
            <ol className="steps">
              {pasos.map((p, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: p }} />
              ))}
            </ol>
          )}
          <p className="final-answer">
            <strong>Solución final:</strong>{' '}
            <span dangerouslySetInnerHTML={{ __html: ex.solucion }} />
          </p>
        </div>
      </details>
    </div>
  );
}
