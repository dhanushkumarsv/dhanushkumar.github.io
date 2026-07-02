"use client";

import { motion } from "framer-motion";
import { projects } from "@/content/portfolio";
import { BulletList, Chip, PanelSection, StatRow } from "@/components/ui/panels/kit";

/** Research Center — the four research programs with their hard numbers. */
export function ResearchPanel({ accent }: { accent: string }) {
  return (
    <div>
      <p className="mb-6 text-[13.5px] leading-relaxed text-white/70">
        Four research programs, one thread: modeling a process rigorously,
        then squeezing every recoverable percent out of it — purity, flux,
        yield, or cost.
      </p>

      {projects.map((p, i) => (
        <motion.article
          key={p.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.09, duration: 0.5 }}
          className="hud-corners mb-5 border border-line/70 bg-abyss/60 p-4"
        >
          <p className="text-[9px] uppercase tracking-[0.3em]" style={{ color: accent }}>
            PROGRAM {String(i + 1).padStart(2, "0")} — {p.subtitle}
          </p>
          <h4 className="mb-3 mt-1 text-[15px] font-bold leading-snug text-white">
            {p.title}
          </h4>
          <div className="mb-3">
            <StatRow stats={p.metrics} accent={accent} />
          </div>
          <BulletList points={p.points} accent={accent} />
          <div className="mt-3 flex flex-wrap gap-1.5">
            {p.tags.map((t) => (
              <Chip key={t} accent={accent}>
                {t}
              </Chip>
            ))}
          </div>
        </motion.article>
      ))}

      <PanelSection title="Where next" accent={accent}>
        <p className="text-[13px] leading-relaxed text-white/65">
          Each program lives in its own facility — the Aspen Laboratory holds
          the glycerol flowsheet, the Hydrogen Plant the photoreactor, the
          Membrane Facility the VMD hybrid. Keep exploring the ring.
        </p>
      </PanelSection>
    </div>
  );
}
