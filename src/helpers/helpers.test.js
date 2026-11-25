import { describe, expect, it } from 'vitest';
import { formatCOP, formatFecha, normalizeText } from './format';
import { ESTADOS, fechasDisponibles, reconciliarCanasta, siguienteEstado } from './orders';
import { calcularAnticipo, calcularSubtotal, domicilioEsGratis } from './pricing';
import { linkWhatsApp, mensajeAdmin, mensajePedido } from './whatsapp';

describe('format', () => {
  it('normalizeText quita tildes, mayúsculas y espacios repetidos', () => {
    expect(normalizeText('Jamón  de POLLO')).toBe('jamon de pollo');
    expect(normalizeText('  Champiñones ')).toBe('champinones');
  });

  it('formatCOP usa pesos colombianos sin decimales', () => {
    expect(formatCOP(52500).replace(/\s/g, ' ')).toBe('$ 52.500');
  });

  it('formatFecha escribe el día y el mes en español', () => {
    expect(formatFecha('2026-12-24')).toBe('24 de diciembre');
  });
});

describe('pricing', () => {
  it('calcularSubtotal suma precio por cantidad', () => {
    expect(calcularSubtotal([{ precio: 45900, cantidad: 2 }, { precio: 7800, cantidad: 4 }])).toBe(123000);
  });

  it('calcularAnticipo es el 50 % redondeado', () => {
    expect(calcularAnticipo(149900)).toBe(74950);
    expect(calcularAnticipo(175501)).toBe(87751);
  });

  it('domicilioEsGratis desde $149.900 inclusive', () => {
    expect(domicilioEsGratis(149899)).toBe(false);
    expect(domicilioEsGratis(149900)).toBe(true);
  });
});

describe('whatsapp', () => {
  it('linkWhatsApp codifica el mensaje', () => {
    const url = linkWhatsApp('573152377306', 'Hola pedido #12');
    expect(url).toBe('https://wa.me/573152377306?text=Hola%20pedido%20%2312');
  });

  it('mensajePedido incluye número, fecha, barrio y productos', () => {
    const m = mensajePedido({
      id: 142, fechaTexto: '24 de diciembre', barrio: 'Ciudad Jardín', subtotal: 175500,
      items: [{ nombre: 'Rollo mixto', cantidad: 1, unidad: 'libra' }],
    });
    expect(m).toContain('0142');
    expect(m).toContain('24 de diciembre');
    expect(m).toContain('Ciudad Jardín');
    expect(m).toContain('Rollo mixto');
  });

  it('mensajeAdmin saluda al cliente por su nombre y nombra el pedido', () => {
    const m = mensajeAdmin({ id: 151, nombre: 'Andrés Muñoz', fechaTexto: '24 de diciembre' });
    expect(m).toContain('Andrés');
    expect(m).toContain('0151');
  });
});

describe('orders', () => {
  const fechas = [
    { id: 1, fecha: '2026-12-24', pedir_hasta: '2026-12-17', cupo: 40, ocupados: 10 },
    { id: 2, fecha: '2026-12-31', pedir_hasta: null, cupo: 40, ocupados: 12 },
    { id: 3, fecha: '2026-12-31', pedir_hasta: null, cupo: 30, ocupados: 30 },
  ];

  it('fechasDisponibles excluye fechas vencidas y llenas', () => {
    const r = fechasDisponibles(fechas, new Date(2026, 11, 18));
    expect(r.map((f) => f.id)).toEqual([2]);
  });

  it('fechasDisponibles acepta el último día para pedir', () => {
    const r = fechasDisponibles(fechas, new Date(2026, 11, 17, 21, 30));
    expect(r.map((f) => f.id)).toEqual([1, 2]);
  });

  it('reconciliarCanasta marca agotados, actualiza precios y quita eliminados', () => {
    const items = [
      { id: 'costilla', precio: 45900, cantidad: 1 },
      { id: 'galantina', precio: 35000, cantidad: 1 },
      { id: 'viejo', precio: 1000, cantidad: 1 },
    ];
    const productos = {
      costilla: { id: 'costilla', precio: 47000, disponible: true },
      galantina: { id: 'galantina', precio: 35000, disponible: false },
    };
    const { items: r, cambios } = reconciliarCanasta(items, productos);
    expect(r).toHaveLength(2);
    expect(r[0]).toMatchObject({ id: 'costilla', precio: 47000, disponible: true });
    expect(r[1]).toMatchObject({ id: 'galantina', disponible: false });
    expect(cambios).toEqual([
      { id: 'costilla', tipo: 'precio' },
      { id: 'galantina', tipo: 'agotado' },
      { id: 'viejo', tipo: 'eliminado' },
    ]);
  });

  it('siguienteEstado avanza en orden y termina en entregado', () => {
    expect(ESTADOS[0]).toBe('recibido');
    expect(siguienteEstado('recibido')).toBe('anticipo_confirmado');
    expect(siguienteEstado('en_camino')).toBe('entregado');
    expect(siguienteEstado('entregado')).toBeNull();
    expect(siguienteEstado('cancelado')).toBeNull();
  });
});
