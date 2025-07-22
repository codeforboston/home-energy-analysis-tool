#!/bin/bash

# Trap errors and print a message
trap 'echo "An error occurred"; set +x' ERR

# Detect the operating system
OS=$(uname)

# Set the PYTHON_CMD environment variable based on the operating system
if [[ "$OS" == "Linux" ]] || [[ "$OS" == "Darwin" ]]; then
    # Set the PYTHON_CMD environment variable for Linux or macOS
    export PYTHON_CMD="python3.12"
elif [[ "$OS" == *"MINGW"* ]] || [[ "$OS" == *"CYGWIN"* ]]; then
    # Set the PYTHON_CMD environment variable for Windows (using Git Bash or WSL)
    export PYTHON_CMD="py -3.12"
else
    echo "Unsupported operating system: $OS"
    exit 1
fi

# Print the PYTHON_CMD for verification
echo "PYTHON_CMD is set to: $PYTHON_CMD"

echo "Using Python command: $PYTHON_CMD"

# Source the check-version.sh script
source check-version.sh || { echo "Error: check-version.sh failed"; exit 1; }

# Create a virtual environment
$PYTHON_CMD -m venv venv

# Activate the virtual environment
case "$OSTYPE" in
  msys*) source venv/Scripts/activate;;
  *) source venv/bin/activate;;
esac

# Install dependencies
pip install -e .
pip install -r requirements-dev.txt
pip install --upgrade pip
pre-commit install

# End of script
set +x
