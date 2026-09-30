export class Queue<T> {
  private items: T[] = [];
  private compare: (a: T, b: T) => number;

  constructor(compare: (a: T, b: T) => number) {
    this.compare = compare;
  }

  enqueue(item: T): void {
    this.items.push(item);
    this.items.sort(this.compare);
  }

  dequeue(): T | null {
    if (this.isEmpty()) return null;
    return this.items.shift() as T;
  }

  peek(): T | null {
    if (this.isEmpty()) return null;
    return this.items[0];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  print(): T[] {
    return [...this.items];
  }
}
