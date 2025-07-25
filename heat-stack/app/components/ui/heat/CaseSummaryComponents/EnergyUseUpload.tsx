import { Upload } from 'lucide-react'
import { Button } from '#/app/components/ui/button.tsx'
import { ErrorList } from './ErrorList';

interface EnergyUseUploadProps {
	setScrollAfterSubmit: React.Dispatch<React.SetStateAction<boolean>>;
	setBuildAfterSubmit: React.Dispatch<React.SetStateAction<boolean>>;
	fields: any;
}

export function EnergyUseUpload(
	{ setScrollAfterSubmit, setBuildAfterSubmit, fields }: EnergyUseUploadProps
) {
	const titleClass = 'text-4xl font-bold tracking-wide mt-10'
	/*
	When the calculate button is pressed, sets scrollAfterSubmit to
	true because we want the page to scroll then.
	*/
	const handleSubmit = () => {
		setScrollAfterSubmit(true);
		setBuildAfterSubmit(true);
	}

	const descriptiveClass = 'mt-2 mb-6 text-sm text-slate-500'

	return (
		<fieldset>
			<legend className={`${titleClass} pb-6`}>Energy Use History</legend>
			<ErrorList
				id={fields.energy_use_upload.errorId}
				errors={fields.energy_use_upload.errors}
			/>

			<div className="flex flex-col items-start mb-4">
				<input
					id="energy_use_upload"
					aria-label="Upload your energy billing company's bill."
					accept=".xml,.csv,application/xml,text/xml,text/csv,application/csv,application/x-csv,text/comma-separated-values,text/x-comma-separated-values"
					name={fields.energy_use_upload.name}
					type="file"
					className="h-7"
				/>
				<div className={`${descriptiveClass}`}>The file must be a CSV.</div>
			</div>

			<div>
				{/* Button type submit is processed by action in single.tsx */}
				<Button type="submit" name="intent" value="upload" onClick={handleSubmit} style={{ marginBottom: '20px' }}>
					<Upload className="mr-2 h-4 w-4" />Calculate
				</Button>

				<a
					className="ml-3 inline-flex items-center gap-1 rounded-md border border-transparent bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
					href="https://github.com/codeforboston/home-energy-analysis-tool/issues/162#issuecomment-2246594484"
				>
					Get example file here
				</a>
			</div>
		</fieldset>
	)
}
