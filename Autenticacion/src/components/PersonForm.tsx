import { useState } from "react";

interface Props {
  onAdd: (name: string, withdrawalAmount: number) => void;
}

function PersonForm({ onAdd }: Props) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();
    const parsedAmount = Number(amount);
    if (!name.trim() || !amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Ingresa un nombre y un monto válido a retirar.");
      return;
    }
    onAdd(name.trim(), parsedAmount);
    setName("");
    setAmount("");
    setError("");
  };

  return (
    <form className="side-form" onSubmit={handleSubmit}>
      <h2 className="section-title">Nueva persona en la fila</h2>
      <p className="section-hint">El sistema le asignará una fecha de llegada automáticamente.</p>

      <label className="field">
        <span>Nombre</span>
        <input type="text" value={name} onChange={(evt) => setName(evt.target.value)} placeholder="Ej. Juan Pérez" />
      </label>

      <label className="field">
        <span>Monto a retirar (COP)</span>
        <input
          type="number"
          value={amount}
          onChange={(evt) => setAmount(evt.target.value)}
          placeholder="Ej. 150000"
          min="0"
        />
      </label>

      {error && <span className="form-error">{error}</span>}

      <button type="submit">Agregar a la fila</button>
    </form>
  );
}

export default PersonForm;
