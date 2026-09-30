import type { Person } from "../types";
import { generateRandomArrivalDate } from "../dataStructures/dateUtils";

const MOCK_PEOPLE: Omit<Person, "id" | "arrivalDate">[] = [
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
