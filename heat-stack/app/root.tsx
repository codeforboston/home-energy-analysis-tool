import { cssBundleHref } from '@remix-run/css-bundle'
import {
	type DataFunctionArgs,
	HeadersFunction,
	json,
	type LinksFunction,
} from '@remix-run/node'
import { Links, Scripts, Outlet } from '@remix-run/react'
import { href as iconsHref } from './components/ui/icon.tsx'
import fontStyleSheetUrl from './styles/font.css'
import tailwindStyleSheetUrl from './styles/tailwind.css'

import './App.css'
import { getUserId } from './utils/auth.server.ts'
import { getHints } from './utils/client-hints.tsx'
import { prisma } from './utils/db.server.ts'
import { getEnv } from './utils/env.server.ts'
import { combineHeaders, getDomainUrl } from './utils/misc.tsx'
import { useNonce } from './utils/nonce-provider.ts'
import {
	combineServerTimings,
	makeTimings,
	time,
} from './utils/timing.server.ts'
// Hints may not be required. Double check.
import { WeatherExample } from './components/WeatherExample.tsx'
import { Weather } from './WeatherExample.js'
import { csrf } from './utils/csrf.server.ts'
import { honeypot } from './utils/honeypot.server.ts'

export const links: LinksFunction = () => {
	return [
		// Preload svg sprite as a resource to avoid render blocking
		{ rel: 'preload', href: iconsHref, as: 'image' },
		// Preload CSS as a resource to avoid render blocking
		{ rel: 'preload', href: fontStyleSheetUrl, as: 'style' },
		{ rel: 'preload', href: tailwindStyleSheetUrl, as: 'style' },
		cssBundleHref ? { rel: 'preload', href: cssBundleHref, as: 'style' } : null,
		{ rel: 'mask-icon', href: '/favicons/mask-icon.svg' },
		{
			rel: 'alternate icon',
			type: 'image/png',
			href: '/favicons/favicon-32x32.png',
		},
		{ rel: 'apple-touch-icon', href: '/favicons/apple-touch-icon.png' },
		{
			rel: 'manifest',
			href: '/site.webmanifest',
			crossOrigin: 'use-credentials',
		} as const, // necessary to make typescript happy
		//These should match the css preloads above to avoid css as render blocking resource
		{ rel: 'icon', type: 'image/svg+xml', href: '/favicons/favicon.svg' },
		{ rel: 'stylesheet', href: fontStyleSheetUrl },
		{ rel: 'stylesheet', href: tailwindStyleSheetUrl },
		cssBundleHref ? { rel: 'stylesheet', href: cssBundleHref } : null,
	].filter(Boolean)
}

export async function loader({ request }: DataFunctionArgs) {
	const timings = makeTimings('root loader')
	const userId = await time(() => getUserId(request), {
		timings,
		type: 'getUserId',
		desc: 'getUserId in root',
	})
	const user = userId
		? await time(
				() =>
					prisma.user.findUniqueOrThrow({
						select: {
							id: true,
							name: true,
							username: true,
							image: { select: { id: true } },
							roles: {
								select: {
									name: true,
									permissions: {
										select: { entity: true, action: true, access: true },
									},
								},
							},
						},
						where: { id: userId },
					}),
				{ timings, type: 'find user', desc: 'find user in root' },
		  )
		: null
	const honeyProps = honeypot.getInputProps()
	const [csrfToken, csrfCookieHeader] = await csrf.commitToken()
	// Weather station data
	const w_href: string =
		'https://archive-api.open-meteo.com/v1/archive?latitude=52.52&longitude=13.41&daily=temperature_2m_max&timezone=America%2FNew_York&start_date=2022-01-01&end_date=2023-08-30&temperature_unit=fahrenheit'
	const w_res: Response = await fetch(w_href)
	const weather: Weather = (await w_res.json()) as Weather

	return json(
		{
			weather: weather,
			user: user,
			requestInfo: {
				/* hints may not be absolutely required, double check */
				hints: getHints(request),
				origin: getDomainUrl(request),
				path: new URL(request.url).pathname,
				userPrefs: {},
			},
			ENV: getEnv(),
			honeyProps,
			csrfToken,
		},
		{
			headers: combineHeaders(
				{ 'Server-Timing': timings.toString() },
				csrfCookieHeader ? { 'set-cookie': csrfCookieHeader } : null,
			),
		},
	)
}

/**
 * Step 4 of making Server Timings
 * https://github.com/epicweb-dev/epic-stack/blob/main/docs/server-timing.md
 */
export const headers: HeadersFunction = ({ loaderHeaders, parentHeaders }) => {
	return {
		'Server-Timing': combineServerTimings(parentHeaders, loaderHeaders),
	}
}

export default function HeatStack({
	children,
	env = {},
	nonce,
}: {
	children: React.ReactNode
	nonce: string
	env?: Record<string, string>
}) {
	return (
		<html lang="en" className={`${'light'} h-full overflow-x-hidden`}>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<Links />
			</head>
			<body className="bg-background text-foreground">
				<div>Site header</div>
				<br />
				<Outlet />
				<br />
				<div>Site footer</div>
				<script
					nonce={nonce}
					dangerouslySetInnerHTML={{
						__html: `window.ENV = ${JSON.stringify(env)}`,
					}}
				/>
				<Scripts nonce={nonce} />
			</body>
		</html>
	)
}
