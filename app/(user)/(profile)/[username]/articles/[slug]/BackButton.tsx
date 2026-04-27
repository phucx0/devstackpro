"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  fallbackHref?: string;
  label?: string;
}

export default function BackButton({
  fallbackHref = "/",
  label = "Back",
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    // Nếu có history thì back, không thì fallback về href
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <button
      onClick={handleBack}
      className="noir-read-btn-ghost cursor-pointer"
      style={{ display: "inline-flex", width: "fit-content" }}
    >
      <ArrowLeft size={13} />
      {label}
    </button>
  );
}
