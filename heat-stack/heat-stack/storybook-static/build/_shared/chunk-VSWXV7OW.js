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

// app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx"
  );
  import.meta.hot.lastModified = "1706218436648.8835";
}
function HomeInformation() {
  const titleClassTailwind = "text-5xl font-extrabold tracking-wide";
  const subTitleClassTailwind = "text-2xl font-semibold text-zinc-950";
  const componentMargin = "mt-10";
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: `${titleClassTailwind}`, children: "Home Information" }, void 0, false, {
      fileName: "app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx",
      lineNumber: 30,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "post", action: "/homes", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: `${componentMargin}`, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h6", { className: `${subTitleClassTailwind}`, children: "Resident/Client" }, void 0, false, {
          fileName: "app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx",
          lineNumber: 34,
          columnNumber: 6
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-4 flex space-x-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { htmlFor: "firstName", children: "First Name" }, void 0, false, {
              fileName: "app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx",
              lineNumber: 38,
              columnNumber: 8
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, { name: "firstName", id: "firstName", type: "text" }, void 0, false, {
              fileName: "app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx",
              lineNumber: 39,
              columnNumber: 8
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx",
            lineNumber: 37,
            columnNumber: 7
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { htmlFor: "lastName", children: "Last Name" }, void 0, false, {
              fileName: "app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx",
              lineNumber: 42,
              columnNumber: 8
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, { name: "lastName", id: "lastName", type: "text" }, void 0, false, {
              fileName: "app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx",
              lineNumber: 43,
              columnNumber: 8
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx",
            lineNumber: 41,
            columnNumber: 7
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx",
          lineNumber: 36,
          columnNumber: 6
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx",
        lineNumber: 33,
        columnNumber: 5
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-9", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h6", { className: `${subTitleClassTailwind}`, children: "Address" }, void 0, false, {
          fileName: "app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx",
          lineNumber: 49,
          columnNumber: 6
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-4 flex space-x-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { htmlFor: "address", children: "Street address" }, void 0, false, {
            fileName: "app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx",
            lineNumber: 53,
            columnNumber: 8
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, { name: "address", id: "address", type: "text" }, void 0, false, {
            fileName: "app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx",
            lineNumber: 54,
            columnNumber: 8
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, { name: "addressTwo", id: "adressTwo", type: "text" }, void 0, false, {
            fileName: "app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx",
            lineNumber: 55,
            columnNumber: 8
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-4 flex", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { htmlFor: "city", children: "City/Town" }, void 0, false, {
                fileName: "app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx",
                lineNumber: 59,
                columnNumber: 10
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, { name: "city", id: "city", type: "text" }, void 0, false, {
                fileName: "app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx",
                lineNumber: 60,
                columnNumber: 10
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx",
              lineNumber: 58,
              columnNumber: 9
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { htmlFor: "state", children: "State" }, void 0, false, {
                fileName: "app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx",
                lineNumber: 63,
                columnNumber: 10
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, { name: "state", id: "state", type: "text" }, void 0, false, {
                fileName: "app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx",
                lineNumber: 64,
                columnNumber: 10
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx",
              lineNumber: 62,
              columnNumber: 9
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { htmlFor: "zipcode", children: "Zipcode" }, void 0, false, {
                fileName: "app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx",
                lineNumber: 67,
                columnNumber: 10
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, { name: "zipcode", id: "zipcode", type: "text" }, void 0, false, {
                fileName: "app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx",
                lineNumber: 68,
                columnNumber: 10
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx",
              lineNumber: 66,
              columnNumber: 9
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx",
            lineNumber: 57,
            columnNumber: 8
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx",
          lineNumber: 52,
          columnNumber: 7
        }, this) }, void 0, false, {
          fileName: "app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx",
          lineNumber: 51,
          columnNumber: 6
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx",
        lineNumber: 48,
        columnNumber: 5
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-9", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h6", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { className: `${subTitleClassTailwind}`, htmlFor: "livingArea", children: "Living Area (sf)" }, void 0, false, {
          fileName: "app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx",
          lineNumber: 77,
          columnNumber: 7
        }, this) }, void 0, false, {
          fileName: "app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx",
          lineNumber: 76,
          columnNumber: 6
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, { name: "livingArea", id: "livingArea", type: "number" }, void 0, false, {
            fileName: "app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx",
            lineNumber: 84,
            columnNumber: 8
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2 text-sm text-slate-500", children: "The home's above-grade, conditioned space" }, void 0, false, {
            fileName: "app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx",
            lineNumber: 85,
            columnNumber: 8
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx",
          lineNumber: 83,
          columnNumber: 7
        }, this) }, void 0, false, {
          fileName: "app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx",
          lineNumber: 82,
          columnNumber: 6
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx",
        lineNumber: 75,
        columnNumber: 5
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx",
      lineNumber: 32,
      columnNumber: 4
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx",
    lineNumber: 29,
    columnNumber: 10
  }, this);
}
_c = HomeInformation;
var _c;
$RefreshReg$(_c, "HomeInformation");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

export {
  HomeInformation
};
//# sourceMappingURL=/build/_shared/chunk-VSWXV7OW.js.map
