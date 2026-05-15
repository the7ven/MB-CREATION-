'use client';
import Link from 'next/link';


export default function Footer() {
  return (
    <footer className="bg-[#0e0d0b] text-[#f5f0e8] font-cormorant pt-20 pb-10 border-t border-[#D4AF37]/20">
      <div className="max-w-[1920px] mx-auto px-6 md:px-16">
        
        {/* --- SECTION HAUTE : GRILLE --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Colonne 1 : La Maison */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-extrabold uppercase italic tracking-tighter text-white">
                MB<span className="text-[#D4AF37]">-</span>CREATION
              </h2>
              <p className="text-[#D4AF37]/60 text-[13px] tracking-[0.5em] uppercase mt-2">
                Haute Couture & Prestige
              </p>
            </div>
            <p className="text-white text-lg leading-relaxed font-light max-w-xs">
              L'excellence du savoir-faire artisanal au service de l'élégance contemporaine. Chaque pièce est une œuvre unique conçue pour l'élite.
            </p>
            {/* Icônes réseaux sociaux */}
            <div className="flex items-center gap-5 pt-2">
              <Link
                href="https://www.facebook.com/share/1BB1YvUfh1/?mibextid=LQQJ4d"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-[#D4AF37] transition-colors duration-300"
                aria-label="Facebook"
              >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </Link>
              <Link
                href="https://www.instagram.com/mbcreationofficiel/profilecard/?igsh=c29zeXR1ZjdobXFo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-[#D4AF37] transition-colors duration-300"
                aria-label="Instagram"
              >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Colonne 2 : Collections */}
         <div>
  <h3 className="text-[#D4AF37] text-xs uppercase tracking-[0.4em] font-bold mb-8">Collections</h3>
  <ul className="space-y-4">
    {[
      { label: "MEN'S",  href: "/shop/men"   },
      { label: "WOMEN'S",  href: "/shop/women" },
      { label: "KIDS", href: "/shop/kids"  },
    ].map((item) => (
      <li key={item.href}>
        <Link href={item.href} className="text-white/70 hover:text-[#D4AF37] text-lg transition-colors duration-300 font-light">
          {item.label}
        </Link>
      </li>
    ))}
  </ul>
</div>

          {/* Colonne 3 : Services */}
          <div>
            <h3 className="text-[#D4AF37] text-xs uppercase tracking-[0.4em] font-bold mb-8">La Maison</h3>
            <ul className="space-y-4">
              {[
                { label: "Notre histoire", href:"/pages/about" },
                { label: "Contact", href: "/contact" },
                
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-white/70 hover:text-[#D4AF37] text-lg transition-colors duration-300 font-light">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 4 : Newsletter */}
          <div className="space-y-6">
            <h3 className="text-[#D4AF37] text-xs uppercase tracking-[0.4em] font-bold mb-2">Lettres Précieuses</h3>
            <p className="text-white/40 text-lg font-light italic">
              Recevez en avant-première nos nouvelles collections et offres exclusives.
            </p>
            <div className="flex flex-col space-y-4">
              <input 
                type="email" 
                placeholder="Votre adresse e-mail" 
                className="bg-transparent border-b border-white/10 py-3 text-lg focus:border-[#D4AF37] outline-none transition-colors text-white placeholder:text-white/50"
              />
              <button className="bg-[#D4AF37] text-black text-[10px] uppercase tracking-[0.3em] font-black py-4 hover:bg-white transition-colors duration-500">
                S'inscrire
              </button>
            </div>
          </div>
        </div>

        {/* --- SECTION ORNEMENTALE --- */}
        <div className="relative py-10 flex items-center justify-center">
          <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>
          <span className="relative bg-[#0e0d0b] px-8 text-[#D4AF37] text-[10px] tracking-[0.8em] uppercase font-light">
            MB · Creation
          </span>
        </div>

        {/* --- SECTION BASSE : COPYRIGHT & LEGAL --- */}
        <div className="flex flex-col md:row justify-between items-center pt-10 border-t border-white/5 text-[10px] text-white/30 tracking-widest uppercase gap-4">
          <p>© 2026 <span className="text-white/60 font-bold">MB·Creation</span>. Tous droits réservés.</p>
          <div className="flex gap-8">
            <Link href="/admin" className="hover:text-[#D4AF37]">Admin</Link>
            <Link href="#" className="hover:text-[#D4AF37]">Mentions Légales</Link>
            <Link href="#" className="hover:text-[#D4AF37]">Politique de Confidentialité</Link>
            <Link href="#" className="hover:text-[#D4AF37]">CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}