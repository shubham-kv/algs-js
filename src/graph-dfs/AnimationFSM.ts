
export class AnimationFSM<TState extends string> {
  #currentState: TState;
  #nextStates: { [k in TState]: TState[] };

  constructor(initialState: TState, nextStates: { [k in TState]: TState[] }) {
    this.#currentState = initialState;
    this.#nextStates = nextStates;
  }

  get currentState(): TState {
    return this.#currentState;
  }

  canTransitionTo(toState: TState): boolean {
    return this.#nextStates[this.#currentState].includes(toState);
  }

  transitionTo(toState: TState): void {
    if (!this.canTransitionTo(toState)) {
      throw new Error(
        `Invalid transition from ${this.#currentState} to ${toState}`,
      );
    }
    this.#currentState = toState;
  }
}
