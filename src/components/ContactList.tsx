import type { Contact } from "../types";
import ContactItem from "./ContactItem";

interface Props {
  contacts: Contact[];
  onDelete: (id: number) => void;
}

function ContactList({ contacts, onDelete }: Props) {
  if (contacts.length === 0) {
    return <p className="empty-state">No hay contactos aún.</p>;
  }

  return (
    <ul className="contact-list">
      {contacts.map((contact) => (
        <ContactItem key={contact.id} contact={contact} onDelete={onDelete} />
      ))}
    </ul>
  );
}

export default ContactList;
