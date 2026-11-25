// Iconos de trazo único (24 × 24). Mismo dibujo que la propuesta gráfica.
const TRAZOS = {
  canasta: <><path d="M4 9h16l-1.4 10.2a2 2 0 0 1-2 1.8H7.4a2 2 0 0 1-2-1.8L4 9Z" /><path d="M8.5 9 11 3.5M15.5 9 13 3.5" /><path d="M9 13v4M15 13v4" /></>,
  usuario: <><circle cx="12" cy="8" r="4" /><path d="M4 20.5c1.2-3.6 4.3-5.5 8-5.5s6.8 1.9 8 5.5" /></>,
  buscar: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m20 20-4.7-4.7" /></>,
  whatsapp: <><path d="M4 20.5 5.3 16A8.5 8.5 0 1 1 8.4 19L4 20.5Z" /><path d="M9.2 8.6c.3-.6.7-.6 1-.6.3 0 .5.1.7.6l.6 1.4c.1.3 0 .6-.2.8l-.5.6c.6 1.2 1.5 2.1 2.7 2.7l.6-.5c.2-.2.5-.3.8-.2l1.4.6c.5.2.6.4.6.7 0 .3 0 .7-.6 1-.6.4-1.4.5-2.3.2-2.2-.8-3.9-2.5-4.7-4.7-.3-.9-.2-1.7.2-2.3Z" /></>,
  deshacer: <><path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" /></>,
  mas: <path d="M12 5v14M5 12h14" />,
  menos: <path d="M5 12h14" />,
  cerrar: <path d="m6 6 12 12M18 6 6 18" />,
  check: <path d="m4.5 12.5 4.5 4.5 10.5-10.5" />,
  pin: <><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 1 1 13 0c0 5.4-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.3" /></>,
  reloj: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  subir: <><path d="M12 15V4M7.5 8.5 12 4l4.5 4.5" /><path d="M4.5 15v3.5a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5V15" /></>,
  flecha: <path d="M5 12h14M13 6l6 6-6 6" />,
  calendario: <><rect x="3.5" y="5" width="17" height="15" rx="1" /><path d="M3.5 9.5h17M8 3v4M16 3v4" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  salir: <><path d="M15 4h3.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H15" /><path d="M10 8l-4 4 4 4M6 12h10" /></>,
  cocina: <><path d="M6 10a6 6 0 0 1 12 0" /><path d="M4 10h16M5 14h14l-1 6H6l-1-6Z" /></>,
  camion: <><path d="M3 6h11v10H3zM14 9h4l3 3.5V16h-7" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></>,
  plato: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /></>,
  resumen: <path d="M4 20V10M10 20V4M16 20v-7M21 20H3" />,
};

export default function Icon({ name, className = '', ...props }) {
  return (
    <svg className={`icon ${className}`.trim()} viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      {TRAZOS[name]}
    </svg>
  );
}
