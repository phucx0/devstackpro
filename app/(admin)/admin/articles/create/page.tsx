"use client"
import { useState } from 'react';
import { Upload, X, Eye, EyeOff, FileText, Save } from 'lucide-react';
import { articleAPI, tagAPI } from '@/public/lib/api';
import { useUser } from '@/public/providers/UserProvider';
import { CreateArticleRequest, Tag } from '@/public/lib/types';
import { redirect } from 'next/navigation';
import MarkdownRenderer from '@/public/components/MarkdownRenderer';
import TagSelector from '@/public/components/admin/TagSelector';
import MarkdownTextarea from '@/public/components/MarkdownTextarea';
import ImageUpload from '@/public/components/admin/ImageUpload';

type PreviewImage = {
    url: string;   // URL tạm thời dùng để preview <img>
    name: string;  // tên file hiển thị / copy
}

export default function CreateArticle() {
    const { token, loading } = useUser();
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

    const [thumbnailPreview, setThumbnailPreview] = useState<string>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    // const [previews, setPreviews] = useState<PreviewImage[]>([]);
    const [images, setImages] = useState<File[]>([]);
    const [formData, setFormData] = useState<CreateArticleRequest>({
        title: '',
        slug: '',
        description: '',
        content_md: '',
        thumbnail: null,
        images: null,
        status: 'draft',
        tag_ids: []
    });

    const toSlug = (text: string) => {
        return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    };
    
    // Cập nhật input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            if (name === 'title') {
            const slug = toSlug(value);
            newData.slug = slug;
        }
            return newData;
        });
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, thumbnail: file }));
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const removeThumbnail = () => {
        setFormData(prev => ({ ...prev, thumbnail: null }));
        setThumbnailPreview("");
    };
    
    const handleSubmit =  async () => {
        // Gán danh sách tag.id đã chọn
        formData.tag_ids = selectedTags.map(tag =>tag.id);
        if (!formData.title) return alert("Thiếu title");
        if (!formData.description) return alert("Thiếu giới thiệu về bài viết");
        if (!formData.slug) return alert("Thiếu slug");
        if (!formData.content_md) return alert("Thiếu nội dung");
        if (!formData.tag_ids) return alert("Thiếu tags");
        if (!token) redirect("/auth/sign-in");
        setFormData(prev => ({ ...prev, images: images }))
        formData.images?.forEach(image => console.log(`Name: ${image.name} - Size: ${image.size}`))
        console.log(formData.images?.length)
        setIsSubmitting(true);
        try {
            const result = await articleAPI.createArticle(formData, token);
            if (result.success) {
                alert("Tạo bài viết thành công")
                redirect("/admin/article");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="">
            <header className="bg-white rounded-lg shadow sticky top-0">
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
                                    value={formData.title}
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
                                    value={formData.slug}
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
                                    value={formData.description}
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
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-5">
                        <div className='grid grid-cols-2 gap-4'>
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
                                            aria-label='remove thumbnail'
                                            type="button"
                                            onClick={removeThumbnail}
                                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition opacity-0 group-hover:opacity-100"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                            {/* Images Upload */}
                            <ImageUpload images={images} setImages={setImages}/>
                        </div>
                        {/* Preview Section */}
                        {showPreview && formData.title && (
                        <div className="mt-8">
                            <div className="bg-primary rounded-lg p-6 border border-gray-200">
                                <h3 className="text-2xl font-bold text-white mb-2">{formData.title}</h3>
                                <p className="text-gray-300 text-sm mb-4 font-mono">slug: /{formData.slug}</p>
                                {thumbnailPreview && (
                                    <img
                                    src={thumbnailPreview}
                                    alt="Thumbnail preview"
                                    className="w-full h-64 object-cover rounded-lg mb-4"
                                    />
                                )}
                                {formData.content_md && (
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
                                    checked={formData.status === 'draft'}
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
                                    checked={formData.status === 'published'}
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
                </div>
            </main>
        </div>
    );
}