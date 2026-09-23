import { useRef, useState } from "react";
import { Stack } from "./dataStructures/Stack";
import { MOCK_BOOKS } from "./dataStructures/mockData";
import type { Book } from "./types";
import BookForm from "./components/BookForm";
import BookStackView from "./components/BookStackView";

function crearPilaDeLibros(): Stack<Book> {
  const stack = new Stack<Book>();
  MOCK_BOOKS.forEach((book) => stack.push(book));
  return stack;
}

function App() {
  // La instancia de la pila persiste entre renders
  const stackRef = useRef<Stack<Book>>(crearPilaDeLibros());
  const stack = stackRef.current;

  // La pila muta el arreglo interno directamente, así que forzamos el re-render con este tick
  const [, forceRender] = useState(0);
  const rerender = () => forceRender((tick) => tick + 1);

  const handleAddBook = (data: Omit<Book, "id">) => {
    stack.push({ id: Date.now(), ...data });
    rerender();
  };

  const handleRemoveTop = () => {
    stack.pop();
    rerender();
  };

  const books = stack.print(); // arreglo ordenado desde el tope hacia la base

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Pila de libros</h1>
        <p className="app-subtitle">
          {stack.size()} {stack.size() === 1 ? "libro" : "libros"} en la pila · principio LIFO
        </p>
      </header>

      <div className="layout">
        <BookForm onAdd={handleAddBook} />

        <section>
          <div className="section-heading">
            <h2 className="section-title">Contenido de la pila</h2>
            <button
              className="ghost-button"
              onClick={handleRemoveTop}
              disabled={stack.isEmpty()}
            >
              Quitar el del Máximo 
            </button>
          </div>
          <BookStackView books={books} />
        </section>
      </div>
    </div>
  );
}

export default App;
