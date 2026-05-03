'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, ArrowRight, Mail } from 'lucide-react';

// ============================================================
// DONNÉES FAQ
// ============================================================
const faqItems = [
  {
    id: 1,
    question: 'What do the sizes correspond to?',
    answer: 'The sizes correspond to European standards and dimensions. Please refer to our size guide for detailed measurements.',
  },
  {
    id: 2,
    question: 'How does the production process work?',
    answer: 'The clothes presented are already sewn in series and ready for delivery. Each piece is crafted with the highest attention to detail and quality materials.',
  },
  {
    id: 3,
    question: 'How long does delivery take?',
    answer: 'Depending on your geographical location in relation to France (the shipping country), delivery takes 3 to 10 days after payment is received.',
    highlight: '3 to 10 days',
  },
  {
    id: 4,
    question: 'What payment methods are available?',
    answer: 'Please refer to the available payment methods indicated on the website. All transactions are processed through secure and encrypted channels.',
  },
  {
    id: 5,
    question: 'Can prices be negotiated?',
    answer: 'Prices are non-negotiable. You can take advantage of sales periods or apply a discount code if you have one.',
    highlight: 'non-negotiable',
  },
  {
    id: 6,
    question: 'Can I exchange a garment if the size does not fit?',
    answer: 'Exchanges are not possible. You must return the garment within 14 days and place a new order in the correct size.',
    highlight: 'No',
  },
  {
    id: 7,
    question: 'Can we return clothes and get a refund?',
    answer: 'Yes, returns are accepted. Please see our return policy page for full conditions and instructions.',
    highlight: 'Yes',
  },
  {
    id: 8,
    question: 'How can we order the clothes?',
    answer: 'Orders can be placed directly on our website at www.mbcreationofficiel.com. Simply select your items, choose your size, and proceed to checkout.',
  },
];

// ============================================================
// DONNÉES TERMS
// ============================================================
const termsItems = [
  {
    id: 1,
    title: 'Introduction',
    content: 'Welcome to MB-Creation. By accessing our website and purchasing our products, you agree to be bound by these terms and conditions. Please read them carefully before proceeding.',
  },
  {
    id: 2,
    title: 'Definitions',
    content: '"We," "us," or "our" refers to MB-Creation. "You" or "your" refers to the customer or user of our website. These definitions apply throughout the entirety of this document.',
  },
  {
    id: 3,
    title: 'Product Information',
    content: 'We strive to provide accurate descriptions of our products. However, we do not guarantee that the information is error-free, complete, or current. Colors may vary slightly due to screen calibration.',
  },
  {
    id: 4,
    title: 'Pricing',
    content: 'All prices are listed in euros (€) and are subject to change without prior notice. Applicable taxes and shipping fees may apply and will be clearly indicated at checkout.',
  },
  {
    id: 5,
    title: 'Orders',
    content: 'By placing an order, you are offering to purchase a product subject to these terms. We reserve the right to refuse or cancel any order for reasons including product availability, pricing errors, or suspected fraud.',
  },
  {
    id: 6,
    title: 'Payment',
    content: 'Payments can be made via credit card or instant payment. All payment information is processed securely through encrypted channels. MB-Creation does not store card details.',
  },
  {
    id: 7,
    title: 'Shipping & Delivery',
    content: 'We aim to process and ship orders within the stated time frame. Delivery times may vary based on location. You are responsible for providing accurate and complete shipping information.',
  },
  {
    id: 8,
    title: 'Returns & Refunds',
    content: 'We have a 14-day return policy. To be eligible for a return, items must be unused and in the same condition as received. Please refer to our dedicated return policy page for full details.',
  },
  {
    id: 9,
    title: 'Intellectual Property',
    content: 'All content on our website — including text, images, and logos — is the property of MB-Creation and is protected by applicable copyright laws. Unauthorized reproduction or use is strictly prohibited.',
  },
  {
    id: 10,
    title: 'Limitation of Liability',
    content: 'MB-Creation shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services, to the fullest extent permitted by applicable law.',
  },
  {
    id: 11,
    title: 'Governing Law',
    content: 'These terms and conditions shall be governed by applicable laws. Any disputes will be resolved through competent jurisdiction as determined by the nature and location of the dispute.',
  },
  {
    id: 12,
    title: 'Changes to Terms',
    content: 'We reserve the right to modify these terms and conditions at any time. Changes will be posted on our website, and your continued use of the site constitutes acceptance of those changes.',
  },
  {
    id: 13,
    title: 'Contact Information',
    content: 'For questions or concerns regarding these terms, please use the contact form on our contact page. We aim to respond to all inquiries within 48 business hours.',
  },
];

// ============================================================
// FAQ ITEM
// ============================================================
function FaqItem({ item, index }: { item: typeof faqItems[0]; index: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="border-b border-stone-100"
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <div className="flex items-center gap-5 pr-6">
          <span className="text-[#D4AF37] text-[9px] font-black tracking-[0.4em] uppercase shrink-0 w-6">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className={`text-sm md:text-base font-light tracking-wide transition-colors duration-300 ${open ? 'text-stone-900' : 'text-stone-600 group-hover:text-stone-900'}`}>
            {item.question}
          </span>
        </div>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className={`shrink-0 w-8 h-8 flex items-center justify-center border transition-colors duration-300 ${open ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-stone-200 text-stone-400'}`}
        >
          <span className="text-lg leading-none font-light">+</span>
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-6 pl-11 pr-12">
              <div className="h-px w-8 bg-[#D4AF37] mb-4" />
              <p className="text-stone-500 text-sm font-light leading-relaxed">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================================
// TERMS ITEM
// ============================================================
function TermsItem({ item, index }: { item: typeof termsItems[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="py-8 border-b border-stone-100"
    >
      <div className="flex gap-6 md:gap-10">
        <span className="text-[#D4AF37] text-[10px] font-black tracking-[0.4em] uppercase shrink-0 pt-1 w-6 text-right">
          {String(item.id).padStart(2, '0')}
        </span>
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.3em] text-stone-900 mb-3">
            {item.title}
          </h3>
          <p className="text-stone-500 text-sm font-light leading-relaxed">
            {item.content}
          </p>
        </div>
      </div>
    </motion.div>
  );
}



// ============================================================
// PAGE PRINCIPALE
// ============================================================
export default function FaqTermsPage() {
  const [activeTab, setActiveTab] = useState<'faq' | 'terms'>('faq');
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  return (
    <main className="bg-white min-h-screen font-sans antialiased">

      {/* HERO */}
      <section className="relative bg-stone-900 overflow-hidden pt-32 pb-20 px-8 md:px-20">
        {/* Grain texture */}
        <div className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundSize: '128px', mixBlendMode: 'overlay',
          }}
        />
        {/* Ligne décorative or */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-[#D4AF37]/20" />

        <div ref={heroRef} className="max-w-[1500px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-5 max-w-2xl"
          >
            <div className="flex items-center gap-4">
              <div className="h-px w-10 bg-[#D4AF37]/60" />
              <span className="text-[#D4AF37] text-[9px] uppercase tracking-[0.7em] font-bold">MB-Creation</span>
            </div>
            <h1 className="text-white text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
              FAQ & Terms<br />
              <span className="text-[#D4AF37]">&</span> Conditions
            </h1>
            <p className="text-white/40 text-sm font-light leading-relaxed max-w-md">
              Everything you need to know about our products, policies, and the terms governing your relationship with MB-Creation.
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex gap-2 mt-12"
          >
            {[
              { id: 'faq', label: 'Frequently Asked Questions' },
              { id: 'terms', label: 'Terms & Conditions' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'faq' | 'terms')}
                className={`relative px-8 py-3.5 text-[9px] uppercase tracking-[0.45em] font-black transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-[#D4AF37] text-black'
                    : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70 border border-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CONTENU */}
      <section className="max-w-[1500px] mx-auto px-8 md:px-20 py-20">
        <AnimatePresence mode="wait">

          {/* FAQ */}
          {activeTab === 'faq' && (
            <motion.div
              key="faq"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Header section */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 pb-8 border-b border-stone-100">
                <div>
                  <span className="text-[#D4AF37] text-[9px] uppercase tracking-[0.6em] font-bold block mb-4">
                    Questions fréquentes
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-black leading-none">
                    Frequently Asked<br />
                    <span className="text-stone-300">Questions</span>
                  </h2>
                </div>
                <p className="text-stone-400 text-sm font-light max-w-xs leading-relaxed md:text-right">
                  Find answers to the most common questions about our products, delivery, and policies.
                </p>
              </div>

              {/* FAQ list */}
              <div className="max-w-3xl">
                {faqItems.map((item, i) => (
                  <FaqItem key={item.id} item={item} index={i} />
                ))}
              </div>

              {/* CTA contact */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mt-20 p-10 md:p-14 bg-stone-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
              >
                <div>
                  <div className="h-px w-8 bg-[#D4AF37] mb-4" />
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter text-black mb-2">
                    Still have questions?
                  </h3>
                  <p className="text-stone-400 text-sm font-light">
                    Our team is here to help. Reach out and we'll get back to you within 48 hours.
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="flex items-center gap-3 px-10 py-4 bg-stone-900 text-white text-[9px] uppercase tracking-[0.4em] font-black hover:bg-[#D4AF37] hover:text-black transition-all duration-500 shrink-0 group"
                >
                  Contact us
                  <ArrowRight size={12} strokeWidth={2} className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </motion.div>
            </motion.div>
          )}

          {/* TERMS */}
          {activeTab === 'terms' && (
            <motion.div
              key="terms"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Header section */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 pb-8 border-b border-stone-100">
                <div>
                  <span className="text-[#D4AF37] text-[9px] uppercase tracking-[0.6em] font-bold block mb-4">
                    Conditions générales
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-black leading-none">
                    Terms &<br />
                    <span className="text-stone-300">Conditions</span>
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-stone-400 text-sm font-light max-w-xs leading-relaxed md:text-right mb-2">
                    Please read these terms carefully before using our website or placing an order.
                  </p>
                  <span className="text-[9px] uppercase tracking-[0.4em] text-stone-300 font-bold">
                    Last updated: 2026
                  </span>
                </div>
              </div>

              {/* Two-column layout sur desktop */}
              <div className="grid md:grid-cols-2 gap-x-20">
                <div>
                  {termsItems.slice(0, 7).map((item, i) => (
                    <TermsItem key={item.id} item={item} index={i} />
                  ))}
                </div>
                <div>
                  {termsItems.slice(7).map((item, i) => (
                    <TermsItem key={item.id} item={item} index={i} />
                  ))}
                  {/* Date mise à jour */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="pt-8 flex items-center gap-4"
                  >
                    <div className="h-px w-8 bg-[#D4AF37]" />
                    <span className="text-[9px] uppercase tracking-[0.45em] text-stone-300 font-bold">
                      Effective date: January 2026
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* Notice bas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mt-16 p-10 md:p-14 border border-stone-100 flex flex-col md:flex-row items-start gap-8"
              >
                <div className="w-1 self-stretch bg-[#D4AF37] shrink-0 hidden md:block" />
                <div>
                  <h3 className="text-lg font-black uppercase tracking-widest text-black mb-3">
                    Questions about these terms?
                  </h3>
                  <p className="text-stone-400 text-sm font-light leading-relaxed mb-6 max-w-xl">
                    If you have any questions or concerns about these Terms & Conditions, please do not hesitate to reach out. Our team will be happy to provide clarification.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-3 text-[9px] uppercase tracking-[0.4em] font-black text-stone-900 border-b border-stone-200 pb-1 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors duration-300 group"
                  >
                    Get in touch
                    <ArrowRight size={11} strokeWidth={2} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </section>

     
    </main>
  );
}