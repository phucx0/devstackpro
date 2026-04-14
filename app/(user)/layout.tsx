import Header from "@/public/components/user/Header"
import Footer from "@/public/components/user/Footer"

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main className="noir-main">
                {children}
            </main>
            <Footer />
        </>
    )
}
