"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { updatePointer } from "@/lib/pointer";
import { audio } from "@/lib/audio";
import {
  detectTier,
  prefersReducedMotion,
  supportsWebGL,
} from "@/lib/quality";
import { useExperience } from "@/store/experience";
import { useNavigationControls } from "@/hooks/useNavigationControls";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { IntroOverlay } from "@/components/ui/IntroOverlay";
import { Hud } from "@/components/ui/Hud";
import { SectionPanel } from "@/components/ui/SectionPanel";
import { HelpOverlay } from "@/components/ui/HelpOverlay";
import { CursorGlow } from "@/components/ui/CursorGlow";
import { Fallback } from "@/components/ui/Fallback";

const Scene = dynamic(() => import("@/components/canvas/Scene"), {
  ssr: false,
});

/**
 * Composition root: the WebGL stage below, the HUD above, one store
 * between them. The canvas mounts immediately (hidden behind the boot
 * screen) so shaders compile before the visitor presses ENTER.
 */
export default function ExperienceApp() {
  const canvasZone = useRef<HTMLDivElement>(null);
  const [webgl, setWebgl] = useState<boolean | null>(null);

  useNavigationControls(canvasZone);

  useEffect(() => {
    const store = useExperience.getState();
    setWebgl(supportsWebGL());

    // ?q=performance|balanced|cinematic pins the tier (shareable low-spec link)
    const pinned = new URLSearchParams(window.location.search).get("q");
    if (pinned === "performance" || pinned === "balanced" || pinned === "cinematic") {
      store.setQuality(pinned, true);
    } else {
      store.setQuality(detectTier(), false);
    }
    store.setReducedMotion(prefersReducedMotion());

    const onPointer = (e: PointerEvent) => updatePointer(e);
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => window.removeEventListener("pointermove", onPointer);
  }, []);

  /* keep the audio engine in sync with the store */
  const soundOn = useExperience((s) => s.soundOn);
  const musicOn = useExperience((s) => s.musicOn);
  const volume = useExperience((s) => s.volume);
  useEffect(() => audio.setSoundOn(soundOn), [soundOn]);
  useEffect(() => audio.setMusicOn(musicOn), [musicOn]);
  useEffect(() => audio.setVolume(volume), [volume]);

  if (webgl === false) return <Fallback />;

  return (
    <div className="fixed inset-0 overflow-hidden bg-void">
      {/* WebGL stage — also the wheel/swipe navigation zone */}
      <div ref={canvasZone} className="absolute inset-0">
        {webgl && <Scene />}
      </div>

      {/* DOM layers */}
      <IntroOverlay />
      <Hud />
      <SectionPanel />
      <HelpOverlay />
      <LoadingScreen />
      <CursorGlow />
      <div className="scanlines" aria-hidden />
    </div>
  );
}
