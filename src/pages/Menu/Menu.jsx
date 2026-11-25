import { useEffect, useMemo, useState } from 'react';
import Buscador from '../../components/menu/Buscador';
import MenuLateral from '../../components/menu/MenuLateral';
import SeccionMenu from '../../components/menu/SeccionMenu';
import Loader from '../../components/shared/Loader';
import useMenu from '../../hooks/useMenu';
import styles from './Menu.module.scss';

export default function Menu() {
  const { arbol, productos, categorias, cargando, error } = useMenu();
  const secciones = useMemo(() => arbol.root?.children ?? [], [arbol]);
  const [activa, setActiva] = useState(null);
  const categoriasPorId = useMemo(() => Object.fromEntries(categorias.map((c) => [c.id, c])), [categorias]);

  // Marca en el menú lateral la sección que se está leyendo
  useEffect(() => {
    if (secciones.length === 0) return undefined;
    const observador = new IntersectionObserver(
      (entradas) => entradas.forEach((e) => e.isIntersecting && setActiva(e.target.id)),
      { rootMargin: '-35% 0px -60% 0px' },
    );
    secciones.forEach((n) => { const el = document.getElementById(n.value.id); if (el) observador.observe(el); });
    return () => observador.disconnect();
  }, [secciones]);

  return (
    <>
      <div className={styles.cabecera}>
        <div>
          <h1 className="titular">El menú</h1>
          <p>Platos de temporada para el 24 y el 31 de diciembre.</p>
        </div>
        <Buscador productos={productos} categoriasPorId={categoriasPorId} />
      </div>

      {cargando && <Loader texto="Cargando el menú…" />}
      {error && <p className={`hoja ${styles.error}`} role="alert">{error}</p>}

      {!cargando && !error && (
        <div className={styles.cuerpo}>
          <MenuLateral arbol={arbol} activa={activa ?? secciones[0]?.value.id} />
          <div>
            {secciones.map((nodo) => <SeccionMenu key={nodo.value.id} nodo={nodo} />)}
          </div>
        </div>
      )}
    </>
  );
}
