// Copied from https://github.com/mattdesl/glsl-random/blob/master/index.glsl
// so that students can use this without `npm install`
highp float random(vec2 co)
{
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(co.xy ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}

#pragma glslify: export(random)
