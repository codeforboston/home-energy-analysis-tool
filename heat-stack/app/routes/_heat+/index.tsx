import { Link } from 'react-router'

export default function HEATLandingPage() {
	return (
		<div className="flex flex-col min-h-screen">
			{/* Hero Section */}
			<section className="bg-gradient-to-r from-emerald-600 to-teal-500 py-20 px-4 text-white">
				<div className="max-w-5xl mx-auto text-center">
					<h1 className="text-5xl md:text-6xl font-bold">Home Energy Analysis Tool (HEAT) </h1>
					<p className="text-xl md:text-2xl mb-8">
						Right-Size Your Heat Pump
					</p>
					<div className="flex flex-col sm:flex-row justify-center gap-4">
						<Link to="/single" className="inline-block bg-white text-emerald-700 font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all">
							Get Started (with Empty Form)
						</Link>
						<Link to="/single?dev=true" className="inline-block bg-white text-emerald-700 font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all">
							Get Started (with Demo Data)
						</Link>
						<a href="#learn-more" className="inline-block border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-emerald-700 transition-all">
							Learn More
						</a>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section id="learn-more" className="py-16 px-4 bg-white">
				<div className="max-w-5xl mx-auto">
					<h2 className="text-4xl font-bold text-center mb-12 text-gray-800">How H.E.A.T. Works</h2>

					<div className="grid md:grid-cols-3 gap-8">
						<div className="bg-gray-50 p-6 rounded-lg shadow-md">
							<div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
								</svg>
							</div>
							<h3 className="text-xl font-semibold mb-2 text-gray-800">Easy Data Input</h3>
							<p className="text-gray-600">Upload historical energy usage data from utility bills and provide basic information about your home.</p>
						</div>

						<div className="bg-gray-50 p-6 rounded-lg shadow-md">
							<div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
								</svg>
							</div>
							<h3 className="text-xl font-semibold mb-2 text-gray-800">Accurate Analysis</h3>
							<p className="text-gray-600">Our algorithm calculates your home's precise heating requirements using weather data and energy consumption patterns.</p>
						</div>

						<div className="bg-gray-50 p-6 rounded-lg shadow-md">
							<div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<h3 className="text-xl font-semibold mb-2 text-gray-800">Visual Results</h3>
							<p className="text-gray-600">Get clear heat load charts and size recommendations that help you make informed decisions about heat pump systems.</p>
						</div>
					</div>
				</div>
			</section>

			{/* Info Section */}
			<section className="py-16 px-4 bg-gray-50">
				<div className="max-w-5xl mx-auto">
					<div className="flex flex-col md:flex-row gap-12 items-center">
						<div className="md:w-1/2">
							<img src="/img/2024-charts.jpg" alt="Heat pump analysis screenshot" className="rounded-lg shadow-xl" />
						</div>
						<div className="md:w-1/2">
							<h2 className="text-3xl font-bold mb-6 text-gray-800">Why Proper Sizing Matters</h2>
							<p className="text-gray-600 mb-4">
								Undersized heat pumps won't keep your home comfortable in cold weather. Oversized systems cost more and cycle too frequently, reducing efficiency and lifespan.
							</p>
							<p className="text-gray-600 mb-6">
								Our tool uses proven engineering methods to analyze your home's unique heating requirements, ensuring you get the right-sized system for optimal comfort and efficiency.
							</p>
							<Link to="/single" className="inline-block bg-emerald-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-emerald-700 transition-all">
								Start Your Analysis
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* About Energy Coaches */}
			<section className="py-16 px-4 bg-white">
				<div className="max-w-5xl mx-auto">
					<h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Energy Coach Approved</h2>

					<div className="bg-emerald-50 p-8 rounded-lg shadow-md border border-emerald-100">
						<div className="flex flex-col md:flex-row gap-8 items-center">
							<div className="md:w-1/3">
								<div className="w-32 h-32 bg-emerald-200 rounded-full mx-auto flex items-center justify-center">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
									</svg>
								</div>
							</div>
							<div className="md:w-2/3">
								<h3 className="text-2xl font-semibold mb-4 text-gray-800">HeatSmart Alliance Coaches</h3>
								<p className="text-gray-600 mb-4">
									This tool was designed with energy coaches in mind, particularly volunteers from the HeatSmart Alliance who help homeowners navigate the heat pump conversion process.
								</p>
								<p className="text-gray-600">
									Coaches use this powerful tool to collect home information, analyze heating requirements, and recommend appropriate heat pump solutions, helping homeowners make confident decisions.
								</p>
								<a href="https://heatsmartalliance.org/about-our-volunteer-coaches/" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-emerald-600 font-medium hover:underline">
									Learn more about HeatSmart Alliance coaches →
								</a>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 px-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-white">
				<div className="max-w-3xl mx-auto text-center">
					<h2 className="text-4xl font-bold mb-6">Ready to Find Your Perfect Heat Pump?</h2>
					<p className="text-xl mb-8">
						Join the thousands of homeowners who have used our tool to make the switch to efficient, climate-friendly heating.
					</p>
					<Link to="/single" className="inline-block bg-white text-emerald-700 font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all">
						Start Your Free Analysis
					</Link>
				</div>
			</section>

			{/* Footer */}
			<footer className="py-8 px-4 bg-gray-800 text-gray-300">
				<div className="max-w-5xl mx-auto">
					<p className="text-center">
						Developed by Code for Boston | <a href="https://github.com/codeforboston/home-energy-analysis-tool" className="text-white hover:underline">Open Source on GitHub</a>
					</p>
				</div>
			</footer>
		</div>
	)
}