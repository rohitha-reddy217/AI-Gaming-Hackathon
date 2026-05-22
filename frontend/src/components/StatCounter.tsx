"use client";

import { useEffect, useRef, useState } from "react";

interface StatCounterProps {
  value: number | string;
  suffix?: string;
  prefix?: string;
  label: string;
  icon?: React.ReactNode;
  color?: "cyan" | "purple" | "green" | "pink";
}

const colorMap = {
  cyan: { text: "text-primary", glow: "rgba(0,229,255,0.3)", border: "border-primary/20", bg: "bg-primary/5" },
  purple: { text: "text-secondary", glow: "rgba(139,92,246,0.3)", border: "border-secondary/20", bg: "bg-secondary/5" },
  green: { text: "text-accent", glow: "rgba(34,197,94,0.3)", border: "border-accent/20", bg: "bg-accent/5" },
  pink: { text: "text-neon-pink", glow: "rgba(255,45,120,0.3)", border: "border-neon-pink/20", bg: "bg-neon-pink/5" },
};

export function StatCounter({ value, suffix = "", prefix = "", label, icon, color = "cyan" }: StatCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isNumber = typeof value === "number";
  const c = colorMap[color];

  useEffect(() => {
    if (!isNumber) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        let start = 0;
        const end = value as number;
        const duration = 1800;
        const step = Math.ceil(end / (duration / 16));
        const timer = setInterval(() => {
          start = Math.min(start + step, end);
          setCount(start);
          if (start >= end) clearInterval(timer);
        }, 16);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, isNumber]);

  return (
    <div
      ref={ref}
      className={`glass-card-hover rounded-2xl p-6 border ${c.border} text-center relative overflow-hidden`}
    >
      <div className={`absolute inset-0 ${c.bg} opacity-50 rounded-2xl`} />
      {icon && (
        <div className={`relative inline-flex items-center justify-center w-12 h-12 rounded-xl ${c.bg} border ${c.border} mb-3 mx-auto`}>
          <span className={c.text}>{icon}</span>
        </div>
      )}
      <div className={`relative font-orbitron text-3xl md:text-4xl font-bold ${c.text}`}
        style={{ textShadow: `0 0 20px ${c.glow}` }}
      >
        {prefix}{isNumber ? count.toLocaleString() : value}{suffix}
      </div>
      <div className="relative mt-1 text-sm text-white/50 font-medium">{label}</div>
    </div>
  );
}
