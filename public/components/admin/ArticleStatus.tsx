import { ArticleStatus } from "@/public/lib/types";

interface ArticleStatusProps {
  status: ArticleStatus;
}

export function Status({ status }: ArticleStatusProps) {
  const statusMap: Record<
    string,
    { label: string; color: string; bg: string }
  > = {
    published: {
      label: "Published",
      color: "#e8ff00",
      bg: "rgba(232,255,0,0.08)",
    },
    draft: { label: "Draft", color: "#747470", bg: "rgba(116,116,112,0.1)" },
    hidden: { label: "Hidden", color: "#333330", bg: "rgba(51,51,48,0.15)" },
  };
  const { label, color, bg } = statusMap[status] ?? statusMap.hidden;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[3px] px-2.5 py-[3px] text-[10px] font-medium tracking-[0.12em] uppercase border font-(--font-mono)`}
      style={{
        borderColor: color,
        background: bg,
        color,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: color,
          display: "inline-block",
          flexShrink: 0,
        }}
      />
      {label}
    </span>
  );
}
