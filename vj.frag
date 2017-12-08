/*{
  audio: true,
  midi: true,
  frameskip: 1,
  glslify: true,
}*/
precision mediump float;
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
// uniform float volume;
uniform sampler2D spectrum;
uniform sampler2D video1;
uniform sampler2D video2;
uniform sampler2D video3;
uniform sampler2D midi;
uniform sampler2D backbuffer;

#pragma glslify: rotate = require(./utils/rotate.frag)
#pragma glslify: random = require(./utils/random.frag)

float random2(in vec2 st) {
    return fract(abs(sin(dot(st, vec2(94.2984, 488.923))) * 234.9892));
}
vec4 rects(in vec2 p, in float t) {
  float y = floor(p.y * 30.);
  float s = random2(vec2(p.x * .0001 + t * .00004 * time * sin(y * .000001) * .2, y));
  return vec4(.3, .3, 1, 1) * s;
}

float v(in float c) {
  return texture2D(midi, vec2(176. / 256., c / 128.)).x * 2.;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  vec2 uv0 = uv;
  vec2 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
  float t = time * 2.7;

  // ズーム
  uv = (uv - .5) * (1. - texture2D(spectrum, vec2(0.2)).r * v(4.)) + .5;

  // 回転
  if (v(5.) > .5) {
    uv = rotate(uv - .5, time * .3) + .5;
  }
  if (v(6.) > .5) {
    uv = fract(abs(uv - .5));
    uv = rotate(uv, -time * .4) + .5;
  }
  if (v(7.) > .5) {
    float r = random(vec2(uv.y * .00002, fract(time) + 2.)); // 0 to 1
    if (r < .1) {
        uv.x = fract(uv.x + fract(r * 30.) * .3);
    }
  }

  gl_FragColor = (
    texture2D(video1, uv)  * v(0.) +
    texture2D(video2, uv)  * v(1.) +
    texture2D(video3, uv)  * v(2.) +
    rects(p, t) * v(3.)
  );

  if (v(8.) > .5) {
    gl_FragColor.r = texture2D(backbuffer, uv0 + vec2(.03, 0)).b;
  }
}
