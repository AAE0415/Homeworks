import { useRef, useState } from "react";
import { DoublyLinkedList } from "../dataStructures/DoublyLinkedList";
import { MOCK_HISTORY } from "../dataStructures/mockData";
import type { VisitedPage } from "../types";

function crearHistorial(): DoublyLinkedList<VisitedPage> {
  const historial = new DoublyLinkedList<VisitedPage>();
  MOCK_HISTORY.forEach((page) => historial.append(page));
  // Simulamos que el usuario ya navegó hasta la mitad del historial
  historial.current = historial.peek(MOCK_HISTORY[2]);
  return historial;
}

function HistoryPage() {
  const historyRef = useRef<DoublyLinkedList<VisitedPage>>(crearHistorial());
  const history = historyRef.current;

  const [, forceRender] = useState(0);
  const rerender = () => forceRender((tick) => tick + 1);

  const handleBack = () => {
    if (history.goBack()) rerender();
  };

  const handleForward = () => {
    if (history.goForward()) rerender();
  };

  const pages = history.toArray();
  const currentPage = history.current?.value;
  const canGoBack = history.current?.prev !== null && history.current?.prev !== undefined;
  const canGoForward = history.current?.next !== null && history.current?.next !== undefined;

  return (
    <div className="page">
      <h1 className="page-title">Historial de navegación</h1>
      <p className="page-subtitle">
        Lista doblemente enlazada · {history.size()} páginas visitadas
      </p>

      <div className="browser-bar">
        <button
          className="browser-nav-btn"
          onClick={handleBack}
          disabled={!canGoBack}
          aria-label="Atrás"
        >
          ←
        </button>
        <button
          className="browser-nav-btn"
          onClick={handleForward}
          disabled={!canGoForward}
          aria-label="Adelante"
        >
          →
        </button>
        <span className="browser-url">{currentPage?.url}</span>
      </div>

      <div className="now-playing">
        <span className="now-playing-label">Página actual</span>
        <p className="now-playing-title">{currentPage?.title}</p>
        <p className="now-playing-artist">{currentPage?.url}</p>
      </div>

      <div className="node-track">
        {pages.map((page, index) => {
          const isActive = page.url === currentPage?.url;
          return (
            <div className="node-group" key={page.url}>
              <div className={isActive ? "node-box node-box-active" : "node-box"}>
                <span className="node-value">{page.title}</span>
              </div>
              {index < pages.length - 1 && <span className="node-arrow">↔</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HistoryPage;
