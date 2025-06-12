#!/bin/bash
# detect_python.sh

detect_python_cmd() {
  for cmd in python3 python; do
    if command -v "$cmd" >/dev/null 2>&1; then
      version=$("$cmd" -c 'import sys; print(sys.version_info[0])' 2>/dev/null || echo "")
      if [[ "$version" == "3" ]]; then
        echo "$cmd"
        return 0
      fi
    fi
  done
  exit 1
}

detect_python_cmd
