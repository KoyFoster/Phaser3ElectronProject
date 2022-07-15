interface StateConfig {
  name: string;
  onEnter?: () => void;
  onUpdate?: (dt: number) => void;
  onExit?: () => void;
}

let idCount = 0;

export default class StateMachine {
  private id = (++idCount).toString();
  private context?: object;
  private states = new Map<string, StateConfig>();

  private previousState?: StateConfig;
  private currentState?: StateConfig;
  private isChangingState = false;
  private changeStateQueue: string[] = [];

  get previousStateName() {
    if (!this.previousState) {
      return "";
    }

    return this.previousState.name;
  }

  constructor(context?: object, id?: string) {
    this.id = id ?? this.id;
    this.context = context;
  }

  setID(id?: string) {
    this.id = id ?? this.id;
  }

  isCurrentState(name: string) {
    if (!this.currentState) {
      return false;
    }

    return this.currentState.name === name;
  }

  addState(
    name: string,
    config?: {
      onEnter?: () => void;
      onUpdate?: (dt: number) => void;
      onExit?: () => void;
    }
  ) {
    const context = this.context;

    this.states.set(name, {
      name,
      onEnter: config?.onEnter?.bind(context),
      onUpdate: config?.onUpdate?.bind(context),
      onExit: config?.onExit?.bind(context),
    });

    return this;
  }

  setState(name: string) {
    if (!this.states.has(name)) {
      return;
    }

    if (this.isCurrentState(name)) {
      return;
    }

    if (this.isChangingState) {
      this.changeStateQueue.push(name);
      return;
    }

    this.isChangingState = true;

    if (this.currentState && this.currentState.onExit) {
      this.currentState.onExit();
    }

    this.previousState = this.currentState;
    this.currentState = this.states.get(name)!;

    if (this.currentState.onEnter) {
      this.currentState.onEnter();
    }

    this.isChangingState = false;
  }

  update(dt: number) {
    if (this.changeStateQueue.length > 0) {
      this.setState(this.changeStateQueue.shift()!);
      return;
    }

    if (this.currentState && this.currentState.onUpdate) {
      this.currentState.onUpdate(dt);
    }
  }
}
