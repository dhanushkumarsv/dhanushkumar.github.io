"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { START_SHOT } from "@/lib/districts";
import { QUALITY } from "@/lib/quality";
import { useExperience } from "@/store/experience";
import { CameraRig } from "@/components/canvas/CameraRig";
import { Atmosphere } from "@/components/canvas/Atmosphere";
import { Effects } from "@/components/canvas/Effects";
import { World } from "@/components/world/World";

/**
 * The WebGL stage. Mounts behind the boot screen so shaders compile
 * before the reveal; frame loop stays hot, React re-renders stay rare.
 */
export default function Scene() {
  const quality = useExperience((s) => s.quality);
  const q = QUALITY[quality];

  const dpr = useMemo(
    () => Math.min(window.devicePixelRatio || 1, q.maxDpr),
    [q.maxDpr]
  );

  return (
    <Canvas
      dpr={dpr}
      shadows={q.shadows > 0}
      camera={{
        position: START_SHOT.position,
        fov: START_SHOT.fov,
        near: 0.5,
        far: 900,
      }}
      gl={{
        antialias: true,
        alpha: false,
        stencil: false,
        powerPreference: "high-performance",
      }}
    >
      <color attach="background" args={["#04060c"]} />
      <fogExp2 attach="fog" args={["#070d18", 0.0042]} />
      <PerformanceMonitor
        flipflops={3}
        onDecline={() => useExperience.getState().degradeQuality()}
      >
        <Suspense fallback={null}>
          <CameraRig />
          <Atmosphere />
          <World />
          <Effects />
        </Suspense>
      </PerformanceMonitor>
    </Canvas>
  );
}
