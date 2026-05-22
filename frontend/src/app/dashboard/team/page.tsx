"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useUserStore } from "@/store/userStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TeamManagementPage() {
  const { token } = useUserStore();
  const [team, setTeam] = useState<any>(null);
  const [memberEmail, setMemberEmail] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      const res = await api.get("/teams/me", { headers: { Authorization: `Bearer ${token}` } });
      setTeam(res.data.team);
    };
    load();
  }, [token]);

  const updateTeam = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || !team) return;
    const form = new FormData(event.currentTarget);
    const payload = {
      teamName: form.get("teamName"),
      projectDetails: {
        title: form.get("title"),
        theme: form.get("theme"),
        techStack: (form.get("techStack") as string).split(",").map((item) => item.trim()),
        description: form.get("description")
      }
    };
    const res = await api.patch(`/teams/${team.teamId}`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setTeam(res.data.team);
  };

  const addMember = async () => {
    if (!token || !team || !memberEmail) return;
    const res = await api.post(
      `/teams/${team.teamId}/members`,
      { email: memberEmail },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTeam(res.data.team);
    setMemberEmail("");
  };

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <h1 className="text-3xl font-orbitron">Team Management</h1>

        {team && (
          <Card>
            <form className="space-y-4" onSubmit={updateTeam}>
              <input name="teamName" defaultValue={team.teamName} className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3" />
              <input name="title" defaultValue={team.projectDetails?.title} className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3" />
              <input name="theme" defaultValue={team.projectDetails?.theme} className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3" />
              <input name="techStack" defaultValue={(team.projectDetails?.techStack || []).join(", ")} className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3" />
              <textarea name="description" defaultValue={team.projectDetails?.description} className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3" />
              <Button type="submit">Update Team</Button>
            </form>
          </Card>
        )}

        <Card>
          <h2 className="text-lg font-semibold">Add Member</h2>
          <div className="mt-3 flex gap-3">
            <input
              value={memberEmail}
              onChange={(event) => setMemberEmail(event.target.value)}
              placeholder="Member email"
              className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3"
            />
            <Button onClick={addMember}>Invite</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
