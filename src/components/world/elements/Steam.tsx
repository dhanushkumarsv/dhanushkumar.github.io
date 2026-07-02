"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { QUALITY } from "@/lib/quality";
import { sharedCamRight, sharedCamUp, sharedTime } from "@/lib/uniforms";
import { useExperience } from "@/store/experience";
import { steamFragment, steamVertex } from "@/shaders";

interface SteamProps {
  position: [number, number, number];
  count?: number;
  rise?: number;
  spread?: number;
  size?: number;
  opacity?: number;
  speed?: number;
  color?: string;
}

/**
 * A steam / smoke plume: instanced quads billboarded in the vertex shader,
 * whole life-cycle on the GPU. Costs one draw call per emitter and zero
 * per-frame JS beyond the shared uniforms.
 */
export function Steam({
  position,
  count = 16,
  rise = 7,
  spread = 1.1,
  size = 1.5,
  opacity = 0.32,
  speed = 0.16,
  color = "#cfe4f2",
}: SteamProps) {
  const quality = useExperience((s) => s.quality);
  const mult = QUALITY[quality].steamMult;
  const n = Math.max(4, Math.round(count * mult));

  const geometry = useMemo(() => {
    const plane = new THREE.PlaneGeometry(1, 1);
    const geo = new THREE.InstancedBufferGeometry();
    geo.index = plane.index;
    geo.attributes.position = plane.attributes.position;
    geo.attributes.uv = plane.attributes.uv;
    const rand = new Float32Array(n);
    for (let i = 0; i < n; i++) rand[i] = Math.random();
    geo.setAttribute("aRand", new THREE.InstancedBufferAttribute(rand, 1));
    geo.instanceCount = n;
    return geo;
  }, [n]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: steamVertex,
        fragmentShader: steamFragment,
        uniforms: {
          uTime: sharedTime,
          uCamRight: sharedCamRight,
          uCamUp: sharedCamUp,
          uRise: { value: rise },
          uSpread: { value: spread },
          uSize: { value: size },
          uSpeed: { value: speed },
          uColor: { value: new THREE.Color(color) },
          uOpacity: { value: opacity },
        },
        transparent: true,
        depthWrite: false,
      }),
    [rise, spread, size, speed, color, opacity]
  );

  return (
    <mesh
      geometry={geometry}
      material={material}
      position={position}
      frustumCulled={false}
      renderOrder={10}
    />
  );
}
