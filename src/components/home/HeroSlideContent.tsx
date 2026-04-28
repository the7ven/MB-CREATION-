'use client';
import { motion } from 'framer-motion';

interface SlideContentProps {
  slide: {
    tagline: string;
    headline: string;
  };
}

export default function HeroSlideContent({ slide }: SlideContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} // Animation fluide et élégante
      className="font-sans"
    >
      {/* Tagline : Or, Majuscules, Espacement large */}
      <span className="text-[#D4AF37] text-[10px] md:text-xs tracking-[0.5em] uppercase font-bold mb-4 block">
        {slide.tagline}
      </span>
      
      {/* Headline : Imposant, Sombre, Italique Gras avec distinction */}
      <h1 className="text-5xl md:text-8xl  text-stone-900 leading-[1] tracking-tighter mb-8">
        {slide.headline.split(' ').map((word, index) => (
          <span key={word + index} className={['distinction', 'prestige', 'excellence'].includes(word.replace(/[.,]/g, '')) ? 'italic' : ''}>
            {word}{' '}
          </span>
        ))}
      </h1>

      {/* Boutons d'Action : Style Luxe Contrasté */}
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <button className="px-12 py-5 bg-[#D4AF37] text-black text-[10px] uppercase tracking-[0.3em] font-black hover:bg-stone-900 hover:text-white transition-colors duration-500 shadow-xl">
          Acheter la collection
        </button>
        <button className="px-12 py-5 border border-stone-900/20 text-stone-900 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-stone-900 hover:text-white transition-all duration-500">
          Notre Histoire
        </button>
      </div>
    </motion.div>
  );
}