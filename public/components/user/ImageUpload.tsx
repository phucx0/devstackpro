import { Upload, X } from "lucide-react";
import {
  useRef,
  useState,
  useCallback,
  DragEvent,
  ClipboardEvent,
  ChangeEvent,
} from "react";

interface ImageUploadProps {
  label: string;
  thumbnailUrl: string | null;
  onChange?: (file: File) => void;
  onRemove?: () => void;
}

export default function ImageUpload({
  label,
  thumbnailUrl,
  onChange,
  onRemove,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      setPreview(url);
      onChange?.(file);
    },
    [onChange],
  );

  // Drag
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  // Paste
  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    const file = Array.from(e.clipboardData.items)
      .find((item) => item.type.startsWith("image/"))
      ?.getAsFile();
    if (file) handleFile(file);
  };

  // Click to pick file
  const handleClick = () => inputRef.current?.click();
  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // reset so same file can be re-selected
    e.target.value = "";
  };

  // Remove
  const handleRemove = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    onRemove?.();
  };

  const displayUrl =
    preview ??
    (thumbnailUrl ? process.env.NEXT_PUBLIC_URL_IMAGE + thumbnailUrl : null);

  return (
    <div className="p-6 rounded-sm border border-(--noir-border) bg-(--noir-surface)">
      <label className="block font-mono text-[10px] uppercase text-(--noir-muted) mb-2">
        {label}
      </label>

      {displayUrl ? (
        <div className="relative">
          <img
            src={displayUrl}
            alt="preview"
            className="w-full aspect-video object-cover rounded"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <div
          tabIndex={0}
          role="button"
          aria-label="Upload image"
          onClick={handleClick}
          onPaste={handlePaste}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onKeyDown={(e) => e.key === "Enter" && handleClick()}
          className={`
                flex flex-col items-center justify-center aspect-video
                border border-dashed rounded cursor-pointer gap-2
                transition-colors outline-none
                focus-visible:ring-2 focus-visible:ring-(--noir-border)
                ${
                  isDragging
                    ? "border-(--noir-muted) bg-(--noir-border)"
                    : "border-(--noir-border) hover:border-(--noir-muted)"
                }
            `}
        >
          <Upload
            size={20}
            className={isDragging ? "scale-110 transition-transform" : ""}
          />
          <span className="text-[10px] uppercase font-mono text-(--noir-muted) text-center leading-relaxed">
            {isDragging ? "Thả ảnh vào đây" : "Kéo thả · Dán · Chọn file"}
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
          />
        </div>
      )}
    </div>
  );
}
