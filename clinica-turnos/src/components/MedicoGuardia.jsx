function MedicoGuardia({ medicos, medicoActual, segundosParaRotar, onRotarManual }) {
  return (
    <section className="card">
      <h2>Médico de guardia</h2>
      <p className="subtitulo">Lista Circular (rotación automática cada 10s)</p>

      <div className="destacado">
        <p>Médico de guardia actual:</p>
        <h3>{medicoActual?.nombre}</h3>
        <p>{medicoActual?.especialidad}</p>
        <p className="meta">Próxima rotación automática en {segundosParaRotar}s</p>
        <button className="btn-primary" onClick={onRotarManual}>
          Rotar ahora
        </button>
      </div>

      <ul className="lista horizontal">
        {medicos.map((m) => (
          <li
            key={m.nombre}
            className={m.nombre === medicoActual?.nombre ? 'activo' : ''}
          >
            {m.nombre}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default MedicoGuardia;
