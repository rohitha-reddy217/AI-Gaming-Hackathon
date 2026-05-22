"use client";

import { motion } from "framer-motion";

interface TrackCardProps {
  icon: string;
  title: string;
  description: string;
  color?: "cyan" | "purple" | "green" | "pink" | "orange";
  index?: number;
}

const colorMap = {
  cyan: { border: "hover:border-primary/40", glow: "hover:shadow-[0_0_30px_rgba(0,229,255,0.15)]", icon: "bg-primary/10 text-primary border-primary/20" },
  purple: { border: "hover:border-secondary/40", glow: "hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]", icon: "bg-secondary/10 text-secondary border-secondary/20" },
  green: { border: "hover:border-accent/40", glow: "hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]", icon: "bg-accent/10 text-accent border-accent/20" },
  pink: { border: "hover:border-neon-pink/40", glow: "hover:shadow-[0_0_30px_rgba(255,45,120,0.15)]", icon: "bg-neon-pink/10 text-neon-pink border-neon-pink/20" },
  orange: { border: "hover:border-neon-orange/40", glow: "hover:shadow-[0_0_30px_rgba(255,107,53,0.15)]", icon: "bg-neon-orange/10 text-neon-orange border-neon-orange/20" },
};

export function TrackCard({ icon, title, description, color = "cyan", index = 0 }: TrackCardProps) {
  const c = colorMap[color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`glass-card rounded-2xl p-6 border border-white/08 transition-all duration-300 cursor-pointer group ${c.border} ${c.glow} hover:-translate-y-1`}
    >
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl border text-2xl mb-4 ${c.icon} group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="font-orbitron font-semibold text-base text-white mb-2 leading-tight">{title}</h3>
      <p className="text-white/50 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}
