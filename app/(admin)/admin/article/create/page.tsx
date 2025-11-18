"use client"
import { useEffect, useState } from 'react';
import { Upload, X, Eye, EyeOff, FileText, Save } from 'lucide-react';
import { articleAPI } from '@/public/lib/api';
import { useUser } from '@/public/providers/UserProvider';
import { CreateArticleRequest } from '@/public/lib/types';
import { redirect } from 'next/navigation';
import MarkdownRenderer from '@/public/components/MarkdownRenderer';
import MarkdownToolbar from '@/public/components/MarkdownToolbar';

export default function CreateVideoPost() {
    const handleInsert = (value: string) => {
        setFormData(prev => ({
            ...prev,
            content_md: (prev.content_md || "" ) + value
        }));
    };
    const { token, user } = useUser();
    useEffect(() => {
        if (user && user.role === "user") {
            redirect("/auth/sign-in"); // hoặc router.push
        }
    }, [user]);
    const [formData, setFormData] = useState<CreateArticleRequest>({
        title: '',
        slug: '',
        content_md: '',
        thumbnail: null,
        status: 'draft',
    });
    const [thumbnailPreview, setThumbnailPreview] = useState<string>();
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPreview, setShowPreview] = useState(false);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
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
        if (!formData.title) return console.log("Thiếu title");
        if (!formData.slug) return console.log("Thiếu slug");
        if (!formData.content_md) return console.log("Thiếu content_md");
        if (!token) redirect("/auth/sign-in");
        setIsSubmitting(true);
        try {
            const result = await articleAPI.createArticle(formData, token);
            if (result.success) redirect("/admin/article");
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white">
            {/* Fixed Header */}
            <header className="sticky top-0 bg-white border-b border-gray-200 z-10 shadow-sm">
                <div className="px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16">
                        <h1 className="text-xl font-semibold text-black flex items-center gap-2">
                            <FileText size={24} />
                            Create New Article
                        </h1>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowPreview(!showPreview)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                            >
                                {showPreview ? 'Hide Preview' : 'Show Preview'}
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-6 py-2 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Save size={16} />
                                {isSubmitting ? 'Đang xử lý...' : 'Đăng bài'}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="px-4 sm:px-6 py-8 grid grid-cols-[7fr_3fr] gap-4">
                <div className='space-y-5'>
                    {/* Left Column - Main Form */}
                    <div className="space-y-5">
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
                            <p className="text-xs text-gray-500 mt-1.5">
                                URL: <span className="font-mono text-blue-600">/video/{formData.slug || 'slug-cua-ban'}</span>
                            </p>
                        </div>

                        {/* Content Markdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Nội dung (Markdown) <span className="text-red-500">*</span>
                            </label>
                            <MarkdownToolbar onInsert={handleInsert} />
                            <textarea
                                name="content_md"
                                value={formData.content_md}
                                onChange={handleInputChange}
                                rows={16}
                                className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-mono text-sm resize-y"
                                placeholder="# Tiêu đề&#10;&#10;Nội dung của bạn ở đây...&#10;&#10;## Video&#10;&#10;```&#10;[video-url-here]&#10;```"
                            />
                            <div className="text-sm text-gray-500 mt-1.5">
                                <div>Hỗ trợ Markdown: </div>
                                <div className='flex items-center gap-4'>
                                    <p>
                                        <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded w-fit">#</span> H1
                                    </p>
                                    <p>
                                        <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded w-fit">##</span> H2
                                    </p>
                                    <p>
                                        <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded w-fit">###</span> H3
                                    </p>
                                    <p>
                                        <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">**</span> bold
                                    </p>
                                    <p>
                                        <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">*</span> italic
                                    </p>
                                    <p>
                                        <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">*</span> italic
                                    </p>
                                    <p>
                                        <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">![description](url)</span> image
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-5">
                        {/* Status */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
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

                        {/* Thumbnail Upload */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Ảnh thumbnail <span className="text-red-500">*</span>
                            </label>
                            {!thumbnailPreview ? (
                                <label className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleThumbnailChange}
                                        className="hidden"
                                    />
                                    <Upload className="mx-auto mb-2 text-gray-400 group-hover:text-blue-500 transition" size={32} />
                                    <p className="text-sm text-gray-600 font-medium">Nhấn để tải ảnh lên</p>
                                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF (Max: 5MB)</p>
                                </label>
                            ) : (
                                <div className="relative group">
                                    <img
                                        src={thumbnailPreview}
                                        alt="Preview"
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeThumbnail}
                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition opacity-0 group-hover:opacity-100"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                            </div>
                        </div>
                    </div>

                {/* Preview Section */}
                {showPreview && formData.title && (
                    <div className="">
                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                            <h3 className="text-2xl font-bold text-black mb-2">{formData.title}</h3>
                            <p className="text-gray-500 text-sm mb-4 font-mono">/{formData.slug}</p>
                            {thumbnailPreview && (
                                <img
                                src={thumbnailPreview}
                                alt="Thumbnail preview"
                                className="w-full h-64 object-cover rounded-lg mb-4"
                                />
                            )}
                            {formData.content_md && (
                                <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                    <MarkdownRenderer content={formData.content_md}/>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}