import { Upload } from 'lucide-react'
import { useRef } from 'react'
import { Button } from '#/app/components/ui/button.tsx'


export function EnergyUseUpload() {
	const titleClass = 'text-4xl font-bold tracking-wide mt-10'
	const targetRef = useRef<HTMLDivElement>(null);

	const handleClick = () => {
		console.log("EnergyUseUpload:9 scrolling down");
		if (targetRef.current) {
			targetRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	};

    return (
		<fieldset>
			<legend className={`${titleClass} pb-6`}>Energy Use History</legend>

			<input
				id="energy_use_upload"
				aria-label="Upload your energy billing company's bill."
				accept=".xml,.csv,application/xml,text/xml,text/csv,application/csv,application/x-csv,text/comma-separated-values,text/x-comma-separated-values"
				name="energy_use_upload"
				type="file"
				className="h-20"
			/>

			<div>
				<Button type="button" style={{ marginBottom: '20px' }} onClick={handleClick}>
					<Button className="mr-2 h-4 w-4" />Scroll down
				</Button>
			</div>
			<div>
				{/* Button type submit is processed by action in single.tsx */}
				
				<Button type="submit" name="intent" value="upload">
					<Upload className="mr-2 h-4 w-4" />Calculate
				</Button>

				<a
					className="ml-3 inline-flex items-center gap-1 rounded-md border border-transparent bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
					href="https://github.com/codeforboston/home-energy-analysis-tool/issues/162#issuecomment-2246594484"
					>
					Get example file here
				</a>
			</div>
			<div ref={targetRef} style={{ padding: '20px', marginTop: '10px' }}></div>
		</fieldset>
	)
}