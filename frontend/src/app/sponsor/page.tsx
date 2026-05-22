"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionHeader } from "@/components/SectionHeader";

const TIERS = [
  { id: "title", label: "Title Sponsor", price: "₹10,00,000", color: "from-yellow-400/20 to-amber-600/20", border: "border-yellow-400/30", textColor: "text-yellow-300",
    perks: ["Main stage keynote slot", "Full event branding", "Logo on all materials", "Lead export access", "Dedicated booth (50sqft)", "Social media campaign", "Email blast to all participants", "Interview slot on live stream"] },
  { id: "gold", label: "Gold Sponsor", price: "₹5,00,000", color: "from-amber-400/15 to-amber-700/15", border: "border-amber-400/30", textColor: "text-amber-400",
    perks: ["Workshop slot (1 hour)", "Booth presence (25sqft)", "Logo on website & banner", "Lead export access", "Social media shoutouts", "Product demo opportunity"] },
  { id: "silver", label: "Silver Sponsor", price: "₹2,00,000", color: "from-slate-300/15 to-slate-500/15", border: "border-slate-300/30", textColor: "text-slate-300",
    perks: ["Logo on website", "Social media mentions", "Certificate of partnership", "Lead export (limited)", "Swag bag insert"] },
  { id: "community", label: "Community Partner", price: "₹50,000", color: "from-secondary/15 to-secondary/05", border: "border-secondary/30", textColor: "text-secondary",
    perks: ["Logo on website", "Community channel access", "Discord sponsor lounge", "Certificate of partnership"] },
];

const BENEFITS = [
  { icon: "🎯", title: "Brand Visibility", desc: "Logo placement across all event materials, website, and social media" },
  { icon: "👥", title: "Talent Access", desc: "Direct recruitment access to 500+ developers, designers, and AI engineers" },
  { icon: "🎤", title: "Stage Presence", desc: "Workshop slots, keynote opportunities, and live demo sessions" },
  { icon: "📊", title: "Lead Generation", desc: "Export participant data for targeted recruitment and marketing" },
  { icon: "🚀", title: "API Promotion", desc: "Feature your AI APIs and tools as official event tools" },
  { icon: "🌐", title: "Community Reach", desc: "Access to India's largest AI gaming developer community" },
];

export default function SponsorPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [formState, setFormState] = useState({ company: "", email: "", contact: "", phone: "", tier: "Gold Sponsor", message: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { api.get("/sponsors/analytics").then((r) => setAnalytics(r.data)).catch(() => {}); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await api.post("/sponsors/leads", formState); setSubmitted(true); } catch { setSubmitted(true); }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="neon-badge mb-5 inline-block">🤝 Partner with IncuXai 2026</span>
          <h1 className="font-orbitron text-5xl md:text-6xl font-black mb-5">Reach India's Next-Gen<br /><span className="gradient-text">AI Gaming Builders</span></h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10">Sponsor India's First Large-Scale AI Gaming Innovation Festival. Connect with 500+ developers, gamers, startups, and investors in one platform.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[["500+", "Registrations"], ["120+", "Cities"], ["45+", "Mentors"], ["₹30L+", "Prize Pool"]].map(([v, l]) => (
              <div key={l as string} className="glass-card rounded-2xl p-4 border border-white/08">
                <div className="font-orbitron text-2xl font-bold text-primary">{v}</div>
                <div className="text-white/50 text-xs mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding px-6">
        <div className="mx-auto max-w-6xl">
          <SectionHeader badge="Why Sponsor" title="Sponsor" highlight="Benefits" centered />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {BENEFITS.map((b, i) => (
              <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="glass-card-hover rounded-2xl p-5 border border-white/08">
                <span className="text-3xl mb-3 block">{b.icon}</span>
                <div className="font-semibold text-white text-sm mb-1">{b.title}</div>
                <div className="text-white/45 text-xs">{b.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="section-padding px-6">
        <div className="mx-auto max-w-6xl">
          <SectionHeader badge="Packages" title="Sponsorship" highlight="Tiers" centered />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {TIERS.map((t, i) => (
              <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`rounded-2xl p-6 border bg-gradient-to-b ${t.color} ${t.border}`}>
                <div className={`font-orbitron font-bold text-sm mb-1 ${t.textColor}`}>{t.label}</div>
                <div className="font-orbitron text-2xl font-black text-white mb-5">{t.price}</div>
                <ul className="space-y-2">
                  {t.perks.map((p) => <li key={p} className="flex items-start gap-2 text-xs text-white/60"><span className="text-primary mt-0.5">✓</span>{p}</li>)}
                </ul>
                <button onClick={() => setFormState({ ...formState, tier: t.label })} className="cyber-btn-outline w-full mt-5 py-2 text-xs">Select {t.label}</button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Form */}
      <section className="section-padding px-6">
        <div className="mx-auto max-w-2xl">
          <SectionHeader badge="Get in Touch" title="Become a" highlight="Sponsor" centered />
          {submitted ? (
            <div className="glass-card rounded-2xl p-10 border border-accent/20 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="font-orbitron text-xl text-accent">Interest Submitted!</h2>
              <p className="text-white/50 mt-2">Our team will contact you within 24 hours. Thank you!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 border border-white/08 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input className="cyber-input" placeholder="Company Name" value={formState.company} onChange={(e) => setFormState({ ...formState, company: e.target.value })} required />
                <input className="cyber-input" placeholder="Work Email" type="email" value={formState.email} onChange={(e) => setFormState({ ...formState, email: e.target.value })} required />
                <input className="cyber-input" placeholder="Contact Person" value={formState.contact} onChange={(e) => setFormState({ ...formState, contact: e.target.value })} required />
                <input className="cyber-input" placeholder="Phone Number" value={formState.phone} onChange={(e) => setFormState({ ...formState, phone: e.target.value })} />
              </div>
              <select className="cyber-input" value={formState.tier} onChange={(e) => setFormState({ ...formState, tier: e.target.value })}>
                {TIERS.map((t) => <option key={t.id} value={t.label}>{t.label} — {t.price}</option>)}
              </select>
              <textarea className="cyber-input h-24 resize-none" placeholder="Message or special requirements..." value={formState.message} onChange={(e) => setFormState({ ...formState, message: e.target.value })} />
              <button type="submit" className="cyber-btn w-full py-3">Submit Sponsorship Interest →</button>
            </form>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
