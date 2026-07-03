#!/bin/bash

# Trap errors and print a message
trap 'echo "An error occurred"; set +x' ERR

# Create a virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
    python3 -m venv .venv || { echo "Failed to create virtual environment"; exit 1; }
fi

# Activate the virtual environment
case "$OSTYPE" in
  msys*) source .venv/Scripts/activate;;
  *) source .venv/bin/activate;;
esac

MODE="${1:-dev}"

if [ "$MODE" = "production" ]; then
    echo "Setting up production environment..."

    uv sync
    uv pip install -e .
else
    echo "Setting up development environment..."

    # Sync dependencies into the virtual environment
    uv sync --dev

    # Install development dependencies
    uv pip install -e ".[dev]"
fi

# End of script
set +x
