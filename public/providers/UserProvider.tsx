"use client";
import { createClient } from "@/lib/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { UserPublish } from "../lib/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthContextType {
  user: SupabaseUser | null; // Supabase Auth user
  profile: UserPublish | null; // DB user (bảng "users")
  loading: boolean;
  logout: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  logout: async () => {},
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null); // Supabase Auth
  const [profile, setProfile] = useState<UserPublish | null>(null); // DB profile
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    setProfile(data ?? null);
  };

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      const authUser = data.user ?? null;

      setUser(authUser); // SupabaseUser
      if (authUser) {
        await fetchProfile(authUser.id);
      }

      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const authUser = session?.user ?? null;
        setUser(authUser);

        if (authUser) {
          await fetchProfile(authUser.id);
        } else {
          setProfile(null);
        }
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    window.location.href = "/auth/sign-in";
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAuth = () => useContext(AuthContext);
