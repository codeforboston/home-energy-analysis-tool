import {
  StatusButton
} from "/build/_shared/chunk-OO2QJRJG.js";
import {
  z
} from "/build/_shared/chunk-YTDRTWMN.js";
import {
  require_db_server
} from "/build/_shared/chunk-FSP6GK2P.js";
import {
  ErrorList
} from "/build/_shared/chunk-JXJ2XXPJ.js";
import "/build/_shared/chunk-FBSGADWS.js";
import "/build/_shared/chunk-XCP7KESD.js";
import "/build/_shared/chunk-OTYD2GEN.js";
import "/build/_shared/chunk-LJSTPQ62.js";
import {
  Input,
  Label
} from "/build/_shared/chunk-Q7H7MHNO.js";
import "/build/_shared/chunk-FNWCO3JM.js";
import "/build/_shared/chunk-J4MLKRN2.js";
import "/build/_shared/chunk-FBX33ZTZ.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  GeneralErrorBoundary
} from "/build/_shared/chunk-SUM65VYH.js";
import "/build/_shared/chunk-YYXIFXT3.js";
import {
  Icon
} from "/build/_shared/chunk-6IU6NOV5.js";
import {
  cn,
  getUserImgSrc,
  useDebounce,
  useDelayedIsPending,
  useIsPending
} from "/build/_shared/chunk-BM2PTB5J.js";
import {
  Form,
  Link,
  useLoaderData,
  useSearchParams,
  useSubmit
} from "/build/_shared/chunk-DKP5DHW6.js";
import "/build/_shared/chunk-GIAAE3CH.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XU7DNSPJ.js";
import {
  createHotContext
} from "/build/_shared/chunk-O7QHA5CH.js";
import "/build/_shared/chunk-UWV35TSL.js";
import {
  require_react
} from "/build/_shared/chunk-BOXFZXVX.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/users+/index.tsx
var import_node = __toESM(require_node(), 1);

// app/components/search-bar.tsx
var import_react2 = __toESM(require_react(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/search-bar.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/search-bar.tsx"
  );
  import.meta.hot.lastModified = "1706218436648.8835";
}
function SearchBar({
  status,
  autoFocus = false,
  autoSubmit = false
}) {
  _s();
  const id = (0, import_react2.useId)();
  const [searchParams] = useSearchParams();
  const submit = useSubmit();
  const isSubmitting = useIsPending({
    formMethod: "GET",
    formAction: "/users"
  });
  const handleFormChange = useDebounce((form) => {
    submit(form);
  }, 400);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "GET", action: "/users", className: "flex flex-wrap items-center justify-center gap-2", onChange: (e) => autoSubmit && handleFormChange(e.currentTarget), children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex-1", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { htmlFor: id, className: "sr-only", children: "Search" }, void 0, false, {
        fileName: "app/components/search-bar.tsx",
        lineNumber: 47,
        columnNumber: 5
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, { type: "search", name: "search", id, defaultValue: searchParams.get("search") ?? "", placeholder: "Search", className: "w-full", autoFocus }, void 0, false, {
        fileName: "app/components/search-bar.tsx",
        lineNumber: 50,
        columnNumber: 5
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/search-bar.tsx",
      lineNumber: 46,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatusButton, { type: "submit", status: isSubmitting ? "pending" : status, className: "flex w-full items-center justify-center", size: "sm", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { name: "magnifying-glass", size: "sm" }, void 0, false, {
        fileName: "app/components/search-bar.tsx",
        lineNumber: 54,
        columnNumber: 6
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "sr-only", children: "Search" }, void 0, false, {
        fileName: "app/components/search-bar.tsx",
        lineNumber: 55,
        columnNumber: 6
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/search-bar.tsx",
      lineNumber: 53,
      columnNumber: 5
    }, this) }, void 0, false, {
      fileName: "app/components/search-bar.tsx",
      lineNumber: 52,
      columnNumber: 4
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/search-bar.tsx",
    lineNumber: 45,
    columnNumber: 10
  }, this);
}
_s(SearchBar, "67w/u/H51SOczxnmNINjhY9bY4o=", false, function() {
  return [import_react2.useId, useSearchParams, useSubmit, useIsPending, useDebounce];
});
_c = SearchBar;
var _c;
$RefreshReg$(_c, "SearchBar");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/routes/users+/index.tsx
var import_db_server = __toESM(require_db_server(), 1);
var import_jsx_dev_runtime2 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/users+/index.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s2 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/users+/index.tsx"
  );
  import.meta.hot.lastModified = "1706218436656.8838";
}
var UserSearchResultSchema = z.object({
  id: z.string(),
  username: z.string(),
  name: z.string().nullable(),
  imageId: z.string().nullable()
});
var UserSearchResultsSchema = z.array(UserSearchResultSchema);
_c2 = UserSearchResultsSchema;
function UsersRoute() {
  _s2();
  const data = useLoaderData();
  const isPending = useDelayedIsPending({
    formMethod: "GET",
    formAction: "/users"
  });
  if (data.status === "error") {
    console.error(data.error);
  }
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "container mb-48 mt-36 flex flex-col items-center justify-center gap-6", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("h1", { className: "text-h1", children: "Epic Notes Users" }, void 0, false, {
      fileName: "app/routes/users+/index.tsx",
      lineNumber: 86,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "w-full max-w-[700px] ", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(SearchBar, { status: data.status, autoFocus: true, autoSubmit: true }, void 0, false, {
      fileName: "app/routes/users+/index.tsx",
      lineNumber: 88,
      columnNumber: 5
    }, this) }, void 0, false, {
      fileName: "app/routes/users+/index.tsx",
      lineNumber: 87,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("main", { children: data.status === "idle" ? data.users.length ? /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("ul", { className: cn("flex w-full flex-wrap items-center justify-center gap-4 delay-200", {
      "opacity-50": isPending
    }), children: data.users.map((user) => /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Link, { to: user.username, className: "flex h-36 w-44 flex-col items-center justify-center rounded-lg bg-muted px-5 py-3", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("img", { alt: user.name ?? user.username, src: getUserImgSrc(user.imageId), className: "h-16 w-16 rounded-full" }, void 0, false, {
        fileName: "app/routes/users+/index.tsx",
        lineNumber: 96,
        columnNumber: 11
      }, this),
      user.name ? /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("span", { className: "w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-body-md", children: user.name }, void 0, false, {
        fileName: "app/routes/users+/index.tsx",
        lineNumber: 97,
        columnNumber: 24
      }, this) : null,
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("span", { className: "w-full overflow-hidden text-ellipsis text-center text-body-sm text-muted-foreground", children: user.username }, void 0, false, {
        fileName: "app/routes/users+/index.tsx",
        lineNumber: 100,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/users+/index.tsx",
      lineNumber: 95,
      columnNumber: 10
    }, this) }, user.id, false, {
      fileName: "app/routes/users+/index.tsx",
      lineNumber: 94,
      columnNumber: 32
    }, this)) }, void 0, false, {
      fileName: "app/routes/users+/index.tsx",
      lineNumber: 91,
      columnNumber: 51
    }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("p", { children: "No users found" }, void 0, false, {
      fileName: "app/routes/users+/index.tsx",
      lineNumber: 105,
      columnNumber: 15
    }, this) : data.status === "error" ? /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(ErrorList, { errors: ["There was an error parsing the results"] }, void 0, false, {
      fileName: "app/routes/users+/index.tsx",
      lineNumber: 105,
      columnNumber: 65
    }, this) : null }, void 0, false, {
      fileName: "app/routes/users+/index.tsx",
      lineNumber: 90,
      columnNumber: 4
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/users+/index.tsx",
    lineNumber: 85,
    columnNumber: 10
  }, this);
}
_s2(UsersRoute, "X4KRWZR4FN6itrOq+aVkJ8n94s8=", false, function() {
  return [useLoaderData, useDelayedIsPending];
});
_c22 = UsersRoute;
function ErrorBoundary() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(GeneralErrorBoundary, {}, void 0, false, {
    fileName: "app/routes/users+/index.tsx",
    lineNumber: 114,
    columnNumber: 10
  }, this);
}
_c3 = ErrorBoundary;
var _c2;
var _c22;
var _c3;
$RefreshReg$(_c2, "UserSearchResultsSchema");
$RefreshReg$(_c22, "UsersRoute");
$RefreshReg$(_c3, "ErrorBoundary");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  UsersRoute as default
};
//# sourceMappingURL=/build/routes/users+/index-IX3QW63R.js.map
