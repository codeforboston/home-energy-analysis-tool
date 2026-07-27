#!/bin/sh

set -e

# Create a virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
    python3 -m venv .venv || { echo "Failed to create virtual environment"; exit 1; }
fi

# Activate the virtual environment
case "$OSTYPE" in
  msys*) . .venv/Scripts/activate;;
  *) . .venv/bin/activate;;
esac

# Install uv if it isn't already on PATH
if ! command -v uv >/dev/null 2>&1; then
    echo "uv not found, installing..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
    export PATH="$HOME/.local/bin:$PATH"
fi

# Sync dependencies into the virtual environment
uv sync --dev

# Install development dependencies
uv pip install -e ".[dev]"
