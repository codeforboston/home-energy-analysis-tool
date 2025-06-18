
#!/bin/bash
# Call detect_python.sh and capture its echo output
trap 'echo "An error occurred"; set +x' ERR
set -x

echo $PYTHON_CMD
if [[ -z "$PYTHON_CMD" ]]; then
  echo B
  PYTHON_CMD=$(./get-python-cmd.sh)
  if [[ -z "$PYTHON_CMD" ]]; then
    echo "Error: No suitable Python 3 interpreter found."
    return 1
  fi
fi

echo "Using Python command: $PYTHON_CMD"

source check-version.sh || return 1

# Your other python commands can use $PYTHON_CMD

$PYTHON_CMD -m venv venv
read -n 1 -s -r -p "Press any key to continue..."
source venv/bin/activate
read -n 1 -s -r -p "Press any key to continue..."
pip install -e .
read -n 1 -s -r -p "Press any key to continue..."
pip install -r requirements-dev.txt
read -n 1 -s -r -p "Press any key to continue..."
pip install --upgrade pip

set +x