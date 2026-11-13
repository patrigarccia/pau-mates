'use client';

import { useEffect, useRef, useState } from 'react';
import MathJaxTypeset from '@/components/MathJaxTypeset';
import ExerciseCard from '@/components/ExerciseCard';

const DURACION_MIN = 20; // minutos, ajustable por el usuario abajo

function pickOnePerBloque(ejercicios) {
  const porBloque = {};
  for (const e of ejercicios) {
    if (!porBloque[e.bloque]) porBloque[e.bloque] = [];
    porBloque[e.bloque].push(e);
  }
  const elegidos = [];
  for (const bloque of Object.keys(porBloque)) {
    const lista = porBloque[bloque];
    const idx = Math.floor(Math.random() * lista.length);
    elegidos.push(lista[idx]);
  }
  return elegidos;
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}

export default function SimulacroView({ ejercicios }) {
  const [estado, setEstado] = useState('inicio'); // inicio | corriendo | terminado
  const [minutos, setMinutos] = useState(DURACION_MIN);
  const [segundosRestantes, setSegundosRestantes] = useState(DURACION_MIN * 60);
  const [seleccion, setSeleccion] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function iniciar() {
    const elegidos = pickOnePerBloque(ejercicios);
    setSeleccion(elegidos);
    setSegundosRestantes(minutos * 60);
    setEstado('corriendo');

    intervalRef.current = setInterval(() => {
      setSegundosRestantes((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setEstado('terminado');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function terminarAhora() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setEstado('terminado');
  }

  function reiniciar() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setEstado('inicio');
    setSeleccion([]);
  }

  if (estado === 'inicio') {
    return (
      <div className="card">
        <h3>Configura tu simulacro</h3>
        <p style={{ color: 'var(--text-dim)' }}>
          Se elegirá un ejercicio al azar de cada uno de los 4 bloques.
        </p>
        <label style={{ display: 'block', marginBottom: 16 }}>
          Tiempo disponible:{' '}
          <select
            value={minutos}
            onChange={(e) => setMinutos(Number(e.target.value))}
            style={{
              marginLeft: 8,
              padding: '6px 10px',
              borderRadius: 8,
              background: 'var(--bg-soft)',
              color: 'var(--text)',
              border: '1px solid var(--line)',
            }}
          >
            <option value={10}>10 minutos</option>
            <option value={20}>20 minutos</option>
            <option value={30}>30 minutos</option>
            <option value={45}>45 minutos</option>
          </select>
        </label>
        <button className="btn" onClick={iniciar}>
          Empezar simulacro
        </button>
      </div>
    );
  }

  if (estado === 'corriendo') {
    return (
      <>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <span className="timer">⏱ {formatTime(segundosRestantes)}</span>
          <button className="btn secondary" onClick={terminarAhora}>
            Terminar y ver soluciones
          </button>
        </div>

        {seleccion.map((ex, i) => (
          <div className="card" key={ex.id}>
            <div className="tags">
              <span className="tag subtema">{ex.subtema}</span>
            </div>
            <p>
              <strong>{i + 1}.</strong>{' '}
              <span dangerouslySetInnerHTML={{ __html: ex.enunciado }} />
            </p>
          </div>
        ))}

        <MathJaxTypeset deps={[seleccion]} />
      </>
    );
  }

  // estado === 'terminado'
  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <span className="tag" style={{ fontSize: '0.9rem' }}>
          Simulacro terminado — revisa las soluciones
        </span>
        <button className="btn secondary" onClick={reiniciar}>
          Hacer otro simulacro
        </button>
      </div>

      {seleccion.map((ex, i) => (
        <ExerciseCard ex={ex} index={i} key={ex.id} />
      ))}

      <MathJaxTypeset deps={[seleccion]} />
    </>
  );
}
