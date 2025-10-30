import { Upload } from 'lucide-react'
import { Button } from '#/app/components/ui/button.tsx'
import { CustomFileUpload } from '#app/components/ui/CustomFileUpload'
import { ErrorList } from './ErrorList';

interface EnergyUseUploadProps {
	setScrollAfterSubmit: React.Dispatch<React.SetStateAction<boolean>>;
	fields: any;
	isEditMode?: boolean;
}

export function EnergyUseUpload(
	{ setScrollAfterSubmit, fields, isEditMode = false }: EnergyUseUploadProps
) {
	const titleClass = 'text-4xl font-bold tracking-wide mt-10'
	/*
	When the calculate button is pressed, sets scrollAfterSubmit to
	true because we want the page to scroll then.
	*/
	const handleSubmit = () => {
		setScrollAfterSubmit(true);
	}


	return (
		<fieldset>
			<legend className={`${titleClass} pb-6`}>Energy Use History</legend>
			{/* Only show file upload errors if not in edit mode, or if in edit mode but errors exist and user is trying to process a file */}
			{!isEditMode && (
				<ErrorList
					id={fields.energy_use_upload.errorId}
					errors={fields.energy_use_upload.errors}
				/>
			)}

			<CustomFileUpload
				name={fields.energy_use_upload.name}
			/>

			<div>
				{isEditMode ? (
					// Two buttons for edit mode
					<div className="flex gap-3 items-center" style={{ marginBottom: '20px' }}>
						<Button 
							type="submit" 
							name="intent" 
							value="save" 
							variant="default"
							onClick={() => console.log('💾 Save Changes button clicked')}
						>
							Save Changes
						</Button>
						<Button type="submit" name="intent" value="process-file" onClick={handleSubmit}>
							<Upload className="mr-2 h-4 w-4" />
							Process New File
						</Button>
					</div>
				) : (
					// Single button for new cases
					<Button type="submit" name="intent" value="upload" onClick={handleSubmit} style={{ marginBottom: '20px' }}>
						<Upload className="mr-2 h-4 w-4" />
						Calculate
					</Button>
				)}

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
