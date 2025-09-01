import { afterEach, beforeEach, describe, test } from "vitest";
import { LinkedStack } from "./LinkedStack";

describe("LinkedStack", () => {
  let stack: LinkedStack<number> | undefined;

  beforeEach(() => {
    stack = new LinkedStack();
  });
  afterEach(() => {
    stack = undefined;
  });

  describe("push()", () => {
    describe("when items are pushed onto stack", () => {
      const items: number[] = Array(128_000)
        .fill(0)
        .map((_, i) => i);

      beforeEach(() => {
        if (!stack) {
          throw new Error("Expected stack to be non-null");
        }
        for (const item of items) {
          stack.push(item);
        }
      });

      test("stack size should be correct", ({ expect }) => {
        expect(stack!.size).toBe(items.length);
      });
      test("stack should not be empty", ({ expect }) => {
        expect(stack!.isEmpty).toBe(false);
      });
    });
  });

  describe("pop()", () => {
    describe("given the stack is empty", () => {
      describe("when an item is popped from the stack", () => {
        let data: number | null | undefined = undefined;

        beforeEach(() => {
          if (!stack) {
            throw new Error("Expected stack to be non-null");
          }
          data = stack.pop();
        });

        test("should return null", ({ expect }) => {
          expect(data).toBe(null);
        });
      });
    });

    describe("given the stack contains items", () => {
      const items: number[] = Array(1_000)
        .fill(0)
        .map((_, i) => i);

      beforeEach(() => {
        if (!stack) {
          throw new Error("Expected stack to be non-null");
        }
        for (const item of items) {
          stack.push(item);
        }
      });

      describe("when all items are popped from the stack", () => {
        const poppedItems: (number | null)[] = [];

        beforeEach(() => {
          if (!stack) {
            throw new Error("Expected stack to be non-null");
          }
          const stackSize = stack.size;
          for (let i = 0; i < stackSize; i++) {
            poppedItems.push(stack.pop());
          }
        });

        test("should return items in LIFO order", ({ expect }) => {
          items.sort((a, b) => b - a);
          expect(poppedItems).toStrictEqual(items);
        });

        test("stack size should be 0", ({ expect }) => {
          expect(stack!.size).toBe(0);
        });

        test("stack should become empty", ({ expect }) => {
          expect(stack!.isEmpty).toBe(true);
        });
      });
    });
  });

  describe("peek()", () => {
    describe("given the stack is empty", () => {
      describe("when the stack is peeked", () => {
        let peekedItem: number | null | undefined = undefined;

        beforeEach(() => {
          if (!stack) {
            throw new Error("Expected stack to be non-null");
          }
          peekedItem = stack.peek();
        });

        test("should return null", ({ expect }) => {
          expect(peekedItem).toBe(null);
        });
      });
    });

    describe("given the stack contains items", () => {
      const items: number[] = Array(1_000)
        .fill(0)
        .map((_, i) => i);

      beforeEach(() => {
        if (!stack) {
          throw new Error("Expected stack to be non-null");
        }
        for (const item of items) {
          stack.push(item);
        }
      });

      describe("when the stack is peeked", () => {
        let peekedItem: number | null | undefined = undefined;

        beforeEach(() => {
          if (!stack) {
            throw new Error("Expected stack to be non-null");
          }
          peekedItem = stack.peek();
        });

        test("should return the most recently added item", ({ expect }) => {
          expect(peekedItem).toBe(items[items.length - 1]);
        });
      });
    });
  });

  describe("iterator", () => {
    describe("given the stack is empty", () => {
      describe("when the stack is iterated over", () => {
        const stackItems: number[] = []

        beforeEach(() => {
          if (!stack) {
            throw new Error("Expected stack to be non-null");
          }
          for (const item of stack) {
            stackItems.push(item);
          }
        });

        test("should not yield any items", ({ expect }) => {
          expect(stackItems).toStrictEqual([]);
        });
      });
    });

    describe("given the stack contains items", () => {
      const items: number[] = Array(1_000)
        .fill(0)
        .map((_, i) => i);

      beforeEach(() => {
        if (!stack) {
          throw new Error("Expected stack to be non-null");
        }
        for (const item of items) {
          stack.push(item);
        }
      });

      describe("when the stack is iterated over", () => {
        const stackItems: number[] = []

        beforeEach(() => {
          if (!stack) {
            throw new Error("Expected stack to be non-null");
          }
          for (const item of stack) {
            stackItems.push(item);
          }
        });

        test("should yield items in LIFO order", ({ expect }) => {
          items.sort((a, b) => b - a);
          expect(stackItems).toStrictEqual(items);
        });
      });
    });
  });
});
