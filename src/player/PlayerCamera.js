import * as THREE from "three";

export function updatePlayerCamera(camera, currentZ, keys, delta) {
  const defaultZ = 6;
  const boostZ = 7.5;
  const lerpSpeed = 6;

  const targetZ = keys.boost ? boostZ : defaultZ;

  const newZ = THREE.MathUtils.lerp(currentZ, targetZ, delta * lerpSpeed);

  camera.position.z = newZ;

  return newZ;
}
