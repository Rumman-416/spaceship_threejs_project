import * as THREE from "three";

export function createObstacles(scene) {
  const obstacles = [];

  const geometry = new THREE.IcosahedronGeometry(0.6);
  const material = new THREE.MeshBasicMaterial({ wireframe: true });

  for (let i = 0; i < 5; i++) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(Math.random() * 6 - 3, 0, Math.random() * -10);

    scene.add(mesh);

    obstacles.push({
      mesh,
      radius: 0.6,
    });
  }

  return obstacles;
}
