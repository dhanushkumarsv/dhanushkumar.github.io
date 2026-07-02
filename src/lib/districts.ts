/**
 * World layout: eight facilities on a 36 m ring around the Nexus Spire,
 * each with a hand-tuned cinematic camera shot, plus the intro flight path.
 *
 * Coordinate system: Y up, ground at y=0, world units ≈ meters.
 */

export type DistrictId =
  | "research"
  | "aspen"
  | "hydrogen"
  | "membrane"
  | "distillation"
  | "library"
  | "control"
  | "comms";

export type Vec3 = [number, number, number];

export interface CameraShot {
  position: Vec3;
  target: Vec3;
  fov: number;
}

export interface DistrictDef {
  id: DistrictId;
  index: number;
  code: string;
  name: string;
  tagline: string;
  color: string;
  position: Vec3;
  beaconHeight: number;
  camera: CameraShot;
}

export const RING_RADIUS = 36;

function polar(deg: number, r = RING_RADIUS): Vec3 {
  const a = (deg * Math.PI) / 180;
  return [Math.cos(a) * r, 0, Math.sin(a) * r];
}

interface ShotOpts {
  dist?: number; // how far outside the district the camera sits
  height?: number;
  side?: number; // lateral (tangential) offset — sign alternates for variety
  targetY?: number;
  fov?: number;
}

/** Compose a shot radially: outward from ring center, banked to one side. */
function shot(pos: Vec3, opts: ShotOpts = {}): CameraShot {
  const {
    dist = 17,
    height = 8.5,
    side = 6,
    targetY = 5,
    fov = 50,
  } = opts;
  const len = Math.hypot(pos[0], pos[2]) || 1;
  const ox = pos[0] / len;
  const oz = pos[2] / len;
  // tangent (perpendicular in the ground plane)
  const tx = -oz;
  const tz = ox;
  return {
    position: [
      pos[0] + ox * dist + tx * side,
      height,
      pos[2] + oz * dist + tz * side,
    ],
    target: [pos[0], targetY, pos[2]],
    fov,
  };
}

function district(
  id: DistrictId,
  index: number,
  name: string,
  tagline: string,
  color: string,
  angleDeg: number,
  beaconHeight: number,
  shotOpts: ShotOpts
): DistrictDef {
  const position = polar(angleDeg);
  return {
    id,
    index,
    code: `${id.slice(0, 2).toUpperCase()}-0${index + 1}`,
    name,
    tagline,
    color,
    position,
    beaconHeight,
    camera: shot(position, shotOpts),
  };
}

export const DISTRICTS: DistrictDef[] = [
  district(
    "research",
    0,
    "Research Center",
    "Hybrid desalination & recovery science",
    "#22d3ee",
    -20,
    13,
    { dist: 16, height: 7.5, side: 6.5, targetY: 4.5, fov: 50 }
  ),
  district(
    "aspen",
    1,
    "Aspen Plus Laboratory",
    "Process simulation & flowsheeting",
    "#a78bfa",
    25,
    15,
    { dist: 17, height: 9, side: -7, targetY: 6, fov: 50 }
  ),
  district(
    "hydrogen",
    2,
    "Hydrogen Energy Plant",
    "Photocatalytic H₂ & supply chains",
    "#34d399",
    70,
    13,
    { dist: 18, height: 7, side: -6, targetY: 4, fov: 52 }
  ),
  district(
    "membrane",
    3,
    "Membrane Distillation Facility",
    "VMD · MED water purification",
    "#38bdf8",
    115,
    10,
    { dist: 15, height: 6.5, side: 6, targetY: 3.5, fov: 46 }
  ),
  district(
    "distillation",
    4,
    "Distillation Tower",
    "Technical capability stack",
    "#fbbf24",
    160,
    24,
    { dist: 22, height: 12, side: -8, targetY: 9, fov: 55 }
  ),
  district(
    "library",
    5,
    "Innovation Library",
    "Publications · education · milestones",
    "#fb7185",
    205,
    19,
    { dist: 17, height: 10, side: 7, targetY: 7, fov: 50 }
  ),
  district(
    "control",
    6,
    "Control Room",
    "Career dossier & downloads",
    "#fb923c",
    250,
    11,
    { dist: 16, height: 7, side: 7, targetY: 4, fov: 50 }
  ),
  district(
    "comms",
    7,
    "Communication Hub",
    "Open a channel",
    "#e879f9",
    295,
    21,
    { dist: 18, height: 9, side: -6.5, targetY: 8, fov: 50 }
  ),
];

export const DISTRICT_MAP: Record<DistrictId, DistrictDef> = Object.fromEntries(
  DISTRICTS.map((d) => [d.id, d])
) as Record<DistrictId, DistrictDef>;

export const DISTRICT_ORDER: DistrictId[] = DISTRICTS.map((d) => d.id);

/* ── Cinematic shots ─────────────────────────────────────────── */

export const OVERVIEW_SHOT: CameraShot = {
  position: [0, 30, 80],
  target: [0, 7, 0],
  fov: 52,
};

/** Where the camera sits during boot (also the intro start pose). */
export const START_SHOT: CameraShot = {
  position: [0, 170, 300],
  target: [0, 30, 0],
  fov: 60,
};

export interface IntroSegment {
  shot: CameraShot;
  duration: number;
  /** overlay step revealed as this segment begins */
  step: number;
}

export const INTRO_SEGMENTS: IntroSegment[] = [
  {
    shot: { position: [0, 80, 170], target: [0, 22, 0], fov: 56 },
    duration: 4.0,
    step: 0,
  },
  {
    shot: { position: [95, 26, 70], target: [0, 10, 0], fov: 52 },
    duration: 4.4,
    step: 1,
  },
  {
    shot: { position: [-55, 15, 105], target: [0, 8, 0], fov: 52 },
    duration: 4.2,
    step: 2,
  },
  {
    shot: OVERVIEW_SHOT,
    duration: 3.0,
    step: 3,
  },
];
