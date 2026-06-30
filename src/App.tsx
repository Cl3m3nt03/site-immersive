import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import { STORY_DATA } from "./data/story";
import IntroScreen from "./components/IntroScreen";
import ChapterSection from "./components/ChapterSection";
import AudioPlayer from "./components/AudioPlayer";
import NeonCursor from "./components/NeonCursor";
import Magnetic from "./components/Magnetic";
import DossierBoard from "./components/DossierBoard";
import BahamasPage from "./components/BahamasPage";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { Sparkles, BookOpen, Martini } from "lucide-react";

function App() {
  const reduced = usePrefersReducedMotion();
  const [showIntro, setShowIntro] = useState(
    () => typeof sessionStorage !== "undefined" && sessionStorage.getItem("introSeen") !== "1"
  );
  const [activeTab, setActiveTab] = useState<'story' | 'sphere' | 'bahamas'>('story');
  const [activeChapter, setActiveChapter] = useState(1);

  const completeIntro = useCallback(() => {
    sessionStorage.setItem("introSeen", "1");
    setShowIntro(false);
  }, []);

  // --- Scroll plumbing (Lenis) -------------------------------------------------
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number>(0);
  const cleanupRef = useRef<(() => void) | null>(null);

  // Refs updated imperatively each frame (no React re-render per scroll tick).
  const progressFillRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const chapterRef = useRef(1);
  const chromaTimeout = useRef<number>(0);

  const teardown = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    cleanupRef.current?.();
    cleanupRef.current = null;
    lenisRef.current?.destroy();
    lenisRef.current = null;
  }, []);

  const applyScroll = useCallback((p: number, velocity: number) => {
    // Progress bar fill
    if (progressFillRef.current) progressFillRef.current.style.height = `${p * 100}%`;
    // Background image parallax (subtle drift + slight zoom)
    if (bgRef.current) {
      bgRef.current.style.transform = `scale(1.08) translateY(${(p - 0.5) * -4}%)`;
    }
    // Chromatic aberration burst on fast scroll
    if (contentRef.current && Math.abs(velocity) > 18) {
      contentRef.current.classList.add("chromatic-active");
      window.clearTimeout(chromaTimeout.current);
      chromaTimeout.current = window.setTimeout(
        () => contentRef.current?.classList.remove("chromatic-active"),
        140
      );
    }
    // Active chapter (state only changes at boundaries → cheap)
    const idx = Math.min(STORY_DATA.length, Math.max(1, Math.round(p * (STORY_DATA.length - 1)) + 1));
    if (idx !== chapterRef.current) {
      chapterRef.current = idx;
      setActiveChapter(idx);
    }
  }, []);

  // Callback ref: wires up scrolling when the story view mounts, tears it down on
  // unmount. Honors reduce-motion via native scroll.
  const setStoryScroll = useCallback((node: HTMLElement | null) => {
    teardown();
    if (!node) return;

    if (reduced) {
      const onScroll = () => {
        const max = node.scrollHeight - node.clientHeight;
        applyScroll(max > 0 ? node.scrollTop / max : 0, 0);
      };
      node.addEventListener("scroll", onScroll, { passive: true });
      cleanupRef.current = () => node.removeEventListener("scroll", onScroll);
      return;
    }

    const content = node.firstElementChild as HTMLElement | null;
    if (!content) return;

    const lenis = new Lenis({
      wrapper: node,
      content,
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      syncTouch: true,
    });
    lenisRef.current = lenis;
    lenis.on("scroll", ({ progress, velocity }: { progress: number; velocity: number }) =>
      applyScroll(progress, velocity)
    );

    const raf = (time: number) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);
  }, [teardown, reduced, applyScroll]);

  useEffect(() => teardown, [teardown]);

  const scrollToChapter = useCallback((e: React.MouseEvent, id: number) => {
    e.preventDefault();
    if (lenisRef.current) {
      lenisRef.current.scrollTo(`#chapter-${id}`, { offset: 0, duration: 1.6 });
    } else {
      document.getElementById(`chapter-${id}`)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    }
  }, [reduced]);

  return (
    <div className="relative min-h-screen bg-background selection:bg-neon-blue/30 selection:text-white">
      <NeonCursor />

      {/* Background Atmosphere — story view only (other tabs paint their own).
          Drop a photo at public/bg.jpg to set the backdrop; if it's missing
          the layer is simply transparent and the gradients below carry the
          mood, so nothing breaks. */}
      {activeTab === 'story' && (
        <>
          {/* Concrete base (+ optional photo at public/bg.jpg) with parallax */}
          <div
            ref={bgRef}
            className="concrete-bg fixed inset-0 z-0 pointer-events-none will-change-transform bg-cover bg-center"
            style={{
              transform: "scale(1.08)",
              backgroundImage: `url(${import.meta.env.BASE_URL}bg.jpg)`,
            }}
          />
          {/* Darken so text stays readable over any photo */}
          <div className="fixed inset-0 z-[1] pointer-events-none bg-black/55" />
          <div className="fixed inset-0 z-[1] pointer-events-none bg-gradient-to-b from-black/65 via-black/25 to-black/75" />
          {/* Crimson spray glow — street accent instead of neon */}
          <div
            className="fixed inset-0 z-[1] pointer-events-none mix-blend-screen opacity-50"
            style={{
              background:
                "radial-gradient(90% 70% at 82% 12%, rgba(184,29,29,0.55) 0%, transparent 55%), radial-gradient(70% 60% at 10% 95%, rgba(242,194,0,0.18) 0%, transparent 55%)",
            }}
          />
          {/* Caution tape strip skewed across a corner */}
          <div className="caution-tape fixed -left-20 top-24 z-[2] h-8 w-[60vw] -rotate-[8deg] opacity-[0.14] pointer-events-none" />
          <div className="fixed inset-0 z-[2] pointer-events-none [box-shadow:inset_0_0_180px_50px_rgba(0,0,0,0.78)]" />
          <div className="noise-overlay" />
          <div className="rain-overlay" />
        </>
      )}

      <AudioPlayer />

      <AnimatePresence mode="wait">
        {showIntro ? (
          <IntroScreen key="intro" onComplete={completeIntro} />
        ) : (
          <motion.div
            key="content"
            // No entrance opacity fade here: if the tab loses focus during the
            // animation, requestAnimationFrame pauses and the fade can freeze
            // partway, leaving the whole récit dimmed/illegible. Content is
            // shown at full opacity from the start.
            className="h-screen flex flex-col"
          >
            {/* Warp flash on tab switch */}
            {!reduced && <WarpFlash trigger={activeTab} />}

            {/* Top Tabs (magnetic) */}
            <nav className="fixed top-8 right-12 z-[100] flex gap-8">
              <Magnetic strength={0.5}>
                <button
                  onClick={() => setActiveTab('story')}
                  className={`flex items-center gap-2 font-condensed text-xs uppercase tracking-[0.35em] transition-colors duration-300 focus:outline-none focus-visible:text-neon-blue ${
                    activeTab === 'story' ? 'text-neon-blue' : 'text-white/30 hover:text-white/70'
                  }`}
                >
                  <BookOpen size={13} />
                  <span>Récit</span>
                  {activeTab === 'story' && <motion.div layoutId="tab-underline" className="absolute -bottom-2 left-0 right-0 h-px bg-neon-blue" />}
                </button>
              </Magnetic>
              <Magnetic strength={0.5}>
                <button
                  onClick={() => setActiveTab('sphere')}
                  className={`flex items-center gap-2 font-condensed text-xs uppercase tracking-[0.35em] transition-colors duration-300 focus:outline-none focus-visible:text-neon-purple ${
                    activeTab === 'sphere' ? 'text-neon-purple' : 'text-white/30 hover:text-white/70'
                  }`}
                >
                  <Sparkles size={13} />
                  <span>Dossier</span>
                  {activeTab === 'sphere' && <motion.div layoutId="tab-underline" className="absolute -bottom-2 left-0 right-0 h-px bg-neon-purple" />}
                </button>
              </Magnetic>
              <Magnetic strength={0.5}>
                <button
                  onClick={() => setActiveTab('bahamas')}
                  className={`flex items-center gap-2 font-condensed text-xs uppercase tracking-[0.35em] transition-colors duration-300 focus:outline-none focus-visible:text-neon-blue ${
                    activeTab === 'bahamas' ? 'text-neon-blue' : 'text-white/30 hover:text-white/70'
                  }`}
                >
                  <Martini size={13} />
                  <span>Bahamas</span>
                  {activeTab === 'bahamas' && <motion.div layoutId="tab-underline" className="absolute -bottom-2 left-0 right-0 h-px bg-neon-blue" />}
                </button>
              </Magnetic>
            </nav>

            {/* Header */}
            <header className="fixed top-8 left-8 z-50 flex flex-col">
              <h1 className="font-display text-3xl tracking-wide uppercase text-bone leading-none">
                DeShawn <span className="text-neon-purple">Carter</span>
              </h1>
              <span className="text-[10px] tracking-[0.5em] uppercase text-neon-blue/70 font-stencil mt-0.5">
                The Silent Rise
              </span>
            </header>

            {/* Scroll progress (story only) */}
            <AnimatePresence>
              {activeTab === 'story' && (
                <motion.div
                  key="progress"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center gap-3"
                >
                  <span className="text-[11px] font-stencil text-neon-blue/80 tracking-widest tabular-nums">
                    {String(activeChapter).padStart(2, '0')}
                  </span>
                  <div className="relative w-0.5 h-40 bg-white/10 overflow-hidden">
                    <div
                      ref={progressFillRef}
                      className="absolute top-0 left-0 w-full bg-gradient-to-b from-neon-blue to-neon-purple"
                      style={{ height: "0%" }}
                    />
                  </div>
                  <span className="text-[11px] font-stencil text-white/30 tracking-widest tabular-nums">
                    {String(STORY_DATA.length).padStart(2, '0')}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chapter navigation */}
            <AnimatePresence>
              {activeTab === 'story' && (
                <motion.nav
                  key="chapter-nav"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4"
                >
                  {STORY_DATA.map((chapter) => {
                    const active = chapter.id === activeChapter;
                    return (
                      <a
                        key={chapter.id}
                        href={`#chapter-${chapter.id}`}
                        onClick={(e) => scrollToChapter(e, chapter.id)}
                        className="group relative flex items-center justify-end"
                        aria-label={`Chapitre ${chapter.id} — ${chapter.title}`}
                      >
                        <span className={`mr-4 text-[10px] font-stencil tracking-widest transition-all duration-300 uppercase ${
                          active ? 'text-neon-blue' : 'text-white/0 group-hover:text-neon-blue'
                        }`}>
                          {chapter.title}
                        </span>
                        <div className={`transition-all duration-300 ${
                          active
                            ? 'w-3 h-3 bg-neon-blue shadow-[0_0_12px_#f2c200] -rotate-45'
                            : 'w-1.5 h-1.5 bg-white/15 group-hover:bg-neon-blue group-hover:scale-125'
                        }`} />
                      </a>
                    );
                  })}
                </motion.nav>
              )}
            </AnimatePresence>

            <div className="flex-1 overflow-hidden relative">
              <AnimatePresence mode="wait">
                {activeTab === 'story' ? (
                  <motion.main
                    key="story-view"
                    ref={setStoryScroll}
                    // Start visible. A 0→1 fade here freezes if the tab is
                    // unfocused on load (rAF paused), leaving the récit dim.
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="h-full overflow-y-auto no-scrollbar"
                  >
                    <div ref={contentRef} className="flex flex-col">
                      {STORY_DATA.map((chapter) => (
                        <div key={chapter.id} id={`chapter-${chapter.id}`}>
                          <ChapterSection chapter={chapter} />
                        </div>
                      ))}

                      <footer className="py-24 flex flex-col items-center justify-center border-t border-white/5 bg-black/40">
                        <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 mb-4">
                          Expérience Narrative Immersive
                        </p>
                        <div className="w-12 h-px bg-neon-blue/30" />
                      </footer>
                    </div>
                  </motion.main>
                ) : activeTab === 'sphere' ? (
                  <motion.div
                    key="sphere-view"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="relative z-20 h-full w-full"
                  >
                    <DossierBoard />
                  </motion.div>
                ) : (
                  <motion.div
                    key="bahamas-view"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="relative z-20 h-full w-full"
                  >
                    <BahamasPage />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Brief radial "warp" pulse fired whenever the active tab changes. */
function WarpFlash({ trigger }: { trigger: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={trigger}
        initial={{ opacity: 0.5, scale: 0.2 }}
        animate={{ opacity: 0, scale: 2.4 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="pointer-events-none fixed left-1/2 top-1/2 z-[90] h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(242,194,0,0.16) 0%, rgba(184,29,29,0.14) 40%, transparent 70%)",
        }}
      />
    </AnimatePresence>
  );
}


export default App;
