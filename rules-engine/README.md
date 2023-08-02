# Rules Engine
This is the workspace for the HEAT rules engine. 

For an outline of the logic behind the rules engine and a glossary of common terms, see the [Intro to Rules Engine wiki page](https://github.com/codeforboston/home-energy-analysis-tool/wiki/Intro-to-Rules-Engine).

## Development
Simple steps for development setup:

1. Create a [virtual environment](https://docs.python.org/3/library/venv.html#creating-virtual-environments) and activate it
2. `pip install -e .`
3. `pip install -r requirements-dev.txt`

Then, you should be able to run `pytest` and see tests run successfully.
