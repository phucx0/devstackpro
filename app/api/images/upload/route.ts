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
            fileKey
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
    }
}