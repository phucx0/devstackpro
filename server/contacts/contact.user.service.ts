import { createClient } from "@/lib/supabase/client";
import { ContactFormData } from "@/public/lib/types";

// ==================================
// Service này sử dụng cho các user 
// ==================================

export async function sendContact(params : ContactFormData) {
    const supabase = await createClient();
    const { message, name, email } = params;

    const isValidEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    
    if (!message || !name || !email) {
        throw new Error("Thiếu thông tin bắt buộc");
    }
    if (!isValidEmail(email)) {
        throw new Error("Email không hợp lệ");
    }
    if (name.length > 1000) {
        throw new Error("Họ và Tên vượt qua 1000 ký tự");
    }
    if (message.length > 1000) {
        throw new Error("Nội dung vượt quá 1000 ký tự");
    }

    const { data, error } = await supabase
        .from("contact_requests")
        .insert({
            email: email,
            name: name,
            message: message
        });

    if (error) {
        throw new Error(error.message || "Không thể gửi contact");
    }
    return data;
}