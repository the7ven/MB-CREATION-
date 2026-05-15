'use client';
import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ShoppingBag, Heart, ArrowRight, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';

interface SupaProduct {
  id: number | string;
  name: string;
  category: string;
  price: number;
  badge: string | null;
  image_url: string;
  images: string[];
  is_available: boolean;
  section: string | null;
  old_price?: number | null;
  expires_in?: string | null;
  description?: string | null;
  sizes?: string[];
  label?: string;
}

const BADGE_STYLES: Record<string, string> = {
  'Best Seller': 'bg-[#D4AF37] text-black',
  'Nouveau':     'bg-stone-900 text-white',
  'Tendance':    'bg-stone-100 text-stone-700',
  'Exclusif':    'border border-[#D4AF37] text-[#D4AF37]',
};

function formatPrice(price: number): string {
  return price.toLocaleString('fr-FR');
}

function ProductCard({ product, index, onOpen }: { product: SupaProduct; index: number; onOpen: (p: SupaProduct) => void }) {
  const [liked, setLiked] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

  const handleCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      quantity: 1,
      reference: `REF-${product.id.toString().padStart(4, '0')}`,
    });
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
      <div 
        className="relative overflow-hidden bg-stone-100 aspect-[3/4] cursor-pointer"
        onClick={() => onOpen(product)}
      >
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
          unoptimized
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-4 left-4 z-10">
            <span className={`text-[9px] uppercase tracking-[0.25em] font-bold px-3 py-1.5 ${BADGE_STYLES[product.badge] ?? 'bg-stone-900 text-white'}`}>
              {product.badge}
            </span>
          </div>
        )}

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
            onClick={(e) => {
              e.stopPropagation();
              handleCart();
            }}
            className="w-full py-4 bg-stone-900 text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-[#D4AF37] hover:text-black transition-colors duration-300 flex items-center justify-center gap-3"
          >
            <AnimatePresence mode="wait">
              {addedToCart ? (
                <motion.span key="added" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex items-center gap-2">
                  ✓ Added to cart
                </motion.span>
              ) : (
                <motion.span key="add" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex items-center gap-3">
                  <ShoppingBag size={14} strokeWidth={1.5} />
                  Add to cart
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
          {formatPrice(product.price)} <span className="text-[10px] tracking-widest">FCFA</span>
        </p>
      </div>
    </motion.div>
  );
}

// ============================================================
// MODAL — avec galerie multi-vues
// ============================================================
function ProductModal({ product, onClose }: { product: SupaProduct | null; onClose: () => void }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [size,   setSize]   = useState('');
  const [added,  setAdded]  = useState(false);
  const { addToCart } = useCart();

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
                <span className="text-[9px] uppercase tracking-[0.5em] text-[#D4AF37] font-bold">{product.badge || 'Sélection'}</span>
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
             
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}



export const dynamic = 'force-dynamic';
export default function BestSellers() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [products, setProducts] = useState<SupaProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<SupaProduct | null>(null);

  useEffect(() => {
    async function fetchBestSellers() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('section', 'best-sellers')
        .eq('is_available', true)
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) {
        console.error('Erreur best sellers:', error.message);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    }
    fetchBestSellers();
  }, []);

  if (!loading && products.length === 0) return null;

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
              Our best{' '}
              <span className="italic text-[#D4AF37] underline underline-offset-8 decoration-[#D4AF37] decoration-2">sellers</span>
            </motion.h2>
          </div>

          <motion.a
            href="/shop/trending"
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden md:flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-bold text-stone-900 hover:text-[#D4AF37] transition-colors group"
          >
           Discover the Collection
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
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3 animate-pulse">
                <div className="bg-stone-200 aspect-[3/4] w-full" />
                <div className="h-2 bg-stone-200 w-1/3 rounded" />
                <div className="h-3 bg-stone-200 w-2/3 rounded" />
                <div className="h-2 bg-stone-200 w-1/4 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} onOpen={setSelectedProduct} />
            ))}
          </div>
        )}

        {/* Mobile CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="md:hidden flex justify-center mt-14"
        >
          <a
            href="/shop/trending"
            className="px-12 py-5 border border-stone-900/20 text-stone-900 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-stone-900 hover:text-white transition-all duration-500 flex items-center gap-3"
          >
           Discover the Collection
            <ArrowRight size={14} strokeWidth={2} />
          </a>
        </motion.div>
      </div>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </section>
  );
}