"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { audio } from "@/lib/audio";
import { aspenFlowsheet, simulationToolkit } from "@/content/portfolio";
import { PanelSection, StatRow } from "@/components/ui/panels/kit";

/**
 * Aspen Plus Laboratory — a live, clickable process flow diagram of the
 * glycerol purification simulation. Streams flow, unit ops explain
 * themselves when tapped.
 */
export function AspenPanel({ accent }: { accent: string }) {
  const [selected, setSelected] = useState<string>("column");
  const node = aspenFlowsheet.nodes.find((n) => n.id === selected);

  const nodeShape = (kind: string) => {
    switch (kind) {
      case "feed":
        return <rect x={-6} y={-4.5} width={12} height={9} fill="none" strokeWidth={1.1} />;
      case "mixer":
        return <circle r={5.5} fill="none" strokeWidth={1.1} />;
      case "flash":
        return (
          <path d="M -4.5 6 L -4.5 -3 Q -4.5 -6 0 -6 Q 4.5 -6 4.5 -3 L 4.5 6 Z" fill="none" strokeWidth={1.1} />
        );
      case "column":
        return (
          <g>
            <rect x={-3.5} y={-9} width={7} height={18} rx={3} fill="none" strokeWidth={1.1} />
            <line x1={-3.5} y1={-3.5} x2={3.5} y2={-3.5} strokeWidth={0.7} />
            <line x1={-3.5} y1={0.5} x2={3.5} y2={0.5} strokeWidth={0.7} />
            <line x1={-3.5} y1={4.5} x2={3.5} y2={4.5} strokeWidth={0.7} />
          </g>
        );
      default:
        return <rect x={-6} y={-4.5} width={12} height={9} fill="none" strokeWidth={1.1} transform="skewX(-8)" />;
    }
  };

  return (
    <div>
      <p className="mb-5 text-[13.5px] leading-relaxed text-white/70">
        {aspenFlowsheet.title}. Select a unit operation to interrogate it —
        the streams are live.
      </p>

      {/* interactive PFD */}
      <div className="hud-corners mb-4 border border-line/70 bg-abyss/70 p-2">
        <svg viewBox="0 0 100 62" className="w-full">
          {/* streams */}
          {aspenFlowsheet.streams.map((s) => {
            const a = aspenFlowsheet.nodes.find((n) => n.id === s.from);
            const b = aspenFlowsheet.nodes.find((n) => n.id === s.to);
            if (!a || !b) return null;
            const ay = a.y * 0.62;
            const by = b.y * 0.62;
            const mx = (a.x + b.x) / 2;
            return (
              <g key={`${s.from}-${s.to}`}>
                <path
                  d={`M ${a.x} ${ay} C ${mx} ${ay}, ${mx} ${by}, ${b.x} ${by}`}
                  fill="none"
                  stroke={`${accent}55`}
                  strokeWidth={1.6}
                />
                <path
                  d={`M ${a.x} ${ay} C ${mx} ${ay}, ${mx} ${by}, ${b.x} ${by}`}
                  fill="none"
                  stroke={accent}
                  strokeWidth={1}
                  className="anim-dash"
                />
              </g>
            );
          })}

          {/* unit ops */}
          {aspenFlowsheet.nodes.map((n) => {
            const active = n.id === selected;
            return (
              <g
                key={n.id}
                transform={`translate(${n.x}, ${n.y * 0.62})`}
                onClick={() => {
                  setSelected(n.id);
                  audio.sfx("click");
                }}
                className="cursor-pointer"
                stroke={active ? "#ffffff" : accent}
                style={{
                  filter: active ? `drop-shadow(0 0 3px ${accent})` : "none",
                }}
              >
                {/* generous invisible hit area */}
                <circle r={9} fill="transparent" stroke="none" />
                {nodeShape(n.kind)}
                <text
                  // stagger labels above/below alternating nodes so they
                  // never collide at narrow panel widths
                  y={
                    n.kind === "column"
                      ? 14
                      : n.kind === "mixer" || n.kind === "product"
                        ? -9
                        : 11
                  }
                  textAnchor="middle"
                  fontSize={2.9}
                  fill={active ? "#ffffff" : "#7e93a8"}
                  stroke="none"
                  style={{ letterSpacing: "0.12em", fontFamily: "var(--font-tech)" }}
                >
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* selected unit detail */}
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
            {node?.label}
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-white/75">
            {node?.detail}
          </p>
        </motion.div>
      </AnimatePresence>

      <PanelSection title="Converged results" accent={accent}>
        <StatRow stats={aspenFlowsheet.results} accent={accent} />
      </PanelSection>

      <PanelSection title="Simulation toolkit" accent={accent}>
        <div className="space-y-2.5">
          {simulationToolkit.map((t) => (
            <div key={t.tool} className="border border-line/60 bg-abyss/50 px-3.5 py-2.5">
              <p className="font-display text-[12px] font-bold tracking-[0.14em] text-white">
                {t.tool.toUpperCase()}
              </p>
              <p className="mt-0.5 text-[12px] leading-relaxed text-white/60">{t.use}</p>
            </div>
          ))}
        </div>
      </PanelSection>

      <p className="text-[11px] uppercase tracking-[0.2em] text-faint">
        ▲ Taught as graduate TA — Aspen Plus &amp; GAMS, NCHU 2025
      </p>
    </div>
  );
}
