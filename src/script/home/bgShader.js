const VERT = `
  attribute vec2 a_pos;
  void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
  precision mediump float;

  uniform float u_t;
  uniform vec2  u_res;
  uniform vec2  u_mouse;

  // Gradient noise (smoother than value noise)
  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash2(i),            f           ),
          dot(hash2(i + vec2(1,0)), f - vec2(1,0)), u.x),
      mix(dot(hash2(i + vec2(0,1)), f - vec2(0,1)),
          dot(hash2(i + vec2(1,1)), f - vec2(1,1)), u.x),
      u.y
    );
  }

  // Fractional Brownian Motion — 5 octaves
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p  = p * 2.1 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_res;
    float asp = u_res.x / u_res.y;

    // Aspect-corrected coordinates centred at 0
    vec2 st = (uv - 0.5) * vec2(asp, 1.0);
    vec2 m  = (u_mouse - 0.5) * vec2(asp, 1.0);

    float t = u_t * 0.09;

    // ── Domain warp, layer 1
    vec2 q = vec2(
      fbm(st + t),
      fbm(st + vec2(5.2, 1.3) + t * 0.75)
    );

    // ── Mouse distortion injected into layer 2
    float md = length(st - m);
    float mi = smoothstep(0.9, 0.0, md);          // radial influence 0–1
    vec2 mDir = normalize(st - m + 0.0001);

    vec2 r = vec2(
      fbm(st + 2.0 * q + vec2(1.7, 9.2) + t * 0.28 - mi * 0.35 * mDir),
      fbm(st + 2.0 * q + vec2(8.3, 2.8) + t * 0.18 + mi * 0.20 * mDir.yx)
    );

    float n = fbm(st + 2.4 * r + t * 0.04);

    // ── Base (near-black)
    vec3 col = vec3(0.034, 0.034, 0.052);

    // ── Brand palette
    vec3 violet = vec3(0.486, 0.227, 0.929);
    vec3 coral  = vec3(0.969, 0.161, 0.353);
    vec3 blue   = vec3(0.310, 0.482, 1.000);
    vec3 lime   = vec3(0.745, 1.000, 0.000);

    // ── Paint aurora bands (wider smoothstep ranges = more coverage)
    float n1 = smoothstep(0.05, 0.48, n);
    float n2 = smoothstep(0.22, 0.62, n + fbm(st * 1.3 + t * 0.55) * 0.35);
    float n3 = smoothstep(-0.12, 0.28, n - q.x * 0.38);
    float n4 = smoothstep(0.48, 0.78, n + r.x * 0.25);

    col = mix(col, violet, n1 * 0.62);
    col = mix(col, coral,  n2 * 0.50);
    col = mix(col, blue,   n3 * 0.38);
    col = mix(col, lime,   n4 * 0.26);

    // ── Cursor bloom — warm violet/coral glow under the mouse
    float bloomR   = smoothstep(0.55, 0.0,  md);
    float bloomRim = smoothstep(0.55, 0.35, md) * (1.0 - bloomR);
    col += (violet * 0.55 + coral * 0.45) * bloomR   * 0.40;
    col += (blue   * 0.60 + violet * 0.40) * bloomRim * 0.22;

    // ── Vignette — edges dark but less aggressive
    float vig = 1.0 - smoothstep(0.28, 1.10, length(uv - 0.5) * 2.0);
    col *= 0.42 + 0.58 * vig;

    // ── Gamma — lower = punchier colours
    col = pow(clamp(col, 0.0, 1.0), vec3(0.72));

    gl_FragColor = vec4(col, 1.0);
  }
`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error("[bgShader]", gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

export function initBgShader() {
  const canvas = document.createElement("canvas");
  canvas.id = "mw-bg-shader";
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = "position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;";
  document.body.prepend(canvas);

  const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!gl) { canvas.remove(); return; }

  const vs = compile(gl, gl.VERTEX_SHADER,   VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error("[bgShader]", gl.getProgramInfoLog(prog));
    return;
  }
  gl.useProgram(prog);

  // Fullscreen triangle-strip quad
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, "a_pos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uT     = gl.getUniformLocation(prog, "u_t");
  const uRes   = gl.getUniformLocation(prog, "u_res");
  const uMouse = gl.getUniformLocation(prog, "u_mouse");

  // Render at half resolution — upscale gives a soft painterly look and saves GPU
  const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
  const SCALE = 0.5;

  function resize() {
    canvas.width  = Math.floor(window.innerWidth  * DPR * SCALE);
    canvas.height = Math.floor(window.innerHeight * DPR * SCALE);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  window.addEventListener("resize", resize);

  // Smoothed mouse (spring)
  let targetX = 0.5, targetY = 0.5;
  let smoothX = 0.5, smoothY = 0.5;

  window.addEventListener("mousemove", (e) => {
    targetX = e.clientX / window.innerWidth;
    targetY = 1.0 - e.clientY / window.innerHeight; // flip Y for GL coords
  });

  const start = performance.now();
  let rafId;
  let paused = false;

  document.addEventListener("visibilitychange", () => {
    paused = document.hidden;
    if (!paused) loop();
  });

  function loop() {
    if (paused) return;
    rafId = requestAnimationFrame(loop);

    // Ease mouse position (0.04 ≈ nice lag)
    smoothX += (targetX - smoothX) * 0.04;
    smoothY += (targetY - smoothY) * 0.04;

    const t = (performance.now() - start) * 0.001;
    gl.uniform1f(uT,     t);
    gl.uniform2f(uRes,   canvas.width, canvas.height);
    gl.uniform2f(uMouse, smoothX, smoothY);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  loop();
}
