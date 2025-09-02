import { AnimationFSM } from "./AnimationFSM";
import { AnimationLoop } from "./AnimationLoop";

type GraphSearchAnimState = "idle" | "initial" | "running" | "paused" | "finished";

const nextStates: Readonly<{
  [k in GraphSearchAnimState]: GraphSearchAnimState[];
}> = Object.freeze({
  idle: ["initial"],
  initial: ["running"],
  running: ["paused", "finished"],
  paused: ["running"],
  finished: [],
});

interface AlgorithmStepper {
  initialize(): void
  step(onComplete: Function): void | Promise<void>
  reset(): void
}

export class GraphSearchAnimation {
  #fsm: AnimationFSM<GraphSearchAnimState>;
  #animationLoop: AnimationLoop;

  constructor(graphAlgoStepper: AlgorithmStepper) {
    this.#fsm = new AnimationFSM('idle', nextStates);

    this.#animationLoop = new AnimationLoop(async (stopAnimationLoop) => {
      const stopAnimation = () => {
        stopAnimationLoop();
        this.#fsm.transitionTo('finished');
      }
      await graphAlgoStepper.step(stopAnimation);
    });
  }

  start(): void {
  }

  stop(): void {}

  play(): void {}

  pause(): void {}
}
