"use client";
import { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { useUserStore } from "@/store/userStore";
import { teamSchema } from "@/lib/validators";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const CATEGORIES = [
  { id: "student", label: "Student", fee: "₹300/person", size: "2–5 members", icon: "🎓", desc: "For college students and fresh graduates" },
  { id: "professional", label: "IT Professional", fee: "₹1000/person", size: "2–3 members", icon: "💼", desc: "For working professionals in tech" },
  { id: "startup", label: "Startup / Company", fee: "₹5000/company", size: "2 members", icon: "🚀", desc: "For registered startups and companies" },
];

const THEMES = [
  "AI NPC Systems", "Procedural Content Generation", "AI for Game Testing & Balancing",
  "AR/VR Gaming Experience", "Esports Analytics & AI", "Serious Games for Social Impact", "Metaverse & Web3 Gaming",
];

const otpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  mobile: z.string().min(10),
  role: z.enum(["student", "professional", "startup"]),
  code: z.string().length(6).optional(),
});
type Step1Data = z.infer<typeof otpSchema>;
type TeamData = z.infer<typeof teamSchema>;

declare global { interface Window { Razorpay?: any } }

const STEPS = ["Category", "Team Details", "Discord", "Payment", "Success"];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [discordVerified, setDiscordVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setSession, token, clearSession } = useUserStore();

  const s1 = useForm<Step1Data>({ resolver: zodResolver(otpSchema), defaultValues: { role: "student" } });
  const s2 = useForm<TeamData>({ resolver: zodResolver(teamSchema), defaultValues: { teamName: "", category: "student", projectDetails: { title: "", theme: "", techStack: [], description: "" } } });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Restore step and category from database on mount if session is active
  useEffect(() => {
    const recoverStep = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const res = await api.get("/teams/me", { headers: { Authorization: `Bearer ${token}` } });
        const team = res.data.team;
        if (team) {
          setTeamId(team.teamId);
          setSelectedCategory(team.category);
          s2.setValue("category", team.category);
          s2.setValue("teamName", team.teamName);
          s2.setValue("projectDetails", team.projectDetails);
          
          if (team.paymentStatus === "paid") {
            setQrUrl(team.qrTicketUrl || null);
            setStep(5);
          } else if (team.discordVerified) {
            setDiscordVerified(true);
            setStep(4);
          } else {
            setStep(3);
          }
        } else {
          setStep(2);
        }
      } catch {}
      setLoading(false);
    };
    recoverStep();
  }, [token]);

  const discordUrl = useMemo(() => {
    const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || "placeholder";
    const redirect = typeof window !== "undefined" ? `${window.location.origin}/discord/callback` : "";
    return `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirect)}&response_type=code&scope=identify%20guilds.join`;
  }, []);

  const sendOtp = async (d: Step1Data) => {
    setLoading(true);
    try {
      await api.post("/auth/otp/send", { email: d.email });
      setOtpSent(true);
    } catch (err: any) {
      console.error("OTP send failed:", err);
      alert(err.response?.data?.message || "Failed to send OTP. Please check your network and email address.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (d: Step1Data) => {
    if (!d.code) return;
    setLoading(true);
    try {
      const res = await api.post("/auth/otp/verify", { email: d.email, code: d.code, name: d.name, role: d.role, mobile: d.mobile });
      setSession(res.data.token, res.data.user);
      s2.setValue("category", d.role);
      setStep(2);
    } catch (err: any) {
      console.error("OTP verify failed:", err);
      alert(err.response?.data?.message || "OTP verification failed. Please check the code and try again.");
    } finally {
      setLoading(false);
    }
  };

  const createTeam = async (d: TeamData) => {
    if (!token) {
      alert("Session expired. Please restart the registration.");
      setStep(1);
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/teams", d, { headers: { Authorization: `Bearer ${token}` } });
      setTeamId(res.data.team.teamId);
      setStep(3);
    } catch (err: any) {
      console.error("Create team failed:", err);
      alert(err.response?.data?.message || "Failed to save team details. Please check the fields and try again.");
    } finally {
      setLoading(false);
    }
  };

  const startPayment = async () => {
    if (!token || !teamId) {
      alert("Missing authorization token or team ID. Please re-register or refresh the page.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/payments/order", { teamId }, { headers: { Authorization: `Bearer ${token}` } });
      const orderId = res.data.order.id;
      
      const isDummyKey =
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID === "rzp_test_dummykeyid" ||
        !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID.includes("dummy");

      if (isDummyKey || !window.Razorpay) {
        console.log("Simulating local payment verification...");
        const simulatedPaymentId = "pay_devmock_" + Math.random().toString(36).substring(2, 11);
        
        await api.post("/payments/verify", {
          razorpayOrderId: orderId,
          razorpayPaymentId: simulatedPaymentId,
          razorpaySignature: "dev-simulated-signature"
        }, { headers: { Authorization: `Bearer ${token}` } });
        
        // Fetch updated team detail with QR code URL
        const teamRes = await api.get("/teams/me", { headers: { Authorization: `Bearer ${token}` } });
        if (teamRes.data.team) {
          setQrUrl(teamRes.data.team.qrTicketUrl ?? null);
        }
        setStep(5);
        setLoading(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: res.data.amount * 100,
        currency: "INR",
        name: "IncuXai",
        description: "Hackathon Registration",
        order_id: orderId,
        handler: async (response: any) => {
          setLoading(true);
          try {
            await api.post("/payments/verify", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            }, { headers: { Authorization: `Bearer ${token}` } });
            
            // Fetch updated team detail with QR code URL
            const teamRes = await api.get("/teams/me", { headers: { Authorization: `Bearer ${token}` } });
            if (teamRes.data.team) {
              setQrUrl(teamRes.data.team.qrTicketUrl ?? null);
            }
            setStep(5);
          } catch (err: any) {
            console.error("Razorpay verify handler error:", err);
            alert(err.response?.data?.message || "Payment signature verification failed. Please try again or contact support.");
          } finally {
            setLoading(false);
          }
        }
      });
      rzp.open();
    } catch (err: any) {
      console.error("Start payment failed:", err);
      alert(err.response?.data?.message || "Failed to initiate payment. Your team record might have been reset on the server. Please try refreshing.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step === 5 && token && teamId) {
      api.get("/teams/me", { headers: { Authorization: `Bearer ${token}` } }).then((r) => setQrUrl(r.data.team?.qrTicketUrl ?? null));
    }
  }, [step, token, teamId]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-6">
        <div className="mx-auto max-w-3xl">
          {token && (
            <div className="flex justify-end mb-6">
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to log out / restart registration? This will clear your current local session.")) {
                    clearSession();
                    setStep(1);
                    setSelectedCategory(null);
                    setOtpSent(false);
                    setTeamId(null);
                    setQrUrl(null);
                    setDiscordVerified(false);
                    s1.reset();
                    s2.reset();
                  }
                }}
                className="text-xs text-white/40 hover:text-primary transition-colors flex items-center gap-1.5 bg-white/05 px-3 py-1.5 rounded-lg border border-white/08 font-orbitron tracking-wider"
              >
                <span>↺</span> Restart Registration / Logout
              </button>
            </div>
          )}
          {/* Stepper */}
          <div className="flex items-center justify-between mb-12 relative">
            <div className="absolute top-4 left-0 right-0 h-px bg-white/08" />
            {STEPS.map((label, i) => {
              const num = i + 1;
              const done = step > num;
              const active = step === num;
              return (
                <div key={label} className="relative flex flex-col items-center gap-2 z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${done ? "bg-accent border-accent text-black" : active ? "bg-primary border-primary text-black" : "bg-background border-white/20 text-white/30"}`}>
                    {done ? "✓" : num}
                  </div>
                  <span className={`text-xs hidden sm:block ${active ? "text-primary" : "text-white/30"}`}>{label}</span>
                </div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1 */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <h1 className="font-orbitron text-3xl font-bold mb-2">Choose Your Category</h1>
                <p className="text-white/50 mb-8">Select the category that best describes you or your team.</p>
                <div className="grid gap-4 mb-8">
                  {CATEGORIES.map((cat) => (
                    <button key={cat.id} onClick={() => { setSelectedCategory(cat.id); s1.setValue("role", cat.id as any); }}
                      className={`glass-card rounded-2xl p-5 border text-left transition-all duration-300 ${selectedCategory === cat.id ? "border-primary/50 bg-primary/05 shadow-[0_0_20px_rgba(0,229,255,0.1)]" : "border-white/08 hover:border-white/20"}`}>
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{cat.icon}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-white">{cat.label}</div>
                          <div className="text-white/45 text-sm">{cat.desc}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-primary font-orbitron font-bold">{cat.fee}</div>
                          <div className="text-white/40 text-xs">{cat.size}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                {selectedCategory && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6 border border-white/08 space-y-4">
                    <h2 className="font-semibold text-white">Your Details</h2>
                    <input className="cyber-input" placeholder="Full Name" {...s1.register("name")} />
                    <input className="cyber-input" placeholder="Email Address" type="email" {...s1.register("email")} />
                    <input className="cyber-input" placeholder="Mobile Number" {...s1.register("mobile")} />
                    {otpSent && (
                      <div className="space-y-2">
                        <input className="cyber-input" placeholder="Enter 6-digit OTP" {...s1.register("code")} />
                        <p className="text-xs text-white/50 bg-white/05 border border-white/10 rounded-xl p-3 leading-relaxed">
                          💡 <span className="font-semibold text-primary">Local Dev Note:</span> Gmail SMTP is now fully verified using <span className="text-primary/80 underline font-mono select-all">dpkreddy2005@gmail.com</span>! You can now receive OTPs in <b>any email address</b> you enter. If you don't see it, check your spam or copy the OTP code directly from your running <span className="text-secondary font-semibold font-mono">npm run dev:backend</span> terminal logs.
                        </p>
                      </div>
                    )}
                    <button onClick={s1.handleSubmit(otpSent ? verifyOtp : sendOtp)} disabled={loading}
                      className="cyber-btn w-full py-3">{loading ? "Please wait..." : otpSent ? "Verify OTP →" : "Send OTP →"}</button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <h1 className="font-orbitron text-3xl font-bold mb-2">Team Details</h1>
                <p className="text-white/50 mb-8">Tell us about your team and what you're building.</p>
                <form onSubmit={s2.handleSubmit(createTeam)} className="space-y-4">
                  <input className="cyber-input" placeholder="Team Name" {...s2.register("teamName")} />
                  <input className="cyber-input" placeholder="Project Title" {...s2.register("projectDetails.title")} />
                  <select className="cyber-input" {...s2.register("projectDetails.theme")}>
                    <option value="">Select a Theme Track</option>
                    {THEMES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <input className="cyber-input" placeholder="Tech Stack (comma separated, e.g. Unity, Python, TensorFlow)" onChange={(e) => s2.setValue("projectDetails.techStack", e.target.value.split(",").map((s) => s.trim()))} />
                  <textarea className="cyber-input h-24 resize-none" placeholder="Project Description (what are you building?)" {...s2.register("projectDetails.description")} />
                  <button type="submit" disabled={loading} className="cyber-btn w-full py-3">{loading ? "Saving..." : "Save & Continue →"}</button>
                </form>
              </motion.div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="text-center">
                <h1 className="font-orbitron text-3xl font-bold mb-2">Join Discord</h1>
                <p className="text-white/50 mb-10">Discord verification is mandatory. Join our server to unlock private channels and team formation.</p>
                <div className="glass-card rounded-2xl p-10 border border-secondary/20 mb-6">
                  <div className="text-6xl mb-5">💬</div>
                  <h2 className="font-orbitron text-xl font-semibold mb-3">Official IncuXai Discord</h2>
                  <p className="text-white/45 text-sm mb-7">5000+ developers, gamers, and innovators. Mentorship channels, team formation, announcements.</p>
                  <a href={discordUrl} target="_blank" rel="noreferrer" onClick={() => setTimeout(() => setDiscordVerified(true), 3000)}>
                    <button className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-300" style={{ background: "linear-gradient(135deg,#5865F2,#4752C4)" }}>
                      Join Official Discord Server →
                    </button>
                  </a>
                  {discordVerified && <p className="mt-4 text-accent text-sm">✓ Discord verification detected!</p>}
                </div>
                <button onClick={() => setStep(4)} disabled={!discordVerified} className={`cyber-btn w-full py-3 ${!discordVerified ? "opacity-40 cursor-not-allowed" : ""}`}>
                  {discordVerified ? "Continue to Payment →" : "Join Discord First"}
                </button>
                <button onClick={() => setStep(4)} className="mt-3 text-white/30 text-xs hover:text-white/50 underline">Skip for now (not recommended)</button>
              </motion.div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="text-center">
                <h1 className="font-orbitron text-3xl font-bold mb-2">Complete Payment</h1>
                <p className="text-white/50 mb-10">Secure your spot. Payment is processed via Razorpay.</p>
                <div className="glass-card rounded-2xl p-8 border border-white/08 mb-6 text-left space-y-3">
                  {[["Registration Fee", selectedCategory === "startup" ? "₹5,000" : selectedCategory === "professional" ? "₹1,000" : "₹300"], ["Platform Fee", "₹0"], ["GST (18%)", selectedCategory === "startup" ? "₹900" : selectedCategory === "professional" ? "₹180" : "₹54"], ["Event Access", "Included"], ["Mentor Sessions", "Included"], ["Certificate", "Included"]].map(([k, v]) => (
                    <div key={k as string} className="flex justify-between text-sm border-b border-white/05 pb-2">
                      <span className="text-white/50">{k}</span><span className="text-white font-medium">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mb-4">
                  {["UPI", "Cards", "Net Banking", "Wallets"].map((p) => <span key={p} className="neon-badge flex-1 justify-center text-xs">{p}</span>)}
                </div>
                <button onClick={startPayment} disabled={loading} className="cyber-btn w-full py-3 text-lg">
                  {loading ? "Opening Razorpay..." : "Pay Securely with Razorpay →"}
                </button>
              </motion.div>
            )}

            {/* STEP 5 */}
            {step === 5 && (
              <motion.div key="s5" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                <div className="text-7xl mb-6">🎉</div>
                <h1 className="font-orbitron text-4xl font-bold gradient-text mb-3">You're In!</h1>
                <p className="text-white/60 mb-2">Registration Successful</p>
                <div className="neon-badge mx-auto mb-8 inline-flex text-sm">Team ID: {teamId || "IXH-2026-XXXX"}</div>
                <div className="glass-card rounded-2xl p-6 border border-accent/20 mb-8">
                  {qrUrl ? <img src={qrUrl} alt="QR Ticket" className="mx-auto h-48 w-48 rounded-xl" /> : (
                    <div className="mx-auto w-48 h-48 bg-white/05 rounded-xl flex items-center justify-center text-white/30">QR Ticket Generating...</div>
                  )}
                  <p className="text-white/50 text-sm mt-4">Your QR entry pass. Save it for the event day.</p>
                </div>
                <div className="space-y-3">
                  {["✉️ Confirmation email sent", "📱 Check your Discord for welcome message", "🗓️ Add event to calendar"].map((t) => (
                    <div key={t} className="text-white/60 text-sm">{t}</div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4 justify-center mt-8">
                  <button onClick={() => window.location.href = "/dashboard"} className="cyber-btn px-8 py-3">Go to Dashboard →</button>
                  <button
                    onClick={() => {
                      clearSession();
                      setStep(1);
                      setSelectedCategory(null);
                      setOtpSent(false);
                      setTeamId(null);
                      setQrUrl(null);
                      setDiscordVerified(false);
                      s1.reset();
                      s2.reset();
                    }}
                    className="cyber-btn-outline px-8 py-3"
                  >
                    Register Another Team ↺
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </div>
  );
}
