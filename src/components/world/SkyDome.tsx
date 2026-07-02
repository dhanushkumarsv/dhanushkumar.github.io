"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { sharedTime } from "@/lib/uniforms";
import { skyFragment, skyVertex } from "@/shaders";

const domeGeo = new THREE.SphereGeometry(420, 48, 32);

/**
 * The night: gradient void, twinkling procedural starfield, drifting
 * aurora ribbons and a cold moon — one shader, one draw call.
 */
export function SkyDome() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: skyVertex,
        fragmentShader: skyFragment,
        uniforms: { uTime: sharedTime },
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
      }),
    []
  );

  return <mesh geometry={domeGeo} material={material} frustumCulled={false} />;
}
