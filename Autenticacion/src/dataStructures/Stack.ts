export class Stack<T> {
  private items: T[] = [];

  push(value: T): void {
    this.items.push(value);
  }

  pop(): T | null {
    if (this.isEmpty()) return null;
    return this.items.pop() as T;
  }

  peek(): T | null {
    if (this.isEmpty()) return null;
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  print(): T[] {
    return [...this.items].reverse();
  }
}
