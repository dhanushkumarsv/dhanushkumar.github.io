"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { audio } from "@/lib/audio";
import { DISTRICT_MAP, type DistrictId } from "@/lib/districts";
import { useExperience } from "@/store/experience";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ResearchPanel } from "@/components/ui/panels/ResearchPanel";
import { AspenPanel } from "@/components/ui/panels/AspenPanel";
import { HydrogenPanel } from "@/components/ui/panels/HydrogenPanel";
import { MembranePanel } from "@/components/ui/panels/MembranePanel";
import { SkillsPanel } from "@/components/ui/panels/SkillsPanel";
import { LibraryPanel } from "@/components/ui/panels/LibraryPanel";
import { ControlPanel } from "@/components/ui/panels/ControlPanel";
import { ContactPanel } from "@/components/ui/panels/ContactPanel";

const PANELS: Record<
  DistrictId,
  React.ComponentType<{ accent: string }>
> = {
  research: ResearchPanel,
  aspen: AspenPanel,
  hydrogen: HydrogenPanel,
  membrane: MembranePanel,
  distillation: SkillsPanel,
  library: LibraryPanel,
  control: ControlPanel,
  comms: ContactPanel,
};

/**
 * The reading surface: a glass side panel on desktop, a bottom sheet on
 * mobile. Content is district-keyed; the world keeps living behind it.
 */
export function SectionPanel() {
  const active = useExperience((s) => s.activeDistrict);
  const open = useExperience((s) => s.panelOpen);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const district = active ? DISTRICT_MAP[active] : null;
  const show = open && district !== null;

  const close = () => {
    audio.sfx("close");
    useExperience.getState().closePanel();
  };

  return (
    <AnimatePresence>
      {show && district && (
        <motion.aside
          key={district.id}
          initial={
            isDesktop ? { x: "104%", opacity: 0.6 } : { y: "104%", opacity: 0.8 }
          }
          animate={
            isDesktop
              ? { x: 0, opacity: 1, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } }
              : { y: 0, opacity: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }
          }
          exit={
            isDesktop
              ? { x: "104%", opacity: 0.4, transition: { duration: 0.4, ease: "easeIn" } }
              : { y: "104%", opacity: 0.6, transition: { duration: 0.35, ease: "easeIn" } }
          }
          className="glass absolute z-50 flex flex-col overflow-hidden
                     max-md:inset-x-2 max-md:bottom-2 max-md:top-[34dvh]
                     md:bottom-4 md:right-4 md:top-4 md:w-[min(460px,44vw)]"
          style={{ borderColor: `${district.color}2e` }}
        >
          {/* header */}
          <header
            className="relative shrink-0 border-b px-6 pb-4 pt-5"
            style={{ borderColor: `${district.color}26` }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                background: `radial-gradient(circle at 20% 0%, ${district.color}, transparent 60%)`,
              }}
            />
            <p className="text-[10px] uppercase tracking-[0.4em] text-dim">
              <span style={{ color: district.color }}>{district.code}</span> · facility{" "}
              {String(district.index + 1).padStart(2, "0")} / 08
            </p>
            <h2 className="font-display mt-1.5 text-lg font-bold tracking-[0.12em] text-white sm:text-xl">
              {district.name.toUpperCase()}
            </h2>
            <p className="mt-1 text-[11px] uppercase tracking-[0.26em] text-dim">
              {district.tagline}
            </p>
            <button
              onClick={close}
              className="btn-hud absolute right-4 top-4 p-2"
              title="Close (Esc)"
            >
              <X size={14} />
            </button>
          </header>

          {/* body */}
          <div className="mask-fade-b grow overflow-y-auto px-6 pb-10 pt-5 overscroll-contain">
            {(() => {
              const Panel = PANELS[district.id];
              return <Panel accent={district.color} />;
            })()}
          </div>

          {/* footer hint */}
          <footer
            className="shrink-0 border-t px-6 py-2.5 text-[9px] uppercase tracking-[0.3em] text-faint"
            style={{ borderColor: `${district.color}1f` }}
          >
            Esc close · scroll world to travel · {district.index + 1}/8
          </footer>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
