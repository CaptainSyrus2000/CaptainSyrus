document.addEventListener("DOMContentLoaded", function() {
    // 1. Create and Attach Canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'glsl-bg';
    // Style explicitly in JS to ensure it works even if CSS fails
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '-999'; // Behind everything
    canvas.style.pointerEvents = 'none';
    document.body.prepend(canvas);

    const gl = canvas.getContext('webgl');

    if (!gl) {
        console.error("WebGL not supported, falling back to CSS background.");
        document.body.style.backgroundColor = "#1a1a1d"; // Fallback color
        return;
    }

    // --- SHADER SOURCE CODE ---

    const vertexShaderSource = `
        attribute vec2 a_position;
        void main() {
            gl_Position = vec4(a_position, 0, 1);
        }
    `;

    const fragmentShaderSource = `
        precision mediump float;
        uniform vec2 u_resolution;
        uniform float u_time;

        void main() {
            vec2 uv = gl_FragCoord.xy / u_resolution.xy;
            uv.x *= u_resolution.x / u_resolution.y; // Fix aspect ratio

            // SLIME ALGORITHM:
            // Use domain warping loop to create viscous fluid distortion
            float t = u_time * 0.4; // Speed of flow

            for(float i = 1.0; i < 6.0; i++){
                uv.x += 0.3 / i * sin(i * 3.0 * uv.y + t);
                uv.y += 0.3 / i * cos(i * 3.0 * uv.x + t);
            }
            
            // Calculate height/intensity map based on distorted UVs
            float v = sin(uv.x + sin(uv.y + t));
            
            // Map to 0-1 and sharpen for wet/slime look
            float intensity = 0.5 + 0.5 * sin(v * 3.0);
            intensity = pow(intensity, 1.2); 

            // --- COLORS: GameCube Indigo Goop ---
            // Dark base (Dark Indigo/Grey)
            vec3 colorDeep = vec3(0.1, 0.08, 0.2); 
            // Mid tone (Classic GameCube Indigo)
            vec3 colorMid = vec3(0.41, 0.35, 0.80); 
            // Highlight (Lighter/Brighter Indigo for "wet" reflection)
            vec3 colorHigh = vec3(0.65, 0.6, 1.0);

            // Mix colors based on intensity
            vec3 finalColor = mix(colorDeep, colorMid, smoothstep(0.0, 0.7, intensity));
            
            // Add shiny highlights for slime effect
            finalColor = mix(finalColor, colorHigh, smoothstep(0.8, 1.0, intensity));

            // Vignette to darken edges slightly
            float vignette = 1.0 - length(gl_FragCoord.xy / u_resolution.xy - 0.5) * 0.5;
            finalColor *= vignette;

            gl_FragColor = vec4(finalColor, 1.0);
        }
    `;

    // --- WEBGL SETUP ---

    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("Shader Compile Error:", gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Program Link Error:", gl.getProgramInfoLog(program));
        return;
    }

    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    const timeUniformLocation = gl.getUniformLocation(program, "u_time");

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [ -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1 ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // --- RENDER LOOP ---

    function resizeCanvas() {
        // Handle High DPI displays
        const displayWidth  = window.innerWidth;
        const displayHeight = window.innerHeight;

        if (canvas.width  !== displayWidth || canvas.height !== displayHeight) {
            canvas.width  = displayWidth;
            canvas.height = displayHeight;
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        }
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function render(time) {
        time *= 0.001; // Seconds

        gl.useProgram(program);

        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
        gl.uniform1f(timeUniformLocation, time);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
});