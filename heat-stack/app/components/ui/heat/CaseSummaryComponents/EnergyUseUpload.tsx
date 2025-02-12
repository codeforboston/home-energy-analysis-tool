import { Upload } from 'lucide-react'
import { Button } from '#/app/components/ui/button.tsx'


export function EnergyUseUpload() {
    return (
		<div>
			<h3>Upload Energy Use File</h3>

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
		</div>
	)
}