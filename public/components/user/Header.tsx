"use client"
import { Menu, X, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"

export default function Header() {
    const router = useRouter()
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [query, setQuery] = useState("")

    const handleSearch = () => {
        if (!query.trim()) return
        router.push(`/articles/search/${query.trim()}`)
        setQuery("")
    }

    const handleNav = (path: string) => {
        router.push(path)
        setDrawerOpen(false)
    }

    return (
        <>
            <header className="noir-header">
                <div className="noir-header-inner">
                    {/* Logo */}
                    <Link href="/" className="noir-logo">
                        <div className="noir-logo-mark">
                            {/* D icon */}
                            <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 2h4.5C9.538 2 12 4.462 12 7s-2.462 5-5.5 5H2V2Z" fill="#080808"/>
                            </svg>
                        </div>
                        <span className="noir-logo-text">DevStack</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="noir-nav">
                        <Link href="/" className="noir-nav-link">Home</Link>
                        <Link href="/articles" className="noir-nav-link">Articles</Link>
                        <Link href="/contact" className="noir-nav-link">Contact</Link>
                    </nav>

                    {/* Search */}
                    <div className="noir-search-wrap">
                        <div className="noir-search-box">
                            <Search size={14} style={{ color: 'var(--noir-muted)', flexShrink: 0 }} />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="noir-menu-btn"
                        onClick={() => setDrawerOpen(true)}
                        aria-label="Open menu"
                    >
                        <Menu size={18} />
                    </button>
                </div>
            </header>

            {/* Mobile Drawer */}
            <div
                className={`noir-drawer-overlay ${drawerOpen ? "open" : ""}`}
                role="dialog"
                aria-modal="true"
            >
                <div
                    className="noir-drawer-backdrop"
                    onClick={() => setDrawerOpen(false)}
                />
                <div className="noir-drawer">
                    <div className="noir-drawer-close" onClick={() => setDrawerOpen(false)}>
                        <X size={20} />
                    </div>

                    {/* Mobile Search */}
                    <div className="noir-search-box" style={{ marginBottom: '24px', width: '100%' }}>
                        <Search size={14} style={{ color: 'var(--noir-muted)', flexShrink: 0 }} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSearch()
                                    setDrawerOpen(false)
                                }
                            }}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <Link href="/" className="noir-drawer-link" onClick={() => setDrawerOpen(false)}>
                        Home
                    </Link>
                    <Link href="/articles" className="noir-drawer-link" onClick={() => setDrawerOpen(false)}>
                        Articles
                    </Link>
                    <Link href="/contact" className="noir-drawer-link" onClick={() => setDrawerOpen(false)}>
                        Contact
                    </Link>
                </div>
            </div>
        </>
    )
}
