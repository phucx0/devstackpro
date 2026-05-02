import { useRef } from "react";

interface MarkdownTextareaInterface {
  content: string;
  onChange: (value: string) => void;
}

export default function MarkdownTextarea({
  content,
  onChange,
}: MarkdownTextareaInterface) {
  // Thêm kiểu markdown
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const applyMarkdown = (wrapper: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const selected = content?.slice(start, end);
    const before = content?.slice(0, start);
    const after = content?.slice(end);

    // markdown kiểu **bold**, *italic*, `code`
    const newText = `${before}${wrapper}${selected}${wrapper}${after}`;

    onChange(newText);
    setTimeout(() => {
      textarea.setSelectionRange(start + wrapper.length, end + wrapper.length);
      textarea.focus();
    }, 0);
  };

  // Chèn image markdown
  const insertImage = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end) || "description";
    const before = content.slice(0, start);
    const after = content.slice(end);

    const newText = `${before}![${selected}](${selected})${after}`;
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 2, start + 2 + selected.length);
    }, 0);
  };

  // Chèn table mẫu
  const insertTable = () => {
    const tableMarkdown = `
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
    `;
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const before = content.slice(0, start);
    const after = content.slice(start);

    const newText = `${before}${tableMarkdown}${after}`;
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + tableMarkdown.length);
    }, 0);
  };

  // Chèn link markdown
  const insertLink = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end) || "link-text"; // nếu không chọn gì thì dùng placeholder
    const url = "https://"; // mặc định url placeholder

    const before = content.slice(0, start);
    const after = content.slice(end);

    const newText = `${before}[${selected}](${url})${after}`;
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      // đặt caret vào vị trí url để người dùng nhập link thực
      textarea.setSelectionRange(
        start + selected.length + 2,
        start + selected.length + 2 + url.length,
      );
    }, 0);
  };

  const buttonMarkdown =
    "text-sm px-2 py-1 noir-card rounded transition fontsmonos cursor-pointer";

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap my-2">
          <button
            onClick={() => applyMarkdown("**")}
            className={buttonMarkdown}
          >
            Bold
          </button>
          <button onClick={() => applyMarkdown("*")} className={buttonMarkdown}>
            Italic
          </button>
          <button onClick={() => applyMarkdown("`")} className={buttonMarkdown}>
            Code
          </button>
          <button onClick={() => insertImage()} className={buttonMarkdown}>
            Image
          </button>
          <button onClick={() => insertTable()} className={buttonMarkdown}>
            Table
          </button>
          <button onClick={() => insertLink()} className={buttonMarkdown}>
            Link
          </button>
        </div>
      </div>
      <textarea
        ref={textareaRef}
        name="content_md"
        value={content ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-96 border border-(--noir-border) outline-none rounded-lg px-3.5 py-2.5 text-white placeholder-gray-400font-mono text-sm "
        placeholder="Write someting..."
      />
    </div>
  );
}
