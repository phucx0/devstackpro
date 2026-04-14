"use client"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Search from "./Search"
import Link from "next/link"

export default () => {
    const router = useRouter()
    const [toggleSideBar, setToggleSideBar] = useState(false)
    const handleRouter = (path: string) => {
        router.push(path)
        setToggleSideBar(false)
    }
    return(
        <header className=" fixed top-0 left-0 w-full z-100 h-20">
            {/* <svg id="glass">
                <filter id="displacementFilter">
                    <feTurbulence type="turbulence" 
                        baseFrequency="0.01" 
                        numOctaves="2" 
                        result="turbulence" />
            
                    <feDisplacementMap in="SourceGraphic"
                        in2="turbulence"    
                                    scale="200" xChannelSelector="R" yChannelSelector="G" />
                </filter>
            </svg> */}
            <div className="max-w-7xl mx-auto px-4 md:px-0 h-full flex items-center justify-between rounded-sm">
                <div className="flex items-center gap-10">
                    <Image
                        src={"/svg/logo.svg"}
                        alt="dev stack pro logo"
                        width={30}
                        height={30}
                    />
                    <nav className="hidden md:block main-menu-wrap text-white">
                        <div>
                            <ul className="flex gap-4">
                                <li>
                                    <Link href="/" className="cursor-pointer">
                                        HOME
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/articles" className="cursor-pointer">
                                        ARTICLES
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="cursor-pointer">
                                        CONTACT
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
                <Search/>
                <div 
                    onClick={() => {
                        setToggleSideBar(true)
                        console.log("oke")
                    }}
                    className="text-white block md:hidden"
                >
                    <Menu size={24}/>
                </div>
            </div>
            <div className={`fixed inset-0 z-50 ${toggleSideBar ? "" : "pointer-events-none"}`}>
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-black/30 backdrop-blur-xs transition-opacity duration-300 ${
                        toggleSideBar ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                />


                {/* Sidebar */}
                <div
                    className={`absolute right-0 top-0 h-screen w-[75%] bg-neutral-900 text-neutral-200 transform transition-transform duration-500 ${
                    toggleSideBar ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                    {/* Close button */}
                    <div onClick={() => setToggleSideBar(false)} className="p-4 cursor-pointer">
                        <X size={24} />
                    </div>

                    {/* Menu */}
                    <div className="font-bold divide-y divide-neutral-700">
                        
                        <Link
                            href={"/"}
                            className="w-full p-4"
                        >
                                Home
                        </Link>
                        <Link
                            href={"/articles"}
                            className="w-full p-4"
                        >
                                Articles
                        </Link>
                        <Link
                            href={"/contact"}
                            className="w-full p-4"
                        >
                                Contact
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}