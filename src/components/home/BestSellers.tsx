'use client';
import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ShoppingBag, Heart, ArrowRight } from 'lucide-react';

const products = [
  {
    id: 1,
    name: 'Costume Prestige',
    category: "Homme · Sur-mesure",
    price: '850 000',
    currency: 'FCFA',
    badge: 'Best Seller',
    src: 'https://qoghqsbbsqjgjibhlpbp.supabase.co/storage/v1/object/sign/mb-creation%20article/gallery%20(10).jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81OTZjMGNlOS1iZjM4LTRkOTItYjI2NC04ZGE2NGEwOGNjMTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYi1jcmVhdGlvbiBhcnRpY2xlL2dhbGxlcnkgKDEwKS5qcGciLCJpYXQiOjE3NzcyOTY1ODEsImV4cCI6MTg0MDM2ODU4MX0.lg3Y2ITSpxnfW1YTY8yCOumDohWUW2i5p6XAV7rlJ2I',
    alt: 'Costume Prestige Homme',
  },
  {
    id: 2,
    name: 'Robe Couture Soir',
    category: 'Femme · Exclusif',
    price: '620 000',
    currency: 'FCFA',
    badge: 'Nouveau',
    src: 'https://qoghqsbbsqjgjibhlpbp.supabase.co/storage/v1/object/sign/mb-creation%20article/gallery%20(4).jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81OTZjMGNlOS1iZjM4LTRkOTItYjI2NC04ZGE2NGEwOGNjMTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYi1jcmVhdGlvbiBhcnRpY2xlL2dhbGxlcnkgKDQpLmpwZyIsImlhdCI6MTc3NzI5NjYyOCwiZXhwIjoxODQwMzY4NjI4fQ.31TbX7dC-zeRuAOgEyRLS0Lhwchq-F4WiUQKyVZ0CJw',
    alt: 'Robe de soirée luxe',
  },
  {
    id: 3,
    name: 'Ensemble Enfant',
    category: 'Enfant · Collection',
    price: '180 000',
    currency: 'FCFA',
    badge: 'Tendance',
    src: 'https://qoghqsbbsqjgjibhlpbp.supabase.co/storage/v1/object/sign/mb-creation%20article/MB-Crea-pic%20(1).jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81OTZjMGNlOS1iZjM4LTRkOTItYjI2NC04ZGE2NGEwOGNjMTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYi1jcmVhdGlvbiBhcnRpY2xlL01CLUNyZWEtcGljICgxKS5qcGciLCJpYXQiOjE3NzcyOTY2NzUsImV4cCI6MTg0MDM2ODY3NX0.A0tpIhcg_qKotorK1uz3vl7KqEYvRz3Y64pq4aCs7Ik',
    alt: 'Ensemble enfant élégant',
  },
  {
    id: 4,
    name: 'Manteau Cachemire',
    category: 'Femme · Hiver',
    price: '980 000',
    currency: 'FCFA',
    badge: 'Exclusif',
    src: 'https://qoghqsbbsqjgjibhlpbp.supabase.co/storage/v1/object/sign/mb-creation%20article/trendingpic%20(2).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81OTZjMGNlOS1iZjM4LTRkOTItYjI2NC04ZGE2NGEwOGNjMTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYi1jcmVhdGlvbiBhcnRpY2xlL3RyZW5kaW5ncGljICgyKS5wbmciLCJpYXQiOjE3NzcyOTY3MDksImV4cCI6MTg0MDM2ODcwOX0.9UE7YWL_zXVt-FQFulHFtQKR8hbAMuUz7ZOoH8d3lL4',
    alt: 'Manteau cachemire luxe',
  },
];

const BADGE_STYLES: Record<string, string> = {
  'Best Seller': 'bg-[#D4AF37] text-black',
  'Nouveau':     'bg-stone-900 text-white',
  'Tendance':    'bg-stone-100 text-stone-700',
  'Exclusif':    'border border-[#D4AF37] text-[#D4AF37]',
};

function ProductCard({ product, index }: { product: typeof products[0]; index: number }) {
  const [liked, setLiked] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-stone-100 aspect-[3/4]">
        <Image
          src={product.src}
          alt={product.alt}
          fill
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
          unoptimized
        />

        {/* Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className={`text-[9px] uppercase tracking-[0.25em] font-bold px-3 py-1.5 ${BADGE_STYLES[product.badge] ?? ''}`}>
            {product.badge}
          </span>
        </div>

        {/* Wishlist */}
        <button
          onClick={() => setLiked(l => !l)}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
        >
          <Heart
            size={16}
            strokeWidth={1.5}
            className={`transition-colors duration-300 ${liked ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-stone-500'}`}
          />
        </button>

        {/* Add to Cart Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
          <button
            onClick={handleCart}
            className="w-full py-4 bg-stone-900 text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-[#D4AF37] hover:text-black transition-colors duration-300 flex items-center justify-center gap-3"
          >
            <AnimatePresence mode="wait">
              {addedToCart ? (
                <motion.span
                  key="added"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex items-center gap-2"
                >
                  ✓ Ajouté au panier
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex items-center gap-3"
                >
                  <ShoppingBag size={14} strokeWidth={1.5} />
                  Ajouter au panier
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="pt-5 flex flex-col gap-1">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-light">
          {product.category}
        </span>
        <h3 className="text-base font-light text-stone-900 tracking-wide">
          {product.name}
        </h3>
        <p className="text-sm font-light text-stone-500 mt-1">
          {product.price} <span className="text-[10px] tracking-widest">{product.currency}</span>
        </p>
      </div>
    </motion.div>
  );
}

export default function BestSellers() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="bg-stone-50 py-24 md:py-32 font-sans antialiased">
      <div className="max-w-[1920px] mx-auto px-6 md:px-16">

        {/* Header */}
        <div ref={ref} className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-[#D4AF37] text-[10px] tracking-[0.5em] uppercase font-bold block mb-4"
            >
              Sélection exclusive
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-6xl italic text-stone-900 leading-[1] tracking-tighter font-cormorant "
            >
              Nos best{' '}
              <span className="italic text-[#D4AF37] underline underline-offset-8 decoration-[#D4AF37] decoration-2">sellers</span>
            </motion.h2>
          </div>

          <motion.a
            href="/shop"
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden md:flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-bold text-stone-900 hover:text-[#D4AF37] transition-colors group"
          >
            Voir toute la collection
            <ArrowRight size={14} strokeWidth={2} className="group-hover:translate-x-1 transition-transform duration-300" />
          </motion.a>
        </div>

        {/* Separator */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="origin-left h-[1px] bg-stone-200 mb-16"
        />

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Mobile CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="md:hidden flex justify-center mt-14"
        >
          <a
            href="/shop"
            className="px-12 py-5 border border-stone-900/20 text-stone-900 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-stone-900 hover:text-white transition-all duration-500 flex items-center gap-3"
          >
            Voir toute la collection
            <ArrowRight size={14} strokeWidth={2} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

