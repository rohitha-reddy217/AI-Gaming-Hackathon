"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { useUserStore } from "@/store/userStore";

function DiscordCallbackContent() {
  const params = useSearchParams();
  const code = params.get("code");
  const { token } = useUserStore();
  const [status, setStatus] = useState("Verifying Discord...");

  useEffect(() => {
    const verify = async () => {
      if (!code || !token) {
        setStatus("Missing code or session");
        return;
      }
      await api.post(
        "/discord/verify",
        { code },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus("Discord verified successfully. Redirecting you back to registration...");
      setTimeout(() => {
        window.location.href = "/register";
      }, 1500);
    };

    verify().catch(() => setStatus("Discord verification failed"));
  }, [code, token]);

  return (
    <div className="mx-auto max-w-xl glass-card p-6 text-center">{status}</div>
  );
}

export default function DiscordCallbackPage() {
  return (
    <div className="min-h-screen bg-background px-6 py-20 text-white">
      <Suspense fallback={<div className="mx-auto max-w-xl glass-card p-6 text-center">Loading...</div>}>
        <DiscordCallbackContent />
      </Suspense>
    </div>
  );
}
