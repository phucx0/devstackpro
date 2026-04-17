import { createClient } from "@/lib/supabase/client";
import { Message } from "@/public/lib/types";

export async function getAllMessages(): Promise<Message[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("messages")
        .select("*")
        .is("deleted_at", null);

    if (error) throw error;

    return data as Message[];
}

export async function getMessageById(id: number): Promise<Message | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("id", id)
        .is("deleted_at", null)
        .maybeSingle();

    if (error) throw error;

    return data as Message | null;
}

export async function deleteMessage(id: number): Promise<boolean> {
    const supabase = await createClient();

    const { error } = await supabase
        .from("messages")
        .update({
            deleted_at: new Date().toISOString(),
        })
        .eq("id", id);

    if (error) throw error;

    return true;
}

export async function searchMessages(keyword: string): Promise<Message[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
        `Messagename.ilike.%${keyword}%,email.ilike.%${keyword}%,display_name.ilike.%${keyword}%`
        )
        .is("deleted_at", null);

    if (error) throw error;

    return data as Message[];
}

// export async function sendMessage(params: {
//     receiver_id: string;
//     content: string;
// }) {
//     const supabase = await createClient();

//     const { receiver_id, content } = params;

//     const { data, error } = await supabase
//         .from("messages")
//         .insert({
//             user_id: receiver_id,
//             content,
//         })
//         .select()
//         .maybeSingle();

//     if (error) throw error;

//     return data as Message | null;
// }