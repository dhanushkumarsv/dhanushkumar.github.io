"use client";

import { motion } from "framer-motion";
import { Contact, Download, FileText } from "lucide-react";
import Link from "next/link";
import { audio } from "@/lib/audio";
import { buildVCard, experience, profile } from "@/content/portfolio";
import { BulletList, PanelSection } from "@/components/ui/panels/kit";

function downloadVCard() {
  const blob = new Blob([buildVCard()], { type: "text/vcard" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "dhanush-kumar-sv.vcf";
  a.click();
  URL.revokeObjectURL(url);
  audio.sfx("success");
}

/** Control Room — the career dossier: experience log + downloads. */
export function ControlPanel({ accent }: { accent: string }) {
  return (
    <div>
      {/* downloads */}
      <div className="mb-6 grid grid-cols-2 gap-2">
        <Link
          href="/resume/"
          onClick={() => audio.sfx("click")}
          className="btn-hud hud-corners flex-col gap-1.5 px-3 py-4 text-center text-[10px]"
        >
          <FileText size={17} />
          Dossier / print CV
        </Link>
        <button
          onClick={downloadVCard}
          className="btn-hud hud-corners flex-col gap-1.5 px-3 py-4 text-[10px]"
        >
          <Contact size={17} />
          Save contact card
        </button>
      </div>

      <PanelSection title="Operator status" accent={accent}>
        <div className="border border-line/70 bg-abyss/60 p-4 text-[13px] leading-relaxed text-white/75">
          <p className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em]" style={{ color: accent }}>
            <span className="pulse-soft inline-block h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
            Systems nominal — open to opportunities
          </p>
          {profile.availability}
        </div>
      </PanelSection>

      <PanelSection title="Experience log" accent={accent}>
        <div className="relative space-y-4 pl-4">
          <span className="absolute bottom-2 left-0 top-2 w-px bg-line" />
          {experience.map((e, i) => (
            <motion.div
              key={e.role + e.date}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.09 }}
              className="relative border border-line/60 bg-abyss/60 p-4"
            >
              <span
                className="absolute -left-[21.5px] top-5 h-[9px] w-[9px] rotate-45 border"
                style={{ borderColor: accent, background: "#060b16" }}
              />
              <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-[14px] font-bold leading-tight text-white">{e.role}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.22em]" style={{ color: accent }}>
                    {e.company}
                  </p>
                </div>
                <span className="shrink-0 border border-line px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] text-dim">
                  {e.date}
                </span>
              </div>
              <BulletList points={e.points} accent={accent} />
            </motion.div>
          ))}
        </div>
      </PanelSection>

      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-faint">
        <Download size={12} />
        The dossier page prints to a clean PDF — Ctrl/Cmd+P
      </div>
    </div>
  );
}
