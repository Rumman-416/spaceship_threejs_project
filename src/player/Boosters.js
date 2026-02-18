import * as THREE from "three";

export function updateBoosters(boosterMaterial, targetColor, keys) {
  if (boosterMaterial) {
    targetColor.set(keys.boost && keys.forward ? 0xeaff00 : "#000");
    boosterMaterial.uniforms.uColor.value.lerp(targetColor, 0.1);

    const targetAlpha = keys.boost && keys.forward ? 0.5 : 0.9;
    boosterMaterial.uniforms.uAlpha.value = THREE.MathUtils.lerp(
      boosterMaterial.uniforms.uAlpha.value,
      targetAlpha,
      0.1
    );
  }
}
