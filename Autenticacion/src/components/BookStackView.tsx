import type { Book } from "../types";

interface Props {
  books: Book[];
}

function BookStackView({ books }: Props) {
  if (books.length === 0) {
    return <p className="empty-state">La pila está vacía.</p>;
  }

  return (
    <div className="stack">
      {books.map((book, index) => {
        const isTop = index === 0;
        return (
          <div className={isTop ? "book-card book-card-top" : "book-card"} key={book.id}>
            {isTop && <span className="top-badge">TOPE</span>}
            <p className="book-name">{book.name}</p>
            <p className="book-meta">{book.author}</p>
            <p className="book-meta book-meta-muted">
              {book.editorial} · ISBN {book.isbn}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default BookStackView;
