"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { audio } from "@/lib/audio";
import { hydrogenChain } from "@/content/portfolio";
import { PanelSection, StatRow } from "@/components/ui/panels/kit";

const ICONS: Record<string, React.ReactNode> = {
  solar: (
    <g>
      <circle r={3.2} fill="none" strokeWidth={1.1} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line
          key={a}
          x1={Math.cos((a * Math.PI) / 180) * 4.6}
          y1={Math.sin((a * Math.PI) / 180) * 4.6}
          x2={Math.cos((a * Math.PI) / 180) * 6.2}
          y2={Math.sin((a * Math.PI) / 180) * 6.2}
          strokeWidth={1}
        />
      ))}
    </g>
  ),
  reactor: (
    <path d="M -5 5.5 L -2.5 -5.5 H 2.5 L 5 5.5 Z" fill="none" strokeWidth={1.1} />
  ),
  storage: (
    <g>
      <circle r={5} fill="none" strokeWidth={1.1} />
      <line x1={-5} y1={0} x2={5} y2={0} strokeWidth={0.7} />
    </g>
  ),
  network: (
    <g strokeWidth={1}>
      <circle cx={-4} cy={-3.5} r={1.6} fill="none" />
      <circle cx={4.5} cy={-2.5} r={1.6} fill="none" />
      <circle cx={0} cy={4} r={1.6} fill="none" />
      <line x1={-2.8} y1={-2.8} x2={3} y2={-2.6} />
      <line x1={-3} y1={-2.3} x2={-0.8} y2={2.9} />
      <line x1={3.6} y1={-1.2} x2={0.9} y2={2.9} />
    </g>
  ),
  demand: (
    <path d="M 1.5 -6 L -3.5 1 H 0 L -1.5 6 L 3.5 -1 H 0 Z" fill="none" strokeWidth={1.1} strokeLinejoin="round" />
  ),
};

/**
 * Hydrogen Energy Plant — the green-H₂ value chain, from photons to
 * delivered fuel, with the supply-chain optimization work behind it.
 */
export function HydrogenPanel({ accent }: { accent: string }) {
  const [selected, setSelected] = useState("reactor");
  const step = hydrogenChain.steps.find((s) => s.id === selected);

  return (
    <div>
      <p className="mb-5 text-[13.5px] leading-relaxed text-white/70">
        {hydrogenChain.intro}
      </p>

      {/* chain diagram */}
      <div className="hud-corners mb-4 border border-line/70 bg-abyss/70 px-2 py-4">
        <svg viewBox="0 0 100 26" className="w-full">
          {hydrogenChain.steps.map((s, i) => {
            const x = 10 + i * 20;
            const active = s.id === selected;
            return (
              <g key={s.id}>
                {i < hydrogenChain.steps.length - 1 && (
                  <g>
                    <line x1={x + 7} y1={12} x2={x + 13} y2={12} stroke={`${accent}44`} strokeWidth={1.4} />
                    <line x1={x + 7} y1={12} x2={x + 13} y2={12} stroke={accent} strokeWidth={0.9} className="anim-dash-slow" />
                  </g>
                )}
                <g
                  transform={`translate(${x}, 12)`}
                  onClick={() => {
                    setSelected(s.id);
                    audio.sfx("click");
                  }}
                  className="cursor-pointer"
                  stroke={active ? "#ffffff" : accent}
                  style={{ filter: active ? `drop-shadow(0 0 3px ${accent})` : "none" }}
                >
                  <circle r={8.5} fill="transparent" stroke="none" />
                  {ICONS[s.id]}
                </g>
                <text
                  x={x}
                  y={24}
                  textAnchor="middle"
                  fontSize={2.9}
                  fill={active ? "#ffffff" : "#7e93a8"}
                  style={{ letterSpacing: "0.1em", fontFamily: "var(--font-tech)" }}
                >
                  {s.label.toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="mb-6 border-l-2 bg-abyss/60 px-4 py-3"
          style={{ borderColor: accent }}
        >
          <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: accent }}>
            {step?.label}
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-white/75">{step?.detail}</p>
        </motion.div>
      </AnimatePresence>

      <PanelSection title="Measured performance" accent={accent}>
        <StatRow stats={hydrogenChain.stats} accent={accent} />
      </PanelSection>

      <PanelSection title="The photoreactor" accent={accent}>
        <p className="text-[13px] leading-relaxed text-white/65">
          A 4-liter trapezoidal acrylic vessel, designed and fabricated
          in-house: activated TiO₂ suspended in sulphide wastewater splits
          out hydrogen under direct sun — waste treatment and clean fuel in
          the same unit. Presented at ICATES 2023.
        </p>
      </PanelSection>

      <PanelSection title="The network science" accent={accent}>
        <p className="text-[13px] leading-relaxed text-white/65">
          Siting, storage and routing decisions come from MILP models written
          in GAMS and solved with CPLEX — the same formulation that scheduled
          a 15-node dairy network to ₹12M/day under 4-hour freshness windows,
          transferable node-for-node to hydrogen logistics.
        </p>
      </PanelSection>
    </div>
  );
}
