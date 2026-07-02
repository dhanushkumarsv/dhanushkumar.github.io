"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { DISTRICTS } from "@/lib/districts";
import { pointerState } from "@/lib/pointer";
import { sharedCamRight, sharedCamUp, sharedTime } from "@/lib/uniforms";
import { Ground } from "@/components/world/Ground";
import { SkyDome } from "@/components/world/SkyDome";
import { CityScape } from "@/components/world/CityScape";
import { NexusSpire } from "@/components/world/NexusSpire";
import { PipeNetwork } from "@/components/world/PipeNetwork";
import { AmbientParticles } from "@/components/world/AmbientParticles";
import { DistrictBeacon } from "@/components/world/elements/DistrictBeacon";
import { ResearchCenter } from "@/components/world/districts/ResearchCenter";
import { AspenLab } from "@/components/world/districts/AspenLab";
import { HydrogenPlant } from "@/components/world/districts/HydrogenPlant";
import { MembraneFacility } from "@/components/world/districts/MembraneFacility";
import { DistillationTower } from "@/components/world/districts/DistillationTower";
import { InnovationLibrary } from "@/components/world/districts/InnovationLibrary";
import { ControlRoom } from "@/components/world/districts/ControlRoom";
import { CommsHub } from "@/components/world/districts/CommsHub";

const midPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -4);
const raycaster = new THREE.Raycaster();
const hit = new THREE.Vector3();

/**
 * Assembles the world and drives the three shared uniforms that animate
 * every shader in the city (time + camera basis for billboards), plus the
 * pointer's world position for particle repulsion.
 */
export function World() {
  const districts = useMemo(
    () => ({
      research: ResearchCenter,
      aspen: AspenLab,
      hydrogen: HydrogenPlant,
      membrane: MembraneFacility,
      distillation: DistillationTower,
      library: InnovationLibrary,
      control: ControlRoom,
      comms: CommsHub,
    }),
    []
  );

  useFrame(({ clock, camera }) => {
    sharedTime.value = clock.getElapsedTime();

    const e = camera.matrixWorld.elements;
    sharedCamRight.value.set(e[0], e[1], e[2]).normalize();
    sharedCamUp.value.set(e[4], e[5], e[6]).normalize();

    raycaster.setFromCamera(pointerState.ndc, camera);
    if (raycaster.ray.intersectPlane(midPlane, hit)) {
      pointerState.world.lerp(hit, 0.2);
    }
  });

  return (
    <group>
      <SkyDome />
      <Ground />
      <CityScape />
      <NexusSpire />
      <PipeNetwork />
      <AmbientParticles />

      {DISTRICTS.map((def) => {
        const Facility = districts[def.id];
        return (
          <group key={def.id}>
            <group position={def.position}>
              <Facility color={def.color} />
            </group>
            <DistrictBeacon def={def} />
            <pointLight
              position={[def.position[0], 7, def.position[2]]}
              intensity={90}
              distance={34}
              color={def.color}
            />
          </group>
        );
      })}
    </group>
  );
}
