"use client";

import { useMemo, useState } from "react";
import { UpdateArticleRequest, Tag } from "@/public/lib/types";
import { updateArticleAction } from "@/server/articles/articles.private.action";
import { useFileUpload } from "@/hooks/useFileUpload";
import { toast } from "sonner";
import { ArticleHeader } from "./ArticleHeader";
import { ArticleFields } from "./ArticleFields";
import { ArticleContent } from "./ArticleContent";
import { ArticleSidebar } from "./ArticleSidebar";

interface Props {
  initialArticle: UpdateArticleRequest;
}

export function UpdateArticleForm({ initialArticle }: Props) {
  const [originalArticle, setOriginalArticle] = useState(initialArticle);
  const [updatedArticle, setUpdatedArticle] = useState(initialArticle);
  const [selectedTags, setSelectedTags] = useState<Pick<Tag, "id" | "name">[]>(
    initialArticle.tags ?? [],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { uploadFile } = useFileUpload();

  const isChanged = useMemo(() => {
    return (
      originalArticle.title !== updatedArticle.title ||
      originalArticle.content_md !== updatedArticle.content_md ||
      originalArticle.slug !== updatedArticle.slug ||
      originalArticle.description !== updatedArticle.description ||
      originalArticle.status !== updatedArticle.status ||
      originalArticle.thumbnail !== updatedArticle.thumbnail
    );
  }, [originalArticle, updatedArticle]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setUpdatedArticle((prev) => {
      if (!prev) return prev;
      const next: any = { ...prev, [name]: value };
      if (name === "title") {
        next.slug = value
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[đĐ]/g, "d")
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim();
      }
      return next;
    });
  };

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) return void toast.warning("Images only!");
    if (file.size > 10 * 1024 * 1024) return void toast.warning("Max file size is 10MB.");
    try {
      const { fileKey, success } = await uploadFile(file, "image");
      if (success) {
        toast.success("Thumbnail uploaded successfully");
        setUpdatedArticle((p) => (p ? { ...p, thumbnail: fileKey } : p));
      } else {
        toast.error("Thumbnail upload failed");
      }
    } catch (error: any) {
      toast.error("Upload error: " + error.message);
    }
  };

  const handleRemoveThumbnail = () =>
    setUpdatedArticle((p) => (p ? { ...p, thumbnail: undefined } : p));

  const handleSubmit = async () => {
    if (!updatedArticle || !isChanged) return;
    setIsSubmitting(true);
    try {
      const result = await updateArticleAction(updatedArticle);
      if (result) {
        setOriginalArticle(updatedArticle);
        toast.success("Article updated successfully!");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-4 w-full font-body">
      <ArticleHeader
        showPreview={showPreview}
        isChanged={isChanged}
        isSubmitting={isSubmitting}
        onTogglePreview={() => setShowPreview((p) => !p)}
        onSave={handleSubmit}
      />

      <main className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-5">
        <ArticleContent
          article={updatedArticle}
          showPreview={showPreview}
          onInputChange={handleInputChange}
          onContentChange={(text) =>
            setUpdatedArticle((p) => (p ? { ...p, content_md: text } : p))
          }
        />
        <ArticleSidebar
          article={updatedArticle}
          selectedTags={selectedTags}
          onInputChange={handleInputChange}
          onTagsChange={setSelectedTags}
          onUpload={handleUpload}
          onRemoveThumbnail={handleRemoveThumbnail}
        />
      </main>
    </div>
  );
}