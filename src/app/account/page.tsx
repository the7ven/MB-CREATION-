'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function AccountPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-24 px-6 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 md:p-12 shadow-2xl">
        {/* En-tête : Bascule Connexion / Inscription */}
        <div className="flex justify-center gap-8 mb-12 border-b border-stone-200">
          <button 
            onClick={() => setIsLogin(true)}
            className={`pb-4 text-xs uppercase tracking-widest transition-colors relative ${isLogin ? 'text-stone-900 font-medium' : 'text-stone-400 hover:text-stone-900'}`}
          >
            Se Connecter
            {isLogin && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-px bg-stone-900" />}
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`pb-4 text-xs uppercase tracking-widest transition-colors relative ${!isLogin ? 'text-stone-900 font-medium' : 'text-stone-400 hover:text-stone-900'}`}
          >
            Créer un compte
            {!isLogin && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-px bg-stone-900" />}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.form 
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-8"
              onSubmit={(e) => e.preventDefault()}
            >
              {/* Email */}
              <div className="relative mt-2">
                <input 
                  type="email" 
                  id="email"
                  className="peer w-full bg-transparent border-b border-stone-300 py-2 text-stone-900 placeholder-transparent focus:outline-none focus:border-[#D4AF37] transition-colors"
                  placeholder="Email"
                  required
                />
                <label 
                  htmlFor="email"
                  className="absolute left-0 -top-3.5 text-xs text-stone-500 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-stone-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#D4AF37]"
                >
                  Adresse Email
                </label>
              </div>

              {/* Password */}
              <div className="relative mt-2">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password"
                  className="peer w-full bg-transparent border-b border-stone-300 py-2 pr-10 text-stone-900 placeholder-transparent focus:outline-none focus:border-[#D4AF37] transition-colors"
                  placeholder="Mot de passe"
                  required
                />
                <label 
                  htmlFor="password"
                  className="absolute left-0 -top-3.5 text-xs text-stone-500 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-stone-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#D4AF37]"
                >
                  Mot de passe
                </label>
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-2 text-stone-400 hover:text-stone-900 transition-colors"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="flex justify-end mt-2">
                <Link href="#" className="text-[10px] uppercase tracking-widest text-stone-500 underline underline-offset-4 hover:text-[#D4AF37] transition-colors">
                  Mot de passe oublié ?
                </Link>
              </div>

              <button type="submit" className="w-full mt-4 py-4 bg-stone-900 text-stone-50 text-xs uppercase tracking-[0.3em] font-light hover:bg-[#D4AF37] transition-colors duration-500 shadow-xl">
                Connexion
              </button>
            </motion.form>
          ) : (
            <motion.form 
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-8"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex gap-6 mt-2">
                {/* Prénom */}
                <div className="relative w-1/2">
                  <input 
                    type="text" 
                    id="firstName"
                    className="peer w-full bg-transparent border-b border-stone-300 py-2 text-stone-900 placeholder-transparent focus:outline-none focus:border-[#D4AF37] transition-colors"
                    placeholder="Prénom"
                    required
                  />
                  <label 
                    htmlFor="firstName"
                    className="absolute left-0 -top-3.5 text-xs text-stone-500 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-stone-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#D4AF37]"
                  >
                    Prénom
                  </label>
                </div>
                {/* Nom */}
                <div className="relative w-1/2">
                  <input 
                    type="text" 
                    id="lastName"
                    className="peer w-full bg-transparent border-b border-stone-300 py-2 text-stone-900 placeholder-transparent focus:outline-none focus:border-[#D4AF37] transition-colors"
                    placeholder="Nom"
                    required
                  />
                  <label 
                    htmlFor="lastName"
                    className="absolute left-0 -top-3.5 text-xs text-stone-500 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-stone-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#D4AF37]"
                  >
                    Nom
                  </label>
                </div>
              </div>

              {/* Email */}
              <div className="relative mt-2">
                <input 
                  type="email" 
                  id="reg-email"
                  className="peer w-full bg-transparent border-b border-stone-300 py-2 text-stone-900 placeholder-transparent focus:outline-none focus:border-[#D4AF37] transition-colors"
                  placeholder="Email"
                  required
                />
                <label 
                  htmlFor="reg-email"
                  className="absolute left-0 -top-3.5 text-xs text-stone-500 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-stone-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#D4AF37]"
                >
                  Adresse Email
                </label>
              </div>

              {/* Password */}
              <div className="relative mt-2">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="reg-password"
                  className="peer w-full bg-transparent border-b border-stone-300 py-2 pr-10 text-stone-900 placeholder-transparent focus:outline-none focus:border-[#D4AF37] transition-colors"
                  placeholder="Mot de passe"
                  required
                />
                <label 
                  htmlFor="reg-password"
                  className="absolute left-0 -top-3.5 text-xs text-stone-500 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-stone-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#D4AF37]"
                >
                  Mot de passe
                </label>
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-2 text-stone-400 hover:text-stone-900 transition-colors"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <p className="text-[10px] text-stone-400 font-light mt-2">
                En créant un compte, vous acceptez nos <Link href="#" className="underline hover:text-[#D4AF37]">Conditions Générales</Link> et notre <Link href="#" className="underline hover:text-[#D4AF37]">Politique de Confidentialité</Link>.
              </p>

              <button type="submit" className="w-full mt-4 py-4 bg-stone-900 text-stone-50 text-xs uppercase tracking-[0.3em] font-light hover:bg-[#D4AF37] transition-colors duration-500 shadow-xl">
                Créer mon compte
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
