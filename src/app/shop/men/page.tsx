'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Image from 'next/image';
import { ShoppingBag, X, Heart, ArrowRight, ArrowUpRight } from 'lucide-react';

// ==========================================
// DONNÉES
// ==========================================
const heroSlides = [
  {
    id: 1,
    title: "Made of Africa",
    subtitle: "L'héritage revisité",
    src: "https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?q=80&w=2000",
  },
  {
    id: 2,
    title: "Icone",
    subtitle: "Le Tailoring intemporel",
    src: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2000",
  },
  {
    id: 3,
    title: "Icone 2.0",
    subtitle: "Le futur de l'élégance",
    src: "https://images.unsplash.com/photo-1593032465175-481ac7f402a1?q=80&w=2000",
  },
];

const menProducts = [
  {
    id: 1,
    name: 'Veste Smoking Velours',
    category: 'Soirée',
    collection: 'icone',
    price: '720 000',
    images: [
      'https://images.unsplash.com/photo-1598971939794-52d8807d4766?q=80&w=1200',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200',
      'https://images.unsplash.com/photo-1592772874383-d08932d2c568?q=80&w=1200',
    ],
    description: "Une pièce d'exception taillée dans un velours de soie italien, offrant une silhouette structurée et un éclat profond pour vos soirées les plus prestigieuses.",
  },
  {
    id: 2,
    name: 'Boubou Moderne Kenté',
    category: 'Tradition',
    collection: 'africa',
    price: '450 000',
    images: [
      'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=800',
      'https://images.unsplash.com/photo-1563630381190-77c336ea545a?q=80&w=800',
      'https://images.unsplash.com/photo-1614612144521-17b2907af0e4?q=80&w=800',
    ],
    description: "L'alliance parfaite entre le savoir-faire ancestral et la coupe contemporaine. Tissage réalisé à la main.",
  },
  {
    id: 3,
    name: 'Veste Icone 2.0 Graphite',
    category: 'Tailoring',
    collection: 'icone2',
    price: '890 000',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800',
      'https://images.unsplash.com/photo-1594938384824-0230232f05ba?q=80&w=800',
    ],
    description: 'La vision futuriste du costume classique par MB-CREATION. Une coupe ultra-slim et des matériaux techniques.',
  },
  {
    id: 4,
    name: 'Chemise Soie Blanche',
    category: 'Essentiels',
    collection: 'icone',
    price: '185 000',
    images: [
      'https://images.unsplash.com/photo-1621072156002-e2fcced0b17d?q=80&w=800',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800',
    ],
    description: '100% soie de mûrier. Une fluidité incomparable pour un confort quotidien absolu.',
  },
];

const filters = [
  { id: 'all', label: 'Tout' },
  { id: 'africa', label: 'Made of Africa' },
  { id: 'icone', label: 'Icone' },
  { id: 'icone2', label: 'Icone 2.0' },
];

const collectionDescriptions: Record<string, { tagline: string; title: string; description: string }> = {
  all: {
    tagline: 'Univers Masculin',
    title: 'La collection',
    description:
      "De l'héritage africain au tailoring contemporain, chaque pièce MB-Creation est conçue pour l'homme qui refuse de choisir entre identité et élégance. Matières nobles, coupes précises, âme authentique.",
  },
  africa: {
    tagline: 'Racines & Modernité',
    title: 'Made of Africa',
    description:
      "Un hommage vibrant au continent. Tissages Kenté faits main, broderies traditionnelles revisitées, silhouettes contemporaines. Chaque pièce raconte l'histoire d'un savoir-faire ancestral porté vers l'avenir.",
  },
  icone: {
    tagline: 'Le Tailoring Intemporel',
    title: 'Collection Icone',
    description:
      "La quintessence du costume masculin. Coupes italiennes épurées, soies de mûrier, velours de nuit — des pièces qui traversent les décennies sans jamais perdre leur superbe. Pour l'homme qui incarne l'élégance naturellement.",
  },
  icone2: {
    tagline: "Le Futur de l'Élégance",
    title: 'Icone 2.0',
    description:
      "MB-Creation réinvente le classique avec des matériaux techniques de haute couture. Coupes ultra-slim, finitions architecturales et détails futuristes pour l'homme qui façonne les codes plutôt qu'il ne les suit.",
  },
};

// ==========================================
// HERO SLIDER
// ==========================================
function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % heroSlides.length), 6000);
    return () => clearInterval(t);
  }, []);

  const slide = heroSlides[current];

  return (
    <section className="relative h-[85vh] w-full overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={slide.src}
            alt={slide.title}
            fill
            unoptimized
            priority
            className="object-cover"
            style={{ filter: 'brightness(0.38) contrast(1.08)' }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px',
          mixBlendMode: 'overlay',
        }}
      />

      {/* Gradient bas */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 z-10"
        style={{ background: 'linear-gradient(to top, #000 0%, transparent 100%)' }}
      />

      {/* Contenu centré */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id + '-text'}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-6"
          >
            {/* Ligne décorative */}
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-[#D4AF37]/60" />
              <span className="font-cormorant text-[#D4AF37] text-sm uppercase tracking-[0.7em] font-light">
                {slide.subtitle}
              </span>
              <div className="h-px w-12 bg-[#D4AF37]/60" />
            </div>

            {/* Titre hero */}
            <h1
              className="font-cormorant text-white text-6xl md:text-[8rem] uppercase italic tracking-[-0.02em] leading-none"
              style={{ textShadow: '0 2px 40px rgba(0,0,0,0.5)' }}
            >
              {slide.title}
            </h1>

            <motion.a
              href="/shop/mens"
              whileHover={{ gap: '16px' }}
              className="font-cormorant flex items-center gap-3 mt-4 text-white/70 text-sm uppercase tracking-[0.4em] font-light hover:text-[#D4AF37] transition-colors duration-300"
            >
              Découvrir la collection
              <ArrowRight size={13} strokeWidth={1.5} />
            </motion.a>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-5">
        {heroSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`transition-all duration-700 h-px ${
              current === idx ? 'w-16 bg-[#D4AF37]' : 'w-6 bg-white/25 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Numéro slide */}
      <div className="font-cormorant absolute bottom-10 right-10 z-20 hidden md:flex items-center gap-2 text-white/25 text-sm tracking-[0.4em] font-light">
        <span className="text-white/60">0{current + 1}</span>
        <span>/</span>
        <span>0{heroSlides.length}</span>
      </div>
    </section>
  );
}

// ==========================================
// PRODUCT CARD
// ==========================================
function ProductCard({
  product,
  index,
  onOpen,
}: {
  product: (typeof menProducts)[0];
  index: number;
  onOpen: (p: typeof product) => void;
}) {
  const [liked, setLiked] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col"
    >
      {/* Image */}
      <div
        className="relative overflow-hidden bg-stone-100 cursor-pointer mb-6"
        style={{ aspectRatio: '3/4' }}
        onClick={() => onOpen(product)}
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          unoptimized
          className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-[1.06]"
          style={{ filter: 'brightness(0.97) sepia(0.06)' }}
        />

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-700" />

        {/* Wishlist */}
        <button
          onClick={e => { e.stopPropagation(); setLiked(l => !l); }}
          className="absolute top-5 right-5 z-10 p-2.5 bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
        >
          <Heart
            size={14}
            strokeWidth={1.5}
            className={`transition-colors duration-300 ${liked ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-stone-600'}`}
          />
        </button>

        {/* CTA slide-up */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
          <button
            onClick={() => onOpen(product)}
            className="font-cormorant w-full py-4 bg-white text-black text-sm uppercase tracking-[0.4em] font-light flex items-center justify-center gap-3 hover:bg-[#D4AF37] transition-colors duration-300"
          >
            <ArrowUpRight size={13} strokeWidth={1.5} />
            Aperçu rapide
          </button>
        </div>
      </div>

      {/* Infos */}
      <div className="font-cormorant flex flex-col items-center text-center gap-2 px-2">
        <span className="text-sm uppercase tracking-[0.45em] text-[#D4AF37] font-light">
          {product.category}
        </span>
        <h3 className="text-xl font-light uppercase tracking-widest text-stone-900 leading-tight">
          {product.name}
        </h3>
        <p className="text-stone-400 text-lg font-light">
          {product.price}{' '}
          <span className="text-sm tracking-widest">FCFA</span>
        </p>
        <button
          onClick={() => onOpen(product)}
          className="mt-3 flex items-center gap-2 text-sm uppercase tracking-[0.35em] font-light text-stone-900 border-b border-stone-200 pb-0.5 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors duration-300"
        >
          Détails & Achat
          <ArrowRight size={11} strokeWidth={1.5} />
        </button>
      </div>
    </motion.article>
  );
}

// ==========================================
// MODAL
// ==========================================
function ProductModal({
  product,
  onClose,
}: {
  product: (typeof menProducts)[0] | null;
  onClose: () => void;
}) {
  const [imgIdx, setImgIdx] = useState(0);
  const [size, setSize] = useState('');

  useEffect(() => { setImgIdx(0); }, [product]);

  if (!product) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Panel */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-white w-full max-w-5xl max-h-[92vh] md:max-h-[88vh] overflow-y-auto md:overflow-hidden flex flex-col md:flex-row shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
        >
          {/* Fermer */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-50 w-10 h-10 flex items-center justify-center bg-stone-100 hover:bg-stone-900 hover:text-white transition-all duration-300"
          >
            <X size={18} strokeWidth={1.5} />
          </button>

          {/* GAUCHE — Galerie */}
          <div className="w-full md:w-[58%] flex flex-col md:flex-row bg-stone-50" style={{ minHeight: 0 }}>
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-2 p-4 md:p-5 overflow-x-auto md:overflow-y-auto shrink-0">
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setImgIdx(idx)}
                  className={`flex-shrink-0 cursor-pointer overflow-hidden transition-all duration-300 ${
                    imgIdx === idx ? 'ring-1 ring-[#D4AF37] opacity-100' : 'opacity-35 hover:opacity-70'
                  }`}
                  style={{ width: 56, height: 80, minWidth: 56 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {/* Image principale */}
            <div className="flex-grow h-[420px] md:h-auto overflow-hidden bg-stone-100" style={{ minHeight: 0 }}>
              <motion.img
                key={`${product.id}-${imgIdx}`}
                src={product.images[imgIdx]}
                alt={product.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="w-full h-full object-cover"
                style={{ filter: 'brightness(0.97) sepia(0.05)', display: 'block' }}
              />
            </div>
          </div>

          {/* DROITE — Infos */}
          <div className="font-cormorant w-full md:w-[42%] p-10 md:p-14 flex flex-col justify-between bg-white">
            <div>
              {/* Collection */}
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px w-8 bg-[#D4AF37]" />
                <span className="text-sm uppercase tracking-[0.55em] text-[#D4AF37] font-light">
                  Collection {product.collection}
                </span>
              </div>

              {/* Nom */}
              <h2 className="text-3xl md:text-4xl font-light uppercase italic tracking-tight text-black leading-none mb-4">
                {product.name}
              </h2>

              {/* Prix */}
              <p className="text-2xl font-light text-stone-800 mb-6">
                {product.price}{' '}
                <span className="text-sm font-light uppercase tracking-widest text-stone-400">FCFA</span>
              </p>

              <div className="h-px bg-stone-100 mb-6" />

              {/* Description */}
              <p className="text-stone-500 text-base leading-relaxed font-light mb-10">
                {product.description}
              </p>

              {/* Tailles */}
              <div className="mb-8">
                <p className="text-sm uppercase tracking-[0.45em] font-light text-stone-400 mb-4">
                  Taille
                </p>
                <div className="flex flex-wrap gap-2">
                  {['S', 'M', 'L', 'XL', 'XXL'].map(s => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`w-11 h-11 text-sm font-light transition-all duration-200 border ${
                        size === s
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-4">
              <button className="w-full py-5 bg-stone-900 text-white text-sm uppercase tracking-[0.45em] font-light hover:bg-[#D4AF37] hover:text-black transition-all duration-500 flex items-center justify-center gap-4">
                <ShoppingBag size={15} strokeWidth={1.5} />
                Ajouter au panier
              </button>
              <p className="text-center text-sm uppercase tracking-widest text-stone-300 font-light">
                Livraison offerte à Abidjan sous 24/48h
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// ==========================================
// PAGE PRINCIPALE
// ==========================================
const PRODUCTS_PER_PAGE = 8;
const LOAD_MORE_STEP = 8;

export default function MenPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleCount, setVisibleCount] = useState(LOAD_MORE_STEP);
  const [selectedProduct, setSelectedProduct] = useState<(typeof menProducts)[0] | null>(null);
  const headerRef = useRef(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-60px' });

  const isAllFilter = activeFilter === 'all';

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
    setCurrentPage(1);
    setVisibleCount(LOAD_MORE_STEP);
  };

  const filtered =
    activeFilter === 'all' ? menProducts : menProducts.filter(p => p.collection === activeFilter);

  const loadMoreProducts = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const handleLoadMore = () => setVisibleCount(v => v + LOAD_MORE_STEP);

  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filtered.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const displayedProducts = isAllFilter ? loadMoreProducts : paginatedProducts;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setTimeout(() => {
      gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <main className="bg-white min-h-screen antialiased">

      <HeroSlider />

      <div className="max-w-[1500px] mx-auto px-6 md:px-14">

        {/* SECTION HEADER */}
        <div ref={headerRef} className="pt-24 pb-0 border-b border-stone-100">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10">
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFilter + '-header'}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Tagline */}
                  <span className="font-cormorant text-[#D4AF37] text-sm uppercase tracking-[0.6em] font-light block mb-4">
                    {collectionDescriptions[activeFilter].tagline}
                  </span>
                  {/* Titre collection */}
                  <h2 className="font-cormorant text-4xl md:text-6xl font-light italic tracking-tight text-black leading-none">
                    {collectionDescriptions[activeFilter].title}
                  </h2>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Filtres */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={headerInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="flex flex-wrap gap-x-10 gap-y-4 shrink-0"
            >
              {filters.map(f => (
                <button key={f.id} onClick={() => handleFilterChange(f.id)} className="relative py-1 group">
                  <span
                    className={`font-cormorant text-sm uppercase tracking-[0.45em] font-light transition-colors duration-300 ${
                      activeFilter === f.id
                        ? 'text-stone-900'
                        : 'text-stone-300 group-hover:text-stone-600'
                    }`}
                  >
                    {f.label}
                  </span>
                  {activeFilter === f.id && (
                    <motion.div
                      layoutId="filterUnderline"
                      className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#D4AF37]"
                    />
                  )}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Description + compteur */}
          <div className="pb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-2xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeFilter + '-desc'}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="font-cormorant text-stone-400 text-lg font-light leading-relaxed tracking-wide"
                >
                  {collectionDescriptions[activeFilter].description}
                </motion.p>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.span
                key={activeFilter + '-count'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="font-cormorant text-sm uppercase tracking-[0.4em] text-stone-400 font-light shrink-0"
              >
                {filtered.length} pièce{filtered.length > 1 ? 's' : ''}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* GRILLE PRODUITS */}
        <div ref={gridRef} className="scroll-mt-28">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter + '-' + currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-20 py-20"
            >
              {displayedProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onOpen={p => setSelectedProduct(p)}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* BAS DE GRILLE */}
        <div className="pb-32">

          {/* Load More */}
          {isAllFilter && hasMore && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-6 border-t border-stone-100 pt-12"
            >
              <span className="font-cormorant text-sm uppercase tracking-[0.4em] text-stone-300 font-light">
                {visibleCount} sur {filtered.length} pièces
              </span>

              <div className="w-48 h-px bg-stone-100 relative overflow-hidden">
                <motion.div
                  className="absolute left-0 top-0 h-full bg-[#D4AF37]"
                  initial={false}
                  animate={{ width: `${(visibleCount / filtered.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
              </div>

              <button
                onClick={handleLoadMore}
                className="font-cormorant group flex items-center gap-4 px-14 py-5 border border-stone-200 text-stone-900 text-sm uppercase tracking-[0.45em] font-light hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all duration-500"
              >
                Voir plus
                <span className="text-stone-300 group-hover:text-white/50 transition-colors font-light">
                  +{Math.min(LOAD_MORE_STEP, filtered.length - visibleCount)}
                </span>
              </button>
            </motion.div>
          )}

          {/* Fin de liste */}
          {isAllFilter && !hasMore && filtered.length > LOAD_MORE_STEP && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3 border-t border-stone-100 pt-12"
            >
              <div className="h-px w-12 bg-[#D4AF37]" />
              <span className="font-cormorant text-sm uppercase tracking-[0.45em] text-stone-300 font-light">
                Toute la collection
              </span>
            </motion.div>
          )}

          {/* Pagination numérotée */}
          {!isAllFilter && totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-stone-100 pt-10">

              <span className="font-cormorant text-sm uppercase tracking-[0.4em] text-stone-300 font-light">
                Page {currentPage} / {totalPages}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="font-cormorant w-10 h-10 flex items-center justify-center border border-stone-200 text-stone-400 hover:border-stone-900 hover:text-stone-900 transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed text-base"
                >
                  ←
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                  const isVisible =
                    page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                  const showEllipsisBefore = page === currentPage - 2 && currentPage > 3;
                  const showEllipsisAfter =
                    page === currentPage + 2 && currentPage < totalPages - 2;

                  if (showEllipsisBefore || showEllipsisAfter) {
                    return (
                      <span key={`e-${page}`} className="font-cormorant text-stone-300 text-base px-1">
                        ···
                      </span>
                    );
                  }
                  if (!isVisible) return null;

                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`font-cormorant w-10 h-10 flex items-center justify-center text-sm font-light tracking-wider transition-all duration-300 border ${
                        currentPage === page
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'border-stone-200 text-stone-400 hover:border-stone-900 hover:text-stone-900'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="font-cormorant w-10 h-10 flex items-center justify-center border border-stone-200 text-stone-400 hover:border-stone-900 hover:text-stone-900 transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed text-base"
                >
                  →
                </button>
              </div>

              <div className="hidden md:flex items-center gap-3">
                <div className="w-32 h-px bg-stone-100 relative overflow-hidden">
                  <motion.div
                    className="absolute left-0 top-0 h-full bg-[#D4AF37]"
                    initial={false}
                    animate={{ width: `${(currentPage / totalPages) * 100}%` }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                  />
                </div>
                <span className="font-cormorant text-sm uppercase tracking-[0.3em] text-stone-300 font-light">
                  {Math.round((currentPage / totalPages) * 100)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </main>
  );
}