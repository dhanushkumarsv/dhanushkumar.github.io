"use client";

import { motion } from "framer-motion";
import { BookOpen, GraduationCap } from "lucide-react";
import { education, milestones, publications } from "@/content/portfolio";
import { BulletList, PanelSection } from "@/components/ui/panels/kit";

/** Innovation Library — the archive: education, publications, milestones. */
export function LibraryPanel({ accent }: { accent: string }) {
  return (
    <div>
      <PanelSection title="Education record" accent={accent}>
        <div className="space-y-3">
          {education.map((e, i) => (
            <motion.div
              key={e.degree}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="hud-corners border border-line/70 bg-abyss/60 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 text-[14px] font-bold text-white">
                    <GraduationCap size={14} style={{ color: accent }} />
                    {e.school}
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.2em]" style={{ color: accent }}>
                    {e.degree}
                  </p>
                </div>
                <span className="shrink-0 border border-line px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-dim">
                  {e.date}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-line/50 pt-2 text-[11px] text-dim">
                <span>{e.location}</span>
                <span className="font-display font-bold text-white/90">{e.gpa}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </PanelSection>

      <PanelSection title="Publications" accent={accent}>
        <div className="space-y-3">
          {publications.map((p) => (
            <div
              key={p.title}
              className="border-l-2 bg-abyss/60 px-4 py-3"
              style={{ borderColor: accent }}
            >
              <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em]" style={{ color: accent }}>
                <BookOpen size={12} /> {p.venue} · {p.kind}
              </p>
              <p className="mt-1.5 text-[13.5px] leading-snug text-white/85">
                “{p.title}”
              </p>
            </div>
          ))}
        </div>
      </PanelSection>

      <PanelSection title="Milestones" accent={accent}>
        <BulletList points={milestones} accent={accent} />
      </PanelSection>
    </div>
  );
}
