"use client";

import { createClient } from "@/lib/supabase/client";
import { createContext, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { UserPublish } from "../lib/types";

interface AuthContextType {
  profile: UserPublish | null;
  setProfile: (data: UserPublish | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  profile: null,
  setProfile: () => {},
  logout: async () => {},
});

export function AuthProvider({
  children,
  initialProfile,
}: {
  children: React.ReactNode;
  initialProfile: UserPublish | null;
}) {
  const [profile, setProfile] = useState(initialProfile);
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const logout = async () => {
    await supabase.auth.signOut(); // đúng
    setProfile(null);
    router.push("/sign-in");
    router.refresh();
  };

  return (
    <AuthContext.Provider value={{ profile, setProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
