"use client";
import { Pencil } from "lucide-react";
import { useAuth } from "@/public/providers/AuthProvider";
import { useRouter } from "next/navigation";

export function WritePromptCard() {
  const { profile } = useAuth();
  const router = useRouter();

  const handleRoute = () => {
    if (profile) router.push(`${profile.username}/articles/new`);
    else router.push(`/sign-in?callbackUrl=/articles/new`);
  };

  return (
    <div
      onClick={handleRoute}
      className="group flex items-center justify-between
        border border-dashed border-(--noir-border) bg-(--noir-card)
        rounded-lg px-6 py-[22px] transition-colors duration-200 cursor-pointer"
    >
      <div className="flex items-center gap-3.5">
        <div
          className="w-10 h-10 rounded-full border border-dashed border-(--noir-border)
          flex items-center justify-center text-(--noir-muted) transition-colors duration-200"
        >
          <Pencil size={15} />
        </div>
        <div>
          <p className="font-mono text-[13px] font-semibold text-(--noir-white) tracking-wide">
            {profile ? "Write a new article" : "Share your knowledge"}
          </p>
          <p className="font-mono text-[10px] text-(--noir-muted) tracking-wider">
            {profile
              ? "Share your knowledge with the community"
              : "Join Devstack and start writing today"}
          </p>
        </div>
      </div>

      <span
        className="text-sm font-medium border border-(--noir-border)
        bg-(--noir-accent) text-(--noir-black) px-3.5 py-2 rounded-md transition-all duration-200"
      >
        {profile ? "Get started" : "Sign in"}
      </span>
    </div>
  );
}
