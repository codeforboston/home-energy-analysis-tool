import { ModalFromMarkDown } from "./ModalFromMarkdown"

type HelpModalProps = {
    keyName: string
    open: boolean
    onClose: () => void
}


export function HelpModal({ keyName, open, onClose }: HelpModalProps) {
    return (<ModalFromMarkDown 
        keyName={keyName+".help"}
        open={open}
        onClose={onClose} 
        />
    )
}
