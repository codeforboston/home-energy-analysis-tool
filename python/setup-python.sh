#!/bin/bash

trap 'echo "An error occurred"; set +x' ERR

# Create virtual environment and install everything
uv sync --dev
