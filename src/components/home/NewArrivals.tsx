'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Plus, ShoppingBag } from 'lucide-react';

const newArrivals = [
  {
    id: 1,
    name: 'Veste Smoking Velours',
    category: 'Collection Homme',
    price: '720 000',
    src: 'https://qoghqsbbsqjgjibhlpbp.supabase.co/storage/v1/object/sign/mb-creation%20article/malepage%20(2).PNG?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81OTZjMGNlOS1iZjM4LTRkOTItYjI2NC04ZGE2NGEwOGNjMTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYi1jcmVhdGlvbiBhcnRpY2xlL21hbGVwYWdlICgyKS5QTkciLCJpYXQiOjE3NzczMDAyMjMsImV4cCI6MTgwODgzNjIyM30.NABWxFTSQ1qGTiwfge_javTJukx4XBSwVeWOJ1ifLcs',
    size: 'large',
  },
  {
    id: 2,
    name: 'Robe Asymétrique Soie',
    category: 'Collection Femme',
    price: '430 000',
    src: 'https://qoghqsbbsqjgjibhlpbp.supabase.co/storage/v1/object/sign/mb-creation%20article/gallery%20(4)%20(1).jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81OTZjMGNlOS1iZjM4LTRkOTItYjI2NC04ZGE2NGEwOGNjMTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYi1jcmVhdGlvbiBhcnRpY2xlL2dhbGxlcnkgKDQpICgxKS5qcGciLCJpYXQiOjE3NzczMDA0MjksImV4cCI6MTgwODgzNjQyOX0.cR_TPzYNwnkTy5XVc1s-XsoDLZBSNqO5msdsf2AJXxc',
    size: 'small',
  },
  {
    id: 3,
    name: 'Trench Coat Crème',
    category: 'Essentiels Maison',
    price: '890 000',
    src: 'https://qoghqsbbsqjgjibhlpbp.supabase.co/storage/v1/object/sign/mb-creation%20article/MB-Crea-pic%20(6).jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81OTZjMGNlOS1iZjM4LTRkOTItYjI2NC04ZGE2NGEwOGNjMTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYi1jcmVhdGlvbiBhcnRpY2xlL01CLUNyZWEtcGljICg2KS5qcGciLCJpYXQiOjE3NzczMDAzNzIsImV4cCI6MTgwODgzNjM3Mn0.b68ByTGd8o7-umPWaYNeFj_cZNKeAoGy6pyE504fPdA',
    size: 'small',
  },
  {
    id: 4,
    name: 'Costume Lin Sable',
    category: 'Collection Homme',
    price: '610 000',
    src: 'https://qoghqsbbsqjgjibhlpbp.supabase.co/storage/v1/object/sign/mb-creation%20article/MB-Crea-pic%20(9).jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81OTZjMGNlOS1iZjM4LTRkOTItYjI2NC04ZGE2NGEwOGNjMTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYi1jcmVhdGlvbiBhcnRpY2xlL01CLUNyZWEtcGljICg5KS5qcGciLCJpYXQiOjE3NzczMDA0MDIsImV4cCI6MTgwODgzNjQwMn0.QvTS_bGnRnqYmNcu9H6aYKgZigexGofsrEzWxATO00E',
    size: 'small',
  },
  {
    id: 5,
    name: 'Accessoires Maroquinerie',
    category: 'Accessoires Prestige',
    price: '280 000',
    src: 'https://qoghqsbbsqjgjibhlpbp.supabase.co/storage/v1/object/sign/mb-creation%20article/gallery%20(12).jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81OTZjMGNlOS1iZjM4LTRkOTItYjI2NC04ZGE2NGEwOGNjMTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYi1jcmVhdGlvbiBhcnRpY2xlL2dhbGxlcnkgKDEyKS5qcGciLCJpYXQiOjE3NzczMDA5NTksImV4cCI6MTgwODgzNjk1OX0.KQ4rilM0fbOXRVIJTXRDkwo3aPRBIm4rTUW4jLNlk0w', // Nouvelle URL valide (fix 404)
    size: 'large',
  },
    {
    id: 6,
    name: 'Accessoires Maroquinerie',
    category: 'Accessoires Prestige',
    price: '280 000',
    src: 'https://qoghqsbbsqjgjibhlpbp.supabase.co/storage/v1/object/sign/mb-creation%20article/MB-Crea-pic%20(3).jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81OTZjMGNlOS1iZjM4LTRkOTItYjI2NC04ZGE2NGEwOGNjMTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYi1jcmVhdGlvbiBhcnRpY2xlL01CLUNyZWEtcGljICgzKS5qcGciLCJpYXQiOjE3NzczMDE4NDAsImV4cCI6MTgwODgzNzg0MH0.QSVSrCPnBoqzDBMJ3kZmL7gkc6x7JaFq2-VOcyzsQIk', // Nouvelle URL valide (fix 404)
    size: 'small',
  },
];

function ProductCard({ product, index }: { product: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`relative group ${product.size === 'large' ? 'md:col-span-2' : 'md:col-span-1'} mb-16`}
    >
      {/* Conteneur d'image réduit */}
      <div className={`relative mx-auto overflow-hidden bg-zinc-50 ${product.size === 'large' ? 'max-w-[90%] md:aspect-[16/9]' : 'max-w-[85%] aspect-[3/4]'}`}>
        <Image
          src={product.src}
          alt={product.name}
          fill
          unoptimized
          priority={index < 2} // Charge prioritairement les premières images
          className="object-cover transition-transform duration-[2000ms] group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Correction de l'erreur sizes
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>

      {/* Détails et Bouton */}
      <div className="mt-8 px-4 md:px-10 flex flex-col items-center text-center">
        <span className="text-[9px] uppercase tracking-[0.5em] text-[#D4AF37] font-bold mb-2">
          {product.category}
        </span>
        <h3 className="text-lg font-medium text-black uppercase tracking-tight mb-2">
          {product.name}
        </h3>
        <p className="text-md font-light text-black/60 mb-6">
          {product.price} <span className="text-[10px] ml-1 uppercase">FCFA</span>
        </p>

        <button className="flex items-center gap-3 px-8 py-3 border border-black text-black text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-black hover:text-white transition-all duration-300">
          <ShoppingBag size={14} />
          Ajouter au panier
        </button>
      </div>
    </motion.div>
  );
}

export default function NewArrivals() {
  return (
    <section className="bg-white py-32 px-6 md:px-16">
      <div className="max-w-[1400px] mx-auto">
        
       {/* --- HEADER ÉDITORIAL (Adapté pour fond blanc) --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12">
          <div className="max-w-2xl">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '60px' }}
              className="h-1 bg-[#D4AF37] mb-8"
            />
            <h2 className="text-5xl md:text-7xl  text-black  leading-none tracking-tighter italic"> {/* Texte Noir */}
              New <br />
              <span className="text-[#D4AF37]">Arrivals</span>
            </h2>
          </div>
          <div className="md:text-right space-y-6">
            <p className="text-black/50 max-w-xs md:ml-auto text-sm font-light leading-relaxed uppercase tracking-widest"> {/* Texte Noir/Gris */}
              L'expression du savoir-faire MB-CREATION à travers nos dernières pièces de couture.
            </p>
            <button className="text-[#D4AF37] text-[10px] uppercase tracking-[0.5em] font-bold border-b border-[#D4AF37] pb-2 hover:text-black hover:border-black transition-colors">
              Explorer tout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24 items-start">
          <div className="space-y-32">
            <ProductCard product={newArrivals[0]} index={0} />
            <div className="hidden md:block h-32" />
            <ProductCard product={newArrivals[3]} index={3} />
            <ProductCard product={newArrivals[5]} index={5} />
          </div>

          <div className="space-y-32 md:pt-24">
            <ProductCard product={newArrivals[1]} index={1} />
            <ProductCard product={newArrivals[2]} index={2} />
            <ProductCard product={newArrivals[4]} index={4} />
           
          </div>
        </div>
      </div>
    </section>
  );
}