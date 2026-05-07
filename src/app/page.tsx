"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SplashPage() {
  const router = useRouter();
  const [imageReady, setImageReady] = useState(false);

  useEffect(() => {
    // Précharge l'image
    const img = new window.Image();
    img.src = "/enterpic.JPEG";
    img.onload = () => setImageReady(true);
    img.onerror = () => setImageReady(true);
  }, []);

  const handleManualEnter = () => {
    router.push("/home");
  };

  return (
    <main className="relative flex flex-col w-full bg-white min-h-screen overflow-x-hidden font-cormorant">
      <AnimatePresence>
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -100 }}
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
      </AnimatePresence>
    </main>
  );
}
