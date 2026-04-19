import { S3Client } from "@aws-sdk/client-s3";

export const R2_BUCKET = process.env.R2_BUCKET_NAME!;
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL; 

const getR2Endpoint = () => {
    const accountId = process.env.R2_ACCOUNT_ID!;
    const isEuRegion = process.env.R2_REGION === 'eu';
    return isEuRegion 
        ? `https://${accountId}.eu.r2.cloudflarestorage.com`
        : `https://${accountId}.r2.cloudflarestorage.com`;
};

export const R2_CONFIG = {
    bucketName: process.env.R2_BUCKET_NAME!,
    publicUrl: process.env.R2_PUBLIC_URL,
    maxFileSize: 10 * 1024 * 1024,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    presignedUrlExpiry: 300,
};


export const r2Client = new S3Client({
    region: "auto",
    endpoint: getR2Endpoint(),
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: true,
    requestChecksumCalculation: "WHEN_REQUIRED",
});

// Hàm helper để tạo full public URL từ fileKey
export function getPublicUrl(fileKey: string): string {
    // Đảm bảo không có dấu / thừa ở đầu key
    const cleanKey = fileKey.startsWith('/') ? fileKey.slice(1) : fileKey;
    return `${R2_PUBLIC_URL}/${cleanKey}`;
}

export function handleR2Error(error: any): string {
    if (error.name === 'NoSuchBucket') return 'Bucket does not exist.';
    if (error.name === 'InvalidAccessKeyId') return 'Invalid access key.';
    if (error.name === 'SignatureDoesNotMatch') return 'Authentication failed.';
    if (error.name === 'AccessDenied') return 'Access denied. Check your token permissions.';
    return `R2 operation failed: ${error.message || 'Unknown error'}`;
}
