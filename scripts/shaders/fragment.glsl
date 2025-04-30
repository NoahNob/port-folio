uniform float time;
uniform vec2 resolution;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    vec3 color = vec3(0.0);
    
    // Create nebula effect
    float noise = sin(uv.x * 10.0 + time) * cos(uv.y * 8.0 + time * 0.5);
    color += vec3(0.5, 0.3, 0.9) * noise * 0.5;
    color += vec3(0.2, 0.5, 0.9) * sin(uv.y * 6.0 - time * 0.7) * 0.3;
    
    // Add stardust
    float stars = step(0.99, fract(sin(dot(uv, vec2(12.9898,78.233))) * 43758.5453));
    color += stars * vec3(1.0);
    
    gl_FragColor = vec4(color * 0.8, 0.3);
}