'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import HeroSlideContent from './HeroSlideContent';

// Données de test spécifiques au Luxe et à MB-Creation
const slides = [
  { 
    id: 1, 
    src: "https://qoghqsbbsqjgjibhlpbp.supabase.co/storage/v1/object/sign/mb-creation%20article/mb1.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81OTZjMGNlOS1iZjM4LTRkOTItYjI2NC04ZGE2NGEwOGNjMTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYi1jcmVhdGlvbiBhcnRpY2xlL21iMS5wbmciLCJpYXQiOjE3Nzc0MzEzNzUsImV4cCI6MTgwODk2NzM3NX0.DLUtM2Nf8n3kBV0QjAtx8sKAz7701TuMPrOFIWZ-ryU", 
    alt: "Costume de Luxe Homme MB-Creation",
    tagline: "The Art of Bespoke",
    headline: "Embody Absolute Distinction"
  },
  { 
    id: 2, 
    src: "https://qoghqsbbsqjgjibhlpbp.supabase.co/storage/v1/object/sign/mb-creation%20article/banner5%20(2).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81OTZjMGNlOS1iZjM4LTRkOTItYjI2NC04ZGE2NGEwOGNjMTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYi1jcmVhdGlvbiBhcnRpY2xlL2Jhbm5lcjUgKDIpLnBuZyIsImlhdCI6MTc3NzI1Njc5MCwiZXhwIjoxODA4NzkyNzkwfQ.2devq4TUc552A2SOhd7770ZoJF0BknDfH_cbu-BXg1M", 
    alt: "Collection Femme Soie et Cachemire",
    tagline: "An Eternal Grace",
    headline: "The Softness of Prestige on Your Skin"
  },
  { 
    id: 3, 
    src: "https://qoghqsbbsqjgjibhlpbp.supabase.co/storage/v1/object/sign/mb-creation%20article/banner5%20(1).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81OTZjMGNlOS1iZjM4LTRkOTItYjI2NC04ZGE2NGEwOGNjMTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYi1jcmVhdGlvbiBhcnRpY2xlL2Jhbm5lcjUgKDEpLnBuZyIsImlhdCI6MTc3NzI1NjgyNSwiZXhwIjoxODA4NzkyODI1fQ.ljavxZd4Wottze_9-dk8WEzXi9-7zcgMEVHAQuNfCXk", 
    alt: "Accessoires Maroquinerie Haut de Gamme",
    tagline: "The Detail that Changes Everything",
    headline: "Perfection Down to the Last Detail"
  },
];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide toutes les 10 secondes (plus lent pour le luxe)
  useEffect(() => {
    const timer = setInterval(() => {
      goToNext();
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % slides.length);

  const currentSlide = slides[currentIndex];

  return (
    <section className="relative h-screen overflow-hidden bg-stone-50 flex items-center">
      
      {/* --- CONTENEUR D'IMAGE (Côté Droit avec fondu vers le Noir) --- */}
      <div className="absolute inset-0 z-0 flex justify-end">
        <div className="relative w-full md:w-[60%] h-full">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1] }} // Fondu très lent
              className="absolute inset-0"
            >
              <Image 
                src={currentSlide.src} 
                alt={currentSlide.alt}
                fill
                priority
                className="object-cover"
                unoptimized
              />
              
              {/* GRADIENT DE FUSION : Fond l'image dans la couleur claire à gauche */}
              <div 
                className="absolute inset-0 z-10" 
                style={{
                  background: `linear-gradient(to right, #fafaf9 0%, #fafaf9 5%, transparent 60%, transparent 100%)`
                }}
              ></div>
              
              {/* Optionnel : Un léger fondu en bas pour le mobile (vers la couleur claire) */}
              <div 
                className="absolute inset-0 z-10 md:hidden" 
                style={{
                  background: `linear-gradient(to top, #fafaf9 0%, transparent 50%)`
                }}
              ></div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* --- CONTENU TEXTE (Aligné à Gauche, utilise le nouveau composant) --- */}
      <div className="relative z-20 w-full max-w-[1920px] mx-auto px-6 md:px-16">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <HeroSlideContent key={currentSlide.id + '-content'} slide={currentSlide} />
          </AnimatePresence>
        </div>
      </div>

      {/* --- NAVIGATION (Positionnée en bas à gauche, style Minimaliste) --- */}
      <div className="absolute bottom-30 left-6 md:left-16 z-30 flex items-center gap-12">
        {/* Flèches */}
        <div className="flex items-center gap-6">
          <button 
            onClick={goToPrevious} 
            className="p-3 border border-stone-900/10 rounded-full text-stone-900/50 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={goToNext} 
            className="p-3 border border-stone-900/10 rounded-full text-stone-900/50 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Indicateurs de lignes (Style Minimaliste Or) */}
        <div className="flex space-x-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-[1px] transition-all duration-700 ${
                currentIndex === idx ? 'w-20 bg-[#D4AF37]' : 'w-8 bg-stone-900/20'
              }`}
            />
          ))}
        </div>
      </div>

    </section>
  );
}