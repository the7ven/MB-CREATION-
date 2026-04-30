"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import HeroSlider from "@/components/home/HeroSlider";
import BestSellers from "@/components/home/BestSellers";
import NewArrivals from "@/components/home/NewArrivals";
import SpecialOffers from "@/components/home/SpecialOffers";

export default function Home() {
  const [hasEntered, setHasEntered] = useState(false);
  const [imageReady, setImageReady] = useState(false);

  // Précharge l'image avant de lancer l'animation
  useEffect(() => {
    const img = new window.Image();
    img.src = "/enterpic.JPEG";
    img.onload = () => setImageReady(true);
    img.onerror = () => setImageReady(true); // fallback si erreur
  }, []);

  return (
    <main className="relative flex flex-col w-full bg-white min-h-screen overflow-x-hidden">
      {/* SPLASH SCREEN */}
      <AnimatePresence>
        {!hasEntered && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3.0, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[999] flex flex-col items-end justify-end overflow-hidden bg-black"
          >
            {/* IMAGE — entre depuis le bas dès que chargée */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: imageReady ? 0 : "100%" }}
              transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Image
                src="/enterpic.JPEG"
                alt="MB-CREATION Entry Universe"
                width={900}
                height={600}
                priority
                unoptimized
                className="mx-auto"
              />
              {/* Léger dégradé bas pour lisibilité du bouton */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 40%, transparent 70%)",
                }}
              />
            </motion.div>

            {/* BOUTON — key force le remount quand imageReady change */}
            <motion.div
              key={String(imageReady)}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: imageReady ? 1 : 0, y: imageReady ? 0 : 24 }}
              transition={{
                duration: 0.9,
                delay: imageReady ? 1.6 : 0,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative z-10 w-full flex flex-col items-center gap-8 pb-50 px-6"
            >
              <motion.button
                onClick={() => setHasEntered(true)}
                whileHover={{ letterSpacing: "0.55em" }}
                whileTap={{ scale: 0.97 }}
                className="px-14 py-5 border border-[#D4AF37] text-[#D4AF37] text-[10px] uppercase tracking-[0.45em] font-black bg-transparent hover:bg-[#D4AF37] hover:text-black transition-all duration-500"
              >
                Entrer
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONTENU SITE */}
      <AnimatePresence>
        {hasEntered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-col w-full"
          >
            <HeroSlider />
            <BestSellers />
            <NewArrivals />
            <SpecialOffers />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
