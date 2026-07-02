"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { MeshReflectorMaterial } from "@react-three/drei";
import { QUALITY } from "@/lib/quality";
import { sharedTime } from "@/lib/uniforms";
import { useExperience } from "@/store/experience";
import { gridFragment, gridVertex } from "@/shaders";

const groundGeo = new THREE.CircleGeometry(150, 72);

/**
 * Wet-obsidian ground with planar reflections (tier-gated) and a faint
 * engineering grid with radar pulses expanding from the spire.
 */
export function Ground() {
  const quality = useExperience((s) => s.quality);
  const q = QUALITY[quality];

  const gridMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: gridVertex,
        fragmentShader: gridFragment,
        uniforms: {
          uTime: sharedTime,
          uColor: { value: new THREE.Color("#3fd6f2") },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} geometry={groundGeo} receiveShadow>
        {q.reflections ? (
          <MeshReflectorMaterial
            blur={[260, 80]}
            resolution={q.reflectionRes}
            mixBlur={1}
            mixStrength={55}
            roughness={0.85}
            depthScale={1.1}
            minDepthThreshold={0.35}
            maxDepthThreshold={1.3}
            color="#0a1016"
            metalness={0.55}
            mirror={0.6}
          />
        ) : (
          <meshStandardMaterial
            color="#0b1219"
            metalness={0.72}
            roughness={0.4}
          />
        )}
      </mesh>

      <mesh
        rotation-x={-Math.PI / 2}
        position-y={0.05}
        geometry={groundGeo}
        material={gridMaterial}
      />
    </group>
  );
}
