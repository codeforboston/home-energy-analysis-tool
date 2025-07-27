#!/bin/bash

# Trap errors and print a message
trap 'echo "An error occurred"; set +x' ERR

# Install dependencies, including rules-engine in editable mode
uv add --dev .

# Detect the operating system
OS=$(uname)

# Activate the virtual environment
case "$OSTYPE" in
  msys*) source .venv/Scripts/activate;;
  *) source .venv/bin/activate;;
esac

# End of script
set +x
