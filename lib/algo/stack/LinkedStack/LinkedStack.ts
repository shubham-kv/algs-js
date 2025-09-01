class StackNode<T> {
  data: T;
  next: StackNode<T> | null;

  constructor(data: T, next?: StackNode<T> | null | undefined) {
    this.data = data;
    this.next = next ?? null;
  }
}

export class LinkedStack<T> implements Iterable<T> {
  #top: StackNode<T> | null = null;
  #size: number = 0;

  push(data: T): void {
    const node = new StackNode(data, this.#top);
    this.#top = node;
    this.#size++;
  }

  pop(): T | null {
    if (this.#top === null) {
      return null;
    }
    const data = this.#top.data;
    this.#top = this.#top.next;
    this.#size--;
    return data;
  }

  peek(): T | null {
    return this.#top?.data ?? null;
  }

  get size(): number {
    return this.#size;
  }

  get isEmpty(): boolean {
    return this.size === 0;
  }

  [Symbol.iterator](): Iterator<T, any, any> {
    let node = this.#top;

    return {
      next() {
        if (node === null) {
          return { value: undefined, done: true }
        }

        const value = node.data;
        node = node.next;
        return { value, done: false }
      }
    }
  }
}
