black:
	black --check .

isort:
	isort --check .

pydocstyle:
	pydocstyle .

lint: black isort pydocstyle

mypy:
	mypy .

test:
	pytest .

build:
	pip install -q build
	python -m build

all: lint mypy test build
