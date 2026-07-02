"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sharedTime } from "@/lib/uniforms";
import { flowFragment, flowVertex } from "@/shaders";
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
 * HYDROGEN ENERGY PLANT — electrolyzer racks with glowing cell slots, a
 * bubbling photoreactor column, twin storage spheres fed by animated
 * pipelines, and a spinning wind turbine.
 */

const BUBBLES = 42;
const bubbleGeo = new THREE.SphereGeometry(0.07, 8, 6);

function BubbleColumn({ color }: { color: string }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: BUBBLES }, () => ({
        a: Math.random() * Math.PI * 2,
        r: Math.random() * 0.5,
        speed: 0.35 + Math.random() * 0.5,
        offset: Math.random(),
        size: 0.6 + Math.random() * 0.9,
      })),
    []
  );

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    for (let i = 0; i < BUBBLES; i++) {
      const s = seeds[i];
      const life = (t * s.speed + s.offset) % 1;
      dummy.position.set(
        Math.cos(s.a + life * 3) * s.r,
        life * 3.6 + 0.3,
        Math.sin(s.a + life * 3) * s.r
      );
      const sc = s.size * (0.5 + life * 0.7);
      dummy.scale.setScalar(sc);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* glass reactor shell */}
      <mesh
        geometry={unitCylinder}
        material={matGlass}
        scale={[0.9, 4.2, 0.9]}
        position={[0, 2.4, 0]}
      />
      <mesh
        geometry={unitCylinder}
        material={matMetalLight}
        scale={[1.05, 0.35, 1.05]}
        position={[0, 0.4, 0]}
      />
      <mesh
        geometry={unitCylinder}
        material={matMetalLight}
        scale={[1.05, 0.35, 1.05]}
        position={[0, 4.5, 0]}
      />
      <instancedMesh
        ref={mesh}
        args={[bubbleGeo, emissiveMat(color, 2.2), BUBBLES]}
        frustumCulled={false}
      />
      <GlowSprite color={color} position={[0, 2.6, 0]} scale={4} opacity={0.3} />
    </group>
  );
}

export function HydrogenPlant({ color }: { color: string }) {
  const rotor = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (rotor.current) rotor.current.rotation.z += delta * 1.7;
  });

  const pipeToSpheres = useMemo(() => {
    const mk = (x: number) => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2.2, 1.4, 0),
        new THREE.Vector3(x * 0.4, 2.6, 1.4),
        new THREE.Vector3(x, 2.2, 3.4),
      ]);
      return new THREE.TubeGeometry(curve, 32, 0.12, 8, false);
    };
    const mat = new THREE.ShaderMaterial({
      vertexShader: flowVertex,
      fragmentShader: flowFragment,
      uniforms: {
        uTime: sharedTime,
        uColor: { value: new THREE.Color(color) },
        uBase: { value: new THREE.Color("#15251e") },
        uSpeed: { value: 1.1 },
        uCount: { value: 7 },
        uIntensity: { value: 2.1 },
      },
    });
    return { geos: [mk(2.2), mk(5.2)], mat };
  }, [color]);

  return (
    <group>
      <Platform radius={10} color={color} />

      {/* electrolyzer racks */}
      {[-1, 0, 1].map((i) => (
        <group key={i} position={[-4.6, 0.6, i * 2.6]}>
          <mesh
            geometry={unitBox}
            material={matMetal}
            scale={[2.4, 2, 1.7]}
            position={[0, 1, 0]}
            castShadow
          />
          {[0.55, 1.0, 1.45].map((y) => (
            <mesh
              key={y}
              geometry={unitBox}
              material={emissiveMat(color, 2)}
              scale={[2.45, 0.12, 1.5]}
              position={[0, y, 0]}
            />
          ))}
        </group>
      ))}

      {/* photoreactor bubble column */}
      <group position={[-2.2, 0.6, 0]}>
        <BubbleColumn color={color} />
      </group>

      {/* storage spheres on cradles */}
      {[2.2, 5.2].map((x, i) => (
        <group key={x} position={[x, 0.6, 3.4]}>
          <mesh
            geometry={unitSphere}
            material={matMetalLight}
            scale={1.6 - i * 0.25}
            position={[0, 2.2, 0]}
            castShadow
          />
          <mesh
            geometry={new THREE.TorusGeometry(1.6 - i * 0.25, 0.06, 8, 40)}
            material={emissiveMat(color, 1.8)}
            rotation-x={Math.PI / 2}
            position={[0, 2.2, 0]}
          />
          <mesh
            geometry={unitCylinder}
            material={matMetal}
            scale={[0.85, 0.9, 0.85]}
            position={[0, 0.45, 0]}
          />
        </group>
      ))}
      {pipeToSpheres.geos.map((g, i) => (
        <mesh key={i} geometry={g} material={pipeToSpheres.mat} position={[0, 0.6, 0]} />
      ))}

      {/* wind turbine */}
      <group position={[4.2, 0.6, -3.6]}>
        <mesh
          geometry={unitCylinder}
          material={matMetalLight}
          scale={[0.22, 9, 0.22]}
          position={[0, 4.5, 0]}
          castShadow
        />
        <group ref={rotor} position={[0, 9, 0.35]}>
          <mesh geometry={unitSphere} material={matMetalLight} scale={0.4} />
          {[0, 1, 2].map((b) => (
            <mesh
              key={b}
              geometry={unitBox}
              material={matMetalLight}
              scale={[0.16, 3.4, 0.05]}
              position={[
                Math.sin((b * Math.PI * 2) / 3) * 1.7,
                Math.cos((b * Math.PI * 2) / 3) * 1.7,
                0,
              ]}
              rotation-z={-(b * Math.PI * 2) / 3}
            />
          ))}
        </group>
        <GlowSprite color="#ffffff" position={[0, 9, 0.5]} scale={1.4} opacity={0.5} />
      </group>
    </group>
  );
}
