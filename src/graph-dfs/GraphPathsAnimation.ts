import { AnimationFSM } from "./AnimationFSM";
import { AnimationLoop } from "./AnimationLoop";

type AnimState = "idle" | "initial" | "running" | "paused" | "finished";

const nextStates: Readonly<{
  [k in AnimState]: AnimState[];
}> = Object.freeze({
  idle: ["initial"],
  initial: ["running"],
  running: ["paused", "finished"],
  paused: ["running"],
  finished: ["initial"],
});

interface AlgorithmStepper {
  initialize(): void;
  step(onComplete: Function): void | Promise<void>;
  reset(): void;
}

export class GraphPathsAnimation {
  #fsm: AnimationFSM<AnimState>;
  #animationLoop: AnimationLoop;

  constructor(graphAlgoStepper: AlgorithmStepper) {
    this.#fsm = new AnimationFSM("idle", nextStates);

    this.#animationLoop = new AnimationLoop(async (stopAnimationLoop) => {
      const stopAnimation = () => {
        stopAnimationLoop();
        this.#fsm.transitionTo("finished");
      };
      await graphAlgoStepper.step(stopAnimation);
    });
  }

  // start(): void { }
  // stop(): void { }

  play(): void {
    if (!this.#fsm.canTransitionTo("running")) return;

    this.#fsm.transitionTo("running");
    this.#animationLoop.start();
  }

  pause(): void {
    if (!this.#fsm.canTransitionTo("paused")) return;

    this.#fsm.transitionTo("paused");
    this.#animationLoop.stop();
  }
}
