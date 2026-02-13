import * as CANNON from "cannon-es";
import { world } from "./world.js";

export function createFloor() {
  const floorShape = new CANNON.Plane();

  const floorBody = new CANNON.Body({
    mass: 0, // static body
  });

  floorBody.addShape(floorShape);

  // rotate so it's horizontal
  floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

  world.addBody(floorBody);

  return floorBody;
}
