import { useRef, useState } from "react";
import { CircularLinkedList } from "./dataStructures/CircularLinkedList";
import { MOCK_TURNS } from "./dataStructures/mockData";
import type { Turn } from "./types";
import TurnDisplay from "./components/TurnDisplay";
import TurnForm from "./components/TurnForm";
import TurnControls from "./components/TurnControls";
import TurnQueueList from "./components/TurnQueueList";

function crearFilaDeTurnos(): CircularLinkedList<Turn> {
  const fila = new CircularLinkedList<Turn>();
  MOCK_TURNS.forEach((turn) => fila.append(turn));
  return fila;
}

function App() {
  // La instancia de la lista circular persiste entre renders
  const queueRef = useRef<CircularLinkedList<Turn>>(crearFilaDeTurnos());
  const queue = queueRef.current;

  // Contador para generar códigos de turno secuenciales (T-004, T-005, ...)
  const nextCodeRef = useRef<number>(MOCK_TURNS.length + 1);

  // La lista muta en el propio objeto
  const [, forceRender] = useState(0);
  const rerender = () => forceRender((tick) => tick + 1);

  const handleAddTurn = (description: string) => {
    const code = `T-${String(nextCodeRef.current).padStart(3, "0")}`;
    nextCodeRef.current += 1;
    queue.append({ id: Date.now(), code, description });
    rerender();
  };

  const handleNextTurn = () => {
    queue.advance();
    rerender();
  };

  const turns = queue.toArray();
  const currentTurn = queue.current?.value ?? null;

  return (
    <div className="app-container">
      <h1 className="app-title">Sistema de turnos</h1>
      <p className="page-subtitle">
        Lista circular enlazada · {queue.size()} turnos en la fila
      </p>

      {/* Prop: turn desciende de App -> TurnDisplay */}
      <TurnDisplay turn={currentTurn} />

      {/* Prop: onNext desciende de App -> TurnControls */}
      <TurnControls onNext={handleNextTurn} disabled={turns.length === 0} />

      {/* Prop: onAdd desciende de App -> TurnForm */}
      <TurnForm onAdd={handleAddTurn} />

      {/* Props: turns y currentId descienden de App -> TurnQueueList */}
      <TurnQueueList turns={turns} currentId={currentTurn?.id} />
    </div>
  );
}

export default App;
