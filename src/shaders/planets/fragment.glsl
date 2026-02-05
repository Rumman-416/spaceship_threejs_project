varying vec2 vUv;
varying vec3 vnormal;
varying vec3 vPosition;

uniform vec3 ucolor1;
uniform vec3 ucolor2;
uniform float uTime;


#include ../includes/cnoise.glsl

void main()
{

    // float strength = cnoise(normalize(vPosition) * 3.0 );
    float strength = step(0.1,cnoise(normalize(vPosition) * 1.5 ));

    //Adding Color
    vec3 mixedColor = mix(ucolor1, ucolor2, strength);

    gl_FragColor = vec4(vec3(mixedColor), 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
