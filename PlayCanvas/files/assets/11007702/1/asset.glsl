precision highp float;

uniform sampler2D uColorBuffer;
uniform sampler2D uMaskBuffer;
uniform float uTime;

varying vec2 vUv0;

void main() {
    vec2 pos = vUv0;
    
    float X = pos.x*15.+uTime*0.5;
    float Y = pos.y*15.+uTime*0.5;
    pos.y += cos(X+Y)*0.01*cos(Y);
    pos.x += sin(X-Y)*0.01*sin(Y);
    
    // Check original position as well as new distorted position
    vec4 maskColor = texture2D(uMaskBuffer, pos);
    vec4 maskColor2 = texture2D(uMaskBuffer, vUv0);

    if(maskColor != vec4(1.0) || maskColor2 != vec4(1.0)){
        pos = vUv0;
    }
    
    vec4 color = texture2D(uColorBuffer, pos);    
    gl_FragColor = color;
}
