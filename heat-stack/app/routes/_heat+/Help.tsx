import * as Dialog from "@radix-ui/react-dialog"
import { useEffect, useState } from "react"
import { cn } from "#app/utils/misc"

type HelpIconProps = {
    keyName: string
}

export function HelpIcon({ keyName }: HelpIconProps) {
    const [tooltip, setTooltip] = useState("")
    const [htmlContent, setHtmlContent] = useState("")

    // Extracted async function
    const loadTooltipText = async (keyName: string) => {
        try {
            const res = await fetch("/tooltips.txt")
            const text = await res.text()
            const match = text
                .split("\n")
                .find((line) => line.startsWith(`${keyName}:`))
            if (match) {
                const tooltipText = match.split(":").slice(1).join(":").trim()
                setTooltip(tooltipText)
            }
        } catch (error) {
            console.error("Failed to load tooltip text", error)
        }
    }

    const loadHtml = async () => {
        try {
            const res = await fetch(`/help/${keyName}.html`)
            const html = await res.text()
            setHtmlContent(html)
        } catch {
            setHtmlContent("<p>Help not available.</p>")
        }
    }

    // useEffect with async loader
    useEffect(() => {
        void loadTooltipText(keyName)
    }, [keyName])

    return (
        <Dialog.Root onOpenChange={(open) => open && loadHtml()}>
            <Dialog.Trigger asChild>
                <button
                    title={tooltip}
                    className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                >
                    ?
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/30 z-50" />
                <Dialog.Content
                    className={cn(
                        "fixed left-1/2 top-1/2 z-50 max-h-[80vh] w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2",
                        "rounded-lg bg-white p-6 shadow-lg focus:outline-none"
                    )}
                >
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
