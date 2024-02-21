import { CurrentHeatingSystem } from '../../components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx'
import { EnergyUseHistory } from '../../components/ui/heat/CaseSummaryComponents/EnergyUseHistory.tsx'
import { HomeInformation } from '../../components/ui/heat/CaseSummaryComponents/HomeInformation.tsx'
import HeatLoadAnalysis from './heatloadanalysis.tsx'

export default function Inputs() {
	return (
		<div>
			<HomeInformation />
			<CurrentHeatingSystem />
			<EnergyUseHistory />
			<HeatLoadAnalysis />
		</div>
	)
}
