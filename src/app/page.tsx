"use client";

import dynamic from "next/dynamic";

/**
 * The whole experience is WebGL + WebAudio, so it renders client-side only.
 * The lightweight placeholder below shows for the split second before the
 * bundle arrives; the real boot sequence then takes over.
 */
const ExperienceApp = dynamic(() => import("@/components/ExperienceApp"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex items-center justify-center bg-void">
      <div className="text-center no-select">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border border-primary/20 border-t-primary/80" />
        <p className="text-[11px] uppercase tracking-[0.5em] text-dim">
          Process Nexus
        </p>
      </div>
    </div>
  ),
});

export default function Home() {
  return <ExperienceApp />;
}
