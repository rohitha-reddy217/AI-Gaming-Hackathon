"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ParticleField } from "@/components/ParticleField";
import { CountdownTimer } from "@/components/CountdownTimer";
import { FloatingActions } from "@/components/FloatingActions";
import { MouseTrail } from "@/components/MouseTrail";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionHeader } from "@/components/SectionHeader";
import { StatCounter } from "@/components/StatCounter";
import { TrackCard } from "@/components/TrackCard";
import { PrizeCard } from "@/components/PrizeCard";
import { TimelineStep } from "@/components/TimelineStep";
import { FAQAccordion } from "@/components/FAQAccordion";
import { JudgeMentorCard } from "@/components/JudgeMentorCard";

const tracks = [
  { icon: "🤖", title: "AI NPC Systems", description: "Build adaptive, intelligent NPCs using reinforcement learning and behavior trees.", color: "cyan" as const },
  { icon: "🌐", title: "Procedural Content Generation", description: "Create dynamic game worlds and assets with AI-driven procedural algorithms.", color: "purple" as const },
  { icon: "🎮", title: "AI for Game Testing & Balancing", description: "Automate QA and balance game economies using machine learning models.", color: "green" as const },
  { icon: "🥽", title: "AR/VR Gaming Experience", description: "Build immersive extended reality experiences enhanced by AI interactions.", color: "pink" as const },
  { icon: "📊", title: "Esports Analytics & AI", description: "Predict gameplay outcomes and player behavior with deep learning insights.", color: "orange" as const },
  { icon: "💚", title: "Serious Games for Social Impact", description: "Design games that address real-world challenges in health, education, and climate.", color: "green" as const },
  { icon: "🌌", title: "Metaverse & Web3 Gaming", description: "Build decentralized gaming experiences, NFT assets, and virtual economies.", color: "purple" as const },
];

const whyParticipate = [
  { icon: "🏆", title: "Win ₹30L+ Prizes", desc: "Cash prizes, goodies, and recognition" },
  { icon: "🌟", title: "National Recognition", desc: "Get featured across major platforms" },
  { icon: "💼", title: "Internship Offers", desc: "Direct placement opportunities" },
  { icon: "🤝", title: "Network & Grow", desc: "Meet startups, investors, mentors" },
  { icon: "🚀", title: "Showcase Innovation", desc: "Demo your AI gaming project" },
  { icon: "📁", title: "Build Portfolio", desc: "Real-world projects for your resume" },
  { icon: "💡", title: "Meet Investors", desc: "Pitch your idea to top VCs" },
  { icon: "🎓", title: "Learn & Upskill", desc: "Workshops and mentorship sessions" },
];

const timeline = [
  { phase: "Registrations Open", date: "May 18, 2026", status: "done" as const },
  { phase: "Hackathon Begins", date: "June 12, 2026", status: "active" as const },
  { phase: "Round 1", date: "June 20, 2026", status: "upcoming" as const },
  { phase: "Round 2", date: "June 27–28, 2026", status: "upcoming" as const },
  { phase: "Final Submission", date: "June 20, 2026", status: "upcoming" as const },
  { phase: "Winner Announcement", date: "June 28, 2026", status: "upcoming" as const },
];

const judges = [
  { name: "Vikram Sharma", role: "Chief AI Officer", company: "NexGen Labs", expertise: "Reinforcement Learning", linkedIn: "#", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=150&h=150&q=80" },
  { name: "Meera Tiwari", role: "Game Director", company: "Phantom Studios", expertise: "Narrative Design & AI", linkedIn: "#", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=150&h=150&q=80" },
  { name: "Dev Malhotra", role: "Founder & CEO", company: "Quantum Gaming", expertise: "Esports & Analytics", linkedIn: "#", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=150&h=150&q=80" },
  { name: "Priya Hooda", role: "VP Engineering", company: "Nova Edge Tech", expertise: "AR/VR Systems", linkedIn: "#", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?fit=crop&w=150&h=150&q=80" },
];

const mentors = [
  { name: "Aisha Raza", role: "AI Researcher", company: "IIT Bombay", expertise: "ML & Deep Learning", linkedIn: "#", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?fit=crop&w=150&h=150&q=80" },
  { name: "Nikhil Patel", role: "Senior Developer", company: "Unity Technologies", expertise: "Game Development", linkedIn: "#", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?fit=crop&w=150&h=150&q=80" },
  { name: "Zara Khan", role: "Product Manager", company: "InMobi Gaming", expertise: "Product Strategy", linkedIn: "#", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?fit=crop&w=150&h=150&q=80" },
  { name: "Ishan Verma", role: "ML Engineer", company: "Razorpay AI", expertise: "NLP & Agents", linkedIn: "#", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?fit=crop&w=150&h=150&q=80" },
  { name: "Neel Agarwal", role: "Startup Mentor", company: "YCombinator Alumni", expertise: "Startup Scaling", linkedIn: "#", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=crop&w=150&h=150&q=80" },
];

const sponsors = [
  { name: "NexGen Labs", tier: "Title" },
  { name: "Phantom Studios", tier: "Gold" },
  { name: "Quantum Gaming", tier: "Gold" },
  { name: "Nova Edge", tier: "Silver" },
  { name: "ByteForge", tier: "Silver" },
  { name: "DevCircle India", tier: "Community" },
];

const faqs = [
  { question: "What is the team size?", answer: "Students: 2–5 members. IT Professionals: 2–3 members. Startups: 2 members per registration." },
  { question: "What are the registration fees?", answer: "Students pay ₹300/person, IT Professionals pay ₹1000/person, and Startups pay ₹5000/company." },
  { question: "Is the hackathon online or offline?", answer: "IncuXai is hybrid! Qualifying rounds are fully online, and the finale is conducted on-site. Venue details shared with participants." },
  { question: "What is the refund policy?", answer: "Full refunds are available up to 7 days before the event. After that, fees are non-refundable. Email hello@incuxai.com for requests." },
  { question: "Who is eligible to participate?", answer: "Students, IT Professionals, and Startups from across India. No age restriction. Open to all skill levels!" },
  { question: "Will I receive a certificate?", answer: "Yes! All participants get digital certificates. Winners receive special achievement certificates and trophies." },
  { question: "What tech stack can we use?", answer: "Any tech stack is allowed. AI/ML frameworks (TensorFlow, PyTorch), game engines (Unity, Unreal, Godot), and web technologies." },
  { question: "How are projects judged?", answer: "Innovation (30%), Technical Implementation (30%), AI/Gaming Integration (25%), and Presentation Quality (15%)." },
];

const prizes = [
  { rank: "1st Place", title: "Champion", amount: "₹15,00,000", icon: "🥇", featured: true, perks: ["Cash Prize ₹15L", "Startup Incubation Access", "Media Feature", "Trophy & Certificate", "Investor Introductions"] },
  { rank: "2nd Place", title: "Runner Up", amount: "₹10,00,000", icon: "🥈", featured: false, perks: ["Cash Prize ₹10L", "Internship Offers", "Premium Swag Kit", "Certificate", "Mentor Connections"] },
  { rank: "3rd Place", title: "Community Choice", amount: "₹5,00,000", icon: "🥉", featured: false, perks: ["Cash Prize ₹5L", "Sponsor Goodies", "Digital Certificate", "Community Spotlight", "Alumni Network"] },
];

const tierColor: Record<string, string> = {
  Title: "text-yellow-300 border-yellow-300/30",
  Gold: "text-amber-400 border-amber-400/30",
  Silver: "text-slate-300 border-slate-300/30",
  Community: "text-secondary border-secondary/30",
};

export default function HomePage() {
  return (
    <div className="relative overflow-hidden bg-background">
      <MouseTrail />
      <Navbar />
      <FloatingActions />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 hero-grid opacity-60" />
        <div className="absolute inset-0 bg-hero-gradient" />
        <ParticleField />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="mb-5">
              <span className="neon-badge">🔥 India's #1 AI Gaming Event 2026</span>
            </div>
            <h1 className="font-orbitron text-5xl md:text-7xl font-black leading-tight mb-4">
              India's Ultimate<br />
              <span className="gradient-text neon-flicker">AI Gaming</span><br />
              Hackathon
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mb-3 font-light leading-relaxed">
              Build intelligent games, AI systems & immersive experiences with developers, gamers, startups & innovators.
            </p>
            <p className="font-orbitron text-primary text-sm tracking-widest mb-10 glow-text">
              BUILD · BATTLE · INNOVATE & CONQUER
            </p>
            <div className="flex flex-wrap gap-4 mb-14">
              <Link href="/register"><button className="cyber-btn text-base px-8 py-3">🚀 Register Now</button></Link>
              <a href="https://discord.com" target="_blank" rel="noreferrer"><button className="cyber-btn-outline text-base px-8 py-3">💬 Join Discord</button></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer"><button className="cyber-btn-outline text-base px-8 py-3">📸 Instagram</button></a>
            </div>
            <CountdownTimer />
          </motion.div>
        </div>

        {/* Live ticker */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/06 bg-black/30 backdrop-blur-sm py-2 ticker-wrap overflow-hidden">
          <div className="ticker-content text-xs text-white/40 font-medium">
            {Array(4).fill(null).map((_, i) => (
              <span key={i} className="flex items-center gap-8">
                <span>🔥 24 Teams Registered Today</span>
                <span>•</span>
                <span>🏆 ₹30L+ Prize Pool</span>
                <span>•</span>
                <span>🌍 120+ Cities Participating</span>
                <span>•</span>
                <span>🎮 India's First AI Gaming Festival</span>
                <span>•</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE STATS */}
      <section className="section-padding" id="stats">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader badge="Live Stats" title="Event at a" highlight="Glance" centered />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <StatCounter value={30} prefix="₹" suffix="L+" label="Prize Pool" color="cyan" icon={<span>🏆</span>} />
            <StatCounter value={120} suffix="+" label="Cities Participating" color="purple" icon={<span>🌍</span>} />
            <StatCounter value={45} suffix="+" label="Mentors & Judges" color="green" icon={<span>🧠</span>} />
            <StatCounter value={8} suffix="+" label="Sponsors Onboard" color="pink" icon={<span>🤝</span>} />
          </div>
          <div className="mt-4 text-center">
            <span className="neon-badge">🔴 Only 100 Team Slots Remaining!</span>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section-padding" id="about">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <SectionHeader badge="About" title="What is" highlight="IncuXai?" subtitle="India's First Large-Scale AI Gaming Innovation Festival combining AI Hackathon, Gaming Festival, Startup Networking, Developer Community & Sponsor Ecosystem." />
              <div className="space-y-4">
                {[
                  { icon: "⚡", title: "Innovation First", desc: "Push the boundaries of what's possible with AI in gaming" },
                  { icon: "🌐", title: "Community Driven", desc: "5000+ developers, gamers, and startup founders" },
                  { icon: "🚀", title: "Launch Ready", desc: "Incubation support and investor access for top teams" },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 glass-card rounded-xl p-4 border border-white/06">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="font-semibold text-white text-sm">{item.title}</div>
                      <div className="text-white/50 text-xs mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-card rounded-2xl p-8 border border-primary/15 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
              <div className="font-orbitron text-5xl font-black gradient-text mb-2">2026</div>
              <div className="text-white/60 text-sm mb-6">India's Premier AI Gaming Event</div>
              <div className="space-y-3">
                {[["Format", "Hybrid (Online + On-site)"], ["Duration", "6 Weeks"], ["Location", "Pan-India"], ["Tracks", "7 Innovation Themes"], ["Participants", "500+ Registered"], ["Date", "June 12 – June 28"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm border-b border-white/05 pb-2">
                    <span className="text-white/40">{k}</span>
                    <span className="text-white font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TRACKS */}
      <section className="section-padding" id="tracks">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader badge="Innovation Areas" title="Hackathon" highlight="Tracks" subtitle="7 cutting-edge challenge areas at the intersection of AI and gaming. Choose your battlefield." centered />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {tracks.map((t, i) => <TrackCard key={t.title} {...t} index={i} />)}
          </div>
        </div>
      </section>

      {/* WHY PARTICIPATE */}
      <section className="section-padding" id="why">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader badge="Benefits" title="Why" highlight="Participate?" centered />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {whyParticipate.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="glass-card-hover rounded-2xl p-5 border border-white/08 text-center cursor-pointer">
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="font-semibold text-white text-sm mb-1">{item.title}</div>
                <div className="text-white/45 text-xs">{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRIZES */}
      <section className="section-padding" id="prizes">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader badge="Rewards" title="Prize" highlight="Pool" subtitle="Total pool worth ₹30 Lakhs+ in cash prizes, internships, incubation, and sponsor goodies." centered />
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {prizes.map((p, i) => <PrizeCard key={p.rank} {...p} />)}
          </div>
          <div className="glass-card rounded-2xl p-6 border border-white/08">
            <div className="text-center text-white/50 text-sm mb-4 font-semibold uppercase tracking-widest">Additional Rewards</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[["🎓", "Certificates", "All Participants"], ["💼", "Internships", "Top 10 Teams"], ["🚀", "Incubation", "Top 3 Teams"], ["🎁", "Sponsor Goodies", "Select Teams"]].map(([icon, title, sub]) => (
                <div key={title as string} className="p-4">
                  <div className="text-2xl mb-1">{icon}</div>
                  <div className="text-white text-sm font-semibold">{title}</div>
                  <div className="text-white/40 text-xs">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="section-padding" id="timeline">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader badge="Schedule" title="Event" highlight="Timeline" centered />
          <div className="relative max-w-3xl mx-auto">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-secondary/50 to-transparent -translate-x-1/2" />
            {timeline.map((t, i) => <TimelineStep key={t.phase} {...t} index={i} isLast={i === timeline.length - 1} />)}
          </div>
        </div>
      </section>

      {/* JUDGES */}
      <section className="section-padding" id="judges">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader badge="Judges" title="Meet the" highlight="Jury" centered />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-16">
            {judges.map((j, i) => <JudgeMentorCard key={j.name} {...j} index={i} />)}
          </div>
          <SectionHeader badge="Mentors" title="Your" highlight="Mentors" centered />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            {mentors.map((m, i) => <JudgeMentorCard key={m.name} {...m} index={i} />)}
          </div>
        </div>
      </section>


      {/* GALLERY */}
      <section className="section-padding" id="gallery">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader badge="Gallery" title="Event" highlight="Highlights" centered />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "Main Arena", color: "from-primary/20 to-secondary/20", icon: "🎮" },
              { label: "Prototype Lab", color: "from-secondary/20 to-neon-pink/20", icon: "🔬" },
              { label: "Finale Stage", color: "from-accent/20 to-primary/20", icon: "🏆" },
              { label: "Mentorship Zone", color: "from-neon-orange/20 to-neon-pink/20", icon: "🧠" },
              { label: "Sponsor Expo", color: "from-primary/20 to-accent/20", icon: "🤝" },
              { label: "Gaming Lounge", color: "from-secondary/20 to-primary/20", icon: "🎯" },
            ].map((g) => (
              <div key={g.label} className={`h-44 rounded-2xl bg-gradient-to-br ${g.color} border border-white/08 flex flex-col items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] transition-transform duration-300 group relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{g.icon}</span>
                <span className="text-white/60 text-sm font-medium">{g.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding" id="faq">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeader badge="FAQ" title="Frequently Asked" highlight="Questions" centered />
          <FAQAccordion items={faqs} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
