import { cn } from "@/lib/utils/cn";
import { Heart, MessageCircle, Repeat } from "lucide-react";
import { useRouter } from "next/navigation";

interface CardActionsProps {
  liked: boolean;
  likes: number;
  reposted: boolean;
  onLike: () => void;
  onRepost: () => void;
  username: string;
  slug: string;
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
  username,
  slug,
}: CardActionsProps) {
  const stopPropagation = (e: React.MouseEvent) => e.preventDefault();
  const router = useRouter();

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
        <Heart
          size={16}
          fill={liked ? "red" : "currentColor"}
          strokeWidth={0}
        />
        {likes}
      </button>

      <button
        onClick={(e) => {
          stopPropagation(e);
          router.push(`/${username}/articles/${slug}#comment-section`);
        }}
        aria-label="Bình luận"
        className={cn(
          BASE_BTN,
          "bg-transparent text-(--noir-muted) hover:bg-white/[0.04]",
        )}
      >
        <MessageCircle size={16} />
      </button>

      {/* <button
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
        <Repeat size={16} />
      </button> */}
    </div>
  );
}
