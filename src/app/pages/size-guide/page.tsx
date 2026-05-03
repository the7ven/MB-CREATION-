'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

// ==========================================
// DONNÉES
// ==========================================

type Unit = 'cm' | 'inches';
type Tab = 'women' | 'men' | 'kids';

const womenCm = [
  { frEu: '32', us: '0',  letter: 'XXS', bust: '76–79',   waist: '58–61',   hips: '84–87'   },
  { frEu: '34', us: '2',  letter: 'XS',  bust: '80–83',   waist: '62–65',   hips: '88–91'   },
  { frEu: '36', us: '4',  letter: 'S',   bust: '84–87',   waist: '66–69',   hips: '92–95'   },
  { frEu: '38', us: '6',  letter: 'M',   bust: '88–91',   waist: '70–73',   hips: '96–99'   },
  { frEu: '40', us: '8',  letter: 'L',   bust: '92–95',   waist: '74–77',   hips: '100–103' },
  { frEu: '42', us: '10', letter: 'XL',  bust: '96–99',   waist: '78–81',   hips: '104–107' },
  { frEu: '44', us: '12', letter: 'XL',  bust: '100–103', waist: '82–85',   hips: '108–111' },
  { frEu: '46', us: '14', letter: 'XXL', bust: '104–107', waist: '86–90',   hips: '112–116' },
];

const womenInches = [
  { frEu: '32', us: '0',  letter: 'XXS', bust: '30–31',     waist: '22.5–24', hips: '33–34.5' },
  { frEu: '34', us: '2',  letter: 'XS',  bust: '31.5–32.5', waist: '24.5–25.5', hips: '34.5–36' },
  { frEu: '36', us: '4',  letter: 'S',   bust: '33–34',     waist: '26–27',   hips: '36.5–37.5' },
  { frEu: '38', us: '6',  letter: 'M',   bust: '34.5–36',   waist: '27.5–28.5', hips: '38–39' },
  { frEu: '40', us: '8',  letter: 'L',   bust: '36.5–37.5', waist: '29–30.5', hips: '39.5–40.5' },
  { frEu: '42', us: '10', letter: 'XL',  bust: '38–39',     waist: '30.5–32', hips: '41–42'   },
  { frEu: '44', us: '12', letter: 'XL',  bust: '39.5–40.5', waist: '32.5–33.5', hips: '42.5–43.5' },
  { frEu: '46', us: '14', letter: 'XXL', bust: '41–42',     waist: '34–35.5', hips: '44–45.5' },
];

const menCm = [
  { frEu: '44', us: '34', letter: 'XS',  bust: '85–88',   waist: '73–76',   hips: '87–90'   },
  { frEu: '46', us: '36', letter: 'S',   bust: '89–92',   waist: '77–80',   hips: '91–94'   },
  { frEu: '48', us: '38', letter: 'M',   bust: '93–96',   waist: '81–84',   hips: '95–98'   },
  { frEu: '50', us: '40', letter: 'L',   bust: '97–100',  waist: '85–88',   hips: '99–102'  },
  { frEu: '52', us: '42', letter: 'XL',  bust: '101–104', waist: '89–92',   hips: '103–106' },
  { frEu: '54', us: '44', letter: 'XL',  bust: '105–108', waist: '93–97',   hips: '107–110' },
  { frEu: '56', us: '46', letter: 'XXL', bust: '109–112', waist: '98–102',  hips: '111–114' },
  { frEu: '58', us: '48', letter: 'XXL', bust: '113–116', waist: '103–107', hips: '115–118' },
];

const menInches = [
  { frEu: '44', us: '34', letter: 'XS',  bust: '33.5–34.5', waist: '28.5–30', hips: '34.5–35.5' },
  { frEu: '46', us: '36', letter: 'S',   bust: '35–36',     waist: '30.5–31.5', hips: '36–37'   },
  { frEu: '48', us: '38', letter: 'M',   bust: '36.5–38',   waist: '32–33',   hips: '37.5–38.5' },
  { frEu: '50', us: '40', letter: 'L',   bust: '38.5–39.5', waist: '33.5–34.5', hips: '39–40'   },
  { frEu: '52', us: '42', letter: 'XL',  bust: '40–41',     waist: '35–36',   hips: '40.5–41.5' },
  { frEu: '54', us: '44', letter: 'XL',  bust: '41.5–42.5', waist: '36.5–38', hips: '42–43.5'   },
  { frEu: '56', us: '46', letter: 'XXL', bust: '43–44',     waist: '38.5–40', hips: '44–45'     },
  { frEu: '58', us: '48', letter: 'XXL', bust: '44.5–45.5', waist: '40.5–42', hips: '45.5–46.5' },
];

const kids = [
  { age: '2 ans',  height: '86–92',   bust: '51–53', waist: '50–51', hips: '54–56' },
  { age: '3 ans',  height: '93–98',   bust: '54–55', waist: '52–53', hips: '57–59' },
  { age: '4 ans',  height: '99–104',  bust: '56–58', waist: '54–55', hips: '60–62' },
  { age: '5 ans',  height: '105–110', bust: '59–61', waist: '56–57', hips: '63–65' },
  { age: '6 ans',  height: '111–116', bust: '62–63', waist: '58–59', hips: '66–68' },
  { age: '7 ans',  height: '117–122', bust: '64–66', waist: '60–61', hips: '69–71' },
  { age: '8 ans',  height: '123–128', bust: '67–69', waist: '62–63', hips: '72–74' },
  { age: '9 ans',  height: '129–134', bust: '70–72', waist: '64–65', hips: '75–77' },
  { age: '10 ans', height: '135–140', bust: '73–75', waist: '66–67', hips: '78–80' },
  { age: '11 ans', height: '141–146', bust: '76–78', waist: '68–69', hips: '81–83' },
  { age: '12 ans', height: '147–152', bust: '79–81', waist: '70–72', hips: '84–86' },
];

const measurementSteps = [
  { n: '01', title: 'Poitrine',   desc: 'Mesurez autour de la partie la plus large de votre poitrine, en maintenant le mètre ruban à l\'horizontale.' },
  { n: '02', title: 'Taille',     desc: 'Mesurez la partie la plus étroite de votre taille, généralement 2–3 cm au-dessus du nombril.' },
  { n: '03', title: 'Hanches',    desc: 'Mesurez autour de la partie la plus large de vos hanches, environ 20 cm en dessous de la taille.' },
  { n: '04', title: 'Conseil',    desc: 'En cas de doute entre deux tailles, optez toujours pour la plus grande pour un confort optimal.' },
];

const faqItems = [
  {
    q: 'Que faire si mes mesures se situent entre deux tailles ?',
    a: 'Si vos mesures se situent entre deux tailles, nous vous recommandons généralement de choisir la taille supérieure pour plus de confort, surtout pour les vêtements non extensibles.',
  },
  {
    q: 'Les tailles MB-Creation correspondent-elles aux tailles standard ?',
    a: 'Nos tailles suivent les normes européennes standard. Cependant, certaines coupes peuvent varier légèrement selon la collection. Référez-vous toujours aux mesures en centimètres pour la meilleure précision.',
  },
  {
    q: 'Comment prendre mes mesures seul(e) ?',
    a: 'Pour des mesures précises, utilisez un mètre ruban souple. Tenez-vous droit, les bras le long du corps. Si possible, faites-vous aider par quelqu\'un pour plus d\'exactitude.',
  },
  {
    q: 'Puis-je retourner un article qui ne convient pas ?',
    a: 'Oui, MB-Creation accepte les retours sous 14 jours après réception. L\'article doit être dans son état d\'origine, non porté et avec toutes ses étiquettes. Consultez notre politique de retour pour plus de détails.',
  },
];

// ==========================================
// FADE IN
// ==========================================
function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ==========================================
// SIZE TABLE
// ==========================================
function SizeTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[#D4AF37]/30">
            {headers.map((h) => (
              <th
                key={h}
                className="font-cormorant text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-light py-4 px-4 text-center whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={`border-b border-stone-100 transition-colors duration-200 hover:bg-[#D4AF37]/5 ${
                i % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'
              }`}
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`font-cormorant text-center py-4 px-4 whitespace-nowrap ${
                    j === 2
                      ? 'text-stone-900 text-lg font-light'
                      : 'text-stone-500 text-base font-light'
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ==========================================
// FAQ ITEM
// ==========================================
function FaqItem({ item, index }: { item: (typeof faqItems)[0]; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-stone-100">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <span className="font-cormorant text-stone-900 text-lg font-light group-hover:text-[#D4AF37] transition-colors duration-300 pr-8">
          {item.q}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 text-[#D4AF37]"
        >
          <ChevronDown size={18} strokeWidth={1.5} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="font-cormorant text-stone-500 text-base font-light leading-relaxed pb-6">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// PAGE PRINCIPALE
// ==========================================
export default function SizeGuidePage() {
  const [activeTab, setActiveTab] = useState<Tab>('women');
  const [unit, setUnit] = useState<Unit>('cm');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'women', label: 'Femme' },
    { id: 'men',   label: 'Homme' },
    { id: 'kids',  label: 'Enfant' },
  ];

  const womenHeaders  = ['FR/EU', 'US', 'Lettre', `Poitrine (${unit})`, `Taille (${unit})`, `Hanches (${unit})`];
  const menHeaders    = ['FR/EU', 'US', 'Lettre', `Poitrine (${unit})`, `Taille (${unit})`, `Hanches (${unit})`];
  const kidsHeaders   = ['Âge', 'Hauteur (cm)', 'Poitrine (cm)', 'Taille (cm)', 'Hanches (cm)'];

  const womenRows  = (unit === 'cm' ? womenCm  : womenInches ).map(r => [r.frEu, r.us, r.letter, r.bust, r.waist, r.hips]);
  const menRows    = (unit === 'cm' ? menCm    : menInches   ).map(r => [r.frEu, r.us, r.letter, r.bust, r.waist, r.hips]);
  const kidsRows   = kids.map(r => [r.age, r.height, r.bust, r.waist, r.hips]);

  return (
    <main className="bg-white min-h-screen antialiased pt-20">

      {/* ══ HERO ══════════════════════════════════════ */}
      <section className="relative bg-stone-900 py-28 px-6 text-center overflow-hidden">
        {/* Grain */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '128px',
            mixBlendMode: 'overlay',
          }}
        />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-4"
          >
            <div className="h-px w-12 bg-[#D4AF37]/50" />
            <span className="font-cormorant text-[#D4AF37] text-xs uppercase tracking-[0.6em] font-light">
              MB-Création
            </span>
            <div className="h-px w-12 bg-[#D4AF37]/50" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-cormorant text-white text-5xl md:text-7xl font-light italic leading-none tracking-tight"
          >
            Guide des <span className="text-[#D4AF37]">Tailles</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-cormorant text-white/40 text-base md:text-lg font-light tracking-widest max-w-md"
          >
            Trouvez votre taille idéale pour une coupe parfaite.
          </motion.p>
        </div>
      </section>

      {/* ══ COMMENT SE MESURER ════════════════════════ */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-14 py-24">
        <FadeIn>
          <div className="flex items-center gap-4 mb-16">
            <div className="h-px w-10 bg-[#D4AF37]" />
            <span className="font-cormorant text-[#D4AF37] text-xs uppercase tracking-[0.55em] font-light">
              Avant de commencer
            </span>
          </div>
          <h2 className="font-cormorant text-3xl md:text-5xl font-light italic text-stone-900 mb-16 leading-tight">
            Comment prendre<br />
            <span className="text-[#D4AF37]">vos mesures</span>
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-stone-100">
          {measurementSteps.map((step, i) => (
            <FadeIn key={step.n} delay={i * 0.08}>
              <div className="bg-white p-8 h-full group hover:bg-[#D4AF37]/5 transition-colors duration-500">
                <span className="font-cormorant text-[#D4AF37]/40 text-4xl font-light italic block mb-5 group-hover:text-[#D4AF37]/70 transition-colors duration-300">
                  {step.n}
                </span>
                <h3 className="font-cormorant text-stone-900 text-xl font-light uppercase tracking-widest mb-3">
                  {step.title}
                </h3>
                <p className="font-cormorant text-stone-400 text-base font-light leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ══ TABLEAUX DES TAILLES ══════════════════════ */}
      <section className="bg-stone-50/60 py-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-14">

          <FadeIn>
            <h2 className="font-cormorant text-3xl md:text-5xl font-light italic text-stone-900 mb-16 leading-tight">
              Tableaux des <span className="text-[#D4AF37]">tailles</span>
            </h2>
          </FadeIn>

          {/* Tabs */}
          <FadeIn delay={0.1}>
            <div className="flex items-center gap-0 mb-12 border-b border-stone-200 relative">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setUnit('cm'); }}
                  className="relative pb-5 pr-10 group"
                >
                  <span
                    className={`font-cormorant text-sm uppercase tracking-[0.4em] font-light transition-colors duration-300 ${
                      activeTab === tab.id ? 'text-stone-900' : 'text-stone-400 group-hover:text-stone-600'
                    }`}
                  >
                    {tab.label}
                  </span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="tabUnderline"
                      className="absolute bottom-0 left-0 right-6 h-px bg-[#D4AF37]"
                    />
                  )}
                </button>
              ))}
            </div>
          </FadeIn>

          {/* Unité toggle (Femme / Homme uniquement) */}
          <AnimatePresence mode="wait">
            {activeTab !== 'kids' && (
              <motion.div
                key="unit-toggle"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3 mb-8"
              >
                <span className="font-cormorant text-stone-400 text-sm uppercase tracking-[0.35em] font-light">
                  Unité :
                </span>
                {(['cm', 'inches'] as Unit[]).map((u) => (
                  <button
                    key={u}
                    onClick={() => setUnit(u)}
                    className={`font-cormorant text-sm uppercase tracking-[0.35em] font-light px-5 py-2 border transition-all duration-300 ${
                      unit === u
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {u === 'cm' ? 'Centimètres' : 'Pouces'}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Table content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + '-' + unit}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white border border-stone-100 shadow-sm"
            >
              {activeTab === 'women' && <SizeTable headers={womenHeaders} rows={womenRows} />}
              {activeTab === 'men'   && <SizeTable headers={menHeaders}   rows={menRows}   />}
              {activeTab === 'kids'  && <SizeTable headers={kidsHeaders}  rows={kidsRows}  />}
            </motion.div>
          </AnimatePresence>

          {/* Note */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + '-note'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="mt-6 flex items-start gap-4 border-l-2 border-[#D4AF37] pl-5 py-4"
            >
              <span className="text-[#D4AF37] text-lg flex-shrink-0">✦</span>
              <p className="font-cormorant text-stone-500 text-base font-light leading-relaxed">
                {activeTab === 'kids'
                  ? 'Pour les vêtements enfants, nous recommandons de prioriser la taille selon la hauteur plutôt que l\'âge, la croissance pouvant varier considérablement d\'un enfant à l\'autre.'
                  : 'Ces mesures sont données à titre indicatif. Pour un ajustement parfait, référez-vous aux dimensions spécifiques indiquées sur chaque produit.'}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ══ FAQ ═══════════════════════════════════════ */}
      <section className="max-w-[800px] mx-auto px-6 md:px-14 py-24">
        <FadeIn>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-10 bg-[#D4AF37]" />
            <span className="font-cormorant text-[#D4AF37] text-xs uppercase tracking-[0.55em] font-light">
              Questions fréquentes
            </span>
          </div>
          <h2 className="font-cormorant text-3xl md:text-5xl font-light italic text-stone-900 mb-14 leading-tight">
            Vous avez des <span className="text-[#D4AF37]">questions ?</span>
          </h2>
        </FadeIn>

        <div>
          {faqItems.map((item, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <FaqItem item={item} index={i} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ══ CTA ═══════════════════════════════════════ */}
      <section className="bg-stone-900 py-24 px-6 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '128px',
            mixBlendMode: 'overlay',
          }}
        />
        <FadeIn>
          <div className="relative z-10 flex flex-col items-center gap-8 max-w-xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="h-px w-10 bg-[#D4AF37]/40" />
              <span className="font-cormorant text-[#D4AF37] text-xs uppercase tracking-[0.6em] font-light">
                MB-Création
              </span>
              <div className="h-px w-10 bg-[#D4AF37]/40" />
            </div>
            <h2 className="font-cormorant text-white text-3xl md:text-5xl font-light italic leading-tight">
              Votre taille trouvée ?<br />
              <span className="text-[#D4AF37]">Découvrez la collection.</span>
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-5 mt-2">
              <a
                href="/shop"
                className="font-cormorant inline-flex items-center gap-3 px-12 py-5 bg-[#D4AF37] text-stone-900 text-sm uppercase tracking-[0.4em] font-light hover:bg-[#C9A84C] transition-colors duration-300"
              >
                Explorer la collection
              </a>
              <a
                href="/contact"
                className="font-cormorant text-white/50 text-sm uppercase tracking-[0.4em] font-light border-b border-white/20 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors duration-300 pb-1"
              >
                Besoin d'aide ?
              </a>
            </div>
          </div>
        </FadeIn>
      </section>

    </main>
  );
}