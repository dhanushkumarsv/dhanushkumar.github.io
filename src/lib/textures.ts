import * as THREE from "three";

/**
 * Procedural canvas textures — generated once, cached, zero downloads.
 */

let glowTexture: THREE.Texture | null = null;

/** Soft radial gradient sprite used for every light glow in the world. */
export function getGlowTexture(): THREE.Texture {
  if (glowTexture) return glowTexture;
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const g = canvas.getContext("2d") as CanvasRenderingContext2D;
  const grad = g.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.25, "rgba(255,255,255,0.55)");
  grad.addColorStop(0.6, "rgba(255,255,255,0.12)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  glowTexture = new THREE.CanvasTexture(canvas);
  return glowTexture;
}

let windowsTexture: THREE.Texture | null = null;

/** Randomly-lit window grid, used as the skyline's emissive map. */
export function getWindowsTexture(): THREE.Texture {
  if (windowsTexture) return windowsTexture;
  const w = 128;
  const h = 256;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const g = canvas.getContext("2d") as CanvasRenderingContext2D;
  g.fillStyle = "#000000";
  g.fillRect(0, 0, w, h);

  const cols = 10;
  const rows = 26;
  const cw = w / cols;
  const ch = h / rows;
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      const r = Math.random();
      if (r < 0.24) {
        // most lit windows cool cyan, a few warm sodium
        g.fillStyle =
          Math.random() < 0.78
            ? `rgba(125, 216, 255, ${0.35 + Math.random() * 0.65})`
            : `rgba(255, 190, 120, ${0.3 + Math.random() * 0.5})`;
        g.fillRect(
          x * cw + cw * 0.22,
          y * ch + ch * 0.25,
          cw * 0.56,
          ch * 0.5
        );
      }
    }
  }
  windowsTexture = new THREE.CanvasTexture(canvas);
  windowsTexture.colorSpace = THREE.SRGBColorSpace;
  windowsTexture.wrapS = THREE.RepeatWrapping;
  windowsTexture.wrapT = THREE.RepeatWrapping;
  return windowsTexture;
}
