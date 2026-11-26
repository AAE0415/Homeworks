import { useCallback, useEffect, useState } from 'react';
import CabeceraArea from '../../../components/admin/CabeceraArea';
import FormPlato from '../../../components/admin/FormPlato';
import Icon from '../../../components/shared/Icon';
import Loader from '../../../components/shared/Loader';
import { formatCOP } from '../../../helpers/format';
import { invalidarMenu } from '../../../hooks/useMenu';
import { supabase } from '../../../lib/supabase';
import styles from './MenuAdmin.module.scss';

async function subirFoto(id, archivo) {
  const ext = archivo.name.split('.').pop()?.toLowerCase() || 'jpg';
  const ruta = `${id}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from('platos').upload(ruta, archivo, { contentType: archivo.type });
  if (error) return { error: 'No pudimos subir la foto.' };
  return { url: supabase.storage.from('platos').getPublicUrl(ruta).data.publicUrl };
}

// Gestión del menú: precios, disponible/agotado, destacado, fotos y platos nuevos.
export default function MenuAdmin() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [precios, setPrecios] = useState({});
  const [aviso, setAviso] = useState(null);
  const [creando, setCreando] = useState(false);

  const cargar = useCallback(async () => {
    const [p, c] = await Promise.all([
      supabase.from('productos').select('*').order('orden'),
      supabase.from('categorias').select('*').order('orden'),
    ]);
    setProductos(p.data ?? []);
    setCategorias(c.data ?? []);
    setCargando(false);
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const guardar = async (id, cambios, texto) => {
    const { error } = await supabase.from('productos').update(cambios).eq('id', id);
    if (error) { setAviso({ error: true, texto: 'No pudimos guardar el cambio.' }); return; }
    setProductos((lista) => lista.map((p) => (p.id === id ? { ...p, ...cambios } : p)));
    invalidarMenu();
    setAviso({ texto });
  };

  const cambiarFoto = async (p, archivo) => {
    if (!archivo) return;
    const r = await subirFoto(p.id, archivo);
    if (r.error) setAviso({ error: true, texto: r.error });
    else guardar(p.id, { foto_url: r.url }, `Actualizamos la foto de ${p.nombre}.`);
  };

  const crear = async (plato, archivo) => {
    if (productos.some((p) => p.id === plato.id)) return { error: 'Ya existe un plato con ese nombre.' };
    let foto_url = null;
    if (archivo) {
      const r = await subirFoto(plato.id, archivo);
      if (r.error) return r;
      foto_url = r.url;
    }
    const orden = Math.max(0, ...productos.map((p) => p.orden)) + 1;
    const { error } = await supabase.from('productos').insert({ ...plato, foto_url, alt: plato.nombre, orden });
    if (error) return { error: 'No pudimos crear el plato.' };
    invalidarMenu();
    setCreando(false);
    setAviso({ texto: `Creamos ${plato.nombre}.` });
    await cargar();
    return { ok: true };
  };

  if (cargando) return <Loader texto="Cargando el menú…" />;

  return (
    <>
      <CabeceraArea titulo="Menú" bajada="Los cambios se ven de inmediato en la tienda.">
        {!creando && <button className="btn btn--rojo btn--chico" type="button" onClick={() => setCreando(true)}><Icon name="mas" />Nuevo plato</button>}
      </CabeceraArea>
      {aviso && <p className={aviso.error ? styles.error : styles.ok} role="status">{aviso.texto}</p>}
      {creando && <FormPlato categorias={categorias} onGuardar={crear} onCancelar={() => setCreando(false)} />}

      {categorias.map((c) => (
        <section key={c.id} className={styles.seccion} aria-labelledby={`t-sec-${c.id}`}>
          <h2 id={`t-sec-${c.id}`}><span className="numeral">{c.numeral}</span>{c.titulo}</h2>
          <div className={styles.tabla} role="table" aria-label={`Platos de ${c.titulo}`}>
            <div className={styles.encabezado} role="row">
              <span role="columnheader">Plato</span><span role="columnheader">Precio</span>
              <span role="columnheader">Disponible</span><span role="columnheader">Destacado</span><span role="columnheader">Foto</span>
            </div>
            {productos.filter((p) => p.categoria_id === c.id).map((p) => {
              const precio = precios[p.id] ?? p.precio;
              return (
                <div key={p.id} className={`${styles.fila} ${p.disponible ? '' : styles.agotado}`} role="row">
                  <span role="cell" className={styles.plato}>
                    <img src={p.foto_url} alt="" />
                    <span><b>{p.nombre}</b><small>{formatCOP(p.precio)} · {p.unidad}</small></span>
                  </span>
                  <span role="cell" className={styles.precio}>
                    <label className="sr-only" htmlFor={`precio-${p.id}`}>Precio de {p.nombre}</label>
                    <input id={`precio-${p.id}`} className="control" type="number" min="0" step="100" value={precio}
                      onChange={(e) => setPrecios((x) => ({ ...x, [p.id]: e.target.value }))} />
                    {Number(precio) !== p.precio && Number(precio) > 0 && (
                      <button className="btn btn--chico" type="button"
                        onClick={() => guardar(p.id, { precio: Number(precio) }, `Nuevo precio de ${p.nombre}: ${formatCOP(Number(precio))}.`)}>Guardar</button>
                    )}
                  </span>
                  <span role="cell">
                    <label className={styles.interruptor}>
                      <input type="checkbox" checked={p.disponible}
                        onChange={(e) => guardar(p.id, { disponible: e.target.checked }, `${p.nombre} ${e.target.checked ? 'vuelve a estar disponible' : 'quedó agotado'}.`)} />
                      <span>{p.disponible ? 'Disponible' : 'Agotado'}</span>
                    </label>
                  </span>
                  <span role="cell">
                    <label className={styles.interruptor}>
                      <input type="checkbox" checked={p.destacado}
                        onChange={(e) => guardar(p.id, { destacado: e.target.checked }, `${p.nombre} ${e.target.checked ? 'ahora aparece' : 'ya no aparece'} en la lámina de la portada.`)} />
                      <span>{p.destacado ? 'En la lámina' : 'No'}</span>
                    </label>
                  </span>
                  <span role="cell">
                    <label className="btn-texto">
                      Cambiar
                      <input className="sr-only" type="file" accept="image/*" onChange={(e) => cambiarFoto(p, e.target.files?.[0])} />
                    </label>
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}
