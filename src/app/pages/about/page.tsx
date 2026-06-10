'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

// ==========================================
// DONNÉES
// ==========================================

const story = [
  {
    id: 1,
    year: '2017',
    label: 'Foundation',
    title: 'A passion turned into a vision',
    text: "MB-Creation was born in 2017 from the drive of Manuella Bufang, a fashion creator passionate since her teenage years. Deeply committed to the social and cultural development of Cameroon, she decided to merge her two passions: sewing and Africa.",
  },
  {
    id: 2,
    year: '∞',
    label: 'Philosophy',
    title: 'Roots that grow',
    text: "The brand logo, an expanding root, embodies MB-Creation's philosophy: reconnect to our cultural essence and share it with the world. Each piece invites you to wear your identity with pride and celebrate Africa's rich heritage.",
  },
  {
    id: 3,
    year: '✦',
    label: 'Material & Territory',
    title: 'Made in Cameroon',
    text: "Production is rooted in Cameroon, elevating African fabric as the founding material of every creation. By choosing sustainable local materials and artisanal techniques, MB-Creation creates jobs and preserves craftsmanship while pursuing excellence.",
  },
  {
    id: 4,
    year: '✦',
    label: 'Identity',
    title: 'Authenticity as a signature',
    text: "Bold patterns, modern cuts, cultural fusion — Manuella Bufang's collections reflect a proud multicultural identity. Each garment tells a story, invites its wearer to stand out, and celebrates individuality in a world that often looks the same.",
  },
];

const values = [
  { icon: '◈', title: 'Authenticity', desc: 'Creations rooted in African culture, carried toward universality.' },
  { icon: '◇', title: 'Craftsmanship', desc: 'Hand techniques and local materials selected with care.' },
  { icon: '◉', title: 'Uniqueness', desc: 'Each piece is unique. Each customer even more so.' },
  { icon: '◈', title: 'Ethics', desc: 'Responsible production, local jobs, respect for people and materials.' },
];

// ==========================================
// FADE IN SECTION
// ==========================================
function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ==========================================
// STORY CARD
// ==========================================
function StoryCard({ item, index }: { item: (typeof story)[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      {/* Ligne verticale connecteur */}
      {index < story.length - 1 && (
        <div className="absolute left-[27px] top-[56px] w-px h-[calc(100%+48px)] bg-gradient-to-b from-[#D4AF37]/30 to-transparent z-0" />
      )}

      <div className="relative z-10 flex gap-8 md:gap-14">
        {/* Marqueur année */}
        <div className="flex-shrink-0 flex flex-col items-center gap-3 pt-1">
          <div className="w-14 h-14 border border-[#D4AF37]/40 flex items-center justify-center group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37]/5 transition-all duration-500">
            <span className="font-cormorant text-[#D4AF37] text-sm font-light tracking-widest">
              {item.year}
            </span>
          </div>
        </div>

        {/* Contenu */}
        <div className="pb-16">
          <span className="font-cormorant text-[#D4AF37] text-xs uppercase tracking-[0.5em] font-light block mb-3">
            {item.label}
          </span>
          <h3 className="font-cormorant text-2xl md:text-3xl font-light italic text-stone-900 leading-tight mb-4">
            {item.title}
          </h3>
          <p className="font-cormorant text-stone-500 text-base md:text-lg font-light leading-relaxed max-w-xl">
            {item.text}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// PAGE ABOUT
// ==========================================
export default function AboutPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <main className="bg-white min-h-screen antialiased overflow-x-hidden">

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden bg-black">

        {/* Image parallax */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 scale-110">
          <Image
            src="https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?q=80&w=2000"
            alt="MB-Creation"
            fill
            unoptimized
            priority
            className="object-cover"
            style={{ filter: 'brightness(0.30) contrast(1.1) sepia(0.15)' }}
          />
        </motion.div>

        {/* Grain overlay */}
        <div
          className="absolute inset-0 z-10 pointer-events-none opacity-25"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '128px',
            mixBlendMode: 'overlay',
          }}
        />

        {/* Gradient bas */}
        <div
          className="absolute bottom-0 left-0 right-0 h-64 z-10"
          style={{ background: 'linear-gradient(to top, #fff 0%, transparent 100%)' }}
        />

        {/* Contenu hero */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-8"
          >
            {/* Ornement */}
            <div className="flex items-center gap-5">
              <div className="h-px w-16 bg-[#D4AF37]/50" />
              <span className="font-cormorant text-[#D4AF37] text-xs uppercase tracking-[0.7em] font-light">
                Fashion House · Since 2017
              </span>
              <div className="h-px w-16 bg-[#D4AF37]/50" />
            </div>

            {/* Titre */}
            <h1
              className="font-cormorant text-white text-6xl md:text-[7rem] lg:text-[9rem] font-light italic tracking-[-0.02em] leading-none"
              style={{ textShadow: '0 4px 60px rgba(0,0,0,0.4)' }}
            >
              Our Story
            </h1>

            {/* Tagline */}
            <p className="font-cormorant text-white/50 text-lg md:text-xl font-light tracking-widest max-w-lg leading-relaxed">
              Clothing that tells a story.
            </p>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-12 bg-gradient-to-b from-[#D4AF37]/60 to-transparent"
          />
          <span className="font-cormorant text-white/25 text-xs uppercase tracking-[0.5em] font-light">
            Scroll
          </span>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════
          INTRO CITATION
      ══════════════════════════════════════ */}
      <section className="max-w-[900px] mx-auto px-6 md:px-14 py-32 text-center">
        <FadeIn>
          <div className="flex items-center justify-center gap-5 mb-12">
            <div className="h-px w-12 bg-[#D4AF37]/40" />
            <span className="text-[#D4AF37] text-lg">✦</span>
            <div className="h-px w-12 bg-[#D4AF37]/40" />
          </div>
          <blockquote className="font-cormorant text-3xl md:text-5xl font-light italic text-stone-800 leading-[1.3] tracking-tight">
            "Reconnect Africa to its essence,<br />
            <span className="text-[#D4AF37]">share its beauty with the world.</span>"
          </blockquote>
          <div className="mt-10 flex items-center justify-center gap-4">
            <div className="h-px w-8 bg-[#D4AF37]/40" />
            <span className="font-cormorant text-stone-400 text-sm uppercase tracking-[0.45em] font-light">
              Manuella Bufang — Founder & Designer
            </span>
            <div className="h-px w-8 bg-[#D4AF37]/40" />
          </div>
        </FadeIn>
      </section>

      {/* ══════════════════════════════════════
          PORTRAIT + FONDATRICE
      ══════════════════════════════════════ */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-14 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">

          {/* Image */}
          <FadeIn delay={0.1}>
            <div className="relative">
              {/* Cadre décoratif */}
              <div className="absolute -top-4 -left-4 w-full h-full border border-[#D4AF37]/20 z-0" />
              <div className="relative z-10 aspect-[3/4] overflow-hidden bg-stone-100">
                <Image
                  src="https://qoghqsbbsqjgjibhlpbp.supabase.co/storage/v1/object/sign/mb-creation%20article/shop3.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81OTZjMGNlOS1iZjM4LTRkOTItYjI2NC04ZGE2NGEwOGNjMTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYi1jcmVhdGlvbiBhcnRpY2xlL3Nob3AzLnBuZyIsImlhdCI6MTc3Nzc3OTIxNiwiZXhwIjoxODA5MzE1MjE2fQ.CrPctU1BOx_gxxhiHsDfCH1SHmddVOpQdn6OsizNaqc"
                  alt="Manuella Bufang"
                  fill
                  unoptimized
                  className="object-cover"
                  style={{ filter: 'brightness(0.95) sepia(0.08)' }}
                />
              </div>
              {/* Badge flottant */}
              <div className="absolute -bottom-6 -right-6 z-20 bg-[#D4AF37] px-6 py-4">
                <span className="font-cormorant text-stone-900 text-xs uppercase tracking-[0.4em] font-light block">
                  Founder
                </span>
                <span className="font-cormorant text-stone-900 text-lg font-light italic">
                  Manuella Bufang
                </span>
              </div>
            </div>
          </FadeIn>

          {/* Texte */}
          <FadeIn delay={0.25}>
            <div className="md:pt-12">
              <span className="font-cormorant text-[#D4AF37] text-xs uppercase tracking-[0.55em] font-light block mb-5">
                The Designer
              </span>
              <h2 className="font-cormorant text-4xl md:text-5xl font-light italic text-stone-900 leading-tight mb-8">
                One woman,<br />
                <span className="text-[#D4AF37]">a heritage,</span><br />
                a brand.
              </h2>
              <div className="space-y-5 font-cormorant text-stone-500 text-base md:text-lg font-light leading-relaxed">
                <p>
                  Passionate about fashion since her teenage years, Manuella Bufang grew up between two worlds — contemporary elegance and the cultural richness of Cameroon, her home country.
                </p>
                <p>
                  Committed to Africa's social and cultural development through charity work and cultural events, she chose to make her art a vehicle of identity and pride.
                </p>
                <p>
                  After several creative phases — B-Wear by M, Unik, Icône, Authentic — the brand finally settled on its definitive name: <strong className="text-stone-800 font-normal">MB-Creation</strong>.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TIMELINE / HISTOIRE
      ══════════════════════════════════════ */}
      <section className="bg-stone-50/60 py-32">
        <div className="max-w-[900px] mx-auto px-6 md:px-14">
          <FadeIn>
            <div className="mb-20">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-10 bg-[#D4AF37]" />
                <span className="font-cormorant text-[#D4AF37] text-xs uppercase tracking-[0.55em] font-light">
                  The story
                </span>
              </div>
              <h2 className="font-cormorant text-4xl md:text-6xl font-light italic text-stone-900 leading-tight">
                From root<br />
                <span className="text-[#D4AF37]">to crown</span>
              </h2>
            </div>
          </FadeIn>

          <div>
            {story.map((item, index) => (
              <StoryCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          VALEURS
      ══════════════════════════════════════ */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-14 py-32">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-10 bg-[#D4AF37]" />
                <span className="font-cormorant text-[#D4AF37] text-xs uppercase tracking-[0.55em] font-light">
                  What defines us
                </span>
              </div>
              <h2 className="font-cormorant text-4xl md:text-6xl font-light italic text-stone-900 leading-tight">
                Our values
              </h2>
            </div>
            <p className="font-cormorant text-stone-400 text-base md:text-lg font-light leading-relaxed max-w-xs md:text-right">
              Principles that guide every decision, every cut, every piece.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-stone-100">
          {values.map((val, index) => (
            <FadeIn key={val.title} delay={index * 0.1}>
              <div className="group bg-white p-10 hover:bg-[#D4AF37]/5 transition-colors duration-500 h-full">
                <span className="text-[#D4AF37] text-2xl block mb-6 group-hover:scale-110 transition-transform duration-300 origin-left">
                  {val.icon}
                </span>
                <h3 className="font-cormorant text-stone-900 text-xl font-light uppercase tracking-widest mb-4">
                  {val.title}
                </h3>
                <p className="font-cormorant text-stone-400 text-base font-light leading-relaxed">
                  {val.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA FINAL
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-stone-900 py-40 px-6 text-center">
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

        {/* Cercle décoratif */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#D4AF37]/8 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-[#D4AF37]/6 rounded-full pointer-events-none" />

        <FadeIn>
          <div className="relative z-10 flex flex-col items-center gap-10 max-w-2xl mx-auto">
            <div className="flex items-center gap-5">
              <div className="h-px w-12 bg-[#D4AF37]/40" />
              <span className="font-cormorant text-[#D4AF37] text-xs uppercase tracking-[0.7em] font-light">
                MB-Creation
              </span>
              <div className="h-px w-12 bg-[#D4AF37]/40" />
            </div>

            <h2 className="font-cormorant text-white text-4xl md:text-6xl font-light italic leading-tight">
              Wear a story.<br />
              <span className="text-[#D4AF37]">Tell your own.</span>
            </h2>

            <p className="font-cormorant text-white/40 text-base md:text-lg font-light tracking-wide leading-relaxed">
              Discover collections that celebrate African identity and contemporary elegance.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
              <a
                href="/shop"
                className="font-cormorant inline-flex items-center gap-4 px-12 py-5 bg-[#D4AF37] text-stone-900 text-sm uppercase tracking-[0.4em] font-light hover:bg-[#C9A84C] transition-colors duration-300"
              >
                Explore collections
              </a>
              <a
                href="/contact"
                className="font-cormorant inline-flex items-center gap-3 text-white/50 text-sm uppercase tracking-[0.4em] font-light hover:text-[#D4AF37] transition-colors duration-300 border-b border-white/20 hover:border-[#D4AF37] pb-1"
              >
                Contact us
              </a>
            </div>
          </div>
        </FadeIn>
      </section>

    </main>
  );
}