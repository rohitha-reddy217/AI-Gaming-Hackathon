"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { useUserStore } from "@/store/userStore";
import { CountdownTimer } from "@/components/CountdownTimer";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const NAV = ["Overview", "Team", "Submissions", "QR Pass", "Announcements", "Discord"];
const NAV_ICONS = ["📊", "👥", "📁", "🎟️", "📢", "💬"];

export default function DashboardPage() {
  const { token, user } = useUserStore();
  const [active, setActive] = useState("Overview");
  const [team, setTeam] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadDone, setUploadDone] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        const [teamRes, annRes] = await Promise.all([api.get("/teams/me", { headers: { Authorization: `Bearer ${token}` } }), api.get("/announcements")]);
        setTeam(teamRes.data.team);
        setAnnouncements(annRes.data.announcements ?? []);
      } catch {}
    };
    load();
  }, [token]);

  const submitProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token || !team) return;
    const fd = new FormData(e.currentTarget);
    fd.set("teamId", team.teamId);
    setUploading(true);
    try {
      await api.post("/submissions", fd, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }, onUploadProgress: (ev) => { if (ev.total) setProgress(Math.round((ev.loaded / ev.total) * 100)); } });
      setUploadDone(true);
    } catch {}
    setUploading(false);
  };

  const payBadge = team?.paymentStatus === "paid" ? { label: "Paid ✓", cls: "neon-badge-green" } : { label: "Pending", cls: "neon-badge" };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 flex min-h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-56 border-r border-white/06 px-4 py-8 gap-1 flex-shrink-0">
          <div className="mb-6 px-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center font-orbitron font-bold text-primary text-lg mb-2">{user?.name?.[0] ?? "U"}</div>
            <div className="text-white font-semibold text-sm truncate">{user?.name ?? "Participant"}</div>
            <span className={`${payBadge.cls} text-xs mt-1 inline-block`}>{payBadge.label}</span>
          </div>
          {NAV.map((n, i) => (
            <button key={n} onClick={() => setActive(n)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left ${active === n ? "bg-primary/10 text-primary border border-primary/20" : "text-white/50 hover:text-white hover:bg-white/04"}`}>
              <span>{NAV_ICONS[i]}</span>{n}
            </button>
          ))}
        </aside>

        {/* Mobile nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-card border-t border-white/08 flex justify-around py-2 px-2">
          {NAV.slice(0, 5).map((n, i) => (
            <button key={n} onClick={() => setActive(n)} className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-xs ${active === n ? "text-primary" : "text-white/40"}`}>
              <span className="text-base">{NAV_ICONS[i]}</span>{n}
            </button>
          ))}
        </div>

        {/* Content */}
        <main className="flex-1 px-6 py-8 pb-24 md:pb-8 overflow-y-auto">
          <h1 className="font-orbitron text-2xl font-bold mb-6">
            {active} {active === "Overview" && <span className="text-white/30 text-base font-poppins font-normal ml-2">— Welcome back, {user?.name ?? "Participant"}!</span>}
          </h1>

          {active === "Overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { label: "Team Name", value: team?.teamName || "Not Created", sub: team?.category || "No category", color: "text-primary" },
                  { label: "Payment Status", value: team?.paymentStatus || "Pending", sub: "Registration fee", color: team?.paymentStatus === "paid" ? "text-accent" : "text-neon-orange" },
                  { label: "Approval", value: team?.approvalStatus || "Under Review", sub: "Admin verification", color: "text-secondary" },
                ].map((c) => (
                  <div key={c.label} className="glass-card rounded-2xl p-5 border border-white/08">
                    <div className="text-xs text-white/40 uppercase tracking-widest mb-2">{c.label}</div>
                    <div className={`text-xl font-semibold ${c.color}`}>{c.value}</div>
                    <div className="text-white/35 text-xs mt-1">{c.sub}</div>
                  </div>
                ))}
              </div>
              <div className="glass-card rounded-2xl p-6 border border-primary/15">
                <div className="text-sm text-white/50 mb-3 uppercase tracking-widest">⏳ Submission Countdown</div>
                <CountdownTimer compact />
              </div>
              {announcements.slice(0, 2).map((a) => (
                <div key={a._id} className="glass-card rounded-xl p-4 border border-white/08">
                  <span className="neon-badge text-xs mb-2 inline-block">📢 Announcement</span>
                  <div className="text-white font-semibold text-sm">{a.title}</div>
                  <p className="text-white/50 text-sm mt-1">{a.content}</p>
                </div>
              ))}
            </motion.div>
          )}

          {active === "Team" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl p-6 border border-white/08">
              <div className="space-y-4">
                {[["Team ID", team?.teamId], ["Team Name", team?.teamName], ["Category", team?.category], ["Members", team?.members?.length || 0], ["Theme", team?.projectDetails?.theme], ["Tech Stack", team?.projectDetails?.techStack?.join(", ")]].map(([k, v]) => (
                  <div key={k as string} className="flex justify-between border-b border-white/05 pb-3 text-sm">
                    <span className="text-white/40">{k}</span>
                    <span className="text-white font-medium">{v || "—"}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {active === "Submissions" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl p-6 border border-white/08">
              {uploadDone ? (
                <div className="text-center py-10"><div className="text-5xl mb-4">✅</div><h2 className="font-orbitron text-xl text-accent">Submission Received!</h2><p className="text-white/50 mt-2">Your project has been submitted successfully.</p></div>
              ) : (
                <form onSubmit={submitProject} className="space-y-5">
                  <input name="githubLink" className="cyber-input" placeholder="GitHub Repository URL" />
                  <input name="demoVideo" className="cyber-input" placeholder="Demo Video URL (YouTube/Drive)" />
                  {[["ppt", "Upload PPT Presentation"], ["apk", "Upload APK / Game Build"], ["zip", "Upload ZIP Build"], ["demo", "Upload Demo Video File"]].map(([name, label]) => (
                    <div key={name as string}>
                      <label className="text-sm text-white/50 mb-2 block">{label}</label>
                      <div className="drop-zone"><input name={name as string} type="file" className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" /><span className="text-white/30 text-sm">Drop file here or click to browse</span></div>
                    </div>
                  ))}
                  {uploading && <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>}
                  <button type="submit" disabled={uploading} className="cyber-btn w-full py-3">{uploading ? `Uploading ${progress}%...` : "Submit Project →"}</button>
                </form>
              )}
            </motion.div>
          )}

          {active === "QR Pass" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <div className="glass-card rounded-2xl p-8 border border-primary/20 inline-block">
                {team?.qrTicketUrl ? <img src={team.qrTicketUrl} alt="QR" className="w-48 h-48 mx-auto rounded-xl" /> : <div className="w-48 h-48 bg-white/05 rounded-xl flex items-center justify-center text-white/30 mx-auto">QR Pending</div>}
                <div className="mt-4 text-white/60 text-sm">Show this QR at the venue entrance</div>
                <div className="mt-2 font-orbitron text-primary text-sm">{team?.teamId || "—"}</div>
              </div>
            </motion.div>
          )}

          {active === "Announcements" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              {announcements.length === 0 ? <p className="text-white/40">No announcements yet.</p> : announcements.map((a) => (
                <div key={a._id} className="glass-card rounded-xl p-5 border border-white/08">
                  <div className="text-primary font-semibold text-sm">{a.title}</div>
                  <p className="text-white/55 text-sm mt-1">{a.content}</p>
                  <div className="text-white/25 text-xs mt-2">{new Date(a.createdAt).toLocaleDateString()}</div>
                </div>
              ))}
            </motion.div>
          )}

          {active === "Discord" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center glass-card rounded-2xl p-10 border border-secondary/20">
              <div className="text-5xl mb-5">💬</div>
              <h2 className="font-orbitron text-xl font-semibold mb-3">IncuXai Discord Community</h2>
              <p className="text-white/50 text-sm mb-6">Join announcements, team formation, AI discussions, mentorship sessions and more.</p>
              <div className="grid grid-cols-2 gap-3 mb-8 text-sm text-left">
                {["#announcements", "#team-formation", "#ai-discussions", "#mentorship", "#sponsor-lounge", "#meme-zone"].map((ch) => (
                  <div key={ch} className="glass-card rounded-lg px-3 py-2 border border-white/06 text-white/50">{ch}</div>
                ))}
              </div>
              <a href="https://discord.com" target="_blank" rel="noreferrer">
                <button className="w-full py-3 rounded-xl font-semibold text-white" style={{ background: "linear-gradient(135deg,#5865F2,#4752C4)" }}>Open Discord →</button>
              </a>
            </motion.div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
