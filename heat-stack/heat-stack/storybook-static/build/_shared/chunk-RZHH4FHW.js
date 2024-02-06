import {
  StatusButton
} from "/build/_shared/chunk-OO2QJRJG.js";
import {
  z
} from "/build/_shared/chunk-YTDRTWMN.js";
import {
  Icon
} from "/build/_shared/chunk-6IU6NOV5.js";
import {
  useIsPending
} from "/build/_shared/chunk-BM2PTB5J.js";
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

// app/utils/connections.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/utils/connections.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/utils/connections.tsx"
  );
  import.meta.hot.lastModified = "1706218436656.8838";
}
var GITHUB_PROVIDER_NAME = "github";
var providerNames = [GITHUB_PROVIDER_NAME];
var ProviderNameSchema = z.enum(providerNames);
var providerLabels = {
  [GITHUB_PROVIDER_NAME]: "GitHub"
};
var providerIcons = {
  [GITHUB_PROVIDER_NAME]: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { name: "github-logo" }, void 0, false, {
    fileName: "app/utils/connections.tsx",
    lineNumber: 36,
    columnNumber: 27
  }, this)
};
function ProviderConnectionForm({
  redirectTo,
  type,
  providerName
}) {
  _s();
  const label = providerLabels[providerName];
  const formAction = `/auth/${providerName}`;
  const isPending = useIsPending({
    formAction
  });
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { className: "flex items-center justify-center gap-2", action: formAction, method: "POST", children: [
    redirectTo ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "redirectTo", value: redirectTo }, void 0, false, {
      fileName: "app/utils/connections.tsx",
      lineNumber: 50,
      columnNumber: 18
    }, this) : null,
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatusButton, { type: "submit", className: "w-full", status: isPending ? "pending" : "idle", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "inline-flex items-center gap-1.5", children: [
      providerIcons[providerName],
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
        type,
        " with ",
        label
      ] }, void 0, true, {
        fileName: "app/utils/connections.tsx",
        lineNumber: 54,
        columnNumber: 6
      }, this)
    ] }, void 0, true, {
      fileName: "app/utils/connections.tsx",
      lineNumber: 52,
      columnNumber: 5
    }, this) }, void 0, false, {
      fileName: "app/utils/connections.tsx",
      lineNumber: 51,
      columnNumber: 4
    }, this)
  ] }, void 0, true, {
    fileName: "app/utils/connections.tsx",
    lineNumber: 49,
    columnNumber: 10
  }, this);
}
_s(ProviderConnectionForm, "JnlFCv26QAup6Xc6GVGrzVOlibc=", false, function() {
  return [useIsPending];
});
_c = ProviderConnectionForm;
var _c;
$RefreshReg$(_c, "ProviderConnectionForm");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

export {
  providerNames,
  providerIcons,
  ProviderConnectionForm
};
//# sourceMappingURL=/build/_shared/chunk-RZHH4FHW.js.map
