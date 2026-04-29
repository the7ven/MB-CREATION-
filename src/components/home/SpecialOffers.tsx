'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    tag: 'Offre Exclusive · Collection Printemps',
    discount: '−30%',
    headline: ['La', 'distinction', 'est en solde'],
    description: 'Robes de couture et pièces signatures.\nSélection limitée, raffinement garanti.',
    image: 'https://qoghqsbbsqjgjibhlpbp.supabase.co/storage/v1/object/sign/mb-creation%20article/gallery%20(11).jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81OTZjMGNlOS1iZjM4LTRkOTItYjI2NC04ZGE2NGEwOGNjMTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYi1jcmVhdGlvbiBhcnRpY2xlL2dhbGxlcnkgKDExKS5qcGciLCJpYXQiOjE3NzczMDMzNzAsImV4cCI6MTgwODgzOTM3MH0.H3Udt_O99BYw2C-OiebHmqsU9UJoejuRWbwwHVvImNs',
    badge: 'Exclusivité',
    cta: 'Profiter de l\'offre',
    ctaSecondary: 'Voir la collection',
  },
  {
    tag: 'Édition Limitée · Horlogerie de Prestige',
    discount: '−20%',
    headline: ['Le temps,', 'symbole de', 'prestige'],
    description: 'Montres d\'exception sélectionnées par nos experts.\nUne alliance entre art et mécanique.',
    image: 'https://qoghqsbbsqjgjibhlpbp.supabase.co/storage/v1/object/sign/mb-creation%20article/banner3.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81OTZjMGNlOS1iZjM4LTRkOTItYjI2NC04ZGE2NGEwOGNjMTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYi1jcmVhdGlvbiBhcnRpY2xlL2Jhbm5lcjMucG5nIiwiaWF0IjoxNzc3MjU2MjA4LCJleHAiOjE4MDg3OTIyMDh9.hkYqO4oPAAvemxd7kKP1RAMSuxHGcbhZAUI5D6LyBcw',
    badge: 'Édition Limitée',
    cta: 'Découvrir les pièces',
    ctaSecondary: 'Notre sélection',
  },
  {
    tag: 'Flash Sale · Maroquinerie · 48h seulement',
    discount: '−40%',
    headline: ['L\'art du cuir,', 'essence de', 'excellence'],
    description: 'Sacs, ceintures et accessoires en cuir pleine fleur.\nArtisanat français, offre exceptionnelle.',
    image: 'https://qoghqsbbsqjgjibhlpbp.supabase.co/storage/v1/object/sign/mb-creation%20article/banner5%20(1).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81OTZjMGNlOS1iZjM4LTRkOTItYjI2NC04ZGE2NGEwOGNjMTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYi1jcmVhdGlvbiBhcnRpY2xlL2Jhbm5lcjUgKDEpLnBuZyIsImlhdCI6MTc3NzI1NjgyNSwiZXhwIjoxODA4NzkyODI1fQ.ljavxZd4Wottze_9-dk8WEzXi9-7zcgMEVHAQuNfCXk',
    badge: 'Flash Sale',
    cta: 'Saisir l\'occasion',
    ctaSecondary: 'En savoir plus',
  },
];

const ITALIC_WORDS = ['distinction', 'prestige', 'excellence'];

export default function SpecialOffers() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [current]);

  const goTo = (n: number) => setCurrent((n + slides.length) % slides.length);

  const slide = slides[current];

  return (
    <div className="relative overflow-hidden bg-[#0e0d0b] min-h-[700px] font-serif">
      {/* Background images with crossfade */}
      <AnimatePresence>
        <motion.img
          key={slide.image}
          src={slide.image}
          alt=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 w-full h-full object-cover brightness-[0.99] sepia-[0.18]"
        />
      </AnimatePresence>

      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(120deg, rgba(10,8,5,0.82) 40%, rgba(180,145,60,0.10) 100%)',
        }}
      />

      {/* Badge top-right */}
      <div className="absolute top-8 right-10 z-10 px-4 py-1.5 bg-[#D4AF37] text-[#0e0d0b] text-[9px] tracking-[0.4em] uppercase font-bold">
        {slide.badge}
      </div>

      {/* Counter top-right */}
      <div className="absolute top-8 right-36 z-10 text-[#D4AF37]/60 text-[11px] tracking-[0.3em]">
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 px-12 pt-14 pb-10 max-w-lg"
        >
          {/* Tagline */}
          <span className="text-[#D4AF37] text-[10px] tracking-[0.5em] uppercase font-bold mb-5 block">
            {slide.tag}
          </span>

          {/* Discount */}
          <p
            className="text-[#D4AF37] leading-none tracking-tight mb-2"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: '72px' }}
          >
            {slide.discount}
          </p>

          {/* Headline */}
          <h2
            className="text-[#f5f0e8] leading-[1.15] tracking-tight mb-3"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px' }}
          >
            {slide.headline.map((word, i) =>
              ITALIC_WORDS.includes(word.replace(/[.,]/g, '').toLowerCase()) ? (
                <span key={i} className="italic text-[#D4AF37]">
                  {word}{' '}
                </span>
              ) : (
                <span key={i}>{word}{i < slide.headline.length - 1 ? ' ' : ''}<br /></span>
              )
            )}
          </h2>

          {/* Description */}
          <p className="text-[rgba(245,240,232,0.55)] text-sm tracking-wide font-light leading-relaxed mb-8 whitespace-pre-line">
            {slide.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <button className="px-8 py-4 bg-[#D4AF37] text-[#0e0d0b] text-[10px] uppercase tracking-[0.35em] font-black hover:bg-[#f5f0e8] transition-colors duration-500 shadow-xl">
              {slide.cta}
            </button>
            <button className="px-8 py-4 border border-[rgba(245,240,232,0.25)] text-[#f5f0e8] text-[10px] uppercase tracking-[0.35em] font-semibold hover:bg-[#f5f0e8] hover:text-[#0e0d0b] hover:border-[#f5f0e8] transition-all duration-500">
              {slide.ctaSecondary}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="absolute bottom-8 right-10 z-10 flex items-center gap-5">
        {/* Dot indicators */}
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="h-[2px] transition-all duration-500"
              style={{
                width: i === current ? '40px' : '24px',
                background: i === current ? '#D4AF37' : 'rgba(212,175,55,0.3)',
              }}
            />
          ))}
        </div>

        {/* Arrows */}
        <button
          onClick={() => goTo(current - 1)}
          className="w-9 h-9 border border-[rgba(212,175,55,0.4)] text-[#D4AF37] flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#0e0d0b] hover:border-[#D4AF37] transition-all duration-300 text-base"
        >
          ←
        </button>
        <button
          onClick={() => goTo(current + 1)}
          className="w-9 h-9 border border-[rgba(212,175,55,0.4)] text-[#D4AF37] flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#0e0d0b] hover:border-[#D4AF37] transition-all duration-300 text-base"
        >
          →
        </button>
      </div>
    </div>
  );
}