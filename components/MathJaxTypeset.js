'use client';

import { useEffect } from 'react';

// Vuelve a pedirle a MathJax que renderice el LaTeX de la página cada vez
// que cambia `deps` (por ejemplo, al cambiar de filtro o cargar datos).
// MathJax se carga de forma asíncrona desde app/layout.js, así que
// comprobamos que window.MathJax.typesetPromise ya exista.
export default function MathJaxTypeset({ deps = [] }) {
  useEffect(() => {
    let cancelled = false;
    let attempts = 0;

    function tryTypeset() {
      if (cancelled) return;
      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise().catch(() => {});
      } else if (attempts < 20) {
        attempts += 1;
        setTimeout(tryTypeset, 150);
      }
    }

    tryTypeset();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return null;
}
