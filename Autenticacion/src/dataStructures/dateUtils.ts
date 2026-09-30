export function generateRandomArrivalDate(): Date {
  const now = Date.now();
  const maxOffsetMs = 4 * 7 * 24 * 60 * 60 * 1000; // 4 semanas en milisegundos
  const randomOffset = Math.floor(Math.random() * maxOffsetMs);
  return new Date(now + randomOffset);
}

export function formatArrivalDate(date: Date): string {
  return date.toLocaleString("es-CO", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
