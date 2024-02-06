import {
  AnalysisHeader
} from "/build/_shared/chunk-NK5W27RN.js";
import {
  Checkbox
} from "/build/_shared/chunk-XCP7KESD.js";
import {
  cn
} from "/build/_shared/chunk-BM2PTB5J.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XU7DNSPJ.js";
import {
  createHotContext
} from "/build/_shared/chunk-O7QHA5CH.js";
import {
  require_react
} from "/build/_shared/chunk-BOXFZXVX.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/components/ui/table.tsx
var React = __toESM(require_react(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/ui/table.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/ui/table.tsx"
  );
  import.meta.hot.lastModified = "1706218436648.8835";
}
var Table = React.forwardRef(_c = ({
  className,
  ...props
}, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "relative w-full overflow-auto", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("table", { ref, className: cn("w-full caption-bottom text-sm", className), ...props }, void 0, false, {
  fileName: "app/components/ui/table.tsx",
  lineNumber: 27,
  columnNumber: 5
}, this) }, void 0, false, {
  fileName: "app/components/ui/table.tsx",
  lineNumber: 26,
  columnNumber: 12
}, this));
_c2 = Table;
Table.displayName = "Table";
var TableHeader = React.forwardRef(_c3 = ({
  className,
  ...props
}, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("thead", { ref, className: cn("[&_tr]:border-b", className), ...props }, void 0, false, {
  fileName: "app/components/ui/table.tsx",
  lineNumber: 34,
  columnNumber: 12
}, this));
_c4 = TableHeader;
TableHeader.displayName = "TableHeader";
var TableBody = React.forwardRef(_c5 = ({
  className,
  ...props
}, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tbody", { ref, className: cn("[&_tr:last-child]:border-0", className), ...props }, void 0, false, {
  fileName: "app/components/ui/table.tsx",
  lineNumber: 40,
  columnNumber: 12
}, this));
_c6 = TableBody;
TableBody.displayName = "TableBody";
var TableFooter = React.forwardRef(_c7 = ({
  className,
  ...props
}, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tfoot", { ref, className: cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className), ...props }, void 0, false, {
  fileName: "app/components/ui/table.tsx",
  lineNumber: 46,
  columnNumber: 12
}, this));
_c8 = TableFooter;
TableFooter.displayName = "TableFooter";
var TableRow = React.forwardRef(_c9 = ({
  className,
  ...props
}, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", { ref, className: cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className), ...props }, void 0, false, {
  fileName: "app/components/ui/table.tsx",
  lineNumber: 52,
  columnNumber: 12
}, this));
_c10 = TableRow;
TableRow.displayName = "TableRow";
var TableHead = React.forwardRef(_c11 = ({
  className,
  ...props
}, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { ref, className: cn("h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0", className), ...props }, void 0, false, {
  fileName: "app/components/ui/table.tsx",
  lineNumber: 58,
  columnNumber: 12
}, this));
_c12 = TableHead;
TableHead.displayName = "TableHead";
var TableCell = React.forwardRef(_c13 = ({
  className,
  ...props
}, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { ref, className: cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className), ...props }, void 0, false, {
  fileName: "app/components/ui/table.tsx",
  lineNumber: 64,
  columnNumber: 12
}, this));
_c14 = TableCell;
TableCell.displayName = "TableCell";
var TableCaption = React.forwardRef(_c15 = ({
  className,
  ...props
}, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("caption", { ref, className: cn("mt-4 text-sm text-muted-foreground", className), ...props }, void 0, false, {
  fileName: "app/components/ui/table.tsx",
  lineNumber: 70,
  columnNumber: 12
}, this));
_c16 = TableCaption;
TableCaption.displayName = "TableCaption";
var _c;
var _c2;
var _c3;
var _c4;
var _c5;
var _c6;
var _c7;
var _c8;
var _c9;
var _c10;
var _c11;
var _c12;
var _c13;
var _c14;
var _c15;
var _c16;
$RefreshReg$(_c, "Table$React.forwardRef");
$RefreshReg$(_c2, "Table");
$RefreshReg$(_c3, "TableHeader$React.forwardRef");
$RefreshReg$(_c4, "TableHeader");
$RefreshReg$(_c5, "TableBody$React.forwardRef");
$RefreshReg$(_c6, "TableBody");
$RefreshReg$(_c7, "TableFooter$React.forwardRef");
$RefreshReg$(_c8, "TableFooter");
$RefreshReg$(_c9, "TableRow$React.forwardRef");
$RefreshReg$(_c10, "TableRow");
$RefreshReg$(_c11, "TableHead$React.forwardRef");
$RefreshReg$(_c12, "TableHead");
$RefreshReg$(_c13, "TableCell$React.forwardRef");
$RefreshReg$(_c14, "TableCell");
$RefreshReg$(_c15, "TableCaption$React.forwardRef");
$RefreshReg$(_c16, "TableCaption");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/ui/heat/CaseSummaryComponents/EnergyUseHistoryChart.tsx
var import_jsx_dev_runtime2 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/ui/heat/CaseSummaryComponents/EnergyUseHistoryChart.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/ui/heat/CaseSummaryComponents/EnergyUseHistoryChart.tsx"
  );
  import.meta.hot.lastModified = "1706218436648.8835";
}
var months = [{
  includeData: true,
  startDate: "02/02/2018",
  endDate: "02/28/2018",
  daysInBill: "27",
  usage: "Yes",
  fUA: "10"
}, {
  includeData: true,
  startDate: "03/01/2018",
  endDate: "03/31/2018",
  daysInBill: "31",
  usage: "Modest",
  fUA: "30"
}];
function EnergyUseHistoryChart() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Table, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(TableRow, { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(TableHead, { className: "w-[100px]", children: "#" }, void 0, false, {
        fileName: "app/components/ui/heat/CaseSummaryComponents/EnergyUseHistoryChart.tsx",
        lineNumber: 42,
        columnNumber: 6
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(TableHead, { children: "Include Data" }, void 0, false, {
        fileName: "app/components/ui/heat/CaseSummaryComponents/EnergyUseHistoryChart.tsx",
        lineNumber: 43,
        columnNumber: 6
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(TableHead, { children: "Start Date" }, void 0, false, {
        fileName: "app/components/ui/heat/CaseSummaryComponents/EnergyUseHistoryChart.tsx",
        lineNumber: 44,
        columnNumber: 6
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(TableHead, { children: "End Date" }, void 0, false, {
        fileName: "app/components/ui/heat/CaseSummaryComponents/EnergyUseHistoryChart.tsx",
        lineNumber: 45,
        columnNumber: 6
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(TableHead, { children: "Days in Bill" }, void 0, false, {
        fileName: "app/components/ui/heat/CaseSummaryComponents/EnergyUseHistoryChart.tsx",
        lineNumber: 46,
        columnNumber: 6
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(TableHead, { children: "Usage (therms)" }, void 0, false, {
        fileName: "app/components/ui/heat/CaseSummaryComponents/EnergyUseHistoryChart.tsx",
        lineNumber: 47,
        columnNumber: 6
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(TableHead, { children: "60.5 \xB0F UA (BTU/h-F)" }, void 0, false, {
        fileName: "app/components/ui/heat/CaseSummaryComponents/EnergyUseHistoryChart.tsx",
        lineNumber: 48,
        columnNumber: 6
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/ui/heat/CaseSummaryComponents/EnergyUseHistoryChart.tsx",
      lineNumber: 41,
      columnNumber: 5
    }, this) }, void 0, false, {
      fileName: "app/components/ui/heat/CaseSummaryComponents/EnergyUseHistoryChart.tsx",
      lineNumber: 40,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(TableBody, { children: months.map((month, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(TableRow, { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(TableCell, { className: "font-medium", children: index + 1 }, void 0, false, {
        fileName: "app/components/ui/heat/CaseSummaryComponents/EnergyUseHistoryChart.tsx",
        lineNumber: 53,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Checkbox, { checked: month.includeData }, void 0, false, {
        fileName: "app/components/ui/heat/CaseSummaryComponents/EnergyUseHistoryChart.tsx",
        lineNumber: 55,
        columnNumber: 8
      }, this) }, void 0, false, {
        fileName: "app/components/ui/heat/CaseSummaryComponents/EnergyUseHistoryChart.tsx",
        lineNumber: 54,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(TableCell, { children: month.startDate }, void 0, false, {
        fileName: "app/components/ui/heat/CaseSummaryComponents/EnergyUseHistoryChart.tsx",
        lineNumber: 57,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(TableCell, { children: month.endDate }, void 0, false, {
        fileName: "app/components/ui/heat/CaseSummaryComponents/EnergyUseHistoryChart.tsx",
        lineNumber: 58,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(TableCell, { children: month.daysInBill }, void 0, false, {
        fileName: "app/components/ui/heat/CaseSummaryComponents/EnergyUseHistoryChart.tsx",
        lineNumber: 59,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(TableCell, { children: month.usage }, void 0, false, {
        fileName: "app/components/ui/heat/CaseSummaryComponents/EnergyUseHistoryChart.tsx",
        lineNumber: 60,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(TableCell, { children: month.fUA }, void 0, false, {
        fileName: "app/components/ui/heat/CaseSummaryComponents/EnergyUseHistoryChart.tsx",
        lineNumber: 61,
        columnNumber: 7
      }, this)
    ] }, index, true, {
      fileName: "app/components/ui/heat/CaseSummaryComponents/EnergyUseHistoryChart.tsx",
      lineNumber: 52,
      columnNumber: 35
    }, this)) }, void 0, false, {
      fileName: "app/components/ui/heat/CaseSummaryComponents/EnergyUseHistoryChart.tsx",
      lineNumber: 51,
      columnNumber: 4
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/ui/heat/CaseSummaryComponents/EnergyUseHistoryChart.tsx",
    lineNumber: 39,
    columnNumber: 10
  }, this);
}
_c17 = EnergyUseHistoryChart;
var _c17;
$RefreshReg$(_c17, "EnergyUseHistoryChart");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/ui/heat/CaseSummaryComponents/EnergyUseHistory.tsx
var import_jsx_dev_runtime3 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/ui/heat/CaseSummaryComponents/EnergyUseHistory.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/ui/heat/CaseSummaryComponents/EnergyUseHistory.tsx"
  );
  import.meta.hot.lastModified = "1706218436648.8835";
}
function EnergyUseHistory() {
  const titleClassTailwind = "text-5xl font-extrabold tracking-wide";
  const componentMargin = "mt-10";
  return /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("h2", { className: `${titleClassTailwind} ${componentMargin}`, children: "Energy Use History" }, void 0, false, {
      fileName: "app/components/ui/heat/CaseSummaryComponents/EnergyUseHistory.tsx",
      lineNumber: 27,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(AnalysisHeader, {}, void 0, false, {
      fileName: "app/components/ui/heat/CaseSummaryComponents/EnergyUseHistory.tsx",
      lineNumber: 30,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(EnergyUseHistoryChart, {}, void 0, false, {
      fileName: "app/components/ui/heat/CaseSummaryComponents/EnergyUseHistory.tsx",
      lineNumber: 31,
      columnNumber: 4
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/ui/heat/CaseSummaryComponents/EnergyUseHistory.tsx",
    lineNumber: 26,
    columnNumber: 10
  }, this);
}
_c18 = EnergyUseHistory;
var _c18;
$RefreshReg$(_c18, "EnergyUseHistory");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

export {
  EnergyUseHistory
};
//# sourceMappingURL=/build/_shared/chunk-MCV6VANT.js.map
