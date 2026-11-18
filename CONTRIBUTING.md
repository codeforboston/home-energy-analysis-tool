# Contributing to the Home Energy Analysis Tool

## Setting up pre-commit in this repository

This repository uses pre-commit to run formatting and checks on the `heat-stack/` and `python/` folders. You only need to set up pre-commit once per clone. Run the commands from the repository root unless a step says otherwise.

### Prerequisites

- **Git**
- **uv**, the Python package manager used by this project
- **Node.js**, which provides the `npm` command used to install the frontend tools. On Windows, make sure `node` is on your PATH.

### Windows and WSL

See [here](/heat-stack/README.md#windows-and-wsl)

### Steps

1. Clone the repository and move into it:

    ```bash
    git clone https://github.com/codeforboston/home-energy-analysis-tool
    cd home-energy-analysis-tool
    ```

2. Install the root tools, including pre-commit, and the Python development tools:

    ```bash
    uv sync
    uv sync --directory python --extra dev
    ```

3. Install the frontend dependencies, which include the Prettier version the hook uses:

   ```bash
    cd heat-stack
    npm install
    cd ..
   ```

4. Install the Git hooks for commits and pushes:

   ```bash
   uv run pre-commit install --hook-type pre-commit --hook-type pre-push
   ```

5. Check that everything works by running all hooks on the whole repository:

   ```bash
   uv run pre-commit run --all-files
   ```

### What runs and when

- **On commit:** Black, isort, mypy on `python/`, and Prettier on the relevant `heat-stack/` files.
- **On push:** pytest on the Python code. It's slower, so it runs only when you push.

### Formatting manually

To format the frontend files without committing, run this from `heat-stack/`:

```bash
npm run format
```

To check formatting without changing files, run `npm run format:check`.

### Troubleshooting

- **Prettier failed on commit.** The Prettier hook only checks formatting and doesn't fix files. Run `npm run format` from `heat-stack/`, review the changes with `git diff`, stage them, and commit again.
- **Black or isort changed files.** Review the changes with `git diff`, stage them, and commit again.
- **Hooks didn't run after a commit.** Re-run step 4 to make sure the hooks are installed.
- **The Prettier hook can't find `node` on Windows.** Confirm that `node --version` works in the same terminal you use for `git commit`.
- **You see a message about migrating an existing hook.** Stop and ask the maintainers before continuing. Don't delete or overwrite hook files without checking what they do.
- **Something else is wrong.** Run `uv run pre-commit run --all-files --verbose` and share the output with the team.
