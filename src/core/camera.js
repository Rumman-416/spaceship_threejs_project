import * as THREE from "three";
import { sizes } from "./sizes.js";

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    25,
    sizes.width / sizes.height,
    0.1,
    100,
  );

  camera.position.set(0, 0, 8);

  return camera;
}
