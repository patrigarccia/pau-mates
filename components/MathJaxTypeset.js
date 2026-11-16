'use client';

import { useEffect } from 'react';

// Vuelve a pedirle a MathJax que renderice el LaTeX de la página cada vez
// que cambia `deps` (por ejemplo, al cambiar de filtro o cargar datos).
//
// MathJax se carga de forma asíncrona desde app/layout.js (CDN), y puede
// tardar varios segundos en redes lentas o en el primer arranque del
// servidor de desarrollo. En vez de rendirnos tras un par de segundos,
// usamos la propia promesa de arranque de MathJax (`MathJax.startup.promise`,
// que la librería crea sola en cuanto se define `window.MathJax`) para saber
// con certeza cuándo está lista — sin límite de tiempo corto.
export default function MathJaxTypeset({ deps = [] }) {
  useEffect(() => {
    let cancelled = false;
    let pollId = null;

    function typeset() {
      if (cancelled) return;
      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise().catch(() => {});
      }
    }

    function waitAndTypeset() {
      if (cancelled) return;
      if (window.MathJax && window.MathJax.startup && window.MathJax.startup.promise) {
        window.MathJax.startup.promise.then(typeset);
        return;
      }
      // Todavía no existe window.MathJax.startup (el script del CDN no ha
      // terminado de cargar). Reintentamos cada 300ms, hasta 60 segundos.
      let attempts = 0;
      pollId = setInterval(() => {
        attempts += 1;
        if (cancelled) {
          clearInterval(pollId);
          return;
        }
        if (window.MathJax && window.MathJax.startup && window.MathJax.startup.promise) {
          clearInterval(pollId);
          window.MathJax.startup.promise.then(typeset);
        } else if (attempts > 200) {
          clearInterval(pollId);
        }
      }, 300);
    }

    waitAndTypeset();

    return () => {
      cancelled = true;
      if (pollId) clearInterval(pollId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return null;
}
