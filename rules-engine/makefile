lint:
	black --check .
	isort --check .
	mypy .
	pydocstyle .

test:
	pytest .

build:
	pip install -q build
	python -m build

all: lint test build
