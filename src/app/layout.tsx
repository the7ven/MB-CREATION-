import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google"; // Uniquement Cormorant
import Navbar from "@/components/layout/Navbar"; 
import Footer from "@/components/layout/Footer"; 
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

// Configuration de Cormorant Garamond comme police principale

export const dynamic = 'force-dynamic';
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "MB-Creation",
  description: "L'élégance à l'état pur. Fabriqué pour l'élite.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${cormorant.variable} h-full antialiased`}>
      {/* On applique font-cormorant ici pour qu'il soit partout par défaut */}
      <body className="min-h-full flex flex-col font-cormorant bg-stone-50 text-stone-900">
        <CartProvider>
          <Navbar />
          <main className="flex-1 pt-20">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}