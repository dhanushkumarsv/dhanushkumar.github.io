"use client";

import { motion } from "framer-motion";
import { languages, skillGroups } from "@/content/portfolio";
import { Chip, MeterBar, PanelSection } from "@/components/ui/panels/kit";

/**
 * Distillation Tower — the capability stack, separated by tray.
 * (A distillation column sorts by volatility; this one sorts by craft.)
 */
export function SkillsPanel({ accent }: { accent: string }) {
  return (
    <div>
      <p className="mb-6 text-[13.5px] leading-relaxed text-white/70">
        Read the column bottom-up, like any good tower: fundamentals in the
        reboiler, specialized tooling condensing at the top.
      </p>

      {skillGroups.map((group, gi) => (
        <motion.div
          key={group.title}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 + gi * 0.08, duration: 0.45 }}
          className="mb-6"
        >
          <div className="mb-3 flex items-center gap-3">
            <span
              className="font-display text-[11px] font-bold tracking-[0.2em]"
              style={{ color: accent }}
            >
              TRAY {String(skillGroups.length - gi).padStart(2, "0")}
            </span>
            <span className="h-px grow bg-line" />
            <span className="text-[10px] uppercase tracking-[0.28em] text-dim">
              {group.title}
            </span>
          </div>
          {group.skills.map((s) => (
            <MeterBar key={s.name} label={s.name} value={s.level} accent={accent} />
          ))}
        </motion.div>
      ))}

      <PanelSection title="Languages" accent={accent}>
        <div className="flex flex-wrap gap-2">
          {languages.map((l) => (
            <Chip key={l.name} accent={accent}>
              {l.name} — {l.level}
            </Chip>
          ))}
        </div>
      </PanelSection>
    </div>
  );
}
