import { useRef, useState } from "react"
import { HelpButton } from "./HelpButton"

export function CustomFileUpload({ name }: { name: string }) {
    const [fileName, setFileName] = useState("No file chosen")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        setFileName(file?.name || "No file chosen")
    }

    return (
        <div>
            <div className="flex items-center gap-2">
                {/* Visually hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xml,.csv,application/xml,text/xml,text/csv,application/csv,application/x-csv,text/comma-separated-values,text/x-comma-separated-values"
                    name={name}
                    onChange={handleFileChange}
                    className="hidden"
                />

                {/* Custom label to trigger the file input */}
                <button
                    type="button"
                    className="px-2 py-1 border rounded text-sm bg-gray-100 hover:bg-gray-200"
                    onClick={() => fileInputRef.current?.click()}
                >
                    Choose File
                </button>

                {/* Display filename */}
                <span className="text-sm">{fileName}</span>

                {/* Help icon immediately after filename */}
                <HelpButton keyName="download" />
            </div>

            <div className="mt-1 text-sm text-gray-600">The file must be a CSV.</div>
        </div>
    )
}
