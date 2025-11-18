import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
    const role = req.cookies.get("role")?.value;

    if (req.nextUrl.pathname.startsWith("/admin")) {
        if (role !== "admin") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
