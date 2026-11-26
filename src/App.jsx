import { useState } from 'react';
import AgregarCancion from './components/AgregarCancion';
import Buscador from './components/Buscador';
import Ranking from './components/Ranking';
import Recomendaciones from './components/Recomendaciones';
import useMusica from './hooks/useMusica';
import styles from './App.module.scss';

export default function App() {
  const { canciones, trie, heap, grafo, porTitulo, agregarCancion, escuchar } = useMusica();
  const [seleccionadaId, setSeleccionadaId] = useState('cali-pachanguero');
  const seleccionada = canciones.find((c) => c.id === seleccionadaId) ?? null;
  const elegir = (c) => c && setSeleccionadaId(c.id);

  return (
    <div className={styles.app}>
      <header className={styles.cabecera}>
        <div>
          <p className={styles.marca}>Mini plataforma de música educativa</p>
          <h1>Panel de canciones</h1>
        </div>
        <dl className={styles.cifras}>
          <div><dt>Canciones en el Trie</dt><dd>{trie.size()}</dd></div>
          <div><dt>Nodos en el grafo</dt><dd>{grafo.size()}</dd></div>
          <div><dt>Más escuchada</dt><dd>{heap.peek()?.titulo}</dd></div>
        </dl>
      </header>

      <main className={styles.panel}>
        <div className={styles.columna}>
          <Buscador trie={trie} porTitulo={porTitulo} onElegir={elegir} />
          <Recomendaciones grafo={grafo} cancion={seleccionada} onElegir={elegir} />
        </div>
        <div className={styles.columna}>
          <Ranking heap={heap} onEscuchar={escuchar} onElegir={elegir} />
          <AgregarCancion canciones={canciones} onAgregar={agregarCancion} />
        </div>
      </main>

      <footer className={styles.pie}>Parcial 3 · Estructuras de Datos II · Trie, Max Heap y grafo no dirigido. Reproducciones de ejemplo.</footer>
    </div>
  );
}
