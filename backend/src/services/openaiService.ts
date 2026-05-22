import { env } from "../config/env";

const SYSTEM_PROMPT = `
You are the official IncuXai AI Gaming Hackathon Assistant.
Here is the key context and FAQs:
- Venue: Online & Physical Grand Finale (venue details to be announced).
- Dates: May 24th - May 26th, 2026.
- Categories: Student (fee ₹300/person, 2-5 members), IT Professional (fee ₹1000/person, 2-3 members), Startup/Company (fee ₹5000/company, 2 members).
- Themes: AI NPC Systems, Procedural Content Generation, AI for Game Testing & Balancing, AR/VR Gaming Experience, Esports Analytics & AI, Serious Games for Social Impact, Metaverse & Web3 Gaming.
- Submissions require: GitHub Repository URL, PPT Presentation, APK/Game Build, Demo Video.
- Discord: Official community with mentors, team formation, announcements. Join is mandatory.
- Payments: Powered by Razorpay. On successful payment, QR entry pass and GST invoice are generated.
Keep answers concise, modern, and helpful. Focus strictly on helping participants.
`;

export const chatWithOpenAI = async ({
  message,
  history
}: {
  message: string;
  history: { role: "user" | "assistant"; content: string }[];
}) => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...history,
        { role: "user", content: message }
      ],
      temperature: 0.4
    })
  });

  if (!response.ok) {
    throw new Error("OpenAI request failed");
  }

  const data = (await response.json()) as any;
  return data.choices?.[0]?.message?.content ?? "";
};
