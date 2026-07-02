/**
 * GLSL shader library. All world-scale animation (particles, steam,
 * pipeline flow, sky, screens) runs on the GPU from a single uTime
 * uniform — no per-frame attribute uploads anywhere.
 */

/* ── Night sky dome: gradient + stars + aurora + moon ────────── */

export const skyVertex = /* glsl */ `
varying vec3 vWorld;
void main() {
  vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const skyFragment = /* glsl */ `
uniform float uTime;
varying vec3 vWorld;

float hash13(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.zyx + 31.32);
  return fract((p.x + p.y) * p.z);
}

void main() {
  vec3 dir = normalize(vWorld);

  // vertical gradient: teal-black horizon into deep void
  vec3 base = mix(
    vec3(0.031, 0.049, 0.086),
    vec3(0.004, 0.006, 0.016),
    smoothstep(-0.05, 0.55, dir.y)
  );

  // horizon industrial glow
  float hb = exp(-abs(dir.y + 0.02) * 7.0);
  base += hb * vec3(0.030, 0.075, 0.100);

  // procedural starfield with twinkle
  vec3 cell = floor(dir * 240.0);
  float star = hash13(cell);
  float starMask = step(0.9982, star) * smoothstep(0.02, 0.16, dir.y);
  float tw = 0.55 + 0.45 * sin(uTime * (1.0 + star * 3.0) + star * 90.0);
  base += starMask * tw * vec3(0.85, 0.92, 1.0) * 0.85;

  // aurora ribbons
  float ang = atan(dir.z, dir.x);
  float band = exp(-pow((dir.y - 0.34 - 0.06 * sin(ang * 2.0 + uTime * 0.05)) * 5.5, 2.0));
  float wave = 0.5 + 0.5 * sin(ang * 3.0 + uTime * 0.13 + sin(dir.y * 9.0 + uTime * 0.07) * 1.5);
  vec3 auroraCol = mix(vec3(0.0, 0.42, 0.34), vec3(0.24, 0.14, 0.52), 0.5 + 0.5 * sin(ang * 2.0 - uTime * 0.06));
  base += band * wave * auroraCol * 0.30;

  // moon + halo
  vec3 moonDir = normalize(vec3(0.45, 0.52, -0.62));
  float md = max(dot(dir, moonDir), 0.0);
  base += smoothstep(0.9994, 0.99965, md) * vec3(0.90, 0.95, 1.0) * 1.6;
  base += pow(md, 500.0) * vec3(0.35, 0.45, 0.60) * 0.5;

  gl_FragColor = vec4(base, 1.0);
}
`;

/* ── Ground grid overlay: lines + radar pulse rings ──────────── */

export const gridVertex = /* glsl */ `
varying vec3 vWorld;
void main() {
  vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const gridFragment = /* glsl */ `
uniform float uTime;
uniform vec3 uColor;
varying vec3 vWorld;

void main() {
  float r = length(vWorld.xz);

  vec2 minorUv = abs(fract(vWorld.xz / 6.0) - 0.5);
  float minor = smoothstep(0.485, 0.5, max(minorUv.x, minorUv.y));

  vec2 majorUv = abs(fract(vWorld.xz / 30.0) - 0.5);
  float major = smoothstep(0.492, 0.5, max(majorUv.x, majorUv.y));

  // radar pulse expanding from the spire
  float pulse = smoothstep(0.06, 0.0, abs(fract(r * 0.018 - uTime * 0.05) - 0.5) - 0.44);

  float fade = smoothstep(135.0, 18.0, r) * smoothstep(4.0, 9.0, r);
  float a = (minor * 0.30 + major * 0.55 + pulse * 0.28) * fade * 0.30;
  gl_FragColor = vec4(uColor, a);
}
`;

/* ── Ambient dust motes: GPU drift + cursor repulsion ────────── */

export const particlesVertex = /* glsl */ `
uniform float uTime;
uniform vec3 uPointer;
uniform float uPixelRatio;
attribute float aSeed;
varying float vSeed;
varying float vAlpha;

void main() {
  vSeed = aSeed;
  vec3 pos = position;

  // slow incommensurate drift
  pos.x += sin(uTime * 0.11 + aSeed * 12.0) * 1.8;
  pos.y += sin(uTime * 0.14 + aSeed * 9.0) * 1.3;
  pos.z += cos(uTime * 0.09 + aSeed * 15.0) * 1.8;

  // flee the cursor
  vec2 d = pos.xz - uPointer.xz;
  float dist = length(d);
  float push = smoothstep(10.0, 0.0, dist);
  pos.xz += (d / max(dist, 0.001)) * push * 5.0;
  pos.y += push * 1.5;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  float size = (0.7 + fract(aSeed * 13.7) * 1.1);
  gl_PointSize = size * uPixelRatio * (95.0 / max(-mv.z, 1.0));
  gl_PointSize = min(gl_PointSize, 7.0 * uPixelRatio);

  float tw = 0.55 + 0.45 * sin(uTime * (0.8 + aSeed * 2.2) + aSeed * 40.0);
  vAlpha = tw * smoothstep(150.0, 40.0, -mv.z);
  gl_Position = projectionMatrix * mv;
}
`;

export const particlesFragment = /* glsl */ `
varying float vSeed;
varying float vAlpha;

void main() {
  vec2 p = gl_PointCoord - 0.5;
  float d = length(p) * 2.0;
  float a = smoothstep(1.0, 0.15, d) * vAlpha * 0.75;
  if (a < 0.01) discard;
  // mostly ion cyan, occasional warm ember
  vec3 col = fract(vSeed * 7.31) < 0.85
    ? vec3(0.55, 0.85, 1.0)
    : vec3(1.0, 0.72, 0.42);
  gl_FragColor = vec4(col, a);
}
`;

/* ── Steam: instanced camera-facing billboards, GPU life-cycle ── */

export const steamVertex = /* glsl */ `
uniform float uTime;
uniform float uRise;
uniform float uSpread;
uniform float uSize;
uniform float uSpeed;
uniform vec3 uCamRight;
uniform vec3 uCamUp;
attribute float aRand;
varying vec2 vUv;
varying float vLife;

void main() {
  float life = fract(uTime * uSpeed * (0.55 + aRand * 0.8) + aRand * 7.13);
  vLife = life;

  float ang = aRand * 6.28318;
  vec2 drift = vec2(cos(ang), sin(ang)) * uSpread * (0.2 + life * 1.25);
  // gentle wind shear as plumes climb
  drift.x += life * life * 1.4;

  vec3 center = vec3(drift.x, life * uRise, drift.y);
  float scale = uSize * (0.45 + life * 1.9) * (0.7 + aRand * 0.6);
  vec3 world = center + (uCamRight * position.x + uCamUp * position.y) * scale;

  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(world, 1.0);
}
`;

export const steamFragment = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
uniform float uTime;
varying vec2 vUv;
varying float vLife;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

void main() {
  vec2 p = vUv - 0.5;
  float d = length(p) * 2.0;
  float n = noise(vUv * 3.5 + vec2(0.0, -uTime * 0.22)) * 0.55
          + noise(vUv * 7.0 + vec2(uTime * 0.1, 0.0)) * 0.25;
  float body = smoothstep(1.05, 0.15, d + n * 0.55);
  float fade = sin(vLife * 3.14159) * (1.0 - vLife * 0.25);
  float a = body * fade * uOpacity;
  if (a < 0.012) discard;
  gl_FragColor = vec4(uColor, a);
}
`;

/* ── Pipeline flow: scrolling luminous slugs along tube UVs ───── */

export const flowVertex = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vView;
void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vView = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`;

export const flowFragment = /* glsl */ `
uniform float uTime;
uniform vec3 uColor;
uniform vec3 uBase;
uniform float uSpeed;
uniform float uCount;
uniform float uIntensity;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vView;

void main() {
  // luminous slugs marching along the tube's length (uv.x)
  float s = fract(vUv.x * uCount - uTime * uSpeed);
  float slug = smoothstep(0.30, 0.02, abs(s - 0.16));

  vec3 n = normalize(vNormal);
  vec3 v = normalize(vView);
  float fres = pow(1.0 - max(dot(n, v), 0.0), 2.2);
  float diff = 0.30 + 0.70 * max(dot(n, normalize(vec3(0.4, 0.8, 0.25))), 0.0);

  vec3 col = uBase * diff + uColor * (slug * uIntensity + fres * 0.35);
  gl_FragColor = vec4(col, 1.0);
}
`;

/* ── Hologram panels: scanlines + flicker + edge fade ────────── */

export const holoVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const holoFragment = /* glsl */ `
uniform float uTime;
uniform vec3 uColor;
uniform float uOpacity;
varying vec2 vUv;

void main() {
  float scan = 0.82 + 0.18 * sin(vUv.y * 90.0 + uTime * 7.0);
  float flick = 0.92 + 0.08 * sin(uTime * 31.0 + sin(uTime * 7.7) * 4.0);
  float edgeX = smoothstep(0.0, 0.10, vUv.x) * smoothstep(1.0, 0.90, vUv.x);
  float edgeY = smoothstep(0.0, 0.12, vUv.y) * smoothstep(1.0, 0.88, vUv.y);
  // data rows
  float rows = step(0.35, fract(vUv.y * 9.0 - uTime * 0.35)) * 0.25 + 0.75;
  float a = scan * flick * edgeX * edgeY * rows * uOpacity;
  gl_FragColor = vec4(uColor, a);
}
`;

/* ── Volumetric-look light beam (cones, additive) ────────────── */

export const beamVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const beamFragment = /* glsl */ `
uniform float uTime;
uniform vec3 uColor;
uniform float uStrength;
varying vec2 vUv;

void main() {
  float vertical = pow(1.0 - vUv.y, 1.8);
  float shimmer = 0.85 + 0.15 * sin(uTime * 1.6 + vUv.y * 12.0);
  float a = vertical * shimmer * uStrength;
  gl_FragColor = vec4(uColor, a);
}
`;

/* ── Control-room telemetry wall: animated charts, no textures ── */

export const screenVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const screenFragment = /* glsl */ `
uniform float uTime;
uniform vec3 uColor;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec3 col = vec3(0.008, 0.016, 0.028);

  // panel tiling: 6 x 3 screens with gaps
  vec2 cell = vec2(6.0, 3.0);
  vec2 id = floor(vUv * cell);
  vec2 st = fract(vUv * cell);
  float gap = step(0.04, st.x) * step(st.x, 0.96) * step(0.06, st.y) * step(st.y, 0.94);

  float kind = hash(id + 7.0);
  float beat = floor(uTime * 0.8) + hash(id) * 4.0;

  if (kind < 0.45) {
    // bar chart
    float bx = floor(st.x * 8.0);
    float h = 0.15 + 0.7 * hash(vec2(bx, beat) + id);
    float bar = step(st.y, h) * step(0.15, fract(st.x * 8.0)) * step(fract(st.x * 8.0), 0.85);
    col += uColor * bar * 0.8;
  } else if (kind < 0.8) {
    // oscilloscope trace
    float w = sin(st.x * 18.0 + uTime * (1.5 + hash(id) * 2.0) + hash(id) * 9.0) * 0.5 + 0.5;
    float wave = smoothstep(0.05, 0.0, abs(st.y - (0.25 + w * 0.5)));
    col += uColor * wave * 1.4;
    col += uColor * smoothstep(0.5, 0.0, abs(st.y - 0.5)) * 0.05;
  } else {
    // scrolling data ticks
    float row = floor(st.y * 7.0);
    float on = step(0.5, hash(vec2(row, beat * 2.0) + id));
    float tick = on * step(fract(st.x * 2.0 - uTime * (0.2 + hash(id) * 0.4)), 0.65);
    col += uColor * tick * 0.45 * step(0.15, fract(st.y * 7.0)) * step(fract(st.y * 7.0), 0.8);
  }

  col *= gap;
  // sweeping scanline over the whole wall
  col += uColor * 0.06 * smoothstep(0.08, 0.0, abs(fract(vUv.y - uTime * 0.07) - 0.5));

  gl_FragColor = vec4(col, 1.0);
}
`;
