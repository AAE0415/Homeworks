import type { Turn } from "../types";

interface Props {
  turns: Turn[];
  currentId?: number;
}

function TurnQueueList({ turns, currentId }: Props) {
  if (turns.length === 0) {
    return <p className="empty-state">No hay turnos en la fila.</p>;
  }

  return (
    <div className="node-track">
      {turns.map((turn, index) => {
        const isActive = turn.id === currentId;
        const isLast = index === turns.length - 1;

        return (
          <div className="node-group" key={turn.id}>
            <div className={isActive ? "node-box node-box-active" : "node-box"}>
              <span className="node-value">{turn.code}</span>
            </div>
            <span className="node-arrow">{isLast ? "↩ vuelve al inicio" : "→"}</span>
          </div>
        );
      })}
    </div>
  );
}

export default TurnQueueList;
