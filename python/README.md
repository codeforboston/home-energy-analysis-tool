# Rules Engine
This is the workspace for the HEAT rules engine. 

For an outline of the logic behind the rules engine and a glossary of common terms, see the [Intro to Rules Engine wiki page](https://github.com/codeforboston/home-energy-analysis-tool/wiki/Intro-to-Rules-Engine).

## Development

### Setup

Mac:

1. Clone the git repository.
2. Navigate to python by typing `cd python`
3. Type `source setup-python.sh`

Windows:

1. Clone the git directory
2. Navigate to python by typing `cd python`
3. Run `setup-python-windows.bat`

Then, you should be able to run `pytest` and see tests run successfully.

Note: When setting up in windows there is a error that occurs `error: metadata-generation-failed`. Not a concern now. Command pip list returns these libraries

Package           Version 

annotated-types   0.7.0
pip               25.0.1
pydantic          2.11.5
pydantic_core     2.33.2
rules-engine      0.0.1   home-energy-analysis-tool\python
typing_extensions 4.14.0
typing-inspection 0.4.1

When the application is opened using Visual Studio Code, the Python in the virtual environment should be activated. Activate using 
`.venv/Scripts/activate`


## Codespaces
The default codespace does not have the version of Python pre-installed that is used to develop the rules engine.  You _can_ use it and update it to install the correct Python vsion, but this takes time.  

Instead, you can spin up a codespace with the correct version like so:

1. navigate to the green "code" dropdown
2. select the "codespaces" tab
3. select the "..." menu
4. select "new with options"
5. on the options screen, under "Dev container configuration", select "Rules engine"
6. click "Create codespace"

![codespaces screenshot](docs/codespaces.png)

### Continuous Integration
Type `make` to see lint, type errors, and more.  The terminal will reveal individual tests to run again.  
* If `black` alone is a problem, then run `black .` to automatically reformat your code.
* If `mypy` is a problem, then run `mypy .` to run `mypy` again.