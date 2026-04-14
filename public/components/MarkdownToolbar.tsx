interface MarkdownToolbarInterface {
    onBold: () => void,
    onItalic: () => void,
    onCode: () => void,
    onImage: () => void
    // onInsert: (text: string) => void
}

export default function MarkdownToolbar({ onBold, onItalic, onCode, onImage}: MarkdownToolbarInterface) {
    return (
        <div className="text-sm text-gray-500 my-2">
            <div>Hỗ trợ Markdown:</div>
            <div className="flex items-center gap-2 flex-wrap mt-1">
                <button
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition font-mono"
                    onClick={() => onBold()}
                >
                    Bold
                </button>
                <button
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition font-mono"
                    onClick={() => onItalic()}
                >
                    Italic
                </button>
                <button
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition font-mono"
                    onClick={() => onCode()}
                >
                    Code
                </button>
                <button
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition font-mono"
                    onClick={() => onImage()}
                >
                    Image
                </button>
            </div>
        </div>
    );
};