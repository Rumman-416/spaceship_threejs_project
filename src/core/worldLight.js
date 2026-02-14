import * as THREE from "three";

export function createLights(scene) {
  const directionalLight = new THREE.DirectionalLight("#FFD689", 3.5);
  directionalLight.position.set(3, 5, 2);
  scene.add(directionalLight);
}
