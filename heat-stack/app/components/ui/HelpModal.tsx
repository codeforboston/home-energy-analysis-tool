import * as Dialog from "@radix-ui/react-dialog"
import { marked } from "marked"
import { useEffect, useState } from "react"

type HelpModalProps = {
    keyName: string
    open: boolean
    onClose: () => void
}

export function HelpModal({ keyName, open, onClose }: HelpModalProps) {
    const [htmlContent, setHtmlContent] = useState("")
    useEffect(() => {
        if (!open) return

        const loadMarkdown = async () => {
            try {
                const res = await fetch(`/help/${keyName}.md`)
                const markdown = await res.text()
                const html = marked(markdown)
                setHtmlContent(html)
            } catch {
                setHtmlContent("<p>Help not available.</p>")
            }
        }

        void loadMarkdown()
    }, [keyName, open])

    return (
        <Dialog.Root open={open} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/30 z-50" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[80vh] w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg focus:outline-none">
                    <Dialog.Title className="mb-4 text-lg font-semibold">Help</Dialog.Title>
                    <div
                        className="prose max-w-none overflow-y-auto"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                    <Dialog.Close asChild>
                        <button className="mt-4 text-sm text-blue-600 hover:underline">Close</button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
