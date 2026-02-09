import * as THREE from "three";
import * as CANNON from "cannon-es";
import { world } from "../physics/world.js";

export class Player {
  constructor(camera, coneScan) {
    this.group = new THREE.Group();

    const spaceShipGeometry = {
      width: 1,
      height: 0.5,
      depth: 2,
    };

    const geometry = new THREE.BoxGeometry(
      spaceShipGeometry.width,
      spaceShipGeometry.height,
      spaceShipGeometry.depth
    );
    const material = new THREE.MeshNormalMaterial();

    this.mesh = new THREE.Mesh(geometry, material);

    //Camera
    this.camera = camera;
    this.coneScan = coneScan;
    this.group.add(this.mesh);
    this.group.add(camera, coneScan);
    // this.group.add(coneScan);

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
    // --- CHASSIS BODY ---
    const chassisShape = new CANNON.Box(
      new CANNON.Vec3(
        spaceShipGeometry.width,
        spaceShipGeometry.height * 0.5,
        spaceShipGeometry.depth * 0.5
      )
    );
    this.chassisBody = new CANNON.Body({
      mass: 5,
      position: new CANNON.Vec3(0, 1, 0),
    });
    this.chassisBody.addShape(chassisShape);
    this.chassisBody.linearDamping = 0.2;
    this.chassisBody.angularDamping = 0.85;
    this.chassisBody.allowSleep = false;

    world.addBody(this.chassisBody);

    // --- VEHICLE ---
    this.vehicle = new CANNON.RigidVehicle({
      chassisBody: this.chassisBody,
    });

    // --- WHEEL OPTIONS ---

    const mass = 1;
    const axisWidth = spaceShipGeometry.width;
    const wheelShape = new CANNON.Sphere(0.35);
    const wheelMaterial = new CANNON.Material("wheel");
    const down = new CANNON.Vec3(0, -1, 0);

    const wheelBody1 = new CANNON.Body({ mass, material: wheelMaterial });
    wheelBody1.addShape(wheelShape);
    wheelBody1.angularDamping = 0.85;
    this.vehicle.addWheel({
      body: wheelBody1,
      position: new CANNON.Vec3(-0.89, 0, -axisWidth / 2), //1
      axis: new CANNON.Vec3(1, 0, 0),
      direction: down,
    });
    const wheelBody2 = new CANNON.Body({ mass, material: wheelMaterial });
    wheelBody2.addShape(wheelShape);
    wheelBody2.angularDamping = 0.85;
    this.vehicle.addWheel({
      body: wheelBody2,
      position: new CANNON.Vec3(0.89, 0, -axisWidth / 2), //2
      axis: new CANNON.Vec3(1, 0, 0),
      direction: down,
    });
    const wheelBody3 = new CANNON.Body({ mass, material: wheelMaterial });
    wheelBody3.addShape(wheelShape);
    wheelBody3.angularDamping = 0.85;
    this.vehicle.addWheel({
      body: wheelBody3,
      position: new CANNON.Vec3(-0.89, 0, axisWidth / 2), //3

      axis: new CANNON.Vec3(1, 0, 0),
      direction: down,
    });
    const wheelBody4 = new CANNON.Body({ mass, material: wheelMaterial });
    wheelBody4.addShape(wheelShape);
    wheelBody4.angularDamping = 0.85;
    this.vehicle.addWheel({
      body: wheelBody4,
      position: new CANNON.Vec3(0.89, 0, axisWidth / 2), //4
      axis: new CANNON.Vec3(1, 0, 0),
      direction: down,
    });
    this.vehicle.addToWorld(world);

    //plane rigid body
    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body();
    floorBody.mass = 0;
    floorBody.addShape(floorShape);
    floorBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(-1, 0, 0),
      Math.PI * 0.5
    );
    world.addBody(floorBody);
  }

  update(delta, keys) {
    const maxForce = 6;
    const speedMultiplier = 2;
    const speed = this.chassisBody.velocity.length();
    const maxSteerVal = THREE.MathUtils.lerp(
      Math.PI / 4,
      Math.PI / 12,
      speed / 10
    );
    const q = this.chassisBody.quaternion;
    const euler = new CANNON.Vec3();
    q.toEuler(euler);

    // Kill roll + pitch
    euler.x *= 0.9;
    euler.z *= 0.9;

    q.setFromEuler(euler.x, euler.y, euler.z, "XYZ");

    if (keys.forward || keys.backward || keys.left || keys.right) {
      this.chassisBody.wakeUp();
    }

    for (let i = 0; i < this.vehicle.wheelBodies.length; i++) {
      this.vehicle.setWheelForce(0, i);
      this.vehicle.setSteeringValue(0, i);
      this.vehicle.wheelBodies[i].wakeUp();
    }

    if (keys.forward) {
      for (let i = 0; i < 4; i++) {
        this.vehicle.setWheelForce(-maxForce, i);
      }
    }
    if (keys.forward && keys.boost) {
      for (let i = 0; i < 4; i++) {
        this.vehicle.setWheelForce(-maxForce * speedMultiplier, i);
      }
    }

    if (keys.backward) {
      for (let i = 0; i < 4; i++) {
        this.vehicle.setWheelForce(maxForce * 0.5, i);
      }
    }

    if (keys.left) {
      this.vehicle.setSteeringValue(maxSteerVal, 0);
      this.vehicle.setSteeringValue(maxSteerVal, 1);
    }

    if (keys.right) {
      this.vehicle.setSteeringValue(-maxSteerVal, 0);
      this.vehicle.setSteeringValue(-maxSteerVal, 1);
    }

    //Camera Lerp & Target
    const targetCameraZ = keys.boost ? this.cameraZBoost : this.cameraZDefault;
    // this.group.rotation.z = this.currentTilt;
    this.mesh.rotation.z = this.currentTilt;

    this.currentCameraZ = THREE.MathUtils.lerp(
      this.currentCameraZ,
      targetCameraZ,
      delta * this.cameraLerpSpeed
    );

    this.camera.position.z = this.currentCameraZ;
  }
}
