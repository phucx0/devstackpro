"use client"
import { useRouter } from "next/navigation"
import { ReactNode } from "react"

interface ButtonProps {
    children: ReactNode
    href?: string          // Nếu có, điều hướng; nếu không, chỉ onclick
    onClick?: () => void   // Logic bổ sung
    className?: string
    replace?: boolean
    prefetch?: boolean
    external?: boolean     // true = mở link ngoài site
}

export default function Button({
    children,
    href,
    onClick,
    className = "px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition",
    replace = false,
    prefetch = true,
    external = false,
}: ButtonProps) {
    const router = useRouter()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        if (onClick) onClick()

        if (!href) return // không có link → chỉ chạy onclick

        if (external) {
            window.open(href, "_blank")
        } else {
            e.preventDefault()
            router.push(href)
        }
    }

    return href && !external ? (
        <a href={href} onClick={handleClick} className={className}>
        {children}
        </a>
    ) : (
        <button onClick={handleClick} className={className}>
        {children}
        </button>
    )
}
