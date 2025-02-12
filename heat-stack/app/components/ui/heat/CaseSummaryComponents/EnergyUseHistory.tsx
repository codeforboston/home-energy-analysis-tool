import { Upload } from 'lucide-react'

import { Button } from '#/app/components/ui/button.tsx'
import { BillingRecordsSchema, type UsageDataSchema } from '#/types/types.ts'; 
import { AnalysisHeader } from './AnalysisHeader.tsx'
import { EnergyUseHistoryChart } from './EnergyUseHistoryChart.tsx'
import { EnergyUseUpload } from './EnergyUseUpload.tsx';

// import { FieldMetadata, useForm } from '@conform-to/react'
// import { Form, useLocation } from '@remix-run/react'
// import { ErrorList } from "./ErrorList.tsx"
// import { Input } from '#/app/components/ui/input.tsx'
// import { Label } from '#/app/components/ui/label.tsx'

interface EnergyUseHistoryProps 
{
	lastResult: any;
	parsedLastResult: Map<any, any> | undefined;
	usage_data: UsageDataSchema;
	recalculateFn: (billingRecords: BillingRecordsSchema) => void;
	show_usage_data: boolean
}

export function EnergyUseHistory({
	lastResult,
	parsedLastResult,
	usage_data,
	recalculateFn,
	show_usage_data
}: EnergyUseHistoryProps) {
	const titleClass = 'text-5xl font-extrabold tracking-wide mt-10'
	// const subtitleClass = 'text-2xl font-semibold text-zinc-950 mt-9'

	return (
		<div>
			<h2 className={`${titleClass} pb-6`}>Energy Use History</h2>

			

			{show_usage_data && (
				<>
					<AnalysisHeader usage_data={usage_data} />
					<EnergyUseHistoryChart usage_data={usage_data} lastResult={lastResult} parsedLastResult={parsedLastResult} recalculateFn={recalculateFn}/>
					<Button type="submit">Re-calculate</Button>
				</>
			)}
		</div>
	)
}

// const file = event.target.files?.[0]

// if (file) {
// 	const reader = new FileReader()
// 	reader.onloadend = () => {
// 		setPreviewImage(reader.result as string)
// 	}
// 	reader.readAsDataURL(file)
// } else {
// 	setPreviewImage(null)
// }