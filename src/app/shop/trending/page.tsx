'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ShoppingBag, Heart, X, ArrowRight, ArrowUpRight, TrendingUp, Star, Flame, Zap } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Product {
  id: number;
  name: string;
  price: number;
  old_price: number | null;
  stock: number;
  category: string;
  badge: string | null;
  description: string | null;
  image_url: string;
  hover_image_url: string | null;
  images: string[];
  is_available: boolean;
  featured: boolean;
  sizes: string[];
  label_icon: 'new' | 'fire' | 'star';
  section: 'new-arrivals' | 'best-sellers' | 'special-offers';
  expires_in: string | null;
  label?: string;
}

const SECTIONS = [
  { id: 'new-arrivals',   label: 'New Arrivals',   icon: (active: boolean) => <Zap   size={13} strokeWidth={2} className={active ? 'text-[#D4AF37]' : 'text-stone-400'} /> },
  { id: 'best-sellers',   label: 'Best Sellers',   icon: (active: boolean) => <Flame size={13} strokeWidth={2} className={active ? 'text-[#D4AF37]' : 'text-stone-400'} /> },
  { id: 'special-offers', label: 'Special Offers', icon: (active: boolean) => <Star  size={13} strokeWidth={2} className={active ? 'text-[#D4AF37]' : 'text-stone-400'} /> },
];

const LABEL_MAP: Record<string, string> = {
  'new-arrivals':   'New Arrival',
  'best-sellers':   'Best Seller',
  'special-offers': 'Special Offer',
};

const BADGE_CONFIG: Record<string, { bg: string; text: string }> = {
  new:  { bg: 'bg-stone-900',                     text: 'text-white' },
  fire: { bg: 'bg-[#D4AF37]',                     text: 'text-black' },
  star: { bg: 'bg-white border border-[#D4AF37]', text: 'text-[#D4AF37]' },
};

function formatPrice(price: number): string {
  return price.toLocaleString('fr-FR');
}

// ============================================================
// HERO
// ============================================================
function TrendingHero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y       = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-[70vh] w-full overflow-hidden bg-black">
      <motion.div style={{ y }} className="absolute inset-0 scale-110">
        <img src="https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?q=80&w=2000&auto=format&fit=crop" alt="Trending" className="w-full h-full object-cover" style={{ filter: 'brightness(0.3) contrast(1.1)' }} />
      </motion.div>
      <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'linear-gradient(to top, #000 0%, transparent 60%)' }} />
      <motion.div style={{ opacity }} className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col items-center gap-5">
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-[#D4AF37]/60" />
            <span className="text-[#D4AF37] text-[9px] uppercase tracking-[0.7em] font-bold flex items-center gap-2"><TrendingUp size={10} strokeWidth={2} />Ce qui fait la tendance</span>
            <div className="h-px w-12 bg-[#D4AF37]/60" />
          </div>
          <h1 className="text-white text-6xl md:text-[9rem] font-black uppercase italic tracking-[-0.02em] leading-none" style={{ textShadow: '0 4px 60px rgba(0,0,0,0.5)' }}>Trending</h1>
          <p className="text-white/40 text-sm font-light max-w-md leading-relaxed">New arrivals, best sellers et offres exclusives — tout ce qui fait l'actualité MB-Creation en ce moment.</p>
        </motion.div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <span className="text-[9px] uppercase tracking-[0.5em] text-white/25 font-light">Défiler</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} className="w-px h-8 bg-gradient-to-b from-[#D4AF37]/50 to-transparent" />
      </motion.div>
    </section>
  );
}

// ============================================================
// STATS BAR
// ============================================================
function StatsBar({ counts }: { counts: Record<string, number> }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const stats = [
    { label: 'New Arrivals',      value: String(counts['new-arrivals']   ?? 0), icon: <Zap        size={14} className="text-[#D4AF37]" /> },
    { label: 'Best Sellers',      value: String(counts['best-sellers']   ?? 0), icon: <Flame      size={14} className="text-[#D4AF37]" /> },
    { label: 'Offres Spéciales',  value: String(counts['special-offers'] ?? 0), icon: <Star       size={14} className="text-[#D4AF37]" /> },
    { label: 'Pièces Exclusives', value: String(total),                          icon: <TrendingUp size={14} className="text-[#D4AF37]" /> },
  ];
  return (
    <div ref={ref} className="bg-stone-900 py-6 px-8 md:px-20">
      <div className="max-w-[1500px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-white/10">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.08 }} className="flex items-center gap-3 px-6 first:pl-0">
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
// FEATURED SPOTLIGHT
// ============================================================
function FeaturedSpotlight({ product, onOpen }: { product: Product; onOpen: (p: Product) => void }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [liked, setLiked] = useState(false);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="group relative cursor-pointer col-span-2" onClick={() => onOpen(product)}>
      <div className="relative overflow-hidden bg-stone-900" style={{ aspectRatio: '16/7' }}>
        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-[2500ms] ease-out group-hover:scale-[1.04]" style={{ filter: 'brightness(0.45) contrast(1.1)' }} />
        <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-10 md:p-14">
          <div className="max-w-lg">
            {product.expires_in && (<div className="flex items-center gap-2 mb-4"><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" /><span className="text-[#D4AF37] text-[9px] uppercase tracking-[0.5em] font-bold">Expire dans {product.expires_in}</span></div>)}
            <span className="text-[9px] uppercase tracking-[0.5em] text-white/40 font-light block mb-3">{product.label}</span>
            <h3 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white leading-none mb-3">{product.name}</h3>
            <p className="text-white/50 text-sm font-light leading-relaxed mb-6 max-w-sm">{product.description}</p>
            <div className="flex items-center gap-6">
              <div>
                {product.old_price && (<span className="text-white/30 text-sm line-through mr-2">{formatPrice(product.old_price)} FCFA</span>)}
                <span className="text-white text-xl font-light">{formatPrice(product.price)}{' '}<span className="text-[10px] tracking-widest text-white/40">FCFA</span></span>
              </div>
              <button className="flex items-center gap-2 px-8 py-3 bg-[#D4AF37] text-black text-[9px] uppercase tracking-[0.35em] font-black hover:bg-white transition-colors duration-300">Voir la pièce <ArrowUpRight size={12} strokeWidth={2} /></button>
            </div>
          </div>
        </div>
        {product.badge && (<div className="absolute top-8 right-8 z-20"><span className="text-[9px] uppercase tracking-[0.3em] font-black px-4 py-2 bg-[#D4AF37] text-black">{product.badge}</span></div>)}
        <button onClick={e => { e.stopPropagation(); setLiked(l => !l); }} className="absolute top-8 left-8 z-20 p-2.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors">
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
    <motion.article ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }} className="group flex flex-col">
      <div className="relative overflow-hidden bg-stone-100 cursor-pointer mb-5" style={{ aspectRatio: '3/4' }} onClick={() => onOpen(product)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <img src={product.image_url} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700" style={{ opacity: hovered && product.hover_image_url ? 0 : 1, filter: 'brightness(0.97) sepia(0.05)' }} />
        {product.hover_image_url && (<img src={product.hover_image_url} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700" style={{ opacity: hovered ? 1 : 0, filter: 'brightness(0.97) sepia(0.05)' }} />)}
        {product.badge && (<div className="absolute top-4 left-4 z-10"><span className={`text-[9px] uppercase tracking-[0.25em] font-black px-3 py-1.5 ${BADGE_CONFIG[product.label_icon]?.bg ?? 'bg-stone-900'} ${BADGE_CONFIG[product.label_icon]?.text ?? 'text-white'}`}>{product.badge}</span></div>)}
        {product.expires_in && (<div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-3 py-1.5"><div className="w-1 h-1 rounded-full bg-[#D4AF37] animate-pulse" /><span className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold">{product.expires_in}</span></div>)}
        <button onClick={e => { e.stopPropagation(); setLiked(l => !l); }} className="absolute bottom-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"><Heart size={13} strokeWidth={1.5} className={liked ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-stone-500'} /></button>
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"><button onClick={() => onOpen(product)} className="w-full py-3.5 bg-stone-900 text-white text-[9px] uppercase tracking-[0.4em] font-black hover:bg-[#D4AF37] hover:text-black transition-colors duration-300">Aperçu rapide</button></div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-700 pointer-events-none" />
      </div>
      <div className="flex items-start justify-between mb-1">
        <span className="text-[9px] uppercase tracking-[0.4em] text-[#D4AF37] font-bold">{product.label}</span>
        {product.old_price && (<span className="text-[10px] text-stone-300 line-through font-light">{formatPrice(product.old_price)}</span>)}
      </div>
      <h3 className="text-sm font-black uppercase tracking-wider text-stone-900 mb-1">{product.name}</h3>
      <p className="text-sm font-light text-stone-500">{formatPrice(product.price)} <span className="text-[10px] tracking-widest text-stone-400">FCFA</span></p>
      <button onClick={() => onOpen(product)} className="mt-3 self-start flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] font-bold text-stone-900 border-b border-stone-200 pb-0.5 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors duration-300 group/btn">Détails<ArrowRight size={11} strokeWidth={2} className="group-hover/btn:translate-x-1 transition-transform" /></button>
    </motion.article>
  );
}

// ============================================================
// CATEGORY SECTION
// ============================================================
function CategorySection({ sectionId, label, icon, products, onOpen }: { sectionId: string; label: string; icon: React.ReactNode; products: Product[]; onOpen: (p: Product) => void }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const featured = products.find(p => p.featured);
  const rest = products.filter(p => !p.featured);
  return (
    <div id={sectionId} className="scroll-mt-24 py-20 border-b border-stone-100">
      <div ref={ref} className="mb-14">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-4">{icon}<span className="text-[#D4AF37] text-[9px] uppercase tracking-[0.6em] font-bold">{label}</span></div>
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-black leading-none">{label}</h2>
          </div>
          <Link href={`/shop/${sectionId}`} className="hidden md:flex items-center gap-3 text-[9px] uppercase tracking-[0.35em] font-bold text-stone-400 hover:text-[#D4AF37] transition-colors duration-300 group">Voir tout<ArrowRight size={12} strokeWidth={2} className="group-hover:translate-x-1 transition-transform" /></Link>
        </motion.div>
        <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 1, delay: 0.1 }} className="origin-left h-px bg-stone-100" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {featured && <FeaturedSpotlight product={featured} onOpen={onOpen} />}
        {rest.map((p, i) => (<TrendingCard key={p.id} product={p} index={i} onOpen={onOpen} />))}
      </div>
    </div>
  );
}

// ============================================================
// MODAL — avec galerie multi-vues
// ============================================================
function ProductModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [size,   setSize]   = useState('');
  const [added,  setAdded]  = useState(false);
  const { addToCart } = useCart();

  // Construire la liste complète des images disponibles
  const allImages = product
    ? [
        product.image_url,
        ...(Array.isArray(product.images) ? product.images : []).filter(
          (img) => img && img !== product.image_url
        ),
      ].filter(Boolean)
    : [];

  useEffect(() => { setImgIdx(0); setSize(''); setAdded(false); }, [product]);
  useEffect(() => {
    if (!product) return;
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [product, onClose]);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      quantity: 1,
      reference: `REF-${product.id.toString().padStart(4, '0')}`,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto md:overflow-hidden flex flex-col md:flex-row shadow-[0_40px_120px_rgba(0,0,0,0.5)]"
        >
          <button onClick={onClose} className="absolute top-5 right-5 z-50 w-9 h-9 flex items-center justify-center bg-stone-100 hover:bg-stone-900 hover:text-white transition-all duration-300">
            <X size={16} strokeWidth={1.5} />
          </button>

          {/* ── Galerie ── */}
          <div className="w-full md:w-[55%] flex flex-col md:flex-row bg-stone-50 shrink-0">

            {/* Thumbnails */}
            <div className="flex md:flex-col gap-2 p-4 overflow-x-auto md:overflow-y-auto shrink-0">
              {allImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setImgIdx(idx)}
                  className={`flex-shrink-0 cursor-pointer overflow-hidden transition-all duration-300 ${imgIdx === idx ? 'ring-1 ring-[#D4AF37] opacity-100' : 'opacity-30 hover:opacity-70'}`}
                  style={{ width: 52, height: 72, minWidth: 52 }}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {/* Image principale */}
            <div className="flex-grow h-[360px] md:h-auto overflow-hidden bg-stone-100">
              <motion.img
                key={`${product.id}-${imgIdx}`}
                src={allImages[imgIdx]}
                alt={product.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full object-cover"
                style={{ filter: 'brightness(0.97) sepia(0.04)', display: 'block' }}
              />
            </div>
          </div>

          {/* ── Infos ── */}
          <div className="w-full md:w-[45%] p-10 md:p-14 flex flex-col justify-between bg-white">
            <div>
              <div className="flex items-center gap-3 mb-7">
                <div className="h-px w-7 bg-[#D4AF37]" />
                <span className="text-[9px] uppercase tracking-[0.5em] text-[#D4AF37] font-bold">{product.label}</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-black leading-none mb-4">
                {product.name}
              </h2>

              <div className="flex items-baseline gap-3 mb-6">
                {product.old_price && (
                  <span className="text-stone-300 text-base line-through font-light">
                    {formatPrice(product.old_price)} FCFA
                  </span>
                )}
                <span className="text-2xl font-light text-stone-800">
                  {formatPrice(product.price)}{' '}
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">FCFA</span>
                </span>
              </div>

              {product.expires_in && (
                <div className="flex items-center gap-2 mb-5 px-4 py-3 bg-stone-50 border-l-2 border-[#D4AF37]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                  <span className="text-[9px] uppercase tracking-[0.4em] text-[#D4AF37] font-bold">
                    Offre expire dans {product.expires_in}
                  </span>
                </div>
              )}

              <div className="h-px bg-stone-100 mb-6" />
              <p className="text-stone-500 text-sm font-light leading-relaxed mb-8">{product.description}</p>

              {product.sizes && product.sizes.length > 0 && (
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
              )}
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={handleAddToCart}
                className={`w-full py-5 text-[9px] uppercase tracking-[0.45em] font-black flex items-center justify-center gap-4 transition-all duration-500 ${added ? 'bg-[#D4AF37] text-black' : 'bg-stone-900 text-white hover:bg-[#D4AF37] hover:text-black'}`}
              >
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
// SKELETON
// ============================================================
function Skeleton() {
  return (
    <div className="py-20 space-y-6">
      <div className="h-6 bg-stone-100 w-48 rounded animate-pulse" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3 animate-pulse">
            <div className="bg-stone-100 w-full" style={{ aspectRatio: '3/4' }} />
            <div className="h-2 bg-stone-100 w-1/3 rounded" />
            <div className="h-3 bg-stone-100 w-2/3 rounded" />
            <div className="h-2 bg-stone-100 w-1/4 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// PAGE PRINCIPALE
// ============================================================
export const dynamic = "force-dynamic";
export default function TrendingPage() {
  const [products,        setProducts]        = useState<Product[]>([]);
  const [loading,         setLoading]         = useState(true);
  const [activeFilter,    setActiveFilter]    = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const headerRef    = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-60px' });

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('page', 'trending')
        .eq('is_available', true)
        .order('featured', { ascending: false });
      if (error) { console.error('Supabase error:', error); setLoading(false); return; }
      const enriched: Product[] = (data ?? []).map(p => ({ ...p, label: LABEL_MAP[p.section] ?? p.section }));
      setProducts(enriched);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const counts = SECTIONS.reduce((acc, s) => { acc[s.id] = products.filter(p => p.section === s.id).length; return acc; }, {} as Record<string, number>);
  const sections = SECTIONS.map(s => ({ ...s, products: products.filter(p => p.section === s.id) })).filter(s => s.products.length > 0);
  const visibleSections = activeFilter === 'all' ? sections : sections.filter(s => s.id === activeFilter);
  const categories = [
    { id: 'all', label: 'Tout', count: products.length },
    ...SECTIONS.map(s => ({ id: s.id, label: s.label, count: counts[s.id] ?? 0 })).filter(c => c.count > 0),
  ];

  return (
    <main className="bg-white min-h-screen font-sans antialiased">
      <TrendingHero />
      <StatsBar counts={counts} />
      <div className="max-w-[1500px] mx-auto px-8 md:px-20">

        {/* FILTRES */}
        <div ref={headerRef} className="py-14 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-stone-100">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={headerInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
            <span className="text-stone-400 text-sm font-light">Filtrer par catégorie</span>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={headerInView ? { opacity: 1 } : {}} transition={{ duration: 0.6, delay: 0.15 }} className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setActiveFilter(cat.id)}
                className={`relative px-6 py-2.5 text-[9px] uppercase tracking-[0.4em] font-black transition-all duration-300 border ${activeFilter === cat.id ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-400 border-stone-200 hover:border-stone-400 hover:text-stone-700'}`}>
                {cat.label}
                <span className={`ml-2 text-[8px] ${activeFilter === cat.id ? 'text-[#D4AF37]' : 'text-stone-300'}`}>{cat.count}</span>
              </button>
            ))}
          </motion.div>
        </div>

        {/* CONTENU */}
        {loading ? (
          <Skeleton />
        ) : products.length === 0 ? (
          <div className="py-32 flex flex-col items-center gap-4 text-center">
            <TrendingUp size={32} className="text-stone-200" />
            <p className="text-stone-400 text-sm font-light">Aucun produit trending pour le moment.<br />Ajoutez des produits avec <span className="font-bold text-stone-600">page = 'trending'</span> dans votre dashboard.</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={activeFilter} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
              {visibleSections.map(section => (
                <CategorySection key={section.id} sectionId={section.id} label={section.label} icon={section.icon(true)} products={section.products} onOpen={setSelectedProduct} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* CTA */}
        {!loading && (
          <div className="py-24 flex flex-col items-center gap-6 text-center">
            <div className="h-px w-12 bg-[#D4AF37]" />
            <h3 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter text-black">Voir toutes les collections</h3>
            <p className="text-stone-400 text-sm font-light max-w-sm">Explorez l'ensemble de l'univers MB-Creation — Homme, Femme, Enfant.</p>
            <div className="flex flex-wrap gap-4 justify-center mt-2">
              {[["Men's", '/shop/men'], ["Women's", '/shop/women'], ['Kids', '/shop/kids']].map(([label, href]) => (
                <Link key={label} href={href} className="px-10 py-4 border border-stone-200 text-stone-900 text-[9px] uppercase tracking-[0.4em] font-black hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all duration-300 flex items-center gap-3 group">
                  {label}<ArrowRight size={11} strokeWidth={2} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </main>
  );
}