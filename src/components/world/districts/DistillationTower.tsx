"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sharedTime } from "@/lib/uniforms";
import { flowFragment, flowVertex } from "@/shaders";
import { Steam } from "@/components/world/elements/Steam";
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

/**
 * DISTILLATION TOWER — a 20 m column with five sight-glass tray sections,
 * bubbles rising inside each, a glowing reboiler at the base, an overhead
 * condenser drum and a reflux line running back down. Steam crowns the top.
 */

const TRAYS = [4.2, 7.2, 10.2, 13.2, 16.2];
const BUBBLES_PER_TRAY = 10;
const TOTAL_BUBBLES = TRAYS.length * BUBBLES_PER_TRAY;
const bubbleGeo = new THREE.SphereGeometry(0.09, 8, 6);

export function DistillationTower({ color }: { color: string }) {
  const bubbles = useRef<THREE.InstancedMesh>(null);
  const reboiler = useRef<THREE.Mesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: TOTAL_BUBBLES }, (_, i) => ({
        tray: Math.floor(i / BUBBLES_PER_TRAY),
        a: Math.random() * Math.PI * 2,
        r: 0.3 + Math.random() * 0.9,
        speed: 0.5 + Math.random() * 0.7,
        offset: Math.random(),
      })),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (bubbles.current) {
      for (let i = 0; i < TOTAL_BUBBLES; i++) {
        const s = seeds[i];
        const life = (t * s.speed + s.offset) % 1;
        dummy.position.set(
          Math.cos(s.a + life * 2) * s.r,
          TRAYS[s.tray] - 0.55 + life * 1.15,
          Math.sin(s.a + life * 2) * s.r
        );
        dummy.scale.setScalar(0.5 + life * 0.9);
        dummy.updateMatrix();
        bubbles.current.setMatrixAt(i, dummy.matrix);
      }
      bubbles.current.instanceMatrix.needsUpdate = true;
    }
    if (reboiler.current) {
      const m = reboiler.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 1.8 + Math.sin(t * 5.2) * 0.5 + Math.sin(t * 13.7) * 0.25;
    }
  });

  const refluxPipe = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.2, 18.6, 0),
      new THREE.Vector3(4.4, 17.8, 0.6),
      new THREE.Vector3(4.9, 12, 1),
      new THREE.Vector3(4.4, 4, 0.9),
      new THREE.Vector3(2.1, 2.2, 0.4),
    ]);
    const geo = new THREE.TubeGeometry(curve, 64, 0.14, 8, false);
    const mat = new THREE.ShaderMaterial({
      vertexShader: flowVertex,
      fragmentShader: flowFragment,
      uniforms: {
        uTime: sharedTime,
        uColor: { value: new THREE.Color(color) },
        uBase: { value: new THREE.Color("#241c10") },
        uSpeed: { value: 0.9 },
        uCount: { value: 14 },
        uIntensity: { value: 2 },
      },
    });
    return { geo, mat };
  }, [color]);

  // dedicated reboiler material — its emissive flickers like a furnace
  const reboilerMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0a0602",
        emissive: new THREE.Color("#ff7b2d"),
        emissiveIntensity: 2,
        metalness: 0.3,
        roughness: 0.5,
      }),
    []
  );

  return (
    <group>
      <Platform radius={9} color={color} />

      {/* main shell */}
      <mesh
        geometry={unitCylinder}
        material={matMetalLight}
        scale={[1.9, 19, 1.9]}
        position={[0, 10.1, 0]}
        castShadow
      />
      {/* sight-glass tray sections */}
      {TRAYS.map((y) => (
        <group key={y}>
          <mesh
            geometry={unitCylinder}
            material={matGlass}
            scale={[2.02, 1.3, 2.02]}
            position={[0, y, 0]}
          />
          <mesh
            geometry={unitCylinder}
            material={matMetal}
            scale={[2.06, 0.18, 2.06]}
            position={[0, y - 0.75, 0]}
          />
          <mesh
            geometry={unitCylinder}
            material={emissiveMat(color, 0.9)}
            scale={[2.03, 0.05, 2.03]}
            position={[0, y + 0.7, 0]}
          />
        </group>
      ))}
      <instancedMesh
        ref={bubbles}
        args={[bubbleGeo, emissiveMat(color, 2), TOTAL_BUBBLES]}
        frustumCulled={false}
      />

      {/* crown + aviation light */}
      <mesh
        geometry={unitCylinder}
        material={matMetal}
        scale={[1.2, 1.4, 1.2]}
        position={[0, 20, 0]}
      />
      <GlowSprite color="#ff5f6d" position={[0, 21.2, 0]} scale={2} opacity={0.6} />

      {/* reboiler */}
      <mesh
        ref={reboiler}
        geometry={unitCylinder}
        material={reboilerMat}
        scale={[2.6, 1.6, 2.6]}
        position={[0, 1.4, 0]}
      />
      <GlowSprite color="#ff8a3d" position={[0, 1.6, 0]} scale={7} opacity={0.4} />
      <pointLight position={[0, 2.4, 0]} intensity={70} distance={18} color="#ff8a3d" />

      {/* condenser drum at the top */}
      <group position={[3.4, 18.4, 0]}>
        <mesh
          geometry={unitCylinder}
          material={matMetalLight}
          scale={[0.9, 2.6, 0.9]}
          rotation-z={Math.PI / 2}
          castShadow
        />
        <mesh
          geometry={unitSphere}
          material={emissiveMat(color, 1.6)}
          scale={0.32}
          position={[-1.5, 0, 0]}
        />
      </group>
      <mesh geometry={refluxPipe.geo} material={refluxPipe.mat} />

      {/* service gantry */}
      {[2.2, 6.2, 10.2, 14.2].map((y) => (
        <mesh
          key={y}
          geometry={unitBox}
          material={matMetal}
          scale={[0.14, 4, 0.14]}
          position={[-2.6, y, 1.4]}
        />
      ))}

      {/* the big crown plume */}
      <Steam
        position={[0, 20.8, 0]}
        count={22}
        rise={9}
        spread={1.5}
        size={2}
        opacity={0.34}
        speed={0.15}
      />
    </group>
  );
}
