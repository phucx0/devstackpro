import { createClient } from "@/lib/supabase/client";
import { Contact } from "@/public/lib/types";

export async function getAllContact() : Promise<Contact[]> {
    const supabase = await createClient();
    const {data, error} = await supabase
        .from("contact_requests")
        .select("*")
    if(error) throw new Error(error.message);
    return data as Contact[] 
}

export async function getContactById(id: number) : Promise<Contact> {
    const supabase = await createClient();
    const {data, error} = await supabase
        .from("contact_requests")
        .select("*")
        .eq("id", id)
        .single()
    if(error) throw new Error(error.message);
    return data as Contact 
}