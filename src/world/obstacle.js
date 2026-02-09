import * as THREE from "three";
import * as CANNON from "cannon-es";
import { world } from "../physics/world.js";
export function createObstacles(scene) {
  const obstacles = [];

  const geometry = new THREE.IcosahedronGeometry(0.6);
  const material = new THREE.MeshNormalMaterial();
  const obstacle = new THREE.Mesh(geometry, material);
  obstacle.position.z = -10;
  obstacle.position.x = -3;
  scene.add(obstacle);
  // for (let i = 0; i < 5; i++) {
  //   const mesh = new THREE.Mesh(geometry, material);
  //   mesh.position.set(Math.random() * 6 - 3, 0, Math.random() * -10);

  //   scene.add(mesh);

  //   obstacles.push({
  //     mesh,
  //     radius: 0.6,
  //   });
  // }

  /**
   * physics world
   *  */
  //obstacle rigid body
  const sphereShape = new CANNON.Sphere(1);
  const obstacleRigidBody = new CANNON.Body({
    mass: 0.5,
    position: new CANNON.Vec3(-3, 2, -10),
    shape: sphereShape,
    linearDamping: 0.01,
    angularDamping: 0.05,
  });
  world.addBody(obstacleRigidBody);

  return { obstacle, obstacleRigidBody };
}
