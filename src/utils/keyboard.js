export const keys = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  boost: false,
  scan: false,
};

const keyMap = {
  ArrowUp: "forward",
  KeyW: "forward",

  ArrowDown: "backward",
  KeyS: "backward",

  ArrowLeft: "left",
  KeyA: "left",

  ArrowRight: "right",
  KeyD: "right",

  ShiftLeft: "boost",
  ShiftRight: "boost",

  KeyF: "scan",
};

export function initKeyboard() {
  window.addEventListener("keydown", (e) => {
    const action = keyMap[e.code];
    if (action) keys[action] = true;
  });

  window.addEventListener("keyup", (e) => {
    const action = keyMap[e.code];
    if (action) keys[action] = false;
  });
}
