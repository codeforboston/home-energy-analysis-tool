// DO NOT USE ENV VARIABLES FOR FROM EMAIL -
// INTENTIONALLY HARDCODED FOR SECURITY

export const EMAIL_FROM = 'no-reply@heat.heatsmartalliance.org'

// CACHE_DATABASE_PATH: from env, or default if not PROD
export const CACHE_DATABASE_PATH = (() => {
	const envValue = process.env.CACHE_DATABASE_PATH
	if (envValue) return envValue
	const nodeEnv = process.env.NODE_ENV || ''
	if (!nodeEnv.startsWith('PROD')) {
		return './other/cache.db'
	}
	return undefined
})()
