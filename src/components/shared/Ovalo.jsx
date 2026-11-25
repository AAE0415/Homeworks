// Óvalo rojo trazado a mano que encierra una fecha. "dibujar" anima el trazo.
export default function Ovalo({ dibujar = false, className = '' }) {
  return (
    <svg className={`ovalo ${dibujar ? 'ovalo--dibuja' : ''} ${className}`.trim()} viewBox="0 0 100 60"
      preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="M20 9C42-1 84 3 93 23c8 18-14 34-45 34C20 56 3 44 7 26 10 14 24 7 44 5" />
    </svg>
  );
}
