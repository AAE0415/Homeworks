import { useState } from "react";

interface Props {
  onAdd: (book: { name: string; isbn: string; author: string; editorial: string }) => void;
}

const EMPTY_FORM = { name: "", isbn: "", author: "", editorial: "" };

function BookForm({ onAdd }: Props) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  const handleChange = (field: keyof typeof EMPTY_FORM) => (evt: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: evt.target.value }));
  };

  const handleSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();
    const { name, isbn, author, editorial } = form;
    if (!name.trim() || !isbn.trim() || !author.trim() || !editorial.trim()) {
      setError("Completa los 4 campos para agregar el libro.");
      return;
    }
    onAdd({ name: name.trim(), isbn: isbn.trim(), author: author.trim(), editorial: editorial.trim() });
    setForm(EMPTY_FORM);
    setError("");
  };

  return (
    <form className="side-form" onSubmit={handleSubmit}>
      <h2 className="section-title">Nuevo libro</h2>

      <label className="field">
        <span>Nombre</span>
        <input type="text" value={form.name} onChange={handleChange("name")} placeholder="Ej. Rayuela" />
      </label>

      <label className="field">
        <span>ISBN</span>
        <input type="text" value={form.isbn} onChange={handleChange("isbn")} placeholder="Ej. 978-8420671397" />
      </label>

      <label className="field">
        <span>Autor</span>
        <input type="text" value={form.author} onChange={handleChange("author")} placeholder="Ej. Julio Cortázar" />
      </label>

      <label className="field">
        <span>Editorial</span>
        <input type="text" value={form.editorial} onChange={handleChange("editorial")} placeholder="Ej. Alfaguara" />
      </label>

      {error && <span className="form-error">{error}</span>}

      <button type="submit">Agregar al tope de la pila</button>
    </form>
  );
}

export default BookForm;
