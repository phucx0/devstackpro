import { createClient } from "@/lib/supabase/server";
import { UserPublish } from "@/public/lib/types";
import { cache } from "react";
import * as UserRepo from "@/server/users/user.repository"

export const getUser = cache( async(): Promise<UserPublish | null> => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const existing = await UserRepo.getUserById({userId: user.id});
    return existing;
});


/**
 * Lấy thông tin chi tiết của user theo username 
 * @param username 
 * @returns thông tin chi tiết user nếu có, ngược lại trả về null 
 */
export async function getUserByUsername(username: string): Promise<UserPublish | null> {
    if (!username || username.trim() === "") {
        throw new Error("username is required");
    }
    const user = await UserRepo.getUserByUsername(username);
    return user;
}

/**
 * Lấy thông tin chi tiết của user theo user_id 
 * @param userId 
 * @returns thông tin chi tiết user nếu có, ngược lại trả về null 
 */
export async function getUserById(userId: string) {
    if (!userId) throw new Error("userId is required");
    
    return UserRepo.getUserById({userId});
}