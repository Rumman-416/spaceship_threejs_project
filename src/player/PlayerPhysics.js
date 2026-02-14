import * as CANNON from "cannon-es";
import { world } from "../physics/world.js";

export function createPlayerPhysics(dimensions) {
  const chassisShape = new CANNON.Box(
    new CANNON.Vec3(
      dimensions.width * 0.5,
      dimensions.height * 0.5,
      dimensions.depth * 0.5,
    ),
  );

  const chassisBody = new CANNON.Body({
    mass: 5,
    position: new CANNON.Vec3(0, 1, 0),
  });

  chassisBody.angularFactor.set(0, 1, 0); // prevent flipping

  chassisBody.addShape(chassisShape);
  chassisBody.linearDamping = 0.2;
  chassisBody.angularDamping = 0.85;
  chassisBody.allowSleep = false;

  world.addBody(chassisBody);

  const vehicle = new CANNON.RigidVehicle({
    chassisBody,
  });

  const wheelShape = new CANNON.Sphere(0.35);

  const positions = [
    [-0.89, 0, -dimensions.width / 2],
    [0.89, 0, -dimensions.width / 2],
    [-0.89, 0, dimensions.width / 2],
    [0.89, 0, dimensions.width / 2],
  ];

  positions.forEach((pos) => {
    const wheelBody = new CANNON.Body({ mass: 1 });
    wheelBody.addShape(wheelShape);
    wheelBody.angularDamping = 0.85;
    // wheelBody.linearFactor.set(1, 0, 1); // no vertical movement

    vehicle.addWheel({
      body: wheelBody,
      position: new CANNON.Vec3(...pos),
      axis: new CANNON.Vec3(1, 0, 0),
      direction: new CANNON.Vec3(0, -1, 0),
    });
  });

  vehicle.addToWorld(world);

  return { chassisBody, vehicle };
}
