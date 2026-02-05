varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vPositionLight;

uniform vec3 ucolor1;
uniform vec3 ucolor2;
uniform float uTime;


#include ../includes/cnoise.glsl
#include ../includes/directionalLight.glsl

void main()
{

    // float strength = cnoise(normalize(vPosition) * 3.0 );
    float strength = step(0.1,cnoise(normalize(vPosition) * 1.5 ));

    //Adding Color
    vec3 mixedColor = mix(ucolor1, ucolor2, strength);

    //light
    vec3 normal = normalize(vNormal); 
    vec3 viewDirection = normalize(vPositionLight - cameraPosition);

    vec3 color = mixedColor;
    vec3 light = vec3(0.0);
    light += directionalLight( 
        vec3(1.0, 0.2, 0.8),    //Light Color
         0.5,                   //Light Intensity
        normal,                 //Normals
         vec3(0.0, 0.0, -10.0),   // Light Position
         viewDirection,         // View Direction
         0.0                   // Specular Power
         );
         color *= light;

    gl_FragColor = vec4(color, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
