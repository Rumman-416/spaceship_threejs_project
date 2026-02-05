import * as CANNON from "cannon-es";

// Physics world = space where rules apply
export const world = new CANNON.World();

// 🚀 SPACE ENVIRONMENT → NO GRAVITY
world.gravity.set(0, -9.82, 0);

// Faster collision detection
world.broadphase = new CANNON.SAPBroadphase(world);

// Allow bodies to sleep when not moving
world.allowSleep = true;
