"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CountdownMode {
  label: string;
  target: Date;
}

const modes: CountdownMode[] = [
  { label: "Registration Closing In", target: new Date("2026-06-20T23:59:59+05:30") },
  { label: "Event Starting In", target: new Date("2026-06-12T09:00:00+05:30") },
  { label: "Submission Deadline", target: new Date("2026-06-20T23:59:59+05:30") },
];

const pad = (v: number) => v.toString().padStart(2, "0");

interface TimeUnit {
  label: string;
  value: string;
}

export function CountdownTimer({ compact = false }: { compact?: boolean }) {
  const [modeIndex] = useState(0);
  const mode = modes[modeIndex];
  const [units, setUnits] = useState<TimeUnit[]>([
    { label: "Days", value: "00" },
    { label: "Hours", value: "00" },
    { label: "Mins", value: "00" },
    { label: "Secs", value: "00" },
  ]);
  const [prevUnits, setPrevUnits] = useState<TimeUnit[]>(units);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const diff = Math.max(0, mode.target.getTime() - now.getTime());
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff / 3600000) % 24);
      const m = Math.floor((diff / 60000) % 60);
      const s = Math.floor((diff / 1000) % 60);
      const next: TimeUnit[] = [
        { label: "Days", value: pad(d) },
        { label: "Hours", value: pad(h) },
        { label: "Mins", value: pad(m) },
        { label: "Secs", value: pad(s) },
      ];
      setPrevUnits((prev) => prev);
      setUnits(next);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [mode]);

  if (compact) {
    return (
      <div className="flex gap-2">
        {units.map((u) => (
          <div key={u.label} className="text-center">
            <div className="font-orbitron text-xl text-primary">{u.value}</div>
            <div className="text-xs text-white/40 uppercase tracking-wider">{u.label}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-neon-pink animate-pulse flex-shrink-0" />
        <span className="text-sm font-medium text-white/60 uppercase tracking-widest">{mode.label}</span>
      </div>

      <div className="flex gap-3 md:gap-4">
        {units.map((unit) => (
          <div key={unit.label} className="flex-1 text-center">
            <div className="glass-card rounded-xl md:rounded-2xl py-4 md:py-5 px-2 border border-primary/15 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={unit.value}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative font-orbitron text-3xl md:text-4xl lg:text-5xl font-black text-primary"
                  style={{ textShadow: "0 0 20px rgba(0,229,255,0.5)" }}
                >
                  {unit.value}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-2 text-xs text-white/40 uppercase tracking-widest font-medium">
              {unit.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
