import { tagAPI } from "@/public/lib/api";
import { Tag } from "@/public/lib/types";
import { useUser } from "@/public/providers/UserProvider";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface TagSelectorProps {
    selectedTags: Tag[],
    setSelectedTags: (tags :Tag[]) => void
    // onChange: (tags :number[]) => void
}
export default function TagSelector({ selectedTags, setSelectedTags }: TagSelectorProps) {
    const { token, loading} = useUser()
    const [tags, setTags] = useState<Tag[]>([]);
    const toggleTag = (tag: Tag) => {
        if (selectedTags.some(t => t.id === tag.id)) {
            setSelectedTags(selectedTags.filter(t => t.id !== tag.id));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const fetchTags = async () => {
        try {
            const result = await tagAPI.getAllTags(token);
            if (result.success) setTags(result.data);
        } catch (err) {
            console.error(err);
            setTags([]);
        } finally {
            
        }
    };

    // Lấy danh sách tags
    useEffect(() => {
        if (!loading && token) {
            fetchTags();
        }
    }, [loading, token])

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tags <span className="text-red-500">*</span>
            </label>
            {/* Hiển thị tất cả tag có thể click để chọn/bỏ */}
            <div className="flex flex-wrap gap-1">
                {tags.map(tag => (
                <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-1 rounded-full border border-gray-300 text-xs cursor-pointer hover:bg-neutral-700 hover:text-white ${
                    selectedTags.some(t => t.id === tag.id)
                        ? "bg-black text-white"
                        : "bg-white text-black border-black"
                    }`}
                >
                    {tag.name}
                </button>
                ))}
            </div>
            
            {/* Hiển thị các tag đã chọn */}
            {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                    {selectedTags.map(tag => (
                        <span
                            key={tag.id}
                            className="pl-4 pr-2 py-1 rounded-full border border-gray-300 flex items-center gap-4 text-xs"
                        >
                            {tag.name}
                            <div 
                                onClick={() => toggleTag(tag)}
                                className="p-1 rounded-full bg-red-700 text-white cursor-pointer"
                            >
                                <X size={12}/>
                            </div>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}