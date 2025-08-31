class QueueNode<T> {
  next: QueueNode<T> | null;
  data: T;

  constructor(data: T, next?: QueueNode<T> | null | undefined) {
    this.data = data;
    this.next = next ?? null;
  }
}

export class Queue<T> implements Iterable<T> {
  #first: QueueNode<T> | null = null;
  #last: QueueNode<T> | null = null;
  #size: number = 0;

  enqueue(data: T): void {
    const node = new QueueNode(data);

    if (this.#first === null) {
      this.#first = this.#last = node;
    } else {
      this.#last!.next = node;
      this.#last = node;
    }
    this.#size++;
  }

  dequeue(): T | null {
    if (this.#first === null) {
      return null;
    }

    const data = this.#first.data;
    const next = this.#first.next;

    if (next === null) {
      this.#first = this.#last = null;
    } else {
      this.#first = next;
    }
    this.#size--;
    return data;
  }

  peek(): T | null {
    return this.#first?.data ?? null;
  }

  get size(): number {
    return this.#size;
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  [Symbol.iterator](): Iterator<T, any, any> {
    let node = this.#first;

    return {
      next() {
        if (!node) {
          return { value: undefined, done: true };
        }

        const value = node.data;
        node = node.next;
        return { value: value, done: false };
      },
    };
  }
}
