"use client";
import Header from "@/public/components/user/Header";
import Image from "next/image";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
export default function UserLayout({children} : {children : ReactNode}) {
    const pathname = usePathname();
    const showFeatured = pathname === "/";
    return (
        <div>
            <Header/>
            <div className="w-[95%] md:w-[60%] m-auto py-10">
                {showFeatured && (
                    <div className="bg-white p-2 md:p-4 w-full md:aspect-11/5 featured-wrapper box-border mb-4">
                        <div className="featured-content">
                            <div className="featured-item-1 relative">
                                <Image src="/images/Frame159.png" fill className="object-cover" alt="" priority/>
                                <div className="w-full absolute bottom-0 p-2 md:p-4 bg-linear-to-b from-black/10 to-black">
                                    <div className="text-white font-bold text-base md:text-2xl">Thiết kế card với hiệu ứng Hover</div>
                                    <div className="text-sm text-neutral-200">Nội dung về bài viết</div>
                                </div>
                            </div>
                            <div className="featured-item-2 relative">
                                <Image src="/images/Frame154.png" fill className="object-cover" alt="" priority/>
                                <div className="absolute bottom-0 p-2 md:p-4 bg-linear-to-b from-black/10 to-black">
                                    <div className="text-white font-bold text-base md:text-2xl">Thiết kế card với hiệu ứng Hover</div>
                                    <div className="text-sm text-neutral-200">Nội dung về bài viết</div>
                                </div>
                            </div>
                            <div className="featured-item-3 relative">
                                <Image src="/images/Frame159.png" fill className="object-cover" alt="" priority/>
                                <div className="absolute bottom-0 p-2 md:p-4 bg-linear-to-b from-black/10 to-black">
                                    <div className="text-white font-bold text-base md:text-2xl">Thiết kế card với hiệu ứng Hover</div>
                                    <div className="text-sm text-neutral-200">Nội dung về bài viết</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-[7fr_3fr] gap-4">
                    {children}
                    <div>
                        <div className="flex flex-col bg-white p-2 md:p-4">
                            <div className="text-lg pb-2 border-b border-b-neutral-400">Related Articles</div> 
                            <div className="text-sm text-neutral-600 pt-2">No articles available!</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
