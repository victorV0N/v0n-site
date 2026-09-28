// Fundo do contato: o "Mesh drift" do Shader Builder do 21st.dev. Veio como
// componente React; aqui é o mesmo shader (mesmos números) em WebGL puro, sem
// React e sem dependência. Duas manchas de cinza escuro que derivam devagar,
// grão de filme e um brilho que segue o mouse. Só desenha com a seção na tela e
// a aba visível. Com movimento reduzido: um quadro parado, sem o brilho do
// mouse. Sem WebGL (ou se o shader não compilar), o canvas fica vazio e o fundo
// é o preto da página.
;(function () {
  var canvas = document.querySelector('.contato__fundo')
  var gl = canvas && canvas.getContext('webgl', { antialias: false })
  if (!gl) return

  var VERT = 'attribute vec2 a_position;\nvoid main() {\n  gl_Position = vec4(a_position, 0.0, 1.0);\n}'

  var FRAG = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec3 u_colors[8];
uniform vec4 u_scene;      // resolution.xy, time, colour count
uniform vec4 u_shape;      // scale, intensity, paramA, warp
uniform vec4 u_surface;    // detail, contrast, brightness, saturation
uniform vec4 u_finish;     // hue, vignette, blur, grain
uniform vec4 u_transform;  // seed, rotation, drift, OKLab toggle
uniform vec4 u_space;      // offset.xy, pointer.xy
uniform vec4 u_cursor;

#define u_resolution u_scene.xy
#define u_time u_scene.z
#define u_colorCount u_scene.w
#define u_scale u_shape.x
#define u_intensity u_shape.y
#define u_paramA u_shape.z
#define u_warp u_shape.w
#define u_detail u_surface.x
#define u_contrast u_surface.y
#define u_brightness u_surface.z
#define u_saturation u_surface.w
#define u_hue u_finish.x
#define u_vignette u_finish.y
#define u_blur u_finish.z
#define u_grain u_finish.w
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define u_seed u_transform.x
#else
#define u_seed mod(u_transform.x, 31.0)
#endif
#define u_rotate u_transform.y
#define u_drift u_transform.z
#define u_oklab u_transform.w
#define u_offset u_space.xy
#define u_mouse u_space.zw
#define u_cursorPresence u_cursor.x
#define u_cursorEffect u_cursor.y
#define u_cursorStrength u_cursor.z
#define u_cursorRadius u_cursor.w

float hash21(vec2 p) {
#ifndef GL_FRAGMENT_PRECISION_HIGH
  p = mod(p, 31.0);
#endif
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float grainHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
    u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(17.0, 9.2);
    a *= 0.5;
  }
  return v;
}

vec3 hueRotate(vec3 col, float a) {
  const mat3 toYIQ = mat3(0.299, 0.596, 0.211,
                          0.587, -0.274, -0.523,
                          0.114, -0.322, 0.312);
  const mat3 toRGB = mat3(1.0, 1.0, 1.0,
                          0.956, -0.272, -1.106,
                          0.621, -0.647, 1.703);
  vec3 yiq = toYIQ * col;
  float ca = cos(a), sa = sin(a);
  yiq = vec3(yiq.x, yiq.y * ca - yiq.z * sa, yiq.y * sa + yiq.z * ca);
  return toRGB * yiq;
}

vec3 shade(vec2 uv, vec2 p, float t) {
  vec3 acc = u_colors[0] * 0.15;
  float total = 0.15;
  for (int i = 0; i < 8; i++) {
    if (float(i) >= u_colorCount) break;
    float fi = float(i);
    vec2 c = vec2(
      sin(t * (0.21 + fi * 0.071) + fi * 2.4 + u_seed),
      cos(t * (0.17 + fi * 0.093) + fi * 1.7)) * (0.45 + u_intensity * 0.35);
    float w = exp(-dot(p - c, p - c) * 6.0);
    acc += u_colors[i] * w;
    total += w;
  }
  return acc / total;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 screenUv = uv;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy)
    / min(u_resolution.x, u_resolution.y);
  float cursorMask = 0.0;

  if (u_cursorPresence > 0.001) {
    vec2 cursor = (0.5 * u_mouse * u_resolution.xy)
      / min(u_resolution.x, u_resolution.y);
    vec2 cursorDelta = p - cursor;
    if (u_cursorEffect < 0.5) {
      p += cursor * u_cursorPresence * u_cursorStrength * 0.55;
    } else {
      float cursorDistance = length(cursorDelta);
      vec2 cursorDirection = cursorDelta / max(cursorDistance, 0.0001);
      cursorMask = u_cursorPresence
        * (1.0 - smoothstep(0.0, u_cursorRadius, cursorDistance));
      if (u_cursorEffect < 1.5) {
        p -= cursorDirection * cursorMask * u_cursorStrength * 0.24;
      } else if (u_cursorEffect < 2.5) {
        float cursorAngle = cursorMask * u_cursorStrength * 2.2;
        float cc = cos(cursorAngle), cs = sin(cursorAngle);
        p = cursor + mat2(cc, -cs, cs, cc) * cursorDelta;
      } else if (u_cursorEffect < 3.5) {
        float ripple = sin(
          cursorDistance / max(u_cursorRadius, 0.001) * 18.0 - u_time * 5.0);
        p -= cursorDirection * ripple * cursorMask * u_cursorStrength * 0.07;
      }
    }
  }

  uv = p * min(u_resolution.x, u_resolution.y) / u_resolution.xy + 0.5;
  p *= u_scale;
  if (abs(u_rotate) > 0.0001) {
    float cr = cos(u_rotate), sr = sin(u_rotate);
    p = mat2(cr, -sr, sr, cr) * p;
  }
  p += u_offset;
  if (u_drift > 0.0001)
    p += u_drift * vec2(sin(u_time * 0.31), cos(u_time * 0.23));
  if (u_warp > 0.0) {
    p += u_warp * (vec2(
      fbm(p * u_detail + u_seed),
      fbm(p * u_detail + vec2(5.2, 1.3))) - 0.5);
  }
  vec3 col;
  if (u_blur > 0.0) {
    float e = u_blur;
    float pe = e * u_scale;
    vec2 uvE = vec2(e) * min(u_resolution.x, u_resolution.y) / u_resolution.xy;
    col  = shade(uv, p, u_time) * 0.36;
    col += shade(uv + vec2(uvE.x, 0.0), p + vec2(pe, 0.0), u_time) * 0.16;
    col += shade(uv - vec2(uvE.x, 0.0), p - vec2(pe, 0.0), u_time) * 0.16;
    col += shade(uv + vec2(0.0, uvE.y), p + vec2(0.0, pe), u_time) * 0.16;
    col += shade(uv - vec2(0.0, uvE.y), p - vec2(0.0, pe), u_time) * 0.16;
  } else {
    col = shade(uv, p, u_time);
  }
  if (abs(u_contrast - 1.0) > 0.0001)
    col = (col - 0.5) * u_contrast + 0.5;
  if (abs(u_saturation - 1.0) > 0.0001) {
    float luma = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(luma), col, u_saturation);
  }
  if (abs(u_hue) > 0.0001)
    col = hueRotate(col, u_hue);
  if (abs(u_brightness) > 0.0001)
    col += u_brightness;
  if (u_vignette > 0.0001) {
    float vd = length(screenUv - 0.5) * 1.41421356;
    col *= 1.0 - u_vignette * smoothstep(0.35, 1.0, vd);
  }
  if (u_cursorPresence > 0.001 && u_cursorEffect > 3.5)
    col += (vec3(0.18) + col * 0.12) * cursorMask * u_cursorStrength;
  if (u_grain > 0.0001)
    col += (grainHash(
      gl_FragCoord.xy + vec2(u_seed * 17.0, u_seed * 31.0)) - 0.5) * u_grain;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`

  function shader (tipo, src) {
    var s = gl.createShader(tipo)
    gl.shaderSource(s, src)
    gl.compileShader(s)
    return s
  }
  var prog = gl.createProgram()
  gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT))
  gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG))
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
  gl.useProgram(prog)

  // Um triângulo que cobre a tela inteira.
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  var pos = gl.getAttribLocation(prog, 'a_position')
  gl.enableVertexAttribArray(pos)
  gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)

  var u = function (nome) { return gl.getUniformLocation(prog, 'u_' + nome) }
  var cena = u('scene'), espaco = u('space'), cursor = u('cursor')
  // Os números do Shader Builder: #101010 e #3a3a3a (duas cores), escala 2,5,
  // intensidade 0,59, detalhe 2,4, contraste 0,906, brilho -0,1, matiz 2π,
  // desfoque 0,0156, grão 0,158, deriva 0,028, brilho do mouse (efeito 4) com
  // raio 0,351, tempo a 0,86.
  var a = 16 / 255, b = 58 / 255
  gl.uniform3fv(u('colors'), new Float32Array([a, a, a, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b]))
  gl.uniform4f(u('shape'), 2.5, 0.59, 0.5, 0)
  gl.uniform4f(u('surface'), 2.4, 0.906, -0.1, 1)
  gl.uniform4f(u('finish'), 6.2832, 0, 0.0156, 0.158)
  gl.uniform4f(u('transform'), 1, 0, 0.028, 0)

  var parado = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  var inicio = performance.now()
  var raf = 0, antes = null, naTela = false
  var ponteiro = null // última posição do mouse na janela (clientX/Y)
  var alvo = { x: 0, y: 0, p: 0 }, mouse = { x: 0, y: 0, p: 0 }

  function desenha (agora) {
    raf = 0
    var dt = antes === null ? 0 : Math.min((agora - antes) / 1000, 0.1)
    antes = agora
    // Tamanho do canvas: a tela da seção, até 2x de densidade e 2 milhões de pixels.
    var r = canvas.getBoundingClientRect()
    var dpr = Math.min(window.devicePixelRatio || 1, 2)
    var w = r.width * dpr, h = r.height * dpr, k = Math.min(1, Math.sqrt(2e6 / Math.max(1, w * h)))
    w = Math.max(1, Math.round(w * k)); h = Math.max(1, Math.round(h * k))
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h) }
    // O mouse, lido de novo a cada quadro: a seção anda com a rolagem mesmo
    // com o mouse parado.
    if (ponteiro) {
      var dentro = ponteiro.x >= r.left && ponteiro.x <= r.right && ponteiro.y >= r.top && ponteiro.y <= r.bottom
      if (dentro) {
        var nx = (ponteiro.x - r.left) / r.width * 2 - 1, ny = -((ponteiro.y - r.top) / r.height * 2 - 1)
        if (alvo.p === 0 && mouse.p < 0.01) { mouse.x = nx; mouse.y = ny }
        alvo.x = nx; alvo.y = ny; alvo.p = 1
      } else alvo.p = 0
    }
    var siga = 1 - Math.exp(-12 * dt)
    mouse.x += (alvo.x - mouse.x) * siga
    mouse.y += (alvo.y - mouse.y) * siga
    mouse.p += (alvo.p - mouse.p) * siga
    gl.uniform4f(cena, w, h, parado ? 0 : (agora - inicio) / 1000 * 0.86, 2)
    gl.uniform4f(espaco, 0, 0, mouse.x, mouse.y)
    gl.uniform4f(cursor, mouse.p, 4, 1, 0.351)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    if (!parado) pede()
    else antes = null
  }
  function pede () {
    if (!raf && naTela && !document.hidden) raf = requestAnimationFrame(desenha)
  }
  function para () {
    if (raf) cancelAnimationFrame(raf)
    raf = 0; antes = null
  }

  new IntersectionObserver(function (e) {
    naTela = e[0].isIntersecting
    if (naTela) pede(); else para()
  }).observe(canvas)
  document.addEventListener('visibilitychange', function () { if (document.hidden) para(); else pede() })
  window.addEventListener('resize', pede)
  if (!parado) {
    window.addEventListener('pointermove', function (e) { ponteiro = { x: e.clientX, y: e.clientY } }, { passive: true })
    document.documentElement.addEventListener('pointerleave', function () { ponteiro = null; alvo.p = 0 })
    window.addEventListener('blur', function () { ponteiro = null; alvo.p = 0 })
  }
})()
