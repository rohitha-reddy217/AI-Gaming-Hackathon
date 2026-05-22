"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { useUserStore } from "@/store/userStore";

const FAQ_RESPONSES: Record<string, string> = {
  fee: "Registration fees: Students ₹300/person, IT Professionals ₹1000/person, Startups ₹5000/company. All fees include access to mentorship, workshops, and event resources.",
  "team size": "Teams can be 2–5 members for Students, 2–3 for IT Professionals, and 2 members for Startup registrations.",
  refund: "Refunds are available up to 7 days before the event. After that, registrations are non-refundable. Contact hello@incuxai.com for refund requests.",
  "online": "IncuXai is a hybrid event! Qualifying rounds are online, and the finale is on-site. Exact venue details will be shared with registered participants.",
  "offline": "IncuXai is a hybrid event! Qualifying rounds are online, and the finale is on-site. Exact venue details will be shared with registered participants.",
  eligibility: "Anyone can participate — students, IT professionals, and startups from across India! There is no age restriction.",
  certificate: "Yes! All participants receive digital participation certificates. Winners and runners-up receive special achievement certificates.",
  "submission": "Submissions include a PPT, GitHub link, demo video, and optionally an APK/game build. Upload them via your participant dashboard before the deadline.",
  "discord": "Join our official Discord server by clicking the 'Join Discord' button in the registration flow. Discord verification is mandatory to unlock private channels.",
  "judging": "Projects are judged on Innovation (30%), Technical Implementation (30%), Gaming/AI Integration (25%), and Presentation (15%).",
  "prize": "Total prize pool worth ₹30 Lakhs! Champion team wins ₹15L, Runner Up wins ₹10L, Community Choice wins ₹5L. Plus internships, incubation, goodies, and certificates!",
  "schedule": "Key dates: Registrations Open May 18 → Hackathon Begins June 12 → Round 1 June 20 → Round 2 June 27-28 → Final Submission June 20 → Winner Announcement June 28.",
};

const SUGGESTIONS = [
  "What are the registration fees?",
  "How big can my team be?",
  "Is it online or offline?",
  "What prizes can I win?",
  "When is the event schedule?",
];

function getAutoResponse(msg: string): string | null {
  const lower = msg.toLowerCase();
  for (const [key, response] of Object.entries(FAQ_RESPONSES)) {
    if (lower.includes(key)) return response;
  }
  return null;
}

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "👋 Hi! I'm the IncuXai AI assistant. Ask me anything about registration, fees, schedule, prizes, or Discord!" },
  ]);
  const [loading, setLoading] = useState(false);
  const { token } = useUserStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const msg = text ?? input;
    if (!msg.trim()) return;

    const newMessages = [...messages, { role: "user" as const, content: msg }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    // Try auto-response first
    const auto = getAutoResponse(msg);
    if (auto) {
      await new Promise((r) => setTimeout(r, 700));
      setMessages([...newMessages, { role: "assistant", content: auto }]);
      setLoading(false);
      return;
    }

    // Fall back to API if token available
    try {
      if (token) {
        const res = await api.post(
          "/chatbot",
          { message: msg, history: newMessages },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages([...newMessages, { role: "assistant", content: res.data.response }]);
      } else {
        await new Promise((r) => setTimeout(r, 600));
        setMessages([...newMessages, {
          role: "assistant",
          content: "I don't have a specific answer for that. Please email us at hello@incuxai.com or join our Discord community for help! 🚀",
        }]);
      }
    } catch {
      setMessages([...newMessages, {
        role: "assistant",
        content: "Oops! Something went wrong. Please try again or contact hello@incuxai.com.",
      }]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Toggle Button */}
      <div className="fixed bottom-6 left-5 z-50">
        <button
          id="chatbot-toggle"
          onClick={() => setOpen(!open)}
          className="relative w-12 h-12 rounded-2xl cyber-btn !p-0 !rounded-2xl group overflow-hidden"
          aria-label="Toggle AI chatbot"
        >
          <span className="absolute inset-0 flex items-center justify-center text-xl">
            {open ? "✕" : "🤖"}
          </span>
          {!open && (
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-neon-pink border-2 border-background animate-pulse" />
          )}
        </button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed bottom-24 left-5 z-50 w-80 md:w-96 rounded-2xl overflow-hidden border border-white/10"
            style={{ background: "rgba(5,10,24,0.95)", backdropFilter: "blur(20px)" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/08 bg-gradient-to-r from-primary/10 to-secondary/10">
              <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-sm">🤖</div>
              <div>
                <div className="font-orbitron text-sm font-semibold text-white">IncuXai AI</div>
                <div className="text-xs text-accent flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block animate-pulse" />
                  Online 24/7
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, idx) => (
                <div key={idx} className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div className={msg.role === "user" ? "chat-bubble-user text-sm text-white/90" : "chat-bubble-bot text-sm text-white/80"}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="chat-bubble-bot flex items-center gap-1 px-4 py-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-typing1" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-typing2" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-typing3" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {SUGGESTIONS.slice(0, 3).map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-xs px-2.5 py-1.5 rounded-full border border-primary/25 text-primary/80 hover:bg-primary/10 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="border-t border-white/08 p-3 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask anything..."
                className="flex-1 cyber-input text-sm py-2"
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading}
                className="cyber-btn !px-3 !py-2 text-sm flex-shrink-0"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
