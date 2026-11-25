import { useEffect, useRef } from 'react';
import useCart from '../../hooks/useCart';
import Icon from '../shared/Icon';
import ContenidoCanasta from './ContenidoCanasta';
import styles from './CanastaPanel.module.scss';

// Panel lateral de la canasta. Se cierra con Escape, con el velo o con el botón.
export default function CanastaPanel() {
  const { panelAbierto, cerrarPanel } = useCart();
  const cerrarRef = useRef(null);

  useEffect(() => {
    if (!panelAbierto) return undefined;
    const previo = document.activeElement;
    cerrarRef.current?.focus();
    const alTeclear = (e) => { if (e.key === 'Escape') cerrarPanel(); };
    document.addEventListener('keydown', alTeclear);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', alTeclear);
      document.body.style.overflow = '';
      previo?.focus?.();
    };
  }, [panelAbierto, cerrarPanel]);

  return (
    <>
      <div className={styles.velo} data-abierto={panelAbierto} onClick={cerrarPanel} aria-hidden="true" />
      <aside className={styles.panel} data-abierto={panelAbierto} role="dialog" aria-modal="true"
        aria-labelledby="t-canasta" inert={!panelAbierto}>
        <div className={styles.cabecera}>
          <h2 className="titular" id="t-canasta">Tu canasta</h2>
          <button ref={cerrarRef} className={styles.cerrar} type="button" aria-label="Cerrar canasta" onClick={cerrarPanel}>
            <Icon name="cerrar" />
          </button>
        </div>
        <ContenidoCanasta onNavegar={cerrarPanel} />
      </aside>
    </>
  );
}
