import {
  useUser
} from "/build/_shared/chunk-5XRMLWXG.js";
import {
  Spacer
} from "/build/_shared/chunk-4UQVKXCC.js";
import {
  require_auth_server
} from "/build/_shared/chunk-44XOYWRB.js";
import {
  z
} from "/build/_shared/chunk-YTDRTWMN.js";
import {
  require_db_server
} from "/build/_shared/chunk-FSP6GK2P.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Icon
} from "/build/_shared/chunk-6IU6NOV5.js";
import {
  cn
} from "/build/_shared/chunk-BM2PTB5J.js";
import {
  Link,
  Outlet,
  useMatches
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
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/settings+/profile.tsx
var import_node = __toESM(require_node(), 1);
var import_auth_server = __toESM(require_auth_server(), 1);
var import_db_server = __toESM(require_db_server(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/settings+/profile.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/settings+/profile.tsx"
  );
  import.meta.hot.lastModified = "1706218436656.8838";
}
var BreadcrumbHandle = z.object({
  breadcrumb: z.any()
});
var handle = {
  breadcrumb: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { name: "file-text", children: "Edit Profile" }, void 0, false, {
    fileName: "app/routes/settings+/profile.tsx",
    lineNumber: 35,
    columnNumber: 15
  }, this),
  getSitemapEntries: () => null
};
var BreadcrumbHandleMatch = z.object({
  handle: BreadcrumbHandle
});
function EditUserProfile() {
  _s();
  const user = useUser();
  const matches = useMatches();
  const breadcrumbs = matches.map((m) => {
    const result = BreadcrumbHandleMatch.safeParse(m);
    if (!result.success || !result.data.handle.breadcrumb)
      return null;
    return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: m.pathname, className: "flex items-center", children: result.data.handle.breadcrumb }, m.id, false, {
      fileName: "app/routes/settings+/profile.tsx",
      lineNumber: 65,
      columnNumber: 12
    }, this);
  }).filter(Boolean);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "m-auto mb-24 mt-16 max-w-3xl", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "container", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", { className: "flex gap-3", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { className: "text-muted-foreground", to: `/users/${user.username}`, children: "Profile" }, void 0, false, {
        fileName: "app/routes/settings+/profile.tsx",
        lineNumber: 73,
        columnNumber: 7
      }, this) }, void 0, false, {
        fileName: "app/routes/settings+/profile.tsx",
        lineNumber: 72,
        columnNumber: 6
      }, this),
      breadcrumbs.map((breadcrumb, i, arr) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { className: cn("flex items-center gap-3", {
        "text-muted-foreground": i < arr.length - 1
      }), children: [
        "\u25B6\uFE0F ",
        breadcrumb
      ] }, i, true, {
        fileName: "app/routes/settings+/profile.tsx",
        lineNumber: 77,
        columnNumber: 47
      }, this))
    ] }, void 0, true, {
      fileName: "app/routes/settings+/profile.tsx",
      lineNumber: 71,
      columnNumber: 5
    }, this) }, void 0, false, {
      fileName: "app/routes/settings+/profile.tsx",
      lineNumber: 70,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Spacer, { size: "xs" }, void 0, false, {
      fileName: "app/routes/settings+/profile.tsx",
      lineNumber: 84,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", { className: "mx-auto bg-muted px-6 py-8 md:container md:rounded-3xl", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Outlet, {}, void 0, false, {
      fileName: "app/routes/settings+/profile.tsx",
      lineNumber: 86,
      columnNumber: 5
    }, this) }, void 0, false, {
      fileName: "app/routes/settings+/profile.tsx",
      lineNumber: 85,
      columnNumber: 4
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/settings+/profile.tsx",
    lineNumber: 69,
    columnNumber: 10
  }, this);
}
_s(EditUserProfile, "ekXneKo9PG5ARIKFSJ8/gAy3lOA=", false, function() {
  return [useUser, useMatches];
});
_c = EditUserProfile;
var _c;
$RefreshReg$(_c, "EditUserProfile");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  EditUserProfile as default,
  handle
};
//# sourceMappingURL=/build/routes/settings+/profile-22WVBIFT.js.map
