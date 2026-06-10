'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const featured = [
  {
    id: 'men',
    label: 'Men',
    title: 'Sartorial Blazer',
    price: '82 000 FCFA',
    description: 'Tailored pieces for the modern gentleman.',
    href: '/shop/men',
    image: 'https://images.unsplash.com/photo-1521335629791-ce4aec67dd47?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'women',
    label: 'Women',
    title: 'Silk Wrap Dress',
    price: '68 000 FCFA',
    description: 'Fluid lines and bold prints for every occasion.',
    href: '/shop/women',
    image: 'https://images.unsplash.com/photo-1495121605193-b116b5b9c5e4?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'kids',
    label: 'Kids',
    title: 'Mini Royal Set',
    price: '45 000 FCFA',
    description: 'Comfortable heritage looks for little explorers.',
    href: '/shop/kids',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop',
  },
];

export default function FeaturedCategories() {
  return (
    <section className="max-w-[1500px] mx-auto px-6 md:px-20 py-24">
      <div className="text-center mb-16">
        <p className="text-[#D4AF37] text-[10px] uppercase tracking-[0.5em] font-bold mb-4">Shop by category</p>
        <h2 className="text-4xl md:text-5xl font-black  italic tracking-tight text-stone-900">
          Discover one signature piece from each world
        </h2>
        <p className="max-w-2xl mx-auto mt-5 text-sm md:text-base text-stone-500 leading-relaxed">
          Explore Men, Women and Kids with a featured item and go directly to the collection you want.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {featured.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group block overflow-hidden border border-stone-200 bg-white shadow-[0_20px_80px_rgba(0,0,0,0.05)] transition-transform duration-500 hover:-translate-y-1 hover:shadow-[0_30px_120px_rgba(0,0,0,0.12)]"
          >
            <div className="relative h-72 overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <span className="absolute left-6 top-6 inline-flex items-center rounded-full bg-black/70 px-4 py-2 text-[9px] uppercase tracking-[0.4em] text-white font-bold">
                {item.label}
              </span>
            </div>

            <div className="p-8">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="text-2xl font-black uppercase tracking-tight text-stone-900">{item.title}</h3>
                <span className="text-sm uppercase tracking-[0.35em] text-stone-500">{item.price}</span>
              </div>
              <p className="text-sm text-stone-500 leading-relaxed mb-8">{item.description}</p>
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] font-black text-stone-900 group-hover:text-[#D4AF37]">
                <span>Shop {item.label}</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
