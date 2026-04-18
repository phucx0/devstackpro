import { createClient } from "@/lib/supabase/middleware";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
    const { supabase, supabaseResponse } = createClient(request);

    // ⚠️ Bắt buộc gọi để refresh token
    const { data: { user } } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;

    // 1. Đã login rồi vào login/register → redirect về dashboard
    const isGuestRoute = ["/auth/sign-in", "/auth/sign-up"].includes(pathname);
    if (isGuestRoute) {
        if (user) {
            return NextResponse.redirect(new URL("/admin/dashboard", request.url));
        }
        return supabaseResponse; // ✅ chưa login → cho vào bình thường
    }

    // 2. Admin routes — phải login + đúng role
    if (pathname.startsWith("/admin")) {
        if (!user) {
            return NextResponse.redirect(new URL("/auth/sign-in", request.url));
        }

        const { data: profile } = await supabase
            .from("users")
            .select("role")
            .eq("id", user.id)
            .single();

        if (profile?.role !== "admin") {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }
    return supabaseResponse;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};