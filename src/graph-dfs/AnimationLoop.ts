
type AnimateCallback = (onComplete: Function) => void | Promise<void>;

export class AnimationLoop {
  #animateFn: AnimateCallback;
  #isRunning: boolean = false;
  #frameHandle: number = 0;

  constructor(animateFn: AnimateCallback) {
    this.#animateFn = animateFn;
  }

  get isRunning(): boolean {
    return this.#isRunning;
  }

  async #loop(): Promise<void> {
    if (!this.#isRunning) {
      return;
    }

    const onComplete = () => {
      this.stop();
    };
    await this.#animateFn(onComplete);

    if (!this.#isRunning) {
      return;
    }

    this.#frameHandle = requestAnimationFrame(this.#loop);
  }

  start(): void {
    this.#isRunning = true;
    this.#frameHandle = requestAnimationFrame(this.#loop);
  }

  stop(): void {
    this.#isRunning = false;
    cancelAnimationFrame(this.#frameHandle);
  }
}
