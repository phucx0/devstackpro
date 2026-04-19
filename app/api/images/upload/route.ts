import { NextRequest, NextResponse } from "next/server";
import { DeleteObjectCommand, ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";
import { getPublicUrl, R2_BUCKET, R2_PUBLIC_URL, r2Client } from "@/lib/cloudflare/r2";


export const R2_CONFIG = {
    bucketName: process.env.R2_BUCKET_NAME!,
    publicUrl: process.env.R2_PUBLIC_URL,
    maxFileSize: 10 * 1024 * 1024,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    presignedUrlExpiry: 300,
};

export async function POST(req: NextRequest) {
    try {
        const { fileName, fileType, fileSize } = await req.json();
        console.log("FILE TYPE SIGN:", fileType);

        if (!fileType.startsWith("image/")) {
            return NextResponse.json({ error: "Chỉ chấp nhận hình ảnh" }, { status: 400 });
        }

        const fileKey = `${Date.now()}-${nanoid(8)}-${fileName}`;

        // ←←← IMPORTANT: Remove checksum to avoid extra headers
        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: fileKey,
            ContentType: fileType,
        });

        const presignedUrl = await getSignedUrl(r2Client, command, { 
            expiresIn: 300 
        });

        return NextResponse.json({
            presignedUrl,
            fileKey,
            publicUrl: getPublicUrl(fileKey),
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
    }
}

export async function GET() {
    const command = new ListObjectsV2Command({
        Bucket: R2_BUCKET,
        Prefix: "images/",   // chỉ lấy thư mục images
    });

    const response = await r2Client.send(command);
    
    const images = response.Contents?.map(item => ({
        key: item.Key,
        url: R2_PUBLIC_URL 
        ? `${R2_PUBLIC_URL}/${item.Key}` 
        : `https://${R2_BUCKET}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${item.Key}`,
        lastModified: item.LastModified,
        size: item.Size,
    }));

    return NextResponse.json({ images });
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { key: string } }
) {
    const key = decodeURIComponent(params.key);

    const command = new DeleteObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
    });

    await r2Client.send(command);
    return NextResponse.json({ success: true });
}