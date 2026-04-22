import { createClient } from "@/lib/supabase/middleware";
import { NextRequest, NextResponse } from "next/server";

type UserRole = "admin" | "user" | "moderator";

interface Profile {
    id: string;
    role: UserRole;
    [key: string]: unknown;
}

const ROUTE_CONFIG = {
    admin: "/admin",
    guestOnly: ["/auth/sign-in", "/auth/sign-up"],
    redirects: {
        afterLogin: "/admin/dashboard",
        noAuth: "/auth/sign-in",
        noPermission: "/",
    },
} as const;


export async function proxy(request: NextRequest) {
    const { supabase, supabaseResponse } = createClient(request);
    const { pathname } = request.nextUrl;

    const isAdminRoute = pathname.startsWith(ROUTE_CONFIG.admin)
    const isGuestRoute = (ROUTE_CONFIG.guestOnly as readonly string[]).includes(pathname);

    // Trả về sớm khi không cần xác thực danh tính 
    if (!isAdminRoute && !isGuestRoute) {
        return supabaseResponse;
    }

    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    // Thông báo lỗi khi kiểm tra user 
    if (authError) {
        console.error("[proxy] Auth error:", authError.message);
    }

    let profile: Profile | null = null;

    // Nếu user đã có trong authentication -> kiểm tra user trong table `users`
    if(authUser) {
        const { data, error: profileError } = await supabase
            .from("users")
            .select("*")
            .eq("id", authUser.id)
            .maybeSingle<Profile>()
        
        if (profileError) {
            console.error("[proxy] Profile fetch error:", profileError.message);
        } else {
            profile = data;
        }
    }

    // 1. Đã login rồi vào login/register → redirect về trang chủ 
    if (isGuestRoute) {
        if (profile) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        return supabaseResponse;
    }

    // 2. Admin routes — phải login + đúng role
    if (isAdminRoute) {
        if (!profile) {
            const signInUrl = new URL(ROUTE_CONFIG.redirects.noAuth, request.url);
            signInUrl.searchParams.set("next", pathname);
            return NextResponse.redirect(signInUrl);
        }

        if (profile.role !== "admin") {
            return NextResponse.redirect(new URL(ROUTE_CONFIG.redirects.noPermission, request.url));
        }
    }
    return supabaseResponse;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};