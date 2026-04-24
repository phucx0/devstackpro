"use server";
import {
  followUser,
  unfollowUser,
  isFollowing,
  getFollowerCount,
  getFollowingCount,
} from "./follows.service";

// Follow
export async function followAction(followingId: string) {
  return await followUser(followingId);
}

// Unfollow
export async function unfollowAction(followingId: string) {
  return await unfollowUser(followingId);
}

// Toggle follow
export async function toggleFollowAction(followingId: string) {
  const isFollow = await isFollowing(followingId);
  
  if (isFollow) {
    await unfollowUser(followingId);
    return false;
  } else {
    await followUser(followingId);
    return true;
  }
}

// Check follow status
export async function isFollowingAction(followingId: string) {
  return await isFollowing(followingId);
}

// Counts
export async function getFollowerCountAction(userId: string) {
  return await getFollowerCount(userId);
}

export async function getFollowingCountAction(userId: string) {
  return await getFollowingCount(userId);
}