import { useRef, useState } from "react";
import { LinkedList } from "../dataStructures/LinkedList";
import { MOCK_SONGS } from "../dataStructures/mockData";
import type { Song } from "../types";

function crearListaDeCanciones(): LinkedList<Song> {
  const lista = new LinkedList<Song>();
  MOCK_SONGS.forEach((song) => lista.append(song));
  return lista;
}

function SongsPage() {
  // La instancia de la lista se crea una sola vez y persiste entre renders
  const playlistRef = useRef<LinkedList<Song>>(crearListaDeCanciones());
  const playlist = playlistRef.current;

  // Como playlist.playNext() muta el objeto directamente (no crea uno nuevo)
  const [, forceRender] = useState(0);
  const rerender = () => forceRender((tick) => tick + 1);

  const handleNext = () => {
    const avanzo = playlist.playNext();
    if (!avanzo) return; 
    rerender();
  };

  const handleRestart = () => {
    playlist.restart();
    rerender();
  };

  const songs = playlist.toArray();
  const currentSong = playlist.current?.value;
  const isLast = playlist.current?.next === null;

  return (
    <div className="page">
      <h1 className="page-title">Reproductor de canciones</h1>
      <p className="page-subtitle">
        Lista simplemente enlazada · {playlist.size()} canciones cargadas
      </p>

      <div className="now-playing">
        <span className="now-playing-label">Reproduciendo ahora</span>
        <p className="now-playing-title">{currentSong?.title}</p>
        <p className="now-playing-artist">{currentSong?.artist}</p>
      </div>

      <div className="controls">
        <button onClick={handleRestart}>Reiniciar</button>
        <button onClick={handleNext} disabled={isLast}>
          Siguiente cancion
        </button>
      </div>

      <div className="node-track">
        {songs.map((song, index) => {
          const isActive = song.title === currentSong?.title;
          return (
            <div className="node-group" key={song.title}>
              <div className={isActive ? "node-box node-box-active" : "node-box"}>
                <span className="node-value">{song.title}</span>
              </div>
              {index < songs.length - 1 && <span className="node-arrow">→</span>}
            </div>
          );
        })}
        <span className="node-null">null</span>
      </div>
    </div>
  );
}

export default SongsPage;
