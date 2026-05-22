"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { initCsrf } from "@/lib/api";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initCsrf();
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}
