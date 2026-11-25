import { useId, useState } from 'react';
import { formatCOP } from '../../helpers/format';
import { validarComprobante } from '../../helpers/validacion';
import useOrders from '../../hooks/useOrders';
import Icon from '../shared/Icon';
import styles from './SubirComprobante.module.scss';

// El cliente sube la foto o PDF del pago del anticipo.
export default function SubirComprobante({ pedido, onSubido }) {
  const { subirComprobante } = useOrders();
  const id = useId();
  const [archivo, setArchivo] = useState(null);
  const [error, setError] = useState('');
  const [subiendo, setSubiendo] = useState(false);

  const elegir = (e) => {
    const a = e.target.files?.[0] ?? null;
    setArchivo(a);
    setError(a ? validarComprobante(a) ?? '' : '');
  };

  const subir = async () => {
    setSubiendo(true);
    const r = await subirComprobante(pedido.id, archivo);
    setSubiendo(false);
    if (r.error) setError(r.error);
    else onSubido?.(r.ruta);
  };

  return (
    <div className={styles.subir}>
      <p>
        Paga el anticipo de <b>{formatCOP(pedido.anticipo)}</b> por Nequi, transferencia o en efectivo y sube aquí la foto
        o el PDF del comprobante. Delilicias lo revisa y confirma tu cupo.
      </p>
      <label className={styles.zona} htmlFor={id}>
        <Icon name="subir" />
        <span>{archivo ? archivo.name : 'Elegir foto o PDF del comprobante'}</span>
        <input id={id} type="file" accept="image/*,application/pdf" onChange={elegir} />
      </label>
      {error && <p className={styles.error} role="alert">{error}</p>}
      <button className="btn btn--rojo" type="button" onClick={subir} disabled={!archivo || Boolean(error) || subiendo}>
        {subiendo ? 'Subiendo…' : 'Enviar comprobante'}
      </button>
    </div>
  );
}
