import { ArticlePublish } from "@/public/lib/types";
import { ToggleLikeArticleAction } from "@/server/article-likes/article-likes.action";
import { useState } from "react";

export function useArticleCard(article: ArticlePublish) {
  const [liked, setLiked] = useState(article.is_liked ?? false);
  const [likes, setLikes] = useState(article.likes_count ?? 0);
  const [reposted, setReposted] = useState(false);
  const [reposts, setReposts] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLike = async () => {
    const prevLiked = liked;
    const prevLikes = likes;

     const nextLiked = !prevLiked;

    setLiked(nextLiked);
    setLikes((n) => n + (nextLiked ? 1 : -1));

    try {
        const result = await ToggleLikeArticleAction(article.id);
        // Sync lại với server
        setLiked(result.liked);
        setLikes((n) => {
            const realDiff = result.liked ? 1 : -1;
            const currentDiff = nextLiked ? 1 : -1;

           return n + (realDiff - currentDiff);
        });
    } catch {
        // Rollback nếu lỗi
        setLiked(prevLiked);
        setLikes(prevLikes);
    }
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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  }

  return {
    liked, likes, reposted, reposts,
    menuOpen, setMenuOpen,
    showDeleteDialog, setShowDeleteDialog,
    isDeleting,
    handleLike, handleRepost, handleDelete, toggleMenu
  };
}