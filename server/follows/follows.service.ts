import { createClient } from "@/lib/supabase/server";

// Follow user
export async function followUser(followingId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");
  if (!followingId) throw new Error("Missing followingId");

  const { error } = await supabase.from("follows").insert({
    follower_id: user.id,
    following_id: followingId,
  });

  if (error) throw error;
}

// Unfollow user
export async function unfollowUser(followingId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");
  if (!followingId) throw new Error("Missing followingId");

  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", user.id)
    .eq("following_id", followingId);

  if (error) throw error;
}

// Check is following
export async function isFollowing(followingId: string): Promise<boolean> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data, error } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", user.id)
    .eq("following_id", followingId)
    .maybeSingle();

  if (error) throw error;

  return !!data;
}

// Get follower count
export async function getFollowerCount(userId: string): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("following_id", userId);

  if (error) throw error;

  return count ?? 0;
}

// Get following count
export async function getFollowingCount(userId: string): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", userId);

  if (error) throw error;

  return count ?? 0;
}

export async function getUserFollowCounts(userId: string): Promise<{ followerCount: number; followingCount: number }> {
    const supabase = await createClient();

    const [followerResult, followingResult] = await Promise.all([
        supabase
            .from("follows")
            .select("*", { count: "exact", head: true })
            .eq("following_id", userId),
        supabase
            .from("follows")
            .select("*", { count: "exact", head: true })
            .eq("follower_id", userId),
    ]);

    if (followerResult.error) throw followerResult.error;
    if (followingResult.error) throw followingResult.error;

    return {
        followerCount: followerResult.count ?? 0,
        followingCount: followingResult.count ?? 0,
    };
}