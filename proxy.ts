import { createClient } from "@/lib/supabase/middleware";
import { NextRequest, NextResponse } from "next/server";

const ROUTE_CONFIG = {
    admin: "/admin",
    editor: "/editor",
    guestOnly: ["/sign-in", "/sign-up"],
    redirects: {
        afterLogin: "/admin/dashboard",
        noAuth: "/sign-in",
        noPermission: "/",
    },
} as const;


export async function proxy(request: NextRequest) {
    const { supabase, supabaseResponse } = createClient(request);
    const { pathname } = request.nextUrl;

    const isGuestRoute = ROUTE_CONFIG.guestOnly.some(route =>
        pathname.startsWith(route)
    );
    const isEditorRoute = /^\/[^/]+\/editor\//.test(pathname);
    const isProtected   = isEditorRoute;

    // Trả về sớm khi không cần xác thực danh tính 
    if (!isProtected && !isGuestRoute) {
        return supabaseResponse;
    }

    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    // Thông báo lỗi khi kiểm tra user 
    if (authError) {
        console.error("[proxy] Auth error:", authError.message);
    }

    // Đã login → không vào guest routes
    if (isGuestRoute) {
        if (authUser) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        return supabaseResponse;
    }

    // Editor — phải login
    if (isEditorRoute) {
        if (!authUser) {
            const signInUrl = new URL(ROUTE_CONFIG.redirects.noAuth, request.url);
            signInUrl.searchParams.set("next", pathname);
            return NextResponse.redirect(signInUrl);
        }
        // ownership check để trong page/server action, không check ở middleware
        return supabaseResponse;
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};