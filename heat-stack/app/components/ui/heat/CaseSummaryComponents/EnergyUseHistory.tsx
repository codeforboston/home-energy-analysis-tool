import { Upload } from 'lucide-react'
import { Suspense, /* lazy */ } from 'react'

import { Button } from '#/app/components/ui/button.tsx'
import { AnalysisHeader } from './AnalysisHeader.tsx'
import { EnergyUseHistoryChart } from './EnergyUseHistoryChart.tsx'

// import { FieldMetadata, useForm } from '@conform-to/react'
// import { Form, useLocation } from '@remix-run/react'
// import { ErrorList } from "./ErrorList.tsx"
// import { Input } from '#/app/components/ui/input.tsx'
// import { Label } from '#/app/components/ui/label.tsx'


// export function EnergyUseHistory(props: EnergyUseProps) {
export function EnergyUseHistory() {
	const titleClass = 'text-5xl font-extrabold tracking-wide mt-10'
	// const subtitleClass = 'text-2xl font-semibold text-zinc-950 mt-9'

	return (
		
		<div>
			<h2 className={`${titleClass}`}>Energy Use History</h2>
			<div>
				<Suspense fallback={'<div>Blah</div>'}>
					<input
						id="energy_use_upload"
						aria-label="Upload your energy billing company's bill."
						//onChange
						accept=".xml,.csv,application/xml,text/xml,text/csv,application/csv,application/x-csv,text/comma-separated-values,text/x-comma-separated-values"
						name="energy_use_upload"
						type="file"
					/>
					<Button type="submit"> <Upload className="h-4 w-4 mr-2" /> Upload</Button>
				</Suspense>
			</div>
			<AnalysisHeader />
			<EnergyUseHistoryChart />
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