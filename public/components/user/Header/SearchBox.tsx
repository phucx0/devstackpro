"use client";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  onSearch?: () => void; // optional callback after search (e.g. close drawer)
  fullWidth?: boolean;
}

export function SearchBox({ onSearch, fullWidth }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/search/${query.trim()}`);
    setQuery("");
    onSearch?.();
  };

  return (
    <div
      className={`noir-search-box ${fullWidth ? "w-full" : "noir-search-wrap"}`}
    >
      <Search size={14} className="text-(--noir-muted) shrink-0" />
      <input
        type="text"
        placeholder="Search articles..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        style={fullWidth ? { width: "100%" } : undefined}
      />
    </div>
  );
}
