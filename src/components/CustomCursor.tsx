"use client";

import { useEffect, useRef } from "react";

/** Soft cursor ring for mouse users. Pure DOM transforms — no React re-renders per frame. */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let scale = 1;
    let target = 1;
    let raf = 0;
    let visible = false;

    const show = (v: boolean) => {
      if (v === visible) return;
      visible = v;
      dot.style.opacity = v ? "1" : "0";
      ring.style.opacity = v ? "1" : "0";
    };

    const tick = () => {
      rx += (x - rx) * 0.2;
      ry += (y - ry) * 0.2;
      scale += (target - scale) * 0.2;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale})`;
      const moving = Math.abs(x - rx) > 0.15 || Math.abs(y - ry) > 0.15 || Math.abs(target - scale) > 0.01;
      raf = moving ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      show(true);
      kick();
    };
    const onOver = (e: PointerEvent) => {
      const el = e.target as Element | null;
      const interactive = Boolean(el?.closest?.("a, button, [role='button'], input, select, textarea, label, [data-magnetic]"));
      const next = interactive ? 1.7 : 1;
      if (next !== target) {
        target = next;
        ring.style.backgroundColor = interactive ? "color-mix(in srgb, var(--warm-terracotta) 12%, transparent)" : "transparent";
        kick();
      }
    };
    const onLeave = () => show(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[70] h-8 w-8 rounded-full border border-terracotta/50 opacity-0 transition-[opacity,background-color] duration-300"
        style={{ transform: "translate3d(-100px, -100px, 0)" }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[70] h-1.5 w-1.5 rounded-full bg-terracotta opacity-0 transition-opacity duration-300"
        style={{ transform: "translate3d(-100px, -100px, 0)" }}
      />
    </>
  );
}
