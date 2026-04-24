"use client";

import {
  getFollowerCountAction,
  getFollowingCountAction,
} from "@/server/follows/follows.action";
import { useEffect, useState } from "react";

export function useFollowStats(userId: string) {
  const [followerCount, setFollowerCount] = useState<number | null>(null);
  const [followingCount, setFollowingCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);

        const [follower, following] = await Promise.all([
          getFollowerCountAction(userId),
          getFollowingCountAction(userId),
        ]);

        if (!mounted) return;

        setFollowerCount(follower);
        setFollowingCount(following);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [userId]);

  return { followerCount, followingCount, loading };
}