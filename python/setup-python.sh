
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

case "$OSTYPE" in
  msys*) source venv/Scripts/activate;;
  *) source venv/bin/activate;;
esac

pip install -e .
pip install -r requirements-dev.txt
pip install --upgrade pip
pre-commit install

set +x