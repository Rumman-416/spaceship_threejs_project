import * as THREE from "three";

export function updateBoosters(boosterMaterial, targetColor, keys) {
  if (boosterMaterial) {
    targetColor.set(keys.boost ? 0xeaff00 : 0x00ffff);
    boosterMaterial.uniforms.uColor.value.lerp(targetColor, 0.1);

    const targetAlpha = keys.boost ? 0.8 : 0.3;
    boosterMaterial.uniforms.uAlpha.value = THREE.MathUtils.lerp(
      boosterMaterial.uniforms.uAlpha.value,
      targetAlpha,
      0.1,
    );
  }
}
