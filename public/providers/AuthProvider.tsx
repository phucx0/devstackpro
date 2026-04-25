"use client";

import { createClient } from "@/lib/supabase/client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { UserPublish } from "../lib/types";

interface AuthContextType {
  profile: UserPublish | null;
  setProfile: (data: UserPublish | null) => void;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  profile: null,
  setProfile: () => {},
  loading: true,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserPublish | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const supabase = useMemo(() => createClient(), []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("users")
      .select(
        "id, username, display_name, avatar_url, created_at, email, bio, updated_at",
      )
      .eq("id", userId)
      .maybeSingle();
    return data ?? null;
  };

  useEffect(() => {
    const initSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setProfile(profile);
      }
      setLoading(false);
    };

    initSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT" || !session?.user) {
          setProfile(null);
          setLoading(false);
          return;
        }

        const profile = await fetchProfile(session.user.id);
        setProfile(profile);
        setLoading(false);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    router.push("/sign-in");
    router.refresh();
  };

  return (
    <AuthContext.Provider value={{ profile, setProfile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
