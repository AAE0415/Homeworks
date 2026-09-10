import { useState } from 'react';

function PacientesEspera({ pacientes, onAgregar, onAtender, onAtenderSiguiente }) {
  const [nombre, setNombre] = useState('');
  const [motivo, setMotivo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    onAgregar(nombre, motivo || 'Consulta general');
    setNombre('');
    setMotivo('');
  };

  return (
    <section className="card">
      <h2>Pacientes en espera</h2>
      <p className="subtitulo">Lista Enlazada Simple</p>

      <form onSubmit={handleSubmit} className="form-row">
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del paciente"
        />
        <input
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          placeholder="Motivo de consulta"
        />
        <button type="submit">Agregar a la fila</button>
      </form>

      <button
        className="btn-primary"
        onClick={onAtenderSiguiente}
        disabled={pacientes.length === 0}
      >
        Atender siguiente turno ({pacientes.length})
      </button>

      <ol className="lista">
        {pacientes.map((p) => (
          <li key={p.id}>
            <span>
              <strong>{p.nombre}</strong> — {p.motivo}
            </span>
            <button onClick={() => onAtender(p.id)}>Atender</button>
          </li>
        ))}
        {pacientes.length === 0 && (
          <p className="vacio">No hay pacientes en espera</p>
        )}
      </ol>
    </section>
  );
}

export default PacientesEspera;
