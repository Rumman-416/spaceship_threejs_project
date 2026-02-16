import * as THREE from "three";

import { createPlayerMesh } from "./PlayerMesh.js";
import { createPlayerPhysics } from "./PlayerPhysics.js";
import { updatePlayerMovement } from "./PlayerMovement.js";
import { updateBoosters } from "./Boosters.js";
import { updatePlayerCamera } from "./PlayerCamera.js";

export class Player {
  constructor(camera, coneScan, planets) {
    this.group = new THREE.Group();

    this.dimensions = {
      width: 1,
      height: 0.5,
      depth: 2,
    };

    this.targetColor = new THREE.Color();

    createPlayerMesh(this.dimensions).then((meshData) => {
      this.mesh = meshData.model;
      this.boosterMaterial = meshData.boosterMaterial; // 🔥 important
      this.group.add(this.mesh);
    });

    const physics = createPlayerPhysics(this.dimensions);

    this.chassisBody = physics.chassisBody;
    this.vehicle = physics.vehicle;

    this.camera = camera;
    this.coneScan = coneScan;

    /**
     * Raycaster
     */

    // const arrowHelper = new THREE.ArrowHelper(
    //   new THREE.Vector3(0, 0, -10), // Initial direction (normalized)
    //   new THREE.Vector3(0, 0, 0), // Initial origin
    //   15, // Length of the ray visualization
    //   0xff0000, // Color (red)
    // );

    this.planets = planets;

    this.raycaster = new THREE.Raycaster();
    this.raycaster.far = 20;
    this.rayOrigin = new THREE.Vector3();
    this.rayDirection = new THREE.Vector3(0, 0, -1);

    /**
     * Raycaster
     */

    this.group.add(camera, coneScan);

    camera.position.set(0, 1.5, 6);
    camera.rotation.set(-0.15, 0, 0);

    this.currentCameraZ = 6;
  }

  update(delta, keys) {
    updatePlayerMovement(this.vehicle, this.chassisBody, keys);

    updateBoosters(this.boosterMaterial, this.targetColor, keys);

    this.currentCameraZ = updatePlayerCamera(
      this.camera,
      this.currentCameraZ,
      keys,
      delta,
    );

    this.group.position.copy(this.chassisBody.position);
    this.group.quaternion.copy(this.chassisBody.quaternion);

    // -------- SCANNER --------
    if (keys.scan && this.mesh) {
      // player world position
      this.group.getWorldPosition(this.rayOrigin);

      // forward direction of ship
      this.rayDirection.set(0, 0, -1).applyQuaternion(this.group.quaternion);

      this.raycaster.set(this.rayOrigin, this.rayDirection);

      const intersects = this.raycaster.intersectObject(this.planets, true);

      if (intersects.length > 0) {
        const hit = intersects[0].object;

        if (hit.userData?.name) {
          console.log("Planet Name:", hit.userData.name);
          console.log("Population:", hit.userData.population);
        }
      }
    }
  }
}
