"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { getWindowsTexture } from "@/lib/textures";
import { QUALITY } from "@/lib/quality";
import { useExperience } from "@/store/experience";
import { GlowSprite } from "@/components/world/elements/common";

/**
 * The outer metropolis: an instanced ring of window-lit towers between the
 * facility ring and the fog line, plus a handful of mega-towers silhouetted
 * on the horizon. Two draw calls for the whole skyline.
 */

interface TowerField {
  matrices: THREE.Matrix4[];
  lights: [number, number, number][];
}

function buildField(count: number): TowerField {
  const rng = mulberry32(20450701);
  const matrices: THREE.Matrix4[] = [];
  const lights: [number, number, number][] = [];
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const p = new THREE.Vector3();
  const s = new THREE.Vector3();

  for (let i = 0; i < count; i++) {
    const angle = rng() * Math.PI * 2;
    const radius = 52 + rng() * 68; // keep clear of the 36 m facility ring
    const far = (radius - 52) / 68;
    const h = 7 + rng() * 22 + far * 22;
    const w = 3 + rng() * 4.5;
    const d = 3 + rng() * 4.5;

    p.set(Math.cos(angle) * radius, h / 2, Math.sin(angle) * radius);
    e.set(0, rng() * Math.PI, 0);
    q.setFromEuler(e);
    s.set(w, h, d);
    matrices.push(m.compose(p, q, s).clone());

    // aviation lights on the tallest towers
    if (h > 34 && lights.length < 10) {
      lights.push([p.x, h + 0.8, p.z]);
    }
  }
  return { matrices, lights };
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const MEGA: { angle: number; radius: number; h: number; w: number }[] = [
  { angle: 0.4, radius: 138, h: 74, w: 12 },
  { angle: 1.3, radius: 150, h: 92, w: 15 },
  { angle: 2.2, radius: 132, h: 66, w: 10 },
  { angle: 3.1, radius: 146, h: 84, w: 13 },
  { angle: 4.0, radius: 136, h: 70, w: 11 },
  { angle: 4.9, radius: 152, h: 96, w: 16 },
  { angle: 5.7, radius: 140, h: 78, w: 12 },
];

export function CityScape() {
  const quality = useExperience((s) => s.quality);
  const count = QUALITY[quality].cityCount;

  const field = useMemo(() => buildField(count), [count]);

  const towers = useMemo(() => {
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshStandardMaterial({
      color: "#0c1523",
      metalness: 0.75,
      roughness: 0.5,
      emissive: "#9fdcff",
      emissiveIntensity: 0.5,
      emissiveMap: getWindowsTexture(),
    });
    const mesh = new THREE.InstancedMesh(geo, mat, field.matrices.length);
    field.matrices.forEach((m, i) => mesh.setMatrixAt(i, m));
    mesh.instanceMatrix.needsUpdate = true;
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    return mesh;
  }, [field]);

  const mega = useMemo(() => {
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshStandardMaterial({
      color: "#070d17",
      metalness: 0.6,
      roughness: 0.7,
      emissive: "#4a7ea8",
      emissiveIntensity: 0.22,
      emissiveMap: getWindowsTexture(),
    });
    const mesh = new THREE.InstancedMesh(geo, mat, MEGA.length);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const p = new THREE.Vector3();
    const s = new THREE.Vector3();
    MEGA.forEach((t, i) => {
      p.set(Math.cos(t.angle) * t.radius, t.h / 2, Math.sin(t.angle) * t.radius);
      s.set(t.w, t.h, t.w);
      mesh.setMatrixAt(i, m.compose(p, q, s));
    });
    mesh.instanceMatrix.needsUpdate = true;
    return mesh;
  }, []);

  return (
    <group>
      <primitive object={towers} />
      <primitive object={mega} />
      {field.lights.map((pos, i) => (
        <GlowSprite
          key={i}
          color={i % 3 === 0 ? "#ff5f6d" : "#67e8f9"}
          position={pos}
          scale={2.4}
          opacity={0.55}
        />
      ))}
      {MEGA.map((t, i) => (
        <GlowSprite
          key={`m${i}`}
          color="#ff5f6d"
          position={[
            Math.cos(t.angle) * t.radius,
            t.h + 1.2,
            Math.sin(t.angle) * t.radius,
          ]}
          scale={3}
          opacity={0.5}
        />
      ))}
    </group>
  );
}
