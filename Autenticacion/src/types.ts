export interface Book {
  id: number;
  name: string;
  isbn: string;
  author: string;
  editorial: string;
}

export interface Person {
  id: number;
  name: string;
  withdrawalAmount: number;
  arrivalDate: Date;
}
