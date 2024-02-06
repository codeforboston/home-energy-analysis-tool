import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XU7DNSPJ.js";
import {
  createHotContext
} from "/build/_shared/chunk-O7QHA5CH.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/components/ui/heat/CaseSummaryComponents/AnalysisHeader.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/ui/heat/CaseSummaryComponents/AnalysisHeader.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/ui/heat/CaseSummaryComponents/AnalysisHeader.tsx"
  );
  import.meta.hot.lastModified = "1706218436648.8835";
}
function AnalysisHeader() {
  const averageIndoorTemperature = "63.5";
  const dailyOtherUsage = "1.07";
  const balancePoint = "60.5";
  const standardDevationUA = "5.52";
  const wholeHomeUA = "1,112";
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "section-title", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "item-group-title", children: "Analysis" }, void 0, false, {
      fileName: "app/components/ui/heat/CaseSummaryComponents/AnalysisHeader.tsx",
      lineNumber: 28,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-row", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "basis-1/3", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "item-title-small", children: [
        "Average Indoor Temperature ",
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("br", {}, void 0, false, {
          fileName: "app/components/ui/heat/CaseSummaryComponents/AnalysisHeader.tsx",
          lineNumber: 32,
          columnNumber: 34
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "item", children: [
          averageIndoorTemperature,
          " \xB0F"
        ] }, void 0, true, {
          fileName: "app/components/ui/heat/CaseSummaryComponents/AnalysisHeader.tsx",
          lineNumber: 33,
          columnNumber: 7
        }, this),
        " ",
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("br", {}, void 0, false, {
          fileName: "app/components/ui/heat/CaseSummaryComponents/AnalysisHeader.tsx",
          lineNumber: 33,
          columnNumber: 65
        }, this),
        "Balance Point Temperature (\xB0F) ",
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("br", {}, void 0, false, {
          fileName: "app/components/ui/heat/CaseSummaryComponents/AnalysisHeader.tsx",
          lineNumber: 34,
          columnNumber: 38
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "item", children: balancePoint }, void 0, false, {
          fileName: "app/components/ui/heat/CaseSummaryComponents/AnalysisHeader.tsx",
          lineNumber: 35,
          columnNumber: 7
        }, this),
        " ",
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("br", {}, void 0, false, {
          fileName: "app/components/ui/heat/CaseSummaryComponents/AnalysisHeader.tsx",
          lineNumber: 35,
          columnNumber: 50
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/ui/heat/CaseSummaryComponents/AnalysisHeader.tsx",
        lineNumber: 31,
        columnNumber: 6
      }, this) }, void 0, false, {
        fileName: "app/components/ui/heat/CaseSummaryComponents/AnalysisHeader.tsx",
        lineNumber: 30,
        columnNumber: 5
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "basis-1/3", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "item-title-small", children: [
        "Number of Periods Included ",
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("br", {}, void 0, false, {
          fileName: "app/components/ui/heat/CaseSummaryComponents/AnalysisHeader.tsx",
          lineNumber: 40,
          columnNumber: 34
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "item", children: "(to be calculated)" }, void 0, false, {
          fileName: "app/components/ui/heat/CaseSummaryComponents/AnalysisHeader.tsx",
          lineNumber: 41,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("br", {}, void 0, false, {
          fileName: "app/components/ui/heat/CaseSummaryComponents/AnalysisHeader.tsx",
          lineNumber: 42,
          columnNumber: 7
        }, this),
        "Daily non-heating Usage ",
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("br", {}, void 0, false, {
          fileName: "app/components/ui/heat/CaseSummaryComponents/AnalysisHeader.tsx",
          lineNumber: 43,
          columnNumber: 31
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "item", children: [
          dailyOtherUsage,
          " therms"
        ] }, void 0, true, {
          fileName: "app/components/ui/heat/CaseSummaryComponents/AnalysisHeader.tsx",
          lineNumber: 44,
          columnNumber: 7
        }, this),
        " "
      ] }, void 0, true, {
        fileName: "app/components/ui/heat/CaseSummaryComponents/AnalysisHeader.tsx",
        lineNumber: 39,
        columnNumber: 6
      }, this) }, void 0, false, {
        fileName: "app/components/ui/heat/CaseSummaryComponents/AnalysisHeader.tsx",
        lineNumber: 38,
        columnNumber: 5
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "basis-1/3", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "item-title-small", children: [
        "Standard Deviation of UA ",
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("br", {}, void 0, false, {
          fileName: "app/components/ui/heat/CaseSummaryComponents/AnalysisHeader.tsx",
          lineNumber: 49,
          columnNumber: 32
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "item", children: [
          standardDevationUA,
          " %"
        ] }, void 0, true, {
          fileName: "app/components/ui/heat/CaseSummaryComponents/AnalysisHeader.tsx",
          lineNumber: 50,
          columnNumber: 7
        }, this),
        " ",
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("br", {}, void 0, false, {
          fileName: "app/components/ui/heat/CaseSummaryComponents/AnalysisHeader.tsx",
          lineNumber: 50,
          columnNumber: 58
        }, this),
        "Whole-home UA",
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("br", {}, void 0, false, {
          fileName: "app/components/ui/heat/CaseSummaryComponents/AnalysisHeader.tsx",
          lineNumber: 52,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "item", children: [
          wholeHomeUA,
          " BTU/h-\xB0F"
        ] }, void 0, true, {
          fileName: "app/components/ui/heat/CaseSummaryComponents/AnalysisHeader.tsx",
          lineNumber: 53,
          columnNumber: 7
        }, this),
        " ",
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("br", {}, void 0, false, {
          fileName: "app/components/ui/heat/CaseSummaryComponents/AnalysisHeader.tsx",
          lineNumber: 53,
          columnNumber: 58
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/ui/heat/CaseSummaryComponents/AnalysisHeader.tsx",
        lineNumber: 48,
        columnNumber: 6
      }, this) }, void 0, false, {
        fileName: "app/components/ui/heat/CaseSummaryComponents/AnalysisHeader.tsx",
        lineNumber: 47,
        columnNumber: 5
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/ui/heat/CaseSummaryComponents/AnalysisHeader.tsx",
      lineNumber: 29,
      columnNumber: 4
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/ui/heat/CaseSummaryComponents/AnalysisHeader.tsx",
    lineNumber: 27,
    columnNumber: 10
  }, this);
}
_c = AnalysisHeader;
var _c;
$RefreshReg$(_c, "AnalysisHeader");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

export {
  AnalysisHeader
};
//# sourceMappingURL=/build/_shared/chunk-NK5W27RN.js.map
