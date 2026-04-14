"use client";
import { Facebook } from "lucide-react";

interface FacebookShareButtonProps {
    slug: string;
}

export default function FacebookShareButton({ slug }: FacebookShareButtonProps) {
    const handleShare = () => {
        const url = encodeURIComponent(`${window.location.origin}/articles/${slug}`);
        const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        console.log(fbShareUrl);
        window.open(fbShareUrl, "_blank", "width=600,height=400");
        
    };

    return (
        <div 
            onClick={handleShare}
            className="text-neutral-700 p-2 bg-neutral-200 rounded-full w-fit cursor-pointer hover:bg-black hover:text-white transition-all ease-in-out"
        >
            <Facebook 
                size={24}
            />
        </div>
    );
}
