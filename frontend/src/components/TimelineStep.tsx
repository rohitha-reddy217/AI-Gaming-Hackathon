"use client";

import { motion } from "framer-motion";

interface TimelineStepProps {
  phase: string;
  date: string;
  description?: string;
  index: number;
  isLast?: boolean;
  status?: "done" | "active" | "upcoming";
}

export function TimelineStep({ phase, date, description, index, isLast = false, status = "upcoming" }: TimelineStepProps) {
  const isLeft = index % 2 === 0;
  const dotColor =
    status === "done" ? "bg-accent border-accent" :
    status === "active" ? "bg-primary border-primary animate-pulse-neon" :
    "bg-white/10 border-white/20";

  const cardBorder =
    status === "done" ? "border-accent/20" :
    status === "active" ? "border-primary/40 shadow-[0_0_20px_rgba(0,229,255,0.1)]" :
    "border-white/08";

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative flex items-center gap-6 md:gap-0 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} mb-8`}
    >
      {/* Card */}
      <div className={`flex-1 ${isLeft ? "md:pr-10 md:text-right" : "md:pl-10"}`}>
        <div className={`glass-card rounded-xl p-5 border ${cardBorder} inline-block max-w-xs`}>
          {status === "active" && (
            <span className="neon-badge text-xs mb-2 inline-block">🔴 Live</span>
          )}
          {status === "done" && (
            <span className="neon-badge-green text-xs mb-2 inline-block">✓ Done</span>
          )}
          <div className="font-orbitron font-semibold text-sm text-white">{phase}</div>
          <div className="text-primary font-semibold text-sm mt-1">{date}</div>
          {description && <div className="text-white/45 text-xs mt-2">{description}</div>}
        </div>
      </div>

      {/* Center dot — only for md+ */}
      <div className="hidden md:flex flex-col items-center absolute left-1/2 -translate-x-1/2">
        <div className={`w-4 h-4 rounded-full border-2 ${dotColor} z-10 bg-background`} />
        {!isLast && <div className="w-px h-16 bg-gradient-to-b from-primary/40 to-transparent mt-1" />}
      </div>

      {/* Mobile left dot */}
      <div className="flex md:hidden items-start pt-1">
        <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${dotColor}`} />
      </div>

      {/* Spacer for the other side */}
      <div className="hidden md:block flex-1" />
    </motion.div>
  );
}
