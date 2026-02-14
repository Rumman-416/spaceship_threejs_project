import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import booseterFragment from "../shaders/boosters/fragment.glsl";
import booseterVertex from "../shaders/boosters/vertex.glsl";

export async function createPlayerMesh() {
  const gltfLoader = new GLTFLoader();

  const gltf = await gltfLoader.loadAsync("/models/spaceship.glb");

  const model = gltf.scene;

  model.scale.set(0.13, 0.13, 0.13);
  model.rotation.y = Math.PI;

  // 🔥 Find the mesh by name
  const cube6 = model.getObjectByName("Cube_6");
  let boosterMaterial = null;

  if (cube6) {
    boosterMaterial = new THREE.ShaderMaterial({
      vertexShader: booseterVertex,
      fragmentShader: booseterFragment,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x00ffff) },
        uAlpha: { value: 0.5 },
      },
      side: THREE.DoubleSide,
      transparent: true,
      // blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });

    cube6.material = boosterMaterial;
  }

  return {
    model,
    boosterMaterial,
  };
}
