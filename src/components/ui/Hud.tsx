"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  FileText,
  HelpCircle,
  Music,
  Volume2,
  VolumeX,
} from "lucide-react";
import { audio } from "@/lib/audio";
import { DISTRICT_MAP } from "@/lib/districts";
import { TIER_LABEL, TIER_ORDER } from "@/lib/quality";
import { useExperience } from "@/store/experience";
import { profile } from "@/content/portfolio";
import { NavigationDock } from "@/components/ui/NavigationDock";

/**
 * The persistent heads-up display: identity plate, system controls,
 * cinematic letterbox bars, the location plate, and the district dock.
 */
export function Hud() {
  const phase = useExperience((s) => s.phase);
  const transitioning = useExperience((s) => s.transitioning);
  const active = useExperience((s) => s.activeDistrict);
  const soundOn = useExperience((s) => s.soundOn);
  const musicOn = useExperience((s) => s.musicOn);
  const volume = useExperience((s) => s.volume);
  const quality = useExperience((s) => s.quality);
  const visitedCount = useExperience((s) => s.visited.length);

  const letterbox = phase === "intro" || transitioning;
  const showHud = phase === "explore";
  const district = active ? DISTRICT_MAP[active] : null;

  const cycleQuality = () => {
    const i = TIER_ORDER.indexOf(quality);
    const next = TIER_ORDER[(i + 1) % TIER_ORDER.length];
    useExperience.getState().setQuality(next, true);
    audio.sfx("click");
  };

  return (
    <>
      {/* cinematic letterbox */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 z-30 bg-black"
        animate={{ height: letterbox ? "7.5vh" : "0vh" }}
        transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
      />
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 bg-black"
        animate={{ height: letterbox ? "7.5vh" : "0vh" }}
        transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
      />

      <AnimatePresence>
        {showHud && (
          <motion.div
            className="absolute inset-0 z-40 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1.2, delay: 0.3 } }}
            exit={{ opacity: 0 }}
          >
            {/* ── top bar ── */}
            <header className="pointer-events-auto absolute inset-x-0 top-0 flex items-start justify-between p-4 sm:p-6">
              {/* identity plate */}
              <button
                onClick={() => {
                  audio.sfx("click");
                  useExperience.getState().focusDistrict(null);
                }}
                className="glass-soft hud-corners group flex items-center gap-3 px-4 py-2.5 no-select"
                title="Return to overview"
              >
                <svg viewBox="0 0 48 48" className="h-7 w-7">
                  <polygon
                    points="24,4 41,14 41,34 24,44 7,34 7,14"
                    fill="none"
                    stroke="#67e8f9"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 14 V22 L12 34 a2 2 0 0 0 1.8 3 H34.2 a2 2 0 0 0 1.8 -3 L30 22 V14"
                    fill="none"
                    stroke="#67e8f9"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-left leading-tight">
                  <span className="font-display block text-[11px] font-bold tracking-[0.28em] text-white group-hover:text-primary transition-colors">
                    {profile.name.toUpperCase()}
                  </span>
                  <span className="block text-[9px] uppercase tracking-[0.34em] text-dim">
                    Process Nexus · {visitedCount}/8 surveyed
                  </span>
                </span>
              </button>

              {/* system controls */}
              <div className="flex items-center gap-2">
                <div className="glass-soft hidden items-center gap-2 px-3 py-2 sm:flex">
                  <button
                    onClick={() => {
                      const s = useExperience.getState();
                      s.setSoundOn(!soundOn);
                      audio.sfx("click");
                    }}
                    className="text-primary/80 transition-colors hover:text-white"
                    title={soundOn ? "Mute sound effects (M)" : "Unmute sound effects (M)"}
                  >
                    {soundOn ? <Volume2 size={15} /> : <VolumeX size={15} />}
                  </button>
                  <button
                    onClick={() => {
                      const s = useExperience.getState();
                      s.setMusicOn(!musicOn);
                      audio.sfx("click");
                    }}
                    className={`transition-colors hover:text-white ${musicOn ? "text-primary/80" : "text-faint"}`}
                    title={musicOn ? "Stop the score" : "Play the score"}
                  >
                    <Music size={15} />
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={volume}
                    onChange={(e) =>
                      useExperience.getState().setVolume(Number(e.target.value))
                    }
                    className="vol w-16"
                    title="Master volume"
                  />
                </div>

                <button
                  onClick={cycleQuality}
                  className="btn-hud px-3 py-2 text-[10px]"
                  title="Render quality (auto-degrades if FPS drops)"
                >
                  {TIER_LABEL[quality]}
                </button>
                <button
                  onClick={() => {
                    audio.sfx("click");
                    useExperience.getState().setHelpOpen(true);
                  }}
                  className="btn-hud p-2"
                  title="Controls (H)"
                >
                  <HelpCircle size={15} />
                </button>
                <Link
                  href="/resume/"
                  className="btn-hud hidden p-2 sm:inline-flex"
                  title="2D dossier / printable CV"
                >
                  <FileText size={15} />
                </Link>
              </div>
            </header>

            {/* ── location plate ── */}
            <AnimatePresence mode="wait">
              {district && (
                <motion.div
                  key={district.id}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute bottom-24 left-4 no-select sm:bottom-28 sm:left-6"
                >
                  <p
                    className="font-display text-[44px] font-black leading-none tracking-tight opacity-15 sm:text-[72px]"
                    style={{ color: district.color }}
                  >
                    {String(district.index + 1).padStart(2, "0")}
                  </p>
                  <div className="-mt-3 sm:-mt-5">
                    <p className="font-display text-sm font-bold tracking-[0.22em] text-white sm:text-lg">
                      {district.name.toUpperCase()}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-dim">
                      <span style={{ color: district.color }}>{district.code}</span>
                      &nbsp;— {district.tagline}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── hint (until first survey) ── */}
            {visitedCount === 0 && !active && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 2 } }}
                className="absolute bottom-24 right-6 hidden text-right text-[10px] uppercase leading-relaxed tracking-[0.3em] text-faint sm:block"
              >
                Scroll to tour the ring
                <br />
                or select a beacon
              </motion.p>
            )}

            {/* ── district dock ── */}
            <NavigationDock />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
