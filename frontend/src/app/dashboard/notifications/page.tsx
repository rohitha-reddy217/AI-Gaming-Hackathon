"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";

export default function NotificationsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/announcements");
      setAnnouncements(res.data.announcements ?? []);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-3xl font-orbitron">Notifications</h1>
        {announcements.map((ann) => (
          <Card key={ann._id}>
            <div className="text-primary font-semibold">{ann.title}</div>
            <p className="text-white/70">{ann.content}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
