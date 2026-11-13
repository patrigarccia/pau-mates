'use client';

import { useState } from 'react';
import MathJaxTypeset from '@/components/MathJaxTypeset';

export default function TemarioView({ bloques }) {
  const [activo, setActivo] = useState(bloques[0]?.id || null);
  const bloque = bloques.find((b) => b.id === activo) || bloques[0];

  return (
    <>
      <div className="filters">
        {bloques.map((b) => (
          <button
            key={b.id}
            className={b.id === activo ? 'active' : ''}
            onClick={() => setActivo(b.id)}
          >
            {b.nombre}
          </button>
        ))}
      </div>

      {bloque && (
        <div>
          <p className="lede">{bloque.resumen}</p>
          {(bloque.secciones || []).map((s, i) => (
            <div className="card" key={i}>
              <h3>{s.titulo}</h3>
              <div dangerouslySetInnerHTML={{ __html: s.html }} />
            </div>
          ))}
        </div>
      )}

      <MathJaxTypeset deps={[activo]} />
    </>
  );
}
