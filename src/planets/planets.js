import * as THREE from "three";
import planetsVertexShader from "../shaders/planets/vertex.glsl";
import planetsFragmentShader from "../shaders/planets/fragment.glsl";
import { getDelta } from "../utils/clock";

export function createPlanet(scene) {
  //Color
  const materialParameters = {
    color1: "#2B0F0F",
    color2: "#FF6A00",
  };

  const geometry = new THREE.SphereGeometry(
    5, //radius
    64 //width segemnts
  );
  const material = new THREE.ShaderMaterial({
    // wireframe: true,
    vertexShader: planetsVertexShader,
    fragmentShader: planetsFragmentShader,

    uniforms: {
      uTime: { value: 0 },
      uDisplacement: { value: 0.5 },
      ucolor1: new THREE.Uniform(new THREE.Color(materialParameters.color1)),
      ucolor2: new THREE.Uniform(new THREE.Color(materialParameters.color2)),
    },
  });

  const planet = new THREE.Mesh(geometry, material);

  const delta = getDelta();

  planet.position.z = -30;

  scene.add(planet);

  return planet;
}
