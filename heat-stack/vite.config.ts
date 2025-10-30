import { reactRouter } from '@react-router/dev/vite'
import { sentryVitePlugin } from '@sentry/vite-plugin'

import { envOnlyMacros } from 'vite-env-only'
import { type ViteUserConfig } from 'vitest/config'

const MODE = process.env.NODE_ENV

export default {
	build: {
		target: 'es2022',
		cssMinify: MODE === 'production',

		rollupOptions: {
			external: [/node:.*/, 'fsevents'],
		},

		assetsInlineLimit: (source: string) => {
			if (
				source.endsWith('sprite.svg') ||
				source.endsWith('favicon.svg') ||
				source.endsWith('apple-touch-icon.png')
			) {
				return false
			}
		},

		sourcemap: true,
	},
	server: {
		watch: {
			ignored: ['**/playwright-report/**'],
		},
	},
	plugins: [
		envOnlyMacros(),
		// it would be really nice to have this enabled in tests, but we'll have to
		// wait until https://github.com/remix-run/remix/issues/9871 is fixed
		process.env.NODE_ENV === 'test' ? null : reactRouter(),
		process.env.SENTRY_AUTH_TOKEN
			? sentryVitePlugin({
					disable: MODE !== 'production',
					authToken: process.env.SENTRY_AUTH_TOKEN,
					org: process.env.SENTRY_ORG,
					project: process.env.SENTRY_PROJECT,
					release: {
						name: process.env.COMMIT_SHA,
						setCommits: {
							auto: true,
						},
					},
					sourcemaps: {
						filesToDeleteAfterUpload: [
							'./build/**/*.map',
							'.server-build/**/*.map',
						],
					},
				})
			: null,
	],
	test: {
		include: ['./app/**/*.test.{ts,tsx}'],
		setupFiles: ['./tests/setup/setup-test-env.ts'],
		globalSetup: ['./tests/setup/global-setup.ts'],
		restoreMocks: true,
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html', 'json'],
			include: ['app/**/*.{ts,tsx}'],
			exclude: [
				'node_modules/**',
				// Epic Stack base files - authentication & authorization
				'app/utils/auth.server.ts',
				'app/utils/permissions.server.ts',
				'app/utils/session.server.ts',
				'app/utils/verification.server.ts',
				'app/utils/totp.server.ts',
				// Epic Stack base files - infrastructure & utilities
				'app/utils/env.server.ts',
				'app/utils/email.server.ts',
				'app/utils/request-info.ts',
				'app/utils/client-hints.tsx',
				'app/utils/cache.server.ts',
				'app/utils/connections.server.ts',
				'app/utils/connections.tsx',
				'app/utils/honeypot.server.ts',
				'app/utils/litefs.server.ts',
				'app/utils/monitoring.client.tsx',
				'app/utils/nonce-provider.ts',
				'app/utils/redirect-cookie.server.ts',
				'app/utils/storage.server.ts',
				'app/utils/theme.server.ts',
				'app/utils/timing.server.ts',
				'app/utils/toast.server.ts',
				'app/utils/extended-theme.ts',
				'app/utils/user.ts',
				'app/utils/user-validation.ts',
				// Epic Stack base files - UI components
				'app/components/error-boundary.tsx',
				'app/components/floating-toolbar.tsx',
				'app/components/forms.tsx',
				'app/components/progress-bar.tsx',
				'app/components/search-bar.tsx',
				'app/components/spacer.tsx',
				'app/components/spinner.tsx',
				'app/components/toaster.tsx',
				'app/components/user-dropdown.tsx',
				// Epic Stack base UI components (individual files)
				'app/components/ui/button.tsx',
				'app/components/ui/checkbox.tsx',
				'app/components/ui/dropdown-menu.tsx',
				'app/components/ui/icon.tsx',
				'app/components/ui/input-otp.tsx',
				'app/components/ui/input.tsx',
				'app/components/ui/label.tsx',
				'app/components/ui/select.tsx',
				'app/components/ui/sonner.tsx',
				'app/components/ui/status-button.tsx',
				'app/components/ui/table.tsx',
				'app/components/ui/textarea.tsx',
				'app/components/ui/tooltip.tsx',
				'app/components/ui/icons/**',
				// Epic Stack providers
				'app/utils/providers/constants.ts',
				'app/utils/providers/github.server.ts',
				'app/utils/providers/provider.ts',
				// Epic Stack authentication routes
				'app/routes/_auth+/**',
				// Epic Stack user management routes
				'app/routes/users+/**',
				// Epic Stack settings routes
				'app/routes/settings+/**',
				// Epic Stack admin routes
				'app/routes/admin+/**',
				// Epic Stack resource routes
				'app/routes/resources+/download-user-data.tsx',
				'app/routes/resources+/healthcheck.tsx',
				'app/routes/resources+/images.tsx',
				'app/routes/resources+/theme-switch.tsx',
				// Additional route directories to exclude
				'app/routes/_marketing+/**',
				'app/routes/_seo+/**',
				// Epic Stack entry points and config
				'app/entry.client.tsx',
				'app/entry.server.tsx',
				'app/root.tsx',
				// Files with 0% coverage (untested project-specific files)
				'app/routes.ts',
				'app/global_constants_t.ts',
				'app/routes/homes.tsx',
				'app/routes/me.tsx',
			],
			all: true,
		},
	},
} satisfies ViteUserConfig
