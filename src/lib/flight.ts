import gsap from "gsap";
import * as THREE from "three";
import type { CameraShot, IntroSegment } from "@/lib/districts";

/**
 * Camera flight system.
 *
 * The rig owns a mutable FlightState (position / look-target / fov) that GSAP
 * tweens along a quadratic bézier whose control point rises with distance and
 * bends laterally — so the camera *banks* between districts instead of
 * sliding on rails. The frame loop reads the state every frame; React is
 * never re-rendered by camera motion.
 */

export interface FlightState {
  pos: THREE.Vector3;
  tgt: THREE.Vector3;
  fov: number;
}

export interface FlightHandle {
  kill(): void;
}

export interface FlightOpts {
  duration: number;
  ease?: string;
  /** vertical arc height override (defaults scale with distance) */
  arc?: number;
  onComplete?: () => void;
}

export function createFlightState(shot: CameraShot): FlightState {
  return {
    pos: new THREE.Vector3(...shot.position),
    tgt: new THREE.Vector3(...shot.target),
    fov: shot.fov,
  };
}

/** Squared distance between the state and a shot — used to skip no-op flights. */
export function distanceToShot(state: FlightState, shot: CameraShot): number {
  const dx = state.pos.x - shot.position[0];
  const dy = state.pos.y - shot.position[1];
  const dz = state.pos.z - shot.position[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/** Fly from the state's *current* pose to a shot. Retargetable mid-flight. */
export function flyTo(
  state: FlightState,
  to: CameraShot,
  opts: FlightOpts
): FlightHandle {
  const p0 = state.pos.clone();
  const p1 = new THREE.Vector3(...to.position);
  const t0 = state.tgt.clone();
  const t1 = new THREE.Vector3(...to.target);
  const f0 = state.fov;
  const f1 = to.fov;

  const dist = p0.distanceTo(p1);
  const arc = opts.arc ?? Math.min(14, 2 + dist * 0.12);

  // control point: lifted midpoint, bent sideways for a banked path
  const ctrl = p0.clone().lerp(p1, 0.5);
  ctrl.y += arc;
  const dirX = p1.x - p0.x;
  const dirZ = p1.z - p0.z;
  const latLen = Math.hypot(dirX, dirZ);
  if (latLen > 0.001) {
    const bend = Math.min(10, dist * 0.08);
    ctrl.x += (-dirZ / latLen) * bend;
    ctrl.z += (dirX / latLen) * bend;
  }

  const proxy = { u: 0 };
  const tween = gsap.to(proxy, {
    u: 1,
    duration: opts.duration,
    ease: opts.ease ?? "power3.inOut",
    onUpdate() {
      const u = proxy.u;
      const iu = 1 - u;
      const a = iu * iu;
      const b = 2 * iu * u;
      const c = u * u;
      state.pos.set(
        a * p0.x + b * ctrl.x + c * p1.x,
        a * p0.y + b * ctrl.y + c * p1.y,
        a * p0.z + b * ctrl.z + c * p1.z
      );
      state.tgt.lerpVectors(t0, t1, u);
      state.fov = f0 + (f1 - f0) * u;
    },
    onComplete: opts.onComplete,
  });

  return {
    kill() {
      tween.kill();
    },
  };
}

/**
 * Run the intro cinematic: a chain of flights through the segments.
 * Each segment reports its overlay step as it begins.
 */
export function runIntro(
  state: FlightState,
  segments: IntroSegment[],
  onStep: (step: number) => void,
  onDone: () => void
): FlightHandle {
  let killed = false;
  let current: FlightHandle | null = null;

  const next = (i: number) => {
    if (killed) return;
    if (i >= segments.length) {
      onDone();
      return;
    }
    const seg = segments[i];
    onStep(seg.step);
    const ease =
      i === 0
        ? "power2.inOut"
        : i === segments.length - 1
          ? "power3.inOut"
          : "power1.inOut";
    current = flyTo(state, seg.shot, {
      duration: seg.duration,
      ease,
      arc: i === 0 ? 0 : undefined,
      onComplete: () => next(i + 1),
    });
  };

  next(0);

  return {
    kill() {
      killed = true;
      current?.kill();
    },
  };
}
