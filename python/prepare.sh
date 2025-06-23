trap 'echo "An error occurred"; set +x' ERR
set -x
black .
mypy .
isort .
pytest
set +x
