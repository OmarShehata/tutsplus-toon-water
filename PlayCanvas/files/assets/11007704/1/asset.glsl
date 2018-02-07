attribute vec2 aPosition;
varying vec2 vUv0;

void main(void)
{
    gl_Position = vec4(aPosition, 0.0, 1.0);
    vUv0 = (aPosition.xy + 1.0) * 0.5;
}
