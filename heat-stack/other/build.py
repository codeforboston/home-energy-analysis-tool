"""Build the rules engine wheel and copy it into heat-stack/public/pyodide-env.

Run from heat-stack/ with: npm run buildpy (which calls uv run other/build.py)
"""

import shutil
import subprocess
import sys
from pathlib import Path

# Directories
HEAT_STACK_DIRECTORY = Path(__file__).resolve().parent.parent
PYTHON_DIRECTORY = HEAT_STACK_DIRECTORY.parent / "python"
DIST_DIRECTORY = PYTHON_DIRECTORY / "dist"
PYODIDE_ENV_DIRECTORY = HEAT_STACK_DIRECTORY / "public" / "pyodide-env"


def main() -> int:
    # Start from an empty dist/ so exactly one wheel is there to copy
    if DIST_DIRECTORY.exists():
        shutil.rmtree(DIST_DIRECTORY)

    try:
        # Run `uv build` from the /python directory
        subprocess.run(["uv", "build"], cwd=PYTHON_DIRECTORY, check=True)
    except FileNotFoundError:
        # Return an error to the user if uv is not installed
        print(
            "uv is not installed. See python/README.md for how to install it.",
            file=sys.stderr,
        )
        return 1
    except subprocess.CalledProcessError:
        # Return an error to the user if `uv build` failed
        print("`uv build` failed. See the error above.", file=sys.stderr)
        return 1

    # Get all the wheels
    wheels = sorted(DIST_DIRECTORY.glob("rules_engine-*.whl"))

    # There must be one and only one wheel
    if len(wheels) != 1:
        found = ", ".join(w.name for w in wheels) or "none"
        print(
            f"Expected one rules_engine wheel in {DIST_DIRECTORY}, found: {found}",
            file=sys.stderr,
        )
        return 1

    # Grab the only wheel
    wheel = wheels[0]
    # Create heat-stack/public/pyodide-env if it doesn't exist yet
    PYODIDE_ENV_DIRECTORY.mkdir(parents=True, exist_ok=True)
    # Copy the single wheel into the folder (PYODIDE_ENV_DIRECTORY)
    # the browser loads Python packages from
    shutil.copyfile(wheel, PYODIDE_ENV_DIRECTORY / wheel.name)
    # Confirm the copy in the terminal so the developer can see where the wheel went
    print(f"Copied {wheel.name} to {PYODIDE_ENV_DIRECTORY}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
