"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className={`glass-card rounded-xl border transition-all duration-300 overflow-hidden ${
            openIndex === index ? "border-primary/30" : "border-white/08"
          }`}
        >
          <button
            className="w-full flex items-center justify-between px-6 py-5 text-left"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <span className="font-medium text-white/90 pr-4">{item.question}</span>
            <span
              className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 ${
                openIndex === index
                  ? "border-primary text-primary rotate-45"
                  : "border-white/20 text-white/40"
              }`}
            >
              <svg viewBox="0 0 10 10" fill="none" className="w-3 h-3">
                <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="px-6 pb-5 text-white/55 text-sm leading-relaxed">{item.answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
