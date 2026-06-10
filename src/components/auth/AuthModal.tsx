"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState<{ text: string; type: "error" | "success" } | null>(null);
  const router = useRouter();

  const handleChange = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      if (isSignUp) {
        // Vérification mots de passe
        if (formState.password !== formState.confirmPassword) {
          setMessage({ text: "Les mots de passe ne correspondent pas.", type: "error" });
          return;
        }

        // Création du compte
        const { error: signUpError } = await supabase.auth.signUp({
          email: formState.email,
          password: formState.password,
        });
        if (signUpError) throw signUpError;

        // Insertion dans customers
        await supabase.from("customers").upsert([{
          email: formState.email,
          customer_name: formState.name || formState.email,
        }], { onConflict: "email" });

        // Connexion automatique après inscription
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formState.email,
          password: formState.password,
        });
        if (signInError) throw signInError;

        onClose();
        router.refresh();

      } else {
        // Connexion normale
        const { error } = await supabase.auth.signInWithPassword({
          email: formState.email,
          password: formState.password,
        });
        if (error) throw error;

        onClose();
        router.refresh();
      }
    } catch (err: any) {
      setMessage({ text: err.message || "Une erreur est survenue.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = (mode: "signin" | "signup") => {
    setIsSignUp(mode === "signup");
    setMessage(null);
    setFormState({ name: "", email: "", password: "", confirmPassword: "" });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md rounded-[28px] bg-white p-6 md:p-8 shadow-2xl border border-stone-200"
            initial={{ y: 40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-stone-500 mb-2">Espace client</p>
                <h2 className="text-2xl font-black text-stone-900">
                  {isSignUp ? "Créer un compte" : "Se connecter"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-stone-500 hover:bg-stone-100 transition-colors"
                aria-label="Fermer"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            {/* Toggle Connexion / Inscription */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => toggleMode("signin")}
                className={`flex-1 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  isSignUp
                    ? "border-stone-200 text-stone-600 bg-stone-50"
                    : "border-[#D4AF37] text-[#0e0d0b] bg-[#F9E4A1]"
                }`}
              >
                Connexion
              </button>
              <button
                onClick={() => toggleMode("signup")}
                className={`flex-1 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  isSignUp
                    ? "border-[#D4AF37] text-[#0e0d0b] bg-[#F9E4A1]"
                    : "border-stone-200 text-stone-600 bg-stone-50"
                }`}
              >
                Inscription
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nom (inscription uniquement) */}
              {isSignUp && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-stone-700">Nom complet</label>
                  <input
                    type="text"
                    value={formState.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Votre nom"
                    className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-base text-stone-900 outline-none focus:border-[#D4AF37]"
                  />
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-stone-700">Email</label>
                <input
                  type="email"
                  value={formState.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="adresse@email.com"
                  required
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-base text-stone-900 outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Mot de passe */}
              <div className="space-y-2 relative">
                <label className="block text-sm font-semibold text-stone-700">Mot de passe</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formState.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 pr-12 text-base text-stone-900 outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-10 p-2 text-stone-500 hover:text-[#D4AF37]"
                  aria-label={showPassword ? "Masquer" : "Afficher"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Confirmation mot de passe (inscription uniquement) */}
              {isSignUp && (
                <div className="space-y-2 relative">
                  <label className="block text-sm font-semibold text-stone-700">Confirmer le mot de passe</label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formState.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 pr-12 text-base text-stone-900 outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-10 p-2 text-stone-500 hover:text-[#D4AF37]"
                    aria-label={showConfirmPassword ? "Masquer" : "Afficher"}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              )}

              {/* Message feedback */}
              {message && (
                <p className={`text-sm text-center font-medium ${
                  message.type === "success" ? "text-green-600" : "text-red-500"
                }`}>
                  {message.text}
                </p>
              )}

              {/* Bouton submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-black uppercase tracking-[0.3em] text-black transition-colors hover:bg-[#b18f3f] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Chargement..."
                  : isSignUp
                  ? "Créer mon compte"
                  : "Se connecter"}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-stone-500">
              En continuant, vous acceptez les conditions générales de MB·Creation.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}