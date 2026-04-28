import { getThumbnailUrl } from "@/lib/utils/image";
import Image from "next/image";

interface CardThumbnailProps {
  thumbnail: string | null | undefined;
  title: string;
  thumbColor: string;
}

export function CardThumbnail({
  thumbnail,
  title,
  thumbColor,
}: CardThumbnailProps) {
  return (
    <div className="w-full aspect-video relative overflow-hidden">
      {thumbnail ? (
        <Image
          src={getThumbnailUrl(thumbnail)}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
          priority
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${thumbColor} 0%, rgba(255,255,255,0.03) 100%)`,
          }}
        >
          <span
            className="font-display text-[48px]"
            style={{ color: "rgba(255,255,255,0.06)" }}
          >
            {title[0]}
          </span>
        </div>
      )}
    </div>
  );
}
