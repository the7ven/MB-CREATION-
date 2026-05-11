'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Heart, X, ArrowRight, ChevronLeft, ChevronRight, Mail } from 'lucide-react';
import { useCart } from '@/context/CartContext';


// ============================================================
// DONNÉES
// ============================================================
const heroSlides = [
  {
    id: 1,
    title: 'Made of\nAfrica',
    description: 'Collection focusing on premium African fabrics — Bogolan, Kente, Ndop combined with silk and taffeta to create original and unique looks.',
    src: 'https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?q=80&w=2000&auto=format&fit=crop',
    accent: 'Collection Été',
  },
  {
    id: 2,
    title: 'Icone &\nIcone 2.0',
    description: 'Fresh, youthful and modern looks suitable for day and night. African fabric crafted and adapted to the environment and temperate climate.',
    src: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2000&auto=format&fit=crop',
    accent: 'Tailoring Contemporain',
  },
  {
    id: 3,
    title: 'New\nCollection 2025',
    description: 'Root Black & Root White — a comeback marked by refined elegance. African fabric combined with sustainable materials for timeless urban chic clothing.',
    src: 'https://images.unsplash.com/photo-1593032465175-481ac7f402a1?q=80&w=2000&auto=format&fit=crop',
    accent: 'Nouveauté 2025',
  },
];

const collections = [
  {
    id: 'africa',
    title: 'Made of Africa',
    anchor: 'made-of-africa',
    description: "L'héritage africain revisité — Bogolan, Kente et Ndop fusionnent avec soie et taffetas pour des silhouettes uniques.",
    products: [
      {
        id: 101, name: 'KABA', category: 'Tradition', price: '450 000', currency: 'FCFA',
        images: [
          'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=800',
          'https://images.unsplash.com/photo-1614612144521-17b2907af0e4?q=80&w=800',
        ],
        description: "Alliance parfaite entre savoir-faire ancestral et coupe contemporaine. Tissage réalisé à la main.",
      },
      {
        id: 102, name: 'Ensemble Bogolan Été', category: 'Casual', price: '320 000', currency: 'FCFA',
        images: [
          'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800',
          'https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=800',
        ],
        description: "Bogolan authentique du Mali, réinterprété pour un style urbain et moderne.",
      },
      {
        id: 103, name: 'Veste Ndop Cérémonie', category: 'Soirée', price: '580 000', currency: 'FCFA',
        images: [
          'https://images.unsplash.com/photo-1598971939794-52d8807d4766?q=80&w=800',
          'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800',
        ],
        description: "Tissu Ndop du Cameroun, coupe ajustée pour les grandes occasions.",
      },
    ],
  },
  {
    id: 'icone2',
    title: 'Icone 2.0',
    anchor: 'icone-2',
    description: "La vision futuriste du costume classique. Matériaux techniques, coupes ultra-slim, finitions architecturales.",
    products: [
      {
        id: 104, name: 'Veste Graphite Icone', category: 'Tailoring', price: '890 000', currency: 'FCFA',
        images: [
          'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800',
          'https://images.unsplash.com/photo-1594938384824-0230232f05ba?q=80&w=800',
        ],
        description: "Coupe ultra-slim et matériaux techniques pour l'homme qui façonne les codes.",
      },
      {
        id: 105, name: 'Costume Lin Structuré', category: 'Business', price: '740 000', currency: 'FCFA',
        images: [
          'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=800',
          'https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=800',
        ],
        description: "Lin premium structuré, silhouette architecturale pour une présence inégalée.",
      },
      {
        id: 106, name: 'Blazer Technique Nuit', category: 'Soirée', price: '620 000', currency: 'FCFA',
        images: [
          'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=800',
          'https://images.unsplash.com/photo-1598971939794-52d8807d4766?q=80&w=800',
        ],
        description: "Matière technique à reflets, coupe ajustée pour les soirées d'exception.",
      },
    ],
  },
  {
    id: 'icone',
    title: 'Icone',
    anchor: 'icone',
    description: "La quintessence du tailoring masculin. Coupes italiennes, soies de mûrier, velours de nuit — des pièces intemporelles.",
    products: [
      {
        id: 107, name: 'Veste Smoking Velours', category: 'Soirée', price: '720 000', currency: 'FCFA',
        images: [
          'https://images.unsplash.com/photo-1598971939794-52d8807d4766?q=80&w=800',
          'https://images.unsplash.com/photo-1592772874383-d08932d2c568?q=80&w=800',
        ],
        description: "Velours de soie italien, silhouette structurée pour vos soirées les plus prestigieuses.",
      },
      {
        id: 108, name: 'Chemise Soie Blanche', category: 'Essentiels', price: '185 000', currency: 'FCFA',
        images: [
          'https://images.unsplash.com/photo-1621072156002-e2fcced0b17d?q=80&w=800',
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800',
        ],
        description: "100% soie de mûrier. Fluidité incomparable pour un confort quotidien absolu.",
      },
      {
        id: 109, name: 'Pantalon Flanelle Gris', category: 'Classique', price: '340 000', currency: 'FCFA',
        images: [
          'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=800',
          'https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?q=80&w=800',
        ],
        description: "Flanelle anglaise d'exception, tombé parfait pour une élégance discrète.",
      },
    ],
  },
];

type Product = typeof collections[0]['products'][0];

// ============================================================
// HERO SLIDER
// ============================================================
function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % heroSlides.length), 7000);
    return () => clearInterval(t);
  }, []);

  const slide = heroSlides[current];

  return (
    <section className="relative h-[90vh] w-full overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          <img
            src={slide.src}
            alt={slide.title}
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.35) contrast(1.1)' }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient bas */}
      <div className="absolute bottom-0 left-0 right-0 h-64 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #000 0%, transparent 100%)' }} />

      {/* Contenu */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end px-8 md:px-20 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id + '-text'}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="h-px w-10 bg-[#D4AF37]" />
              <span className="text-[#D4AF37] text-[9px] uppercase tracking-[0.7em] font-bold">{slide.accent}</span>
            </div>
            <h1 className="text-white text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.9] mb-6 whitespace-pre-line">
              {slide.title}
            </h1>
            <p className="text-white/50 text-sm font-light max-w-md leading-relaxed mb-8">
              {slide.description}
            </p>
            <a href="#collections" className="inline-flex items-center gap-3 px-10 py-4 bg-[#D4AF37] text-black text-[9px] uppercase tracking-[0.4em] font-black hover:bg-white transition-colors duration-500">
              Découvrir <ArrowRight size={12} strokeWidth={2} />
            </a>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-8 right-10 z-20 flex items-center gap-5">
        <button onClick={() => setCurrent(p => (p - 1 + heroSlides.length) % heroSlides.length)}
          className="w-10 h-10 border border-white/20 flex items-center justify-center text-white/40 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300">
          <ChevronLeft size={16} />
        </button>
        <span className="text-white/25 text-[10px] tracking-[0.4em]">
          <span className="text-white/60">0{current + 1}</span> / 0{heroSlides.length}
        </span>
        <button onClick={() => setCurrent(p => (p + 1) % heroSlides.length)}
          className="w-10 h-10 border border-white/20 flex items-center justify-center text-white/40 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-4">
        {heroSlides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`h-px transition-all duration-700 ${current === i ? 'w-16 bg-[#D4AF37]' : 'w-6 bg-white/25'}`} />
        ))}
      </div>
    </section>
  );
}

// ============================================================
// WELCOME STRIP
// ============================================================
function WelcomeStrip() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="bg-white py-24 md:py-32 px-8 md:px-20 border-b border-stone-100">
      <div className="max-w-[1500px] mx-auto grid md:grid-cols-2 gap-16 md:gap-24 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[#D4AF37] text-[9px] uppercase tracking-[0.6em] font-bold block mb-5">
            Univers FEMININ
          </span>
          <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-black leading-tight mb-6">
            Bienvenue chez<br />MB-Creation
          </h2>
          <div className="h-px w-12 bg-[#D4AF37] mb-6" />
          <p className="text-stone-400 text-sm font-light leading-relaxed max-w-md">
            De l'héritage africain au tailoring contemporain, chaque pièce MB-Creation est conçue pour la femme qui refuse de choisir entre identité et élégance. Matières nobles, coupes précises, âme authentique.
          </p>
          <motion.a
            href="#collections"
            className="inline-flex items-center gap-3 mt-8 text-[9px] uppercase tracking-[0.4em] font-black text-stone-900 border-b border-stone-200 pb-1 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors duration-300 group"
          >
            Explorer les collections
            <ArrowRight size={12} strokeWidth={2} className="group-hover:translate-x-1 transition-transform duration-300" />
          </motion.a>
        </motion.div>

        {/* Images décoratives */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 gap-4 h-96"
        >
          <div className="relative overflow-hidden bg-stone-100">
            <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600" alt="" className="w-full h-full object-cover" style={{ filter: 'sepia(0.08)' }} />
          </div>
          <div className="relative overflow-hidden bg-stone-100 mt-8">
            <img src="https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=600" alt="" className="w-full h-full object-cover" style={{ filter: 'sepia(0.08)' }} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================
// PRODUCT CARD
// ============================================================
function ProductCard({ product, index, onOpen }: { product: Product; index: number; onOpen: (p: Product) => void }) {
  const [liked, setLiked] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col"
    >
      <div className="relative overflow-hidden bg-stone-100 cursor-pointer mb-5" style={{ aspectRatio: '3/4' }} onClick={() => onOpen(product)}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-[1.06]"
          style={{ filter: 'brightness(0.97) sepia(0.05)' }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-700" />

        {/* Wishlist */}
        <button
          onClick={e => { e.stopPropagation(); setLiked(l => !l); }}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <Heart size={13} strokeWidth={1.5} className={liked ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-stone-500'} />
        </button>

        {/* CTA */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
          <button onClick={() => onOpen(product)}
            className="w-full py-3.5 bg-white text-black text-[9px] uppercase tracking-[0.4em] font-black hover:bg-[#D4AF37] transition-colors duration-300">
            Aperçu rapide
          </button>
        </div>
      </div>

      <span className="text-[9px] uppercase tracking-[0.4em] text-[#D4AF37] font-bold mb-1">{product.category}</span>
      <h3 className="text-sm font-black uppercase tracking-wider text-stone-900 mb-1">{product.name}</h3>
      <p className="text-sm font-light text-stone-400">{product.price} <span className="text-[10px] tracking-widest">{product.currency}</span></p>
      <button onClick={() => onOpen(product)}
        className="mt-3 self-start flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] font-bold text-stone-900 border-b border-stone-200 pb-0.5 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors duration-300 group/btn">
        Détails
        <ArrowRight size={11} strokeWidth={2} className="group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </motion.article>
  );
}

// ============================================================
// COLLECTION SECTION
// ============================================================
function CollectionSection({ collection, onOpen }: { collection: typeof collections[0]; onOpen: (p: Product) => void }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div id={collection.anchor} className="py-20 border-b border-stone-100 scroll-mt-24">
      <div ref={ref} className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8"
        >
          <div>
            <span className="text-[#D4AF37] text-[9px] uppercase tracking-[0.6em] font-bold block mb-3">
              Collection
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-black leading-none">
              {collection.title}
            </h2>
          </div>
          <p className="text-stone-400 text-sm font-light max-w-sm leading-relaxed md:text-right">
            {collection.description}
          </p>
        </motion.div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="origin-left h-px bg-stone-100"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
        {collection.products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// MODAL
// ============================================================
function ProductModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
    const [imgIdx, setImgIdx] = useState(0);
    const [size, setSize] = useState('');
    const [added, setAdded] = useState(false);
    const { addToCart } = useCart();

  useEffect(() => { setImgIdx(0); setSize(''); setAdded(false); }, [product]);
  useEffect(() => {
    if (!product) return;
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [product, onClose]);

  if (!product) return null;

 const handleAdd = () => {
    const priceNumber = parseInt(product.price.replace(/\s/g, ''), 10);
    addToCart({
      id: product.id,
      name: product.name,
      price: priceNumber,
      image: product.images[0],
      quantity: 1,
      reference: `REF-${product.id.toString().padStart(4, '0')}`,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/75 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto md:overflow-hidden flex flex-col md:flex-row shadow-[0_40px_120px_rgba(0,0,0,0.5)]"
        >
          <button onClick={onClose}
            className="absolute top-5 right-5 z-50 w-9 h-9 flex items-center justify-center bg-stone-100 hover:bg-stone-900 hover:text-white transition-all duration-300">
            <X size={16} strokeWidth={1.5} />
          </button>

          {/* Galerie */}
          <div className="w-full md:w-[55%] flex flex-col md:flex-row bg-stone-50 shrink-0">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-2 p-4 overflow-x-auto md:overflow-y-auto shrink-0">
              {product.images.map((img, idx) => (
                <div key={idx} onClick={() => setImgIdx(idx)}
                  className={`flex-shrink-0 cursor-pointer overflow-hidden transition-all duration-300 ${imgIdx === idx ? 'ring-1 ring-[#D4AF37] opacity-100' : 'opacity-30 hover:opacity-70'}`}
                  style={{ width: 52, height: 72, minWidth: 52 }}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {/* Image principale */}
            <div className="flex-grow h-[360px] md:h-auto overflow-hidden bg-stone-100">
              <motion.img
                key={`${product.id}-${imgIdx}`}
                src={product.images[imgIdx]}
                alt={product.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full object-cover"
                style={{ filter: 'brightness(0.97) sepia(0.04)', display: 'block' }}
              />
            </div>
          </div>

          {/* Infos */}
          <div className="w-full md:w-[45%] p-10 md:p-14 flex flex-col justify-between bg-white">
            <div>
              <div className="flex items-center gap-3 mb-7">
                <div className="h-px w-7 bg-[#D4AF37]" />
                <span className="text-[9px] uppercase tracking-[0.5em] text-[#D4AF37] font-bold">{product.category}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-black leading-none mb-4">{product.name}</h2>
              <p className="text-2xl font-light text-stone-800 mb-6">
                {product.price} <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{product.currency}</span>
              </p>
              <div className="h-px bg-stone-100 mb-6" />
              <p className="text-stone-500 text-sm font-light leading-relaxed mb-8">{product.description}</p>

              {/* Tailles */}
              <div>
                <p className="text-[9px] uppercase tracking-[0.4em] font-black text-stone-400 mb-3">Taille</p>
                <div className="flex flex-wrap gap-2">
                  {['S', 'M', 'L', 'XL', 'XXL'].map(s => (
                    <button key={s} onClick={() => setSize(s)}
                      className={`w-10 h-10 text-[10px] font-bold transition-all duration-200 border ${size === s ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-200 text-stone-600 hover:border-stone-500'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <button onClick={handleAdd}
                className={`w-full py-5 text-[9px] uppercase tracking-[0.45em] font-black flex items-center justify-center gap-4 transition-all duration-500 ${added ? 'bg-[#D4AF37] text-black' : 'bg-stone-900 text-white hover:bg-[#D4AF37] hover:text-black'}`}>
                <ShoppingBag size={14} strokeWidth={1.5} />
                {added ? '✓ Ajouté au panier' : 'Ajouter au panier'}
              </button>
              <p className="text-center text-[9px] uppercase tracking-widest text-stone-300 font-medium">
                Livraison offerte à Abidjan · 24/48h
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}




// PAGE PRINCIPALE
export default function MenPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <main className="bg-white min-h-screen font-sans antialiased">

      {/* HERO */}
      <HeroSlider />

      {/* WELCOME */}
      <WelcomeStrip />

    

      {/* COLLECTIONS */}
      <section id="collections" className="max-w-[1500px] mx-auto px-8 md:px-20 scroll-mt-24">
        {collections.map(col => (
          <CollectionSection key={col.id} collection={col} onOpen={setSelectedProduct} />
        ))}
      </section>



      {/* MODAL */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </main>
  );
}