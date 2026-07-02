"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { getGlowTexture } from "@/lib/textures";
import { sharedTime } from "@/lib/uniforms";
import { beamFragment, beamVertex } from "@/shaders";

/**
 * Shared geometry + material pools. Every district builds from these unit
 * primitives (scaled per-mesh), so the whole city costs a handful of GPU
 * buffers and a short list of shader programs.
 */

/* ── unit geometries ─────────────────────────────────────────── */

export const unitBox = new THREE.BoxGeometry(1, 1, 1);
export const unitCylinder = new THREE.CylinderGeometry(1, 1, 1, 24);
export const unitSphere = new THREE.SphereGeometry(1, 28, 20);
export const unitCone = new THREE.ConeGeometry(1, 1, 24, 1, true);
export const unitOcta = new THREE.OctahedronGeometry(1, 0);

/* ── shared PBR materials ────────────────────────────────────── */

export const matDark = new THREE.MeshStandardMaterial({
  color: "#0d1420",
  metalness: 0.85,
  roughness: 0.42,
});

export const matMetal = new THREE.MeshStandardMaterial({
  color: "#1c2a3d",
  metalness: 0.92,
  roughness: 0.3,
  envMapIntensity: 1.1,
});

export const matMetalLight = new THREE.MeshStandardMaterial({
  color: "#43586f",
  metalness: 0.88,
  roughness: 0.24,
  envMapIntensity: 1.25,
});

export const matGlass = new THREE.MeshPhysicalMaterial({
  color: "#9fd8ff",
  metalness: 0.1,
  roughness: 0.08,
  transparent: true,
  opacity: 0.16,
  envMapIntensity: 1.4,
  side: THREE.DoubleSide,
  depthWrite: false,
});

/* ── cached accent materials ─────────────────────────────────── */

const emissiveCache = new Map<string, THREE.MeshStandardMaterial>();

/** Bloom-feeding emissive surface (dark body, glowing color). */
export function emissiveMat(
  color: string,
  intensity = 2.2
): THREE.MeshStandardMaterial {
  const key = `${color}:${intensity}`;
  let mat = emissiveCache.get(key);
  if (!mat) {
    mat = new THREE.MeshStandardMaterial({
      color: "#02050a",
      emissive: new THREE.Color(color),
      emissiveIntensity: intensity,
      metalness: 0.2,
      roughness: 0.4,
    });
    emissiveCache.set(key, mat);
  }
  return mat;
}

const spriteCache = new Map<string, THREE.SpriteMaterial>();

function glowSpriteMat(color: string, opacity: number): THREE.SpriteMaterial {
  const key = `${color}:${opacity}`;
  let mat = spriteCache.get(key);
  if (!mat) {
    mat = new THREE.SpriteMaterial({
      map: getGlowTexture(),
      color: new THREE.Color(color),
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    spriteCache.set(key, mat);
  }
  return mat;
}

/* ── reusable set pieces ─────────────────────────────────────── */

/** Additive halo — the cheap trick behind every lamp in the city. */
export function GlowSprite({
  color,
  position,
  scale = 3,
  opacity = 0.5,
}: {
  color: string;
  position: [number, number, number];
  scale?: number;
  opacity?: number;
}) {
  const mat = useMemo(() => glowSpriteMat(color, opacity), [color, opacity]);
  return <sprite position={position} scale={[scale, scale, 1]} material={mat} />;
}

/** Circular facility base: dark deck + glowing accent rim. */
export function Platform({
  radius,
  color,
  height = 0.6,
}: {
  radius: number;
  color: string;
  height?: number;
}) {
  const rim = useMemo(
    () => new THREE.TorusGeometry(radius * 0.94, 0.09, 10, 64),
    [radius]
  );
  return (
    <group>
      <mesh
        geometry={unitCylinder}
        material={matDark}
        scale={[radius, height, radius]}
        position={[0, height / 2, 0]}
        receiveShadow
      />
      <mesh
        geometry={rim}
        material={emissiveMat(color, 1.6)}
        rotation-x={-Math.PI / 2}
        position={[0, height + 0.03, 0]}
      />
    </group>
  );
}

/** Volumetric-look light shaft (additive open cone). */
export function Beam({
  color,
  position,
  height = 30,
  radius = 2.4,
  strength = 0.16,
}: {
  color: string;
  position: [number, number, number];
  height?: number;
  radius?: number;
  strength?: number;
}) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: beamVertex,
        fragmentShader: beamFragment,
        uniforms: {
          uTime: sharedTime,
          uColor: { value: new THREE.Color(color) },
          uStrength: { value: strength },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [color, strength]
  );

  return (
    <mesh
      geometry={unitCone}
      material={material}
      position={[position[0], position[1] + height / 2, position[2]]}
      scale={[radius, height, radius]}
    />
  );
}
