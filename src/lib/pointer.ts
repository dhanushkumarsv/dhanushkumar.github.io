import * as THREE from "three";

/**
 * Shared mutable pointer state — written by DOM listeners, read inside the
 * frame loop. Kept outside React so cursor motion never triggers renders.
 */
export const pointerState = {
  /** normalized device coordinates (−1..1, +y up) */
  ndc: new THREE.Vector2(0, 0),
  /** cursor projected onto the world's mid-height plane (for particles) */
  world: new THREE.Vector3(0, 4, 0),
  /** raw client position (for the DOM cursor glow) */
  clientX: 0,
  clientY: 0,
  active: false,
};

export function updatePointer(e: PointerEvent | MouseEvent): void {
  pointerState.clientX = e.clientX;
  pointerState.clientY = e.clientY;
  pointerState.ndc.set(
    (e.clientX / window.innerWidth) * 2 - 1,
    -(e.clientY / window.innerHeight) * 2 + 1
  );
  pointerState.active = true;
}
