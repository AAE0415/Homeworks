import { useState } from "react";

interface Props {
  onAdd: (name: string, phone: string) => void;
}

function ContactForm({ onAdd }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();

    if (!name.trim() || !phone.trim()) {
      setError("Debes ingresar nombre y teléfono");
      return;
    }

    onAdd(name.trim(), phone.trim());
    setName("");
    setPhone("");
    setError("");
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(evt) => setName(evt.target.value)}
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={phone}
          onChange={(evt) => setPhone(evt.target.value)}
        />
      </div>
      {error && <span className="form-error">{error}</span>}
      <button type="submit">Agregar contacto</button>
    </form>
  );
}

export default ContactForm;
