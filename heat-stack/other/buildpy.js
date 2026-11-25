// Sets up the Python environment, builds the rules engine wheel, and copies it
// into public/pyodide-env so the browser can load it.
// Written in Node (not Bash) so `npm run buildpy` works the same on Windows,
// macOS and Linux: npm on Windows runs scripts with cmd.exe, not Bash.
// sync is added to the Node methods here because we want each step to follow the last
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Absolute path to the heat-stack folder, found from this file's own location
 * (heat-stack/other/buildpy.js), so the script works no matter which folder
 * npm is run from.
 */
const heatStackDir = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	'..',
)

/** Absolute path to the python folder that holds the rules engine. */
const pythonDir = path.resolve(heatStackDir, '../python')

/** Folder where `uv build` writes the built wheel (python/dist). */
const distDir = path.join(pythonDir, 'dist')

/** Folder the browser loads Python packages from (heat-stack/public/pyodide-env). */
const pyodideEnvDir = path.join(heatStackDir, 'public/pyodide-env')

/**
 * Runs `uv <args>` inside the python folder, showing uv's output as it runs.
 * Always stops the whole script if uv is not installed.
 *
 * @param {string[]} args - Arguments for uv, e.g. `['sync', '--extra', 'dev']`
 * @param {object} [options]
 * @param {boolean} [options.exitOnFailure=true] - Stop the whole script with
 *   exit code 1 if the command fails. Pass `false` for optional steps the build
 *   can continue without.
 * @returns {boolean} true if the command succeeded (exit code 0)
 */
function uv(args, { exitOnFailure = true } = {}) {
	console.log(`\n> uv ${args.join(' ')}`)
	// Run uv inside python/ and wait for it to finish (like Python's subprocess.run).
	// stdio: 'inherit' shows uv's output live in this terminal.
	const result = spawnSync('uv', args, { cwd: pythonDir, stdio: 'inherit' })
	if (result.error?.code === 'ENOENT') {
		console.error(
			'\nuv is not installed. See python/README.md for how to install it.',
		)
		process.exit(1)
	}
	const succeeded = result.status === 0
	if (!succeeded && exitOnFailure) {
		console.error(`\n"uv ${args.join(' ')}" failed. See the error above.`)
		process.exit(1)
	}
	return succeeded
}

/**
 * Stops the script if python/.venv was created by a different operating system
 * than the one running this script.
 *
 * A .venv only works on the operating system that created it. This catches the
 * WSL mix-up where Windows npm and uv run against a .venv made by Linux uv (or
 * the reverse). Without it, uv tries to rebuild .venv, fails partway with
 * "Access is denied", and leaves it half-deleted.
 *
 * It reads the `home =` line of .venv/pyvenv.cfg, which records where the
 * Python that created .venv lives.
 *
 * @returns {void}
 */
function checkVenvMatchesThisSystem() {
	const configFile = path.join(pythonDir, '.venv', 'pyvenv.cfg')
	if (!fs.existsSync(configFile)) {
		// Normal on a first-time setup: the `uv sync` step right after this creates it
		console.log('\nNo python/.venv yet. uv will create it.')
		return
	}

	const config = fs.readFileSync(configFile, 'utf8')
	const home = config.match(/^home\s*=\s*(.+)$/m)?.[1]
	if (!home) {
		console.warn(
			`\nWarning: no "home =" line in ${configFile}, so the check that .venv matches this operating system was skipped.`,
		)
		return
	}

	// Windows paths start with a drive letter, a colon and a slash, like
	// `C:\Users\...` or `D:/...`. Linux and macOS paths start with `/`, like
	// `/home/nolan/...`. So a `home` path matching this pattern was made on Windows.
	const windowsPathStart = /^[A-Za-z]:[\\/]/
	const madeOnWindows = windowsPathStart.test(home)
	const runningOnWindows = process.platform === 'win32'

	if (madeOnWindows !== runningOnWindows) {
		const made = madeOnWindows ? 'Windows' : 'Linux/macOS (or WSL)'
		const running = runningOnWindows ? 'Windows' : 'Linux/macOS (or WSL)'
		console.error(
			[
				`python/.venv was created on ${made}, but this command is running on ${running}.`,
				'A .venv only works on the system that created it.',
				'In WSL, this usually means npm is the Windows version. Check with `which npm`:',
				'a path starting with /mnt/c is Windows. See heat-stack/README.md for how to fix it.',
			].join('\n'),
		)
		process.exit(1)
	}
}

checkVenvMatchesThisSystem()

// Create python/.venv and install all packages, including dev tools like pre-commit
uv(['sync', '--extra', 'dev'])

// Tell git to run pre-commit checks before each commit and push.
// Optional: the wheel can still be built without git hooks, so only warn.

/** uv arguments that run `pre-commit install` from the project's .venv. */
const installHooks = ['run', 'pre-commit', 'install']

/** Which git moments to hook into: before each commit and before each push. */
const hookTypes = ['--hook-type', 'pre-commit', '--hook-type', 'pre-push']

if (!uv([...installHooks, ...hookTypes], { exitOnFailure: false })) {
	console.warn(
		'\nWarning: could not install pre-commit git hooks. Continuing with the build.',
	)
}

// Start from an empty dist/ so exactly one wheel is there to copy
fs.rmSync(distDir, { recursive: true, force: true })
uv(['build'])

/**
 * Filenames of the rules engine wheels in dist/, e.g.
 * `['rules_engine-0.9.0-py3-none-any.whl']`. Should hold exactly one.
 */
const wheels = fs
	.readdirSync(distDir)
	.filter((file) => file.startsWith('rules_engine-') && file.endsWith('.whl'))
if (wheels.length !== 1) {
	console.error(
		`\nExpected one rules_engine wheel in ${distDir}, found: ${wheels.join(', ') || 'none'}`,
	)
	process.exit(1)
}

/** Filename of the single built wheel, copied into {@link pyodideEnvDir}. */
const wheel = wheels[0]
fs.copyFileSync(path.join(distDir, wheel), path.join(pyodideEnvDir, wheel))
console.log(`\nCopied ${wheel} to ${pyodideEnvDir}`)
