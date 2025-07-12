import { useState } from "react"
import { HelpModal } from "./HelpModal"

type HelpButtonProps = {
    keyName: string
}

export function HelpButton({ keyName }: HelpButtonProps) {
    const [modalOpen, setModalOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setModalOpen(true)}
                className="text-sm text-blue-600 hover:underline"
            >
                Get Help
            </button>
            <HelpModal
                keyName={keyName}
                open={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </>
    )
}
