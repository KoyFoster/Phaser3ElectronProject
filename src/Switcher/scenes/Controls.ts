import Phaser from "phaser";

type IInput = {
  tag: string;
  flagged: () => boolean;
};

// type IMacro = {
//   [key: string | number]: (() => void) | undefined;
//   a?: () => void;
//   b?: () => void;
//   c?: () => void;
//   d?: () => void;
//   e?: () => void;
//   f?: () => void;
//   g?: () => void;
//   h?: () => void;
//   i?: () => void;
//   j?: () => void;
//   k?: () => void;
//   l?: () => void;
//   m?: () => void;
//   n?: () => void;
//   o?: () => void;
//   p?: () => void;
//   q?: () => void;
//   r?: () => void;
//   s?: () => void;
//   t?: () => void;
//   u?: () => void;
//   v?: () => void;
//   w?: () => void;
//   x?: () => void;
//   y?: () => void;
//   z?: () => void;

//   "{"?: () => void;
//   "}"?: () => void;
//   "\\"?: () => void;

//   ":"?: () => void;
//   "'"?: () => void;
//   "."?: () => void;

//   ","?: () => void;
//   "/"?: () => void;

//   "`"?: () => void;
//   "1"?: () => void;
//   "2"?: () => void;
//   "3"?: () => void;
//   "4"?: () => void;
//   "5"?: () => void;
//   "6"?: () => void;
//   "7"?: () => void;
//   "8"?: () => void;
//   "9"?: () => void;
//   "0"?: () => void;
//   "-"?: () => void;
//   "="?: () => void;
//   Backspace?: () => void;

//   "+"?: () => void;
//   "*"?: () => void;

//   Escape?: () => void;
//   F1?: () => void;
//   F2?: () => void;
//   F3?: () => void;
//   F4?: () => void;
//   F5?: () => void;
//   F6?: () => void;
//   F7?: () => void;
//   F8?: () => void;
//   F9?: () => void;
//   F10?: () => void;
//   F11?: () => void;
//   F12?: () => void;

//   clickLeft?: () => void;
//   clickRight?: () => void;
//   clickMiddle?: () => void;
//   clickSide1?: () => void;
//   clickSide2?: () => void;
//   clickSide3?: () => void;
//   clickSide4?: () => void;
// };

type IInputs = {
  [key: string | number]: boolean | undefined;
  a?: boolean;
  b?: boolean;
  c?: boolean;
  d?: boolean;
  e?: boolean;
  f?: boolean;
  g?: boolean;
  h?: boolean;
  i?: boolean;
  j?: boolean;
  k?: boolean;
  l?: boolean;
  m?: boolean;
  n?: boolean;
  o?: boolean;
  p?: boolean;
  q?: boolean;
  r?: boolean;
  s?: boolean;
  t?: boolean;
  u?: boolean;
  v?: boolean;
  w?: boolean;
  x?: boolean;
  y?: boolean;
  z?: boolean;

  "{"?: boolean;
  "}"?: boolean;
  "\\"?: boolean;

  ":"?: boolean;
  "'"?: boolean;
  "."?: boolean;

  ","?: boolean;
  "/"?: boolean;

  "`"?: boolean;
  "1"?: boolean;
  "2"?: boolean;
  "3"?: boolean;
  "4"?: boolean;
  "5"?: boolean;
  "6"?: boolean;
  "7"?: boolean;
  "8"?: boolean;
  "9"?: boolean;
  "0"?: boolean;
  "-"?: boolean;
  "="?: boolean;
  backspace?: boolean;

  "+"?: boolean;
  "*"?: boolean;

  esc?: boolean;
  F1?: boolean;
  F2?: boolean;
  F3?: boolean;
  F4?: boolean;
  F5?: boolean;
  F6?: boolean;
  F7?: boolean;
  F8?: boolean;
  F9?: boolean;
  F10?: boolean;
  F11?: boolean;
  F12?: boolean;

  clickLeft?: boolean;
  clickRight?: boolean;
  clickMiddle?: boolean;
  clickSide1?: boolean;
  clickSide2?: boolean;
  clickSide3?: boolean;
  clickSide4?: boolean;
};

interface IMappings {
  [key: string | number]: Array<string>;
  up: Array<string>;
  down: Array<string>;
  left: Array<string>;
  right: Array<string>;

  primary: Array<string>;
  secondary: Array<string>;

  "shift-primary": Array<string>;
  "shift-secondary": Array<string>;

  "alt-primary": Array<string>;
  "alt-secondary": Array<string>;
}

const Mappings = {
  up: ["w"],
  down: ["s"],
  left: ["a"],
  right: ["d"],

  primary: ["clickLeft"],
  secondary: ["clickRight"],

  "shift-primary": ["shift+clickLeft"],
  "shift-secondary": ["shift+clickLeft"],

  "alt-primary": ["alt+clickLeft"],
  "alt-secondary": ["alt+clickLeft"],
} as IMappings;

interface IMacros {
  [key: string | number]: () => boolean;
  up: () => boolean;
  down: () => boolean;
  left: () => boolean;
  right: () => boolean;

  primary: () => boolean;
  secondary: () => boolean;

  "shift-primary": () => boolean;
  "shift-secondary": () => boolean;

  "alt-primary": () => boolean;
  "alt-secondary": () => boolean;
}

export default class Controls extends Phaser.Scene {
  inputs = {} as IInputs;
  macros = {} as IMacros;
  constructor() {
    super("controls");

    this.input;
  }

  preload() {}

  init(data: {}) {
    // get inputs
    const keys = Object.keys(Mappings);
    keys.map((key) => (this.macros[key] = this.getBind(Mappings[key])));
    console.log("macros:", this.macros, keys);
  }

  getBind(mapping: string[]): () => boolean {
    console.log("getBind", { mapping });

    return () => {
      console.log("input", { mapping });
      for (let i = 0; i < mapping.length; i += 1) {
        if (this.inputs[mapping[i]] === true) return false;
        return true;
      }
      return false;
    };
  }

  create() {
    // window.addEventListener("mousemove", (e) => this.onMouseMove(e));
    window.addEventListener("mouseup", (e) => this.onMouse(e, false));
    window.addEventListener("mousedown", (e) => this.onMouse(e, true));
    window.addEventListener("keydown", (e) => this.onKey(e, true));
    window.addEventListener("keyup", (e) => this.onKey(e, false));
    // this.macros.up = this.getBind(Mappings.up);
  }

  update(t: number, dt: number) {}

  setkeyInput(keyInput: () => boolean) {}

  setMouseInput(mouseInput: string, context: Phaser.Scene) {}

  destroy() {}

  getInputs() {
    return this.inputs;
  }

  getMacros(): IMacros {
    return this.macros;
  }

  onMouseMove(e: MouseEvent) {
    // console.log("onMouseMove:", { x: e.offsetX, y: e.offsetY });
  }

  onMouse(e: MouseEvent, pressed: boolean) {
    // console.log(`onMouse(${pressed}):`, e.button);
    if (e.button === 0) this.inputs.clickLeft = pressed;
    if (e.button === 1) this.inputs.clickMid = pressed;
    if (e.button === 2) this.inputs.clickRight = pressed;

    if (e.button === 3) this.inputs.clickSide1 = pressed;
    if (e.button === 4) this.inputs.clickSide2 = pressed;
    if (e.button === 5) this.inputs.clickSide3 = pressed;
    if (e.button === 6) this.inputs.clickSide4 = pressed;
  }
  onKey(e: KeyboardEvent, pressed: boolean) {
    // console.log(`onKey(${pressed}):`, e.key);
    this.inputs[e.key] = pressed;
  }
}
