import { tagAPI } from "@/public/lib/api"
import { Tag } from "@/public/lib/types"
import { useUser } from "@/public/providers/UserProvider"
import { X } from "lucide-react"
import { useEffect, useState } from "react"

interface TagSelectorProps {
    selectedTags: Tag[]
    setSelectedTags: (tags: Tag[]) => void
}

export default function TagSelector({ selectedTags, setSelectedTags }: TagSelectorProps) {
    const { token, loading } = useUser()
    const [tags, setTags] = useState<Tag[]>([])

    const toggleTag = (tag: Tag) => {
        if (selectedTags.some(t => t.id === tag.id)) {
            setSelectedTags(selectedTags.filter(t => t.id !== tag.id))
        } else {
            setSelectedTags([...selectedTags, tag])
        }
    }

    const fetchTags = async () => {
        try {
            const result = await tagAPI.getAllTags(token)
            if (result.success) setTags(result.data)
        } catch (err) {
            console.error(err)
            setTags([])
        }
    }

    useEffect(() => {
        if (!loading && token) fetchTags()
    }, [loading, token])

    return (
        <div style={{ width: "100%" }}>
            <label style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase" as const,
                color: "var(--noir-muted)",
                display: "block",
                marginBottom: "10px",
            }}>
                Tags <span style={{ color: "var(--noir-accent)" }}>*</span>
            </label>

            {/* All tags */}
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "6px", marginBottom: "12px" }}>
                {tags.map(tag => {
                    const isActive = selectedTags.some(t => t.id === tag.id)
                    return (
                        <button
                            key={tag.id}
                            type="button"
                            onClick={() => toggleTag(tag)}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                fontFamily: "var(--font-mono)",
                                fontSize: "9px",
                                fontWeight: 500,
                                letterSpacing: "0.12em",
                                textTransform: "uppercase" as const,
                                color: isActive ? "var(--noir-black)" : "var(--noir-muted)",
                                background: isActive ? "var(--noir-accent)" : "var(--noir-card)",
                                border: `0.5px solid ${isActive ? "var(--noir-accent)" : "var(--noir-border)"}`,
                                padding: "5px 10px",
                                borderRadius: "3px",
                                cursor: "pointer",
                                transition: "all 0.15s",
                            }}
                        >
                            {tag.name}
                        </button>
                    )
                })}
            </div>

            {/* Selected tags */}
            {selectedTags.length > 0 && (
                <div style={{
                    display: "flex",
                    flexWrap: "wrap" as const,
                    gap: "6px",
                    padding: "10px",
                    background: "var(--noir-card)",
                    border: "0.5px solid var(--noir-border)",
                    borderRadius: "5px",
                }}>
                    {selectedTags.map(tag => (
                        <span
                            key={tag.id}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                fontFamily: "var(--font-mono)",
                                fontSize: "9px",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase" as const,
                                color: "var(--noir-accent)",
                                background: "var(--noir-accent-bg)",
                                border: "0.5px solid rgba(232,255,0,0.2)",
                                padding: "4px 8px",
                                borderRadius: "3px",
                            }}
                        >
                            {tag.name}
                            <div
                                onClick={() => toggleTag(tag)}
                                style={{
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    color: "var(--noir-muted)",
                                    transition: "color 0.15s",
                                }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#ff4444"}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--noir-muted)"}
                            >
                                <X size={10} />
                            </div>
                        </span>
                    ))}
                </div>
            )}
        </div>
    )
}
