# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Home Energy Analysis Tool (H.E.A.T.) project, designed to help residential energy coaches and homeowners estimate a home's heating requirements and assess whether proposed heat pumps have sufficient heating capacity. The project consists of two main components:

1. **Frontend (Heat Stack)**: A React/Remix application built on Epic Stack
2. **Rules Engine**: A Python-based calculation engine that runs in-browser via Pyodide

## Frontend (Heat Stack) Commands

```bash
# Setup project
cd heat-stack
cp .env.example .env
npm install
npm run buildpy   # Build the Python rules engine
npm run setup     # Setup database and migrations

# Development
npm run dev       # Start development server with mocks
npm run dev:no-mocks  # Start development server without mocks

# Testing
npm run test      # Run all tests
npm run test-pyodide  # Run Pyodide-specific tests
npm run test:e2e  # Run end-to-end tests (UI mode)
npm run test:e2e:run  # Run end-to-end tests (CI mode)

# Linting and Type Checking
npm run lint      # Lint codebase
npm run typecheck # Check TypeScript types
npm run format    # Format codebase with Prettier

# Building
npm run build     # Run all build tasks

# Database
npm run prisma:studio  # Launch Prisma Studio for database management
```

## Python Rules Engine Commands

```bash
# Setup Python environment
cd python
source setup-python.sh

# Testing
pytest            # Run all tests
pytest tests/test_rules_engine/test_engine.py  # Run specific test module

# Linting and Type Checking
make lint         # Run linting tools (black, isort, pydocstyle)
make mypy         # Run type checking
black .           # Auto-format code with black

# Building
make build        # Build the Python package
```

## Architecture

### Frontend (Heat Stack)
- Built with React and Remix on the Epic Stack framework
- Uses React Router for routing
- Uses Prisma as ORM with SQLite database
- Uses Pyodide to run Python code in the browser
- Main components are in `/heat-stack/app/components/ui/heat`
- Case analysis flows are under `/heat-stack/app/routes/_heat+`

### Rules Engine
- Python-based engine (requires Python 3.11.3+)
- Implements calculations for heat load analysis
- Uses Pydantic for data validation
- Core modules: `engine.py`, `parser.py`, `pydantic_models.py`, `helpers.py`
- Packaged for browser via Pyodide

### Data Flow
1. User inputs home data and energy usage in the frontend
2. Frontend passes data to Python rules engine via Pyodide
3. Rules engine calculates heat load and other metrics
4. Results are visualized in the frontend with graphs and summaries

## Important Files
- `/heat-stack/app/components/ui/heat/CaseSummaryComponents`: Components for displaying analysis results
- `/heat-stack/app/utils/pyodide.util.js`: Utilities for interacting with Pyodide
- `/python/src/rules_engine/engine.py`: Main calculation engine
- `/python/src/rules_engine/pydantic_models.py`: Data models for the rules engine

## Development Notes
- **Node Version**: The project requires Node.js version 22
- **Python Version**: The rules engine requires Python 3.11.3+
- **Weather Data**: Uses external weather APIs for temperature data
- **Database**: Uses SQLite with Prisma for persistence