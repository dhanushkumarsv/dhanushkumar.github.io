"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { audio } from "@/lib/audio";
import { useExperience } from "@/store/experience";
import { profile } from "@/content/portfolio";

const BOOT_LINES = [
  "INITIALIZING NEXUS KERNEL",
  "COMPILING SHADERS",
  "PRESSURIZING PIPELINES",
  "CHARGING ELECTROLYZERS",
  "ALIGNING MEMBRANE MODULES",
  "CALIBRATING DISTILLATION TRAYS",
  "SYNCING CONTROL ROOM",
  "ALL SYSTEMS NOMINAL",
];

/**
 * The boot sequence. The 3D scene is already warming up behind this
 * opaque screen; the ENTER press doubles as the WebAudio unlock.
 */
export function LoadingScreen() {
  const phase = useExperience((s) => s.phase);
  const [progress, setProgress] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    if (phase !== "boot") return;
    const start = performance.now();
    const DURATION = 2600;
    let raf = 0;
    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      setLineIndex(Math.min(BOOT_LINES.length - 1, Math.floor(t * BOOT_LINES.length)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  const ready = progress >= 100;

  const enter = () => {
    audio.init();
    audio.sfx("begin");
    const s = useExperience.getState();
    audio.setMusicOn(s.musicOn);
    audio.setVolume(s.volume);
    s.begin();
  };

  return (
    <AnimatePresence>
      {phase === "boot" && (
        <motion.div
          className="absolute inset-0 z-60 flex flex-col items-center justify-center bg-void"
          exit={{ opacity: 0, transition: { duration: 1.1, ease: "easeInOut" } }}
        >
          {/* reactor-core loader */}
          <div className="relative mb-10 h-36 w-36">
            <div className="spin-slow absolute inset-0 rounded-full border border-primary/25 border-t-primary/90" />
            <div className="spin-slower absolute inset-3 rounded-full border border-primary/15 border-b-primary/70" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 48 48" className="h-14 w-14 boot-flicker">
                {/* hex flask mark */}
                <polygon
                  points="24,4 41,14 41,34 24,44 7,34 7,14"
                  fill="none"
                  stroke="#67e8f9"
                  strokeWidth="1.6"
                />
                <path
                  d="M18 14 V22 L12 34 a2 2 0 0 0 1.8 3 H34.2 a2 2 0 0 0 1.8 -3 L30 22 V14"
                  fill="none"
                  stroke="#67e8f9"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <line x1="15" y1="14" x2="33" y2="14" stroke="#67e8f9" strokeWidth="1.6" />
                <circle cx="21" cy="30" r="1.4" fill="#67e8f9" />
                <circle cx="27" cy="27" r="1" fill="#67e8f9" />
              </svg>
            </div>
          </div>

          <h1
            className="font-display mb-2 text-center text-xl font-bold tracking-[0.42em] text-white text-glow sm:text-2xl"
            style={{ paddingLeft: "0.42em" }}
          >
            THE PROCESS NEXUS
          </h1>
          <p className="mb-10 text-center text-[11px] uppercase tracking-[0.5em] text-dim">
            {profile.name}
          </p>

          {/* progress */}
          <div className="w-72 max-w-[80vw] sm:w-96">
            <div className="mb-2 flex items-baseline justify-between text-[10px] uppercase tracking-[0.3em]">
              <span className="text-primary/80 caret">{BOOT_LINES[lineIndex]}</span>
              <span className="font-display text-primary">{progress}%</span>
            </div>
            <div className="h-px w-full bg-line">
              <div
                className="h-px bg-primary shadow-[0_0_12px_#67e8f9] transition-[width] duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* enter */}
          <div className="mt-12 flex h-24 flex-col items-center justify-start gap-5">
            <AnimatePresence>
              {ready && (
                <motion.button
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  onClick={enter}
                  className="btn-hud hud-corners px-10 py-3.5 text-sm"
                >
                  Enter the Nexus
                </motion.button>
              )}
            </AnimatePresence>
            {ready && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-6 text-[10px] uppercase tracking-[0.25em] text-faint"
              >
                <span>◦ Sound recommended</span>
                <Link
                  href="/resume/"
                  className="underline decoration-primary/40 underline-offset-4 transition-colors hover:text-dim"
                >
                  2D dossier instead
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
