import { Globe, Mail, Youtube } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="bg-white shadow-sm p-4">
            <div className="text-xl">Liên hệ với tôi</div>
            <div className="flex flex-col">
                <div className="flex items-center ">
                    <div className="p-4 bg-amber-400">
                        <Mail />
                    </div>
                    <div className="p-4">
                        <div className="text-xl font-bold">Gmail</div>
                        <div className="text-sm text-neutral-600">phamhoangphuc613p@gmail.com</div>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="p-4 bg-amber-400">
                        <Globe />
                    </div>
                    <div className="p-4">
                        <div className="text-xl font-bold">Website</div>
                        <div className="text-sm text-neutral-600">https://dev-stack-pro.vercel.app/</div>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="p-4 bg-amber-400">
                        <Youtube />
                    </div>
                    <div className="p-4">
                        <div className="text-xl font-bold">Youtube</div>
                        <div className="text-sm text-neutral-600">https://www.youtube.com/@DevStackPro</div>
                    </div>
                </div>
            </div>
        </div>
    )
}