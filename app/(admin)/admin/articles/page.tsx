"use client"
import Loading from "@/public/components/Loading";
import { articleAPI } from "@/public/lib/api";
import { ArticleResponse, ArticleWithTags } from "@/public/lib/types";
import { useUser } from "@/public/providers/UserProvider";
import { Eye, Newspaper, SquarePen, Trash2 } from "lucide-react"
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react"


interface StatusProps {
    status: "published" | "draft" | "hidden";
}

export function Status({ status }: StatusProps) {
    // map trạng thái → màu dot và background
    const statusColors: Record<string, { dot: string; bg: string }> = {
        published: { dot: "bg-[#16a34a]", bg: "bg-[#16a34a]/10" },
        draft: { dot: "bg-yellow-500", bg: "bg-yellow-100" },
        hidden: { dot: "bg-gray-500", bg: "bg-gray-100" },
    };

    const { dot, bg } = statusColors[status] || {
        dot: "bg-gray-400",
        bg: "bg-gray-100",
    };

    return (
        <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${bg} text-sm font-medium`}
        >
        <div className={`w-2.5 h-2.5 rounded-full ${dot}`}></div>
            <span className="capitalize">{status}</span>
        </div>
    );
}


export default () => {
    const router = useRouter();
    const { token, loading } = useUser()
    const [articles, setArticles] = useState<ArticleWithTags[]>();
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [totalPages, setTotalPages] = useState(1);
    const [totalArticles, setTotalArticles] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteArticle = async (id: number) => {
        if (!token) redirect("/auth/sign-in");
        const isConfirm = window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?");
        if (!isConfirm) return;

        try {
            const result = await articleAPI.deleteArticle(Number(id), token);
            console.log(result);
            if (result.success) {
                alert("Xóa thành công");
                setArticles(prev => prev?.filter(p => p.id != id))
            } else {
                alert("Xóa thất bại, thử lại sau");
            }
        } catch (err) {
            console.error(err);
            alert("Có lỗi xảy ra khi xóa bài viết");
        }
    }
    useEffect(() => {
        if (token) {
            const getArticles = async () => {
                try {
                    setIsLoading(true);
                    const params = { page: pageNumber, limit: 10, status: null };
                    const result = await articleAPI.getAdminArticles(token, params);
                    if (result.success) {
                        setArticles(result.data);
                        setTotalPages(result.pagination.total_pages);
                        setTotalArticles(result.pagination.total);
                    }
                } catch {
                    console.log("Lỗi khi lấy danh sách article");
                } finally {
                    setIsLoading(false)
                }
            };
            getArticles();
        }
    }, [loading, token, pageNumber]);

    if (isLoading) return <Loading/>
    return (
        <div className="">
            <div className="flex items-center justify-between">
                <div className="text-2xl py-4">Articles</div>
                <div
                onClick={() => router.push("/admin/articles/create")}
                className="bg-blue-500 text-base px-4 py-2 rounded-lg text-white cursor-pointer">
                    Add new article
                </div>
            </div>
            <table className="w-full rounded-lg overflow-hidden shadow-sm bg-white">
                <thead className="text-base">
                    <tr className="font-bold">
                        <th className="px-4 py-2 text-left text-gray-700 border-b border-neutral-300">Title</th>
                        <th className="px-4 py-2 text-left text-gray-700 border-b border-neutral-300">Display Name</th>
                        <th className="px-4 py-2 text-left text-gray-700 border-b border-neutral-300">Status</th>
                        <th className="px-4 py-2 text-left text-gray-700 border-b border-neutral-300">Views</th>
                        <th className="px-4 py-2 text-left text-gray-700 border-b border-neutral-300">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {articles ? 
                        articles.map((article, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-3 border-b border-neutral-300">{article.title}</td>
                                <td className="px-4 py-3 border-b border-neutral-300">{article.display_name}</td>
                                <td className="px-4 py-3 border-b border-neutral-300 ">
                                    <Status status={article.status}/>
                                </td>
                                <td className="px-4 py-3 border-b border-neutral-300">{article.views}</td>

                                <td className="px-4 py-3 border-b border-neutral-300">
                                    <div className="flex gap-2">
                                        <div
                                            onClick={() => router.push(`/admin/articles/${article.id}`)
                                        }
                                            className="border border-neutral-400 p-2 rounded-lg cursor-pointer">
                                            <Eye size={16}/>
                                        </div>
                                        <div
                                            onClick={() => router.push(`/admin/articles/${article.id}/update`)}
                                            className="border border-neutral-400 p-2 rounded-lg cursor-pointer">
                                            <SquarePen size={16}/>
                                        </div>
                                        <div
                                            onClick={() => handleDeleteArticle(article.id)}
                                            className="border border-neutral-400 p-2 rounded-lg cursor-pointer">
                                            <Trash2 size={16}/>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={10} className="py-10 border-b border-neutral-300">
                                    <div className="flex flex-col items-center justify-center gap-4">
                                        <Newspaper className="text-neutral-700" size={60}/>
                                        <div>Không tìm thấy bài viết nào!</div>
                                    </div>
                                </td>
                            </tr>
                        )}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={10} className="p-4">
                            <div className="flex items-center gap-4 justify-between">
                                <div>Showing {(articles?.length! + (pageNumber - 1) * 10) - articles?.length! + 1} to {articles && articles.length + (pageNumber - 1) * 10} of {totalArticles} results</div>
                                <div className="space-x-4">
                                    <button
                                        className={`px-3 py-1 rounded bg-blue-500 text-white ${pageNumber === 1 ? "cursor-not-allowed" : "cursor-pointer"}`}
                                        disabled={pageNumber === 1}
                                        onClick={() => setPageNumber(prev => prev - 1)}
                                    >
                                        Prev
                                    </button>
                                    <button
                                        className={`px-3 py-1 rounded bg-blue-500 text-white ${pageNumber === totalPages ? "cursor-not-allowed" : "cursor-pointer"}`}
                                        disabled={pageNumber === totalPages}
                                        onClick={() => setPageNumber(prev => prev + 1)}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}