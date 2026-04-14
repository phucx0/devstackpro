"use client"
import Loading from "@/public/components/Loading";
import { tagAPI } from "@/public/lib/api";
import { Tag } from "@/public/lib/types";
import { useUser } from "@/public/providers/UserProvider";
import { Newspaper, Trash2, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

export default () => {
    const { token, loading } = useUser();
    const [tags, setTags] = useState<Tag[]>([]);
    const [isLoadingTags, setIsLoadingTags] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newTagName, setNewTagName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!loading && token) {
            fetchTags();
        }
    }, [loading, token]);

    const fetchTags = async () => {
        setIsLoadingTags(true);
            try {
                const result = await tagAPI.getAllTags(token);
                if (result.success) setTags(result.data);
            } catch (err) {
                console.error(err);
                setTags([]);
            } finally {
                setIsLoadingTags(false);
            }
        setIsLoadingTags(false);
    };

    const handleAddTag = async () => {
        if (!newTagName.trim()) {
            setError("Tên tag không được để trống");
            return;
        }

        setIsSubmitting(true);
        setError("");
        try {
            const result = await tagAPI.createTag(token, newTagName.trim());
            if (result.success) {
                await fetchTags();
                setNewTagName("");
                setShowAddModal(false);
            } else {
                setError(result.message || "Không thể tạo tag");
            }
        } catch (err: any) {
            setError(err.message || "Đã có lỗi xảy ra");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteTag = async (tagId: number) => {
        if (!confirm("Bạn có chắc muốn xóa tag này?")) return;

        try {
            const result = await tagAPI.deleteTag(token, tagId);
            if (result.success) {
                await fetchTags();
            } else {
                alert(result.message || "Không thể xóa tag");
            }
        } catch (err: any) {
            alert(err.message || "Đã có lỗi xảy ra");
        }
    };

    if (loading || isLoadingTags) return <Loading/>;

    return (
        <div>
            {/* Header với nút thêm tag */}
            <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Quản lý Tags</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <Plus size={20} />
                    Thêm Tag
                </button>
            </div>

            {/* Table */}
            <table className="w-full rounded-lg overflow-hidden shadow-sm bg-white">
                <thead className="text-base">
                    <tr className="font-bold">
                        <th className="px-4 py-2 text-left text-gray-700 border-b border-neutral-300">ID</th>
                        <th className="px-4 py-2 text-left text-gray-700 border-b border-neutral-300">Name</th>
                        <th className="px-4 py-2 text-left text-gray-700 border-b border-neutral-300">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {tags.length > 0 ? 
                        tags.map((tag) => (
                            <tr key={tag.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 border-b border-neutral-300">{tag.id}</td>
                                <td className="px-4 py-3 border-b border-neutral-300">
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                        {tag.name}
                                    </span>
                                </td>
                                <td className="px-4 py-3 border-b border-neutral-300">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleDeleteTag(tag.id)}
                                            className="border border-red-400 text-red-600 hover:bg-red-50 p-2 rounded-lg cursor-pointer transition-colors"
                                        >
                                            <Trash2 size={16}/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={3} className="py-10 border-b border-neutral-300">
                                    <div className="flex flex-col items-center justify-center gap-4">
                                        <Newspaper className="text-neutral-700" size={60}/>
                                        <div>Không tìm thấy tag nào!</div>
                                    </div>
                                </td>
                            </tr>
                        )}
                </tbody>
            </table>

            {/* Modal thêm tag */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">Thêm Tag Mới</h3>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setNewTagName("");
                                    setError("");
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên Tag
                            </label>
                            <input
                                type="text"
                                value={newTagName}
                                onChange={(e) => {
                                    setNewTagName(e.target.value);
                                    setError("");
                                }}
                                placeholder="Nhập tên tag..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !isSubmitting) {
                                        handleAddTag();
                                    }
                                }}
                            />
                            {error && (
                                <p className="text-red-500 text-sm mt-1">{error}</p>
                            )}
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setNewTagName("");
                                    setError("");
                                }}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                disabled={isSubmitting}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleAddTag}
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Đang tạo..." : "Tạo Tag"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}