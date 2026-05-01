"use client";
import { handleError } from "@/lib/utils/handleError";
import {
  isFollowingAction,
  toggleFollowAction,
} from "@/server/follows/follows.action";
import { CircleCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  userId: string;
};

export default function FollowButton({ userId }: Props) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  // load initial follow state
  useEffect(() => {
    const fetchFollow = async () => {
      try {
        const result = await isFollowingAction(userId);
        setIsFollowing(result);
      } catch (err) {
        console.error(err);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchFollow();
  }, [userId]);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);

    // optimistic UI (mượt hơn)
    setIsFollowing((prev) => !prev);

    try {
      const result = await toggleFollowAction(userId);
      setIsFollowing(result);
    } catch (error) {
      const message = handleError(error);
      // rollback nếu lỗi
      setIsFollowing((prev) => !prev);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <button
        disabled
        className="w-full text-[12px] bg-(--noir-accent) text-(--noir-black) px-4 py-2 rounded"
      >
        ...
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`w-full text-[12px] px-4 py-2 rounded flex items-center justify-center gap-2 transition cursor-pointer hover:bg-(--noir-accent-dim) ${
        isFollowing
          ? "bg-(--noir-accent) text-(--noir-black)"
          : "bg-(--noir-accent) text-(--noir-black)"
      }`}
    >
      {loading ? (
        "..."
      ) : isFollowing ? (
        <div className="flex items-center justify-center gap-2">
          <CircleCheck size={14} />
          <span>Following</span>
        </div>
      ) : (
        "Follow"
      )}
    </button>
  );
}
