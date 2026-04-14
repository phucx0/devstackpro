import Header from "@/public/components/user/Header";
import { ReactNode } from "react";
import Footer from "@/public/components/user/Footer";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import BackToTop from "@/public/components/BackToTop";


export default function UserLayout({children} : {children : ReactNode}) {
    return (
        <>
            <BackToTop/>
            <Analytics/>
            <Header/>
            <main className="mt-20 max-w-7xl min-h-screen m-auto p-2 md:p-0">
                {children}
            </main>
            <Footer/>
        </>
    )
}
