## H.E.A.T. Frontend Setup Documentation

This guide will help you set up the frontend application for the Home Energy
Analysis Tool (H.E.A.T.) project. Please follow these instructions carefully.

---

### Repository Setup

1. **Fork the repository**  
   Go to the
   [home-energy-analysis-tool repository](https://github.com/codeforboston/home-energy-analysis-tool)
   and click the "Fork" button at the top right to create your own copy of the
   repository.

2. **Clone your forked repository**  
   After forking, clone your fork to your local machine using the following
   command (replace `your-username` with your GitHub username):

   ```bash
   git clone git@github.com:your-username/home-energy-analysis-tool.git
   ```

3. **Navigate to the project directory**  
   Change into the `heat-stack` directory within the project:

   ```bash
   cd home-energy-analysis-tool/heat-stack
   ```

---

### Node.js Setup

The project requires Node.js version 22.
[Use Node Version Manager (NVM)](https://github.com/nvm-sh/nvm/blob/master/README.md)
for managing Node.js versions (nvm is preinstalled in coding spaces).

#### Install NVM (Official Method)

NVM is the version manager for NPM, but is not necessary to use it. If you do
not install NVM, skip `nvm` steps during setup.

1. Download and install NVM:

   In bash shell:

   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
   ```

   If curl does not work, please download node.js version 22 manually:
   https://nodejs.org/en/download/current

   If using mac, install with `brew install nvm`.

2. Restart your terminal. Ensure NVM is installed by running:
   ```bash
   nvm --version
   ```
   If command cannot be found, add nvm to your environment variable (PATH).
3. Install Node.js version 22:
   ```bash
   nvm install 22
   ```
4. Use Node.js version 22:
   ```bash
   nvm use 22
   ```

---

### Install Dependencies and Build

1. If you're not already in the `heat-stack` directory, change into it:

   ```bash
   cd heat-stack
   ```

2. Use Node.js version 22:

   ```bash
   nvm use 22
   ```

3. Install project dependencies:

   ```bash
   npm install
   ```

4. Set up Python and build the rules engine into the `public/pyodide-env` folder. Before you run `buildpy`, you need to install `uv` (step 2 of the [Python README](/python/README.md#local-environment-setup)).

   ```bash
   npm run buildpy
   ```

   This builds the rules engine into `public/pyodide-env` and needs no Python installed separately. Run it again whenever the Python code changes.

   Everyone who commits to this repository also needs the pre-commit hooks, even if you only work on JavaScript. Set them up from the repository root, not from `heat-stack/`, by following step 4 of the [Python README](/python/README.md#local-environment-setup).  If you're currently in `heat-stack/`, run `cd ..` first. `uv` commands run from `heat-stack/` will fail.

5. Copy the example environment file into a new `.env` file:
   ```bash
   cp .env.example .env
   ```
6. Setup the SQLite Database:
   ```bash
   npm run setup
   ```
7. Seed the Database:
   ```bash
   npx prisma db seed
   ```
8. Start the development server:
   ```bash
   npm run dev
   ```

Note: After the initial setup, run commands 6-8 to start up the project again.

- The login is Kody (ask team for password)

If you encounter errors during this process, try the following steps:

- Delete the `node_modules` folder and `package-lock.json` file:
  ```bash
  rm -rf node_modules package-lock.json
  ```
- Reinstall dependencies:
  ```bash
  npm install
  ```
- Run the development server again:
  ```bash
  npm run dev
  ```

---

### Setting Up in GitHub Codespaces

If using GitHub Codespaces, follow these steps. The Codespace opens at the repository root, so the `uv` and hook setup runs there before you move into `heat-stack/`.

1. Install `uv` and set up the root and Python environments from the repository root:

   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   . "$HOME/.local/bin/env"
   uv sync
   uv sync --directory python --extra dev
   ```

2. Install the pre-commit hooks:

   ```bash
   uv run pre-commit install --hook-type pre-commit --hook-type pre-push
   ```

   Confirm that `.git/hooks/pre-commit` and `.git/hooks/pre-push` both exist.

3. Navigate to the project directory:

   ```bash
   cd heat-stack
   ```

4. Create an environment file:

   ```bash
   cp .env.example .env
   ```

5. Use Node.js version 22:

   ```bash
   nvm install 22
   nvm use 22
   ```

6. Install dependencies and build (some errors due to headless mode at the end of `npm run setup` are okay):

   ```bash
   npm install
   npm run buildpy
   npm run setup
   npx prisma db seed # create kody user
   npm run dev
   ```

7. Disable auto-save in VSCode (this is to avoid auto recompiling and page
   refresh while making changes):
   - Go to **File** > **Preferences** > **Settings**.
   - Search for "Auto Save" and uncheck it.
   - For reference, see
     [this Stack Overflow post](https://stackoverflow.com/a/76659316/14144258).

---

### Committing your changes

Before committing your changes, make sure to lint `npm run lint` and format
`npm run format`

---

### Windows and WSL

On Windows, do every step in the WSL terminal, and keep the project in your WSL home folder rather than under `/mnt/c`. The `.venv` folders and `node_modules` only work on the system that created them, so mixing Windows and WSL tools in one project breaks them.

#### Install uv and Node in WSL

1. Install WSL by following the [Microsoft WSL install guide](https://learn.microsoft.com/en-us/windows/wsl/install).
2. Open the WSL terminal and install uv:

   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   . "$HOME/.local/bin/env"
   ```

3. Close and reopen the WSL terminal so `uv` is on your PATH.
4. Install Node.js 22 with nvm by following steps 1 to 4 of [Install NVM (Official Method)](https://github.com/codeforboston/home-energy-analysis-tool/blob/main/heat-stack/README.md#install-nvm-official-method) in the heat-stack README.

#### Clone into your WSL home folder

Clone the repository from the WSL terminal, not from Windows:

```bash
cd ~
mkdir -p ~/code
cd ~/code
git clone git@github.com:your-username/home-energy-analysis-tool.git
cd home-energy-analysis-tool
```

Run `pwd` to confirm the path does not start with `/mnt/c`. To open the folder in Windows File Explorer, run `explorer.exe .` from the project folder.

#### Check which tools WSL is using

Run these from the project folder:

```bash
which uv
which npm
```

Both should show Linux paths. `uv` should be under `/home/<your-username>/`, and `npm` should be under `/home/<your-username>/.nvm/`. If either starts with `/mnt/c`, WSL is picking up the Windows version from your PATH. The quickest fix is to install the tool inside WSL as described above and reopen the terminal. If the problem persists, set `appendWindowsPath = false` under `[interop]` in `/etc/wsl.conf`, then run `wsl --shutdown` from Windows and reopen WSL.

#### If you set up on Windows first

Delete the Windows-created environments, then reinstall inside WSL:

```bash
rm -rf .venv python/.venv heat-stack/node_modules
uv sync
uv sync --directory python --extra dev
uv run pre-commit install --hook-type pre-commit --hook-type pre-push
cd heat-stack
npm install
```

Reinstalling the hooks is required because the hook files in `.git/hooks` point to the Python environment that created them.

---

### Handling Special Cases

#### Updating Pyodide

If the version of Pyodide changes or you encounter issues with the Pyodide
environment:

1. Copy the necessary Pyodide files:
   ```bash
   cp ./node_modules/pyodide/* public/pyodide-env/
   ```
2. Ensure the correct `numpy` wheel file is in the `public/pyodide-env` folder.
   If missing:
   - Download the latest Pyodide release from
     [Pyodide releases](https://github.com/pyodide/pyodide/releases).
   - Extract the file and locate the `numpy` wheel file.
   - Copy it into the `public/pyodide-env` folder.
3. Check the Pyodide version:
   ```bash
   npm list pyodide
   ```
   Ensure the `numpy` file matches the version.

#### Fixing Loader Errors

If you encounter a loader error, run:

```bash
npm run postinstall
```

---

### Additional Notes

- The `npm audit fix` command can resolve minor dependency issues.
- For a clean setup, ensure sufficient disk space (at least 1GB).

---

### Script Overview

Below is a table summarizing the available scripts in the project:

| **Script**                 | **Description**                                                                  |
| -------------------------- | -------------------------------------------------------------------------------- |
| `npm run build`            | Runs all build-related tasks.                                                    |
| `npm run build:icons`      | Generates icons for the project.                                                 |
| `npm run build:remix`      | Builds the Remix application using Vite.                                         |
| `npm run build:server`     | Builds the server files.                                                         |
| `npm run predev`           | Prepares the environment before starting development (e.g., generates icons).    |
| `npm run dev`              | Starts the development server.                                                   |
| `npm run prisma:studio`    | Launches the Prisma Studio UI for database management.                           |
| `npm run format`           | Formats the codebase using Prettier.                                             |
| `npm run lint`             | Lints the codebase using ESLint.                                                 |
| `npm run setup`            | Runs setup tasks including building, migrations, and Playwright setup.           |
| `npm run start`            | Starts the application in production mode.                                       |
| `npm run start:mocks`      | Starts the application with mock data in production mode.                        |
| `npm run test`             | Runs unit tests and builds the Python rules engine.                              |
| `npm run buildpy`          | Builds the Python rules engine and copies it to the `public/pyodide-env` folder. |
| `npm run coverage`         | Runs tests and generates a coverage report.                                      |
| `npm run test:e2e`         | Runs end-to-end tests interactively.                                             |
| `npm run test:e2e:run`     | Runs end-to-end tests in CI mode.                                                |
| `npm run test:e2e:install` | Installs dependencies for Playwright end-to-end tests.                           |
| `npm run typecheck`        | Checks TypeScript types.                                                         |
| `npm run validate`         | Validates the project by running linting, type-checking, and testing.            |

---

### Epic Stack Docs:

<div align="center">
  <h1 align="center"><a href="https://www.epicweb.dev/epic-stack">The Epic Stack 🚀</a></h1>
  <strong align="center">
    Ditch analysis paralysis and start shipping Epic Web apps.
  </strong>
  <p>
    This is an opinionated project starter and reference that allows teams to
    ship their ideas to production faster and on a more stable foundation based
    on the experience of <a href="https://kentcdodds.com">Kent C. Dodds</a> and
    <a href="https://github.com/epicweb-dev/epic-stack/graphs/contributors">contributors</a>.
  </p>
</div>

```sh
npx create-epic-app@latest
```

[![The Epic Stack](https://github-production-user-asset-6210df.s3.amazonaws.com/1500684/246885449-1b00286c-aa3d-44b2-9ef2-04f694eb3592.png)](https://www.epicweb.dev/epic-stack)

[The Epic Stack](https://www.epicweb.dev/epic-stack)

<hr />

## Watch Kent's Introduction to The Epic Stack

[![Epic Stack Talk slide showing Flynn Rider with knives, the text "I've been around and I've got opinions" and Kent speaking in the corner](https://github-production-user-asset-6210df.s3.amazonaws.com/1500684/277818553-47158e68-4efc-43ae-a477-9d1670d4217d.png)](https://www.epicweb.dev/talks/the-epic-stack)

["The Epic Stack" by Kent C. Dodds](https://www.epicweb.dev/talks/the-epic-stack)

## Docs

[Read the docs](https://github.com/epicweb-dev/epic-stack/blob/main/docs)
(please 🙏).

## Support

- 🆘 Join the
  [discussion on GitHub](https://github.com/epicweb-dev/epic-stack/discussions)
  and the [KCD Community on Discord](https://kcd.im/discord).
- 💡 Create an
  [idea discussion](https://github.com/epicweb-dev/epic-stack/discussions/new?category=ideas)
  for suggestions.
- 🐛 Open a [GitHub issue](https://github.com/epicweb-dev/epic-stack/issues) to
  report a bug.

## Branding

Want to talk about the Epic Stack in a blog post or talk? Great! Here are some
assets you can use in your material:
[EpicWeb.dev/brand](https://epicweb.dev/brand)

## Thanks

You rock 🪨
