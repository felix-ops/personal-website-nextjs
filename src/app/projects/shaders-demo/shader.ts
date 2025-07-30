export const shaderFrag = /*glsl*/ `#version 300 es
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;

out vec4 fragColor;

void main() {
    vec2 screenPos = gl_FragCoord.xy;
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

    uv = (uv - 0.5) * 100.0;

    // Create animated color pattern - using mod() for floating-point modulus
    vec3 color = vec3(mod(uv.x * uv.y, 2.0 * (sin(u_time) + 1.0 ) / 2.0 ));

    fragColor = vec4(color, 1.0);
}`;
