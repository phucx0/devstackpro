import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Search() {
    const router = useRouter()
    const [toggle, setToggle] = useState(false)
    const [query, setQuery] = useState("");
    const handleSearch = () => {
        if (query === "") return;
        router.push(`/articles/search/${query}`)
    }
    return (
        <div 
            onMouseEnter={() => setToggle(true)}
            onMouseLeave={() => setToggle(query == "" ? false : true)}
            className="glass-card flex items-center relative"
        >
            <input
                className={`text-white text-base outline-none border-none transition-all duration-300 ease-in-out z-10
                ${toggle ? "w-64 opacity-100 px-4 " : "w-0 opacity-0 px-0"}`
                }
                type="text"
                placeholder="Search"
                onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                }}
                onChange={(e) => setQuery(e.target.value)}
            />
            <div 
                onClick={handleSearch}
                className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-200/15 transition-all cursor-pointer"
            >
                <Image
                    src="/svg/search.svg"
                    alt="search"
                    width={18}
                    height={18}
                />
            </div>
        </div>

    )
}