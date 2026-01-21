export default function PrivacyRoute() {
	return (
		<section id="privacy" className="bg-white px-4 py-16">
			<div className="prose list-disc mx-auto max-w-5xl">
				<h2 className="mb-12 text-center text-4xl font-bold text-gray-800">
					Privacy Policy
				</h2>
				<p className="mb-4 text-gray-600">
					The Home Energy Analysis Tool (HEAT) is a project of the HeatSmart
					Alliance. HEAT retains information that users enter about themselves
					or others that may not be publicly available, such as an individual’s
					name in connection with an email address and/or mobile phone number.
					We consider the aggregation of these data to be personal information.
					The Alliance strives to use personal information consistent with the
					intent of the provider (i.e., the individual whose information we
					possess). As such, the Alliance:
				</p>
				<ul className="marker:text-gray-900">
					<li>
						Collects personal information for the purposes of a) providing and
						communicating about the services the individual is requesting, and
						b) gathering information to improve our services{' '}
					</li>
					<li>
						Does not, in general, share personal information with individuals or
						organizations outside the Alliance unless the provider explicitly
						authorizes such sharing. Exception: The Alliance may share personal
						information provided in a coaching request, or other requests for
						assistance, with another organization that is known to the Alliance
						to provide such services
					</li>
					<li>
						Limits access to personal information to the user who entered the
						information and Alliance Members who have specific responsibilities
						requiring such access
					</li>
					<li>
						Provides individuals with access to this privacy policy whenever we
						request personal information.
					</li>
				</ul>
			</div>
		</section>
	)
}
