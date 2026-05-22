import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "./src/app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#050A18",
        primary: "#00E5FF",
        secondary: "#8B5CF6",
        accent: "#22C55E",
        "neon-pink": "#FF2D78",
        "neon-orange": "#FF6B35",
        "card-bg": "rgba(255,255,255,0.04)",
      },
      fontFamily: {
        orbitron: ["var(--font-orbitron)", "sans-serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(0,229,255,0.4), 0 0 60px rgba(0,229,255,0.15)",
        "glow-purple": "0 0 20px rgba(139,92,246,0.4)",
        "glow-sm": "0 0 10px rgba(0,229,255,0.3)",
        glass: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(ellipse at 20% 20%, rgba(0,229,255,0.18) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(139,92,246,0.18) 0%, transparent 50%), #050A18",
        "card-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
        "prize-gradient":
          "linear-gradient(135deg, rgba(0,229,255,0.15) 0%, rgba(139,92,246,0.15) 100%)",
        "cyber-gradient": "linear-gradient(135deg, #00E5FF, #8B5CF6, #FF2D78)",
        "shimmer":
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "pulse-neon": "pulse-neon 2s ease-in-out infinite",
        "gradient-shift": "gradient-shift 4s ease infinite",
        "neon-flicker": "neon-flicker 5s infinite",
        "spin-slow": "spin-slow 8s linear infinite",
        "slide-up": "slide-up 0.4s ease forwards",
        "ticker-scroll": "ticker-scroll 20s linear infinite",
        shimmer: "shimmer 2s linear infinite",
        "count-up": "count-up 0.3s ease forwards",
        typing1: "typing 1.2s 0s ease-in-out infinite",
        typing2: "typing 1.2s 0.2s ease-in-out infinite",
        typing3: "typing 1.2s 0.4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-neon": {
          "0%, 100%": { boxShadow: "0 0 10px rgba(0,229,255,0.3)" },
          "50%": { boxShadow: "0 0 25px rgba(0,229,255,0.7), 0 0 50px rgba(0,229,255,0.3)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "neon-flicker": {
          "0%, 95%, 100%": { opacity: "1" },
          "96%": { opacity: "0.8" },
          "97%": { opacity: "1" },
          "98%": { opacity: "0.6" },
          "99%": { opacity: "1" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "ticker-scroll": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "count-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        typing: {
          "0%, 60%, 100%": { transform: "translateY(0)", opacity: "0.4" },
          "30%": { transform: "translateY(-6px)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
