import { linkWhatsApp } from '../../helpers/whatsapp';
import Icon from '../shared/Icon';

// Abre WhatsApp con un mensaje ya escrito. variante: "boton" (verde) o "texto".
export default function BotonWhatsApp({ numero, mensaje, children = 'Hablar por WhatsApp', variante = 'boton' }) {
  return (
    <a className={variante === 'texto' ? 'btn-texto' : 'btn btn--verde'} href={linkWhatsApp(numero, mensaje)}
      target="_blank" rel="noreferrer">
      <Icon name="whatsapp" />{children}
    </a>
  );
}
