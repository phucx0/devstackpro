"use client"

import { useState, useEffect } from "react"
import { ChevronUp } from "lucide-react" // hoặc icon bạn thích

export default function BackToTop() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
        if (window.scrollY > 300) setVisible(true)
        else setVisible(false)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    return visible ? (
        <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition z-50"
            aria-label="Back to top"
        >
            <ChevronUp size={24} />
        </button>
    ) : null
}
