/* { glslify: true } */
precision mediump float;
uniform float time;
uniform vec2 resolution;
uniform sampler2D video1;
uniform sampler2D video2;
uniform sampler2D video3;
uniform sampler2D backbuffer;
uniform sampler2D name;

#pragma glslify: rotate = require(./utils/rotate.frag)
#pragma glslify: random = require(./utils/random.frag)

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;

    // uvをいじるので、backbuffer用にuvを保存しとく
    vec2 uv0 = uv;

    // 回転
    // uv = rotate(uv - .5, time * .3) + .5;

    // ズーム
    // uv = (uv - .5) * fract(time) + .5;

    // 座標ゆがませ
    // uv -= .5;
    // uv = uv * uv * 2.;

    // 万華鏡っぽいやつ
    // uv = fract(abs(uv - .5));
    // uv = rotate(uv, -time * .4) + .5;

    // x座標ずらし
    // uv.x += (random(vec2(uv.y * .01, time)) - .5) * .01;

    // ランダムにx座標ずらし
    // float r = random(vec2(uv.y * .001, time)); // 0 to 1
    // if (r < .3) {
    //     uv.x += r * .1;
    // }

    // 本体
    float t = time * .3;
    gl_FragColor = texture2D(video3, uv);
    gl_FragColor += texture2D(name, uv);

    // お手軽RGBずらし
    // ランダムにやってもかっこいいです
    // gl_FragColor.r = texture2D(backbuffer, uv0 + vec2(.01, 0)).b;

    // 部分的にRGBずらし
    // 名前の部分だけずらし
    // float r = random(vec2(uv * .0001) + time * .3);
    // if (r < .1) {
    //     gl_FragColor.r += texture2D(name, uv + vec2(.01, 0.)).b;
    //     gl_FragColor.b += texture2D(name, uv - vec2(.01, 0.)).g;
    // }
}
