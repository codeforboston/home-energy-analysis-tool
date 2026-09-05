#!/bin/bash

trap 'echo "An error occurred"; set +x' ERR
set -x
uv run --with black black .
uv run --with mypy mypy .
uv run --with isort isort .
uv run --with pytest pytest
uv build
set +x
