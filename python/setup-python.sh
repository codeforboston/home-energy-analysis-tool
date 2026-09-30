#!/bin/bash

trap 'echo "An error occurred"; set +x' ERR

# Create virtual environment and install everything, including dev tools
uv sync --extra dev

# Install pre-commit into this repo's git hooks (pre-commit and pre-push)
uv run pre-commit install --hook-type pre-commit --hook-type pre-push
