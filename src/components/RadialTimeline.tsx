import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { STORY_DATA, type Chapter } from '../data/story';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import CountUp from './CountUp';

// Lightweight replacement for the Three.js MemorySphere: chapters sit on a
// slowly rotating ring (pure CSS transforms + framer-motion), so the whole
// view ships without the ~1.17 MB three/drei/postprocessing chunk.
export default function RadialTimeline() {
  const reduced = usePrefersReducedMotion();
  const [selected, setSelected] = useState<Chapter | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const activeId = selected?.id ?? hoveredId;
  // Pause the orbit while reading a memory (or if the user prefers no motion).
  const paused = selected !== null || reduced;

  const spinDuration = 90; // seconds for a full revolution
  const ringStyle = {
    animation: `ringspin ${spinDuration}s linear infinite`,
    animationPlayState: paused ? ('paused' as const) : ('running' as const),
  };
  const counterStyle = {
    animation: `ringspin-rev ${spinDuration}s linear infinite`,
    animationPlayState: paused ? ('paused' as const) : ('running' as const),
  };

  const nodes = useMemo(
    () => STORY_DATA.map((chapter, i) => ({
      chapter,
      angle: (i / STORY_DATA.length) * 360,
    })),
    []
  );

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#030303]">
      {/* Ambient radial glow behind the ring */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60"
        style={{
          background:
            'radial-gradient(circle, rgba(188,19,254,0.10) 0%, rgba(0,242,255,0.05) 35%, transparent 65%)',
        }}
      />

      {/* HUD — bottom-right status */}
      <div className="absolute bottom-12 right-12 z-10 text-right pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md border border-white/5 p-6 rounded-lg shadow-2xl">
          <p className="text-[10px] text-neon-blue uppercase tracking-[0.5em] mb-4 font-bold">
            Core Status: {selected ? 'LOCKED' : 'SCANNING'}
          </p>
          <div className="flex items-baseline justify-end gap-2">
            <CountUp value={27} className="text-4xl font-black text-white tabular-nums leading-none" />
            <span className="text-[9px] text-neon-purple uppercase tracking-[0.4em]">ans · subject age</span>
          </div>
        </div>
      </div>

      {/* Hint */}
      <div className="absolute bottom-12 left-12 z-10 pointer-events-none text-[10px] font-mono uppercase tracking-[0.4em] text-white/25">
        {selected ? 'Fermez pour revenir à l’orbite' : 'Cliquez un fragment de mémoire'}
      </div>

      {/* Rotating ring */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={ringStyle}>
        {/* Central core */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={counterStyle}>
          <div className="relative h-24 w-24 -translate-x-1/2 -translate-y-1/2">
            <div className="absolute inset-0 rounded-full bg-neon-purple/20 blur-2xl" />
            <div className="absolute inset-4 rounded-full border border-neon-purple/40 bg-black/60 backdrop-blur-sm shadow-[0_0_40px_rgba(188,19,254,0.5)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[8px] font-mono uppercase tracking-[0.3em] text-neon-blue/70">CORE</span>
            </div>
          </div>
        </div>

        {nodes.map(({ chapter, angle }) => {
          const isActive = activeId === chapter.id;
          return (
            <div
              key={chapter.id}
              className="absolute left-0 top-0"
              // Place the node out on the ring, then undo the angle so the
              // node's local frame is upright relative to the ring.
              style={{ transform: `rotate(${angle}deg) translateX(38vmin) rotate(${-angle}deg)` }}
            >
              {/* Spoke line from node back to the core */}
              <div
                className="absolute left-0 top-0 h-px origin-left"
                style={{
                  width: '38vmin',
                  transform: `rotate(${angle + 180}deg)`,
                  background: `linear-gradient(to right, ${isActive ? 'rgba(0,242,255,0.5)' : 'rgba(188,19,254,0.18)'}, transparent)`,
                }}
              />

              {/* Counter-rotate so the label stays upright as the ring spins */}
              <div style={counterStyle}>
                <button
                  onMouseEnter={() => setHoveredId(chapter.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => setSelected(chapter)}
                  className="group relative -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-full border text-sm font-black tabular-nums transition-all duration-300 ${
                      isActive
                        ? 'border-neon-blue bg-neon-blue/15 text-neon-blue scale-125 shadow-[0_0_30px_rgba(0,242,255,0.6)]'
                        : 'border-neon-purple/50 bg-black/70 text-white/80 shadow-[0_0_15px_rgba(188,19,254,0.35)] group-hover:border-neon-blue'
                    }`}
                  >
                    {String(chapter.id).padStart(2, '0')}
                  </span>
                  <span
                    className={`mt-2 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${
                      isActive ? 'text-neon-blue' : 'text-white/40 group-hover:text-white/70'
                    }`}
                  >
                    {chapter.title}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelected(null)}
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6"
          >
            <motion.div
              key="card"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-2xl border border-white/15 bg-black/90 p-8 shadow-[0_0_80px_rgba(0,0,0,1)]"
            >
              <div className="absolute -top-1 left-1/2 h-1 w-20 -translate-x-1/2 rounded-full bg-neon-blue shadow-[0_0_15px_#00f2ff]" />

              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 text-white/40 transition-colors hover:text-neon-blue"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>

              <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-neon-blue opacity-70">
                Memory Block {String(selected.id).padStart(2, '0')}
              </span>
              <h3 className="mt-2 text-4xl font-black uppercase tracking-tighter text-white">
                {selected.title}
              </h3>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.3em] text-neon-purple opacity-90">
                {selected.subtitle}
              </p>

              <div className="my-5 h-px w-full bg-white/10" />

              {selected.content.map((para, i) => (
                <p key={i} className="mb-3 text-sm leading-relaxed text-gray-300">
                  {para}
                </p>
              ))}

              {selected.memoryFragment && (
                <p className="mt-5 border-l-2 border-neon-purple/60 pl-4 text-[13px] italic leading-relaxed text-neon-blue/80">
                  "{selected.memoryFragment}"
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
