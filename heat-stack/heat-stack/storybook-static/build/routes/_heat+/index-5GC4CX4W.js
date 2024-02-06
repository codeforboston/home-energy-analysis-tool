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

// app/routes/_heat+/index.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/_heat+/index.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/_heat+/index.tsx"
  );
  import.meta.hot.lastModified = "1706218436652.8835";
}
function Home() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { children: "This is the Heat Home page - the first page a user will see when starting the app" }, void 0, false, {
      fileName: "app/routes/_heat+/index.tsx",
      lineNumber: 23,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("br", {}, void 0, false, {
      fileName: "app/routes/_heat+/index.tsx",
      lineNumber: 27,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", { children: [
      "Some paths with placeholder pages are:",
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "/heatloadanalysis - see an example heat load analysis" }, void 0, false, {
        fileName: "app/routes/_heat+/index.tsx",
        lineNumber: 30,
        columnNumber: 5
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "/cases - see a list of cases" }, void 0, false, {
        fileName: "app/routes/_heat+/index.tsx",
        lineNumber: 31,
        columnNumber: 5
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "/single - view as a single page app" }, void 0, false, {
        fileName: "app/routes/_heat+/index.tsx",
        lineNumber: 32,
        columnNumber: 5
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "/inputs1, /inputs2, /inputs3 - individual input screens " }, void 0, false, {
        fileName: "app/routes/_heat+/index.tsx",
        lineNumber: 33,
        columnNumber: 5
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "/epicstack - information about the Epic Stack" }, void 0, false, {
        fileName: "app/routes/_heat+/index.tsx",
        lineNumber: 34,
        columnNumber: 5
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_heat+/index.tsx",
      lineNumber: 28,
      columnNumber: 4
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/_heat+/index.tsx",
    lineNumber: 22,
    columnNumber: 10
  }, this);
}
_c = Home;
var _c;
$RefreshReg$(_c, "Home");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Home as default
};
//# sourceMappingURL=/build/routes/_heat+/index-5GC4CX4W.js.map
