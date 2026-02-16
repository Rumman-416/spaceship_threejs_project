import * as THREE from "three";
import planetsVertexShader from "../shaders/planets/vertex.glsl";
import planetsFragmentShader from "../shaders/planets/fragment.glsl";
import { getDelta } from "../utils/clock";
import * as CANNON from "cannon-es";
import { world } from "../physics/world.js";

export function createPlanet(scene) {
  //Color
  const materialParameters = {
    color1: "#2B0F0F",
    color2: "#FF6A00",
  };
  const sphereGeometry = {
    radius: 5,
    widthSegment: 32,
  };

  const geometry = new THREE.SphereGeometry(
    sphereGeometry.radius, //radius
    sphereGeometry.widthSegment, //width segemnts
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

  planet.userData = {
    name: "Zyphera",
    population: 4200000,
  };

  scene.add(planet);

  /**
   * physics world
   *  */
  //planet rigid body
  const sphereShape = new CANNON.Sphere(sphereGeometry.radius + 5);
  const sphereBody = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(0, 0, -30),
    shape: sphereShape,
    linearDamping: 0.2,
    angularDamping: 0.9,
  });
  world.addBody(sphereBody);

  return { planet, sphereBody };
}
