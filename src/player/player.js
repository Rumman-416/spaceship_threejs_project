import * as THREE from "three";

import { createPlayerMesh } from "./PlayerMesh.js";
import { createPlayerPhysics } from "./PlayerPhysics.js";
import { updatePlayerMovement } from "./PlayerMovement.js";
import { updatePlayerCamera } from "./PlayerCamera.js";

export class Player {
  constructor(camera, coneScan, planets) {
    this.group = new THREE.Group();

    this.dimensions = {
      width: 1,
      height: 0.5,
      depth: 2,
    };

    this.mesh = createPlayerMesh(this.dimensions);

    const physics = createPlayerPhysics(this.dimensions);

    this.chassisBody = physics.chassisBody;
    this.vehicle = physics.vehicle;

    this.camera = camera;
    this.coneScan = coneScan;
    /**
     * Raycaster
     */
    const raycaster = new THREE.Raycaster();
    const rayOrigin = new THREE.Vector3(0, 0, 0);
    const rayDirection = new THREE.Vector3(0, 0, -100);
    rayDirection.normalize();

    raycaster.set(rayOrigin, rayDirection);

    const intersect = raycaster.intersectObject(planets);
    console.log(intersect);

    const arrowHelper = new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, -10), // Initial direction (normalized)
      new THREE.Vector3(0, 0, 0), // Initial origin
      15, // Length of the ray visualization
      0xff0000 // Color (red)
    );

    /**
     * Raycaster
     */

    this.group.add(this.mesh, camera, coneScan, arrowHelper);

    camera.position.set(0, 1.5, 6);
    camera.rotation.set(-0.15, 0, 0);

    this.currentCameraZ = 6;
  }

  update(delta, keys) {
    updatePlayerMovement(this.vehicle, this.chassisBody, keys);

    this.currentCameraZ = updatePlayerCamera(
      this.camera,
      this.currentCameraZ,
      keys,
      delta
    );

    this.group.position.copy(this.chassisBody.position);
    this.group.quaternion.copy(this.chassisBody.quaternion);
  }
}
