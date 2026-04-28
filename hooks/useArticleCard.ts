import { ArticlePublish } from "@/public/lib/types";
import { useState } from "react";

export function useArticleCard(article: ArticlePublish) {
  const [liked, setLiked] = useState(article.is_liked ?? false);
  const [likes, setLikes] = useState(article.likes_count ?? 0);
  const [reposted, setReposted] = useState(false);
  const [reposts, setReposts] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLike = () => {
    setLiked((v) => !v);
    setLikes((n) => (liked ? n - 1 : n + 1));
  };

  const handleRepost = () => {
    setReposted((v) => !v);
    setReposts((n) => (reposted ? n - 1 : n + 1));
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    // delete logic here
    setIsDeleting(false);
    setShowDeleteDialog(false);
  };

  return {
    liked, likes, reposted, reposts,
    menuOpen, setMenuOpen,
    showDeleteDialog, setShowDeleteDialog,
    isDeleting,
    handleLike, handleRepost, handleDelete,
  };
}