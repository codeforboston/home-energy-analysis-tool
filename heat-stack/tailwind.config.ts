import { type Config } from 'tailwindcss'
import animatePlugin from 'tailwindcss-animate'
import radixPlugin from 'tailwindcss-radix'
import typographyPlugin from '@tailwindcss/typography'
import { marketingPreset } from './app/routes/_marketing+/tailwind-preset'
import { extendedTheme } from './app/utils/extended-theme.ts'

export default {
	content: ['./app/**/*.{ts,tsx,jsx,js}'],
	darkMode: 'class',
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			...extendedTheme,
			typography: (theme: (arg0: string) => any) => ({
				DEFAULT: {
					css: {
						a: {
							color: theme('colors.blue.600'),
							fontWeight: 'normal', // remove bold
							textDecoration: 'underline',
							'&:hover': {
								color: theme('colors.blue.800'),
							},
						},
					},
				},
			}),
		},
	},
	presets: [marketingPreset],
	plugins: [animatePlugin, radixPlugin, typographyPlugin],
} satisfies Config
