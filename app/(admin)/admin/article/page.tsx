"use client"
import Loading from "@/public/components/Loading";
import { articleAPI } from "@/public/lib/api";
import { ArticleResponse, ArticleWithTags } from "@/public/lib/types";
import { useUser } from "@/public/providers/UserProvider";
import { Eye, SquarePen } from "lucide-react"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"



export default () => {
    const router = useRouter();
    const { token, loading } = useUser()
    const [articles, setArticles] = useState<ArticleWithTags[]>();
    useEffect(() => {
        if (!loading && token) {
            const getArticles = async () => {
                try {
                    const params = { page: 1, limit: 10, status: null };
                    const result = await articleAPI.getAdminArticles(token, params);
                    if (result.success) setArticles(result.data)
                    // console.log("Lấy danh sách thành công");
                } catch {
                    console.log("Lỗi khi lấy danh sách article");
                }
            };
            getArticles();
        }
    }, [loading, token]);

    return (
        <div className="">
            <div className="flex items-center justify-between">
                <div className="text-2xl py-4">Articles</div>
                <div
                onClick={() => router.push("/admin/article/create")}
                className="bg-blue-500 text-base px-4 py-2 rounded-lg text-white cursor-pointer">
                    Add new article
                </div>
            </div>
            <table className="w-full rounded-lg overflow-hidden shadow-sm bg-white">
                <thead className="text-base">
                    <tr className="font-bold">
                        <th className="px-4 py-2 text-left text-gray-700 border-b border-neutral-300">ID</th>
                        <th className="px-4 py-2 text-left text-gray-700 border-b border-neutral-300">Thumbnail</th>
                        <th className="px-4 py-2 text-left text-gray-700 border-b border-neutral-300">Title</th>
                        <th className="px-4 py-2 text-left text-gray-700 border-b border-neutral-300">Display Name</th>
                        <th className="px-4 py-2 text-left text-gray-700 border-b border-neutral-300">Username</th>
                        {/* <th className="px-4 py-2 text-left text-gray-700 border-b border-neutral-300">Email</th> */}
                        <th className="px-4 py-2 text-left text-gray-700 border-b border-neutral-300">Status</th>
                        <th className="px-4 py-2 text-left text-gray-700 border-b border-neutral-300">Views</th>
                        <th className="px-4 py-2 text-left text-gray-700 border-b border-neutral-300">Created At</th>
                        <th className="px-4 py-2 text-left text-gray-700 border-b border-neutral-300">Updated At</th>
                        <th className="px-4 py-2 text-left text-gray-700 border-b border-neutral-300">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {articles && 
                        articles.map((article, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 border-b border-neutral-300">{article.id}</td>

                            <td className="px-4 py-3 border-b border-neutral-300">
                                <img src={`https://easytrade.site/api/v2${article.thumbnail}`} alt={article.title} className="w-16 h-10 object-cover rounded" />
                            </td>

                            <td className="px-4 py-3 border-b border-neutral-300">{article.title}</td>
                            <td className="px-4 py-3 border-b border-neutral-300">{article.display_name}</td>
                            <td className="px-4 py-3 border-b border-neutral-300">{article.username}</td>
                            {/* <td className="px-4 py-3 border-b border-neutral-300">{article.email}</td> */}
                            <td className="px-4 py-3 border-b border-neutral-300">{article.status}</td>
                            <td className="px-4 py-3 border-b border-neutral-300">{article.views}</td>
                            <td className="px-4 py-3 border-b border-neutral-300">{article.created_at}</td>
                            <td className="px-4 py-3 border-b border-neutral-300">{article.updated_at}</td>

                            <td className="px-4 py-3 border-b border-neutral-300">
                                <div className="flex gap-2">
                                <div
                                    onClick={() => router.push(`/admin/article/${article.id}`)
                                }
                                    className="border border-neutral-400 p-2 rounded-lg cursor-pointer">
                                    <Eye size={16}/>
                                </div>
                                <div
                                    onClick={() => router.push(`/admin/article/${article.id}/edit`)}
                                    className="border border-neutral-400 p-2 rounded-lg cursor-pointer">
                                    <SquarePen size={16}/>
                                </div>
                                </div>
                            </td>
                            </tr>
                        ))}

                </tbody>
                </table>

        </div>
    )
}