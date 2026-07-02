"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  GlowSprite,
  Platform,
  emissiveMat,
  matMetal,
  matMetalLight,
  unitCylinder,
  unitSphere,
} from "@/components/world/elements/common";

/**
 * COMMUNICATION HUB — the antenna farm. A tapering lattice mast emits
 * expanding signal rings into the night; a side dish aims at the sky and
 * a red beacon warns passing drones.
 */

const RING_COUNT = 3;
const signalRingGeo = new THREE.TorusGeometry(1, 0.05, 8, 48);

export function CommsHub({ color }: { color: string }) {
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  const ringMats = useMemo(
    () =>
      Array.from({ length: RING_COUNT }, () => {
        const m = emissiveMat(color, 2).clone();
        m.transparent = true;
        return m;
      }),
    [color]
  );
  const beacon = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    for (let i = 0; i < RING_COUNT; i++) {
      const mesh = rings.current[i];
      if (!mesh) continue;
      const life = (t * 0.32 + i / RING_COUNT) % 1;
      const scale = 0.6 + life * 7.5;
      mesh.scale.setScalar(scale);
      ringMats[i].opacity = (1 - life) * 0.85;
      mesh.position.y = 16.4 + life * 1.6;
    }
    if (beacon.current) {
      (beacon.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        Math.sin(t * 2.6) > 0.2 ? 3.4 : 0.4;
    }
  });

  return (
    <group>
      <Platform radius={8} color={color} />

      {/* tapering mast segments with luminous joints */}
      {[
        { r0: 1.1, r1: 0.75, h: 6, y: 3.6 },
        { r0: 0.7, r1: 0.45, h: 5.5, y: 9.4 },
        { r0: 0.4, r1: 0.2, h: 5, y: 14.6 },
      ].map((seg, i) => (
        <group key={i}>
          <mesh
            geometry={new THREE.CylinderGeometry(seg.r1, seg.r0, seg.h, 12)}
            material={matMetalLight}
            position={[0, seg.y, 0]}
            castShadow
          />
          <mesh
            geometry={unitCylinder}
            material={emissiveMat(color, 1.8)}
            scale={[seg.r1 + 0.08, 0.12, seg.r1 + 0.08]}
            position={[0, seg.y + seg.h / 2, 0]}
          />
        </group>
      ))}

      {/* emitter crown */}
      <mesh
        geometry={unitSphere}
        material={emissiveMat(color, 2.8)}
        scale={0.5}
        position={[0, 17.4, 0]}
      />
      <GlowSprite color={color} position={[0, 17.4, 0]} scale={7} opacity={0.55} />
      <mesh
        ref={beacon}
        geometry={unitSphere}
        material={emissiveMat("#ff5f6d", 3).clone()}
        scale={0.18}
        position={[0, 18.2, 0]}
      />

      {/* expanding signal rings */}
      {Array.from({ length: RING_COUNT }).map((_, i) => (
        <mesh
          key={i}
          ref={(m) => {
            rings.current[i] = m;
          }}
          geometry={signalRingGeo}
          material={ringMats[i]}
          rotation-x={Math.PI / 2}
          position={[0, 16.4, 0]}
        />
      ))}

      {/* uplink dish */}
      <group position={[4.2, 0.6, 2.8]} rotation-y={-0.7}>
        <mesh
          geometry={unitCylinder}
          material={matMetal}
          scale={[0.5, 1.8, 0.5]}
          position={[0, 0.9, 0]}
        />
        <mesh
          geometry={new THREE.SphereGeometry(1.5, 20, 12, 0, Math.PI * 2, 0, Math.PI / 3)}
          material={matMetalLight}
          position={[0, 2.2, 0]}
          rotation-x={-Math.PI / 3.2}
          castShadow
        />
        <mesh
          geometry={unitSphere}
          material={emissiveMat("#ffffff", 2.4)}
          scale={0.14}
          position={[0, 2.9, 0.8]}
        />
      </group>

      {/* guy-wire anchor stubs */}
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2 + 0.4;
        return (
          <mesh
            key={i}
            geometry={unitCylinder}
            material={matMetal}
            scale={[0.24, 1, 0.24]}
            position={[Math.cos(a) * 5.4, 1.1, Math.sin(a) * 5.4]}
            rotation-z={Math.cos(a) * 0.5}
            rotation-x={-Math.sin(a) * 0.5}
          />
        );
      })}
    </group>
  );
}
