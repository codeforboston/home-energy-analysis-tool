#!/bin/bash

# Hardcoded min and max required Python versions
MIN_MAJOR=3
MIN_MINOR=12
MAX_MAJOR=3
MAX_MINOR=13
echo check $PYTHON_CMD
# Get current Python major and minor version
PYTHON_MAJOR=$($PYTHON_CMD -c 'import sys; print(sys.version_info[0])')
PYTHON_MINOR=$($PYTHON_CMD -c 'import sys; print(sys.version_info[1])')

echo "Current Python version: $PYTHON_MAJOR.$PYTHON_MINOR"
echo "Required version: >= $MIN_MAJOR.$MIN_MINOR and < $MAX_MAJOR.$MAX_MINOR"

# Compare versions
if (( PYTHON_MAJOR > MIN_MAJOR )) || { (( PYTHON_MAJOR == MIN_MAJOR )) && (( PYTHON_MINOR >= MIN_MINOR )); }
then
  if (( PYTHON_MAJOR < MAX_MAJOR )) || { (( PYTHON_MAJOR == MAX_MAJOR )) && (( PYTHON_MINOR < MAX_MINOR )); }
  then
    echo "✅ Python version satisfies requirements."
    return 0
  fi
fi

echo "❌ Python version does NOT satisfy requirements."
return 1
