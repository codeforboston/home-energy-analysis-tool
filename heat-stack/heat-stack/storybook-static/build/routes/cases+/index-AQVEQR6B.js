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

// app/routes/cases+/index.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/cases+/index.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/cases+/index.tsx"
  );
  import.meta.hot.lastModified = "1706218436656.8838";
}
function Cases() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-96 bg-slate-400 ", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { children: "Cases" }, void 0, false, {
      fileName: "app/routes/cases+/index.tsx",
      lineNumber: 23,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Case 1" }, void 0, false, {
        fileName: "app/routes/cases+/index.tsx",
        lineNumber: 25,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Case 2" }, void 0, false, {
        fileName: "app/routes/cases+/index.tsx",
        lineNumber: 26,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/cases+/index.tsx",
      lineNumber: 24,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/cases+/index.tsx",
    lineNumber: 22,
    columnNumber: 10
  }, this);
}
_c = Cases;
var _c;
$RefreshReg$(_c, "Cases");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Cases as default
};
//# sourceMappingURL=/build/routes/cases+/index-AQVEQR6B.js.map
