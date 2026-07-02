"use client";

import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { QUALITY } from "@/lib/quality";
import { pointerState } from "@/lib/pointer";
import { sharedTime } from "@/lib/uniforms";
import { useExperience } from "@/store/experience";
import { particlesFragment, particlesVertex } from "@/shaders";

/**
 * Ambient dust motes filling the caldera. Drift, twinkle and cursor
 * repulsion all run in the vertex shader; the pointer's world position is
 * the only per-frame input (written by <World/>'s pointer tracker).
 */
export function AmbientParticles() {
  const quality = useExperience((s) => s.quality);
  const count = QUALITY[quality].particles;
  const dpr = useThree((s) => s.viewport.dpr);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // denser near the ground, thinning with altitude
      const r = Math.sqrt(Math.random()) * 120;
      const a = Math.random() * Math.PI * 2;
      const y = Math.pow(Math.random(), 1.6) * 30 + 0.4;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(a) * r;
      seeds[i] = Math.random();
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    return geo;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: particlesVertex,
        fragmentShader: particlesFragment,
        uniforms: {
          uTime: sharedTime,
          uPointer: { value: pointerState.world },
          uPixelRatio: { value: dpr },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [dpr]
  );

  return (
    <points geometry={geometry} material={material} frustumCulled={false} />
  );
}
