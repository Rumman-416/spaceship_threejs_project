varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vPositionLight;

uniform float uDisplacement;
uniform float uTime;

#include ../includes/cnoise.glsl

void main()
{   
    //Elevation 
    float noise = step(0.1,cnoise(normalize(position) * 1.5 ));
    // vec3 elevatedPosition = position + normal * noise * uDisplacement ;
    vec3 elevatedPosition;
    if (noise > 0.1) {
        elevatedPosition = position + normal * 0.15;
    } else {
        elevatedPosition = position;
    }


    // Position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    // gl_Position = projectionMatrix * viewMatrix * modelPosition;

    //Model normal
    vec4 modelNormal = modelMatrix * vec4(normal,0.0);

    //Final Position
    gl_Position = projectionMatrix * modelViewMatrix * vec4(elevatedPosition , 1.0);

    //Varying
    vUv = uv;
    vNormal = modelNormal.xyz;
    vPositionLight = modelPosition.xyz;
    vPosition = elevatedPosition;
}