"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Hexagon } from "lucide-react";
import { audio } from "@/lib/audio";
import { DISTRICTS } from "@/lib/districts";
import { useExperience } from "@/store/experience";

/**
 * The bottom dock: one keyed hex per facility plus the overview. Hidden
 * while a panel is open on small screens (the bottom sheet needs the room).
 */
export function NavigationDock() {
  const active = useExperience((s) => s.activeDistrict);
  const panelOpen = useExperience((s) => s.panelOpen);
  const visited = useExperience((s) => s.visited);

  return (
    <AnimatePresence>
      {!panelOpen && (
        <motion.nav
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.5 }}
          className="pointer-events-auto absolute inset-x-0 bottom-4 flex justify-center sm:bottom-6"
        >
          <div className="glass flex max-w-[94vw] items-center gap-1 overflow-x-auto px-2 py-2 sm:gap-1.5 sm:px-3">
            <button
              onClick={() => {
                audio.sfx("click");
                useExperience.getState().focusDistrict(null);
              }}
              className={`group relative flex h-10 w-10 shrink-0 items-center justify-center transition-colors ${
                active === null ? "text-primary" : "text-faint hover:text-dim"
              }`}
              title="Overview (0)"
            >
              <Hexagon size={17} className={active === null ? "fill-primary/20" : ""} />
              <span className="absolute inset-x-0 -bottom-0.5 mx-auto h-px w-4 bg-primary opacity-0 transition-opacity group-hover:opacity-60" />
            </button>

            <span className="h-6 w-px shrink-0 bg-line" />

            {DISTRICTS.map((d) => {
              const isActive = active === d.id;
              const isVisited = visited.includes(d.id);
              return (
                <button
                  key={d.id}
                  onClick={() => {
                    audio.sfx("click");
                    useExperience.getState().focusDistrict(d.id);
                  }}
                  onMouseEnter={() => audio.sfx("hover")}
                  className="group relative flex h-10 w-10 shrink-0 flex-col items-center justify-center no-select"
                  title={`${d.name} (${d.index + 1})`}
                >
                  <span
                    className="font-display text-[13px] font-bold transition-all"
                    style={{
                      color: isActive ? d.color : isVisited ? "#9fb4c6" : "#46586c",
                      textShadow: isActive ? `0 0 14px ${d.color}` : "none",
                    }}
                  >
                    {d.index + 1}
                  </span>
                  <span
                    className="mt-0.5 h-[3px] w-[3px] rounded-full transition-all"
                    style={{
                      background: isActive || isVisited ? d.color : "#2a3a4c",
                      boxShadow: isActive ? `0 0 8px ${d.color}` : "none",
                    }}
                  />
                  {/* hover label */}
                  <span
                    className="glass-soft pointer-events-none absolute bottom-12 hidden whitespace-nowrap px-2.5 py-1 text-[9px] uppercase tracking-[0.25em] text-white opacity-0 transition-opacity group-hover:opacity-100 sm:block"
                    style={{ borderColor: `${d.color}55` }}
                  >
                    {d.name}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
