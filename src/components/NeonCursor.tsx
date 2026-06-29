import { useEffect, useRef, useState } from "react";

/**
 * Soft neon glow that trails the cursor with easing. Pure DOM + rAF (no React
 * re-renders per frame). Hidden on touch / coarse pointers and when the user
 * prefers reduced motion.
 */
export default function NeonCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: target.x, y: target.y };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      // hover-state grow over interactive elements
      const el = e.target as HTMLElement | null;
      const interactive = !!el?.closest("a, button, input, [role='button'], .cursor-help");
      if (ringRef.current) {
        ringRef.current.style.width = interactive ? "56px" : "32px";
        ringRef.current.style.height = interactive ? "56px" : "32px";
        ringRef.current.style.borderColor = interactive
          ? "rgba(184,29,29,0.95)"
          : "rgba(242,194,0,0.65)";
      }
    };

    const tick = () => {
      ring.x += (target.x - ring.x) * 0.18;
      ring.y += (target.y - ring.y) * 0.18;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[200] mix-blend-screen hidden md:block">
      <div
        ref={ringRef}
        className="absolute top-0 left-0 w-8 h-8 rounded-full border transition-[width,height,border-color] duration-300 ease-out"
        style={{ borderColor: "rgba(242,194,0,0.65)", boxShadow: "0 0 24px rgba(242,194,0,0.25)" }}
      />
      <div
        ref={dotRef}
        className="absolute top-0 left-0 w-1.5 h-1.5 rounded-full bg-neon-blue"
        style={{ boxShadow: "0 0 10px #f2c200" }}
      />
    </div>
  );
}
