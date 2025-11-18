"use client";
import { Link } from "lucide-react";
export default function CopyButton() {
    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
    };

    return (
        <div
            onClick={() => handleCopy()}
            className="text-neutral-700 p-3 bg-neutral-200 rounded-full w-fit cursor-pointer hover:bg-black hover:text-white transition-all ease-in-out"
        >
            <Link 
                size={24}
            />
        </div>
    );
}
