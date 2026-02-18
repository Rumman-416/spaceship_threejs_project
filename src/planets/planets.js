import * as THREE from "three";
import planetsVertexShader from "../shaders/planets/vertex.glsl";
import planetsFragmentShader from "../shaders/planets/fragment.glsl";
import { getDelta } from "../utils/clock";
import * as CANNON from "cannon-es";
import { world } from "../physics/world.js";

export function createPlanet(scene, planetData) {
  const planets = [];

  planetData.forEach((data) => {
    // Geometry
    const geometry = new THREE.SphereGeometry(data.radius, 32);

    const material = new THREE.ShaderMaterial({
      vertexShader: planetsVertexShader,
      fragmentShader: planetsFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uDisplacement: { value: 0.5 },
        ucolor1: new THREE.Uniform(new THREE.Color(data.color1)),
        ucolor2: new THREE.Uniform(new THREE.Color(data.color2)),
      },
    });

    const planet = new THREE.Mesh(geometry, material);

    planet.position.set(data.position[0], data.position[1], data.position[2]);

    planet.userData = {
      name: data.name,
      habitable: data.habitable,
      radius: data.radius,
    };

    scene.add(planet);

    // Physics
    const sphereShape = new CANNON.Sphere(data.radius + 1);

    const sphereBody = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(
        data.position[0],
        data.position[1],
        data.position[2]
      ),
      shape: sphereShape,
      linearDamping: 0.2,
      angularDamping: 0.9,
    });

    world.addBody(sphereBody);

    planets.push({
      mesh: planet,
      body: sphereBody,
    });
  });

  return planets;
}
