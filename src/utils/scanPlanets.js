import * as THREE from "three";

const raycaster = new THREE.Raycaster();
const rayOrigin = new THREE.Vector3();
const rayDirection = new THREE.Vector3();

export function scanPlanets(playerGroup, planets) {
  // get player world position
  playerGroup.getWorldPosition(rayOrigin);

  // get forward direction
  rayDirection.set(0, 0, -1).applyQuaternion(playerGroup.quaternion);

  // set raycaster
  raycaster.set(rayOrigin, rayDirection);

  // extract meshes
  const planetMeshes = planets.map((p) => p.mesh);

  // check intersection
  const intersects = raycaster.intersectObjects(planetMeshes, true);

  if (intersects.length > 0) {
    const hit = intersects[0].object;

    if (hit.userData?.name) {
      console.log("Planet Name:", hit.userData.name);
      console.log("Habitable:", hit.userData.habitable);
    }

    return hit.userData;
  }

  return null;
}
