python3 -m venv .venv
source .venv/bin/activate
trap 'echo "An error occurred"; set +x' ERR
set -x
pip install -r requirements-dev.txt
pip install --upgrade pip setuptools wheel build maturin
pip install -e .
set +x
