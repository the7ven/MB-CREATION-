'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

// ==========================================
// FADE IN
// ==========================================
function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ==========================================
// FORM FIELD
// ==========================================
function Field({
  label,
  type = 'text',
  name,
  value,
  onChange,
  required = false,
  textarea = false,
}: {
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  textarea?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const filled = value.length > 0;

  return (
    <div className="relative group">
      {/* Label flottant */}
      <motion.label
        animate={{
          y: focused || filled ? -22 : 0,
          scale: focused || filled ? 0.82 : 1,
          color: focused ? '#D4AF37' : '#a8a29e',
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="absolute left-0 top-4 font-cormorant text-base font-light origin-left pointer-events-none"
        style={{ transformOrigin: 'left center' }}
      >
        {label} {required && <span className="text-[#D4AF37]">*</span>}
      </motion.label>

      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={5}
          className="w-full bg-transparent border-b border-stone-200 pt-6 pb-3 font-cormorant text-base text-stone-900 font-light outline-none resize-none transition-colors duration-300 focus:border-[#D4AF37]"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent border-b border-stone-200 pt-6 pb-3 font-cormorant text-base text-stone-900 font-light outline-none transition-colors duration-300 focus:border-[#D4AF37]"
        />
      )}

      {/* Ligne animée */}
      <motion.div
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 left-0 right-0 h-px bg-[#D4AF37] origin-left"
      />
    </div>
  );
}

// ==========================================
// PAGE CONTACT
// ==========================================
const contactInfos = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    label: 'Atelier',
    value: 'Douala, Cameroun',
    sub: 'Sur rendez-vous uniquement',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    label: 'Téléphone',
    value: '+237 6XX XXX XXX',
    sub: 'Lun – Sam, 9h – 18h',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    label: 'Email',
    value: 'contact@mb-creation.com',
    sub: 'Réponse sous 24h',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
    label: 'Instagram',
    value: '@mbcreationofficiel',
    sub: 'Suivez nos coulisses',
    href: 'https://www.instagram.com/mbcreationofficiel/profilecard/?igsh=c29zeXR1ZjdobXFo',
  },
];

const subjects = [
  'Commande & Suivi',
  'Sur-mesure & Personnalisation',
  'Presse & Partenariats',
  'Retour & Échange',
  'Autre demande',
];

export default function ContactPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1800));
    setSending(false);
    setSubmitted(true);
  };

  return (
    <main className="bg-white min-h-screen antialiased pt-20">

      {/* ══ HERO ══════════════════════════════════════ */}
      <section className="relative bg-stone-900 py-28 px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '128px',
            mixBlendMode: 'overlay',
          }}
        />
        {/* Cercles décoratifs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-[#D4AF37]/8 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] border border-[#D4AF37]/6 rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-4"
          >
            <div className="h-px w-12 bg-[#D4AF37]/50" />
            <span className="font-cormorant text-[#D4AF37] text-xs uppercase tracking-[0.6em] font-light">
              MB-Création
            </span>
            <div className="h-px w-12 bg-[#D4AF37]/50" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-cormorant text-white text-5xl md:text-7xl font-light italic leading-none tracking-tight"
          >
            Nous <span className="text-[#D4AF37]">Contacter</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-cormorant text-white/40 text-base md:text-lg font-light tracking-widest max-w-md"
          >
            Une question, une demande sur-mesure ou une collaboration — nous vous répondons avec soin.
          </motion.p>
        </div>
      </section>

      {/* ══ CORPS PRINCIPAL ═══════════════════════════ */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-14 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-20 lg:gap-32 items-start">

          {/* ── FORMULAIRE ── */}
          <FadeIn>
            <div className="flex items-center gap-4 mb-3">
              <div className="h-px w-10 bg-[#D4AF37]" />
              <span className="font-cormorant text-[#D4AF37] text-xs uppercase tracking-[0.55em] font-light">
                Formulaire
              </span>
            </div>
            <h2 className="font-cormorant text-3xl md:text-5xl font-light italic text-stone-900 mb-12 leading-tight">
              Envoyez-nous<br />
              <span className="text-[#D4AF37]">un message</span>
            </h2>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5 }}
                  onSubmit={handleSubmit}
                  className="space-y-10"
                >
                  {/* Nom / Prénom */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    <Field label="Prénom" name="firstName" value={form.firstName} onChange={handleChange} required />
                    <Field label="Nom" name="lastName" value={form.lastName} onChange={handleChange} required />
                  </div>

                  {/* Email / Téléphone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    <Field label="Adresse e-mail" type="email" name="email" value={form.email} onChange={handleChange} required />
                    <Field label="Téléphone (optionnel)" type="tel" name="phone" value={form.phone} onChange={handleChange} />
                  </div>

                  {/* Sujet */}
                  <div className="space-y-4">
                    <span className="font-cormorant text-xs uppercase tracking-[0.45em] text-stone-400 font-light block">
                      Sujet <span className="text-[#D4AF37]">*</span>
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {subjects.map((s) => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => setForm((f) => ({ ...f, subject: s }))}
                          className={`font-cormorant text-sm font-light px-5 py-2.5 border transition-all duration-300 ${
                            form.subject === s
                              ? 'bg-stone-900 text-white border-stone-900'
                              : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400 hover:text-stone-700'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <Field
                    label="Votre message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    textarea
                  />

                  {/* Submit */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={sending}
                      className="font-cormorant relative w-full sm:w-auto flex items-center justify-center gap-4 px-16 py-5 bg-stone-900 text-white text-sm uppercase tracking-[0.4em] font-light hover:bg-[#D4AF37] hover:text-stone-900 transition-all duration-500 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden group"
                    >
                      {/* Barre de progression pendant l'envoi */}
                      {sending && (
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 1.8, ease: 'easeInOut' }}
                          className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37] origin-left"
                        />
                      )}
                      <span>{sending ? 'Envoi en cours…' : 'Envoyer le message'}</span>
                      {!sending && (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="group-hover:translate-x-1 transition-transform duration-300"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      )}
                    </button>
                    <p className="font-cormorant text-stone-400 text-sm font-light mt-4">
                      * Champs obligatoires. Vos données ne seront jamais partagées.
                    </p>
                  </div>
                </motion.form>
              ) : (
                /* ── Message de confirmation ── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-start gap-8 py-12"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 border border-[#D4AF37] flex items-center justify-center">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-[#D4AF37]/40 to-transparent" />
                  </div>
                  <h3 className="font-cormorant text-3xl md:text-4xl font-light italic text-stone-900 leading-tight">
                    Message envoyé.<br />
                    <span className="text-[#D4AF37]">Merci, {form.firstName}.</span>
                  </h3>
                  <p className="font-cormorant text-stone-500 text-lg font-light leading-relaxed max-w-md">
                    Nous avons bien reçu votre message et nous vous répondrons dans les meilleurs délais, généralement sous 24 heures.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' }); }}
                    className="font-cormorant text-sm uppercase tracking-[0.4em] font-light text-stone-400 border-b border-stone-200 pb-1 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors duration-300"
                  >
                    Envoyer un autre message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </FadeIn>

          {/* ── INFOS DE CONTACT ── */}
          <div className="space-y-0 lg:pt-24">
            <FadeIn delay={0.2}>
              <div className="flex items-center gap-4 mb-3">
                <div className="h-px w-10 bg-[#D4AF37]" />
                <span className="font-cormorant text-[#D4AF37] text-xs uppercase tracking-[0.55em] font-light">
                  Coordonnées
                </span>
              </div>
              <h2 className="font-cormorant text-2xl md:text-3xl font-light italic text-stone-900 mb-12 leading-tight">
                Nos informations
              </h2>
            </FadeIn>

            <div className="space-y-0 border-t border-stone-100">
              {contactInfos.map((info, i) => (
                <FadeIn key={info.label} delay={0.25 + i * 0.08}>
                  <div className="group border-b border-stone-100 py-7 flex items-start gap-5">
                    <span className="text-[#D4AF37]/60 group-hover:text-[#D4AF37] transition-colors duration-300 mt-0.5 flex-shrink-0">
                      {info.icon}
                    </span>
                    <div>
                      <span className="font-cormorant text-[10px] uppercase tracking-[0.45em] text-stone-400 font-light block mb-1">
                        {info.label}
                      </span>
                      {info.href ? (
                        <a
                          href={info.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-cormorant text-stone-900 text-lg font-light hover:text-[#D4AF37] transition-colors duration-300 block"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <span className="font-cormorant text-stone-900 text-lg font-light block">
                          {info.value}
                        </span>
                      )}
                      <span className="font-cormorant text-stone-400 text-sm font-light italic">
                        {info.sub}
                      </span>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>

            {/* Réseaux sociaux */}
            <FadeIn delay={0.6}>
              <div className="pt-10">
                <span className="font-cormorant text-[10px] uppercase tracking-[0.45em] text-stone-400 font-light block mb-5">
                  Suivez-nous
                </span>
                <div className="flex items-center gap-5">
                  <a
                    href="https://www.facebook.com/share/1BB1YvUfh1/?mibextid=LQQJ4d"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-stone-400 hover:text-[#D4AF37] transition-colors duration-300 group"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                    <span className="font-cormorant text-sm uppercase tracking-[0.35em] font-light group-hover:text-[#D4AF37] transition-colors">
                      Facebook
                    </span>
                  </a>
                  <div className="w-px h-4 bg-stone-200" />
                  <a
                    href="https://www.instagram.com/mbcreationofficiel/profilecard/?igsh=c29zeXR1ZjdobXFo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-stone-400 hover:text-[#D4AF37] transition-colors duration-300 group"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                    <span className="font-cormorant text-sm uppercase tracking-[0.35em] font-light group-hover:text-[#D4AF37] transition-colors">
                      Instagram
                    </span>
                  </a>
                </div>
              </div>
            </FadeIn>

            {/* Note atelier */}
            <FadeIn delay={0.7}>
              <div className="mt-12 border-l-2 border-[#D4AF37] pl-5 py-4">
                <span className="text-[#D4AF37] text-lg block mb-2">✦</span>
                <p className="font-cormorant text-stone-500 text-base font-light italic leading-relaxed">
                  Pour toute demande de sur-mesure, nous vous invitons à prendre rendez-vous directement à l'atelier afin de bénéficier d'une consultation personnalisée.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══ BANDE ORNEMENTALE ═════════════════════════ */}
      <div className="border-t border-stone-100 py-16 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <FadeIn>
            <p className="font-cormorant text-stone-400 text-base font-light italic text-center md:text-left">
              "Chaque vêtement MB-Creation raconte une histoire. La vôtre commence ici."
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="h-px w-10 bg-[#D4AF37]/40" />
              <span className="font-cormorant text-[#D4AF37] text-xs uppercase tracking-[0.55em] font-light">
                Manuella Bufang
              </span>
              <div className="h-px w-10 bg-[#D4AF37]/40" />
            </div>
          </FadeIn>
        </div>
      </div>

    </main>
  );
}