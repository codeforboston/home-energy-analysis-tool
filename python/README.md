# Rules Engine
This is the workspace for the HEAT rules engine. 

For an outline of the logic behind the rules engine and a glossary of common terms, see the [Intro to Rules Engine wiki page](https://github.com/codeforboston/home-energy-analysis-tool/wiki/Intro-to-Rules-Engine).

## Development Environment Setup

You can setup in codespace or run locally.  Local environment setup can produce small build issues that can be hard to diagnose.  If you prefer setting up locally without using a codespace, see [Appendix A](#appendix-a---local-environment-setup)

### Setting Up Codespace
This is optional.  This is a good choice if you are having build errors in your local environment 
or if you simply prefer not to do any local setup.  It is not required to co-edit with LiveShare.

If you are coding with another person, only one of you needs to do these steps.

The free tier of codespace has a limitation based on core hours.  If you use codespaces 10 hours or more per week, you will probably hit the limit and have to start paying.

1. From github, either open the main repo or a fork.
2. navigate to the green "code" dropdown
3. select the "codespaces" taib
4. select the "..." menu
5. select "new with options"
6. on the options screen, under "Dev container configuration", select "Rules engine"
7. click "Create codespace".  This will open a web version of VSCode.  

![codespaces screenshot](docs/codespaces.png)

### Setting Up Python
If co-editing with LiveShare, only one person needs to do this.

1. Clone or fork the git repository, if not already done.
2. Open terminal.
3. Navigate to python by typing `cd python`.
4. Type `source setup-python.sh`. 
5. If you get a message that python version is wrong, modify .bashrc in your home directory (`/Users/<username>`) to add these lines and delete the default version:
```
which python3
<uninstalling will depend on how it was installed>
alias python3 <path to python 3.12 executable, including executable name>
export PYTHON_CMD=<path to python 3.12 executable, including executable name>
```
6. Run `pytest` and see tests run successfully.
7. When you open a new interval run `source venv/bin/activate`.


### Co-editing with LiveShare
If you are not coding with others using LiveShare you can skip this step.

The owner of the codespace or local envirment:
1. Install LiveShare extenion.
2. Open LiveShare extension.
3. Start a new session.  This will copy a LiveShare link into your clipboard.
4. Send the link to collaborators.
5. Each user, when prompted, open in local VSCode or with Codespace on the web.  If the user has VSCode installed  locally, the user will be able to open either in browser or locally.

### Opening a Terminal
**NOTE TO WINDOWS USERS: ALWAYS USE BASH TERMINAL**
1. To create a new terminal, select the `Terminal => New` menu option.
2. To open an existing terminal, select the terminal in the terminal pane. 
3. If you did not create the terminal, you will see a message to press Enter.  This creates a request for the terminal owner to give you read/write access.  
4. When the terminal owner gives you access, you will see an alert to press any key to focus the terminal.  Press the alert.

## Modifying Code for an Issue
### Creating a Branch
1. Find an issue to work on
2. Open a bash terminal
3. Create a branch from main.  Best practice for naming looks like this: <issue, feature, or other>/<issue number>/<description>.  Separate words in the description using a dash (-).  Consider using the subject as a description.  Example:
```
git checkout main
git checkout -b feature/341/validate-address
```
4. Commit frequently when you have made progress on the issue (you can always rollback).  Advantages:
- incrementaly roll back smaller changes 
- review smaller changes
- prevent losing unsaved files
- get sense of progress

To revert a commmit:
- `git reset --hard HEAD~1` if you want to go to the previous commit.  If you want to revert 2 commits, do `git reset --hard HEAD~2`.  
- if you have pushed the branch to github, you can either delete the branch from github and push again or do a force push.

### Adding Python Packages
Check with a development lead before adding a python package.  Adding python packages to development can be useful for syntax checking, testing, and building purposes, but should be avoided for production src code.  Incorporating new packages into rules-engine.whl, which is used by the front end, is complicated.  To add a package to development:
1. Add package to the "dev" section of pyproject.toml
2. Run pip-compile as described in the comments of requirements-dev.txt.  These instructions will autogenerate requirements-dev.txt.

### Creating a Pull Request
1. Rebase from main if not done recently.
```
git checkout main
git pull origin main
git checkout <your branch>
git rebase main
```

2. run the following validation commands first and fix any errors:
```
source check-python.sh
```
3. Push your branch either to a fork of the repository or to the main repo (if you have privileges): `git push origin <branch_name>`.
4. Create pull request from github.  
   - Include statement "Closes `#<issue number>`" if your changes completely fix or address the issue.
   - Check that all checks pass in the pull request.
5. Review file changes.
6. Include a brief description of changes in each file.
7. Request reviewers.


