import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { STORY_DATA, type Chapter } from '../data/story';

// Evidence-board / level-path take on the case file: the chapters are pinned
// down a winding red "string", click one to open its modal. Pure CSS + SVG,
// no Three.js. Replaces the rotating sphere/ring.
const ROW_UNITS = 12; // viewBox vertical units per node

export default function DossierBoard() {
  const [selected, setSelected] = useState<Chapter | null>(null);

  const total = STORY_DATA.length;
  const vbHeight = total * ROW_UNITS;

  // Node positions in a 0..100 (x) by 0..vbHeight (y) space. Gentle S-curve so
  // it reads like a path winding down a board rather than a hard zigzag.
  const nodes = useMemo(
    () => STORY_DATA.map((chapter, i) => ({
      chapter,
      x: 50 + 26 * Math.sin(i * 0.85),
      y: i * ROW_UNITS + ROW_UNITS / 2,
    })),
    []
  );

  // Smooth SVG path (quadratic midpoints) threading every node.
  const pathD = useMemo(() => {
    if (nodes.length < 2) return '';
    let d = `M ${nodes[0].x} ${nodes[0].y}`;
    for (let i = 1; i < nodes.length; i++) {
      const prev = nodes[i - 1];
      const cur = nodes[i];
      const midY = (prev.y + cur.y) / 2;
      d += ` C ${prev.x} ${midY}, ${cur.x} ${midY}, ${cur.x} ${cur.y}`;
    }
    return d;
  }, [nodes]);

  return (
    <div className="concrete-bg relative h-full w-full overflow-y-auto no-scrollbar">
      {/* Board heading (the app header already shows the name top-left) */}
      <div className="flex items-center justify-center gap-4 px-8 pt-12 pb-8 pointer-events-none">
        <span className="h-px w-10 bg-neon-blue/50" />
        <p className="font-stencil text-[10px] md:text-xs uppercase tracking-[0.5em] text-neon-blue/80">
          Dossier d’enquête — {total} pièces
        </p>
        <span className="h-px w-10 bg-neon-blue/50" />
      </div>

      {/* The winding path */}
      <div className="relative mx-auto w-full max-w-3xl px-6 pb-24" style={{ height: `${total * 150}px` }}>
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 100 ${vbHeight}`}
          preserveAspectRatio="none"
          aria-hidden
        >
          <path d={pathD} fill="none" stroke="rgba(184,29,29,0.55)" strokeWidth="0.5" strokeDasharray="1.6 1.4" vectorEffect="non-scaling-stroke" />
        </svg>

        {nodes.map(({ chapter, x, y }) => {
          const side = x < 50 ? 'right' : 'left'; // which side the label sits
          return (
            <button
              key={chapter.id}
              onClick={() => setSelected(chapter)}
              className="group absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-3"
              style={{ left: `${x}%`, top: `${(y / vbHeight) * 100}%`, flexDirection: side === 'left' ? 'row' : 'row-reverse' }}
              aria-label={`Pièce ${chapter.id} — ${chapter.title}`}
            >
              {/* Pinned marker */}
              <span className="relative flex h-14 w-14 items-center justify-center border border-neon-purple/60 bg-black/80 font-display text-xl text-bone shadow-[0_0_18px_rgba(184,29,29,0.4)] transition-all duration-300 group-hover:border-neon-blue group-hover:scale-110 group-hover:shadow-[0_0_28px_rgba(242,194,0,0.5)]">
                {/* pin head */}
                <span className="absolute -top-1.5 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-neon-blue shadow-[0_0_8px_#f2c200]" />
                {String(chapter.id).padStart(2, '0')}
              </span>
              {/* Label tab */}
              <span className={`flex flex-col ${side === 'left' ? 'items-start text-left' : 'items-end text-right'}`}>
                <span className="font-stencil text-[9px] uppercase tracking-[0.3em] text-neon-blue/70">
                  Pièce {String(chapter.id).padStart(2, '0')}
                </span>
                <span className="font-display text-lg uppercase tracking-wide text-white/85 leading-none transition-colors duration-300 group-hover:text-neon-blue">
                  {chapter.title}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
          >
            <motion.div
              key="card"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="taped relative w-full max-w-lg border border-white/15 bg-black/90 p-8"
            >
              <div className="caution-tape absolute -top-px left-0 h-1 w-full opacity-60" />

              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 text-white/40 transition-colors hover:text-neon-blue"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>

              <span className="text-[10px] font-stencil uppercase tracking-[0.5em] text-neon-blue opacity-80">
                Pièce N° {String(selected.id).padStart(2, '0')}
              </span>
              <h3 className="mt-2 font-display text-5xl uppercase tracking-wide text-bone leading-none">
                {selected.title}
              </h3>
              <p className="mt-2 text-xs font-stencil uppercase tracking-[0.3em] text-neon-purple opacity-90">
                {selected.subtitle}
              </p>

              <div className="my-5 h-px w-full bg-white/10" />

              {selected.content.map((para, i) => (
                <p key={i} className="mb-3 text-sm leading-relaxed text-gray-300">
                  {para}
                </p>
              ))}

              {selected.memoryFragment && (
                <p className="mt-5 border-l-2 border-neon-purple/70 pl-4 text-[13px] italic leading-relaxed text-neon-blue/85">
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
