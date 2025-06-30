## H.E.A.T. Frontend Setup Documentation

This guide will help you set up the frontend application for the Home Energy
Analysis Tool (H.E.A.T.) project. Please follow these instructions carefully.

---

### Prerequisites

#### Install Git Large File Storage (Git LFS)

Git LFS is required to manage large files in the repository. Choose one of the
methods below to install it:

**Method 1: Using Homebrew (Recommended)**

```bash
brew install git-lfs
git lfs install
```

**Method 2: Manual Installation**

1. Download the Git LFS installer from [git-lfs.com](https://git-lfs.com/).
2. Unzip the downloaded file and navigate to the extracted folder:
   ```bash
   cd ~/Downloads/git-lfs-<version>
   ```
3. Run the installation script:
   ```bash
   ./install.sh
   git lfs install
   ```
4. Confirm the installation with:
   ```bash
   git lfs install
   ```

For more details, visit the
[official documentation](https://docs.github.com/en/repositories/working-with-files/managing-large-files/installing-git-large-file-storage).

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

1. Download and install NVM:
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
   ```
   If curl does not work, please download node.js manually: https://nodejs.org/en/download/current
   If using mac, install with `brew install nvm`.

2. Restart your terminal. Ensure NVM is installed by running:
   ```bash
   nvm --version
   ```
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

1. Install project dependencies:
   ```bash
   npm install
   ```
2. Build the rules engine into the `public/pyodide-env` folder:
   ```bash
   npm run buildpy
   ```
3. Setup the SQLite Database:
   ```bash
   npm run setup
   ```
4. Copy the example environment file into a new `.env` file:
   ```bash
   cp .env.example .env
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

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

If using GitHub Codespaces, follow these steps:

1. Navigate to the project directory:
   ```bash
   cd heat-stack
   ```
2. Create an environment file:
   ```bash
   cp .env.example .env
   ```
3. Use Node.js version 22:
   ```bash
   nvm install 22
   nvm use 22
   ```
4. Install dependencies and build:
   ```bash
   npm install
   npm run buildpy
   npm run setup
   npm run dev
   ```
5. Disable auto-save in VSCode (this is to avoid auto recompiling and page
   refresh while making changes):
   - Go to **File** > **Preferences** > **Settings**.
   - Search for "Auto Save" and uncheck it.
   - For reference, see
     [this Stack Overflow post](https://stackoverflow.com/a/76659316/14144258).

---

### Committing your changes
Before committing your changes, go to the `heat-stack` directory and run `source prepare.sh` from the terminal to format
your code via `Prettier`.
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
