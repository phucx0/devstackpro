"use client"
import { useEffect, useState } from 'react';
import { Upload, X, Eye, EyeOff, FileText, Save } from 'lucide-react';
import { articleAPI } from '@/public/lib/api';
import { useUser } from '@/public/providers/UserProvider';
import { ArticleWithTags, Tag, UpdateArticleRequest } from '@/public/lib/types';
import { redirect, useParams } from 'next/navigation';
import MarkdownRenderer from '@/public/components/MarkdownRenderer';
import Loading from '@/public/components/Loading';
import MarkdownToolbar from '@/public/components/MarkdownToolbar';
import TagSelector from '@/public/components/admin/TagSelector';
import MarkdownTextarea from '@/public/components/MarkdownTextarea';

type PreviewImage = {
    id?: number;
    url: string;   // URL tạm thời dùng để preview <img>
    name: string;  // tên file hiển thị / copy
}

export default function UpdateArticlePage() {
    const { id } = useParams();
    const { token, loading } = useUser();
    const [_loading, setLoading] = useState(true)

    // ✅ Tách riêng: dữ liệu gốc và dữ liệu hiện tại
    const [originalData, setOriginalData] = useState<UpdateArticleRequest | null>(null);
    const [formData, setFormData] = useState<UpdateArticleRequest | null>(null);
    
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    
    const [thumbnailPreview, setThumbnailPreview] = useState<string>();
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailChanged, setThumbnailChanged] = useState(false); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [previews, setPreviews] = useState<PreviewImage[]>([]);

    // const [images, setImages] = useState<File[]>([]);
    const [imagesChanged, setImagesChanged] = useState(false);

    // Thêm kiểu markdown
    const handleInsert = (value: string) => {
        setFormData(prev => ({
            ...prev,
            content_md: (prev?.content_md || "" ) + value
        }));
    };

    // Cập nhật input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            if (!prev) return prev;
            const newData = { ...prev, [name]: value };
            if (name === 'title') {
                const slug = value
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/[đĐ]/g, 'd')
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .trim();
                newData.slug = slug;
            }
            return newData;
        });
    };

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles: File[] = Array.from(files).map((file, idx) => {
            const ext = file.name.split('.').pop();
            const newName = `${Date.now()}-${idx}.${ext}`;
            return new File([file], newName, { type: file.type });
        });

        // set FormData
        setFormData(prev => ({
            ...prev,
            images: prev?.images ? [...prev.images, ...newFiles] : newFiles
        }));

        // set previews (URL + name)
        const newPreviews = Array.from(newFiles).map(file => ({
            url: URL.createObjectURL(file),
            name: file.name
        }));

        setPreviews(prev => prev ? [...prev, ...newPreviews] : newPreviews);
        setImagesChanged(true);
    };


    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.size <= 5 * 1024 * 1024) {
            setThumbnailFile(file);
            setThumbnailChanged(true); // ✅ Đánh dấu đã thay đổi
            setThumbnailPreview(URL.createObjectURL(file));
        } else if (file) {
            alert('File quá lớn. Vui lòng chọn ảnh dưới 5MB');
        }
    };

    const removeThumbnail = () => {
        setThumbnailFile(null);
        setThumbnailChanged(true);
        setThumbnailPreview("");
    };
    function isArrayEqual(a : number[], b: number[]) {
        if (!a || !b) return false;
        if (a.length !== b.length) return false;

        const A = [...a].sort();
        const B = [...b].sort();

        return A.every((v, i) => v === B[i]);
    }


    const handleSubmit = async () => {
        if (!id) return console.log("Id is missing");
        if (!formData || !originalData) return console.log("FormData is null"); 
        if (!token) redirect("/auth/sign-in");
        
        setIsSubmitting(true);
        try {
            // ✅ Chỉ gửi những field đã thay đổi
            const formDataToSend = new FormData();
            let hasChanges = false;

            // So sánh từng field
            if (formData.title !== originalData.title) {
                formDataToSend.append('title', formData.title || '');
                hasChanges = true;
                console.log('Title changed:', formData.title);
            }

            if (formData.slug !== originalData.slug) {
                formDataToSend.append('slug', formData.slug || '');
                hasChanges = true;
                console.log('Slug changed:', formData.slug);
            }

            if (formData.content_md !== originalData.content_md) {
                formDataToSend.append('content_md', formData.content_md || '');
                hasChanges = true;
                console.log('Content changed');
            }

            if (formData.status !== originalData.status) {
                formDataToSend.append('status', formData.status || 'draft');
                hasChanges = true;
                console.log('Status changed:', formData.status);
            }
            if (formData.description !== originalData.description) {
                formDataToSend.append('description', formData.description || '');
                hasChanges = true;
                console.log('Status changed:', formData.description);
            }

            if (thumbnailChanged && thumbnailFile) {
                formDataToSend.append('thumbnail', thumbnailFile);
                hasChanges = true;
                console.log('Thumbnail changed - new file uploaded');
            }
            // Kiểm tra ảnh có thay đổi không
            if (imagesChanged && formData.images && formData.images.length > 0) {
                formData.images.forEach((file, index) => {
                    formDataToSend.append('images', file);
                    console.log(`Adding image ${index + 1}:`, file.name);
                });
                hasChanges = true;
                console.log(`Total images to upload: ${formData.images.length}`);
            }
            // Kiểm tra danh sách tag có thay đổi không
            if(!isArrayEqual(formData.tag_ids ?? [], selectedTags.map(tag => tag.id))) {
                hasChanges = true;
                formDataToSend.append("tags",JSON.stringify(selectedTags.map(tag => tag.id)))
                console.log("Tags Changed - new tags updated")
            }

            if (!hasChanges) {
                alert('Không có thay đổi nào để cập nhật');
                setIsSubmitting(false);
                return;
            }

            const result = await articleAPI.updateArticle(Number(id), formDataToSend, token);
            if (result.success) {
                setThumbnailChanged(false);
                setOriginalData(formData);
                setImagesChanged(false);
                alert('Cập nhật thành công!');
            }
        } catch (err) {
            console.error('Error updating article:', err);
            alert('Có lỗi xảy ra khi cập nhật');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (id && token && !loading) {
            const getArticle = async () => {
                try {
                    const result = await articleAPI.getAdminArticleById(Number(id), token)
                    if(result.success) {
                        // ✅ Lưu cả original data và current data
                        const initialData: UpdateArticleRequest = {
                            title: result.data?.title,
                            slug: result.data?.slug,
                            content_md: result.data?.content_md,
                            status: result.data?.status,
                            description: result.data?.description,
                            tag_ids: result.data.tags ? result.data.tags.map(tag => tag.id ) : []
                        };
                        setSelectedTags(result.data.tags ?? [])
                        setOriginalData(initialData);
                        setFormData(initialData);
                        const newPreviews: PreviewImage[] = (result.data?.images ?? []).map((img: any) => ({
                            id: img.id,
                            url: `https://easytrade.site/api/v2` + img.url,
                            name: img.name || img.alt_text || `image-${img.id}`
                        }));
                        setPreviews(newPreviews)

                        if (result.data?.thumbnail) {
                            setThumbnailPreview(`https://easytrade.site/api/v2${result.data?.thumbnail}`);
                        }
                    }
                } catch (err) {
                    console.error("Lỗi khi lấy dữ liệu:", err);
                }
            }
            getArticle()
            const load = setTimeout(() => {
                setLoading(false)
            }, 1500);
            return (() => clearTimeout(load));
        }
    }, [id, token, loading]);

    if (_loading) return <Loading/>
    if (!_loading && !formData) return <div>Không có dữ liệu</div>

    return (
        <div className="">
            <header className="bg-white rounded-lg shadow sticky top-0 z-100">
                <div className="px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16">
                        <h1 className="text-2xl font-semibold text-black flex items-center gap-2">Create New Article</h1>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowPreview(!showPreview)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition cursor-pointer"
                            >
                                {showPreview ? 'Hide Preview' : 'Show Preview'}
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-6 py-2 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                            >
                                <Save size={16} />
                                {isSubmitting ? 'Đang xử lý...' : 'Đăng bài'}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="grid grid-cols-[7fr_3fr] gap-4 mt-8">
                <div className='space-y-5'>
                    {/* Left Column - Main Form */}
                    <div className="space-y-5">
                        <div className='bg-white p-6 rounded-lg shadow space-y-5'>
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Tiêu đề <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData?.title}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    placeholder="Nhập tiêu đề bài viết..."
                                />
                            </div>
                            {/* Slug */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Slug (URL)
                                </label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData?.slug}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                                    placeholder="slug-tu-dong-tao"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="description"
                                    value={formData?.description}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                                    placeholder="Nhập giới thiệu về bài viết"
                                />
                            </div>
                        </div>

                        {/* Content Markdown */}
                        <div className='bg-white p-6 rounded-lg shadow'>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Nội dung (Markdown) <span className="text-red-500">*</span>
                            </label>
                            <MarkdownTextarea
                                content={formData?.content_md ?? ""}
                                onChange={(text: string) => setFormData(prev => ({
                                    ...prev,
                                    content_md: text
                                }))}
                            />
                        </div>

                        {/* Preview Section */}
                        {showPreview && formData?.title && (
                        <div className="mt-8">
                            <div className="bg-primary rounded-lg p-6 border border-gray-200">
                                <h3 className="text-2xl font-bold text-white mb-2">{formData?.title}</h3>
                                <p className="text-gray-300 text-sm mb-4 font-mono">slug: /{formData?.slug}</p>
                                {thumbnailPreview && (
                                    <img
                                    src={thumbnailPreview}
                                    alt="Thumbnail preview"
                                    className="w-full h-64 object-cover rounded-lg mb-4"
                                    />
                                )}
                                {formData?.content_md && (
                                    <MarkdownRenderer content={formData.content_md}/>
                                )}
                            </div>
                        </div>
                        )}
                    </div>
                </div>
                <div className='space-y-5'>
                    {/* Status */}
                    <div className="bg-white rounded-lg p-4 shadow">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Trạng thái
                        </label>
                        <div className="space-y-2">
                            <label className="flex items-center p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-white transition bg-white">
                                <input
                                    type="radio"
                                    name="status"
                                    value="draft"
                                    checked={formData?.status === 'draft'}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-blue-500"
                                />
                                <EyeOff size={18} className="ml-3 mr-2 text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">Nháp</span>
                            </label>
                            <label className="flex items-center p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-white transition">
                                <input
                                    type="radio"
                                    name="status"
                                    value="published"
                                    checked={formData?.status === 'published'}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-blue-500"
                                />
                                <Eye size={18} className="ml-3 mr-2 text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">Xuất bản</span>
                            </label>
                        </div>
                    </div>

                    <div className='bg-white p-6 rounded-lg shadow'>
                        {/* Tags */}
                        <TagSelector 
                            selectedTags={selectedTags}
                            setSelectedTags={setSelectedTags}
                        />
                    </div>
                    <div>
                        {/* Thumbnail Upload */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Ảnh thumbnail <span className="text-red-500">*</span>
                            </label>
                            {!thumbnailPreview ? (
                                <label className="block border-2 border-dashed border-gray-300 aspect-video rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleThumbnailChange}
                                        className="hidden"
                                    />
                                    <Upload className="mx-auto mb-2 text-gray-400 group-hover:text-blue-500 transition" size={32} />
                                    <p className="text-sm text-gray-600 font-medium">Nhấn để tải ảnh lên</p>
                                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF, AVIF (Max: 5MB)</p>
                                </label>
                            ) : (
                                <div className="relative group">
                                    <img
                                        src={thumbnailPreview}
                                        alt="Preview"
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                    <button
                                        aria-label="remove thumbnail"
                                        type="button"
                                        onClick={removeThumbnail}
                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition opacity-0 group-hover:opacity-100"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                        {/* <ImageUpload  images={images} setImages={setImages}/> */}
                        {/* Images Upload */}
                        <div className=' bg-white rounded-lg shadow p-6'>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Ảnh <span className="text-red-500">*</span>
                            </label>
                            <div className='grid grid-cols-2 gap-4'>
                                <label className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImage}
                                        className="hidden"
                                    />
                                    <Upload className="mx-auto mb-2 text-gray-400 group-hover:text-blue-500 transition" size={32} />
                                    <p className="text-sm text-gray-600 font-medium">Nhấn để tải ảnh lên</p>
                                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF (Max: 5MB)</p>
                                </label>
                                {/* Preview + file name */}
                                {previews && previews.map((image, index) => (
                                    <div key={index} className="flex flex-col items-center">
                                        <img 
                                            src={image.url}
                                            alt={image.name}
                                            className='w-full aspect-video mb-1 rounded'
                                        />
                                        <p className="text-xs text-gray-700">/uploads/articles/{image.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}