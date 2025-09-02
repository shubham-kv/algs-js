
type AnimateCallback = (onComplete: Function) => void | Promise<void>;

export class AnimationLoop {
  #animateCb: AnimateCallback;
  #isRunning: boolean = false;
  #frameHandle: number = 0;

  constructor(animateCb: AnimateCallback) {
    this.#animateCb = animateCb;
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
    await this.#animateCb(onComplete);

    if (!this.#isRunning) {
      return;
    }

    this.#frameHandle = requestAnimationFrame(() => {
      this.#loop();
    });
  }

  start(): void {
    this.#isRunning = true;
    this.#loop();
  }

  stop(): void {
    this.#isRunning = false;
    cancelAnimationFrame(this.#frameHandle);
  }
}
