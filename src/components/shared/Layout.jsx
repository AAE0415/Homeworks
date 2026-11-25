import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Menu from './Menu';

// Disposición pública: membrete, contenido de la ruta y pie.
export default function Layout() {
  return (
    <>
      <a className="saltar" href="#contenido">Saltar al contenido</a>
      <Menu />
      <main id="contenido"><Outlet /></main>
      <Footer />
    </>
  );
}
