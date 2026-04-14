"use client"
import Loading from "@/public/components/Loading";
import MarkdownRenderer from "@/public/components/MarkdownRenderer";
import { articleAPI } from "@/public/lib/api";
import { ArticleWithTags, UpdateArticleRequest } from "@/public/lib/types"
import { useUser } from "@/public/providers/UserProvider";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react"

export default function ArticleDetailPage() {
    const { id } = useParams();
    const [article, setArticle] = useState<ArticleWithTags>()
    const { token, loading } = useUser();
    const [thumbnailPreview, setThumbnailPreview] = useState<string>();
    const [_loading, setLoading] = useState(true)

    useEffect(() => {
        if (id && token && !loading) {
            const getArticle = async () => {
                try {
                    const result = await articleAPI.getAdminArticleById(Number(id), token)
                    if(result.success) {
                        setArticle(result.data);
                        
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
    
    return (
        <div className="max-w-2/4 m-auto">
            <div className="">
                <div className="bg-primary rounded-lg p-6 border">
                    <h3 className="text-2xl font-bold text-white mb-2">{article?.title}</h3>
                    <p className="text-gray-500 text-sm mb-4 font-mono">/{article?.slug}</p>
                    {thumbnailPreview && (
                        <img
                            src={thumbnailPreview}
                            alt="Thumbnail preview"
                            className="w-full h-64 object-cover rounded-lg mb-4"
                        />
                    )}
                    {article?.content_md && (
                        <div className="text-sm leading-relaxed">
                            <MarkdownRenderer content={article?.content_md}/>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}