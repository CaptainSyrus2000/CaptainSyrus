document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.createElement('canvas');
    canvas.id = 'glsl-bg';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '-999';
    canvas.style.pointerEvents = 'none';
    document.body.prepend(canvas);

    const gl = canvas.getContext('webgl');

    if (!gl) {
        document.body.style.backgroundColor = "#1a1a1d";
        return;
    }

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
        uniform float u_mode; // 0.0 = GC, 1.0 = NotITG

        // MODE 0: GC GOOP
        vec3 gcGoop(vec2 uv) {
            float t = u_time * 0.4;
            for(float i = 1.0; i < 6.0; i++){
                uv.x += 0.3 / i * sin(i * 3.0 * uv.y + t);
                uv.y += 0.3 / i * cos(i * 3.0 * uv.x + t);
            }
            float v = sin(uv.x + sin(uv.y + t));
            float intensity = pow(0.5 + 0.5 * sin(v * 3.0), 1.2);
            vec3 cDeep = vec3(0.1, 0.08, 0.2);
            vec3 cMid = vec3(0.41, 0.35, 0.80);
            vec3 cHigh = vec3(0.65, 0.6, 1.0);
            vec3 color = mix(cDeep, cMid, smoothstep(0.0, 0.7, intensity));
            color = mix(color, cHigh, smoothstep(0.8, 1.0, intensity));
            float vignette = 1.0 - length(gl_FragCoord.xy / u_resolution.xy - 0.5) * 0.5;
            return color * vignette;
        }

        // MODE 1: NOTITG 4K CHART
        float arrow(vec2 p, float angle) {
            float s = sin(angle); float c = cos(angle);
            p = vec2(p.x * c - p.y * s, p.x * s + p.y * c);
            p.y += 0.25;
            float d = max(abs(p.x) * 0.8 + p.y, -p.y - 1.0); 
            float d2 = max(abs(p.x) - 0.25, abs(p.y + 0.5) - 0.5); 
            return min(d, max(d2, -p.y - 0.5));
        }

        vec3 notItgChart(vec2 uv) {
            vec3 color = vec3(0.05, 0.05, 0.05); 
            float laneWidth = 0.4;
            vec2 p = uv; 
            p.x += sin(p.y * 2.0 + u_time) * 0.1; 
            float rot = sin(u_time * 0.5) * 0.1;
            float s = sin(rot); float c = cos(rot);
            p = vec2(p.x * c - p.y * s, p.x * s + p.y * c);

            float totalWidth = laneWidth * 4.0;
            float lane = floor((p.x + totalWidth * 0.5) / laneWidth);
            float localX = mod(p.x + totalWidth * 0.5, laneWidth) - laneWidth * 0.5;
            
            if (lane >= 0.0 && lane < 4.0) {
                float angle = 0.0;
                if (lane == 0.0) angle = 1.57;
                if (lane == 1.0) angle = 3.14;
                if (lane == 2.0) angle = 0.0;
                if (lane == 3.0) angle = -1.57;
                
                vec3 laneColor = vec3(1.0);
                if (lane == 0.0) laneColor = vec3(1.0, 0.2, 0.2);
                if (lane == 1.0) laneColor = vec3(0.2, 0.2, 1.0);
                if (lane == 2.0) laneColor = vec3(0.2, 1.0, 0.2);
                if (lane == 3.0) laneColor = vec3(1.0, 0.2, 0.2);

                float scrollY = p.y + u_time * 2.0;
                float noteY = mod(scrollY, 0.8) - 0.4;
                float hasNote = step(0.3, fract(sin(floor(scrollY/0.8) * 12.9898 + lane * 78.233) * 43758.5453));
                
                if (hasNote > 0.5) {
                    float d = arrow(vec2(localX, noteY) * 4.0, angle);
                    color = mix(color, laneColor, smoothstep(0.1, 0.0, d));
                }
                float dRec = arrow(vec2(localX, p.y - 0.8) * 4.0, angle);
                color += laneColor * smoothstep(0.15, 0.0, abs(dRec)) * 0.5; 
            }
            color += vec3(0.1, 0.0, 0.2) * (0.5 + 0.5 * sin(length(uv) * 10.0 - u_time * 5.0));
            return color;
        }

        void main() {
            vec2 uv = gl_FragCoord.xy / u_resolution.xy;
            vec2 aspectUV = (uv - 0.5) * 2.0; 
            aspectUV.x *= u_resolution.x / u_resolution.y;

            if (u_mode < 0.5) {
                vec2 gcUV = gl_FragCoord.xy / u_resolution.xy;
                gcUV.x *= u_resolution.x / u_resolution.y;
                gl_FragColor = vec4(gcGoop(gcUV), 1.0);
            } else {
                gl_FragColor = vec4(notItgChart(aspectUV), 1.0);
            }
        }
    `;

    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
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

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    const timeUniformLocation = gl.getUniformLocation(program, "u_time");
    const modeUniformLocation = gl.getUniformLocation(program, "u_mode");

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [ -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1 ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function render(time) {
        time *= 0.001;
        gl.useProgram(program);
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
        gl.uniform1f(timeUniformLocation, time);

        const theme = document.body.getAttribute('data-theme');
        const modeVal = (theme === 'notitg') ? 1.0 : 0.0;
        gl.uniform1f(modeUniformLocation, modeVal);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
});