"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { audio } from "@/lib/audio";
import { useExperience } from "@/store/experience";

const CONTROLS: { keys: string; action: string }[] = [
  { keys: "SCROLL / SWIPE", action: "Tour the facility ring" },
  { keys: "CLICK BEACON", action: "Fly to a facility" },
  { keys: "1 – 8", action: "Jump straight to a facility" },
  { keys: "0 / ESC", action: "Back out · overview" },
  { keys: "M", action: "Mute / unmute audio" },
  { keys: "H", action: "This card" },
];

/** First-visit control card; returns via the H key or the HUD. */
export function HelpOverlay() {
  const open = useExperience((s) => s.helpOpen);
  const phase = useExperience((s) => s.phase);

  // auto-show once, shortly after the intro ends
  useEffect(() => {
    if (phase !== "explore") return;
    if (localStorage.getItem("nexus-help-seen")) return;
    const t = setTimeout(() => {
      useExperience.getState().setHelpOpen(true);
      localStorage.setItem("nexus-help-seen", "1");
    }, 1600);
    return () => clearTimeout(t);
  }, [phase]);

  const close = () => {
    audio.sfx("close");
    useExperience.getState().setHelpOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 z-55 flex items-center justify-center bg-black/55 p-6 backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            initial={{ scale: 0.94, y: 14 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass hud-corners w-full max-w-md p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-primary">
              Field manual
            </p>
            <h3 className="font-display mb-5 mt-1 text-lg font-bold tracking-[0.14em] text-white">
              NAVIGATING THE NEXUS
            </h3>
            <div className="space-y-2.5">
              {CONTROLS.map((c) => (
                <div key={c.keys} className="flex items-center justify-between gap-4">
                  <span className="font-display shrink-0 border border-primary/25 bg-abyss px-2.5 py-1 text-[10px] tracking-[0.18em] text-primary">
                    {c.keys}
                  </span>
                  <span className="grow text-right text-[12.5px] text-white/70">
                    {c.action}
                  </span>
                </div>
              ))}
            </div>
            <button onClick={close} className="btn-hud mt-6 w-full py-2.5 text-[11px]">
              Understood — begin survey
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
