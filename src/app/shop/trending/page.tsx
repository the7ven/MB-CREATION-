'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ShoppingBag, Heart, X, ArrowRight, ArrowUpRight, TrendingUp, Star, Flame, Zap } from 'lucide-react';
import { useCart } from '@/context/CartContext';

// ============================================================
// DONNÉES
// ============================================================

const trendingCategories = [
  { id: 'all', label: 'Tout', count: 12 },
  { id: 'new-arrivals', label: 'New Arrivals', count: 4 },
  { id: 'best-sellers', label: 'Best Sellers', count: 4 },
  { id: 'special-offers', label: 'Special Offers', count: 4 },
];

const trendingProducts = [
  // NEW ARRIVALS
  {
    id: 1,
    name: 'Veste Smoking Velours',
    category: 'new-arrivals',
    label: 'New Arrival',
    labelIcon: 'new',
    price: '720 000',
    oldPrice: null,
    currency: 'FCFA',
    rank: 1,
    badge: 'Nouveau',
    src: 'https://images.unsplash.com/photo-1598971939794-52d8807d4766?q=80&w=800&auto=format&fit=crop',
    hoverSrc: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
    description: 'Velours de soie italien, silhouette structurée pour vos soirées les plus prestigieuses.',
    sizes: ['S', 'M', 'L', 'XL'],
    featured: true,
  },
  {
    id: 2,
    name: 'Robe Asymétrique Soie',
    category: 'new-arrivals',
    label: 'New Arrival',
    labelIcon: 'new',
    price: '430 000',
    oldPrice: null,
    currency: 'FCFA',
    rank: 2,
    badge: 'Nouveau',
    src: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop',
    hoverSrc: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=800&auto=format&fit=crop',
    description: 'Soie naturelle, tombé parfait. Une élégance architecturale pour les grandes occasions.',
    sizes: ['XS', 'S', 'M', 'L'],
    featured: false,
  },
  {
    id: 3,
    name: 'Trench Coat Crème',
    category: 'new-arrivals',
    label: 'New Arrival',
    labelIcon: 'new',
    price: '890 000',
    oldPrice: null,
    currency: 'FCFA',
    rank: 3,
    badge: 'Nouveau',
    src: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop',
    hoverSrc: 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?q=80&w=800&auto=format&fit=crop',
    description: 'Gabardine anglaise double boutonnage, coupe intemporelle d\'une élégance absolue.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    featured: false,
  },
  {
    id: 4,
    name: 'Ensemble Kenté Mixte',
    category: 'new-arrivals',
    label: 'New Arrival',
    labelIcon: 'new',
    price: '540 000',
    oldPrice: null,
    currency: 'FCFA',
    rank: 4,
    badge: 'Nouveau',
    src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop',
    hoverSrc: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=800&auto=format&fit=crop',
    description: 'Tissage Kenté fait main, coupe contemporaine mixte pour un style africain moderne.',
    sizes: ['S', 'M', 'L', 'XL'],
    featured: false,
  },
  // BEST SELLERS
  {
    id: 5,
    name: 'Costume Prestige Homme',
    category: 'best-sellers',
    label: 'Best Seller',
    labelIcon: 'fire',
    price: '850 000',
    oldPrice: null,
    currency: 'FCFA',
    rank: 1,
    badge: 'Best Seller',
    src: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
    hoverSrc: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=800&auto=format&fit=crop',
    description: 'Notre pièce phare — coupe italienne, laine fine, finitions à la main. Le standard de l\'excellence.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    featured: true,
  },
  {
    id: 6,
    name: 'Robe Couture Soirée',
    category: 'best-sellers',
    label: 'Best Seller',
    labelIcon: 'fire',
    price: '620 000',
    oldPrice: null,
    currency: 'FCFA',
    rank: 2,
    badge: 'Best Seller',
    src: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=800&auto=format&fit=crop',
    hoverSrc: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop',
    description: 'La robe de soirée emblématique MB-Creation. Portée et plébiscitée saison après saison.',
    sizes: ['XS', 'S', 'M', 'L'],
    featured: false,
  },
  {
    id: 7,
    name: 'Boubou Kenté Prestige',
    category: 'best-sellers',
    label: 'Best Seller',
    labelIcon: 'fire',
    price: '450 000',
    oldPrice: null,
    currency: 'FCFA',
    rank: 3,
    badge: 'Best Seller',
    src: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=800&auto=format&fit=crop',
    hoverSrc: 'https://images.unsplash.com/photo-1614612144521-17b2907af0e4?q=80&w=800&auto=format&fit=crop',
    description: 'Notre bestseller africain. Tissage artisanal, coupe moderne — un hommage à l\'héritage.',
    sizes: ['S', 'M', 'L', 'XL'],
    featured: false,
  },
  {
    id: 8,
    name: 'Chemise Soie Signature',
    category: 'best-sellers',
    label: 'Best Seller',
    labelIcon: 'fire',
    price: '185 000',
    oldPrice: null,
    currency: 'FCFA',
    rank: 4,
    badge: 'Best Seller',
    src: 'https://images.unsplash.com/photo-1621072156002-e2fcced0b17d?q=80&w=800&auto=format&fit=crop',
    hoverSrc: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop',
    description: '100% soie de mûrier. Notre essentiels masculin le plus vendu depuis 3 saisons.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    featured: false,
  },
  // SPECIAL OFFERS
  {
    id: 9,
    name: 'Collection Soie Femme',
    category: 'special-offers',
    label: 'Special Offer',
    labelIcon: 'star',
    price: '434 000',
    oldPrice: '620 000',
    currency: 'FCFA',
    rank: 1,
    badge: '−30%',
    src: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=800&auto=format&fit=crop',
    hoverSrc: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=800&auto=format&fit=crop',
    description: 'Toute la ligne soie femme à -30%. Robes, ensembles et accessoires. Offre limitée 48h.',
    sizes: ['XS', 'S', 'M', 'L'],
    featured: true,
    expiresIn: '48H',
  },
  {
    id: 10,
    name: 'Costume Sur-Mesure',
    category: 'special-offers',
    label: 'Special Offer',
    labelIcon: 'star',
    price: '850 000',
    oldPrice: null,
    currency: 'FCFA',
    rank: 2,
    badge: 'Retouches offertes',
    src: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=800&auto=format&fit=crop',
    hoverSrc: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
    description: 'Pour toute commande costume, retouches gratuites + cravate offerte. Valable 72h.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    featured: false,
    expiresIn: '72H',
  },
  {
    id: 11,
    name: 'Collection Kids',
    category: 'special-offers',
    label: 'Special Offer',
    labelIcon: 'star',
    price: '140 000',
    oldPrice: '210 000',
    currency: 'FCFA',
    rank: 3,
    badge: '3 = 2',
    src: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop',
    hoverSrc: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=800&auto=format&fit=crop',
    description: '2 articles achetés = 1 offert sur toute la collection enfant. Le 3ème article est gratuit.',
    sizes: ['2A', '4A', '6A', '8A', '10A'],
    featured: false,
    expiresIn: '5J',
  },
  {
    id: 12,
    name: 'Manteau Cachemire',
    category: 'special-offers',
    label: 'Special Offer',
    labelIcon: 'star',
    price: '686 000',
    oldPrice: '980 000',
    currency: 'FCFA',
    rank: 4,
    badge: '−30%',
    src: 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?q=80&w=800&auto=format&fit=crop',
    hoverSrc: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop',
    description: 'Cachemire pur grade A, coupe droite intemporelle. Notre pièce d\'investissement par excellence.',
    sizes: ['S', 'M', 'L', 'XL'],
    featured: false,
    expiresIn: '48H',
  },
];

type Product = typeof trendingProducts[0];

const BADGE_CONFIG: Record<string, { bg: string; text: string }> = {
  'new': { bg: 'bg-stone-900', text: 'text-white' },
  'fire': { bg: 'bg-[#D4AF37]', text: 'text-black' },
  'star': { bg: 'bg-white border border-[#D4AF37]', text: 'text-[#D4AF37]' },
};

// ============================================================
// HERO
// ============================================================
function TrendingHero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-[70vh] w-full overflow-hidden bg-black">
      {/* Image parallax */}
      <motion.div style={{ y }} className="absolute inset-0 scale-110">
        <img
          src="https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?q=80&w=2000&auto=format&fit=crop"
          alt="Trending"
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.3) contrast(1.1)' }}
        />
      </motion.div>

      {/* Gradient */}
      <div className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #000 0%, transparent 60%)' }} />

      {/* Contenu */}
      <motion.div
        style={{ opacity }}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-5"
        >
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-[#D4AF37]/60" />
            <span className="text-[#D4AF37] text-[9px] uppercase tracking-[0.7em] font-bold flex items-center gap-2">
              <TrendingUp size={10} strokeWidth={2} />
              Ce qui fait la tendance
            </span>
            <div className="h-px w-12 bg-[#D4AF37]/60" />
          </div>

          <h1 className="text-white text-6xl md:text-[9rem] font-black uppercase italic tracking-[-0.02em] leading-none"
            style={{ textShadow: '0 4px 60px rgba(0,0,0,0.5)' }}>
            Trending
          </h1>

          <p className="text-white/40 text-sm font-light max-w-md leading-relaxed">
            New arrivals, best sellers et offres exclusives — tout ce qui fait l'actualité MB-Creation en ce moment.
          </p>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] uppercase tracking-[0.5em] text-white/25 font-light">Défiler</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-[#D4AF37]/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}

// ============================================================
// STATS BAR
// ============================================================
function StatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const stats = [
    { label: 'New Arrivals', value: '4', icon: <Zap size={14} className="text-[#D4AF37]" /> },
    { label: 'Best Sellers', value: '4', icon: <Flame size={14} className="text-[#D4AF37]" /> },
    { label: 'Offres Spéciales', value: '4', icon: <Star size={14} className="text-[#D4AF37]" /> },
    { label: 'Pièces Exclusives', value: '12', icon: <TrendingUp size={14} className="text-[#D4AF37]" /> },
  ];

  return (
    <div ref={ref} className="bg-stone-900 py-6 px-8 md:px-20">
      <div className="max-w-[1500px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-white/10">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="flex items-center gap-3 px-6 first:pl-0"
          >
            {s.icon}
            <div>
              <div className="text-white text-xl font-black tracking-tighter">{s.value}</div>
              <div className="text-white/30 text-[9px] uppercase tracking-[0.35em] font-light">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// FEATURED SPOTLIGHT (grande carte mise en avant)
// ============================================================
function FeaturedSpotlight({ product, onOpen }: { product: Product; onOpen: (p: Product) => void }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="group relative cursor-pointer col-span-2"
      onClick={() => onOpen(product)}
    >
      <div className="relative overflow-hidden bg-stone-900" style={{ aspectRatio: '16/7' }}>
        <img
          src={product.src}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-[2500ms] ease-out group-hover:scale-[1.04]"
          style={{ filter: 'brightness(0.45) contrast(1.1)' }}
        />

        {/* Gradient */}
        <div className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />

        {/* Content */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-10 md:p-14">
          <div className="max-w-lg">
            {'expiresIn' in product && product.expiresIn && (
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                <span className="text-[#D4AF37] text-[9px] uppercase tracking-[0.5em] font-bold">
                  Expire dans {product.expiresIn}
                </span>
              </div>
            )}
            <span className="text-[9px] uppercase tracking-[0.5em] text-white/40 font-light block mb-3">{product.label}</span>
            <h3 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white leading-none mb-3">
              {product.name}
            </h3>
            <p className="text-white/50 text-sm font-light leading-relaxed mb-6 max-w-sm">{product.description}</p>
            <div className="flex items-center gap-6">
              <div>
                {product.oldPrice && (
                  <span className="text-white/30 text-sm line-through mr-2">{product.oldPrice} {product.currency}</span>
                )}
                <span className="text-white text-xl font-light">{product.price} <span className="text-[10px] tracking-widest text-white/40">{product.currency}</span></span>
              </div>
              <button className="flex items-center gap-2 px-8 py-3 bg-[#D4AF37] text-black text-[9px] uppercase tracking-[0.35em] font-black hover:bg-white transition-colors duration-400">
                Voir la pièce <ArrowUpRight size={12} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        {/* Badge */}
        <div className="absolute top-8 right-8 z-20">
          <span className="text-[9px] uppercase tracking-[0.3em] font-black px-4 py-2 bg-[#D4AF37] text-black">
            {product.badge}
          </span>
        </div>

        {/* Wishlist */}
        <button
          onClick={e => { e.stopPropagation(); setLiked(l => !l); }}
          className="absolute top-8 left-8 z-20 p-2.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
        >
          <Heart size={15} strokeWidth={1.5} className={liked ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-white'} />
        </button>
      </div>
    </motion.div>
  );
}

// ============================================================
// PRODUCT CARD
// ============================================================
function TrendingCard({ product, index, onOpen }: { product: Product; index: number; onOpen: (p: Product) => void }) {
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col"
    >
      <div
        className="relative overflow-hidden bg-stone-100 cursor-pointer mb-5"
        style={{ aspectRatio: '3/4' }}
        onClick={() => onOpen(product)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Images avec fondu au hover */}
        <img
          src={product.src}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: hovered ? 0 : 1, filter: 'brightness(0.97) sepia(0.05)' }}
        />
        <img
          src={product.hoverSrc}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: hovered ? 1 : 0, filter: 'brightness(0.97) sepia(0.05)' }}
        />

        {/* Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className={`text-[9px] uppercase tracking-[0.25em] font-black px-3 py-1.5 ${BADGE_CONFIG[product.labelIcon]?.bg} ${BADGE_CONFIG[product.labelIcon]?.text}`}>
            {product.badge}
          </span>
        </div>

        {/* Expire badge */}
        {'expiresIn' in product && product.expiresIn && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-3 py-1.5">
            <div className="w-1 h-1 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold">{product.expiresIn}</span>
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={e => { e.stopPropagation(); setLiked(l => !l); }}
          className="absolute bottom-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <Heart size={13} strokeWidth={1.5} className={liked ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-stone-500'} />
        </button>

        {/* CTA slide */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
          <button onClick={() => onOpen(product)}
            className="w-full py-3.5 bg-stone-900 text-white text-[9px] uppercase tracking-[0.4em] font-black hover:bg-[#D4AF37] hover:text-black transition-colors duration-300">
            Aperçu rapide
          </button>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-700 pointer-events-none" />
      </div>

      {/* Prix avec ancien prix */}
      <div className="flex items-start justify-between mb-1">
        <span className="text-[9px] uppercase tracking-[0.4em] text-[#D4AF37] font-bold">{product.label}</span>
        {product.oldPrice && (
          <span className="text-[10px] text-stone-300 line-through font-light">{product.oldPrice}</span>
        )}
      </div>
      <h3 className="text-sm font-black uppercase tracking-wider text-stone-900 mb-1">{product.name}</h3>
      <p className="text-sm font-light text-stone-500">
        {product.price} <span className="text-[10px] tracking-widest text-stone-400">{product.currency}</span>
      </p>
      <button
        onClick={() => onOpen(product)}
        className="mt-3 self-start flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] font-bold text-stone-900 border-b border-stone-200 pb-0.5 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors duration-300 group/btn"
      >
        Détails
        <ArrowRight size={11} strokeWidth={2} className="group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </motion.article>
  );
}

// ============================================================
// SECTION PAR CATÉGORIE
// ============================================================
function CategorySection({
  categoryId, label, icon, products, onOpen
}: {
  categoryId: string;
  label: string;
  icon: React.ReactNode;
  products: Product[];
  onOpen: (p: Product) => void;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const featured = products.find(p => p.featured);
  const rest = products.filter(p => !p.featured);

  return (
    <div id={categoryId} className="scroll-mt-24 py-20 border-b border-stone-100">
      {/* Header */}
      <div ref={ref} className="mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              {icon}
              <span className="text-[#D4AF37] text-[9px] uppercase tracking-[0.6em] font-bold">{label}</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-black leading-none">
              {label.split(' ').map((w, i) => (
                <span key={i}>{w}{' '}</span>
              ))}
            </h2>
          </div>
          <Link
            href={`/shop/${categoryId}`}
            className="hidden md:flex items-center gap-3 text-[9px] uppercase tracking-[0.35em] font-bold text-stone-400 hover:text-[#D4AF37] transition-colors duration-300 group"
          >
            Voir tout
            <ArrowRight size={12} strokeWidth={2} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.1 }}
          className="origin-left h-px bg-stone-100"
        />
      </div>

      {/* Layout : featured en grand + grille */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {featured && <FeaturedSpotlight product={featured} onOpen={onOpen} />}
        {rest.map((p, i) => (
          <TrendingCard key={p.id} product={p} index={i} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// MODAL
// ============================================================
function ProductModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const [size, setSize] = useState('');
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => { setSize(''); setAdded(false); }, [product]);
  useEffect(() => {
    if (!product) return;
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [product, onClose]);

  if (!product) return null;

  const handleAddToCart = () => {
    const priceNumber = parseInt(product.price.replace(/\s/g, ''), 10);
    addToCart({
      id: product.id,
      name: product.name,
      price: priceNumber,
      image: product.src,
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
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto md:overflow-hidden flex flex-col md:flex-row shadow-[0_40px_120px_rgba(0,0,0,0.5)]"
        >
          <button onClick={onClose}
            className="absolute top-5 right-5 z-50 w-9 h-9 flex items-center justify-center bg-stone-100 hover:bg-stone-900 hover:text-white transition-all duration-300">
            <X size={16} strokeWidth={1.5} />
          </button>

          {/* Image */}
          <div className="w-full md:w-[50%] h-[320px] md:h-auto overflow-hidden bg-stone-100 shrink-0">
            <motion.img
              key={product.id}
              src={product.src}
              alt={product.name}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.97) sepia(0.04)', display: 'block' }}
            />
          </div>

          {/* Infos */}
          <div className="w-full md:w-[50%] p-10 md:p-12 flex flex-col justify-between bg-white">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-7 bg-[#D4AF37]" />
                <span className="text-[9px] uppercase tracking-[0.5em] text-[#D4AF37] font-bold">{product.label}</span>
              </div>

              <h2 className="text-3xl font-black uppercase italic tracking-tighter text-black leading-none mb-4">{product.name}</h2>

              <div className="flex items-baseline gap-3 mb-6">
                {product.oldPrice && (
                  <span className="text-stone-300 text-base line-through font-light">{product.oldPrice} {product.currency}</span>
                )}
                <span className="text-2xl font-light text-stone-800">
                  {product.price} <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{product.currency}</span>
                </span>
              </div>

              {'expiresIn' in product && product.expiresIn && (
                <div className="flex items-center gap-2 mb-5 px-4 py-3 bg-stone-50 border-l-2 border-[#D4AF37]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                  <span className="text-[9px] uppercase tracking-[0.4em] text-[#D4AF37] font-bold">
                    Offre expire dans {product.expiresIn}
                  </span>
                </div>
              )}

              <div className="h-px bg-stone-100 mb-5" />
              <p className="text-stone-500 text-sm font-light leading-relaxed mb-7">{product.description}</p>

              {/* Tailles */}
              <div>
                <p className="text-[9px] uppercase tracking-[0.4em] font-black text-stone-400 mb-3">Taille</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(s => (
                    <button key={s} onClick={() => setSize(s)}
                      className={`min-w-[44px] h-10 px-3 text-[10px] font-bold transition-all duration-200 border ${size === s ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-200 text-stone-600 hover:border-stone-500'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={handleAddToCart}
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

// ============================================================
// PAGE PRINCIPALE
// ============================================================
export default function TrendingPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-60px' });

  const sections = [
    {
      id: 'new-arrivals',
      label: 'New Arrivals',
      icon: <Zap size={13} strokeWidth={2} className="text-[#D4AF37]" />,
      products: trendingProducts.filter(p => p.category === 'new-arrivals'),
    },
    {
      id: 'best-sellers',
      label: 'Best Sellers',
      icon: <Flame size={13} strokeWidth={2} className="text-[#D4AF37]" />,
      products: trendingProducts.filter(p => p.category === 'best-sellers'),
    },
    {
      id: 'special-offers',
      label: 'Special Offers',
      icon: <Star size={13} strokeWidth={2} className="text-[#D4AF37]" />,
      products: trendingProducts.filter(p => p.category === 'special-offers'),
    },
  ];

  const visibleSections = activeFilter === 'all'
    ? sections
    : sections.filter(s => s.id === activeFilter);

  return (
    <main className="bg-white min-h-screen font-sans antialiased">

      {/* HERO */}
      <TrendingHero />

      {/* STATS */}
      <StatsBar />

      {/* CONTENU */}
      <div className="max-w-[1500px] mx-auto px-8 md:px-20">

        {/* FILTRES */}
        <div ref={headerRef} className="py-14 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-stone-100">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span className="text-stone-400 text-sm font-light">
              Filtrer par catégorie
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-wrap gap-2"
          >
            {trendingCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`relative px-6 py-2.5 text-[9px] uppercase tracking-[0.4em] font-black transition-all duration-300 border ${
                  activeFilter === cat.id
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-400 border-stone-200 hover:border-stone-400 hover:text-stone-700'
                }`}
              >
                {cat.label}
                <span className={`ml-2 text-[8px] ${activeFilter === cat.id ? 'text-[#D4AF37]' : 'text-stone-300'}`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </motion.div>
        </div>

        {/* SECTIONS */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {visibleSections.map(section => (
              <CategorySection
                key={section.id}
                categoryId={section.id}
                label={section.label}
                icon={section.icon}
                products={section.products}
                onOpen={setSelectedProduct}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* CTA BAS DE PAGE */}
        <div className="py-24 flex flex-col items-center gap-6 text-center">
          <div className="h-px w-12 bg-[#D4AF37]" />
          <h3 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter text-black">
            Voir toutes les collections
          </h3>
          <p className="text-stone-400 text-sm font-light max-w-sm">
            Explorez l'ensemble de l'univers MB-Creation — Homme, Femme, Enfant.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-2">
            {[["Men's", '/shop/men'], ["Women's", '/shop/women'], ['Kids', '/shop/kids']].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="px-10 py-4 border border-stone-200 text-stone-900 text-[9px] uppercase tracking-[0.4em] font-black hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all duration-400 flex items-center gap-3 group"
              >
                {label}
                <ArrowRight size={11} strokeWidth={2} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </main>
  );
}