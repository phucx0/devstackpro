"use client";

import { createClient } from "@/lib/supabase/client";
import { createContext, useContext, useEffect, useState } from "react";
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

export function AuthProvider({
  children,
  initialProfile,
}: {
  children: React.ReactNode;
  initialProfile: UserPublish | null;
}) {
  const [profile, setProfile] = useState<UserPublish | null>(initialProfile);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    if (initialProfile) {
      setLoading(false);
      return;
    }
    console.log("Loading Profile");
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (_event === "SIGNED_OUT") {
          setProfile(null);
          return;
        }

        if (_event === "SIGNED_IN" || _event === "TOKEN_REFRESHED" || _event === "USER_UPDATED") {
          const user = session?.user;
          if (!user) return;

          const { data } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            .maybeSingle();

          setProfile(data ?? null);
        }
      },
    );

    return () => listener.subscription.unsubscribe();
  }, [initialProfile]);

  const logout = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    router.push("/auth/sign-in");
    router.refresh();
  };

  return (
    <AuthContext.Provider value={{ profile, setProfile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
