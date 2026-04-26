"use client";

import { createClient } from "@/lib/supabase/client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { UserPublish } from "../lib/types";

interface AuthContextType {
  profile: UserPublish | null;
  setProfile: (data: UserPublish | null) => void;
  isAuthLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  profile: null,
  setProfile: () => {},
  isAuthLoading: true,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserPublish | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const router = useRouter();

  const supabase = useMemo(() => createClient(), []);

  const fetchProfile = useCallback(
    async (userId: string): Promise<UserPublish | null> => {
      const { data } = await supabase
        .from("users")
        .select(
          "id, username, display_name, avatar_url, created_at, email, bio, updated_at",
        )
        .eq("id", userId)
        .maybeSingle();
      return data ?? null;
    },
    [supabase],
  );

  useEffect(() => {
    let cancelled = false;
    console.log("run v1");
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (cancelled) return;

      if (session?.user) {
        try {
          const profile = await fetchProfile(session.user.id);
          if (!cancelled) setProfile(profile);
        } catch {
          if (!cancelled) setProfile(null);
        }
      }
      console.log("Init");
      if (!cancelled) setIsAuthLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("run v2");
        if (cancelled) return;
        if (event === "SIGNED_OUT" || !session?.user) {
          setProfile(null);
          setIsAuthLoading(false);
          return;
        }

        console.log("run v3");

        try {
          const profile = await fetchProfile(session.user.id);
          if (!cancelled) setProfile(profile);
        } catch (err) {
          console.error("Failed to fetch profile:", err);
          if (!cancelled) setProfile(null);
        } finally {
          if (!cancelled) setIsAuthLoading(false);
        }
      },
    );

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  const logout = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    router.push("/sign-in");
    router.refresh();
  };

  return (
    <AuthContext.Provider
      value={{ profile, setProfile, isAuthLoading, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
