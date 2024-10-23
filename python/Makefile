black:
	black --check .

isort:
	isort --check .

pydocstyle:
	pydocstyle .

lint: black isort pydocstyle

mypy:
	mypy .

gen_examples:
	python .\tests\test_rules_engine\generate_example_data.py

test:
	pytest .

build:
	pip install -q build
	python -m build

all: lint mypy gen_examples test build
