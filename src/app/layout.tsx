import type { Metadata } from "next";
import { Lexend } from "next/font/google"; // Importation de Lexend
import Navbar from "@/components/layout/Navbar"; // Ton nouveau composant
import Footer from "@/components/layout/Footer"; // Ton nouveau composant
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

// Configuration de la police Lexend
const lexend = Lexend({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"], // Les graisses nécessaires
  variable: "--font-lexend", // La variable CSS pour Tailwind
});

export const metadata: Metadata = {
  title: "MB-Creation",
  description: "L'élégance à l'état pur. Fabriqué pour l elite.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${lexend.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-stone-50 text-stone-900">
        <CartProvider>
          <Navbar />
          {/* On ajoute une marge en haut pour compenser la navbar fixe */}
          <main className="flex-1 pt-20">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}