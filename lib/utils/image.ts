export const getThumbnailUrl = (path: string) => {
    const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_URL_IMAGE ?? "";
    if (!path) return "";

    const isAvif = path.endsWith(".avif");

    // AVIF → không dùng resize
    if (isAvif) {
      return IMAGE_BASE_URL + path;
    }
    // các loại khác → dùng Cloudflare resize
    return `${IMAGE_BASE_URL}cdn-cgi/image/width=768,quality=75/${path}`;
};

export const getAvatarUrl = (keyFile: string) => {
    const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_URL_IMAGE ?? "";
    if (!keyFile) return "";

    const isAvif = keyFile.endsWith(".avif");

    // AVIF → không dùng resize
    if (isAvif) {
        return IMAGE_BASE_URL + keyFile;
    }
    // các loại khác → dùng Cloudflare resize
    return `${IMAGE_BASE_URL}cdn-cgi/image/width=40,height=40,quality=75/${keyFile}`;
};