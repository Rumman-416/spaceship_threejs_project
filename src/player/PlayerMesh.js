import * as THREE from "three";

export function createPlayerMesh(dimensions) {
  const geometry = new THREE.BoxGeometry(
    dimensions.width,
    dimensions.height,
    dimensions.depth
  );

  const material = new THREE.MeshNormalMaterial();

  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
}
