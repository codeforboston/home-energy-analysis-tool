import * as Dialog from "@radix-ui/react-dialog";
import { marked, Renderer } from "marked";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

type ModalProps = {
    keyName: string;
    open: boolean;
    onClose: () => void;
};

// Custom renderer to make links open in new tabs
const renderer = new Renderer();
renderer.link = function (href, title, text) {
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" title="${title ?? ""}">${text}</a>`;
};

export function ModalFromMarkDown({ keyName, open, onClose }: ModalProps) {
    const [htmlContent, setHtmlContent] = useState("");
    const [title, setTitle] = useState("Help");

    useEffect(() => {
        if (!open) return;

        const loadMarkdown = async () => {
            try {
                const res = await fetch(`/help/${keyName}.md`);
                const raw = await res.text();
                console.log("debug markdown", raw);
                console.log("key", keyName)

                const lines = raw.split("\n");

                let extractedTitle = "Help";
                let markdownStartIndex = -1;

                // Extract title and find "markdown:" line
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i] || "";
                    if (line.startsWith("title:")) {
                        extractedTitle = line.replace("title:", "").trim();
                    } else if (line.startsWith("markdown:")) {
                        // Remove just the "markdown:" label and keep rest of the line
                        lines[i] = line.replace("markdown:", "").trim();
                        markdownStartIndex = i;
                        break;
                    }
                }

                if (markdownStartIndex === -1) {
                    throw new Error("Missing 'markdown:' in help file.");
                }

                const markdownBody = lines.slice(markdownStartIndex).join("\n");
                const html = marked(markdownBody, { renderer });

                setTitle(extractedTitle);
                setHtmlContent(html);
            } catch (error) {
                console.error("Error loading markdown:", error);
                setTitle("Help");
                setHtmlContent("<p>Help not available.</p>");
            }
        };

        void loadMarkdown();
    }, [keyName, open]);

    return (
        <Dialog.Root open={open} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/30 z-50" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[80vh] w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-lg focus:outline-none overflow-hidden">
                    {/* Blue Title Bar */}
                    <div className="bg-blue-600 text-white px-6 py-3 font-semibold text-lg">
                        {title}
                    </div>

                    {/* Close (×) icon */}
                    <Dialog.Close
                        className="absolute right-4 top-4 rounded-sm p-1 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-ring"
                        aria-label="Close"
                        type="button"
                    >
                        <X className="h-5 w-5" />
                    </Dialog.Close>

                    {/* Markdown content */}
                    <div className="prose max-w-none px-6 py-4 overflow-y-auto max-h-[calc(80vh-100px)]">
                        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                    </div>

                    {/* Close button */}
                    <div className="px-6 pb-4 text-right">
                        <button
                            onClick={onClose}
                            className="mt-2 inline-flex items-center rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
                            type="button"
                        >
                            Close
                        </button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
