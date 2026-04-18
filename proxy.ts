import { createClient } from "@/lib/supabase/middleware";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
    const { supabase, supabaseResponse } = createClient(request);
    const { pathname } = request.nextUrl;

    const isAdminRoute = pathname.startsWith("/admin")
    const isGuestRoute = ["/auth/sign-in", "/auth/sign-up"].includes(pathname);

    let user = null;

    if (isAdminRoute || isGuestRoute) {
        const { data } = await supabase.auth.getUser();
        user = data.user;
    }
    // 1. Đã login rồi vào login/register → redirect về dashboard
    if (isGuestRoute) {
        if (user) {
            return NextResponse.redirect(new URL("/admin/dashboard", request.url));
        }
        return supabaseResponse;
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
        "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};