import { Search, Menu } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Le Logo MB-Creation 
export const Logo = () => (
 <Link href="/">
  <Image
    src="/logo.JPEG"      
    alt="MB-Creation"
    width={50}          
    height={50}
    className="object-contain rounded-full"
    priority
  />
</Link>
);

// Composant pour l'icône de recherche (Style Or)
export const SearchIconGold = ({ onClick, className = "" }: { onClick?: () => void, className?: string }) => (
  <button onClick={onClick} className={`text-[#D4AF37] hover:scale-110 transition-transform ${className}`}>
    <Search size={22} strokeWidth={1.5} />
  </button>
);

// Composant pour l'icône de Menu Hamburger
export const MenuIcon = ({ onClick, className = "" }: { onClick: () => void, className?: string }) => (
  <button onClick={onClick} className={`text-stone-900 transition-colors hover:text-[#D4AF37] ${className}`}>
    <Menu size={28} strokeWidth={2} />
  </button>
);