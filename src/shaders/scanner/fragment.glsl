varying vec2 vUv;

uniform float uTime;
uniform vec3 uColor;
uniform float uScale;

void main()
{
    float strengthX = fract(vUv.x * 30.0 - uTime * 2.0);
    float strengthY = fract(vUv.y * 20.0 - uTime * 2.5);

    float strength = step(0.93, strengthX);
    strength += step(0.91, strengthY);

    gl_FragColor = vec4(uColor, strength);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
