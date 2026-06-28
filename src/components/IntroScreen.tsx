import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { INTRO_DATA } from "../data/story";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

interface IntroScreenProps {
  onComplete: () => void;
}

export default function IntroScreen({ onComplete }: IntroScreenProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const reduced = usePrefersReducedMotion();
  const total = INTRO_DATA.scenes.length;

  const skip = useCallback(() => onComplete(), [onComplete]);

  useEffect(() => {
    if (currentScene < total) {
      const timer = setTimeout(() => setCurrentScene((p) => p + 1), reduced ? 1600 : 3500);
      return () => clearTimeout(timer);
    }
    onComplete();
  }, [currentScene, onComplete, reduced, total]);

  // Skip on Escape or Enter
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [skip]);

  return (
    <motion.div
      key="intro"
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background px-8 cursor-pointer"
      onClick={skip}
      role="button"
      aria-label="Passer l'introduction"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene}
          initial={{ opacity: 0, y: reduced ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduced ? 0 : -10 }}
          transition={{ duration: reduced ? 0.4 : 1.5, ease: "easeInOut" }}
          className="max-w-2xl text-center"
        >
          <p className="text-xl md:text-3xl font-light tracking-widest text-white/90 italic">
            {INTRO_DATA.scenes[currentScene]}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Scene progress */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2">
        {INTRO_DATA.scenes.map((_, i) => (
          <div
            key={i}
            className={`h-px transition-all duration-500 ${
              i === currentScene ? "w-8 bg-neon-blue" : "w-3 bg-white/15"
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-white/20">
        The Silent Rise — DeShawn Carter
      </div>

      {/* Skip button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          skip();
        }}
        className="absolute bottom-10 right-10 group flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/30 hover:text-neon-blue transition-colors duration-300"
      >
        <span>Passer</span>
        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </button>
    </motion.div>
  );
}
