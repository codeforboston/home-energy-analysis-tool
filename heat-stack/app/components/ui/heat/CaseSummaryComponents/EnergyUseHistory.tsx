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
	showUsageData: boolean;
	scrollAfterSubmit: boolean;
	setScrollAfterSubmit: React.Dispatch<React.SetStateAction<boolean>>;
}

export function EnergyUseHistory({
	lastResult,
	parsedLastResult,
	usageData,
	setUsageData,
	recalculateFn,
	showUsageData,
	scrollAfterSubmit,
	setScrollAfterSubmit
}: EnergyUseHistoryProps) {
	return (
		<div>
			{showUsageData && (
				<>
					<AnalysisHeader 
						usageData={usageData} 
						scrollAfterSubmit={scrollAfterSubmit} 
						setScrollAfterSubmit={setScrollAfterSubmit} 
					/>
					<EnergyUseHistoryChart 
						usageData={usageData} 
						setUsageData={setUsageData} 
						lastResult={lastResult} 
						parsedLastResult={parsedLastResult} 
						recalculateFn={recalculateFn}
					/>
				</>
			)}
		</div>
	)
}
