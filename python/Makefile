black:
	uv run black --check .

isort:
	uv run isort --check .

pydocstyle:
	uv run pydocstyle .

lint: black isort pydocstyle

mypy:
	uv run mypy . --exclude build

gen_examples:
	uv run python tests/test_rules_engine/generate_example_data.py

test:
	uv run pytest .

build:
	uv build

all: lint mypy gen_examples test build
