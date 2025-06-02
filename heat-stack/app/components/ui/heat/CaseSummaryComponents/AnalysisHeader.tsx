import { type z } from 'zod';
import { useEffect, useRef } from 'react';
import { type UsageDataSchema } from '#/types/types.ts'; 
import HelpCircle from './assets/help-circle.svg'

interface AnalysisHeaderProps {
	usageData: UsageDataSchema;
	scrollAfterSubmit: boolean;
	setScrollAfterSubmit: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AnalysisHeader({
	usageData, 
	scrollAfterSubmit,
	setScrollAfterSubmit,
} : AnalysisHeaderProps) {
	// Example usageData
	// new Map([[
	// 		"estimated_balance_point",
	// 		61.5
	// 	],[
	// 		"other_fuel_usage",
	// 		0.2857142857142857
	// 	],[
	// 		"average_indoor_temperature",
	// 		67
	// 	],[
	// 		"difference_between_ti_and_tbp",
	// 		5.5
	// 	],[
	// 		"design_temperature",
	// 		1
	// 	],[
	// 		"whole_home_heat_loss_rate",
	// 		48001.81184312083
	// 	],[
	// 		"standard_deviation_of_heat_loss_rate",
	// 		0.08066745182677547
	// 	],[
	// 		"average_heat_load",
	// 		3048115.0520381727
	// 	],[
	// 		"maximum_heat_load",
	// 		3312125.0171753373
	// 	]])

	// Extract the heat_load_output from usageData
	const summaryOutputs = usageData?.heat_load_output;

	const totalRecords = usageData?.processed_energy_bills?.length || "-"

	// Calculate the number of billing periods included in Heating calculations
	const heatingAnalysisTypeRecords = usageData?.processed_energy_bills?.filter(
		(billingRecord) => billingRecord.analysis_type === 1,
		// Do wee need this code instead? (billingRecord) => billingRecord.analysis_type !== "NOT_ALLOWED_IN_CALCULATIONS",
	);

	const recordsIncludedByDefault = heatingAnalysisTypeRecords?.filter(
		(billingRecord) =>
		billingRecord.default_inclusion === true &&
		billingRecord.inclusion_override === false,
	).length;

	const recordsIncludedByOverride = heatingAnalysisTypeRecords?.filter(
		(billingRecord) =>
		billingRecord.default_inclusion === false &&
		billingRecord.inclusion_override === true,
	).length;

	const numRecordsForHeatingCalculations =
		(recordsIncludedByDefault || 0) + (recordsIncludedByOverride || 0);

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
		if (scrollAfterSubmit) {
			if (targetRef.current) {
				targetRef.current.scrollIntoView({ behavior: 'smooth' });
				setScrollAfterSubmit(false);
			}
		}
	}, [scrollAfterSubmit, setScrollAfterSubmit])
	
	const titleClassTailwind = 'text-4xl font-bold tracking-wide'
	const componentMargin = 'mt-10'

	// Calculate the value
	const value = summaryOutputs?.standard_deviation_of_heat_loss_rate * 100;

	// Determine the text color based on the value
	const textColor = value <= 10 ? 'green' : 'red';

	return (
		<div className="section-title mt-12" ref={targetRef}>
			<div className="flex flex-row gap-0.5 mb-4">
				<h2 className={`${titleClassTailwind} ${componentMargin}`}>
					Heat Load Analysis
				</h2>
				{/* TODO: add help text here */}
				<img src={HelpCircle} alt='help text'/>
			</div>
			<div className="flex flex-row gap-x-4">
				<div className="basis-1/3">
					<div className="item-title-small text-xl text-slate-700 font-normal">
						Average Indoor Temperature <br />
						<div className="item font-bold">
							{summaryOutputs?.average_indoor_temperature.toFixed(1)} °F
						</div>
						<br />
						Balance Point Temperature
						<br />
						<div className="item font-bold">
							{summaryOutputs?.estimated_balance_point} °F
						</div>
						<br />
					</div>
				</div>
				<div className="basis-1/3">
					<div className="item-title-small text-xl text-slate-700 font-normal">
						Number of Periods Included <br />
						<div className="item font-bold">{numRecordsForHeatingCalculations} / {totalRecords}</div>
						<br />
						Daily Non-heating Usage <br />
						<div className="item font-bold">
							{/* Rounding to two decimal places */}
							{summaryOutputs?.other_fuel_usage?.toFixed(2)} therms
						</div>
					</div>
				</div>
				<div className="basis-1/3">
					<div className="item-title-small text-xl text-slate-700 font-normal">
						Standard Deviation of UA <br />
						<div className="item font-bold" style={{ color: textColor }}>
							{/* Rounding to two decimal places */}
							{(value)?.toFixed(2)}{' '}
							%
						</div>
						<br />
						Whole-home UA
						<br />
						<div className="item font-bold">
							{/* Rounding to zero decimal places */}
							{summaryOutputs?.whole_home_heat_loss_rate?.toFixed(0)} BTU/h-°F
						</div>
						<br />
					</div>
				</div>
			</div>
		</div>
	)
}
