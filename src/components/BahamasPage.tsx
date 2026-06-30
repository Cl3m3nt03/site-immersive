import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import {
  MapPin,
  Target,
  Wine,
  Boxes,
  Users,
  Shirt,
  HeartHandshake,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Bahama Mamas West — Dossier de demande de reprise d'entreprise (GTA RP).
// DeShawn Carter rachète le club de West Vinewood : sa vitrine légale.
// Structure calquée sur le dossier Tequi-la-la (emplacement, présentation,
// missions, matériel, hiérarchie, tenues, bénéfice serveur) + une affiche prix.
// ---------------------------------------------------------------------------

const PINK = '#ff2d8e';
const PINK_SOFT = 'rgba(255,45,142,0.55)';

const ZONES = [
  {
    title: 'Salle principale',
    body: 'Bar central, dancefloor et scène DJ. Le cœur des soirées, ouvert à toute la clientèle.',
  },
  {
    title: 'Carré VIP',
    body: 'Banquettes privées, bouteilles premium et accès filtré. Pour la clientèle qui veut le calme et le luxe.',
  },
  {
    title: 'Réserve & sécurité',
    body: 'Stock alcool, coffre, loge du personnel et poste sécurité à l’entrée.',
  },
];

const MISSIONS = [
  'Faire du Bahama Mamas une vitrine légale propre et rentable, façade respectable de l’empire Carter.',
  'Redonner vie à la nuit de West Vinewood : soirées régulières, concerts, événements exceptionnels.',
  'Accueillir tout type de clientèle sans débordement, avec une sécurité présente mais discrète.',
  'Offrir un service rapide, ordonné et précis ; une partie VIP pour les moments plus tranquilles.',
  'Créer une bonne entente en ville et fidéliser une clientèle qui revient pour l’ambiance.',
];

// Affiche prix — La Carte (tarifs RP en $).
const MENU = [
  {
    cat: 'Au comptoir',
    items: [
      ['Bière pression', '$15'],
      ['Soft / Energy', '$10'],
      ['Shot maison', '$20'],
      ['Verre de vin', '$18'],
    ],
  },
  {
    cat: 'Cocktails signature',
    items: [
      ['Bahama Mama', '$45'],
      ['Vinewood Sunset', '$40'],
      ['Carter Old Fashioned', '$50'],
      ['Neon Martini', '$42'],
    ],
  },
  {
    cat: 'Bouteilles & VIP',
    items: [
      ['Champagne', '$350'],
      ['Vodka premium', '$280'],
      ['Whisky d’exception', '$320'],
      ['Table VIP (soirée)', '$1 000'],
    ],
  },
];

const MATERIEL = [
  ['Service', 'Bar, frigos, coffre de stockage, verrerie, sono & enceintes.'],
  ['Sécurité', 'Matraque ou taser, talkies, poste de fouille à l’entrée.'],
  ['Ambiance', 'Jeu de lumières néon, micro DJ, platines, fumée.'],
  ['Personnel', '2 agents de sécurité, serveurs, barmen et un animateur / DJ.'],
];

const HIERARCHIE = [
  ['Patron', 'DeShawn Carter — propriétaire et gérant de l’entreprise.'],
  ['Co-patron', 'Mêmes droits que le patron, gère le club en son absence.'],
  ['Chef de rang', 'Gère le personnel et la coordination pendant les soirées.'],
  ['Serveur', 'À l’écoute des clients, prend et apporte les commandes.'],
  ['Barman', 'Prépare les commandes transmises par les serveurs.'],
  ['Sécurité', 'Filtre l’entrée, fouille et calme les débordements.'],
  ['DJ / Animateur', 'Anime les soirées, gère la musique et les événements.'],
];

export default function BahamasPage() {
  const base = import.meta.env.BASE_URL;
  return (
    <div className="concrete-bg relative h-full w-full overflow-y-auto no-scrollbar">
      {/* Faint street backdrop over the whole dossier */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center opacity-[0.12]"
        style={{ backgroundImage: `url(${base}bahamas/street.jpg)` }}
      />
      <div className="pointer-events-none fixed inset-0 z-0 bg-black/70" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 pb-32">
        {/* ----------------------------------------------------------------- */}
        {/* HERO                                                              */}
        {/* ----------------------------------------------------------------- */}
        <section className="relative pt-24 md:pt-28">
          <div className="relative overflow-hidden border border-white/10">
            <img
              src={`${base}bahamas/sign.jpg`}
              alt="Enseigne néon du Bahama Mamas West"
              className="h-[42vh] w-full object-cover md:h-[52vh]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="font-stencil text-[10px] uppercase tracking-[0.5em] md:text-xs"
                style={{ color: PINK }}
              >
                Dossier de reprise d’entreprise
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-display text-5xl uppercase leading-none tracking-tight text-bone md:text-7xl"
                style={{ textShadow: `0 0 24px ${PINK_SOFT}, 0 0 60px rgba(255,45,142,0.3)` }}
              >
                Bahama Mamas
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="mt-2 font-condensed text-xs uppercase tracking-[0.4em] text-white/60 md:text-sm"
              >
                West Vinewood · Los Santos — par DeShawn Carter
              </motion.p>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* EMPLACEMENT                                                       */}
        {/* ----------------------------------------------------------------- */}
        <Section icon={<MapPin size={16} />} title="Emplacement">
          <p className="leading-relaxed text-gray-300">
            Le Bahama Mamas est une boîte de nuit emblématique située à{' '}
            <span style={{ color: PINK }}>West Vinewood</span>, en plein cœur de la
            vie nocturne de Los Santos. Le bâtiment se décompose en trois zones :
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {ZONES.map((z) => (
              <div key={z.title} className="taped border border-white/10 bg-black/60 p-5">
                <p
                  className="font-stencil text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: PINK }}
                >
                  {z.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">{z.body}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ----------------------------------------------------------------- */}
        {/* PRÉSENTATION                                                      */}
        {/* ----------------------------------------------------------------- */}
        <Section icon={<Wine size={16} />} title="Présentation">
          <div className="space-y-4 leading-relaxed text-gray-300">
            <p>
              Le Bahama Mamas est un club basé sur West Vinewood, reconnaissable à
              son enseigne néon rose. On y vient pour la musique, l’alcool et
              l’ambiance — un lieu prêt à accueillir tout client, avec des horaires
              stables et des soirées soignées.
            </p>
            <p>
              Sous la direction de <span style={{ color: PINK }}>DeShawn Carter</span>,
              le club devient la vitrine légitime d’un entrepreneur respecté : les
              lumières masquent le sérieux d’une gestion carrée. L’objectif est
              simple — un club propre, rentable et incontournable de la nuit de Los
              Santos. La radio diffusée dans tout le bâtiment est{' '}
              <span className="text-bone">Non-Stop-Pop FM</span>.
            </p>
          </div>
        </Section>

        {/* ----------------------------------------------------------------- */}
        {/* MISSIONS                                                          */}
        {/* ----------------------------------------------------------------- */}
        <Section icon={<Target size={16} />} title="Missions de l’entreprise">
          <ul className="space-y-3">
            {MISSIONS.map((m, i) => (
              <li key={i} className="flex gap-3 text-gray-300">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 -rotate-45"
                  style={{ backgroundColor: PINK }}
                />
                <span className="leading-relaxed">{m}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* ----------------------------------------------------------------- */}
        {/* AFFICHE PRIX — LA CARTE                                           */}
        {/* ----------------------------------------------------------------- */}
        <Section icon={<Wine size={16} />} title="La Carte — Affiche prix">
          <div
            className="relative overflow-hidden border bg-black/70 p-6 md:p-8"
            style={{ borderColor: PINK_SOFT, boxShadow: `0 0 40px rgba(255,45,142,0.12) inset` }}
          >
            <p
              className="text-center font-display text-3xl uppercase tracking-wide text-bone md:text-4xl"
              style={{ textShadow: `0 0 18px ${PINK_SOFT}` }}
            >
              Bahama Mamas
            </p>
            <p className="mb-6 text-center font-stencil text-[10px] uppercase tracking-[0.5em] text-white/50">
              Tarifs maison
            </p>
            <div className="grid gap-8 md:grid-cols-3">
              {MENU.map((col) => (
                <div key={col.cat}>
                  <p
                    className="mb-3 border-b pb-2 font-stencil text-[11px] uppercase tracking-[0.25em]"
                    style={{ color: PINK, borderColor: 'rgba(255,255,255,0.12)' }}
                  >
                    {col.cat}
                  </p>
                  <ul className="space-y-2">
                    {col.items.map(([name, price]) => (
                      <li
                        key={name}
                        className="flex items-baseline justify-between gap-2 text-sm"
                      >
                        <span className="text-gray-300">{name}</span>
                        <span className="flex-1 translate-y-[-3px] border-b border-dotted border-white/15" />
                        <span className="font-condensed tabular-nums text-bone">{price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-[10px] uppercase tracking-[0.3em] text-white/30">
              Prix indicatifs · service à table en VIP
            </p>
          </div>
        </Section>

        {/* ----------------------------------------------------------------- */}
        {/* MATÉRIEL                                                          */}
        {/* ----------------------------------------------------------------- */}
        <Section icon={<Boxes size={16} />} title="Matériel">
          <div className="grid gap-4 md:grid-cols-2">
            {MATERIEL.map(([label, body]) => (
              <div key={label} className="border border-white/10 bg-black/50 p-5">
                <p
                  className="font-stencil text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: PINK }}
                >
                  {label}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">{body}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ----------------------------------------------------------------- */}
        {/* HIÉRARCHIE                                                        */}
        {/* ----------------------------------------------------------------- */}
        <Section icon={<Users size={16} />} title="Hiérarchie">
          <div className="space-y-px overflow-hidden border border-white/10">
            {HIERARCHIE.map(([role, body]) => (
              <div
                key={role}
                className="grid grid-cols-1 gap-1 bg-black/50 p-4 md:grid-cols-[160px_1fr] md:gap-4"
              >
                <p
                  className="font-stencil text-[11px] uppercase tracking-[0.2em]"
                  style={{ color: PINK }}
                >
                  {role}
                </p>
                <p className="text-sm leading-relaxed text-gray-300">{body}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ----------------------------------------------------------------- */}
        {/* TENUES                                                            */}
        {/* ----------------------------------------------------------------- */}
        <Section icon={<Shirt size={16} />} title="Tenues">
          <p className="leading-relaxed text-gray-300">
            Tenue dédiée au club : costume sombre élégant, chemise noire ou rose
            poudré rappelant le néon de l’enseigne, le tout net et soigné. La
            sécurité porte une tenue plus stricte et identifiable. L’objectif est
            une image chic et reconnaissable, à la hauteur de la vitrine Carter.
          </p>
        </Section>

        {/* ----------------------------------------------------------------- */}
        {/* BÉNÉFICE SERVEUR                                                  */}
        {/* ----------------------------------------------------------------- */}
        <Section icon={<HeartHandshake size={16} />} title="Bénéfice pour le serveur">
          <p className="leading-relaxed text-gray-300">
            Le Bahama Mamas apporte plus d’interactions avec les citoyens et plus de
            scènes légales sur un serveur souvent dominé par l’illégal. Il donne un
            lieu où se divertir et décompresser en RP, ramène de l’animation sur
            Vinewood et en ville, et implique le groupe de DeShawn Carter dans le
            légal — créant un pont naturel entre les deux mondes.
          </p>
        </Section>

        <footer className="mt-20 flex flex-col items-center border-t border-white/5 pt-10">
          <p className="font-stencil text-[10px] uppercase tracking-[0.4em] text-white/25">
            Bahama Mamas West · Demande de reprise
          </p>
          <div className="mt-4 h-px w-16" style={{ backgroundColor: PINK_SOFT }} />
        </footer>
      </div>
    </div>
  );
}

// Reusable dossier section with scroll-reveal heading.
function Section({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="mt-16"
    >
      <div className="mb-6 flex items-center gap-3">
        <span style={{ color: PINK }}>{icon}</span>
        <h2 className="font-display text-2xl uppercase tracking-wide text-bone md:text-3xl">
          {title}
        </h2>
        <span className="ml-2 h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
      </div>
      {children}
    </motion.section>
  );
}
