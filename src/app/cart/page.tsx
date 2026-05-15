'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export const dynamic = "force-dynamic";
export default function CartPage() {
  const { items, removeFromCart, updateQuantity, subtotal } = useCart();
  const shipping = 0; // Livraison offerte
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-24 px-6 md:px-16 max-w-[1920px] mx-auto">
      {/* Fil d'Ariane */}
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-stone-400 font-light mb-12">
        <Link href="/" className="hover:text-[#D4AF37] transition-colors">Accueil</Link>
        <ChevronRight size={14} />
        <span className="text-stone-900">Panier</span>
      </div>

      <h1 className="text-4xl md:text-5xl font-extralight uppercase tracking-widest text-stone-900 mb-16">
        Votre Panier
      </h1>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Liste des articles */}
        <div className="flex-1">
          <div className="border-t border-stone-200">
            {items.length === 0 ? (
              <div className="py-24 flex flex-col items-center justify-center text-stone-400">
                <ShoppingBag size={64} strokeWidth={1} className="mb-6" />
                <h2 className="text-xl uppercase tracking-widest font-light text-stone-900 mb-2">Votre panier est vide</h2>
                <p className="text-sm font-light mb-8 text-center">Découvrez nos collections pour trouver l'inspiration.</p>
                <Link href="/collections" className="px-8 py-4 bg-stone-900 text-stone-50 text-xs uppercase tracking-[0.3em] font-light hover:bg-[#D4AF37] transition-colors duration-500">
                  Découvrir
                </Link>
              </div>
            ) : (
              items.map((item) => (
              <div key={item.id} className="py-8 border-b border-stone-200 flex flex-col sm:flex-row gap-8">
                {/* Image du produit */}
                <div className="relative w-full sm:w-48 h-64 bg-white overflow-hidden group">
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                </div>
                
                {/* Infos du produit */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl uppercase tracking-widest font-light text-stone-900">{item.name}</h2>
                      <p className="text-xs text-stone-400 mt-2">Réf: {item.reference}</p>
                    </div>
                    <p className="text-lg text-[#D4AF37]">{item.price.toLocaleString('fr-FR')} €</p>
                  </div>

                  <div className="flex justify-between items-end mt-8">
                    <div className="flex flex-col gap-3">
                      <span className="text-xs uppercase tracking-[0.2em] text-stone-400">Quantité</span>
                      <div className="flex items-center border border-stone-200 text-stone-900 bg-white w-fit">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-4 py-2 hover:text-[#D4AF37] transition-colors">-</button>
                        <span className="px-4 text-sm font-light">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-4 py-2 hover:text-[#D4AF37] transition-colors">+</button>
                      </div>
                    </div>
                    
                    <button onClick={() => removeFromCart(item.id)} className="text-xs uppercase tracking-widest text-stone-400 hover:text-red-500 transition-colors underline underline-offset-4">
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))
            )}
          </div>
        </div>

        {/* Résumé de commande */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-white border border-stone-200 p-8 sticky top-32">
            <h2 className="text-lg uppercase tracking-widest font-light text-stone-900 mb-8 border-b border-stone-200 pb-4">
              Résumé de la commande
            </h2>
            
            <div className="space-y-4 text-sm font-light text-stone-500 mb-8">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span className="text-stone-900">{subtotal.toLocaleString('fr-FR')} €</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison standard</span>
                <span className="text-stone-900">{shipping === 0 ? 'Offerte' : `${shipping} €`}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xl text-stone-900 border-t border-stone-200 pt-6 mb-8">
              <span className="uppercase tracking-widest font-light">Total</span>
              <span className="font-medium text-[#D4AF37]">{total.toLocaleString('fr-FR')} €</span>
            </div>

            <button className="w-full py-5 bg-stone-900 text-stone-50 text-xs uppercase tracking-[0.3em] font-light hover:bg-[#D4AF37] transition-colors duration-500">
              Procéder au paiement
            </button>

            <div className="mt-8 flex flex-col gap-4 text-xs text-stone-400 text-center font-light uppercase tracking-widest">
              <p>Paiement 100% sécurisé</p>
              <p>Retours gratuits sous 30 jours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
