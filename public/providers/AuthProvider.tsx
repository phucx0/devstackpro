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
}: {
  children: React.ReactNode;
}) {
  const [profile, setProfile] = useState<UserPublish | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      console.log("Loading profle");
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        setProfile(data ?? null);
      } else {
        setProfile(null);
      }

      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log("Loading profle v2");

        if (_event === "SIGNED_OUT") {
          setProfile(null);
          return;
        }

        const user = session?.user;
        if (!user) return;

        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        setProfile(data ?? null);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

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
