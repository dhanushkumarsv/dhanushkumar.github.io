"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  Beam,
  GlowSprite,
  Platform,
  emissiveMat,
  matMetal,
  matMetalLight,
  unitCylinder,
  unitOcta,
  unitSphere,
} from "@/components/world/elements/common";

const haloA = new THREE.TorusGeometry(4.2, 0.1, 10, 64);
const haloB = new THREE.TorusGeometry(3.1, 0.08, 10, 56);
const haloC = new THREE.TorusGeometry(2.2, 0.07, 10, 48);
const taper = new THREE.CylinderGeometry(1.5, 3.2, 18, 24);
const needle = new THREE.CylinderGeometry(0.28, 0.95, 10, 16);

const DRONE_COUNT = 4;

/**
 * The Nexus Spire — the world's landmark. Counter-rotating halo rings,
 * a beam into the sky, and a small flock of survey drones in orbit.
 */
export function NexusSpire() {
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  const drones = useRef<(THREE.Group | null)[]>([]);
  const crown = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const r0 = rings.current[0];
    const r1 = rings.current[1];
    const r2 = rings.current[2];
    if (r0) {
      r0.rotation.x = Math.PI / 2 + Math.sin(t * 0.3) * 0.22;
      r0.rotation.z = t * 0.18;
    }
    if (r1) {
      r1.rotation.x = Math.PI / 2 - Math.sin(t * 0.24) * 0.3;
      r1.rotation.z = -t * 0.26;
    }
    if (r2) {
      r2.rotation.x = Math.PI / 2 + Math.cos(t * 0.2) * 0.18;
      r2.rotation.z = t * 0.4;
    }
    if (crown.current) {
      const pulse = 1 + Math.sin(t * 1.6) * 0.08;
      crown.current.scale.setScalar(1.15 * pulse);
    }
    for (let i = 0; i < DRONE_COUNT; i++) {
      const d = drones.current[i];
      if (!d) continue;
      const a = t * (0.16 + i * 0.05) + (i * Math.PI * 2) / DRONE_COUNT;
      const r = 10 + i * 2.2;
      d.position.set(
        Math.cos(a) * r,
        13 + i * 2.4 + Math.sin(t * 0.8 + i) * 0.8,
        Math.sin(a) * r
      );
      d.rotation.y = -a + Math.PI / 2;
    }
  });

  return (
    <group>
      <Platform radius={12} color="#67e8f9" height={0.8} />

      {/* trunk */}
      <mesh
        geometry={unitCylinder}
        material={matMetal}
        scale={[5, 3, 5]}
        position={[0, 2.2, 0]}
        castShadow
      />
      <mesh geometry={taper} material={matMetalLight} position={[0, 12.5, 0]} castShadow />
      <mesh geometry={needle} material={matMetal} position={[0, 26, 0]} />

      {/* luminous seams up the trunk */}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          geometry={unitCylinder}
          material={emissiveMat("#67e8f9", 1.8)}
          scale={[0.12, 16, 0.12]}
          position={[
            Math.cos((i * Math.PI) / 2) * 2.1,
            12,
            Math.sin((i * Math.PI) / 2) * 2.1,
          ]}
        />
      ))}

      {/* counter-rotating halos */}
      <mesh
        ref={(m) => {
          rings.current[0] = m;
        }}
        geometry={haloA}
        material={emissiveMat("#67e8f9", 1.5)}
        position={[0, 12, 0]}
      />
      <mesh
        ref={(m) => {
          rings.current[1] = m;
        }}
        geometry={haloB}
        material={emissiveMat("#9db8ff", 1.3)}
        position={[0, 18, 0]}
      />
      <mesh
        ref={(m) => {
          rings.current[2] = m;
        }}
        geometry={haloC}
        material={emissiveMat("#e0fcff", 1.6)}
        position={[0, 24, 0]}
      />

      {/* crown + sky beam */}
      <mesh
        ref={crown}
        geometry={unitSphere}
        material={emissiveMat("#e6feff", 3)}
        position={[0, 31.6, 0]}
      />
      <GlowSprite color="#9ff3ff" position={[0, 31.6, 0]} scale={14} opacity={0.6} />
      <Beam color="#67e8f9" position={[0, 31, 0]} height={46} radius={2} strength={0.12} />

      <pointLight position={[0, 20, 0]} intensity={260} distance={70} color="#67e8f9" />

      {/* survey drones */}
      {Array.from({ length: DRONE_COUNT }).map((_, i) => (
        <group
          key={i}
          ref={(g) => {
            drones.current[i] = g;
          }}
        >
          <mesh
            geometry={unitOcta}
            material={emissiveMat(i % 2 ? "#67e8f9" : "#e879f9", 2.4)}
            scale={0.32}
          />
          <GlowSprite
            color={i % 2 ? "#67e8f9" : "#e879f9"}
            position={[0, 0, 0]}
            scale={1.8}
            opacity={0.5}
          />
        </group>
      ))}
    </group>
  );
}
