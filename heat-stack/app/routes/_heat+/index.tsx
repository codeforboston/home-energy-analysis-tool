import { Link } from 'react-router'

export default function HEATLandingPage() {
	return (
		<div className="flex min-h-screen flex-col">
			{/* Hero Section */}
			<section
				className="bg-gradient-to-r from-emerald-600 to-teal-500 px-4 py-5 text-white"
				style={{ borderRadius: '10px' }}
			>
				<div className="mx-auto max-w-5xl text-center">
					<h1 className="text-4xl font-bold md:text-4xl">
						Home Energy Analysis Tool (HEAT){' '}
					</h1>
					<p className="mb-8 mt-6 text-xl md:text-2xl">
						Right-Size Your Heat Pump
					</p>
				</div>
			</section>
			{/* Why Use HEAT Section */}
			<section className="bg-gray-50 px-4 py-16">
				<div className="mx-auto max-w-5xl">
					<h2 className="mb-12 text-center text-4xl font-bold text-gray-800">
						Why Use HEAT
					</h2>

					<div className="grid gap-8 md:grid-cols-3">
						<div className="rounded-lg bg-white p-6 shadow-md">
							<h3 className="mb-2 text-xl font-semibold text-gray-800">
								Ready for a Heat Pump?
							</h3>
							<p className="text-gray-600">
								Is a home well enough sealed and insulated for heat pump
								success?
							</p>
						</div>

						<div className="rounded-lg bg-white p-6 shadow-md">
							<h3 className="mb-2 text-xl font-semibold text-gray-800">
								Evaluate Proposals
							</h3>
							<p className="text-gray-600">
								Is the heating capacity of a proposed heat pump system
								appropriate for a home?
							</p>
						</div>

						<div className="rounded-lg bg-white p-6 shadow-md">
							<h3 className="mb-2 text-xl font-semibold text-gray-800">
								Compare with Manual J
							</h3>
							<p className="text-gray-600">
								HEAT serves as a fast and easy check on Manual J analysis.
							</p>
						</div>
					</div>
				</div>
			</section>
			{/* Features Section */}
			<section id="learn-more" className="bg-white px-4 py-16">
				<div className="mx-auto max-w-5xl">
					<h2 className="mb-12 text-center text-4xl font-bold text-gray-800">
						How HEAT Works
					</h2>

					<div className="grid gap-8 md:grid-cols-3">
						<div className="rounded-lg bg-gray-50 p-6 shadow-md">
							<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-8 w-8 text-emerald-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
									/>
								</svg>
							</div>
							<h3 className="mb-2 text-xl font-semibold text-gray-800">
								Easy Data Input
							</h3>
							<p className="text-gray-600">
								Upload historical energy usage data from utility bills and
								provide basic information about your home.
							</p>
						</div>

						<div className="rounded-lg bg-gray-50 p-6 shadow-md">
							<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-8 w-8 text-emerald-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
									/>
								</svg>
							</div>
							<h3 className="mb-2 text-xl font-semibold text-gray-800">
								Accurate Analysis
							</h3>
							<p className="text-gray-600">
								HEAT uses your inputs and historical outdoor temperature data at
								the home's location to accurately estimate the home's overall
								heat loss rate and total design heating load.
							</p>
						</div>

						<div className="rounded-lg bg-gray-50 p-6 shadow-md">
							<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-8 w-8 text-emerald-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<h3 className="mb-2 text-xl font-semibold text-gray-800">
								Visual Results
							</h3>
							<p className="text-gray-600">
								Get clear charts that help with assessing a home's
								weatherization — i.e. is it ready for heat pumps — and properly
								sizing the heat pump for its heating needs.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Info Section */}
			<section className="bg-gray-50 px-4 py-16">
				<div className="mx-auto max-w-5xl">
					<div className="flex flex-col items-center gap-12 md:flex-row">
						<div className="md:w-1/2">
							<img
								src="/img/2024-charts.jpeg"
								alt="Heat pump analysis screenshot"
								className="rounded-lg shadow-xl"
							/>
						</div>
						<div className="md:w-1/2">
							<h2 className="mb-6 text-3xl font-bold text-gray-800">
								Why Proper Sizing Matters
							</h2>
							<p className="mb-4 text-gray-600">
								Undersized heat pumps won't keep your home comfortable in cold
								weather. Oversized systems cost more and also cause comfort
								issues and waste energy.
							</p>
							<p className="mb-6 text-gray-600">
								HEAT uses proven engineering methods to analyze a home's heating
								requirements, helping homeowners get the right-sized system for
								optimal comfort and efficiency.
							</p>
							<Link
								to="/cases/new"
								className="inline-block rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition-all hover:bg-emerald-700"
							>
								Start Your Analysis
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* About Energy Coaches */}
			<section className="bg-white px-4 py-16">
				<div className="mx-auto max-w-5xl">
					<div className="rounded-lg border border-emerald-100 bg-emerald-50 p-8 shadow-md">
						<div className="flex flex-col items-center gap-8 md:flex-row">
							<div className="md:w-1/3">
								<div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-emerald-200">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-16 w-16 text-emerald-600"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
										/>
									</svg>
								</div>
							</div>
							<div className="md:w-2/3">
								<h3 className="mb-4 text-2xl font-semibold text-gray-800">
									A Tool for Energy Coaches and Homeowners
								</h3>
								<p className="mb-4 text-gray-600">
									This tool was designed with energy coaches in mind,
									particularly volunteers from the HeatSmart Alliance who help
									homeowners navigate the heat pump conversion process.
								</p>
								<p className="text-gray-600">
									Coaches use this tool to analyze a home's heating
									requirements, and provide guidance to their clients on
									evaluating heat pump proposals.
								</p>
								<a
									href="https://heatsmartalliance.org/about-our-volunteer-coaches/"
									target="_blank"
									rel="noopener noreferrer"
									className="mt-4 inline-block font-medium text-emerald-600 hover:underline"
								>
									Learn more about HeatSmart Alliance coaches →
								</a>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="rounded-t-lg bg-gradient-to-r from-emerald-600 to-teal-500 px-4 py-16 text-white">
				<div className="mx-auto max-w-3xl text-center">
					<h2 className="mb-8 text-4xl font-bold">Try HEAT?</h2>
					<div className="flex flex-col justify-center gap-4 sm:flex-row">
						<Link
							to="/cases/new"
							className="inline-block rounded-lg bg-white px-8 py-4 font-semibold text-emerald-700 shadow-lg transition-all hover:shadow-xl"
						>
							Get Started (with Empty Form)
						</Link>
						<Link
							to="/cases/new?dev=true"
							className="inline-block rounded-lg bg-white px-8 py-4 font-semibold text-emerald-700 shadow-lg transition-all hover:shadow-xl"
							data-testid="get-started-demo-data"
						>
							Get Started (with Demo Data)
						</Link>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="rounded-b-lg bg-gray-800 px-4 py-8 text-gray-300">
				<div className="mx-auto max-w-5xl">
					<p className="text-center">
						Developed by Code for Boston |{' '}
						<a
							href="https://github.com/codeforboston/home-energy-analysis-tool"
							className="text-white hover:underline"
						>
							Open Source on GitHub
						</a>
					</p>
				</div>
			</footer>
		</div>
	)
}
