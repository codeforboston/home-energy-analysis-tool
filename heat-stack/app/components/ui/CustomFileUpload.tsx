import { useRef, useState } from 'react'
import { HelpButton } from './HelpButton'

export function CustomFileUpload({ name }: { name: string }) {
	const [fileName, setFileName] = useState('No file chosen')
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		setFileName(file?.name || 'No file chosen')
	}

	return (
		<div>
			<div className="flex items-center gap-2">
				{/* Visually hidden file input */}
				<input
					data-testid="upload-billing"
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
					className="rounded border bg-gray-100 px-2 py-1 text-sm hover:bg-gray-200"
					onClick={() => fileInputRef.current?.click()}
					aria-label="Upload your energy billing company's bill."
				>
					Choose File
				</button>

				{/* Display filename */}
				<span className="text-sm">{fileName}</span>
				<a
					className="ml-3 inline-flex items-center gap-1 rounded-md border border-transparent bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
					href="https://heatsmartalliance.org/wp-content/uploads/2026/07/HEAT-demo-gas-usage.csv"
				>
					Get demo CSV file
				</a>
				{/* Help icon immediately after filename */}
				<HelpButton keyName="download.help" />
			</div>

			<div className="mb-6 mt-1 text-sm text-gray-600">
				The file must be a CSV.
			</div>
		</div>
	)
}
