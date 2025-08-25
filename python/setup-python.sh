#!/bin/bash

# Trap errors and print a message
trap 'echo "An error occurred"; set +x' ERR

# Check for Python
if ! command -v python3 &> /dev/null; then
    echo "Python is not installed or not in PATH"
    exit 1
fi

# Create a virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
    python3 -m venv .venv || { echo "Failed to create virtual environment"; exit 1; }
fi

# Activate the virtual environment
case "$OSTYPE" in
  msys*) source .venv/Scripts/activate;;
  *) source .venv/bin/activate;;
esac

# Sync dependencies into the virtual environment
uv sync --dev

# Install development dependencies
uv pip install -e ".[dev]"

# End of script
set +x
