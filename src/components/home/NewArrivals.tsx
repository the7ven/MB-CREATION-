'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import { ShoppingBag, X } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

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

function formatPrice(price: number): string {
  return price.toLocaleString('fr-FR');
}

// ─── Product Card ──────────────────────────────────────────────────────────────

function ProductCard({ product, delay = 0, index, onOpen }: { product: SupaProduct; delay?: number; index: number; onOpen: (p: SupaProduct) => void }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const number = `N° ${(index + 1).toString().padStart(3, '0')}`;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: delay / 1000, ease: [0.22, 1, 0.36, 1] }}
      className="group mb-[72px]"
    >
      <div className="mx-[20px]">

        {/* ── Image frame ── */}
        <div 
          className="relative overflow-hidden bg-[#E8E2D9] cursor-pointer"
          onClick={() => onOpen(product)}
        >

          {/* Gold border on hover */}
          <div className="absolute inset-0 z-10 pointer-events-none border border-transparent group-hover:border-[#C9A84C]/40 transition-[border-color] duration-500" />

          {/* Image */}
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              unoptimized
              priority={index < 2}
              className="object-cover transition-transform duration-[2500ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Hover overlay with CTA */}
          <div className="absolute inset-0 z-[5] flex items-end p-7 bg-gradient-to-t from-[#1A1714]/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <button
              onClick={handleAddToCart}
              className="w-full border border-[#C9A84C]/70 text-[#E8C97A] text-[10px] tracking-[0.4em] uppercase font-light py-[14px] hover:bg-[#C9A84C] hover:border-[#C9A84C] hover:text-[#1A1714] transition-all duration-300"
            >
              {addedToCart ? '✓ Added' : 'Add to cart'}
            </button>
          </div>
        </div>

        {/* ── Card info ── */}
        <div className="mt-5 px-[4px] flex justify-between items-start gap-3">
          <div>
            <p className="text-[9px] tracking-[0.45em] uppercase text-[#C9A84C] font-light mb-[6px]">
              {product.category}
            </p>
            <h3
              className="text-[20px] leading-[1.2] text-[#1A1714] tracking-[0.01em]"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
            >
              {product.name}
            </h3>
          </div>

          <div className="text-right flex-shrink-0 pt-4">
            <p
              className="text-[17px] text-[#1A1714] whitespace-nowrap"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
            >
              {formatPrice(product.price)}
            </p>
            <span className="block text-[8px] tracking-[0.3em] uppercase text-[#B8AFA0] font-extralight mt-[3px]">
              FCFA
            </span>
          </div>
        </div>

        {/* ── Piece number ── */}
        <p
          className="mt-3 pl-[1px] text-[10px] text-[#B8AFA0] tracking-[0.1em] italic"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {number}
        </p>

      </div>
    </motion.article>
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
          <button onClick={onClose} className="absolute top-5 right-5 z-50 w-9 h-9 flex items-center justify-center bg-[#E8E2D9] hover:bg-[#1A1714] hover:text-[#E8E2D9] transition-all duration-300">
            <X size={16} strokeWidth={1.5} />
          </button>

          {/* ── Galerie ── */}
          <div className="w-full md:w-[55%] flex flex-col md:flex-row bg-[#FAF7F2] shrink-0">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-2 p-4 overflow-x-auto md:overflow-y-auto shrink-0">
              {allImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setImgIdx(idx)}
                  className={`flex-shrink-0 cursor-pointer overflow-hidden transition-all duration-300 ${imgIdx === idx ? 'ring-1 ring-[#C9A84C] opacity-100' : 'opacity-30 hover:opacity-70'}`}
                  style={{ width: 52, height: 72, minWidth: 52 }}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {/* Image principale */}
            <div className="flex-grow h-[360px] md:h-auto overflow-hidden bg-[#E8E2D9]">
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
                <div className="h-px w-7 bg-[#C9A84C]" />
                <span className="text-[9px] uppercase tracking-[0.5em] text-[#C9A84C] font-bold">{product.badge || 'Sélection'}</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-[#1A1714] leading-none mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {product.name}
              </h2>

              <div className="flex items-baseline gap-3 mb-6">
                {product.old_price && (
                  <span className="text-[#B8AFA0] text-base line-through font-light">
                    {formatPrice(product.old_price)} FCFA
                  </span>
                )}
                <span className="text-2xl font-light text-[#1A1714]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {formatPrice(product.price)}{' '}
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#B8AFA0]" style={{ fontFamily: "'Jost', sans-serif" }}>FCFA</span>
                </span>
              </div>

              {product.expires_in && (
                <div className="flex items-center gap-2 mb-5 px-4 py-3 bg-[#FAF7F2] border-l-2 border-[#C9A84C]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
                  <span className="text-[9px] uppercase tracking-[0.4em] text-[#C9A84C] font-bold">
                    Offre expire dans {product.expires_in}
                  </span>
                </div>
              )}

              <div className="h-px bg-[#E8E2D9] mb-6" />
              <p className="text-[#B8AFA0] text-sm font-light leading-relaxed mb-8">{product.description}</p>

              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <p className="text-[9px] uppercase tracking-[0.4em] font-black text-[#B8AFA0] mb-3">Taille</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(s => (
                      <button key={s} onClick={() => setSize(s)}
                        className={`min-w-[44px] h-10 px-3 text-[10px] font-bold transition-all duration-200 border ${size === s ? 'bg-[#1A1714] text-white border-[#1A1714]' : 'border-[#E8E2D9] text-[#1A1714] hover:border-[#B8AFA0]'}`}>
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
                className={`w-full py-5 text-[9px] uppercase tracking-[0.45em] font-black flex items-center justify-center gap-4 transition-all duration-500 ${added ? 'bg-[#C9A84C] text-[#1A1714]' : 'bg-[#1A1714] text-white hover:bg-[#C9A84C] hover:text-[#1A1714]'}`}
              >
                <ShoppingBag size={14} strokeWidth={1.5} />
                {added ? '✓ Added to cart' : 'Add to cart'}
              </button>
             
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}


export const dynamic = 'force-dynamic';
export default function NewArrivals() {
  const [products, setProducts] = useState<SupaProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<SupaProduct | null>(null);

  useEffect(() => {
    async function fetchNewArrivals() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('section', 'new-arrivals')
        .eq('is_available', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Erreur new arrivals:', error.message);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    }
    fetchNewArrivals();
  }, []);

  // Split products into 2 columns for the staggered layout
  const leftCol: SupaProduct[] = [];
  const rightCol: SupaProduct[] = [];
  products.forEach((p, i) => {
    if (i % 2 === 0) leftCol.push(p);
    else rightCol.push(p);
  });

  if (!loading && products.length === 0) return null;

  return (
    <>
      {/* Google Fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@200;300;400&display=swap');
      `}</style>

      <section
        className="py-[80px] md:py-[100px] px-6 md:px-10 bg-[#FAF7F2]"
        style={{ fontFamily: "'Jost', sans-serif" }}
      >
        <div className="max-w-[1100px] mx-auto">

          {/* ── Header ── */}
          <header className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-end gap-10 mb-[80px] pb-12 border-b border-[#E8E2D9] relative">
            {/* Gold underline accent */}
            <div className="absolute bottom-[-1px] left-0 w-20 h-[2px] bg-[#C9A84C]" />

            <div>
              <motion.p
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-4 text-[10px] tracking-[0.5em] uppercase text-[#C9A84C] font-light mb-5"
              >
                <span className="inline-block w-8 h-[1px] bg-[#C9A84C]" />
                MB-Création — Collection 2025
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-[60px] md:text-[72px] leading-[0.9] tracking-[-0.02em] text-[#1A1714]"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
              >
                New
                <br />
                <em className="text-[#C9A84C] not-italic" style={{ fontStyle: 'italic' }}>
                  Arrivals
                </em>
              </motion.h2>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="md:text-right max-w-[220px] md:ml-auto"
            >
              <p className="text-[11px] tracking-[0.18em] uppercase text-[#B8AFA0] font-extralight leading-[2] mb-6">
               The expression of know-how through our latest high fashion pieces
              </p>
              <a href="/shop/trending" className="group/cta inline-flex items-center gap-3 text-[10px] tracking-[0.35em] uppercase text-[#C9A84C] font-light transition-colors hover:text-[#1A1714]">
                Explore The Collection
                <span className="inline-block w-6 h-[1px] bg-[#C9A84C] group-hover/cta:w-10 transition-all duration-400" />
              </a>
            </motion.div>
          </header>

          {/* ── Product grid ── */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-0">
              {[0, 1].map(col => (
                <div key={col} className={col === 1 ? 'md:pt-[120px]' : ''}>
                  {[0, 1, 2].map(i => (
                    <div key={i} className="mb-[72px] mx-[20px] animate-pulse">
                      <div className="bg-[#E8E2D9] aspect-[3/4] w-full" />
                      <div className="mt-5 space-y-2">
                        <div className="h-2 bg-[#E8E2D9] w-1/3 rounded" />
                        <div className="h-4 bg-[#E8E2D9] w-2/3 rounded" />
                        <div className="h-2 bg-[#E8E2D9] w-1/4 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-0">
              {/* Left column */}
              <div>
                {leftCol.map((p, i) => (
                  <ProductCard key={p.id} product={p} delay={i * 200} index={i * 2} onOpen={setSelectedProduct} />
                ))}
              </div>

              {/* Right column — offset down */}
              <div className="md:pt-[120px]">
                {rightCol.map((p, i) => (
                  <ProductCard key={p.id} product={p} delay={i * 200 + 100} index={i * 2 + 1} onOpen={setSelectedProduct} />
                ))}
              </div>
            </div>
          )}

          {/* ── Ornament divider ── */}
          {!loading && products.length > 0 && (
            <div className="flex items-center gap-4 justify-center my-0 mb-[72px] text-[8px] tracking-[0.4em] uppercase text-[#C9A84C] font-light">
              <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#E8E2D9] to-[#E8E2D9]" />
              {products.length} pièces
              <span className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#E8E2D9] to-[#E8E2D9]" />
            </div>
          )}

          {/* ── Section footer ── */}
          <div className="flex items-center justify-between pt-10 border-t border-[#E8E2D9]">
            

            <a href="/shop/trending" className="group/footer flex items-center gap-5">
              <span className="text-[10px] tracking-[0.45em] uppercase text-[#1A1714] font-light group-hover/footer:text-[#C9A84C] transition-colors duration-300">
                Explore The Collection
              </span>
              <span className="relative inline-block w-12 h-[1px] bg-[#1A1714] group-hover/footer:w-16 group-hover/footer:bg-[#C9A84C] transition-all duration-400">
                <span className="absolute right-0 top-[-3px] w-[7px] h-[7px] border-t border-r border-[#1A1714] group-hover/footer:border-[#C9A84C] rotate-45 transition-colors duration-300" />
              </span>
            </a>
          </div>

        </div>
      </section>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </>
  );
}