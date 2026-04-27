import { createClient } from "@/lib/supabase/server";
import {
  insertFollow,
  deleteFollow,
  findFollow,
  countFollowers,
  countFollowing,
  countFollowStats,
} from "./follows.repository";

async function getAuthUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function followUser(followingId: string) {
  const user = await getAuthUser();
  if (!user) throw new Error("Unauthorized");
  if (!followingId) throw new Error("Missing followingId");
  await insertFollow(user.id, followingId);
}

export async function unfollowUser(followingId: string) {
  const user = await getAuthUser();
  if (!user) throw new Error("Unauthorized");
  if (!followingId) throw new Error("Missing followingId");
  await deleteFollow(user.id, followingId);
}

export async function isFollowing(followingId: string): Promise<boolean> {
  const user = await getAuthUser();
  if (!user) return false;
  return findFollow(user.id, followingId);
}

export async function getFollowerCount(userId: string): Promise<number> {
  return countFollowers(userId);
}

export async function getFollowingCount(userId: string): Promise<number> {
  return countFollowing(userId);
}

export async function getUserFollowCounts(userId: string) {
  return countFollowStats(userId);
}