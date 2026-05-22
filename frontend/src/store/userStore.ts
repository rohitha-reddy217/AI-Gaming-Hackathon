import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setAuthToken } from "@/lib/api";

export type UserProfile = {
  userId: string;
  name: string;
  email: string;
  role: "admin" | "student" | "professional" | "startup" | "sponsor";
  mobile?: string;
  discordId?: string;
  avatar?: string;
};

type UserState = {
  token?: string;
  user?: UserProfile;
  setSession: (token: string, user: UserProfile) => void;
  clearSession: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: undefined,
      user: undefined,
      setSession: (token, user) => {
        setAuthToken(token);
        set({ token, user });
      },
      clearSession: () => {
        setAuthToken(undefined);
        set({ token: undefined, user: undefined });
      }
    }),
    {
      name: "user-store",
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          setAuthToken(state.token);
        }
      }
    }
  )
);
