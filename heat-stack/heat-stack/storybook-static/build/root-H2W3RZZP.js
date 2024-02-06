import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  sprite_default
} from "/build/_shared/chunk-6IU6NOV5.js";
import "/build/_shared/chunk-BM2PTB5J.js";
import {
  Links,
  Outlet,
  Scripts
} from "/build/_shared/chunk-DKP5DHW6.js";
import "/build/_shared/chunk-GIAAE3CH.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XU7DNSPJ.js";
import {
  createHotContext
} from "/build/_shared/chunk-O7QHA5CH.js";
import "/build/_shared/chunk-UWV35TSL.js";
import "/build/_shared/chunk-BOXFZXVX.js";
import {
  __commonJS,
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// empty-module:./utils/auth.server.ts
var require_auth_server = __commonJS({
  "empty-module:./utils/auth.server.ts"(exports, module) {
    module.exports = {};
  }
});

// empty-module:./utils/db.server.ts
var require_db_server = __commonJS({
  "empty-module:./utils/db.server.ts"(exports, module) {
    module.exports = {};
  }
});

// empty-module:./utils/env.server.ts
var require_env_server = __commonJS({
  "empty-module:./utils/env.server.ts"(exports, module) {
    module.exports = {};
  }
});

// empty-module:./utils/timing.server.ts
var require_timing_server = __commonJS({
  "empty-module:./utils/timing.server.ts"(exports, module) {
    module.exports = {};
  }
});

// empty-module:./utils/csrf.server.ts
var require_csrf_server = __commonJS({
  "empty-module:./utils/csrf.server.ts"(exports, module) {
    module.exports = {};
  }
});

// empty-module:./utils/honeypot.server.ts
var require_honeypot_server = __commonJS({
  "empty-module:./utils/honeypot.server.ts"(exports, module) {
    module.exports = {};
  }
});

// css-bundle-plugin-ns:@remix-run/css-bundle
var cssBundleHref = "/build/css-bundle-QHCTROZA.css";

// app/root.tsx
var import_node = __toESM(require_node(), 1);

// app/styles/font.css
var font_default = "/build/_assets/font-ISWYXDEE.css";

// app/styles/tailwind.css
var tailwind_default = "/build/_assets/tailwind-BCRIAOER.css";

// app/root.tsx
var import_auth_server = __toESM(require_auth_server(), 1);
var import_db_server = __toESM(require_db_server(), 1);
var import_env_server = __toESM(require_env_server(), 1);
var import_timing_server = __toESM(require_timing_server(), 1);
var import_csrf_server = __toESM(require_csrf_server(), 1);
var import_honeypot_server = __toESM(require_honeypot_server(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/root.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/root.tsx"
  );
}
var links = () => {
  return [
    // Preload svg sprite as a resource to avoid render blocking
    {
      rel: "preload",
      href: sprite_default,
      as: "image"
    },
    // Preload CSS as a resource to avoid render blocking
    {
      rel: "preload",
      href: font_default,
      as: "style"
    },
    {
      rel: "preload",
      href: tailwind_default,
      as: "style"
    },
    cssBundleHref ? {
      rel: "preload",
      href: cssBundleHref,
      as: "style"
    } : null,
    {
      rel: "mask-icon",
      href: "/favicons/mask-icon.svg"
    },
    {
      rel: "alternate icon",
      type: "image/png",
      href: "/favicons/favicon-32x32.png"
    },
    {
      rel: "apple-touch-icon",
      href: "/favicons/apple-touch-icon.png"
    },
    {
      rel: "manifest",
      href: "/site.webmanifest",
      crossOrigin: "use-credentials"
    },
    // necessary to make typescript happy
    //These should match the css preloads above to avoid css as render blocking resource
    {
      rel: "icon",
      type: "image/svg+xml",
      href: "/favicons/favicon.svg"
    },
    {
      rel: "stylesheet",
      href: font_default
    },
    {
      rel: "stylesheet",
      href: tailwind_default
    },
    cssBundleHref ? {
      rel: "stylesheet",
      href: cssBundleHref
    } : null
  ].filter(Boolean);
};
function HeatStack({
  children,
  env = {},
  nonce
}) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("html", { lang: "en", className: `${"light"} h-full overflow-x-hidden`, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("head", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("meta", { charSet: "utf-8" }, void 0, false, {
        fileName: "app/root.tsx",
        lineNumber: 177,
        columnNumber: 5
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("meta", { name: "viewport", content: "width=device-width,initial-scale=1" }, void 0, false, {
        fileName: "app/root.tsx",
        lineNumber: 178,
        columnNumber: 5
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Links, {}, void 0, false, {
        fileName: "app/root.tsx",
        lineNumber: 179,
        columnNumber: 5
      }, this)
    ] }, void 0, true, {
      fileName: "app/root.tsx",
      lineNumber: 176,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("body", { className: "bg-background text-foreground", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "container items-center justify-between gap-4 md:h-24 md:flex-row", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: "Site header" }, void 0, false, {
          fileName: "app/root.tsx",
          lineNumber: 183,
          columnNumber: 6
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("hr", {}, void 0, false, {
          fileName: "app/root.tsx",
          lineNumber: 184,
          columnNumber: 6
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("br", {}, void 0, false, {
          fileName: "app/root.tsx",
          lineNumber: 185,
          columnNumber: 6
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Outlet, {}, void 0, false, {
          fileName: "app/root.tsx",
          lineNumber: 186,
          columnNumber: 6
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("br", {}, void 0, false, {
          fileName: "app/root.tsx",
          lineNumber: 187,
          columnNumber: 6
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("hr", {}, void 0, false, {
          fileName: "app/root.tsx",
          lineNumber: 188,
          columnNumber: 6
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: "Site footer" }, void 0, false, {
          fileName: "app/root.tsx",
          lineNumber: 189,
          columnNumber: 6
        }, this)
      ] }, void 0, true, {
        fileName: "app/root.tsx",
        lineNumber: 182,
        columnNumber: 5
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("script", { nonce, dangerouslySetInnerHTML: {
        __html: `window.ENV = ${JSON.stringify(env)}`
      } }, void 0, false, {
        fileName: "app/root.tsx",
        lineNumber: 191,
        columnNumber: 5
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Scripts, { nonce }, void 0, false, {
        fileName: "app/root.tsx",
        lineNumber: 195,
        columnNumber: 5
      }, this)
    ] }, void 0, true, {
      fileName: "app/root.tsx",
      lineNumber: 181,
      columnNumber: 4
    }, this)
  ] }, void 0, true, {
    fileName: "app/root.tsx",
    lineNumber: 175,
    columnNumber: 10
  }, this);
}
_c = HeatStack;
var _c;
$RefreshReg$(_c, "HeatStack");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  HeatStack as default,
  links
};
//# sourceMappingURL=/build/root-H2W3RZZP.js.map
