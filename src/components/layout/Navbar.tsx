'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, ShoppingBag, ChevronDown } from 'lucide-react';
import { Logo, SearchIconGold, MenuIcon } from '@/components/ui/LogosAndIcons';
import CartDrawer from '@/components/cart/CartDrawer';

const menuLinks = [
  {
    label: 'Shop',
    href: '/shop',
    children: [
      { label: "Men's", href: '/shop/mens' },
      { label: "Women's", href: '/shop/womens' },
      { label: 'Kids', href: '/shop/kids' },
      { label: 'Trending', href: '/shop/trending' },
    ],
  },
  {
    label: 'Pages',
    href: '/pages',
    children: [
      { label: 'About Us', href: '/pages/about' },
      { label: 'Return Policy', href: '/pages/returns' },
      { label: 'Size Guide', href: '/pages/size-guide' },
      { label: 'FAQ & Terms', href: '/pages/faq' },
    ],
  },
  {
    label: 'Contact',
    href: '/contact',
    children: [],
  },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (label: string) => {
    setOpenSection(prev => (prev === label ? null : label));
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-stone-50/90 backdrop-blur-sm text-stone-900 border-b border-stone-200 font-sans antialiased">
        <nav className="relative max-w-[1920px] mx-auto px-6 h-20 flex items-center justify-between">

          {/* --- SECTION GAUCHE (Desktop) --- */}
          <div className="hidden md:flex items-center space-x-6 text-xs uppercase tracking-[0.3em] font-light">
            <Link href="/contact" className="hover:text-[#D4AF37] transition-colors">
              Contact us
            </Link>
            <div className="h-6 w-px bg-stone-300"></div>
            <Link href="/collections" className="hover:text-[#D4AF37] transition-colors">
              Collections
            </Link>
          </div>

          {/* --- LOGO --- */}
          <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
            <Logo />
          </div>

          {/* --- SECTION DROITE --- */}
          <div className="flex items-center space-x-6">
            {/* Search */}
            <div className="flex items-center h-8">
              <AnimatePresence mode="wait">
                {!isSearchOpen ? (
                  <motion.div
                    key="icon"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SearchIconGold onClick={() => setIsSearchOpen(true)} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="input"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute left-6 right-6 top-1/2 -translate-y-1/2 z-50 md:static md:translate-y-0 md:w-[260px] flex items-center border border-stone-200 rounded-full px-4 py-2 bg-white shadow-lg md:shadow-sm overflow-hidden"
                  >
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      className="w-full bg-transparent border-none outline-none text-stone-900 text-base font-light placeholder:text-stone-400"
                      autoFocus
                    />
                    <button onClick={() => setIsSearchOpen(false)} className="text-stone-400 hover:text-[#D4AF37] transition-colors ml-1 shrink-0">
                      <X size={18} strokeWidth={1.5} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Account (Desktop) */}
            <Link href="/account" className="hidden md:block text-stone-900 hover:text-[#D4AF37] hover:scale-110 transition-all">
              <User size={22} strokeWidth={1.5} />
            </Link>

            {/* Cart (Desktop) */}
            <button onClick={() => setIsCartOpen(true)} className="hidden md:block text-stone-900 hover:text-[#D4AF37] hover:scale-110 transition-all">
              <ShoppingBag size={22} strokeWidth={1.5} />
            </button>

            {/* Menu Toggle */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <span className="hidden md:block text-xs uppercase tracking-[0.3em] font-light group-hover:text-[#D4AF37] transition-colors pt-0.5">
                Menu
              </span>
              <div className="pointer-events-none group-hover:text-[#D4AF37] transition-colors">
                <MenuIcon onClick={() => {}} className="group-hover:text-[#D4AF37]" />
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* --- MENU OVERLAY --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 top-20 bg-stone-900/20 backdrop-blur-sm z-30"
          />
        )}

        {isMenuOpen && (
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="fixed top-20 right-0 w-full md:w-[450px] bottom-0 bg-white z-40 shadow-2xl flex flex-col border-l border-stone-200 overflow-y-auto"
          >
            {/* Close button */}
            <div className="flex justify-end p-6">
              <button onClick={() => setIsMenuOpen(false)} className="text-stone-400 hover:text-[#D4AF37] transition-colors p-2">
                <X size={32} strokeWidth={1.5} />
              </button>
            </div>

            {/* Nav Links */}
            <div className="flex flex-col flex-1 px-10 pb-12 space-y-2 w-full">
              {menuLinks.map((section) => (
                <div key={section.label} className="border-b border-stone-100">
                  {section.children.length > 0 ? (
                    <>
                      {/* Expandable section */}
                      <button
                        onClick={() => toggleSection(section.label)}
                        className="w-full flex items-center justify-between py-5 text-2xl uppercase tracking-widest font-extralight text-stone-900 hover:text-[#D4AF37] transition-colors"
                      >
                        <span>{section.label}</span>
                        <motion.span
                          animate={{ rotate: openSection === section.label ? 180 : 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <ChevronDown size={20} strokeWidth={1.5} />
                        </motion.span>
                      </button>

                      <AnimatePresence initial={false}>
                        {openSection === section.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-col space-y-4 pb-6 pl-4">
                              {section.children.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={() => setIsMenuOpen(false)}
                                  className="text-base uppercase tracking-[0.25em] font-light text-stone-500 hover:text-[#D4AF37] transition-colors"
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    /* Simple link (Contact) */
                    <Link
                      href={section.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-5 text-2xl uppercase tracking-widest font-extralight text-stone-900 hover:text-[#D4AF37] transition-colors"
                    >
                      {section.label}
                    </Link>
                  )}
                </div>
              ))}

              {/* Mobile: Account + Cart */}
              <div className="md:hidden flex flex-col items-center space-y-8 pt-10 border-t border-stone-200 w-full">
                <Link href="/account" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 text-xl uppercase tracking-widest font-extralight text-stone-900 hover:text-[#D4AF37] transition-colors">
                  <User size={24} strokeWidth={1.5} /> Compte
                </Link>
                <button onClick={() => { setIsMenuOpen(false); setIsCartOpen(true); }} className="flex items-center gap-4 text-xl uppercase tracking-widest font-extralight text-stone-900 hover:text-[#D4AF37] transition-colors">
                  <ShoppingBag size={24} strokeWidth={1.5} /> Panier
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}