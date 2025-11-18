import Image from "next/image";

export default function Loading() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <Image 
                src={"/svg/logo.svg"}
                alt="loading"
                width={40}
                height={40}
            />
        </div>
    )
}