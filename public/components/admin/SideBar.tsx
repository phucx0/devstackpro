"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SideBar() {
    const router = useRouter();
    const handleRouter = (path: string) => {
        router.push("/admin"+path)
    }
    return (
        <div className="w-[300px] bg-white h-screen border-r border-r-neutral-300">
            <div className="px-4 py-10">
                <div className="flex items-center gap-4">
                    <Image
                        src={"svg/logo.svg"}
                        alt=""
                        width={30}
                        height={30}
                    />
                    <div className="text-lg font-bold">Dev Stack Pro</div>
                </div>
            </div>
            <div 
                onClick={() => handleRouter("/article")}
                className="p-4 border-b border-b-neutral-300 cursor-pointer hover:bg-neutral-100"
            >
                <div className="text-lg font-medium">Articles</div>
            </div>
            <div className="p-4 border-b border-b-neutral-300 cursor-pointer hover:bg-neutral-100">
                <div className="text-lg font-medium">Users</div>
            </div>            
        </div>
    )
}