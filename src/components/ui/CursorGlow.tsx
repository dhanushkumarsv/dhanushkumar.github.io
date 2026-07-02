"use client";

import { useEffect, useRef } from "react";

/**
 * A soft ion glow that trails the cursor over the world (fine pointers
 * only). Driven directly by rAF — never touches React state.
 */
export function CursorGlow() {
  const glow = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let gx = x;
    let gy = y;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate(${x - 3}px, ${y - 3}px)`;
        dot.current.style.opacity = "1";
      }
    };

    const tick = () => {
      gx += (x - gx) * 0.09;
      gy += (y - gy) * 0.09;
      if (glow.current) {
        glow.current.style.transform = `translate(${gx - 190}px, ${gy - 190}px)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={glow}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-20 h-[380px] w-[380px] rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(circle, rgba(103,232,249,0.07) 0%, rgba(103,232,249,0.025) 40%, transparent 70%)",
          mixBlendMode: "screen",
        }}
      />
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-[95] h-1.5 w-1.5 rounded-full opacity-0"
        style={{
          background: "#9ff3ff",
          boxShadow: "0 0 10px rgba(103,232,249,0.9)",
        }}
      />
    </>
  );
}
