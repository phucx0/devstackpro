"use client"
import { useUser } from "@/public/providers/UserProvider"
import { ChevronDown } from "lucide-react"

export default function AdminHeader() {
    const {user} = useUser()
    return (
        <div className="p-4 h-20 bg-white flex justify-end border-b border-b-neutral-300">
            <div className="border border-neutral-300 px-4 py-2 rounded-lg text-neutral-700 flex items-center gap-2 cursor-pointer">
                <div className="text-lg font-bold">{user?.display_name}</div>
                <ChevronDown />
            </div>
        </div>
    )
}