import * as THREE from "three";

export function createFloor(scene) {
  const geometry = new THREE.PlaneGeometry(50, 50, 32, 32);
  const material = new THREE.MeshBasicMaterial({ wireframe: true });

  const floor = new THREE.Mesh(geometry, material);
  floor.rotation.x = Math.PI / 2;
  floor.position.y = -1;

  scene.add(floor);
}
