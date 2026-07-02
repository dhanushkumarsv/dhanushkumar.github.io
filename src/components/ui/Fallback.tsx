"use client";

import Link from "next/link";
import { profile } from "@/content/portfolio";

/** Shown when WebGL is unavailable — routes visitors to the 2D dossier. */
export function Fallback() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-void p-6">
      <div className="glass hud-corners max-w-md p-8 text-center">
        <p className="text-[10px] uppercase tracking-[0.4em] text-primary">
          Nexus offline
        </p>
        <h1 className="font-display mt-2 text-xl font-bold tracking-[0.12em] text-white">
          WEBGL UNAVAILABLE
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-dim">
          This browser can&apos;t render the 3D world, but the complete
          portfolio of {profile.name} is available as a clean dossier.
        </p>
        <Link href="/resume/" className="btn-hud mt-6 inline-flex px-8 py-3 text-xs">
          Open the dossier
        </Link>
      </div>
    </div>
  );
}
