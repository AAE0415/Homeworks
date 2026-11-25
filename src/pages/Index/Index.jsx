import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import AlmanaqueFechas from '../../components/index/AlmanaqueFechas';
import ComoPedir from '../../components/index/ComoPedir';
import LaminaCarrusel from '../../components/index/LaminaCarrusel';
import TopPlatos from '../../components/index/TopPlatos';
import Icon from '../../components/shared/Icon';
import { formatCOP } from '../../helpers/format';
import useCart from '../../hooks/useCart';
import useFechas from '../../hooks/useFechas';
import useMenu from '../../hooks/useMenu';
import styles from './Index.module.scss';

export default function Index() {
  const { productos, categorias, ventas, configuracion } = useMenu();
  const { fechas } = useFechas();
  const { fechaElegida } = useCart();
  const destacados = useMemo(() => productos.filter((p) => p.destacado && p.disponible), [productos]);
  const categoriasPorId = useMemo(() => Object.fromEntries(categorias.map((c) => [c.id, c])), [categorias]);
  const fecha = fechas.find((f) => f.id === fechaElegida);
  const limite24 = fechas.find((f) => f.fecha.endsWith('-12-24'))?.pedir_hasta;

  return (
    <>
      <section className={styles.portada} aria-labelledby="titulo-portada">
        <LaminaCarrusel platos={destacados} categoriasPorId={categoriasPorId} />

        <div className={styles.almanaque}>
          <div className={styles.mes}><span className="numeral">Diciembre</span><span className={styles.ano}>2026</span></div>
          <h1 className="titular" id="titulo-portada">La cena de Navidad, lista para tu mesa</h1>
          <p className={styles.bajada}>Rollos, lomos y costillas hechos en casa, con recetas de siempre. Elige tu fecha: los cupos son limitados.</p>
          <AlmanaqueFechas />
          <div className={styles.accion}>
            <Link className="btn btn--rojo" to="/menu">
              Armar mi canasta{fecha ? ` para el ${fecha.fecha.slice(8)}` : ''} <Icon name="flecha" />
            </Link>
            <p className="nota">
              Anticipo del {configuracion?.anticipo ?? 50} % · Domicilio gratis desde {formatCOP(configuracion?.domicilio_gratis_desde ?? 149900)}
            </p>
          </div>
        </div>
      </section>

      <div className="hoja"><div className={`perforacion ${styles.perforacion}`} aria-hidden="true" /></div>

      <TopPlatos productos={productos} ventas={ventas} />
      <ComoPedir configuracion={configuracion} limite24={limite24} />
    </>
  );
}
