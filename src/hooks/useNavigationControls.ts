"use client";

import { useEffect, useRef, type RefObject } from "react";
import { DISTRICT_ORDER } from "@/lib/districts";
import { audio } from "@/lib/audio";
import { useExperience } from "@/store/experience";

/**
 * World navigation: wheel and swipe cycle the district ring, digits jump,
 * Escape backs out, M mutes, H opens help. Wheel/touch listeners attach to
 * the canvas wrapper only, so scrolling inside content panels never flies
 * the camera.
 */
export function useNavigationControls(
  canvasZone: RefObject<HTMLDivElement | null>
) {
  const wheelAccum = useRef(0);
  const lastNav = useRef(0);
  const touchStart = useRef<{ x: number; y: number; t: number } | null>(null);

  useEffect(() => {
    const zone = canvasZone.current;
    if (!zone) return;

    const step = (dir: 1 | -1) => {
      const s = useExperience.getState();
      if (s.phase !== "explore") return;
      const now = performance.now();
      if (now - lastNav.current < 1100) return;
      lastNav.current = now;

      const current = s.activeDistrict
        ? DISTRICT_ORDER.indexOf(s.activeDistrict)
        : -1;
      const next =
        current === -1
          ? dir === 1
            ? 0
            : DISTRICT_ORDER.length - 1
          : (current + dir + DISTRICT_ORDER.length) % DISTRICT_ORDER.length;
      s.focusDistrict(DISTRICT_ORDER[next]);
    };

    const onWheel = (e: WheelEvent) => {
      const s = useExperience.getState();
      if (s.phase !== "explore") return;
      wheelAccum.current += e.deltaY;
      if (Math.abs(wheelAccum.current) > 90) {
        step(wheelAccum.current > 0 ? 1 : -1);
        wheelAccum.current = 0;
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      touchStart.current = { x: t.clientX, y: t.clientY, t: performance.now() };
    };

    const onTouchEnd = (e: TouchEvent) => {
      const start = touchStart.current;
      touchStart.current = null;
      if (!start) return;
      const t = e.changedTouches[0];
      const dy = t.clientY - start.y;
      const dx = t.clientX - start.x;
      const dt = performance.now() - start.t;
      if (dt > 700) return;
      if (Math.abs(dy) > 64 && Math.abs(dy) > Math.abs(dx) * 1.4) {
        step(dy < 0 ? 1 : -1);
      } else if (Math.abs(dx) > 72 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        step(dx < 0 ? 1 : -1);
      }
    };

    zone.addEventListener("wheel", onWheel, { passive: true });
    zone.addEventListener("touchstart", onTouchStart, { passive: true });
    zone.addEventListener("touchend", onTouchEnd, { passive: true });

    const onKey = (e: KeyboardEvent) => {
      const s = useExperience.getState();
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (s.phase === "intro" && (e.key === "Escape" || e.key === "Enter")) {
        s.finishIntro();
        return;
      }
      if (s.phase !== "explore") return;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
          step(1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          step(-1);
          break;
        case "Escape":
          if (s.helpOpen) s.setHelpOpen(false);
          else if (s.panelOpen) {
            s.closePanel();
            audio.sfx("close");
          } else if (s.activeDistrict) s.focusDistrict(null);
          break;
        case "Home":
        case "0":
          s.focusDistrict(null);
          break;
        case "m":
        case "M": {
          const on = !s.soundOn;
          s.setSoundOn(on);
          s.setMusicOn(on);
          break;
        }
        case "h":
        case "H":
          s.setHelpOpen(!s.helpOpen);
          break;
        default: {
          const n = Number(e.key);
          if (n >= 1 && n <= DISTRICT_ORDER.length) {
            s.focusDistrict(DISTRICT_ORDER[n - 1]);
          }
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      zone.removeEventListener("wheel", onWheel);
      zone.removeEventListener("touchstart", onTouchStart);
      zone.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
    };
  }, [canvasZone]);
}
