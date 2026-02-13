import * as THREE from "three";

export function updatePlayerMovement(vehicle, chassisBody, keys) {
  const maxForce = 6;
  const boostMultiplier = 2;

  const speed = chassisBody.velocity.length();

  const maxSteerVal = THREE.MathUtils.lerp(
    Math.PI / 4,
    Math.PI / 12,
    speed / 10
  );

  // Reset forces
  vehicle.wheelBodies.forEach((wheel, i) => {
    vehicle.setWheelForce(0, i);
    vehicle.setSteeringValue(0, i);
    wheel.wakeUp();
  });

  if (keys.forward) {
    const force = keys.boost ? -maxForce * boostMultiplier : -maxForce;

    vehicle.wheelBodies.forEach((_, i) => {
      vehicle.setWheelForce(force, i);
    });
  }

  if (keys.backward) {
    vehicle.wheelBodies.forEach((_, i) => {
      vehicle.setWheelForce(maxForce * 0.5, i);
    });
  }

  if (keys.left) {
    vehicle.setSteeringValue(maxSteerVal, 0);
    vehicle.setSteeringValue(maxSteerVal, 1);
  }

  if (keys.right) {
    vehicle.setSteeringValue(-maxSteerVal, 0);
    vehicle.setSteeringValue(-maxSteerVal, 1);
  }
}
