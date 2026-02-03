import * as THREE from "three";

const clock = new THREE.Clock();

export function getDelta() {
  return clock.getDelta();
}
