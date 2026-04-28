import { cn } from "@/lib/utils/cn";
import { Heart, MessageCircle, Repeat } from "lucide-react";

interface CardActionsProps {
  liked: boolean;
  likes: number;
  reposted: boolean;
  onLike: () => void;
  onRepost: () => void;
}

const BASE_BTN = `
  flex items-center gap-1.5 px-2.5 py-1.5 rounded-md
  border-none font-mono text-xs cursor-pointer transition-colors duration-150
`;

export function CardActions({
  liked,
  likes,
  reposted,
  onLike,
  onRepost,
}: CardActionsProps) {
  const stopPropagation = (e: React.MouseEvent) => e.preventDefault();

  return (
    <div className="flex items-center gap-1" onClick={stopPropagation}>
      <button
        onClick={onLike}
        aria-label={liked ? "Bỏ thích" : "Thích"}
        aria-pressed={liked}
        className={cn(
          BASE_BTN,
          liked
            ? "bg-[#E24B4A]/10 text-[#E24B4A]"
            : "bg-transparent text-(--noir-muted) hover:bg-white/[0.04]",
        )}
      >
        <Heart size={14} />
        {likes}
      </button>

      <button
        onClick={stopPropagation}
        aria-label="Bình luận"
        className={cn(
          BASE_BTN,
          "bg-transparent text-(--noir-muted) hover:bg-white/[0.04]",
        )}
      >
        <MessageCircle size={14} />
      </button>

      <button
        onClick={onRepost}
        aria-label={reposted ? "Bỏ repost" : "Repost"}
        aria-pressed={reposted}
        className={cn(
          BASE_BTN,
          reposted
            ? "bg-(--noir-accent)/10 text-(--noir-accent)"
            : "bg-transparent text-(--noir-muted) hover:bg-white/[0.04]",
        )}
      >
        <Repeat size={14} />
      </button>
    </div>
  );
}
