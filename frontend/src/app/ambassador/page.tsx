"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { useUserStore } from "@/store/userStore";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionHeader } from "@/components/SectionHeader";

const REWARDS = [
  { icon: "🎟️", title: "Free Event Pass", desc: "Top ambassadors get complimentary passes", points: 500 },
  { icon: "👕", title: "Official Merchandise", desc: "IncuXai branded hoodie and kit", points: 300 },
  { icon: "💼", title: "Internship Opportunity", desc: "Direct interview with partner companies", points: 800 },
  { icon: "🏆", title: "Campus Champion Title", desc: "Featured on website and social media", points: 1000 },
];

export default function AmbassadorPage() {
  const { token } = useUserStore();
  const [profile, setProfile] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!token) return;
    Promise.all([api.get("/campus/me", { headers: { Authorization: `Bearer ${token}` } }), api.get("/campus/leaderboard")])
      .then(([p, l]) => { setProfile(p.data.ambassador); setLeaderboard(l.data.leaderboard ?? []); })
      .catch(() => {});
  }, [token]);

  const referralLink = profile?.referralCode ? `https://incuxai.com/register?ref=${profile.referralCode}` : "https://incuxai.com/register?ref=DEMO2026";
  const copyLink = () => { navigator.clipboard.writeText(referralLink); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const points = profile?.points ?? 0;
  const nextTier = points < 300 ? 300 : points < 500 ? 500 : points < 1000 ? 1000 : 2000;
  const progress = Math.min((points / nextTier) * 100, 100);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-16 px-6">
        <div className="mx-auto max-w-5xl">
          <SectionHeader badge="Campus Ambassador" title="Ambassador" highlight="Portal" subtitle="Spread the word, earn points, unlock rewards. Be the IncuXai champion at your campus." />

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {/* Profile Card */}
            <div className="md:col-span-1 space-y-4">
              <div className="glass-card rounded-2xl p-6 border border-primary/15">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-orbitron text-2xl font-bold text-white mb-4">
                  {profile?.referralCode?.[0] ?? "A"}
                </div>
                <div className="font-orbitron text-lg font-bold text-white mb-1">Ambassador</div>
                <div className="text-white/50 text-sm mb-4">{profile?.referralCode ?? "DEMO2026"}</div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Points</span><span className="text-primary font-bold">{points}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Referrals</span><span className="text-white">{profile?.referrals ?? 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Next Tier</span><span className="text-secondary">{nextTier} pts</span>
                  </div>
                </div>
                <div className="progress-bar mb-1"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
                <div className="text-xs text-white/30">{points}/{nextTier} pts to next reward</div>
              </div>

              {/* Referral Link */}
              <div className="glass-card rounded-2xl p-5 border border-white/08">
                <div className="text-xs text-white/40 uppercase tracking-widest mb-2">Your Referral Link</div>
                <div className="bg-white/05 rounded-lg p-3 text-xs text-primary font-mono break-all mb-3">{referralLink}</div>
                <button onClick={copyLink} className="cyber-btn w-full py-2 text-sm">{copied ? "✓ Copied!" : "Copy Link"}</button>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="md:col-span-2 space-y-4">
              <div className="glass-card rounded-2xl p-6 border border-white/08">
                <h2 className="font-orbitron text-lg font-semibold mb-4">🏆 Leaderboard</h2>
                <div className="space-y-2">
                  {(leaderboard.length > 0 ? leaderboard : Array(5).fill(null).map((_, i) => ({ referralCode: `AMB${100 + i}`, points: 1200 - i * 150, _id: i }))).map((item, idx) => (
                    <motion.div key={item._id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.06 }}
                      className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${idx === 0 ? "border-yellow-400/30 bg-yellow-400/05" : idx === 1 ? "border-slate-300/20 bg-slate-300/03" : idx === 2 ? "border-amber-600/20 bg-amber-600/03" : "border-white/05"}`}>
                      <span className="w-8 h-8 rounded-lg flex items-center justify-center font-orbitron text-sm font-bold" style={{ background: idx === 0 ? "rgba(255,215,0,0.15)" : idx === 1 ? "rgba(192,192,192,0.1)" : idx === 2 ? "rgba(205,127,50,0.1)" : "rgba(255,255,255,0.05)" }}>
                        {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                      </span>
                      <span className="flex-1 text-sm text-white font-medium">{item.referralCode}</span>
                      <span className="text-primary font-orbitron font-bold text-sm">{item.points} pts</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Rewards */}
          <SectionHeader badge="Earn Rewards" title="Ambassador" highlight="Rewards" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {REWARDS.map((r, i) => (
              <motion.div key={r.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className={`glass-card-hover rounded-2xl p-5 border text-center ${points >= r.points ? "border-accent/30 bg-accent/05" : "border-white/08"}`}>
                <span className="text-3xl mb-3 block">{r.icon}</span>
                <div className="font-semibold text-white text-sm mb-1">{r.title}</div>
                <div className="text-white/45 text-xs mb-3">{r.desc}</div>
                <div className={`neon-badge mx-auto justify-center text-xs ${points >= r.points ? "neon-badge-green" : ""}`}>{r.points} pts</div>
                {points >= r.points && <div className="text-accent text-xs mt-2">✓ Unlocked!</div>}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
