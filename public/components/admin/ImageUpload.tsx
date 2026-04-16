import { Upload, X } from "lucide-react"
import { useState } from "react"

type PreviewImage = {
    id?: number
    url: string
    name: string
}

interface Props {
    images: File[]
    setImages: (file: File[]) => void
}

export default function ImageUpload({ images, setImages }: Props) {
    const [previews, setPreviews] = useState<PreviewImage[]>([])
    const [showDialog, setShowDialog] = useState(false)
    const [pendingFiles, setPendingFiles] = useState<File[]>([])
    const [currentFileIndex, setCurrentFileIndex] = useState(0)
    const [imageName, setImageName] = useState("")

    const toSlug = (text: string) =>
        text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d").replace(/Đ/g, "D")
            .replace(/[^a-z0-9\s-]/g, "").trim()
            .replace(/\s+/g, "-").replace(/-+/g, "-")

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return
        const filesArray = Array.from(files)
        setPendingFiles(filesArray)
        setCurrentFileIndex(0)
        setImageName(toSlug(filesArray[0].name.split(".")[0]))
        setShowDialog(true)
        e.target.value = ""
    }

    const handleConfirmName = () => {
        const currentFile = pendingFiles[currentFileIndex]
        const ext = currentFile.name.split(".").pop()
        const slug = imageName.trim() ? toSlug(imageName) : toSlug(currentFile.name.split(".")[0])
        const renamedFile = new File([currentFile], `${slug}-${Date.now()}.${ext}`, { type: currentFile.type })
        setImages([...images, renamedFile])
        setPreviews([...previews, { url: URL.createObjectURL(renamedFile), name: renamedFile.name }])

        if (currentFileIndex < pendingFiles.length - 1) {
            const nextIndex = currentFileIndex + 1
            setCurrentFileIndex(nextIndex)
            setImageName(toSlug(pendingFiles[nextIndex].name.split(".")[0]))
        } else {
            setShowDialog(false)
            setPendingFiles([])
            setCurrentFileIndex(0)
            setImageName("")
        }
    }

    const handleSkip = () => {
        if (currentFileIndex < pendingFiles.length - 1) {
            const nextIndex = currentFileIndex + 1
            setCurrentFileIndex(nextIndex)
            setImageName(toSlug(pendingFiles[nextIndex].name.split(".")[0]))
        } else {
            setShowDialog(false)
            setPendingFiles([])
            setCurrentFileIndex(0)
            setImageName("")
        }
    }

    const handleRemoveImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index))
        setPreviews(previews.filter((_, i) => i !== index))
    }

    return (
        <div>
            {/* Upload Zone */}
            <label style={{
                display: "flex",
                flexDirection: "column" as const,
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                width: "100%",
                height: "120px",
                background: "var(--noir-surface)",
                border: "0.5px dashed var(--noir-border-md)",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "border-color 0.2s, background 0.2s",
            }}
            onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = "var(--noir-accent)"
                el.style.background = "var(--noir-accent-bg)"
            }}
            onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = "var(--noir-border-md)"
                el.style.background = "var(--noir-surface)"
            }}
            >
                <Upload size={20} color="var(--noir-muted)" />
                <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--noir-muted)",
                }}>
                    Click để chọn ảnh
                </span>
                <input type="file" style={{ display: "none" }} multiple accept="image/*" onChange={handleImage} />
            </label>

            {/* Preview Grid */}
            {previews.length > 0 && (
                <div style={{ display: "grid", gap: "8px", marginTop: "12px" }}>
                    {previews.map((preview, index) => (
                        <div key={index} style={{ position: "relative", borderRadius: "5px", overflow: "hidden", border: "0.5px solid var(--noir-border)" }}>
                            <img src={preview.url} alt={preview.name} style={{ width: "100%", height: "140px", objectFit: "cover", display: "block", filter: "brightness(0.8)" }} />
                            <div style={{
                                position: "absolute",
                                bottom: 0, left: 0, right: 0,
                                background: "rgba(8,8,8,0.85)",
                                padding: "6px 10px",
                                fontFamily: "var(--font-mono)",
                                fontSize: "10px",
                                color: "var(--noir-muted)",
                                letterSpacing: "0.05em",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}>
                                {preview.name}
                            </div>
                            <button
                                aria-label="remove image"
                                onClick={() => handleRemoveImage(index)}
                                style={{
                                    position: "absolute",
                                    top: "8px", right: "8px",
                                    background: "#ff3b3b",
                                    border: "none",
                                    borderRadius: "4px",
                                    width: "24px", height: "24px",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    cursor: "pointer",
                                    color: "#fff",
                                }}
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Dialog */}
            {showDialog && (
                <div style={{
                    position: "fixed", inset: 0,
                    background: "rgba(0,0,0,0.75)",
                    backdropFilter: "blur(6px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    zIndex: 50, padding: "16px",
                }}>
                    <div style={{
                        background: "var(--noir-surface)",
                        border: "0.5px solid var(--noir-border)",
                        borderRadius: "8px",
                        padding: "28px",
                        width: "100%",
                        maxWidth: "420px",
                    }}>
                        {/* Dialog header */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                            <div>
                                <div style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "9px",
                                    letterSpacing: "0.15em",
                                    textTransform: "uppercase",
                                    color: "var(--noir-accent)",
                                    marginBottom: "4px",
                                }}>
                                    Image {currentFileIndex + 1}/{pendingFiles.length}
                                </div>
                                <div style={{
                                    fontFamily: "var(--font-display)",
                                    fontWeight: 700,
                                    fontSize: "18px",
                                    color: "var(--noir-white)",
                                    letterSpacing: "-0.01em",
                                }}>
                                    Đặt tên ảnh
                                </div>
                            </div>
                        </div>

                        {/* Preview */}
                        {pendingFiles[currentFileIndex] && (
                            <div style={{ marginBottom: "16px", borderRadius: "5px", overflow: "hidden", border: "0.5px solid var(--noir-border)" }}>
                                <img
                                    src={URL.createObjectURL(pendingFiles[currentFileIndex])}
                                    alt="Preview"
                                    style={{ width: "100%", height: "160px", objectFit: "cover", display: "block", filter: "brightness(0.75)" }}
                                />
                            </div>
                        )}

                        {/* Input */}
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "10px",
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                color: "var(--noir-muted)",
                                display: "block",
                                marginBottom: "8px",
                            }}>
                                Tên slug
                            </label>
                            <input
                                type="text"
                                value={imageName}
                                onChange={e => setImageName(e.target.value)}
                                onBlur={e => setImageName(toSlug(e.target.value))}
                                placeholder="nhap-ten-anh"
                                autoFocus
                                onKeyDown={e => { if (e.key === "Enter") handleConfirmName() }}
                                style={{
                                    width: "100%",
                                    background: "var(--noir-card)",
                                    border: "0.5px solid var(--noir-border)",
                                    borderRadius: "5px",
                                    color: "var(--noir-white)",
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "13px",
                                    padding: "10px 14px",
                                    outline: "none",
                                }}
                                onFocus={e => (e.currentTarget.style.borderColor = "var(--noir-accent)")}
                                // @ts-ignore
                                onBlurCapture={e => (e.currentTarget.style.borderColor = "var(--noir-border)")}
                            />
                            <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--noir-muted)", marginTop: "6px", letterSpacing: "0.05em" }}>
                                Tự động chuyển thành slug
                            </p>
                        </div>

                        {/* Actions */}
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button
                                onClick={handleSkip}
                                className="noir-read-btn-ghost"
                                style={{ flex: 1, justifyContent: "center" }}
                            >
                                Bỏ qua
                            </button>
                            <button
                                onClick={handleConfirmName}
                                className="noir-read-btn"
                                style={{ flex: 1, justifyContent: "center" }}
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
