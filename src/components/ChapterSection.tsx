import { useInView } from "framer-motion";
import { memo, useEffect, useRef, useState } from "react";
import type { Chapter } from "../data/story";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

interface ChapterSectionProps {
  chapter: Chapter;
}

function ChapterSection({ chapter }: ChapterSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3 });
  const reduced = usePrefersReducedMotion();
  const [bullets, setBullets] = useState<{ x: number; y: number }[]>([]);
  const [blood, setBlood] = useState<{ x: number; y: number; size: number }[]>([]);

  useEffect(() => {
    if (reduced) return; // no kinetic effects when reduce-motion is on
    if (isInView && chapter.effect === 'bullets') {
      const interval = setInterval(() => {
        setBullets(prev => [
          ...prev.slice(-10),
          { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 }
        ]);
      }, 400);
      return () => clearInterval(interval);
    }
    if (isInView && chapter.effect === 'blood' && blood.length === 0) {
      setBlood([
        { x: 20, y: 30, size: 200 },
        { x: 70, y: 60, size: 150 },
        { x: 40, y: 80, size: 100 },
      ]);
    }
  }, [isInView, chapter.effect, reduced]);

  const renderVisualEffects = () => {
    if (reduced) return null;
    return (
      <>
        {chapter.effect === 'bullets' && bullets.map((b, i) => (
          <div key={i} className="bullet-hole" style={{ left: `${b.x}%`, top: `${b.y}%` }} />
        ))}
        {chapter.effect === 'blood' && blood.map((b, i) => (
          <div key={i} className="blood-splatter" style={{ left: `${b.x}%`, top: `${b.y}%`, width: b.size, height: b.size }} />
        ))}
        {isInView && chapter.effect === 'flash' && (
          <div className="absolute inset-0 z-50 animate-flash pointer-events-none" />
        )}
      </>
    );
  };

  // The story copy is rendered as plain, always-visible elements. Scroll-reveal
  // animations were removed here: with Lenis (transform scrolling) + the
  // sections' `content-visibility:auto`, the IntersectionObserver behind
  // framer's `whileInView` fired unreliably and left whole chapters stuck at
  // opacity 0. Legibility of the text matters more than the reveal flourish.
  return (
    <section
      ref={ref}
      // NOTE: `content-visibility:auto` was removed here. With Lenis smooth
      // scrolling (and any time the tab loses focus) its render-skipping
      // heuristic left whole chapters un-painted — the text looked like it was
      // missing / hidden behind the fixed atmosphere layers. 10 sections paint
      // cheaply enough; always rendering them keeps the copy reliably visible.
      className={`relative min-h-screen w-full flex flex-col items-center justify-center py-32 px-6 overflow-hidden border-b border-white/5 transition-colors duration-1000 ${
        isInView && chapter.effect === 'blood' ? 'bg-crimson/5' : ''
      }`}
    >
      {renderVisualEffects()}

      <div className="max-w-4xl w-full relative z-10">
        {/* Readability scrim: a soft dark wash behind the copy so the text
            stays legible over the busy grunge / red-glow backdrop on any
            chapter. */}
        <div className="pointer-events-none absolute -inset-x-8 -inset-y-12 -z-10 rounded-[2rem] bg-black/55 blur-2xl" />

        <div className="mb-8">
          <span className="text-neon-blue text-xs font-stencil tracking-[0.4em] uppercase mb-4 flex items-center gap-3">
            <span className="inline-block w-8 h-px bg-neon-blue/60" />
            Chapitre {String(chapter.id).padStart(2, '0')} — {chapter.subtitle}
          </span>

          <h2
            className={`font-display text-6xl md:text-8xl text-bone tracking-wide uppercase leading-[0.9] [text-shadow:0_2px_24px_rgba(0,0,0,0.9),0_0_3px_rgba(232,228,220,0.45)] ${
              chapter.effect === 'glitch' && !reduced ? 'glitch-text' : ''
            }`}
          >
            {chapter.title}
          </h2>
        </div>

        <div className="space-y-6">
          {chapter.content.map((paragraph, index) => (
            <p
              key={index}
              className="text-lg md:text-xl text-white leading-relaxed font-normal [text-shadow:0_1px_2px_rgba(0,0,0,1),0_2px_14px_rgba(0,0,0,0.95)]"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {chapter.memoryFragment && (
          <div className="mt-16 pt-8 border-t border-white/10">
            <span className="block mb-2 text-[10px] uppercase tracking-[0.5em] text-neon-purple/70">
              Fragment de mémoire
            </span>
            <p className="text-sm md:text-base font-mono italic text-neon-purple [text-shadow:0_2px_10px_rgba(0,0,0,0.9)]">
              {chapter.memoryFragment}
            </p>
          </div>
        )}
      </div>

      <div className="absolute left-1/2 bottom-0 w-px h-16 bg-gradient-to-t from-neon-blue/20 to-transparent -translate-x-1/2" />
    </section>
  );
}

export default memo(ChapterSection);
