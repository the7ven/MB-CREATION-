'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState,useEffect } from 'react';
import { ChevronRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';

export const dynamic = "force-dynamic";
export default function CartPage() {
      
  const [isMounted, setIsMounted] = useState(false);
  const { items, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [street, setStreet] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);
  const shipping = 0; // Livraison offerte
  const total = subtotal + shipping;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCheckout = async () => {
    if (items.length === 0) {
      setCheckoutMessage('Votre panier est vide.');
      return;
    }

    if (!name.trim() || !email.trim()) {
      setCheckoutMessage('Veuillez renseigner votre nom et votre email.');
      return;
    }

    if (!country.trim() || !city.trim() || !district.trim() || !street.trim()) {
      setCheckoutMessage('Veuillez renseigner votre adresse complète (pays, ville, quartier et rue) pour la livraison.');
      return;
    }

    setCheckoutLoading(true);
    setCheckoutMessage(null);

    try {
      const orderItems = items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        reference: item.reference,
      }));

      const { error: orderError } = await supabase.from('orders').insert([{
        customer_name: name,
        customer_email: email,
        phone: phone,
        country: country,
        city: city,
        quartier: district,
        street: street,
        items: orderItems,
        total_amount: total,
        status: 'pending',
      }]);

      if (orderError) {
        throw orderError;
      }

      await Promise.all(items.map(async item => {
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.id)
          .single();

        if (productError || !product) {
          throw productError ?? new Error('Produit introuvable');
        }

        const newStock = Math.max((product.stock ?? 0) - item.quantity, 0);
        const { error: updateError } = await supabase
          .from('products')
          .update({ stock: newStock, is_available: newStock > 0 })
          .eq('id', item.id);

        if (updateError) {
          throw updateError;
        }
      }));

      // Upsert customer so admin customer count updates
      try {
        await supabase.from('customers').upsert([
          { email, customer_name: name, phone }
        ], { onConflict: 'email' });
      } catch (e) {
        // ignore if schema differs
      }

      // Note : le revenu (table "revenue") n'est plus incrémenté ici.
      // La commande est créée en "pending" ; le revenu sera comptabilisé
      // côté admin uniquement quand le statut passera à "completed".

      clearCart();
      setName('');
      setEmail('');
      setPhone('');
      setCountry('');
      setCity('');
      setDistrict('');
      setStreet('');
      setCheckoutMessage('Commande créée avec succès !');
    } catch (error: any) {
      setCheckoutMessage(error?.message ?? 'Échec de la validation.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (!isMounted) {
    return <div className="min-h-screen bg-stone-50" />; 
  }

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
              
            </div>

            <div className="flex justify-between items-center text-xl text-stone-900 border-t border-stone-200 pt-6 mb-8">
              <span className="uppercase tracking-widest font-light">Total</span>
              <span className="font-medium text-[#D4AF37]">{total.toLocaleString('fr-FR')} €</span>
            </div>

            <div className="space-y-4 mb-6">
              <label className="block text-xs uppercase tracking-[0.2em] text-stone-400">Nom</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900"
                placeholder="Votre nom complet"
              />
              <label className="block text-xs uppercase tracking-[0.2em] text-stone-400">Email</label>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900"
                type="email"
                placeholder="exemple@email.com"
              />
              <label className="block text-xs uppercase tracking-[0.2em] text-stone-400">Téléphone (optionnel)</label>
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900"
                placeholder="+33 6 12 34 56 78"
              />

              <p className="text-xs uppercase tracking-[0.2em] text-stone-400 pt-4 border-t border-stone-100">Adresse de livraison</p>

              <label className="block text-xs uppercase tracking-[0.2em] text-stone-400">Pays</label>
              <input
                value={country}
                onChange={e => setCountry(e.target.value)}
                className="w-full border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900"
                placeholder="Côte d'Ivoire"
              />
              <label className="block text-xs uppercase tracking-[0.2em] text-stone-400">Ville</label>
              <input
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900"
                placeholder="Abidjan"
              />
              <label className="block text-xs uppercase tracking-[0.2em] text-stone-400">Quartier</label>
              <input
                value={district}
                onChange={e => setDistrict(e.target.value)}
                className="w-full border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900"
                placeholder="Cocody"
              />
              <label className="block text-xs uppercase tracking-[0.2em] text-stone-400">Rue / Adresse</label>
              <input
                value={street}
                onChange={e => setStreet(e.target.value)}
                className="w-full border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900"
                placeholder="Rue des Jardins, Lot 12"
              />
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="w-full py-5 bg-stone-900 text-stone-50 text-xs uppercase tracking-[0.3em] font-light hover:bg-[#D4AF37] transition-colors duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checkoutLoading ? 'Validation en cours...' : 'Procéder au paiement'}
            </button>

            {checkoutMessage ? (
              <p className="mt-6 text-sm text-center text-stone-700">{checkoutMessage}</p>
            ) : null}

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