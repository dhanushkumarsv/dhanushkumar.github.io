"use client";

import type { ReactNode } from "react";

/**
 * Shared building blocks for the district panels — headers, stat tiles,
 * chips and meter bars, all in the Glass Foundry voice.
 */

export function PanelSection({
  title,
  accent,
  children,
}: {
  title: string;
  accent: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-7">
      <h3 className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.34em] text-dim">
        <span
          className="inline-block h-[3px] w-[3px] rotate-45"
          style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
        />
        {title}
      </h3>
      {children}
    </section>
  );
}

export function StatRow({
  stats,
  accent,
}: {
  stats: { value: string; label: string }[];
  accent: string;
}) {
  return (
    <div
      className="grid gap-px overflow-hidden border border-line bg-line/60"
      style={{ gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)` }}
    >
      {stats.map((s) => (
        <div key={s.label} className="bg-abyss/90 px-3 py-2.5 text-center">
          <p
            className="font-display text-base font-bold sm:text-lg"
            style={{ color: accent, textShadow: `0 0 16px ${accent}55` }}
          >
            {s.value}
          </p>
          <p className="mt-0.5 text-[9px] uppercase tracking-[0.16em] text-dim">
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}

export function Chip({ children, accent }: { children: ReactNode; accent: string }) {
  return (
    <span
      className="inline-block border px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-dim"
      style={{ borderColor: `${accent}33`, background: `${accent}0d` }}
    >
      {children}
    </span>
  );
}

export function MeterBar({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="mb-3">
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-sm font-semibold text-white/90">{label}</span>
        <span className="font-display text-[11px]" style={{ color: accent }}>
          {value}%
        </span>
      </div>
      <div className="h-[3px] w-full bg-line/70">
        <div
          className="h-full transition-[width] duration-1000 ease-out"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${accent}44, ${accent})`,
            boxShadow: `0 0 10px ${accent}88`,
          }}
        />
      </div>
    </div>
  );
}

export function BulletList({
  points,
  accent,
}: {
  points: string[];
  accent: string;
}) {
  return (
    <ul className="space-y-2">
      {points.map((p, i) => (
        <li key={i} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-white/75">
          <span
            className="mt-[7px] inline-block h-[5px] w-[5px] shrink-0 rotate-45"
            style={{ background: `${accent}88` }}
          />
          {p}
        </li>
      ))}
    </ul>
  );
}
