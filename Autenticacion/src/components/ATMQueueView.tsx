import type { Person } from "../types";
import { formatArrivalDate } from "../dataStructures/dateUtils";

interface Props {
  people: Person[];
}

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

function ATMQueueView({ people }: Props) {
  if (people.length === 0) {
    return <p className="empty-state">No hay personas en la fila.</p>;
  }

  return (
    <div className="queue-list">
      {people.map((person, index) => {
        const isFront = index === 0;
        return (
          <div className={isFront ? "person-card person-card-front" : "person-card"} key={person.id}>
            <div className="person-position">{index + 1}</div>
            <div className="person-info">
              <p className="person-name">
                {person.name} {isFront && <span className="front-badge">SIGUIENTE</span>}
              </p>
              <p className="person-meta">{currencyFormatter.format(person.withdrawalAmount)}</p>
              <p className="person-meta person-meta-muted">
                Cita asignada: {formatArrivalDate(person.arrivalDate)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ATMQueueView;
