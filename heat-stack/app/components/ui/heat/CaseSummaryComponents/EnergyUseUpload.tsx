import { FileUp, Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '#/app/components/ui/button.tsx'
import { ErrorList } from './ErrorList'

interface EnergyUseUploadProps {
	setScrollAfterSubmit: React.Dispatch<React.SetStateAction<boolean>>
	fields: any
}

export function EnergyUseUpload({
	setScrollAfterSubmit,
	fields,
}: EnergyUseUploadProps) {
	const titleClass = 'text-4xl font-bold tracking-wide mt-10'
	/*
	When the calculate button is pressed, sets scrollAfterSubmit to
	true because we want the page to scroll then.
	*/
	const handleSubmit = () => {
		setScrollAfterSubmit(true)
	}

	const descriptiveClass = 'mt-2 mb-6 text-xs text-slate-500'

	// useRef to access the file input element
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [fileName, setFileName] = useState<String>('')

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files ? e.target.files[0] : null
		if (file) {
			console.log('Selected file:', file.name)
		}
	}

	return (
		<fieldset className="w-full">
			<legend className={`${titleClass} pb-6`}>Energy Use History</legend>

			<div className="mb-4 flex flex-col items-start">
				<Button
					type="button"
					onClick={() => fileInputRef.current?.click()}
					className="bg-teal-500 py-6"
				>
					<FileUp className="h-6 w-6" />
					<span className="ml-2"> Click to upload CSV</span>
				</Button>
				<ErrorList
					id={fields.energy_use_upload.errorId}
					errors={fields.energy_use_upload.errors}
				/>
				<input
					ref={fileInputRef}
					onChange={() => handleFileChange}
					hidden
					id="energy_use_upload"
					aria-label="Upload your energy billing company's bill."
					accept=".xml,.csv,application/xml,text/xml,text/csv,application/csv,application/x-csv,text/comma-separated-values,text/x-comma-separated-values"
					type="file"
					name={fields.energy_use_upload.name}
					className="h-7"
				/>
			</div>

			<div className="flex justify-end">
				{/* Button type submit is processed by action in single.tsx */}
				<Button
					className="bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-6"
					type="submit"
					name="intent"
					value="upload"
					onClick={handleSubmit}
					style={{ marginBottom: '20px' }}
				>
					<Upload className="mr-2 h-4 w-4" />
					Calculate
				</Button>
				{/*
				#idk if we neeed this 
				<div className="">
					<a
						target="_blank"
						className="ml-3 inline-flex items-center gap-1 rounded-md border border-transparent bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
						href="https://github.com/codeforboston/home-energy-analysis-tool/issues/162#issuecomment-2246594484"
					>
						Get example file here
					</a>
				</div> */}
			</div>
		</fieldset>
	)
}
