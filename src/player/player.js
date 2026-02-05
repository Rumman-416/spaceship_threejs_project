import * as THREE from "three";
import * as CANNON from "cannon-es";
import { world } from "../physics/world.js";

export class Player {
  constructor(camera, coneScan) {
    this.group = new THREE.Group();

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial();

    this.mesh = new THREE.Mesh(geometry, material);

    //Camera
    this.camera = camera;
    this.coneScan = coneScan;
    this.group.add(this.mesh);
    this.group.add(camera, coneScan);

    this.cameraZDefault = 6;
    this.cameraZBoost = 7.5;
    this.cameraLerpSpeed = 6;

    this.currentCameraZ = this.cameraZDefault;

    camera.position.set(0, 1.5, this.cameraZDefault);
    camera.rotation.set(-0.15, 0, 0);

    // Movement Speed
    this.baseSpeed = 4;
    this.boostMultiplier = 3.5;
    this.rotateSpeed = 2;

    // Tilt Effect
    this.maxTilt = Math.PI * 0.08; // how much it tilts
    this.tiltSpeed = 8; // how fast it tilts back
    this.currentTilt = 0;

    /**
     * physics world
     *  */
    //player rigid body
    // const boxShape = new CANNON.Box(new CANNON.Vec3(1 * 0.5, 1 * 0.5, 1 * 0.5));
    const boxShape = new CANNON.Sphere(1);
    this.boxBody = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 3, 0),
      shape: boxShape,
      linearDamping: 0.2,
      angularDamping: 0.9,
    });
    world.addBody(this.boxBody);

    //plane rigid body
    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body();
    floorBody.mass = 0;
    floorBody.addShape(floorShape);
    floorBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(-1, 0, 0),
      Math.PI * 0.5,
    );
    world.addBody(floorBody);
  }

  update(delta, keys) {
    const speed = keys.boost
      ? this.baseSpeed * this.boostMultiplier
      : this.baseSpeed;

    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(
      this.group.quaternion,
    );

    const forceStrength = speed * 5;
    if (keys.forward) {
      this.boxBody.applyForce(
        new CANNON.Vec3(0, 0, -forceStrength),
        new CANNON.Vec3(0, 0, 0),
      );
    }
    if (keys.backward) {
      this.boxBody.applyForce(
        new CANNON.Vec3(0, 0, forceStrength),
        new CANNON.Vec3(0, 0, 0),
      );
    }

    this.group.position.copy(this.boxBody.position);
    // this.mesh.quaternion.copy(this.boxBody.quaternion);

    // const speed = keys.boost
    //   ? this.baseSpeed * this.boostMultiplier
    //   : this.baseSpeed;
    // if (keys.forward) this.group.translateZ(-speed * delta);
    // if (keys.backward) this.group.translateZ(speed * delta);
    // if (keys.left) this.group.rotation.y += this.rotateSpeed * delta;
    // if (keys.right) this.group.rotation.y -= this.rotateSpeed * delta;

    // // Target tilt
    // let targetTilt = 0;

    // if (keys.left) targetTilt = this.maxTilt;
    // if (keys.right) targetTilt = -this.maxTilt;

    // this.currentTilt = THREE.MathUtils.lerp(
    //   this.currentTilt,
    //   targetTilt,
    //   delta * this.tiltSpeed,
    // );

    //Camera Lerp & Target
    const targetCameraZ = keys.boost ? this.cameraZBoost : this.cameraZDefault;
    // this.group.rotation.z = this.currentTilt;
    this.mesh.rotation.z = this.currentTilt;

    this.currentCameraZ = THREE.MathUtils.lerp(
      this.currentCameraZ,
      targetCameraZ,
      delta * this.cameraLerpSpeed,
    );

    this.camera.position.z = this.currentCameraZ;
  }
}
