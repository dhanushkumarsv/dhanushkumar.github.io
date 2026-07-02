"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sharedTime } from "@/lib/uniforms";
import { screenFragment, screenVertex } from "@/shaders";
import {
  GlowSprite,
  Platform,
  emissiveMat,
  matMetal,
  matMetalLight,
  unitBox,
  unitCylinder,
  unitSphere,
} from "@/components/world/elements/common";

/**
 * CONTROL ROOM — mission control for a career. A low command bunker wraps
 * a curved wall of live telemetry (pure shader — bar charts, oscilloscope
 * traces and data ticks re-randomize on their own beat) under a rotating
 * radar dish.
 */

// curved screen wall: 150° arc, drawn on the inside face
const wallGeo = new THREE.CylinderGeometry(
  5.4,
  5.4,
  2.8,
  40,
  1,
  true,
  0,
  Math.PI * 0.84
);
const dishGeo = new THREE.SphereGeometry(1.1, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2.6);

export function ControlRoom({ color }: { color: string }) {
  const radar = useRef<THREE.Group>(null);
  const blinkA = useRef<THREE.Mesh>(null);
  const blinkB = useRef<THREE.Mesh>(null);

  const screenMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: screenVertex,
        fragmentShader: screenFragment,
        uniforms: {
          uTime: sharedTime,
          uColor: { value: new THREE.Color(color) },
        },
        side: THREE.BackSide, // read from inside the arc
      }),
    [color]
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (radar.current) radar.current.rotation.y = t * 0.7;
    if (blinkA.current) {
      (blinkA.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        Math.sin(t * 3.4) > 0 ? 3 : 0.3;
    }
    if (blinkB.current) {
      (blinkB.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        Math.sin(t * 3.4 + Math.PI) > 0 ? 3 : 0.3;
    }
  });

  return (
    <group rotation-y={Math.PI * 0.72}>
      <Platform radius={10} color={color} />

      {/* command bunker */}
      <mesh
        geometry={unitCylinder}
        material={matMetal}
        scale={[6.4, 3.2, 6.4]}
        position={[0, 2.2, 0]}
        castShadow
      />
      <mesh
        geometry={unitCylinder}
        material={emissiveMat(color, 1.2)}
        scale={[6.45, 0.12, 6.45]}
        position={[0, 3.6, 0]}
      />
      <mesh
        geometry={unitCylinder}
        material={matMetalLight}
        scale={[4.2, 0.6, 4.2]}
        position={[0, 4.1, 0]}
      />

      {/* the telemetry wall */}
      <mesh geometry={wallGeo} material={screenMat} position={[0, 5.6, 0]} />
      <mesh
        geometry={unitCylinder}
        material={matMetal}
        scale={[5.5, 0.18, 5.5]}
        position={[0, 7.1, 0]}
      />
      <GlowSprite color={color} position={[0, 5.6, 0]} scale={8} opacity={0.22} />

      {/* radar */}
      <group position={[0, 7.4, 0]}>
        <mesh geometry={unitCylinder} material={matMetalLight} scale={[0.16, 1.6, 0.16]} position={[0, 0.8, 0]} />
        <group ref={radar} position={[0, 1.7, 0]}>
          <mesh
            geometry={dishGeo}
            material={matMetalLight}
            rotation-x={Math.PI / 1.7}
            position={[0.5, 0, 0]}
          />
          <mesh
            geometry={unitSphere}
            material={emissiveMat("#ffffff", 2.6)}
            scale={0.12}
            position={[0.95, 0.35, 0]}
          />
        </group>
      </group>

      {/* comm masts with alternating blinkers */}
      {[-1, 1].map((side, i) => (
        <group key={side} position={[side * 4.6, 3.8, -2.4]}>
          <mesh geometry={unitCylinder} material={matMetal} scale={[0.08, 2.6, 0.08]} position={[0, 1.3, 0]} />
          <mesh
            ref={i === 0 ? blinkA : blinkB}
            geometry={unitSphere}
            material={emissiveMat("#ff5f6d", 3).clone()}
            scale={0.16}
            position={[0, 2.7, 0]}
          />
        </group>
      ))}

      {/* entrance beacons */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          geometry={unitBox}
          material={emissiveMat(color, 2)}
          scale={[0.2, 1.6, 0.2]}
          position={[side * 1.6, 1.4, 6.2]}
        />
      ))}
    </group>
  );
}
