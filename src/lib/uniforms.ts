import * as THREE from "three";

/**
 * Shared uniform objects. Every world shader references these SAME objects,
 * so one `useFrame` in <World> animates the entire city — pipes, steam,
 * holograms, sky, screens — with three writes per frame.
 */
export const sharedTime: { value: number } = { value: 0 };
export const sharedCamRight: { value: THREE.Vector3 } = {
  value: new THREE.Vector3(1, 0, 0),
};
export const sharedCamUp: { value: THREE.Vector3 } = {
  value: new THREE.Vector3(0, 1, 0),
};
