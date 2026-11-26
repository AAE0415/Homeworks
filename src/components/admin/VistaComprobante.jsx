import { useEffect, useState } from 'react';
import { formatCOP } from '../../helpers/format';
import styles from './VistaComprobante.module.scss';

// Muestra el comprobante privado con un enlace firmado temporal (imagen o PDF).
export default function VistaComprobante({ ruta, anticipo, obtenerUrl }) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    let activo = true;
    if (ruta) obtenerUrl(ruta).then((u) => { if (activo) setUrl(u); });
    return () => { activo = false; };
  }, [ruta, obtenerUrl]);

  if (!ruta) return <div className={styles.vacio}>El cliente aún no sube el comprobante.</div>;
  const esPdf = ruta.toLowerCase().endsWith('.pdf');

  return (
    <figure className={styles.comprobante}>
      {!url ? <div className={styles.cargando} aria-busy="true" /> : esPdf ? (
        <a className={styles.pdf} href={url} target="_blank" rel="noreferrer">Abrir el PDF del comprobante</a>
      ) : (
        <a href={url} target="_blank" rel="noreferrer"><img src={url} alt="Comprobante del anticipo subido por el cliente" /></a>
      )}
      <figcaption>
        Anticipo esperado: <b className="tabular">{formatCOP(anticipo)}</b>. Revisa que el valor coincida.
        {url && <> <a href={url} target="_blank" rel="noreferrer">Abrir en tamaño completo</a></>}
      </figcaption>
    </figure>
  );
}
