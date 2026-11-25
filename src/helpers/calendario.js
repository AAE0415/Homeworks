// Arma las celdas del almanaque de diciembre con las fechas de entrega.
import { fechaLocalISO } from './format';

const FESTIVOS_DICIEMBRE = [8, 25];

const desdeISO = (iso) => {
  const [a, m, d] = iso.split('-').map(Number);
  return new Date(a, m - 1, d);
};

/**
 * Celdas de lunes a domingo, desde la semana del primer "último día para pedir"
 * (o de la primera entrega) hasta completar la semana de la última entrega.
 * Cada celda: { dia, iso, festivo, vacia, entrega?, limitePara? }
 */
export function celdasAlmanaque(fechas, hoy = new Date()) {
  if (fechas.length === 0) return [];
  const hoyISO = fechaLocalISO(hoy);
  const referencias = fechas.flatMap((f) => [f.fecha, f.pedir_hasta].filter(Boolean)).sort();
  const inicio = desdeISO(referencias[0]);
  inicio.setDate(inicio.getDate() - ((inicio.getDay() + 6) % 7)); // lunes de esa semana
  const ultima = desdeISO(fechas.map((f) => f.fecha).sort().at(-1));
  const mes = ultima.getMonth();

  const celdas = [];
  for (const d = new Date(inicio); d <= ultima || celdas.length % 7 !== 0; d.setDate(d.getDate() + 1)) {
    if (d > ultima && d.getMonth() !== mes) { celdas.push({ vacia: true, dia: d.getDate(), iso: fechaLocalISO(d) }); continue; }
    const iso = fechaLocalISO(d);
    const f = fechas.find((x) => x.fecha === iso);
    const limite = fechas.find((x) => x.pedir_hasta === iso);
    const celda = {
      dia: d.getDate(),
      iso,
      vacia: false,
      festivo: d.getDay() === 0 || (d.getMonth() === 11 && FESTIVOS_DICIEMBRE.includes(d.getDate())),
    };
    if (f) {
      const restantes = Math.max(0, f.cupo - f.ocupados);
      const vencida = f.pedir_hasta && f.pedir_hasta < hoyISO;
      celda.entrega = {
        id: f.id,
        texto: f.texto,
        restantes,
        elegible: !vencida && restantes > 0,
        motivo: vencida ? 'Cerrado' : restantes === 0 ? 'Sin cupos' : null,
      };
    }
    if (limite) celda.limitePara = limite.fecha.slice(8);
    celdas.push(celda);
  }
  return celdas;
}
