"use client";

import { motion } from "framer-motion";

interface PrizeCardProps {
  rank: string;
  title: string;
  amount: string;
  perks: string[];
  featured?: boolean;
  icon?: string;
}

export function PrizeCard({ rank, title, amount, perks, featured = false, icon = "🏆" }: PrizeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`relative rounded-2xl p-[1px] overflow-hidden ${
        featured
          ? "shadow-[0_0_40px_rgba(0,229,255,0.2)]"
          : ""
      }`}
    >
      {/* Gradient border */}
      <div
        className={`absolute inset-0 rounded-2xl ${
          featured
            ? "bg-gradient-to-b from-primary via-secondary to-transparent"
            : "bg-gradient-to-b from-white/10 to-transparent"
        }`}
      />
      <div className={`relative rounded-2xl p-7 ${featured ? "bg-[#060d1e]" : "bg-[#07101f]"}`}>
        {featured && (
          <div className="absolute top-4 right-4 neon-badge text-xs">★ Featured</div>
        )}
        <div className="text-4xl mb-3">{icon}</div>
        <div className="text-white/40 text-xs font-semibold tracking-widest uppercase mb-1">{rank}</div>
        <div className="font-orbitron font-bold text-xl text-white mb-1">{title}</div>
        <div className={`font-orbitron text-3xl font-black mb-5 ${featured ? "gradient-text" : "text-white/80"}`}>
          {amount}
        </div>
        <ul className="space-y-2">
          {perks.map((perk) => (
            <li key={perk} className="flex items-center gap-2 text-sm text-white/60">
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              {perk}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
