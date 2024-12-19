# Rules Engine
This is the workspace for the HEAT rules engine. 

For an outline of the logic behind the rules engine and a glossary of common terms, see the [Intro to Rules Engine wiki page](https://github.com/codeforboston/home-energy-analysis-tool/wiki/Intro-to-Rules-Engine).

## Development

### Setup
Simple steps for development setup:

1. Clone the git repository.
2. Navigate to python by typing `cd python`
3. Type `source setup-python.sh`

Then, you should be able to run `pytest` and see tests run successfully.

### Continuous Integration
Type `make` to see lint, type errors, and more.  The terminal will reveal individual tests to run again.  
* If `black` alone is a problem, then run `black .` to automatically reformat your code.
* If `mypy` is a problem, then run `mypy .` to run `mypy` again.