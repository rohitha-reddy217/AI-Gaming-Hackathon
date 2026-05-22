import "./globals.css";
import type { Metadata } from "next";
import { Orbitron, Poppins } from "next/font/google";
import { Providers } from "./providers";
import { ChatbotWidget } from "@/components/ChatbotWidget";

const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });
const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-poppins" });

export const metadata: Metadata = {
  title: "IncuXai — India's Ultimate AI Gaming Hackathon | Build. Battle. Innovate & Conquer",
  description: "India's First Large-Scale AI Gaming Innovation Festival. Join 500+ developers, gamers, startups & innovators. ₹30L+ prize pool. Register now!",
  keywords: "AI gaming hackathon India, IncuXai, AI game development, gaming festival, startup hackathon",
  openGraph: {
    title: "IncuXai — India's Ultimate AI Gaming Hackathon",
    description: "Build intelligent games, AI systems & immersive experiences. ₹30L+ prizes.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${poppins.variable}`}>
      <body className="bg-background text-white font-poppins antialiased">
        <Providers>
          {children}
          <ChatbotWidget />
        </Providers>
      </body>
    </html>
  );
}
