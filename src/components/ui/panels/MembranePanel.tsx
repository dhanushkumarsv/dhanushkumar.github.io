"use client";

import { membraneResearch } from "@/content/portfolio";
import { BulletList, PanelSection, StatRow } from "@/components/ui/panels/kit";

/**
 * Membrane Distillation Facility — an animated VMD cross-section:
 * hot brine sweeps the membrane, vapor crosses, vacuum pulls it to the
 * condenser, salts stay behind.
 */
export function MembranePanel({ accent }: { accent: string }) {
  return (
    <div>
      <p className="mb-5 text-[13.5px] leading-relaxed text-white/70">
        {membraneResearch.intro}
      </p>

      {/* animated VMD cross-section */}
      <div className="hud-corners mb-6 border border-line/70 bg-abyss/70 p-2">
        <svg viewBox="0 0 100 58" className="w-full">
          <defs>
            <linearGradient id="feedGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#ff8a4d" stopOpacity="0.55" />
              <stop offset="1" stopColor="#ff5f3d" stopOpacity="0.28" />
            </linearGradient>
            <linearGradient id="permGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor={accent} stopOpacity="0.18" />
              <stop offset="1" stopColor={accent} stopOpacity="0.42" />
            </linearGradient>
          </defs>

          {/* labels */}
          <text x={4} y={8} fontSize={3} fill="#ff9a6b" style={{ letterSpacing: "0.15em" }}>
            HOT FEED — PHOSPHOGYPSUM LEACHATE
          </text>
          <text x={4} y={51} fontSize={3} fill={accent} style={{ letterSpacing: "0.15em" }}>
            VACUUM SIDE → CONDENSER
          </text>

          {/* feed channel */}
          <rect x={4} y={11} width={72} height={14} fill="url(#feedGrad)" stroke="#ff8a4d55" strokeWidth={0.5} />
          {/* feed flow lines */}
          {[14.5, 18, 21.5].map((y) => (
            <line key={y} x1={6} y1={y} x2={74} y2={y} stroke="#ffb38a" strokeWidth={0.8} className="anim-dash" opacity={0.8} />
          ))}
          {/* retained salt ions */}
          {[
            [15, 16], [30, 20.5], [46, 15], [60, 19], [68, 22.5], [24, 22.5], [52, 21.5],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={0.9} fill="#ffd7a8">
              <animate
                attributeName="cy"
                values={`${y};${y - 1.2};${y}`}
                dur={`${2 + (i % 3)}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}

          {/* membrane */}
          <rect x={4} y={26.5} width={72} height={4} fill="#0a1424" stroke={accent} strokeWidth={0.5} />
          {Array.from({ length: 18 }).map((_, i) => (
            <line
              key={i}
              x1={6 + i * 4}
              y1={26.5}
              x2={7.4 + i * 4}
              y2={30.5}
              stroke={`${accent}88`}
              strokeWidth={0.5}
            />
          ))}
          <text x={78} y={29.8} fontSize={2.6} fill={accent} style={{ letterSpacing: "0.1em" }}>
            PVDF
          </text>

          {/* vapor crossing */}
          {[12, 26, 40, 54, 68].map((x, i) => (
            <g key={x}>
              <circle cx={x} cy={32} r={0.8} fill="#ffffff" opacity={0.9}>
                <animate
                  attributeName="cy"
                  values="27.5;38"
                  dur={`${1.6 + i * 0.22}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0;1;0"
                  dur={`${1.6 + i * 0.22}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          ))}

          {/* permeate channel */}
          <rect x={4} y={38} width={72} height={9} fill="url(#permGrad)" stroke={`${accent}44`} strokeWidth={0.5} />
          <line x1={6} y1={42.5} x2={74} y2={42.5} stroke={accent} strokeWidth={0.8} className="anim-dash" />

          {/* condenser */}
          <rect x={80} y={36} width={16} height={13} fill="none" stroke={accent} strokeWidth={0.7} />
          {[39, 42, 45].map((y) => (
            <path key={y} d={`M 81.5 ${y} q 2 -1.8 4 0 t 4 0 t 4 0`} fill="none" stroke={accent} strokeWidth={0.6} />
          ))}
          <text x={88} y={53.5} fontSize={2.6} fill="#7e93a8" textAnchor="middle" style={{ letterSpacing: "0.12em" }}>
            DISTILLATE
          </text>
          <line x1={76} y1={42.5} x2={80} y2={42.5} stroke={accent} strokeWidth={0.8} className="anim-dash" />
        </svg>
      </div>

      <PanelSection title="Separation performance" accent={accent}>
        <StatRow stats={membraneResearch.stats} accent={accent} />
      </PanelSection>

      <PanelSection title="How it works" accent={accent}>
        <BulletList points={membraneResearch.mechanism} accent={accent} />
      </PanelSection>

      <PanelSection title="Hybrid architecture" accent={accent}>
        <p className="text-[13px] leading-relaxed text-white/65">
          The full framework couples VMD with multi-effect distillation
          (MED) and compares against MSF-MED — reusing latent heat from each
          effect to drive the next. The result: reusable distillate from an
          industrial waste stream, with phosphorus recovered as product
          rather than discharged as pollutant.
        </p>
      </PanelSection>
    </div>
  );
}
