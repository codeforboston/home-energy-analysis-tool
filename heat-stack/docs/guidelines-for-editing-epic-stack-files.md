## Modifying Config Files

Epic Stack ships with a set of configuration files to support its tooling and
conventions. Most of these files are designed to be customized for your
project’s needs. However, some changes may impact core functionality or upgrade
paths. Use the table below to determine which files are safe to modify and which
require extra caution ("Edge").

| Config File                      | Shipped with Epic Stack | Safe to Modify | Notes                                                         |
| -------------------------------- | :---------------------: | :------------: | ------------------------------------------------------------- |
| package.json                     |           Yes           |      Edge      | Add scripts/deps freely, but don’t remove/rename core scripts |
| tsconfig.json                    |           Yes           |      Safe      | Add paths/options, avoid removing required settings           |
| playwright.config.ts             |           Yes           |      Safe      | Adjust test settings as needed                                |
| tailwind.config.ts               |           Yes           |      Safe      | Customize design system                                       |
| postcss.config.js                |           Yes           |      Safe      | Add plugins as needed                                         |
| vite.config.ts                   |           Yes           |      Safe      | Adjust build/dev settings                                     |
| remix.config.js                  |           Yes           |      Edge      | Update routes/loaders, but avoid breaking core routing/build  |
| .env                             |           Yes           |      Safe      | Add environment variables, never commit secrets               |
| prisma/schema.prisma             |           Yes           |      Safe      | Update schema, run migrations properly                        |
| .eslintrc / eslint.config.js     |           Yes           |      Safe      | Adjust lint rules as needed                                   |
| .prettierrc / prettier.config.js |           Yes           |      Safe      | Adjust formatting rules as needed                             |

**Legend:**

- **Safe**: Customization is expected and supported.
- **Edge**: Customization is possible, but removing or breaking core
  settings/scripts may cause issues with Epic Stack features or upgrades.
