"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  DISTRICT_MAP,
  INTRO_SEGMENTS,
  OVERVIEW_SHOT,
  START_SHOT,
} from "@/lib/districts";
import {
  createFlightState,
  distanceToShot,
  flyTo,
  runIntro,
  type FlightHandle,
} from "@/lib/flight";
import { pointerState } from "@/lib/pointer";
import { audio } from "@/lib/audio";
import { useExperience } from "@/store/experience";

const tmpLook = new THREE.Vector3();

/**
 * Owns the camera. GSAP flights mutate a FlightState; every frame this rig
 * layers breathing drift and pointer parallax on top and poses the camera.
 * React re-renders only on phase / district changes.
 */
export function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const stateRef = useRef(createFlightState(START_SHOT));
  const flightRef = useRef<FlightHandle | null>(null);
  const parallax = useRef(new THREE.Vector2(0, 0));
  const idleAmp = useRef(0);

  const phase = useExperience((s) => s.phase);
  const activeDistrict = useExperience((s) => s.activeDistrict);

  /* Intro cinematic */
  useEffect(() => {
    if (phase !== "intro") return;
    const store = useExperience.getState();
    const state = stateRef.current;

    if (store.reducedMotion) {
      // reduced motion: skip the flythrough, settle instantly
      state.pos.set(...OVERVIEW_SHOT.position);
      state.tgt.set(...OVERVIEW_SHOT.target);
      state.fov = OVERVIEW_SHOT.fov;
      store.finishIntro();
      return;
    }

    flightRef.current?.kill();
    flightRef.current = runIntro(
      state,
      INTRO_SEGMENTS,
      (step) => useExperience.getState().setIntroStep(step),
      () => useExperience.getState().finishIntro()
    );
    return () => {
      flightRef.current?.kill();
      flightRef.current = null;
    };
  }, [phase]);

  /* Explore-mode flights: district focus and overview returns */
  useEffect(() => {
    if (phase !== "explore") return;
    const store = useExperience.getState();
    const state = stateRef.current;
    const shot = activeDistrict
      ? DISTRICT_MAP[activeDistrict].camera
      : OVERVIEW_SHOT;

    // already there (e.g. intro just ended on the overview) — skip the no-op
    if (distanceToShot(state, shot) < 1.5) {
      store.setTransitioning(false);
      if (activeDistrict) store.arrive(activeDistrict);
      return;
    }

    flightRef.current?.kill();
    store.setTransitioning(true);
    audio.sfx("whoosh");

    const reduced = store.reducedMotion;
    flightRef.current = flyTo(state, shot, {
      duration: reduced ? 0.8 : activeDistrict ? 2.6 : 2.1,
      arc: reduced ? 0 : undefined,
      onComplete: () => {
        const s = useExperience.getState();
        s.setTransitioning(false);
        if (activeDistrict) {
          s.arrive(activeDistrict);
          audio.sfx("open");
        }
      },
    });
  }, [phase, activeDistrict]);

  useFrame(({ clock }) => {
    const state = stateRef.current;
    const t = clock.getElapsedTime();
    const s = useExperience.getState();

    // breathing drift fades out during flights and the boot screen
    const targetAmp =
      s.phase === "explore" && !s.transitioning && !s.reducedMotion ? 1 : 0.15;
    idleAmp.current += (targetAmp - idleAmp.current) * 0.02;
    const amp = idleAmp.current;

    const driftX = Math.sin(t * 0.24) * 0.55 * amp;
    const driftY = Math.sin(t * 0.31 + 1.7) * 0.32 * amp;

    // pointer parallax — a gentle dolly, not a shake
    const px = s.reducedMotion ? 0 : pointerState.ndc.x * 1.4 * amp;
    const py = s.reducedMotion ? 0 : pointerState.ndc.y * 0.7 * amp;
    parallax.current.x += (px - parallax.current.x) * 0.04;
    parallax.current.y += (py - parallax.current.y) * 0.04;

    camera.position.copy(state.pos);
    tmpLook.copy(state.tgt);
    camera.lookAt(tmpLook);
    // translate in camera space after orienting → stable framing
    camera.translateX(driftX + parallax.current.x);
    camera.translateY(driftY + parallax.current.y);

    if (Math.abs(camera.fov - state.fov) > 0.01) {
      camera.fov = state.fov;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
