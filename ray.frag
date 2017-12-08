/*{ glslify: true }*/
precision mediump float;
uniform float time;
uniform vec2 resolution;
uniform sampler2D video1;
uniform sampler2D video3;

const float PI = 3.1415926535897932384626433;
vec2 map(vec3 p);
#pragma glslify: square = require('glsl-square-frame')
#pragma glslify: camera = require('glsl-camera-ray')
#pragma glslify: raytrace = require('glsl-raytrace', map = map, steps = 30)
#pragma glslify: getNormal = require('glsl-sdf-normal', map = map)
#pragma glslify: sdBox = require('glsl-sdf-primitives/sdBox')
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

vec2 rotate(in vec2 p, in float t) {
    return mat2(
        sin(t), -cos(t),
        cos(t), -sin(-t)
    ) * p;
}

vec2 map(vec3 p) {
    // float p2 = snoise3(p * .3) * .1;
    p = mod(p, 8.) - 4.;
    // p.x *= sin(time * .43);
    // p.y += cos(time * .37);
    // p += p2;

    return vec2(sdBox(p, vec3(1.5)), 1.);
}

void main (void) {
    vec2 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
    vec2 uv = gl_FragCoord.xy / resolution;

    vec3 rayOrigin = vec3(0, 0, 10);
    rayOrigin.x += cos(time * 1.3) * .2;
    rayOrigin.y += sin(time * .3) * 2.3;

    vec3 rayTarget = vec3(0, 0, -99999999);
    rayOrigin.z -= time*10.;
    vec3 rayDirection = camera(rayOrigin, rayTarget, square(resolution), 1.3);
    // rayDirection.xy = rotate(rayDirection.xy, time*.08 +sin(1. / rayDirection.z + time * .7)*.9);
    // rayDirection.x += sin(time * 1.3) * .2;
    // rayDirection.y += cos(time *.3) * .3;

    vec3 lightDir = normalize(vec3(0, 2, 2.));
    vec3 light = vec3(.4, .5, 0.93);
    vec3 ambient = vec3(.6, .8, .9) * .3;

    vec2 collision = raytrace(rayOrigin, rayDirection, 30., 0.1);
    if (collision.x > .1) {
        vec3 pos = rayOrigin + rayDirection * collision.x;
        vec3 normal = getNormal(pos);
        float diff = clamp(dot(lightDir, normal), 0., 3.0);
        vec3 c = diff * light + ambient;

        gl_FragColor = vec4(c, 1.0);
        // gl_FragColor *= texture2D(video3, abs(sin(p))) * 2.;
    }
    else {
        gl_FragColor = vec4(0);
        // gl_FragColor = texture2D(video1, uv) * .7;
    }
}
