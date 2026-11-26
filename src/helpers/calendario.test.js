import { describe, expect, it } from 'vitest';
import { celdasAlmanaque } from './calendario';

const fechas = [
  { id: 1, texto: '24 de diciembre', fecha: '2026-12-24', pedir_hasta: '2026-12-17', cupo: 40, ocupados: 28 },
  { id: 2, texto: '31 de diciembre', fecha: '2026-12-31', pedir_hasta: null, cupo: 40, ocupados: 40 },
];

describe('celdasAlmanaque', () => {
  const celdas = celdasAlmanaque(fechas, new Date(2026, 10, 25));
  const dia = (n) => celdas.find((c) => c.dia === n && !c.vacia);

  it('empieza el lunes de la semana del último día para pedir y llena semanas completas', () => {
    expect(celdas[0]).toMatchObject({ dia: 14 });
    expect(celdas.length % 7).toBe(0);
    expect(celdas.filter((c) => c.vacia)).toHaveLength(3);
  });

  it('marca domingos y festivos de diciembre', () => {
    expect(dia(20).festivo).toBe(true);
    expect(dia(25).festivo).toBe(true);
    expect(dia(22).festivo).toBe(false);
  });

  it('las fechas de entrega traen sus cupos restantes y si se pueden elegir', () => {
    expect(dia(24).entrega).toMatchObject({ id: 1, restantes: 12, elegible: true });
    expect(dia(31).entrega).toMatchObject({ id: 2, restantes: 0, elegible: false, motivo: 'Sin cupos' });
  });

  it('marca el último día para pedir', () => {
    expect(dia(17).limitePara).toBe('24');
  });

  it('una fecha vencida no se puede elegir', () => {
    const c = celdasAlmanaque(fechas, new Date(2026, 11, 18));
    expect(c.find((x) => x.dia === 24).entrega).toMatchObject({ elegible: false, motivo: 'Cerrado' });
  });

  it('una fecha sin límite se cierra el mismo día de la entrega', () => {
    const c = celdasAlmanaque(fechas.map((f) => ({ ...f, ocupados: 0 })), new Date(2026, 11, 31));
    expect(c.find((x) => x.dia === 31 && !x.vacia).entrega).toMatchObject({ elegible: false, motivo: 'Cerrado' });
  });

  it('sin fechas devuelve []', () => {
    expect(celdasAlmanaque([], new Date())).toEqual([]);
  });
});
