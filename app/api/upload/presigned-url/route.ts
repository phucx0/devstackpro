import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { nanoid } from 'nanoid';
import { createClient } from '@/lib/supabase/server';
import { R2_CONFIG, r2Client } from '@/lib/cloudflare/r2';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data } = await supabase.auth.getUser();

        if (!data.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        // Parse request body
        const { fileName, fileType, fileSize, documentType } = await request.json();
        
        // Validate file type
        if (!R2_CONFIG.allowedMimeTypes.includes(fileType)) {
            return NextResponse.json(
                { error: 'Invalid file type' },
                { status: 400 }
            );
        }
        
        // Validate file size
        if (fileSize > R2_CONFIG.maxFileSize) {
            return NextResponse.json(
                { error: 'File too large' },
                { status: 400 }
            );
        }
        
        // Generate unique file key
        const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
        const fileKey = `uploads/${data.user.id}/${Date.now()}-${nanoid(8)}-${safeName}`;

        // Create presigned URL for PUT operation
        const command = new PutObjectCommand({
            Bucket: R2_CONFIG.bucketName,
            Key: fileKey,
            ContentType: fileType,
            Metadata: {
                    userId: data.user.id,
                    originalFileName: fileName,
                    documentType,
                    uploadedAt: new Date().toISOString(),
                },
            }
        );
        
        const presignedUrl = await getSignedUrl(r2Client, command, {
            expiresIn: R2_CONFIG.presignedUrlExpiry
        });
        
        return NextResponse.json({
            presignedUrl,
            fileKey
        });
        
    } catch (error) {
        console.error('Error generating presigned URL:', error);
        return NextResponse.json(
            { error: 'Failed to generate upload URL' },
            { status: 500 }
        );
    }
}