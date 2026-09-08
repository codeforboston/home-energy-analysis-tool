#!/bin/bash

# Trap errors and print a message (bash-only feature; skip under other shells like dash)
if [ -n "$BASH_VERSION" ]; then
    trap 'echo "An error occurred"; set +x' ERR
fi

# Create a virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
    python3 -m venv .venv || { echo "Failed to create virtual environment"; exit 1; }
fi

# Activate the virtual environment
case "$OSTYPE" in
  msys*) . .venv/Scripts/activate;;
  *) . .venv/bin/activate;;
esac

# Sync dependencies into the virtual environment
uv sync --dev

# Install development dependencies
uv pip install -e ".[dev]"

# End of script
set +x
