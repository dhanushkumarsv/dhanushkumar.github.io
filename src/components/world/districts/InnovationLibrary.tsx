"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  Beam,
  GlowSprite,
  Platform,
  emissiveMat,
  matMetal,
  unitBox,
  unitCylinder,
} from "@/components/world/elements/common";

/**
 * INNOVATION LIBRARY — the archive. A double helix of luminous data slabs
 * climbs a light core; each slab is a record — papers, theses, milestones —
 * slowly orbiting, forever indexed.
 */

const SLABS = 26;
const slabGeo = new THREE.BoxGeometry(1.5, 0.09, 0.95);

export function InnovationLibrary({ color }: { color: string }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const params = useMemo(
    () =>
      Array.from({ length: SLABS }, (_, i) => ({
        strand: i % 2,
        frac: Math.floor(i / 2) / (SLABS / 2 - 1),
        bobSeed: Math.random() * Math.PI * 2,
      })),
    []
  );

  const slabMat = useMemo(() => {
    const m = emissiveMat(color, 1.5).clone();
    m.color = new THREE.Color("#101822");
    return m;
  }, [color]);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    for (let i = 0; i < SLABS; i++) {
      const p = params[i];
      const y = 2.2 + p.frac * 11.5;
      const a =
        p.frac * Math.PI * 3.4 + t * 0.12 + (p.strand ? Math.PI : 0);
      const r = 3.4 - p.frac * 0.8;
      dummy.position.set(
        Math.cos(a) * r,
        y + Math.sin(t * 0.9 + p.bobSeed) * 0.16,
        Math.sin(a) * r
      );
      dummy.rotation.set(0, -a, Math.sin(t * 0.5 + p.bobSeed) * 0.06);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <Platform radius={8.5} color={color} />

      {/* light core */}
      <mesh
        geometry={unitCylinder}
        material={emissiveMat(color, 1.6)}
        scale={[0.5, 13.5, 0.5]}
        position={[0, 7.3, 0]}
      />
      <mesh
        geometry={unitCylinder}
        material={matMetal}
        scale={[1.5, 1.4, 1.5]}
        position={[0, 1.3, 0]}
        castShadow
      />
      <mesh
        geometry={unitCylinder}
        material={matMetal}
        scale={[1.1, 0.5, 1.1]}
        position={[0, 14.2, 0]}
      />
      <GlowSprite color={color} position={[0, 14.6, 0]} scale={5} opacity={0.5} />
      <Beam color={color} position={[0, 14, 0]} height={18} radius={1.2} strength={0.12} />

      {/* the record helix */}
      <instancedMesh
        ref={mesh}
        args={[slabGeo, slabMat, SLABS]}
        frustumCulled={false}
      />

      {/* reading obelisks around the base */}
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2 + 0.5;
        return (
          <group key={i} position={[Math.cos(a) * 5.6, 0.6, Math.sin(a) * 5.6]}>
            <mesh
              geometry={unitBox}
              material={matMetal}
              scale={[0.7, 2.2 + (i % 2) * 0.8, 0.7]}
              position={[0, 1.1 + (i % 2) * 0.4, 0]}
              castShadow
            />
            <mesh
              geometry={unitBox}
              material={emissiveMat(color, 1.8)}
              scale={[0.72, 0.1, 0.72]}
              position={[0, 2.2 + (i % 2) * 0.8, 0]}
            />
          </group>
        );
      })}
    </group>
  );
}
