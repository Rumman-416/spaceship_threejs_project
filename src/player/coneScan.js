import * as THREE from "three";
import scannerVertexShader from "../shaders/scanner/vertex.glsl";
import scannerFragmentShader from "../shaders/scanner/fragment.glsl";
import gsap from "gsap";
export function createScan(scene, keys) {
  const materialParameters = {
    color: "#98fffe",
  };

  let coneGeometry = {
    radius: 5,
    height: 30,
  };
  const geometry = new THREE.ConeGeometry(
    coneGeometry.radius,
    coneGeometry.height,
    35,
    8,
    true,
  );

  //pivioting the geometry towards the pointy side
  geometry.translate(0, -coneGeometry.height / 2, 0);

  const material = new THREE.ShaderMaterial({
    // wireframe: true
    uniforms: {
      uTime: new THREE.Uniform(0),
      uScale: new THREE.Uniform(0),
      uColor: new THREE.Uniform(new THREE.Color(materialParameters.color)),
    },
    vertexShader: scannerVertexShader,
    fragmentShader: scannerFragmentShader,
    transparent: true,
  });
  const coneScan = new THREE.Mesh(geometry, material);

  coneScan.scale.multiplyScalar(0.5);
  coneScan.rotation.x = Math.PI / 2;
  coneScan.position.z = -2;

  // console.log(keys);
  if (keys.forward) {
    gsap.to(coneGeometry, {
      radius: 0,
      height: 0,
      duration: 1,
    });
  }
  // console.log(material);

  scene.add(coneScan);

  return coneScan;
}
