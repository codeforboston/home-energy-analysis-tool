import { Upload } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigation } from 'react-router'
import { Button } from '#/app/components/ui/button.tsx'
import { Spinner } from '#app/components/spinner.tsx'
import { CustomFileUpload } from '#app/components/ui/CustomFileUpload'
import { ErrorModal } from '#app/components/ui/ErrorModal.tsx'
import { EnergyUseHistoryChart } from './EnergyUseHistoryChart'

interface EnergyUseHistoryProps {
	setScrollAfterSubmit: React.Dispatch<React.SetStateAction<boolean>>
	fields: any
	showUsageData?: boolean
	isEditMode?: boolean
	usageData?: any
	chartClickHandler?: (index: number) => void
}

/**
 * Shown to the user when the energy-use file fails the form's client-side
 * validation (no file chosen, or the browser handed us something that isn't a
 * file). The raw conform message for this is just "Invalid input", which means
 * nothing to a homeowner, so we surface this friendlier copy in the shared
 * error modal instead of printing it next to the field.
 */
const FILE_REQUIRED_MESSAGE =
	'Please choose your energy-use history file before clicking Calculate.\n\n' +
	'Download it as a CSV from your energy utility company (for example ' +
	'Eversource or National Grid), then upload it here.'

export function EnergyUseHistory({
	setScrollAfterSubmit,
	fields,
	showUsageData = false,
	isEditMode = false,
	usageData = null,
	chartClickHandler = () => {},
}: EnergyUseHistoryProps) {
	const titleClass = 'text-4xl font-bold tracking-wide mt-10'
	const navigation = useNavigation()
	const isIdle = navigation.state === 'idle'

	// Open the modal whenever the file field picks up a validation error, and
	// close it again once the user selects a valid file (conform revalidates
	// on input, clearing the error).
	const fileErrorKey: string = (fields.energy_use_upload.errors ?? []).join('|')
	const [showFileErrorModal, setShowFileErrorModal] = useState(false)
	useEffect(() => {
		setShowFileErrorModal(!isEditMode && fileErrorKey.length > 0)
	}, [isEditMode, fileErrorKey])

	/*
    When the calculate button is pressed, sets scrollAfterSubmit to
    true because we want the page to scroll then.
    */
	const handleSubmit = () => {
		setScrollAfterSubmit(true)
	}

	return (
		<fieldset>
			<legend className={`${titleClass} pb-6`}>Energy Use History</legend>

			{!isEditMode && (
				<div>
					<CustomFileUpload name={fields.energy_use_upload.name} />
					<Button
						type="submit"
						name="intent"
						value={isEditMode ? 'save' : 'upload'}
						disabled={!isIdle}
						onClick={handleSubmit}
						style={{ marginBottom: '20px' }}
					>
						{isIdle && <Upload className="mr-2 h-4 w-4" />}
						<Spinner showSpinner={!isIdle} />
						Calculate
					</Button>
				</div>
			)}

			{showUsageData && usageData && (
				<EnergyUseHistoryChart
					usageData={usageData}
					onClick={chartClickHandler}
				/>
			)}

			<ErrorModal
				isOpen={showFileErrorModal}
				onClose={() => setShowFileErrorModal(false)}
				title="Upload Error"
				message={FILE_REQUIRED_MESSAGE}
			/>
		</fieldset>
	)
}
