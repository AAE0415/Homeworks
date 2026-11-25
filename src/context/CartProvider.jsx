import { useCallback, useEffect, useMemo, useState } from 'react';
import { reconciliarCanasta } from '../helpers/orders';
import { calcularAnticipo, calcularSubtotal, domicilioEsGratis } from '../helpers/pricing';
import useMenu from '../hooks/useMenu';
import CanastaConDeshacer from './cartLogic';
import { CartContext } from './cartContext';

const CLAVE = 'delilicias:canasta';
const CLAVE_FECHA = 'delilicias:fecha';

function leerGuardada() {
  try { return JSON.parse(localStorage.getItem(CLAVE)) ?? []; } catch { return []; }
}

// Canasta compartida por toda la app. Se guarda en el navegador y se pone al día con el menú.
export function CartProvider({ children }) {
  // Instancia única de la canasta (se crea una sola vez); React solo guarda copias de sus datos
  const [canasta] = useState(() => new CanastaConDeshacer(leerGuardada()));
  const [items, setItems] = useState(canasta.items);
  const [cambios, setCambios] = useState([]);
  // Copia del tope de la pila de deshacer, para poder mostrarlo en pantalla
  const [pila, setPila] = useState({ puedeDeshacer: false, ultimaAccion: null });
  const [panelAbierto, setPanelAbierto] = useState(false);
  // Fecha de entrega elegida en el almanaque; se conserva hasta el checkout
  const [fechaElegida, setFechaElegida] = useState(() => Number(localStorage.getItem(CLAVE_FECHA)) || null);
  const { productosPorId, productos, configuracion } = useMenu();

  // Ejecuta una operación de la canasta y refresca el estado de React
  const operar = useCallback((fn) => {
    const c = canasta;
    fn(c);
    setItems(c.items);
    setPila({ puedeDeshacer: c.puedeDeshacer, ultimaAccion: c.ultimaAccion });
  }, [canasta]);

  useEffect(() => { localStorage.setItem(CLAVE, JSON.stringify(items)); }, [items]);
  useEffect(() => {
    if (fechaElegida) localStorage.setItem(CLAVE_FECHA, String(fechaElegida));
    else localStorage.removeItem(CLAVE_FECHA);
  }, [fechaElegida]);

  // Cuando llega el menú, actualizar precios y marcar platos agotados o retirados
  useEffect(() => {
    if (productos.length === 0) return;
    const r = reconciliarCanasta(canasta.items, productosPorId);
    if (r.cambios.length === 0) return;
    canasta.reemplazar(r.items);
    setItems(r.items);
    setCambios(r.cambios);
  }, [productos, productosPorId, canasta]);

  const valor = useMemo(() => {
    const subtotal = calcularSubtotal(items);
    const desde = configuracion?.domicilio_gratis_desde;
    return {
      items,
      cambios,
      totalItems: items.reduce((n, i) => n + i.cantidad, 0),
      subtotal,
      anticipo: calcularAnticipo(subtotal, configuracion?.anticipo),
      domicilioGratis: domicilioEsGratis(subtotal, desde),
      faltaParaGratis: Math.max(0, (desde ?? 149900) - subtotal),
      hayAgotados: items.some((i) => i.disponible === false),
      puedeDeshacer: pila.puedeDeshacer,
      ultimaAccion: pila.ultimaAccion,
      agregar: (producto, opciones) => { operar((c) => c.agregar(producto, opciones)); setPanelAbierto(true); },
      cambiarCantidad: (clave, n) => operar((c) => c.cambiarCantidad(clave, n)),
      quitar: (clave) => operar((c) => c.quitar(clave)),
      vaciar: () => operar((c) => c.vaciar()),
      deshacer: () => operar((c) => c.deshacer()),
      limpiarTodo: () => operar((c) => { c.reemplazar([]); while (c.puedeDeshacer) c.historial.pop(); }),
      fechaElegida,
      elegirFecha: setFechaElegida,
      panelAbierto,
      abrirPanel: () => setPanelAbierto(true),
      cerrarPanel: () => setPanelAbierto(false),
    };
  }, [items, cambios, pila, configuracion, panelAbierto, fechaElegida, operar]);

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>;
}
