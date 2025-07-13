import * as Dialog from "@radix-ui/react-dialog"
import { marked, Renderer } from "marked"
import { useEffect, useState } from "react"
import { Button } from "./button"

type HelpModalProps = {
    keyName: string
    open: boolean
    onClose: () => void
}


// Create a custom renderer
const renderer = new Renderer()
renderer.link = function (href, title, text) {
    // Return the link with target="_blank" and rel="noopener noreferrer"
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" title="${title ?? ""}">${text}</a>`
}

export function HelpModal({ keyName, open, onClose }: HelpModalProps) {
    const [htmlContent, setHtmlContent] = useState("")
    useEffect(() => {
        if (!open) return

        const loadMarkdown = async () => {
            try {
                const res = await fetch(`/help/${keyName}.md`)
                const markdown = await res.text()
                const html = marked(markdown, { renderer })
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
                        <Button>Close</Button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
