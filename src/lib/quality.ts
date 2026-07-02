/**
 * Adaptive quality tiers. Auto-detected on boot from device hints,
 * auto-degraded by drei's PerformanceMonitor when the frame rate slips,
 * and pinnable by the visitor from the HUD.
 */

export type QualityTier = "performance" | "balanced" | "cinematic";

export interface QualitySettings {
  /** device-pixel-ratio ceiling */
  maxDpr: number;
  /** ambient dust-mote count */
  particles: number;
  /** planar reflections on the ground */
  reflections: boolean;
  reflectionRes: number;
  /** shadow map size; 0 disables shadows */
  shadows: 0 | 1024 | 2048;
  /** post-processing chain on/off + extras */
  postfx: boolean;
  depthOfField: boolean;
  chromaticAberration: boolean;
  /** multiplier for steam particle counts */
  steamMult: number;
  /** instanced skyline tower count */
  cityCount: number;
}

export const QUALITY: Record<QualityTier, QualitySettings> = {
  performance: {
    maxDpr: 1,
    particles: 1600,
    reflections: false,
    reflectionRes: 256,
    shadows: 0,
    postfx: false,
    depthOfField: false,
    chromaticAberration: false,
    steamMult: 0.5,
    cityCount: 72,
  },
  balanced: {
    maxDpr: 1.5,
    particles: 5000,
    reflections: true,
    reflectionRes: 512,
    shadows: 1024,
    postfx: true,
    depthOfField: false,
    chromaticAberration: false,
    steamMult: 0.8,
    cityCount: 110,
  },
  cinematic: {
    maxDpr: 2,
    particles: 9000,
    reflections: true,
    reflectionRes: 1024,
    shadows: 2048,
    postfx: true,
    depthOfField: true,
    chromaticAberration: true,
    steamMult: 1,
    cityCount: 128,
  },
};

export const TIER_ORDER: QualityTier[] = [
  "performance",
  "balanced",
  "cinematic",
];

export const TIER_LABEL: Record<QualityTier, string> = {
  performance: "PERF",
  balanced: "BAL",
  cinematic: "CINE",
};

/** Best-guess starting tier for this device. */
export function detectTier(): QualityTier {
  if (typeof window === "undefined") return "balanced";
  const nav = navigator as Navigator & { deviceMemory?: number };
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = window.innerWidth < 820;
  const mem = nav.deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;

  if ((coarse && small) || mem <= 4 || cores <= 4) return "performance";
  if (coarse || small || mem < 8 || cores <= 6) return "balanced";
  return "cinematic";
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** True when the browser can create a WebGL context at all. */
export function supportsWebGL(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ?? canvas.getContext("webgl")
    );
  } catch {
    return false;
  }
}
