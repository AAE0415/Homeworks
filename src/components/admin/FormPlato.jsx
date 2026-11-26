import { useState } from 'react';
import { normalizeText } from '../../helpers/format';
import Campo from '../shared/Campo';
import styles from './FormPlato.module.scss';

const UNIDADES = ['libra', 'porción', '350 g', '500 g', 'unidad'];

const idDesdeNombre = (nombre) => normalizeText(nombre).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Formulario para crear un plato nuevo.
export default function FormPlato({ categorias, onGuardar, onCancelar }) {
  const [datos, setDatos] = useState({ nombre: '', categoria_id: categorias[0]?.id ?? '', descripcion: '', ingredientes: '', precio: '', unidad: 'libra' });
  const [archivo, setArchivo] = useState(null);
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const cambiar = (e) => setDatos((d) => ({ ...d, [e.target.name]: e.target.value }));

  const enviar = async (e) => {
    e.preventDefault();
    const err = {};
    if (!datos.nombre.trim()) err.nombre = 'Escribe el nombre del plato.';
    if (!(Number(datos.precio) > 0)) err.precio = 'Escribe el precio en pesos, solo números.';
    if (archivo && !/^image\//.test(archivo.type)) err.foto = 'La foto debe ser una imagen.';
    setErrores(err);
    if (Object.keys(err).length) return;
    setGuardando(true);
    const r = await onGuardar({
      id: idDesdeNombre(datos.nombre),
      nombre: datos.nombre.trim(),
      categoria_id: datos.categoria_id,
      descripcion: datos.descripcion.trim(),
      ingredientes: datos.ingredientes.split(',').map((x) => x.trim()).filter(Boolean),
      precio: Number(datos.precio),
      unidad: datos.unidad,
    }, archivo);
    setGuardando(false);
    if (r?.error) setErrores({ general: r.error });
  };

  return (
    <form className={styles.form} onSubmit={enviar} noValidate>
      <h2>Nuevo plato</h2>
      {errores.general && <p className={styles.error} role="alert">{errores.general}</p>}
      <div className={styles.grid}>
        <Campo label="Nombre" error={errores.nombre}><input name="nombre" value={datos.nombre} onChange={cambiar} /></Campo>
        <Campo label="Sección">
          <select name="categoria_id" value={datos.categoria_id} onChange={cambiar}>
            {categorias.map((c) => <option key={c.id} value={c.id}>{c.numeral} · {c.titulo}</option>)}
          </select>
        </Campo>
        <Campo label="Precio (COP)" error={errores.precio}><input name="precio" type="number" min="0" step="100" inputMode="numeric" value={datos.precio} onChange={cambiar} /></Campo>
        <Campo label="Se vende por">
          <select name="unidad" value={datos.unidad} onChange={cambiar}>{UNIDADES.map((u) => <option key={u}>{u}</option>)}</select>
        </Campo>
      </div>
      <Campo label="Descripción" opcional><textarea name="descripcion" value={datos.descripcion} onChange={cambiar} /></Campo>
      <Campo label="Ingredientes para el buscador" ayuda="Separados por comas: cerdo, tocineta, ciruelas" opcional>
        <input name="ingredientes" value={datos.ingredientes} onChange={cambiar} />
      </Campo>
      <Campo label="Foto" error={errores.foto} opcional>
        <input type="file" accept="image/*" onChange={(e) => setArchivo(e.target.files?.[0] ?? null)} />
      </Campo>
      <div className={styles.acciones}>
        <button className="btn btn--rojo" type="submit" disabled={guardando}>{guardando ? 'Guardando…' : 'Crear plato'}</button>
        <button className="btn" type="button" onClick={onCancelar}>Cancelar</button>
      </div>
    </form>
  );
}
