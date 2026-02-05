import { scene } from "./core/scene.js";
import { createCamera } from "./core/camera.js";
import { createRenderer } from "./core/renderer.js";
import { onResize } from "./core/sizes.js";
import { animateScanScale } from "./animation/animateScanScale.js";
import * as THREE from "three";

import { createFloor } from "./world/floor.js";

import { Player } from "./player/player.js";
import { initKeyboard, keys } from "./utils/keyboard.js";
import { getDelta } from "./utils/clock.js";
import { createObstacles } from "./world/obstacle.js";
import { createScan } from "./player/coneScan.js";
import { createPlanet } from "./planets/planets.js";

// import { world } from "./physics/world.js";

const canvas = document.querySelector("canvas.webgl");

const camera = createCamera();
const renderer = createRenderer(canvas);

onResize(camera, renderer);

initKeyboard();
createFloor(scene);
const coneScan = createScan(scene, keys);
// const obstacles = createObstacles(scene);
const planets = createPlanet(scene);

const player = new Player(camera, coneScan);
scene.add(player.group);

const clock = new THREE.Clock();
function tick() {
  const delta = getDelta();
  const elapsedTime = clock.getElapsedTime();

  coneScan.material.uniforms.uTime.value = elapsedTime;
  planets.material.uniforms.uTime.value = elapsedTime;
  if (keys.scan) {
    animateScanScale(coneScan, 1); // 0 → 1
  } else {
    animateScanScale(coneScan, 0); // 1 → 0
  }
  player.update(delta, keys);

  planets.rotation.y += delta * 0.2;

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

tick();
