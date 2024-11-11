# Rules Engine
This is the workspace for the HEAT rules engine. 

For an outline of the logic behind the rules engine and a glossary of common terms, see the [Intro to Rules Engine wiki page](https://github.com/codeforboston/home-energy-analysis-tool/wiki/Intro-to-Rules-Engine).

## Development
Simple steps for development setup:

1. Clone the git repository.
3. Navigate to any directory and create a [virtual environment](https://docs.python.org/3/library/venv.html#creating-virtual-environments) and activate it
4. The following commands can be run from inside the rules-engine folder while the virtual environment is active
2. `pip install -e .` builds the [python egg](https://stackoverflow.com/questions/2051192/what-is-a-python-egg) for the rules engine and then installs the rules engine
3. `pip install -r requirements-dev.txt` which installs the required libraries

Then, you should be able to run `pytest`, also from any directory, and see tests run successfully.
