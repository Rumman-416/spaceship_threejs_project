import gsap from "gsap";

export function animateScanScale(cone, target) {
  gsap.to(cone.material.uniforms.uScale, {
    value: target,
    duration: 1,
  });
}
