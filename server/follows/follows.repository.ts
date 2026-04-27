import { createClient } from "@/lib/supabase/server";

export async function insertFollow(followerId: string, followingId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("follows").insert({
    follower_id: followerId,
    following_id: followingId,
  });
  if (error) throw error;
}

export async function deleteFollow(followerId: string, followingId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", followerId)
    .eq("following_id", followingId);
  if (error) throw error;
}

export async function findFollow(
  followerId: string,
  followingId: string,
): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", followerId)
    .eq("following_id", followingId)
    .maybeSingle();
  if (error) throw error;
  return !!data;
}

export async function countFollowers(userId: string): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("following_id", userId);
  if (error) throw error;
  return count ?? 0;
}

export async function countFollowing(userId: string): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", userId);
  if (error) throw error;
  return count ?? 0;
}

export async function countFollowStats(
  userId: string,
): Promise<{ followerCount: number; followingCount: number }> {
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