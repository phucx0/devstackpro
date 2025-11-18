"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default () => {
    const router = useRouter()
    return(
        <header className="bg-neutral-900 py-4">
            <div className="w-[90%] md:w-[60%] m-auto flex items-center justify-between">
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
                                    <a onClick={() => router.push("/")}>HOME</a>
                                </li>
                                <li>
                                    <a onClick={() => router.push("/contact")}>CONTACT</a>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
                <div>
                    <a href="">
                        <Image
                            src={"/svg/search.svg"}
                            alt="search"
                            width={20}
                            height={20}
                        />
                    </a>
                </div>
            </div>
        </header>
    )
}