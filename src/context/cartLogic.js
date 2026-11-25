// Lógica de la canasta con "deshacer".
// Cada cambio guarda en una PILA (Stack) la acción y cómo estaba la canasta antes.
// Deshacer saca el tope de la pila (lo último que se hizo) y restaura ese estado: LIFO.
import Stack from '../helpers/structures/Stack';

/** Clave de una línea: el mismo plato con otras porciones es otra línea. */
export const claveItem = (id, porciones) => `${id}|${porciones ?? ''}`;

export default class CanastaConDeshacer {
  constructor(items = []) {
    this._items = items;
    this.historial = new Stack();
  }

  get items() {
    return this._items;
  }

  get puedeDeshacer() {
    return !this.historial.isEmpty();
  }

  /** La última acción que se puede deshacer: { tipo, nombre }. */
  get ultimaAccion() {
    return this.historial.peek();
  }

  #registrar(tipo, nombre, nuevos) {
    this.historial.push({ tipo, nombre, antes: this._items });
    this._items = nuevos;
  }

  agregar(producto, { cantidad = 1, porciones = null } = {}) {
    if (!producto.disponible || cantidad <= 0) return;
    const clave = claveItem(producto.id, porciones);
    const existe = this._items.find((i) => i.clave === clave);
    const nuevos = existe
      ? this._items.map((i) => (i.clave === clave ? { ...i, cantidad: i.cantidad + cantidad } : i))
      : [...this._items, {
        clave,
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        unidad: producto.unidad,
        foto_url: producto.foto_url,
        disponible: producto.disponible,
        cantidad,
        porciones,
      }];
    this.#registrar('agregar', producto.nombre, nuevos);
  }

  cambiarCantidad(clave, cantidad) {
    const item = this._items.find((i) => i.clave === clave);
    if (!item || item.cantidad === cantidad) return;
    if (cantidad <= 0) { this.quitar(clave); return; }
    this.#registrar('cantidad', item.nombre, this._items.map((i) => (i.clave === clave ? { ...i, cantidad } : i)));
  }

  quitar(clave) {
    const item = this._items.find((i) => i.clave === clave);
    if (!item) return;
    this.#registrar('quitar', item.nombre, this._items.filter((i) => i.clave !== clave));
  }

  vaciar() {
    if (this._items.length === 0) return;
    this.#registrar('vaciar', null, []);
  }

  /** Reemplaza los ítems sin registrar en el historial (por ejemplo, al ponerlos al día con el menú). */
  reemplazar(items) {
    this._items = items;
  }

  deshacer() {
    const accion = this.historial.pop();
    if (accion) this._items = accion.antes;
    return accion;
  }
}
