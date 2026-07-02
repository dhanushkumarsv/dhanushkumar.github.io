"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  GlowSprite,
  Platform,
  emissiveMat,
  matGlass,
  matMetal,
  matMetalLight,
  unitBox,
  unitCylinder,
  unitSphere,
} from "@/components/world/elements/common";

const domeGeo = new THREE.SphereGeometry(6, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2);
const orbitGeo = new THREE.TorusGeometry(2.6, 0.05, 8, 48);
const bondGeo = new THREE.CylinderGeometry(0.07, 0.07, 1, 8);

/** Hexagonal molecule: 6 atoms + bonds + core, tumbling inside the dome. */
function Molecule({ color }: { color: string }) {
  const group = useRef<THREE.Group>(null);
  const electrons = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = t * 0.35;
      group.current.rotation.x = Math.sin(t * 0.22) * 0.4;
    }
    for (let i = 0; i < 2; i++) {
      const e = electrons.current[i];
      if (!e) continue;
      const a = t * (1.3 + i * 0.4) + i * Math.PI;
      e.position.set(Math.cos(a) * 3.3, Math.sin(a * 1.7) * 0.8, Math.sin(a) * 3.3);
    }
  });

  const atoms: [number, number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    atoms.push([Math.cos(a) * 2.1, 0, Math.sin(a) * 2.1]);
  }

  return (
    <group position={[0, 4.4, 0]}>
      <group ref={group}>
        <mesh geometry={unitSphere} material={emissiveMat("#ffffff", 2.4)} scale={0.55} />
        {atoms.map((p, i) => (
          <group key={i}>
            <mesh
              geometry={unitSphere}
              material={emissiveMat(color, 2)}
              scale={0.34}
              position={p}
            />
            {/* bond to center */}
            <mesh
              geometry={bondGeo}
              material={emissiveMat(color, 0.9)}
              position={[p[0] / 2, 0, p[2] / 2]}
              scale={[1, 2.1, 1]}
              rotation={[Math.PI / 2, 0, -Math.atan2(p[2], p[0]) + Math.PI / 2]}
            />
          </group>
        ))}
        <mesh geometry={orbitGeo} material={emissiveMat(color, 1.2)} rotation-x={Math.PI / 2.6} />
        <mesh geometry={orbitGeo} material={emissiveMat("#ffffff", 0.8)} rotation-x={-Math.PI / 2.2} scale={1.25} />
      </group>
      {[0, 1].map((i) => (
        <mesh
          key={i}
          ref={(m) => {
            electrons.current[i] = m;
          }}
          geometry={unitSphere}
          material={emissiveMat("#ffffff", 3)}
          scale={0.14}
        />
      ))}
      <GlowSprite color={color} position={[0, 0, 0]} scale={9} opacity={0.35} />
    </group>
  );
}

/**
 * RESEARCH CENTER — a glass observatory dome sheltering a tumbling
 * molecule hologram, flanked by two annex laboratories.
 */
export function ResearchCenter({ color }: { color: string }) {
  return (
    <group>
      <Platform radius={9} color={color} />

      {/* dome + ring foundation */}
      <mesh geometry={domeGeo} material={matGlass} position={[0, 0.6, 0]} />
      <mesh
        geometry={unitCylinder}
        material={matMetalLight}
        scale={[6.2, 0.5, 6.2]}
        position={[0, 0.85, 0]}
        castShadow
      />
      <Molecule color={color} />

      {/* annex labs */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 6.6, 0.6, side * 2.2]}>
          <mesh
            geometry={unitBox}
            material={matMetal}
            scale={[3, 2.4, 2.2]}
            position={[0, 1.2, 0]}
            castShadow
          />
          <mesh
            geometry={unitBox}
            material={emissiveMat(color, 1.4)}
            scale={[3.05, 0.14, 2.25]}
            position={[0, 1.9, 0]}
          />
          <mesh
            geometry={unitCylinder}
            material={matMetalLight}
            scale={[0.09, 1.6, 0.09]}
            position={[side * 0.9, 3.2, 0]}
          />
          <GlowSprite color={color} position={[side * 0.9, 4.1, 0]} scale={1.6} opacity={0.6} />
        </group>
      ))}
    </group>
  );
}
