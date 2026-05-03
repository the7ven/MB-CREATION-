'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Package, Clock, CreditCard, Ban, AlertTriangle, Info } from 'lucide-react';

// ============================================================
// DONNÉES
// ============================================================
const returnCards = [
  {
    icon: <Clock size={22} strokeWidth={1.5} />,
    title: 'Return Window',
    description: 'You have 14 calendar days from the date of purchase to initiate a return.',
    highlight: '14 calendar days',
  },
  {
    icon: <Package size={22} strokeWidth={1.5} />,
    title: 'Condition of Items',
    description: 'Items must be returned in their original condition — unworn, unwashed, and with all tags attached.',
    highlight: null,
  },
  {
    icon: <CreditCard size={22} strokeWidth={1.5} />,
    title: 'Refund Method',
    description: 'Refunds are processed back to the original payment method. Allow up to 10 days after receipt.',
    highlight: '10 days',
  },
  {
    icon: <Ban size={22} strokeWidth={1.5} />,
    title: 'Final Sale Items',
    description: 'Items marked as final sale are not eligible for return under any circumstances.',
    highlight: null,
  },
];

const returnSteps = [
  {
    id: 1,
    title: 'Initiate Your Request',
    description: 'Contact us via our contact form. Include your order number and reason for return.',
  },
  {
    id: 2,
    title: 'Receive Instructions',
    description: 'We will email you detailed return instructions, including the shipping address and return label details.',
  },
  {
    id: 3,
    title: 'Pack & Ship',
    description: 'Ensure items are in original condition with all tags attached. Use secure packaging and ship to the address provided.',
  },
  {
    id: 4,
    title: 'Processing & Refund',
    description: 'Once your return is received and verified, we will process your refund within 10 business days.',
  },
];

const returnFaqs = [
  {
    id: 1,
    question: 'Can I exchange my item for a different size or color?',
    answer: 'No, we do not offer direct exchanges. You will need to return your item and place a new order for the desired size or color.',
  },
  {
    id: 2,
    question: 'How can I track the status of my refund?',
    answer: 'Once we have received and processed your return, you will receive a confirmation email. For further questions, please contact us through our FAQ page form.',
  },
  {
    id: 3,
    question: 'What happens if my item arrives damaged?',
    answer: 'If you receive a damaged item, contact us immediately via our contact form with photos of the item and packaging. We will prioritize your request.',
  },
];

// ============================================================
// RETURN CARD
// ============================================================
function ReturnCard({ card, index }: { card: typeof returnCards[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col gap-6 p-8 border border-stone-100 hover:border-[#D4AF37]/30 transition-all duration-500 hover:shadow-[0_8px_40px_rgba(212,175,55,0.06)]"
    >
      {/* Numéro décoratif */}
      <span className="absolute top-6 right-7 text-[40px] font-black text-stone-50 leading-none select-none group-hover:text-[#D4AF37]/10 transition-colors duration-500">
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Icône */}
      <div className="w-12 h-12 flex items-center justify-center border border-stone-200 text-[#D4AF37] group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-all duration-400">
        {card.icon}
      </div>

      <div>
        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-stone-900 mb-3">{card.title}</h3>
        <p className="text-stone-500 text-sm font-light leading-relaxed">{card.description}</p>
      </div>
    </motion.div>
  );
}

// ============================================================
// STEP
// ============================================================
function ReturnStep({ step, index, total }: { step: typeof returnSteps[0]; index: number; total: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex gap-8 pb-12 last:pb-0"
    >
      {/* Ligne verticale */}
      {index < total - 1 && (
        <div className="absolute left-5 top-14 bottom-0 w-px bg-stone-100" />
      )}

      {/* Numéro */}
      <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-stone-900 text-white text-[10px] font-black tracking-wider z-10">
        {String(step.id).padStart(2, '0')}
      </div>

      {/* Contenu */}
      <div className="pt-1.5">
        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-stone-900 mb-2">{step.title}</h3>
        <p className="text-stone-500 text-sm font-light leading-relaxed">{step.description}</p>
      </div>
    </motion.div>
  );
}

// ============================================================
// FAQ ITEM
// ============================================================
function FaqItem({ item, index }: { item: typeof returnFaqs[0]; index: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="border-b border-stone-100"
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <div className="flex items-center gap-5 pr-6">
          <span className="text-[#D4AF37] text-[9px] font-black tracking-[0.4em] shrink-0">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className={`text-sm font-light tracking-wide transition-colors duration-300 ${open ? 'text-stone-900' : 'text-stone-600 group-hover:text-stone-900'}`}>
            {item.question}
          </span>
        </div>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          className={`shrink-0 w-8 h-8 flex items-center justify-center border transition-colors duration-300 ${open ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-stone-200 text-stone-400'}`}
        >
          <span className="text-lg leading-none font-light">+</span>
        </motion.div>
      </button>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="pb-6 pl-11 pr-12">
            <div className="h-px w-8 bg-[#D4AF37] mb-4" />
            <p className="text-stone-500 text-sm font-light leading-relaxed">{item.answer}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}


// ============================================================
// PAGE PRINCIPALE
// ============================================================
export default function ReturnsPolicyPage() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const alertRef = useRef(null);
  const alertInView = useInView(alertRef, { once: true, margin: '-40px' });
  const stepsRef = useRef(null);
  const stepsInView = useInView(stepsRef, { once: true, margin: '-60px' });
  const faqRef = useRef(null);
  const faqInView = useInView(faqRef, { once: true, margin: '-60px' });

  return (
    <main className="bg-white min-h-screen font-sans antialiased">

      {/* ── HERO ── */}
      <section className="relative bg-stone-900 overflow-hidden pt-32 pb-24 px-8 md:px-20">
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundSize: '128px',
            mixBlendMode: 'overlay',
          }}
        />
        <div className="absolute left-0 top-0 bottom-0 w-px bg-[#D4AF37]/20" />

        <div ref={heroRef} className="max-w-[1500px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-10 bg-[#D4AF37]/60" />
              <span className="text-[#D4AF37] text-[9px] uppercase tracking-[0.7em] font-bold">MB-Creation</span>
            </div>
            <h1 className="text-white text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none mb-6">
              Returns<br />
              <span className="text-[#D4AF37]">&</span> Refunds
            </h1>
            <p className="text-white/40 text-sm font-light leading-relaxed max-w-md">
              We want you to be completely satisfied with your purchase. Here's everything you need to know about our returns policy.
            </p>
          </motion.div>

          {/* Indicateurs clés */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-10 mt-14 pt-10 border-t border-white/10"
          >
            {[
              { value: '14 Days', label: 'Return Window' },
              { value: '10 Days', label: 'Refund Processing' },
              { value: '100%', label: 'Original Payment' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-white text-2xl font-black tracking-tighter">{stat.value}</div>
                <div className="text-white/30 text-[9px] uppercase tracking-[0.4em] font-light mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CONTENU ── */}
      <div className="max-w-[1500px] mx-auto px-8 md:px-20">

        {/* CARDS */}
        <div className="py-20 border-b border-stone-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {returnCards.map((card, i) => (
              <ReturnCard key={card.title} card={card} index={i} />
            ))}
          </div>
        </div>

        {/* ALERTES */}
        <div ref={alertRef} className="py-14 border-b border-stone-100 flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={alertInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-start gap-5 p-6 border-l-2 border-stone-900 bg-stone-50"
          >
            <Info size={16} strokeWidth={2} className="text-stone-900 shrink-0 mt-0.5" />
            <p className="text-sm font-light text-stone-700 leading-relaxed">
              <span className="font-black uppercase tracking-widest text-stone-900 text-[10px]">Important — </span>
              Return shipping costs are the responsibility of the customer.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={alertInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-start gap-5 p-6 border-l-2 border-[#D4AF37] bg-[#D4AF37]/5"
          >
            <AlertTriangle size={16} strokeWidth={2} className="text-[#D4AF37] shrink-0 mt-0.5" />
            <p className="text-sm font-light text-stone-700 leading-relaxed">
              <span className="font-black uppercase tracking-widest text-stone-900 text-[10px]">Attention — </span>
              Exchanges are not allowed. If you purchased the wrong size or color, please return the item and make a new purchase.
            </p>
          </motion.div>
        </div>

        {/* PROCESS + FAQ (2 colonnes) */}
        <div className="py-20 border-b border-stone-100 grid md:grid-cols-2 gap-20">

          {/* Étapes */}
          <div ref={stepsRef}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={stepsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="mb-12"
            >
              <span className="text-[#D4AF37] text-[9px] uppercase tracking-[0.6em] font-bold block mb-4">How it works</span>
              <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-black leading-none">
                Return<br /><span className="text-stone-300">Process</span>
              </h2>
            </motion.div>

            {returnSteps.map((step, i) => (
              <ReturnStep key={step.id} step={step} index={i} total={returnSteps.length} />
            ))}
          </div>

          {/* FAQ retours */}
          <div ref={faqRef}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={faqInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="mb-12"
            >
              <span className="text-[#D4AF37] text-[9px] uppercase tracking-[0.6em] font-bold block mb-4">Questions</span>
              <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-black leading-none">
                Returns<br /><span className="text-stone-300">FAQ</span>
              </h2>
            </motion.div>

            {returnFaqs.map((item, i) => (
              <FaqItem key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-10"
        >
          <div>
            <div className="h-px w-8 bg-[#D4AF37] mb-5" />
            <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-black leading-none mb-3">
              Need help with<br />your return?
            </h2>
            <p className="text-stone-400 text-sm font-light max-w-sm leading-relaxed">
              Our customer service team is here to assist you with any questions. We aim to respond within 48 business hours.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Link
              href="/contact"
              className="flex items-center gap-3 px-12 py-5 bg-stone-900 text-white text-[9px] uppercase tracking-[0.45em] font-black hover:bg-[#D4AF37] hover:text-black transition-all duration-500 group"
            >
              Contact Us
              <ArrowRight size={12} strokeWidth={2} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              href="/pages/faq"
              className="flex items-center gap-3 px-12 py-5 border border-stone-200 text-stone-900 text-[9px] uppercase tracking-[0.45em] font-black hover:border-stone-900 transition-all duration-300 group"
            >
              View FAQ
              <ArrowRight size={12} strokeWidth={2} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </motion.div>
      </div>

     
    </main>
  );
}