import { Upload } from 'lucide-react'

import { Button } from '#/app/components/ui/button.tsx'
import { type usageDataSchema } from '#/types/types.ts'
import { AnalysisHeader } from './AnalysisHeader.tsx'
import { EnergyUseHistoryChart } from './EnergyUseHistoryChart.tsx'

// import { FieldMetadata, useForm } from '@conform-to/react'
// import { Form, useLocation } from '@remix-run/react'
// import { ErrorList } from "./ErrorList.tsx"
// import { Input } from '#/app/components/ui/input.tsx'
// import { Label } from '#/app/components/ui/label.tsx'

export function EnergyUseHistory({
	usage_data,
}: {
	usage_data: usageDataSchema
}) {
	const titleClass = 'text-5xl font-extrabold tracking-wide mt-10'
	// const subtitleClass = 'text-2xl font-semibold text-zinc-950 mt-9'

	return (
		<div>
			<h2 className={`${titleClass} pb-6`}>Energy Use History</h2>

			<input
				id="energy_use_upload"
				aria-label="Upload your energy billing company's bill."
				accept=".xml,.csv,application/xml,text/xml,text/csv,application/csv,application/x-csv,text/comma-separated-values,text/x-comma-separated-values"
				name="energy_use_upload"
				type="file"
			/>
			<Button type="submit">
				<Upload className="mr-2 h-4 w-4" /> Upload
			</Button>

			<a
				className="inline-flex items-center gap-1 rounded-md border border-transparent bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
				href="https://github.com/codeforboston/home-energy-analysis-tool/issues/162#issuecomment-2246594484"
			>
				Get example file here
			</a>

			{usage_data && (
				<>
					<AnalysisHeader usage_data={usage_data} />
					<EnergyUseHistoryChart usage_data={usage_data} />
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