'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

import { useCart } from '@/context/CartContext';

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, totalItems, subtotal } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay sombre pour fermer au clic */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[60]"
          />
          
          {/* Le Tiroir du Panier */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="fixed top-0 right-0 w-full md:w-[450px] bottom-0 bg-stone-50 z-[70] shadow-2xl flex flex-col border-l border-stone-200"
          >
            {/* Header du panier */}
            <div className="flex items-center justify-between p-6 border-b border-stone-200 bg-white">
              <h2 className="text-xl uppercase tracking-widest font-light text-stone-900 flex items-center gap-3">
                <ShoppingBag size={24} strokeWidth={1.5} className="text-[#D4AF37]" />
                Panier <span className="text-stone-400 text-sm">({totalItems})</span>
              </h2>
              <button onClick={onClose} className="text-stone-400 hover:text-[#D4AF37] transition-colors p-2">
                <X size={28} strokeWidth={1.5} />
              </button>
            </div>

            {/* Contenu : Liste des articles */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-stone-400 gap-4">
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p className="text-sm font-light uppercase tracking-widest">Votre panier est vide</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-6 group">
                    <div className="relative w-24 h-28 bg-white border border-stone-100 flex-shrink-0 overflow-hidden">
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                    </div>
                    <div className="flex flex-col justify-between flex-1 py-1">
                      <div>
                        <h3 className="text-sm uppercase tracking-wider text-stone-900 font-medium">{item.name}</h3>
                        <p className="text-[#D4AF37] text-sm mt-1">{item.price.toLocaleString('fr-FR')} €</p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        {/* Selecteur de quantité Luxe */}
                        <div className="flex items-center border border-stone-200 text-stone-900 bg-white">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 hover:text-[#D4AF37] transition-colors">-</button>
                          <span className="px-3 text-xs font-light">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 hover:text-[#D4AF37] transition-colors">+</button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-xs uppercase tracking-widest text-stone-400 hover:text-red-500 transition-colors underline underline-offset-4">
                          Retirer
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer : Résumé et actions */}
            <div className="p-6 border-t border-stone-200 bg-white">
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm uppercase tracking-widest text-stone-500">Sous-total</span>
                <span className="text-xl text-stone-900 font-medium">{subtotal.toLocaleString('fr-FR')} €</span>
              </div>
              <p className="text-xs text-stone-400 mb-6 text-center font-light">Taxes et frais de livraison calculés à l'étape suivante.</p>
              
              <Link 
                href="/cart" 
                onClick={onClose}
                className="w-full py-4 bg-stone-900 text-stone-50 text-xs uppercase tracking-[0.3em] font-light flex items-center justify-center gap-2 hover:bg-[#D4AF37] transition-colors duration-500"
              >
                Voir le panier complet
              </Link>
              
              <button 
                onClick={onClose}
                className="w-full py-4 mt-3 bg-transparent text-stone-900 text-xs uppercase tracking-[0.2em] font-light border border-stone-200 hover:border-stone-900 transition-colors"
              >
                Continuer mes achats
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
