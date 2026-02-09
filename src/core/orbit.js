import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export function createOrbit(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);

  controls.enableDamping = true;
  controls.dampingFactor = 0.08;

  controls.enablePan = true;
  controls.enableZoom = true;
  controls.enableRotate = true;

  controls.minDistance = 2;
  controls.maxDistance = 50;

  controls.target.set(0, 1, 0);
  controls.update();

  return controls;
}
