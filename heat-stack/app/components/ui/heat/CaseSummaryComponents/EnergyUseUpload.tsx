import { Upload } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Button } from '#/app/components/ui/button.tsx'


interface EnergyUseUploadProps
{
	dataLoaded: boolean,
	scrollAfterSubmit: boolean,
	setDataLoaded: React.Dispatch<React.SetStateAction<boolean>>
	setScrollAfterSubmit: React.Dispatch<React.SetStateAction<boolean>>
}


export function EnergyUseUpload({
	dataLoaded,
	scrollAfterSubmit,
	setDataLoaded,
	setScrollAfterSubmit,
}: EnergyUseUploadProps) {
	const titleClass = 'text-4xl font-bold tracking-wide mt-10'
	const targetRef = useRef<HTMLDivElement>(null);

	/*
	Scrolls down until the top of the Analysis Header is at the top of 
	the browser

	- After scrolling, resets dataLoaded and scrollAfterSubmit to false to 
	prevent unwanted scrolling
	- The targetRef is a hidden div at the bottom of the returned component

	This useEffect is part of a state machine to manage automatic scrolling
	after the user clicks the calculate button, with other, likewise-marked code
	single.tsx and EnergyUseHistory.tsx.  Do not change it lightly.
	*/
	useEffect(() => {
		if (dataLoaded && scrollAfterSubmit) {
			if (targetRef.current) {
				targetRef.current.scrollIntoView({ behavior: 'smooth' });
				setDataLoaded(false);
				setScrollAfterSubmit(false);
			}
		}
	}, [dataLoaded, setDataLoaded, scrollAfterSubmit, setScrollAfterSubmit])

	/*
	When the calculate button is pressed, sets scrollAfterSubmit to true 
	because we want the page to scroll then.

	This useEffect is part of a state machine to manage automatic scrolling
	after the user clicks the calculate button, with other, likewise-marked code
	single.tsx and EnergyUseHistory.tsx.  Do not change it lightly, but if
	you must, look for SCROLLING STATE MACHINE to find the other parts.
	*/
	const handleSubmit = () => {
		setScrollAfterSubmit(true);
	}

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
				{/* Button type submit is processed by action in single.tsx */}
				
				<Button type="submit" name="intent" value="upload" onClick={handleSubmit} style={{ marginBottom: '20px' }}>
					<Upload className="mr-2 h-4 w-4" />Calculate
				</Button>

				<a
					className="ml-3 inline-flex items-center gap-1 rounded-md border border-transparent bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
					href="https://github.com/codeforboston/home-energy-analysis-tool/issues/162#issuecomment-2246594484"
					>
					Get example file here
				</a>
			</div>
			<div ref={targetRef} style={{}}></div> {/*Secret div for target scrolling*/}
		</fieldset>
	)
}