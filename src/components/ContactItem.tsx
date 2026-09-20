import type { Contact } from "../types";

interface Props {
  contact: Contact;
  onDelete: (id: number) => void;
}

function ContactItem({ contact, onDelete }: Props) {
  return (
    <li className="contact-item">
      <div>
        <p className="contact-name">{contact.name}</p>
        <p className="contact-phone">{contact.phone}</p>
      </div>
      <button className="delete-btn" onClick={() => onDelete(contact.id)}>
        Eliminar
      </button>
    </li>
  );
}

export default ContactItem;
