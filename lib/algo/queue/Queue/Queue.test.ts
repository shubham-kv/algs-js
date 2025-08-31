import {
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
} from "vitest";

import { Queue } from "./Queue";

describe("Queue", () => {
  describe("enqueue()", () => {
    describe("when items are enqueued", () => {
      let queue: Queue<number> | undefined;
      const items: number[] = Array(1_024_000)
        .fill(0)
        .map((_, i) => i);

      beforeEach(() => {
        queue = new Queue();
        for (const item of items) {
          queue.enqueue(item);
        }
      });
      afterEach(() => {
        queue = undefined;
      });

      test("queue should not be empty", ({ expect }) => {
        expect(queue!.isEmpty()).toBe(false);
      });

      test("queue size should be correct", ({ expect }) => {
        expect(queue!.size).toBe(items.length);
      });
    });
  });

  describe("dequeue()", () => {
    describe("given the queue is empty", () => {
      let queue: Queue<number> | undefined;

      beforeEach(() => {
        queue = new Queue();
      });
      afterEach(() => {
        queue = undefined;
      });

      describe("when items are dequeued", () => {
        let dequeuedItem: number | null;

        beforeEach(() => {
          if (!queue) {
            throw new Error("Expected queue to be non-null");
          }
          dequeuedItem = queue.dequeue();
        });

        test("should return null", ({ expect }) => {
          expect(dequeuedItem).toBe(null);
        });
      });
    });

    describe("given the queue contains items", () => {
      let queue: Queue<number> | undefined;
      const items: number[] = Array(1_024_000)
        .fill(0)
        .map((_, i) => i);

      beforeEach(() => {
        queue = new Queue();
        for (const item of items) {
          queue.enqueue(item);
        }
      });
      afterEach(() => {
        queue = undefined;
      });

      describe("when all items are dequeued", () => {
        const dequeuedItems: number[] = [];

        beforeEach(() => {
          if (!queue) {
            throw new Error("Expected queue to be non-null");
          }
          const n = queue.size;
          for (let i = 0; i < n; i++) {
            dequeuedItems.push(queue.dequeue()!);
          }
        });

        test("should dequeue items in FIFO order", ({ expect }) => {
          expect(dequeuedItems).toMatchObject(items);
        });

        test("queue size should be 0", () => {
          expect(queue!.size).toBe(0);
        });

        test("queue should be empty", () => {
          expect(queue!.isEmpty()).toBe(true);
        });
      });
    });
  });

  describe("peek()", () => {
    describe("given the queue is empty", () => {
      let queue: Queue<number> | undefined;

      beforeEach(() => {
        queue = new Queue();
      });
      afterEach(() => {
        queue = undefined;
      });

      describe("when the queue is peeked", () => {
        let peekedItem: number | null;

        beforeEach(() => {
          if (!queue) {
            throw new Error("Expected queue to be non-null");
          }
          peekedItem = queue.peek();
        });

        test("should return null", ({ expect }) => {
          expect(peekedItem).toBe(null);
        });
      });
    });

    describe("given the queue contains items", () => {
      let queue: Queue<number> | undefined;
      const items: number[] = Array(1_000)
        .fill(0)
        .map((_, i) => i);

      beforeEach(() => {
        queue = new Queue();
        for (const item of items) {
          queue.enqueue(item);
        }
      });
      afterEach(() => {
        queue = undefined;
      });

      describe("when the queue is peeked", () => {
        let peekedItem: number | null;

        beforeEach(() => {
          if (!queue) {
            throw new Error("Expected queue to be non-null");
          }
          peekedItem = queue.peek();
        });

        test("should return the first item", ({ expect }) => {
          expect(peekedItem).toStrictEqual(items[0]);
        });
      });
    });
  });

  describe('iterator', () => {
    describe("given the queue is empty", () => {
      let queue: Queue<number> | undefined;

      beforeEach(() => {
        queue = new Queue();
      });
      afterEach(() => {
        queue = undefined;
      });

      describe("when the queue is iterated over", () => {
        const result: (number|null)[] = [];

        beforeEach(() => {
          if (!queue) {
            throw new Error("Expected queue to be non-null");
          }
          for (const item of queue) {
            result.push(item);
          }
        });

        test("should not yield anything", ({ expect }) => {
          expect(result).toStrictEqual([]);
        });
      });
    });

    describe("given the queue contains items", () => {
      let queue: Queue<number> | undefined;
      const items: number[] = Array(1_024_000)
        .fill(0)
        .map((_, i) => i);

      beforeEach(() => {
        queue = new Queue();
        for (const item of items) {
          queue.enqueue(item);
        }
      });
      afterEach(() => {
        queue = undefined;
      });

      describe("when the queue is iterated over", () => {
        const result: (number|null)[] = [];

        beforeEach(() => {
          if (!queue) {
            throw new Error("Expected queue to be non-null");
          }
          for (const item of queue) {
            result.push(item);
          }
        });

        test("should yield items in FIFO order", ({ expect }) => {
          expect(result).toStrictEqual(items);
        });
      });
    });
  });
});
