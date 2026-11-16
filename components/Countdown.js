'use client';

import { useEffect, useState } from 'react';

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}

// Cronómetro aislado en su propio componente: su "tick" de cada segundo
// solo vuelve a renderizar este componente, nunca a su padre. Así el resto
// de la página (los enunciados con fórmulas de MathJax) no se repinta cada
// segundo, que es lo que estaba deshaciendo el renderizado de las fórmulas.
export default function Countdown({ totalSeconds, onFinish }) {
  const [restantes, setRestantes] = useState(totalSeconds);

  useEffect(() => {
    setRestantes(totalSeconds);
    const intervalId = setInterval(() => {
      setRestantes((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          onFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalSeconds]);

  return <span className="timer">⏱ {formatTime(restantes)}</span>;
}
