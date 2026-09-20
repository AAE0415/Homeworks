import { useEffect, useState } from "react";
import type { Turn } from "../types";

interface Props {
  turn: Turn | null;
}

function TurnDisplay({ turn }: Props) {
  const [message, setMessage] = useState("");

  // Se ejecuta cada vez que cambia el turno actual (dependencia: turn?.id).
  // Este es el requisito: "usar useEffect para mostrar un mensaje cada vez que el turno cambia".
  useEffect(() => {
    if (!turn) {
      setMessage("No hay turnos en la fila todavía.");
      return;
    }
    setMessage(`Ahora atendiendo el turno ${turn.code} — ${turn.description}`);
  }, [turn?.id]);

  return (
    <div className="now-playing">
      <span className="now-playing-label">Turno actual</span>
      <p className="now-playing-title">{turn?.code ?? "—"}</p>
      <p className="now-playing-artist">{turn?.description ?? "Sin turnos en la fila"}</p>
      <p className="turn-message">{message}</p>
    </div>
  );
}

export default TurnDisplay;
