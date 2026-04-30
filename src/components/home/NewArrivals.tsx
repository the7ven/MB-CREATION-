'use client';
import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Product {
  id: number;
  number: string;
  name: string;
  nameLine2: string;
  category: string;
  price: string;
  src: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const newArrivals: Product[] = [
  {
    id: 1,
    number: 'N° 001',
    name: 'Veste Smoking',
    nameLine2: 'Velours',
    category: 'Collection Homme',
    price: '720 000',
    src: 'https://qoghqsbbsqjgjibhlpbp.supabase.co/storage/v1/object/sign/mb-creation%20article/malepage%20(2).PNG?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81OTZjMGNlOS1iZjM4LTRkOTItYjI2NC04ZGE2NGEwOGNjMTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYi1jcmVhdGlvbiBhcnRpY2xlL21hbGVwYWdlICgyKS5QTkciLCJpYXQiOjE3NzczMDAyMjMsImV4cCI6MTgwODgzNjIyM30.NABWxFTSQ1qGTiwfge_javTJukx4XBSwVeWOJ1ifLcs',
  },
  {
    id: 2,
    number: 'N° 002',
    name: 'Robe Asymétrique',
    nameLine2: 'Soie',
    category: 'Collection Femme',
    price: '430 000',
    src: 'https://qoghqsbbsqjgjibhlpbp.supabase.co/storage/v1/object/sign/mb-creation%20article/gallery%20(4)%20(1).jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81OTZjMGNlOS1iZjM4LTRkOTItYjI2NC04ZGE2NGEwOGNjMTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYi1jcmVhdGlvbiBhcnRpY2xlL2dhbGxlcnkgKDQpICgxKS5qcGciLCJpYXQiOjE3NzczMDA0MjksImV4cCI6MTgwODgzNjQyOX0.cR_TPzYNwnkTy5XVc1s-XsoDLZBSNqO5msdsf2AJXxc',
  },
  {
    id: 3,
    number: 'N° 003',
    name: 'Trench Coat',
    nameLine2: 'Crème',
    category: 'Essentiels Maison',
    price: '890 000',
    src: 'https://qoghqsbbsqjgjibhlpbp.supabase.co/storage/v1/object/sign/mb-creation%20article/MB-Crea-pic%20(6).jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81OTZjMGNlOS1iZjM4LTRkOTItYjI2NC04ZGE2NGEwOGNjMTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYi1jcmVhdGlvbiBhcnRpY2xlL01CLUNyZWEtcGljICg2KS5qcGciLCJpYXQiOjE3NzczMDAzNzIsImV4cCI6MTgwODgzNjM3Mn0.b68ByTGd8o7-umPWaYNeFj_cZNKeAoGy6pyE504fPdA',
  },
  {
    id: 4,
    number: 'N° 004',
    name: 'Costume Lin',
    nameLine2: 'Sable',
    category: 'Collection Homme',
    price: '610 000',
    src: 'https://qoghqsbbsqjgjibhlpbp.supabase.co/storage/v1/object/sign/mb-creation%20article/MB-Crea-pic%20(9).jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81OTZjMGNlOS1iZjM4LTRkOTItYjI2NC04ZGE2NGEwOGNjMTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYi1jcmVhdGlvbiBhcnRpY2xlL01CLUNyZWEtcGljICg5KS5qcGciLCJpYXQiOjE3NzczMDA0MDIsImV4cCI6MTgwODgzNjQwMn0.QvTS_bGnRnqYmNcu9H6aYKgZigexGofsrEzWxATO00E',
  },
  {
    id: 5,
    number: 'N° 005',
    name: 'Maroquinerie',
    nameLine2: 'Prestige',
    category: 'Accessoires Prestige',
    price: '280 000',
    src: 'https://qoghqsbbsqjgjibhlpbp.supabase.co/storage/v1/object/sign/mb-creation%20article/gallery%20(5).jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81OTZjMGNlOS1iZjM4LTRkOTItYjI2NC04ZGE2NGEwOGNjMTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYi1jcmVhdGlvbiBhcnRpY2xlL2dhbGxlcnkgKDUpLmpwZyIsImlhdCI6MTc3NzQyMzQxMiwiZXhwIjoxODA4OTU5NDEyfQ.OPVORdfJpJsScybrgE-VKHs0WU0bFxZ3JhpGw6nls-g',
  },
  {
    id: 6,
    number: 'N° 006',
    name: 'Maroquinerie',
    nameLine2: 'Signature',
    category: 'Accessoires Prestige',
    price: '280 000',
    src: 'https://qoghqsbbsqjgjibhlpbp.supabase.co/storage/v1/object/sign/mb-creation%20article/gallery%20(8).jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81OTZjMGNlOS1iZjM4LTRkOTItYjI2NC04ZGE2NGEwOGNjMTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYi1jcmVhdGlvbiBhcnRpY2xlL2dhbGxlcnkgKDgpLmpwZyIsImlhdCI6MTc3NzQyMzMxNiwiZXhwIjoxODA4OTU5MzE2fQ.Tqj78V3o_h0PMtMxJWcCHjdXm2PRr1YdtM20reL-HrM',
  },
];

// ─── Product Card ──────────────────────────────────────────────────────────────

function ProductCard({ product, delay = 0 }: { product: Product; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

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
        <div className="relative overflow-hidden bg-[#E8E2D9] cursor-pointer">

          {/* Gold border on hover */}
          <div className="absolute inset-0 z-10 pointer-events-none border border-transparent group-hover:border-[#C9A84C]/40 transition-[border-color] duration-500" />

          {/* Image */}
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <Image
              src={product.src}
              alt={product.name}
              fill
              unoptimized
              priority={product.id <= 2}
              className="object-cover transition-transform duration-[2500ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Hover overlay with CTA */}
          <div className="absolute inset-0 z-[5] flex items-end p-7 bg-gradient-to-t from-[#1A1714]/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <button className="w-full border border-[#C9A84C]/70 text-[#E8C97A] text-[10px] tracking-[0.4em] uppercase font-light py-[14px] hover:bg-[#C9A84C] hover:border-[#C9A84C] hover:text-[#1A1714] transition-all duration-300">
              Ajouter au panier
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
              <br />
              {product.nameLine2}
            </h3>
          </div>

          <div className="text-right flex-shrink-0 pt-4">
            <p
              className="text-[17px] text-[#1A1714] whitespace-nowrap"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
            >
              {product.price}
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
          {product.number}
        </p>

      </div>
    </motion.article>
  );
}

// ─── Main Section ──────────────────────────────────────────────────────────────

export default function NewArrivals() {
  const leftCol = [newArrivals[0], newArrivals[3], newArrivals[5]];
  const rightCol = [newArrivals[1], newArrivals[2], newArrivals[4]];

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
                L'expression du savoir&#8209;faire à travers nos dernières pièces de haute couture
              </p>
              <button className="group/cta inline-flex items-center gap-3 text-[10px] tracking-[0.35em] uppercase text-[#C9A84C] font-light transition-colors hover:text-[#1A1714]">
                Explorer la collection
                <span className="inline-block w-6 h-[1px] bg-[#C9A84C] group-hover/cta:w-10 transition-all duration-400" />
              </button>
            </motion.div>
          </header>

          {/* ── Product grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-0">

            {/* Left column */}
            <div>
              <ProductCard product={leftCol[0]} delay={0} />
              <ProductCard product={leftCol[1]} delay={200} />
              <ProductCard product={leftCol[2]} delay={400} />
            </div>

            {/* Right column — offset down */}
            <div className="md:pt-[120px]">
              <ProductCard product={rightCol[0]} delay={100} />
              <ProductCard product={rightCol[1]} delay={300} />
              <ProductCard product={rightCol[2]} delay={500} />
            </div>
          </div>

          {/* ── Ornament divider ── */}
          <div className="flex items-center gap-4 justify-center my-0 mb-[72px] text-[8px] tracking-[0.4em] uppercase text-[#C9A84C] font-light">
            <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#E8E2D9] to-[#E8E2D9]" />
            6 pièces
            <span className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#E8E2D9] to-[#E8E2D9]" />
          </div>

          {/* ── Section footer ── */}
          <div className="flex items-center justify-between pt-10 border-t border-[#E8E2D9]">
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#B8AFA0] font-extralight">
              Saison Printemps – Été 2025
            </span>

            <button className="group/footer flex items-center gap-5">
              <span className="text-[10px] tracking-[0.45em] uppercase text-[#1A1714] font-light group-hover/footer:text-[#C9A84C] transition-colors duration-300">
                Explorer toute la collection
              </span>
              <span className="relative inline-block w-12 h-[1px] bg-[#1A1714] group-hover/footer:w-16 group-hover/footer:bg-[#C9A84C] transition-all duration-400">
                <span className="absolute right-0 top-[-3px] w-[7px] h-[7px] border-t border-r border-[#1A1714] group-hover/footer:border-[#C9A84C] rotate-45 transition-colors duration-300" />
              </span>
            </button>
          </div>

        </div>
      </section>
    </>
  );
}