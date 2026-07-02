import { create } from "zustand";
import type { DistrictId } from "@/lib/districts";
import { TIER_ORDER, type QualityTier } from "@/lib/quality";

/**
 * The experience state machine. Changes only on discrete events —
 * per-frame values (camera, pointer, shader time) live outside React.
 *
 *   boot ── begin() ──► intro ── finishIntro()/skip ──► explore
 */

export type Phase = "boot" | "intro" | "explore";

interface ExperienceState {
  phase: Phase;
  /** −1 outside the intro; 0..3 selects the overlay title card */
  introStep: number;
  activeDistrict: DistrictId | null;
  panelOpen: boolean;
  transitioning: boolean;
  visited: DistrictId[];
  quality: QualityTier;
  qualityLocked: boolean;
  soundOn: boolean;
  musicOn: boolean;
  volume: number;
  helpOpen: boolean;
  reducedMotion: boolean;

  begin: () => void;
  setIntroStep: (step: number) => void;
  finishIntro: () => void;
  focusDistrict: (id: DistrictId | null) => void;
  arrive: (id: DistrictId) => void;
  closePanel: () => void;
  setTransitioning: (v: boolean) => void;
  setQuality: (tier: QualityTier, locked?: boolean) => void;
  degradeQuality: () => void;
  setSoundOn: (v: boolean) => void;
  setMusicOn: (v: boolean) => void;
  setVolume: (v: number) => void;
  setHelpOpen: (v: boolean) => void;
  setReducedMotion: (v: boolean) => void;
}

export const useExperience = create<ExperienceState>()((set, get) => ({
  phase: "boot",
  introStep: -1,
  activeDistrict: null,
  panelOpen: false,
  transitioning: false,
  visited: [],
  quality: "balanced",
  qualityLocked: false,
  soundOn: true,
  musicOn: true,
  volume: 0.7,
  helpOpen: false,
  reducedMotion: false,

  begin: () => set({ phase: "intro", introStep: 0 }),

  setIntroStep: (introStep) => set({ introStep }),

  finishIntro: () => set({ phase: "explore", introStep: -1 }),

  focusDistrict: (id) => {
    const { activeDistrict, transitioning } = get();
    if (id !== null && id === activeDistrict && !transitioning) {
      // re-selecting the current district just reopens its panel
      set({ panelOpen: true, helpOpen: false });
      return;
    }
    set({ activeDistrict: id, panelOpen: false, helpOpen: false });
  },

  arrive: (id) =>
    set((s) => ({
      panelOpen: true,
      visited: s.visited.includes(id) ? s.visited : [...s.visited, id],
    })),

  closePanel: () => set({ panelOpen: false }),

  setTransitioning: (transitioning) => set({ transitioning }),

  setQuality: (quality, locked = true) =>
    set({ quality, qualityLocked: locked }),

  degradeQuality: () => {
    const { quality, qualityLocked } = get();
    if (qualityLocked) return;
    const i = TIER_ORDER.indexOf(quality);
    if (i > 0) set({ quality: TIER_ORDER[i - 1] });
  },

  setSoundOn: (soundOn) => set({ soundOn }),
  setMusicOn: (musicOn) => set({ musicOn }),
  setVolume: (volume) => set({ volume }),
  setHelpOpen: (helpOpen) => set({ helpOpen }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
}));
