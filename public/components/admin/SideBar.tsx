"use client"
import { useUser } from "@/public/providers/UserProvider";
import { LayoutDashboard, LogOut, NotepadText, Tag } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

interface Props {
    path: string; 
    name: string; 
    Icon: ReactNode;
    selected: boolean;
}

const Button = ({ path, name, Icon, selected }: Props) => {
    const router = useRouter();
    return (
        <div 
            onClick={() => router.push("/admin/" + path)}
            className={`flex items-center gap-2 p-4 cursor-pointer rounded-lg
                ${selected ? "bg-blue-100 text-blue-600" : " text-neutral-700"}
                hover:${selected ? "" : "bg-blue-200"}
            `}
        >
            {Icon}
            <div className="text-base">{name}</div>
        </div>
    )
}

export default function SideBar() {
    const { user, logout } = useUser()
    const router = useRouter();
    const pathname = usePathname(); // lấy đường dẫn hiện tại

    const handleRouter = (path: string) => {
        router.push("/admin"+path)
    }

    const isSelected = (path: string) => {
        const fullPath = "/admin" + (path === "/" ? "" : path);
        return pathname === fullPath;
    }


    return (
        <div className="w-[300px] bg-white max-h-screen min-h-screen border-r border-r-neutral-300 flex flex-col justify-between">
            <div>
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
                <div className="px-2">
                    <Button 
                        path="/"
                        name="Dashboard"
                        Icon={<LayoutDashboard />}
                        selected={isSelected("/")}
                    />
                    <Button 
                        path="/articles"
                        name="Articles"
                        Icon={<NotepadText />}
                        selected={isSelected("/articles")}
                    />
                    <Button 
                        path="/tags"
                        name="Tags"
                        Icon={<Tag />}
                        selected={isSelected("/tags")}
                    />
                    <Button 
                        path="/messages"
                        name="Messages"
                        Icon={<Tag />}
                        selected={isSelected("/messages")}
                    />
                </div>
            </div>
            <div className="p-2">
                <div className="border border-neutral-300 p-2 rounded-lg flex items-center justify-between text-neutral-600">
                    <img width={50} height={50} className="rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlaonRU6uW-97jwwRM2on97_Nq8KfKtM3l5bggew2D1Jj9bs0_rNm53Bgiy1uzvoXcEgkUSIUkEyFFMciLaBS39gdGavEqpO61otSqiNt_zA3JSDlJThlFHkWIyxIlpeCogcgRIti8h5vFD_doWDoEQe0SnAG5LT3rEba9wuCbUG5mJv-tZpzmJt5XJzQlxcl2Avax4L_7r4-W46MTnWNDBjYwLZ0OhZjDmkiu5CfbzLXYe_RHbBt71mAz4G0f0uTC6fgmxX01nlg" alt="" />
                    <div className="space-y-1">
                        <div className="text-base text-neutral-600 font-bold">{user?.display_name}</div>
                        <div className="text-sm text-neutral-600">{user?.role}</div>
                    </div>
                    <LogOut 
                        className="cursor-pointer"
                        onClick={logout}
                        size={16}
                    />
                </div>
            </div>
        </div>
    )
}
