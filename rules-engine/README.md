# Rules Engine
This is the workspace for the HEAT rules engine. 

For an outline of the logic behind the rules engine and a glossary of common terms, see the [Intro to Rules Engine wiki page](https://github.com/codeforboston/home-energy-analysis-tool/wiki/Intro-to-Rules-Engine).

## Development
Simple steps for development setup:

1. Clone the git repository.
2. Navigate to any directory and create a [virtual environment](https://docs.python.org/3/library/venv.html#creating-virtual-environments) and activate it
3. The following commands can be run from inside the rules-engine folder while the virtual environment is active
4. `pip install -e .` builds the [python egg](https://stackoverflow.com/questions/2051192/what-is-a-python-egg) for the rules engine and then installs the rules engine in an editable form
5. `pip install -r requirements-dev.txt` which installs the required libraries

Then, you should be able to run `pytest`, also from any directory, and see tests run successfully.

### Development Environment using Conda
If you are having trouble using the venv virtual environment, the Conda virtual environment can be used instead. Miniconda is installed by default in all of our codespaces.
1. Initialize Conda using `conda init`.
2. Open a new shell/terminal. You will know that it is working if you see `(base)` to the left of the command prompt.
3. Create a new virtual environment named `<name>` using `conda create -n <name> python=3.11`. This creates a new virtual environment using the latest Python 3.11.
4. Activate the virtual environment using `conda activate <name>`.
5. Continue development as normal (`pip install ...`).
