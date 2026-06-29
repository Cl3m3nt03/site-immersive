import { motion, useInView } from "framer-motion";
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

  // Per-character reveal for the chapter title (skipped when reduce-motion is on)
  const titleChars = Array.from(chapter.title);

  return (
    <section
      ref={ref}
      // content-visibility skips layout/paint for the off-screen chapters
      // (10 full-height sections otherwise all paint every frame). The
      // intrinsic-size hint keeps the scrollbar stable while they're skipped.
      className={`relative min-h-screen w-full flex flex-col items-center justify-center py-32 px-6 overflow-hidden border-b border-white/5 transition-colors duration-1000 [content-visibility:auto] [contain-intrinsic-size:auto_100vh] ${
        isInView && chapter.effect === 'blood' ? 'bg-crimson/5' : ''
      }`}
    >
      {renderVisualEffects()}

      <div className="max-w-4xl w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, x: reduced ? 0 : -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.5 }}
          className="mb-8"
        >
          <span className="text-neon-blue text-xs font-mono tracking-[0.4em] uppercase mb-4 block">
            Chapitre {chapter.id} — {chapter.subtitle}
          </span>

          <h2
            className={`text-4xl md:text-7xl font-bold text-white tracking-tighter uppercase leading-none ${
              chapter.effect === 'glitch' && !reduced ? 'glitch-text' : ''
            }`}
            aria-label={chapter.title}
          >
            {reduced
              ? chapter.title
              : titleChars.map((ch, i) => (
                  <motion.span
                    key={i}
                    aria-hidden
                    className="inline-block"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.035,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {ch === ' ' ? ' ' : ch}
                  </motion.span>
                ))}
          </h2>
        </motion.div>

        <div className="space-y-6">
          {chapter.content.map((paragraph, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: reduced ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
              viewport={{ once: true, amount: 0.5 }}
              className="text-lg md:text-xl text-gray-400 leading-relaxed font-light"
            >
              {paragraph}
            </motion.p>
          ))}
        </div>

        {chapter.memoryFragment && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="mt-16 pt-8 border-t border-white/5"
          >
            <div className="group cursor-help relative inline-block">
              <span className="text-[10px] uppercase tracking-[0.5em] text-white/30 group-hover:text-neon-purple transition-colors duration-500">
                Fragment de mémoire
              </span>
              <div className="mt-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-700 ease-out">
                <p className="text-sm font-mono italic text-neon-purple/80 shadow-neon-purple">
                  {chapter.memoryFragment}
                </p>
              </div>
              <div className="absolute -inset-2 bg-neon-purple/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full" />
            </div>
          </motion.div>
        )}
      </div>

      <div className="absolute left-1/2 bottom-0 w-px h-16 bg-gradient-to-t from-neon-blue/20 to-transparent -translate-x-1/2" />
    </section>
  );
}

export default memo(ChapterSection);
