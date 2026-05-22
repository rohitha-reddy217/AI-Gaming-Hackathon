"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "@/store/userStore";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Tracks", href: "/#tracks" },
  { label: "Timeline", href: "/#timeline" },
  { label: "Prizes", href: "/#prizes" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { token, clearSession } = useUserStore();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-card border-b border-white/08 py-3"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <img src="/logo.png" alt="IncuXai Logo" className="h-8 w-auto object-contain rounded-md" />
          <span className="font-orbitron font-bold text-lg tracking-wider">
            Incu<span className="text-primary glow-text">Xai</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-white/70 hover:text-primary transition-colors duration-200 font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/dashboard">
            <button className="cyber-btn-outline text-sm px-4 py-2">Dashboard</button>
          </Link>
          {token ? (
            <button
              onClick={() => {
                if (confirm("Are you sure you want to log out / register another team? This will clear your current local session.")) {
                  clearSession();
                  window.location.href = "/register";
                }
              }}
              className="cyber-btn text-sm px-5 py-2"
            >
              Logout / Register New
            </button>
          ) : (
            <Link href="/register">
              <button className="cyber-btn text-sm px-5 py-2">Register Now →</button>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 text-white/70 hover:text-primary"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className={`w-5 h-0.5 bg-current mb-1 transition-all ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
          <div className={`w-5 h-0.5 bg-current mb-1 transition-all ${menuOpen ? "opacity-0" : ""}`} />
          <div className={`w-5 h-0.5 bg-current transition-all ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-card border-t border-white/08 px-6 py-4 space-y-3"
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block text-sm text-white/70 hover:text-primary py-2 border-b border-white/05"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {token ? (
              <>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                  <button className="cyber-btn-outline w-full mb-2 text-sm py-2">Dashboard</button>
                </Link>
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to log out / register another team? This will clear your current local session.")) {
                      clearSession();
                      setMenuOpen(false);
                      window.location.href = "/register";
                    }
                  }}
                  className="cyber-btn w-full mt-2 text-sm py-2"
                >
                  Logout / Register New
                </button>
              </>
            ) : (
              <Link href="/register" onClick={() => setMenuOpen(false)}>
                <button className="cyber-btn w-full mt-2 text-sm py-2">Register Now</button>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
