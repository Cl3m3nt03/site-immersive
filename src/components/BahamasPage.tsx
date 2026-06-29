import { motion } from 'framer-motion';

// The forward-looking chapter: DeShawn the businessman turns street money into
// a legitimate empire — the "Bahamas" nightclub is his showpiece / front.
// A club flyer rather than a chapter: big neon sign + opening details.
const DETAILS = [
  { label: 'Ouverture', value: 'Bientôt' },
  { label: 'Lieu', value: 'Los Santos' },
  { label: 'Accès', value: 'VIP · Privé' },
];

export default function BahamasPage() {
  return (
    <div className="concrete-bg relative h-full w-full overflow-hidden flex items-center justify-center px-6">
      {/* warm club glow */}
      <div
        className="pointer-events-none absolute inset-0 mix-blend-screen opacity-60"
        style={{
          background:
            'radial-gradient(70% 60% at 50% 35%, rgba(242,194,0,0.22) 0%, transparent 55%), radial-gradient(80% 70% at 50% 100%, rgba(184,29,29,0.3) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-stencil text-[10px] md:text-xs uppercase tracking-[0.6em] text-neon-blue/70"
        >
          Le futur · façade légitime
        </motion.p>

        {/* Neon sign */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          className="font-display text-7xl md:text-[10rem] uppercase leading-none tracking-tight text-bone my-4"
          style={{
            textShadow:
              '0 0 18px rgba(242,194,0,0.55), 0 0 48px rgba(242,194,0,0.35), 0 0 80px rgba(184,29,29,0.4)',
          }}
        >
          Bahamas
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="font-stencil text-xs md:text-sm uppercase tracking-[0.5em] text-neon-purple"
        >
          Club privé — Boîte de nuit
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="my-8 h-px w-40 bg-gradient-to-r from-transparent via-neon-blue to-transparent"
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-xl text-sm md:text-base leading-relaxed text-gray-300 font-light"
        >
          DeShawn transforme l’argent de la rue en empire légal. Le{' '}
          <span className="text-neon-blue">Bahamas</span> est sa vitrine : lumières,
          musique, alcool — et, sous la table, le vrai pouvoir. Entrepreneur respecté
          le jour, boss d’un empire silencieux la nuit.
        </motion.p>

        {/* Opening details */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 flex flex-wrap items-stretch justify-center gap-4"
        >
          {DETAILS.map((d) => (
            <div
              key={d.label}
              className="taped min-w-[150px] border border-white/10 bg-black/60 px-6 py-4"
            >
              <p className="font-stencil text-[9px] uppercase tracking-[0.4em] text-neon-blue/70">
                {d.label}
              </p>
              <p className="font-display text-2xl uppercase tracking-wide text-bone mt-1">
                {d.value}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
