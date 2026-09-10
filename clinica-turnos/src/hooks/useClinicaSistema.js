import { useRef, useState, useEffect, useCallback } from 'react';
import { SinglyLinkedList } from '../structures/SinglyLinkedList';
import { DoublyLinkedList } from '../structures/DoublyLinkedList';
import { CircularLinkedList } from '../structures/CircularLinkedList';
import { CircularDoublyLinkedList } from '../structures/CircularDoublyLinkedList';

let idCounter = 1000;
const SEGUNDOS_ROTACION = 10;

export function useClinicaSistema() {
  // Las listas son clases mutables -> viven en useRef para conservar
  // la misma instancia (y sus nodos) entre renders de React.
  const pacientesRef = useRef(new SinglyLinkedList());
  const historialRef = useRef(new DoublyLinkedList());
  const medicosRef = useRef(new CircularLinkedList());
  const comiteRef = useRef(new CircularDoublyLinkedList());
  const inicializado = useRef(false);

  // Como mutar una lista no dispara render, usamos un "tick" para forzarlo.
  const [, setTick] = useState(0);
  const forceUpdate = useCallback(() => setTick((t) => t + 1), []);

  const [segundosParaRotar, setSegundosParaRotar] = useState(SEGUNDOS_ROTACION);

  // Carga inicial de datos simulados (mock) - solo una vez
  useEffect(() => {
    if (inicializado.current) return;
    inicializado.current = true;

    const pacientes = pacientesRef.current;
    pacientes.append({ id: idCounter++, nombre: 'Laura Gómez', motivo: 'Control general' });
    pacientes.append({ id: idCounter++, nombre: 'Carlos Pérez', motivo: 'Dolor abdominal' });
    pacientes.append({ id: idCounter++, nombre: 'Ana Torres', motivo: 'Fiebre' });

    const medicos = medicosRef.current;
    medicos.append({ nombre: 'Dr. Jonathan López', especialidad: 'Medicina General' });
    medicos.append({ nombre: 'Dra. Valentina Ríos', especialidad: 'Pediatría' });
    medicos.append({ nombre: 'Dr. Andrés Salazar', especialidad: 'Urgencias' });

    const comite = comiteRef.current;
    comite.append({ nombre: 'Dra. Marcela Ortiz', cargo: 'Directora Médica' });
    comite.append({ nombre: 'Dr. Felipe Castro', cargo: 'Subdirector' });
    comite.append({ nombre: 'Ing. Daniela Ruiz', cargo: 'Coordinadora TI' });

    forceUpdate();
  }, [forceUpdate]);

  // Rotación automática de médico de guardia cada 10 segundos (setInterval)
  useEffect(() => {
    const rotacion = setInterval(() => {
      medicosRef.current.rotate();
      setSegundosParaRotar(SEGUNDOS_ROTACION);
      forceUpdate();
    }, SEGUNDOS_ROTACION * 1000);

    const contador = setInterval(() => {
      setSegundosParaRotar((prev) => (prev > 1 ? prev - 1 : SEGUNDOS_ROTACION));
    }, 1000);

    // cleanup: limpia los intervalos al desmontar el componente
    return () => {
      clearInterval(rotacion);
      clearInterval(contador);
    };
  }, [forceUpdate]);

  // ---------- Acciones sobre las listas ----------

  const agregarPaciente = (nombre, motivo) => {
    pacientesRef.current.append({ id: idCounter++, nombre, motivo });
    forceUpdate();
  };

  // Atender un paciente puntual: se elimina de la lista simple
  // y se agrega (prepend) al historial doblemente enlazado.
  const atenderPaciente = (id) => {
    const paciente = pacientesRef.current.remove(id);
    if (paciente) {
      const medicoActual = medicosRef.current.getCurrent();
      historialRef.current.prepend({
        ...paciente,
        medico: medicoActual?.nombre ?? 'Sin asignar',
        fecha: new Date().toLocaleTimeString(),
      });
    }
    forceUpdate();
  };

  // Atender al paciente que lleva más tiempo esperando (cabeza de la fila)
  const atenderSiguiente = () => {
    const paciente = pacientesRef.current.removeFirst();
    if (paciente) {
      const medicoActual = medicosRef.current.getCurrent();
      historialRef.current.prepend({
        ...paciente,
        medico: medicoActual?.nombre ?? 'Sin asignar',
        fecha: new Date().toLocaleTimeString(),
      });
    }
    forceUpdate();
  };

  const rotarMedicoManual = () => {
    medicosRef.current.rotate();
    setSegundosParaRotar(SEGUNDOS_ROTACION);
    forceUpdate();
  };

  const avanzarComite = () => {
    comiteRef.current.next();
    forceUpdate();
  };

  const retrocederComite = () => {
    comiteRef.current.prev();
    forceUpdate();
  };

  return {
    pacientes: pacientesRef.current.toArray(),
    historial: historialRef.current.toArray(),
    medicos: medicosRef.current.toArray(),
    medicoActual: medicosRef.current.getCurrent(),
    comite: comiteRef.current.toArray(),
    miembroActual: comiteRef.current.getCurrent(),
    segundosParaRotar,
    agregarPaciente,
    atenderPaciente,
    atenderSiguiente,
    rotarMedicoManual,
    avanzarComite,
    retrocederComite,
  };
}
