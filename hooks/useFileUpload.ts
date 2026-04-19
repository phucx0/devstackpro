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
    const [uploadState, setUploadState] = useState<UploadState>({
        isUploading: false,
        progress: null,
        error: null,
        result: null,
    });
    
    const uploadFile = useCallback(async (
        file: File,
        documentType: string,
    ): Promise<UploadResult> => {
        try {
            // Reset state
            setUploadState({
                isUploading: true,
                progress: null,
                error: null,
                result: null,
            });
            
            // Get presigned URL
            toast.info('Preparing upload...');
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
            toast.info('Uploading to cloud storage...');
            // await uploadToR2(file, presignedUrl, (progress) => {
            //     setUploadState(prev => ({
            //         ...prev,
            //         progress,
            //     }));
            // });
            
            // Generate file URL
            const fileUrl = R2_CONFIG.publicUrl 
                ? `${R2_CONFIG.publicUrl}/${fileKey}`
                : `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_CONFIG.bucketName}/${fileKey}`;
            
            const result: UploadResult = {
                success: true,
                fileUrl,
                fileKey,
            };
            
            setUploadState({
                isUploading: false,
                progress: null,
                error: null,
                result,
            });
            
            toast.success('Upload completed successfully!');
            return result;
        
        } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        
        setUploadState({
            isUploading: false,
            progress: null,
            error: errorMessage,
            result: null,
        });
        
        toast.error(errorMessage);
        
        return {
            success: false,
            error: errorMessage,
        };
        }
    }, []);
    
    return {
        uploadState,
        uploadFile,
    };
}

// Helper function to upload file to R2 using presigned URL
export async function uploadToR2(
    file: File,
    presignedUrl: string,
    // onProgress: (progress: UploadProgress) => void
): Promise<void> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', presignedUrl)
        xhr.setRequestHeader('Content-Type', file.type)

        xhr.upload.onprogress = (event) => {
            // if (event.lengthComputable) {
            // const percentComplete = (event.loaded / event.total) * 100
            // setUploadProgress(percentComplete)
            // }
            // if (event.lengthComputable) {
            //     const progress = {
            //         loaded: event.loaded,
            //         total: event.total,
            //         percentage: Math.round((event.loaded / event.total) * 100),
            //     };
            //     onProgress(progress);
            // }
        }

        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve()
                } else {
                reject(new Error(`Upload failed with status ${xhr.status}`))
            }
        }

        xhr.onerror = () => {
            reject(new Error('Upload failed'))
        }

        xhr.send(file)

        // presignedUrl.addEventListener('abort', () => {
        //     xhr.abort()
        //     reject(new Error('Upload cancelled'))
        // })

        // xhr.upload.addEventListener('progress', (event) => {
        //     if (event.lengthComputable) {
        //         const progress = {
        //             loaded: event.loaded,
        //             total: event.total,
        //             percentage: Math.round((event.loaded / event.total) * 100),
        //         };
        //         onProgress(progress);
        //     }
        // });
        
        // xhr.addEventListener('load', () => {
        //     console.log("XHR status:", xhr.status);
        //     console.log("XHR response:", xhr.responseText); // ← xem XML error
        //     if (xhr.status === 200) {
        //         resolve();
        //     } else {
        //         console.error("R2 Response:", xhr.responseText);
        //         reject(new Error(`Upload failed with status: ${xhr.status}`));
        //     }
        // });
        
        // xhr.addEventListener('error', () => {
        //     reject(new Error('Upload failed'));
        // });
        
        // xhr.send(file);
    });
}