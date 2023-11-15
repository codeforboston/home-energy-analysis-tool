import { cssBundleHref } from '@remix-run/css-bundle'
import fontStyleSheetUrl from './styles/font.css'
import tailwindStyleSheetUrl from './styles/tailwind.css'
import { Links } from '@remix-run/react'
import { href as iconsHref } from './components/ui/icon.tsx'
import { type LinksFunction } from '@remix-run/node'

import { CaseSummary } from './components/CaseSummary.tsx'
import './App.css'

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

export default function HeatStack() {
    return (
        <html lang="en" className={`${'light'} h-full overflow-x-hidden`}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <Links />
            </head>
            <body className="bg-background text-foreground">
                <CaseSummary />
            </body>
        </html>
    )
}


// npx shadcn-ui@latest add table
// npx shadcn-ui@latest add checkbox
