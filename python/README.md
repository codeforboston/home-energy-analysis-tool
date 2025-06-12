# Rules Engine
This is the workspace for the HEAT rules engine. 

For an outline of the logic behind the rules engine and a glossary of common terms, see the [Intro to Rules Engine wiki page](https://github.com/codeforboston/home-energy-analysis-tool/wiki/Intro-to-Rules-Engine).

## Development


### Environment Setup
You can setup locally or with a codespace or using both. 
- Advantage of using codespace: You are less likely to get an environment error which is not always obvious and can cause a lot of time resolving.
- Advantage of local setup: development tools tend to work better, especially vscode.  List of 
features which work better with local setup:
  - vscode (specifics TBD)
  - other (please update when you run into them)

#### Note to Windows Users
When opening a terminal, always use bash.

#### Setup Locally
Simple steps for development setup:

1. Clone or fork the git repository, if not already done.
2. Open terminal.
3. Navigate to python by typing `cd python`
4. Type `source setup-python.sh`. 
5. If you get a message that python version is wrong, modify .bashrc in your home directory (`/Users/<username>`) to add these lines:
```
alias python3 <path to python 3.12 executable, including executable name>
export PYTHON_CMD=<path to python 3.12 executable, including executable name>
```
6. Rsun `pytest` and see tests run successfully.

#### Setup Codespace
1. navigate to the green "code" dropdown
2. select the "codespaces" tab
3. select the "..." menu
4. select "new with options"
5. on the options screen, under "Dev container configuration", select "Rules engine"
6. click "Create codespace"

#### Code Locally with VSCode, Run in Codespace
1. Set up codespace
2. Create a LiveShare session from the codespace
3. Connect your local VScode to the LiveShare session
4. Make code changes in VSCode and perform any terminal operations from Codespace.

![codespaces screenshot](docs/codespaces.png)

### Modifying Code
1. Find an issue to work on
2. Create a branch from main.  Best practice for naming looks like this: <issue, feature, or other>/<issue number>/<description>.  Separate words in the description using a dash (-).  Consider using the subject as a description.  Example:
```
git checkout main
git checkout -b feature/341/validate-address
```
3. Commit frequently when you have made progress on the issue to avoid possibly losing work, make it possible to incrementaly roll back smaller bits, and make it easier to see the incremental changes.  
- run the following validation commands first and fix any errors:
```
black .
mypy .
lint .
typecheck .
pytest
```
- if you decide to revert code, do a `git reset HEAD~1` if you want to go to the previous commit.  If you want to revert 2 commits, do `git reset HEAD~2`.  Doing incremental commits makes it possible to rollback fewer changes.  If you have pushed the branch to github, you will need to delete the branch from github and push again.

### Creating a Pull Request
1. If you haven't run the validation commands in the previous section.
2. Push your branch either to a fork of the repository or to the main repo (if you have privileges): `git push origin <branch_name>`
3. Create pull request from github.  
   - Include statement "Closes #<issue number>" if your changes completely fix or address the issue.
   - Check that all checks pass in the pull request.
   - Request reviewers

