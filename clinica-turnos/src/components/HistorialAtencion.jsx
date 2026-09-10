function HistorialAtencion({ historial }) {
  return (
    <section className="card">
      <h2>Historial de atención</h2>
      <p className="subtitulo">Lista Doblemente Enlazada</p>

      <ul className="lista">
        {historial.map((h, idx) => (
          <li key={`${h.id}-${idx}`}>
            <span>
              <strong>{h.nombre}</strong> — {h.motivo}
            </span>
            <span className="meta">
              Atendido por {h.medico} · {h.fecha}
            </span>
          </li>
        ))}
        {historial.length === 0 && (
          <p className="vacio">Aún no se han atendido pacientes</p>
        )}
      </ul>
    </section>
  );
}

export default HistorialAtencion;
