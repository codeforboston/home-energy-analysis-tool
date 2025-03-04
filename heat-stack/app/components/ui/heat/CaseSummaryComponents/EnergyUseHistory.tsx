import { Button } from '#/app/components/ui/button.tsx'
import { type UsageDataSchema } from '#/types/types.ts'; 
import { type RecalculateFunction } from '#app/utils/recalculateFromBillingRecordsChange.ts';
import { AnalysisHeader } from './AnalysisHeader.tsx'
import { EnergyUseHistoryChart } from './EnergyUseHistoryChart.tsx'

// import { FieldMetadata, useForm } from '@conform-to/react'
// import { Form, useLocation } from '@remix-run/react'
// import { ErrorList } from "./ErrorList.tsx"
// import { Input } from '#/app/components/ui/input.tsx'
// import { Label } from '#/app/components/ui/label.tsx'

interface EnergyUseHistoryProps 
{
	lastResult: any;
	parsedLastResult: Map<any, any> | undefined;
	usageData: UsageDataSchema;
	setUsageData: React.Dispatch<React.SetStateAction<UsageDataSchema | undefined>>;
	recalculateFn: RecalculateFunction;
	showUsageData: boolean
}

export function EnergyUseHistory({
	lastResult,
	parsedLastResult,
	usageData,
	setUsageData,
	recalculateFn,
	showUsageData
}: EnergyUseHistoryProps) {
	const titleClass = 'text-5xl font-extrabold tracking-wide mt-10'
	// const subtitleClass = 'text-2xl font-semibold text-zinc-950 mt-9'

	return (
		<div>
			<h2 className={`${titleClass} pb-6`}>Energy Use History</h2>

			

			{showUsageData && (
				<>
					<AnalysisHeader usageData={usageData} />
					<EnergyUseHistoryChart usageData={usageData} setUsageData={setUsageData} lastResult={lastResult} parsedLastResult={parsedLastResult} recalculateFn={recalculateFn}/>
					
					{/* Second use of file data has to read upload from JSON, see:
					 https://www.jacobparis.com/content/conform-json-formdata */}
					<Button type="submit" name="intent" value="recalculate" onClick={() => alert("Note: resets checkboxes")}>Re-calculate</Button>
				</>
			)}
		</div>
	)
}
