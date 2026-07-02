"use client";

import { AnimatePresence, motion } from "framer-motion";
import { audio } from "@/lib/audio";
import { useExperience } from "@/store/experience";
import { profile } from "@/content/portfolio";

const CARDS = [
  {
    kicker: "PORTFOLIO TRANSMISSION // 2045",
    title: profile.name.toUpperCase(),
    sub: "PROCESS ENGINEER · CHEMICAL ENGINEERING",
  },
  {
    kicker: "DESTINATION",
    title: "THE PROCESS NEXUS",
    sub: "A LIVING INDUSTRIAL WORLD OF RESEARCH & INNOVATION",
  },
  {
    kicker: "SURVEY",
    title: "8 FACILITIES · ONE ENGINEER",
    sub: "SIMULATION — DESALINATION — HYDROGEN — OPTIMIZATION",
  },
];

/**
 * Title cards choreographed to the intro flight, framed by letterbox
 * bars. Step 3 (the settle) shows nothing — the world speaks.
 */
export function IntroOverlay() {
  const phase = useExperience((s) => s.phase);
  const step = useExperience((s) => s.introStep);

  const card = phase === "intro" && step >= 0 && step < 3 ? CARDS[step] : null;

  return (
    <AnimatePresence>
      {phase === "intro" && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-40"
          exit={{ opacity: 0, transition: { duration: 0.8 } }}
        >
          {/* title cards */}
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <AnimatePresence mode="wait">
              {card && (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 26, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  className="text-center no-select"
                >
                  <p className="mb-4 text-[10px] uppercase tracking-[0.6em] text-primary/70 sm:text-xs">
                    {card.kicker}
                  </p>
                  <h2 className="font-display text-3xl font-black tracking-[0.14em] text-white text-glow sm:text-5xl lg:text-6xl">
                    {card.title}
                  </h2>
                  <p className="mt-5 text-[11px] uppercase tracking-[0.4em] text-dim sm:text-sm">
                    {card.sub}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* skip */}
          <button
            onClick={() => {
              audio.sfx("click");
              useExperience.getState().finishIntro();
            }}
            className="btn-hud pointer-events-auto absolute bottom-[9vh] right-6 px-5 py-2 text-[10px] sm:right-10"
          >
            Skip intro ▸
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
