/**
 * Format thời gian bài viết theo dạng relative (time ago) hoặc ngày cụ thể.
 *
 * Rule hiển thị:
 * - < 1 phút      → "Just now"
 * - < 60 phút     → "Xm ago"
 * - < 24 giờ      → "Xh ago"
 * - < 7 ngày      → "Xd ago"
 * - >= 7 ngày     → format dạng "Apr 28, 2026"
 *
 * @param dateString - Chuỗi ngày giờ (ISO string hoặc format parse được bởi Date)
 * @returns Chuỗi thời gian đã format để hiển thị UI
 *
 * Lưu ý:
 * - Phụ thuộc vào timezone của môi trường (client/server)
 * - Nên đảm bảo `dateString` là ISO (có timezone) để tránh lệch giờ
 */
export function formatArticleTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}