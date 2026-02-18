import { scene } from "./core/scene.js";
import { createCamera } from "./core/camera.js";
import { createRenderer } from "./core/renderer.js";
import { onResize } from "./core/sizes.js";
import { animateScanScale } from "./animation/animateScanScale.js";
import * as THREE from "three";

import { createFloor } from "./world/floor.js";
import { createOrbit } from "./core/orbit.js";

import { Player } from "./player/player.js";
import { initKeyboard, keys } from "./utils/keyboard.js";
import { getDelta } from "./utils/clock.js";
import { createObstacles } from "./world/obstacle.js";
import { createScan } from "./player/coneScan.js";
import { createPlanet } from "./planets/planets.js";
import { world } from "./physics/world.js";
import CannonDebugger from "cannon-es-debugger";
import { initPhysics } from "./physics/initPhysics.js";
import { createLights } from "./core/worldLight.js";
import { scanPlanets } from "./utils/scanPlanets.js";

const canvas = document.querySelector("canvas.webgl");

const camera = createCamera();
const renderer = createRenderer(canvas);
const controls = createOrbit(camera, renderer);

const planetData = [
  {
    name: "nebula",
    habitable: true,
    radius: 5,
    position: [0, 0, -30],
    color1: "#2B0F0F",
    color2: "#FF6A00",
  },
  {
    name: "nebula 2",
    habitable: true,
    radius: 8,
    position: [-5, 2, 30],
    color1: "#2B0FFF",
    color2: "#FF6AF0",
  },
];

initPhysics();

onResize(camera, renderer);

initKeyboard();
// createFloor(scene);
const coneScan = createScan(scene, keys);
const obstacles = createObstacles(scene);
const planets = createPlanet(scene, planetData);

createLights(scene);

const player = new Player(camera, coneScan, planets);

scene.add(player.group);

/**
 * cannon es debugger
 */
const cannonDebugger = new CannonDebugger(scene, world, {
  color: 0x00ff00,
});

const clock = new THREE.Clock();
function tick() {
  const delta = getDelta();
  const elapsedTime = clock.getElapsedTime();

  coneScan.material.uniforms.uTime.value = elapsedTime;
  if (keys.scan) {
    animateScanScale(coneScan, 1); // 0 → 1
  } else {
    animateScanScale(coneScan, 0); // 1 → 0
  }

  planets.forEach((planetObj) => {
    planetObj.mesh.material.uniforms.uTime.value = elapsedTime;
    planetObj.mesh.rotation.y += delta * 0.2;
  });

  player.update(delta, keys);

  // scan trigger
  if (keys.scan) {
    scanPlanets(player.group, planets);
  }

  /**
   * physics world
   * */
  world.step(1 / 60, delta, 3);
  // player.group.position.copy(player.boxBody.position);
  // planets.planet.position.copy(planets.sphereBody.position);
  obstacles.obstacle.position.copy(obstacles.obstacleRigidBody.position);

  player.group.position.copy(player.chassisBody.position);
  player.group.quaternion.copy(player.chassisBody.quaternion);

  //cannon debugger update
  cannonDebugger.update();

  // controls.update();

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

tick();
