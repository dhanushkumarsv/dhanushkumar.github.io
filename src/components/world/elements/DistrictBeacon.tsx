"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Html, useCursor } from "@react-three/drei";
import * as THREE from "three";
import type { DistrictDef } from "@/lib/districts";
import { audio } from "@/lib/audio";
import { useExperience } from "@/store/experience";
import {
  GlowSprite,
  emissiveMat,
  unitOcta,
} from "@/components/world/elements/common";

const ringGeo = new THREE.TorusGeometry(1.15, 0.05, 10, 48);
const hitGeo = new THREE.CylinderGeometry(2.4, 2.4, 4, 12);
const hitMat = new THREE.MeshBasicMaterial({ visible: false });

/**
 * The clickable marker floating above each facility: a spinning core in
 * counter-rotating rings, with a DOM label that names the district.
 */
export function DistrictBeacon({ def }: { def: DistrictDef }) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const active = useExperience((s) => s.activeDistrict === def.id);
  const phase = useExperience((s) => s.phase);
  const visited = useExperience((s) => s.visited.includes(def.id));

  const core = useRef<THREE.Mesh>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const glowScale = useRef(1);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    if (core.current) {
      core.current.rotation.y = t * 0.8;
      core.current.rotation.x = Math.sin(t * 0.6) * 0.3;
    }
    if (ringA.current) ringA.current.rotation.z = t * 0.7;
    if (ringB.current) ringB.current.rotation.z = -t * 0.5;

    const target = hovered || active ? 1.35 : 1;
    glowScale.current += (target - glowScale.current) * Math.min(1, delta * 8);
    if (core.current) {
      const s = 0.5 * glowScale.current;
      core.current.scale.setScalar(s);
    }
  });

  if (phase !== "explore") return null;

  return (
    <group position={[def.position[0], def.beaconHeight, def.position[2]]}>
      <Float speed={2.2} rotationIntensity={0} floatIntensity={1.4}>
        <mesh ref={core} geometry={unitOcta} material={emissiveMat(def.color, 2.6)} />
        <mesh
          ref={ringA}
          geometry={ringGeo}
          material={emissiveMat(def.color, 1.4)}
          rotation-x={Math.PI / 2.4}
        />
        <mesh
          ref={ringB}
          geometry={ringGeo}
          material={emissiveMat(def.color, 0.9)}
          rotation-x={-Math.PI / 2.6}
          scale={0.8}
        />
        <GlowSprite
          color={def.color}
          position={[0, 0, 0]}
          scale={hovered || active ? 7 : 5}
          opacity={0.5}
        />

        <Html
          center
          position={[0, -2.3, 0]}
          distanceFactor={26}
          zIndexRange={[30, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div
            className="no-select whitespace-nowrap border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] transition-all duration-300"
            style={{
              fontFamily: "var(--font-tech)",
              color: hovered || active ? "#eafcff" : "rgba(200,230,245,0.75)",
              borderColor: `${def.color}${hovered || active ? "aa" : "44"}`,
              background: "rgba(5,10,20,0.62)",
              backdropFilter: "blur(6px)",
              boxShadow:
                hovered || active ? `0 0 24px ${def.color}66` : "none",
            }}
          >
            <span style={{ color: def.color }}>
              {String(def.index + 1).padStart(2, "0")}
            </span>
            &nbsp;·&nbsp;{def.name}
            {visited && (
              <span style={{ color: def.color, marginLeft: 6 }}>✓</span>
            )}
          </div>
        </Html>
      </Float>

      {/* generous invisible hit volume */}
      <mesh
        geometry={hitGeo}
        material={hitMat}
        onClick={(e) => {
          e.stopPropagation();
          audio.sfx("click");
          useExperience.getState().focusDistrict(def.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          audio.sfx("hover");
        }}
        onPointerOut={() => setHovered(false)}
      />
    </group>
  );
}
