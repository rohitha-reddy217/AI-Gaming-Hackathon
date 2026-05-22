"use client";

import { motion } from "framer-motion";

interface JudgeMentorCardProps {
  name: string;
  role: string;
  company: string;
  expertise: string;
  linkedIn?: string;
  avatar?: string;
  index?: number;
}

export function JudgeMentorCard({ name, role, company, expertise, linkedIn, avatar, index = 0 }: JudgeMentorCardProps) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const colors = ["from-primary to-secondary", "from-secondary to-neon-pink", "from-accent to-primary", "from-neon-orange to-neon-pink", "from-neon-pink to-secondary"];
  const gradient = colors[index % colors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="glass-card-hover rounded-2xl p-5 border border-white/08 text-center group"
    >
      {/* Avatar */}
      <div className="relative mx-auto w-16 h-16 rounded-full mb-4">
        {avatar ? (
          <img src={avatar} alt={name} className="w-full h-full object-cover rounded-full" />
        ) : (
          <div className={`w-full h-full rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center font-orbitron font-bold text-lg text-white`}>
            {initials}
          </div>
        )}
        <div className="absolute inset-0 rounded-full ring-1 ring-white/10 group-hover:ring-primary/40 transition-all duration-300" />
      </div>

      <div className="font-semibold text-white text-sm">{name}</div>
      <div className="text-primary text-xs font-medium mt-0.5">{role}</div>
      <div className="text-white/40 text-xs mt-0.5">{company}</div>
      <div className="mt-3 inline-block px-3 py-1 rounded-full bg-white/05 border border-white/08 text-white/50 text-xs">
        {expertise}
      </div>
      {linkedIn && (
        <div className="mt-3">
          <a
            href={linkedIn}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-white/40 hover:text-primary transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </a>
        </div>
      )}
    </motion.div>
  );
}
