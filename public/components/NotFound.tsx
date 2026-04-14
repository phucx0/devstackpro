import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
    return (
        <div className="noir-notfound">
            <div className="noir-notfound-code" aria-hidden="true">
                4<span>0</span>4
            </div>
            <h1 className="noir-notfound-title">Page not found</h1>
            <p className="noir-notfound-sub">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link href="/" className="noir-read-btn">
                <ArrowLeft size={12} />
                Back to Home
            </Link>
        </div>
    )
}
