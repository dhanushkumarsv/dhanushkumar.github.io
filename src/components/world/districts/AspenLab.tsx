"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sharedTime } from "@/lib/uniforms";
import { flowFragment, flowVertex, holoFragment, holoVertex } from "@/shaders";
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
 * ASPEN PLUS LABORATORY — the simulation house. Above the roof floats a
 * live holographic flowsheet (feed → flash drum → column → product) with
 * luminous stream slugs and shimmering hologram frames.
 */

const holoPlane = new THREE.PlaneGeometry(7.5, 4.2);

function holoTube(points: THREE.Vector3[], color: string) {
  const curve = new THREE.CatmullRomCurve3(points);
  const geo = new THREE.TubeGeometry(curve, 32, 0.06, 6, false);
  const mat = new THREE.ShaderMaterial({
    vertexShader: flowVertex,
    fragmentShader: flowFragment,
    uniforms: {
      uTime: sharedTime,
      uColor: { value: new THREE.Color(color) },
      uBase: { value: new THREE.Color("#221a3d") },
      uSpeed: { value: 1.6 },
      uCount: { value: 4 },
      uIntensity: { value: 2.4 },
    },
    transparent: true,
  });
  return { geo, mat };
}

export function AspenLab({ color }: { color: string }) {
  const holo = useRef<THREE.Group>(null);

  const holoMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: holoVertex,
        fragmentShader: holoFragment,
        uniforms: {
          uTime: sharedTime,
          uColor: { value: new THREE.Color(color) },
          uOpacity: { value: 0.16 },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [color]
  );

  // holographic flowsheet piping (local coords within the holo group)
  const streams = useMemo(() => {
    const y = 0;
    return [
      holoTube(
        [new THREE.Vector3(-3.4, y - 0.6, 0), new THREE.Vector3(-1.6, y - 0.6, 0)],
        color
      ),
      holoTube(
        [
          new THREE.Vector3(-1.1, y - 0.2, 0),
          new THREE.Vector3(-0.4, y + 0.7, 0),
          new THREE.Vector3(0.5, y + 0.7, 0),
        ],
        color
      ),
      holoTube(
        [new THREE.Vector3(1.0, y + 0.7, 0), new THREE.Vector3(1.7, y + 0.2, 0)],
        color
      ),
      holoTube(
        [
          new THREE.Vector3(2.2, y + 1.1, 0),
          new THREE.Vector3(3.1, y + 1.3, 0),
        ],
        "#ffffff"
      ),
    ];
  }, [color]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (holo.current) {
      holo.current.position.y = 8.6 + Math.sin(t * 0.7) * 0.18;
      holo.current.rotation.y = Math.sin(t * 0.16) * 0.35;
    }
  });

  return (
    <group>
      <Platform radius={9} color={color} />

      {/* laboratory block with luminous floor seams */}
      <mesh
        geometry={unitBox}
        material={matMetal}
        scale={[8.4, 5.2, 6]}
        position={[0, 3.2, 0]}
        castShadow
      />
      {[1.6, 3.0, 4.4].map((y) => (
        <mesh
          key={y}
          geometry={unitBox}
          material={emissiveMat(color, 1.3)}
          scale={[8.5, 0.1, 6.1]}
          position={[0, y, 0]}
        />
      ))}
      <mesh
        geometry={unitBox}
        material={matMetalLight}
        scale={[3.4, 1.2, 3]}
        position={[0, 6.4, 0]}
        castShadow
      />

      {/* hologram projector cone glow */}
      <mesh
        geometry={unitCylinder}
        material={emissiveMat(color, 2.2)}
        scale={[0.5, 0.3, 0.5]}
        position={[0, 7.1, 0]}
      />
      <GlowSprite color={color} position={[0, 7.3, 0]} scale={3} opacity={0.5} />

      {/* floating flowsheet hologram */}
      <group ref={holo} position={[0, 8.6, 0]}>
        <mesh geometry={holoPlane} material={holoMat} />

        {/* unit operations, drawn as glowing schematic solids */}
        <mesh
          geometry={unitSphere}
          material={emissiveMat(color, 1.8)}
          scale={0.42}
          position={[-1.35, -0.45, 0.05]}
        />
        <mesh
          geometry={unitCylinder}
          material={emissiveMat(color, 1.8)}
          scale={[0.28, 1.5, 0.28]}
          position={[0.75, 0.65, 0.05]}
        />
        <mesh
          geometry={unitCylinder}
          material={emissiveMat("#ffffff", 2.2)}
          scale={[0.14, 0.5, 0.14]}
          position={[1.95, 0.9, 0.05]}
        />
        <mesh
          geometry={unitBox}
          material={emissiveMat(color, 1.5)}
          scale={[0.5, 0.5, 0.2]}
          position={[-2.6, -0.62, 0.05]}
        />
        {streams.map((s, i) => (
          <mesh key={i} geometry={s.geo} material={s.mat} position={[0, 0, 0.05]} />
        ))}
      </group>
    </group>
  );
}
