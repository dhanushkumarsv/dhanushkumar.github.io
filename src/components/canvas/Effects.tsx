"use client";

import { useMemo } from "react";
import * as THREE from "three";
import {
  Bloom,
  ChromaticAberration,
  DepthOfField,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { QUALITY } from "@/lib/quality";
import { useExperience } from "@/store/experience";

/**
 * Cinematic grade. Bloom carries the whole neon look; DoF and chromatic
 * aberration join only on the cinematic tier. The performance tier renders
 * raw for maximum FPS on weak GPUs.
 */
export function Effects() {
  const quality = useExperience((s) => s.quality);
  const q = QUALITY[quality];

  const caOffset = useMemo(() => new THREE.Vector2(0.0009, 0.0014), []);

  if (!q.postfx) return null;

  if (q.depthOfField && q.chromaticAberration) {
    return (
      <EffectComposer multisampling={0}>
        <Bloom
          mipmapBlur
          intensity={1.15}
          luminanceThreshold={0.18}
          luminanceSmoothing={0.3}
          radius={0.8}
        />
        <DepthOfField
          worldFocusDistance={42}
          worldFocusRange={65}
          bokehScale={2.4}
        />
        <ChromaticAberration offset={caOffset} />
        <Vignette eskil={false} offset={0.16} darkness={0.82} />
        <Noise premultiply opacity={0.06} />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        mipmapBlur
        intensity={1.05}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.3}
        radius={0.75}
      />
      <Vignette eskil={false} offset={0.15} darkness={0.78} />
      <Noise premultiply opacity={0.05} />
    </EffectComposer>
  );
}
