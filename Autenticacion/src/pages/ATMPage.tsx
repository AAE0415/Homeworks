import { useRef, useState } from "react";
import { Queue } from "../dataStructures/Queue";
import { buildMockPeople } from "../data/mockPeople";
import { generateRandomArrivalDate } from "../dataStructures/dateUtils";
import type { Person } from "../types";
import PersonForm from "../components/PersonForm";
import ATMQueueView from "../components/ATMQueueView";

function crearColaDelCajero(): Queue<Person> {
  const queue = new Queue<Person>((a, b) => a.arrivalDate.getTime() - b.arrivalDate.getTime());
  buildMockPeople().forEach((person) => queue.enqueue(person));
  return queue;
}

function ATMPage() {
  const queueRef = useRef<Queue<Person>>(crearColaDelCajero());
  const queue = queueRef.current;

  const [, forceRender] = useState(0);
  const rerender = () => forceRender((tick) => tick + 1);

  const handleAddPerson = (name: string, withdrawalAmount: number) => {
    const newPerson: Person = {
      id: Date.now(),
      name,
      withdrawalAmount,
      arrivalDate: generateRandomArrivalDate(),
    };
    queue.enqueue(newPerson);
    rerender();
  };

  const handleAttendNext = () => {
    queue.dequeue();
    rerender();
  };

  const people = queue.print();

  return (
    <div className="page page-blue">
      <header className="page-header">
        <span className="page-kicker">Página privada · Challenge 05</span>
        <h1 className="page-title">Fila del cajero automático</h1>
        <p className="page-subtitle">
          {queue.size()} {queue.size() === 1 ? "persona" : "personas"} · ordenado por fecha de cita
        </p>
      </header>

      <div className="layout">
        <PersonForm onAdd={handleAddPerson} />
        <section>
          <div className="section-heading">
            <h2 className="section-title">Fila actual</h2>
            <button className="ghost-button" onClick={handleAttendNext} disabled={queue.isEmpty()}>
              Atender siguiente (dequeue)
            </button>
          </div>
          <ATMQueueView people={people} />
        </section>
      </div>
    </div>
  );
}

export default ATMPage;
