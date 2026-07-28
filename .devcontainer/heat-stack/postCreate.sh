#!/bin/bash
set -e

cd "$(dirname "$0")/../.."

# Install uv (Python package/venv manager used by the rules engine build)
if ! command -v uv >/dev/null 2>&1; then
    curl -LsSf https://astral.sh/uv/install.sh | sh
fi
export PATH="$HOME/.local/bin:$PATH"

# Frontend env file
cd heat-stack
if [ ! -f .env ]; then
    cp .env.example .env
fi

npm install
npm run buildpy
npm run setup

# OS-level libraries Playwright's browsers need (avoids the
# "missing dependencies to run browsers" warning from npx playwright install)
sudo npx playwright install-deps

echo "postCreate setup complete."
