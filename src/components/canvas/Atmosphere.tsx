"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { QUALITY } from "@/lib/quality";
import { useExperience } from "@/store/experience";

/**
 * Global light rig + a procedural HDR environment (drei renders the
 * Lightformers into a cubemap once — no external HDR downloads) so
 * metals and glass pick up believable reflections.
 */
export function Atmosphere() {
  const quality = useExperience((s) => s.quality);
  const q = QUALITY[quality];
  const shadowSize = q.shadows || 1024;

  return (
    <>
      <ambientLight intensity={0.34} color="#31435e" />
      <hemisphereLight args={["#1f3050", "#05070c", 0.5]} />

      {/* moonlight key */}
      <directionalLight
        position={[60, 90, -40]}
        intensity={1.15}
        color="#8fb8ff"
        castShadow={q.shadows > 0}
        shadow-mapSize={[shadowSize, shadowSize]}
        shadow-camera-left={-75}
        shadow-camera-right={75}
        shadow-camera-top={75}
        shadow-camera-bottom={-75}
        shadow-camera-near={20}
        shadow-camera-far={240}
        shadow-bias={-0.0004}
      />

      <Environment frames={1} resolution={96}>
        {/* cool zenith sheet */}
        <Lightformer
          intensity={1.6}
          color="#3f7ea8"
          position={[0, 60, -40]}
          rotation-x={Math.PI / 2}
          scale={[100, 60, 1]}
        />
        {/* horizon strips — give tanks and pipes their long highlights */}
        <Lightformer
          intensity={1.4}
          color="#67e8f9"
          position={[50, 8, 20]}
          rotation-y={-Math.PI / 2}
          scale={[60, 6, 1]}
        />
        <Lightformer
          intensity={1.0}
          color="#274b7a"
          position={[-55, 14, -10]}
          rotation-y={Math.PI / 2}
          scale={[70, 10, 1]}
        />
        {/* faint magenta bounce from the comms quarter */}
        <Lightformer
          intensity={0.7}
          color="#e879f9"
          position={[10, 6, -55]}
          scale={[40, 8, 1]}
        />
        {/* ground bounce */}
        <Lightformer
          intensity={0.5}
          color="#0e2233"
          position={[0, -20, 0]}
          rotation-x={-Math.PI / 2}
          scale={[120, 120, 1]}
        />
      </Environment>
    </>
  );
}
