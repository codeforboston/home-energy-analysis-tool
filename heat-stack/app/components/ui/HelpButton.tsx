import { HelpCircle } from "lucide-react"
import { useState } from "react"
import { ModalFromMarkDown } from "./ModalFromMarkdown"

type HelpButtonProps = {
    keyName: string
}


export function HelpButton({ keyName }: HelpButtonProps) {
    const [modalOpen, setModalOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setModalOpen(true)}
                className="text-sm"
            >
                <HelpCircle size={18} /> {/* 18px icon size */}
        </button>
            <ModalFromMarkDown
                keyName={keyName}
                open={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </>
    )
}
