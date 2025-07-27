import * as Dialog from "@radix-ui/react-dialog"
import { marked, Renderer } from "marked"
import { useEffect, useState } from "react"
import { Button } from "./button"
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
