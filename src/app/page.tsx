"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import HeroSlider from "@/components/home/HeroSlider";
import BestSellers from "@/components/home/BestSellers";
import NewArrivals from "@/components/home/NewArrivals";
import SpecialOffers from "@/components/home/SpecialOffers";

export default function Home() {
  // Par défaut, on ne sait pas encore si on doit afficher le splash
  const [hasEntered, setHasEntered] = useState(true); // On met true par défaut pour éviter un flash noir
  const [showSplash, setShowSplash] = useState(false);
  const [imageReady, setImageReady] = useState(false);

  useEffect(() => {
    // 1. Vérifier si l'utilisateur est déjà entré durant cette session
    const alreadyEntered = sessionStorage.getItem("mb_creation_entered");

    if (!alreadyEntered) {
      setHasEntered(false); // Si jamais entré, on cache le contenu
      setShowSplash(true); // Et on prépare le splash

      // Précharge l'image uniquement si on doit l'afficher
      const img = new window.Image();
      img.src = "/enterpic.JPEG";
      img.onload = () => setImageReady(true);
      img.onerror = () => setImageReady(true);
    } else {
      setHasEntered(true); // Déjà entré, on affiche direct le site
      setShowSplash(false);
    }
  }, []);

  const handleManualEnter = () => {
    sessionStorage.setItem("mb_creation_entered", "true"); // On enregistre l'entrée
    setHasEntered(true);
    setShowSplash(false);
  };

  return (
    <main className="relative flex flex-col w-full bg-white min-h-screen overflow-x-hidden font-cormorant">
      {/* SPLASH SCREEN - Ne s'affiche QUE si showSplash est true */}
      <AnimatePresence>
        {showSplash && !hasEntered && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -100 }} // Le rideau remonte au lieu de juste disparaître
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden bg-black"
          >
            <motion.div
              initial={{ y: "20%", opacity: 0 }}
              animate={{
                y: imageReady ? 0 : "20%",
                opacity: imageReady ? 1 : 0,
              }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Image
                src="/enterpic.JPEG"
                alt="MB-CREATION Entry Universe"
                width={900}
                height={600}
                priority
                className="mx-auto"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)",
                }}
              />
            </motion.div>

            <motion.div
              key={String(imageReady)}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: imageReady ? 1 : 0, y: imageReady ? 0 : 24 }}
              transition={{
                duration: 0.9,
                delay: imageReady ? 1.6 : 0,
                ease: [0.22, 1, 0.36, 1],
              }}
              /* On le place en bas avec 'absolute' et on définit l'espace avec 'pb' */
              className="absolute bottom-10 left-0 right-0 z-20 flex flex-col items-center pb-16 md:pb-24 px-6"
            >
              <button
                onClick={handleManualEnter}
                className="px-14 py-5 border border-[#D4AF37] text-[#D4AF37] text-[10px] uppercase tracking-[0.45em] font-black bg-black/20 backdrop-blur-sm hover:bg-[#D4AF37] hover:text-black transition-all duration-500"
              >
                Entrer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONTENU SITE */}
      {/* On n'utilise AnimatePresence ici que pour l'apparition initiale */}
      <div
        className={`flex flex-col w-full ${!hasEntered ? "hidden" : "block"}`}
      >
        <div id="hero">
          <HeroSlider />
        </div>
        <div id="bestsellers">
          <BestSellers />
        </div>
        <div id="newarrivals">
          <NewArrivals />
        </div>
        <div id="specialoffers">
          <SpecialOffers />
        </div>
      </div>
    </main>
  );
}
