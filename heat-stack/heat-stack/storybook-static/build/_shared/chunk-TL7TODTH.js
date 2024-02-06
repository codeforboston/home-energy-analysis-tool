import {
  Input,
  Label
} from "/build/_shared/chunk-Q7H7MHNO.js";
import {
  Form
} from "/build/_shared/chunk-DKP5DHW6.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XU7DNSPJ.js";
import {
  createHotContext
} from "/build/_shared/chunk-O7QHA5CH.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx"
  );
  import.meta.hot.lastModified = "1706218436648.8835";
}
function CurrentHeatingSystem() {
  const titleClassTailwind = "text-5xl font-extrabold tracking-wide";
  const subTitleClassTailwind = "text-2xl font-semibold text-zinc-950";
  const componentMargin = "mt-10";
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: `${titleClassTailwind} ${componentMargin}`, children: "Existing Heating System" }, void 0, false, {
      fileName: "app/components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx",
      lineNumber: 31,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "post", action: "/current", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: `${componentMargin}`, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { htmlFor: "fuelType", children: "Fuel Type" }, void 0, false, {
          fileName: "app/components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx",
          lineNumber: 37,
          columnNumber: 6
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, { name: "fuelType", id: "fuelType", type: "text" }, void 0, false, {
          fileName: "app/components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx",
          lineNumber: 38,
          columnNumber: 6
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx",
        lineNumber: 36,
        columnNumber: 5
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-4 flex space-x-4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { htmlFor: "heatingSystemEfficiency", children: "Heating system efficiency %" }, void 0, false, {
            fileName: "app/components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx",
            lineNumber: 43,
            columnNumber: 7
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, { name: "heatingSystemEfficiency", id: "heatingSystemEfficiency", type: "text" }, void 0, false, {
            fileName: "app/components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx",
            lineNumber: 46,
            columnNumber: 7
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx",
          lineNumber: 42,
          columnNumber: 6
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { htmlFor: "designTemperatureOverride", children: "Design temperature override (\xB0F)" }, void 0, false, {
            fileName: "app/components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx",
            lineNumber: 50,
            columnNumber: 7
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, { name: "designTemperatureOverride", id: "designTemperatureOverride", type: "text" }, void 0, false, {
            fileName: "app/components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx",
            lineNumber: 53,
            columnNumber: 7
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx",
          lineNumber: 49,
          columnNumber: 6
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx",
        lineNumber: 41,
        columnNumber: 5
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-9", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h6", { className: `${subTitleClassTailwind}`, children: "Thermostat Settings" }, void 0, false, {
          fileName: "app/components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx",
          lineNumber: 58,
          columnNumber: 6
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-4 flex space-x-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "basis-1/3", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { htmlFor: "setPoint", children: "Set Point (\xB0F) " }, void 0, false, {
              fileName: "app/components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx",
              lineNumber: 62,
              columnNumber: 8
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, { name: "setPointTemperature", id: "setPointTemperature", type: "text" }, void 0, false, {
              fileName: "app/components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx",
              lineNumber: 63,
              columnNumber: 8
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx",
            lineNumber: 61,
            columnNumber: 7
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "basis-1/3", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { htmlFor: "setPoint", children: "Setback Temperature (\xB0F)" }, void 0, false, {
              fileName: "app/components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx",
              lineNumber: 67,
              columnNumber: 8
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, { name: "setBackTemperature", id: "setBackTemperature", type: "text" }, void 0, false, {
              fileName: "app/components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx",
              lineNumber: 68,
              columnNumber: 8
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx",
            lineNumber: 66,
            columnNumber: 7
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "basis-1/3", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { htmlFor: "setPoint", children: "Setback hours per day" }, void 0, false, {
              fileName: "app/components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx",
              lineNumber: 72,
              columnNumber: 8
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, { name: "setBackTime", id: "setBackTime", type: "text" }, void 0, false, {
              fileName: "app/components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx",
              lineNumber: 73,
              columnNumber: 8
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx",
            lineNumber: 71,
            columnNumber: 7
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx",
          lineNumber: 60,
          columnNumber: 6
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx",
        lineNumber: 57,
        columnNumber: 5
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx",
      lineNumber: 35,
      columnNumber: 4
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx",
    lineNumber: 30,
    columnNumber: 10
  }, this);
}
_c = CurrentHeatingSystem;
var _c;
$RefreshReg$(_c, "CurrentHeatingSystem");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

export {
  CurrentHeatingSystem
};
//# sourceMappingURL=/build/_shared/chunk-TL7TODTH.js.map
