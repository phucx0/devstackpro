import { useRef } from "react";
import MarkdownToolbar from "./MarkdownToolbar";

interface MarkdownTextareaInterface {
    content: string,
    onChange: (value: string) => void
}

export default function MarkdownTextarea({ content, onChange } : MarkdownTextareaInterface) {
    // Thêm kiểu markdown
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    // const handleInsert = (value: string) => {
    //     onChange()
    //     setFormData(prev => ({
    //         ...prev,
    //         content_md: (prev?.content_md || "" ) + value
    //     }));
    // };

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

        console.log(newText)
        // handleInputChange({
        //     target: { name: "content_md", value: newText }
        // });
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
            textarea.setSelectionRange(start + selected.length + 2, start + selected.length + 2 + url.length);
        }, 0);
    };


    const buttonMarkdown = "px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition fontsmonos cursor-pointer"

    return (
        <div>
            <div className="flex items-center gap-2 flex-wrap my-2">
                <button onClick={() => applyMarkdown("**")} className={buttonMarkdown}>Bold</button>
                <button onClick={() => applyMarkdown("*")} className={buttonMarkdown}>Italic</button>
                <button onClick={() => applyMarkdown("`")} className={buttonMarkdown}>Code</button>
                <button onClick={() => insertImage()} className={buttonMarkdown}>Image</button>
                <button onClick={() => insertTable()} className={buttonMarkdown}>Table</button>
                <button onClick={() => insertLink()} className={buttonMarkdown}>Link</button>
            </div>
            <textarea
                ref={textareaRef}
                name="content_md"
                value={content ?? ""}
                onChange={(e) => onChange(e.target.value)}
                className="w-full min-h-96 border border-gray-300 rounded-lg px-3.5 py-2.5 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-mono text-sm "
                placeholder="# Tiêu đề&#10;&#10;Nội dung của bạn ở đây...&#10;&#10;## Video&#10;&#10;```&#10;[video-url-here]&#10;```"
            />
        </div>
    )
}