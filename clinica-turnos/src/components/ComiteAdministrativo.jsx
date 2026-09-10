function ComiteAdministrativo({ comite, miembroActual, onAvanzar, onRetroceder }) {
  return (
    <section className="card">
      <h2>Comité administrativo</h2>
      <p className="subtitulo">Lista Circular Doblemente Enlazada</p>

      <div className="destacado">
        <p>Miembro seleccionado:</p>
        <h3>{miembroActual?.nombre}</h3>
        <p>{miembroActual?.cargo}</p>
        <div className="botones">
          <button onClick={onRetroceder}>&larr; Anterior</button>
          <button onClick={onAvanzar}>Siguiente &rarr;</button>
        </div>
      </div>

      <ul className="lista horizontal">
        {comite.map((c) => (
          <li
            key={c.nombre}
            className={c.nombre === miembroActual?.nombre ? 'activo' : ''}
          >
            {c.nombre}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ComiteAdministrativo;
