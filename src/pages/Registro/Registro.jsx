import PaginaPendiente from '../../components/shared/PaginaPendiente';
import styles from './Registro.module.scss';

export default function Registro() {
  return (
    <div className={styles.pagina}>
      <PaginaPendiente
        titulo="Crea tu cuenta"
        descripcion="Registro con nombre, celular, barrio, correo y contraseña."
        hito={4}
      />
    </div>
  );
}
