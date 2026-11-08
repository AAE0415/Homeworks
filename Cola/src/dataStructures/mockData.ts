import type { Person } from "../types";
import { generateRandomArrivalDate } from "./dateUtils";

// 5 personas iniciales, sin posición fija: solo nombre, monto a retirar y fecha del sistema.
// El orden final en pantalla lo decide la Queue al hacer enqueue de cada una.
export const MOCK_PEOPLE: Omit<Person, "id" | "arrivalDate">[] = [
  { name: "Mariana Gómez", withdrawalAmount: 200000 },
  { name: "Carlos Restrepo", withdrawalAmount: 150000 },
  { name: "Laura Jiménez", withdrawalAmount: 500000 },
  { name: "Andrés Salazar", withdrawalAmount: 80000 },
  { name: "Valentina Ríos", withdrawalAmount: 320000 },
];

export function buildMockPeople(): Person[] {
  return MOCK_PEOPLE.map((person, index) => ({
    id: Date.now() + index,
    ...person,
    arrivalDate: generateRandomArrivalDate(),
  }));
}
