import { useRef, useState } from "react";
import { Queue } from "./dataStructures/Queue";
import { buildMockPeople } from "./dataStructures/mockData";
import { generateRandomArrivalDate } from "./dataStructures/dateUtils";
import type { Person } from "./types";
import PersonForm from "./components/PersonForm";
import ATMQueueView from "./components/ATMQueueView";

function crearColaDelCajero(): Queue<Person> {
  // El comparador ordena por fecha de llegada ascendente: quien tenga la fecha más
  // próxima queda al frente, sin importar en qué orden se haya registrado.
  const queue = new Queue<Person>((a, b) => a.arrivalDate.getTime() - b.arrivalDate.getTime());
  buildMockPeople().forEach((person) => queue.enqueue(person));
  return queue;
}

function App() {
  const queueRef = useRef<Queue<Person>>(crearColaDelCajero());
  const queue = queueRef.current;

  // La cola muta su arreglo interno directamente, así que forzamos el re-render con este tick
  const [, forceRender] = useState(0);
  const rerender = () => forceRender((tick) => tick + 1);

  const handleAddPerson = (name: string, withdrawalAmount: number) => {
    const newPerson: Person = {
      id: Date.now(),
      name,
      withdrawalAmount,
      arrivalDate: generateRandomArrivalDate(), // el sistema asigna la fecha, no el usuario
    };
    queue.enqueue(newPerson); // aquí ocurre el reordenamiento por fecha
    rerender();
  };

  const handleAttendNext = () => {
    queue.dequeue();
    rerender();
  };

  const people = queue.print();

  return (
    <div className="app-container">
      <header className="app-header">
        <span className="app-kicker">Estructuras de Datos II</span>
        <h1 className="app-title">Fila del cajero automático</h1>
        <p className="app-subtitle">
          {queue.size()} {queue.size() === 1 ? "persona" : "personas"} en la fila · ordenado por
          fecha de llegada asignada por el sistema
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

export default App;
