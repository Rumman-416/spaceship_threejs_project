varying vec2 vUv;

uniform float uScale;
void main()
{   
    vec3 scaledPosition = position * uScale;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(scaledPosition , 1.0);

    vUv = uv;
}