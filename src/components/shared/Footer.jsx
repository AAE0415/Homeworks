import { Link } from 'react-router-dom';
import Icon from './Icon';
import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.pie}>
      <div className={styles.interior}>
        <Link className={styles.marca} to="/">Delilicias</Link>
        <span>Cocina por encargo · Cali</span>
        <a href="https://wa.me/573152377306" target="_blank" rel="noreferrer">
          <Icon name="whatsapp" /> +57 315 237 7306
        </a>
      </div>
    </footer>
  );
}
