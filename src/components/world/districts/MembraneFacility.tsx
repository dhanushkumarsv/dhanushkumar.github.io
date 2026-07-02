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
  unitCylinder,
  unitSphere,
  unitBox,
} from "@/components/world/elements/common";

/**
 * MEMBRANE DISTILLATION FACILITY — a horizontal VMD module with a cut-away
 * mid-section: the glowing membrane core is visible inside, and vapor
 * particles physically cross it toward the condenser coil.
 */

const VAPOR = 26;
const vaporGeo = new THREE.SphereGeometry(0.05, 6, 5);
// outer shell with a viewing cut-away (270° of cylinder wall)
const shellGeo = new THREE.CylinderGeometry(1.5, 1.5, 5.5, 28, 1, true, 0, Math.PI * 1.5);
const capGeo = new THREE.SphereGeometry(1.5, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2);

function flowMat(color: string, base: string, speed: number) {
  return new THREE.ShaderMaterial({
    vertexShader: flowVertex,
    fragmentShader: flowFragment,
    uniforms: {
      uTime: sharedTime,
      uColor: { value: new THREE.Color(color) },
      uBase: { value: new THREE.Color(base) },
      uSpeed: { value: speed },
      uCount: { value: 8 },
      uIntensity: { value: 2.1 },
    },
  });
}

export function MembraneFacility({ color }: { color: string }) {
  const vapor = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: VAPOR }, () => ({
        z: (Math.random() - 0.5) * 4.6,
        a: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.6,
        offset: Math.random(),
      })),
    []
  );

  useFrame(({ clock }) => {
    if (!vapor.current) return;
    const t = clock.getElapsedTime();
    for (let i = 0; i < VAPOR; i++) {
      const s = seeds[i];
      const life = (t * s.speed + s.offset) % 1;
      // vapor leaves the hot core (r 0.55) and drifts to the shell (r 1.4)
      const r = 0.55 + life * 0.85;
      dummy.position.set(Math.cos(s.a) * r, Math.sin(s.a) * r, s.z);
      dummy.scale.setScalar(0.6 + life * 1.1);
      dummy.updateMatrix();
      vapor.current.setMatrixAt(i, dummy.matrix);
    }
    vapor.current.instanceMatrix.needsUpdate = true;
  });

  const feedPipe = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-6.5, 0.7, 1.5),
      new THREE.Vector3(-4.6, 1.2, 0.8),
      new THREE.Vector3(-3.2, 2.1, 0),
    ]);
    return {
      geo: new THREE.TubeGeometry(curve, 32, 0.16, 8, false),
      mat: flowMat("#ff9a5c", "#2a1a14", 1.3), // hot brine in
    };
  }, []);

  const permeatePipe = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(3.2, 2.1, 0),
      new THREE.Vector3(4.7, 1.4, 1.2),
      new THREE.Vector3(6.2, 0.7, 2.0),
    ]);
    return {
      geo: new THREE.TubeGeometry(curve, 32, 0.14, 8, false),
      mat: flowMat(color, "#101c26", 1.1), // cool distillate out
    };
  }, [color]);

  return (
    <group>
      <Platform radius={8.5} color={color} />

      {/* skid legs */}
      {[-1.8, 1.8].map((z) =>
        [-1, 1].map((x) => (
          <mesh
            key={`${z}${x}`}
            geometry={unitBox}
            material={matMetal}
            scale={[0.3, 1.5, 0.3]}
            position={[x * 1.1, 1.05, z]}
          />
        ))
      )}

      {/* the VMD module */}
      <group position={[0, 2.1, 0]} rotation-z={Math.PI / 2}>
        {/* cut-away shell — rotated so the opening faces the camera shot */}
        <mesh
          geometry={shellGeo}
          material={matMetalLight}
          rotation-y={Math.PI * 0.25}
          castShadow
        />
        {/* glass filler over the cut-away */}
        <mesh geometry={unitCylinder} material={matGlass} scale={[1.48, 5.4, 1.48]} />
        {/* end caps */}
        <mesh geometry={capGeo} material={matMetalLight} position={[0, 2.75, 0]} />
        <mesh
          geometry={capGeo}
          material={matMetalLight}
          position={[0, -2.75, 0]}
          rotation-x={Math.PI}
        />
        {/* the membrane core — the glowing heart */}
        <mesh
          geometry={unitCylinder}
          material={emissiveMat(color, 1.7)}
          scale={[0.55, 5.2, 0.55]}
        />
        {/* vapor crossing the membrane */}
        <instancedMesh
          ref={vapor}
          args={[vaporGeo, emissiveMat("#ffffff", 2.4), VAPOR]}
          rotation-z={-Math.PI / 2}
          frustumCulled={false}
        />
      </group>
      <GlowSprite color={color} position={[0, 2.1, 0]} scale={6} opacity={0.28} />

      {/* feed / permeate lines */}
      <mesh geometry={feedPipe.geo} material={feedPipe.mat} />
      <mesh geometry={permeatePipe.geo} material={permeatePipe.mat} />

      {/* condenser coil tower */}
      <group position={[5.2, 0.6, -2.6]}>
        <mesh
          geometry={unitCylinder}
          material={matMetal}
          scale={[0.5, 3.6, 0.5]}
          position={[0, 1.8, 0]}
          castShadow
        />
        {[0.9, 1.7, 2.5, 3.3].map((y) => (
          <mesh
            key={y}
            geometry={new THREE.TorusGeometry(0.95, 0.09, 8, 32)}
            material={emissiveMat(color, 1.2)}
            rotation-x={Math.PI / 2}
            position={[0, y, 0]}
          />
        ))}
        <mesh
          geometry={unitSphere}
          material={emissiveMat("#ffffff", 2)}
          scale={0.3}
          position={[0, 3.9, 0]}
        />
      </group>

      {/* vacuum vent wisp */}
      <Steam
        position={[-1.2, 4.2, -0.4]}
        count={9}
        rise={4.5}
        spread={0.6}
        size={0.9}
        opacity={0.22}
        speed={0.2}
      />
    </group>
  );
}
