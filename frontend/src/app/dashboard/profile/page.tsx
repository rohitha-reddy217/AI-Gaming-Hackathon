"use client";

import { useState } from "react";
import { useUserStore } from "@/store/userStore";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { token, user, setSession } = useUserStore();
  const [name, setName] = useState(user?.name ?? "");
  const [mobile, setMobile] = useState(user?.mobile ?? "");
  const [avatar, setAvatar] = useState(user?.avatar ?? "");

  const save = async () => {
    if (!token) return;
    const res = await api.patch(
      "/users/me",
      { name, mobile, avatar },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setSession(token, res.data.user);
  };

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-orbitron">Profile Settings</h1>
        <Card className="space-y-4">
          <input value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3" />
          <input value={mobile} onChange={(event) => setMobile(event.target.value)} className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3" />
          <input value={avatar} onChange={(event) => setAvatar(event.target.value)} placeholder="Avatar URL" className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3" />
          <Button onClick={save}>Save</Button>
        </Card>
      </div>
    </div>
  );
}
