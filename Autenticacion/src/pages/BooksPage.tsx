import { useRef, useState } from "react";
import { Stack } from "../dataStructures/Stack";
import { MOCK_BOOKS } from "../data/mockBooks";
import type { Book } from "../types";
import BookForm from "../components/BookForm";
import BookStackView from "../components/BookStackView";

function crearPilaDeLibros(): Stack<Book> {
  const stack = new Stack<Book>();
  MOCK_BOOKS.forEach((book) => stack.push(book));
  return stack;
}

function BooksPage() {
  const stackRef = useRef<Stack<Book>>(crearPilaDeLibros());
  const stack = stackRef.current;

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

  const books = stack.print();

  return (
    <div className="page page-purple">
      <header className="page-header">
        <span className="page-kicker">Página privada · Challenge 04</span>
        <h1 className="page-title">Pila de libros</h1>
        <p className="page-subtitle">
          {stack.size()} {stack.size() === 1 ? "libro" : "libros"} · principio LIFO
        </p>
      </header>

      <div className="layout">
        <BookForm onAdd={handleAddBook} />
        <section>
          <div className="section-heading">
            <h2 className="section-title">Contenido de la pila</h2>
            <button className="ghost-button" onClick={handleRemoveTop} disabled={stack.isEmpty()}>
              Quitar el del tope (pop)
            </button>
          </div>
          <BookStackView books={books} />
        </section>
      </div>
    </div>
  );
}

export default BooksPage;
