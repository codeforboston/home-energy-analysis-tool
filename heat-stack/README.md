### H.E.A.T. frontend app docs:

In GitHub CodingSpace:
- `nvm use 18` to avoid engine error with node v19+ which is default. nvm is preinstalled in coding spaces.

- After updating pyodide with `npm install`, you must run this command to update the wasm files:
`cp ./node_modules/pyodide/* public/pyodide-env/`
- To add pyodide dependencies like `numpy`, extract them from [a full 150+mb release](https://github.com/pyodide/pyodide/releases) and upload the wasm file into the `public/pyodide-env` folder.

To re-create the patch for py file support in `/patch` using [instruction](https://github.com/remix-run/remix/discussions/2468#discussioncomment-2639271):
- edit the `node_modules/@remix-run/dev/dist/modules.d` file to add py, just like sql format.
- edit the `node_modules/@remix-run/dev/dist/compiler/utils/loader.ts` to add py, just like sql format.
- `npx patch-package @remix-run/dev`
- it should auto-apply any time you do `npm install`, but it may get out of sync with upstream

### Epic Stack docs:
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
