import * as THREE from "three";
import * as CANNON from "cannon-es";
import { world } from "../physics/world.js";

export class Player {
  constructor(camera, coneScan) {
    this.group = new THREE.Group();

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial();

    this.mesh = new THREE.Mesh(geometry, material);

    //Physics Body
    // this.body = new CANNON.Body({
    //   mass: 1, // lighter than obstacles
    //   shape: new CANNON.Sphere(0.5), // simple & stable
    //   position: new CANNON.Vec3(0, 0, 0),
    //   linearDamping: 0.2, // space drag (prevents infinite drift)
    //   angularDamping: 0.9,
    // });

    // world.addBody(this.body);

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
  }

  update(delta, keys) {
    const speed = keys.boost
      ? this.baseSpeed * this.boostMultiplier
      : this.baseSpeed;

    if (keys.forward) this.group.translateZ(-speed * delta);
    if (keys.backward) this.group.translateZ(speed * delta);
    if (keys.left) this.group.rotation.y += this.rotateSpeed * delta;
    if (keys.right) this.group.rotation.y -= this.rotateSpeed * delta;

    // Target tilt
    let targetTilt = 0;

    if (keys.left) targetTilt = this.maxTilt;
    if (keys.right) targetTilt = -this.maxTilt;

    this.currentTilt = THREE.MathUtils.lerp(
      this.currentTilt,
      targetTilt,
      delta * this.tiltSpeed,
    );

    //Camera Lerp & Target
    const targetCameraZ = keys.boost ? this.cameraZBoost : this.cameraZDefault;
    this.group.rotation.z = this.currentTilt;

    this.currentCameraZ = THREE.MathUtils.lerp(
      this.currentCameraZ,
      targetCameraZ,
      delta * this.cameraLerpSpeed,
    );

    this.camera.position.z = this.currentCameraZ;
  }

  //   update(delta, keys) {
  //     const maxSpin = 1.5;

  //     this.body.angularVelocity.x = THREE.MathUtils.clamp(
  //       this.body.angularVelocity.x,
  //       -maxSpin,
  //       maxSpin,
  //     );

  //     this.body.angularVelocity.y = THREE.MathUtils.clamp(
  //       this.body.angularVelocity.y,
  //       -maxSpin,
  //       maxSpin,
  //     );

  //     this.body.angularVelocity.z = THREE.MathUtils.clamp(
  //       this.body.angularVelocity.z,
  //       -maxSpin,
  //       maxSpin,
  //     );

  //     /* -------------------------------
  //      1. SPEED / BOOST
  //   --------------------------------*/
  //     const speed = keys.boost
  //       ? this.baseSpeed * this.boostMultiplier
  //       : this.baseSpeed;

  //     const forceStrength = speed * 5;
  //     const turnStrength = this.rotateSpeed * 2;

  //     /* -------------------------------
  //      2. FORWARD / BACKWARD (FORCES)
  //   --------------------------------*/
  //     const forwardDir = new THREE.Vector3(0, 0, -1).applyQuaternion(
  //       this.group.quaternion,
  //     );

  //     if (keys.forward) {
  //       this.body.applyForce(
  //         new CANNON.Vec3(
  //           forwardDir.x * forceStrength,
  //           forwardDir.y * forceStrength,
  //           forwardDir.z * forceStrength,
  //         ),
  //         this.body.position,
  //       );
  //     }

  //     if (keys.backward) {
  //       this.body.applyForce(
  //         new CANNON.Vec3(
  //           -forwardDir.x * forceStrength,
  //           -forwardDir.y * forceStrength,
  //           -forwardDir.z * forceStrength,
  //         ),
  //         this.body.position,
  //       );
  //     }

  //     /* -------------------------------
  //      3. TURNING (ANGULAR VELOCITY)
  //   --------------------------------*/
  //     if (keys.left) {
  //       this.body.angularVelocity.y += turnStrength * delta;
  //     }

  //     if (keys.right) {
  //       this.body.angularVelocity.y -= turnStrength * delta;
  //     }

  //     /* -------------------------------
  //      4. VISUAL TILT (NOT PHYSICS)
  //   --------------------------------*/
  //     let targetTilt = 0;

  //     if (keys.left) targetTilt = this.maxTilt;
  //     if (keys.right) targetTilt = -this.maxTilt;

  //     this.currentTilt = THREE.MathUtils.lerp(
  //       this.currentTilt,
  //       targetTilt,
  //       delta * this.tiltSpeed,
  //     );

  //     this.group.rotation.z = this.currentTilt;

  //     /* -------------------------------
  //      5. CAMERA BOOST LERP
  //   --------------------------------*/
  //     const targetCameraZ = keys.boost ? this.cameraZBoost : this.cameraZDefault;

  //     this.currentCameraZ = THREE.MathUtils.lerp(
  //       this.currentCameraZ,
  //       targetCameraZ,
  //       delta * this.cameraLerpSpeed,
  //     );

  //     this.camera.position.z = this.currentCameraZ;

  //     /* -------------------------------
  //      6. SYNC PHYSICS → RENDER
  //   --------------------------------*/
  //     this.group.position.copy(this.body.position);
  //     this.group.quaternion.copy(this.body.quaternion);
  //   }
}
