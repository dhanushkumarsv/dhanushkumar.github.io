"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { DISTRICTS, RING_RADIUS } from "@/lib/districts";
import { sharedTime } from "@/lib/uniforms";
import { flowFragment, flowVertex } from "@/shaders";
import { matMetal, unitCylinder } from "@/components/world/elements/common";

/**
 * The circulatory system: a ring main connecting all eight facilities plus
 * radial feeders from the Nexus Spire, all carrying visible luminous slugs
 * of product. Flow animation is pure fragment shader.
 */

function flowMaterial(color: string, speed: number, count: number) {
  return new THREE.ShaderMaterial({
    vertexShader: flowVertex,
    fragmentShader: flowFragment,
    uniforms: {
      uTime: sharedTime,
      uColor: { value: new THREE.Color(color) },
      uBase: { value: new THREE.Color("#141e2c") },
      uSpeed: { value: speed },
      uCount: { value: count },
      uIntensity: { value: 1.9 },
    },
  });
}

export function PipeNetwork() {
  const ring = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 64;
    for (let i = 0; i < segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      points.push(
        new THREE.Vector3(
          Math.cos(a) * RING_RADIUS,
          0.9 + Math.sin(a * 4) * 0.15,
          Math.sin(a) * RING_RADIUS
        )
      );
    }
    const curve = new THREE.CatmullRomCurve3(points, true);
    const geo = new THREE.TubeGeometry(curve, 220, 0.26, 10, true);
    return { geo, mat: flowMaterial("#39d2f0", 0.55, 46) };
  }, []);

  // radial feeders from the spire to alternating districts
  const feeders = useMemo(() => {
    return DISTRICTS.filter((_, i) => i % 2 === 0).map((d) => {
      const start = new THREE.Vector3(
        d.position[0] * 0.28,
        1.6,
        d.position[2] * 0.28
      );
      const end = new THREE.Vector3(d.position[0], 0.9, d.position[2]);
      const mid = start.clone().lerp(end, 0.5);
      mid.y = 3.2;
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const geo = new THREE.TubeGeometry(curve, 40, 0.2, 8, false);
      return { geo, mat: flowMaterial(d.color, 0.8, 10), id: d.id };
    });
  }, []);

  // stanchions holding the ring main up
  const posts = useMemo(() => {
    const mesh = new THREE.InstancedMesh(
      unitCylinder,
      matMetal,
      16
    );
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const p = new THREE.Vector3();
    const s = new THREE.Vector3(0.12, 0.9, 0.12);
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2 + 0.19;
      p.set(Math.cos(a) * RING_RADIUS, 0.45, Math.sin(a) * RING_RADIUS);
      mesh.setMatrixAt(i, m.compose(p, q, s));
    }
    mesh.instanceMatrix.needsUpdate = true;
    return mesh;
  }, []);

  return (
    <group>
      <mesh geometry={ring.geo} material={ring.mat} />
      {feeders.map((f) => (
        <mesh key={f.id} geometry={f.geo} material={f.mat} />
      ))}
      <primitive object={posts} />
    </group>
  );
}
