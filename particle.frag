/*{
    "pixelRatio": 1,
    "vertexCount": 100,
    "vertexMode": "TRIANGLES",
    "PASSES": [{
        "TARGET": "renderBuffer",
        "vs": "./particle.vert",
    }, {
    }],
}*/
precision mediump float;
uniform float time;
uniform vec2 resolution;
uniform sampler2D renderBuffer;
uniform sampler2D backbuffer;

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec2 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
    p = fract(abs(p));
    gl_FragColor.gb = texture2D(renderBuffer, p).br;
    gl_FragColor += texture2D(backbuffer, uv).b * .6;
    gl_FragColor.r = texture2D(backbuffer, uv + .01).b;
}
