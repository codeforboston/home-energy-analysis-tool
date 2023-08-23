## H.E.A.T. frontend app docs

### On your computer

```
git clone git@github.com:codeforboston/home-energy-analysis-tool.git
# create an environment file
cp .env.example .env

# make sure you're using node version 18
npm install -g nvm
nvm use 18

# install and patch the environment
npm install
npm run dev
```

### Set up in a new GitHub CodingSpace:

```
# create an environment file
cp .env.example .env

nvm use 18
npm install
npm run dev
```

If you have the node version manager (`nvm`), then `nvm use 18` avoids engine error with node v19+ or newer which is default. nvm is preinstalled in coding spaces.

### Under special circumstances:

Assume you don't need to, but if the version of pyodide changes run:

```
cp ./node_modules/pyodide/* public/pyodide-env/
```

If the pyodide wheel for `numpy` for your version of `pyodide` isn't in `public/pyodide-env`:

- Make sure you have enough space on your computer for 1GB
- Download [a full 150+mb release](https://github.com/pyodide/pyodide/releases) onto your own computer. The filename is something like `pyodide-<some version number>.tar.bz2`.
- Double click it to extract it. It will take about 1GB to decompress.
- Upload the `numpy` .whl file into the `public/pyodide-env` folder.

How do you know if your version of `numpy` is right? You can check your version of pyodide by running `npm list pyodide`. You should check that the `numpy` .whl file name includes the same version number as the output of that command.

If you get an error saying you don't have the right loader:

```
npm run postinstall
```

It fixes the loader problem by doing the following programatically:

To re-create the patch for py file support in `/patch`, use these [instructions](https://github.com/remix-run/remix/discussions/2468#discussioncomment-2639271):
- edit the `node_modules/@remix-run/dev/dist/modules.d` file to add py, just like sql format.
- edit the `node_modules/@remix-run/dev/dist/compiler/utils/loader.ts` to add py, just like sql format.
- `npx patch-package @remix-run/dev`
- it should auto-apply any time you do `npm install`, but it may get out of sync with upstream

## Epic Stack docs:
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
npx create-remix@latest --typescript --install --template epicweb-dev/epic-stack
```

[![The Epic Stack](https://github-production-user-asset-6210df.s3.amazonaws.com/1500684/246885449-1b00286c-aa3d-44b2-9ef2-04f694eb3592.png)](https://www.epicweb.dev/epic-stack)

[The Epic Stack](https://www.epicweb.dev/epic-stack)

<hr />

## Watch Kent's Introduction to The Epic Stack

[![screenshot of a YouTube video](https://github-production-user-asset-6210df.s3.amazonaws.com/1500684/242088051-6beafa78-41c6-47e1-b999-08d3d3e5cb57.png)](https://www.youtube.com/watch?v=yMK5SVRASxM)

["The Epic Stack" by Kent C. Dodds at #RemixConf 2023 💿](https://www.youtube.com/watch?v=yMK5SVRASxM)

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
