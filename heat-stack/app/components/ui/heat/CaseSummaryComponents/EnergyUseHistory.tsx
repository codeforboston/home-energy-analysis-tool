import { Upload } from 'lucide-react'
import { useNavigation } from 'react-router'
import { Button } from '#/app/components/ui/button.tsx'
import { Spinner } from '#app/components/spinner.tsx'
import { CustomFileUpload } from '#app/components/ui/CustomFileUpload'
import { EnergyUseHistoryChart } from './EnergyUseHistoryChart'
import { ErrorList } from './ErrorList'


interface EnergyUseHistoryProps {
    setScrollAfterSubmit: React.Dispatch<React.SetStateAction<boolean>>
    fields: any
    showUsageData?: boolean
    isEditMode?: boolean
    usageData?: any
    chartClickHandler?: (index:number)=>void
}

export function EnergyUseHistory({
    setScrollAfterSubmit,
    fields,
    showUsageData = false,
    isEditMode = false,
    usageData = null,
    chartClickHandler = ()=>{}
}: EnergyUseHistoryProps) {
    const titleClass = 'text-4xl font-bold tracking-wide mt-10'
    const navigation = useNavigation()
    const isIdle = navigation.state === 'idle'

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
            {/* Only show file upload errors if not in edit mode, or if in edit mode but errors exist and user is trying to process a file */}
            {!isEditMode && (
                <ErrorList
                    id={fields.energy_use_upload.errorId}
                    errors={fields.energy_use_upload.errors}
                />
            )}

            {!isEditMode && 
                <div>
                    <CustomFileUpload name={fields.energy_use_upload.name} />
                    <div>
                        <Button
                            type="submit"
                            name="intent"
                            value={isEditMode?"save":"upload"}
                            disabled={!isIdle}
                            onClick={handleSubmit}
                            style={{ marginBottom: '20px' }}
                        >
                            {isIdle && <Upload className="mr-2 h-4 w-4" />}
                            <Spinner showSpinner={!isIdle} />
                            Calculate
                        </Button>
                        <a
                            className="ml-3 inline-flex items-center gap-1 rounded-md border border-transparent bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            href="https://github.com/codeforboston/home-energy-analysis-tool/issues/162#issuecomment-2246594484"
                        >
                            Get example file here
                        </a>
                    </div>
                </div>
            }

            {showUsageData && usageData && 
                <EnergyUseHistoryChart
                    usageData={usageData}
                    onClick={chartClickHandler}
                />
            }
        </fieldset>
    )
}
