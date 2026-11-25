import { formatCOP, formatFecha } from '../../helpers/format';
import Icon from '../shared/Icon';
import styles from './ComoPedir.module.scss';

const PASOS = [
  { titulo: 'Arma tu canasta', texto: 'Elige los platos, cuántas libras y en cuántas porciones las quieres.' },
  { titulo: 'Separa tu fecha', texto: 'Escoge el 24 o el 31 y sube el comprobante del 50 % de anticipo.' },
  { titulo: 'Síguela en vivo', texto: 'Verás cuando tu cena entra a la cocina y cuando sale para tu casa.' },
];

// Pasos para pedir y franja de condiciones del negocio.
export default function ComoPedir({ configuracion, limite24 }) {
  const gratisDesde = configuracion?.domicilio_gratis_desde ?? 149900;
  const anticipo = configuracion?.anticipo ?? 50;
  return (
    <>
      <section className={styles.seccion} aria-labelledby="t-pasos">
        <div className={styles.cabecera}><h2 className="titular" id="t-pasos">Así encargas tu cena</h2></div>
        <ol className={styles.pasos}>
          {PASOS.map((p, i) => (
            <li key={p.titulo}>
              <span className="numeral">{i + 1}</span>
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.condiciones} aria-labelledby="t-cond">
        <div className={styles.interior}>
          <h2 className="titular" id="t-cond">
            Para el 24, pide a más tardar el <span>{limite24 ? formatFecha(limite24) : '17 de diciembre'}</span>.
          </h2>
          <ul>
            <li><Icon name="check" /><span><b>Anticipo del {anticipo} %</b> para confirmar: Nequi, transferencia o efectivo.</span></li>
            <li><Icon name="camion" /><span><b>Domicilio gratis</b> desde {formatCOP(gratisDesde)}. Si no, lo acordamos por WhatsApp.</span></li>
            <li><Icon name="plato" /><span>Carnes 100 % magras · <b>sin aditivos ni conservantes</b>.</span></li>
          </ul>
        </div>
      </section>
    </>
  );
}
