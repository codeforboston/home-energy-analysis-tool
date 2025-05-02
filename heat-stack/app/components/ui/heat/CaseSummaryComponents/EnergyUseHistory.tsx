import { Button } from '#/app/components/ui/button.tsx'
import { type UsageDataSchema } from '#/types/types.ts'; 
import { type RecalculateFunction } from '#app/utils/recalculateFromBillingRecordsChange.ts';
import { AnalysisHeader } from './AnalysisHeader.tsx'
import { EnergyUseHistoryChart } from './EnergyUseHistoryChart.tsx'
import { useEffect } from 'react'

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
	showUsageData: boolean;
	dataLoaded: boolean;
	setDataLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}

export function EnergyUseHistory({
	lastResult,
	parsedLastResult,
	usageData,
	setUsageData,
	recalculateFn,
	showUsageData,
	dataLoaded,
	setDataLoaded
}: EnergyUseHistoryProps) {
	// const subtitleClass = 'text-2xl font-semibold text-zinc-950 mt-9'

	/*
	Resets dataLoaded to true every time it gets changed to false because 
	EnergyUseUpload changes it to false when the calculate button is pressed.

	This useEffect is part of a state machine to manage automatic scrolling
	after the user clicks the calculate button, with other, likewise-marked code
	single.tsx and EnergyUseUpload.tsx.  Do not change it lightly, but if
	you must, look for SCROLLING STATE MACHINE to find the other parts.
	*/
	useEffect(() => {
		setDataLoaded(true)
	}, [dataLoaded, setDataLoaded]);

	return (
		<div>
			{showUsageData && (
				<>
					<AnalysisHeader usageData={usageData} />
					<EnergyUseHistoryChart usageData={usageData} setUsageData={setUsageData} lastResult={lastResult} parsedLastResult={parsedLastResult} recalculateFn={recalculateFn}/>
				</>
			)}
		</div>
	)
}
