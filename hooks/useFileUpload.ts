import { R2_CONFIG } from '@/lib/cloudflare/r2';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UploadProgress {
    loaded: number;
    total: number;
    percentage: number;
}

interface UploadResult {
    success: boolean;
    fileUrl?: string;
    fileKey?: string;
    error?: string;
}

interface UploadState {
    isUploading: boolean;
    progress: UploadProgress | null;
    error: string | null;
    result: UploadResult | null;
}

export function useFileUpload() {
    const uploadFile = useCallback(async (
        file: File,
        documentType: string,
    ): Promise<UploadResult> => {
        try {
            // Get presigned URL
            const presignedResponse = await fetch('/api/upload/presigned-url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                    fileName: file.name,
                    fileType: file.type,
                    fileSize: file.size,
                    documentType,
                }),
            });
            
            if (!presignedResponse.ok) {
                const errorData = await presignedResponse.json();
                throw new Error(errorData.error || 'Failed to get upload URL');
            }
            
            const { presignedUrl, fileKey, filePath } = await presignedResponse.json();
            
            // Upload to R2 with progress tracking
            await uploadToR2(file, presignedUrl);
            
            // Generate file URL
            const fileUrl = R2_CONFIG.publicUrl 
                ? `${R2_CONFIG.publicUrl}/${fileKey}`
                : `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_CONFIG.bucketName}/${fileKey}`;
            
            const result: UploadResult = {
                success: true,
                fileUrl,
                fileKey,
            };
            
            toast.success('Upload completed successfully!');
            return result;
        
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Upload failed';
            toast.error(errorMessage);
            return {
                success: false,
                error: errorMessage,
            };
        }
    }, []);
    
    return {
        uploadFile,
    };
}

// Helper function to upload file to R2 using presigned URL
export async function uploadToR2(
    file: File,
    presignedUrl: string,
): Promise<void> {
    try {
        const uploadRes = await fetch(presignedUrl, {
            method: "PUT",
            body: file,
            headers: {
                "Content-Type": file.type,
            },
        });
    
        if (!uploadRes.ok) {
            const errorText = await uploadRes.text().catch(() => "");
            console.error("Upload failed - Status:", uploadRes.status);
            console.error("Response:", errorText);
            throw new Error(`Upload thất bại (${uploadRes.status})`);
        }
    } catch (e: any) {
        toast.error(`Error: ${e.message}`);
    }
}