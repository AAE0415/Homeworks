import { useEffect, useState } from "react";
import type { Contact } from "./types";
import Loader from "./components/Loader";
import ContactForm from "./components/ContactForm";
import ContactList from "./components/ContactList";

// Simula los datos que vendrían de una API
const DATOS_INICIALES: Contact[] = [
  { id: 1, name: "Ana Torres", phone: "300 123 4567" },
  { id: 2, name: "Luis Pérez", phone: "310 987 6543" },
  { id: 3, name: "Camila Ruiz", phone: "320 456 7890" },
];

function App() {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([]);

  // useEffect con dependencias vacías [] -> se ejecuta una sola vez, al montar
  useEffect(() => {
    const timer = setTimeout(() => {
      setContacts(DATOS_INICIALES);
      setLoading(false);
    }, 1500);

    // función de limpieza: evita que el timer siga corriendo si el componente se desmonta antes
    return () => clearTimeout(timer);
  }, []);

  const agregarContacto = (name: string, phone: string) => {
    // inmutabilidad: se crea un nuevo arreglo con spread, nunca se modifica el original
    setContacts((prev) => [...prev, { id: Date.now(), name, phone }]);
  };

  const eliminarContacto = (id: number) => {
    setContacts((prev) => prev.filter((contact) => contact.id !== id));
  };

  if (loading) {
    return (
      <div className="app-container">
        <Loader />
      </div>
    );
  }

  return (
    <div className="app-container">
      <h1 className="app-title">Mis contactos</h1>
      <ContactForm onAdd={agregarContacto} />
      <ContactList contacts={contacts} onDelete={eliminarContacto} />
    </div>
  );
}

export default App;
