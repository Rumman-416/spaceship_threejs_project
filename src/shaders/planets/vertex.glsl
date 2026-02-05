varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float uDisplacement;
uniform float uTime;

#include ../includes/cnoise.glsl

void main()
{   
    float noise = step(0.1,cnoise(normalize(position) * 1.5 ));

    // vec3 elevatedPosition = position + normal * noise * uDisplacement ;
    vec3 elevatedPosition;
  if (noise > 0.1) {
    elevatedPosition = position + normal * 0.15;
} else {
    elevatedPosition = position;
}
    //Final Position
    // gl_Position = projectionMatrix * modelViewMatrix * vec4(elevatedPosition , 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(elevatedPosition , 1.0);

    vUv = uv;
    vNormal = normal;
    vPosition = elevatedPosition;
}