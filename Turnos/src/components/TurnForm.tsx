import { useState } from "react";

interface Props {
  onAdd: (description: string) => void;
}

function TurnForm({ onAdd }: Props) {
  const [description, setDescription] = useState("");

  const handleSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();
    if (!description.trim()) return;
    onAdd(description.trim());
    setDescription("");
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <input
          type="text"
          placeholder="Motivo del turno (ej. Consulta médica)"
          value={description}
          onChange={(evt) => setDescription(evt.target.value)}
        />
      </div>
      <button type="submit">Agregar turno a la fila</button>
    </form>
  );
}

export default TurnForm;
