"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";

export default function DiscordFeedPage() {
  const [feed, setFeed] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/discord/feed");
      setFeed(res.data.feed ?? []);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-3xl font-orbitron">Discord Feed</h1>
        {feed.map((item) => (
          <Card key={item.id}>
            <div className="text-primary font-semibold">{item.author}</div>
            <p className="text-white/70">{item.content}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
