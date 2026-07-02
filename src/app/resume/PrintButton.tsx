"use client";

/** Client island: triggers the browser's print → PDF pipeline. */
export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="border border-cyan-700 bg-cyan-700 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-cyan-800"
    >
      Print / Save PDF
    </button>
  );
}
