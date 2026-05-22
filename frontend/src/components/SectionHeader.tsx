"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  centered?: boolean;
}

export function SectionHeader({ badge, title, highlight, subtitle, centered = false }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`mb-12 ${centered ? "text-center" : ""}`}
    >
      {badge && (
        <span className="neon-badge mb-4 inline-block">
          <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
          {badge}
        </span>
      )}
      <h2 className="font-orbitron text-3xl md:text-4xl font-bold leading-tight">
        {title}{" "}
        {highlight && <span className="gradient-text">{highlight}</span>}
      </h2>
      {subtitle && (
        <p className="mt-4 text-white/55 max-w-2xl text-base leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className={`mt-5 h-px w-16 bg-gradient-to-r from-primary to-transparent ${centered ? "mx-auto" : ""}`} />
    </motion.div>
  );
}
